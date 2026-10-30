import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, type CipherGCM, type DecipherGCM } from "node:crypto";
import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { ENV } from "./_core/env";

/**
 * Encrypted short-lived private objects backed by the existing DATABASE_URL database.
 *
 * Database rows contain only HMAC lookup names and AES-256-GCM ciphertext. In particular, an
 * original object key (which callers must treat as potentially sensitive), file name, capability,
 * submission ID, and object bytes are never stored in cleartext. Chunks remain below 256 KiB after
 * encryption, which keeps writes safely below TiDB/MySQL packet limits while allowing 10 MiB labs.
 *
 * `expiresAt` is an exact application-enforced UTC epoch deadline. The accompanying TiDB TTL DDL
 * physically removes blobs/chunks no later than its asynchronous sweep after 24 hours; it is not
 * used as the authorization decision because TTL sweeps are intentionally eventual.
 */

const VERSION = "mmd-intake-private-blob-db-v1";
const MAX_KEY_BYTES = 191;
const MAX_OBJECT_BYTES = 10 * 1024 * 1024;
const MAX_ENCRYPTED_CHUNK_BYTES = 256 * 1024;
const AES_GCM_OVERHEAD = 1 + 12 + 16;
const MAX_PLAINTEXT_CHUNK_BYTES = MAX_ENCRYPTED_CHUNK_BYTES - AES_GCM_OVERHEAD;
const TTL_MS = 24 * 60 * 60 * 1000;
const LOCK_LEASE_MS = 2 * 60 * 1000;
const LOCK_WAIT_MS = 5_000;

const BLOBS_TABLE = "intake_private_blobs";
const CHUNKS_TABLE = "intake_private_blob_chunks";
const LOCKS_TABLE = "intake_private_blob_locks";

type Queryable = {
  execute<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(sql: string, values?: unknown[]): Promise<[T, unknown]>;
};

type TransactionConnection = Queryable & {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): void;
};

export type IntakePrivateBlobDbPool = Queryable & {
  getConnection(): Promise<TransactionConnection>;
  end?: () => Promise<void>;
};

export type IntakePrivateBlobDbDependencies = {
  /** Existing server-only JWT_SECRET. A missing or weak secret fails closed. */
  secret?: string;
  /** Injectable clock for tests. */
  now?: () => number;
  /** Injectable mysql2 promise pool for unit tests. Production uses DATABASE_URL. */
  pool?: IntakePrivateBlobDbPool;
};

export type IntakePrivateBlobDb = {
  put(key: string, bytes: Buffer, expiresAt: number): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
  cleanup(): Promise<{ deleted: number }>;
  withLock<T>(name: string, work: () => Promise<T> | T): Promise<T>;
};

export class IntakePrivateBlobDbError extends Error {
  constructor(
    public readonly reason: "busy" | "corrupt" | "unavailable" = "unavailable",
    message = "Private intake storage is unavailable.",
  ) {
    super(message);
    this.name = "IntakePrivateBlobDbError";
  }
}

export function isIntakePrivateBlobDbError(error: unknown): error is IntakePrivateBlobDbError {
  return error instanceof IntakePrivateBlobDbError;
}

function unavailable(): IntakePrivateBlobDbError {
  return new IntakePrivateBlobDbError("unavailable");
}

function busy(): IntakePrivateBlobDbError {
  return new IntakePrivateBlobDbError("busy");
}

function corrupt(): IntakePrivateBlobDbError {
  return new IntakePrivateBlobDbError("corrupt");
}

function isDuplicateKey(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "ER_DUP_ENTRY";
}

function isTransientLockError(error: unknown): boolean {
  if (isDuplicateKey(error)) return true;
  const code = typeof error === "object" && error !== null && "code" in error ? (error as { code?: unknown }).code : undefined;
  return code === "ER_LOCK_DEADLOCK" || code === "ER_LOCK_WAIT_TIMEOUT";
}

