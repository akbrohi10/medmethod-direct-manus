import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope";
import { resolve } from "node:path";
import { inverseApprovedFinalProgressLabel } from "./intakeFinalProgressLabelScope.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import type { Express, Request, Response } from "express";
import { INTAKE_SMS_OPT_IN_TEXT, EMPTY_INTAKE_UPLOADS } from "./intakeSubmissionContract";
import { syntheticIntakeSigning, syntheticSignedFormsPreparation, syntheticSignedPdfs, SYNTHETIC_SIGNATURE_PNG } from "./fixtures/intakeSigningFixture";
import { inverseApprovedLatePatientInfo, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";
import { introDetailsPhotoRegistrationPath } from "./intakeIntroDetailsPhotoScope.test";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths } from "./intakeThankYouWordingScope.test";

const m = vi.hoisted(() => ({ enqueue: vi.fn(), read: vi.fn(), prepare: vi.fn(), delivered: vi.fn(), phone: vi.fn() }));
vi.mock("./db", () => ({ getPaypalSettings: vi.fn(), getIntakeDeliverySettings: vi.fn() }));
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-ghl-integration-test-secret", keragonWebhookUrl: "https://keragon.example.test/relay", ghlIntakeWebhookUrl: "https://ghl.example.test/inbound", intakeFamilyCouponCode: "" } }));
vi.mock("./ghlIntakeWebhookQueue", () => ({ enqueueGhlIntakeWebhook: m.enqueue, registerGhlIntakeWebhookRoutes() {} }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes() {}, validPhoneVerificationToken: m.phone, getPhoneVerificationSettings: () => ({ mode: "sandbox", required: true, demo_available: true }) }));
vi.mock("./intakePrivateUploads", () => ({ registerIntakePrivateUploadRoutes() {}, resolveIntakeUploads: async () => EMPTY_INTAKE_UPLOADS }));
vi.mock("./intakeSignedFormsStore", () => ({ registerIntakeSignedFormsRoutes() {}, getIntakeSignedFormsStore: () => ({ readSubmission: m.read, prepare: m.prepare, markAttempted: async () => {}, markDelivered: m.delivered }) }));
vi.mock("./intakeSigningInput", () => ({ validateIntakeSigning: async (signing: unknown) => ({ signing, signaturePng: Buffer.from(SYNTHETIC_SIGNATURE_PNG.split(",")[1], "base64") }) }));
vi.mock("./intakeSignedPdf", () => ({ generateIntakeSignedPdfs: async () => syntheticSignedPdfs() }));
import { registerIntakePaymentRoutes, FRIENDLY_INTAKE_SUBMIT_ERROR } from "./intakePaymentRoutes";

