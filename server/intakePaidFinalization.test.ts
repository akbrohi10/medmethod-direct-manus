import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import type { Express, Request, Response } from "express";
import { INTAKE_SMS_OPT_IN_TEXT } from "./intakeSubmissionContract";

const mocks = vi.hoisted(() => ({ settings: vi.fn(), deliverySettings: vi.fn(), attestation: vi.fn(), getPhoneSettings: vi.fn() }));
vi.mock("./db", () => ({ getPaypalSettings: mocks.settings, getIntakeDeliverySettings: mocks.deliverySettings }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes: () => {}, validPhoneVerificationToken: mocks.attestation, getPhoneVerificationSettings: mocks.getPhoneSettings }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-test-signing-key", keragonWebhookUrl: "https://relay.example.test/intake", intakeFamilyCouponCode: "family" } }));
import { registerIntakePaymentRoutes } from "./intakePaymentRoutes";
import { validateIntakeDraft } from "./intakeSubmissionContract";

type Handler = (req: Request, res: Response) => unknown;
export function syntheticDraft(id = "873ef4af-190d-45cb-9d51-42c627f5376a") {
  return {
    event: "mmd_intake.submitted", schema_version: "1.0", submission_id: id,
    submitted_at: "2026-10-21T19:00:00.000Z", is_test: true, route: "weight_care",
    patient: { first_name: "Integration", last_name: "TEST ONLY", dob: "1985-01-15", state: "GA", state_name: "Georgia", email: "integration-test@example.com", phone: "(202) 555-0101", sex: "female" },
    answers: { w: { w04: "compounded_semaglutide", treatment_interest: "Compounded Semaglutide — $129", ft: "5", inch: "8", lb: "180", wConsent: true, wDecline: false } },
    consents: { terms_accepted: true, final_submission_acknowledged: true, sms_opt_in: false, sms_opt_in_at: null, sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, contact_preference: "phone_portal", glp1_consent: true, glp1_declined: false, glp1_consent_at: "2026-10-21T19:00:00.000Z", glp1_consent_version: "2026-10" },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "SYNTHETIC INTEGRATION TEST — no patient, no charge.\nTreatment: Compounded Semaglutide — $129\nSMS opt-in: No",
    intake_summary_html: "<b>SYNTHETIC INTEGRATION TEST — no patient, no charge.</b><br><b>Treatment:</b> Compounded Semaglutide — $129<br><b>SMS opt-in:</b> No",
  };
}
function harness() {
  const routes = new Map<string, Handler>();
  const app = { post: (path: string, handler: Handler) => routes.set(`POST ${path}`, handler), get: (path: string, handler: Handler) => routes.set(`GET ${path}`, handler) } as unknown as Express;
  registerIntakePaymentRoutes(app);
  return async (path: string, body: unknown = {}, params: Record<string, string> = {}, query = {}) => {
    const response = { code: 200, body: undefined as any, status(code: number) { this.code = code; return this; }, json(data: unknown) { this.body = data; return this; }, setHeader() {} };
    await routes.get(`POST ${path}`)!({ body, params, query } as Request, response as unknown as Response);
    return response;
  };
}
const orderId = "MOCK-NO-CHARGE-ORDER";
function completed(id: string, overrides: any = {}) {
  return { id: orderId, status: "COMPLETED", purchase_units: [{ custom_id: id, payments: { captures: [{ id: "MOCK-NO-CHARGE-CAPTURE", status: "COMPLETED", amount: { value: "49.00", currency_code: "USD" }, create_time: "2026-10-21T19:01:00.000Z", ...overrides }] } }] };
}
function provider(draft: ReturnType<typeof syntheticDraft>, options: { relayFailOnce?: boolean; completedAlready?: boolean; captureOverrides?: any } = {}) {
  const events: string[] = [], payloads: any[] = [], bodies: any[] = [];
  let relayAttempts = 0;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit = {}) => {
    if (url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "mock-token" });
    if (url === "https://relay.example.test/intake") {
      events.push("relay"); payloads.push(JSON.parse(String(init.body))); relayAttempts++;
      return Response.json({}, { status: options.relayFailOnce && relayAttempts === 1 ? 503 : 200 });
    }
    if (url.endsWith("/v2/checkout/orders")) {
      events.push("create"); bodies.push(JSON.parse(String(init.body))); return Response.json({ id: orderId });
    }
    if (url.endsWith("/capture")) { events.push("capture"); return Response.json(completed(draft.submission_id, options.captureOverrides)); }
    if (url.endsWith(orderId)) { events.push("get"); return Response.json(options.completedAlready ? completed(draft.submission_id, options.captureOverrides) : { id: orderId, status: "APPROVED", purchase_units: [{ custom_id: draft.submission_id, amount: { value: "49.00", currency_code: "USD" } }] }); }
    throw new Error("Unexpected network request in isolated test.");
  }));
  return { events, payloads, bodies };
}
beforeEach(() => {
  mocks.settings.mockResolvedValue({ activeProvider: "paypal", mode: "sandbox", sandboxClientId: "mock-id", sandboxClientSecret: "mock-secret" });
  mocks.deliverySettings.mockResolvedValue(null);
  mocks.getPhoneSettings.mockReturnValue({ mode: "sandbox", required: true, demo_available: true });
  mocks.attestation.mockImplementation((token, phone) => token === "valid-phone-token" && /202.*555.*0101/.test(phone) ? { verifiedAt: "2026-10-21T18:59:00.000Z", mode: "sandbox" } : null);
});
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
describe("local intake paid/waived handoff finalization", () => {
  it("sends no webhook on order creation, then sends exact paid schema only after verified capture", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const created = await request("/api/paypal/orders", { intake: draft, phone_verification_token: "valid-phone-token" });
    expect(created.code).toBe(201); expect(network.events).toEqual(["create"]);
    expect(network.bodies[0].purchase_units[0].custom_id).toBe(draft.submission_id);
    const finished = await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(finished.code).toBe(200); expect(network.events).toEqual(["create", "get", "capture", "relay"]);
    const payload = network.payloads[0];
    expect(payload.event).toBe("mmd_intake.paid_submitted"); expect(payload.schema_version).toBe("1.1");
    expect(payload.patient.phone_verified).toBe(true); expect(payload.patient.phone_verified_at).toBe("2026-10-21T18:59:00.000Z");
    expect(payload.answers.w.treatment_interest).toBe("Compounded Semaglutide"); expect(payload.intake_summary).toContain("$129");
    expect(payload.consents.sms_opt_in).toBe(false); expect(payload.consents.sms_opt_in_at).toBeNull(); expect(payload.consents.sms_opt_in_text).toBe(INTAKE_SMS_OPT_IN_TEXT); expect(payload.consents.contact_preference).toBe("phone_portal");
    expect(payload.payment).toEqual({ provider: "paypal", environment: "sandbox", status: "COMPLETED", order_id: orderId, capture_id: "MOCK-NO-CHARGE-CAPTURE", amount: "49.00", currency: "USD", captured_at: "2026-10-21T19:01:00.000Z" });
    expect(payload.checkout_preview).toEqual({ payment_processed: true, card_fields_omitted: true });
    expect(JSON.stringify(payload)).not.toContain("valid-phone-token");
  });
  it("deduplicates simultaneous order and capture retries and replay after completion", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const body = { intake: draft, phone_verification_token: "valid-phone-token" };
    const [first, second] = await Promise.all([request("/api/paypal/orders", body), request("/api/paypal/orders", body)]);
    expect(first.body).toEqual(second.body);
    const args: [string, unknown, Record<string,string>] = ["/api/paypal/orders/:orderId/capture", { approval_token: first.body.approval_token }, { orderId }];
    await Promise.all([request(...args), request(...args)]); await request(...args);
    expect(network.events.filter(e => e === "create")).toHaveLength(1); expect(network.events.filter(e => e === "capture")).toHaveLength(1); expect(network.payloads).toHaveLength(1);
  });
  it("retries only failed relay with byte-identical payload and never charges again", async () => {
    const draft = syntheticDraft(), network = provider(draft, { relayFailOnce: true }), request = harness();
    const created = await request("/api/paypal/orders", { intake: draft, phone_verification_token: "valid-phone-token" });
    const args: [string, unknown, Record<string,string>] = ["/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId }];
    expect((await request(...args)).code).toBe(400); expect((await request(...args)).code).toBe(200);
    expect(network.events.filter(e => e === "capture")).toHaveLength(1); expect(network.payloads[0]).toEqual(network.payloads[1]);
  });
  it.each([{ value: "0.01", currency_code: "USD" }, { value: "49.00", currency_code: "EUR" }])("rejects mismatched capture amount/currency before relay: %j", async amount => {
    const draft = syntheticDraft(), network = provider(draft, { captureOverrides: { amount } }), request = harness();
    const created = await request("/api/paypal/orders", { intake: draft, phone_verification_token: "valid-phone-token" });
    expect((await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId })).code).toBe(400);
    expect(network.payloads).toHaveLength(0);
  });
  it("uses authenticated GET recovery for an already completed payment without recapture", async () => {
    const draft = syntheticDraft(), network = provider(draft, { completedAlready: true }), request = harness();
    const created = await request("/api/paypal/orders", { intake: draft, phone_verification_token: "valid-phone-token" });
    expect((await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId })).code).toBe(200);
    expect(network.events).not.toContain("capture"); expect(network.payloads).toHaveLength(1);
  });
  it("does not accept client-asserted phone verification without a valid phone-bound token", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const result = await request("/api/paypal/orders", { intake: { ...draft, patient: { ...draft.patient, phone_verified: true } }, phone_verification_token: "forged-token" });
    expect(result.code).toBe(422); expect(network.events).toEqual([]);
  });
  it("keeps demo bypass exclusively in Sandbox and records false verification", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    mocks.settings.mockResolvedValue({ activeProvider: "paypal", mode: "live", sandboxClientId: "mock-id", sandboxClientSecret: "mock-secret" });
    const created = await request("/api/paypal/orders", { intake: draft, demo_mode: true });
    expect(created.body.environment).toBe("sandbox");
    await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(network.payloads[0].patient.phone_verified).toBe(false); expect(network.payloads[0].is_test).toBe(true);
  });
  it("waives family only once, without PayPal and without misrepresenting capture", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const body = { intake: draft, coupon_code: "family", phone_verification_token: "valid-phone-token" };
    const [first, second] = await Promise.all([request("/api/intake/coupon/submit", body), request("/api/intake/coupon/submit", body)]); await request("/api/intake/coupon/submit", body);
    expect(first.code).toBe(201); expect(second.code).toBe(201); expect(network.events).toEqual(["relay"]); expect(mocks.settings).not.toHaveBeenCalled();
    expect(network.payloads[0].event).toBe("mmd_intake.waived_submitted"); expect(network.payloads[0].payment.status).toBe("waived"); expect(network.payloads[0].payment.amount).toBe("0.00"); expect(network.payloads[0].payment.capture_id).toBeUndefined();
  });
  it("never bypasses live phone verification for a family waiver using a demo flag", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    mocks.getPhoneSettings.mockReturnValue({ mode: "live", required: true, demo_available: false });
    const result = await request("/api/intake/coupon/submit", { intake: draft, coupon_code: "family", demo_mode: true });
    expect(result.code).toBe(422); expect(network.events).toEqual([]);
  });
  it("allows only a sandbox demo waiver and marks it as an unverified synthetic test", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const result = await request("/api/intake/coupon/submit", { intake: { ...draft, is_test: false }, coupon_code: "family", demo_mode: true });
    expect(result.code).toBe(201); expect(network.payloads[0].is_test).toBe(true);
    expect(network.payloads[0].patient.phone_verified).toBe(false); expect(network.payloads[0].payment.status).toBe("waived");
  });
  it("rejects checkout-token tampering and changed intake reuse", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const created = await request("/api/paypal/orders", { intake: draft, phone_verification_token: "valid-phone-token" });
    expect((await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token + "x" }, { orderId })).code).toBe(400);
    expect((await request("/api/paypal/orders", { intake: { ...draft, patient: { ...draft.patient, first_name: "Changed" } }, phone_verification_token: "valid-phone-token" })).code).toBe(422);
    expect(network.payloads).toHaveLength(0);
  });
  it("rejects mismatched SMS consent, unknown route and card data in the draft", () => {
    const draft = syntheticDraft();
    expect(() => validateIntakeDraft({ ...draft, route: "hormone_therapy" })).toThrow();
    expect(() => validateIntakeDraft({ ...draft, consents: { ...draft.consents, sms_opt_in: true } })).toThrow();
    expect(() => validateIntakeDraft({ ...draft, answers: { w: { ...draft.answers.w, card_number: "NOT-A-REAL-CARD" } } })).toThrow();
  });
});
