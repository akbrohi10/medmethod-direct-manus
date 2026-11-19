import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";
import mysql, { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { deriveIntakePrivateApplicationKey } from "./intakePrivateApplicationKey";

const TABLE = "intake_text_payments";
const CONTEXT = "mmd-text-intake-payment-v1";
const MAX_BYTES = 1024 * 1024;

export type TextPaymentStorageRecord = {
  createdAt: number;
  expiresAt: number;
  /** Null means paid/uncertain awaiting reconciliation or clinical delivery; never TTL-delete. */
  retentionUntil: number | null;
  state: "pending" | "capture_uncertain" | "paid" | "completed" | "expired";
  paymentTokenHash: string;
  resumeTokenHash?: string;
  nextSweepAt: number;
};
export type TextPaymentQuery = {
  execute(sql: string, values?: unknown[]): Promise<[unknown, unknown]>;
};
export type TextPaymentConnection = TextPaymentQuery & {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): void;
};
export type TextPaymentPool = TextPaymentQuery & { getConnection(): Promise<TextPaymentConnection> };
export type TextPaymentLockedRecord<R> = {
  read(): Promise<R | null>;
  /** Commits before returning, even while the distinct guard row remains locked. */
  save(record: R): Promise<void>;
};
export type IntakeTextPaymentStore<R extends TextPaymentStorageRecord> = {
  /** Configuration only: no key derivation, pool creation, SQL, or connectivity probe. */
  isConfigured(): boolean;
  hashSubmission(submissionId: string): string;
  hashCapability(token: string): string;
  findCapability(token: string, kind: "payment" | "resume"): Promise<string | null>;
  withRecord<T>(keyHash: string, work: (locked: TextPaymentLockedRecord<R>) => Promise<T>): Promise<T>;
  candidates(now: number, limit: number): Promise<string[]>;
  cleanup(now: number): Promise<number>;
};
export class IntakeTextPaymentStoreError extends Error {
  constructor(public readonly code: "storage_unavailable" | "storage_corrupt" | "storage_conflict" = "storage_unavailable") {
    super("Secure payment state is unavailable. Please retry; do not make another payment.");
    this.name = "IntakeTextPaymentStoreError";
  }
}
export type IntakeTextPaymentStoreDependencies = {
  /** Optional explicit payment secret (>=32 characters); an invalid override fails closed. */
  secret?: string;
  databaseUrl?: string;
  pool?: TextPaymentPool;
  /** Optional distinct lock pool; production uses independent lock/write pools to avoid starvation. */
  guardPool?: TextPaymentPool;
};

