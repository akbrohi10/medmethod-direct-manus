import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getIntakeDeliverySettings, getPaypalSettings } from "./db";
import { decryptIntakeCredential } from "./intakeCredentialCrypto";
import { ENV } from "./_core/env";
import { registerIntakePhoneVerificationRoutes, validPhoneVerificationToken, getPhoneVerificationSettings } from "./intakePhoneVerification";
import { validateIntakeDraft, finalizePaidIntake, finalizeWaivedIntake, type IntakeDraft, type PhoneAttestation, type VerifiedIntakePayment } from "./intakeSubmissionContract";

const INTAKE_AMOUNT = "49.00";
const TOKEN_TTL_MS = 30 * 60 * 1000;
const PENDING_TTL_MS = 60 * 60 * 1000;
const DELIVERY_TIMEOUT_MS = 15_000;
const MAX_INTAKE_BYTES = 180_000;
const MAX_PENDING = 2000;
type PayPalMode = "sandbox" | "live";
type ApprovalToken = { version: 1; submissionId: string; orderId: string; mode: PayPalMode; expiresAt: number };
const submissionSchema = z.object({
  intake: z.record(z.string(), z.unknown()),
  phone_verification_token: z.string().max(2048).nullable().optional(),
  payment_method: z.enum(["card", "apple_pay"]).optional(),
  demo_mode: z.boolean().optional(),
});
const couponCodeSchema = z.object({ coupon_code: z.string().trim().min(1).max(64) });
const waivedSubmissionSchema = submissionSchema.extend({ coupon_code: z.string().trim().min(1).max(64) });

