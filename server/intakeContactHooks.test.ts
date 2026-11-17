import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import type { Express, Request, Response as ExpressResponse } from "express";
import { INTAKE_CARE_SMS_CONSENT_VERSION, INTAKE_SMS_OPT_IN_TEXT, EMPTY_INTAKE_UPLOADS } from "./intakeSubmissionContract";
import { syntheticIntakeSigning } from "./fixtures/intakeSigningFixture";

const mocks = vi.hoisted(() => ({ save: vi.fn(), recovered: vi.fn(), mark: vi.fn(), fetch: vi.fn(), paypal: vi.fn(), kick: vi.fn() }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-contact-hook-secret", keragonWebhookUrl: "https://relay.example.test/intake", intakeFamilyCouponCode: "family" } }));
vi.mock("./db", () => ({ getPaypalSettings: mocks.paypal, getIntakeDeliverySettings: async () => null }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes: () => {}, validPhoneVerificationToken: () => null, getPhoneVerificationSettings: () => ({ mode: "sandbox", demo_available: true }) }));
vi.mock("./intakePrivateUploads", () => ({ registerIntakePrivateUploadRoutes: () => {}, resolveIntakeUploads: async () => EMPTY_INTAKE_UPLOADS }));
vi.mock("./intakeSigningInput", () => ({ validateIntakeSigning: async (signing: unknown) => ({ signing, signaturePng: Buffer.from("synthetic signature") }) }));
vi.mock("./intakeSignedPdf", () => ({ generateIntakeSignedPdfs: async () => [] }));
vi.mock("./intakeSignedFormsStore", () => ({ registerIntakeSignedFormsRoutes: () => {}, getIntakeSignedFormsStore: () => ({
  readSubmission: mocks.recovered, prepare: async () => ({}), markAttempted: async () => {}, markDelivered: mocks.mark,
}) }));
vi.mock("./ghlIntakeWebhookQueue", () => ({ registerGhlIntakeWebhookRoutes: () => {}, enqueueGhlIntakeWebhook: () => {} }));
vi.mock("./intakeContactService", () => ({ getIntakeContactService: () => ({ saveAccepted: mocks.save, kick: mocks.kick }), IntakeContactError: class extends Error {} }));
import { registerIntakePaymentRoutes } from "./intakePaymentRoutes";

const ID = "2ae23242-345c-4f63-b017-456789abcd12";
function draft() {
  const timestamp = new Date().toISOString();
  return { event: "mmd_intake.submitted", schema_version: "1.0", submission_id: ID, submitted_at: timestamp,
    is_test: false, route: "weight_care", patient: { first_name: "Synthetic", last_name: "TEST ONLY", dob: "1985-01-15",
      state: "GA", state_name: "Georgia", email: "synthetic@example.test", phone: "(202) 555-0101", sex: "female",
      address_line1: "", address_line2: "", city: "", zip: "" },
    answers: { w: { w04: "compounded_semaglutide", wConsent: true, wDecline: false, wAddressSkipped: true } },
    consents: { terms_accepted: true, final_submission_acknowledged: true, sms_opt_in: true, sms_opt_in_at: timestamp,
      sms_consent: true, sms_consent_at: timestamp, sms_consent_version: INTAKE_CARE_SMS_CONSENT_VERSION,
      sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, contact_preference: "sms", glp1_consent: true, glp1_declined: false,
      glp1_consent_at: timestamp, glp1_consent_version: "2026-10" },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "Synthetic test only", intake_summary_html: "<b>Synthetic test only</b>" };
}
function harness() {
  const routes = new Map<string, any>();
  registerIntakePaymentRoutes({ post: (path: string, handler: any) => routes.set(path, handler), get: () => {} } as unknown as Express);
  return async (intake: ReturnType<typeof draft>) => {
    const res = { code: 200, body: undefined as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(body: any) { this.body = body; return this; } };
    await routes.get("/api/intake/submit")({ body: { intake, signing: syntheticIntakeSigning(), video_visit_interest: false }, headers: {}, query: {} } as Request, res as unknown as ExpressResponse);
    return res;
  };
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.recovered.mockResolvedValue(null); mocks.save.mockResolvedValue(undefined);
  mocks.fetch.mockResolvedValue(new Response(null, { status: 200 })); vi.stubGlobal("fetch", mocks.fetch);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("minimal accepted-contact hooks do not change intake/payment behavior", () => {
  it("projects four contact fields after Keragon acceptance and keeps the browser receipt contact-free", async () => {
    const intake = draft(), submit = harness(), result = await submit(intake);
    expect(result.code).toBe(201);
    expect(mocks.save).toHaveBeenCalledTimes(1);
    expect(mocks.save.mock.calls[0][1]).toEqual({ first_name: "Synthetic", last_name: "TEST ONLY", email: "synthetic@example.test", phone: "(202) 555-0101" });
    expect(mocks.fetch.mock.invocationCallOrder[0]).toBeLessThan(mocks.save.mock.invocationCallOrder[0]);
    expect(mocks.mark.mock.invocationCallOrder[0]).toBeLessThan(mocks.save.mock.invocationCallOrder[0]);
    const signed = JSON.parse(Buffer.from(result.body.submission_token.split(".")[0], "base64url").toString());
    expect(JSON.stringify([signed, result.body])).not.toMatch(/phone|email|dob|first_name|last_name|answers/);
    expect(mocks.paypal).not.toHaveBeenCalled();
    expect((await submit(intake)).code).toBe(201);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
  });
  it("does not create an authenticated contact snapshot for rejected clinical delivery", async () => {
    mocks.fetch.mockResolvedValue(new Response(null, { status: 503 }));
    expect((await harness()(draft())).code).toBe(422);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.paypal).not.toHaveBeenCalled();
  });
  it("keeps accepted success truthful on contact-store outage and does not trigger a second intake or payment", async () => {
    mocks.save.mockRejectedValue(new Error("synthetic secret PHI failure"));
    const intake = draft(), submit = harness();
    expect((await submit(intake)).code).toBe(201);
    expect((await submit(intake)).code).toBe(201);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    expect(mocks.paypal).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("[IntakeContact] snapshot_unavailable; accepted intake unaffected.");
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("synthetic secret");
  });
});
