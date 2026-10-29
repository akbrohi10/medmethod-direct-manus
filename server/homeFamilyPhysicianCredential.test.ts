import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "bee1e5469e673a1d0947add4b46803074838a2c2";
const root = resolve(import.meta.dirname, "..");
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

function normalizeApprovedHomepageFamilyPhysicianCredential(file: string, source: string): string {
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
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file));
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

  it("leaves LP HRT3 and every other production source unchanged", () => {
    expect(read(lpHrt3Path)).toBe(atBaseline(lpHrt3Path));
    expect(changedProductionFiles()).toEqual([medicalTeamPath, homePath]);
  });
});
