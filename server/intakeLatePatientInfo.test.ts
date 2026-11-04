import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
const baseline = execFileSync("git", ["show", "87fcd00d:client/intake/index.html"], { cwd: root, encoding: "utf8" });
const fragments = JSON.parse(readFileSync(resolve(root, "server/fixtures/intakeLatePatientInfoFragments.json"), "utf8")) as Array<{ old: string; new: string; count?: number }>;
const metadata = JSON.parse(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
const originalMetadata = JSON.parse(baseline.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
const catalog = metadata.w.screens as Array<{ id: string; type: string; [key: string]: unknown }>;
const fn = (name: string) => {
  const start = source.lastIndexOf(`function ${name}(`);
  const end = source.indexOf("function ", start + 12);
  return source.slice(start, end);
};
const helperCode = fn("MmdIntakeFlowScreens") + fn("MmdIntakeLateDetails");
const helpers = new Function("w", helperCode + ";return {MmdIntakeFlowScreens,MmdIntakeLateDetails}")((_route: string, _answers: unknown) => catalog) as {
  MmdIntakeFlowScreens: (answers: unknown) => typeof catalog;
  MmdIntakeLateDetails: (screen: unknown) => boolean;
};

function updater(screen: { id: string; type: string }, initial: Record<string, unknown>) {
  const appStart = source.lastIndexOf("function $e()");
  const start = source.indexOf("const onValue=", appStart);
  const end = source.indexOf(";const onPhoneVerified=", start);
  let answers = { ...initial };
  let formsReady = true;
  const code = source.slice(start, end) + ";return onValue";
  const update = new Function("screen", "demo", "returnScreen", "setFormsReady", "setAnswers", "MmdIntakeLateDetails", "k", "Fe", "ce", code)(
    screen, false, null, (value: boolean) => { formsReady = value; },
    (callback: (previous: Record<string, unknown>) => Record<string, unknown>) => { answers = callback(answers); },
    helpers.MmdIntakeLateDetails,
    () => { throw new Error("Late identity and video controls must not invoke destructive cleanup"); },
    (value: unknown) => String(value ?? "").replace(/\D/g, ""),
    (_value: unknown, next: unknown) => next,
  ) as (key: string, value: unknown) => void;
  return { update, state: () => ({ answers, formsReady }) };
}

describe("Weight Care late patient info and doctor introduction", () => {
  it("preserves every catalog question, option, clinical visibility, price and metadata byte-for-byte", () => {
    expect(metadata).toEqual(originalMetadata);
    expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]).toBe(baseline.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
  });

  it("starts with treatment then measurements and puts labs and the exact requested tail after the last health question", () => {
    const flow = helpers.MmdIntakeFlowScreens({});
    expect(flow.slice(0, 2).map(screen => screen.id)).toEqual(["w04", "w03"]);
    expect(flow.slice(-8).map(screen => screen.id)).toEqual(["w37", "w30", "wShippingAddress", "wScalePhoto", "w38", "wSignForms", "w01", "w02"]);
    const tail = new Set(["w30", "wShippingAddress", "wScalePhoto", "w38", "w01", "w02", "w39"]);
    const preserved = catalog.filter(screen => !tail.has(screen.id) && screen.id !== "w03a" && !["wReview", "planReview", "checkout"].includes(screen.type));
    expect(flow.slice(0, -7)).toEqual(preserved);
    expect(new Set(flow.map(screen => screen.id)).size).toBe(flow.length);
  });

  it("uses the new first screen for both ordinary and demo entry and preserves URL video=1 interest", () => {
    expect(source).toContain('screens.find(item=>item.id===currentId)??screens[0]');
    expect(source).toContain('setCurrentId(MmdIntakeFlowScreens(preset)[0]?.id??null)');
    expect(source.match(/videoVisitInterest:new URLSearchParams\(window.location.search\).get\("video"\)===\"1\"/g)).toHaveLength(2);
    expect(source).not.toContain("videoVisitInterest:true");
  });

  it("preserves signed consent, health answers, uploads and shipping while entering late identity", () => {
    const initial = { w03: "retained", ft: "5", inch: "6", lb: "180", w05: ["none"], w31: "retained", w37: "yes", w38: "retained", wConsent: true, wConsentAt: "2026-11-04T16:00:00.000Z", labUploadRefs: [{ upload_id: "synthetic" }], scaleUploadRef: null, state: "Georgia", wAddressCity: "Atlanta", wAddressLine1: "Synthetic Street", wAddressZip: "30303", videoVisitInterest: true };
    const u = updater({ id: "w02", type: "identity" }, initial);
    for (const [key, value] of Object.entries({ first: "Jamie", last: "Example", dobMonth: "1", dobDay: "15", dobYear: "1985", email: "synthetic@example.test", phone: "2025550188", terms: true, smsOptIn: false })) u.update(key, value);
    expect(u.state().formsReady).toBe(true);
    expect(u.state().answers).toMatchObject(initial);
    expect(u.state().answers).toMatchObject({ first: "Jamie", last: "Example", terms: true });
  });

  it("keeps signature readiness when toggling the late video checkbox and uses one state everywhere", () => {
    const u = updater({ id: "w01", type: "overview" }, { wConsent: true, state: "Georgia", w37: "yes" });
    u.update("videoVisitInterest", true);
    expect(u.state()).toEqual({ formsReady: true, answers: { wConsent: true, state: "Georgia", w37: "yes", videoVisitInterest: true } });
    u.update("videoVisitInterest", false);
    expect(u.state().formsReady).toBe(true);
    const identity = updater({ id: "w02", type: "identity" }, u.state().answers);
    identity.update("state", "Florida");
    expect(identity.state().answers.state).toBe("Florida");
    expect(identity.state().answers.w37).toBe("yes");
    expect(fn("MmdShippingAddress")).toContain('onChange:e=>t(`state`,e.target.value)');
    expect(fn("MmdShippingAddress")).toContain('y.map(e=>(0,M.jsx)(`option`,{children:e},e))');
    expect(source).toContain('value:String(t.state??``),onChange:e=>n(`state`,e.target.value)');
    expect(fn("be")).toContain('state:ae(t.state),state_name:String(t.state??``).trim()');
  });

  it("keeps mobile-token invalidation on number changes without discarding the signed forms", () => {
    const u = updater({ id: "w02", type: "identity" }, { phone: "2025550188", phoneVerified: true, phoneVerificationToken: "TEST", phoneVerificationExpiresAt: Date.now() + 60000, wConsent: true });
    u.update("phone", "2025550199");
    expect(u.state().answers).not.toHaveProperty("phoneVerified");
    expect(u.state().answers).not.toHaveProperty("phoneVerificationToken");
    expect(u.state().answers.wConsent).toBe(true);
    expect(u.state().formsReady).toBe(true);
  });

  it("does not clear later health answers or canonical identity when answering labs in the new late position", () => {
    const clear = new Function("MmdIntakeFlowScreens", "MmdIntakeLateDetails", "O", fn("k") + ";return k")(
      helpers.MmdIntakeFlowScreens, helpers.MmdIntakeLateDetails,
      (screen: { id: string; type: string }) => screen.type === "consent" ? ["wConsent", "wDecline"] : [screen.id],
    ) as (route: string, id: string, answers: Record<string, unknown>) => Record<string, unknown>;
    const next = clear("w", "w30", { first: "Jamie", state: "Georgia", w31: "retained", w37: "yes", w38: "clear later notes", wConsent: true });
    expect(next).toMatchObject({ first: "Jamie", state: "Georgia", w31: "retained", w37: "yes" });
    expect(next).not.toHaveProperty("w38");
    expect(next).not.toHaveProperty("wConsent");
  });

  it("computes progress from the rendered reordered sequence, including signing and late identity", () => {
    const progress = new Function("MmdIntakeFlowScreens", fn("de") + ";return de")(helpers.MmdIntakeFlowScreens) as (route: string, id: string, answers: unknown) => number;
    const values = helpers.MmdIntakeFlowScreens({}).map(screen => progress("w", screen.id, {}));
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(values.at(-1)).toBe(100);
    expect(values[0]).toBeLessThan(10);
  });

  it("makes exactly the approved reversible changes, including only the new teal doctor-card CSS", () => {
    let restored = source;
    for (const fragment of [...fragments].reverse()) {
      expect(restored.split(fragment.new).length - 1).toBe(fragment.count ?? 1);
      restored = restored.split(fragment.new).join(fragment.old);
    }
    expect(restored).toBe(baseline);
    expect(source).not.toContain("[CREDENTIAL LINE]");
    expect(fn("Ge")).toContain('/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp');
    expect(fn("Ge")).toContain('Dr. Al-Deek personally reviews every intake and will text you after you submit.');
  });
});
