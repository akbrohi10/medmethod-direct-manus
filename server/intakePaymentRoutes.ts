import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getIntakeDeliverySettings, getPaypalSettings } from "./db";
import { decryptIntakeCredential } from "./intakeCredentialCrypto";
import { ENV } from "./_core/env";
import { registerIntakePhoneVerificationRoutes, validPhoneVerificationToken, getPhoneVerificationSettings } from "./intakePhoneVerification";
import {
  VIDEO_VISIT_AMOUNT,
  VIDEO_VISIT_DESCRIPTION,
  finalizeFreeIntake,
  finalizeVideoVisitPaid,
  finalizeVideoVisitWaived,
  validateIntakeDraft,
  type CompletedFreeIntakeReceipt,
  type IntakeDraft,
  type PhoneAttestation,
  type VerifiedVideoVisitPayment,
} from "./intakeSubmissionContract";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const PENDING_TTL_MS = 60 * 60 * 1000;
const DELIVERY_TIMEOUT_MS = 15_000;
const MAX_INTAKE_BYTES = 180_000;
const MAX_PENDING = 2000;
type PayPalMode = "sandbox" | "live";
type PaymentMethod = "card" | "apple_pay";

type SubmissionToken = CompletedFreeIntakeReceipt & {
  version: 1;
  purpose: "completed_free_intake";
  expires_at: number;
};
type ApprovalToken = {
  version: 2;
  purpose: "video_visit_payment";
  submission_id: string;
  order_id: string;
  mode: PayPalMode;
  amount: typeof VIDEO_VISIT_AMOUNT;
  currency: "USD";
  expires_at: number;
};

