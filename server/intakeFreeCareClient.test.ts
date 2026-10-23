import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

const intake = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));

describe("local intake free ongoing care and optional video interest", () => {
  it("makes the introduction doctor-neutral without changing the treatment catalog", () => {
    expect(intake).toContain("Connect with a doctor specializing in medical weight loss");
    expect(intake).toContain("Assessment and ongoing follow-up included. No monthly fee or commitment. Medication costs extra.");
    expect(intake).not.toMatch(/Dr\. Al-Deek|Jumana|50,000\+|intro-doctor`,src/);
    expect(intake).toContain('src="/treatment-catalog.js"');
    expect(intake).toContain("window.MMD_TREATMENT_CATALOG.glp1.options.map");
    expect(intake).not.toMatch(/\$49|\$30|100% refunded|First month due today/);
  });

  it("records unchecked interest only and never treats it as payment authorization", () => {
    expect(intake).toContain("I’m interested in adding a video visit — $39 per visit");
    expect(intake).toContain('checked:answers.videoVisitInterest===true');
    expect(intake).toContain("Interest only. No charge now.");
    expect(intake).toContain("video_visit_interest:answers.videoVisitInterest===true");
    expect(intake).not.toContain("videoVisitInterest:true");
    expect(intake).toContain("No charge has been authorized.");
  });

  it("submits for free without initializing payment or requiring a coupon", () => {
    expect(intake).toContain("Submit My Free Intake");
    expect(intake).toContain("No card, payment or video purchase is needed to submit your intake.");
    expect(intake).toContain("/api/intake/submit");
    expect(intake).not.toContain("/api/paypal/");
    expect(intake).not.toContain("ApplePaySession");
    expect(intake).not.toContain("/api/intake/coupon/");
    expect(app).toContain("submittingRef.current=true");
    expect(app).toContain("submittingRef.current=false");
  });

  it("retains completion even if browser storage is unavailable and keeps patient details out of receipt storage", () => {
    const start = intake.indexOf("async function MmdSubmitFreeIntake");
    const end = intake.indexOf("var Ae=", start);
    const helpers = intake.slice(start, end);
    expect(helpers).toContain("mmd_free_intake_receipt");
    expect(helpers).toContain("submission_id:result.submission_id");
    expect(helpers).toContain("submission_token:result.submission_token");
    expect(helpers).not.toMatch(/result\.(patient|answers|email|phone|first_name|last_name|dob)/);
    expect(intake).not.toMatch(/(?:window|globalThis)\.localStorage|localStorage\.setItem/);
    expect(app).toContain("Browser storage is unavailable");
    expect(app).toContain("Your free intake is complete and unaffected.");
    expect(app).not.toContain("?submission_token");
  });

  it("keeps verification and medical consent intact and can return to expired mobile verification without clearing answers", () => {
    expect(intake).toContain("/api/phone-verification/confirm");
    expect(intake).toContain("Please verify your mobile number before submitting your free intake.");
    expect(intake).toContain("I confirm that my information is accurate and consent to securely submit this intake for clinical review. No payment is required.");
    expect(app).toContain('setReturnScreen("w39")');
    expect(intake).toContain("I have read this information and consent to discuss GLP-1 treatment with my clinician.");
  });

  it("keeps the surgical standalone JavaScript syntactically valid", () => {
    const script = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    expect(() => new Script(script!)).not.toThrow();
  });
});
