import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const smsText = "Yes, I'd like to receive text messages from MedMethod Direct about my care, including appointment reminders, treatment updates, and health information such as lab results. I understand that standard text messages are not encrypted and may be seen by others with access to my phone. Message frequency varies. Message & data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Terms of Service and Privacy Policy.";

function handoffHelpers() {
  const start = intake.indexOf("function ve(){");
  const end = intake.indexOf("async function MmdPhoneVerificationApi", start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return new Function(`${intake.slice(start, end)}; return { ve, MmdPhoneVerificationRequired, MmdPhoneVerificationSatisfied, MmdLivePhoneVerificationToken };`)() as {
    ve: () => string;
    MmdPhoneVerificationRequired: (settings: unknown, demo: boolean) => boolean;
    MmdPhoneVerificationSatisfied: (settings: unknown, answers: Record<string, unknown>, demo: boolean) => boolean;
    MmdLivePhoneVerificationToken: (answers: Record<string, unknown>) => string | null;
  };
}

describe("local intake handoff client", () => {
  it("uses the documented verification REST endpoints and safe six-digit flow UI", () => {
    expect(intake).toContain("/api/phone-verification/settings");
    expect(intake).toContain("/api/phone-verification/request");
    expect(intake).toContain("/api/phone-verification/confirm");
    expect(intake).toContain("6-digit verification code");
    expect(intake).toContain("h?`Resend code`:`Send code`");
    expect(intake).toContain("Resend available in ${C}s");
    expect(intake).toContain("expires_in_seconds");
    expect(intake).toContain("phoneVerificationExpiresAt>Date.now()");
  });

  it("fails closed except for the explicit sandbox demo availability and rejects expired tokens", () => {
    const helpers = handoffHelpers();
    const settings = { mode: "live", required: true, demo_available: false };
    const now = Date.now();
    expect(helpers.MmdPhoneVerificationRequired(settings, false)).toBe(true);
    expect(helpers.MmdPhoneVerificationSatisfied(settings, {}, false)).toBe(false);
    expect(helpers.MmdPhoneVerificationSatisfied(settings, { phoneVerified: true, phoneVerificationToken: "opaque", phoneVerificationExpiresAt: now - 1 }, false)).toBe(false);
    expect(helpers.MmdPhoneVerificationSatisfied(settings, { phoneVerified: true, phoneVerificationToken: "opaque", phoneVerificationExpiresAt: now + 60_000 }, false)).toBe(true);
    expect(helpers.MmdPhoneVerificationRequired({ mode: "sandbox", required: true, demo_available: true }, true)).toBe(false);
    expect(helpers.MmdPhoneVerificationRequired({ mode: "live", required: true, demo_available: true }, true)).toBe(true);
    expect(helpers.MmdLivePhoneVerificationToken({ phoneVerified: true, phoneVerificationToken: "opaque", phoneVerificationExpiresAt: now + 60_000 })).toBe("opaque");
    expect(helpers.MmdLivePhoneVerificationToken({ phoneVerified: true, phoneVerificationToken: "opaque", phoneVerificationExpiresAt: now - 1 })).toBeNull();
  });

  it("creates UUID submission identifiers and retains submission identity and timestamp across retry payloads", () => {
    const { ve } = handoffHelpers();
    expect(ve()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(intake).toContain("_submissionId:ve(),_submittedAt:new Date().toISOString()");
    expect(intake).toContain("submission_id:t._submissionId??ve(),submitted_at:i");
    expect(intake).toContain("let i=typeof t._submittedAt==`string`?t._submittedAt:new Date().toISOString()");
    expect(intake).toContain("setAnswers({_submissionId:ve(),_submittedAt:new Date().toISOString()})");
  });

  it("keeps presentation pricing separate from delivery treatment interest and sends the exact optional SMS consent", () => {
    expect(intake).toContain("return t?[t.name,t.price,t.pricingNote,t.note,...t.specs.map(e=>e.value)].filter(Boolean).join(` — `):``");
    expect(intake).toContain("let e=p.find(e=>e.value===t.w04);e&&(a.treatment_interest=e.name)");
    expect(intake).toContain(smsText);
    expect(intake).toContain("sms_opt_in:t.smsOptIn===!0");
    expect(intake).toContain("sms_opt_in_at:t.smsOptIn===!0&&typeof t.smsOptInAt==`string`?t.smsOptInAt:null");
    expect(intake).toContain("sms_opt_in_text:MmdSmsOptInText");
    expect(intake).toContain("contact_preference:t.smsOptIn===!0?`sms`:`phone_portal`");
    expect(intake).toContain("SMS text-message consent");
  });

  it("passes the current verification token and demo flag only to the free intake submission", () => {
    expect(intake).toContain("phone_verification_token:MmdLivePhoneVerificationToken(answers),demo_mode:demoSubmission");
    expect(intake).toContain("/api/intake/submit");
    expect(intake).toContain("video_visit_interest:answers.videoVisitInterest===true");
    expect(intake).not.toContain("/api/paypal/orders");
    expect(intake).not.toContain("/api/intake/coupon/submit");
  });
  it("keeps stable-ID and JSX runtime names unshadowed and validates Continue with the same demo flag", () => {
    const rootComponent = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));
    expect(rootComponent).not.toMatch(/(?:const|let|var)\s+(?:M|ve)\b/);
    expect(rootComponent).toContain("_submissionId:ve()");
    const component = intake.slice(intake.indexOf("function MmdPhoneVerification({"), intake.indexOf("function N(", intake.indexOf("function MmdPhoneVerification({")));
    expect(component).toContain("mmdSettingsRef=(0,l.useRef)(o)");
    expect(component).not.toContain("M=(0,l.useRef)(o)");
    expect(rootComponent).toContain('if(!screen||!se(screen,answers,demo)||submittingRef.current||uploadBusy||["signForms","consent"].includes(screen.type)&&!formsReady)return');
    expect(rootComponent).toContain("if(!MmdIntakePhoneReady(answers,demo))");
  });
});