/** No connection or SQL is performed until a store operation is explicitly called. */
export function createIntakeTextPaymentStore<R extends TextPaymentStorageRecord>(
  deps: IntakeTextPaymentStoreDependencies = {},
): IntakeTextPaymentStore<R> {
  let instance: TextPaymentPool | undefined;
  let guardInstance: TextPaymentPool | undefined;
  // Configuration-only selection: no derivation, pool creation, or SQL. An explicit payment
  // override must meet its original >=32 policy even when an application key is available.
  const keySource = () => {
    const explicit = deps.secret ?? process.env.TEXT_INTAKE_PAYMENT_STORAGE_SECRET;
    const secret = explicit ?? process.env.JWT_SECRET;
    if (!secret || secret.length < (explicit !== undefined ? 32 : 16)) return null;
    return { secret, reuseApplicationKey: secret.length < 32 };
  };
  const key = () => {
    const source = keySource();
    if (!source) throw new IntakeTextPaymentStoreError();
    // Keep all previously supported payment keys byte-for-byte compatible (including JWT>=32).
    if (!source.reuseApplicationKey) return createHash("sha256").update(`${CONTEXT}:aes:${source.secret}`).digest();
    // Reuse the established >=16 application-key policy without requesting another secret.
    // HMAC domain separation yields distinct payment key bytes, not additional secret entropy.
    return createHmac("sha256", deriveIntakePrivateApplicationKey(source.secret))
      .update(`${CONTEXT}:aes-256-gcm:application-key-v1`, "utf8")
      .digest();
  };
  const pool = () => {
    key();
    if (instance) return instance;
    if (deps.pool) return instance = deps.pool;
    const uri = deps.databaseUrl ?? process.env.DATABASE_URL;
    if (!uri) throw new IntakeTextPaymentStoreError();
    return instance = mysql.createPool(uri) as unknown as TextPaymentPool;
  };
  const guardPool = () => {
    key();
    if (guardInstance) return guardInstance;
    if (deps.guardPool || deps.pool) return guardInstance = deps.guardPool ?? deps.pool!;
    const uri = deps.databaseUrl ?? process.env.DATABASE_URL;
    if (!uri) throw new IntakeTextPaymentStoreError();
    // Held guards must never consume the connections needed for autocommit checkpoints.
    return guardInstance = mysql.createPool(uri) as unknown as TextPaymentPool;
  };
  const validHash = (hash: string) => {
    if (!/^[a-f0-9]{64}$/.test(hash)) throw new IntakeTextPaymentStoreError();
  };
  const keyedHash = (kind: string, value: string) => createHmac("sha256", key()).update(`${CONTEXT}:${kind}:${value}`).digest("hex");
  const encrypt = (hash: string, record: R) => {
    const plain = Buffer.from(JSON.stringify(record));
    if (plain.length > MAX_BYTES) throw new IntakeTextPaymentStoreError();
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key(), iv);
    cipher.setAAD(Buffer.from(`${CONTEXT}:${hash}`));
    const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
    return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), ciphertext]);
  };
  const decrypt = (hash: string, bytes: unknown): R => {
    try {
      if (!Buffer.isBuffer(bytes) || bytes[0] !== 1 || bytes.length < 29 || bytes.length > MAX_BYTES + 29) throw new Error();
      const decipher = createDecipheriv("aes-256-gcm", key(), bytes.subarray(1, 13));
      decipher.setAAD(Buffer.from(`${CONTEXT}:${hash}`));
      decipher.setAuthTag(bytes.subarray(13, 29));
      return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(29)), decipher.final()]).toString("utf8")) as R;
    } catch { throw new IntakeTextPaymentStoreError("storage_corrupt"); }
  };
  const query = async (sql: string, values?: unknown[]) => {
    try { return (await pool().execute(sql, values))[0]; }
    catch { throw new IntakeTextPaymentStoreError(); }
  };

  return {
    isConfigured() {
      return !!keySource() && !!(deps.pool || (deps.databaseUrl ?? process.env.DATABASE_URL));
    },
    hashSubmission(id) {
      if (typeof id !== "string" || id.length > 128 || id.length < 16) throw new IntakeTextPaymentStoreError();
      return keyedHash("submission", id);
    },
    hashCapability(token) {
      if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) throw new IntakeTextPaymentStoreError();
      return keyedHash("capability", token);
    },
    async findCapability(token, kind) {
      const hash = this.hashCapability(token);
      const column = kind === "payment" ? "paymentTokenHash" : "resumeTokenHash";
      const rows = await query(`SELECT keyHash FROM ${TABLE} WHERE rowType = 'record' AND ${column} = ? LIMIT 1`, [hash]) as RowDataPacket[];
      return rows[0]?.keyHash ?? null;
    },
    async withRecord(hash, work) {
      validHash(hash);
      const guardHash = keyedHash("guard", hash);
      // A guard row contains NO snapshot/capability. Never reaped while a record exists.
      // Locking a separate guard lets provider claims commit durably BEFORE external POSTs,
      // while the guard transaction still serializes every instance through SELECT FOR UPDATE.
      await query(`INSERT IGNORE INTO ${TABLE} (keyHash, rowType, version, expiresAt, createdAt, nextSweepAt, state) VALUES (?, 'guard', 0, 0, 0, 0, 'guard')`, [guardHash]);
      let connection: TextPaymentConnection | undefined;
      let version: number | undefined;
      try {
        connection = await guardPool().getConnection();
        await connection.execute("SET SESSION innodb_lock_wait_timeout = 5");
        await connection.beginTransaction();
        await connection.execute(`SELECT keyHash FROM ${TABLE} WHERE keyHash = ? AND rowType = 'guard' FOR UPDATE`, [guardHash]);
        const locked: TextPaymentLockedRecord<R> = {
          read: async () => {
            const rows = await query(`SELECT encryptedRecord, version FROM ${TABLE} WHERE keyHash = ? AND rowType = 'record' LIMIT 1`, [hash]) as RowDataPacket[];
            if (!rows[0]) { version = 0; return null; }
            version = Number(rows[0].version);
            if (!Number.isSafeInteger(version) || version < 1) throw new IntakeTextPaymentStoreError("storage_corrupt");
            return decrypt(hash, rows[0].encryptedRecord);
          },
          save: async record => {
            if (version === undefined) throw new IntakeTextPaymentStoreError("storage_conflict");
            if (![record.createdAt, record.expiresAt, record.nextSweepAt].every(Number.isSafeInteger)
              || (record.retentionUntil !== null && !Number.isSafeInteger(record.retentionUntil))
              || !["pending", "capture_uncertain", "paid", "completed", "expired"].includes(record.state)) throw new IntakeTextPaymentStoreError();
            validHash(record.paymentTokenHash);
            if (record.resumeTokenHash) validHash(record.resumeTokenHash);
            const values = [encrypt(hash, record), record.expiresAt, record.retentionUntil, record.state, record.paymentTokenHash,
              record.resumeTokenHash ?? null, record.createdAt, record.nextSweepAt];
            const result = version === 0
              ? await query(`INSERT INTO ${TABLE} (encryptedRecord, expiresAt, retentionUntil, state, paymentTokenHash, resumeTokenHash, createdAt, nextSweepAt, keyHash, rowType, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'record', 1)`, [...values, hash])
              : await query(`UPDATE ${TABLE} SET encryptedRecord = ?, expiresAt = ?, retentionUntil = ?, state = ?, paymentTokenHash = ?, resumeTokenHash = ?, createdAt = ?, nextSweepAt = ?, version = version + 1 WHERE keyHash = ? AND rowType = 'record' AND version = ?`, [...values, hash, version]);
            if ((result as ResultSetHeader).affectedRows !== 1) throw new IntakeTextPaymentStoreError("storage_conflict");
            version++;
          },
        };
        const result = await work(locked);
        await connection.commit();
        return result;
      } catch (error) {
        try { await connection?.rollback(); } catch { /* Do not expose SQL or secrets. */ }
        // Preserve service errors; only database setup errors need opaque translation.
        if (error instanceof Error && (error.name === "IntakeTextPaymentError" || error instanceof IntakeTextPaymentStoreError)) throw error;
        throw new IntakeTextPaymentStoreError();
      } finally { connection?.release(); }
    },
    async candidates(now, limit) {
      const boundedLimit = Math.max(1, Math.min(5, Math.floor(limit)));
      const rows = await query(`SELECT keyHash FROM ${TABLE} WHERE rowType = 'record' AND state <> 'completed' AND state <> 'expired' AND nextSweepAt <= ? ORDER BY nextSweepAt ASC LIMIT ${boundedLimit}`, [now]) as RowDataPacket[];
      return rows.map(row => String(row.keyHash));
    },
    async cleanup(now) {
      // Pending snapshots are purged by service under their guard after expiry/reconciliation.
      // This only removes already-redacted terminal tombstones. Never delete paid-awaiting-delivery.
      const result = await query(`DELETE FROM ${TABLE} WHERE rowType = 'record' AND state IN ('completed', 'expired') AND retentionUntil IS NOT NULL AND retentionUntil <= ?`, [now]) as ResultSetHeader;
      // Guards intentionally remain: deleting guard rows can create two concurrent locks.
      return result.affectedRows;
    },
  };
}