const freeSubmissionSchema = z.object({
  intake: z.record(z.string(), z.unknown()),
  phone_verification_token: z.string().max(2048).nullable().optional(),
  demo_mode: z.boolean().optional(),
  video_visit_interest: z.boolean(),
});
const videoOrderSchema = z.object({
  submission_token: z.string().min(16).max(4096),
  payment_method: z.enum(["card", "apple_pay"]),
  demo_mode: z.boolean().optional(),
});
const videoStatusSchema = z.object({ submission_token: z.string().min(16).max(4096) });
const couponCodeSchema = z.object({ coupon_code: z.string().trim().min(1).max(64) });
const videoCouponSchema = z.object({ submission_token: z.string().min(16).max(4096), coupon_code: z.string().trim().min(1).max(64) });

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
/** Kept for the existing browser-safe client-token response convention. */
function paymentModeForClientToken(settings: Awaited<ReturnType<typeof getPaypalSettings>>, request: Request): PayPalMode {
  return request.query.prefill === "demo" || request.body?.demo_mode === true ? "sandbox" : paymentMode(settings);
}
function requireActivePayPal(settings: Awaited<ReturnType<typeof getPaypalSettings>>) {
  if (!settings || settings.activeProvider !== "paypal") {
    throw new Error("PayPal is not the enabled payment provider. An administrator must enable PayPal before an optional $39.00 video visit can be purchased.");
  }
}
async function getPayPalClient(mode: PayPalMode) {
  const settings = await getPaypalSettings();
  if (!settings) throw new Error("PayPal is not configured.");
  const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
  const clientSecret = mode === "live" ? settings.liveClientSecret : settings.sandboxClientSecret;
  if (!clientId || !clientSecret) throw new Error(`PayPal ${mode} credentials are not configured.`);
  const response = await fetch(`${getPayPalBaseUrl(mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("PayPal authentication could not be completed.");
  const token = await response.json() as { access_token?: string };
  if (!token.access_token) throw new Error("PayPal did not return an access token.");
  return { baseUrl: getPayPalBaseUrl(mode), token: token.access_token };
}
function tokenSecret() {
  if (!ENV.cookieSecret) throw new Error("Payment approval token signing is not configured.");
  return ENV.cookieSecret;
}
function sign(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${createHmac("sha256", tokenSecret()).update(encoded).digest("base64url")}`;
}
function verifiedPayload(value: unknown): unknown {
  if (typeof value !== "string") throw new Error("The signed receipt is missing.");
  const parts = value.split(".");
  if (parts.length !== 2) throw new Error("The signed receipt is invalid.");
  const [encoded, signature] = parts;
  const expected = Buffer.from(createHmac("sha256", tokenSecret()).update(encoded).digest("base64url"));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error("The signed receipt is invalid.");
  try { return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); }
  catch { throw new Error("The signed receipt is invalid."); }
}
function encodeSubmissionToken(receipt: CompletedFreeIntakeReceipt): string {
  // Deliberately only non-contact metadata. No draft, patient, address, email, phone, DOB, or answers is signed into this token.
  return sign({ version: 1, purpose: "completed_free_intake", ...receipt, expires_at: Date.now() + TOKEN_TTL_MS } satisfies SubmissionToken);
}
function decodeSubmissionToken(value: unknown): SubmissionToken {
  const parsed = z.object({
    version: z.literal(1), purpose: z.literal("completed_free_intake"), submission_id: z.string().uuid(), submitted_at: z.string().datetime({ offset: true }),
    is_test: z.boolean(), sms_opt_in: z.boolean(), video_visit_interest: z.boolean(), expires_at: z.number().int().positive(),
  }).safeParse(verifiedPayload(value));
  if (!parsed.success || parsed.data.expires_at < Date.now()) throw new Error("This completed-intake receipt has expired. Please contact the Care Team.");
  return parsed.data;
}
function encodeApprovalToken(payload: Omit<ApprovalToken, "version" | "purpose" | "expires_at">): string {
  return sign({ version: 2, purpose: "video_visit_payment", ...payload, expires_at: Date.now() + TOKEN_TTL_MS } satisfies ApprovalToken);
}
function decodeApprovalToken(value: unknown): ApprovalToken {
  const parsed = z.object({
    version: z.literal(2), purpose: z.literal("video_visit_payment"), submission_id: z.string().uuid(), order_id: z.string().min(3).max(128),
    mode: z.enum(["sandbox", "live"]), amount: z.literal(VIDEO_VISIT_AMOUNT), currency: z.literal("USD"), expires_at: z.number().int().positive(),
  }).safeParse(verifiedPayload(value));
  if (!parsed.success || parsed.data.expires_at < Date.now()) throw new Error("Payment approval has expired. Please start the optional video visit checkout again.");
  return parsed.data;
}
function phoneAttestation(draft: IntakeDraft, token: unknown, demoBypass: boolean): PhoneAttestation {
  if (demoBypass) return { phone_verified: false, phone_verified_at: null };
  const settings = getPhoneVerificationSettings();
  const verified = validPhoneVerificationToken(token, draft.patient.phone);
  // A sandbox token must never satisfy a live setting (or vice versa).
  if (verified && verified.mode === settings.mode) return { phone_verified: true, phone_verified_at: verified.verifiedAt };
  if (settings.required) throw new Error("Please verify your mobile number before continuing. If your code expired, request a new code.");
  return { phone_verified: false, phone_verified_at: null };
}
function eligibleDemo(demoRequested: boolean): boolean {
  const settings = getPhoneVerificationSettings();
  return demoRequested && settings.mode === "sandbox" && settings.demo_available === true;
}
async function deliverIntake(payload: Record<string, unknown>) {
  // Existing secret-first URL, encrypted admin fallback, and request headers are retained.
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
    if (!response.ok) throw new Error("The intake could not be delivered. Please retry; do not make another payment.");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("Intake delivery is awaiting confirmation. Please retry; do not make another payment.");
    throw new Error(error instanceof Error && error.message.startsWith("The intake") ? error.message : "The intake could not be delivered. Please retry; do not make another payment.");
  } finally { clearTimeout(timeout); }
}
function errorMessage(error: unknown) {
  // Never serialize provider response bodies, card data, patient data, or signed tokens.
  return error instanceof Error && !/fetch failed|network|ECONN|UND_ERR/i.test(error.message) ? error.message : "Unable to complete the request. Please try again.";
}

