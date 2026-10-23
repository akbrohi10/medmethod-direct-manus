import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const start = source.lastIndexOf("function Ge(");
const introduction = source.slice(start, source.indexOf("function ", start + 10));

describe("short local intake introduction", () => {
  it("uses the exact approved concise copy on the introduction only", () => {
    expect(source).toContain('screen?.id==="w01"?"Start your free intake"');
    expect(source).toContain('screen?.id!=="w01"&&(0,M.jsx)("p",{className:"eyebrow"');
    for (const text of [
      "Connect with a doctor specializing in medical weight loss.", "FREE", "Text-based doctor care",
      "Assessment and ongoing follow-up included. No monthly fee or commitment. Medication costs extra.",
      "Prefer a video visit?", "Optional Zoom visit — $39 per visit.", "Interest only. No charge now.",
    ]) expect(introduction).toContain(text);
    expect(introduction).not.toMatch(/intro-process|intro-steps|intro-emotional|intro-credentials|intro-text-clarity|How it works/);
    expect(source).toContain('screen?.type==="consent"?"Finish your intake":screen?screen.question_text');
  });

  it("keeps the phone illustration and unchanged interest-only control with no payment initialization", () => {
    expect(introduction).toContain('className:"intro-text-phone-icon",width:44,height:56,viewBox:"0 0 48 60"');
    expect(introduction).toContain('id:"mmd-video-interest",type:"checkbox",checked:answers.videoVisitInterest===true,onChange:event=>onValue("videoVisitInterest",event.target.checked)');
    expect(introduction).toContain("I’m interested in adding a video visit — $39 per visit");
    expect(source).toContain("Continue with intake");
    expect(introduction).not.toMatch(/fetch\(|PayPal|paypal|checkoutAck|smsOptIn|onPaid|<iframe/);
    expect(source).not.toContain("videoVisitInterest:true");
  });
});
