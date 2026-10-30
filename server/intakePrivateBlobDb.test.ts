import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createIntakePrivateBlobDb,
  type IntakePrivateBlobDbPool,
} from "./intakePrivateBlobDb";

type Header = {
  keyHash: string;
  keyCiphertext: Buffer;
  revision: number;
  expiresAt: number;
  chunkCount: number;
  byteLength: number;
};
type Lock = { owner: string; expiresAt: number };

/** A deliberately small mysql2/promise contract double; it records bound values, not raw SQL data. */
class MemoryPool implements IntakePrivateBlobDbPool {
  headers = new Map<string, Header>();
  chunks = new Map<string, Map<number, Buffer>>();
  locks = new Map<string, Lock>();
  readonly calls: Array<{ sql: string; values: unknown[] }> = [];
  private snapshot: { headers: Map<string, Header>; chunks: Map<string, Map<number, Buffer>>; locks: Map<string, Lock> } | undefined;

  async getConnection() { return this; }
  async beginTransaction() {
    this.snapshot = {
      headers: new Map([...this.headers].map(([key, value]) => [key, { ...value, keyCiphertext: Buffer.from(value.keyCiphertext) }])),
      chunks: new Map([...this.chunks].map(([key, value]) => [key, new Map([...value].map(([index, bytes]) => [index, Buffer.from(bytes)]))])),
      locks: new Map([...this.locks].map(([key, value]) => [key, { ...value }])),
    };
  }
  async commit() { this.snapshot = undefined; }
  async rollback() {
    if (!this.snapshot) return;
    this.headers = this.snapshot.headers;
    this.chunks = this.snapshot.chunks;
    this.locks = this.snapshot.locks;
    this.snapshot = undefined;
  }
  release() {}

  async execute(sql: string, values: unknown[] = []): Promise<[any, unknown]> {
    this.calls.push({ sql, values });
    if (sql.startsWith("INSERT INTO intake_private_blobs")) {
      const [keyHash, keyCiphertext, expiresAt, chunkCount, byteLength] = values as [string, Buffer, number, number, number];
      const old = this.headers.get(keyHash);
      this.headers.set(keyHash, { keyHash, keyCiphertext: Buffer.from(keyCiphertext), revision: (old?.revision ?? 0) + 1, expiresAt, chunkCount, byteLength });
      return [{ affectedRows: 1 }, undefined];
    }
    if (sql.startsWith("INSERT INTO intake_private_blob_chunks")) {
      const [keyHash, chunkIndex, ciphertext] = values as [string, number, Buffer];
      const chunks = this.chunks.get(keyHash) ?? new Map<number, Buffer>();
      chunks.set(chunkIndex, Buffer.from(ciphertext));
      this.chunks.set(keyHash, chunks);
      return [{ affectedRows: 1 }, undefined];
    }
    if (sql.startsWith("SELECT keyHash") && sql.includes("FROM intake_private_blobs WHERE keyHash")) {
      const value = this.headers.get(values[0] as string);
      return [value ? [{ ...value }] : [], undefined];
    }
    if (sql.startsWith("SELECT chunkIndex")) {
      const rows = [...(this.chunks.get(values[0] as string) ?? new Map())]
        .sort(([left], [right]) => left - right)
        .map(([chunkIndex, ciphertext]) => ({ chunkIndex, ciphertext: Buffer.from(ciphertext) }));
      return [rows, undefined];
    }
    if (sql.startsWith("SELECT keyHash") && sql.includes("WHERE expiresAt >")) {
      const now = values[0] as number;
      return [[...this.headers.values()].filter(header => header.expiresAt > now).map(header => ({ ...header })) as any, undefined];
    }
    if (sql.startsWith("DELETE FROM intake_private_blob_chunks WHERE keyHash")) {
      this.chunks.delete(values[0] as string);
      return [{ affectedRows: 1 }, undefined];
    }
    if (sql.startsWith("DELETE FROM intake_private_blobs WHERE keyHash")) {
      const deleted = this.headers.delete(values[0] as string) ? 1 : 0;
      return [{ affectedRows: deleted }, undefined];
    }
    if (sql.startsWith("DELETE c FROM intake_private_blob_chunks")) {
      const now = values[0] as number;
      for (const [keyHash] of this.chunks) if ((this.headers.get(keyHash)?.expiresAt ?? 0) <= now) this.chunks.delete(keyHash);
      return [{ affectedRows: 1 }, undefined];
    }
    if (sql.startsWith("DELETE FROM intake_private_blobs WHERE expiresAt")) {
      const now = values[0] as number;
      let deleted = 0;
      for (const [keyHash, header] of this.headers) if (header.expiresAt <= now) { this.headers.delete(keyHash); deleted += 1; }
      return [{ affectedRows: deleted }, undefined];
    }
    if (sql.startsWith("DELETE c FROM intake_private_blob_chunks c WHERE NOT EXISTS")) {
      for (const keyHash of this.chunks.keys()) if (!this.headers.has(keyHash)) this.chunks.delete(keyHash);
      return [{ affectedRows: 0 }, undefined];
    }
    if (sql.startsWith("DELETE FROM intake_private_blob_locks WHERE expiresAt")) {
      const now = values[0] as number;
      for (const [keyHash, lock] of this.locks) if (lock.expiresAt <= now) this.locks.delete(keyHash);
      return [{ affectedRows: 0 }, undefined];
    }
    if (sql.startsWith("UPDATE intake_private_blob_locks SET owner")) {
      const [owner, expiresAt, nameHash, now] = values as [string, number, string, number];
      const current = this.locks.get(nameHash);
      if (current && current.expiresAt <= now) {
        this.locks.set(nameHash, { owner, expiresAt });
        return [{ affectedRows: 1 }, undefined];
      }
      return [{ affectedRows: 0 }, undefined];
    }
    if (sql.startsWith("INSERT IGNORE INTO intake_private_blob_locks")) {
      const [nameHash, owner, expiresAt] = values as [string, string, number];
      if (this.locks.has(nameHash)) return [{ affectedRows: 0 }, undefined];
      this.locks.set(nameHash, { owner, expiresAt });
      return [{ affectedRows: 1 }, undefined];
    }
    if (sql.startsWith("DELETE FROM intake_private_blob_locks WHERE nameHash")) {
      const [nameHash, owner] = values as [string, string];
      const current = this.locks.get(nameHash);
      const deleted = current?.owner === owner ? 1 : 0;
      if (deleted) this.locks.delete(nameHash);
      return [{ affectedRows: deleted }, undefined];
    }
    throw new Error(`Unsupported test SQL: ${sql}`);
  }
}

