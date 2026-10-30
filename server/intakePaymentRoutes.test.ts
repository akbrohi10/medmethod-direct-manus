import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

it("prepares the signed-form ledger and receipt before any free clinical handoff is delivered", () => {
  const routes = readFileSync(resolve(import.meta.dirname, "intakePaymentRoutes.ts"), "utf8");
  const freeStart = routes.indexOf("async function submitFreeIntake");
  const freeEnd = routes.indexOf("function modeForVideoReceipt", freeStart);
  const free = routes.slice(freeStart, freeEnd);
  expect(free.indexOf("const preparedReceiptToken = encodeSubmissionToken(receipt);")).toBeGreaterThan(0);
  expect(free).toContain("const { signing, signaturePng } = await validateIntakeSigning(input.signing, draft);");
  expect(free).toContain("const pdfs = await generateIntakeSignedPdfs({");
  expect(free).toContain("forms = await store.prepare(request, draft.submission_id, hash, pdfs");
  expect(free.indexOf("const preparedReceiptToken = encodeSubmissionToken(receipt);")).toBeLessThan(free.indexOf("await deliverIntake(pending.deliveryPayload, async () =>"));
  expect(free).toContain("await deliverIntake(pending.deliveryPayload, async () => {\n        await store.markAttempted(draft.submission_id);");
  expect(free).toContain("pending.token = preparedReceiptToken");
});

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const routes = read("server/intakePaymentRoutes.ts");
const contract = read("server/intakeSubmissionContract.ts");
const crypto = read("server/intakeCredentialCrypto.ts");
const env = read("server/_core/env.ts");
const signingInput = read("server/intakeSigningInput.ts");
const signedPdf = read("server/intakeSignedPdf.ts");
const signedStore = read("server/intakeSignedFormsStore.ts");
const testAuthorization = read("server/intakeTestAuthorization.ts");

