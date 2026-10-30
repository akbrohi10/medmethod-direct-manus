import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual, type CipherGCM, type DecipherGCM } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Express, NextFunction, Request, Response } from "express";
import { ENV } from "./_core/env";
import { createIntakeSignedFormsDatabaseStore, type IntakeSignedFormsDatabaseStore } from "./intakeSignedFormsDatabaseStore";

/**
 * Encrypted, private, short-lived storage for the five PDFs produced after an intake signature.
 *
 * The local filesystem is a durable retry ledger only when its directory is a persistent,
 * private volume. Configure INTAKE_SIGNED_FORMS_DIR (or the existing
 * INTAKE_PRIVATE_UPLOAD_DIR) to an absolute persistent volume in production. A container's
 * ephemeral filesystem is not production-durable: `prepare` deliberately refuses to create new
 * PDFs in production without that prerequisite. Registration is lazy, so a missing volume cannot
 * crash application startup or unrelated pages. This implementation also uses a short filesystem
 * lock for a shared volume; a provider-managed private store remains preferable at scale.
 *
 * The directory is module-owned and must never be exposed by static middleware. Each PDF, its
 * encrypted manifest/ledger, and all temporary files use AES-256-GCM and owner-only modes.
 */

const VERSION = "mmd-intake-signed-forms-v1";
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_PDF_BYTES = 2 * 1024 * 1024;
const REQUIRED_FORM_COUNT = 5;
const MAX_SUBMISSIONS = 100;
const MAX_TOTAL_PDF_BYTES = 500 * 1024 * 1024;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const FORM_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const FILE_PATTERN = /^([a-f0-9]{64})\.(?:bin|meta)$/;
const LOCK_FILE = ".mmd-signed-forms.lock";
const CANONICAL_FORMS = ["glp1", "general", "telehealth", "privacy", "policy"] as const;
const KNOWN_PUBLIC_ORIGINS = new Map<string, string>([
  ["www.medmethoddirect.com", "https://www.medmethoddirect.com"],
  ["medmethoddirect.com", "https://medmethoddirect.com"],
  ["medmethod-kywclyds.manus.space", "https://medmethod-kywclyds.manus.space"],
  ["3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer", "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer"],
]);

type FormState = "prepared" | "attempted" | "delivered";

export type IntakeSignedFormInput = {
  form: string;
  title: string;
  file_name: string;
  bytes: Buffer;
};

export type IntakeSignedFormsMetadata = {
  signed_at: string;
  signer_name: string;
  relation: string;
};

export type IntakeSignedFormManifest = {
  form: string;
  title: string;
  file_name: string;
  url: string;
  signed_at: string;
  signer_name: string;
  relation: string;
};

export type IntakeSignedFormsPrepareResult = {
  /** Stable URL aliases provided for downstream form-specific webhook mappings. */
  glp1_consent_url: string;
  general_consent_url: string;
  telehealth_consent_url: string;
  privacy_notice_ack_url: string;
  medication_policy_url: string;
  signed_forms: IntakeSignedFormManifest[];
};

export type IntakeSignedFormsRecord = {
  fingerprint: string;
  state: FormState;
  result?: Record<string, unknown>;
  /** Canonical Keragon URL aliases plus the complete signed_forms attachment array. */
  forms: IntakeSignedFormsPrepareResult;
  expiresAt: number;
};

/** Public contract shared by the explicit filesystem test store and the application DB store. */
export type IntakeSignedFormsStoreApi = {
  prepare(req: Request, submissionId: string, fingerprint: string, pdfs: IntakeSignedFormInput[], metadata: IntakeSignedFormsMetadata): Promise<IntakeSignedFormsPrepareResult>;
  readSubmission(submissionId: string): Promise<IntakeSignedFormsRecord | null>;
  markAttempted(submissionId: string): Promise<void>;
  markDelivered(submissionId: string, result: Record<string, unknown>): Promise<void>;
  revokeSubmission(submissionId: string): Promise<void>;
  cleanup(): Promise<void>;
  register(app: Express): void;
};

type StoredPdf = {
  form: string;
  title: string;
  file_name: string;
  token: string;
  token_hash: string;
  byte_length: number;
};