const SECRET = "blob-store-test-secret-longer-than-sixteen";

describe("encrypted intake private DB blobs", () => {
  it("encrypts opaque keys and chunks a multi-part object without plaintext persistence", async () => {
    const pool = new MemoryPool();
    let now = 1_800_000_000_000;
    const store = createIntakePrivateBlobDb({ secret: SECRET, pool, now: () => now });
    const sensitiveKey = "mmd/test/private/Patient-Synthetic-98765";
    const bytes = Buffer.concat([Buffer.from("PRIVATE SYNTHETIC PATIENT CONTENT"), randomBytes((1024 * 1024) - 33)]);

    await store.put(sensitiveKey, bytes, now + (24 * 60 * 60 * 1000));

    expect(pool.headers).toHaveLength(1);
    expect(pool.chunks.size).toBe(1);
    const storedHeader = [...pool.headers.values()][0];
    const storedChunks = [...pool.chunks.values()][0];
    expect(storedHeader.keyHash).toMatch(/^[a-f0-9]{64}$/);
    expect(storedHeader.keyCiphertext.toString("utf8")).not.toContain("Patient-Synthetic");
    expect(storedHeader.keyCiphertext.includes(bytes.subarray(0, 64))).toBe(false);
    expect(storedChunks.size).toBeGreaterThan(1);
    for (const ciphertext of storedChunks.values()) {
      expect(ciphertext.length).toBeLessThanOrEqual(256 * 1024);
      expect(ciphertext.includes(bytes.subarray(0, 64))).toBe(false);
    }
    expect(await store.get(sensitiveKey)).toEqual(bytes);
    expect(pool.calls.every(call => !call.sql.includes("Patient-Synthetic"))).toBe(true);
  });

  it("enforces exact expiry, physically removes ciphertext, and lists only live names", async () => {
    const pool = new MemoryPool();
    let now = 1_800_000_000_000;
    const store = createIntakePrivateBlobDb({ secret: SECRET, pool, now: () => now });
    await store.put("mmd/test/one", Buffer.from("first"), now + 10);
    await store.put("mmd/test/two", Buffer.from("second"), now + 1000);
    expect(await store.list("mmd/test/")).toEqual(["mmd/test/one", "mmd/test/two"]);

    now += 10;
    expect(await store.get("mmd/test/one")).toBeNull();
    expect(await store.list("mmd/test/")).toEqual(["mmd/test/two"]);
    expect(pool.headers).toHaveLength(1);
    expect(pool.chunks).toHaveLength(1);

    now += 1000;
    await expect(store.cleanup()).resolves.toEqual({ deleted: 1 });
    expect(pool.headers).toHaveLength(0);
    expect(pool.chunks).toHaveLength(0);
  });

  it("serializes a lease across independent store instances and conditionally releases it", async () => {
    const pool = new MemoryPool();
    const now = () => 1_800_000_000_000;
    const first = createIntakePrivateBlobDb({ secret: SECRET, pool, now });
    const second = createIntakePrivateBlobDb({ secret: SECRET, pool, now });
    let releaseFirst!: () => void;
    const firstGate = new Promise<void>(resolve => { releaseFirst = resolve; });
    const order: string[] = [];
    const holder = first.withLock("mmd/test/claim", async () => {
      order.push("first-start");
      await firstGate;
      order.push("first-end");
    });
    await new Promise(resolve => setTimeout(resolve, 30));
    const waiter = second.withLock("mmd/test/claim", async () => { order.push("second"); });
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(order).toEqual(["first-start"]);
    releaseFirst();
    await Promise.all([holder, waiter]);
    expect(order).toEqual(["first-start", "first-end", "second"]);
    expect(pool.locks).toHaveLength(0);
  });
});
