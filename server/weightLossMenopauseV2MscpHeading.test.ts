import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "de623f2d";
const root = resolve(import.meta.dirname, "..");
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const unchangedPortraitAlt = 'alt="Dr. Jumana Al-Deek, DO, MS"';
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

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
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => normalizeApprovedV2DoctorHeading(file, read(file)) !== atBaseline(file));
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

  it("leaves every other production byte at de623f2d", () => {
    expect(changedProductionFiles()).toEqual([]);
  });
});