type StoredLedger = {
  version: 1;
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

type DownloadedPdf = { bytes: Buffer; fileName: string };

export type IntakeSignedFormsStoreDependencies = {
  /** Stable server-only JWT_SECRET/cookie secret. Missing or weak secrets fail closed. */
  secret?: string;
  /** A private, absolute persistent volume outside all public/static roots. */
  tempDir?: string;
  /** Injectable clock used by tests. */
  now?: () => number;
  /** Canonical public origin; otherwise a strict request-Host allowlist is used. */
  publicOrigin?: string;
};

export class IntakeSignedFormsStoreError extends Error {
  constructor(public readonly status: number, message = "Signed forms are unavailable.") {
    super(message);
    this.name = "IntakeSignedFormsStoreError";
  }
}

function storeError(status: number, message = "Signed forms are unavailable.") {
  return new IntakeSignedFormsStoreError(status, message);
}

function isNodeError(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === code;
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

function safeFileName(value: unknown): string {
  if (typeof value !== "string" || !value || value.length > 180) throw storeError(400, "A safe PDF filename is required.");
  let normalized: string;
  try {
    normalized = value.normalize("NFC");
  } catch {
    throw storeError(400, "A safe PDF filename is required.");
  }
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

function configuredOrigin(deps: IntakeSignedFormsStoreDependencies): string | null {
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
    return (parsed.protocol === "https:" || parsed.protocol === "http:")
      && !parsed.username && !parsed.password && parsed.pathname === "/" && !parsed.search && !parsed.hash
      && parsed.origin === value;
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

/** Never derive a bearer URL from a browser-controlled Origin header or arbitrary Host. */
function trustedOriginFor(req: Request, deps: IntakeSignedFormsStoreDependencies): string {
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

function privateDirectoryFor(deps: IntakeSignedFormsStoreDependencies): string {
  const explicit = deps.tempDir ?? process.env.INTAKE_SIGNED_FORMS_DIR ?? process.env.INTAKE_PRIVATE_UPLOAD_DIR;
  if (explicit && !path.isAbsolute(explicit)) throw new Error("INTAKE_SIGNED_FORMS_DIR must be absolute.");
  const directory = path.resolve(explicit || path.join(os.tmpdir(), VERSION));
  if (!path.isAbsolute(directory)) throw new Error("INTAKE_SIGNED_FORMS_DIR must be absolute.");
  const components = directory.split(path.sep).filter(Boolean).map(component => component.toLowerCase());
  if (components.includes("public")) throw new Error("INTAKE_SIGNED_FORMS_DIR must not be under a public directory.");
  const projectRelative = path.relative(process.cwd(), directory);
  if (!projectRelative.startsWith("..") && !path.isAbsolute(projectRelative) && /(^|[\\/])(client[\\/]public|dist[\\/]public|public)([\\/]|$)/i.test(projectRelative)) {
    throw new Error("INTAKE_SIGNED_FORMS_DIR must not be under a public directory.");
  }
  return directory;
}

function configuredPrivateDirectory(deps: IntakeSignedFormsStoreDependencies): string | undefined {
  return deps.tempDir ?? process.env.INTAKE_SIGNED_FORMS_DIR ?? process.env.INTAKE_PRIVATE_UPLOAD_DIR;
}

function operation(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, _next: NextFunction) => {
    void handler(req, res).catch(error => {
      // Deliberately do not pass capability paths into generic Express error handlers, which
      // commonly log request URLs. Capability tokens must never be logged by this module.
      if (!res.headersSent) {
        const safe = error instanceof IntakeSignedFormsStoreError ? error : storeError(500);
        noStore(res);
        res.status(safe.status).json({ error: safe.message });
      }
    });
  };
}

function safeReceipt(value: Record<string, unknown>): Record<string, unknown> {
  // A delivery response is not a second copy of the clinical intake. Persist a very narrow,
  // non-PHI acknowledgement only; unknown response properties (including patient fields) are
  // intentionally discarded.
  const allowed = new Set([
    "accepted", "ok", "status", "status_code", "receipt_id", "delivery_id", "request_id", "event_id", "completed_at",
    // The free-intake recovery receipt is intentionally limited to routing/idempotency facts;
    // it contains no patient demographics, clinical answers, signature, or PDF contents.
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
    if (!url) throw new Error("A required signed form is missing.");
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

/**
 * Private filesystem store. The exposed record omits tokens and raw byte data; URL capabilities
 * are returned in its encrypted form manifests only while the record remains within its absolute TTL.
 */
export class IntakeSignedFormsStore {
  private readonly deps: IntakeSignedFormsStoreDependencies;
  private readonly directory: string;
  private readonly now: () => number;
  private initialized: Promise<void> | null = null;
  private mutation: Promise<void> = Promise.resolve();
  private cleanupTimer: NodeJS.Timeout | undefined;

  constructor(deps: IntakeSignedFormsStoreDependencies = {}) {
    this.deps = deps;
    this.directory = privateDirectoryFor(deps);
    this.now = deps.now ?? Date.now;
  }

  private secret(): string {
    const secret = this.deps.secret ?? ENV.cookieSecret;
    if (!secret || secret.length < 16) throw storeError(503, "Signed-form storage is not configured.");
    return secret;
  }

  private requirePersistentVolumeForPrepare(): void {
    if (process.env.NODE_ENV === "production" && !configuredPrivateDirectory(this.deps)) {
      throw storeError(503, "Signed-form storage requires a configured persistent private volume.");
    }
  }

  private hasUnavailableProductionVolume(): boolean {
    return process.env.NODE_ENV === "production" && !configuredPrivateDirectory(this.deps);
  }

  private key(): Buffer {
    return createHash("sha256").update(this.secret(), "utf8").update(`:${VERSION}:aes-256-gcm`, "utf8").digest();
  }

  private keyedHash(value: string): string {
    return createHmac("sha256", this.key()).update(value, "utf8").digest("hex");
  }

  private submissionHash(submissionId: string): string {
    if (!validSubmissionId(submissionId)) throw storeError(400, "The signed-form submission is invalid.");
    return this.keyedHash(`submission:${submissionId}`);
  }

  private encrypt(value: Buffer, aad: string): Buffer {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key(), iv) as CipherGCM;
    cipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), encrypted]);
  }

  private decrypt(value: Buffer, aad: string): Buffer {
    if (value.length < 29 || value[0] !== 1) throw new Error("Invalid encrypted signed form.");
    const decipher = createDecipheriv("aes-256-gcm", this.key(), value.subarray(1, 13)) as DecipherGCM;
    decipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
    decipher.setAuthTag(value.subarray(13, 29));
    return Buffer.concat([decipher.update(value.subarray(29)), decipher.final()]);
  }

  private ledgerPath(submissionHash: string): string {
    if (!HASH_PATTERN.test(submissionHash)) throw storeError(404);
    return path.join(this.directory, `${submissionHash}.meta`);
  }

  private pdfPath(tokenHash: string): string {
    if (!HASH_PATTERN.test(tokenHash)) throw storeError(404);
    return path.join(this.directory, `${tokenHash}.bin`);
  }

  private async ensureDirectory(): Promise<void> {
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    const stat = await fs.lstat(this.directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Signed-form private directory is invalid.");
    await fs.chmod(this.directory, 0o700);
  }

  private lockPath(): string {
    return path.join(this.directory, LOCK_FILE);
  }

  /**
   * A same-volume lock closes the process-restart/second-instance claim race. It is intentionally
   * bounded: inability to obtain it fails closed rather than allowing a second webhook attempt.
   * Locks older than ten minutes are treated as abandoned after a process crash.
   */
  private async withFilesystemLock<T>(handler: () => Promise<T>): Promise<T> {
    await this.ensureDirectory();
    const deadline = Date.now() + 5_000;
    let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
    while (!handle) {
      try {
        handle = await fs.open(this.lockPath(), "wx", 0o600);
        await handle.chmod(0o600);
      } catch (error) {
        if (!isNodeError(error, "EEXIST")) throw error;
        try {
          const stat = await fs.lstat(this.lockPath());
          if (!stat.isFile() || stat.isSymbolicLink() || stat.mtimeMs + (10 * 60 * 1000) < Date.now()) {
            await fs.unlink(this.lockPath()).catch(() => undefined);
          }
        } catch (statError) {
          if (!isNodeError(statError, "ENOENT")) throw statError;
        }
        if (Date.now() >= deadline) throw storeError(503, "Signed-form storage is busy. Please retry safely.");
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    }
    try {
      return await handler();
    } finally {
      await handle.close().catch(() => undefined);
      await fs.unlink(this.lockPath()).catch(() => undefined);
    }
  }

  private async writePrivateFile(destination: string, contents: Buffer): Promise<void> {
    const temporary = path.join(this.directory, `.${path.basename(destination)}.${randomBytes(12).toString("base64url")}.tmp`);
    try {
      await fs.writeFile(temporary, contents, { mode: 0o600, flag: "wx" });
      await fs.chmod(temporary, 0o600);
      await fs.rename(temporary, destination);
      await fs.chmod(destination, 0o600);
    } catch (error) {
      await fs.unlink(temporary).catch(() => undefined);
      throw error;
    }
  }

  private async replacePrivateFile(destination: string, contents: Buffer): Promise<void> {
    await this.writePrivateFile(destination, contents);
  }

  private ledgerIsValid(value: unknown, expectedHash: string): value is StoredLedger {
    if (!value || typeof value !== "object") return false;
    const ledger = value as Partial<StoredLedger>;
    if (ledger.version !== 1 || ledger.submission_hash !== expectedHash || !HASH_PATTERN.test(String(ledger.submission_hash))) return false;
    if (!validFingerprint(ledger.fingerprint) || !["prepared", "attempted", "delivered"].includes(String(ledger.state))) return false;
    if (!Number.isInteger(ledger.created_at) || !Number.isInteger(ledger.expires_at) || ledger.created_at! <= 0 || ledger.expires_at! < ledger.created_at! || ledger.expires_at! - ledger.created_at! > TTL_MS) return false;
    const forms = ledger.forms;
    if (!Array.isArray(forms) || forms.length !== REQUIRED_FORM_COUNT || new Set(forms.map(form => form.form)).size !== REQUIRED_FORM_COUNT || !CANONICAL_FORMS.every(form => forms.some(candidate => candidate.form === form))) return false;
    if (typeof ledger.signed_at !== "string" || ledger.signed_at.length < 1 || ledger.signed_at.length > 80 || typeof ledger.signer_name !== "string" || ledger.signer_name.length < 1 || ledger.signer_name.length > 200 || typeof ledger.relation !== "string" || ledger.relation.length > 200) return false;
    if (!validOrigin(ledger.public_origin)) return false;
    return forms.every(form =>
      form && typeof form === "object"
      && typeof form.form === "string" && FORM_PATTERN.test(form.form)
      && typeof form.title === "string" && form.title.length > 0 && form.title.length <= 300
      && typeof form.file_name === "string" && (() => { try { return safeFileName(form.file_name) === form.file_name; } catch { return false; } })()
      && validToken(form.token)
      && typeof form.token_hash === "string" && HASH_PATTERN.test(form.token_hash) && constantTimeEqual(this.keyedHash(`token:${form.token}`), form.token_hash)
      && Number.isInteger(form.byte_length) && form.byte_length > 0 && form.byte_length < MAX_PDF_BYTES,
    );
  }

  private async readLedgerByHash(submissionHash: string): Promise<StoredLedger | null> {
    let encrypted: Buffer;
    try {
      const stat = await fs.lstat(this.ledgerPath(submissionHash));
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Invalid signed-form ledger.");
      encrypted = await fs.readFile(this.ledgerPath(submissionHash));
    } catch (error) {
      if (isNodeError(error, "ENOENT")) return null;
      throw error;
    }
    try {
      const parsed = JSON.parse(this.decrypt(encrypted, `ledger:${submissionHash}`).toString("utf8")) as unknown;
      if (!this.ledgerIsValid(parsed, submissionHash)) throw new Error("Invalid signed-form ledger.");
      const ledger = parsed as StoredLedger;
      if (ledger.expires_at <= this.now()) {
        await this.deleteLedger(ledger).catch(() => undefined);
        return null;
      }
      return ledger;
    } catch {
      // Different secret/corruption must never become a retrieval oracle. It is fail-closed and
      // physical removal is best effort; a later cleanup attempts the same deletion again.
      await this.deleteByHash(submissionHash).catch(() => undefined);
      return null;
    }
  }

  private async deleteByHash(submissionHash: string): Promise<void> {
    await fs.unlink(this.ledgerPath(submissionHash)).catch(error => {
      if (!isNodeError(error, "ENOENT")) throw error;
    });
  }

  private async deleteLedger(ledger: StoredLedger): Promise<void> {
    await Promise.all([
      this.deleteByHash(ledger.submission_hash),
      ...ledger.forms.map(form => fs.unlink(this.pdfPath(form.token_hash)).catch(error => {
        if (!isNodeError(error, "ENOENT")) throw error;
      })),
    ]);
  }

  private async allLedgerHashes(): Promise<string[]> {
    const entries = await fs.readdir(this.directory, { withFileTypes: true });
    const ledgers: string[] = [];
    const pdfs = new Set<string>();
    for (const entry of entries) {
      const fullPath = path.join(this.directory, entry.name);
      if (entry.name === LOCK_FILE) continue;
      const match = FILE_PATTERN.exec(entry.name);
      if (!match || !entry.isFile()) {
        await fs.unlink(fullPath).catch(() => undefined);
        continue;
      }
      if (entry.name.endsWith(".meta")) ledgers.push(match[1]);
      else pdfs.add(match[1]);
    }
    // Orphaned encrypted PDFs cannot be associated with a valid durable ledger and therefore are
    // removed rather than retained until capacity is exhausted.
    const referenced = new Set<string>();
    for (const hash of ledgers) {
      const ledger = await this.readLedgerByHash(hash);
      if (ledger) ledger.forms.forEach(form => referenced.add(form.token_hash));
    }
    await Promise.all(Array.from(pdfs).filter(hash => !referenced.has(hash)).map(hash => fs.unlink(this.pdfPath(hash)).catch(() => undefined)));
    return ledgers;
  }

  private async cleanupInternal(): Promise<void> {
    await this.ensureDirectory();
    const hashes = await fs.readdir(this.directory, { withFileTypes: true });
    for (const entry of hashes) {
      if (!entry.name.endsWith(".meta") || !/^[a-f0-9]{64}\.meta$/.test(entry.name) || !entry.isFile()) continue;
      await this.readLedgerByHash(entry.name.slice(0, -5));
    }
    // allLedgerHashes performs conservative physical orphan cleanup after expired/corrupt ledger cleanup.
    await this.allLedgerHashes();
  }

  private scheduleCleanup(): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupTimer = setInterval(() => { void this.cleanup().catch(() => undefined); }, 60 * 60 * 1000);
    this.cleanupTimer.unref();
  }

  private async initializeInternal(): Promise<void> {
    this.secret();
    // Route registration and an expired/guessed capability request must not create an ephemeral
    // fallback directory in production. New preparation already rejects before initialization.
    if (this.hasUnavailableProductionVolume()) return;
    await this.ensureDirectory();
    await this.withFilesystemLock(async () => this.cleanupInternal());
    this.scheduleCleanup();
  }

  private async initialize(): Promise<void> {
    if (!this.initialized) this.initialized = this.initializeInternal();
    return this.initialized;
  }

  private async exclusive<T>(handler: () => Promise<T>): Promise<T> {
    let release: (() => void) | undefined;
    const next = new Promise<void>(resolve => { release = resolve; });
    const previous = this.mutation;
    this.mutation = previous.then(() => next, () => next);
    await previous;
    try {
      return await this.withFilesystemLock(handler);
    } finally {
      release?.();
    }
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

  private async persistLedger(ledger: StoredLedger): Promise<void> {
    await this.replacePrivateFile(this.ledgerPath(ledger.submission_hash), this.encrypt(Buffer.from(JSON.stringify(ledger), "utf8"), `ledger:${ledger.submission_hash}`));
  }

  private validatePreparedPdfs(pdfs: IntakeSignedFormInput[]): IntakeSignedFormInput[] {
    if (!Array.isArray(pdfs) || pdfs.length !== REQUIRED_FORM_COUNT || new Set(pdfs.map(pdf => pdf?.form)).size !== REQUIRED_FORM_COUNT || !CANONICAL_FORMS.every(form => pdfs.some(pdf => pdf?.form === form))) {
      throw storeError(400, "Exactly five signed PDFs are required.");
    }
    return pdfs.map(pdf => {
      if (!pdf || !FORM_PATTERN.test(pdf.form) || typeof pdf.title !== "string" || !pdf.title.trim() || pdf.title.length > 300 || !Buffer.isBuffer(pdf.bytes) || pdf.bytes.length === 0 || pdf.bytes.length >= MAX_PDF_BYTES || pdf.bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw storeError(400, "A signed PDF is invalid.");
      }
      return { form: pdf.form, title: pdf.title.trim(), file_name: safeFileName(pdf.file_name), bytes: Buffer.from(pdf.bytes) };
    });
  }

  private validateMetadata(metadata: IntakeSignedFormsMetadata): IntakeSignedFormsMetadata {
    if (!metadata || typeof metadata.signed_at !== "string" || metadata.signed_at.length < 1 || metadata.signed_at.length > 80 || typeof metadata.signer_name !== "string" || !metadata.signer_name.trim() || metadata.signer_name.length > 200 || typeof metadata.relation !== "string" || metadata.relation.length > 200) {
      throw storeError(400, "Signed-form metadata is invalid.");
    }
    return { signed_at: metadata.signed_at, signer_name: metadata.signer_name.trim(), relation: metadata.relation.trim() };
  }

  async prepare(req: Request, submissionId: string, fingerprint: string, pdfs: IntakeSignedFormInput[], metadata: IntakeSignedFormsMetadata): Promise<IntakeSignedFormsPrepareResult> {
    this.requirePersistentVolumeForPrepare();
    await this.initialize();
    if (!validFingerprint(fingerprint)) throw storeError(400, "The signed-form submission is invalid.");
    const submissionHash = this.submissionHash(submissionId);
    const safePdfs = this.validatePreparedPdfs(pdfs);
    const safeMetadata = this.validateMetadata(metadata);
    return this.exclusive(async () => {
      const existing = await this.readLedgerByHash(submissionHash);
      if (existing) {
        if (!constantTimeEqual(existing.fingerprint, fingerprint)) throw storeError(409, "The signed-form submission does not match the original request.");
        const signed_forms = this.manifest(existing);
        return { ...urlAliases(signed_forms), signed_forms };
      }

      // Only a new capability manifest needs an origin. A matching retry returns its original
      // encrypted manifest verbatim, including after a reverse-proxy Host representation changes.
      const publicOrigin = trustedOriginFor(req, this.deps);

      const ledgerHashes = await this.allLedgerHashes();
      const liveLedgers = (await Promise.all(ledgerHashes.map(hash => this.readLedgerByHash(hash)))).filter((ledger): ledger is StoredLedger => ledger !== null);
      const totalBytes = liveLedgers.flatMap(ledger => ledger.forms).reduce((sum, form) => sum + form.byte_length, 0);
      const newBytes = safePdfs.reduce((sum, pdf) => sum + pdf.bytes.length, 0);
      if (liveLedgers.length >= MAX_SUBMISSIONS || totalBytes + newBytes > MAX_TOTAL_PDF_BYTES) throw storeError(503, "Signed-form storage is at capacity.");

      const createdAt = this.now();
      const forms: StoredPdf[] = safePdfs.map(pdf => {
        const token = randomBytes(32).toString("base64url");
        if (!validToken(token)) throw new Error("Signed-form token entropy is invalid.");
        return { form: pdf.form, title: pdf.title, file_name: pdf.file_name, token, token_hash: this.keyedHash(`token:${token}`), byte_length: pdf.bytes.length };
      });
      const ledger: StoredLedger = {
        version: 1,
        submission_hash: submissionHash,
        fingerprint,
        state: "prepared",
        created_at: createdAt,
        expires_at: createdAt + TTL_MS,
        forms,
        signed_at: safeMetadata.signed_at,
        signer_name: safeMetadata.signer_name,
        relation: safeMetadata.relation,
        public_origin: publicOrigin,
      };

      // Commit PDFs first, then the encrypted ledger as the visibility marker. If anything fails,
      // remove every newly written encrypted object; readers only trust a complete ledger.
      try {
        // Sequential writes ensure a failed all-five preparation can synchronously delete every
        // object it created before a ledger ever makes the set visible to readers.
        for (let index = 0; index < forms.length; index += 1) {
          const form = forms[index];
          await this.writePrivateFile(this.pdfPath(form.token_hash), this.encrypt(safePdfs[index].bytes, `pdf:${form.token_hash}`));
        }
        await this.persistLedger(ledger);
      } catch (error) {
        await this.deleteLedger(ledger).catch(() => undefined);
        throw error;
      }
      const signed_forms = this.manifest(ledger);
      return { ...urlAliases(signed_forms), signed_forms };
    });
  }

  async readSubmission(submissionId: string): Promise<IntakeSignedFormsRecord | null> {
    if (this.hasUnavailableProductionVolume()) return null;
    await this.initialize();
    const submissionHash = this.submissionHash(submissionId);
    return this.exclusive(async () => {
      const ledger = await this.readLedgerByHash(submissionHash);
      return ledger ? this.publicRecord(ledger) : null;
    });
  }

  /** Persist this immediately before any webhook/network attempt, never after it. */
  async markAttempted(submissionId: string): Promise<void> {
    if (this.hasUnavailableProductionVolume()) throw storeError(404, "The signed-form submission is unavailable.");
    await this.initialize();
    const submissionHash = this.submissionHash(submissionId);
    await this.exclusive(async () => {
      const ledger = await this.readLedgerByHash(submissionHash);
      if (!ledger) throw storeError(404, "The signed-form submission is unavailable.");
      // This is a one-way durable claim. A caller must persist this state before opening a
      // webhook connection; an ambiguous timeout is therefore never silently retried.
      if (ledger.state !== "prepared") throw storeError(409, "The signed-form submission was already claimed for delivery.");
      ledger.state = "attempted";
      await this.persistLedger(ledger);
    });
  }

  async markDelivered(submissionId: string, result: Record<string, unknown>): Promise<void> {
    if (this.hasUnavailableProductionVolume()) throw storeError(404, "The signed-form submission is unavailable.");
    await this.initialize();
    const submissionHash = this.submissionHash(submissionId);
    await this.exclusive(async () => {
      const ledger = await this.readLedgerByHash(submissionHash);
      if (!ledger) throw storeError(404, "The signed-form submission is unavailable.");
      ledger.state = "delivered";
      ledger.result = safeReceipt(result);
      await this.persistLedger(ledger);
    });
  }

  async revokeSubmission(submissionId: string): Promise<void> {
    if (this.hasUnavailableProductionVolume()) return;
    await this.initialize();
    const submissionHash = this.submissionHash(submissionId);
    await this.exclusive(async () => {
      const ledger = await this.readLedgerByHash(submissionHash);
      if (ledger) await this.deleteLedger(ledger);
      else await this.deleteByHash(submissionHash).catch(() => undefined);
    });
  }

  async cleanup(): Promise<void> {
    if (this.hasUnavailableProductionVolume()) return;
    await this.initialize();
    await this.exclusive(async () => this.cleanupInternal());
  }

  private async download(token: string): Promise<DownloadedPdf | null> {
    if (this.hasUnavailableProductionVolume()) return null;
    await this.initialize();
    if (!validToken(token)) return null;
    const tokenHash = this.keyedHash(`token:${token}`);
    return this.exclusive(async () => {
      const ledgerHashes = await this.allLedgerHashes();
      for (const submissionHash of ledgerHashes) {
        const ledger = await this.readLedgerByHash(submissionHash);
        if (!ledger) continue;
        const form = ledger.forms.find(candidate => constantTimeEqual(candidate.token_hash, tokenHash) && constantTimeEqual(candidate.token, token));
        if (!form) continue;
        try {
          const stat = await fs.lstat(this.pdfPath(form.token_hash));
          if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Invalid signed PDF.");
          const bytes = this.decrypt(await fs.readFile(this.pdfPath(form.token_hash)), `pdf:${form.token_hash}`);
          if (bytes.length !== form.byte_length || bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("Invalid signed PDF.");
          return { bytes, fileName: form.file_name };
        } catch {
          await this.deleteLedger(ledger).catch(() => undefined);
          return null;
        }
      }
      return null;
    });
  }

  register(app: Express): void {
    // Do not touch a private volume merely by registering this route. In particular, a production
    // deployment without its required persistent volume must keep unrelated pages bootable; a
    // prepare then fails closed before it creates any PDFs.
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

/** Create an isolated signed-form store. Tests should use this factory rather than the singleton. */
export function createIntakeSignedFormsStore(deps: IntakeSignedFormsStoreDependencies = {}): IntakeSignedFormsStore {
  return new IntakeSignedFormsStore(deps);
}

// The explicit factory above remains a filesystem implementation for isolated tempDir tests only.
// Application calls use the encrypted DATABASE_URL store in every environment; its constructor and
// route registration are intentionally lazy so unrelated pages do not open a DB connection.
let defaultStore: IntakeSignedFormsDatabaseStore | undefined;
function store(): IntakeSignedFormsDatabaseStore {
  defaultStore ??= createIntakeSignedFormsDatabaseStore();
  return defaultStore;
}

/** Register bearer-capability downloads for server-generated intake PDFs. */
export function registerIntakeSignedFormsRoutes(app: Express): void {
  store().register(app);
}

/** Access the process singleton for the intake submission handler. */
export function getIntakeSignedFormsStore(): IntakeSignedFormsStoreApi {
  return store();
}
