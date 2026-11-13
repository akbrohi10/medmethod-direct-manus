import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = metaLeadConversionsHistoricalSource("../client/intake/index.html", beforeMetaSchedule("../client/intake/index.html", readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const start = source.lastIndexOf("function Ge(");
const introduction = source.slice(start, source.indexOf("function Ke(", start));

describe("Intro 97 local intake introduction", () => {
  it("renders the approved accessible text-care journey and pricing copy on w01", () => {
    for (const text of [
      "HOW IT WORKS",
      "Your doctor. One text away.",
      "Just add your details, and Dr. Al-Deek will text you to make a plan together.",
      "Add your details", "Your name, email, and mobile number.",
      "Dr. Jumana Al-Deek, DO", "Family Physician · Menopause Society Certified Practitioner (MSCP)",
      "Dr. Al-Deek personally reviews every intake and will text you after you submit.",
      "Text with your doctor", "Connect immediately after submitting.",
      "Make a plan together", "Discuss your options and next steps.",
      "Simple, pay-per-visit care", "First text visit", "Includes 7 days of follow-up messaging.",
      "Additional text visits", "$29 each", "Video visit", "$97",
      "Included with every visit - even your free first visit.", "Medication costs extra.",
      "You'll pay and pick a time after submitting your intake.",
    ]) expect(introduction).toContain(text);
    expect(introduction).toContain('className:"weight-intro intake-intro97"');
    expect(introduction).toContain('"aria-labelledby":"mmd-intake-intro-title"');
    expect(introduction).toContain('className:"intro97-steps"');
    expect(introduction).toContain('className:"intro97-price-list"');
    expect(source).toContain('screen?.id!=="w01"&&(0,M.jsx)("h1"');
    expect(source).toContain('screen?.id!=="w01"&&(0,M.jsx)("p",{className:"eyebrow"');
    expect(source).toContain('children:screen?screen.question_text:"Welcome to MedMethod Direct"');
    expect(source).toContain('question_text:"Last step: where should Dr. Al-Deek text you?",helper_text:"Add your details so Dr. Al-Deek can review your answers and text you."');
  });

  it("keeps one unchecked boolean interest control and changes only the w01 CTA", () => {
    expect(introduction).toContain('id:"mmd-video-interest",type:"checkbox",checked:answers.videoVisitInterest===true,onChange:event=>onValue("videoVisitInterest",event.target.checked)');
    expect(introduction).toContain("I'd like a video visit with Dr. Al-Deek - $97");
    expect(introduction).not.toMatch(/fetch\(|PayPal|paypal|checkoutAck|smsOptIn|onPaid|<iframe/);
    expect(source).toContain('screen.id==="w01"?"Continue to my details"');
    expect(source).toContain('screen.id==="w01"&&(0,M.jsx)("p",{className:"intro97-footer-note",children:"Just one more step."})');
    expect(source).not.toContain("videoVisitInterest:true");
    expect(source).toContain('screen.id==="w01"&&(0,M.jsx)("p",{className:"intro97-fine-print",children:"Prescriptions only when medically appropriate. Follow-up covers that visit\'s assessment and plan. New concerns or additional treatments require a separate visit."})');
    const footer = source.slice(source.lastIndexOf('className:"intro97-footer-note"'));
    expect(footer.indexOf('className:"intro97-fine-print"')).toBeGreaterThan(0);
    expect(introduction).not.toContain('className:"intro97-fine-print"');
    expect(inverseApprovedGlp1Combined("client/intake/index.html", source)).toContain('className:screen?.id==="w01"?"stage intake-intro-stage":screen?.type==="signForms"?"stage sign-forms-stage":screen?.type==="scalePhoto"?"stage scale-photo-stage":MmdIntakeSubmitScreen(screen)?"stage patient-submit-stage":"stage"');
    expect(source).toContain('.intro-footer .footer-inner{flex-direction:column;align-items:flex-start;gap:0}');
    for (const retired of ["$39", "39.00", "Free ongoing", "FREE ONGOING", "No monthly", "Ongoing text-based care", "Takes about 5 minutes", "Your assessment and ongoing asynchronous doctor care are free", "Intake & ongoing text care", "provides ongoing care and support"]) {
      expect(source.toLowerCase()).not.toContain(retired.toLowerCase());
    }
  });
});
