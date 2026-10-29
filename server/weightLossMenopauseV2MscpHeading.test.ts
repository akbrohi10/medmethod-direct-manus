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
    .filter(file => normalizeApprovedV2DoctorHeading(file, normalizeApprovedV2SectionOrder(file, read(file))) !== atBaseline(file));
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
