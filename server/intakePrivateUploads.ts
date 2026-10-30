import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createRequire } from "node:module";
import { promises as fs } from "node:fs";
import path from "node:path";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import sharp from "sharp";
import { ENV } from "./_core/env";
import { DbIntakePrivateUploadPersistence } from "./intakePrivateUploadDb";

/**
 * Private intake file store.
 *
 * Runtime storage is the encrypted, TTL-aware database blob helper. Values are keyed with opaque
 * HMAC namespace keys and the helper encrypts them before database persistence. A filesystem
 * backend is retained only when an isolated test factory explicitly provides `tempDir`.
 */

const VERSION = "mmd-intake-private-v1";
const OWNER_COOKIE = "mmd_intake_upload_owner_v1";
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_SCALE_BYTES = 2 * 1024 * 1024;
const MAX_LABS_PER_OWNER = 5;
const MAX_SCALE_PER_OWNER = 1;
const MAX_OWNER_FILES = MAX_LABS_PER_OWNER + MAX_SCALE_PER_OWNER;
const MAX_OWNER_BYTES = (MAX_LABS_PER_OWNER * MAX_UPLOAD_BYTES) + MAX_SCALE_BYTES;
const MAX_TOTAL_FILES = 120;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const SCALE_MAX_DIMENSION = 2048;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_FILES = 12;
const MAX_RATE_KEYS = 4096;
const ID_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const ALLOWED_RAW_CONTENT_TYPE = "application/octet-stream";
const KNOWN_PUBLIC_ORIGINS = new Map<string, string>([
  ["www.medmethoddirect.com", "https://www.medmethoddirect.com"],
  ["medmethoddirect.com", "https://medmethoddirect.com"],
  ["medmethod-kywclyds.manus.space", "https://medmethod-kywclyds.manus.space"],
  ["3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer", "https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer"],
]);

type UploadKind = "lab" | "scale";
type StoredMime = "application/pdf" | "image/jpeg" | "image/png" | "image/heic";
type DetectedType = "pdf" | "jpeg" | "png" | "heic";

type StoredMetadata = {
  version: 1;
  id: string;
  owner_hash: string;
  download_token: string;
  download_token_hash: string;
  kind: UploadKind;
  file_name: string;
  mime_type: StoredMime;
  byte_length: number;
  created_at: number;
  expires_at: number;
};

type PreparedUpload = {
  bytes: Buffer;
  fileName: string;
  mimeType: StoredMime;
};

type RateEntry = { startedAt: number; files: number; lastSeenAt: number };

type FileRef = { url: string; file_name: string; mime_type: StoredMime };

export type ResolvedIntakeUploads = {
  lab_results: FileRef[];
  lab_results_provided: boolean;
  lab_result_1_url: string | null;
  lab_result_2_url: string | null;
  lab_result_3_url: string | null;
  lab_result_4_url: string | null;
  lab_result_5_url: string | null;
  scale_photo_url: string | null;
  scale_photo_provided: boolean;
};

export type IntakePrivateUploadDependencies = {
  /** Stable server-only JWT_SECRET/cookie secret. Required; a missing secret fails closed. */
  secret?: string;
  /** Explicit isolated filesystem test backend. Runtime storage never reads an environment volume. */
  tempDir?: string;
  /** Injectable encrypted DB persistence for isolated tests. Defaults to the shared DB blob helper. */
  persistence?: DbIntakePrivateUploadPersistence;
  /** Injectable clock used by tests. */
  now?: () => number;
  /** Injectable entropy source used only by tests. Production uses crypto.randomBytes. */
  randomBytes?: (size: number) => Buffer;
  /** Public origin allowlist item for production, e.g. https://medmethoddirect.com. */
  publicOrigin?: string;
  /** Injectable deployment mode used by tests. */
  isProduction?: boolean;
};

export class IntakePrivateUploadError extends Error {
  constructor(public readonly status: number, message = "The requested intake upload is unavailable.") {
    super(message);
    this.name = "IntakePrivateUploadError";
  }
}

function uploadError(status: number, message = "The requested intake upload is unavailable.") {
  return new IntakePrivateUploadError(status, message);
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
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "Referrer-Policy": "no-referrer",
  });
}

function parseCookies(req: Request): Map<string, string> {
  const result = new Map<string, string>();
  const header = req.headers.cookie;
  if (!header) return result;
  for (const piece of header.split(";")) {
    const separator = piece.indexOf("=");
    if (separator < 1) continue;
    const name = piece.slice(0, separator).trim();
    const value = piece.slice(separator + 1).trim();
    if (name && value) result.set(name, value);
  }
  return result;
}

function validOpaqueToken(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function safeFileName(value: unknown): string {
  if (typeof value !== "string" || !value || value.length > 180) {
    throw uploadError(400, "A safe file name is required.");
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(value).normalize("NFC");
  } catch {
    throw uploadError(400, "A safe file name is required.");
  }
  if (!decoded || Buffer.byteLength(decoded, "utf8") > 240 || /[\\/\u0000-\u001f\u007f]/.test(decoded) || decoded === "." || decoded === "..") {
    throw uploadError(400, "A safe file name is required.");
  }
  return decoded;
}

function extensionFor(fileName: string): string {
  const extension = path.posix.extname(fileName).toLowerCase();
  return extension;
}

function filenameWithExtension(fileName: string, extension: ".jpg" | ".jpeg" | ".png" | ".heic" | ".pdf"): string {
  const base = fileName.slice(0, Math.max(0, fileName.length - extensionFor(fileName).length)) || "upload";
  return `${base}${extension}`;
}

function detectType(bytes: Buffer): DetectedType | null {
  if (bytes.length >= 5 && bytes.subarray(0, 5).toString("ascii") === "%PDF-") return "pdf";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp") {
    const majorBrand = bytes.subarray(8, 12).toString("ascii").toLowerCase();
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(majorBrand)) return "heic";
  }
  return null;
}

