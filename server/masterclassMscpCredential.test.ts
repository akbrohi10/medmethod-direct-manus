import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "ad6831863ae44e57f573ac3ed4741d52fc47e33d";
const root = resolve(import.meta.dirname, "..");
const profilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const approvedMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function credentialPills(source: string): string[] {
  const initializer = source.match(/const CREDENTIAL_PILLS = \[([\s\S]*?)\];/)?.[1] ?? "";
  expect(initializer).not.toBe("");
  return Array.from(initializer.matchAll(/"([^"]+)"/g), match => match[1]);
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
