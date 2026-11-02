import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import {
  awaitGhlIntakeWebhookIdle,
  createGhlIntakeWebhookQueue,
  createGhlIntakeWebhookSqlStore,
  enqueueGhlIntakeWebhook,
  flushGhlIntakeWebhooks,
  registerGhlIntakeWebhookRoutes,
  type GhlIntakeWebhookClaim,
  type GhlIntakeWebhookSqlPool,
  type GhlIntakeWebhookStore,
} from "./ghlIntakeWebhookQueue";
import type { GhlIntakeWebhookPayload } from "./ghlIntakeWebhookPayload";
import { ENV } from "./_core/env";

const auth = vi.hoisted(() => vi.fn());
vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest: auth } }));
// Never import real credentials or access the live database/webhook in these tests.
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-env-key-only-1234567890", databaseUrl: "" } }));

const URL_SECRET = "https://example.invalid/private-synthetic-capability";
const SECRET = "synthetic-key-only-not-a-production-token";
const SUBMISSION_ID = "synthetic-submission-0001";
const RETENTION = 30 * 24 * 60 * 60 * 1_000;
const payload: GhlIntakeWebhookPayload = {
  event: "intake_submitted", first_name: "Synthetic", last_name: "Outbox",
  email: "synthetic@example.invalid", phone: "+12025550123", state: "FL",
  visit_type: "free_text_visit", sms_opt_in: false, submitted_at: "2026-11-02T12:00:00Z",
  source: "website_intake", is_test: true,
  utm_source: "synthetic", utm_medium: "", utm_campaign: "", utm_content: "",
};

type Row = GhlIntakeWebhookClaim & {
  status: "pending" | "processing" | "sent" | "failed";
  leaseExpiresAt: number | null;
  terminalExpiresAt: number | null;
};
class MemoryStore implements GhlIntakeWebhookStore {
  rows = new Map<string, Row>();
  now = 100_000;
  reserveFailureAfter: number | undefined;
  writes: Buffer[] = [];
  async insert(eventKey: string, encryptedPayload: Buffer) {
    this.writes.push(Buffer.from(encryptedPayload));
    if (!this.rows.has(eventKey)) this.rows.set(eventKey, {
      eventKey, encryptedPayload: Buffer.from(encryptedPayload), status: "pending", attempts: 0,
      leaseOwner: "", leaseExpiresAt: null, terminalExpiresAt: null,
    });
  }
  async claimNext(owner: string) {
    const row = Array.from(this.rows.values()).find(r => r.status === "pending"
      || (r.status === "processing" && r.leaseExpiresAt! <= this.now));
    if (!row) return null;
    row.status = "processing"; row.leaseOwner = owner; row.leaseExpiresAt = this.now + 30_000;
    return { eventKey: row.eventKey, encryptedPayload: row.encryptedPayload, attempts: row.attempts, leaseOwner: owner };
  }
  private owned(claim: GhlIntakeWebhookClaim) {
    const row = this.rows.get(claim.eventKey);
    return row?.status === "processing" && row.leaseOwner === claim.leaseOwner && row.leaseExpiresAt! > this.now ? row : undefined;
  }
  async reserveAttempt(claim: GhlIntakeWebhookClaim) {
    const row = this.owned(claim);
    if (this.reserveFailureAfter !== undefined && row?.attempts === this.reserveFailureAfter) {
      this.reserveFailureAfter = undefined;
      throw new Error(`${URL_SECRET} ${SECRET} ${payload.email} unsafe-db-detail`);
    }
    if (!row || row.attempts >= 4) return false;
    row.attempts++; return true;
  }
  async finish(claim: GhlIntakeWebhookClaim, status: "sent" | "failed") {
    const row = this.owned(claim);
    if (!row) return false;
    row.status = status; row.encryptedPayload = null;
    row.leaseOwner = ""; row.leaseExpiresAt = null; row.terminalExpiresAt = this.now + RETENTION;
    return true;
  }
  async purgeExpiredTerminal() {
    let count = 0;
    for (const row of Array.from(this.rows.values())) if (["sent", "failed"].includes(row.status) && row.terminalExpiresAt! <= this.now) {
      this.rows.delete(row.eventKey); count++;
    }
    return count;
  }
  row() { return Array.from(this.rows.values())[0]; }
}
function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>(r => { resolve = r; });
  return { promise, resolve };
}
function setup(options: { store?: MemoryStore; fetch?: typeof fetch } = {}) {
  const store = options.store ?? new MemoryStore();
  const fetcher = options.fetch ?? vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
  const warn = vi.fn();
  const queue = createGhlIntakeWebhookQueue({ store, fetch: fetcher, warn, configuration: () => ({ url: URL_SECRET, secret: SECRET }) });
  return { queue, store, fetcher, warn };
}
function idempotency(call: unknown[]) {
  return (call[1] as RequestInit).headers as Record<string, string>;
}

