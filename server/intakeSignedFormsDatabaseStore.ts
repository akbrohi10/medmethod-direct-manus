import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Express, NextFunction, Request, Response } from "express";
import { ENV } from "./_core/env";
import {
  createIntakePrivateBlobDb,
  isIntakePrivateBlobDbError,
  type IntakePrivateBlobDb,
} from "./intakePrivateBlobDb";
import {
  IntakeSignedFormsStoreError,
  type IntakeSignedFormInput,
  type IntakeSignedFormManifest,
  type IntakeSignedFormsMetadata,
  type IntakeSignedFormsPrepareResult,
  type IntakeSignedFormsRecord,
} from "./intakeSignedFormsStore";

/**
 * Database implementation of the short-lived signed-form store.
 *
 * All database values pass through intakePrivateBlobDb: form PDFs, signer details, original file
 * names, bearer tokens, submission IDs, and fingerprints are AES-256-GCM ciphertext. The only
 * database lookup columns are HMAC-derived opaque identifiers maintained by that common store.
 * TiDB TTL cleans physical rows asynchronously after 24 hours; this class independently enforces
 * the exact application expiry on every read.
 */

const VERSION = "mmd-intake-signed-forms-db-v2";
const NAMESPACE = "mmd/intake-signed-forms/v2";
const CAPACITY_LOCK = `${NAMESPACE}/capacity`;
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_PDF_BYTES = 2 * 1024 * 1024;
const REQUIRED_FORM_COUNT = 5;
const MAX_SUBMISSIONS = 100;
const MAX_TOTAL_PDF_BYTES = 500 * 1024 * 1024;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const FORM_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const CANONICAL_FORMS = ["glp1", "general", "telehealth", "privacy", "policy"] as const;
const KNOWN_PUBLIC_ORIGINS = new Map<string, string>([
  ["www.medmethoddirect.com", "https://www.medmethoddirect.com"],
  ["medmethoddirect.com", "https://medmethoddirect.com"],
  ["medmethod-kywclyds.manus.space", "https://medmethod-kywclyds.manus.space"],
  ["3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer", "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer"],
]);

type FormState = "prepared" | "attempted" | "delivered";

type StoredPdf = {
  form: string;
  title: string;
  file_name: string;
  token: string;
  token_hash: string;
  byte_length: number;
  pdf_key: string;
};

type StoredLedger = {
  version: 2;
  submission_hash: string;
  fingerprint: string;
  state: FormState;
  result?: Record<string, unknown>;
  created_at: number;
  expires_at: number;
  forms: StoredPdf[];
  signed_at: string;
  signer_name: string;
  relation: string;
  public_origin: string;
};

type DownloadIndex = {
  version: 1;
  token: string;
  token_hash: string;
  file_name: string;
  byte_length: number;
  pdf_key: string;
  expires_at: number;
};

export type IntakeSignedFormsDatabaseStoreDependencies = {
  /** Existing server-only JWT_SECRET/cookie secret. Missing or weak values fail closed. */
  secret?: string;
  /** Injectable clock used by tests. */
  now?: () => number;
  /** Canonical public origin; otherwise a strict request-Host allowlist is used. */
  publicOrigin?: string;
  /** Injectable common encrypted store, intended only for isolated unit tests. */
  blobDb?: IntakePrivateBlobDb;
};

function storeError(status: number, message = "Signed forms are unavailable.") {
  return new IntakeSignedFormsStoreError(status, message);
}

