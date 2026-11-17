import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Express, Request, Response as ExpressResponse } from "express";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import {
  EMPTY_INTAKE_UPLOADS, INTAKE_CARE_SMS_CONSENT_VERSION, INTAKE_SMS_OPT_IN_TEXT,
  finalizeFreeIntake, validateIntakeDraft, validateWebsiteCareSmsConsent,
  VIDEO_VISIT_AMOUNT, VIDEO_VISIT_DESCRIPTION,
} from "./intakeSubmissionContract";
import { INTAKE_TYPED_SIGNATURE_STYLES, validatedIntakeSignatureAudit } from "./intakeSignatureMetadata";
import { validateIntakeSigning } from "./intakeSigningInput";
import { generateIntakeSignedPdfs } from "./intakeSignedPdf";
import { createIntakeSignedFormsDatabaseStore } from "./intakeSignedFormsDatabaseStore";
import type { IntakePrivateBlobDb } from "./intakePrivateBlobDb";
import { buildGhlIntakeWebhookPayload } from "./ghlIntakeWebhookPayload";
import canonicalForms from "../shared/intakeSignForms.json";

// All contact data is synthetic. No real database, provider, or network connection is used.
const mocks = vi.hoisted(() => ({
  paypal: vi.fn(), deliverySettings: vi.fn(), phoneToken: vi.fn(), phoneSettings: vi.fn(),
  store: undefined as any, enqueueGhl: vi.fn(),
  env: { cookieSecret: "synthetic-care-sms-and-signing-test-secret", keragonWebhookUrl: "https://relay.example.test/intake", ghlIntakeWebhookUrl: "https://ghl.example.test/intake", intakeFamilyCouponCode: "family" },
}));
vi.mock("./_core/env", () => ({ ENV: mocks.env }));
vi.mock("./db", () => ({ getPaypalSettings: mocks.paypal, getIntakeDeliverySettings: mocks.deliverySettings }));
vi.mock("./intakePhoneVerification", () => ({ registerIntakePhoneVerificationRoutes: () => {}, validPhoneVerificationToken: mocks.phoneToken, getPhoneVerificationSettings: mocks.phoneSettings }));
vi.mock("./intakePrivateUploads", () => ({ registerIntakePrivateUploadRoutes: () => {}, resolveIntakeUploads: async () => EMPTY_INTAKE_UPLOADS }));
vi.mock("./intakeSignedFormsStore", async importOriginal => ({ ...await importOriginal<typeof import("./intakeSignedFormsStore")>(), getIntakeSignedFormsStore: () => mocks.store, registerIntakeSignedFormsRoutes: () => {} }));
vi.mock("./ghlIntakeWebhookQueue", () => ({ enqueueGhlIntakeWebhook: mocks.enqueueGhl, registerGhlIntakeWebhookRoutes: () => {} }));
import { registerIntakePaymentRoutes, FRIENDLY_INTAKE_SUBMIT_ERROR } from "./intakePaymentRoutes";

const SUBMISSION_ID = "2ae23242-345c-4f63-b017-456789abcd12";
const SIGNER = "Synthetic TEST ONLY";
let signaturePng: string;
let blankPng: string;
let clock: number;
let pdfs: Awaited<ReturnType<typeof generateIntakeSignedPdfs>>;