function extensionMatches(type: DetectedType, extension: string): boolean {
  if (type === "pdf") return extension === ".pdf";
  if (type === "jpeg") return extension === ".jpg" || extension === ".jpeg";
  if (type === "png") return extension === ".png";
  return extension === ".heic" || extension === ".heif";
}

function mimeFor(type: DetectedType): StoredMime {
  if (type === "pdf") return "application/pdf";
  if (type === "jpeg") return "image/jpeg";
  if (type === "png") return "image/png";
  return "image/heic";
}

function outputFileName(fileName: string, mimeType: StoredMime): string {
  if (mimeType === "application/pdf") return filenameWithExtension(fileName, ".pdf");
  if (mimeType === "image/jpeg") return filenameWithExtension(fileName, ".jpg");
  if (mimeType === "image/png") return filenameWithExtension(fileName, ".png");
  return filenameWithExtension(fileName, ".heic");
}

function contentDisposition(fileName: string): string {
  const fallback = (fileName.replace(/[^A-Za-z0-9._-]/g, "_") || "download").slice(0, 120);
  const encoded = encodeURIComponent(fileName).replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

function previewDisposition(fileName: string): string {
  const fallback = (fileName.replace(/[^A-Za-z0-9._-]/g, "_") || "preview.jpg").slice(0, 120);
  const encoded = encodeURIComponent(fileName).replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `inline; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

function readHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? undefined : value;
}

function hostnameIsLocal(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
}

function parseHost(header: string | undefined): { host: string; hostname: string } | null {
  if (!header || header.length > 255 || /[\s,\\/@]/.test(header)) return null;
  try {
    const candidate = new URL(`http://${header}`);
    if (candidate.username || candidate.password || candidate.pathname !== "/" || candidate.search || candidate.hash) return null;
    return { host: candidate.host.toLowerCase(), hostname: candidate.hostname.toLowerCase() };
  } catch {
    return null;
  }
}

function requestProtocol(req: Request): "http" | "https" | null {
  const protocol = req.protocol;
  return protocol === "http" || protocol === "https" ? protocol : null;
}

function configuredOrigin(deps: IntakePrivateUploadDependencies): string | null {
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

function trustedOriginFor(req: Request, deps: IntakePrivateUploadDependencies): string {
  const host = parseHost(readHeader(req, "host"));
  const protocol = requestProtocol(req);
  if (!host || !protocol) throw uploadError(403, "This upload request is not from a trusted origin.");
  const production = deps.isProduction ?? process.env.NODE_ENV === "production";
  const configured = configuredOrigin(deps);
  if (configured) {
    const expected = new URL(configured);
    if ((production && expected.protocol !== "https:") || expected.host.toLowerCase() !== host.host) {
      throw uploadError(403, "This upload request is not from a trusted origin.");
    }
    return expected.origin;
  }
  if (!production && hostnameIsLocal(host.hostname)) return `${protocol}://${host.host}`;
  const knownOrigin = KNOWN_PUBLIC_ORIGINS.get(host.host);
  if (knownOrigin) return knownOrigin;
  // Do not build a clinical-file capability URL from an arbitrary Host header. A deployment
  // using a different hostname must explicitly set INTAKE_PUBLIC_ORIGIN (or PUBLIC_ORIGIN).
  throw uploadError(503, "Private intake uploads are not configured for this origin.");
}

function requireSameOrigin(req: Request, deps: IntakePrivateUploadDependencies) {
  const fetchSite = readHeader(req, "sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw uploadError(403, "This upload request is not from a trusted origin.");
  }
  const expected = trustedOriginFor(req, deps);
  const origin = readHeader(req, "origin");
  if (!origin || !constantTimeEqual(origin, expected)) {
    throw uploadError(403, "This upload request is not from a trusted origin.");
  }
  return expected;
}

function requireSessionRequestOrigin(req: Request, deps: IntakePrivateUploadDependencies) {
  // Same-origin GET fetches normally omit Origin. Fetch Metadata plus a same-origin Referer is
  // the deliberately narrower exception for session creation only; state-changing routes remain
  // strict Origin checks above.
  if (readHeader(req, "sec-fetch-site") !== "same-origin") {
    throw uploadError(403, "This upload request is not from a trusted origin.");
  }
  const expected = trustedOriginFor(req, deps);
  const referer = readHeader(req, "referer");
  try {
    if (!referer || !constantTimeEqual(new URL(referer).origin, expected)) throw new Error("unexpected origin");
  } catch {
    throw uploadError(403, "This upload request is not from a trusted origin.");
  }
  return expected;
}

function privateDirectoryFor(deps: IntakePrivateUploadDependencies): string {
  if (!deps.tempDir) throw new Error("An explicit private test directory is required.");
  const directory = path.resolve(deps.tempDir);
  if (!path.isAbsolute(directory)) throw new Error("The explicit private test directory must be absolute.");
  const components = directory.split(path.sep).filter(Boolean).map(component => component.toLowerCase());
  if (components.includes("public")) throw new Error("The explicit private test directory must not be under a public directory.");
  const projectRelative = path.relative(process.cwd(), directory);
  if (!projectRelative.startsWith("..") && !path.isAbsolute(projectRelative) && /(^|[\\/])(client[\\/]public|dist[\\/]public|public)([\\/]|$)/i.test(projectRelative)) {
    throw new Error("The explicit private test directory must not be under a public directory.");
  }
  return directory;
}

function errorForResponse(error: unknown): IntakePrivateUploadError {
  if (error instanceof IntakePrivateUploadError) return error;
  return uploadError(500, "The intake upload could not be completed. Please try again.");
}

function operation(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, _next: NextFunction) => {
    void handler(req, res).catch(error => {
      // Do not pass upload failures to a generic development/Express handler: those handlers can
      // log request paths and emit HTML. This endpoint has no reason to disclose parser, crypto,
      // filename, or filesystem details to the browser.
      if (!res.headersSent) {
        const safe = errorForResponse(error);
        noStore(res);
        res.status(safe.status).json({ error: safe.message });
      }
    });
  };
}