function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function noStore(res: Response) {
  res.set({
    "Cache-Control": "no-store, private, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
}

function contentDisposition(fileName: string): string {
  const fallback = (fileName.replace(/[^A-Za-z0-9._-]/g, "_") || "signed-form.pdf").slice(0, 120);
  const encoded = encodeURIComponent(fileName).replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

function operation(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, _next: NextFunction) => {
    void handler(req, res).catch(error => {
      // Capability paths must not enter generic Express handlers that can log their URL.
      if (!res.headersSent) {
        const safe = error instanceof IntakeSignedFormsStoreError ? error : storeError(500);
        noStore(res);
        res.status(safe.status).json({ error: safe.message });
      }
    });
  };
}

function safeFileName(value: unknown): string {
  if (typeof value !== "string" || !value || value.length > 180) throw storeError(400, "A safe PDF filename is required.");
  let normalized: string;
  try { normalized = value.normalize("NFC"); } catch { throw storeError(400, "A safe PDF filename is required."); }
  if (Buffer.byteLength(normalized, "utf8") > 240 || /[\\/\u0000-\u001f\u007f]/.test(normalized) || normalized === "." || normalized === ".." || !/\.pdf$/i.test(normalized)) {
    throw storeError(400, "A safe PDF filename is required.");
  }
  return normalized;
}

function validToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

function validFingerprint(value: unknown): value is string {
  return typeof value === "string" && value.length >= 16 && value.length <= 512 && !/[\u0000-\u001f\u007f]/.test(value);
}

function validSubmissionId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 256 && !/[\u0000-\u001f\u007f]/.test(value);
}

function configuredOrigin(deps: IntakeSignedFormsDatabaseStoreDependencies): string | null {
  const raw = deps.publicOrigin ?? process.env.INTAKE_PUBLIC_ORIGIN ?? process.env.PUBLIC_ORIGIN ?? process.env.APP_URL;
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function validOrigin(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && !parsed.username && !parsed.password
      && parsed.pathname === "/" && !parsed.search && !parsed.hash && parsed.origin === value;
  } catch {
    return false;
  }
}

function readHeader(req: Request, name: string): string | undefined {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? undefined : value;
}

function parseHost(header: string | undefined): { host: string; hostname: string } | null {
  if (!header || header.length > 255 || /[\s,\\/@]/.test(header)) return null;
  try {
    const parsed = new URL(`http://${header}`);
    if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) return null;
    return { host: parsed.host.toLowerCase(), hostname: parsed.hostname.toLowerCase() };
  } catch {
    return null;
  }
}

function hostnameIsLocal(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
}

function trustedOriginFor(req: Request, deps: IntakeSignedFormsDatabaseStoreDependencies): string {
  const host = parseHost(readHeader(req, "host"));
  const configured = configuredOrigin(deps);
  const production = process.env.NODE_ENV === "production";
  if (configured) {
    const expected = new URL(configured);
    if (!host || expected.host.toLowerCase() !== host.host || (production && expected.protocol !== "https:")) {
      throw storeError(403, "Signed-form storage is not configured for this origin.");
    }
    return expected.origin;
  }
  if (!host) throw storeError(403, "Signed-form storage is not configured for this origin.");
  const known = KNOWN_PUBLIC_ORIGINS.get(host.host);
  if (known) return known;
  const protocol = req.protocol;
  if (!production && hostnameIsLocal(host.hostname) && (protocol === "http" || protocol === "https")) return `${protocol}://${host.host}`;
  throw storeError(503, "Signed-form storage is not configured for this origin.");
}

function safeReceipt(value: Record<string, unknown>): Record<string, unknown> {
  const allowed = new Set([
    "accepted", "ok", "status", "status_code", "receipt_id", "delivery_id", "request_id", "event_id", "completed_at",
    "submission_id", "submission_token", "sms_opt_in", "video_visit_interest", "is_test", "payment_status", "redirect_url",
  ]);
  const result: Record<string, unknown> = { completed: true };
  for (const [key, candidate] of Object.entries(value ?? {})) {
    if (!allowed.has(key)) continue;
    if (typeof candidate === "boolean") result[key] = candidate;
    if (typeof candidate === "number" && Number.isFinite(candidate)) result[key] = candidate;
    if (typeof candidate === "string" && candidate.length <= 2048 && !/[\u0000-\u001f\u007f]/.test(candidate)) result[key] = candidate;
  }
  return result;
}

function urlAliases(forms: IntakeSignedFormManifest[]): Omit<IntakeSignedFormsPrepareResult, "signed_forms"> {
  const byForm = new Map(forms.map(form => [form.form, form.url]));
  const required = (form: (typeof CANONICAL_FORMS)[number]) => {
    const url = byForm.get(form);
    if (!url) throw storeError(500);
    return url;
  };
  return {
    glp1_consent_url: required("glp1"),
    general_consent_url: required("general"),
    telehealth_consent_url: required("telehealth"),
    privacy_notice_ack_url: required("privacy"),
    medication_policy_url: required("policy"),
  };
}

/** A lazy database-backed signed-form ledger; construction and route registration perform no I/O. */
export class IntakeSignedFormsDatabaseStore {
  private readonly now: () => number;
  private blob: IntakePrivateBlobDb | undefined;

