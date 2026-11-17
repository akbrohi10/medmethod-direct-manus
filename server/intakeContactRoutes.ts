import { createHash } from "node:crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getIntakeContactService, IntakeContactError } from "./intakeContactService";

const confirmationSchema = z.object({ submission_token: z.string().min(16).max(4096) }).strict();
const correctionSchema = confirmationSchema.extend({
  new_phone: z.string().min(10).max(40), request_id: z.string().uuid(), expected_revision: z.number().int().nonnegative(),
}).strict();

/** Browser capability in POST JSON only; no cookie, query token, URL contact, or storage fallback. */
export function intakeContactSameOrigin(req: Request): boolean {
  if (Object.keys(req.query ?? {}).length) return false;
  const origin = req.headers.origin, host = req.headers.host;
  if (typeof origin !== "string" || typeof host !== "string" || req.headers["x-mmd-intake-contact"] !== "1") return false;
  if (req.headers["sec-fetch-site"] && req.headers["sec-fetch-site"] !== "same-origin") return false;
  const contentType = req.headers["content-type"];
  if (typeof contentType !== "string" || !/^application\/json(?:\s*;|$)/i.test(contentType)) return false;
  try {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || parsed.host !== host || parsed.username || parsed.password) return false;
    if (parsed.protocol === "http:" && process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)) return true;
    if (parsed.protocol !== "https:") return false;
    const configured = [process.env.INTAKE_PUBLIC_ORIGIN, process.env.PUBLIC_ORIGIN, process.env.APP_URL].filter(Boolean);
    return ["www.medmethoddirect.com", "medmethoddirect.com"].includes(parsed.hostname)
      || configured.includes(origin) || /\.(?:manus\.space|manus\.computer)$/.test(parsed.hostname);
  } catch { return false; }
}

function noStore(res: Response) {
  for (const [name, value] of Object.entries({
    "Cache-Control": "no-store, private, max-age=0", Pragma: "no-cache", Expires: "0",
    "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow, noarchive", "Referrer-Policy": "no-referrer",
  })) res.setHeader(name, value);
}
function fail(res: Response, error: unknown) {
  const safe = error instanceof IntakeContactError ? error : new IntakeContactError(503,
    "Phone details are temporarily unavailable. Please try again or call our Care Team at (888) 362-7011.");
  return res.status(safe.status).json({ error: safe.message });
}
export function registerIntakeContactRoutes(app: Express, service = getIntakeContactService()): void {
  // Finite startup recovery only. No scheduling/timer configuration or activation.
  service.kick();
  const sources = new Map<string, { start: number; count: number }>();
  function rateAllowed(req: Request): boolean {
    const now = Date.now();
    for (const [key, row] of Array.from(sources.entries())) if (now - row.start >= 60_000) sources.delete(key);
    // Express's configured trust-proxy policy owns req.ip; never use untrusted forwarded headers.
    const source = createHash("sha256").update(req.ip || req.socket?.remoteAddress || "unknown").digest("hex");
    let row = sources.get(source);
    if (!row) {
      if (sources.size >= 2000) return false;
      row = { start: now, count: 0 }; sources.set(source, row);
    }
    return ++row.count <= 120;
  }
  app.post("/api/intake/confirmation", async (req: Request, res: Response) => {
    noStore(res);
    if (!rateAllowed(req)) return res.status(429).json({ error: "Please wait a minute before trying again." });
    if (!intakeContactSameOrigin(req)) return res.status(403).json({ error: "This request must come from the intake page." });
    const parsed = confirmationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "A completed intake receipt is required." });
    try { return res.json(await service.confirmation(parsed.data.submission_token)); }
    catch (error) { return fail(res, error); } // Never pass a PHI/capability error into generic request logging.
  });
  app.post("/api/intake/phone/correct", async (req: Request, res: Response) => {
    noStore(res);
    if (!rateAllowed(req)) return res.status(429).json({ error: "Please wait a minute before trying again." });
    if (!intakeContactSameOrigin(req)) return res.status(403).json({ error: "This request must come from the intake page." });
    const parsed = correctionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "A valid US mobile phone number and correction request are required." });
    try {
      const result = await service.correct(parsed.data.submission_token, parsed.data.new_phone, parsed.data.request_id, parsed.data.expected_revision);
      return res.status(result.status === "pending" ? 202 : result.status === "failed" ? 502 : 200).json(result);
    } catch (error) { return fail(res, error); }
  });
}