function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function validKey(value: unknown): value is string {
  if (typeof value !== "string" || !value || Buffer.byteLength(value, "utf8") > MAX_KEY_BYTES) return false;
  // A namespace prefix prevents accidental use of this generic store with a bare sensitive ID.
  // The rest is deliberately permissive because all database persistence is HMAC-addressed.
  return /^[a-z][a-z0-9_-]{0,63}(?::|\/)[^\u0000-\u001f\u007f]+$/i.test(value);
}

function validPrefix(value: unknown): value is string {
  if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > MAX_KEY_BYTES) return false;
  return value === "" || /^[a-z][a-z0-9_-]{0,63}(?:(?::|\/)[^\u0000-\u001f\u007f]*)?$/i.test(value);
}

function asRows(value: RowDataPacket[] | RowDataPacket[][] | ResultSetHeader): RowDataPacket[] {
  return Array.isArray(value) && (value.length === 0 || !Array.isArray(value[0])) ? value as RowDataPacket[] : [];
}

function affectedRows(value: RowDataPacket[] | RowDataPacket[][] | ResultSetHeader): number {
  return !Array.isArray(value) && typeof value.affectedRows === "number" ? value.affectedRows : 0;
}

type BlobHeader = {
  keyHash: string;
  keyCiphertext: Buffer;
  revision: number;
  expiresAt: number;
  chunkCount: number;
  byteLength: number;
};

class EncryptedIntakePrivateBlobDb implements IntakePrivateBlobDb {
  private readonly deps: IntakePrivateBlobDbDependencies;
  private readonly now: () => number;
  private poolInstance: IntakePrivateBlobDbPool | undefined;

  constructor(deps: IntakePrivateBlobDbDependencies = {}) {
    this.deps = deps;
    this.now = deps.now ?? Date.now;
  }

  private secret(): string {
    const secret = this.deps.secret ?? ENV.cookieSecret;
    if (!secret || secret.length < 16) throw unavailable();
    return secret;
  }

  private encryptionKey(): Buffer {
    return createHash("sha256")
      .update(this.secret(), "utf8")
      .update(`:${VERSION}:aes-256-gcm`, "utf8")
      .digest();
  }

  private keyHash(value: string, kind: "object" | "lock"): string {
    return createHmac("sha256", this.encryptionKey())
      .update(`${VERSION}:${kind}:${value}`, "utf8")
      .digest("hex");
  }

