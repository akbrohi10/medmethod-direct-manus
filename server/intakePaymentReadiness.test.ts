import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createIntakeTextPaymentStore, IntakeTextPaymentStoreError,
  type IntakeTextPaymentStore, type TextPaymentLockedRecord, type TextPaymentPool,
} from "./intakeTextPaymentStore";
import {
  createIntakeTextPaymentService, IntakeTextPaymentError,
  type TextIntakePaymentConfig, type TextIntakePaymentRecord, type TextIntakePaymentService,
  type TextIntakeValidatedInput,
} from "./intakeTextPaymentService";
import { validateIntakeDraft, validateWebsiteCareSmsConsent } from "./intakeSubmissionContract";
import { validateIntakeSigning } from "./intakeSigningInput";
import * as applicationKey from "./intakePrivateApplicationKey";

// The real router runs against an isolated tRPC context and mocked integration only.
// Neither application startup, production settings, nor delivery integrations are imported.
const isolation = vi.hoisted(() => ({ getService: vi.fn(), createPool: vi.fn() }));
vi.mock("mysql2/promise", () => ({ default: { createPool: isolation.createPool } }));
vi.mock("./_core/trpc", async () => {
  const { initTRPC } = await import("@trpc/server");
  const t = initTRPC.context<Record<string, unknown>>().create();
  return { router: t.router, publicProcedure: t.procedure };
});
vi.mock("./intakeTextPaymentIntegration", () => ({
  getIntakeTextPaymentService: isolation.getService,
  textPaymentOrigin: (req: { headers: Record<string, string> }) => req.headers.origin,
}));
import { intakeTextPaymentRouter } from "./routers/intakeTextPayment";

type RecordType = TextIntakePaymentRecord<TextIntakeValidatedInput>;
const strongSecret = "synthetic-test-only-storage-secret-over-32-characters";
const paypalConfig: TextIntakePaymentConfig = { mode: "sandbox", clientId: "PUBLIC_TEST_CLIENT", clientSecret: "PRIVATE_TEST_PROVIDER_SECRET" };
const fixture = JSON.parse(readFileSync(resolve(import.meta.dirname, "fixtures/intake29-dummy.json"), "utf8"));
const fixtureNow = Date.parse("2026-11-18T16:35:00.000Z");

async function validatedFixture(): Promise<TextIntakeValidatedInput> {
  const draft = validateIntakeDraft(structuredClone(fixture.intake));
  validateWebsiteCareSmsConsent(draft, fixtureNow);
  const { signing } = await validateIntakeSigning(structuredClone(fixture.signing), draft, fixtureNow);
  return { submission_id: draft.submission_id, intake: draft, signing, resume_answers: {},
    is_test: true, public_origin: "https://medmethoddirect.com", validated_at: fixtureNow };
}
function noSqlPool() {
  const execute = vi.fn(async (): Promise<[unknown, unknown]> => { throw new Error("Unexpected test SQL"); });
  const getConnection = vi.fn(async () => { throw new Error("Unexpected test connection"); });
  const pool: TextPaymentPool = { execute, getConnection };
  return { pool, execute, getConnection };
}
function setup(store: IntakeTextPaymentStore<RecordType>, config = vi.fn(async () => ({ ...paypalConfig }))) {
  const validate = vi.fn(async raw => structuredClone(raw) as TextIntakeValidatedInput);
  const provider = vi.fn<typeof fetch>(async () => { throw new Error("Unexpected mock provider call"); });
  const finalize = vi.fn(async () => { throw new Error("Unexpected clinical delivery"); });
  const sendUnpaid = vi.fn(async () => { throw new Error("Unexpected reminder delivery"); });
  const service = createIntakeTextPaymentService({ store, config, validate, fetch: provider, finalize, sendUnpaid });
  return { service, config, validate, provider, finalize, sendUnpaid };
}
function caller(service: TextIntakePaymentService) {
  isolation.getService.mockReturnValue(service);
  return intakeTextPaymentRouter.createCaller({ req: { headers: { "x-mmd-text-payment": "1", origin: "https://medmethoddirect.com" } } } as any);
}

