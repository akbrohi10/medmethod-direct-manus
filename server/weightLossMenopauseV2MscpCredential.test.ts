import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "46eba676fce14a593bef9515b3eb0f270d6ab129";
const root = resolve(import.meta.dirname, "..");
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;
const normalizeApprovedMasterclassMscpCredential = (file: string, source: string) => {
  if (file !== masterclassProfilePath) return source;
  expect(count(source, approvedMasterclassMscpCredentialLine)).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
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
    .filter(file => normalizeApprovedMasterclassMscpCredential(file, read(file)) !== atBaseline(file));
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

  it("is exactly reversible to 46eba676fce14a593bef9515b3eb0f270d6ab129 by removing only the one approved MSCP literal", () => {
    const doctorBio = read(doctorBioPath);

    expect(count(doctorBio, approvedMscpCredential)).toBe(1);
    expect(doctorBio.replace(approvedMscpCredential, "")).toBe(atBaseline(doctorBioPath));
  });

  it("leaves every other production source at 46eba676fce14a593bef9515b3eb0f270d6ab129", () => {
    expect(changedProductionFiles()).toEqual([doctorBioPath]);
  });
});
