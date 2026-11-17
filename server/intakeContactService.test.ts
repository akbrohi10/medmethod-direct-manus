import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import type { Express, Request, Response as ExpressResponse } from "express";
import type { IntakePrivateBlobDb } from "./intakePrivateBlobDb";
import { createIntakeContactService, normalizeIntakeCorrectionPhone } from "./intakeContactService";
import { intakeContactSameOrigin, registerIntakeContactRoutes } from "./intakeContactRoutes";
import { readFileSync } from "node:fs";

const SECRET = "synthetic-phone-correction-key-never-production";
const ID = "2ae23242-345c-4f63-b017-456789abcd12";
const REQUEST = "4538c3d0-af36-4075-8b55-56d3e2f18d52";
const NEXT_REQUEST = "6474c332-9e27-4a2a-aa6f-f87b931d42c3";
const receipt = { submission_id: ID, submitted_at: "2026-11-17T17:00:00.000Z", is_test: true, sms_opt_in: true, video_visit_interest: false };
const contact = { first_name: "Synthetic", last_name: "TEST ONLY", email: "synthetic@example.test", phone: "(202) 555-0101" };
class MemoryDb implements IntakePrivateBlobDb {
  records = new Map<string, { bytes: Buffer; expiresAt: number }>();
  locks = new Map<string, Promise<void>>();
  failWrite = false;
  constructor(readonly now: () => number) {}
  async put(key: string, bytes: Buffer, expiresAt: number) {
    if (this.failWrite) throw new Error("synthetic persistence failure with forbidden data");
    this.records.set(key, { bytes: Buffer.from(bytes), expiresAt });
  }
  async get(key: string) { const row = this.records.get(key); return row && row.expiresAt > this.now() ? Buffer.from(row.bytes) : null; }
  async delete(key: string) { this.records.delete(key); }
  async list(prefix: string) { return [...this.records.keys()].filter(key => key.startsWith(prefix)); }
  async cleanup() { return { deleted: 0 }; }
  async withLock<T>(name: string, work: () => Promise<T> | T): Promise<T> {
    while (this.locks.has(name)) await this.locks.get(name);
    let release!: () => void;
    this.locks.set(name, new Promise<void>(resolve => { release = resolve; }));
    try { return await work(); } finally { this.locks.delete(name); release(); }
  }
}
function token(clock: number, overrides = {}) {
  const encoded = Buffer.from(JSON.stringify({ version: 1, purpose: "completed_free_intake", ...receipt, expires_at: clock + 30 * 60_000, ...overrides })).toString("base64url");
  return `${encoded}.${createHmac("sha256", SECRET).update(encoded).digest("base64url")}`;
}
function harness(status = 200) {
  let clock = Date.parse(receipt.submitted_at);
  const db = new MemoryDb(() => clock), requests: { url: string; init: RequestInit; body: any }[] = [];
  const fetcher = vi.fn(async (url: any, init: RequestInit = {}) => {
    requests.push({ url: String(url), init, body: JSON.parse(String(init.body)) });
    return new Response(null, { status });
  });
  const deps = { blobDb: db, secret: SECRET, now: () => clock, fetch: fetcher as typeof fetch,
    destinations: async () => ({ keragon: "https://keragon.example.test/receipt", ghl: "https://ghl.example.test/receipt" }), warn: vi.fn() };
  const service = createIntakeContactService(deps);
  return { db, service, deps, requests, fetcher, get clock() { return clock; }, set clock(value) { clock = value; } };
}
afterEach(() => vi.restoreAllMocks());