  constructor(private readonly deps: IntakeSignedFormsDatabaseStoreDependencies = {}) {
    this.now = deps.now ?? Date.now;
  }

  private secret(): string {
    const secret = this.deps.secret ?? ENV.cookieSecret;
    if (!secret || secret.length < 16) throw storeError(503, "Signed-form storage is not configured.");
    return secret;
  }

  private key(): Buffer {
    return createHash("sha256").update(this.secret(), "utf8").update(`:${VERSION}:key`, "utf8").digest();
  }

  private digest(kind: string, value: string): string {
    return createHmac("sha256", this.key()).update(`${VERSION}:${kind}:`, "utf8").update(value, "utf8").digest("base64url");
  }

  private blobDb(): IntakePrivateBlobDb {
    // createIntakePrivateBlobDb itself is lazy: DATABASE_URL parsing/pool use happens at the first
    // operation, never while app routes are registered.
    this.blob ??= this.deps.blobDb ?? createIntakePrivateBlobDb({ secret: this.secret(), now: this.now });
    return this.blob;
  }

  private ledgerKey(submissionId: string): string {
    if (!validSubmissionId(submissionId)) throw storeError(400, "The signed-form submission is invalid.");
    return `${NAMESPACE}/ledger/${this.digest("submission", submissionId)}`;
  }

  private lockName(submissionId: string): string {
    if (!validSubmissionId(submissionId)) throw storeError(400, "The signed-form submission is invalid.");
    return `${NAMESPACE}/lock/${this.digest("submission", submissionId)}`;
  }

  private pdfKey(tokenHash: string): string {
    return `${NAMESPACE}/pdf/${this.digest("pdf", tokenHash)}`;
  }

  private tokenIndexKey(token: string): string {
    return `${NAMESPACE}/token/${this.digest("token", token)}`;
  }

  private submissionHash(submissionId: string): string {
    return this.digest("submission-hash", submissionId);
  }

  private tokenHash(token: string): string {
    return this.digest("token-hash", token);
  }

  private dbError(error: unknown): IntakeSignedFormsStoreError {
    if (error instanceof IntakeSignedFormsStoreError) return error;
    // A real lease contention means another healthy instance may own the one-way delivery claim.
    // Returning 409 is critical: callers must never fall back and post an unclaimed duplicate.
    if (isIntakePrivateBlobDbError(error) && error.reason === "busy") {
      return storeError(409, "The signed-form submission was already claimed for delivery.");
    }
    return storeError(503, "Signed-form storage is temporarily unavailable.");
  }

  private async locked<T>(submissionId: string, work: () => Promise<T>): Promise<T> {
    try {
      return await this.blobDb().withLock(this.lockName(submissionId), work);
    } catch (error) {
      throw this.dbError(error);
    }
  }

  private async value(key: string): Promise<Buffer | null> {
    try {
      return await this.blobDb().get(key);
    } catch (error) {
      throw this.dbError(error);
    }
  }

  private async put(key: string, value: Buffer, expiresAt: number): Promise<void> {
    try {
      await this.blobDb().put(key, value, expiresAt);
    } catch (error) {
      throw this.dbError(error);
    }
  }

  private async remove(key: string): Promise<void> {
    try {
      await this.blobDb().delete(key);
    } catch (error) {
      throw this.dbError(error);
    }
  }

  private parseLedger(bytes: Buffer | null, expectedSubmissionHash: string): StoredLedger | null {
    if (!bytes) return null;
    try {
      const ledger = JSON.parse(bytes.toString("utf8")) as Partial<StoredLedger>;
      if (!ledger || ledger.version !== 2 || ledger.submission_hash !== expectedSubmissionHash || !validFingerprint(ledger.fingerprint)
        || !["prepared", "attempted", "delivered"].includes(String(ledger.state))
        || !Number.isInteger(ledger.created_at) || !Number.isInteger(ledger.expires_at) || ledger.created_at! <= 0
        || ledger.expires_at! < ledger.created_at! || ledger.expires_at! - ledger.created_at! > TTL_MS
        || !Array.isArray(ledger.forms) || ledger.forms.length !== REQUIRED_FORM_COUNT
        || new Set(ledger.forms.map(form => form.form)).size !== REQUIRED_FORM_COUNT
        || !CANONICAL_FORMS.every(form => ledger.forms!.some(candidate => candidate.form === form))
        || typeof ledger.signed_at !== "string" || ledger.signed_at.length < 1 || ledger.signed_at.length > 80
        || typeof ledger.signer_name !== "string" || ledger.signer_name.length < 1 || ledger.signer_name.length > 200
        || typeof ledger.relation !== "string" || ledger.relation.length > 200 || !validOrigin(ledger.public_origin)) return null;
      const validForms = ledger.forms.every(form => form && typeof form === "object" && FORM_PATTERN.test(form.form)
        && typeof form.title === "string" && form.title.length > 0 && form.title.length <= 300
        && typeof form.file_name === "string" && (() => { try { return safeFileName(form.file_name) === form.file_name; } catch { return false; } })()
        && validToken(form.token) && typeof form.token_hash === "string" && form.token_hash === this.tokenHash(form.token)
        && Number.isInteger(form.byte_length) && form.byte_length > 0 && form.byte_length < MAX_PDF_BYTES
        && typeof form.pdf_key === "string" && form.pdf_key === this.pdfKey(form.token_hash));
      return validForms ? ledger as StoredLedger : null;
    } catch {
      return null;
    }
  }

