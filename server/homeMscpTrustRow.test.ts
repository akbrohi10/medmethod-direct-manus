import { createHash } from "node:crypto"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope";
import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedLatePatientInfo, latePatientInfoFixturePath, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";
import { introDetailsPhotoFixturePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath } from "./intakeIntroDetailsPhotoScope.test";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths, thankYouWordingFixturePath } from "./intakeThankYouWordingScope.test";

const baseline = "59e7c056";
const root = resolve(import.meta.dirname, "..");
const homePath = "client/src/pages/HomeHrt3.tsx";
const medicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const masterclassPath = "client/src/pages/Masterclass2.tsx";
const mscpBadgeSrc = "/manus-storage/mscp-badge-2026_09c3feaa.webp";
const mscpBadgeFallbackSrc = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp";
const approvedBadgeProps = [
  `          mscpBadgeSrc="${mscpBadgeSrc}"`,
  `          mscpBadgeFallbackSrc="${mscpBadgeFallbackSrc}"`,
].join("\n");
const approvedMedicalTeamDestructure = "  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,\n";
const approvedMedicalTeamTypes = "  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;\n";
const trustRowStart = "              {mscpBadgeSrc && (\n";
const trustRowEnd = "              {/* Two clear booking paths.";
const masterclassMscpTrustRowStart = '\n          <div data-masterclass-mscp-trust-row className="mx-auto mt-5 flex w-full max-w-[640px] items-center gap-3 text-left">';
const masterclassMscpTrustRowEnd = "\n          <div data-masterclass2-connection-rows";

const read = (file: string) => inverseHormoneQuizPrivacy(file, readFileSync(resolve(root, file), "utf8"));
const atBaseline = (file: string) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function inverseApprovedMscpTrustRow(file: string, source: string): string {
  if (file === masterclassPath) {
    expect(count(source, masterclassMscpTrustRowStart)).toBe(1);
    const start = source.indexOf(masterclassMscpTrustRowStart);
    const end = source.indexOf(masterclassMscpTrustRowEnd, start);
    expect(end).toBeGreaterThan(start);
    return source.slice(0, start) + source.slice(end);
  }

  if (file === homePath) {
    expect(count(source, approvedBadgeProps)).toBe(1);
    return source.replace(`${approvedBadgeProps}\n`, "");
  }

  if (file !== medicalTeamPath) return source;

  expect(count(source, approvedMedicalTeamDestructure)).toBe(1);
  expect(count(source, approvedMedicalTeamTypes)).toBe(1);
  expect(count(source, trustRowStart)).toBe(1);
  expect(count(source, trustRowEnd)).toBe(1);
  const withoutBadgeProps = source
    .replace(approvedMedicalTeamDestructure, "")
    .replace(approvedMedicalTeamTypes, "");
  const start = withoutBadgeProps.indexOf(trustRowStart);
  const end = withoutBadgeProps.indexOf(trustRowEnd);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return withoutBadgeProps.slice(0, start) + withoutBadgeProps.slice(end);
}

function changedProductionFiles(): string[] {
  return [...new Set([
    ...execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
    }).split("\n"),
    ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "client", "server", "shared"], { cwd: root, encoding: "utf8" }).split("\n"),
  ])]
    .filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "package.json", "server/routers.ts"].includes(p); } return true; }).filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts" ? "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668" : p === "server/fixtures/hormoneQuizPanelScope.ts" ? "f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798" : p === "server/fixtures/hormoneQuizPhoneScope.ts" ? "a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25" : null; if (!hash) return true; expect(createHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(root, p), "utf8")))).digest("hex")).toBe(hash); return false; }).filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, inverseHormoneQuizPrivacy(p, readFileSync(resolve(process.cwd(), p), "utf8"))) !== execFileSync("git", ["show", `59e7c056:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
    .filter(file => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === file) || inverseApprovedThankYouWording(file, read(file)) !== atBaseline(file))
    .filter(file => ![thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(file))
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    // Separately authorized backend-only notification; dedicated GHL suites protect its scope.
    .filter(file => !["server/_core/env.ts", "server/intakePaymentRoutes.ts", "server/ghlIntakeWebhookPayload.ts", "server/ghlIntakeWebhookQueue.ts"].includes(file))
    .filter(file => file !== latePatientInfoFixturePath)
    .filter(file => file !== introducedContinueGuidanceAssetPath)
    .filter(file => ![introDetailsPhotoFixturePath, introducedDoctorPortraitAssetPath].includes(file))
    .filter(file => !["client/intake/index.html", "client/public/intake/sign-forms-ui.js", introDetailsPhotoRegistrationPath, "server/intakeSubmissionContract.ts"].includes(file) || inverseApprovedLatePatientInfo(file, read(file)) !== atBaseline(file))
    .filter(file => file !== masterclassPath || inverseApprovedMscpTrustRow(file, read(file)) !== atBaseline(file));
}

