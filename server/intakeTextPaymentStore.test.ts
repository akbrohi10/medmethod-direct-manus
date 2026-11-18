import { describe, expect, it } from "vitest";
import { createIntakeTextPaymentStore, type TextPaymentPool, type TextPaymentConnection, type TextPaymentStorageRecord } from "./intakeTextPaymentStore";

type RecordType = TextPaymentStorageRecord & { input?: unknown; requestId: string };
const secret = "test-only-encryption-secret-32-characters-long";
const token = "T".repeat(43);
class MockSql implements TextPaymentPool {
  rows = new Map<string, any>();
  sql: { text: string; values: unknown[] }[] = [];
  locks = new Map<string, Promise<void>>();
  failWrites = false;
  forceConflict = false;
  async execute(text: string, values: unknown[] = []): Promise<[any, unknown]> {
    this.sql.push({ text, values });
    if (this.failWrites && /^(INSERT|UPDATE)/.test(text)) throw new Error("SQL SECRET ERROR");
    if (text.startsWith("INSERT IGNORE")) {
      const hash = String(values[0]); if (!this.rows.has(hash)) this.rows.set(hash, { keyHash: hash, rowType: "guard", version: 0 });
      return [{ affectedRows: 1 }, []];
    }
    if (text.startsWith("SELECT encryptedRecord")) return [[this.rows.get(String(values[0]))].filter(Boolean), []];
    if (text.startsWith("SELECT keyHash") && /TokenHash/.test(text)) {
      const column = text.includes("paymentTokenHash") ? "paymentTokenHash" : "resumeTokenHash";
      return [[...this.rows.values()].filter(r => r.rowType === "record" && r[column] === values[0]).map(r => ({ keyHash: r.keyHash })), []];
    }
    if (text.startsWith("SELECT keyHash") && text.includes("nextSweepAt")) {
      const limit = Number(text.match(/LIMIT (\d+)/)?.[1]);
      return [[...this.rows.values()].filter(r => r.rowType === "record" && !["completed", "expired"].includes(r.state) && r.nextSweepAt <= Number(values[0]))
        .sort((a, b) => a.nextSweepAt - b.nextSweepAt).slice(0, limit).map(r => ({ keyHash: r.keyHash })), []];
    }
    if (text.startsWith("INSERT INTO") || text.startsWith("UPDATE intake_text_payments")) {
      const [encryptedRecord, expiresAt, retentionUntil, state, paymentTokenHash, resumeTokenHash, createdAt, nextSweepAt, keyHash, expected] = values;
      const old = this.rows.get(String(keyHash));
      if (this.forceConflict || (text.startsWith("UPDATE") && old?.version !== expected)) return [{ affectedRows: 0 }, []];
      if (text.startsWith("INSERT") && old) throw new Error("duplicate");
      this.rows.set(String(keyHash), { keyHash, rowType: "record", encryptedRecord: Buffer.from(encryptedRecord as Buffer), expiresAt, retentionUntil, state,
        paymentTokenHash, resumeTokenHash, createdAt, nextSweepAt, version: old ? old.version + 1 : 1 });
      return [{ affectedRows: 1 }, []];
    }
    if (text.startsWith("DELETE")) {
      let affectedRows = 0;
      for (const [key, r] of this.rows) if (r.rowType === "record" && ["completed", "expired"].includes(r.state) && r.retentionUntil !== null && r.retentionUntil <= Number(values[0])) { this.rows.delete(key); affectedRows++; }
      return [{ affectedRows }, []];
    }
    throw new Error("unexpected mock SQL");
  }
  async getConnection(): Promise<TextPaymentConnection> {
    const sql = this;
    let releaseLock: (() => void) | undefined;
    const unlock = () => { releaseLock?.(); releaseLock = undefined; };
    return {
      async execute(text, values = []) {
        sql.sql.push({ text, values });
        if (text.startsWith("SET SESSION")) return [{ affectedRows: 0 }, []];
        if (text.includes("FOR UPDATE")) {
          const hash = String(values[0]); const prior = sql.locks.get(hash) ?? Promise.resolve();
          const held = new Promise<void>(resolve => { releaseLock = resolve; }); sql.locks.set(hash, prior.then(() => held));
          await prior; return [[{ keyHash: hash }], []];
        }
        throw new Error("unexpected guard SQL");
      },
      async beginTransaction() {}, async commit() { unlock(); }, async rollback() { unlock(); }, release() { unlock(); },
    };
  }
}
function setup() {
  const pool = new MockSql();
  const store = createIntakeTextPaymentStore<RecordType>({ pool, secret });
  const id = "a5a5a5a5-5555-4555-8555-555555555555";
  const key = store.hashSubmission(id);
  const record: RecordType = { createdAt: 1000, expiresAt: 7 * 86_400_000 + 1000, retentionUntil: 7 * 86_400_000 + 1000,
    state: "pending", paymentTokenHash: store.hashCapability(token), nextSweepAt: 1000 + 30 * 60_000,
    input: { first_name: "SECRET NAME", email: "SECRET EMAIL", health: "SECRET HEALTH", signature: "SECRET SIGNATURE", resume: token }, requestId: "request-id" };
  return { pool, store, key, record, id };
}

