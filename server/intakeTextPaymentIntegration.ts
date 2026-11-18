import { createHmac } from "node:crypto";
import type { Request } from "express";
import { z } from "zod";
import { ENV } from "./_core/env";
import { validateIntakeDraft, validateWebsiteCareSmsConsent } from "./intakeSubmissionContract";
import { validateIntakeSigning } from "./intakeSigningInput";
import {
  createIntakeTextPaymentService, getIntakeTextPaymentConfig,
  type TextIntakeValidatedInput, type TextIntakeFinalizeRecord,
  type TextIntakePaymentService, type TextIntakeVerifiedPayment,
} from "./intakeTextPaymentService";

export const TEXT_PAYMENT_ORIGINS = [
  "https://medmethoddirect.com", "https://www.medmethoddirect.com",
  "https://medmethod-kywclyds.manus.space",
  "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer",
] as const;
export type TextPaymentInput = TextIntakeValidatedInput & {
  intake: ReturnType<typeof validateIntakeDraft>;
  signing: Awaited<ReturnType<typeof validateIntakeSigning>>["signing"];
  public_origin: string;
  validated_at: number;
};
const requestSchema = z.object({
  intake: z.unknown(), signing: z.unknown(), demo_mode: z.boolean().optional(),
  video_visit_interest: z.literal(false),
}).strict();
export function textPaymentOrigin(req: Request): string {
  const raw = req.headers.origin;
  if (typeof raw !== "string" || !TEXT_PAYMENT_ORIGINS.includes(raw as typeof TEXT_PAYMENT_ORIGINS[number])) {
    if (process.env.NODE_ENV !== "production" && (raw === "http://localhost:3000" || raw === "http://127.0.0.1:3000")) return raw;
    throw new Error("This payment request is unavailable.");
  }
  if (req.headers["sec-fetch-site"] && req.headers["sec-fetch-site"] !== "same-origin") throw new Error("This payment request is unavailable.");
  return raw;
}
export async function validateTextPaymentInput(raw: unknown): Promise<TextPaymentInput> {
  const envelope = z.object({ body: requestSchema, public_origin: z.string() }).strict().parse(raw);
  if (!TEXT_PAYMENT_ORIGINS.includes(envelope.public_origin as typeof TEXT_PAYMENT_ORIGINS[number]) &&
      !(process.env.NODE_ENV !== "production" && /^http:\/\/(?:localhost|127\.0\.0\.1):3000$/.test(envelope.public_origin))) throw new Error("This payment request is unavailable.");
  const draft = validateIntakeDraft(envelope.body.intake);
  validateWebsiteCareSmsConsent(draft);
  const { signing } = await validateIntakeSigning(envelope.body.signing, draft);
  const config = await getIntakeTextPaymentConfig();
  if (config.mode === "live" && (draft.is_test || envelope.body.demo_mode)) throw new Error("Demo intakes require Sandbox checkout.");
  // Browser test flags never turn a live capture into an uncharged submission.
  const isTest = config.mode === "sandbox";
  return { submission_id: draft.submission_id, intake: { ...draft, is_test: isTest }, signing,
    resume_answers: {}, is_test: isTest, public_origin: envelope.public_origin, validated_at: Date.now() };
}

let service: TextIntakePaymentService<TextPaymentInput> | undefined;
export type PaidDelivery = (input: TextPaymentInput, payment: TextIntakeVerifiedPayment, idempotencyKey: string, signal: AbortSignal) => Promise<Record<string, unknown>>;
export function installIntakeTextPayment(delivery: PaidDelivery) {
  service = createIntakeTextPaymentService<TextPaymentInput>({
    validate: validateTextPaymentInput,
    allowedResumeOrigins: TEXT_PAYMENT_ORIGINS,
    finalize: record => delivery(record.input, record.payment, record.deliveryIdempotencyKey, record.signal),
    async finalizeSandbox(record: TextIntakeFinalizeRecord<TextPaymentInput>) {
      const receipt = { submission_id: record.input.submission_id, submitted_at: record.input.intake.submitted_at,
        is_test: true, sms_opt_in: true, video_visit_interest: false };
      const tokenBody = Buffer.from(JSON.stringify({ ...receipt, version: 1,
        purpose: "completed_free_intake", expires_at: Date.now() + 30 * 60_000 })).toString("base64url");
      const token = `${tokenBody}.${createHmac("sha256", ENV.cookieSecret).update(tokenBody).digest("base64url")}`;
      // NO clinical delivery, contact storage, GHL event, or SMS in Sandbox.
      return { ...receipt, submission_token: token, redirect_url: "/intake/thank-you/?prefill=demo" };
    },
    async sendUnpaid(payload, idempotencyKey, signal) {
      const raw = ENV.ghlIntakeWebhookUrl;
      if (!raw) return false;
      const endpoint = new URL(raw);
      if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.hash) return false;
      // Exact contact-only projection; never include answers, DOB, documents, order IDs or signatures.
      const body = { event: "intake_unpaid", first_name: payload.first_name, last_name: payload.last_name,
        email: payload.email, phone: payload.phone, state: payload.state, sms_opt_in: payload.sms_opt_in,
        source: "website_intake", tags: "intake-unpaid", is_test: payload.is_test, resume_url: payload.resume_url };
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(body), redirect: "error", signal });
      try { void response.body?.cancel().catch(() => {}); } catch { /* No response-body logging. */ }
      return response.ok;
    },
    log(code, amount) { console.info(`[TextIntakePayment] ${code}${amount ? ` amount=${amount} currency=USD` : ""}`); },
  });
  return service;
}
export function getIntakeTextPaymentService() {
  if (!service) throw new Error("Secure payment is temporarily unavailable.");
  return service;
}
