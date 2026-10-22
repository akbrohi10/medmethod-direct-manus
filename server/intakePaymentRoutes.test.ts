import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

it("prepares a usable signed receipt before any free clinical handoff is delivered", () => {
  const routes = readFileSync(resolve(import.meta.dirname, "intakePaymentRoutes.ts"), "utf8");
  const freeStart = routes.indexOf("async function submitFreeIntake");
  const freeEnd = routes.indexOf("function modeForVideoReceipt", freeStart);
  const free = routes.slice(freeStart, freeEnd);
  expect(free.indexOf("const preparedReceiptToken = encodeSubmissionToken(receipt);")).toBeGreaterThan(0);
  expect(free.indexOf("const preparedReceiptToken = encodeSubmissionToken(receipt);")).toBeLessThan(free.indexOf("await deliverIntake(pending.deliveryPayload)"));
  expect(free).toContain("pending.token = preparedReceiptToken");
});

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const routes = read("server/intakePaymentRoutes.ts");
const contract = read("server/intakeSubmissionContract.ts");
const crypto = read("server/intakeCredentialCrypto.ts");
const env = read("server/_core/env.ts");

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
    expect(routes).toContain('headers: { "Content-Type": "application/json", Accept: "application/json" }');
  });

  it("has an explicit free completed-intake endpoint and releases its limited signed receipt only after clinical delivery accepts", () => {
    expect(routes).toContain('app.post("/api/intake/submit"');
    expect(routes).toContain("finalizeFreeIntake(draft, phone");
    expect(routes).toContain("await deliverIntake(pending.deliveryPayload);");
    expect(routes.indexOf("await deliverIntake(pending.deliveryPayload);")).toBeLessThan(routes.indexOf("pending.token = preparedReceiptToken;"));
    expect(routes).toContain('purpose: "completed_free_intake"');
    expect(routes).toContain("sms_opt_in: boolean");
    expect(routes).toContain("video_visit_interest: boolean");
    expect(routes).toContain("delete pending.deliveryPayload;");
    expect(contract).toContain('event: "mmd_intake.free_submitted"');
    expect(contract).toContain('provider: "none", status: "not_required", amount: "0.00"');
    expect(contract).not.toContain("paid_submitted");
  });

  it("enforces a server-attested phone verification and retires its local one-way key only after accepted free delivery", () => {
    expect(routes).toContain("validPhoneVerificationToken(token, draft.patient.phone)");
    expect(routes).toContain("const pendingPhoneTokens = new Map");
    expect(routes).toContain("const consumedPhoneTokens = new Map");
    expect(routes.indexOf("await deliverIntake(pending.deliveryPayload);")).toBeLessThan(routes.indexOf("consumedPhoneTokens.set(pending.phoneTokenKey, pending.expiresAt)"));
    expect(routes).toContain("fingerprint({ token: input.phone_verification_token })");
    expect(routes).toContain("settings.mode === \"sandbox\" && settings.demo_available === true");
  });

  it("requires a delivered signed receipt for the optional video checkout and uses fixed server-side $39 identity", () => {
    expect(routes).toContain('app.post("/api/paypal/orders"');
    expect(routes).toContain("submission_token: z.string()");
    expect(routes).toContain("const receipt = receiptFor(parsed.data.submission_token);");
    expect(routes).toContain("VIDEO_VISIT_AMOUNT");
    expect(contract).toContain('VIDEO_VISIT_AMOUNT = "39.00"');
    expect(contract).toContain('VIDEO_VISIT_DESCRIPTION = "optional one-time medical-weight-loss Zoom video visit"');
    expect(routes).toContain("description: VIDEO_VISIT_DESCRIPTION");
    expect(routes).toContain('amount: { currency_code: "USD", value: VIDEO_VISIT_AMOUNT }');
    expect(routes).toContain("unit?.custom_id !== approval.submission_id");
    expect(routes).toContain("capture.amount?.value !== VIDEO_VISIT_AMOUNT");
    expect(routes).toContain('capture.amount.currency_code !== "USD"');
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