// Source assertions complement mocked route tests in intakePaidFinalization.test.ts.
// No Keragon, PayPal, Spruce, or patient-data traffic is performed here.
describe("intake free-first delivery and optional video payment boundary", () => {
  it("keeps the Keragon endpoint server-only, secret-first and encrypted when using its admin fallback", () => {
    expect(crypto).toContain('"aes-256-gcm"');
    expect(crypto).toContain("decryptIntakeCredential");
    expect(env).toContain('keragonWebhookUrl: process.env.KERAGON_WEBHOOK_URL ?? ""');
    expect(routes).toContain("let endpoint = ENV.keragonWebhookUrl.trim();");
    expect(routes).toContain("if (settings?.keragonWebhookUrlEncrypted)");
    expect(routes).toContain("endpoint = decryptIntakeCredential(settings.keragonWebhookUrlEncrypted);");
    expect(routes).toContain('headers: { "Content-Type": "application/json", Accept: "application/json", ...(payload.event === "mmd_intake.free_submitted" ? { "Idempotency-Key": `mmd-free-intake-${payload.submission_id}` } : {}) }');
  });

  it("has an explicit signed free-intake endpoint and releases its limited receipt only after clinical delivery accepts", () => {
    expect(routes).toContain('app.post("/api/intake/submit"');
    expect(routes).toContain("finalizeFreeIntake(draft, phone");
    expect(routes).toContain("await deliverIntake(pending.deliveryPayload, async () =>");
    expect(routes.indexOf("await deliverIntake(pending.deliveryPayload, async () =>")).toBeLessThan(routes.indexOf("pending.token = preparedReceiptToken;"));
    expect(routes).toContain('purpose: "completed_free_intake"');
    expect(routes).toContain("sms_opt_in: boolean");
    expect(routes).toContain("video_visit_interest: boolean");
    expect(routes).toContain("delete pending.deliveryPayload;");
    expect(contract).toContain('event: "mmd_intake.free_submitted"');
    expect(contract).toContain('provider: "none", status: "not_required", amount: "0.00"');
    expect(contract).not.toContain("paid_submitted");
  });

  it("requires a complete server-validated signing envelope, normalizes GLP-1 consent to the signing time, and transports only signed-form capabilities", () => {
    expect(routes).toContain("signing: z.unknown().optional()");
    expect(routes).toContain("await validateIntakeSigning(input.signing, draft)");
    expect(routes).toContain("glp1_consent_at: signing.signed_at");
    expect(routes).toContain("glp1_consent_version: signing.version");
    expect(routes).toContain("await generateIntakeSignedPdfs({");
    expect(routes).toContain("...forms,");
    expect(routes).not.toContain("signature_png: signaturePng");
    expect(signingInput).toContain('version: z.literal("2026-10")');
    expect(signingInput).toContain("signature_png: z.string()");
    expect(signingInput).toContain("document_checks: z.object({ glp1: z.literal(true), general: z.literal(true), telehealth: z.literal(true), privacy: z.literal(true), policy: z.literal(true) }).strict()");
    expect(signedPdf).toContain("generateIntakeSignedPdfs");
    expect(signedPdf).toContain("canonicalForms");
  });

  it("enforces a server-attested phone verification and never lets HMAC normal-test classification bypass it", () => {
    expect(routes).toContain("validPhoneVerificationToken(token, draft.patient.phone)");
    expect(routes).toContain("const pendingPhoneTokens = new Map");
    expect(routes).toContain("const consumedPhoneTokens = new Map");
    expect(routes.indexOf("await store.markAttempted(draft.submission_id);")).toBeLessThan(routes.indexOf("consumedPhoneTokens.set(pending.phoneTokenKey, pending.expiresAt)"));
    expect(routes).toContain("fingerprint({ token: input.phone_verification_token })");
    expect(routes).toContain("settings.mode === \"sandbox\" && settings.demo_available === true");
    expect(routes).toContain("authorizedNormalIntakeTest(request, draft.submission_id, draft.is_test === true)");
    expect(routes.indexOf("authorizedNormalIntakeTest(request, draft.submission_id, draft.is_test === true)")).toBeLessThan(routes.indexOf("const phone = phoneAttestation(draft, input.phone_verification_token, demo);"));
    expect(testAuthorization).toContain('req.headers?.["x-mmd-intake-test"]');
    expect(testAuthorization).toContain("mmd-normal-intake-test-v1");
  });

  it("persists the private signed-form claim immediately before the relay attempt and fails closed rather than retrying an ambiguous delivery", () => {
    expect(routes).toContain("registerIntakeSignedFormsRoutes(app)");
    expect(routes).toContain("const saved = await store.readSubmission(draft.submission_id);");
    expect(routes).toContain('if (saved?.state === "attempted") throw new Error("Your intake delivery is awaiting confirmation. Please contact the Care Team; do not submit a new intake.")');
    expect(routes).toContain("await store.markAttempted(draft.submission_id);");
    expect(routes).toContain("await store.markDelivered(draft.submission_id, result);");
    expect(routes.indexOf("await claimBeforeSend?.();")).toBeLessThan(routes.indexOf("const controller = new AbortController();"));
    expect(signedStore).toContain("async markAttempted(submissionId: string)");
    expect(signedStore).toContain('if (ledger.state !== "prepared") throw storeError(409, "The signed-form submission was already claimed for delivery.")');
    expect(signedStore).toContain("async markDelivered(submissionId: string, result: Record<string, unknown>)");
  });

  it("requires a delivered signed receipt for the optional video checkout and uses fixed server-side $97 identity", () => {
    expect(routes).toContain('app.post("/api/paypal/orders"');
    expect(routes).toContain("submission_token: z.string()");
    expect(routes).toContain("const receipt = videoReceiptFor(parsed.data.submission_token);");
    expect(routes).toContain("return receiptFor(value);");
    expect(routes).toContain("VIDEO_VISIT_AMOUNT");
    expect(contract).toContain('VIDEO_VISIT_AMOUNT = "97.00"');
    expect(contract).toContain('VIDEO_VISIT_DESCRIPTION = "optional one-time medical-weight-loss Zoom video visit"');
    expect(routes).toContain("description: VIDEO_VISIT_DESCRIPTION");
    expect(routes).toContain('amount: { currency_code: "USD", value: VIDEO_VISIT_AMOUNT }');
    expect(routes).toContain("unit?.custom_id !== approval.submission_id");
    expect(routes).toContain("capture.amount?.value !== VIDEO_VISIT_AMOUNT");
    expect(routes).toContain('capture.amount.currency_code !== "USD"');
  });

  it("keeps the retired $39 value only in an explicit historical completed-payment recovery that never initiates a capture", () => {
    expect(contract).toContain('LEGACY_VIDEO_VISIT_AMOUNT = "39.00"');
    expect(routes).toContain("version: z.literal(2)");
    expect(routes).toContain("finalizeLegacyVideoVisitPaidRecovery");
    expect(routes).toContain("if (approval.version === 2)");
    expect(routes).toContain("raw.status !== \"COMPLETED\"");
    expect(routes).toContain("cannot be captured at the retired price. No charge will be made. Please contact the Care Team");
  });

  it("keeps client-token's existing public response shape and payment configuration source", () => {
    expect(routes).toContain('app.get("/api/paypal/client-token"');
    expect(routes).toContain("const settings = await getPaypalSettings();");
    expect(routes).toContain("res.json({ client_id: clientId, environment: mode })");
    expect(routes).toContain('settings?.mode === "live" ? "live" : "sandbox"');
  });

  it("creates a separately identifiable video event with no questionnaire or patient payload", () => {
    expect(contract).toContain('event: "mmd_intake.video_visit_paid"');
    expect(contract).toContain('event: "mmd_intake.video_visit_waived"');
    expect(contract).toContain("related_submission_id: receipt.submission_id");
    expect(contract).toContain("event_id: eventId");
    const paidStart = contract.indexOf("export function finalizeVideoVisitPaid");
    const waivedStart = contract.indexOf("export function finalizeVideoVisitWaived");
    const videoEvents = contract.slice(paidStart, waivedStart + 1200);
    expect(videoEvents).not.toContain("...draft");
    expect(videoEvents).not.toContain("patient:");
    expect(videoEvents).not.toContain("answers:");
    expect(videoEvents).not.toContain("consents:");
  });

  it("exposes safe video refresh status and uses the existing family code only for a distinct video waiver", () => {
    expect(routes).toContain('app.post("/api/intake/video/status"');
    expect(routes).toContain('return res.json({ status: "available" })');
    expect(routes).toContain('return res.json({ status: "pending"');
    expect(routes).toContain('return res.json({ status: "paid", completion: record.completion })');
    expect(routes).toContain('return res.json({ status: "waived", completion: record.waiver })');
    expect(routes).toContain('app.post("/api/intake/coupon/submit"');
    expect(routes).toContain("finalizeVideoVisitWaived(receipt, pending.eventId)");
    expect(contract).toContain('original_amount: VIDEO_VISIT_AMOUNT');
    expect(contract).toContain('coupon_type: "family"');
  });

  it("documents local bounded retry dedupe and does not persist intake data through the database", () => {
    expect(routes).toContain("Process-local, bounded handoff state");
    expect(routes).toContain("a restart loses receipts");
    expect(routes).toContain("const freeSubmissions = new Map");
    expect(routes).toContain("const videoVisits = new Map");
    expect(routes).toContain("PayPal-Request-Id");
    expect(routes).not.toContain("db.insert(");
    expect(routes).not.toContain("createPayment(");
  });
});
