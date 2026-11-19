import { createHash, randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  createIntakeTextPaymentService, getIntakeTextPaymentConfig, textIntakeMode, TEXT_INTAKE_DESCRIPTION,
  type TextIntakePaymentRecord, type TextIntakeValidatedInput, type TextIntakePaymentDependencies,
} from "./intakeTextPaymentService";
import type { IntakeTextPaymentStore, TextPaymentLockedRecord } from "./intakeTextPaymentStore";
import type { IntakeDraft } from "./intakeSubmissionContract";

const DAY = 86_400_000;
type RecordType = TextIntakePaymentRecord<TextIntakeValidatedInput>;
const clone = <T>(value: T): T => structuredClone(value);
class MockStore implements IntakeTextPaymentStore<RecordType> {
  records = new Map<string, RecordType>();
  queues = new Map<string, Promise<unknown>>();
  failSave = false;
  hashSubmission(id: string) { return createHash("sha256").update(`id:${id}`).digest("hex"); }
  hashCapability(token: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("invalid");
    return createHash("sha256").update(`cap:${token}`).digest("hex");
  }
  async findCapability(token: string, kind: "payment" | "resume") {
    const h = this.hashCapability(token);
    return [...this.records].find(([, r]) => (kind === "payment" ? r.paymentTokenHash : r.resumeTokenHash) === h)?.[0] ?? null;
  }
  async withRecord<T>(key: string, work: (locked: TextPaymentLockedRecord<RecordType>) => Promise<T>): Promise<T> {
    const prior = this.queues.get(key) ?? Promise.resolve();
    const next = prior.catch(() => undefined).then(() => work({
      read: async () => this.records.has(key) ? clone(this.records.get(key)!) : null,
      save: async r => {
        if (this.failSave) throw new Error("mock write failure");
        this.records.set(key, clone(r));
      },
    }));
    this.queues.set(key, next);
    return next;
  }
  async candidates(now: number, limit: number) {
    return [...this.records].filter(([, r]) => !["expired", "completed"].includes(r.state) && r.nextSweepAt <= now)
      .sort((a, b) => a[1].nextSweepAt - b[1].nextSweepAt).slice(0, limit).map(([k]) => k);
  }
  async cleanup(now: number) {
    let deleted = 0;
    for (const [key, r] of this.records) if (["expired", "completed"].includes(r.state) && r.retentionUntil !== null && r.retentionUntil <= now) { this.records.delete(key); deleted++; }
    return deleted;
  }
}
function input(): TextIntakeValidatedInput {
  const id = randomUUID();
  return { submission_id: id, is_test: false, validated_at: 1_790_000_000_000,
    intake: { submission_id: id, submitted_at: "2026-11-18T00:00:00.000Z", patient: { first_name: "Test", last_name: "Patient",
      dob: "1980-01-01", email: "patient@example.invalid", phone: "(202) 555-0123", state: "VA", address_line1: "SECRET ADDRESS" },
      consents: { sms_opt_in: true }, answers: { w: { w01: "SECRET DIAGNOSIS" } }, intake_summary: "SECRET HEALTH" } as IntakeDraft,
    signing: { signed_at: "2026-11-18T00:00:00.000Z", signature_png: "SECRET SIGNATURE" }, resume_answers: { w01: "SECRET HEALTH" },
    public_origin: "https://medmethoddirect.com" };
}
function setup(mode: "sandbox" | "live" = "sandbox") {
  let time = 1_790_000_000_000;
  const store = new MockStore();
  const calls: { url: string; method: string; body?: Record<string, unknown>; headers: Headers }[] = [];
  let rawOrder: any;
  let createLoseAck = false, captureLoseAck = false, decline = false, offline = false;
  let mutate: ((raw: any) => void) | undefined;
  const http = vi.fn(async (url: any, init: RequestInit = {}) => {
    const call = { url: String(url), method: init.method ?? "GET", body: init.body ? JSON.parse(String(init.body).startsWith("grant_") ? "{}" : String(init.body)) : undefined, headers: new Headers(init.headers) };
    calls.push(call);
    if (offline) throw new Error("SECRET PROVIDER BODY");
    if (call.url.endsWith("/v1/oauth2/token")) return new Response(JSON.stringify({ access_token: "SECRET OAUTH" }), { status: 200 });
    if (call.url.endsWith("/v2/checkout/orders")) {
      rawOrder ??= { id: "ORDER123", intent: "CAPTURE", status: "CREATED", purchase_units: clone(call.body!.purchase_units) };
      if (createLoseAck) throw new Error("lost create ack");
    } else if (call.url.endsWith("/capture")) {
      const record = [...store.records.values()][0];
      expect(record.captureAttemptAt).toBeDefined(); // claim is committed before provider side effect
      expect(record.captureRequestId).toBe(call.headers.get("PayPal-Request-Id"));
      if (decline) return new Response("SECRET DECLINE", { status: 422 });
      rawOrder.status = "COMPLETED";
      rawOrder.purchase_units[0].payments = { captures: [{ id: "CAPTURE123", status: "COMPLETED", custom_id: record.customId,
        amount: { value: "29.00", currency_code: "USD" }, create_time: "2026-11-18T00:01:00.000Z" }] };
      if (captureLoseAck) throw new Error("lost capture ack");
    }
    const copy = clone(rawOrder); mutate?.(copy);
    return new Response(JSON.stringify(copy), { status: 200 });
  }) as unknown as typeof fetch;
  const finalize = vi.fn(async (r: any) => ({ submission_id: r.input.submission_id, submission_token: "SIGNED RECEIPT",
    submitted_at: r.input.intake.submitted_at, sms_opt_in: true, video_visit_interest: false, redirect_url: "/intake/thank-you/", patient: "MUST OMIT" }));
  const sandboxFinalize = vi.fn(finalize.getMockImplementation()!);
  const send = vi.fn(async () => true);
  const sandboxSend = vi.fn(async () => true);
  const log = vi.fn();
  const dependencies: TextIntakePaymentDependencies<TextIntakeValidatedInput> = {
    validate: async raw => clone(raw) as TextIntakeValidatedInput, config: async () => ({ mode, clientId: "PUBLIC CLIENT", clientSecret: "SECRET CLIENT" }),
    store, fetch: http, now: () => time, finalize, finalizeSandbox: sandboxFinalize, sendUnpaid: send, sendUnpaidSandbox: sandboxSend, log,
  };
  const service = createIntakeTextPaymentService(dependencies);
  return { service, store, dependencies, calls, finalize, sandboxFinalize, send, sandboxSend, log,
    get order() { return rawOrder; }, approve() { rawOrder.status = "APPROVED"; }, advance(ms: number) { time += ms; },
    loseCreate(value: boolean) { createLoseAck = value; }, loseCapture(value: boolean) { captureLoseAck = value; },
    decline(value: boolean) { decline = value; }, offline(value: boolean) { offline = value; }, mutate(fn?: (r: any) => void) { mutate = fn; },
    captures() { return calls.filter(c => c.url.endsWith("/capture")); }, creates() { return calls.filter(c => c.url.endsWith("/v2/checkout/orders")); },
  };
}