function rawUploadError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  if (isNodeError(error, "entity.too.large") || (typeof error === "object" && error !== null && (error as { type?: string }).type === "entity.too.large")) {
    noStore(res);
    res.status(413).json({ error: "This file is too large." });
    return;
  }
  if (!res.headersSent) {
    const safe = errorForResponse(error);
    noStore(res);
    res.status(safe.status).json({ error: safe.message });
    return;
  }
  next(error);
}

const require = createRequire(import.meta.url);
type HeicConvert = (options: { buffer: Buffer; format: "JPEG"; quality: number }) => Promise<Buffer | Uint8Array>;

function heicConverter(): HeicConvert {
  // heic-convert is CommonJS and intentionally loaded only for the Sharp-without-libheif fallback.
  return require("heic-convert") as HeicConvert;
}

async function decodeImage(bytes: Buffer) {
  // metadata() can succeed on a format whose decoder is unavailable in the prebuilt Sharp
  // binary. A one-pixel raw render proves the byte stream actually decodes without retaining a
  // copy of the patient image or its metadata.
  await sharp(bytes, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: "error", sequentialRead: true })
    .rotate()
    .resize({ width: 1, height: 1, fit: "inside", withoutEnlargement: true })
    .raw()
    .toBuffer();
}

async function validateImage(bytes: Buffer) {
  try {
    await decodeImage(bytes);
  } catch {
    throw uploadError(422, "This image could not be safely processed. Please choose another photo.");
  }
}

async function convertHeicToJpeg(bytes: Buffer): Promise<Buffer> {
  const converted = await heicConverter()({ buffer: bytes, format: "JPEG", quality: 0.9 });
  const jpeg = Buffer.from(converted);
  await decodeImage(jpeg);
  return jpeg;
}