describe("homepage-only MSCP trust row", () => {
  it("adds the exact visible copy, badge accessibility, and approved responsive dimensions", () => {
    const medicalTeam = read(medicalTeamPath);

    expect(count(medicalTeam, "Certified menopause expertise.")).toBe(1);
    expect(count(medicalTeam, "Dr. Al-Deek is a Menopause Society Certified Practitioner.")).toBe(1);
    expect(count(medicalTeam, 'alt="2026 Menopause Society Certified Practitioner badge"')).toBe(1);
    expect(count(medicalTeam, "width={80}")).toBe(1);
    expect(count(medicalTeam, "height={80}")).toBe(1);
    expect(medicalTeam).toContain('className="h-[72px] w-[72px] shrink-0 object-contain sm:h-20 sm:w-20"');
  });

  it("renders directly after patient-volume proof and before the hero CTA sentinel", () => {
    const medicalTeam = read(medicalTeamPath);
    const proof = medicalTeam.indexOf("data-home-patient-volume-proof");
    const trustRow = medicalTeam.indexOf("data-home-mscp-trust-row");
    const ctaSentinel = medicalTeam.indexOf('id="hero-cta-sentinel"');

    expect(proof).toBeGreaterThan(-1);
    expect(trustRow).toBeGreaterThan(proof);
    expect(ctaSentinel).toBeGreaterThan(trustRow);
  });

  it("keeps the shared component default-off and opts in only the root homepage with the exact two asset URLs", () => {
    const home = read(homePath);
    const medicalTeam = read(medicalTeamPath);
    const homeMedicalTeamCall = home.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";

    expect(medicalTeam).toContain("  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,");
    expect(medicalTeam).toContain("  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;");
    expect(medicalTeam).toContain("{mscpBadgeSrc && (");
    expect(count(home, approvedBadgeProps)).toBe(1);
    expect(homeMedicalTeamCall).toContain(approvedBadgeProps);
    expect(count(home, "mscpBadgeSrc")).toBe(1);
    expect(count(home, "mscpBadgeFallbackSrc")).toBe(1);
    expect(count(medicalTeam, "mscpBadgeSrc")).toBe(4);
    expect(count(medicalTeam, "mscpBadgeFallbackSrc")).toBe(4);
  });

  it("uses the fallback at most once after a badge load error", () => {
    const medicalTeam = read(medicalTeamPath);
    const errorHandler = medicalTeam.match(/onError=\{\(event\) => \{[\s\S]*?\n                    \}\}/)?.[0] ?? "";

    expect(errorHandler).toContain('image.dataset.fallbackUsed !== "true"');
    expect(errorHandler).toContain('image.dataset.fallbackUsed = "true"');
    expect(errorHandler).toContain("image.src = mscpBadgeFallbackSrc;");
    expect(count(errorHandler, "image.src = mscpBadgeFallbackSrc;")).toBe(1);
    expect(errorHandler.indexOf('image.dataset.fallbackUsed = "true"')).toBeLessThan(
      errorHandler.indexOf("image.src = mscpBadgeFallbackSrc;"),
    );
  });

  it("is exactly reversible to 59e7c056 through only the two approved source inverses", () => {
    expect(inverseApprovedMscpTrustRow(homePath, read(homePath))).toBe(atBaseline(homePath));
    expect(inverseApprovedMscpTrustRow(medicalTeamPath, read(medicalTeamPath))).toBe(
      atBaseline(medicalTeamPath),
    );
  });

  it("changes no other production source relative to 59e7c056", () => {
    expect(changedProductionFiles()).toEqual([medicalTeamPath, homePath]);
  });
});