function draftValue() {
  const at = new Date(clock).toISOString();
  return {
    event: "mmd_intake.submitted", schema_version: "1.0", submission_id: SUBMISSION_ID,
    submitted_at: at, is_test: false, route: "weight_care",
    patient: { first_name: "Synthetic", last_name: "TEST ONLY", dob: "1985-01-15", state: "GA", state_name: "Georgia", email: "synthetic@example.test", phone: "(202) 555-0101", sex: "female", address_line1: "123 Synthetic Street", address_line2: "", city: "Atlanta", zip: "30301" },
    answers: { w: { w04: "compounded_semaglutide", wConsent: true, wDecline: false } },
    consents: { terms_accepted: true, terms_accepted_at: at, clinical_review_confirmed: true, clinical_review_confirmed_at: at, final_submission_acknowledged: true, sms_opt_in: true, sms_opt_in_at: at, sms_consent: true, sms_consent_at: at, sms_opt_in_text: INTAKE_SMS_OPT_IN_TEXT, sms_consent_version: INTAKE_CARE_SMS_CONSENT_VERSION, contact_preference: "sms", glp1_consent: true, glp1_declined: false, glp1_consent_at: at, glp1_consent_version: "2026-10" },
    meta: { source: "mmd-intake-web", form_version: "1.2.0" }, checkout_preview: { payment_processed: false, card_fields_omitted: true },
    intake_summary: "Synthetic test only", intake_summary_html: "<b>Synthetic test only</b>",
  };
}
function signingValue(style: typeof INTAKE_TYPED_SIGNATURE_STYLES[number] = "dancing_script") {
  return { version: "2026-10", signer_name: SIGNER, relation: "", signed_at: new Date(clock).toISOString(), document_checks: { glp1: true, general: true, telehealth: true, privacy: true, policy: true }, electronic_agreement: true, signature_png: signaturePng, signature_method: "typed", typed_name: SIGNER, signature_style: style };
}
function requestMeta(): Request { return { protocol: "https", headers: { host: "www.medmethoddirect.com" }, query: {} } as Request; }
class MemoryBlobDb implements IntakePrivateBlobDb {
  records = new Map<string, { bytes: Buffer; expiresAt: number }>();
  async put(key: string, bytes: Buffer, expiresAt: number) { this.records.set(key, { bytes: Buffer.from(bytes), expiresAt }); }
  async get(key: string) { const row = this.records.get(key); return row && row.expiresAt > clock ? Buffer.from(row.bytes) : null; }
  async delete(key: string) { this.records.delete(key); }
  async list(prefix: string) { return [...this.records.keys()].filter(key => key.startsWith(prefix)); }
  async cleanup() { let deleted = 0; for (const [key, row] of this.records) if (row.expiresAt <= clock) { this.records.delete(key); deleted++; } return { deleted }; }
  async withLock<T>(_name: string, work: () => T | Promise<T>): Promise<T> { return work(); }
}
function memoryStore(blobDb = new MemoryBlobDb()) {
  return createIntakeSignedFormsDatabaseStore({ secret: mocks.env.cookieSecret, blobDb, now: () => clock });
}
function harness() {
  const routes = new Map<string, (req: Request, res: ExpressResponse) => unknown>();
  const app = { post: (path: string, handler: any) => routes.set(`POST ${path}`, handler), get: (path: string, handler: any) => routes.set(`GET ${path}`, handler) } as unknown as Express;
  registerIntakePaymentRoutes(app);
  return async (body: any, path = "/api/intake/submit", params: Record<string, string> = {}) => {
    const res = { code: 200, body: undefined as any, status(code: number) { this.code = code; return this; }, json(body: unknown) { this.body = body; return this; }, setHeader() {} };
    await routes.get(`POST ${path}`)!({ ...requestMeta(), body, params } as Request, res as unknown as ExpressResponse);
    return res;
  };
}
const submitBody = () => ({ intake: draftValue(), video_visit_interest: false, signing: signingValue() });
let payloads: any[];
let network: ReturnType<typeof vi.fn>;
beforeAll(async () => {
  const width = 1600, height = 320;
  const pixels = Buffer.alloc(width * height * 4);
  // Reproducible synthetic ink pixels (not a real person's signature).
  for (let x = 100; x < 1450; x++) {
    const y = Math.round(160 + Math.sin(x / 70) * 55);
    for (let dy = -4; dy <= 4; dy++) pixels[((y + dy) * width + x) * 4 + 3] = Math.abs(dy) === 4 ? 90 : 255;
  }
  signaturePng = `data:image/png;base64,${(await sharp(pixels, { raw: { width, height, channels: 4 } }).png().toBuffer()).toString("base64")}`;
  blankPng = `data:image/png;base64,${(await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png().toBuffer()).toString("base64")}`;
});
beforeEach(() => {
  clock = Date.now();
  mocks.phoneToken.mockReturnValue(null);
  mocks.phoneSettings.mockReturnValue({ mode: "live", required: true, demo_available: false });
  mocks.paypal.mockRejectedValue(new Error("Payment must not be requested for a free intake"));
  mocks.deliverySettings.mockResolvedValue(null);
  mocks.store = memoryStore();
  mocks.env.keragonWebhookUrl = "https://relay.example.test/intake";
  payloads = [];
  network = vi.fn(async (url: string, init: RequestInit) => {
    if (url !== "https://relay.example.test/intake") throw new Error("Unexpected external request blocked");
    payloads.push(JSON.parse(String(init.body)));
    return Response.json({}, { status: 200 });
  });
  vi.stubGlobal("fetch", network);
});
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("website Weight Care explicit care SMS consent", () => {
  it("uses the exact approved text and current immutable version", () => {
    expect(INTAKE_SMS_OPT_IN_TEXT).toBe("Yes, text me about my care, including appointment reminders and health information like lab results. Texts aren't encrypted. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, HELP for help. Terms of Service · Privacy Policy");
    expect(INTAKE_CARE_SMS_CONSENT_VERSION).toBe("2026-11-17-care-sms-v1");
    expect(() => validateWebsiteCareSmsConsent(validateIntakeDraft(draftValue()), clock)).not.toThrow();
  });
  it.each(["2025550101", "12025550101", "+1 (202) 555-0101"])("still accepts valid US formatting %s", phone => {
    const draft = draftValue(); draft.patient.phone = phone;
    expect(() => validateWebsiteCareSmsConsent(validateIntakeDraft(draft), clock)).not.toThrow();
  });
  it.each(["+44 207 946 0958", "202abc5550101", "0000000000", "2020550101", "+12025550101+", "120255501011"])("rejects malformed/non-US numbers %s", phone => {
    const draft = draftValue(); draft.patient.phone = phone;
    expect(() => validateWebsiteCareSmsConsent(validateIntakeDraft(draft), clock)).toThrow(/valid US/i);
  });
  it("requires explicit true, a recent timestamp, exact text, and current version on website submit", async () => {
    const request = harness();
    for (const patch of [
      { sms_opt_in: false, sms_opt_in_at: null, contact_preference: "phone_portal" },
      { sms_opt_in_at: null }, { sms_consent_version: undefined },
      { sms_consent_version: "old" }, { sms_opt_in_text: "different text" },
      { sms_consent: false }, { sms_consent: undefined }, { sms_consent_at: undefined },
      { sms_consent_at: new Date(clock - 1000).toISOString() },
      { sms_opt_in_at: new Date(clock + 6 * 60_000).toISOString() },
      { sms_opt_in_at: new Date(clock - 25 * 60 * 60_000).toISOString() },
    ]) {
      const body = submitBody(); Object.assign(body.intake.consents, patch);
      expect((await request(body)).code).toBe(422);
    }
    expect(network).not.toHaveBeenCalled();
    expect(mocks.enqueueGhl).not.toHaveBeenCalled();
  });
  it("adds only consent aliases to the full Keragon intake while preserving GHL's closed mapping", () => {
    const draft = validateIntakeDraft(draftValue());
    const result = finalizeFreeIntake(draft, { phone_verified: false, phone_verified_at: null }, { is_test: false, video_visit_interest: false });
    expect(result).toMatchObject({ consents: draft.consents, sms_consent: true, sms_consent_at: draft.consents.sms_opt_in_at, sms_consent_version: INTAKE_CARE_SMS_CONSENT_VERSION, sms_consent_text: INTAKE_SMS_OPT_IN_TEXT, care: { payment_required: false }, payment: { status: "not_required" }, ...EMPTY_INTAKE_UPLOADS });
    const ghl = buildGhlIntakeWebhookPayload(draft, { isTest: false, videoVisitInterest: false }, requestMeta());
    expect(ghl).toMatchObject({ sms_opt_in: true, phone: "+12025550101", source: "website_intake", visit_type: "free_text_visit" });
    expect(Object.keys(ghl!).sort()).toEqual(["event", "first_name", "last_name", "email", "phone", "state", "visit_type", "sms_opt_in", "submitted_at", "source", "is_test", "utm_source", "utm_medium", "utm_campaign", "utm_content"].sort());
  });
});

