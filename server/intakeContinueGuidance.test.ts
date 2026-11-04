import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseApprovedShippingApprovalWording } from "./intakeIntroDetailsPhotoScope.test";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const old = (path: string) => execFileSync("git", ["show", `16e39af2:${path}`], { cwd: root, encoding: "utf8" });
const source = read("client/intake/index.html"), baseline = old("client/intake/index.html");
const script = read("client/public/intake/continue-guidance.js");
const fixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
const fragments = JSON.parse(read(fixturePath)) as Array<{ old: string; new: string; count?: number }>;
const prior = JSON.parse(old(fixturePath)) as typeof fragments;
const metadata = JSON.parse(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
const screens = metadata.w.screens as Array<Record<string, any>>;
const fn = (text: string, name: string) => { const start = text.lastIndexOf(`function ${name}(`); expect(start).toBeGreaterThanOrEqual(0); return text.slice(start, text.indexOf("function ", start + 12)); };
const predicates = new Function("b", fn(source, "E") + fn(source, "D") + fn(source, "C") + fn(source, "T") + fn(source, "te") + fn(source, "ae") + ";return {E,D,C,T,ae}")({ Georgia: "GA", Florida: "FL" });
const context: any = { window: {} }; vm.runInNewContext(script, context);
const guidance = context.window.MmdCreateContinueGuidance({}, {}, predicates);
const find = (id: string) => screens.find(screen => screen.id === id)!;
const labels = (id: string, answers: Record<string, unknown>, options: Record<string, unknown> = {}) => Array.from(guidance.describe(find(id), answers, { enabled: false, ...options }), (item: any) => item.label);
const items = (id: string, answers: Record<string, unknown>, options: Record<string, unknown> = {}) => Array.from(guidance.describe(find(id), answers, { enabled: false, ...options })) as Array<{ label: string; selector: string; fieldLabel: string }>;

describe("Weight Care Continue/Submit requirement guidance", () => {
  it("matches the exact reviewed presentation-only guidance asset", () => {
    expect(createHash("sha256").update(script).digest("hex")).toBe("65b920d8a37cd8114f8c79010ff437ed5ce06992d0b78c03f14e9efe436af757");
  });

  it("preserves every question, option, price, screen order and validation predicate byte-for-byte", () => {
    expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]).toBe(baseline.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
    const beforeShippingApproval = inverseApprovedShippingApprovalWording("client/intake/index.html", source);
    for (const name of ["se", "E", "D", "C", "T", "ie", "oe", "ae", "be", "MmdIntakeFlowScreens", "MmdIntakeMissingDetails", "MmdIntakeFinishReady", "MmdSigningPayloadReady", "MmdPhoneVerificationSatisfied"]) expect(fn(beforeShippingApproval, name)).toBe(fn(baseline, name));
    const segment = (text: string, from: string, to: string) => text.slice(text.lastIndexOf(from), text.indexOf(to, text.lastIndexOf(from)));
    for (const [from, to] of [["const onValue=", ";const onPhoneVerified="], ["const onContinue=", ";const goBack="], ["const canContinue=", ";const missingDetails="]]) expect(segment(source, from, to)).toBe(segment(baseline, from, to));
  });

  it("adds exact cost text only to the selected recommendation option, without altering its label or medication cards", () => {
    const cost = "Dr. Al-Deek will confirm the exact medication cost by text before anything is prescribed or charged, and she approves it first.";
    expect(source.split(cost)).toHaveLength(2);
    expect(fn(source, "Le")).toContain('o(m.value)&&(0,M.jsx)(`span`,{className:`choice-note medication-cost-confirmation`,"aria-live":`polite`,children:`' + cost + '`})');
    expect(fn(source, "MmdIntakeMedicationDetails")).toBe(fn(baseline, "MmdIntakeMedicationDetails"));
    expect(fn(source, "Ie")).toBe(fn(baseline, "Ie"));
  });

  it.each(screens.map(screen => [screen.id, screen]))("never shows guidance for enabled %s, including optional screens", (_id, screen) => {
    expect(Array.from(guidance.describe(screen, {}, { enabled: true }))).toEqual([]);
    expect(Array.from(guidance.describe(screen, {}, { enabled: false, missingDetails: ["First name"] })).length).toBeGreaterThan(0);
  });

  it.each(["w07", "w09", "w11", "w13", "w15", "w16", "w18", "w19", "w21", "w22", "w23", "w26", "w27", "w29", "w30", "w31", "w32", "w33", "w34", "w35", "w36", "w37"])("shows a short choice instruction for %s without listing unselected options as missing", (id) => {
    const result = items(id, {}); expect(result).toHaveLength(1); expect(result[0].label).toMatch(/^Please choose (an|at least one) answer/); expect(result[0].selector).toBe("main.stage > .choices");
  });

  it("lists only incomplete measurement values and preserves the existing zero-inch semantics", () => {
    expect(labels("w03", { ft: "5", inch: "6", lb: "" })).toEqual(["Weight (lb)"]);
    expect(labels("w03", { ft: "", inch: "", lb: "180" })).toEqual(["Height (feet)"]);
    expect(labels("w03", { ft: "5", inch: "12", lb: "49" })).toEqual(["Height (inches)", "Weight (lb)"]);
  });

  it("uses only outstanding shipping requirements and never flags apartment or uploaded files", () => {
    expect(labels("wShippingAddress", { wAddressLine1: "Synthetic", wAddressCity: "Atlanta", state: "Georgia", wAddressZip: "3030" })).toEqual(["5-digit ZIP code"]);
    expect(labels("wShippingAddress", {})).toEqual(["Street address", "City", "State", "5-digit ZIP code"]);
    expect(labels("w30", { w30: "yes" }, { enabled: true })).toEqual([]);
    expect(labels("wScalePhoto", {}, { enabled: true })).toEqual([]);
    expect(labels("w38", {}, { enabled: true })).toEqual([]);
  });

  it("excludes optional or invisible group fields while honoring conditional string-required details", () => {
    expect(labels("w05a", { w05a: "yes", w05j: "no" })).toEqual(["Pancreatitis details"]);
    expect(labels("w05a", { w05a: "no" })).toEqual(["Current severe symptoms"]);
    expect(labels("w05e", { w05e: "no" })).toEqual(["MEN2 history"]);
    expect(labels("w05g", { w05g: "no", w05h: "no" })).toEqual(["Diabetic retinopathy"]);
    expect(labels("w06d", {})).toEqual(["Smoking or vaping"]);
    expect(labels("w05details", { w05: ["bp", "other"] })).toEqual(["Blood pressure control", "Other condition details"]);
    expect(labels("w05details", { w05: ["bp"], w05BpControl: "yes" }, { enabled: true })).toEqual([]);
  });

  it("highlights only an unanswered visible sex or exercise follow-up once the main question is answered", () => {
    expect(labels("w14", { w14: "female" })).toEqual(["Current reproductive health"]);
    expect(items("w14", { w14: "female" })[0].selector).toBe('[data-mmd-field="w06"]');
    expect(labels("w14", { w14: ["female"] })[0]).toBe("Please choose an answer to continue.");
    expect(labels("w28", { w28: ["other"] })).toEqual(["Other exercise details"]);
    expect(items("w28", { w28: ["other"] })[0].selector).toBe('[data-mmd-field="w28Other"]');
    expect(labels("w05", { w05: ["none", "bp"] })[0]).toBe("Please choose at least one answer to continue.");
  });

  it("identifies only unfinished mandatory medication/allergy row fields and never optional extras", () => {
    expect(labels("w08", { w08: [{ name: "Synthetic", detail: "" }] })).toEqual(["Dosage"]);
    expect(labels("w10", { w10: [{ name: "", detail: "rash", extra: "" }] })).toEqual(["Allergy or reaction"]);
    expect(labels("w08", { w08: [{ name: "Synthetic", detail: "dose" }, { name: "", detail: "" }] })).toEqual(["Medication 2: Medication name", "Medication 2: Dosage"]);
  });

  it("retains the existing final missing-only list and never invents missing optional SMS consent", () => {
    const screen = find("w02");
    const result = Array.from(guidance.describe(screen, {}, { enabled: false, missingDetails: ["Clinical review confirmation"] })) as any[];
    expect(result.map(item => item.label)).toEqual(["Clinical review confirmation"]);
    expect(result[0].selector).toBe("#mmd-free-intake-ack");
    expect(labels("w02", {}, { missingDetails: ["Mobile number verification"] })).toEqual(["Mobile number verification"]);
    expect(labels("w02", {}, { enabled: true, missingDetails: [] })).toEqual([]);
  });

  it("reports actual signing state without requiring optional relation/date or altering manual signing logic", () => {
    const screen = { id: "wSignForms", type: "signForms" };
    const result = Array.from(guidance.describe(screen, {}, { signing: { name: true, signature: true, electronic: false, documents: [] } })) as any[];
    expect(result.map(item => item.label)).toEqual(["Full name", "Your signature"]);
    expect(result.map(item => item.selector)).toEqual([".sign-forms-field-name", ".sign-forms-signature-pad"]);
    const unchecked = Array.from(guidance.describe(screen, {}, { signing: { documents: [{ id: "privacy", title: "Notice of Privacy Practices" }] } })) as any[];
    expect(unchecked.map(item => item.label)).toEqual(["Notice of Privacy Practices"]);
    const ui = read("client/public/intake/sign-forms-ui.js");
    expect(ui).toContain('"data-mmd-missing-signature": !hasSignature ? "true" : "false"');
    expect(ui).toContain('var signingReady = Boolean(signatureName.trim()) && allDocumentsAccepted && electronicAgreement && hasSignature;');
    expect(ui).toContain('var signatureState = l.useState(false);');
  });

  it("explains asynchronous button locks as waiting, not missing fields", () => {
    expect(labels("w30", { w30: "yes" }, { uploadBusy: true })).toEqual(["Uploading your file. Please wait."]);
    expect(labels("w02", {}, { submitting: true })).toEqual(["Submitting your intake. Please wait."]);
  });

  it("keeps the exact native-disabled/aria-disabled gate, uses scoped nonoverlapping feedback and restores added ARIA attributes", () => {
    const action = (text: string) => text.slice(text.lastIndexOf('className:"primary",type:"button",disabled:submitting'), text.indexOf('onClick:onContinue', text.lastIndexOf('className:"primary",type:"button",disabled:submitting')));
    expect(action(source)).toBe(action(baseline));
    expect(source).toContain('.footer:has(.intake-continue-guidance){position:static;inset:auto}');
    expect(script).toContain('if (r.invalid === null) r.control.removeAttribute("aria-invalid")');
    expect(script).toContain('if (r.description === null) r.control.removeAttribute("aria-describedby")');
    expect(script).not.toMatch(/fetch\(|localStorage|sessionStorage|\.value\s*=|\.click\(/);
  });

  it("appends only exact approved HTML fragments and reverses the complete intake to 16e39af2", () => {
    expect(fragments.slice(0, prior.length)).toEqual(prior);
    let restored = source;
    for (const fragment of fragments.slice(prior.length).reverse()) { expect(restored.split(fragment.new).length - 1).toBe(fragment.count ?? 1); restored = restored.split(fragment.new).join(fragment.old); }
    expect(restored).toBe(baseline);
  });
});
