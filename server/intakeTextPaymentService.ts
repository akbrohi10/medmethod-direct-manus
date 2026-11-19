import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { IntakeDraft } from "./intakeSubmissionContract";
import {
  createIntakeTextPaymentStore, type IntakeTextPaymentStore, type TextPaymentLockedRecord,
  type TextPaymentStorageRecord,
} from "./intakeTextPaymentStore";

export const TEXT_INTAKE_AMOUNT = "29.00" as const;
export const TEXT_INTAKE_DESCRIPTION = "MedMethod Direct – Weight Care text visit" as const;
export type TextIntakePaymentMode = "sandbox" | "live";
const DAY = 86_400_000;
const PENDING_TTL = 7 * DAY;
const RETENTION = 30 * DAY;
const IDEMPOTENCY_WINDOW = 6 * 60 * 60_000;
const REMINDER_DELAY = 30 * 60_000;
const PROVIDER_TIMEOUT = 4_000;
const DELIVERY_TIMEOUT = 35_000;
const SWEEP_LIMIT = 2;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PROVIDER_ID = /^[A-Za-z0-9_-]{3,128}$/;

export type TextIntakeValidatedInput = {
  submission_id: string;
  intake?: IntakeDraft;
  draft?: IntakeDraft;
  signing: unknown;
  resume_answers: Record<string, unknown>;
  is_test: boolean;
  public_origin?: string;
  validated_at?: number | string;
};
export type TextIntakePaymentConfig = { mode: TextIntakePaymentMode; clientId: string; clientSecret: string };
export type TextIntakeVerifiedPayment = {
  provider: "paypal"; environment: TextIntakePaymentMode; status: "COMPLETED";
  order_id: string; capture_id: string; amount: typeof TEXT_INTAKE_AMOUNT; currency: "USD"; captured_at: string;
};
export type TextIntakeFinalizeRecord<T extends TextIntakeValidatedInput = TextIntakeValidatedInput> = {
  input: T;
  payment: TextIntakeVerifiedPayment;
  environment: TextIntakePaymentMode;
  is_test: boolean;
  deliveryIdempotencyKey: string;
  /** Hook MUST honor cancellation where supported and dedupe at the receiving destination. */
  signal: AbortSignal;
};
export type TextIntakeUnpaidPayload = {
  event: "intake_unpaid"; first_name: string; last_name: string; email: string; phone: string;
  state: string; sms_opt_in: boolean; source: "website_intake"; tags: "intake-unpaid";
  is_test: boolean; resume_url: string;
};
export type TextIntakePaymentRecord<T extends TextIntakeValidatedInput = TextIntakeValidatedInput> = TextPaymentStorageRecord & {
  input?: T;
  fingerprint: string;
  environment: TextIntakePaymentMode;
  paymentToken: string;
  customId: string;
  createRequestId: string;
  captureRequestId: string;
  deliveryIdempotencyKey: string;
  reminderIdempotencyKey: string;
  createAttemptAt?: number;
  captureAttemptAt?: number;
  captureBlocked?: boolean;
  orderId?: string;
  payment?: TextIntakeVerifiedPayment;
  receipt?: Record<string, unknown>;
  resumeToken?: string;
  reminderSentAt?: number;
  reminderSuppressed?: boolean;
};
export type TextIntakeCompletion = Record<string, unknown> & {
  payment_status: "COMPLETED"; payment_provider: "paypal"; amount: typeof TEXT_INTAKE_AMOUNT;
  paypal_order_id: string; paypal_capture_id: string; paid_at: string;
  environment: TextIntakePaymentMode; is_test: boolean;
};
export type TextIntakePending = {
  payment_status: "PENDING" | "PAID_AWAITING_DELIVERY";
  order_id: string | null; environment: TextIntakePaymentMode; amount: typeof TEXT_INTAKE_AMOUNT; retryable: true;
};
export type TextIntakePaymentService<T extends TextIntakeValidatedInput = TextIntakeValidatedInput> = {
  configuration(): Promise<{ configured: boolean; client_id: string | null; environment: TextIntakePaymentMode; amount: typeof TEXT_INTAKE_AMOUNT }>;
  create(input: unknown): Promise<{ order_id: string; payment_token: string; environment: TextIntakePaymentMode }>;
  capture(input: { payment_token: string; order_id: string }): Promise<TextIntakeCompletion | TextIntakePending>;
  status(paymentToken: string): Promise<TextIntakeCompletion | TextIntakePending>;
  resume(oneTimeToken: string): Promise<{ input: T; payment_token: string; order_id: string | null; status: "PENDING" | "PAID_AWAITING_DELIVERY" }>;
  restore(paymentToken: string): Promise<{ input: T; payment_token: string; order_id: string | null; status: "PENDING" | "PAID_AWAITING_DELIVERY" }>;
  /** SERVER ONLY: caller must verify the existing HMAC submission token first. */
  receiptBySubmissionId(submissionId: string): Promise<TextIntakeCompletion | null>;
  sweep(): Promise<{ processed: number; sent: number; expired: number; recovered: number }>;
};
export type TextIntakePaymentDependencies<T extends TextIntakeValidatedInput> = {
  validate(input: unknown): Promise<T>;
  /** LIVE ONLY. Receiver must dedupe by deliveryIdempotencyKey across retry/timeout/restart. */
  finalize(record: TextIntakeFinalizeRecord<T>): Promise<Record<string, unknown>>;
  /** SANDBOX ONLY. Must produce a simulated receipt; never Keragon/GHL/SMS. */
  finalizeSandbox?: (record: TextIntakeFinalizeRecord<T>) => Promise<Record<string, unknown>>;
  /** LIVE ONLY. Same GHL destination as existing intake; contacts only; receiver dedupe required. */
  sendUnpaid(payload: TextIntakeUnpaidPayload, idempotencyKey: string, signal?: AbortSignal): Promise<boolean>;
  /** Optional dedicated test/mock sink. Absent => sandbox reminders are suppressed. */
  sendUnpaidSandbox?: (payload: TextIntakeUnpaidPayload, idempotencyKey: string, signal?: AbortSignal) => Promise<boolean>;
  config?: () => Promise<TextIntakePaymentConfig>;
  store?: IntakeTextPaymentStore<TextIntakePaymentRecord<T>>;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  log?: (code: "provider_unavailable" | "payment_binding_rejected" | "delivery_pending" | "reminder_pending" | "sweep_pending" | "payment_verified", verifiedAmount?: typeof TEXT_INTAKE_AMOUNT) => void;
  allowedResumeOrigins?: readonly string[];
};
export class IntakeTextPaymentError extends Error {
  constructor(public readonly code: "invalid_input" | "not_configured" | "invalid_token" | "expired" | "changed_input" | "mode_mismatch" | "provider_unavailable" | "payment_binding_rejected" | "idempotency_expired") {
    super(code === "expired" ? "This pending intake has expired. Please contact the Care Team."
      : code === "changed_input" ? "This intake ID already has different information. Please contact the Care Team; do not make another payment."
      : "Payment confirmation is unavailable. Please retry or contact the Care Team; do not make another payment.");
    this.name = "IntakeTextPaymentError";
  }
}

