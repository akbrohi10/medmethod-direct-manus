import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import type { Express } from "express";
import mysql, { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { ENV } from "./_core/env";
import type { GhlIntakeWebhookPayload } from "./ghlIntakeWebhookPayload";

const DOMAIN = "mmd-ghl-intake-outbox-v1";
const MAX_ATTEMPTS = 4;
const TIMEOUT_MS = 3_000;
const LEASE_MS = 30_000; // Longer than the entire four-attempt HTTP budget (12 seconds).
const RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;
const BATCH_SIZE = 5; // At most 60 seconds of HTTP work per finite flush, not an in-process cron.
const SAFE_WARNING = "[GHL intake outbox] Notification work could not complete.";
const TABLE = "ghl_intake_webhook_outbox";
const DB_NOW = "CAST(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3)) * 1000 AS UNSIGNED)";
const ELIGIBLE = `(status = 'pending' OR (status = 'processing' AND leaseExpiresAt <= ${DB_NOW}))`;

function unavailable(): Error { return new Error("GHL intake outbox unavailable."); }

export type GhlIntakeWebhookClaim = {
  eventKey: string;
  encryptedPayload: Buffer | null;
  attempts: number;
  leaseOwner: string;
};

/** Atomic operations; callers must never implement claims using an unconditional read/write. */
export interface GhlIntakeWebhookStore {
  insert(eventKey: string, encryptedPayload: Buffer): Promise<void>;
  claimNext(owner: string): Promise<GhlIntakeWebhookClaim | null>;
  reserveAttempt(claim: GhlIntakeWebhookClaim): Promise<boolean>;
  finish(claim: GhlIntakeWebhookClaim, status: "sent" | "failed"): Promise<boolean>;
  purgeExpiredTerminal(): Promise<number>;
}

export type GhlIntakeWebhookSqlPool = {
  execute<T extends RowDataPacket[] | ResultSetHeader>(query: string, values?: (string | number | Buffer | null)[]): Promise<[T, unknown]>;
};

/** Independent table/pool: clinical receipt/blob expiration cannot remove deduplication state. */
export function createGhlIntakeWebhookSqlStore(injectedPool?: GhlIntakeWebhookSqlPool): GhlIntakeWebhookStore {
  let pool = injectedPool;
  async function execute<T extends RowDataPacket[] | ResultSetHeader>(query: string, values: (string | number | Buffer | null)[] = []): Promise<T> {
    try {
      if (!pool) {
        if (!ENV.databaseUrl) throw unavailable();
        pool = mysql.createPool(ENV.databaseUrl) as unknown as GhlIntakeWebhookSqlPool;
      }
      const [result] = await pool.execute<T>(query, values);
      return result;
    } catch { throw unavailable(); } // Never expose mysql errors, query parameters, or connection URLs.
  }
  return {
    async insert(eventKey, encryptedPayload) {
      // Duplicate submission IDs never replace payloads, reset attempts, or revive terminal rows.
      await execute<ResultSetHeader>(
        `INSERT INTO ${TABLE} (eventKey, encryptedPayload, status, attempts, createdAt) VALUES (?, ?, 'pending', 0, ${DB_NOW}) ON DUPLICATE KEY UPDATE eventKey = eventKey`,
        [eventKey, encryptedPayload],
      );
    },
    async claimNext(owner) {
      const candidates = await execute<RowDataPacket[]>(`SELECT eventKey FROM ${TABLE} WHERE ${ELIGIBLE} ORDER BY createdAt LIMIT 10`);
      for (const row of candidates) {
        // Database time avoids cross-instance clock skew. The conditional UPDATE is the claim,
        // not the preceding SELECT; only one live owner can win, including on TiDB/MySQL.
        const result = await execute<ResultSetHeader>(
          `UPDATE ${TABLE} SET status = 'processing', leaseOwner = ?, leaseExpiresAt = ${DB_NOW} + ? WHERE eventKey = ? AND ${ELIGIBLE}`,
          [owner, LEASE_MS, row.eventKey],
        );
        if (result.affectedRows !== 1) continue;
        const rows = await execute<RowDataPacket[]>(
          `SELECT eventKey, encryptedPayload, attempts, leaseOwner FROM ${TABLE} WHERE eventKey = ? AND leaseOwner = ? AND status = 'processing' AND leaseExpiresAt > ${DB_NOW}`,
          [row.eventKey, owner],
        );
        if (rows.length) return {
          eventKey: String(rows[0].eventKey), encryptedPayload: rows[0].encryptedPayload,
          attempts: Number(rows[0].attempts), leaseOwner: owner,
        };
      }
      return null;
    },
    async reserveAttempt(claim) {
      // Reserve BEFORE sending. A crash may consume an attempt but cannot reset the global cap.
      const result = await execute<ResultSetHeader>(
        `UPDATE ${TABLE} SET attempts = attempts + 1 WHERE eventKey = ? AND leaseOwner = ? AND status = 'processing' AND leaseExpiresAt > ${DB_NOW} AND attempts < ?`,
        [claim.eventKey, claim.leaseOwner, MAX_ATTEMPTS],
      );
      return result.affectedRows === 1;
    },
    async finish(claim, status) {
      const result = await execute<ResultSetHeader>(
        `UPDATE ${TABLE} SET status = ?, encryptedPayload = NULL, leaseOwner = NULL, leaseExpiresAt = NULL, terminalExpiresAt = ${DB_NOW} + ? WHERE eventKey = ? AND leaseOwner = ? AND status = 'processing' AND leaseExpiresAt > ${DB_NOW}`,
        [status, RETENTION_MS, claim.eventKey, claim.leaseOwner],
      );
      return result.affectedRows === 1;
    },
    async purgeExpiredTerminal() {
      const result = await execute<ResultSetHeader>(
        `DELETE FROM ${TABLE} WHERE status IN ('sent', 'failed') AND terminalExpiresAt <= ${DB_NOW} LIMIT 100`,
      );
      return result.affectedRows;
    },
  };
}

export type GhlIntakeWebhookReport = {
  status: "disabled" | "ok" | "unavailable";
  claimed: number;
  attempted: number;
  sent: number;
  failed: number;
  purged: number;
};

export type GhlIntakeWebhookQueueDependencies = {
  store?: GhlIntakeWebhookStore;
  /** Tests only; production obtains its destination exclusively from ENV.ghlIntakeWebhookUrl. */
  configuration?: () => { url: string | undefined; secret: string | undefined };
  fetch?: typeof fetch;
  warn?: (message: string) => void;
};

function contactOnly(payload: GhlIntakeWebhookPayload): GhlIntakeWebhookPayload {
  // Defense in depth: a structurally wider object must not smuggle clinical fields, signed
  // document URLs, card data, or submission tokens into persistence or the outbound JSON.
  const value: GhlIntakeWebhookPayload = {
    event: "intake_submitted",
    first_name: payload.first_name, last_name: payload.last_name, email: payload.email,
    phone: payload.phone, state: payload.state, visit_type: payload.visit_type,
    sms_opt_in: payload.sms_opt_in, submitted_at: payload.submitted_at,
    source: "website_intake", is_test: payload.is_test,
    utm_source: payload.utm_source, utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign, utm_content: payload.utm_content,
  };
  if (Object.values(value).some(v => typeof v !== "string" && typeof v !== "boolean")
    || Object.values(value).some(v => typeof v === "string" && (v.length > 320 || /[\u0000-\u001f\u007f]/.test(v)))
    || !/^\+1\d{10}$/.test(value.phone) || !/^[A-Z]{2}$/.test(value.state)
    || !["free_text_visit", "video_visit"].includes(value.visit_type)
    || typeof value.sms_opt_in !== "boolean" || typeof value.is_test !== "boolean") throw unavailable();
  return value;
}

function encryptionKey(secret: string): Buffer {
  return createHmac("sha256", secret).update(`${DOMAIN}:encryption`).digest();
}
function encrypt(secret: string, eventKey: string, payload: GhlIntakeWebhookPayload): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  cipher.setAAD(Buffer.from(`${DOMAIN}:${eventKey}`));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), ciphertext]);
}
function decrypt(secret: string, claim: GhlIntakeWebhookClaim): GhlIntakeWebhookPayload {
  const bytes = claim.encryptedPayload;
  if (!Buffer.isBuffer(bytes) || bytes.length < 29 || bytes[0] !== 1) throw unavailable();
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), bytes.subarray(1, 13));
  decipher.setAAD(Buffer.from(`${DOMAIN}:${claim.eventKey}`));
  decipher.setAuthTag(bytes.subarray(13, 29));
  return contactOnly(JSON.parse(Buffer.concat([decipher.update(bytes.subarray(29)), decipher.final()]).toString("utf8")));
}