describe("encrypted text-intake payment durable store", () => {
  it("construction is lazy; database stores only keyed hashes and AES-256-GCM ciphertext", async () => {
    const s = setup(); expect(s.pool.sql).toHaveLength(0);
    await s.store.withRecord(s.key, async locked => { expect(await locked.read()).toBeNull(); await locked.save(s.record); });
    const row = s.pool.rows.get(s.key);
    expect(row.encryptedRecord[0]).toBe(1);
    expect(row.encryptedRecord.toString()).not.toMatch(/SECRET|request-id/);
    expect(JSON.stringify([...s.pool.rows.values()])).not.toContain(s.id);
    expect(JSON.stringify(s.pool.sql)).not.toContain(token);
    expect(s.pool.rows.size).toBe(2); // one record + one opaque guard
    expect(await s.store.withRecord(s.key, l => l.read())).toEqual(s.record);
  });
  it("fresh instance recovers the same seven-day snapshot and capability", async () => {
    const s = setup(); await s.store.withRecord(s.key, async l => { await l.read(); await l.save(s.record); });
    const second = createIntakeTextPaymentStore<RecordType>({ pool: s.pool, secret });
    expect(second.hashSubmission(s.id)).toBe(s.key);
    expect(await second.findCapability(token, "payment")).toBe(s.key);
    expect(await second.withRecord(s.key, l => l.read())).toEqual(s.record);
    expect(s.pool.rows.get(s.key).expiresAt).toBeGreaterThan(24 * 60 * 60_000);
  });
  it("committed checkpoint survives caller failure while guard lock rolls back", async () => {
    const s = setup();
    await expect(s.store.withRecord(s.key, async l => {
      await l.read(); await l.save(s.record);
      expect(s.pool.rows.get(s.key).version).toBe(1); // visible BEFORE work returns
      throw Object.assign(new Error("provider error"), { name: "IntakeTextPaymentError" });
    })).rejects.toThrow();
    expect(await s.store.withRecord(s.key, l => l.read())).toEqual(s.record);
  });
  it("two store instances serialize through SELECT FOR UPDATE and cannot lose updates", async () => {
    const s = setup(); const other = createIntakeTextPaymentStore<RecordType>({ pool: s.pool, secret });
    await s.store.withRecord(s.key, async l => { await l.read(); await l.save(s.record); });
    let enterSecond = false; let unlock!: () => void;
    const gate = new Promise<void>(resolve => { unlock = resolve; });
    const first = s.store.withRecord(s.key, async l => {
      const r = (await l.read())!; await gate; r.requestId = "first"; await l.save(r);
    });
    const second = other.withRecord(s.key, async l => {
      enterSecond = true; const r = (await l.read())!; expect(r.requestId).toBe("first"); r.requestId = "second"; await l.save(r);
    });
    await new Promise(resolve => setTimeout(resolve, 10)); expect(enterSecond).toBe(false); unlock();
    await Promise.all([first, second]);
    expect((await other.withRecord(s.key, l => l.read()))?.requestId).toBe("second");
    expect(s.pool.rows.get(s.key).version).toBe(3);
    expect(s.pool.sql.some(q => q.text.includes("FOR UPDATE"))).toBe(true);
    expect(s.pool.sql.some(q => q.text.includes("AND version = ?"))).toBe(true);
  });
  it("compare-and-set conflict and failed storage writes fail closed", async () => {
    const s = setup(); s.pool.forceConflict = true;
    await expect(s.store.withRecord(s.key, async l => { await l.read(); await l.save(s.record); })).rejects.toMatchObject({ code: "storage_conflict" });
    s.pool.forceConflict = false; s.pool.failWrites = true;
    await expect(s.store.withRecord(s.key, async l => { await l.read(); await l.save(s.record); })).rejects.toMatchObject({ code: "storage_unavailable" });
  });
  it("rejects corrupted ciphertext, wrong secret and copied-row AAD substitution", async () => {
    const s = setup(); await s.store.withRecord(s.key, async l => { await l.read(); await l.save(s.record); });
    const wrong = createIntakeTextPaymentStore<RecordType>({ pool: s.pool, secret: "different-test-key-more-than-32-chars" });
    await expect(wrong.withRecord(s.key, l => l.read())).rejects.toMatchObject({ code: "storage_corrupt" });
    const secondKey = s.store.hashSubmission("b5b5b5b5-5555-4555-8555-555555555555");
    s.pool.rows.set(secondKey, { ...s.pool.rows.get(s.key), keyHash: secondKey });
    await expect(s.store.withRecord(secondKey, l => l.read())).rejects.toMatchObject({ code: "storage_corrupt" });
    s.pool.rows.get(s.key).encryptedRecord[32] ^= 1;
    await expect(s.store.withRecord(s.key, l => l.read())).rejects.toMatchObject({ code: "storage_corrupt" });
  });
  it("short secret and malformed capability fail before SQL and never leak secrets", async () => {
    const pool = new MockSql(); const store = createIntakeTextPaymentStore<RecordType>({ pool, secret: "weak" });
    expect(() => store.hashSubmission("a".repeat(36))).toThrow("Secure payment state"); expect(pool.sql).toHaveLength(0);
    const s = setup(); await expect(s.store.findCapability("bad", "payment")).rejects.toThrow(); expect(s.pool.sql).toHaveLength(0);
  });
  it("cleanup deletes terminal redacted rows only; paid-awaiting-delivery and guard survive", async () => {
    const s = setup();
    await s.store.withRecord(s.key, async l => { await l.read(); await l.save({ ...s.record, state: "paid", retentionUntil: null }); });
    expect(await s.store.cleanup(100 * 86_400_000)).toBe(0); expect(s.pool.rows.size).toBe(2);
    await s.store.withRecord(s.key, async l => { const r = (await l.read())!; r.state = "completed"; r.retentionUntil = 100; delete r.input; await l.save(r); });
    expect(await s.store.cleanup(101)).toBe(1); expect([...s.pool.rows.values()][0].rowType).toBe("guard");
  });
  it("candidates use a literal maximum five and safe bound parameters", async () => {
    const s = setup(); await s.store.candidates(123, 1000);
    expect(s.pool.sql[0].text).toContain("LIMIT 5"); expect(s.pool.sql[0].values).toEqual([123]);
  });
});
