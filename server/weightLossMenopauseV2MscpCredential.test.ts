import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "46eba676fce14a593bef9515b3eb0f270d6ab129";
const root = resolve(import.meta.dirname, "..");
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const approvedHomepageMscpOptIn = "          showMscpCredential\n";
const approvedHomepageMscpDestructuredDefault = "  showMscpCredential = false,\n";
const approvedHomepageMscpType = "  showMscpCredential?: boolean;\n";
const approvedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");
const approvedHomepageMscpCredentialMap = "{credentialPills.map((pill) => (";
const defaultHomepageCredentialMap = "{CREDENTIAL_PILLS.map((pill) => (";
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;
const normalizeApprovedV2DoctorBioMscpCredential = (file: string, source: string) => {
  if (file !== doctorBioPath) return source;
  expect(count(source, approvedMscpCredential)).toBe(1);
  expect(count(source, approvedV2DoctorHeading)).toBe(1);
  return source
    .replace(approvedMscpCredential, "")
    .replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
};
const normalizeApprovedMasterclassMscpCredential = (file: string, source: string) => {
  if (file !== masterclassProfilePath) return source;
  expect(count(source, approvedMasterclassMscpCredentialLine)).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
};
const normalizeApprovedHomepageMscpCredential = (file: string, source: string) => {
  if (file === homepagePath) {
    expect(count(source, approvedHomepageMscpOptIn)).toBe(1);
    return source.replace(approvedHomepageMscpOptIn, "");
  }
  if (file !== homepageMedicalTeamPath) return source;
  expect(count(source, approvedHomepageMscpDestructuredDefault)).toBe(1);
  expect(count(source, approvedHomepageMscpType)).toBe(1);
  expect(count(source, approvedHomepageMscpCredentialSelection)).toBe(1);
  expect(count(source, approvedHomepageMscpCredentialMap)).toBe(1);
  return source
    .replace(approvedHomepageMscpDestructuredDefault, "")
    .replace(approvedHomepageMscpType, "")
    .replace(approvedHomepageMscpCredentialSelection, "")
    .replace(approvedHomepageMscpCredentialMap, defaultHomepageCredentialMap);
};

function credentials(source: string): string[] {
  return Array.from(
    (source.match(/const CREDENTIALS = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g),
    match => match[1],
  );
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => normalizeApprovedHomepageMscpCredential(file, normalizeApprovedMasterclassMscpCredential(file, normalizeApprovedV2SectionOrder(file, read(file)))) !== atBaseline(file));
}

function normalizeApprovedV2SectionOrder(path: string, source: string): string {
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

describe("Weight-Loss & Menopause V2 MSCP credential", () => {
  it("adds exactly one second credential to the existing six, preserving the exact seven-pill order", () => {
    const baselineCredentials = credentials(atBaseline(doctorBioPath));
    const currentCredentials = credentials(read(doctorBioPath));

    expect(baselineCredentials).toEqual([
      "Family Physician",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
    expect(currentCredentials).toEqual([
      "Family Physician",
      "Menopause Certified (MSCP)",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
    expect(currentCredentials).toHaveLength(7);
    expect(currentCredentials).toEqual([
      baselineCredentials[0],
      "Menopause Certified (MSCP)",
      ...baselineCredentials.slice(1),
    ]);
  });

  it("is exactly reversible to 46eba676fce14a593bef9515b3eb0f270d6ab129 by removing only the approved MSCP credential and full V2 heading", () => {
    expect(normalizeApprovedV2DoctorBioMscpCredential(doctorBioPath, read(doctorBioPath))).toBe(
      atBaseline(doctorBioPath),
    );
  });

  it("leaves every other production source at 46eba676fce14a593bef9515b3eb0f270d6ab129", () => {
    expect(changedProductionFiles()).toEqual([doctorBioPath]);
  });
});