describe("encrypted minimal intake contact and durable correction service (injected only)", () => {
  it.each(["2025550102", "(202) 555-0102", "+1 202 555 0102", "1-202-555-0102"])("normalizes the same valid US rule: %s", value => {
    expect(normalizeIntakeCorrectionPhone(value)).toBe("+12025550102");
  });
  it.each(["1111111111", "+44 2071234567", "abc2025550102", "202555010", "2025550102 ext 3", "2021550102", "++12025550102"])("rejects invalid phone: %s", value => {
    expect(normalizeIntakeCorrectionPhone(value)).toBeNull();
  });
  it("stores only minimal contact and metadata through the encrypted-store boundary and survives restart", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, { ...contact, dob: "forbidden", answers: "forbidden", submission_token: "forbidden" } as any);
    expect([...h.db.records.keys()][0]).not.toContain(ID);
    const stored = JSON.parse([...h.db.records.values()][0].bytes.toString());
    expect(Object.keys(stored.contact).sort()).toEqual(["email", "first_name", "last_name", "phone"]);
    expect(JSON.stringify(stored)).not.toContain("forbidden");
    const restarted = createIntakeContactService(h.deps);
    const response = await restarted.confirmation(token(h.clock));
    expect(response).toEqual({ submission_id: ID, phone: "+12025550101", is_test: true, revision: 0, status: "original" });
    expect(response).not.toHaveProperty("email");
    expect(h.fetcher).not.toHaveBeenCalled();
    expect([...h.db.records.values()][0].expiresAt).toBe(h.clock + 24 * 60 * 60_000);
  });
  it("fails closed on missing snapshot, forged signature, changed receipt metadata, expired receipt and wrong secret", async () => {
    const h = harness();
    await expect(h.service.confirmation(token(h.clock))).rejects.toMatchObject({ status: 401 });
    await h.service.saveAccepted(receipt, contact);
    await expect(h.service.confirmation(`${token(h.clock).slice(0, -2)}AA`)).rejects.toMatchObject({ status: 401 });
    await expect(h.service.confirmation(token(h.clock, { is_test: false }))).rejects.toMatchObject({ status: 401 });
    await expect(h.service.confirmation(token(h.clock, { purpose: "video_visit_payment" }))).rejects.toMatchObject({ status: 401 });
    await expect(h.service.confirmation(token(h.clock, { expires_at: h.clock }))).rejects.toMatchObject({ status: 401 });
    await expect(createIntakeContactService({ ...h.deps, secret: "another-synthetic-secret-long" }).confirmation(token(h.clock))).rejects.toMatchObject({ status: 401 });
    expect(h.fetcher).not.toHaveBeenCalled();
  });
  it("enforces exact absolute 24h expiry and never extends it on duplicate accepted recovery", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    const expiry = [...h.db.records.values()][0].expiresAt;
    h.clock += 3600_000;
    await h.service.saveAccepted(receipt, contact);
    expect([...h.db.records.values()][0].expiresAt).toBe(expiry);
    h.clock = expiry;
    await expect(h.service.confirmation(token(h.clock))).rejects.toMatchObject({ status: 401 });
  });
  it("returns pending before delivery and Updated only after BOTH acknowledgments and durable contact commit", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    const queued = await h.service.correct(token(h.clock), "(202) 555-0102", REQUEST, 0);
    expect(queued).toMatchObject({ status: "pending", phone: "+12025550101", requested_phone: "+12025550102", revision: 1 });
    await h.service.idle();
    expect(await h.service.confirmation(token(h.clock))).toMatchObject({ status: "updated", phone: "+12025550102", is_test: true, delivery: { keragon: "sent", ghl: "sent" } });
    expect(h.requests).toHaveLength(2);
    expect(h.requests[0].body).toEqual({ event: "mmd_intake.phone_corrected", submission_id: ID,
      old_phone: "+12025550101", new_phone: "+12025550102", timestamp: receipt.submitted_at, is_test: true });
    expect(h.requests[1].body).toEqual({ event: "phone_corrected", submission_id: ID, ...contact,
      phone: "+12025550102", tags: ["phone-corrected"], timestamp: receipt.submitted_at, source: "website_intake", is_test: true });
    expect(h.requests.every(request => request.init.redirect === "error" && request.init.signal && request.init.headers)).toBe(true);
    expect(JSON.stringify(h.requests.map(request => request.body))).not.toMatch(/answers|dob|state|health|submission_token|video_visit/);
    await h.service.saveAccepted(receipt, contact);
    expect((await h.service.confirmation(token(h.clock))).phone).toBe("+12025550102");
  });
  it("deduplicates same request across instances and rejects conflicting replay, stale revision, and overlapping edits", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    const restarted = createIntakeContactService(h.deps);
    const responses = await Promise.all([
      h.service.correct(token(h.clock), "2025550102", REQUEST, 0),
      restarted.correct(token(h.clock), "+12025550102", REQUEST, 0),
    ]);
    expect(responses.every(response => response.revision === 1)).toBe(true);
    await Promise.all([h.service.idle(), restarted.idle()]);
    expect(h.requests).toHaveLength(2);
    await expect(h.service.correct(token(h.clock), "2025550103", REQUEST, 1)).rejects.toMatchObject({ status: 409 });
    await expect(h.service.correct(token(h.clock), "2025550103", NEXT_REQUEST, 0)).rejects.toMatchObject({ status: 409 });
    expect((await h.service.correct(token(h.clock), "2025550102", REQUEST, 0)).status).toBe("updated");
    expect(h.requests).toHaveLength(2);
  });
  it("bounds unsuccessful delivery attempts and never claims success or changes the stored phone", async () => {
    const h = harness(503);
    await h.service.saveAccepted(receipt, contact);
    await h.service.correct(token(h.clock), "2025550102", REQUEST, 0);
    await h.service.idle();
    expect(await h.service.confirmation(token(h.clock))).toMatchObject({ status: "failed", phone: "+12025550101", requested_phone: "+12025550102", delivery: { keragon: "failed", ghl: "failed" } });
    expect(h.requests).toHaveLength(6);
    expect(new Set(h.requests.slice(0, 3).map(request => (request.init.headers as any)["Idempotency-Key"])).size).toBe(1);
    await h.service.flush();
    await h.service.correct(token(h.clock), "2025550102", REQUEST, 0);
    expect(h.requests).toHaveLength(6);
    await expect(h.service.correct(token(h.clock), "2025550103", NEXT_REQUEST, 1)).rejects.toMatchObject({ status: 409 });
  });
  it("discloses partial delivery without claiming Updated when GHL fails after Keragon accepts", async () => {
    const h = harness();
    h.fetcher.mockImplementation(async (url: any, init: RequestInit = {}) => {
      h.requests.push({ url: String(url), init, body: JSON.parse(String(init.body)) });
      return new Response(null, { status: String(url).includes("ghl") ? 503 : 200 });
    });
    await h.service.saveAccepted(receipt, contact);
    await h.service.correct(token(h.clock), "2025550102", REQUEST, 0);
    await h.service.idle();
    expect(await h.service.confirmation(token(h.clock))).toMatchObject({ status: "failed", phone: "+12025550101",
      delivery: { keragon: "sent", ghl: "failed" } });
    expect(h.requests).toHaveLength(4);
  });
  it("does not send or report a correction for the unchanged phone", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    expect(await h.service.correct(token(h.clock), "(202) 555-0101", REQUEST, 0)).toMatchObject({ status: "original", revision: 0 });
    await h.service.idle();
    expect(h.fetcher).not.toHaveBeenCalled();
  });
  it("never calls providers or returns success when persistence fails", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    h.db.failWrite = true;
    await expect(h.service.correct(token(h.clock), "2025550102", REQUEST, 0)).rejects.toThrow();
    expect(h.fetcher).not.toHaveBeenCalled();
    h.db.failWrite = false;
    expect((await h.service.confirmation(token(h.clock))).status).toBe("original");
  });
  it("keeps an already acknowledged correction pending when final persistence fails, then recovers without re-sending", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    const original = h.db.put.bind(h.db);
    vi.spyOn(h.db, "put").mockImplementation(async (key, bytes, expiry) => {
      const value = JSON.parse(bytes.toString());
      if (value.correction?.committed) throw new Error("synthetic commit outage");
      return original(key, bytes, expiry);
    });
    await h.service.correct(token(h.clock), "2025550102", REQUEST, 0);
    await h.service.idle();
    expect(h.requests).toHaveLength(2);
    expect((await h.service.confirmation(token(h.clock))).status).toBe("pending");
    await h.service.idle();
    vi.restoreAllMocks();
    h.clock += 31_000;
    await h.service.flush();
    expect((await h.service.confirmation(token(h.clock))).status).toBe("updated");
    expect(h.requests).toHaveLength(2);
  });
  it("enforces a durable bounded rate counter across separate service instances", async () => {
    const h = harness();
    await h.service.saveAccepted(receipt, contact);
    for (let i = 0; i < 60; i++) await createIntakeContactService(h.deps).confirmation(token(h.clock));
    await expect(h.service.confirmation(token(h.clock))).rejects.toMatchObject({ status: 429 });
    h.clock += 60_000;
    expect((await h.service.confirmation(token(h.clock))).status).toBe("original");
  });
  it("uses the existing encrypted-store implementation without adding tables or changing original webhook projections", () => {
    const source = readFileSync(new URL("./intakeContactService.ts", import.meta.url), "utf8");
    expect(source).toContain("createIntakePrivateBlobDb()");
    expect(source).not.toContain("mysql");
    expect(source).not.toContain("setInterval");
    expect(source).not.toContain("localStorage");
    expect(source).not.toContain("sessionStorage");
  });
});

