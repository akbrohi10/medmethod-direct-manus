import { createHash } from "node:crypto";
import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseApprovedLatePatientInfo, latePatientInfoFixturePath, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";
import { introDetailsPhotoFixturePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath } from "./intakeIntroDetailsPhotoScope.test";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths, thankYouWordingFixturePath } from "./intakeThankYouWordingScope.test";

const root = resolve(import.meta.dirname, "..");
const baseline = "1e99a10c";
const clientPath = "client/public/intake/video-visit.js";
const thankYouPath = "client/intake/thank-you/index.html";
const source = readFileSync(resolve(root, clientPath), "utf8");
const thankYou = readFileSync(resolve(root, thankYouPath), "utf8");
const baselineFile = (path: string) => execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root, encoding: "utf8" });

const titleCopy = "Check your text messages";
const bodyCopy = "You should receive a text from MedMethod Direct shortly. Please reply to our message so we can stay connected!";
const previousBodyCopy = "You should have received a text from MedMethod Direct, or you'll receive one shortly. Please reply to our message so we can stay connected!";
const oldTitleCopy = "Use your secure Patient Portal";
const oldBodyCopy = "Because you did not opt in to SMS, use your secure Patient Portal and welcome email for care updates and required forms.";
const oldLoader = '<script src="/intake/video-visit.js?v=intake-video-97-20261027"></script>';
const newLoader = '<script src="/intake/video-visit.js?v=intake-video-97-20261030-step1"></script>';

type Receipt = {
  submission_id: string;
  submission_token: string;
  sms_opt_in: boolean;
  video_visit_interest: boolean;
  is_test: boolean;
  payment_status: "NOT_REQUIRED";
};

type TextNode = { textContent: string };
type ApplySmsCopy = (receipt: Receipt) => void;

function functionSource(name: string, nextName: string) {
  const start = source.indexOf(`  function ${name}(`);
  const end = source.indexOf(`\n\n  function ${nextName}(`, start);
  if (start < 0 || end < 0) throw new Error(`Could not extract ${name}`);
  return source.slice(start, end);
}

function loadApplySmsCopy(nodes = new Map<string, TextNode>()) {
  const document = { getElementById: (id: string) => nodes.get(id) ?? null };
  const context = vm.createContext({ document });
  const harness = `${functionSource("byId", "safeJson")}\n${functionSource("applySmsCopy", "initializePage")}\nglobalThis.applySmsCopy = applySmsCopy;`;
  new vm.Script(harness, { filename: clientPath }).runInContext(context);
  return context.applySmsCopy as ApplySmsCopy;
}

function receipt(sms_opt_in: boolean): Receipt {
  return {
    submission_id: "synthetic-submission-id",
    submission_token: "synthetic-submission-token",
    sms_opt_in,
    video_visit_interest: false,
    is_test: true,
    payment_status: "NOT_REQUIRED",
  };
}

describe("intake thank-you Step 1 SMS copy", () => {
  it("keeps the approved heading and body for both SMS preference states without mutating the receipt", () => {
    const optInTitle = { textContent: titleCopy };
    const optInBody = { textContent: bodyCopy };
    const optInReceipt = receipt(true);
    const optInBefore = JSON.parse(JSON.stringify(optInReceipt));
    loadApplySmsCopy(new Map([
      ["care-message-title", optInTitle],
      ["care-message-copy", optInBody],
    ]))(optInReceipt);
    expect(optInTitle.textContent).toBe(titleCopy);
    expect(optInBody.textContent).toBe(bodyCopy);
    expect(optInReceipt).toEqual(optInBefore);

    const optOutTitle = { textContent: oldTitleCopy };
    const optOutBody = { textContent: oldBodyCopy };
    const optOutReceipt = receipt(false);
    const optOutBefore = JSON.parse(JSON.stringify(optOutReceipt));
    loadApplySmsCopy(new Map([
      ["care-message-title", optOutTitle],
      ["care-message-copy", optOutBody],
    ]))(optOutReceipt);
    expect(optOutTitle.textContent).toBe(titleCopy);
    expect(optOutBody.textContent).toBe(bodyCopy);
    expect(optOutReceipt).toEqual(optOutBefore);
  });

  it("is safe when either Step 1 DOM node is absent", () => {
    const optOutReceipt = receipt(false);
    const before = JSON.parse(JSON.stringify(optOutReceipt));
    expect(() => loadApplySmsCopy()(optOutReceipt)).not.toThrow();
    expect(optOutReceipt).toEqual(before);
  });

  it("keeps the static Step 1 markup exact", () => {
    expect(thankYou).toContain(`<strong id="care-message-title">${titleCopy}</strong><span id="care-message-copy">${bodyCopy}</span>`);
  });

  it("changes only the two authorized client literals from the clean baseline", () => {
    const expected = baselineFile(clientPath)
      .replace(oldTitleCopy, titleCopy)
      .replace(oldBodyCopy, previousBodyCopy);
    expect(inverseApprovedThankYouWording(clientPath, source)).toBe(expected);
  });

  it("changes only the thank-you loader cache key from the clean baseline", () => {
    expect(inverseApprovedThankYouWording(thankYouPath, thankYou)).toBe(baselineFile(thankYouPath).replace(oldLoader, newLoader));
  });

  it("leaves every other production source unchanged from the clean baseline", () => {
    const changedProductionPaths = [...new Set([
      ...execFileSync(
      "git",
      ["diff", "--name-only", baseline, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
      ).split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "client", "server", "shared"], { cwd: root, encoding: "utf8" }).split("\n"),
    ])]
      .filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `1e99a10c:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, readFileSync(resolve(root, path), "utf8")) !== baselineFile(path))
      .filter(path => ![thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(path))
      .filter((path) => path && !path.endsWith(".test.ts"))
      // No thank-you/UI change: the separately verified GHL notification is backend-only.
      .filter(path => !["server/_core/env.ts", "server/intakePaymentRoutes.ts", "server/ghlIntakeWebhookPayload.ts", "server/ghlIntakeWebhookQueue.ts"].includes(path))
      .filter(path => path !== latePatientInfoFixturePath)
      .filter(path => path !== introducedContinueGuidanceAssetPath)
      .filter(path => ![introDetailsPhotoFixturePath, introducedDoctorPortraitAssetPath].includes(path))
      .filter(path => !["client/intake/index.html", "client/public/intake/sign-forms-ui.js", introDetailsPhotoRegistrationPath, "server/intakeSubmissionContract.ts"].includes(path) || inverseApprovedLatePatientInfo(path, readFileSync(resolve(root, path), "utf8")) !== baselineFile(path))
      .sort();

    // Homepage and Masterclass trust-row additions have complete inverse guards in their dedicated tests.
    expect(changedProductionPaths).toEqual([
      thankYouPath,
      clientPath,
      "client/src/components/home1/MedicalTeam.tsx",
      "client/src/pages/HomeHrt3.tsx",
      "client/src/pages/Masterclass2.tsx",
    ].sort());
  });
});