async function renderScaleJpeg(source: Buffer): Promise<Buffer> {
  const qualities = [82, 74, 65, 55];
  const dimensions = [SCALE_MAX_DIMENSION, 1800, 1536, 1280, 1024];
  for (const dimension of dimensions) {
    for (const quality of qualities) {
      const rendered = await sharp(source, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: "error", sequentialRead: true })
        .rotate()
        .resize({ width: dimension, height: dimension, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      if (rendered.length <= MAX_SCALE_BYTES) return rendered;
    }
  }
  throw uploadError(422, "This image could not be safely compressed. Please choose another photo.");
}

async function makeScaleJpeg(bytes: Buffer, detected: DetectedType): Promise<Buffer> {
  try {
    return await renderScaleJpeg(bytes);
  } catch (sharpError) {
    if (detected !== "heic") {
      throw uploadError(422, "This image could not be safely processed. Please choose another photo.");
    }
    // Prebuilt Sharp builds commonly recognize HEIC metadata yet fail during toBuffer() because
    // libheif is unavailable. Fall back only after the full decode/render path fails.
    try {
      return await renderScaleJpeg(await convertHeicToJpeg(bytes));
    } catch {
      throw uploadError(422, "This image could not be safely processed. Please choose another photo.");
    }
  }
}

async function prepareUpload(kind: UploadKind, rawFileName: unknown, input: Buffer): Promise<PreparedUpload> {
  if (!Buffer.isBuffer(input) || input.length === 0) throw uploadError(400, "A file is required.");
  if (input.length > MAX_UPLOAD_BYTES) throw uploadError(413, "This file is too large.");
  const fileName = safeFileName(rawFileName);
  const detected = detectType(input);
  if (!detected || !extensionMatches(detected, extensionFor(fileName))) {
    throw uploadError(415, "The file type does not match the file contents.");
  }
  if (kind === "scale" && detected === "pdf") throw uploadError(415, "A scale photo must be a JPG, PNG, or HEIC image.");

  if (kind === "scale") {
    const jpeg = await makeScaleJpeg(input, detected);
    return { bytes: jpeg, fileName: filenameWithExtension(fileName, ".jpg"), mimeType: "image/jpeg" };
  }

  if (detected === "pdf") {
    // PDFs are attachment-only on every response. SVG/HTML/executable formats never reach this
    // branch because they do not have the PDF magic header and extension combination.
    return { bytes: input, fileName, mimeType: "application/pdf" };
  }

  if (detected === "heic") {
    try {
      await validateImage(input);
      return { bytes: input, fileName, mimeType: "image/heic" };
    } catch {
      // If this Sharp build cannot read HEIC, validate by decoding it with the fallback and
      // retain a safe, standards-supported JPEG rather than storing an unvalidated opaque blob.
      let jpeg: Buffer;
      try {
        jpeg = await convertHeicToJpeg(input);
      } catch {
        throw uploadError(422, "This image could not be safely processed. Please choose another photo.");
      }
      if (jpeg.length > MAX_UPLOAD_BYTES) throw uploadError(422, "This image is too large after conversion.");
      return { bytes: jpeg, fileName: filenameWithExtension(fileName, ".jpg"), mimeType: "image/jpeg" };
    }
  }

  await validateImage(input);
  return { bytes: input, fileName, mimeType: mimeFor(detected) };
}

export class IntakePrivateUploadService {
  private readonly deps: IntakePrivateUploadDependencies;
  private readonly directory: string | null;
  private readonly now: () => number;
  private readonly entropy: (size: number) => Buffer;
  private dbPersistence: DbIntakePrivateUploadPersistence | undefined;
  // Filesystem expiry timers are retained only for isolated legacy test factories that explicitly
  // pass tempDir. The default DB path has no process-local timer or interval.
  private readonly expiryTimers = new Map<string, NodeJS.Timeout>();
  private readonly rates = new Map<string, RateEntry>();
  private initialized: Promise<void> | null = null;
  private mutation: Promise<void> = Promise.resolve();

  constructor(deps: IntakePrivateUploadDependencies = {}) {
    this.deps = deps;
    this.directory = deps.tempDir ? privateDirectoryFor(deps) : null;
    this.now = deps.now ?? Date.now;
    this.entropy = deps.randomBytes ?? randomBytes;
  }

  private secret(): string {
    const secret = this.deps.secret ?? ENV.cookieSecret;
    if (!secret || secret.length < 16) throw uploadError(503, "Private intake uploads are not configured.");
    return secret;
  }

  private key(): Buffer {
    return createHash("sha256").update(this.secret(), "utf8").update(`:${VERSION}:aes-256-gcm`, "utf8").digest();
  }

  private db(): DbIntakePrivateUploadPersistence {
    return this.deps.persistence ?? (this.dbPersistence ??= new DbIntakePrivateUploadPersistence({
      secret: this.secret(),
      now: this.now,
    }));
  }

  private legacyDirectory(): string {
    if (!this.directory) throw new Error("Filesystem upload storage is enabled only for explicit test factories.");
    return this.directory;
  }

  private keyedHash(value: string): string {
    return createHmac("sha256", this.key()).update(value, "utf8").digest("hex");
  }

  private encrypt(value: Buffer, aad: string): Buffer {
    const iv = this.entropy(12);
    if (iv.length !== 12) throw new Error("Private intake upload entropy is invalid.");
    const cipher = require("node:crypto").createCipheriv("aes-256-gcm", this.key(), iv) as import("node:crypto").CipherGCM;
    cipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), encrypted]);
  }

  private decrypt(value: Buffer, aad: string): Buffer {
    if (value.length < 1 + 12 + 16 || value[0] !== 1) throw new Error("Invalid encrypted private upload.");
    const iv = value.subarray(1, 13);
    const tag = value.subarray(13, 29);
    const encrypted = value.subarray(29);
    const decipher = require("node:crypto").createDecipheriv("aes-256-gcm", this.key(), iv) as import("node:crypto").DecipherGCM;
    decipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  private idPath(id: string, suffix: "bin" | "meta") {
    if (!ID_PATTERN.test(id)) throw uploadError(404);
    return path.join(this.legacyDirectory(), `${id}.${suffix}`);
  }

  private async ensureDirectory() {
    const directory = this.legacyDirectory();
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    const stat = await fs.lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Private intake upload directory is invalid.");
    await fs.chmod(directory, 0o700);
  }

  private async writePrivateFile(destination: string, contents: Buffer) {
    const temporary = path.join(this.legacyDirectory(), `.${path.basename(destination)}.${this.entropy(12).toString("base64url")}.tmp`);
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

  private async removePaths(id: string): Promise<void> {
    if (!this.directory) {
      const raw = await this.db().readMetadata(id).catch(() => null);
      const token = raw && typeof raw === "object" ? (raw as { download_token?: unknown }).download_token : undefined;
      if (typeof token === "string" && validOpaqueToken(token)) {
        await this.db().delete({ id, download_token: token });
      } else {
        await this.db().deleteById(id);
      }
      return;
    }
    const timer = this.expiryTimers.get(id);
    if (timer) clearTimeout(timer);
    this.expiryTimers.delete(id);
    const paths = [this.idPath(id, "bin"), this.idPath(id, "meta")];
    await Promise.all(paths.map(async candidate => {
      try {
        await fs.unlink(candidate);
      } catch (error) {
        if (!isNodeError(error, "ENOENT")) throw error;
      }
    }));
  }

  private scheduleExpiry(id: string, expiresAt: number) {
    const remaining = Math.max(0, expiresAt - this.now());
    const existing = this.expiryTimers.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      void this.removePaths(id).catch(() => undefined);
    }, remaining);
    timer.unref();
    this.expiryTimers.set(id, timer);
  }

  private metadataIsValid(value: unknown, expectedId: string): value is StoredMetadata {
    if (!value || typeof value !== "object") return false;
    const record = value as Partial<StoredMetadata>;
    const byteLength = record.byte_length;
    const createdAt = record.created_at;
    const expiresAt = record.expires_at;
    return record.version === 1
      && record.id === expectedId
      && validOpaqueToken(record.id)
      && typeof record.owner_hash === "string" && HASH_PATTERN.test(record.owner_hash)
      && validOpaqueToken(record.download_token)
      && typeof record.download_token_hash === "string" && HASH_PATTERN.test(record.download_token_hash)
      && this.keyedHash(record.download_token) === record.download_token_hash
      && (record.kind === "lab" || record.kind === "scale")
      && typeof record.file_name === "string" && (() => { try { return safeFileName(encodeURIComponent(record.file_name)) === record.file_name; } catch { return false; } })()
      && (record.mime_type === "application/pdf" || record.mime_type === "image/jpeg" || record.mime_type === "image/png" || record.mime_type === "image/heic")
      && Number.isInteger(byteLength) && typeof byteLength === "number" && byteLength > 0 && byteLength <= MAX_UPLOAD_BYTES
      && Number.isInteger(createdAt) && typeof createdAt === "number" && createdAt > 0
      && Number.isInteger(expiresAt) && typeof expiresAt === "number" && expiresAt >= createdAt && expiresAt - createdAt <= TTL_MS;
  }

  private async readMetadata(id: string): Promise<StoredMetadata | null> {
    if (!ID_PATTERN.test(id)) return null;
    if (!this.directory) {
      try {
        const record = await this.db().readMetadata(id);
        if (!record || !this.metadataIsValid(record, id)) {
          if (record) await this.db().deleteById(id).catch(() => undefined);
          return null;
        }
        if (record.expires_at <= this.now()) {
          await this.db().delete(record).catch(() => undefined);
          return null;
        }
        return record;
      } catch {
        // Database/decryption/serialization errors must never make a private file available.
        await this.db().deleteById(id).catch(() => undefined);
        return null;
      }
    }
    let encrypted: Buffer;
    try {
      const stat = await fs.lstat(this.idPath(id, "meta"));
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Invalid metadata file.");
      encrypted = await fs.readFile(this.idPath(id, "meta"));
    } catch (error) {
      if (isNodeError(error, "ENOENT")) return null;
      throw error;
    }
    try {
      const parsed = JSON.parse(this.decrypt(encrypted, `metadata:${id}`).toString("utf8")) as unknown;
      if (!this.metadataIsValid(parsed, id)) throw new Error("Invalid metadata.");
      const record = parsed as StoredMetadata;
      if (record.expires_at <= this.now()) {
        await this.removePaths(id).catch(() => undefined);
        return null;
      }
      return record;
    } catch {
      // A record encrypted with a different deployment secret, corrupted, or malformed can never
      // be served. Remove it best-effort and otherwise leave it fail-closed for the next cleanup.
      await this.removePaths(id).catch(() => undefined);
      return null;
    }
  }

  private async allRecordIds(): Promise<string[]> {
    const entries = await fs.readdir(this.legacyDirectory(), { withFileTypes: true });
    const ids: string[] = [];
    const dataIds = new Set<string>();
    for (const entry of entries) {
      const match = /^([A-Za-z0-9_-]{43})\.(meta|bin)$/.exec(entry.name);
      if (!match || !entry.isFile()) {
        // Only this module owns this directory. Remove abandoned atomics, symlinks, and unknown
        // files so an attacker cannot make the private volume accumulate unbounded junk.
        await fs.unlink(path.join(this.legacyDirectory(), entry.name)).catch(() => undefined);
        continue;
      }
      if (match[2] === "meta") ids.push(match[1]);
      else dataIds.add(match[1]);
    }
    for (const id of Array.from(dataIds)) {
      if (!ids.includes(id)) await fs.unlink(this.idPath(id, "bin")).catch(() => undefined);
    }
    return ids;
  }

  private async listRecords(): Promise<StoredMetadata[]> {
    if (!this.directory) {
      const records: StoredMetadata[] = [];
      for (const raw of await this.db().listMetadata()) {
        const id = raw && typeof raw === "object" ? (raw as { id?: unknown }).id : undefined;
        if (typeof id !== "string" || !ID_PATTERN.test(id) || !this.metadataIsValid(raw, id)) {
          if (typeof id === "string" && ID_PATTERN.test(id)) await this.db().deleteById(id).catch(() => undefined);
          continue;
        }
        const record = raw as StoredMetadata;
        if (record.expires_at <= this.now()) {
          await this.db().delete(record).catch(() => undefined);
          continue;
        }
        records.push(record);
      }
      return records;
    }
    const records: StoredMetadata[] = [];
    for (const id of await this.allRecordIds()) {
      const record = await this.readMetadata(id);
      if (record) records.push(record);
    }
    return records;
  }

  private async initializeInternal() {
    this.secret();
    if (!this.directory) {
      // The shared store enforces absolute expiry on reads. Cleanup is deliberately invoked by
      // the application's native scheduler, not a process-local interval or startup sweep.
      this.db();
      return;
    }
    await this.ensureDirectory();
    for (const record of await this.listRecords()) this.scheduleExpiry(record.id, record.expires_at);
  }

  async initialize(): Promise<void> {
    if (!this.initialized) this.initialized = this.initializeInternal();
    return this.initialized;
  }

  private async exclusive<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.directory) return this.db().withLock(operation);
    let release: (() => void) | undefined;
    const next = new Promise<void>(resolve => { release = resolve; });
    const previous = this.mutation;
    this.mutation = previous.then(() => next, () => next);
    await previous;
    try {
      return await operation();
    } finally {
      release?.();
    }
  }

  private ownerHash(ownerToken: string): string {
    if (!validOpaqueToken(ownerToken)) throw uploadError(401, "Your upload session has expired. Please refresh and try again.");
    return this.keyedHash(`owner:${ownerToken}`);
  }

  private pruneRates() {
    const now = this.now();
    for (const [key, entry] of Array.from(this.rates.entries())) if (entry.startedAt + RATE_WINDOW_MS <= now) this.rates.delete(key);
    while (this.rates.size > MAX_RATE_KEYS) {
      const oldest = this.rates.keys().next().value as string | undefined;
      if (!oldest) break;
      this.rates.delete(oldest);
    }
  }

  private async requireRate(ip: string) {
    await this.exclusive(async () => {
      this.pruneRates();
      const key = this.keyedHash(`ip:${ip || "unknown"}`);
      const now = this.now();
      const entry = this.rates.get(key);
      if (entry && entry.startedAt + RATE_WINDOW_MS > now) {
        if (entry.files >= RATE_MAX_FILES) throw uploadError(429, "Too many file uploads. Please try again later.");
        entry.files += 1;
        entry.lastSeenAt = now;
        return;
      }
      this.rates.set(key, { startedAt: now, files: 1, lastSeenAt: now });
    });
  }

  issueOwnerSession(req: Request, res: Response) {
    const origin = requireSessionRequestOrigin(req, this.deps);
    const existing = parseCookies(req).get(OWNER_COOKIE);
    const owner = validOpaqueToken(existing) ? existing : this.entropy(32).toString("base64url");
    if (!validOpaqueToken(owner)) throw new Error("Private intake upload entropy is invalid.");
    noStore(res);
    res.cookie(OWNER_COOKIE, owner, {
      httpOnly: true,
      // Express req.protocol can remain http behind a TLS-terminating proxy. The already
      // validated canonical/preview origin is the authoritative browser-facing scheme.
      secure: new URL(origin).protocol === "https:",
      sameSite: "strict",
      path: "/api/intake/",
      maxAge: TTL_MS,
    });
    res.status(204).end();
  }

  private ownerFromRequest(req: Request): string {
    const owner = parseCookies(req).get(OWNER_COOKIE);
    if (!validOpaqueToken(owner)) throw uploadError(401, "Your upload session has expired. Please refresh and try again.");
    return owner;
  }

  async upload(input: { ownerToken: string; ip: string; kind: UploadKind; fileName: unknown; bytes: Buffer }): Promise<{ upload_id: string; file_name: string; mime_type: StoredMime; expires_at: string }> {
    await this.initialize();
    const ownerHash = this.ownerHash(input.ownerToken);
    // Admit by source before decoding/re-encoding a potentially expensive image. Invalid files
    // deliberately count too, preventing repeated parser/converter work from one network peer.
    await this.requireRate(input.ip);
    const prepared = await prepareUpload(input.kind, input.fileName, input.bytes);
    return this.exclusive(async () => {
      const records = await this.listRecords();
      const ownerRecords = records.filter(record => constantTimeEqual(record.owner_hash, ownerHash));
      const ownerLabs = ownerRecords.filter(record => record.kind === "lab").length;
      const ownerScales = ownerRecords.filter(record => record.kind === "scale").length;
      const ownerBytes = ownerRecords.reduce((sum, record) => sum + record.byte_length, 0);
      const totalBytes = records.reduce((sum, record) => sum + record.byte_length, 0);
      if (records.length >= MAX_TOTAL_FILES || totalBytes + prepared.bytes.length > MAX_TOTAL_BYTES) {
        throw uploadError(503, "The private upload service is at capacity. Please try again later.");
      }
      if (ownerRecords.length >= MAX_OWNER_FILES || ownerBytes + prepared.bytes.length > MAX_OWNER_BYTES) {
        throw uploadError(429, "Your upload session has reached its file limit.");
      }
      if (input.kind === "lab" && ownerLabs >= MAX_LABS_PER_OWNER) throw uploadError(422, "You can upload up to five lab files.");
      if (input.kind === "scale" && ownerScales >= MAX_SCALE_PER_OWNER) throw uploadError(422, "Please remove the existing scale photo before uploading another.");

      const id = this.entropy(32).toString("base64url");
      const downloadToken = this.entropy(32).toString("base64url");
      if (!validOpaqueToken(id) || !validOpaqueToken(downloadToken)) throw new Error("Private intake upload entropy is invalid.");
      const createdAt = this.now();
      const record: StoredMetadata = {
        version: 1,
        id,
        owner_hash: ownerHash,
        download_token: downloadToken,
        download_token_hash: this.keyedHash(downloadToken),
        kind: input.kind,
        file_name: prepared.fileName,
        mime_type: prepared.mimeType,
        byte_length: prepared.bytes.length,
        created_at: createdAt,
        expires_at: createdAt + TTL_MS,
      };
      if (!this.directory) {
        await this.db().write(record, prepared.bytes);
      } else {
        const encryptedBytes = this.encrypt(prepared.bytes, `data:${id}`);
        const encryptedMetadata = this.encrypt(Buffer.from(JSON.stringify(record), "utf8"), `metadata:${id}`);
        try {
          await this.writePrivateFile(this.idPath(id, "bin"), encryptedBytes);
          await this.writePrivateFile(this.idPath(id, "meta"), encryptedMetadata);
        } catch (error) {
          await this.removePaths(id).catch(() => undefined);
          throw error;
        }
        this.scheduleExpiry(id, record.expires_at);
      }
      return {
        upload_id: id,
        file_name: record.file_name,
        mime_type: record.mime_type,
        expires_at: new Date(record.expires_at).toISOString(),
      };
    });
  }

  private async ownedRecord(ownerToken: string, id: string): Promise<StoredMetadata> {
    await this.initialize();
    const ownerHash = this.ownerHash(ownerToken);
    const record = await this.readMetadata(id);
    if (!record || !constantTimeEqual(record.owner_hash, ownerHash)) throw uploadError(404);
    return record;
  }

  private async decryptedBytes(record: StoredMetadata): Promise<Buffer> {
    try {
      if (!this.directory) {
        const bytes = await this.db().readBytes(record.id);
        if (!bytes || bytes.length !== record.byte_length) throw new Error("Unexpected byte length.");
        return bytes;
      }
      const encrypted = await fs.readFile(this.idPath(record.id, "bin"));
      const bytes = this.decrypt(encrypted, `data:${record.id}`);
      if (bytes.length !== record.byte_length) throw new Error("Unexpected byte length.");
      return bytes;
    } catch {
      await this.removePaths(record.id).catch(() => undefined);
      throw uploadError(404);
    }
  }

  async preview(ownerToken: string, id: string): Promise<{ bytes: Buffer; fileName: string }> {
    const record = await this.ownedRecord(ownerToken, id);
    if (record.kind !== "scale" || record.mime_type !== "image/jpeg") throw uploadError(404);
    return { bytes: await this.decryptedBytes(record), fileName: record.file_name };
  }

  async delete(ownerToken: string, id: string): Promise<void> {
    await this.ownedRecord(ownerToken, id);
    await this.removePaths(id);
  }

  /** Invoked by an application-native scheduler; this module never starts a DB cleanup timer. */
  async cleanup(): Promise<{ deleted: number }> {
    await this.initialize();
    if (!this.directory) return this.db().cleanup();
    let deleted = 0;
    for (const record of await this.listRecords()) {
      if (record.expires_at <= this.now()) {
        await this.removePaths(record.id);
        deleted += 1;
      }
    }
    return { deleted };
  }

  async download(capability: string): Promise<{ bytes: Buffer; fileName: string; mimeType: StoredMime } | null> {
    await this.initialize();
    if (!validOpaqueToken(capability)) return null;
    const candidateHash = this.keyedHash(capability);
    if (!this.directory) {
      return this.exclusive(async () => {
        const raw = await this.db().findByCapability(capability);
        const id = raw && typeof raw === "object" ? (raw as { id?: unknown }).id : undefined;
        if (typeof id !== "string" || !this.metadataIsValid(raw, id)) return null;
        const record = raw as StoredMetadata;
        if (record.expires_at <= this.now()
          || !constantTimeEqual(record.download_token_hash, candidateHash)
          || !constantTimeEqual(record.download_token, capability)) return null;
        return { bytes: await this.decryptedBytes(record), fileName: record.file_name, mimeType: record.mime_type };
      });
    }
    // listRecords removes incomplete/orphaned atomic-write files. Hold the same process-local
    // mutation gate used by upload so a capability read cannot mistake a just-created .bin or
    // transient .tmp for an abandoned record between the two atomic writes.
    return this.exclusive(async () => {
      for (const record of await this.listRecords()) {
        if (constantTimeEqual(record.download_token_hash, candidateHash) && constantTimeEqual(record.download_token, capability)) {
          return { bytes: await this.decryptedBytes(record), fileName: record.file_name, mimeType: record.mime_type };
        }
      }
      return null;
    });
  }

  async resolve(req: Request, refs: { lab_results: string[]; scale_photo: string | null }, labsAnswerYes: boolean): Promise<ResolvedIntakeUploads> {
    const labs = Array.isArray(refs?.lab_results) ? refs.lab_results : [];
    const scale = refs?.scale_photo ?? null;
    if (labs.length > MAX_LABS_PER_OWNER || labs.some(value => !validOpaqueToken(value)) || (scale !== null && !validOpaqueToken(scale))) {
      throw uploadError(400, "The selected upload references are invalid.");
    }
    if (new Set(labs).size !== labs.length || (scale !== null && labs.includes(scale))) {
      throw uploadError(400, "The selected upload references are invalid.");
    }
    if (!labsAnswerYes && labs.length > 0) {
      throw uploadError(400, "Lab uploads cannot be submitted when no labs were selected.");
    }
    if (labs.length === 0 && scale === null) {
      return {
        lab_results: [], lab_results_provided: false,
        lab_result_1_url: null, lab_result_2_url: null, lab_result_3_url: null, lab_result_4_url: null, lab_result_5_url: null,
        scale_photo_url: null, scale_photo_provided: false,
      };
    }
    await this.initialize();
    const owner = this.ownerFromRequest(req);
    const origin = trustedOriginFor(req, this.deps);
    const ownerHash = this.ownerHash(owner);
    const readOwned = async (id: string, kind: UploadKind) => {
      const record = await this.readMetadata(id);
      if (!record || record.kind !== kind || !constantTimeEqual(record.owner_hash, ownerHash)) throw uploadError(400, "One or more selected uploads are unavailable.");
      return record;
    };
    const labRecords = await Promise.all(labs.map(id => readOwned(id, "lab")));
    const scaleRecord = scale === null ? null : await readOwned(scale, "scale");
    const resultLabs: FileRef[] = labRecords.map(record => ({
      url: `${origin}/api/intake/files/${record.download_token}`,
      file_name: record.file_name,
      mime_type: record.mime_type,
    }));
    const labUrls = resultLabs.map(file => file.url);
    return {
      lab_results: resultLabs,
      lab_results_provided: resultLabs.length > 0,
      lab_result_1_url: labUrls[0] ?? null,
      lab_result_2_url: labUrls[1] ?? null,
      lab_result_3_url: labUrls[2] ?? null,
      lab_result_4_url: labUrls[3] ?? null,
      lab_result_5_url: labUrls[4] ?? null,
      scale_photo_url: scaleRecord ? `${origin}/api/intake/files/${scaleRecord.download_token}` : null,
      scale_photo_provided: scaleRecord !== null,
    };
  }

  register(app: Express) {
    // Start cleanup immediately; individual route handlers await the same initialization promise.
    void this.initialize().catch(() => undefined);

    app.get("/api/intake/uploads/session", operation(async (req, res) => {
      this.issueOwnerSession(req, res);
    }));

    app.post(
      "/api/intake/uploads",
      express.raw({ type: () => true, limit: MAX_UPLOAD_BYTES }),
      operation(async (req, res) => {
        requireSameOrigin(req, this.deps);
        const contentType = (readHeader(req, "content-type") ?? "").split(";", 1)[0].trim().toLowerCase();
        if (contentType !== ALLOWED_RAW_CONTENT_TYPE) throw uploadError(415, "Upload bytes must use application/octet-stream.");
        const kind = req.query.kind;
        if (kind !== "lab" && kind !== "scale") throw uploadError(400, "An upload kind is required.");
        const response = await this.upload({
          ownerToken: this.ownerFromRequest(req),
          ip: req.ip || "unknown",
          kind,
          fileName: readHeader(req, "x-file-name"),
          bytes: req.body as Buffer,
        });
        noStore(res);
        res.status(201).json(response);
      }),
      rawUploadError,
    );

    const deleteRoute = (app as Express & { delete?: (path: string, ...handlers: Array<(req: Request, res: Response, next: NextFunction) => unknown>) => unknown }).delete;
    if (typeof deleteRoute === "function") {
      deleteRoute.call(app, "/api/intake/uploads/:id", operation(async (req, res) => {
        requireSameOrigin(req, this.deps);
        await this.delete(this.ownerFromRequest(req), req.params.id);
        noStore(res);
        res.status(204).end();
      }));
    }

    app.get("/api/intake/uploads/:id/preview", operation(async (req, res) => {
      const preview = await this.preview(this.ownerFromRequest(req), req.params.id);
      noStore(res);
      // Only server-reencoded JPEG scale images reach this endpoint; it is useful to an
      // authenticated browser <img>, unlike the attachment-only Keragon file endpoint.
      res.set({ "Content-Type": "image/jpeg", "Content-Disposition": previewDisposition(preview.fileName) });
      res.status(200).send(preview.bytes);
    }));

    app.get("/api/intake/files/:token", operation(async (req, res) => {
      // This is a bearer-capability endpoint for Keragon. It intentionally ignores cookies and
      // never redirects; the 256-bit path capability, encrypted server record, and 24-hour TTL
      // are the authorization boundary for this server-to-server retrieval.
      const file = await this.download(req.params.token);
      if (!file) {
        noStore(res);
        res.status(404).json({ error: "The requested intake file is unavailable." });
        return;
      }
      noStore(res);
      res.set({
        "Content-Type": file.mimeType,
        "Content-Disposition": contentDisposition(file.fileName),
        "Cross-Origin-Resource-Policy": "cross-origin",
      });
      res.status(200).send(file.bytes);
    }));
  }
}