beforeEach(() => { auth.mockReset(); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("GHL encrypted contact outbox", () => {
  it("is void/nonawaiting even while the durable insert and HTTP are blocked", async () => {
    const store = new MemoryStore();
    const gate = deferred<void>();
    const insert = store.insert.bind(store);
    vi.spyOn(store, "insert").mockImplementation(async (...args) => { await gate.promise; await insert(...args); });
    const { queue, fetcher } = setup({ store });
    expect(queue.enqueue(SUBMISSION_ID, payload)).toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();
    gate.resolve(); await queue.idle();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(store.row()).toMatchObject({ status: "sent", attempts: 1, encryptedPayload: null });
  });

  it("projects a closed contact allowlist, encrypts at rest, HMACs the primary key, and erases ciphertext on success", async () => {
    const responseGate = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockReturnValue(responseGate.promise);
    const { queue, store } = setup({ fetch: fetcher });
    const oversized = { ...payload, answers: { medications: "NEVER-SEND-HEALTH" }, dob: "1940-01-01", signed_url: "https://example.invalid/clinical", submission_token: "NEVER-SEND-TOKEN", card_number: "NEVER-SEND-CARD" };
    queue.enqueue(SUBMISSION_ID, oversized);
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetcher.mock.calls[0][1]!.body as string)).toEqual(payload);
    const row = store.row();
    expect(row.eventKey).toMatch(/^[a-f0-9]{64}$/);
    expect(Buffer.isBuffer(row.encryptedPayload)).toBe(true);
    const persisted = row.encryptedPayload!.toString("utf8");
    for (const forbidden of [payload.email, payload.first_name, payload.phone, SUBMISSION_ID, URL_SECRET, SECRET, "NEVER-SEND-HEALTH", "NEVER-SEND-TOKEN", "NEVER-SEND-CARD"]) expect(persisted).not.toContain(forbidden);
    responseGate.resolve(new Response(null, { status: 204 })); await queue.idle();
    expect(row.encryptedPayload).toBeNull();
    expect(row.terminalExpiresAt).toBe(store.now + RETENTION);
  });

  it("performs exactly four attempts (initial + three retries), rejects redirects, and reuses one idempotency key", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    const signal = vi.spyOn(AbortSignal, "timeout");
    const { queue, store, warn } = setup({ fetch: fetcher });
    queue.enqueue(SUBMISSION_ID, payload); await queue.idle();
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(signal.mock.calls).toEqual([[3000], [3000], [3000], [3000]]);
    const keys = fetcher.mock.calls.map(call => idempotency(call)["Idempotency-Key"]);
    expect(new Set(keys).size).toBe(1);
    expect(keys[0]).toMatch(/^[a-f0-9]{64}$/);
    for (const [, init] of fetcher.mock.calls) expect(init).toMatchObject({ method: "POST", redirect: "error" });
    expect(store.row()).toMatchObject({ status: "failed", attempts: 4, encryptedPayload: null });
    expect(warn).toHaveBeenCalledWith("[GHL intake outbox] Notification work could not complete.");
    queue.enqueue(SUBMISSION_ID, payload); await queue.idle(); await queue.flush();
    expect(fetcher).toHaveBeenCalledTimes(4); // exhausted tombstone does not revive
  });

  it("aborts each hanging request at 3 seconds without delaying enqueue", async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, "timeout").mockImplementation(ms => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    });
    const fetcher = vi.fn<typeof fetch>().mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      init!.signal!.addEventListener("abort", () => reject(new Error(`unsafe ${URL_SECRET}`)), { once: true });
    }));
    const { queue, store } = setup({ fetch: fetcher });
    expect(queue.enqueue(SUBMISSION_ID, payload)).toBeUndefined();
    await vi.advanceTimersByTimeAsync(11_999);
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(store.row().status).toBe("processing");
    await vi.advanceTimersByTimeAsync(1); await queue.idle();
    expect(store.row()).toMatchObject({ status: "failed", attempts: 4 });
  });

  it("stops retrying on the first 2xx and never reads response bodies", async () => {
    const text = vi.fn(() => { throw new Error("never read provider response"); });
    const json = vi.fn(() => { throw new Error("never read provider response"); });
    const fetcher = vi.fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("lost-acknowledgment"))
      .mockResolvedValue({ status: 202, body: null, text, json } as unknown as Response);
    const { queue, store } = setup({ fetch: fetcher });
    queue.enqueue(SUBMISSION_ID, payload); await queue.idle();
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(store.row().status).toBe("sent");
    expect(text).not.toHaveBeenCalled(); expect(json).not.toHaveBeenCalled();
  });

  it("deduplicates concurrent enqueues and later queues/restarts for the full 30-day tombstone lifetime", async () => {
    const first = setup();
    const second = setup({ store: first.store, fetch: first.fetcher });
    for (let i = 0; i < 20; i++) (i % 2 ? first : second).queue.enqueue(SUBMISSION_ID, payload);
    await Promise.all([first.queue.idle(), second.queue.idle()]);
    expect(first.fetcher).toHaveBeenCalledTimes(1);
    expect(first.store.rows.size).toBe(1);
    first.store.now += 25 * 60 * 60 * 1_000; // independent of 24h clinical receipt retention
    const restarted = setup({ store: first.store, fetch: first.fetcher });
    restarted.queue.enqueue(SUBMISSION_ID, { ...payload, first_name: "MustNotReplace" }); await restarted.queue.idle();
    expect(first.fetcher).toHaveBeenCalledTimes(1);
    expect((await restarted.queue.flush()).purged).toBe(0);
  });

  it("reclaims a stale lease after restart, preserving attempts and the same idempotency key", async () => {
    const store = new MemoryStore(); store.reserveFailureAfter = 1;
    const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error("lost-ack"))
      .mockResolvedValue(new Response(null, { status: 204 }));
    const first = setup({ store, fetch: fetcher });
    first.queue.enqueue(SUBMISSION_ID, payload); await first.queue.idle();
    expect(store.row()).toMatchObject({ status: "processing", attempts: 1 });
    const restarted = setup({ store, fetch: fetcher });
    expect((await restarted.queue.flush()).claimed).toBe(0);
    store.now += 30_001;
    expect(await restarted.queue.flush()).toMatchObject({ claimed: 1, attempted: 1, sent: 1, status: "ok" });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(idempotency(fetcher.mock.calls[0])).toEqual(idempotency(fetcher.mock.calls[1]));
    expect(store.row()).toMatchObject({ status: "sent", attempts: 2, encryptedPayload: null });
  });

  it("fences a superseded owner and finalizes an exhausted abandoned lease without a fifth attempt", async () => {
    const { queue, store, fetcher } = setup();
    const gate = deferred<void>();
    const insert = store.insert.bind(store);
    vi.spyOn(store, "insert").mockImplementation(async (...args) => { await insert(...args); await gate.promise; });
    queue.enqueue(SUBMISSION_ID, payload);
    await Promise.resolve();
    const old = (await store.claimNext("old"))!;
    for (let i = 0; i < 4; i++) expect(await store.reserveAttempt(old)).toBe(true);
    store.now += 30_001;
    const replacement = (await store.claimNext("replacement"))!;
    expect(await store.reserveAttempt(old)).toBe(false);
    expect(await store.finish(old, "sent")).toBe(false);
    expect(await store.reserveAttempt(replacement)).toBe(false);
    store.now += 30_001;
    expect(await queue.flush()).toMatchObject({ attempted: 0, failed: 1 });
    gate.resolve(); await queue.idle();
    expect(fetcher).not.toHaveBeenCalled();
    expect(store.row()).toMatchObject({ status: "failed", attempts: 4, encryptedPayload: null });
  });

  it("purges only expired terminal rows, never pending/processing work", async () => {
    const { queue, store } = setup();
    queue.enqueue(SUBMISSION_ID, payload); await queue.idle();
    const retained = store.row();
    store.rows.set("pending-synthetic-key", { ...retained, eventKey: "pending-synthetic-key", status: "pending", encryptedPayload: store.writes[0], terminalExpiresAt: store.now - 1 });
    // Stop processing this pending row so we can inspect just the purge contract.
    vi.spyOn(store, "claimNext").mockResolvedValue(null);
    store.now = retained.terminalExpiresAt! - 1;
    expect((await queue.flush()).purged).toBe(0);
    store.now++;
    expect((await queue.flush()).purged).toBe(1);
    expect(store.rows.has("pending-synthetic-key")).toBe(true);
  });

  it("removes tampered ciphertext without posting or leaking cryptographic errors", async () => {
    const { queue, store, fetcher, warn } = setup();
    const gate = deferred<void>();
    const insert = store.insert.bind(store);
    vi.spyOn(store, "insert").mockImplementation(async (...args) => { await insert(...args); await gate.promise; });
    queue.enqueue(SUBMISSION_ID, payload);
    await Promise.resolve();
    store.row().encryptedPayload![30] ^= 1;
    gate.resolve(); await queue.idle();
    expect(fetcher).not.toHaveBeenCalled();
    expect(store.row()).toMatchObject({ status: "failed", encryptedPayload: null });
    expect(warn.mock.calls.flat()).toEqual(["[GHL intake outbox] Notification work could not complete.", "[GHL intake outbox] Notification work could not complete."]);
  });

  it("never exposes provider/database exceptions, contact values, URL, or secrets in warnings/reports", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error(`${URL_SECRET} ${SECRET} ${payload.email}`));
    const { queue, store, warn } = setup({ fetch: fetcher });
    queue.enqueue(SUBMISSION_ID, payload); await queue.idle();
    vi.spyOn(store, "purgeExpiredTerminal").mockRejectedValue(new Error(`${URL_SECRET} ${SECRET} ${payload.email}`));
    const report = await queue.flush();
    expect(report).toEqual({ status: "unavailable", claimed: 0, attempted: 0, sent: 0, failed: 0, purged: 0 });
    const output = JSON.stringify({ logs: warn.mock.calls, report });
    for (const forbidden of [URL_SECRET, SECRET, payload.email, payload.first_name, payload.phone, SUBMISSION_ID, store.row().eventKey]) expect(output).not.toContain(forbidden);
  });

  it("is a complete no-op for legacy ENV mocks with no GHL URL, including the public exports", async () => {
    vi.stubEnv("VITEST", ""); // Exercise the legacy-mock no-URL guard independently.
    const fetcher = vi.spyOn(globalThis, "fetch");
    enqueueGhlIntakeWebhook(SUBMISSION_ID, payload);
    await awaitGhlIntakeWebhookIdle();
    expect((await flushGhlIntakeWebhooks()).status).toBe("disabled");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("disables the real queue under Vitest even with a configured GHL URL", async () => {
    const env = ENV as typeof ENV & { ghlIntakeWebhookUrl?: string };
    const old = env.ghlIntakeWebhookUrl;
    env.ghlIntakeWebhookUrl = URL_SECRET;
    const fetcher = vi.spyOn(globalThis, "fetch");
    const warn = vi.spyOn(console, "warn");
    try {
      enqueueGhlIntakeWebhook(SUBMISSION_ID, payload);
      await awaitGhlIntakeWebhookIdle();
      expect((await flushGhlIntakeWebhooks()).status).toBe("disabled");
      expect(fetcher).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled(); // No attempted SQL writes either.
    } finally { env.ghlIntakeWebhookUrl = old; }
  });

  it.each([
    { url: "http://example.invalid", secret: SECRET },
    { url: "https://user:pass@example.invalid", secret: SECRET },
    { url: URL_SECRET, secret: "weak" },
  ])("fails closed for unsafe configuration without throwing at enqueue", async configuration => {
    const store = new MemoryStore(); const fetcher = vi.fn<typeof fetch>(); const warn = vi.fn();
    const queue = createGhlIntakeWebhookQueue({ store, fetch: fetcher, warn, configuration: () => configuration });
    expect(() => queue.enqueue(SUBMISSION_ID, payload)).not.toThrow();
    expect((await queue.flush()).status).toBe("unavailable");
    expect(store.rows.size).toBe(0); expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("SQL atomic store contract", () => {
  it("conditionally claims/reserves/finishes with database-time owner fencing and terminal-only retention", async () => {
    const calls: { sql: string; values: unknown[] }[] = [];
    const execute = vi.fn(async (sql: string, values: unknown[] = []) => {
      calls.push({ sql, values });
      if (sql.startsWith("SELECT eventKey FROM")) return [[{ eventKey: "a".repeat(64) }], []];
      if (sql.startsWith("SELECT eventKey, encryptedPayload")) return [[{ eventKey: "a".repeat(64), encryptedPayload: Buffer.from("ciphertext"), attempts: 2 }], []];
      return [{ affectedRows: 1 }, []];
    });
    const store = createGhlIntakeWebhookSqlStore({ execute } as unknown as GhlIntakeWebhookSqlPool);
    await store.insert("a".repeat(64), Buffer.from("ciphertext"));
    const claim = (await store.claimNext("synthetic-owner"))!;
    expect(claim.attempts).toBe(2);
    expect(await store.reserveAttempt(claim)).toBe(true);
    expect(await store.finish(claim, "sent")).toBe(true);
    expect(await store.purgeExpiredTerminal()).toBe(1);
    const claimUpdate = calls.find(c => c.sql.includes("SET status = 'processing'"))!;
    expect(claimUpdate.sql).toContain("AND (status = 'pending' OR (status = 'processing' AND leaseExpiresAt <=");
    expect(claimUpdate.sql).toContain("UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3))");
    expect(claimUpdate.values).toContain(30_000);
    const reserve = calls.find(c => c.sql.includes("SET attempts = attempts + 1"))!;
    expect(reserve.sql).toContain("leaseOwner = ?"); expect(reserve.sql).toContain("attempts < ?");
    expect(reserve.values.at(-1)).toBe(4);
    const finish = calls.find(c => c.sql.includes("encryptedPayload = NULL"))!;
    expect(finish.sql).toContain("leaseExpiresAt >"); expect(finish.values).toContain(RETENTION);
    expect(calls[0].sql).toContain("ON DUPLICATE KEY UPDATE eventKey = eventKey");
    expect(calls.at(-1)!.sql).toContain("status IN ('sent', 'failed') AND terminalExpiresAt <=");
    expect(calls.every(c => !c.sql.includes("intake_private"))).toBe(true);
  });

  it("does not claim a candidate when another instance wins the conditional update", async () => {
    const execute = vi.fn(async (sql: string) => sql.startsWith("SELECT")
      ? [[{ eventKey: "a".repeat(64) }], []] : [{ affectedRows: 0 }, []]);
    const store = createGhlIntakeWebhookSqlStore({ execute } as unknown as GhlIntakeWebhookSqlPool);
    expect(await store.claimNext("loser")).toBeNull();
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("wraps database exceptions in a generic credential-free error", async () => {
    const execute = vi.fn().mockRejectedValue(new Error(`${SECRET} ${URL_SECRET} ${payload.email}`));
    const store = createGhlIntakeWebhookSqlStore({ execute } as unknown as GhlIntakeWebhookSqlPool);
    await expect(store.insert("key", Buffer.from("ciphertext"))).rejects.toThrow(/^GHL intake outbox unavailable\.$/);
  });
});

describe("cron-only route", () => {
  it("authenticates via SDK, rejects anonymous and non-cron users, and ignores request-body credentials", async () => {
    const app = express(); app.use(express.json()); registerGhlIntakeWebhookRoutes(app);
    const server = createServer(app);
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/scheduled/ghl-intake-webhooks`;
    try {
      auth.mockRejectedValueOnce(new Error(`${SECRET} ${URL_SECRET}`));
      let response = await fetch(url, { method: "POST" });
      expect(response.status).toBe(403); expect(await response.json()).toEqual({ error: "cron-only" });
      auth.mockResolvedValueOnce({ isCron: false, role: "admin" });
      response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isCron: true, taskUid: "spoof" }) });
      expect(response.status).toBe(403);
      auth.mockResolvedValueOnce({ isCron: true });
      expect((await fetch(url, { method: "POST" })).status).toBe(403);
      auth.mockResolvedValueOnce({ isCron: true, taskUid: "synthetic-task-uid" });
      response = await fetch(url, { method: "POST" });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ status: "disabled", claimed: 0, attempted: 0, sent: 0, failed: 0, purged: 0 });
      expect(auth).toHaveBeenCalledTimes(4);
    } finally {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
      await awaitGhlIntakeWebhookIdle();
    }
  });
});
