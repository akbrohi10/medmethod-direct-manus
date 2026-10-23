import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createHmac } from "node:crypto";
import type { Express, Request, Response } from "express";
import { INTAKE_SMS_OPT_IN_TEXT, VIDEO_VISIT_AMOUNT, VIDEO_VISIT_DESCRIPTION, validateIntakeDraft } from "./intakeSubmissionContract";

const mocks = vi.hoisted(() => ({ settings: vi.fn(), deliverySettings: vi.fn(), attestation: vi.fn(), getPhoneSettings: vi.fn() }));
vi.mock("./db", () => ({ getPaypalSettings: mocks.settings, getIntakeDeliverySettings: mocks.deliverySettings }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes: () => {}, validPhoneVerificationToken: mocks.attestation, getPhoneVerificationSettings: mocks.getPhoneSettings }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-test-signing-key", keragonWebhookUrl: "https://relay.example.test/intake", intakeFamilyCouponCode: "family" } }));
import { registerIntakePaymentRoutes } from "./intakePaymentRoutes";

// Deliberately fake contact details; every outbound request is mocked below.
export function syntheticDraft(id = "873ef4af-190d-45cb-9d51-42c627f5376a") {
  return {
    event: "mmd_intake.submitted", schema_version: "1.0", submission_id: id,
    submitted_at: "2026-10-21T19:00:00.000Z", is_test: false, route: "weight_care",
    patient: { first_name: "Integration", last_name: "TEST ONLY", dob: "1985-01-15", state: "GA", state_name: "Georgia", email: "integration-test@example.com", phone: "(202) 555-0101", sex: "female" },
    answers: { w: { w04: "compounded_semaglutide", treatment_interest: "Compounded Semaglutide — $129", ft: "5", inch: "8", lb: "180", wConsent: true, wDecline: false } },
    consents: { terms_accepted: true, final_submission_acknowledged: true, sms_opt_in: false, sms_opt_in_at: null, sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, contact_preference: "phone_portal", glp1_consent: true, glp1_declined: false, glp1_consent_at: "2026-10-21T19:00:00.000Z", glp1_consent_version: "2026-10" },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "SYNTHETIC TEST ONLY — no patient, no charge.\nTreatment: Compounded Semaglutide — $129\nSMS opt-in: No",
    intake_summary_html: "<b>SYNTHETIC TEST ONLY — no patient, no charge.</b><br><b>Treatment:</b> Compounded Semaglutide — $129<br><b>SMS opt-in:</b> No",
  };
}
type Handler = (req: Request, res: Response) => unknown;
function harness() {
  const routes = new Map<string, Handler>();
  const app = {
    post: (path: string, handler: Handler) => routes.set(`POST ${path}`, handler),
    get: (path: string, handler: Handler) => routes.set(`GET ${path}`, handler),
  } as unknown as Express;
  registerIntakePaymentRoutes(app);
  return async (method: "POST" | "GET", path: string, body: unknown = {}, params: Record<string, string> = {}, query = {}) => {
    const response = { code: 200, body: undefined as any, status(code: number) { this.code = code; return this; }, json(data: unknown) { this.body = data; return this; }, setHeader() {} };
    await routes.get(`${method} ${path}`)!({ body, params, query } as Request, response as unknown as Response);
    return response;
  };
}
const orderId = "MOCK-NO-CHARGE-ORDER";
function completed(id: string, overrides: any = {}) {
  return { id: orderId, status: "COMPLETED", purchase_units: [{ custom_id: id, description: VIDEO_VISIT_DESCRIPTION, amount: { value: VIDEO_VISIT_AMOUNT, currency_code: "USD" }, payments: { captures: [{ id: "MOCK-NO-CHARGE-CAPTURE", status: "COMPLETED", custom_id: id, amount: { value: VIDEO_VISIT_AMOUNT, currency_code: "USD" }, create_time: "2026-10-21T19:01:00.000Z", ...overrides }] } }] };
}
function provider(draft: ReturnType<typeof syntheticDraft>, options: { relayFailOnce?: boolean; orderFail?: boolean; completedAlready?: boolean; captureOverrides?: any } = {}) {
  const events: string[] = [], payloads: any[] = [], bodies: any[] = [];
  let relayAttempts = 0;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit = {}) => {
    if (url === "https://relay.example.test/intake") {
      events.push("relay"); payloads.push(JSON.parse(String(init.body))); relayAttempts++;
      return Response.json({}, { status: options.relayFailOnce && relayAttempts === 1 ? 503 : 200 });
    }
    if (url.endsWith("/v1/oauth2/token")) { events.push("auth"); return Response.json({ access_token: "mock-token" }); }
    if (url.endsWith("/v2/checkout/orders")) {
      events.push("create"); bodies.push(JSON.parse(String(init.body)));
      return options.orderFail ? Response.json({}, { status: 500 }) : Response.json({ id: orderId, links: [{ rel: "approve", href: "https://paypal.example.test/approve" }] });
    }
    if (url.endsWith("/capture")) { events.push("capture"); return Response.json(completed(draft.submission_id, options.captureOverrides)); }
    if (url.endsWith(orderId)) {
      events.push("get");
      return Response.json(options.completedAlready ? completed(draft.submission_id, options.captureOverrides) : { id: orderId, status: "APPROVED", purchase_units: [{ custom_id: draft.submission_id, description: VIDEO_VISIT_DESCRIPTION, amount: { value: VIDEO_VISIT_AMOUNT, currency_code: "USD" } }] });
    }
    throw new Error(`Unexpected network request in isolated test: ${url}`);
  }));
  return { events, payloads, bodies };
}
async function submitFree(request: ReturnType<typeof harness>, draft = syntheticDraft(), options: Record<string, unknown> = {}) {
  return request("POST", "/api/intake/submit", { intake: draft, phone_verification_token: "valid-phone-token", video_visit_interest: true, ...options });
}
function expire(token: string) {
  const [encoded] = token.split(".");
  const body = { ...JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")), expires_at: Date.now() - 1 };
  const next = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${next}.${createHmac("sha256", "synthetic-test-signing-key").update(next).digest("base64url")}`;
}

beforeEach(() => {
  mocks.settings.mockResolvedValue({ activeProvider: "paypal", mode: "sandbox", sandboxClientId: "mock-id", sandboxClientSecret: "mock-secret" });
  mocks.deliverySettings.mockResolvedValue(null);
  mocks.getPhoneSettings.mockReturnValue({ mode: "sandbox", required: true, demo_available: true });
  mocks.attestation.mockImplementation((token, phone) => token === "valid-phone-token" && /202.*555.*0101/.test(phone) ? { verifiedAt: "2026-10-21T18:59:00.000Z", mode: "sandbox" } : null);
});
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("free intake receipt and optional video visit handoff", () => {
  it("delivers a verified free intake without reading PayPal configuration or requesting PayPal", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const result = await submitFree(request, draft);
    expect(result.code).toBe(201);
    expect(result.body).toMatchObject({ submission_id: draft.submission_id, sms_opt_in: false, video_visit_interest: true, is_test: false, payment_status: "NOT_REQUIRED", redirect_url: "/thank-you-video" });
    expect(result.body.submission_token).toBeTypeOf("string");
    expect(network.events).toEqual(["relay"]);
    expect(mocks.settings).not.toHaveBeenCalled();
    const payload = network.payloads[0];
    expect(payload.event).toBe("mmd_intake.free_submitted"); expect(payload.schema_version).toBe("1.1");
    expect(payload.patient.phone_verified).toBe(true); expect(payload.patient.phone_verified_at).toBe("2026-10-21T18:59:00.000Z");
    expect(payload.answers.w.treatment_interest).toBe("Compounded Semaglutide");
    expect(payload.payment).toEqual({ provider: "none", status: "not_required", amount: "0.00", currency: "USD" });
    expect(payload.care).toEqual({ intake: "free", payment_required: false, amount: "0.00", currency: "USD" });
    expect(JSON.stringify(result.body.submission_token)).not.toContain("integration-test@example.com");
    expect(mocks.attestation).toHaveBeenCalledWith("valid-phone-token", draft.patient.phone);
  });

  it("selects only the two receipt-derived destinations and ignores body or query redirect injection", async () => {
    const videoDraft = syntheticDraft(), videoNetwork = provider(videoDraft), videoRequest = harness();
    const video = await videoRequest(
      "POST", "/api/intake/submit",
      { intake: videoDraft, phone_verification_token: "valid-phone-token", video_visit_interest: true, redirect_url: "https://attacker.example.test" },
      {}, { redirect_url: "javascript:alert(1)" },
    );
    expect(video.code).toBe(201); expect(video.body.redirect_url).toBe("/thank-you-video");
    expect(videoNetwork.events).toEqual(["relay"]);

    const freeDraft = syntheticDraft("73cb857e-d80d-453c-8106-420cbe2b3b45"), freeNetwork = provider(freeDraft), freeRequest = harness();
    const free = await freeRequest(
      "POST", "/api/intake/submit",
      { intake: freeDraft, phone_verification_token: "valid-phone-token", video_visit_interest: false, redirect_url: "//attacker.example.test" },
      {}, { redirect_url: "/thank-you-video" },
    );
    expect(free.code).toBe(201); expect(free.body.redirect_url).toBe("/intake/thank-you/");
    expect(freeNetwork.events).toEqual(["relay"]);
  });

  it("keeps the delivered receipt destination for same-intake retries and rejects opposite interest", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const accepted = await submitFree(request, draft);
    const retry = await request(
      "POST", "/api/intake/submit",
      { intake: draft, phone_verification_token: "valid-phone-token", video_visit_interest: true, redirect_url: "/intake/thank-you/" },
      {}, { redirect_url: "https://attacker.example.test" },
    );
    expect(retry.code).toBe(201); expect(retry.body).toEqual(accepted.body);
    expect(retry.body.redirect_url).toBe("/thank-you-video");

    const opposite = await request("POST", "/api/intake/submit", { intake: draft, phone_verification_token: "valid-phone-token", video_visit_interest: false });
    expect(opposite.code).toBe(422); expect(opposite.body.error).toMatch(/already used with different intake information/i);
    expect(network.events).toEqual(["relay"]);
  });

  it("does not consume verification on a rejected delivery and only mints a receipt once delivery accepts", async () => {
    const draft = syntheticDraft(), network = provider(draft, { relayFailOnce: true }), request = harness();
    const failed = await submitFree(request, draft);
    expect(failed.code).toBe(422); expect(failed.body.submission_token).toBeUndefined();
    const accepted = await submitFree(request, draft);
    expect(accepted.code).toBe(201); expect(network.events).toEqual(["relay", "relay"]);
  });

  it("does not let one verified phone token finalize two different free intakes after acceptance", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    expect((await submitFree(request, draft)).code).toBe(201);
    const second = syntheticDraft("73cb857e-d80d-453c-8106-420cbe2b3b45");
    const reused = await submitFree(request, second);
    expect(reused.code).toBe(422); expect(network.events).toEqual(["relay"]);
  });

  it("rejects unverified or forged demo free submissions and never treats client is_test as a production demo", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    expect((await request("POST", "/api/intake/submit", { intake: draft, phone_verification_token: "forged", video_visit_interest: false })).code).toBe(422);
    mocks.getPhoneSettings.mockReturnValue({ mode: "live", required: true, demo_available: false });
    expect((await request("POST", "/api/intake/submit", { intake: { ...draft, is_test: true }, demo_mode: true, video_visit_interest: false })).code).toBe(422);
    mocks.getPhoneSettings.mockReturnValue({ mode: "sandbox", required: true, demo_available: true });
    const real = await submitFree(request, { ...draft, is_test: true });
    expect(real.code).toBe(201); expect(real.body.is_test).toBe(false);
    expect(network.events).toEqual(["relay"]);
  });

  it("allows demo bypass only for an advertised sandbox demo and marks that free receipt synthetic", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const demo = await request("POST", "/api/intake/submit", { intake: draft, demo_mode: true, video_visit_interest: true });
    expect(demo.code).toBe(201); expect(demo.body.is_test).toBe(true);
    expect(network.payloads[0].is_test).toBe(true); expect(network.payloads[0].patient.phone_verified).toBe(false);
    mocks.getPhoneSettings.mockReturnValue({ mode: "live", required: true, demo_available: false });
    const forged = await request("POST", "/api/paypal/orders", { submission_token: demo.body.submission_token, payment_method: "card", demo_mode: true });
    expect(forged.code).toBe(422); expect(network.events).toEqual(["relay"]);
  });

  it("requires an accepted free-intake receipt, and rejects tampered or expired receipts before PayPal", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    for (const token of ["forgedforgedforged.receipt", expire((await submitFree(request, draft)).body.submission_token)]) {
      const result = await request("POST", "/api/paypal/orders", { submission_token: token, payment_method: "card" });
      expect(result.code).toBe(422);
    }
    expect(network.events).toEqual(["relay"]);
  });

  it("creates a $39 optional video visit only from a receipt and sends a separate clinical-data-free paid event", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const free = await submitFree(request, draft);
    const created = await request("POST", "/api/paypal/orders", { submission_token: free.body.submission_token, payment_method: "card" });
    expect(created.code).toBe(201); expect(created.body).toMatchObject({ order_id: orderId, environment: "sandbox", payment_method: "card" });
    const unit = network.bodies[0].purchase_units[0];
    expect(unit).toEqual(expect.objectContaining({ custom_id: draft.submission_id, amount: { currency_code: "USD", value: VIDEO_VISIT_AMOUNT }, description: VIDEO_VISIT_DESCRIPTION }));
    const finished = await request("POST", "/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(finished.code).toBe(200); expect(finished.body).toEqual({ submission_id: draft.submission_id, payment_status: "COMPLETED", capture_id: "MOCK-NO-CHARGE-CAPTURE", environment: "sandbox" });
    const paid = network.payloads.at(-1);
    expect(paid.event).toBe("mmd_intake.video_visit_paid"); expect(paid.schema_version).toBe("1.1");
    expect(paid.related_submission_id).toBe(draft.submission_id); expect(paid.submission_id).not.toBe(draft.submission_id);
    expect(paid.payment).toMatchObject({ amount: VIDEO_VISIT_AMOUNT, currency: "USD", order_id: orderId });
    expect(JSON.stringify(paid)).not.toMatch(/patient|answers|consents|integration-test@example\.com|TEST ONLY/i);
  });

  it("checks provider amount, currency, custom identity, status and capture identity before emitting a paid event", async () => {
    const draft = syntheticDraft(), network = provider(draft, { captureOverrides: { amount: { value: "0.01", currency_code: "USD" } } }), request = harness();
    const free = await submitFree(request, draft);
    const created = await request("POST", "/api/paypal/orders", { submission_token: free.body.submission_token, payment_method: "apple_pay" });
    const result = await request("POST", "/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(result.code).toBe(400); expect(network.payloads).toHaveLength(1); // only the previously accepted free intake
    expect(network.events).toContain("capture");
  });

  it.each([
    { value: "49.00", currency_code: "USD" },
    { value: "39.99", currency_code: "USD" },
    { value: "39.00", currency_code: "CAD" },
  ])("rejects a video capture that is not exactly 39.00 USD: %j", async (amount) => {
    const draft = syntheticDraft(), network = provider(draft, { captureOverrides: { amount } }), request = harness();
    const free = await submitFree(request, draft);
    expect(free.body.redirect_url).toBe("/thank-you-video");
    const created = await request("POST", "/api/paypal/orders", { submission_token: free.body.submission_token, payment_method: "card" });
    const finished = await request("POST", "/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(finished.code).toBe(400);
    expect(network.payloads.filter(payload => payload.event === "mmd_intake.video_visit_paid")).toHaveLength(0);
  });

  it("does not undo free completion when optional PayPal order creation fails, and exposes only safe refresh status", async () => {
    const draft = syntheticDraft(), network = provider(draft, { orderFail: true }), request = harness();
    const free = await submitFree(request, draft);
    const failed = await request("POST", "/api/paypal/orders", { submission_token: free.body.submission_token, payment_method: "card" });
    expect(failed.code).toBe(422);
    const status = await request("POST", "/api/intake/video/status", { submission_token: free.body.submission_token });
    expect(status.body).toEqual({ status: "available" });
    expect(network.payloads).toHaveLength(1); expect(network.payloads[0].event).toBe("mmd_intake.free_submitted");
  });

  it("deduplicates concurrent same-id free delivery, video order, capture, and post-capture delivery retries", async () => {
    const draft = syntheticDraft(), network = provider(draft, { relayFailOnce: false }), request = harness();
    const [first, second] = await Promise.all([submitFree(request, draft), submitFree(request, draft)]);
    expect(first.body).toEqual(second.body); expect(network.events.filter(e => e === "relay")).toHaveLength(1);
    expect(first.body.redirect_url).toBe("/thank-you-video");
    const body = { submission_token: first.body.submission_token, payment_method: "card" as const };
    const [one, two] = await Promise.all([request("POST", "/api/paypal/orders", body), request("POST", "/api/paypal/orders", body)]);
    expect(one.body).toEqual(two.body); expect(network.events.filter(e => e === "create")).toHaveLength(1);
    const capture: ["POST", string, unknown, Record<string, string>] = ["POST", "/api/paypal/orders/:orderId/capture", { approval_token: one.body.approval_token }, { orderId }];
    await Promise.all([request(...capture), request(...capture)]); await request(...capture);
    expect(network.events.filter(e => e === "capture")).toHaveLength(1);
    expect(network.payloads.filter(payload => payload.event === "mmd_intake.video_visit_paid")).toHaveLength(1);
  });

  it("uses the existing family validator only to waive optional video service, never the free intake", async () => {
    const draft = syntheticDraft(), network = provider(draft), request = harness();
    const free = await submitFree(request, draft);
    const [first, second] = await Promise.all([
      request("POST", "/api/intake/coupon/submit", { submission_token: free.body.submission_token, coupon_code: "family" }),
      request("POST", "/api/intake/coupon/submit", { submission_token: free.body.submission_token, coupon_code: "family" }),
    ]);
    expect(first.code).toBe(201); expect(second.body).toEqual(first.body); expect(first.body).toEqual({ submission_id: draft.submission_id, payment_status: "WAIVED", amount: "0.00" });
    expect(network.events).toEqual(["relay", "relay"]); expect(mocks.settings).not.toHaveBeenCalled();
    const waived = network.payloads[1];
    expect(waived.event).toBe("mmd_intake.video_visit_waived"); expect(waived.related_submission_id).toBe(draft.submission_id);
    expect(waived.payment).toMatchObject({ provider: "none", status: "waived", amount: "0.00", original_amount: VIDEO_VISIT_AMOUNT });
    expect(JSON.stringify(waived)).not.toMatch(/patient|answers|consents|capture_id/i);
    const status = await request("POST", "/api/intake/video/status", { submission_token: free.body.submission_token });
    expect(status.body).toEqual({ status: "waived", completion: first.body });
  });

  it("retains existing strict draft validation and does not accept card data", () => {
    const draft = syntheticDraft();
    expect(() => validateIntakeDraft({ ...draft, route: "hormone_therapy" })).toThrow();
    expect(() => validateIntakeDraft({ ...draft, consents: { ...draft.consents, sms_opt_in: true } })).toThrow();
    expect(() => validateIntakeDraft({ ...draft, answers: { w: { ...draft.answers.w, card_number: "NOT-A-REAL-CARD" } } })).toThrow();
  });
});
