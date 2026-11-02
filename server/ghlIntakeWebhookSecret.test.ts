import { describe, expect, it } from "vitest";
import "dotenv/config";

describe.skipIf(process.env.VALIDATE_GHL_INTAKE_SECRET !== "yes")("GHL server-side secret", () => {
  it("uses a private HTTPS webhook URL and reaches its endpoint without emitting an event", async () => {
    const raw = process.env.GHL_INTAKE_WEBHOOK_URL ?? "";
    let endpoint: URL | undefined;
    try { endpoint = new URL(raw); } catch { /* Do not print the secret. */ }
    expect(Boolean(endpoint && endpoint.protocol === "https:" && !endpoint.username && !endpoint.password)).toBe(true);
    let status = 0;
    try {
      const response = await fetch(raw, { method: "OPTIONS", redirect: "manual", signal: AbortSignal.timeout(10_000) });
      status = response.status;
      await response.body?.cancel();
    } catch { /* Network errors must not reveal the capability URL. */ }
    expect(status >= 200 && status < 500 && status !== 401 && status !== 403).toBe(true);
    console.info(`[GHL secret validation] OPTIONS status ${status}; no event POST sent.`);
  }, 15_000);
});