/** No recurring timers. Enqueue, startup registration, and an authenticated future heartbeat
 * each perform finite recovery work. Keep JWT_SECRET stable across instances/restarts: it is
 * the encryption/HMAC root, as in the existing encrypted intake store. Rotations need migration.
 */
export function createGhlIntakeWebhookQueue(deps: GhlIntakeWebhookQueueDependencies = {}) {
  const store = deps.store ?? createGhlIntakeWebhookSqlStore();
  const fetcher = deps.fetch ?? ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));
  const active = new Set<Promise<unknown>>();
  function warn() {
    try { (deps.warn ?? console.warn)(SAFE_WARNING); } catch { /* Logging cannot affect intake success. */ }
  }
  function config(): { url: string; secret: string } | null {
    // Historical intake suites may import real ENV with a configured production secret.
    // Vitest must never use the real queue; executable unit tests opt in with injected config.
    if (!deps.configuration && process.env.VITEST) return null;
    const settings = deps.configuration?.() ?? { url: ENV.ghlIntakeWebhookUrl, secret: ENV.cookieSecret };
    // Old ENV mocks omit this field: disabled means no storage work and no live calls.
    if (!settings.url) return null;
    if (!settings.secret || settings.secret.length < 16) throw unavailable();
    const url = new URL(settings.url);
    if (url.protocol !== "https:" || url.username || url.password || url.hash) throw unavailable();
    return { url: settings.url, secret: settings.secret };
  }
  function track<T>(promise: Promise<T>): Promise<T> {
    active.add(promise);
    // Both fulfillment and rejection handlers avoid creating an unhandled rejected .finally().
    void promise.then(() => active.delete(promise), () => active.delete(promise));
    return promise;
  }
  async function send(url: string, body: string, eventKey: string): Promise<boolean> {
    try {
      const response = await fetcher(url, {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": eventKey },
        body, redirect: "error", signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      // Do not read/log provider response bodies or redirect destinations. Cancellation errors
      // are also intentionally opaque and do not change a received success acknowledgment.
      try { void response.body?.cancel().catch(() => {}); } catch { /* No body access required. */ }
      return response.status >= 200 && response.status < 300;
    } catch { return false; }
  }
  async function performFlush(): Promise<GhlIntakeWebhookReport> {
    const report: GhlIntakeWebhookReport = { status: "ok", claimed: 0, attempted: 0, sent: 0, failed: 0, purged: 0 };
    try {
      const settings = config();
      if (!settings) return { ...report, status: "disabled" };
      report.purged = await store.purgeExpiredTerminal();
      for (let i = 0; i < BATCH_SIZE; i++) {
        const claim = await store.claimNext(randomBytes(24).toString("hex"));
        if (!claim) break;
        report.claimed++;
        if (claim.attempts >= MAX_ATTEMPTS) {
          if (await store.finish(claim, "failed")) report.failed++;
          continue;
        }
        let body: string;
        try { body = JSON.stringify(decrypt(settings.secret, claim)); }
        catch {
          // Corrupt ciphertext cannot be delivered; remove it and retain the dedup tombstone.
          if (await store.finish(claim, "failed")) report.failed++;
          warn();
          continue;
        }
        let delivered = false;
        while (claim.attempts < MAX_ATTEMPTS) {
          if (!await store.reserveAttempt(claim)) break;
          claim.attempts++;
          report.attempted++;
          // Delivery is at-least-once within the bounded attempt budget, NOT exactly-once.
          // A lost acknowledgment can cause another POST. The stable Idempotency-Key must
          // be honored by the external receiver for end-to-end logical-event deduplication.
          if (await send(settings.url, body, claim.eventKey)) {
            delivered = true;
            if (await store.finish(claim, "sent")) report.sent++;
            break;
          }
        }
        if (!delivered && claim.attempts >= MAX_ATTEMPTS && await store.finish(claim, "failed")) report.failed++;
      }
      if (report.failed) warn();
    } catch { report.status = "unavailable"; warn(); }
    return report; // Only aggregate counts/status; never tokens, event keys, payloads, URLs, or errors.
  }
  function flush(): Promise<GhlIntakeWebhookReport> { return track(performFlush()); }
  function enqueue(submissionId: string, payload: GhlIntakeWebhookPayload): void {
    try {
      const settings = config();
      if (!settings) return;
      if (typeof submissionId !== "string" || !submissionId || submissionId.length > 191) throw unavailable();
      const eventKey = createHmac("sha256", settings.secret).update(`${DOMAIN}:submission:${submissionId}`).digest("hex");
      // Synchronously snapshot/project/encrypt, then release the patient request without awaiting
      // persistence or HTTP. A database outage is safely reported, never rerouted to plaintext RAM.
      const ciphertext = encrypt(settings.secret, eventKey, contactOnly(payload));
      void track((async () => {
        try { await store.insert(eventKey, ciphertext); await flush(); }
        catch { warn(); }
      })());
    } catch { warn(); }
  }
  async function idle(): Promise<void> {
    while (active.size) await Promise.allSettled(Array.from(active));
  }
  return { enqueue, flush, idle };
}

const queue = createGhlIntakeWebhookQueue();
/** Call ONLY after Keragon accepts the intake; never await this patient-independent notification. */
export function enqueueGhlIntakeWebhook(submissionId: string, payload: GhlIntakeWebhookPayload): void {
  queue.enqueue(submissionId, payload);
}
export function flushGhlIntakeWebhooks(): Promise<GhlIntakeWebhookReport> { return queue.flush(); }
/** Synthetic-test drain, no credentials or patient data returned. */
export function awaitGhlIntakeWebhookIdle(): Promise<void> { return queue.idle(); }

export function registerGhlIntakeWebhookRoutes(app: Express): void {
  // A finite startup recovery pass, not a cron/timer. Never creates or activates a schedule.
  // Register this route before static/Vite fallthrough; create a heartbeat only AFTER deployment.
  void flushGhlIntakeWebhooks();
  app.post("/api/scheduled/ghl-intake-webhooks", async (req, res) => {
    try {
      // Lazy import avoids initializing auth/logging for disabled queue-only unit tests.
      const { sdk } = await import("./_core/sdk");
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    } catch { return res.status(403).json({ error: "cron-only" }); }
    const report = await flushGhlIntakeWebhooks();
    return res.status(report.status === "unavailable" ? 503 : 200).json(report);
  });
}