/** Create an isolated upload service. Tests should use this factory rather than the process singleton. */
export function createIntakePrivateUploadService(deps: IntakePrivateUploadDependencies = {}) {
  return new IntakePrivateUploadService(deps);
}

let defaultService: IntakePrivateUploadService | undefined;
function service(): IntakePrivateUploadService {
  defaultService ??= createIntakePrivateUploadService();
  return defaultService;
}

/** Register browser and Keragon capability routes. Called by registerIntakePaymentRoutes. */
export function registerIntakePrivateUploadRoutes(app: Express) {
  service().register(app);
}

/**
 * Resolve browser-owned opaque upload IDs into stable, expiring Keragon capability URLs.
 * Call this only after intake validation/phone validation, before final delivery. It neither
 * consumes refs nor deletes records, so delivery retries receive the same URLs through expiry.
 */
export async function resolveIntakeUploads(
  req: Request,
  refs: { lab_results: string[]; scale_photo: string | null },
  labsAnswerYes: boolean,
): Promise<ResolvedIntakeUploads> {
  return service().resolve(req, refs, labsAnswerYes);
}

/** Application-native scheduled cleanup entrypoint for the default encrypted DB backend. */
export async function cleanupIntakePrivateUploads(): Promise<{ deleted: number }> {
  return service().cleanup();
}
