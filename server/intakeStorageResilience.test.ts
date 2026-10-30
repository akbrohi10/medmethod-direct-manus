import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import type { Express, Request, Response } from "express";
import { INTAKE_SMS_OPT_IN_TEXT, EMPTY_INTAKE_UPLOADS } from "./intakeSubmissionContract";
import { syntheticIntakeSigning, syntheticSignedFormsPreparation, syntheticSignedPdfs, SYNTHETIC_SIGNATURE_PNG } from "./fixtures/intakeSigningFixture";

const m = vi.hoisted(() => ({
  factory: vi.fn(), read: vi.fn(), prepare: vi.fn(), claim: vi.fn(), delivered: vi.fn(),
  uploads: vi.fn(), signing: vi.fn(), pdfs: vi.fn(), phone: vi.fn(),
}));
vi.mock("./db", () => ({ getPaypalSettings: vi.fn(), getIntakeDeliverySettings: vi.fn() }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-storage-resilience-test", keragonWebhookUrl: "https://synthetic.example.test/relay", intakeFamilyCouponCode: "" } }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes() {}, validPhoneVerificationToken: m.phone, getPhoneVerificationSettings: () => ({ mode: "sandbox", required: true, demo_available: true }) }));
vi.mock("./intakePrivateUploads", () => ({ registerIntakePrivateUploadRoutes() {}, resolveIntakeUploads: m.uploads }));
vi.mock("./intakeSignedFormsStore", () => ({ registerIntakeSignedFormsRoutes() {}, getIntakeSignedFormsStore: m.factory }));
vi.mock("./intakeSigningInput", () => ({ validateIntakeSigning: m.signing }));
vi.mock("./intakeSignedPdf", () => ({ generateIntakeSignedPdfs: m.pdfs }));
import { registerIntakePaymentRoutes, FRIENDLY_INTAKE_SUBMIT_ERROR } from "./intakePaymentRoutes";

function body() {
  const time = new Date().toISOString();
  return {
    intake: {
      event: "mmd_intake.submitted", schema_version: "1.0", submission_id: "ae51f697-3c61-4797-8aa8-204e116f6b65", submitted_at: time, is_test: false, route: "weight_care",
      patient: { first_name: "SYNTHETIC", last_name: "STORAGE TEST", dob: "1980-01-15", state: "GA", state_name: "Georgia", email: "storage-test@example.invalid", phone: "2025550101", sex: "female", address_line1: "123 SYNTHETIC Street", address_line2: "", city: "Atlanta", zip: "30303" },
      answers: { w: { w04: "compounded_semaglutide", w30: "yes" } },
      consents: { terms_accepted: true, final_submission_acknowledged: true, sms_opt_in: false, sms_opt_in_at: null, sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, contact_preference: "phone_portal", glp1_consent: true, glp1_declined: false, glp1_consent_at: time, glp1_consent_version: "2026-10" },
      meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true },
      intake_summary: "SYNTHETIC ONLY", intake_summary_html: "SYNTHETIC ONLY", upload_refs: { lab_results: ["L".repeat(43)], scale_photo: "S".repeat(43) },
    },
    signing: syntheticIntakeSigning(), phone_verification_token: "synthetic-phone-token", video_visit_interest: false,
  };
}
function harness() {
  const routes = new Map<string, (req: Request, res: Response) => unknown>();
  registerIntakePaymentRoutes({ get() {}, post(path: string, handler: (req: Request, res: Response) => unknown) { routes.set(path, handler); } } as unknown as Express);
  return async (input: unknown) => {
    const res = { code: 0, body: undefined as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(data: unknown) { this.body = data; return this; } };
    await routes.get("/api/intake/submit")!({ body: input, headers: {}, query: {} } as Request, res as unknown as Response);
    return res;
  };
}
const sensitiveError = () => new Error("PRIVATE PATIENT DATA /api/intake/signed-forms/NEVER_LOG_THIS_TOKEN SQL password=NOT_REAL");
let payloads: any[];
let consoleError: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  Object.values(m).forEach(mock => mock.mockReset());
  m.factory.mockImplementation(() => ({ readSubmission: m.read, prepare: m.prepare, markAttempted: m.claim, markDelivered: m.delivered }));
  m.read.mockResolvedValue(null); m.prepare.mockResolvedValue(syntheticSignedFormsPreparation());
  m.claim.mockResolvedValue(undefined); m.delivered.mockResolvedValue(undefined);
  m.uploads.mockResolvedValue({ ...EMPTY_INTAKE_UPLOADS, lab_results: [] });
  m.signing.mockImplementation(async signing => ({ signing, signaturePng: Buffer.from(SYNTHETIC_SIGNATURE_PNG.split(",")[1], "base64") }));
  m.pdfs.mockResolvedValue(syntheticSignedPdfs());
  m.phone.mockReturnValue({ verifiedAt: new Date().toISOString(), mode: "sandbox" });
  payloads = [];
  vi.stubGlobal("fetch", vi.fn(async (_url, init) => { payloads.push(JSON.parse(init.body)); return new globalThis.Response(null, { status: 204 }); }));
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("file storage never blocks a valid intake", () => {
  it.each(["constructor", "recover", "prepare", "claim", "pdf-generation"])("submits with empty PDF links when %s fails, without leaking technical detail", async stage => {
    if (stage === "constructor") m.factory.mockImplementation(() => { throw sensitiveError(); });
    if (stage === "recover") m.read.mockRejectedValue(sensitiveError());
    if (stage === "prepare") m.prepare.mockRejectedValue(sensitiveError());
    if (stage === "claim") m.claim.mockRejectedValue(sensitiveError());
    if (stage === "pdf-generation") m.pdfs.mockRejectedValue(sensitiveError());
    const request = harness(), input = body();
    const first = await request(input);
    expect(first.code).toBe(201);
    expect(first.body).toMatchObject({ payment_status: "NOT_REQUIRED", redirect_url: "/intake/thank-you/" });
    const retry = await request(input);
    expect(retry.body).toEqual(first.body); expect(payloads).toHaveLength(1);
    expect(payloads[0]).toMatchObject({ signed_forms: [], glp1_consent_url: "", general_consent_url: "", telehealth_consent_url: "", privacy_notice_ack_url: "", medication_policy_url: "", glp1_consent: true });
    expect(JSON.stringify(consoleError.mock.calls)).not.toMatch(/PRIVATE PATIENT|NEVER_LOG|password|SQL/);
    expect(JSON.stringify(first.body)).not.toMatch(/storage|configured|SQL|password|signature_png/);
  });
  it("retains normal confirmation when recording the successful delivery receipt fails", async () => {
    m.delivered.mockRejectedValue(sensitiveError());
    const request = harness(), input = body();
    const first = await request(input); const retry = await request(input);
    expect(first.code).toBe(201); expect(retry.body).toEqual(first.body); expect(payloads).toHaveLength(1);
    expect(payloads[0].signed_forms).toHaveLength(5);
  });
  it("drops inaccessible uploads, never invents URLs, and still sends the signed intake", async () => {
    m.uploads.mockRejectedValue(sensitiveError());
    const res = await harness()(body());
    expect(res.code).toBe(201);
    expect(payloads[0]).toMatchObject({ lab_results: [], lab_results_provided: false, scale_photo_provided: false, scale_photo_url: null, lab_result_1_url: null, lab_result_5_url: null });
    expect(payloads[0].signed_forms).toHaveLength(5);
    expect(payloads[0].intake_summary).toContain("Lab results uploaded: No");
  });
  it("handles a complete file-store outage without blocking or exposing errors", async () => {
    m.uploads.mockRejectedValue(sensitiveError()); m.read.mockRejectedValue(sensitiveError());
    const res = await harness()(body());
    expect(res.code).toBe(201); expect(payloads).toHaveLength(1);
    expect(payloads[0]).toMatchObject({ signed_forms: [], glp1_consent_url: "", lab_results: [], scale_photo_url: null });
  });
  it("does not treat a concurrent delivery claim as a storage outage", async () => {
    m.claim.mockRejectedValue(Object.assign(new Error("already claimed"), { status: 409 }));
    const res = await harness()(body());
    expect(res.code).toBe(422); expect(res.body.error).toBe(FRIENDLY_INTAKE_SUBMIT_ERROR); expect(payloads).toHaveLength(0);
  });
  it.each(["phone", "signature", "webhook", "schema"])("keeps %s failure safe and shows only the friendly submit error", async failure => {
    if (failure === "phone") m.phone.mockReturnValue(null);
    if (failure === "signature") m.signing.mockRejectedValue(sensitiveError());
    if (failure === "webhook") vi.stubGlobal("fetch", vi.fn(async () => { throw sensitiveError(); }));
    const res = await harness()(failure === "schema" ? {} : body());
    expect([400, 422]).toContain(res.code);
    expect(res.body).toEqual({ error: FRIENDLY_INTAKE_SUBMIT_ERROR });
    expect(JSON.stringify(consoleError.mock.calls)).not.toMatch(/PRIVATE PATIENT|NEVER_LOG|password|SQL/);
  });
});
