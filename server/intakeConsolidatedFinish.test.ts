import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const intake = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const start = intake.indexOf("function MmdIntakeFlowScreens(");
const end = intake.indexOf("function MmdIntakeFinish({", start);
const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));

describe("consolidated local intake finish", () => {
  const screens = [
    { id: "w38", type: "text" }, { id: "w39", type: "consent" },
    { id: "w40", type: "wReview" }, { id: "w40a", type: "planReview" }, { id: "w41", type: "checkout" },
  ];
  function helpers() {
    return new Function("w", "x", "se", "MmdPhoneVerificationSatisfied", `${intake.slice(start, end)};return { MmdIntakeFlowScreens, MmdIntakeFinishReady };`)(
      () => screens, () => screens,
      (screen: { type: string }, answers: Record<string, unknown>) => screen.type === "consent" ? answers.wConsent === true && answers.wDecline !== true : answers.checkoutAck === true && answers.contactValid === true,
      (_settings: unknown, answers: Record<string, unknown>) => answers.validPhone === true,
    ) as { MmdIntakeFlowScreens: (answers: unknown) => unknown; MmdIntakeFinishReady: (screen: unknown, answers: Record<string, unknown>, demo: boolean) => boolean };
  }

  it("removes both mandatory review screens and separate checkout only from visible navigation", () => {
    expect(helpers().MmdIntakeFlowScreens({})).toEqual(screens.slice(0, 2));
    expect(app).toContain('()=>MmdIntakeFlowScreens(answers)');
    for (const type of ['"type":"wReview"', '"type":"planReview"', '"type":"checkout"']) expect(intake).toContain(type);
    expect(intake).toContain('function w(e,t){return x(e).filter(e=>re(e,t))}');
    expect(intake).toContain('children:screen?.type==="consent"?"Finish your intake"');
    expect(app).toContain('screen.type==="consent"?"Submit My Free Intake":"Continue"');
  });

  it("requires treatment consent, final acknowledgement, valid contact and verified phone together", () => {
    const { MmdIntakeFinishReady } = helpers();
    const valid = { wConsent: true, wDecline: false, checkoutAck: true, contactValid: true, validPhone: true };
    expect(MmdIntakeFinishReady(screens[1], valid, false)).toBe(true);
    for (const key of ["wConsent", "checkoutAck", "contactValid", "validPhone"]) expect(MmdIntakeFinishReady(screens[1], { ...valid, [key]: false }, false)).toBe(false);
    expect(MmdIntakeFinishReady(screens[1], { ...valid, wDecline: true }, false)).toBe(false);
    expect(app).toContain('if(answers.checkoutAck!==true)');
    expect(app).toContain('MmdPhoneVerificationSatisfied(answers.phoneVerificationSettings');
    expect(app).toContain('setReturnScreen("w39")');
    expect(app).not.toContain('setReturnScreen("w41")');
  });

  it("keeps clinical consent separate from the submission acknowledgement and preserves all payload fields", () => {
    expect(intake).toContain('checked:o&&e.wConsent===!0');
    expect(intake).toContain('checked:o&&e.wDecline===!0');
    expect(intake).toContain('id:"mmd-free-intake-ack",type:"checkbox",checked:answers.checkoutAck===true');
    expect(intake).toContain('final_submission_acknowledged:t.checkoutAck===!0');
    expect(intake).toContain('sms_opt_in:t.smsOptIn===!0');
    expect(intake).toContain('glp1_consent:t.wConsent===!0');
    expect(app).toContain('const receipt=await MmdSubmitFreeIntake("w",answers,demo)');
    expect(app).toContain('window.location.replace("/intake/thank-you/"');
  });
});
