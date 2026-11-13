import { inverseApprovedShippingSkip } from "./intakeShippingSkipScope.test"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedLatePatientInfo, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";
import { approvedIntroDetailsPhotoHtmlFragments, approvedShippingApprovalHtmlFragments, approvedSigningConnectionHtmlFragments } from "./intakeIntroDetailsPhotoScope.test";

const root = resolve(import.meta.dirname, "..");
const source = metaLeadConversionsHistoricalSource("client/intake/index.html", beforeMetaSchedule("client/intake/index.html", readFileSync(resolve(root, "client/intake/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const beforeShippingSkip = inverseApprovedShippingSkip("client/intake/index.html", source);
const historicalSource = inverseApprovedGlp1Combined("client/intake/index.html", source);
const old = (path: string) => execFileSync("git", ["show", `c7a19865:${path}`], { cwd: root, encoding: "utf8" });
const baseline = old("client/intake/index.html");
const fixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
type Fragment = { old: string; new: string; count?: number };
const fragments: Fragment[] = JSON.parse(metaLeadConversionsHistoricalSource(fixturePath, beforeMetaSchedule(fixturePath, readFileSync(resolve(root, fixturePath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")));
const previous: Fragment[] = JSON.parse(old(fixturePath));
const fn = (text: string, name: string) => {
  const start = text.lastIndexOf(`function ${name}(`);
  expect(start).toBeGreaterThanOrEqual(0);
  const end = text.indexOf("function ", start + 12);
  return text.slice(start, end);
};
const metadata = JSON.parse(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
const screens = metadata.w.screens;
const glp1 = new Function("window", metaLeadConversionsHistoricalSource(glp1CombinedAssetPath, beforeMetaSchedule(glp1CombinedAssetPath, readFileSync(resolve(root, glp1CombinedAssetPath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")) + ";return window.MmdCreateGlp1Screens")({})({}, {}, { questions: () => screens });
const phoneStart = source.indexOf("function MmdDemoIdentityVerificationSkipped(");
const phoneEnd = source.indexOf("async function MmdPhoneVerificationApi", phoneStart);
const helpers = (search = "") => new Function("window", "URLSearchParams", "b", "x", "w", "MmdGlp1", source.slice(phoneStart, phoneEnd) + fn(source, "E") + fn(source, "ie") + fn(source, "ae") + fn(source, "se") + fn(source, "MmdIntakePhoneReady") + fn(source, "MmdIntakeFinishReady") + fn(source, "MmdIntakeMissingDetails") + fn(source, "MmdIntakeFlowScreens") + ";return {MmdIntakeMissingDetails,MmdIntakeFinishReady,MmdIntakeFlowScreens}")(
  { location: { search } }, URLSearchParams, { Georgia: "GA", Florida: "FL" }, () => screens, () => screens, glp1,
) as {
  MmdIntakeMissingDetails: (answers: Record<string, unknown>, demo: boolean, signed: boolean) => string[];
  MmdIntakeFinishReady: (screen: unknown, answers: Record<string, unknown>, demo: boolean) => boolean;
  MmdIntakeFlowScreens: (answers: unknown) => Array<{ id: string; type: string; question_text?: string; helper_text?: string }>;
};
const valid = () => ({ first: "SYNTHETIC", last: "Example", dobMonth: "1", dobDay: "15", dobYear: "1985", state: "Georgia", email: "synthetic@example.invalid", phone: "2025550188", terms: true, smsOptIn: false, checkoutAck: true, wConsent: true, wDecline: false, phoneVerified: true, phoneVerificationToken: "SYNTHETIC-ONLY", phoneVerificationExpiresAt: Date.now() + 60000, phoneVerificationSettings: { mode: "live", required: true } });

describe("Weight Care final patient-info submission wording", () => {
  it("retains the complete canonical questions/options/state fields and makes identity the sole visible final submit screen", () => {
    expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]).toBe(baseline.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
    const flow = helpers().MmdIntakeFlowScreens({});
    expect(flow.slice(-7).map(screen => screen.id)).toEqual(["w30", "wShippingAddress", "wScalePhoto", "w38", "wSignForms", "w01", "w02"]);
    expect(flow.filter(screen => screen.type === "identity")).toHaveLength(1);
    expect(flow.some(screen => screen.id === "w39")).toBe(false);
    expect(metadata.w.screens.some((screen: { id: string }) => screen.id === "w39")).toBe(true);
    expect(flow.at(-1)).toMatchObject({ type: "identity", question_text: "Last step: where should Dr. Al-Deek text you?", helper_text: "Add your details so Dr. Al-Deek can review your answers and text you." });
  });

  it("uses the exact signing copy without modifying document wording, signing fields, validation or CSS", () => {
    const sign = helpers().MmdIntakeFlowScreens({}).find(screen => screen.id === "wSignForms");
    expect(sign).toMatchObject({ question_text: "Almost there — then you can text with Dr. Al-Deek", helper_text: "Telehealth law requires your consent before a doctor can discuss treatment with you. Signing gives Dr. Al-Deek permission to review your assessment and text with you — then your free visit starts." });
    expect(source).toContain('screen.type==="signForms"?"Sign & continue":"Continue"');
    for (const path of ["client/public/intake/sign-forms-ui.js", "client/public/intake/sign-forms.css", "client/public/intake/sign-forms-data.js"]) expect(inverseApprovedLatePatientInfo(path, metaLeadConversionsHistoricalSource(path, beforeMetaSchedule(path, readFileSync(resolve(root, path), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")))).toBe(old(path));
  });

  it("moves one final acknowledgement above Submit and preserves the terms links, optional SMS consent and checkoutAck key", () => {
    expect((fn(source, "MmdIntakeFinish").match(/id:"mmd-free-intake-ack"/g) ?? []).length).toBe(1);
    expect((source.match(/id:"mmd-free-intake-ack"/g) ?? []).length).toBe((baseline.match(/id:"mmd-free-intake-ack"/g) ?? []).length);
    expect(fn(source, "MmdIntakeFinish")).toContain("I confirm my information is accurate and consent to submit it for clinical review.");
    expect(source).toContain('MmdIntakeSubmitScreen(screen)&&(0,M.jsx)(MmdIntakeFinish,{answers,onValue})');
    expect(source).toContain('checked:answers.checkoutAck===true');
    expect(source).toContain('href:`https://medmethoddirect.com/terms`');
    expect(source).toContain('href:`https://medmethoddirect.com/privacy-policy`');
    expect(source).toContain('children:[`I accept the `');
    expect(fn(beforeShippingSkip, "be")).toBe(fn(baseline, "be"));
  });

  it("uses exact free/video button wording and next-page note, and retains authoritative signing locks and submission transport", () => {
    for (const text of ["Submit & start my free visit", "Submit & book my video visit", "Watch for a text from us after you submit.", "You'll pay $97 and pick your time on the next page."]) expect(source).toContain(text);
    expect(metaLeadConversionsHistoricalSource(introducedContinueGuidanceAssetPath, beforeMetaSchedule(introducedContinueGuidanceAssetPath, readFileSync(resolve(root, introducedContinueGuidanceAssetPath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))).toContain('JSX.jsx("p", { children: "Almost there - please fill in:" })');
    const app = source.slice(source.lastIndexOf("function $e()"));
    expect(app).toContain('MmdIntakeSubmitScreen(screen)?formsReady&&MmdIntakeFinishReady(screen,answers,demo)&&MmdSigningPayloadReady(signingPayloadRef.current)');
    expect(app).toContain('const missingDetails=screen&&MmdIntakeSubmitScreen(screen)?MmdIntakeMissingDetails(answers,demo,formsReady&&MmdSigningPayloadReady(signingPayloadRef.current)):[];');
    expect(app).toContain('(0,M.jsx)(MmdContinueGuidance,{screen,answers,formsReady,missingDetails,submitting,uploadBusy,blocked:submitting||uploadBusy||(!canContinue&&(!informationOnly||screen.type==="signForms"))})');
    expect(app).toContain('if(!MmdSigningPayloadReady(signing))');
    expect(app).toContain('const receipt=await MmdSubmitFreeIntake("w",answers,demo,signing)');
    expect(app).not.toContain('setReturnScreen("w39")');
    expect(app).toContain('setReturnScreen("w02")');
    expect(fn(source, "MmdSigningPayloadReady")).toBe(fn(baseline, "MmdSigningPayloadReady"));
    const submit = (text: string) => text.slice(text.indexOf("async function MmdSubmitFreeIntake"), text.indexOf("var Ae=", text.indexOf("async function MmdSubmitFreeIntake")));
    expect(submit(source)).toBe(submit(baseline));
  });

  it("lists only actual missing items, excluding completed fields and optional SMS opt-in", () => {
    const h = helpers();
    expect(h.MmdIntakeMissingDetails(valid(), false, true)).toEqual([]);
    expect(h.MmdIntakeMissingDetails({}, false, false)).toEqual(["First name", "Last name", "Date of birth", "State", "Email address", "Mobile number", "Terms of Service and Privacy Policy acceptance", "Clinical review confirmation", "Signed forms"]);
    expect(h.MmdIntakeMissingDetails({ ...valid(), checkoutAck: false }, false, true)).toEqual(["Clinical review confirmation"]);
    expect(h.MmdIntakeMissingDetails(valid(), false, false)).toEqual(["Signed forms"]);
  });

  it.each([["first", "", "First name"], ["last", "", "Last name"], ["state", "Unknown", "State"], ["email", "bad", "Email address"], ["phone", "123", "Mobile number"], ["terms", false, "Terms of Service and Privacy Policy acceptance"], ["wConsent", false, "Signed forms"], ["wDecline", true, "Signed forms"]])("reports only %s when that one requirement is invalid", (key, value, label) => {
    expect(helpers().MmdIntakeMissingDetails({ ...valid(), [String(key)]: value }, false, true)).toEqual([label]);
  });

  it("keeps exact DOB/calendar/adult validation and only lists date of birth when invalid", () => {
    const h = helpers();
    for (const override of [{ dobDay: "" }, { dobMonth: "2", dobDay: "30" }, { dobYear: "2015" }]) {
      expect(h.MmdIntakeMissingDetails({ ...valid(), ...override }, false, true)).toEqual(["Date of birth"]);
      expect(h.MmdIntakeFinishReady(screens.find((screen: { type: string }) => screen.type === "identity"), { ...valid(), ...override }, false)).toBe(false);
    }
    expect(fn(source, "ie")).toBe(fn(baseline, "ie"));
    expect(fn(historicalSource, "se")).toBe(fn(baseline, "se"));
  });

  it("retains verification expiry and the exact initialized demo exception without falsely listing optional SMS consent", () => {
    const expired = { ...valid(), phoneVerificationExpiresAt: Date.now() - 1 };
    expect(helpers().MmdIntakeMissingDetails(expired, false, true)).toEqual(["Mobile number verification"]);
    expect(helpers("?prefill=demo").MmdIntakeMissingDetails(expired, true, true)).toEqual([]);
    expect(helpers("?prefill=Demo").MmdIntakeMissingDetails(expired, true, true)).toEqual(["Mobile number verification"]);
    const identity = screens.find((screen: { type: string }) => screen.type === "identity");
    expect(helpers().MmdIntakeFinishReady(identity, valid(), false)).toBe(true);
    for (const override of [{ checkoutAck: false }, { wConsent: false }, { wDecline: true }, expired]) expect(helpers().MmdIntakeFinishReady(identity, { ...valid(), ...override }, false)).toBe(false);
  });

  it("extends prior exact fixtures unchanged and reverses only this approved update back to the complete c7a19865 intake", () => {
    expect(fragments.slice(0, previous.length)).toEqual(previous);
    const beforeGuidance: Fragment[] = JSON.parse(execFileSync("git", ["show", `16e39af2:${fixturePath}`], { cwd: root, encoding: "utf8" }));
    expect(beforeGuidance).toHaveLength(41);
    expect(fragments.slice(0, beforeGuidance.length)).toEqual(beforeGuidance);
    const afterGuidance: Fragment[] = JSON.parse(execFileSync("git", ["show", `b69c2aa2:${fixturePath}`], { cwd: root, encoding: "utf8" }));
    expect(afterGuidance).toHaveLength(beforeGuidance.length + 6);
    expect(fragments.slice(0, afterGuidance.length)).toEqual(afterGuidance);
    const afterShipping: Fragment[] = JSON.parse(execFileSync("git", ["show", `0648c6e3:${fixturePath}`], { cwd: root, encoding: "utf8" }));
    expect(afterShipping).toHaveLength(afterGuidance.length + 1);
    expect(afterShipping.slice(0, afterGuidance.length)).toEqual(afterGuidance);
    expect(afterShipping.at(-1)).toEqual({ old: "children:`Apt/suite/unit`", new: "children:`Apt, suite, unit (optional)`", count: 1 });
    expect(fragments.slice(0, afterShipping.length)).toEqual(afterShipping);
    expect(approvedIntroDetailsPhotoHtmlFragments).toHaveLength(7);
    expect(fragments.slice(afterShipping.length, afterShipping.length + 7)).toEqual(approvedIntroDetailsPhotoHtmlFragments);
    expect(fragments.slice(afterShipping.length, afterShipping.length + 7)).toHaveLength(7);
    const beforeApproval: Fragment[] = JSON.parse(execFileSync("git", ["show", `1476a622:${fixturePath}`], { cwd: root, encoding: "utf8" }));
    expect(beforeApproval).toHaveLength(55);
    expect(fragments.slice(0, beforeApproval.length)).toEqual(beforeApproval);
    expect(approvedShippingApprovalHtmlFragments).toHaveLength(4);
    expect(fragments.slice(beforeApproval.length, 59)).toEqual(approvedShippingApprovalHtmlFragments);
    const beforeSigning: Fragment[] = JSON.parse(execFileSync("git", ["show", `0c5f2ca4:${fixturePath}`], { cwd: root, encoding: "utf8" }));
    expect(beforeSigning).toHaveLength(59);
    expect(fragments.slice(0, beforeSigning.length)).toEqual(beforeSigning);
    expect(approvedSigningConnectionHtmlFragments).toHaveLength(2);
    expect(fragments.slice(beforeSigning.length)).toEqual(approvedSigningConnectionHtmlFragments);
    expect(fragments).toHaveLength(afterShipping.length + 7 + 4 + 2);
    let beforeGuidanceSource = historicalSource;
    for (const fragment of fragments.slice(beforeGuidance.length).reverse()) {
      expect(beforeGuidanceSource.split(fragment.new).length - 1).toBe(fragment.count ?? 1);
      beforeGuidanceSource = beforeGuidanceSource.split(fragment.new).join(fragment.old);
    }
    expect(beforeGuidanceSource).toBe(execFileSync("git", ["show", "16e39af2:client/intake/index.html"], { cwd: root, encoding: "utf8" }));
    let restored = historicalSource;
    for (const fragment of fragments.slice(previous.length).reverse()) {
      expect(restored.split(fragment.new).length - 1).toBe(fragment.count ?? 1);
      restored = restored.split(fragment.new).join(fragment.old);
    }
    expect(restored).toBe(baseline);
  });
});