export function isFamilyIntakeCoupon(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const expected = ENV.intakeFamilyCouponCode.trim().toLocaleLowerCase("en-US");
  const received = value.trim().toLocaleLowerCase("en-US");
  if (!expected) return false;
  const a = Buffer.from(expected, "utf8"), b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
function getPayPalBaseUrl(mode: PayPalMode): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}
function paymentMode(settings: Awaited<ReturnType<typeof getPaypalSettings>>): PayPalMode {
  return settings?.mode === "live" ? "live" : "sandbox";
}
function paymentModeForRequest(settings: Awaited<ReturnType<typeof getPaypalSettings>>, request: Request): PayPalMode {
  return request.query.prefill === "demo" || request.body?.demo_mode === true ? "sandbox" : paymentMode(settings);
}
function requireActivePayPal(settings: Awaited<ReturnType<typeof getPaypalSettings>>) {
  if (!settings || settings.activeProvider !== "paypal") throw new Error("PayPal is not the enabled payment provider. An administrator must enable PayPal in Admin Settings before the intake can collect the $49.00 consultation fee.");
}
async function getPayPalClient(mode: PayPalMode) {
  const settings = await getPaypalSettings();
  if (!settings) throw new Error("PayPal is not configured.");
  const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
  const clientSecret = mode === "live" ? settings.liveClientSecret : settings.sandboxClientSecret;
  if (!clientId || !clientSecret) throw new Error(`PayPal ${mode} credentials are not configured.`);
  const response = await fetch(`${getPayPalBaseUrl(mode)}/v1/oauth2/token`, {
    method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("PayPal authentication could not be completed.");
  const token = await response.json() as { access_token?: string };
  if (!token.access_token) throw new Error("PayPal did not return an access token.");
  return { baseUrl: getPayPalBaseUrl(mode), token: token.access_token };
}
function tokenSecret() { if (!ENV.cookieSecret) throw new Error("Payment approval token signing is not configured."); return ENV.cookieSecret; }
function encodeApprovalToken(payload: ApprovalToken): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${createHmac("sha256", tokenSecret()).update(encoded).digest("base64url")}`;
}
function decodeApprovalToken(value: unknown): ApprovalToken {
  if (typeof value !== "string") throw new Error("Payment approval token is missing.");
  const parts = value.split(".");
  if (parts.length !== 2) throw new Error("Payment approval token is invalid.");
  const [encoded, signature] = parts;
  const expected = Buffer.from(createHmac("sha256", tokenSecret()).update(encoded).digest("base64url"));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error("Payment approval token is invalid.");
  let data: unknown;
  try { data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); } catch { throw new Error("Payment approval token is invalid."); }
  const parsed = z.object({ version: z.literal(1), submissionId: z.string().uuid(), orderId: z.string().min(3).max(128), mode: z.enum(["sandbox", "live"]), expiresAt: z.number().int().positive() }).safeParse(data);
  if (!parsed.success || parsed.data.expiresAt < Date.now()) throw new Error("Payment approval token has expired. Please start payment again.");
  return parsed.data;
}
function phoneAttestation(draft: IntakeDraft, token: unknown, demo: boolean): PhoneAttestation {
  if (demo) return { phone_verified: false, phone_verified_at: null };
  const verified = validPhoneVerificationToken(token, draft.patient.phone);
  const settings = getPhoneVerificationSettings();
  if (verified && (settings.mode !== "live" || verified.mode === "live")) return { phone_verified: true, phone_verified_at: verified.verifiedAt };
  if (settings.required) throw new Error("Please verify your mobile number before continuing. If your code expired, request a new code.");
  return { phone_verified: false, phone_verified_at: null };
}
async function deliverIntake(payload: Record<string, unknown>) {
  // Keep the existing secret-first URL, encrypted fallback, and exact headers.
  let endpoint = ENV.keragonWebhookUrl.trim();
  if (!endpoint) {
    const settings = await getIntakeDeliverySettings();
    if (settings?.keragonWebhookUrlEncrypted) endpoint = decryptIntakeCredential(settings.keragonWebhookUrlEncrypted);
  }
  if (!endpoint) throw new Error("KERAGON_WEBHOOK_URL is not configured. An administrator must set the project secret or Intake Delivery setting before this intake can be submitted.");
  const body = JSON.stringify(payload);
  if (Buffer.byteLength(body, "utf8") > MAX_INTAKE_BYTES) throw new Error("This intake is too large to send securely. Please shorten any free-text answers and try again.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body, signal: controller.signal });
    if (!response.ok) throw new Error("Your payment or waiver was confirmed, but the intake could not be delivered. Please retry completion; do not make another payment.");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("Intake delivery is awaiting confirmation. Please retry completion; do not make another payment.");
    throw new Error(error instanceof Error && error.message.startsWith("Your payment") ? error.message : "The intake could not be delivered. Please retry completion; do not make another payment.");
  } finally { clearTimeout(timeout); }
}
function errorMessage(error: unknown) {
  // Do not serialize provider response bodies, card data, patient data, or tokens.
  return error instanceof Error && !/fetch failed|network|ECONN|UND_ERR/i.test(error.message) ? error.message : "Unable to process the intake payment. Please try again.";
}
type OrderResult = { order_id: string; approval_url: string; approval_token: string; environment: PayPalMode; payment_method: "card" | "apple_pay" };
type Completion = { submission_id: string; payment_status: "COMPLETED"; capture_id: string; environment: PayPalMode };
type Pending = {
  fingerprint: string; expiresAt: number; draft?: IntakeDraft; phone?: PhoneAttestation;
  mode: PayPalMode; order?: OrderResult; payment?: VerifiedIntakePayment;
  deliveryPayload?: Record<string, unknown>; webhookDelivered: boolean; completion?: Completion;
};
type WaivedPending = { fingerprint: string; expiresAt: number; payload?: Record<string, unknown>; webhookDelivered: boolean };

export function registerIntakePaymentRoutes(app: Express) {
  registerIntakePhoneVerificationRoutes(app);
  // Same in-memory boundary as the handoff: no patient/intake database or disk storage.
  const pendingPayments = new Map<string, Pending>();
  const pendingWaivers = new Map<string, WaivedPending>();
  const creatingOrders = new Map<string, Promise<OrderResult>>();
  const pendingPaymentCompletions = new Map<string, Promise<Completion>>();
  const waiverCompletions = new Map<string, Promise<void>>();
  function cleanup() {
    for (const [id, record] of Array.from(pendingPayments.entries())) if (record.expiresAt <= Date.now() && !creatingOrders.has(id) && !(record.order && pendingPaymentCompletions.has(record.order.order_id))) pendingPayments.delete(id);
    for (const [id, record] of Array.from(pendingWaivers.entries())) if (record.expiresAt <= Date.now() && !waiverCompletions.has(id)) pendingWaivers.delete(id);
  }
  const fingerprint = (draft: IntakeDraft, extra: unknown) => createHash("sha256").update(JSON.stringify({ draft, extra })).digest("hex");
  async function createOrder(draft: IntakeDraft, phone: PhoneAttestation, mode: PayPalMode, paymentMethod: "card" | "apple_pay") {
    cleanup();
    const id = draft.submission_id, hash = fingerprint(draft, { mode, paymentMethod });
    if (pendingWaivers.has(id)) throw new Error("This submission already has a waiver. Please finish the existing intake.");
    let record = pendingPayments.get(id);
    if (record && record.fingerprint !== hash) throw new Error("This submission already has a different checkout. Please finish the existing payment before changing the form.");
    if (record?.order) return record.order;
    const existing = creatingOrders.get(id); if (existing) return existing;
    if (!record && pendingPayments.size + pendingWaivers.size >= MAX_PENDING) throw new Error("The intake service is busy. Please try again shortly.");
    record ??= { fingerprint: hash, expiresAt: Date.now() + PENDING_TTL_MS, draft, phone, mode, webhookDelivered: false };
    pendingPayments.set(id, record);
    const pending = record;
    const promise = (async () => {
      const client = await getPayPalClient(mode);
      const response = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST", headers: { Authorization: `Bearer ${client.token}`, "Content-Type": "application/json", "PayPal-Request-Id": `mmd-intake-${id}`, Prefer: "return=representation" },
        body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: INTAKE_AMOUNT }, description: "MedMethod Direct — $49 intake consultation", custom_id: id }],
          ...(paymentMethod === "card" ? { payment_source: { card: { attributes: { verification: { method: "SCA_WHEN_REQUIRED" } } } } } : {}) }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("PayPal could not prepare the $49.00 card payment. Your card has not been charged.");
      const order = await response.json() as { id?: string; links?: Array<{ rel?: string; href?: string }> };
      if (!order.id) throw new Error("PayPal did not return a payment order. Your card has not been charged.");
      pending.order = { order_id: order.id, approval_url: order.links?.find(link => link.rel === "approve")?.href ?? "", approval_token: encodeApprovalToken({ version: 1, submissionId: id, orderId: order.id, mode, expiresAt: Date.now() + TOKEN_TTL_MS }), environment: mode, payment_method: paymentMethod };
      return pending.order;
    })();
    creatingOrders.set(id, promise);
    try { return await promise; } finally { creatingOrders.delete(id); }
  }
  function verifyCapture(raw: unknown, approval: ApprovalToken): VerifiedIntakePayment {
    const order = raw as { id?: string; status?: string; purchase_units?: Array<{ custom_id?: string; amount?: { value?: string; currency_code?: string }; payments?: { captures?: Array<{ id?: string; status?: string; custom_id?: string; amount?: { value?: string; currency_code?: string }; create_time?: string }> } }> };
    const units = order.purchase_units;
    const unit = units?.[0], captures = unit?.payments?.captures, capture = captures?.[0];
    if (order.id !== approval.orderId || order.status !== "COMPLETED" || units?.length !== 1 || captures?.length !== 1 || !capture?.id || capture.status !== "COMPLETED" || capture.amount?.value !== INTAKE_AMOUNT || capture.amount.currency_code !== "USD" || (unit?.custom_id ?? capture.custom_id) !== approval.submissionId || !capture.create_time || !Number.isFinite(Date.parse(capture.create_time))) {
      throw new Error("PayPal payment confirmation did not match this $49.00 USD intake. Please contact the Care Team; do not make another payment.");
    }
    return { provider: "paypal", environment: approval.mode, status: "COMPLETED", order_id: approval.orderId, capture_id: capture.id, amount: INTAKE_AMOUNT, currency: "USD", captured_at: capture.create_time };
  }
  async function finishPendingPayment(approval: ApprovalToken): Promise<Completion> {
    cleanup();
    const record = pendingPayments.get(approval.submissionId);
    if (!record || record.order?.order_id !== approval.orderId || record.mode !== approval.mode) throw new Error("This checkout session is no longer available. Contact the Care Team if payment was completed; do not pay again.");
    if (record.completion && record.webhookDelivered) return record.completion;
    const existing = pendingPaymentCompletions.get(approval.orderId); if (existing) return existing;
    const promise = (async () => {
      if (!record.payment) {
        const client = await getPayPalClient(approval.mode);
        const url = `${client.baseUrl}/v2/checkout/orders/${encodeURIComponent(approval.orderId)}`;
        const details = await fetch(url, { headers: { Authorization: `Bearer ${client.token}`, Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
        if (!details.ok) throw new Error("PayPal could not check the payment status. Please retry completion; do not pay again.");
        let raw = await details.json() as { id?: string; status?: string; purchase_units?: Array<{ custom_id?: string; amount?: { value?: string; currency_code?: string } }> };
        if (raw.status !== "COMPLETED") {
          const unit = raw.purchase_units?.[0];
          if (raw.id !== approval.orderId || raw.status !== "APPROVED" || raw.purchase_units?.length !== 1 || unit?.custom_id !== approval.submissionId || unit.amount?.value !== INTAKE_AMOUNT || unit.amount.currency_code !== "USD") throw new Error("PayPal has not approved the matching $49.00 USD intake order. Please complete payment approval first.");
          const capture = await fetch(`${url}/capture`, { method: "POST", headers: { Authorization: `Bearer ${client.token}`, "Content-Type": "application/json", "PayPal-Request-Id": `mmd-intake-capture-${approval.orderId}` }, signal: AbortSignal.timeout(20000) });
          if (!capture.ok) throw new Error("PayPal could not confirm the card payment. Please retry completion; do not make another payment.");
          raw = await capture.json() as { status?: string };
        }
        record.payment = verifyCapture(raw, approval);
      }
      if (!record.draft || !record.phone) throw new Error("The intake checkout data is no longer available. Please contact the Care Team.");
      record.deliveryPayload ??= finalizePaidIntake(record.draft, record.phone, record.payment);
      if (!record.webhookDelivered) { await deliverIntake(record.deliveryPayload); record.webhookDelivered = true; }
      record.completion = { submission_id: approval.submissionId, payment_status: "COMPLETED", capture_id: record.payment.capture_id, environment: approval.mode };
      // Clear clinical/contact data after successful relay; retain only completion metadata.
      delete record.draft; delete record.phone; delete record.deliveryPayload;
      return record.completion;
    })();
    pendingPaymentCompletions.set(approval.orderId, promise);
    try { return await promise; } finally { pendingPaymentCompletions.delete(approval.orderId); }
  }
  app.post("/api/intake/coupon/validate", (req: Request, res: Response) => {
    const parsed = couponCodeSchema.safeParse(req.body);
    if (!parsed.success || !isFamilyIntakeCoupon(parsed.data.coupon_code)) return res.status(422).json({ valid: false, error: "That coupon code is not valid." });
    res.setHeader("Cache-Control", "no-store"); return res.json({ valid: true, amount: "0.00", status: "waived" });
  });
  app.post("/api/intake/coupon/submit", async (req: Request, res: Response) => {
    try {
      cleanup();
      const parsed = waivedSubmissionSchema.safeParse(req.body);
      if (!parsed.success || !isFamilyIntakeCoupon(parsed.success ? parsed.data.coupon_code : undefined)) return res.status(422).json({ error: "That coupon code is not valid." });
      const draft = validateIntakeDraft(parsed.data.intake), id = draft.submission_id;
      if (pendingPayments.has(id)) throw new Error("This submission already has a PayPal checkout. Please finish that checkout before applying a waiver.");
      const hash = fingerprint(draft, "waived_family");
      let record = pendingWaivers.get(id);
      if (record && record.fingerprint !== hash) throw new Error("This submission already has a different waived intake.");
      if (!record) {
        if (pendingPayments.size + pendingWaivers.size >= MAX_PENDING) throw new Error("The intake service is busy. Please try again shortly.");
        const demo = parsed.data.demo_mode === true || req.query.prefill === "demo";
        const phoneSettings = getPhoneVerificationSettings();
        const demoBypass = demo && phoneSettings.mode === "sandbox" && phoneSettings.demo_available === true;
        const phone = phoneAttestation(draft, parsed.data.phone_verification_token, demoBypass);
        record = { fingerprint: hash, expiresAt: Date.now() + PENDING_TTL_MS, payload: finalizeWaivedIntake({ ...draft, is_test: draft.is_test || demo }, phone), webhookDelivered: false };
        pendingWaivers.set(id, record);
      }
      if (!record.webhookDelivered) {
        let promise = waiverCompletions.get(id);
        if (!promise) {
          const pending = record;
          promise = (async () => { await deliverIntake(pending.payload!); pending.webhookDelivered = true; delete pending.payload; })();
          waiverCompletions.set(id, promise);
        }
        try { await promise; } finally { waiverCompletions.delete(id); }
      }
      return res.status(201).json({ submission_id: id, payment_status: "WAIVED", amount: "0.00" });
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.get("/api/paypal/client-token", async (_req: Request, res: Response) => {
    try {
      const settings = await getPaypalSettings(); requireActivePayPal(settings);
      if (!settings) throw new Error("PayPal is not configured.");
      const mode = paymentModeForRequest(settings, _req);
      const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
      if (!clientId) throw new Error(`PayPal ${mode} Client ID is not configured.`);
      res.setHeader("Cache-Control", "no-store"); res.json({ client_id: clientId, environment: mode });
    } catch (error) { res.status(503).json({ error: errorMessage(error) }); }
  });
  app.post("/api/paypal/orders/preflight", (req: Request, res: Response) => {
    const receivedBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    res.setHeader("Cache-Control", "no-store"); res.json({ ok: true, received_bytes: receivedBytes, max_intake_bytes: MAX_INTAKE_BYTES });
  });
  app.post("/api/paypal/orders", async (req: Request, res: Response) => {
    try {
      const parsed = submissionSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "The completed intake payload is invalid." });
      const draft = validateIntakeDraft(parsed.data.intake);
      const settings = await getPaypalSettings(); requireActivePayPal(settings);
      const mode = paymentModeForRequest(settings, req);
      const demo = parsed.data.demo_mode === true || req.query.prefill === "demo";
      const phone = phoneAttestation(draft, parsed.data.phone_verification_token, demo && mode === "sandbox");
      const paymentMethod = parsed.data.payment_method === "apple_pay" ? "apple_pay" : "card";
      const order = await createOrder(draft, phone, mode, paymentMethod);
      res.setHeader("Cache-Control", "no-store"); return res.status(201).json(order);
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.post("/api/paypal/orders/:orderId/capture", async (req: Request, res: Response) => {
    try {
      const orderId = z.string().min(3).max(128).regex(/^[A-Za-z0-9-]+$/).parse(req.params.orderId);
      const approval = decodeApprovalToken(req.body?.approval_token);
      if (approval.orderId !== orderId) return res.status(400).json({ error: "Payment approval does not match this order." });
      res.setHeader("Cache-Control", "no-store"); return res.json(await finishPendingPayment(approval));
    } catch (error) { return res.status(400).json({ error: errorMessage(error) }); }
  });
}
