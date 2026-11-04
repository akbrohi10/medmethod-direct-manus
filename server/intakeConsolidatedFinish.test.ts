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
    { id: "w03a", type: "wPrice" }, { id: "other-information", type: "wPrice" },
    { id: "w01", type: "wIntro" }, { id: "w02", type: "identity" },
  ];
  function helpers() {
    return new Function("w", "x", "se", "MmdPhoneVerificationSatisfied", "MmdDemoIdentityVerificationSkipped", `${intake.slice(start, end)};return { MmdIntakeFlowScreens, MmdIntakeSubmitScreen, MmdIntakeFinishReady };`)(
      () => screens, () => screens,
      (screen: { type: string }, answers: Record<string, unknown>) => screen.type === "consent" ? answers.wConsent === true && answers.wDecline !== true : screen.type === "identity" ? answers.contactValid === true : answers.checkoutAck === true && answers.contactValid === true,
      (_settings: unknown, answers: Record<string, unknown>) => answers.validPhone === true,
      () => false,
    ) as { MmdIntakeFlowScreens: (answers: unknown) => unknown; MmdIntakeSubmitScreen: (screen: unknown) => boolean; MmdIntakeFinishReady: (screen: unknown, answers: Record<string, unknown>, demo: boolean) => boolean };
  }

  it("removes both mandatory review screens and separate checkout only from visible navigation", () => {
    const signingScreen = { id: "wSignForms", route: "w", type: "signForms", required: true, section: "Sign your forms", question_text: "Almost there — then you can text with Dr. Al-Deek", helper_text: "Telehealth law requires your consent before a doctor can discuss treatment with you. Signing gives Dr. Al-Deek permission to review your assessment and text with you — then your free visit starts." };
    const identityScreen = { ...screens[8], question_text: "Last step: where should Dr. Al-Deek text you?", helper_text: "Add your details so Dr. Al-Deek can review your answers and text you." };
    const expected = [screens[6], screens[0], signingScreen, screens[7], identityScreen];
    const flow = helpers().MmdIntakeFlowScreens({}) as Array<{ id: string; type: string }>;
    expect(flow).toEqual(expected);
    expect(helpers().MmdIntakeFlowScreens({ videoVisitInterest: true })).toEqual(expected);
    expect(flow.map(screen => screen.id)).not.toContain("w39");
    expect(app).toContain('()=>MmdIntakeFlowScreens(answers)');
    for (const type of ['"type":"wReview"', '"type":"planReview"', '"type":"checkout"']) expect(intake).toContain(type);
    expect(intake).toContain('"id":"w39","route":"w","step_number":47,"section":"Review & free submission","question_text":"Weight Care Consent","helper_text":"Please review the following information about GLP-1 treatment.","type":"consent"');
    expect(intake).toContain('function w(e,t){return x(e).filter(e=>re(e,t))}');
    expect(app).toContain('screen?.id!=="w01"&&(0,M.jsx)("h1",{children:screen?screen.question_text');
    expect(app).toContain('MmdIntakeSubmitScreen(screen)?answers.videoVisitInterest===true?"Submit & book my video visit":"Submit & start my free visit":screen.type==="signForms"?"Sign & continue":"Continue"');
    expect(app).toContain('MmdIntakeSubmitScreen(screen)?"Patient info"');
  });

  it("skips only the approved redundant w03a information screen, not its definition or any other question", () => {
    const flow = helpers().MmdIntakeFlowScreens({}) as Array<{ id: string; type: string }>;
    expect(flow.map(screen => screen.id)).not.toContain("w03a");
    expect(flow.map(screen => screen.id)).toContain("other-information");
    expect(intake).toContain('screen.id!=="w03a"');
    expect(intake).toContain('"id":"w03a","route":"w"');
    expect(intake).toContain("A doctor’s visit, without the waiting room");
  });

  it("requires treatment consent, final acknowledgement, valid contact and verified phone together", () => {
    const { MmdIntakeSubmitScreen, MmdIntakeFinishReady } = helpers();
    const valid = { wConsent: true, wDecline: false, checkoutAck: true, contactValid: true, validPhone: true };
    expect(MmdIntakeSubmitScreen(screens[8])).toBe(true);
    for (const screen of [null, undefined, screens[1], screens[4], { type: "signForms" }]) expect(MmdIntakeSubmitScreen(screen)).toBe(false);
    expect(MmdIntakeFinishReady(screens[8], valid, false)).toBe(true);
    for (const key of ["wConsent", "checkoutAck", "contactValid", "validPhone"]) expect(MmdIntakeFinishReady(screens[8], { ...valid, [key]: false }, false)).toBe(false);
    expect(MmdIntakeFinishReady(screens[8], { ...valid, wDecline: true }, false)).toBe(false);
    expect(intake).toContain('return se(screen,answers,demoMode)&&answers.checkoutAck===true&&se(x("w").find(item=>item.type==="consent"),answers,demoMode)&&se(x("w").find(item=>item.type==="checkout"),answers,demoMode)&&MmdIntakePhoneReady(answers,demoMode)');
    expect(app).toContain('if(answers.checkoutAck!==true)');
    expect(app).toContain('if(!MmdIntakePhoneReady(answers,demo))');
    expect(app).toContain('setReturnScreen("w02")');
    expect(app).not.toContain('setReturnScreen("w39")');
    expect(app).not.toContain('setReturnScreen("w41")');
  });

  it("keeps clinical consent separate from the submission acknowledgement and preserves all payload fields", () => {
    expect(intake).toContain('checked:o&&e.wConsent===!0');
    expect(intake).toContain('checked:o&&e.wDecline===!0');
    expect(intake).toContain('id:"mmd-free-intake-ack",type:"checkbox",checked:answers.checkoutAck===true');
    expect(intake).toContain('onChange:event=>onValue("checkoutAck",event.target.checked)');
    expect(intake).toContain('children:"I confirm my information is accurate and consent to submit it for clinical review."');
    const footer = app.slice(app.indexOf('(0,M.jsx)("footer",'));
    expect(footer).toContain('MmdIntakeSubmitScreen(screen)&&(0,M.jsx)(MmdIntakeFinish,{answers,onValue})');
    expect(app.slice(0, app.indexOf('(0,M.jsx)("footer",'))).not.toContain('(0,M.jsx)(MmdIntakeFinish');
    expect(footer).toContain('className:"patient-submit-note",children:answers.videoVisitInterest===true?"You\'ll pay $97 and pick your time on the next page.":"Watch for a text from us after you submit."');
    expect(intake).toContain('final_submission_acknowledged:t.checkoutAck===!0');
    expect(intake).toContain('sms_opt_in:t.smsOptIn===!0');
    expect(intake).toContain('glp1_consent:t.wConsent===!0');
    expect(app).toContain('const signing=signingPayloadRef.current');
    expect(app).toContain('if(!MmdSigningPayloadReady(signing))');
    expect(app).toContain('const receipt=await MmdSubmitFreeIntake("w",answers,demo,signing)');
    expect(app).toContain('window.location.replace(receipt.redirect_url)');
  });
});