function body() {
  const time = new Date().toISOString();
  return {
    intake: {
      event: "mmd_intake.submitted", schema_version: "1.0", submission_id: "ecacde22-60af-453b-96e6-deb0fbac2888", submitted_at: time, is_test: true, route: "weight_care",
      patient: { first_name: "SYNTHETIC", last_name: "GHLTEST", dob: "1980-01-15", state: "GA", state_name: "Georgia", email: "ghl-test@example.invalid", phone: "2025550188", sex: "female", address_line1: "123 SYNTHETIC Street", address_line2: "", city: "Atlanta", zip: "30303" },
      answers: { w: { w04: "compounded_semaglutide", w30: "no" } },
      consents: { terms_accepted: true, final_submission_acknowledged: true, sms_opt_in: false, sms_opt_in_at: null, sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, contact_preference: "phone_portal", glp1_consent: true, glp1_declined: false, glp1_consent_at: time, glp1_consent_version: "2026-10" },
      meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true }, intake_summary: "SYNTHETIC ONLY", intake_summary_html: "SYNTHETIC ONLY",
    }, signing: syntheticIntakeSigning(), phone_verification_token: "synthetic-phone", video_visit_interest: false, demo_mode: true,
  };
}
function harness() {
  const routes = new Map<string, (req: Request, res: Response) => unknown>();
  registerIntakePaymentRoutes({ get() {}, post(path: string, handler: any) { routes.set(path, handler); } } as unknown as Express);
  return async (input: unknown) => {
    const res = { code: 0, body: undefined as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(data: unknown) { this.body = data; return this; } };
    await routes.get("/api/intake/submit")!({ body: input, headers: { referer: "https://www.medmethoddirect.com/intake/?utm_source=test" }, query: {} } as unknown as Request, res as unknown as Response);
    return res;
  };
}
beforeEach(() => {
  Object.values(m).forEach(mock => mock.mockReset());
  m.read.mockResolvedValue(null); m.prepare.mockResolvedValue(syntheticSignedFormsPreparation()); m.delivered.mockResolvedValue(undefined);
  m.phone.mockReturnValue({ verifiedAt: new Date().toISOString(), mode: "sandbox" });
  vi.stubGlobal("fetch", vi.fn(async () => new globalThis.Response(null, { status: 204 })));
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("GHL notification is isolated from Keragon and patient submission", () => {
  it("keeps the existing Keragon delivery function byte-identical", async () => {
    const { readFileSync } = await import("node:fs");
    const { execFileSync } = await import("node:child_process");
    const current = readFileSync("server/intakePaymentRoutes.ts", "utf8");
    const baseline = execFileSync("git", ["show", "ed9524e1:server/intakePaymentRoutes.ts"], { encoding: "utf8" });
    const deliveryFunction = (source: string) => source.slice(source.indexOf("async function deliverIntake("), source.indexOf("function errorMessage("));
    expect(deliveryFunction(current)).toBe(deliveryFunction(baseline));
  });
  it("changes no frontend or existing backend behavior outside the exact notification hooks and secret", async () => {
    const { readFileSync } = await import("node:fs");
    const { execFileSync } = await import("node:child_process");
    const old = (path: string) => execFileSync("git", ["show", `ed9524e1:${path}`], { encoding: "utf8" });
    const route = readFileSync("server/intakePaymentRoutes.ts", "utf8");
    const inverse = route
      .replace('import { buildGhlIntakeWebhookPayload } from "./ghlIntakeWebhookPayload";\n', "")
      .replace('import { enqueueGhlIntakeWebhook, registerGhlIntakeWebhookRoutes } from "./ghlIntakeWebhookQueue";\n', "")
      .replace(/\/\*\* Never await GHL or expose notification errors to the patient\. \*\/[\s\S]*?(?=type PayPalMode)/, "")
      .replace("  registerGhlIntakeWebhookRoutes(app);\n", "")
      .replace("        // Recovery may repair an interrupted enqueue; the durable GHL event key prevents re-sending.\n        notifyGhlAfterAcceptedIntake(draft, receipt, request);\n", "")
      .replace("      notifyGhlAfterAcceptedIntake(draft, receipt, request);\n", "");
    expect(inverse).toBe(old("server/intakePaymentRoutes.ts"));
    expect(readFileSync("server/_core/env.ts", "utf8").replace('  /** Contact/status-only notification after the website Weight Care intake succeeds. */\n  ghlIntakeWebhookUrl: process.env.GHL_INTAKE_WEBHOOK_URL ?? "",\n', "")).toBe(old("server/_core/env.ts"));
    expect(inverseApprovedLatePatientInfo(introDetailsPhotoRegistrationPath, readFileSync(introDetailsPhotoRegistrationPath, "utf8"))).toBe(old(introDetailsPhotoRegistrationPath));
    const front = execFileSync("git", ["diff", "--name-only", "ed9524e1", "--", "client", "shared", "package.json", "pnpm-lock.yaml"], { encoding: "utf8" });
    expect(front.trim().split("\n").filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "package.json", "server/routers.ts"].includes(p); } return true; }).filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String("ed9524e1") + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `ed9524e1:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, readFileSync(path, "utf8")) !== old(path))
      .filter(path => ![introducedContinueGuidanceAssetPath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath].includes(path))
      .filter(path => inverseApprovedLatePatientInfo(path, readFileSync(path, "utf8")) !== old(path))).toEqual([]);
  });
  it("enqueues after Keragon accepts, sends contact/status only and does not enqueue on refresh", async () => {
    const order: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async () => { order.push("keragon-success"); expect(m.enqueue).not.toHaveBeenCalled(); return new globalThis.Response(null, { status: 204 }); }));
    m.enqueue.mockImplementation(() => { order.push("ghl-enqueued"); });
    const input = body(), submit = harness();
    const first = await submit(input), retry = await submit(input);
    expect(first.code).toBe(201); expect(retry.body).toEqual(first.body);
    expect(order).toEqual(["keragon-success", "ghl-enqueued"]); expect(m.enqueue).toHaveBeenCalledTimes(1);
    const [id, payload] = m.enqueue.mock.calls[0];
    expect(id).toBe(input.intake.submission_id);
    expect(payload).toMatchObject({ event: "intake_submitted", phone: "+12025550188", source: "website_intake", is_test: true, visit_type: "free_text_visit", utm_source: "test", sms_opt_in: false });
    expect(payload).not.toHaveProperty("answers"); expect(payload).not.toHaveProperty("signed_forms"); expect(payload).not.toHaveProperty("patient");
  });
  it("preserves the existing test-safe demo destination and classifies a checked visit as video_visit", async () => {
    const input = body(); input.video_visit_interest = true;
    const res = await harness()(input);
    expect(res.code).toBe(201); expect(res.body.redirect_url).toBe("/intake/thank-you/");
    expect(m.enqueue.mock.calls[0][1]).toMatchObject({ visit_type: "video_visit", is_test: true });
  });
  it("never enqueues if Keragon rejects", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new globalThis.Response(null, { status: 503 })));
    const res = await harness()(body());
    expect(res.body).toEqual({ error: FRIENDLY_INTAKE_SUBMIT_ERROR }); expect(m.enqueue).not.toHaveBeenCalled();
  });
  it("a hanging GHL notification cannot delay successful submission", async () => {
    m.enqueue.mockImplementation(() => new Promise(() => {}));
    const result = await Promise.race([harness()(body()), new Promise<null>(resolve => setTimeout(() => resolve(null), 200))]);
    expect(result?.code).toBe(201);
  });
  it("a synchronous notification failure cannot turn Keragon acceptance into an error or leak details", async () => {
    m.enqueue.mockImplementation(() => { throw new Error("SECRET_WEBHOOK PRIVATE_PATIENT"); });
    const res = await harness()(body());
    expect(res.code).toBe(201); expect(JSON.stringify(res.body)).not.toMatch(/SECRET|PRIVATE|GHL/);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(/SECRET_WEBHOOK|PRIVATE_PATIENT/);
  });
  it("recovered Keragon receipt can repair interrupted enqueue using the same durable event key", async () => {
    const submit = harness(), input = body();
    const initial = await submit(input);
    const { createHash } = await import("node:crypto");
    const { validateIntakeDraft } = await import("./intakeSubmissionContract");
    const draft = validateIntakeDraft(input.intake), signing = input.signing;
    draft.consents = { ...draft.consents, glp1_consent: true, glp1_declined: false, glp1_consent_at: signing.signed_at, glp1_consent_version: signing.version };
    const fingerprint = createHash("sha256").update(JSON.stringify({ draft, signing, video_visit_interest: false, is_test: true, demo: true })).digest("hex");
    m.read.mockResolvedValue({ state: "delivered", result: initial.body, fingerprint });
    vi.mocked(fetch).mockClear(); m.enqueue.mockClear();
    const recovered = await harness()(input);
    expect(recovered.code).toBe(201); expect(fetch).not.toHaveBeenCalled(); expect(m.enqueue).toHaveBeenCalledTimes(1);
  });
});