describe("text intake saved PayPal configuration", () => {
  it("follows saved live settings; only public client ID escapes", async () => {
    expect(textIntakeMode({})).toBe("sandbox");
    const settings = async () => ({ mode: "live", sandboxClientId: "S", sandboxClientSecret: "SS", liveClientId: "L", liveClientSecret: "LS" });
    expect(await getIntakeTextPaymentConfig({ env: {}, settings })).toEqual({ mode: "live", clientId: "L", clientSecret: "LS" });
    expect(await getIntakeTextPaymentConfig({ env: { TEXT_INTAKE_PAYMENT_MODE: "live" }, settings })).toEqual({ mode: "live", clientId: "L", clientSecret: "LS" });
    const s = setup();
    expect(await s.service.configuration()).toEqual({ configured: true, client_id: "PUBLIC CLIENT", environment: "sandbox", amount: "29.00" });
    expect(s.calls).toHaveLength(0);
  });
  it("falls back selected environment credentials without mixing credential pairs", async () => {
    const c = await getIntakeTextPaymentConfig({ env: { PAYPAL_SANDBOX_CLIENT_ID: "ENV", PAYPAL_SANDBOX_CLIENT_SECRET: "ENV_SECRET" }, settings: async () => ({ sandboxClientId: "HALF" }) });
    expect(c).toEqual({ mode: "sandbox", clientId: "ENV", clientSecret: "ENV_SECRET" });
    expect(() => textIntakeMode({ TEXT_INTAKE_PAYMENT_MODE: "LIVE" })).toThrow();
  });
  it.each([
    ["live", "sandbox"],
    ["sandbox", "live"],
  ] as const)("saved %s mode overrides environment %s", async (mode, envMode) => {
    const settings = async () => ({ mode, sandboxClientId: "S", sandboxClientSecret: "SS", liveClientId: "L", liveClientSecret: "LS" });
    expect(await getIntakeTextPaymentConfig({ env: { TEXT_INTAKE_PAYMENT_MODE: envMode }, settings })).toEqual({
      mode, clientId: mode === "sandbox" ? "S" : "L", clientSecret: mode === "sandbox" ? "SS" : "LS",
    });
    expect((await getIntakeTextPaymentConfig({ env: { TEXT_INTAKE_PAYMENT_MODE: "INVALID" }, settings })).mode).toBe(mode);
  });
  it.each([null, {}, { mode: null }])("uses validated environment mode only without a saved mode (%j)", async saved => {
    const settings = async () => saved;
    expect(await getIntakeTextPaymentConfig({ env: {}, settings })).toEqual({ mode: "sandbox", clientId: "", clientSecret: "" });
    expect(await getIntakeTextPaymentConfig({ env: { TEXT_INTAKE_PAYMENT_MODE: "live", PAYPAL_LIVE_CLIENT_ID: "L", PAYPAL_LIVE_CLIENT_SECRET: "LS" }, settings }))
      .toEqual({ mode: "live", clientId: "L", clientSecret: "LS" });
    await expect(getIntakeTextPaymentConfig({ env: { TEXT_INTAKE_PAYMENT_MODE: "INVALID" }, settings })).rejects.toMatchObject({ code: "not_configured" });
  });
  it.each(["LIVE", "", "invalid"])("invalid saved mode %j fails closed despite usable environment credentials", async mode => {
    const s = setup();
    s.dependencies.config = () => getIntakeTextPaymentConfig({
      env: { TEXT_INTAKE_PAYMENT_MODE: "sandbox", PAYPAL_SANDBOX_CLIENT_ID: "ENV", PAYPAL_SANDBOX_CLIENT_SECRET: "ENV_SECRET" },
      settings: async () => ({ mode, sandboxClientId: "S", sandboxClientSecret: "SS" }),
    });
    await expect(s.dependencies.config()).rejects.toMatchObject({ code: "not_configured" });
    const service = createIntakeTextPaymentService(s.dependencies);
    expect(await service.configuration()).toEqual({ configured: false, client_id: null, environment: "sandbox", amount: "29.00" });
    await expect(service.create(input())).rejects.toMatchObject({ code: "not_configured" });
    expect(s.calls).toHaveLength(0);
  });
  it("settings lookup failure never falls back to environment credentials or calls a provider", async () => {
    const s = setup();
    const settings = vi.fn(async () => { throw new Error("settings lookup failed"); });
    s.dependencies.config = () => getIntakeTextPaymentConfig({
      env: { TEXT_INTAKE_PAYMENT_MODE: "live", PAYPAL_LIVE_CLIENT_ID: "ENV", PAYPAL_LIVE_CLIENT_SECRET: "ENV_SECRET" }, settings,
    });
    await expect(s.dependencies.config()).rejects.toMatchObject({ code: "not_configured" });
    const service = createIntakeTextPaymentService(s.dependencies);
    expect(await service.configuration()).toEqual({ configured: false, client_id: null, environment: "sandbox", amount: "29.00" });
    await expect(service.create(input())).rejects.toMatchObject({ code: "not_configured" });
    expect(settings).toHaveBeenCalledTimes(3);
    expect(s.calls).toHaveLength(0);
  });
  it.each(["live", "sandbox"] as const)("saved %s mode uses only a complete selected-mode credential pair", async mode => {
    const prefix = mode === "sandbox" ? "PAYPAL_SANDBOX" : "PAYPAL_LIVE";
    const oppositeMode = mode === "sandbox" ? "live" : "sandbox";
    const env = { TEXT_INTAKE_PAYMENT_MODE: oppositeMode,
      PAYPAL_SANDBOX_CLIENT_ID: "ENV_S", PAYPAL_SANDBOX_CLIENT_SECRET: "ENV_SS",
      PAYPAL_LIVE_CLIENT_ID: "ENV_L", PAYPAL_LIVE_CLIENT_SECRET: "ENV_LS" };
    for (const half of ["ClientId", "ClientSecret"]) {
      const settings = async () => ({ mode, [`${mode}${half}`]: "HALF",
        [`${oppositeMode}ClientId`]: "OTHER", [`${oppositeMode}ClientSecret`]: "OTHER_SECRET" });
      expect(await getIntakeTextPaymentConfig({ env, settings })).toEqual({ mode,
        clientId: env[`${prefix}_CLIENT_ID`], clientSecret: env[`${prefix}_CLIENT_SECRET`] });
      const s = setup();
      s.dependencies.config = () => getIntakeTextPaymentConfig({ env: { ...env, [`${prefix}_CLIENT_SECRET`]: undefined }, settings });
      const service = createIntakeTextPaymentService(s.dependencies);
      expect(await service.configuration()).toEqual({ configured: false, client_id: null, environment: mode, amount: "29.00" });
      await expect(service.create(input())).rejects.toMatchObject({ code: "not_configured" });
      expect(s.calls).toHaveLength(0);
    }
  });
  it("missing credentials fail closed before provider calls", async () => {
    const s = setup();
    s.dependencies.config = async () => ({ mode: "sandbox", clientId: "", clientSecret: "" });
    const service = createIntakeTextPaymentService(s.dependencies);
    expect((await service.configuration()).configured).toBe(false);
    await expect(service.create(input())).rejects.toThrow();
    expect(s.calls).toHaveLength(0);
  });
});