type FreeResult = {
  submission_id: string;
  submission_token: string;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
  is_test: boolean;
  payment_status: "NOT_REQUIRED";
};
type OrderResult = { order_id: string; approval_url: string; approval_token: string; environment: PayPalMode; payment_method: PaymentMethod };
type Completion = { submission_id: string; payment_status: "COMPLETED"; capture_id: string; environment: PayPalMode };
type WaiverCompletion = { submission_id: string; payment_status: "WAIVED"; amount: "0.00" };
type FreeRecord = {
  fingerprint: string;
  expiresAt: number;
  // One-way fingerprint only; no raw verification token or phone is retained here.
  phoneTokenKey?: string;
  receipt?: CompletedFreeIntakeReceipt;
  token?: string;
  result?: FreeResult;
  // Present only until Keragon accepts the full free clinical intake. Never retained after acceptance.
  deliveryPayload?: Record<string, unknown>;
  delivered: boolean;
};
type VideoRecord = {
  receipt: CompletedFreeIntakeReceipt;
  expiresAt: number;
  mode?: PayPalMode;
  paymentMethod?: PaymentMethod;
  order?: OrderResult;
  payment?: VerifiedVideoVisitPayment;
  eventId?: string;
  // These event payloads are deliberately minimal and contain no clinical/contact payload.
  deliveryPayload?: Record<string, unknown>;
  delivered: boolean;
  completion?: Completion;
  waiver?: WaiverCompletion;
};

/**
 * Process-local, bounded handoff state avoids durable patient-data storage. It provides
 * retry/concurrency dedupe only within one process and its TTL; a restart loses receipts
 * and callers must contact the Care Team rather than re-submit a new questionnaire.
 */
