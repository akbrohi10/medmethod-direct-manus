import { createHash } from "node:crypto"; import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "bee1e5469e673a1d0947add4b46803074838a2c2";
const root = resolve(import.meta.dirname, "..");

// Separately approved WeightCare and signed-intake paths are covered independently.
// Keep all other sources frozen.
const approvedWeightCareRegressionPaths = new Set([
  finalProgressLabelFixturePath,
  "client/intake/index.html",
  "client/public/intake/weight-care-uploads.js",
  "client/public/intake/weight-care-uploads.css",
  "client/public/intake/sign-forms-data.js",
  "client/public/intake/sign-forms-ui.js",
  "client/public/intake/sign-forms.css",
  "server/fixtures/intakeSigningFixture.ts",
  "server/fixtures/intake-sign-forms-copy.json",
  "server/intakePaymentRoutes.ts",
  "server/intakeSubmissionContract.ts",
  "server/intakePrivateUploads.ts",
  "server/intakeSignedFormsStore.ts",
  "server/intakeSignedPdf.ts",
  "server/intakeSigningInput.ts",
  "server/intakeTestAuthorization.ts",
  "shared/intakeSignForms.json",
]);
// Exact inverse coverage for these separately approved copy-only deltas lives in thankYouNextStepsCopy.test.ts.
const approvedThankYouNextStepsPaths = new Set([
  "client/intake/thank-you/index.html",
  "client/src/pages/ThankYouVideo.tsx",
]);
const homePath = "client/src/pages/HomeHrt3.tsx";
const lpHrt3Path = "client/src/pages/LpHrt3.tsx";
const medicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";

const approvedHomeFirstCredentialLabel = '          firstCredentialLabel="Family Physician"\n';
const approvedDestructuredDefault = "  firstCredentialLabel = CREDENTIAL_PILLS[0],\n";
const approvedType = "  firstCredentialLabel?: string;\n";
const approvedMscpFirstCredentialSelection =
  '    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]';
const approvedDefaultFirstCredentialSelection =
  "    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];";
const retainedMscpFirstCredentialSelection =
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]';
const retainedDefaultFirstCredentialSelection = "    : CREDENTIAL_PILLS;";
const approvedMscpTrustRowProps = '          mscpBadgeSrc="/manus-storage/mscp-badge-2026_09c3feaa.webp"\n          mscpBadgeFallbackSrc="https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp"\n';
const approvedMscpTrustRowDestructure = "  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,\n";
const approvedMscpTrustRowTypes = "  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;\n";
const approvedMscpTrustRowStart = "              {mscpBadgeSrc && (\n";
const approvedMscpTrustRowEnd = "              {/* Two clear booking paths.";
const credentialPillRender = "{credentialPills.map((pill) => (";
const defaultCredentialPillStyles = [
  'className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide"',
  'fontFamily: "Montserrat, sans-serif",',
  'background: "#F4E8EE",',
  'color: "#7A1E7E",',
  'border: "1px solid #E8D5DC",',
];

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function credentialPills(source: string): string[] {
  const initializer = source.match(/const CREDENTIAL_PILLS = \[([\s\S]*?)\];/)?.[1] ?? "";
  expect(initializer).not.toBe("");
  return Array.from(initializer.matchAll(/"([^"]+)"/g), match => match[1]);
}

function inverseApprovedMscpTrustRow(file: string, source: string): string {
  if (file === homePath) {
    expect(count(source, approvedMscpTrustRowProps)).toBe(1);
    return source.replace(approvedMscpTrustRowProps, "");
  }
  if (file !== medicalTeamPath) return source;
  expect(count(source, approvedMscpTrustRowDestructure)).toBe(1);
  expect(count(source, approvedMscpTrustRowTypes)).toBe(1);
  const withoutBadgeProps = source
    .replace(approvedMscpTrustRowDestructure, "")
    .replace(approvedMscpTrustRowTypes, "");
  const start = withoutBadgeProps.indexOf(approvedMscpTrustRowStart);
  const end = withoutBadgeProps.indexOf(approvedMscpTrustRowEnd);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return withoutBadgeProps.slice(0, start) + withoutBadgeProps.slice(end);
}

