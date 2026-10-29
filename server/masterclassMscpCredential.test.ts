import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "ad6831863ae44e57f573ac3ed4741d52fc47e33d";
const root = resolve(import.meta.dirname, "..");
const profilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const approvedMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
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
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function credentialPills(source: string): string[] {
  const initializer = source.match(/const CREDENTIAL_PILLS = \[([\s\S]*?)\];/)?.[1] ?? "";
  expect(initializer).not.toBe("");
  return Array.from(initializer.matchAll(/"([^"]+)"/g), match => match[1]);
}

function normalizeApprovedHomepageMscpCredential(file: string, source: string): string {
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
}

function normalizeApprovedV2DoctorHeading(file: string, source: string): string {
  if (file !== v2DoctorBioPath) return source;
  expect(count(source, approvedV2DoctorHeading)).toBe(1);
  return source.replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => normalizeApprovedHomepageMscpCredential(file, normalizeApprovedV2DoctorHeading(file, read(file))) !== atBaseline(file));
}

describe("Masterclass MSCP credential", () => {
  it("has the exact approved seven-pill credential order", () => {
    expect(credentialPills(read(profilePath))).toEqual([
      "Family Physician",
      "Menopause Certified (MSCP)",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
  });

  it("is exactly reversible to ad6831863ae44e57f573ac3ed4741d52fc47e33d by removing the one approved line", () => {
    const profile = read(profilePath);

    expect(count(profile, approvedMscpCredentialLine)).toBe(1);
    expect(profile.replace(approvedMscpCredentialLine, "")).toBe(atBaseline(profilePath));
  });

  it("leaves every other production source unchanged since ad6831863ae44e57f573ac3ed4741d52fc47e33d", () => {
    expect(changedProductionFiles()).toEqual([profilePath]);
  });
});
