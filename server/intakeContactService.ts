import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { ENV } from "./_core/env";
import { getIntakeDeliverySettings } from "./db";
import { decryptIntakeCredential } from "./intakeCredentialCrypto";
import { createIntakePrivateBlobDb, type IntakePrivateBlobDb } from "./intakePrivateBlobDb";
import type { CompletedFreeIntakeReceipt } from "./intakeSubmissionContract";
import { buildGhlIntakePhoneCorrectionPayload, type IntakeCorrectionContact } from "./ghlIntakePhoneCorrectionPayload";

const DOMAIN = "mmd-intake-contact-v1";
const PREFIX = "intake-contact/v1/";
const RETENTION_MS = 24 * 60 * 60_000;
const MAX_CORRECTIONS = 10;
const MAX_CONTACTS = 2000;
const MAX_ATTEMPTS = 3;
const LEASE_MS = 30_000;
const HTTP_TIMEOUT_MS = 3000;
const receiptSchema = z.object({
  submission_id: z.string().uuid(), submitted_at: z.string().datetime({ offset: true }),
  is_test: z.boolean(), sms_opt_in: z.boolean(), video_visit_interest: z.boolean(),
}).strict();
const tokenSchema = receiptSchema.extend({
  version: z.literal(1), purpose: z.literal("completed_free_intake"), expires_at: z.number().int().positive(),
}).strict();
const contactSchema = z.object({
  first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100),
  email: z.string().email().max(254), phone: z.string().regex(/^\+1[2-9]\d{2}[2-9]\d{6}$/),
}).strict();
const providerSchema = z.object({ status: z.enum(["pending", "sent", "failed"]), attempts: z.number().int().min(0).max(MAX_ATTEMPTS) }).strict();
const correctionSchema = z.object({
  request_id: z.string().uuid(), event_id: z.string().uuid(), old_phone: contactSchema.shape.phone,
  new_phone: contactSchema.shape.phone, timestamp: z.string().datetime(),
  keragon: providerSchema, ghl: providerSchema, committed: z.boolean(),
  lease_owner: z.string().uuid().nullable(), lease_until: z.number().int(),
}).strict();
const recordSchema = z.object({
  version: z.literal(1), receipt: receiptSchema, contact: contactSchema,
  accepted_at: z.number().int(), expires_at: z.number().int(), revision: z.number().int().nonnegative(),
  requests: z.array(z.object({ id: z.string().uuid(), phone: contactSchema.shape.phone }).strict()).max(MAX_CORRECTIONS),
  correction: correctionSchema.nullable(), rate_window: z.number().int(), reads: z.number().int().nonnegative(),
}).strict();
type RecordValue = z.infer<typeof recordSchema>;
type Correction = z.infer<typeof correctionSchema>;
type Provider = "keragon" | "ghl";
export type IntakeContactStatus = "original" | "pending" | "updated" | "failed";
export type IntakeContactConfirmation = {
  submission_id: string; phone: string; requested_phone?: string; is_test: boolean;
  revision: number; status: IntakeContactStatus; delivery?: { keragon: string; ghl: string };
};
export class IntakeContactError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}
const unavailable = () => new IntakeContactError(503, "Phone details are temporarily unavailable. Please try again or call our Care Team at (888) 362-7011.");
const denied = () => new IntakeContactError(401, "This intake receipt is unavailable or expired. Please contact our Care Team.");
const conflict = () => new IntakeContactError(409, "A phone correction is already in progress or this request is outdated. Please refresh the phone details.");

/** Identical NANP/US formatting rules to validateWebsiteCareSmsConsent and MmdCareUsPhone. */
export function normalizeIntakeCorrectionPhone(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const phone = value.trim(), compact = phone.replace(/[\s().-]/g, "");
  if (!/^[\d\s().+-]+$/.test(phone) || !/^(?:\+?1)?[2-9]\d{2}[2-9]\d{6}$/.test(compact)) return null;
  return `+1${compact.replace(/^\+/, "").slice(-10)}`;
}