function normalizeApprovedHomepageFamilyPhysicianCredential(file: string, source: string): string {
  source = inverseApprovedMscpTrustRow(file, source);
  if (file === homePath) {
    expect(count(source, approvedHomeFirstCredentialLabel)).toBe(1);
    return source.replace(approvedHomeFirstCredentialLabel, "");
  }

  if (file !== medicalTeamPath) return source;

  expect(count(source, approvedDestructuredDefault)).toBe(1);
  expect(count(source, approvedType)).toBe(1);
  expect(count(source, approvedMscpFirstCredentialSelection)).toBe(1);
  expect(count(source, approvedDefaultFirstCredentialSelection)).toBe(1);
  return source
    .replace(approvedDestructuredDefault, "")
    .replace(approvedType, "")
    .replace(approvedMscpFirstCredentialSelection, retainedMscpFirstCredentialSelection)
    .replace(approvedDefaultFirstCredentialSelection, retainedDefaultFirstCredentialSelection);
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(integrationReadFileSync(resolve(process.cwd(), p), "utf8")).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "server/routers.ts"].includes(p); } return true; }).filter(Boolean).filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts" ? "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668" : p === "server/fixtures/hormoneQuizPanelScope.ts" ? "f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798" : p === "server/fixtures/hormoneQuizPhoneScope.ts" ? "a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25" : null; if (!hash) return true; expect(createHash("sha256").update(inverseHormoneQuizIntegration(p, readFileSync(resolve(root, p), "utf8"))).digest("hex")).toBe(hash); return false; }).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `bee1e5469e673a1d0947add4b46803074838a2c2:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedWeightCareRegressionPaths.has(file))
    .filter(file => !approvedThankYouNextStepsPaths.has(file));
}

describe("homepage-only Family Physician credential", () => {
  it("keeps Board-Certified DO as the shared default and supplies Family Physician only from the main homepage", () => {
    const medicalTeam = read(medicalTeamPath);
    const home = read(homePath);
    const lpHrt3 = read(lpHrt3Path);
    const defaultCredentials = credentialPills(medicalTeam);
    const homeMedicalTeamCall = home.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";
    const lpHrt3MedicalTeamCall = lpHrt3.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";

    expect(defaultCredentials).toEqual([
      "Board-Certified DO",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
    expect(defaultCredentials).toHaveLength(6);
    expect(medicalTeam).toContain(approvedDestructuredDefault.trim());
    expect(medicalTeam).toContain(approvedType.trim());
    expect(medicalTeam).toContain(approvedMscpFirstCredentialSelection);
    expect(medicalTeam).toContain(approvedDefaultFirstCredentialSelection);

    const homepageCredentials = [
      "Family Physician",
      "Menopause Certified (MSCP)",
      ...defaultCredentials.slice(1),
    ];
    const lpHrt3Credentials = [defaultCredentials[0], ...defaultCredentials.slice(1)];
    expect(homepageCredentials).toEqual([
      "Family Physician",
      "Menopause Certified (MSCP)",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
    expect(homepageCredentials).toHaveLength(7);
    expect(lpHrt3Credentials).toEqual(defaultCredentials);
    expect(lpHrt3Credentials).toHaveLength(6);

    expect(homeMedicalTeamCall).toContain(
      'hideBullets\n          showMscpCredential\n          firstCredentialLabel="Family Physician"',
    );
    expect(lpHrt3MedicalTeamCall).not.toContain("firstCredentialLabel");
    expect(count(home, approvedHomeFirstCredentialLabel)).toBe(1);
    expect(count(lpHrt3, "firstCredentialLabel")).toBe(0);
  });

  it("preserves the credential pill render, styles, and default board-certified physician bio copy", () => {
    const medicalTeam = read(medicalTeamPath);

    expect(medicalTeam).toContain(credentialPillRender);
    for (const style of defaultCredentialPillStyles) {
      expect(medicalTeam).toContain(style);
    }
    expect(medicalTeam).toContain("Dr. Al-Deek is a board-certified physician, menopause specialist, and author of");
    expect(count(medicalTeam, '"Board-Certified DO"')).toBe(1);
  });

  it("is exactly reversible to bee1e5469e673a1d0947add4b46803074838a2c2 through four component fragments and one homepage line", () => {
    expect(normalizeApprovedHomepageFamilyPhysicianCredential(homePath, read(homePath))).toBe(atBaseline(homePath));
    expect(normalizeApprovedHomepageFamilyPhysicianCredential(medicalTeamPath, read(medicalTeamPath))).toBe(
      atBaseline(medicalTeamPath),
    );
  });

  it("leaves LP HRT3 and every other production source unchanged apart from separately verified thank-you copy", () => {
    expect(read(lpHrt3Path)).toBe(atBaseline(lpHrt3Path));
    expect(changedProductionFiles()).toEqual([medicalTeamPath, homePath]);
  });
});
