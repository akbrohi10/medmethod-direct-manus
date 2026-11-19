import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createIntakeTextPaymentService, getIntakeTextPaymentConfig, TEXT_INTAKE_DESCRIPTION,
  type TextIntakePaymentDependencies, type TextIntakePaymentOptions, type TextIntakePaymentRecord,
  type TextIntakePaymentService, type TextIntakeValidatedInput,
} from "./intakeTextPaymentService";
import type { IntakeTextPaymentStore, TextPaymentLockedRecord } from "./intakeTextPaymentStore";
import { validateIntakeDraft } from "./intakeSubmissionContract";

// Synthetic fixtures, read-only mocked settings and memory storage only. Block every real network/DB call.
const isolation = vi.hoisted(() => ({ settings: vi.fn(), createPool: vi.fn() }));
vi.mock("./db", () => ({ getPaypalSettings: isolation.settings }));
vi.mock("mysql2/promise", () => ({ default: { createPool: isolation.createPool } }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-demo-test-only-cookie-secret" } }));
vi.mock("./_core/trpc", async () => {
  const { initTRPC } = await import("@trpc/server");
  const t = initTRPC.context<Record<string, unknown>>().create();
  return { router: t.router, publicProcedure: t.procedure };
});
import * as integration from "./intakeTextPaymentIntegration";
import { intakeTextPaymentRouter } from "./routers/intakeTextPayment";

const DAY = 86_400_000;
const FIXTURE_NOW = Date.parse("2026-11-18T16:35:00.000Z");
const fixture = JSON.parse(readFileSync(new URL("./fixtures/intake29-dummy.json", import.meta.url), "utf8"));
const clone = <T>(value: T): T => structuredClone(value);
const settingsFor = (mode: "sandbox" | "live") => ({ mode,
  sandboxClientId: "SYNTHETIC_SANDBOX_ID", sandboxClientSecret: "SYNTHETIC_SANDBOX_SECRET",
  liveClientId: "SYNTHETIC_LIVE_ID", liveClientSecret: "SYNTHETIC_LIVE_SECRET" });
const sandboxCredentials = { mode: "sandbox", clientId: "SYNTHETIC_SANDBOX_ID", clientSecret: "SYNTHETIC_SANDBOX_SECRET" };
const liveCredentials = { mode: "live", clientId: "SYNTHETIC_LIVE_ID", clientSecret: "SYNTHETIC_LIVE_SECRET" };
type RecordType = TextIntakePaymentRecord;

class MemoryStore implements IntakeTextPaymentStore<RecordType> {
  records = new Map<string, RecordType>();
  queues = new Map<string, Promise<unknown>>();
  isConfigured() { return true; }
  hashSubmission(id: string) { return createHash("sha256").update(`submission:${id}`).digest("hex"); }
  hashCapability(token: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("Invalid synthetic capability");
    return createHash("sha256").update(`capability:${token}`).digest("hex");
  }
  async findCapability(token: string, kind: "payment" | "resume") {
    const hash = this.hashCapability(token);
    return [...this.records].find(([, r]) => (kind === "payment" ? r.paymentTokenHash : r.resumeTokenHash) === hash)?.[0] ?? null;
  }
  async withRecord<T>(key: string, work: (locked: TextPaymentLockedRecord<RecordType>) => Promise<T>): Promise<T> {
    const prior = this.queues.get(key) ?? Promise.resolve();
    const next = prior.catch(() => undefined).then(() => work({
      read: async () => clone(this.records.get(key) ?? null),
      save: async record => { this.records.set(key, clone(record)); },
    }));
    this.queues.set(key, next);
    return next;
  }
  async candidates(now: number, limit: number) {
    return [...this.records].filter(([, r]) => !["completed", "expired"].includes(r.state) && r.nextSweepAt <= now)
      .slice(0, limit).map(([key]) => key);
  }
  async cleanup() { return 0; }
}

function body(demoMode?: boolean, isTest = false) {
  const result = clone(fixture);
  delete result.demo_mode;
  result.intake.is_test = isTest;
  if (demoMode !== undefined) result.demo_mode = demoMode;
  return result;
}
function validated(demoMode?: boolean): TextIntakeValidatedInput {
  const draft = validateIntakeDraft(body(demoMode).intake);
  return { submission_id: draft.submission_id, intake: draft, signing: clone(fixture.signing),
    resume_answers: {}, is_test: demoMode === true, ...(demoMode !== undefined ? { demo_mode: demoMode } : {}),
    public_origin: "https://medmethoddirect.com", validated_at: FIXTURE_NOW };
}
function setup(initialMode: "sandbox" | "live" = "live") {
  let mode = initialMode, time = FIXTURE_NOW;
  let decline = false, loseCaptureAck = false, lookupFails = false;
  const store = new MemoryStore();
  const calls: { url: string; method: string; headers: Headers; body?: any }[] = [];
  let order: any;
  const provider = vi.fn<typeof fetch>(async (url, init = {}) => {
    const call = { url: String(url), method: init.method ?? "GET", headers: new Headers(init.headers),
      body: init.body && !String(init.body).startsWith("grant_") ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    if (call.url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "SYNTHETIC_OAUTH" });
    if (call.url.endsWith("/v2/checkout/orders")) {
      order ??= { id: "SYNTHETIC_ORDER", intent: "CAPTURE", status: "CREATED", purchase_units: clone(call.body.purchase_units) };
    } else if (call.url.endsWith("/capture")) {
      const record = [...store.records.values()][0];
      expect(record.captureAttemptAt).toBeDefined();
      expect(call.headers.get("PayPal-Request-Id")).toBe(record.captureRequestId);
      if (decline) return new Response("Synthetic decline", { status: 422 });
      markPaid();
      if (loseCaptureAck) throw new Error("Synthetic lost ACK");
    } else if (!call.url.endsWith("/v2/checkout/orders/SYNTHETIC_ORDER")) {
      throw new Error("Unexpected mock provider path");
    }
    return Response.json(clone(order));
  });
  function markPaid() {
    order.status = "COMPLETED";
    order.purchase_units[0].payments = { captures: [{ id: "SYNTHETIC_CAPTURE", status: "COMPLETED",
      amount: { value: "29.00", currency_code: "USD" }, create_time: new Date(FIXTURE_NOW).toISOString() }] };
  }
  const finalize = vi.fn(async () => { throw new Error("Live finalization must not run in a demo"); });
  const finalizeSandbox = vi.fn(async (r: any) => ({ submission_id: r.input.submission_id,
    submission_token: "SYNTHETIC_RECEIPT", redirect_url: "/intake/thank-you/?prefill=demo" }));
  const sendUnpaid = vi.fn(async () => { throw new Error("Live reminder must not run in a demo"); });
  const config = vi.fn(async (options?: TextIntakePaymentOptions) => getIntakeTextPaymentConfig({ ...options, env: {}, settings: async () => {
    if (lookupFails) throw new Error("Synthetic settings outage");
    return settingsFor(mode);
  } }));
  const dependencies: TextIntakePaymentDependencies<TextIntakeValidatedInput> = {
    store, fetch: provider, config, validate: async raw => clone(raw) as TextIntakeValidatedInput,
    now: () => time, finalize, finalizeSandbox, sendUnpaid,
  };
  return { store, calls, config, dependencies, provider, finalize, finalizeSandbox, sendUnpaid,
    service: createIntakeTextPaymentService(dependencies),
    restart: () => createIntakeTextPaymentService(dependencies),
    setMode(value: "sandbox" | "live") { mode = value; }, advance(ms: number) { time += ms; },
    approve() { order.status = "APPROVED"; }, markPaid,
    decline(value: boolean) { decline = value; }, loseCaptureAck(value: boolean) { loseCaptureAck = value; },
    failLookup(value: boolean) { lookupFails = value; },
    record() { return [...store.records.values()][0]; },
    captures() { return calls.filter(c => c.url.endsWith("/capture")); },
  };
}
function assertSandbox(s: ReturnType<typeof setup>) {
  expect(s.calls.length).toBeGreaterThan(0);
  expect(s.calls.every(call => call.url.startsWith("https://api-m.sandbox.paypal.com/"))).toBe(true);
  for (const call of s.calls.filter(call => call.url.endsWith("/v1/oauth2/token"))) {
    expect(call.headers.get("Authorization")).toBe(`Basic ${Buffer.from("SYNTHETIC_SANDBOX_ID:SYNTHETIC_SANDBOX_SECRET").toString("base64")}`);
  }
  expect(s.finalize).not.toHaveBeenCalled();
  expect(s.sendUnpaid).not.toHaveBeenCalled();
}
function caller(service: TextIntakePaymentService) {
  vi.spyOn(integration, "getIntakeTextPaymentService").mockReturnValue(service as any);
  return intakeTextPaymentRouter.createCaller({ req: { headers: {
    "x-mmd-text-payment": "1", origin: "https://medmethoddirect.com", "sec-fetch-site": "same-origin",
  } } } as any);
}
beforeEach(() => {
  vi.spyOn(Date, "now").mockReturnValue(FIXTURE_NOW);
  isolation.settings.mockResolvedValue(settingsFor("live"));
  isolation.createPool.mockImplementation(() => { throw new Error("Real DB access forbidden"); });
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("Real network forbidden"); }));
});
afterEach(() => {
  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(isolation.createPool).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("read-only explicit demo Sandbox configuration", () => {
  it.each([
    ["live", undefined, liveCredentials], ["live", false, liveCredentials], ["live", true, sandboxCredentials],
    ["sandbox", undefined, sandboxCredentials], ["sandbox", false, sandboxCredentials], ["sandbox", true, sandboxCredentials],
  ] as const)("saved %s / demo %s selects only that credential pair", async (mode, demo_mode, expected) => {
    expect(await getIntakeTextPaymentConfig({ env: {}, settings: async () => settingsFor(mode), demo_mode })).toEqual(expected);
  });
  it("uses only a complete Sandbox environment fallback, never halves or Live credentials", async () => {
    const env = { PAYPAL_SANDBOX_CLIENT_ID: "ENV_SANDBOX", PAYPAL_SANDBOX_CLIENT_SECRET: "ENV_SANDBOX_SECRET",
      PAYPAL_LIVE_CLIENT_ID: "ENV_LIVE", PAYPAL_LIVE_CLIENT_SECRET: "ENV_LIVE_SECRET" };
    expect(await getIntakeTextPaymentConfig({ env, demo_mode: true, settings: async () => ({
      mode: "live", sandboxClientId: "HALF", liveClientId: "LIVE", liveClientSecret: "LIVE_SECRET",
    }) })).toEqual({ mode: "sandbox", clientId: "ENV_SANDBOX", clientSecret: "ENV_SANDBOX_SECRET" });
  });
  it("missing Sandbox credentials reports not configured and never falls back to a usable Live pair", async () => {
    const s = setup();
    s.dependencies.config = options => getIntakeTextPaymentConfig({ ...options,
      env: { TEXT_INTAKE_PAYMENT_MODE: "live", PAYPAL_LIVE_CLIENT_ID: "ENV_LIVE", PAYPAL_LIVE_CLIENT_SECRET: "ENV_LIVE_SECRET" },
      settings: async () => ({ mode: "live", liveClientId: "LIVE", liveClientSecret: "LIVE_SECRET" }),
    });
    const service = s.restart();
    expect(await service.configuration({ demo_mode: true })).toEqual({ configured: false, client_id: null,
      environment: "sandbox", amount: "29.00", readiness_reason: "paypal_unavailable" });
    await expect(service.create(validated(true))).rejects.toMatchObject({ code: "not_configured" });
    expect(s.calls).toHaveLength(0); expect(s.store.records.size).toBe(0);
  });
  it("a failed settings lookup fails closed even with usable Sandbox and Live environment credentials", async () => {
    const s = setup();
    s.dependencies.config = options => getIntakeTextPaymentConfig({ ...options, env: {
      PAYPAL_SANDBOX_CLIENT_ID: "ENV_S", PAYPAL_SANDBOX_CLIENT_SECRET: "ENV_SS",
      PAYPAL_LIVE_CLIENT_ID: "ENV_L", PAYPAL_LIVE_CLIENT_SECRET: "ENV_LS",
    }, settings: async () => { throw new Error("Synthetic lookup failure"); } });
    await expect(s.dependencies.config({ demo_mode: true })).rejects.toMatchObject({ code: "not_configured" });
    const service = s.restart();
    expect((await service.configuration({ demo_mode: true })).configured).toBe(false);
    await expect(service.create(validated(true))).rejects.toMatchObject({ code: "not_configured" });
    expect(s.calls).toHaveLength(0);
  });
  it.each(["true", 1, {}, null])("does not treat malformed runtime flag %j as explicit true", async demo_mode => {
    expect(await getIntakeTextPaymentConfig({ env: {}, settings: async () => settingsFor("live"), demo_mode: demo_mode as any })).toEqual(liveCredentials);
  });
  it("public config accepts no input or an optional strict boolean and returns no secret", async () => {
    const s = setup(); const api = caller(s.service);
    expect(await api.config()).toEqual({ configured: true, client_id: "SYNTHETIC_LIVE_ID", environment: "live", amount: "29.00", currency: "USD" });
    expect((await api.config({ demo_mode: false })).environment).toBe("live");
    const demo = await api.config({ demo_mode: true });
    expect(demo).toEqual({ configured: true, client_id: "SYNTHETIC_SANDBOX_ID", environment: "sandbox", amount: "29.00", currency: "USD" });
    expect(JSON.stringify(demo)).not.toContain("SECRET");
    for (const input of [{ demo_mode: "true" }, { demo_mode: 1 }, { demo_mode: null }, { demo_mode: true, environment: "live" }]) {
      await expect(api.config(input as any)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    }
    expect(s.calls).toHaveLength(0);
  });
  it("fails closed before any provider call when a custom config ignores the explicit demo option", async () => {
    const s = setup(); s.dependencies.config = async () => ({ ...liveCredentials, mode: "live" });
    const service = s.restart();
    expect(await service.configuration({ demo_mode: true })).toMatchObject({ configured: false, client_id: null, environment: "sandbox" });
    await expect(service.create(validated(true))).rejects.toMatchObject({ code: "mode_mismatch" });
    expect(s.calls).toHaveLength(0); expect(s.store.records.size).toBe(0);
  });
});

describe("actual typed/signature/consent validated demo integration", () => {
  it("accepts an explicit demo under saved Live, changes only test classification and retains all legal data", async () => {
    const b = body(true, true);
    const result = await integration.validateTextPaymentInput({ body: b, public_origin: "https://medmethoddirect.com" });
    expect(result.demo_mode).toBe(true); expect(result.is_test).toBe(true); expect(result.intake.is_test).toBe(true);
    expect(result.intake).toEqual({ ...validateIntakeDraft(b.intake), is_test: true });
    expect(result.signing).toEqual(b.signing); expect(result.signing.signature_method).toBe("typed");
    expect(result.intake.consents).toEqual(b.intake.consents);
    expect(result.intake.patient).toEqual(b.intake.patient);
    const s = setup(); s.dependencies.validate = integration.validateTextPaymentInput;
    const order = await s.restart().create({ body: b, public_origin: "https://medmethoddirect.com" });
    expect(order.environment).toBe("sandbox"); expect(s.record().demo_mode).toBe(true);
    assertSandbox(s);
  });
  it.each([undefined, false])("rejects normal draft.is_test under Live with demo %s", async flag => {
    await expect(integration.validateTextPaymentInput({ body: body(flag, true), public_origin: "https://medmethoddirect.com" }))
      .rejects.toThrow("Demo intakes require Sandbox checkout.");
  });
  it.each(["live", "sandbox"] as const)("normal saved %s classification does not invent a demo capability", async mode => {
    isolation.settings.mockResolvedValue(settingsFor(mode));
    const b = body(false);
    const result = await integration.validateTextPaymentInput({ body: b, public_origin: "https://medmethoddirect.com" });
    expect(result).not.toHaveProperty("demo_mode");
    expect(result.is_test).toBe(mode === "sandbox"); expect(result.intake.is_test).toBe(mode === "sandbox");
    expect(result.signing).toEqual(b.signing);
  });
  it.each(["true", 1, null, {}])("rejects malformed demo flag %j before settings/provider access", async flag => {
    await expect(integration.validateTextPaymentInput({ body: { ...body(), demo_mode: flag }, public_origin: "https://medmethoddirect.com" })).rejects.toThrow();
    expect(isolation.settings).not.toHaveBeenCalled();
  });
  it("never lets a demo bypass required legal consent or signing checks", async () => {
    const consent = body(true); consent.intake.consents.sms_consent = false;
    const signature = body(true); signature.signing.electronic_agreement = false;
    for (const b of [consent, signature]) await expect(integration.validateTextPaymentInput({ body: b, public_origin: "https://medmethoddirect.com" })).rejects.toThrow();
    expect(isolation.settings).not.toHaveBeenCalled();
  });
});

describe("persisted forced capability controls OAuth, capture, restart, expiry and sweep", () => {
  it("default real configuration lookup supports the demo option (not only injected configs)", async () => {
    const s = setup(); delete s.dependencies.config;
    const service = s.restart();
    expect((await service.configuration()).environment).toBe("live");
    expect((await service.configuration({ demo_mode: true })).environment).toBe("sandbox");
    const created = await service.create(validated(true)); s.approve();
    expect((await service.capture(created)).payment_status).toBe("COMPLETED");
    assertSandbox(s);
  });
  it("all forced order/OAuth/status/capture calls remain Sandbox across saved-mode changes and restart", async () => {
    const s = setup(); const input = validated(true); const created = await s.service.create(input);
    expect(s.record()).toMatchObject({ demo_mode: true, environment: "sandbox" });
    const createCall = s.calls.find(call => call.url.endsWith("/v2/checkout/orders"))!;
    expect(createCall.body).toEqual({ intent: "CAPTURE", purchase_units: [{ custom_id: s.record().customId,
      description: TEXT_INTAKE_DESCRIPTION, amount: { value: "29.00", currency_code: "USD" } }] });
    s.setMode("sandbox"); expect((await s.service.configuration()).environment).toBe("sandbox");
    expect((await s.service.status(created.payment_token)).payment_status).toBe("PENDING");
    s.setMode("live"); expect((await s.service.configuration()).environment).toBe("live");
    const restarted = s.restart();
    expect((await restarted.status(created.payment_token)).environment).toBe("sandbox");
    s.approve(); expect((await restarted.capture(created)).payment_status).toBe("COMPLETED");
    expect(s.captures()).toHaveLength(1); expect(s.finalizeSandbox).toHaveBeenCalledTimes(1);
    expect(s.record().input).toBeUndefined(); expect(s.record().demo_mode).toBe(true);
    const count = s.calls.length; s.failLookup(true);
    expect((await s.restart().status(created.payment_token)).payment_status).toBe("COMPLETED");
    expect(s.calls).toHaveLength(count);
    assertSandbox(s);
  });
  it("paid lost-ACK delivery recovery after restart/config outage/day seven never calls Live or charges again", async () => {
    const s = setup(); const created = await s.service.create(validated(true)); s.approve(); s.loseCaptureAck(true);
    s.finalizeSandbox.mockRejectedValue(new Error("Synthetic delivery outage"));
    expect((await s.service.capture(created)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    s.advance(8 * DAY); s.setMode("live"); s.failLookup(true);
    const count = s.calls.length;
    expect((await s.restart().status(created.payment_token)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    s.finalizeSandbox.mockResolvedValue({ submission_id: s.record().input!.submission_id, submission_token: "SYNTHETIC_RECEIPT", redirect_url: "/intake/thank-you/?prefill=demo" });
    expect((await s.restart().sweep()).recovered).toBe(1);
    expect(s.calls).toHaveLength(count); expect(s.captures()).toHaveLength(1); expect(s.record().demo_mode).toBe(true);
    assertSandbox(s);
  });
  it("unpaid forced sweep reconciles Sandbox and suppresses reminders without enabling a live sink", async () => {
    const s = setup(); await s.service.create(validated(true)); s.advance(31 * 60_000);
    expect((await s.restart().sweep()).sent).toBe(0);
    expect(s.record().reminderSuppressed).toBe(true); expect(s.captures()).toHaveLength(0);
    assertSandbox(s);
  });
  it("forced sweep can recover a completed Sandbox order without auto-capture", async () => {
    const s = setup(); await s.service.create(validated(true)); s.markPaid(); s.advance(31 * 60_000);
    expect((await s.restart().sweep()).recovered).toBe(1);
    expect(s.captures()).toHaveLength(0); expect(s.record().demo_mode).toBe(true); expect(s.record().input).toBeUndefined();
    assertSandbox(s);
  });
  it.each(["status", "sweep"] as const)("expired uncertain record retains top-level Sandbox capability after PHI purge for %s recovery", async operation => {
    const s = setup(); const created = await s.service.create(validated(true)); s.approve(); s.decline(true);
    expect((await s.service.capture(created)).payment_status).toBe("PENDING");
    s.advance(8 * DAY); s.setMode("live");
    await expect(s.restart().restore(created.payment_token)).rejects.toMatchObject({ code: "expired" });
    expect(s.record()).toMatchObject({ demo_mode: true, environment: "sandbox", state: "capture_uncertain", retentionUntil: null });
    expect(s.record().input).toBeUndefined();
    s.markPaid(); s.advance(31 * 60_000);
    const before = s.calls.length;
    const restarted = s.restart();
    if (operation === "status") expect(await restarted.status(created.payment_token)).toMatchObject({ payment_status: "PAID_AWAITING_DELIVERY", environment: "sandbox" });
    else await restarted.sweep();
    expect(s.calls.slice(before).map(call => call.method)).toEqual(["POST", "GET"]);
    expect(s.record().payment?.environment).toBe("sandbox"); expect(s.record().input).toBeUndefined();
    expect(s.finalizeSandbox).not.toHaveBeenCalled(); expect(s.captures()).toHaveLength(1);
    assertSandbox(s);
  });
  it("normal fingerprints omit false/undefined demo_mode and normal Sandbox records remain strict after a mode change", async () => {
    const s = setup("sandbox"); const input = validated(); const created = await s.service.create(input);
    const fingerprint = s.record().fingerprint;
    expect(s.record()).not.toHaveProperty("demo_mode");
    expect(await s.service.create({ ...input, demo_mode: false, validated_at: FIXTURE_NOW + 60_000 })).toEqual(created);
    expect(s.record().fingerprint).toBe(fingerprint); expect(s.record().input!.validated_at).toBe(FIXTURE_NOW);
    s.setMode("live"); const count = s.calls.length;
    await expect(s.restart().status(created.payment_token)).rejects.toMatchObject({ code: "mode_mismatch" });
    expect(s.calls).toHaveLength(count);
    await expect(s.service.create({ ...input, demo_mode: true })).rejects.toMatchObject({ code: "changed_input" });
  });
  it("legacy Sandbox input-only demo flag cannot relax saved-mode checks without a persisted top-level capability", async () => {
    const s = setup("sandbox"); const created = await s.service.create(validated());
    s.record().input!.demo_mode = true;
    s.setMode("live"); const count = s.calls.length;
    await expect(s.restart().capture(created)).rejects.toMatchObject({ code: "mode_mismatch" });
    expect(s.calls).toHaveLength(count); expect(s.record()).not.toHaveProperty("demo_mode");
  });
  it("capture rejects a request demo flag and direct service flags cannot flip a Live record or defeat its pending-mode check", async () => {
    const s = setup(); const created = await s.service.create(validated()); s.approve(); s.setMode("sandbox");
    const count = s.calls.length;
    await expect(caller(s.service).capture({ ...created, demo_mode: true } as any)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(s.service.capture({ ...created, demo_mode: true } as any)).rejects.toMatchObject({ code: "mode_mismatch" });
    expect(s.calls).toHaveLength(count); expect(s.record().environment).toBe("live"); expect(s.record()).not.toHaveProperty("demo_mode");
    expect(s.record().captureAttemptAt).toBeUndefined();
    expect(s.config.mock.calls.every(args => args.length === 0)).toBe(true);
  });
  it("an inconsistent forced Live record fails closed before provider, finalization or reminder routing", async () => {
    const s = setup(); const created = await s.service.create(validated(true));
    s.record().environment = "live"; const count = s.calls.length;
    await expect(s.restart().capture(created)).rejects.toMatchObject({ code: "mode_mismatch" });
    await expect(s.restart().status(created.payment_token)).rejects.toMatchObject({ code: "mode_mismatch" });
    s.advance(31 * 60_000); await s.restart().sweep();
    expect(s.calls).toHaveLength(count); expect(s.finalizeSandbox).not.toHaveBeenCalled();
    expect(s.finalize).not.toHaveBeenCalled(); expect(s.sendUnpaid).not.toHaveBeenCalled();
  });
  it("malformed server-validated flags are rejected before persistence/provider side effects", async () => {
    const s = setup();
    await expect(s.service.create({ ...validated(), demo_mode: "true" })).rejects.toMatchObject({ code: "invalid_input" });
    expect(s.store.records.size).toBe(0); expect(s.calls).toHaveLength(0);
  });
});
