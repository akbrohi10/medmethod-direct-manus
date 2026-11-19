import { createCipheriv, createDecipheriv, createHash, createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deriveIntakePrivateApplicationKey } from "./intakePrivateApplicationKey";
import { createIntakePrivateBlobDb, type IntakePrivateBlobDbPool } from "./intakePrivateBlobDb";
import {
  createIntakeTextPaymentStore, type TextPaymentConnection, type TextPaymentPool, type TextPaymentStorageRecord,
} from "./intakeTextPaymentStore";

// No application startup, real SQL, providers, settings, or real secrets are used.
const isolation = vi.hoisted(() => ({ createPool: vi.fn() }));
vi.mock("mysql2/promise", () => ({ default: { createPool: isolation.createPool } }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "", databaseUrl: "" } }));
const PAYMENT_CONTEXT = "mmd-text-intake-payment-v1";
const BLOB_CONTEXT = "mmd-intake-private-blob-db-v1";
const submission = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const capability = "T".repeat(43);
const vectors = [
  { length: 16, secret: "a".repeat(16), app: "ad55262b169a81b6c2702053a0ce57982448700c8dabfd14855f96b87238b997",
    payment: "0dddaefae4b25ddefe5fde18e2101b0ba88b676a410bea8d3e682cdc22232892",
    blobHash: "180a8a6b0338cc8c6bec71e179ad49ef1cd81b101b25c74a30193b89fea6704f",
    submissionHash: "9715fc21278ad9a6b4d2ab6a8c91bc862a84b6d20ede7b4ae3bea47d1aec2b4f",
    capabilityHash: "6ed79d100ea2dba79f464f86ba39f8001f2c7fabab3d39093912f28d96ebefc7" },
  { length: 31, secret: "b".repeat(31), app: "5962e94b36a7efa4970e837a2e43177e424bb58427a5909c4aa8c27eb472822b",
    payment: "eff2803dcb43306fe93e46a0d7bf16edb94ec88fb616989fdd95b62e8b137c2f",
    blobHash: "4df29358e7c597dd613ebc04f246cae0d9ec8f474854b78338b371e28e749d48",
    submissionHash: "3c759c06b703ba22c9aafa732526fa891d306b411462ad17237a18d021f9d91b",
    capabilityHash: "8b8550bbb7fa7ea58cc4abd3432f53bc967b44b5dbb52f225d62f3a00dce74d8" },
  { length: 32, secret: "c".repeat(32), app: "3d55b126fa61cc3d39538f3ac52ad02e6a6c19096994f9df96b45a4ad67b3a84",
    payment: "35686a6b24435ebcb42164f8142a57d19f13f476b24836c5a3071042664540d1",
    blobHash: "6e72a18d0de269d5302a3758f85c19f3b44479e4b4ea1ecd9c2086cdc405b392",
    submissionHash: "2c99ffbbf81617d9bd0421398c63690d77fa76af2ecc59e96aa7a62045bccca1",
    capabilityHash: "f718612e652ad22532957876e865f5ca196a248428421609ad3f6acc5ca4fa06" },
];

function envelope(key: Buffer, aad: string, plain: Buffer): Buffer {
  // Fixed IV only for synthetic historical-compatibility fixtures, never production encryption.
  const iv = Buffer.alloc(12, 7);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad));
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), encrypted]);
}
function open(key: Buffer, aad: string, bytes: Buffer): Buffer {
  expect(bytes[0]).toBe(1);
  const decipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(1, 13));
  decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(bytes.subarray(13, 29));
  return Buffer.concat([decipher.update(bytes.subarray(29)), decipher.final()]);
}