  private async readLedger(submissionId: string): Promise<StoredLedger | null> {
    const key = this.ledgerKey(submissionId);
    const ledger = this.parseLedger(await this.value(key), this.submissionHash(submissionId));
    if (!ledger) return null;
    if (ledger.expires_at <= this.now()) {
      await this.deleteLedger(key, ledger).catch(() => undefined);
      return null;
    }
    return ledger;
  }

  private async deleteLedger(ledgerKey: string, ledger: StoredLedger): Promise<void> {
    await Promise.all([
      this.remove(ledgerKey),
      ...ledger.forms.flatMap(form => [this.remove(form.pdf_key), this.remove(this.tokenIndexKey(form.token))]),
    ]);
  }

  private manifest(ledger: StoredLedger): IntakeSignedFormManifest[] {
    return ledger.forms.map(form => ({
      form: form.form,
      title: form.title,
      file_name: form.file_name,
      url: `${ledger.public_origin}/api/intake/signed-forms/${form.token}`,
      signed_at: ledger.signed_at,
      signer_name: ledger.signer_name,
      relation: ledger.relation,
    }));
  }

  private publicRecord(ledger: StoredLedger): IntakeSignedFormsRecord {
    const signed_forms = this.manifest(ledger);
    return {
      fingerprint: ledger.fingerprint,
      state: ledger.state,
      ...(ledger.result ? { result: { ...ledger.result } } : {}),
      forms: { ...urlAliases(signed_forms), signed_forms },
      expiresAt: ledger.expires_at,
    };
  }

  private validatePreparedPdfs(pdfs: IntakeSignedFormInput[]): IntakeSignedFormInput[] {
    if (!Array.isArray(pdfs) || pdfs.length !== REQUIRED_FORM_COUNT || new Set(pdfs.map(pdf => pdf?.form)).size !== REQUIRED_FORM_COUNT || !CANONICAL_FORMS.every(form => pdfs.some(pdf => pdf?.form === form))) {
      throw storeError(400, "Exactly five signed PDFs are required.");
    }
    return pdfs.map(pdf => {
      if (!pdf || !FORM_PATTERN.test(pdf.form) || typeof pdf.title !== "string" || !pdf.title.trim() || pdf.title.length > 300
        || !Buffer.isBuffer(pdf.bytes) || pdf.bytes.length === 0 || pdf.bytes.length >= MAX_PDF_BYTES || pdf.bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw storeError(400, "A signed PDF is invalid.");
      }
      return { form: pdf.form, title: pdf.title.trim(), file_name: safeFileName(pdf.file_name), bytes: Buffer.from(pdf.bytes) };
    });
  }

  private validateMetadata(metadata: IntakeSignedFormsMetadata): IntakeSignedFormsMetadata {
    if (!metadata || typeof metadata.signed_at !== "string" || metadata.signed_at.length < 1 || metadata.signed_at.length > 80
      || typeof metadata.signer_name !== "string" || !metadata.signer_name.trim() || metadata.signer_name.length > 200
      || typeof metadata.relation !== "string" || metadata.relation.length > 200) throw storeError(400, "Signed-form metadata is invalid.");
    return { signed_at: metadata.signed_at, signer_name: metadata.signer_name.trim(), relation: metadata.relation.trim() };
  }