export function textIntakeMode(env: NodeJS.ProcessEnv = process.env): TextIntakePaymentMode {
  const mode = env.TEXT_INTAKE_PAYMENT_MODE ?? "sandbox";
  if (mode !== "sandbox" && mode !== "live") throw new IntakeTextPaymentError("not_configured");
  return mode;
}
/** Injectable read-only settings lookup. Saved mode is authoritative; activeProvider is not used. */
export async function getIntakeTextPaymentConfig(
  options: {
    env?: NodeJS.ProcessEnv;
    settings?: () => Promise<{ mode?: string | null; sandboxClientId?: string | null; sandboxClientSecret?: string | null; liveClientId?: string | null; liveClientSecret?: string | null } | null>;
  } = {},
): Promise<TextIntakePaymentConfig> {
  const env = options.env ?? process.env;
  let settings: Awaited<ReturnType<NonNullable<typeof options.settings>>> = null;
  try {
    settings = await (options.settings ?? (async () => (await import("./db")).getPaypalSettings()))();
  } catch { throw new IntakeTextPaymentError("not_configured"); }
  const mode = settings?.mode ?? textIntakeMode(env);
  if (mode !== "sandbox" && mode !== "live") throw new IntakeTextPaymentError("not_configured");
  const savedId = mode === "sandbox" ? settings?.sandboxClientId : settings?.liveClientId;
  const savedSecret = mode === "sandbox" ? settings?.sandboxClientSecret : settings?.liveClientSecret;
  const prefix = mode === "sandbox" ? "PAYPAL_SANDBOX" : "PAYPAL_LIVE";
  // Never combine halves of different credential pairs.
  const clientId = savedId && savedSecret ? savedId : env[`${prefix}_CLIENT_ID`] ?? "";
  const clientSecret = savedId && savedSecret ? savedSecret : env[`${prefix}_CLIENT_SECRET`] ?? "";
  return { mode, clientId, clientSecret };
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().filter(k => (value as Record<string, unknown>)[k] !== undefined)
    .map(k => `${JSON.stringify(k)}:${canonical((value as Record<string, unknown>)[k])}`).join(",")}}`;
}
function forbidPaymentData(value: unknown, depth = 0): void {
  if (depth > 24) throw new IntakeTextPaymentError("invalid_input");
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["amount", "currency", "currencycode", "card", "cardnumber", "pan", "cvv", "cvc", "cardcvv", "cardcvc", "securitycode", "cardexpiry", "cardexpiration", "cardholdername", "billingzip", "paymenttoken", "paymentsource"].includes(normalized)) throw new IntakeTextPaymentError("invalid_input");
    forbidPaymentData(child, depth + 1);
  }
}
function equalHash(a: string | undefined, b: string): boolean {
  return !!a && /^[a-f0-9]{64}$/.test(a) && timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
function capability() { return randomBytes(32).toString("base64url"); }
function intake(input: TextIntakeValidatedInput): IntakeDraft {
  const draft = input.intake ?? input.draft;
  if (!draft) throw new IntakeTextPaymentError("invalid_input");
  return draft;
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new IntakeTextPaymentError("payment_binding_rejected");
  return value as Record<string, unknown>;
}

export function createIntakeTextPaymentService<T extends TextIntakeValidatedInput = TextIntakeValidatedInput>(
  deps: TextIntakePaymentDependencies<T>,
): TextIntakePaymentService<T> {
  const store = deps.store ?? createIntakeTextPaymentStore<TextIntakePaymentRecord<T>>();
  const now = deps.now ?? Date.now;
  const getConfig = deps.config ?? getIntakeTextPaymentConfig;
  const http = deps.fetch ?? globalThis.fetch;
  const origins = deps.allowedResumeOrigins ?? ["https://medmethoddirect.com", "https://www.medmethoddirect.com"];
  const note = (code: Parameters<NonNullable<typeof deps.log>>[0], amount?: typeof TEXT_INTAKE_AMOUNT) => {
    try { deps.log?.(code, amount); } catch { /* Logging is never part of payment correctness. */ }
  };
  const config = async (expected?: TextIntakePaymentMode) => {
    const result = await bounded(() => getConfig(), PROVIDER_TIMEOUT);
    if (!["sandbox", "live"].includes(result.mode) || !result.clientId || !result.clientSecret) throw new IntakeTextPaymentError("not_configured");
    if (expected && result.mode !== expected) throw new IntakeTextPaymentError("mode_mismatch");
    return result;
  };
  const bounded = async <U>(work: (signal: AbortSignal) => Promise<U>, ms: number): Promise<U> => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([work(controller.signal), new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new IntakeTextPaymentError("provider_unavailable")); }, ms);
      })]);
    } finally { if (timer) clearTimeout(timer); }
  };
  type Client = { base: string; token: string; calls: number };
  const request = async (url: string, init: RequestInit): Promise<unknown> => {
    try {
      return await bounded(async signal => {
        const response = await http(url, { ...init, signal, redirect: "error" });
        if (!response.ok) throw new IntakeTextPaymentError("provider_unavailable");
        // Deadline covers body parsing as well as header arrival.
        return await response.json();
      }, PROVIDER_TIMEOUT);
    } catch { note("provider_unavailable"); throw new IntakeTextPaymentError("provider_unavailable"); }
  };
  const client = async (mode: TextIntakePaymentMode): Promise<Client> => {
    const creds = await config(mode);
    const base = mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const raw = object(await request(`${base}/v1/oauth2/token`, {
      method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    }));
    if (typeof raw.access_token !== "string" || !raw.access_token || raw.access_token.length > 8192) throw new IntakeTextPaymentError("provider_unavailable");
    return { base, token: raw.access_token, calls: 1 };
  };
  const provider = async (c: Client, path: string, method = "GET", body?: object, requestId?: string) => {
    // At most 4s config + 4 calls x 4s + 35s finalization = 55 seconds under one guard.
    if (++c.calls > 4) throw new IntakeTextPaymentError("provider_unavailable");
    return await request(`${c.base}${path}`, {
      method, headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json", Prefer: "return=representation", ...(requestId ? { "PayPal-Request-Id": requestId } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  };
  const binding = (raw: unknown, r: TextIntakePaymentRecord<T>, creating = false, captureResponse = false) => {
    try {
      const order = object(raw);
      if (typeof order.id !== "string" || !PROVIDER_ID.test(order.id) || (!creating && order.id !== r.orderId)
        || (captureResponse ? order.intent !== undefined && order.intent !== "CAPTURE" : order.intent !== "CAPTURE")
        || !Array.isArray(order.purchase_units) || order.purchase_units.length !== 1) throw new Error();
      const unit = object(order.purchase_units[0]);
      const amount = captureResponse && unit.amount === undefined ? {} : object(unit.amount);
      // Capture responses may omit purchase-unit metadata. Only the direct response following
      // this same lock's strictly verified GET may use that compact representation. Supplied
      // metadata can never mismatch; GET/restart reconciliation always requires the full binding.
      if ((captureResponse ? unit.custom_id !== undefined && unit.custom_id !== r.customId : unit.custom_id !== r.customId)
        || (captureResponse && unit.amount === undefined ? false : amount.value !== TEXT_INTAKE_AMOUNT || amount.currency_code !== "USD")
        || (captureResponse ? unit.description !== undefined && unit.description !== TEXT_INTAKE_DESCRIPTION : unit.description !== TEXT_INTAKE_DESCRIPTION)
        || !["CREATED", "SAVED", "APPROVED", "PAYER_ACTION_REQUIRED", "COMPLETED", "VOIDED"].includes(String(order.status))) throw new Error();
      return { order, unit, id: order.id, status: String(order.status) };
    } catch { note("payment_binding_rejected"); throw new IntakeTextPaymentError("payment_binding_rejected"); }
  };
  const verified = (raw: unknown, r: TextIntakePaymentRecord<T>, captureResponse = false): TextIntakeVerifiedPayment => {
    const { order, unit, status } = binding(raw, r, false, captureResponse);
    try {
      const payments = object(unit.payments);
      if (status !== "COMPLETED" || !Array.isArray(payments.captures) || payments.captures.length !== 1
        || (Array.isArray(payments.authorizations) && payments.authorizations.length)) throw new Error();
      const capture = object(payments.captures[0]);
      const amount = object(capture.amount);
      if (capture.status !== "COMPLETED" || typeof capture.id !== "string" || !PROVIDER_ID.test(capture.id)
        || amount.value !== TEXT_INTAKE_AMOUNT || amount.currency_code !== "USD"
        || (capture.custom_id !== undefined && capture.custom_id !== r.customId)
        || typeof capture.create_time !== "string" || !Number.isFinite(Date.parse(capture.create_time))) throw new Error();
      return { provider: "paypal", environment: r.environment, status: "COMPLETED", order_id: String(order.id), capture_id: capture.id,
        amount: TEXT_INTAKE_AMOUNT, currency: "USD", captured_at: capture.create_time };
    } catch { note("payment_binding_rejected"); throw new IntakeTextPaymentError("payment_binding_rejected"); }
  };
  const pending = (r: TextIntakePaymentRecord<T>): TextIntakePending => ({
    payment_status: r.payment ? "PAID_AWAITING_DELIVERY" : "PENDING", order_id: r.orderId ?? null,
    environment: r.environment, amount: TEXT_INTAKE_AMOUNT, retryable: true,
  });
  const redactExpired = async (r: TextIntakePaymentRecord<T>, locked: TextPaymentLockedRecord<TextIntakePaymentRecord<T>>) => {
    if (r.expiresAt > now() || r.payment || r.state === "completed") return;
    delete r.input; delete r.resumeToken; delete r.resumeTokenHash;
    // A persisted capture claim is not proof of nonpayment: retain reconciliation metadata only.
    r.state = r.captureAttemptAt !== undefined ? "capture_uncertain" : "expired";
    r.retentionUntil = r.captureAttemptAt !== undefined ? null : Math.max(r.createdAt + RETENTION, now() + RETENTION);
    r.nextSweepAt = now() + REMINDER_DELAY;
    await locked.save(r);
  };
  const authenticate = async (token: string, kind: "payment" | "resume") => {
    let hash: string;
    try { hash = store.hashCapability(token); } catch { throw new IntakeTextPaymentError("invalid_token"); }
    const key = await store.findCapability(token, kind);
    if (!key) throw new IntakeTextPaymentError("invalid_token");
    return { key, hash };
  };
  const acceptPayment = async (r: TextIntakePaymentRecord<T>, raw: unknown, locked: TextPaymentLockedRecord<TextIntakePaymentRecord<T>>, captureResponse = false) => {
    r.payment = verified(raw, r, captureResponse); r.state = "paid"; r.retentionUntil = null;
    delete r.resumeToken; delete r.resumeTokenHash;
    r.nextSweepAt = now() + REMINDER_DELAY;
    await locked.save(r); // Persist verified payment BEFORE any clinical/SMS hook.
    note("payment_verified", TEXT_INTAKE_AMOUNT);
  };
  const complete = async (r: TextIntakePaymentRecord<T>, locked: TextPaymentLockedRecord<TextIntakePaymentRecord<T>>): Promise<TextIntakeCompletion | TextIntakePending> => {
    if (r.receipt && r.payment && r.state === "completed") return r.receipt as TextIntakeCompletion;
    if (!r.payment || !r.input) return pending(r);
    const hook = r.environment === "sandbox" ? deps.finalizeSandbox : deps.finalize;
    if (!hook) { note("delivery_pending"); return pending(r); }
    try {
      const receipt = await bounded(signal => hook({ input: structuredClone(r.input!), payment: { ...r.payment! }, environment: r.environment,
        is_test: r.environment === "sandbox" || r.input!.is_test, deliveryIdempotencyKey: r.deliveryIdempotencyKey, signal }), DELIVERY_TIMEOUT);
      if (!receipt || typeof receipt !== "object" || Array.isArray(receipt) || typeof receipt.submission_token !== "string"
        || receipt.submission_id !== r.input.submission_id) throw new Error();
      // Only known legacy metadata is retained. Never retain hook-returned PHI/contact/health.
      const legacyFields = ["submission_id", "submission_token", "submitted_at", "sms_opt_in", "video_visit_interest", "redirect_url"];
      const safeReceipt: Record<string, unknown> = {};
      for (const key of legacyFields) if (["string", "boolean"].includes(typeof receipt[key])) safeReceipt[key] = receipt[key];
      const result: TextIntakeCompletion = { ...safeReceipt, payment_status: "COMPLETED", payment_provider: "paypal", amount: TEXT_INTAKE_AMOUNT,
        paypal_order_id: r.payment.order_id, paypal_capture_id: r.payment.capture_id, paid_at: r.payment.captured_at,
        environment: r.environment, is_test: r.environment === "sandbox" || r.input.is_test };
      r.receipt = result; r.state = "completed";
      r.retentionUntil = Math.max(r.createdAt + RETENTION, now() + RETENTION);
      delete r.input; delete r.resumeToken; delete r.resumeTokenHash;
      await locked.save(r);
      return result;
    } catch { note("delivery_pending"); return pending(r); }
  };
  const reconcile = async (r: TextIntakePaymentRecord<T>, locked: TextPaymentLockedRecord<TextIntakePaymentRecord<T>>, c: Client) => {
    const raw = await provider(c, `/v2/checkout/orders/${r.orderId}`);
    const checked = binding(raw, r);
    if (checked.status === "COMPLETED") await acceptPayment(r, raw, locked);
    else if (checked.unit.payments && Array.isArray(object(checked.unit.payments).captures) && (object(checked.unit.payments).captures as unknown[]).length > 0) {
      r.captureBlocked = true; await locked.save(r);
    }
    return checked;
  };
  const processPayment = async (token: string, orderId?: string): Promise<TextIntakeCompletion | TextIntakePending> => {
    const auth = await authenticate(token, "payment");
    return await store.withRecord(auth.key, async locked => {
      const r = await locked.read();
      if (!r || !equalHash(r.paymentTokenHash, auth.hash)) throw new IntakeTextPaymentError("invalid_token");
      if (orderId !== undefined && (!PROVIDER_ID.test(orderId) || orderId !== r.orderId)) throw new IntakeTextPaymentError("payment_binding_rejected");
      if (r.state === "completed") return await complete(r, locked);
      await redactExpired(r, locked);
      if (r.state === "expired") throw new IntakeTextPaymentError("expired");
      // Already verified paid records NEVER ask PayPal for another charge, even during config outage.
      if (r.payment) return await complete(r, locked);
      if (!r.orderId) return pending(r);
      const c = await client(r.environment);
      const checked = await reconcile(r, locked, c); // Always GET before any capture; recover lost ACK.
      if (r.payment) return await complete(r, locked);
      if (!r.input || r.expiresAt <= now()) throw new IntakeTextPaymentError("expired");
      if (orderId === undefined || checked.status !== "APPROVED" || r.captureBlocked) return pending(r);
      if (r.captureAttemptAt !== undefined && now() - r.captureAttemptAt >= IDEMPOTENCY_WINDOW) throw new IntakeTextPaymentError("idempotency_expired");
      r.captureAttemptAt ??= now(); r.state = "capture_uncertain"; r.retentionUntil = null;
      await locked.save(r); // Durable cross-instance claim BEFORE capture POST.
      try {
        const raw = await provider(c, `/v2/checkout/orders/${r.orderId}/capture`, "POST", {}, r.captureRequestId);
        const captured = binding(raw, r, false, true);
        if (captured.status === "COMPLETED") await acceptPayment(r, raw, locked, true);
        else { r.captureBlocked = true; await locked.save(r); }
      } catch (error) {
        if (error instanceof IntakeTextPaymentError && error.code === "payment_binding_rejected") throw error;
        // Capture could have succeeded despite timeout/non-2xx; same request ID persists.
        try { await reconcile(r, locked, c); } catch { return pending(r); }
      }
      return r.payment ? await complete(r, locked) : pending(r);
    });
  };
  const exchange = async (token: string, kind: "payment" | "resume") => {
    const auth = await authenticate(token, kind);
    return await store.withRecord(auth.key, async locked => {
      const r = await locked.read();
      if (!r || !equalHash(kind === "resume" ? r.resumeTokenHash : r.paymentTokenHash, auth.hash)) throw new IntakeTextPaymentError("invalid_token");
      await redactExpired(r, locked);
      if (!r.input || (!r.payment && r.expiresAt <= now()) || r.state === "completed") throw new IntakeTextPaymentError("expired");
      const input = structuredClone(r.input);
      if (kind === "resume") {
        r.paymentToken = capability(); r.paymentTokenHash = store.hashCapability(r.paymentToken);
        r.reminderSentAt ??= now(); // Possession proves the reminder reached its recipient.
        delete r.resumeToken; delete r.resumeTokenHash;
        await locked.save(r);
      }
      return { input, payment_token: r.paymentToken, order_id: r.orderId ?? null, status: r.payment ? "PAID_AWAITING_DELIVERY" as const : "PENDING" as const };
    });
  };

  return {
    async configuration() {
      try {
        const c = await getConfig();
        if (!["sandbox", "live"].includes(c.mode)) throw new Error();
        const configured = !!(c.clientId && c.clientSecret);
        return { configured, client_id: configured ? c.clientId : null, environment: c.mode, amount: TEXT_INTAKE_AMOUNT };
      } catch { return { configured: false, client_id: null, environment: "sandbox", amount: TEXT_INTAKE_AMOUNT }; }
    },
    async create(raw) {
      // Parent validates signatures, consent, server test classification, allowed origins and normalized answers.
      try {
        const bytes = JSON.stringify(raw);
        if (!bytes || Buffer.byteLength(bytes) > 512_000) throw new Error();
        forbidPaymentData(raw);
      } catch { throw new IntakeTextPaymentError("invalid_input"); }
      const input = await deps.validate(raw);
      if (!UUID.test(input.submission_id) || intake(input).submission_id !== input.submission_id || typeof input.is_test !== "boolean"
        || input.signing === undefined || !input.resume_answers || typeof input.resume_answers !== "object") throw new IntakeTextPaymentError("invalid_input");
      forbidPaymentData(input);
      // Validation time is server bookkeeping, not a new patient action; keep the FIRST stored time.
      const { validated_at: _validatedAt, ...fingerprintInput } = input;
      const fingerprint = createHash("sha256").update(canonical(fingerprintInput)).digest("hex");
      const key = store.hashSubmission(input.submission_id);
      return await store.withRecord(key, async locked => {
        let r = await locked.read();
        if (r && r.fingerprint !== fingerprint) throw new IntakeTextPaymentError("changed_input");
        if (r) {
          await redactExpired(r, locked);
          if (r.state === "expired" || (!r.payment && r.expiresAt <= now())) throw new IntakeTextPaymentError("expired");
          if (r.orderId) return { order_id: r.orderId, payment_token: r.paymentToken, environment: r.environment };
        }
        const c = await config(r?.environment);
        if (!r) {
          const token = capability();
          const time = now();
          r = { input: structuredClone(input), fingerprint, createdAt: time, expiresAt: time + PENDING_TTL, retentionUntil: time + PENDING_TTL,
            state: "pending", environment: c.mode, paymentToken: token, paymentTokenHash: store.hashCapability(token), customId: randomUUID(),
            createRequestId: randomUUID(), captureRequestId: randomUUID(), deliveryIdempotencyKey: randomUUID(), reminderIdempotencyKey: randomUUID(),
            nextSweepAt: time + REMINDER_DELAY };
          await locked.save(r); // A storage failure aborts BEFORE OAuth/order creation.
        }
        if (r.createAttemptAt !== undefined && now() - r.createAttemptAt >= IDEMPOTENCY_WINDOW) throw new IntakeTextPaymentError("idempotency_expired");
        const api = await client(r.environment);
        r.createAttemptAt ??= now();
        await locked.save(r); // Persists stable request ID and earliest POST claim before provider side effect.
        const response = await provider(api, "/v2/checkout/orders", "POST", {
          intent: "CAPTURE", purchase_units: [{ custom_id: r.customId, description: TEXT_INTAKE_DESCRIPTION, amount: { value: TEXT_INTAKE_AMOUNT, currency_code: "USD" } }],
        }, r.createRequestId);
        const checked = binding(response, r, true);
        r.orderId = checked.id;
        await locked.save(r);
        if (checked.status === "COMPLETED") await acceptPayment(r, response, locked);
        return { order_id: r.orderId, payment_token: r.paymentToken, environment: r.environment };
      });
    },
    capture: input => processPayment(input.payment_token, input.order_id),
    status: token => processPayment(token),
    resume: token => exchange(token, "resume"),
    restore: token => exchange(token, "payment"),
    async receiptBySubmissionId(id) {
      if (!UUID.test(id)) return null;
      return await store.withRecord(store.hashSubmission(id), async locked => {
        const r = await locked.read();
        if (!r || r.state !== "completed" || !r.receipt || !r.payment
          || (r.retentionUntil !== null && r.retentionUntil <= now())) return null;
        return structuredClone(r.receipt) as TextIntakeCompletion;
      });
    },
    async sweep() {
      const stats = { processed: 0, sent: 0, expired: 0, recovered: 0 };
      const startedAt = Date.now();
      const candidates = await store.candidates(now(), SWEEP_LIMIT);
      for (const key of candidates.slice(0, SWEEP_LIMIT)) {
        // Reserve the next record's full 55s service budget within a 100s finite invocation.
        if (Date.now() - startedAt >= 45_000) break;
        stats.processed++;
        try {
          await store.withRecord(key, async locked => {
            const r = await locked.read();
            if (!r || r.state === "completed" || r.state === "expired" || r.nextSweepAt > now()) return;
            const wasExpired = !r.payment && r.expiresAt <= now();
            await redactExpired(r, locked); // Purge unpaid clinical snapshots even if provider is unavailable.
            if (wasExpired) stats.expired++;
            if ((r.state as TextPaymentStorageRecord["state"]) === "expired") return;
            r.nextSweepAt = now() + REMINDER_DELAY; await locked.save(r);
            if (r.payment) {
              const result = await complete(r, locked);
              if (result.payment_status === "COMPLETED") stats.recovered++;
              return;
            }
            // No merchant order => cannot prove nonpayment; do not send an ambiguous-create reminder.
            if (!r.orderId) return;
            const c = await client(r.environment);
            await reconcile(r, locked, c); // Read-only provider reconciliation; NEVER auto-capture abandoned orders.
            if (r.payment) {
              const result = await complete(r, locked);
              if (result.payment_status === "COMPLETED") stats.recovered++;
              return;
            }
            if (!r.input || wasExpired || r.captureBlocked || r.captureAttemptAt !== undefined
              || r.createdAt + REMINDER_DELAY > now() || r.reminderSentAt !== undefined || r.reminderSuppressed) return;
            if (intake(r.input).consents.sms_opt_in !== true) return;
            const hook = r.environment === "sandbox" ? deps.sendUnpaidSandbox : deps.sendUnpaid;
            if (!hook) { r.reminderSuppressed = true; await locked.save(r); return; }
            const origin = r.input.public_origin ?? origins[0];
            let url: URL;
            try {
              url = new URL(origin);
              if (url.protocol !== "https:" || url.origin !== origin || url.username || url.password || !origins.includes(origin)) throw new Error();
            } catch { throw new IntakeTextPaymentError("invalid_input"); }
            if (!r.resumeToken) {
              r.resumeToken = capability(); r.resumeTokenHash = store.hashCapability(r.resumeToken);
              await locked.save(r); // Stable one-time token must persist BEFORE reminder delivery.
            }
            const p = intake(r.input).patient;
            const compactPhone = p.phone.replace(/[\s().-]/g, "");
            if (!/^(?:\+?1)?[2-9]\d{2}[2-9]\d{6}$/.test(compactPhone)) throw new IntakeTextPaymentError("invalid_input");
            const phoneE164 = `+1${compactPhone.replace(/^\+?1(?=\d{10}$)/, "")}`;
            const payload: TextIntakeUnpaidPayload = { event: "intake_unpaid", first_name: p.first_name, last_name: p.last_name, email: p.email,
              phone: phoneE164, state: p.state, sms_opt_in: intake(r.input).consents.sms_opt_in, source: "website_intake", tags: "intake-unpaid",
              is_test: r.environment === "sandbox" || r.input.is_test, resume_url: `${url.origin}/intake/resume#token=${r.resumeToken}` };
            try {
              const accepted = await bounded(signal => hook(payload, r.reminderIdempotencyKey, signal), DELIVERY_TIMEOUT);
              if (accepted === true) { r.reminderSentAt = now(); await locked.save(r); stats.sent++; }
              else note("reminder_pending");
            } catch { note("reminder_pending"); }
          });
        } catch { note("sweep_pending"); }
      }
      await store.cleanup(now());
      return stats;
    },
  };
}