// Required readiness contract, configurable without inheriting real environment state.
class MockStore implements IntakeTextPaymentStore<RecordType> {
  ready = true;
  records = new Map<string, RecordType>();
  isConfigured() { return this.ready; }
  hashSubmission(id: string) { return createHash("sha256").update(`submission:${id}`).digest("hex"); }
  hashCapability(token: string) { return createHash("sha256").update(`capability:${token}`).digest("hex"); }
  async findCapability(token: string, kind: "payment" | "resume") {
    const hash = this.hashCapability(token);
    return [...this.records].find(([, record]) => (kind === "payment" ? record.paymentTokenHash : record.resumeTokenHash) === hash)?.[0] ?? null;
  }
  async withRecord<T>(key: string, work: (locked: TextPaymentLockedRecord<RecordType>) => Promise<T>): Promise<T> {
    return work({ read: async () => structuredClone(this.records.get(key) ?? null), save: async record => { this.records.set(key, structuredClone(record)); } });
  }
  async candidates() { return []; }
  async cleanup() { return 0; }
}

beforeEach(() => {
  // Test-process-only isolation; never read, edit, generate, or persist actual secrets.
  vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", undefined);
  vi.stubEnv("JWT_SECRET", undefined);
  vi.stubEnv("DATABASE_URL", undefined);
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("Real network is forbidden in readiness tests"); }));
  isolation.createPool.mockImplementation(() => { throw new Error("Pool creation is forbidden in readiness checks"); });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("synchronous secure payment storage configuration readiness", () => {
  it.each([
    ["missing key", undefined], ["empty explicit key", ""], ["weak key", "weak"], ["31-character key", "k".repeat(31)],
  ])("%s fails closed without SQL, hashing, pool creation, or provider calls", async (_label, secret) => {
    const sql = noSqlPool();
    const store = createIntakeTextPaymentStore<RecordType>({ pool: sql.pool, secret });
    const hashSubmission = vi.spyOn(store, "hashSubmission");
    const hashCapability = vi.spyOn(store, "hashCapability");
    const withRecord = vi.spyOn(store, "withRecord");
    const s = setup(store);
    const input = await validatedFixture(); // Genuine draft, consent, and image validation; no external dependencies.
    expect(input.intake?.patient.first_name).toBe("Test");
    expect(store.isConfigured()).toBe(false); // Boolean returned synchronously, not a Promise.
    expect(await s.service.configuration()).toEqual({ configured: false, client_id: null, environment: "sandbox", amount: "29.00", readiness_reason: "payment_storage_unavailable" });
    await expect(s.service.create(input)).rejects.toMatchObject({ code: "storage_unavailable" });
    expect(s.validate).not.toHaveBeenCalled();
    expect(s.config).toHaveBeenCalledTimes(1); // Only the public configuration call; create stops before settings.
    expect(hashSubmission).not.toHaveBeenCalled(); expect(hashCapability).not.toHaveBeenCalled(); expect(withRecord).not.toHaveBeenCalled();
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled();
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
    expect(globalThis.fetch).not.toHaveBeenCalled(); expect(s.finalize).not.toHaveBeenCalled(); expect(s.sendUnpaid).not.toHaveBeenCalled();
  });
  it("strong key without database configuration is unready and create still performs no work", async () => {
    const store = createIntakeTextPaymentStore<RecordType>({ secret: strongSecret });
    const hash = vi.spyOn(store, "hashSubmission");
    const s = setup(store);
    expect(store.isConfigured()).toBe(false);
    expect((await s.service.configuration()).readiness_reason).toBe("payment_storage_unavailable");
    await expect(s.service.create(await validatedFixture())).rejects.toMatchObject({ code: "storage_unavailable" });
    expect(hash).not.toHaveBeenCalled(); expect(s.validate).not.toHaveBeenCalled();
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
  });
  it("a guard pool alone cannot substitute for record database configuration", () => {
    const sql = noSqlPool();
    const store = createIntakeTextPaymentStore<RecordType>({ secret: strongSecret, guardPool: sql.pool });
    expect(store.isConfigured()).toBe(false);
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled();
  });
  it.each([32, 33])("a %i-character key and injected pool are ready without querying it", async length => {
    const sql = noSqlPool();
    const store = createIntakeTextPaymentStore<RecordType>({ secret: "k".repeat(length), pool: sql.pool });
    const hash = vi.spyOn(store, "hashSubmission");
    const s = setup(store);
    expect(store.isConfigured()).toBe(true);
    expect(await s.service.configuration()).toEqual({ configured: true, client_id: "PUBLIC_TEST_CLIENT", environment: "sandbox", amount: "29.00" });
    expect(hash).not.toHaveBeenCalled(); expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled();
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
  });
  it.each([16, 31])("reuses an existing %i-character application secret without an extra key or any readiness derivation/SQL", async length => {
    const sql = noSqlPool();
    const syntheticApplicationSecret = "a".repeat(length);
    vi.stubEnv("JWT_SECRET", syntheticApplicationSecret);
    const derive = vi.spyOn(applicationKey, "deriveIntakePrivateApplicationKey");
    const store = createIntakeTextPaymentStore<RecordType>({ pool: sql.pool });
    const hash = vi.spyOn(store, "hashSubmission");
    const s = setup(store);
    expect(store.isConfigured()).toBe(true);
    expect(store.isConfigured()).toBe(true);
    const result = await caller(s.service).config();
    expect(result).toEqual({ configured: true, client_id: "PUBLIC_TEST_CLIENT", environment: "sandbox", amount: "29.00", currency: "USD" });
    expect(JSON.stringify(result)).not.toContain(syntheticApplicationSecret);
    expect(JSON.stringify(result)).not.toMatch(/PRIVATE_TEST|secret|derived|applicationKey|database/i);
    expect(derive).not.toHaveBeenCalled(); expect(hash).not.toHaveBeenCalled();
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled();
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
    derive.mockRestore();
  });
  it.each([undefined, "", "a".repeat(15)])("missing or below-policy application secret fails closed without readiness SQL", async secret => {
    vi.stubEnv("JWT_SECRET", secret);
    const sql = noSqlPool();
    const store = createIntakeTextPaymentStore<RecordType>({ pool: sql.pool });
    const s = setup(store);
    expect(store.isConfigured()).toBe(false);
    expect((await s.service.configuration()).readiness_reason).toBe("payment_storage_unavailable");
    await expect(s.service.create(await validatedFixture())).rejects.toMatchObject({ code: "storage_unavailable" });
    expect(s.validate).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled();
  });
  it.each(["", "e".repeat(31)])("an explicit weak dedicated payment key never falls back to a valid application secret", explicit => {
    vi.stubEnv("JWT_SECRET", strongSecret);
    const sql = noSqlPool();
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", explicit);
    expect(createIntakeTextPaymentStore<RecordType>({ pool: sql.pool }).isConfigured()).toBe(false);
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", strongSecret);
    expect(createIntakeTextPaymentStore<RecordType>({ pool: sql.pool, secret: explicit }).isConfigured()).toBe(false);
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled();
  });
  it.each([16, 31])("a valid %i-character fallback still needs database configuration without probing it", length => {
    vi.stubEnv("JWT_SECRET", "a".repeat(length));
    const store = createIntakeTextPaymentStore<RecordType>();
    expect(store.isConfigured()).toBe(false);
    vi.stubEnv("DATABASE_URL", "mysql://test:test@database.invalid/synthetic");
    expect(store.isConfigured()).toBe(true);
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
  });
  it("strong key and configured dummy database URI are ready without creating a pool or deriving hashes", () => {
    const store = createIntakeTextPaymentStore<RecordType>({ secret: strongSecret, databaseUrl: "mysql://test:test@database.invalid/synthetic" });
    const hash = vi.spyOn(store, "hashSubmission");
    expect(store.isConfigured()).toBe(true);
    expect(store.isConfigured()).toBe(true);
    expect(hash).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
  });
  it("keeps the existing synthetic JWT fallback and dedicated-key precedence", () => {
    const sql = noSqlPool();
    vi.stubEnv("JWT_SECRET", strongSecret);
    const store = createIntakeTextPaymentStore<RecordType>({ pool: sql.pool });
    expect(store.isConfigured()).toBe(true);
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", "weak-dedicated-key");
    expect(store.isConfigured()).toBe(false); // An explicit weak dedicated secret never silently uses JWT instead.
    vi.stubEnv("TEXT_INTAKE_PAYMENT_STORAGE_SECRET", strongSecret);
    expect(store.isConfigured()).toBe(true);
    expect(createIntakeTextPaymentStore<RecordType>({ pool: sql.pool, secret: "weak-explicit-key" }).isConfigured()).toBe(false);
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled();
  });
  it("reads current database configuration synchronously without a network health probe", () => {
    const store = createIntakeTextPaymentStore<RecordType>({ secret: strongSecret });
    expect(store.isConfigured()).toBe(false);
    vi.stubEnv("DATABASE_URL", "mysql://test:test@database.invalid/synthetic");
    expect(store.isConfigured()).toBe(true);
    vi.stubEnv("DATABASE_URL", "");
    expect(store.isConfigured()).toBe(false);
    expect(isolation.createPool).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

describe("public config and fresh create guard", () => {
  it.each(["live", "sandbox"] as const)("keeps public keys and the selected %s mode while storage is unready", async mode => {
    const sql = noSqlPool();
    const s = setup(createIntakeTextPaymentStore<RecordType>({ secret: "weak", pool: sql.pool }), vi.fn(async () => ({ ...paypalConfig, mode })));
    const result = await caller(s.service).config();
    expect(result).toEqual({ configured: false, client_id: null, environment: mode, amount: "29.00", currency: "USD", readiness_reason: "payment_storage_unavailable" });
    expect(JSON.stringify(result)).not.toMatch(/PRIVATE_TEST|weak|database|oauth|clientSecret/);
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
  });
  it.each(["missing credentials", "lookup failure", "invalid mode"])("ready storage plus %s remains safely unconfigured", async scenario => {
    const sql = noSqlPool();
    const config = vi.fn(async () => {
      if (scenario === "lookup failure") throw new Error("PRIVATE_TEST_SETTINGS_ERROR");
      return scenario === "invalid mode" ? { ...paypalConfig, mode: "INVALID" as "sandbox" }
        : { ...paypalConfig, mode: "live" as const, clientSecret: "" };
    });
    const s = setup(createIntakeTextPaymentStore<RecordType>({ secret: strongSecret, pool: sql.pool }), config);
    const result = await s.service.configuration();
    expect(result).toMatchObject({ configured: false, client_id: null, readiness_reason: "paypal_unavailable", amount: "29.00" });
    expect(result.environment).toBe(scenario === "missing credentials" ? "live" : "sandbox");
    expect(JSON.stringify(result)).not.toMatch(/PRIVATE_TEST|INVALID|clientSecret/);
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
  });
  it("a previously ready page cannot bypass a fresh storage readiness check on create", async () => {
    const store = new MockStore();
    const s = setup(store);
    expect((await s.service.configuration()).configured).toBe(true);
    store.ready = false;
    expect((await s.service.configuration()).readiness_reason).toBe("payment_storage_unavailable");
    await expect(s.service.create(await validatedFixture())).rejects.toMatchObject({ code: "storage_unavailable" });
    expect(store.records.size).toBe(0); expect(s.validate).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled();
  });
  it("a ready mock store preserves create/capture and mode mismatch stops before another provider call", async () => {
    const store = new MockStore();
    let mode: "sandbox" | "live" = "sandbox";
    const s = setup(store, vi.fn(async () => ({ ...paypalConfig, mode })));
    let order: any;
    s.provider.mockImplementation(async (url, init) => {
      if (String(url).endsWith("/v1/oauth2/token")) return new Response(JSON.stringify({ access_token: "TEST_OAUTH" }));
      if (String(url).endsWith("/v2/checkout/orders")) {
        const body = JSON.parse(String(init?.body));
        order = { id: "TEST_ORDER", intent: "CAPTURE", status: "APPROVED", purchase_units: body.purchase_units };
      } else if (String(url).endsWith("/capture")) {
        order.status = "COMPLETED";
        order.purchase_units[0].payments = { captures: [{ id: "TEST_CAPTURE", status: "COMPLETED",
          amount: { value: "29.00", currency_code: "USD" }, create_time: "2026-11-18T16:35:00.000Z" }] };
      }
      return new Response(JSON.stringify(order));
    });
    const created = await s.service.create(await validatedFixture());
    expect(s.provider).toHaveBeenCalledTimes(2);
    mode = "live";
    await expect(caller(s.service).capture({ order_id: created.order_id, payment_token: created.payment_token })).rejects.toMatchObject({ code: "BAD_REQUEST", message: "The payment mode changed. Please refresh checkout or contact the Care Team; do not make another payment." });
    expect(s.provider).toHaveBeenCalledTimes(2);
    expect([...store.records.values()][0].captureAttemptAt).toBeUndefined();
    mode = "sandbox";
    // No sandbox delivery sink: a mock verified capture remains paid-awaiting-delivery.
    expect((await s.service.capture(created)).payment_status).toBe("PAID_AWAITING_DELIVERY");
    expect(s.provider).toHaveBeenCalledTimes(5);
    expect(s.finalize).not.toHaveBeenCalled(); expect(s.sendUnpaid).not.toHaveBeenCalled(); expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

describe("router safe failure classification", () => {
  const configMessage = "Payment checkout is not configured. Please contact the Care Team; do not make another payment.";
  const confirmationMessage = "Payment confirmation is unavailable. Please retry or contact the Care Team; do not make another payment.";
  it("actual missing storage reports a configuration error instead of a card decline", async () => {
    const sql = noSqlPool();
    const s = setup(createIntakeTextPaymentStore<RecordType>({ secret: "weak", pool: sql.pool }));
    await expect(caller(s.service).order(await validatedFixture())).rejects.toMatchObject({ code: "BAD_REQUEST", message: configMessage });
    expect(sql.execute).not.toHaveBeenCalled(); expect(sql.getConnection).not.toHaveBeenCalled(); expect(s.provider).not.toHaveBeenCalled(); expect(s.validate).not.toHaveBeenCalled();
  });
  it.each([
    [new IntakeTextPaymentStoreError(), configMessage],
    [new IntakeTextPaymentError("not_configured"), configMessage],
    [new IntakeTextPaymentError("mode_mismatch"), "The payment mode changed. Please refresh checkout or contact the Care Team; do not make another payment."],
    [new IntakeTextPaymentError("provider_unavailable"), "Your payment didn't go through. Please try again or use a different card."],
    [new IntakeTextPaymentError("invalid_token"), confirmationMessage],
    [new IntakeTextPaymentError("payment_binding_rejected"), confirmationMessage],
    [new IntakeTextPaymentStoreError("storage_corrupt"), confirmationMessage],
    [new IntakeTextPaymentStoreError("storage_conflict"), confirmationMessage],
    [new Error("PRIVATE_TEST_INTERNAL_SECRET_SQL_PROVIDER_BODY"), confirmationMessage],
  ])("returns only the whitelist message for %s", async (error, message) => {
    // Inject errors; no orders, storage operations, settings lookups, or provider requests.
    const service = { create: vi.fn(async () => { throw error; }) } as unknown as TextIntakePaymentService;
    await expect(caller(service).order({})).rejects.toMatchObject({ code: "BAD_REQUEST", message });
    expect(globalThis.fetch).not.toHaveBeenCalled(); expect(isolation.createPool).not.toHaveBeenCalled();
  });
});