describe("immutable $29 create/capture", () => {
  it("sandbox success verifies payment before simulated finalization and removes all snapshots", async () => {
    const s = setup(); const i = input();
    const order = await s.service.create(i);
    const body = s.creates()[0].body!;
    expect(body).toEqual({ intent: "CAPTURE", purchase_units: [{ custom_id: expect.any(String), description: TEXT_INTAKE_DESCRIPTION, amount: { value: "29.00", currency_code: "USD" } }] });
    expect(JSON.stringify(body)).not.toContain(i.submission_id);
    s.approve();
    const done = await s.service.capture(order);
    expect(done).toMatchObject({ payment_status: "COMPLETED", payment_provider: "paypal", amount: "29.00", paypal_order_id: "ORDER123", paypal_capture_id: "CAPTURE123", is_test: true });
    expect(done).not.toHaveProperty("patient");
    expect(s.finalize).not.toHaveBeenCalled(); expect(s.send).not.toHaveBeenCalled();
    expect(s.sandboxFinalize).toHaveBeenCalledTimes(1);
    expect(s.sandboxFinalize.mock.calls[0][0]).toMatchObject({ input: i, is_test: true, payment: { status: "COMPLETED", amount: "29.00" } });
    const record = [...s.store.records.values()][0];
    expect(record.input).toBeUndefined(); expect(record.retentionUntil! - record.createdAt).toBeGreaterThanOrEqual(30 * DAY);
    expect(s.log.mock.calls.every(c => ["provider_unavailable", "payment_binding_rejected", "delivery_pending", "reminder_pending", "sweep_pending", "payment_verified"].includes(c[0]))).toBe(true);
    expect(JSON.stringify(s.log.mock.calls)).not.toContain("SECRET");
  });
  it("live routes use live hooks only after verified capture", async () => {
    const s = setup("live"); const order = await s.service.create(input());
    expect(s.calls.every(c => c.url.startsWith("https://api-m.paypal.com"))).toBe(true);
    expect(s.finalize).not.toHaveBeenCalled(); s.approve();
    expect((await s.service.capture(order)).payment_status).toBe("COMPLETED");
    expect(s.finalize).toHaveBeenCalledTimes(1); expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
  it("sandbox without test hook never calls live finalizer or reminders", async () => {
    const s = setup(); delete s.dependencies.finalizeSandbox; delete s.dependencies.sendUnpaidSandbox;
    const service = createIntakeTextPaymentService(s.dependencies);
    const order = await service.create(input()); s.advance(31 * 60_000); await service.sweep();
    expect(s.send).not.toHaveBeenCalled(); s.approve();
    expect((await service.capture(order)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    expect(s.finalize).not.toHaveBeenCalled();
  });
  it("storage failure before provider means no auth, no order, no capture", async () => {
    const s = setup(); s.store.failSave = true;
    await expect(s.service.create(input())).rejects.toThrow(); expect(s.calls).toHaveLength(0);
  });
  it.each(["amount", "card_number", "cvv", "payment_source", "currency", "payment_token"])("rejects forbidden browser %s recursively", async key => {
    const s = setup(); const i: any = input(); i.resume_answers.nested = { [key]: "DO NOT RECEIVE" };
    await expect(s.service.create(i)).rejects.toThrow(); expect(s.calls).toHaveLength(0);
  });
  it("changed fingerprint is rejected; same validated_at retry retains first time and one order", async () => {
    const s = setup(); const i = input(); const order = await s.service.create(i);
    const retry = clone(i); retry.validated_at = Number(i.validated_at) + 60_000;
    expect(await s.service.create(retry)).toEqual(order); expect(s.creates()).toHaveLength(1);
    expect([...s.store.records.values()][0].input!.validated_at).toBe(i.validated_at);
    retry.resume_answers.w01 = "changed"; await expect(s.service.create(retry)).rejects.toMatchObject({ code: "changed_input" });
    expect(s.creates()).toHaveLength(1);
  });
  it("ambiguous create reuses stable UUID under six hours and fails closed after window", async () => {
    const s = setup(); const i = input(); s.loseCreate(true);
    await expect(s.service.create(i)).rejects.toThrow(); const id = s.creates()[0].headers.get("PayPal-Request-Id");
    expect(id!.length).toBeLessThan(38);
    await expect(s.service.create(i)).rejects.toThrow(); expect(s.creates()[1].headers.get("PayPal-Request-Id")).toBe(id);
    s.advance(6 * 60 * 60_000); s.loseCreate(false);
    await expect(s.service.create(i)).rejects.toMatchObject({ code: "idempotency_expired" }); expect(s.creates()).toHaveLength(2);
  });
  it("double taps and new service instance share durable one-order/one-capture outcome", async () => {
    const s = setup(); const i = input(); const second = createIntakeTextPaymentService(s.dependencies);
    const [a, b] = await Promise.all([s.service.create(i), second.create(i)]); expect(a).toEqual(b); expect(s.creates()).toHaveLength(1);
    s.approve(); const done = await Promise.all([s.service.capture(a), second.capture(a)]);
    expect(done[0]).toEqual(done[1]); expect(s.captures()).toHaveLength(1); expect(s.sandboxFinalize).toHaveBeenCalledTimes(1);
    expect(await second.receiptBySubmissionId(i.submission_id)).toEqual(done[0]);
  });
  it("status/cancel/unapproved do not create or capture; cancel has no server method", async () => {
    const s = setup(); const o = await s.service.create(input());
    expect((s.service as any).cancel).toBeUndefined();
    expect((await s.service.status(o.payment_token)).payment_status).toBe("PENDING");
    expect((await s.service.capture(o)).payment_status).toBe("PENDING");
    s.approve(); expect((await s.service.status(o.payment_token)).payment_status).toBe("PENDING");
    expect(s.captures()).toHaveLength(0); expect(s.creates()).toHaveLength(1); expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
  it("decline remains pending one-order; retries retain request ID; old capture claim fails closed", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve(); s.decline(true);
    expect((await s.service.capture(o)).payment_status).toBe("PENDING");
    expect([...s.store.records.values()][0].input).toBeDefined();
    await s.service.capture(o); expect(s.captures()[0].headers.get("PayPal-Request-Id")).toBe(s.captures()[1].headers.get("PayPal-Request-Id"));
    s.advance(6 * 60 * 60_000);
    await expect(s.service.capture(o)).rejects.toMatchObject({ code: "idempotency_expired" });
    expect(s.creates()).toHaveLength(1); expect(s.captures()).toHaveLength(2); expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
  it("lost capture ACK recovers GET, outage delivery retries never recharge even after restart/day seven", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve(); s.loseCapture(true);
    s.sandboxFinalize.mockRejectedValue(new Error("SECRET DELIVERY FAILURE"));
    expect((await s.service.capture(o)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    const record = [...s.store.records.values()][0]; expect(record.input).toBeDefined(); expect(record.retentionUntil).toBeNull();
    const service = createIntakeTextPaymentService(s.dependencies); s.advance(8 * DAY); s.offline(true);
    expect((await service.status(o.payment_token)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    s.sandboxFinalize.mockImplementation(async r => ({ submission_id: r.input.submission_id, submission_token: "SIGNED" }));
    expect((await service.status(o.payment_token)).payment_status).toBe("COMPLETED");
    expect(s.captures()).toHaveLength(1); expect(s.creates()).toHaveLength(1);
    expect(new Set(s.sandboxFinalize.mock.calls.map(c => c[0].deliveryIdempotencyKey)).size).toBe(1);
  });
  it("already completed capture via GET finalizes without capture POST", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    const r = [...s.store.records.values()][0];
    s.order.status = "COMPLETED";
    s.order.purchase_units[0].payments = { captures: [{ id: "CAPTURE123", status: "COMPLETED", custom_id: r.customId,
      amount: { value: "29.00", currency_code: "USD" }, create_time: "2026-11-18T00:01:00.000Z" }] };
    expect((await s.service.status(o.payment_token)).payment_status).toBe("COMPLETED"); expect(s.captures()).toHaveLength(0);
  });
  it("wrong browser order and wrong capability reject before capture", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    await expect(s.service.capture({ ...o, order_id: "WRONG123" })).rejects.toMatchObject({ code: "payment_binding_rejected" });
    await expect(s.service.status("x".repeat(43))).rejects.toMatchObject({ code: "invalid_token" });
    expect(s.captures()).toHaveLength(0);
  });
  it.each([
    ["order id", (r: any) => { r.id = "OTHER123"; }],
    ["custom binding", (r: any) => { r.purchase_units[0].custom_id = randomUUID(); }],
    ["purchase units", (r: any) => { r.purchase_units.push(clone(r.purchase_units[0])); }],
    ["amount", (r: any) => { r.purchase_units[0].amount.value = "28.00"; }],
    ["currency", (r: any) => { r.purchase_units[0].amount.currency_code = "EUR"; }],
    ["description", (r: any) => { r.purchase_units[0].description = "OTHER"; }],
    ["intent", (r: any) => { r.intent = "AUTHORIZE"; }],
  ])("rejects wrong provider %s binding", async (_name, mutate) => {
    const s = setup(); const o = await s.service.create(input()); s.approve(); s.mutate(mutate as (r: any) => void);
    await expect(s.service.capture(o)).rejects.toMatchObject({ code: "payment_binding_rejected" });
    expect(s.captures()).toHaveLength(0); expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
  it.each([
    ["capture status", (c: any) => { c.status = "PENDING"; }],
    ["capture amount", (c: any) => { c.amount.value = "129.00"; }],
    ["capture currency", (c: any) => { c.amount.currency_code = "CAD"; }],
    ["capture id", (c: any) => { delete c.id; }],
    ["capture custom ID", (c: any) => { c.custom_id = "PHI"; }],
    ["capture timestamp", (c: any) => { c.create_time = "invalid"; }],
  ])("rejects wrong %s before clinical delivery", async (_name, fn) => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    s.mutate(r => { if (r.status === "COMPLETED") (fn as (c: any) => void)(r.purchase_units[0].payments.captures[0]); });
    await expect(s.service.capture(o)).rejects.toMatchObject({ code: "payment_binding_rejected" }); expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
  it("provider pending capture can never be treated as completed or charged again", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    s.order.purchase_units[0].payments = { captures: [{ status: "PENDING" }] };
    expect((await s.service.capture(o)).payment_status).toBe("PENDING"); expect(s.captures()).toHaveLength(0);
  });
  it("compact capture response is accepted only after full strict order GET verification", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    s.mutate(r => { if (r.status === "COMPLETED") { delete r.intent; delete r.purchase_units[0].custom_id; delete r.purchase_units[0].amount; delete r.purchase_units[0].description; } });
    expect((await s.service.capture(o)).payment_status).toBe("COMPLETED");
    expect(s.captures()).toHaveLength(1);
  });
  it("compact restart GET cannot weaken full order binding", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    s.mutate(r => { delete r.purchase_units[0].amount; });
    await expect(s.service.status(o.payment_token)).rejects.toMatchObject({ code: "payment_binding_rejected" });
    expect(s.captures()).toHaveLength(0);
  });
  it("multiple captures cannot satisfy exact completed payment proof", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve();
    s.mutate(r => { if (r.status === "COMPLETED") r.purchase_units[0].payments.captures.push(clone(r.purchase_units[0].payments.captures[0])); });
    await expect(s.service.capture(o)).rejects.toMatchObject({ code: "payment_binding_rejected" });
    expect(s.sandboxFinalize).not.toHaveBeenCalled();
  });
});

describe("resume, expiry and contact-only reminder sweep", () => {
  it("reminder projects contacts only, stable retries, consumes resume once and revokes old payment token", async () => {
    const s = setup(); const i = input(); const o = await s.service.create(i); s.advance(31 * 60_000);
    s.sandboxSend.mockResolvedValueOnce(false);
    expect((await s.service.sweep()).sent).toBe(0); s.advance(31 * 60_000);
    expect((await s.service.sweep()).sent).toBe(1);
    const [payload, key] = s.sandboxSend.mock.calls[0] as unknown as [any, string];
    expect(s.sandboxSend.mock.calls[1].slice(0, 2)).toEqual([payload, key]);
    expect(Object.keys(payload).sort()).toEqual(["event", "first_name", "last_name", "email", "phone", "state", "sms_opt_in", "source", "tags", "is_test", "resume_url"].sort());
    expect(payload.phone).toBe("+12025550123"); expect(payload.tags).toBe("intake-unpaid");
    expect(JSON.stringify(payload)).not.toMatch(/SECRET|dob|sign|ORDER123|score/);
    const token = payload.resume_url.split("#token=")[1];
    const restored = await s.service.resume(token); expect(restored.input).toEqual(i); expect(restored.payment_token).not.toBe(o.payment_token);
    await expect(s.service.resume(token)).rejects.toMatchObject({ code: "invalid_token" });
    await expect(s.service.status(o.payment_token)).rejects.toMatchObject({ code: "invalid_token" });
    s.advance(31 * 60_000); await s.service.sweep(); expect(s.sandboxSend).toHaveBeenCalledTimes(2);
    expect(s.creates()).toHaveLength(1); expect(s.captures()).toHaveLength(0); expect(s.send).not.toHaveBeenCalled();
  });
  it("restore is body-capability authorized and repeatable after a lost acknowledgment without provider calls", async () => {
    const s = setup(); const i = input(); const o = await s.service.create(i); const count = s.calls.length;
    const r = await s.service.restore(o.payment_token); expect(r.input).toEqual(i);
    expect(s.calls).toHaveLength(count); expect((await s.service.restore(o.payment_token)).payment_token).toBe(o.payment_token);
    expect((await s.service.status(r.payment_token)).payment_status).toBe("PENDING");
  });
  it("expiry denies snapshot and deletes PHI without a worker or reliable provider", async () => {
    const s = setup(); const i = input(); const o = await s.service.create(i); s.advance(7 * DAY); s.offline(true);
    await expect(s.service.restore(o.payment_token)).rejects.toMatchObject({ code: "expired" });
    const r = [...s.store.records.values()][0]; expect(r.input).toBeUndefined(); expect(r.resumeToken).toBeUndefined();
    await expect(s.service.create(i)).rejects.toMatchObject({ code: "expired" }); expect(s.creates()).toHaveLength(1);
  });
  it("sweep expires unpaid PHI and retains dedup beyond provider window", async () => {
    const s = setup(); await s.service.create(input()); s.advance(7 * DAY);
    expect((await s.service.sweep()).expired).toBe(1);
    const r = [...s.store.records.values()][0]; expect(r.state).toBe("expired"); expect(r.input).toBeUndefined(); expect(r.retentionUntil!).toBeGreaterThan(r.expiresAt);
  });
  it("completed reconciliation suppresses unpaid reminder and does not auto capture approved abandonment", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve(); s.advance(31 * 60_000);
    expect((await s.service.sweep()).sent).toBe(1); expect(s.captures()).toHaveLength(0);
    await s.service.capture(o); s.advance(31 * 60_000); await s.service.sweep(); expect(s.sandboxSend).toHaveBeenCalledTimes(1);
  });
  it("unapproved cancellation retains input but sends nothing before thirty minutes", async () => {
    const s = setup(); await s.service.create(input()); s.advance(29 * 60_000);
    expect((await s.service.sweep()).processed).toBe(0); expect(s.sandboxSend).not.toHaveBeenCalled();
    expect([...s.store.records.values()][0].input).toBeDefined();
  });
  it("no SMS consent or unallowlisted origin means no reminder", async () => {
    for (const wrongOrigin of [true, false]) {
      const s = setup(); const i = input();
      if (wrongOrigin) i.public_origin = "https://attacker.invalid"; else i.intake!.consents.sms_opt_in = false;
      await s.service.create(i); s.advance(31 * 60_000); await s.service.sweep(); expect(s.sandboxSend).not.toHaveBeenCalled();
    }
  });
  it("provider unavailable means no unpaid notification", async () => {
    const s = setup(); await s.service.create(input()); s.advance(31 * 60_000); s.offline(true);
    await s.service.sweep(); expect(s.sandboxSend).not.toHaveBeenCalled();
  });
  it("unverified capture claim expires snapshots but preserves non-PHI reconciliation indefinitely", async () => {
    const s = setup(); const o = await s.service.create(input()); s.approve(); s.decline(true);
    await s.service.capture(o); s.advance(7 * DAY); s.offline(true);
    await s.service.sweep(); const r = [...s.store.records.values()][0];
    expect(r.state).toBe("capture_uncertain"); expect(r.input).toBeUndefined(); expect(r.retentionUntil).toBeNull();
    expect(r.orderId).toBe(o.order_id); expect(s.sandboxSend).not.toHaveBeenCalled();
    s.advance(31 * DAY); await s.store.cleanup(Number.MAX_SAFE_INTEGER); expect(s.store.records.size).toBe(1);
  });
  it("completed merchant order reconciles before any reminder", async () => {
    const s = setup(); const o = await s.service.create(input()); const r = [...s.store.records.values()][0];
    s.order.status = "COMPLETED";
    s.order.purchase_units[0].payments = { captures: [{ id: "CAPTURE123", status: "COMPLETED", custom_id: r.customId,
      amount: { value: "29.00", currency_code: "USD" }, create_time: "2026-11-18T00:01:00.000Z" }] };
    s.advance(31 * 60_000); expect((await s.service.sweep()).recovered).toBe(1);
    expect(s.sandboxSend).not.toHaveBeenCalled(); expect(s.captures()).toHaveLength(0);
    expect((await s.service.status(o.payment_token)).payment_status).toBe("COMPLETED");
  });
  it("sweep bounded max two even if injected store returns excessive candidates", async () => {
    const s = setup();
    s.store.candidates = async () => Array.from({ length: 20 }, (_, i) => String(i).padStart(64, "0"));
    expect((await s.service.sweep()).processed).toBe(2);
  });
});
