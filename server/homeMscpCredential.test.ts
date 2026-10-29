import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "ede96ffe";
const root = resolve(import.meta.dirname, "..");
const homePath = "client/src/pages/HomeHrt3.tsx";
const medicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const lpHrt3Path = "client/src/pages/LpHrt3.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const v2PagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const approvedHomeOptIn = "          showMscpCredential\n";
const approvedDestructuredDefault = "  showMscpCredential = false,\n";
const approvedType = "  showMscpCredential?: boolean;\n";
const approvedCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");
const approvedCredentialMap = "{credentialPills.map((pill) => (";
const defaultCredentialMap = "{CREDENTIAL_PILLS.map((pill) => (";
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function credentialPills(source: string): string[] {
  const initializer = source.match(/const CREDENTIAL_PILLS = \[([\s\S]*?)\];/)?.[1] ?? "";
  expect(initializer).not.toBe("");
  return Array.from(initializer.matchAll(/"([^"]+)"/g), match => match[1]);
}

function normalizeApprovedHomepageMscpCredential(file: string, source: string): string {
  if (file === homePath) {
    expect(count(source, approvedHomeOptIn)).toBe(1);
    return source.replace(approvedHomeOptIn, "");
  }

  if (file === medicalTeamPath) {
    expect(count(source, approvedDestructuredDefault)).toBe(1);
    expect(count(source, approvedType)).toBe(1);
    expect(count(source, approvedCredentialSelection)).toBe(1);
    expect(count(source, approvedCredentialMap)).toBe(1);
    return source
      .replace(approvedDestructuredDefault, "")
      .replace(approvedType, "")
      .replace(approvedCredentialSelection, "")
      .replace(approvedCredentialMap, defaultCredentialMap);
  }

  return source;
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

describe("homepage-only MSCP credential", () => {
  it("retains the default six-credential constant and inserts MSCP only as the second opted-in pill", () => {
    const medicalTeam = read(medicalTeamPath);
    const defaultCredentials = credentialPills(medicalTeam);

    expect(defaultCredentials).toEqual([
      "Board-Certified DO",
      "Menopause Specialist",
      "Metabolism",
      "Author",
      "Mom of Four",
      "Licensed in 12 states",
    ]);
    expect(defaultCredentials).toHaveLength(6);
    expect(medicalTeam).toContain("showMscpCredential = false");
    expect(medicalTeam).toContain("showMscpCredential?: boolean;");
    expect(medicalTeam).toContain(
      '? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
    );
    expect(medicalTeam).toContain(": CREDENTIAL_PILLS;");
    expect(medicalTeam).toContain(approvedCredentialMap);
    expect(medicalTeam).not.toContain(defaultCredentialMap);
  });

  it("opts in only the root homepage while /lp/hrt3 continues using the default shared-component credentials", () => {
    const home = read(homePath);
    const lpHrt3 = read(lpHrt3Path);
    const homeMedicalTeamCall = home.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";
    const lpHrt3MedicalTeamCall = lpHrt3.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";

    expect(homeMedicalTeamCall).toContain("hideBullets\n          showMscpCredential");
    expect(homeMedicalTeamCall).toContain("showMscpCredential");
    expect(lpHrt3MedicalTeamCall).not.toContain("showMscpCredential");
    expect(count(home, "showMscpCredential")).toBe(1);
    expect(count(lpHrt3, "showMscpCredential")).toBe(0);
  });

  it("is exactly reversible to ede96ffe through only the two authorized source inverses", () => {
    expect(normalizeApprovedHomepageMscpCredential(homePath, read(homePath))).toBe(atBaseline(homePath));
    expect(normalizeApprovedHomepageMscpCredential(medicalTeamPath, read(medicalTeamPath))).toBe(
      atBaseline(medicalTeamPath),
    );
  });

  it("leaves all other production sources unchanged, including LP HRT3, masterclass, and V2 outside the one approved full doctor heading", () => {
    expect(read(lpHrt3Path)).toBe(atBaseline(lpHrt3Path));
    expect(read(masterclassProfilePath)).toBe(atBaseline(masterclassProfilePath));
    expect(read(v2PagePath)).toBe(atBaseline(v2PagePath));
    expect(normalizeApprovedV2DoctorHeading(v2DoctorBioPath, read(v2DoctorBioPath))).toBe(
      atBaseline(v2DoctorBioPath),
    );
    expect(changedProductionFiles()).toEqual([]);
  });
});