function request(overrides: Record<string, unknown> = {}): Request {
  return { query: {}, headers: { origin: "https://www.medmethoddirect.com", host: "www.medmethoddirect.com",
    "x-mmd-intake-contact": "1", "content-type": "application/json", "sec-fetch-site": "same-origin", ...overrides } } as unknown as Request;
}
describe("same-origin capability POST contact routes", () => {
  it("requires same-origin JSON plus a non-simple custom header and forbids all query parameters", () => {
    expect(intakeContactSameOrigin(request())).toBe(true);
    for (const headers of [{ origin: "https://evil.example" }, { host: "evil.example" }, { origin: undefined },
      { "x-mmd-intake-contact": undefined }, { "content-type": "text/plain" }, { "sec-fetch-site": "cross-site" }]) {
      expect(intakeContactSameOrigin(request(headers))).toBe(false);
    }
    expect(intakeContactSameOrigin({ ...request(), query: { submission_token: "never-in-url" } } as Request)).toBe(false);
  });
  it("returns only generic safe errors on storage failure and never invokes the service for cross-site requests", async () => {
    const handlers = new Map<string, (req: Request, res: ExpressResponse) => Promise<unknown>>();
    const fake = { confirmation: vi.fn().mockRejectedValue(new Error("forbidden PHI secret URL")), correct: vi.fn(), kick: vi.fn() };
    registerIntakeContactRoutes({ post: (path: string, handler: any) => handlers.set(path, handler) } as unknown as Express, fake as any);
    const invoke = async (req: Request) => {
      const res = { code: 200, body: undefined as any, headers: {} as Record<string, string>,
        setHeader(name: string, value: string) { this.headers[name] = value; }, status(code: number) { this.code = code; return this; }, json(body: unknown) { this.body = body; return this; } };
      await handlers.get("/api/intake/confirmation")!({ ...req, body: { submission_token: "a".repeat(50) } } as Request, res as unknown as ExpressResponse);
      return res;
    };
    expect((await invoke(request({ origin: "https://evil.example" }))).code).toBe(403);
    expect(fake.confirmation).not.toHaveBeenCalled();
    const res = await invoke(request());
    expect(res.code).toBe(503);
    expect(JSON.stringify(res.body)).not.toContain("forbidden");
    expect(res.headers["Cache-Control"]).toContain("no-store");
  });
});