export type IntakeContactDependencies = {
  blobDb?: IntakePrivateBlobDb; secret?: string; now?: () => number; fetch?: typeof fetch;
  /** Tests inject synthetic destinations; production retains existing Keragon secret-first/admin fallback and GHL ENV. */
  destinations?: () => Promise<{ keragon: string; ghl: string }>;
  warn?: (message: string) => void;
};
export function createIntakeContactService(deps: IntakeContactDependencies = {}) {
  const db = deps.blobDb ?? createIntakePrivateBlobDb();
  const now = deps.now ?? Date.now;
  const fetcher = deps.fetch ?? ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));
  let active: Promise<void> | null = null;
  function warn() { try { (deps.warn ?? console.warn)("[IntakeContact] operation_unavailable."); } catch { /* Fixed code only. */ } }
  function secret(): string {
    // Never let historical mocked intake tests instantiate a production DB/provider operation.
    if (process.env.VITEST && !deps.blobDb) throw unavailable();
    const value = deps.secret ?? ENV.cookieSecret;
    if (!value || value.length < 16) throw unavailable();
    return value;
  }
  function digest(kind: string, value: string) { return createHmac("sha256", secret()).update(`${DOMAIN}:${kind}:${value}`).digest("hex"); }
  function key(id: string) { return `${PREFIX}${digest("submission", id)}`; }
  async function load(recordKey: string): Promise<RecordValue | null> {
    const bytes = await db.get(recordKey);
    if (!bytes) return null;
    const parsed = recordSchema.safeParse(JSON.parse(bytes.toString("utf8")));
    if (!parsed.success || parsed.data.expires_at <= now() || parsed.data.expires_at > parsed.data.accepted_at + RETENTION_MS) throw unavailable();
    return parsed.data;
  }
  async function persist(recordKey: string, record: RecordValue) {
    // Projection already occurred before this boundary. Only encrypted blobDb handles persistence.
    await db.put(recordKey, Buffer.from(JSON.stringify(recordSchema.parse(record))), record.expires_at);
  }
  function verify(token: string) {
    secret();
    if (typeof token !== "string" || token.length > 4096) throw denied();
    const parts = token.split(".");
    if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) throw denied();
    const expected = Buffer.from(createHmac("sha256", secret()).update(parts[0]).digest("base64url"));
    const actual = Buffer.from(parts[1]);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw denied();
    let payload: unknown;
    try { payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")); } catch { throw denied(); }
    const parsed = tokenSchema.safeParse(payload);
    if (!parsed.success || parsed.data.expires_at <= now()) throw denied();
    return parsed.data;
  }
  async function authorized(token: string, work: (record: RecordValue, recordKey: string) => Promise<IntakeContactConfirmation>) {
    const signed = verify(token), recordKey = key(signed.submission_id);
    return db.withLock(`${recordKey}/edit`, async () => {
      const record = await load(recordKey);
      if (!record || !Object.entries(record.receipt).every(([name, value]) => signed[name as keyof typeof signed] === value)) throw denied();
      if (now() - record.rate_window >= 60_000) { record.rate_window = now(); record.reads = 0; }
      if (record.reads >= 60) throw new IntakeContactError(429, "Please wait a minute before trying again.");
      record.reads++;
      // Durable rate accounting also applies to invalid revisions/replays, across app instances.
      await persist(recordKey, record);
      return work(record, recordKey);
    });
  }
  function status(record: RecordValue): IntakeContactStatus {
    const correction = record.correction;
    if (!correction) return "original";
    if (correction.committed) return "updated";
    if (correction.keragon.status === "failed" || correction.ghl.status === "failed") return "failed";
    return "pending";
  }
  function view(record: RecordValue): IntakeContactConfirmation {
    const correction = record.correction;
    return {
      submission_id: record.receipt.submission_id, phone: record.contact.phone,
      is_test: record.receipt.is_test, revision: record.revision, status: status(record),
      ...(correction ? { delivery: { keragon: correction.keragon.status, ghl: correction.ghl.status },
        ...(!correction.committed ? { requested_phone: correction.new_phone } : {}) } : {}),
    };
  }
  function hasWork(record: RecordValue): boolean {
    const job = record.correction;
    return !!job && !job.committed && (job.keragon.status === "pending" || job.ghl.status === "pending"
      || (job.keragon.status === "sent" && job.ghl.status === "sent"));
  }
  async function saveAccepted(receiptValue: CompletedFreeIntakeReceipt, contactValue: IntakeCorrectionContact): Promise<void> {
    const receipt = receiptSchema.parse(receiptValue);
    const phone = normalizeIntakeCorrectionPhone(contactValue.phone);
    if (!phone) throw unavailable();
    // Explicit four-field projection: never retain draft, DOB, state, address, answers, consent text, or forms.
    const contact = contactSchema.parse({ first_name: contactValue.first_name, last_name: contactValue.last_name, email: contactValue.email, phone });
    if (Object.values(contact).some(value => /[\u0000-\u001f\u007f]/.test(value))) throw unavailable();
    const recordKey = key(receipt.submission_id);
    await db.withLock(`${PREFIX}capacity`, async () => {
      await db.withLock(`${recordKey}/edit`, async () => {
        const previous = await load(recordKey);
        if (previous) {
          if (JSON.stringify(previous.receipt) !== JSON.stringify(receipt)) throw conflict();
          return; // Recovery must never overwrite a corrected number or extend its absolute TTL.
        }
        if ((await db.list(PREFIX)).length >= MAX_CONTACTS) throw unavailable();
        const acceptedAt = now();
        await persist(recordKey, { version: 1, receipt, contact, accepted_at: acceptedAt,
          expires_at: acceptedAt + RETENTION_MS, revision: 0, requests: [], correction: null,
          rate_window: acceptedAt, reads: 0 });
      });
    });
  }
  async function confirmation(token: string) {
    const result = await authorized(token, async record => view(record));
    if (result.status === "pending" || Object.values(result.delivery ?? {}).includes("pending")) kick();
    return result;
  }
  async function correct(token: string, newPhone: string, requestId: string, expectedRevision: number) {
    const phone = normalizeIntakeCorrectionPhone(newPhone);
    if (!phone) throw new IntakeContactError(400, "Please enter a valid US mobile phone number.");
    if (!z.string().uuid().safeParse(requestId).success || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw conflict();
    const result = await authorized(token, async (record, recordKey) => {
      const replay = record.requests.find(request => request.id === requestId);
      if (replay) {
        if (replay.phone !== phone || record.correction?.request_id !== requestId) throw conflict();
        return view(record); // No new event, attempts, timestamp, or revision on a retry.
      }
      if (record.revision !== expectedRevision || (record.correction && !record.correction.committed)) throw conflict();
      if (phone === record.contact.phone) return view(record); // No-op is not a correction or telemetry success.
      if (record.requests.length >= MAX_CORRECTIONS) throw new IntakeContactError(429, "Please contact our Care Team for further corrections.");
      record.requests.push({ id: requestId, phone });
      record.correction = { request_id: requestId, event_id: randomUUID(), old_phone: record.contact.phone,
        new_phone: phone, timestamp: new Date(now()).toISOString(), committed: false,
        keragon: { status: "pending", attempts: 0 }, ghl: { status: "pending", attempts: 0 },
        lease_owner: null, lease_until: 0 };
      record.revision++;
      // Atomic durable embedded outbox write BEFORE releasing a patient request or calling either provider.
      await persist(recordKey, record);
      return view(record);
    });
    if (result.status === "pending" || Object.values(result.delivery ?? {}).includes("pending")) kick();
    return result;
  }
  async function destinations() {
    if (deps.destinations) return deps.destinations();
    let keragon = (ENV.keragonWebhookUrl ?? "").trim();
    if (!keragon) {
      const settings = await getIntakeDeliverySettings();
      if (settings?.keragonWebhookUrlEncrypted) keragon = decryptIntakeCredential(settings.keragonWebhookUrlEncrypted);
    }
    return { keragon, ghl: ENV.ghlIntakeWebhookUrl ?? "" };
  }
  function endpoint(value: string): string | null {
    try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.hash ? value : null; } catch { return null; }
  }
  async function processRecord(recordKey: string) {
    const owner = randomUUID();
    const claimed = await db.withLock(`${recordKey}/edit`, async () => {
      const record = await load(recordKey), job = record?.correction;
      if (!record || !job || !hasWork(record) || job.lease_until > now()) return false;
      job.lease_owner = owner; job.lease_until = now() + LEASE_MS;
      await persist(recordKey, record);
      return true;
    });
    if (!claimed) return;
    let urls: { keragon: string; ghl: string };
    try { urls = await destinations(); } catch { urls = { keragon: "", ghl: "" }; }
    for (const provider of ["keragon", "ghl"] as const) {
      for (let count = 0; count < MAX_ATTEMPTS; count++) {
        const reserved = await db.withLock(`${recordKey}/edit`, async () => {
          const record = await load(recordKey), job = record?.correction;
          if (!record || !job || job.lease_owner !== owner || job.lease_until <= now() || job[provider].status !== "pending") return null;
          if (job[provider].attempts >= MAX_ATTEMPTS) {
            job[provider].status = "failed"; await persist(recordKey, record); return null;
          }
          job[provider].attempts++; // Crash consumes its reserved attempt; retries can never reset the cap.
          await persist(recordKey, record);
          const payload = provider === "keragon" ? {
            event: "mmd_intake.phone_corrected", submission_id: record.receipt.submission_id,
            old_phone: job.old_phone, new_phone: job.new_phone, timestamp: job.timestamp,
            is_test: record.receipt.is_test,
          } : buildGhlIntakePhoneCorrectionPayload({ ...record.contact, phone: job.new_phone }, record.receipt.submission_id, job.timestamp, record.receipt.is_test);
          return { eventId: job.event_id, body: JSON.stringify(payload) };
        });
        if (!reserved) break;
        let sent = false;
        const url = endpoint(urls[provider]);
        if (url) {
          try {
            const response = await fetcher(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json",
              "Idempotency-Key": `mmd-phone-${digest(provider, reserved.eventId)}` }, body: reserved.body,
              redirect: "error", signal: AbortSignal.timeout(HTTP_TIMEOUT_MS) });
            sent = response.status >= 200 && response.status < 300;
            try { void response.body?.cancel().catch(() => {}); } catch { /* Never read provider bodies. */ }
          } catch { /* No response/error/URL/PHI logging. */ }
        }
        await db.withLock(`${recordKey}/edit`, async () => {
          const record = await load(recordKey), job = record?.correction;
          if (!record || !job || job.event_id !== reserved.eventId || job.lease_owner !== owner || job.lease_until <= now()) return;
          job[provider].status = sent ? "sent" : job[provider].attempts >= MAX_ATTEMPTS ? "failed" : "pending";
          await persist(recordKey, record);
        });
        if (sent) break;
      }
    }
    await db.withLock(`${recordKey}/edit`, async () => {
      const record = await load(recordKey), job = record?.correction;
      if (!record || !job || job.lease_owner !== owner || job.lease_until <= now()) return;
      if (job.keragon.status === "sent" && job.ghl.status === "sent") {
        record.contact.phone = job.new_phone; job.committed = true;
      }
      job.lease_owner = null; job.lease_until = 0;
      await persist(recordKey, record); // A failed commit remains pending, never a fake Updated response.
    });
  }
  async function flush(): Promise<void> {
    secret();
    const keys = await db.list(PREFIX);
    let worked = 0;
    for (const recordKey of keys) {
      const record = await load(recordKey);
      if (record?.correction && hasWork(record) && record.correction.lease_until <= now()) {
        await processRecord(recordKey);
        if (++worked >= 5) break;
      }
    }
  }
  function kick(): void {
    // One bounded finite pass per process; no recurring timers, cron, or configured schedule.
    if (active) return;
    active = flush().catch(warn).then(() => { active = null; });
  }
  async function idle() { while (active) await active; }
  return { saveAccepted, confirmation, correct, kick, flush, idle };
}

const service = createIntakeContactService();
export function getIntakeContactService() { return service; }