type RecordType = TextPaymentStorageRecord & { input: { name: string; email: string; health: string; signature: string; token: string } };
type PaymentRow = { keyHash: string; rowType: "record"; encryptedRecord: Buffer; version: number; paymentTokenHash: string };
class MockPaymentSql implements TextPaymentPool {
  rows = new Map<string, PaymentRow>();
  calls: { sql: string; values: unknown[] }[] = [];
  async execute(sql: string, values: unknown[] = []): Promise<[unknown, unknown]> {
    this.calls.push({ sql, values });
    if (sql.startsWith("INSERT IGNORE")) return [{ affectedRows: 1 }, []];
    if (sql.startsWith("SELECT encryptedRecord")) return [[this.rows.get(String(values[0]))].filter(Boolean), []];
    if (sql.startsWith("SELECT keyHash") && sql.includes("paymentTokenHash")) {
      return [[...this.rows.values()].filter(row => row.paymentTokenHash === values[0]).map(row => ({ keyHash: row.keyHash })), []];
    }
    if (sql.startsWith("INSERT INTO intake_text_payments") || sql.startsWith("UPDATE intake_text_payments")) {
      const hash = String(values[8]);
      const old = this.rows.get(hash);
      if (sql.startsWith("UPDATE") && old?.version !== values[9]) return [{ affectedRows: 0 }, []];
      this.rows.set(hash, { keyHash: hash, rowType: "record", encryptedRecord: Buffer.from(values[0] as Buffer),
        version: (old?.version ?? 0) + 1, paymentTokenHash: String(values[4]) });
      return [{ affectedRows: 1 }, []];
    }
    throw new Error("Unexpected mocked SQL");
  }
  async getConnection(): Promise<TextPaymentConnection> {
    return {
      execute: async (sql, values = []) => {
        this.calls.push({ sql, values });
        if (sql.startsWith("SET SESSION") || sql.includes("FOR UPDATE")) return [[], []];
        throw new Error("Unexpected mocked guard SQL");
      },
      beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {},
    };
  }
}
function recordFor(paymentTokenHash: string): RecordType {
  return { createdAt: 1000, expiresAt: 604801000, retentionUntil: 604801000, state: "pending", paymentTokenHash, nextSweepAt: 1801000,
    input: { name: "PRIVATE_SYNTHETIC_PATIENT", email: "PRIVATE_SYNTHETIC_EMAIL", health: "PRIVATE_SYNTHETIC_HEALTH",
      signature: "PRIVATE_SYNTHETIC_SIGNATURE", token: capability } };
}

beforeEach(() => {
  vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", undefined);
  vi.stubEnv("JWT_SECRET", undefined);
  vi.stubEnv("DATABASE_URL", undefined);
  isolation.createPool.mockImplementation(() => { throw new Error("Real SQL pool forbidden in key-reuse tests"); });
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("Real network forbidden in key-reuse tests"); }));
});
afterEach(() => {
  expect(isolation.createPool).not.toHaveBeenCalled();
  expect(globalThis.fetch).not.toHaveBeenCalled();
  vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks();
});

describe("byte-identical existing private application key", () => {
  it.each(vectors)("preserves legacy blob encryption and lookup vectors at $length characters", async vector => {
    const key = deriveIntakePrivateApplicationKey(vector.secret);
    expect(key.toString("hex")).toBe(vector.app);
    expect(key).toEqual(createHash("sha256").update(vector.secret, "utf8").update(`:${BLOB_CONTEXT}:aes-256-gcm`, "utf8").digest());
    const object = "mmd/test/legacy-object";
    const bytes = Buffer.from("PRIVATE_SYNTHETIC_LEGACY_BLOB");
    const now = 1800000000000;
    const expectedKey = Buffer.from(vector.app, "hex");
    const header = { keyHash: vector.blobHash, keyCiphertext: envelope(expectedKey, `${BLOB_CONTEXT}:key:${vector.blobHash}`, Buffer.from(object)),
      revision: 1, expiresAt: now + 1000, chunkCount: 1, byteLength: bytes.length };
    const chunk = { chunkIndex: 0, ciphertext: envelope(expectedKey, `${BLOB_CONTEXT}:chunk:${vector.blobHash}:0`, bytes) };
    const execute = vi.fn(async (sql: string, values: unknown[] = []): Promise<[any, unknown]> => {
      if (sql.startsWith("SELECT keyHash")) { expect(values).toEqual([vector.blobHash]); return [[header], []]; }
      if (sql.startsWith("SELECT chunkIndex")) return [[chunk], []];
      throw new Error("Unexpected mocked legacy blob SQL");
    });
    const pool: IntakePrivateBlobDbPool = { execute, getConnection: async () => ({ execute,
      beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {} }) };
    expect(await createIntakePrivateBlobDb({ secret: vector.secret, pool, now: () => now }).get(object)).toEqual(bytes);
    expect(execute).toHaveBeenCalledTimes(2);
  });
  it.each(["", "a".repeat(15)])("rejects application secrets below the existing policy opaquely", secret => {
    expect(() => deriveIntakePrivateApplicationKey(secret)).toThrow("Private intake storage is unavailable.");
  });
});