describe("typed signatures and reusable drawn compatibility", () => {
  it.each(INTAKE_TYPED_SIGNATURE_STYLES)("accepts typed style %s and preserves high-resolution transparent smooth ink", async style => {
    const result = await validateIntakeSigning(signingValue(style), validateIntakeDraft(draftValue()), clock);
    const metadata = await sharp(result.signaturePng).metadata();
    expect(metadata.hasAlpha).toBe(true); expect(metadata.width).toBeGreaterThan(1000);
    const { data, info } = await sharp(result.signaturePng).raw().toBuffer({ resolveWithObject: true });
    expect(info.channels).toBe(4); expect(data[3]).toBe(0);
    let antialias = false; for (let i = 3; i < data.length; i += 4) if (data[i] > 0 && data[i] < 255) antialias = true;
    expect(antialias).toBe(true);
  });
  it("rejects missing/mismatching typed identity, style, method, blank images, and invalid electronic agreement", async () => {
    for (const patch of [
      { typed_name: "Other Signer" }, { typed_name: undefined }, { signature_style: undefined },
      { signature_style: "unknown" }, { signature_method: undefined }, { signature_method: "drawn" },
      { electronic_agreement: false }, { signature_png: blankPng },
    ]) await expect(validateIntakeSigning({ ...signingValue(), ...patch }, validateIntakeDraft(draftValue()), clock)).rejects.toThrow();
  });
  it("requires all five checks and a valid signing time", async () => {
    for (const id of ["glp1", "general", "telehealth", "privacy", "policy"]) {
      const signing: any = signingValue(); signing.document_checks[id] = false;
      await expect(validateIntakeSigning(signing, validateIntakeDraft(draftValue()), clock)).rejects.toThrow(/all five/i);
    }
    await expect(validateIntakeSigning({ ...signingValue(), signed_at: new Date(clock + 6 * 60_000).toISOString() }, validateIntakeDraft(draftValue()), clock)).rejects.toThrow(/invalid date/i);
  });
  it("keeps old absent-method drawn input valid in reusable validators/PDF/store contracts", async () => {
    const { signature_method: _method, typed_name: _name, signature_style: _style, ...legacy } = signingValue();
    const result = await validateIntakeSigning(legacy, validateIntakeDraft(draftValue()), clock);
    expect((await sharp(result.signaturePng).metadata()).hasAlpha).toBe(false);
    expect(validatedIntakeSignatureAudit({}, SIGNER)).toEqual({});
    await expect(validateIntakeSigning({ ...legacy, signature_method: "drawn" }, validateIntakeDraft(draftValue()), clock)).resolves.toHaveProperty("signing.signature_method", "drawn");
  });
  it("puts the same typed name/method/style/exact timestamp and electronic agreement in all five PDFs", async () => {
    const signing = signingValue();
    const { signaturePng: image } = await validateIntakeSigning(signing, validateIntakeDraft(draftValue()), clock);
    pdfs = await generateIntakeSignedPdfs({ submissionId: SUBMISSION_ID, patientFullName: SIGNER, patientDob: "1985-01-15", patientLastName: "TEST ONLY", signerName: SIGNER, relation: "", signedAt: signing.signed_at, demo: false, signaturePng: image, ...validatedIntakeSignatureAudit(signing, SIGNER) });
    expect(pdfs.map(pdf => pdf.form)).toEqual(["glp1", "general", "telehealth", "privacy", "policy"]);
    for (const pdf of pdfs) {
      const text = execFileSync("pdftotext", ["-layout", "-", "-"], { input: pdf.bytes, encoding: "utf8" }).replace(/\s+/g, " ");
      expect(text).toContain("Signature method: typed"); expect(text).toContain(`Typed name: ${SIGNER}`);
      expect(text).toContain("Signature style: dancing_script"); expect(text).toContain(`Signature timestamp: ${signing.signed_at}`);
      expect(text).toContain("Electronic signature agreement: accepted"); expect(pdf.bytes.length).toBeLessThan(2 * 1024 * 1024);
    }
  });
  it("keeps typed audit in every individual manifest and encrypted-ledger interface across retries and expiry", async () => {
    const blobs = new MemoryBlobDb(), store = memoryStore(blobs), signing = signingValue();
    const fakePdfs = canonicalForms.map(form => ({ form: form.id, title: form.title, file_name: `${form.id}.pdf`, bytes: Buffer.from("%PDF-1.7\n%%EOF") }));
    const metadata = { signed_at: signing.signed_at, signer_name: SIGNER, relation: "", ...validatedIntakeSignatureAudit(signing, SIGNER) };
    const prepared = await store.prepare(requestMeta(), SUBMISSION_ID, "a".repeat(64), fakePdfs, metadata);
    expect(prepared.signed_forms).toHaveLength(5);
    for (const manifest of prepared.signed_forms) expect(manifest).toMatchObject(metadata);
    expect(prepared.signed_forms.map(form => form.url)).toEqual([prepared.glp1_consent_url, prepared.general_consent_url, prepared.telehealth_consent_url, prepared.privacy_notice_ack_url, prepared.medication_policy_url]);
    const restarted = memoryStore(blobs);
    expect((await restarted.readSubmission(SUBMISSION_ID))?.forms).toEqual(prepared);
    expect(await restarted.prepare(requestMeta(), SUBMISSION_ID, "a".repeat(64), fakePdfs, metadata)).toEqual(prepared);
    await store.markAttempted(SUBMISSION_ID);
    await expect(restarted.markAttempted(SUBMISSION_ID)).rejects.toMatchObject({ status: 409 });
    clock += 24 * 60 * 60 * 1000;
    expect(await restarted.readSubmission(SUBMISSION_ID)).toBeNull();
    await expect(store.prepare(requestMeta(), SUBMISSION_ID, "b".repeat(64), fakePdfs, { ...metadata, typed_name: "Other" })).rejects.toMatchObject({ status: 400 });
  });
});

