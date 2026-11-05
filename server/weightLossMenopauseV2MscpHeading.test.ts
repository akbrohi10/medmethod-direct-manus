import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "de623f2d";
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
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const unchangedPortraitAlt = 'alt="Dr. Jumana Al-Deek, DO, MS"';
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const approvedHomepageFamilyPhysicianOptIn = '          firstCredentialLabel="Family Physician"\n';
const approvedHomepageFamilyPhysicianDestructuredDefault = "  firstCredentialLabel = CREDENTIAL_PILLS[0],\n";
const approvedHomepageFamilyPhysicianType = "  firstCredentialLabel?: string;\n";
const approvedHomepageFamilyPhysicianCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];",
  "",
].join("\n");
const retainedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");
const approvedMscpTrustRowProps = '          mscpBadgeSrc="/manus-storage/mscp-badge-2026_09c3feaa.webp"\n          mscpBadgeFallbackSrc="https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp"\n';
const approvedMscpTrustRowDestructure = "  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,\n";
const approvedMscpTrustRowTypes = "  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;\n";
const approvedMscpTrustRowStart = "              {mscpBadgeSrc && (\n";
const approvedMscpTrustRowEnd = "              {/* Two clear booking paths.";

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function inverseApprovedMscpTrustRow(file: string, source: string): string {
  if (file === homepagePath) {
    expect(count(source, approvedMscpTrustRowProps)).toBe(1);
    return source.replace(approvedMscpTrustRowProps, "");
  }
  if (file !== homepageMedicalTeamPath) return source;
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
  if (file === homepagePath) {
    expect(count(source, approvedHomepageFamilyPhysicianOptIn)).toBe(1);
    return source.replace(approvedHomepageFamilyPhysicianOptIn, "");
  }
  if (file !== homepageMedicalTeamPath) return source;
  expect(count(source, approvedHomepageFamilyPhysicianDestructuredDefault)).toBe(1);
  expect(count(source, approvedHomepageFamilyPhysicianType)).toBe(1);
  expect(count(source, approvedHomepageFamilyPhysicianCredentialSelection)).toBe(1);
  return source
    .replace(approvedHomepageFamilyPhysicianDestructuredDefault, "")
    .replace(approvedHomepageFamilyPhysicianType, "")
    .replace(approvedHomepageFamilyPhysicianCredentialSelection, retainedHomepageMscpCredentialSelection);
}

function normalizeApprovedV2DoctorHeading(file: string, source: string): string {
  if (file !== doctorBioPath) return source;
  expect(count(source, approvedV2DoctorHeading)).toBe(1);
  return source.replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `de623f2d:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedWeightCareRegressionPaths.has(file))
    .filter(file => !approvedThankYouNextStepsPaths.has(file))
    .filter(file => normalizeApprovedHomepageFamilyPhysicianCredential(file, normalizeApprovedV2DoctorHeading(file, normalizeApprovedV2SectionOrder(file, read(file)))) !== atBaseline(file));
}

function normalizeApprovedV2SectionOrder(path: string, source: string): string {
  source = inverseApprovedV2HeroQuestion(path, source);
  if (path !== "client/src/pages/WeightLossMenopauseV2.tsx") return source;
  const medicationPricingStart = '<section className="medication-pricing"';
  const estimatorStart = '<section className="estimator-band"';
  const doctorBioMount = "<WeightLossMenopauseV2DoctorBio />";
  const faqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
  const count = (value: string) => source.split(value).length - 1;
  if (count(medicationPricingStart) !== 1 || count(estimatorStart) !== 1 || count(doctorBioMount) !== 1 || count(faqMount) !== 1) {
    throw new Error("Expected exactly one approved V2 medication/estimator reorder boundary");
  }
  const medicationStart = source.indexOf(medicationPricingStart);
  const doctorStart = source.indexOf(doctorBioMount);
  const faqStart = source.indexOf(faqMount);
  if (medicationStart <= doctorStart || medicationStart >= faqStart) {
    throw new Error("Expected medication and estimator block only between doctor bio and final FAQ");
  }
  const medicationAndEstimator = source.slice(medicationStart, faqStart);
  if (!medicationAndEstimator.includes(estimatorStart) || !medicationAndEstimator.endsWith("\n")) {
    throw new Error("Expected the exact adjacent medication and estimator block with its trailing newline");
  }
  const withoutMedicationAndEstimator = source.slice(0, medicationStart) + source.slice(faqStart);
  const restoredDoctorStart = withoutMedicationAndEstimator.indexOf(doctorBioMount);
  if (restoredDoctorStart < 0) throw new Error("Missing V2 doctor-bio restoration anchor");
  return withoutMedicationAndEstimator.slice(0, restoredDoctorStart)
    + medicationAndEstimator
    + withoutMedicationAndEstimator.slice(restoredDoctorStart);
}

describe("Weight-Loss & Menopause V2 MSCP doctor heading", () => {
  it("uses exactly one approved full doctor h2 and no prior V2 heading", () => {
    const doctorBio = read(doctorBioPath);
    const h2s = doctorBio.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/g) ?? [];

    expect(count(doctorBio, approvedV2DoctorHeading)).toBe(1);
    expect(count(doctorBio, baselineV2DoctorHeading)).toBe(0);
    expect(h2s).toEqual([approvedV2DoctorHeading]);
  });

  it("is byte-identical to de623f2d after only the exact one-h2 inverse", () => {
    expect(normalizeApprovedV2DoctorHeading(doctorBioPath, read(doctorBioPath))).toBe(
      atBaseline(doctorBioPath),
    );
  });

  it("keeps both portrait alts byte-identical and does not add MSCP to either alt", () => {
    const doctorBio = read(doctorBioPath);

    expect(doctorBio.match(/alt="Dr\. Jumana Al-Deek, DO, MS"/g)).toHaveLength(2);
    expect(doctorBio).not.toContain('alt="Dr. Jumana Al-Deek, DO, MS, MSCP"');
    expect(doctorBio.match(/alt="[^"]+"/g)).toEqual(atBaseline(doctorBioPath).match(/alt="[^"]+"/g));
    expect(count(doctorBio, unchangedPortraitAlt)).toBe(2);
  });

  it("leaves every other production byte at de623f2d apart from separately verified thank-you copy", () => {
    expect(changedProductionFiles()).toEqual([]);
  });
});