  private encrypt(value: Buffer, aad: string): Buffer {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.encryptionKey(), iv) as CipherGCM;
    cipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
    const ciphertext = Buffer.concat([cipher.update(value), cipher.final()]);
    return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), ciphertext]);
  }

  private decrypt(value: Buffer, aad: string): Buffer {
    if (!Buffer.isBuffer(value) || value.length < AES_GCM_OVERHEAD || value[0] !== 1) throw corrupt();
    try {
      const decipher = createDecipheriv("aes-256-gcm", this.encryptionKey(), value.subarray(1, 13)) as DecipherGCM;
      decipher.setAAD(Buffer.from(`${VERSION}:${aad}`, "utf8"));
      decipher.setAuthTag(value.subarray(13, 29));
      return Buffer.concat([decipher.update(value.subarray(29)), decipher.final()]);
    } catch {
      throw corrupt();
    }
  }

  private pool(): IntakePrivateBlobDbPool {
    if (this.poolInstance) return this.poolInstance;
    if (this.deps.pool) {
      this.poolInstance = this.deps.pool;
      return this.poolInstance;
    }
    const databaseUrl = process.env.DATABASE_URL ?? ENV.databaseUrl;
    if (!databaseUrl) throw unavailable();
    try {
      // mysql2 accepts the existing mysql:// DATABASE_URL directly. The bounded connection queue
      // avoids an unbounded pile-up if the provider is briefly unavailable.
      this.poolInstance = mysql.createPool(databaseUrl) as unknown as IntakePrivateBlobDbPool;
      return this.poolInstance;
    } catch {
      throw unavailable();
    }
  }

  private validateKey(key: string): void {
    if (!validKey(key)) throw unavailable();
  }

  private validateExpiry(expiresAt: number): void {
    const now = this.now();
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + TTL_MS) throw unavailable();
  }

  private headerFrom(row: RowDataPacket): BlobHeader | null {
    const keyHash = row.keyHash;
    const keyCiphertext = row.keyCiphertext;
    const revision = Number(row.revision);
    const expiresAt = Number(row.expiresAt);
    const chunkCount = Number(row.chunkCount);
    const byteLength = Number(row.byteLength);
    if (typeof keyHash !== "string" || !/^[a-f0-9]{64}$/.test(keyHash) || !Buffer.isBuffer(keyCiphertext)
      || !Number.isSafeInteger(revision) || revision < 1 || !Number.isSafeInteger(expiresAt)
      || !Number.isInteger(chunkCount) || chunkCount < 1 || chunkCount > Math.ceil(MAX_OBJECT_BYTES / MAX_PLAINTEXT_CHUNK_BYTES)
      || !Number.isInteger(byteLength) || byteLength < 1 || byteLength > MAX_OBJECT_BYTES) return null;
    return { keyHash, keyCiphertext, revision, expiresAt, chunkCount, byteLength };
  }

  private async inTransaction<T>(work: (connection: TransactionConnection) => Promise<T>): Promise<T> {
    let connection: TransactionConnection | undefined;
    try {
      connection = await this.pool().getConnection();
      await connection.beginTransaction();
      const result = await work(connection);
      await connection.commit();
      return result;
    } catch (error) {
      if (connection) {
        try { await connection.rollback(); } catch { /* The original failure stays opaque. */ }
      }
      if (isIntakePrivateBlobDbError(error)) throw error;
      if (isTransientLockError(error)) throw error;
      throw unavailable();
    } finally {
      connection?.release();
    }
  }

  private chunks(bytes: Buffer): Buffer[] {
    const chunks: Buffer[] = [];
    for (let offset = 0; offset < bytes.length; offset += MAX_PLAINTEXT_CHUNK_BYTES) {
      chunks.push(bytes.subarray(offset, Math.min(bytes.length, offset + MAX_PLAINTEXT_CHUNK_BYTES)));
    }
    return chunks;
  }

  async put(key: string, bytes: Buffer, expiresAt: number): Promise<void> {
    this.validateKey(key);
    this.validateExpiry(expiresAt);
    if (!Buffer.isBuffer(bytes) || bytes.length < 1 || bytes.length > MAX_OBJECT_BYTES) throw unavailable();
    const keyHash = this.keyHash(key, "object");
    const chunks = this.chunks(bytes);
    const encryptedKey = this.encrypt(Buffer.from(key, "utf8"), `key:${keyHash}`);
    const encryptedChunks = chunks.map((chunk, index) => this.encrypt(chunk, `chunk:${keyHash}:${index}`));
    if (encryptedChunks.some(chunk => chunk.length > MAX_ENCRYPTED_CHUNK_BYTES)) throw unavailable();

    await this.inTransaction(async connection => {
      // The single header row is the committed revision marker. A reader observes either the old
      // complete revision or the new complete revision because chunks and header commit together.
      await connection.execute<ResultSetHeader>(
        `INSERT INTO ${BLOBS_TABLE} (keyHash, keyCiphertext, revision, expiresAt, chunkCount, byteLength) VALUES (?, ?, 1, ?, ?, ?) ON DUPLICATE KEY UPDATE keyCiphertext = VALUES(keyCiphertext), revision = revision + 1, expiresAt = VALUES(expiresAt), chunkCount = VALUES(chunkCount), byteLength = VALUES(byteLength), createdAt = DEFAULT(createdAt)`,
        [keyHash, encryptedKey, expiresAt, encryptedChunks.length, bytes.length],
      );
      await connection.execute<ResultSetHeader>(`DELETE FROM ${CHUNKS_TABLE} WHERE keyHash = ?`, [keyHash]);
      for (let index = 0; index < encryptedChunks.length; index += 1) {
        await connection.execute<ResultSetHeader>(
          `INSERT INTO ${CHUNKS_TABLE} (keyHash, chunkIndex, ciphertext) VALUES (?, ?, ?)`,
          [keyHash, index, encryptedChunks[index]],
        );
      }
    });
  }

  private headerForKey(key: string, row: RowDataPacket | undefined): BlobHeader | null {
    if (!row) return null;
    const keyHash = this.keyHash(key, "object");
    const header = this.headerFrom(row);
    if (!header) return null;
    let storedKey: string;
    try { storedKey = this.decrypt(header.keyCiphertext, `key:${header.keyHash}`).toString("utf8"); } catch { return null; }
    return storedKey === key && header.keyHash === keyHash ? header : null;
  }

  async get(key: string): Promise<Buffer | null> {
    this.validateKey(key);
    const keyHash = this.keyHash(key, "object");
    try {
      const outcome = await this.inTransaction(async connection => {
        // One repeatable-read transaction observes a whole committed revision, never a header
        // from one write and chunks from another concurrent write.
        const [headerResult] = await connection.execute<RowDataPacket[]>(
          `SELECT keyHash, keyCiphertext, revision, expiresAt, chunkCount, byteLength FROM ${BLOBS_TABLE} WHERE keyHash = ? LIMIT 1`,
          [keyHash],
        );
        const header = this.headerForKey(key, asRows(headerResult)[0]);
        if (!header) return { expired: false, bytes: null as Buffer | null };
        if (header.expiresAt <= this.now()) return { expired: true, bytes: null as Buffer | null };
        const [result] = await connection.execute<RowDataPacket[]>(
          `SELECT chunkIndex, ciphertext FROM ${CHUNKS_TABLE} WHERE keyHash = ? ORDER BY chunkIndex ASC`,
          [header.keyHash],
        );
        const rows = asRows(result);
        if (rows.length !== header.chunkCount) throw corrupt();
        const plaintext = rows.map((row, index) => {
          if (Number(row.chunkIndex) !== index || !Buffer.isBuffer(row.ciphertext)) throw corrupt();
          return this.decrypt(row.ciphertext, `chunk:${header.keyHash}:${index}`);
        });
        const bytes = Buffer.concat(plaintext);
        if (bytes.length !== header.byteLength) throw corrupt();
        return { expired: false, bytes };
      });
      if (outcome.expired) await this.delete(key);
      return outcome.bytes;
    } catch (error) {
      // Corrupt or incomplete objects are never returned. The DB write itself is atomic, so this is
      // only a secret mismatch/corruption/TTL race; cleanup removes any residual ciphertext.
      try { await this.delete(key); } catch { /* Fail closed regardless of cleanup success. */ }
      if (isIntakePrivateBlobDbError(error) && error.reason === "corrupt") return null;
      if (isIntakePrivateBlobDbError(error)) throw error;
      throw unavailable();
    }
  }

  async delete(key: string): Promise<void> {
    this.validateKey(key);
    const keyHash = this.keyHash(key, "object");
    await this.inTransaction(async connection => {
      await connection.execute<ResultSetHeader>(`DELETE FROM ${CHUNKS_TABLE} WHERE keyHash = ?`, [keyHash]);
      await connection.execute<ResultSetHeader>(`DELETE FROM ${BLOBS_TABLE} WHERE keyHash = ?`, [keyHash]);
    });
  }

  async list(prefix: string): Promise<string[]> {
    if (!validPrefix(prefix)) throw unavailable();
    try {
      const [result] = await this.pool().execute<RowDataPacket[]>(
        `SELECT keyHash, keyCiphertext, revision, expiresAt, chunkCount, byteLength FROM ${BLOBS_TABLE} WHERE expiresAt > ?`,
        [this.now()],
      );
      const keys: string[] = [];
      for (const row of asRows(result)) {
        const header = this.headerFrom(row);
        if (!header || header.expiresAt <= this.now()) continue;
        try {
          const key = this.decrypt(header.keyCiphertext, `key:${header.keyHash}`).toString("utf8");
          if (validKey(key) && key.startsWith(prefix) && this.keyHash(key, "object") === header.keyHash) keys.push(key);
        } catch {
          // A wrong secret/corrupt row is intentionally indistinguishable from an absent object.
        }
      }
      return keys.sort();
    } catch (error) {
      if (isIntakePrivateBlobDbError(error)) throw error;
      throw unavailable();
    }
  }

  async cleanup(): Promise<{ deleted: number }> {
    const now = this.now();
    return this.inTransaction(async connection => {
      // Explicitly delete ciphertext first. This does not wait for TiDB's eventual TTL sweep and
      // keeps application-triggered cleanup deterministic without retaining orphaned chunks.
      await connection.execute<ResultSetHeader>(
        `DELETE c FROM ${CHUNKS_TABLE} c INNER JOIN ${BLOBS_TABLE} b ON b.keyHash = c.keyHash WHERE b.expiresAt <= ?`,
        [now],
      );
      const [deleted] = await connection.execute<ResultSetHeader>(`DELETE FROM ${BLOBS_TABLE} WHERE expiresAt <= ?`, [now]);
      // Orphan chunks can only be from a prior interrupted/manual operation or independent TTL
      // timing. The NOT EXISTS form is supported by MySQL 8 and TiDB.
      await connection.execute<ResultSetHeader>(
        `DELETE c FROM ${CHUNKS_TABLE} c WHERE NOT EXISTS (SELECT 1 FROM ${BLOBS_TABLE} b WHERE b.keyHash = c.keyHash)`,
      );
      await connection.execute<ResultSetHeader>(`DELETE FROM ${LOCKS_TABLE} WHERE expiresAt <= ?`, [now]);
      return { deleted: affectedRows(deleted) };
    });
  }

  private async tryAcquireLock(nameHash: string, owner: string): Promise<boolean> {
    const expiresAt = this.now() + LOCK_LEASE_MS;
    try {
      return await this.inTransaction(async connection => {
        // Conditional update is the cross-instance compare-and-set. A stale lease can be replaced;
        // a live lease has a different owner and cannot be claimed.
        const [updated] = await connection.execute<ResultSetHeader>(
          `UPDATE ${LOCKS_TABLE} SET owner = ?, expiresAt = ? WHERE nameHash = ? AND expiresAt <= ?`,
          [owner, expiresAt, nameHash, this.now()],
        );
        if (affectedRows(updated) === 1) return true;
        const [inserted] = await connection.execute<ResultSetHeader>(
          `INSERT IGNORE INTO ${LOCKS_TABLE} (nameHash, owner, expiresAt) VALUES (?, ?, ?)`,
          [nameHash, owner, expiresAt],
        );
        return affectedRows(inserted) === 1;
      });
    } catch (error) {
      if (isTransientLockError(error)) return false;
      throw error;
    }
  }

  async withLock<T>(name: string, work: () => Promise<T> | T): Promise<T> {
    if (!validKey(name)) throw unavailable();
    const nameHash = this.keyHash(name, "lock");
    const owner = randomBytes(32).toString("base64url");
    // The injectable application clock determines lease expiry for deterministic tests, but must
    // not control this bounded retry loop: a frozen test clock would otherwise spin forever.
    const deadline = Date.now() + LOCK_WAIT_MS;
    let acquired = false;
    while (!acquired) {
      acquired = await this.tryAcquireLock(nameHash, owner);
      if (acquired) break;
      if (Date.now() >= deadline) throw busy();
      await delay(15 + Math.floor(Math.random() * 20));
    }
    try {
      return await work();
    } finally {
      // Owner-conditional release cannot delete a newer holder's lease after this process pauses.
      try {
        await this.pool().execute<ResultSetHeader>(
          `DELETE FROM ${LOCKS_TABLE} WHERE nameHash = ? AND owner = ?`,
          [nameHash, owner],
        );
      } catch {
        // Expired locks remain reclaimable by another instance, so release failure is not exposed
        // after user work has completed successfully.
      }
    }
  }
}

/** Create an encrypted private blob store using the application's existing DATABASE_URL. */
export function createIntakePrivateBlobDb(deps: IntakePrivateBlobDbDependencies = {}): IntakePrivateBlobDb {
  return new EncryptedIntakePrivateBlobDb(deps);
}

/** The largest plaintext accepted by one encrypted private object (currently 10 MiB). */
export const INTAKE_PRIVATE_BLOB_MAX_BYTES = MAX_OBJECT_BYTES;