describe("website submit scoped verification removal and preserved transport/fallback", () => {
  it("submits without any phone token despite live required settings, relays truthful false attestations and complete audit, and dedupes retry", async () => {
    const request = harness(), body = submitBody();
    const result = await request(body);
    expect(result.code).toBe(201); expect(result.body).toMatchObject({ sms_opt_in: true, payment_status: "NOT_REQUIRED", redirect_url: "/intake/thank-you/" });
    expect(payloads[0]).toMatchObject({ sms_consent: true, sms_consent_at: body.intake.consents.sms_opt_in_at, sms_consent_version: INTAKE_CARE_SMS_CONSENT_VERSION, patient: { phone_verified: false, phone_verified_at: null }, glp1_consent_at: body.signing.signed_at });
    expect(payloads[0].signed_forms).toHaveLength(5);
    for (const form of payloads[0].signed_forms) expect(form).toMatchObject({ signature_method: "typed", typed_name: SIGNER, signature_style: "dancing_script", signed_at: body.signing.signed_at });
    expect(JSON.stringify(payloads[0])).not.toContain(signaturePng);
    expect(network.mock.calls[0][1]).toMatchObject({ headers: { "Content-Type": "application/json", Accept: "application/json", "Idempotency-Key": `mmd-free-intake-${SUBMISSION_ID}` }, signal: expect.any(AbortSignal) });
    expect(mocks.paypal).not.toHaveBeenCalled(); expect(mocks.enqueueGhl).toHaveBeenCalledTimes(1);
    expect((await request(body)).body).toEqual(result.body); expect(network).toHaveBeenCalledTimes(1);
    const receipt = JSON.parse(Buffer.from(result.body.submission_token.split(".")[0], "base64url").toString("utf8"));
    expect(JSON.stringify(receipt)).not.toContain(SIGNER); expect(receipt).not.toHaveProperty("typed_name");
  });
  it("keeps valid prior attestations, but does not accept cross-mode or forged phone claims", async () => {
    mocks.phoneToken.mockReturnValueOnce({ verifiedAt: new Date(clock).toISOString(), mode: "live" });
    expect((await harness()({ ...submitBody(), phone_verification_token: "synthetic-token" })).code).toBe(201);
    expect(payloads[0].patient.phone_verified).toBe(true);
    mocks.phoneToken.mockReturnValue({ verifiedAt: new Date(clock).toISOString(), mode: "sandbox" });
    mocks.store = memoryStore();
    expect((await harness()({ ...submitBody(), phone_verification_token: "synthetic-token" })).code).toBe(201);
    expect(payloads[1].patient).toMatchObject({ phone_verified: false, phone_verified_at: null });
  });
  it("rejects missing consent and invalid US phone before any provider/store work, including demo requests", async () => {
    const body = submitBody(); body.intake.patient.phone = "+44 207 946 0958";
    expect((await harness()(body)).code).toBe(422);
    const demo: any = submitBody(); demo.intake.is_test = true; demo.demo_mode = true; delete demo.intake.consents.sms_consent_version;
    expect((await harness()(demo)).code).toBe(422);
    expect(network).not.toHaveBeenCalled();
  });
  it("retains submission fallback when PDF/storage is unavailable and does not log signer names or tokens", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      mocks.store = { readSubmission: async () => { throw new Error(`storage failure ${SIGNER}`); } };
      expect((await harness()(submitBody())).code).toBe(201);
      expect(payloads[0].signed_forms).toEqual([]); expect(payloads[0].glp1_consent_url).toBe("");
      expect(payloads[0].sms_consent).toBe(true); expect(JSON.stringify(log.mock.calls)).not.toContain(SIGNER);
    } finally { log.mockRestore(); }
  });
  it("retains friendly submit errors and never enqueues GHL before Keragon acceptance", async () => {
    network.mockImplementation(async () => Response.json({}, { status: 503 }));
    const result = await harness()(submitBody());
    expect(result.code).toBe(422); expect(result.body.error).toBe(FRIENDLY_INTAKE_SUBMIT_ERROR);
    expect(mocks.enqueueGhl).not.toHaveBeenCalled();
  });
  it("preserves optional $97 payment, one-time capture, minimal paid payload, and capture retry dedupe", async () => {
    const request = harness();
    const receipt = await request(submitBody());
    mocks.paypal.mockResolvedValue({ activeProvider: "paypal", mode: "live", liveClientId: "synthetic-id", liveClientSecret: "synthetic-secret" });
    const orderId = "SYNTHETIC-NO-CHARGE-ORDER", captureId = "SYNTHETIC-NO-CHARGE-CAPTURE";
    const units = [{ custom_id: SUBMISSION_ID, description: VIDEO_VISIT_DESCRIPTION, amount: { value: VIDEO_VISIT_AMOUNT, currency_code: "USD" } }];
    const providerCalls: string[] = [];
    network.mockImplementation(async (url: string, init: RequestInit) => {
      if (url === "https://relay.example.test/intake") { payloads.push(JSON.parse(String(init.body))); return Response.json({}); }
      if (url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "synthetic-token" });
      if (url.endsWith("/v2/checkout/orders")) {
        providerCalls.push("create");
        expect(JSON.parse(String(init.body))).toMatchObject({ intent: "CAPTURE", purchase_units: units });
        return Response.json({ id: orderId, links: [{ rel: "approve", href: "https://paypal.example.test/synthetic" }] });
      }
      if (url.endsWith(`/${orderId}`)) return Response.json({ id: orderId, status: "APPROVED", purchase_units: units });
      if (url.endsWith("/capture")) {
        providerCalls.push("capture");
        return Response.json({ id: orderId, status: "COMPLETED", purchase_units: [{ ...units[0], payments: { captures: [{ id: captureId, status: "COMPLETED", amount: { value: VIDEO_VISIT_AMOUNT, currency_code: "USD" }, create_time: new Date(clock).toISOString() }] } }] });
      }
      throw new Error("Unexpected provider request blocked");
    });
    const order = await request({ submission_token: receipt.body.submission_token, payment_method: "card" }, "/api/paypal/orders");
    expect(order.code).toBe(201);
    const captureBody = { approval_token: order.body.approval_token };
    const captured = await request(captureBody, "/api/paypal/orders/:orderId/capture", { orderId });
    expect(captured.code).toBe(200); expect(captured.body).toMatchObject({ payment_status: "COMPLETED", capture_id: captureId });
    expect(payloads[1]).toMatchObject({ event: "mmd_intake.video_visit_paid", related_submission_id: SUBMISSION_ID, payment: { amount: "97.00", currency: "USD" } });
    for (const key of ["patient", "answers", "consents", "signed_forms", "typed_name", "sms_consent"]) expect(payloads[1]).not.toHaveProperty(key);
    expect((await request(captureBody, "/api/paypal/orders/:orderId/capture", { orderId })).body).toEqual(captured.body);
    expect(providerCalls).toEqual(["create", "capture"]); expect(payloads).toHaveLength(2);
  });
  it("does not change the standalone verification APIs/settings or their US/international normalizer", () => {
    const source = readFileSync(resolve(import.meta.dirname, "intakePhoneVerification.ts"), "utf8");
    expect(source).toContain("required: ENV.phoneVerificationRequired !== false");
    expect(source).toContain('axios.post('); expect(source).toContain('if (digits.length >= 11 && digits.length <= 15)');
    expect(source).not.toContain("validateWebsiteCareSmsConsent");
  });
});

describe("canonical consent copy is retained exactly", () => {
  it("has no actual Dr. Al-Deek, MD credential targets and preserves existing flagged copy", () => {
    const clientSource = readFileSync(resolve(import.meta.dirname, "../client/public/intake/sign-forms-data.js"), "utf8");
    const browserForms = new Function("window", `${clientSource}; return window.MmdSignFormDocuments;`)({});
    expect(browserForms).toEqual(canonicalForms);
    expect(JSON.stringify(canonicalForms)).not.toContain("Dr. Al-Deek, MD");
    expect(JSON.stringify(canonicalForms)).toContain("[EFFECTIVE DATE]");
    expect(JSON.stringify(canonicalForms)).toContain("[PRIVACY OFFICER NAME / EMAIL / PHONE]");
  });
});