describe("payment application-key reuse and historical compatibility", () => {
  it.each(vectors)("recovers encrypted payment snapshots with a $length-character JWT and no extra secret", async vector => {
    vi.stubEnv("JWT_SECRET", vector.secret);
    const pool = new MockPaymentSql();
    const store = createIntakeTextPaymentStore<RecordType>({ pool });
    expect(store.isConfigured()).toBe(true); expect(pool.calls).toHaveLength(0);
    expect(store.hashSubmission(submission)).toBe(vector.submissionHash);
    expect(store.hashCapability(capability)).toBe(vector.capabilityHash);
    const record = recordFor(vector.capabilityHash);
    await store.withRecord(vector.submissionHash, async locked => { expect(await locked.read()).toBeNull(); await locked.save(record); });
    const ciphertext = pool.rows.get(vector.submissionHash)!.encryptedRecord;
    const expectedKey = Buffer.from(vector.payment, "hex");
    expect(JSON.parse(open(expectedKey, `${PAYMENT_CONTEXT}:${vector.submissionHash}`, ciphertext).toString())).toEqual(record);
    expect(ciphertext.includes(Buffer.from("PRIVATE_SYNTHETIC"))).toBe(false);
    expect(ciphertext.includes(Buffer.from(capability))).toBe(false);
    expect(JSON.stringify(pool.calls)).not.toContain(submission);
    expect(JSON.stringify(pool.calls)).not.toContain(capability);
    expect(JSON.stringify(pool.calls)).not.toContain(vector.secret);
    const second = createIntakeTextPaymentStore<RecordType>({ pool });
    expect(second.hashSubmission(submission)).toBe(vector.submissionHash);
    expect(second.hashCapability(capability)).toBe(vector.capabilityHash);
    expect(await second.findCapability(capability, "payment")).toBe(vector.submissionHash);
    expect(await second.withRecord(vector.submissionHash, locked => locked.read())).toEqual(record);
    await second.withRecord(vector.submissionHash, async locked => { await locked.read(); await locked.save(record); });
    expect(pool.rows.get(vector.submissionHash)!.encryptedRecord.equals(ciphertext)).toBe(false); // fresh random IV
    expect(await store.withRecord(vector.submissionHash, locked => locked.read())).toEqual(record);
    // Read a synthetic historical envelope using an independent, fixed expected cipher key.
    pool.rows.get(vector.submissionHash)!.encryptedRecord = envelope(expectedKey, `${PAYMENT_CONTEXT}:${vector.submissionHash}`, Buffer.from(JSON.stringify(record)));
    expect(await second.withRecord(vector.submissionHash, locked => locked.read())).toEqual(record);
  });
  it.each(vectors.slice(0, 2))("domain-separates the $length-character fallback from the private-blob key", vector => {
    const paymentKey = createHmac("sha256", deriveIntakePrivateApplicationKey(vector.secret))
      .update(`${PAYMENT_CONTEXT}:aes-256-gcm:application-key-v1`, "utf8").digest();
    expect(paymentKey.toString("hex")).toBe(vector.payment);
    expect(paymentKey.length).toBe(32);
    expect(paymentKey.equals(Buffer.from(vector.app, "hex"))).toBe(false);
  });
  it.each([32, 64])("keeps the original %i-character JWT payment key and hash derivation", length => {
    const secret = "j".repeat(length);
    vi.stubEnv("JWT_SECRET", secret);
    const store = createIntakeTextPaymentStore<RecordType>({ pool: new MockPaymentSql() });
    const legacy = createHash("sha256").update(`${PAYMENT_CONTEXT}:aes:${secret}`).digest();
    expect(store.hashSubmission(submission)).toBe(createHmac("sha256", legacy).update(`${PAYMENT_CONTEXT}:submission:${submission}`).digest("hex"));
    expect(store.hashCapability(capability)).toBe(createHmac("sha256", legacy).update(`${PAYMENT_CONTEXT}:capability:${capability}`).digest("hex"));
  });
  it("gives a valid 32-character dedicated key priority, then a direct dependency priority, with original payment bytes", () => {
    const pool = new MockPaymentSql();
    vi.stubEnv("JWT_SECRET", vectors[0].secret);
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", vectors[2].secret);
    const dedicated = createIntakeTextPaymentStore<RecordType>({ pool });
    expect(dedicated.isConfigured()).toBe(true);
    expect(dedicated.hashSubmission(submission)).toBe(vectors[2].submissionHash);
    const directSecret = "d".repeat(32);
    const direct = createIntakeTextPaymentStore<RecordType>({ pool, secret: directSecret });
    const legacy = createHash("sha256").update(`${PAYMENT_CONTEXT}:aes:${directSecret}`).digest();
    expect(direct.hashSubmission(submission)).toBe(createHmac("sha256", legacy).update(`${PAYMENT_CONTEXT}:submission:${submission}`).digest("hex"));
    expect(direct.hashSubmission(submission)).not.toBe(dedicated.hashSubmission(submission));
    expect(pool.calls).toHaveLength(0);
  });
  it.each(["", "w".repeat(31)])("explicit weak values fail closed rather than reusing JWT", weak => {
    vi.stubEnv("JWT_SECRET", vectors[2].secret);
    const pool = new MockPaymentSql();
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", weak);
    const dedicated = createIntakeTextPaymentStore<RecordType>({ pool });
    expect(dedicated.isConfigured()).toBe(false);
    expect(() => dedicated.hashSubmission(submission)).toThrow("Secure payment state is unavailable.");
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", vectors[2].secret);
    const direct = createIntakeTextPaymentStore<RecordType>({ pool, secret: weak });
    expect(direct.isConfigured()).toBe(false);
    expect(() => direct.hashCapability(capability)).toThrow("Secure payment state is unavailable.");
    expect(pool.calls).toHaveLength(0);
  });
  it.each([undefined, "", "j".repeat(15)])("missing or short application secret fails before mocked SQL", secret => {
    vi.stubEnv("JWT_SECRET", secret);
    const pool = new MockPaymentSql();
    const store = createIntakeTextPaymentStore<RecordType>({ pool });
    expect(store.isConfigured()).toBe(false);
    expect(() => store.hashSubmission(submission)).toThrow("Secure payment state is unavailable.");
    expect(pool.calls).toHaveLength(0);
  });
  it.each(vectors.slice(0, 2))("keeps GCM authentication and row AAD fail-closed with a $length-character fallback", async vector => {
    vi.stubEnv("JWT_SECRET", vector.secret);
    const pool = new MockPaymentSql();
    const store = createIntakeTextPaymentStore<RecordType>({ pool });
    const hash = store.hashSubmission(submission);
    await store.withRecord(hash, async locked => { await locked.read(); await locked.save(recordFor(store.hashCapability(capability))); });
    const row = pool.rows.get(hash)!;
    const otherHash = store.hashSubmission("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    pool.rows.set(otherHash, { ...row, keyHash: otherHash });
    await expect(store.withRecord(otherHash, locked => locked.read())).rejects.toMatchObject({ code: "storage_corrupt" });
    row.encryptedRecord[32] ^= 1;
    await expect(store.withRecord(hash, locked => locked.read())).rejects.toMatchObject({ code: "storage_corrupt" });
  });
});