  private async liveLedgers(): Promise<StoredLedger[]> {
    let keys: string[];
    try {
      keys = await this.blobDb().list(`${NAMESPACE}/ledger/`);
    } catch (error) {
      throw this.dbError(error);
    }
    const ledgers = await Promise.all(keys.map(async key => {
      const value = await this.value(key);
      // The HMAC-addressed ledger key contains no raw submission ID, and each encrypted record
      // self-validates its internal derived submission hash before contributing to capacity.
      try {
        const parsed = value ? JSON.parse(value.toString("utf8")) as Partial<StoredLedger> : null;
        const hash = typeof parsed?.submission_hash === "string" ? parsed.submission_hash : "";
        return hash ? this.parseLedger(value, hash) : null;
      } catch { return null; }
    }));
    return ledgers.filter((ledger): ledger is StoredLedger => ledger !== null && ledger.expires_at > this.now());
  }

  async prepare(req: Request, submissionId: string, fingerprint: string, pdfs: IntakeSignedFormInput[], metadata: IntakeSignedFormsMetadata): Promise<IntakeSignedFormsPrepareResult> {
    if (!validFingerprint(fingerprint)) throw storeError(400, "The signed-form submission is invalid.");
    const safePdfs = this.validatePreparedPdfs(pdfs);
    const safeMetadata = this.validateMetadata(metadata);
    const ledgerKey = this.ledgerKey(submissionId);
    return this.locked(submissionId, async () => {
      const existing = await this.readLedger(submissionId);
      if (existing) {
        if (!constantTimeEqual(existing.fingerprint, fingerprint)) throw storeError(409, "The signed-form submission does not match the original request.");
        const signed_forms = this.manifest(existing);
        return { ...urlAliases(signed_forms), signed_forms };
      }
      try {
        return await this.blobDb().withLock(CAPACITY_LOCK, async () => {
          const publicOrigin = trustedOriginFor(req, this.deps);
          const ledgers = await this.liveLedgers();
          const totalBytes = ledgers.flatMap(ledger => ledger.forms).reduce((sum, form) => sum + form.byte_length, 0);
          const newBytes = safePdfs.reduce((sum, pdf) => sum + pdf.bytes.length, 0);
          if (ledgers.length >= MAX_SUBMISSIONS || totalBytes + newBytes > MAX_TOTAL_PDF_BYTES) throw storeError(503, "Signed-form storage is at capacity.");

          const createdAt = this.now();
          const expiresAt = createdAt + TTL_MS;
          const forms: StoredPdf[] = safePdfs.map(pdf => {
            const token = randomBytes(32).toString("base64url");
            if (!validToken(token)) throw storeError(503);
            const token_hash = this.tokenHash(token);
            return { form: pdf.form, title: pdf.title, file_name: pdf.file_name, token, token_hash, byte_length: pdf.bytes.length, pdf_key: this.pdfKey(token_hash) };
          });
          const ledger: StoredLedger = {
            version: 2,
            submission_hash: this.submissionHash(submissionId),
            fingerprint,
            state: "prepared",
            created_at: createdAt,
            expires_at: expiresAt,
            forms,
            signed_at: safeMetadata.signed_at,
            signer_name: safeMetadata.signer_name,
            relation: safeMetadata.relation,
            public_origin: publicOrigin,
          };
          const indexes: DownloadIndex[] = forms.map(form => ({
            version: 1, token: form.token, token_hash: form.token_hash, file_name: form.file_name,
            byte_length: form.byte_length, pdf_key: form.pdf_key, expires_at: expiresAt,
          }));
          try {
            // Each encrypted object write is transactionally complete (header, revision, expiry,
            // and all ciphertext chunks). The encrypted ledger is the visibility marker: PDFs and
            // indexes are written first and compensated if anything fails, so a recovered ledger
            // is complete.
            for (let index = 0; index < forms.length; index += 1) await this.put(forms[index].pdf_key, safePdfs[index].bytes, expiresAt);
            for (let index = 0; index < forms.length; index += 1) await this.put(this.tokenIndexKey(forms[index].token), Buffer.from(JSON.stringify(indexes[index]), "utf8"), expiresAt);
            await this.put(ledgerKey, Buffer.from(JSON.stringify(ledger), "utf8"), expiresAt);
          } catch (error) {
            await this.deleteLedger(ledgerKey, ledger).catch(() => undefined);
            throw error;
          }
          const signed_forms = this.manifest(ledger);
          return { ...urlAliases(signed_forms), signed_forms };
        });
      } catch (error) {
        throw this.dbError(error);
      }
    });
  }