export function registerIntakePaymentRoutes(app: Express) {
  registerIntakePhoneVerificationRoutes(app);
  const freeSubmissions = new Map<string, FreeRecord>();
  const videoVisits = new Map<string, VideoRecord>();
  const pendingPhoneTokens = new Map<string, string>();
  const consumedPhoneTokens = new Map<string, number>();
  const deliveringFree = new Map<string, Promise<FreeResult>>();
  const creatingOrders = new Map<string, Promise<OrderResult>>();
  const completingVideo = new Map<string, Promise<Completion>>();
  const waivingVideo = new Map<string, Promise<WaiverCompletion>>();
  const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

  function cleanup() {
    const now = Date.now();
    for (const [id, record] of Array.from(freeSubmissions.entries())) {
      if (record.expiresAt <= now && !deliveringFree.has(id)) {
        if (record.phoneTokenKey) pendingPhoneTokens.delete(record.phoneTokenKey);
        freeSubmissions.delete(id);
      }
    }
    for (const [tokenKey, expiresAt] of Array.from(consumedPhoneTokens.entries())) {
      if (expiresAt <= now) consumedPhoneTokens.delete(tokenKey);
    }
    for (const [id, record] of Array.from(videoVisits.entries())) {
      if (record.expiresAt <= now && !creatingOrders.has(id) && !(record.order && completingVideo.has(record.order.order_id)) && !waivingVideo.has(id)) videoVisits.delete(id);
    }
  }
  function ensureCapacity() {
    if (freeSubmissions.size + videoVisits.size >= MAX_PENDING) throw new Error("The intake service is busy. Please try again shortly.");
  }
  function receiptFor(value: unknown): CompletedFreeIntakeReceipt {
    cleanup();
    const signed = decodeSubmissionToken(value);
    const record = freeSubmissions.get(signed.submission_id);
    const receipt = record?.receipt;
    if (!record?.delivered || !receipt || receipt.submitted_at !== signed.submitted_at || receipt.is_test !== signed.is_test || receipt.sms_opt_in !== signed.sms_opt_in || receipt.video_visit_interest !== signed.video_visit_interest) {
      throw new Error("This completed-intake receipt is not available. Please contact the Care Team.");
    }
    return receipt;
  }
  function freeResult(record: FreeRecord): FreeResult {
    if (!record.result) throw new Error("The intake receipt is not ready.");
    return record.result;
  }
  async function submitFreeIntake(input: z.infer<typeof freeSubmissionSchema>): Promise<FreeResult> {
    cleanup();
    const draft = validateIntakeDraft(input.intake);
    const demo = eligibleDemo(input.demo_mode === true);
    const isTest = demo;
    const hash = fingerprint({ draft, video_visit_interest: input.video_visit_interest, is_test: isTest });
    let record = freeSubmissions.get(draft.submission_id);
    if (record && record.fingerprint !== hash) throw new Error("This submission ID was already used with different intake information.");
    if (record?.delivered) return freeResult(record);
    const inFlight = deliveringFree.get(draft.submission_id);
    if (inFlight) return inFlight;
    // An unapproved demo flag is not a bypass; the normal phone requirement remains in force.
    const phone = phoneAttestation(draft, input.phone_verification_token, demo);
    const phoneTokenKey = phone.phone_verified && typeof input.phone_verification_token === "string"
      ? fingerprint({ token: input.phone_verification_token })
      : undefined;
    if (phoneTokenKey) {
      const activeSubmission = pendingPhoneTokens.get(phoneTokenKey);
      if (consumedPhoneTokens.has(phoneTokenKey) || (activeSubmission && activeSubmission !== draft.submission_id)) {
        throw new Error("This phone verification has already been used. Please verify your mobile number again.");
      }
    }
    const receipt: CompletedFreeIntakeReceipt = {
      submission_id: draft.submission_id,
      submitted_at: draft.submitted_at,
      is_test: isTest,
      sms_opt_in: draft.consents.sms_opt_in,
      video_visit_interest: input.video_visit_interest,
    };
    // Check signing configuration before any external handoff. The token is not
    // exposed to the client until delivery accepts, so a missing signing key can
    // never leave a delivered intake without its usable completion receipt.
    const preparedReceiptToken = encodeSubmissionToken(receipt);
    // Reserve this one-way token key for retries too. The reservation is released
    // if relay delivery fails and retired only after the relay accepts.
    if (phoneTokenKey) pendingPhoneTokens.set(phoneTokenKey, draft.submission_id);
    if (record && record.phoneTokenKey !== phoneTokenKey) {
      // A delivery failure must not burn a valid verification. A user who obtains a
      // fresh attestation may retry the same unchanged draft; overwrite only the
      // still-pending relay payload and retire no token until it is accepted.
      if (record.phoneTokenKey) pendingPhoneTokens.delete(record.phoneTokenKey);
      record.phoneTokenKey = phoneTokenKey;
      record.deliveryPayload = finalizeFreeIntake(draft, phone, { is_test: isTest, video_visit_interest: input.video_visit_interest });
    }
    if (!record) {
      ensureCapacity();
      record = {
        fingerprint: hash,
        expiresAt: Date.now() + PENDING_TTL_MS,
        phoneTokenKey,
        deliveryPayload: finalizeFreeIntake(draft, phone, { is_test: isTest, video_visit_interest: input.video_visit_interest }),
        delivered: false,
      };
      freeSubmissions.set(draft.submission_id, record);
    }
    const pending = record;
    const delivery = (async () => {
      if (!pending.deliveryPayload) throw new Error("The intake relay is no longer available. Please contact the Care Team.");
      await deliverIntake(pending.deliveryPayload);
      // Do not consume a usable verification token for a failed delivery. Once the
      // clinical handoff accepts, retire its local one-way key. A same-token request
      // is serialized while delivery is pending, so two completed intakes cannot use it.
      if (pending.phoneTokenKey) {
        pendingPhoneTokens.delete(pending.phoneTokenKey);
        consumedPhoneTokens.set(pending.phoneTokenKey, pending.expiresAt);
      }
      pending.delivered = true;
      pending.receipt = receipt;
      pending.token = preparedReceiptToken;
      pending.result = { submission_id: receipt.submission_id, submission_token: pending.token, sms_opt_in: receipt.sms_opt_in, video_visit_interest: receipt.video_visit_interest, is_test: receipt.is_test, payment_status: "NOT_REQUIRED" };
      // Remove all patient, clinical, consent, and contact contents immediately after acceptance.
      delete pending.deliveryPayload;
      return pending.result;
    })();
    deliveringFree.set(draft.submission_id, delivery);
    try { return await delivery; }
    finally {
      deliveringFree.delete(draft.submission_id);
      if (!pending.delivered && pending.phoneTokenKey) pendingPhoneTokens.delete(pending.phoneTokenKey);
    }
  }
  function modeForVideoReceipt(receipt: CompletedFreeIntakeReceipt, demoRequested: boolean, settings: Awaited<ReturnType<typeof getPaypalSettings>>): PayPalMode {
    if (receipt.is_test) {
      const phoneSettings = getPhoneVerificationSettings();
      if (!demoRequested || phoneSettings.mode !== "sandbox" || phoneSettings.demo_available !== true) {
        throw new Error("A sandbox demo video visit requires an eligible sandbox demo intake.");
      }
      return "sandbox";
    }
    if (demoRequested) throw new Error("Demo mode is available only for an eligible sandbox demo intake.");
    return paymentMode(settings);
  }
  async function createVideoOrder(receipt: CompletedFreeIntakeReceipt, paymentMethod: PaymentMethod, demoRequested: boolean): Promise<OrderResult> {
    const settings = await getPaypalSettings();
    requireActivePayPal(settings);
    const mode = modeForVideoReceipt(receipt, demoRequested, settings);
    let record = videoVisits.get(receipt.submission_id);
    if (record?.waiver) throw new Error("This optional video visit was already waived.");
    if (record?.completion) throw new Error("This optional video visit was already completed.");
    if (record?.order) {
      if (record.mode !== mode || record.paymentMethod !== paymentMethod) throw new Error("This optional video visit already has a different checkout in progress.");
      return record.order;
    }
    const existing = creatingOrders.get(receipt.submission_id);
    if (existing) return existing;
    if (!record) {
      ensureCapacity();
      record = { receipt, expiresAt: Date.now() + PENDING_TTL_MS, mode, paymentMethod, delivered: false };
      videoVisits.set(receipt.submission_id, record);
    }
    const pending = record;
    const promise = (async () => {
      const client = await getPayPalClient(mode);
      const response = await fetch(`${client.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${client.token}`, "Content-Type": "application/json", "PayPal-Request-Id": `mmd-video-visit-${receipt.submission_id}`, Prefer: "return=representation" },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{ amount: { currency_code: "USD", value: VIDEO_VISIT_AMOUNT }, description: VIDEO_VISIT_DESCRIPTION, custom_id: receipt.submission_id }],
          ...(paymentMethod === "card" ? { payment_source: { card: { attributes: { verification: { method: "SCA_WHEN_REQUIRED" } } } } } : {}),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error("PayPal could not prepare the $39.00 video visit payment. Your card has not been charged.");
      const order = await response.json() as { id?: string; links?: Array<{ rel?: string; href?: string }> };
      if (!order.id) throw new Error("PayPal did not return a payment order. Your card has not been charged.");
      pending.order = {
        order_id: order.id,
        approval_url: order.links?.find(link => link.rel === "approve")?.href ?? "",
        approval_token: encodeApprovalToken({ submission_id: receipt.submission_id, order_id: order.id, mode, amount: VIDEO_VISIT_AMOUNT, currency: "USD" }),
        environment: mode,
        payment_method: paymentMethod,
      };
      return pending.order;
    })();
    creatingOrders.set(receipt.submission_id, promise);
    try { return await promise; }
    catch (error) {
      // Failed order creation has no payment and must not affect the accepted free intake.
      if (!pending.order && !pending.payment) videoVisits.delete(receipt.submission_id);
      throw error;
    } finally { creatingOrders.delete(receipt.submission_id); }
  }
  function verifyVideoCapture(raw: unknown, approval: ApprovalToken): VerifiedVideoVisitPayment {
    const order = raw as {
      id?: string; status?: string;
      purchase_units?: Array<{ custom_id?: string; description?: string; amount?: { value?: string; currency_code?: string }; payments?: { captures?: Array<{ id?: string; status?: string; custom_id?: string; amount?: { value?: string; currency_code?: string }; create_time?: string }> } }>;
    };
    const units = order.purchase_units;
    const unit = units?.[0], captures = unit?.payments?.captures, capture = captures?.[0];
    if (
      order.id !== approval.order_id || order.status !== "COMPLETED" || units?.length !== 1 ||
      unit?.custom_id !== approval.submission_id || unit?.description !== VIDEO_VISIT_DESCRIPTION || unit.amount?.value !== VIDEO_VISIT_AMOUNT || unit.amount.currency_code !== "USD" ||
      captures?.length !== 1 || !capture?.id || capture.status !== "COMPLETED" || capture.amount?.value !== VIDEO_VISIT_AMOUNT || capture.amount.currency_code !== "USD" ||
      (capture.custom_id !== undefined && capture.custom_id !== approval.submission_id) || !capture.create_time || !Number.isFinite(Date.parse(capture.create_time))
    ) throw new Error("PayPal payment confirmation did not match this $39.00 USD optional video visit. Please contact the Care Team; do not make another payment.");
    return { provider: "paypal", environment: approval.mode, status: "COMPLETED", order_id: approval.order_id, capture_id: capture.id, amount: VIDEO_VISIT_AMOUNT, currency: "USD", captured_at: capture.create_time };
  }
  function verifyApprovedOrder(raw: unknown, approval: ApprovalToken) {
    const order = raw as { id?: string; status?: string; purchase_units?: Array<{ custom_id?: string; description?: string; amount?: { value?: string; currency_code?: string } }> };
    const unit = order.purchase_units?.[0];
    if (order.id !== approval.order_id || order.status !== "APPROVED" || order.purchase_units?.length !== 1 || unit?.custom_id !== approval.submission_id || unit?.description !== VIDEO_VISIT_DESCRIPTION || unit.amount?.value !== VIDEO_VISIT_AMOUNT || unit.amount.currency_code !== "USD") {
      throw new Error("PayPal has not approved the matching $39.00 USD optional video visit order. Please complete payment approval first.");
    }
  }
  async function finishVideoPayment(approval: ApprovalToken): Promise<Completion> {
    cleanup();
    const record = videoVisits.get(approval.submission_id);
    if (!record || !record.order || record.order.order_id !== approval.order_id || record.mode !== approval.mode || record.waiver) {
      throw new Error("This optional video visit checkout is no longer available. Contact the Care Team if payment was completed; do not pay again.");
    }
    if (record.completion && record.delivered) return record.completion;
    const existing = completingVideo.get(approval.order_id);
    if (existing) return existing;
    const promise = (async () => {
      if (!record.payment) {
        const client = await getPayPalClient(approval.mode);
        const url = `${client.baseUrl}/v2/checkout/orders/${encodeURIComponent(approval.order_id)}`;
        const details = await fetch(url, { headers: { Authorization: `Bearer ${client.token}`, Accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
        if (!details.ok) throw new Error("PayPal could not check the payment status. Please retry completion; do not pay again.");
        let raw = await details.json() as { id?: string; status?: string };
        if (raw.status !== "COMPLETED") {
          verifyApprovedOrder(raw, approval);
          const captured = await fetch(`${url}/capture`, {
            method: "POST",
            headers: { Authorization: `Bearer ${client.token}`, "Content-Type": "application/json", "PayPal-Request-Id": `mmd-video-visit-capture-${approval.order_id}` },
            signal: AbortSignal.timeout(20_000),
          });
          if (!captured.ok) throw new Error("PayPal could not confirm the video visit payment. Please retry completion; do not make another payment.");
          raw = await captured.json() as { id?: string; status?: string };
        }
        record.payment = verifyVideoCapture(raw, approval);
      }
      record.eventId ??= randomUUID();
      record.deliveryPayload ??= finalizeVideoVisitPaid(record.receipt, record.eventId, record.payment);
      if (!record.delivered) {
        await deliverIntake(record.deliveryPayload);
        record.delivered = true;
      }
      record.completion = { submission_id: approval.submission_id, payment_status: "COMPLETED", capture_id: record.payment.capture_id, environment: approval.mode };
      delete record.deliveryPayload;
      return record.completion;
    })();
    completingVideo.set(approval.order_id, promise);
    try { return await promise; } finally { completingVideo.delete(approval.order_id); }
  }
  async function waiveVideoVisit(receipt: CompletedFreeIntakeReceipt): Promise<WaiverCompletion> {
    let record = videoVisits.get(receipt.submission_id);
    if (record?.completion) throw new Error("This optional video visit was already completed.");
    if (record?.order) throw new Error("This optional video visit already has a PayPal checkout. Please finish that checkout before applying a waiver.");
    if (record?.waiver && record.delivered) return record.waiver;
    const existing = waivingVideo.get(receipt.submission_id);
    if (existing) return existing;
    if (!record) {
      ensureCapacity();
      record = { receipt, expiresAt: Date.now() + PENDING_TTL_MS, delivered: false };
      videoVisits.set(receipt.submission_id, record);
    }
    const pending = record;
    const promise = (async () => {
      pending.eventId ??= randomUUID();
      pending.deliveryPayload ??= finalizeVideoVisitWaived(receipt, pending.eventId);
      if (!pending.delivered) {
        await deliverIntake(pending.deliveryPayload);
        pending.delivered = true;
      }
      pending.waiver = { submission_id: receipt.submission_id, payment_status: "WAIVED", amount: "0.00" };
      delete pending.deliveryPayload;
      return pending.waiver;
    })();
    waivingVideo.set(receipt.submission_id, promise);
    try { return await promise; } finally { waivingVideo.delete(receipt.submission_id); }
  }

  app.post("/api/intake/submit", async (req: Request, res: Response) => {
    try {
      const parsed = freeSubmissionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "The completed intake payload is invalid." });
      const result = await submitFreeIntake(parsed.data);
      res.setHeader("Cache-Control", "no-store");
      return res.status(201).json(result);
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.post("/api/intake/coupon/validate", (req: Request, res: Response) => {
    const parsed = couponCodeSchema.safeParse(req.body);
    if (!parsed.success || !isFamilyIntakeCoupon(parsed.data.coupon_code)) return res.status(422).json({ valid: false, error: "That coupon code is not valid." });
    res.setHeader("Cache-Control", "no-store");
    return res.json({ valid: true, amount: "0.00", original_amount: VIDEO_VISIT_AMOUNT, status: "waived" });
  });
  app.post("/api/intake/coupon/submit", async (req: Request, res: Response) => {
    try {
      const parsed = videoCouponSchema.safeParse(req.body);
      if (!parsed.success || !isFamilyIntakeCoupon(parsed.success ? parsed.data.coupon_code : undefined)) return res.status(422).json({ error: "That coupon code is not valid." });
      const result = await waiveVideoVisit(receiptFor(parsed.data.submission_token));
      res.setHeader("Cache-Control", "no-store");
      return res.status(201).json(result);
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.post("/api/intake/video/status", (req: Request, res: Response) => {
    try {
      const parsed = videoStatusSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "The completed-intake receipt is invalid." });
      const receipt = receiptFor(parsed.data.submission_token);
      const record = videoVisits.get(receipt.submission_id);
      res.setHeader("Cache-Control", "no-store");
      if (!record) return res.json({ status: "available" });
      if (record.waiver) return res.json({ status: "waived", completion: record.waiver });
      if (record.completion) return res.json({ status: "paid", completion: record.completion });
      return res.json({ status: "pending", ...(record.order ? { order: record.order } : {}) });
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.get("/api/paypal/client-token", async (req: Request, res: Response) => {
    try {
      const settings = await getPaypalSettings();
      requireActivePayPal(settings);
      if (!settings) throw new Error("PayPal is not configured.");
      const mode = paymentModeForClientToken(settings, req);
      const clientId = mode === "live" ? settings.liveClientId : settings.sandboxClientId;
      if (!clientId) throw new Error(`PayPal ${mode} Client ID is not configured.`);
      res.setHeader("Cache-Control", "no-store");
      return res.json({ client_id: clientId, environment: mode });
    } catch (error) { return res.status(503).json({ error: errorMessage(error) }); }
  });
  app.post("/api/paypal/orders/preflight", (req: Request, res: Response) => {
    const receivedBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    res.setHeader("Cache-Control", "no-store");
    return res.json({ ok: true, received_bytes: receivedBytes, max_intake_bytes: MAX_INTAKE_BYTES });
  });
  app.post("/api/paypal/orders", async (req: Request, res: Response) => {
    try {
      const parsed = videoOrderSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "A completed intake receipt and payment method are required." });
      const receipt = receiptFor(parsed.data.submission_token);
      const order = await createVideoOrder(receipt, parsed.data.payment_method, parsed.data.demo_mode === true);
      res.setHeader("Cache-Control", "no-store");
      return res.status(201).json(order);
    } catch (error) { return res.status(422).json({ error: errorMessage(error) }); }
  });
  app.post("/api/paypal/orders/:orderId/capture", async (req: Request, res: Response) => {
    try {
      const orderId = z.string().min(3).max(128).regex(/^[A-Za-z0-9-]+$/).parse(req.params.orderId);
      const approval = decodeApprovalToken(req.body?.approval_token);
      if (approval.order_id !== orderId) return res.status(400).json({ error: "Payment approval does not match this order." });
      res.setHeader("Cache-Control", "no-store");
      return res.json(await finishVideoPayment(approval));
    } catch (error) { return res.status(400).json({ error: errorMessage(error) }); }
  });
}