  async readSubmission(submissionId: string): Promise<IntakeSignedFormsRecord | null> {
    try {
      const ledger = await this.readLedger(submissionId);
      return ledger ? this.publicRecord(ledger) : null;
    } catch (error) {
      throw this.dbError(error);
    }
  }

  /** Persist immediately before any outbound delivery attempt. This is a durable one-way claim. */
  async markAttempted(submissionId: string): Promise<void> {
    await this.locked(submissionId, async () => {
      const ledger = await this.readLedger(submissionId);
      if (!ledger) throw storeError(404, "The signed-form submission is unavailable.");
      if (ledger.state !== "prepared") throw storeError(409, "The signed-form submission was already claimed for delivery.");
      ledger.state = "attempted";
      await this.put(this.ledgerKey(submissionId), Buffer.from(JSON.stringify(ledger), "utf8"), ledger.expires_at);
    });
  }

  async markDelivered(submissionId: string, result: Record<string, unknown>): Promise<void> {
    await this.locked(submissionId, async () => {
      const ledger = await this.readLedger(submissionId);
      if (!ledger) throw storeError(404, "The signed-form submission is unavailable.");
      ledger.state = "delivered";
      ledger.result = safeReceipt(result);
      await this.put(this.ledgerKey(submissionId), Buffer.from(JSON.stringify(ledger), "utf8"), ledger.expires_at);
    });
  }

  async revokeSubmission(submissionId: string): Promise<void> {
    await this.locked(submissionId, async () => {
      const ledgerKey = this.ledgerKey(submissionId);
      const ledger = await this.readLedger(submissionId);
      if (ledger) await this.deleteLedger(ledgerKey, ledger);
      else await this.remove(ledgerKey);
    });
  }

  async cleanup(): Promise<void> {
    try {
      await this.blobDb().cleanup();
    } catch (error) {
      throw this.dbError(error);
    }
  }

  private parseIndex(bytes: Buffer | null, token: string): DownloadIndex | null {
    if (!bytes) return null;
    try {
      const index = JSON.parse(bytes.toString("utf8")) as Partial<DownloadIndex>;
      if (!index || index.version !== 1 || !validToken(index.token) || !constantTimeEqual(index.token, token)
        || typeof index.token_hash !== "string" || index.token_hash !== this.tokenHash(token)
        || typeof index.file_name !== "string" || safeFileName(index.file_name) !== index.file_name
        || !Number.isInteger(index.byte_length) || index.byte_length! < 1 || index.byte_length! >= MAX_PDF_BYTES
        || typeof index.pdf_key !== "string" || index.pdf_key !== this.pdfKey(index.token_hash)
        || !Number.isInteger(index.expires_at) || index.expires_at! <= this.now()) return null;
      return index as DownloadIndex;
    } catch {
      return null;
    }
  }

  private async download(token: string): Promise<{ bytes: Buffer; fileName: string } | null> {
    if (!validToken(token)) return null;
    const indexKey = this.tokenIndexKey(token);
    let index: DownloadIndex | null;
    try {
      index = this.parseIndex(await this.value(indexKey), token);
    } catch (error) {
      throw this.dbError(error);
    }
    if (!index) return null;
    const bytes = await this.value(index.pdf_key);
    if (!bytes || bytes.length !== index.byte_length || bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
      await Promise.all([this.remove(indexKey), this.remove(index.pdf_key)]).catch(() => undefined);
      return null;
    }
    return { bytes, fileName: index.file_name };
  }

  register(app: Express): void {
    // Intentionally no initialization/connection here. Unrelated pages must start even when a
    // database is temporarily unreachable; a caller decides whether a 503 can use a fileless path.
    app.get("/api/intake/signed-forms/:token", operation(async (req, res) => {
      const file = await this.download(req.params.token);
      if (!file) {
        noStore(res);
        res.status(404).json({ error: "The requested signed form is unavailable." });
        return;
      }
      noStore(res);
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": contentDisposition(file.fileName) });
      res.status(200).send(file.bytes);
    }));
  }
}

/** Create an isolated database-backed signed-form store. */
export function createIntakeSignedFormsDatabaseStore(deps: IntakeSignedFormsDatabaseStoreDependencies = {}): IntakeSignedFormsDatabaseStore {
  return new IntakeSignedFormsDatabaseStore(deps);
}
