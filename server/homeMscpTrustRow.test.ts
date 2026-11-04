import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedLatePatientInfo, latePatientInfoFixturePath, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";

const baseline = "59e7c056";
const root = resolve(import.meta.dirname, "..");
const homePath = "client/src/pages/HomeHrt3.tsx";
const medicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const masterclassPath = "client/src/pages/Masterclass2.tsx";
const mscpBadgeSrc = "/manus-storage/mscp-badge-2026_09c3feaa.webp";
const mscpBadgeFallbackSrc = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp";
const approvedBadgeProps = [
  `          mscpBadgeSrc="${mscpBadgeSrc}"`,
  `          mscpBadgeFallbackSrc="${mscpBadgeFallbackSrc}"`,
].join("\n");
const approvedMedicalTeamDestructure = "  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,\n";
const approvedMedicalTeamTypes = "  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;\n";
const trustRowStart = "              {mscpBadgeSrc && (\n";
const trustRowEnd = "              {/* Two clear booking paths.";
const masterclassMscpTrustRowStart = '\n          <div data-masterclass-mscp-trust-row className="mx-auto mt-5 flex w-full max-w-[640px] items-center gap-3 text-left">';
const masterclassMscpTrustRowEnd = "\n          <div data-masterclass2-connection-rows";

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function inverseApprovedMscpTrustRow(file: string, source: string): string {
  if (file === masterclassPath) {
    expect(count(source, masterclassMscpTrustRowStart)).toBe(1);
    const start = source.indexOf(masterclassMscpTrustRowStart);
    const end = source.indexOf(masterclassMscpTrustRowEnd, start);
    expect(end).toBeGreaterThan(start);
    return source.slice(0, start) + source.slice(end);
  }

  if (file === homePath) {
    expect(count(source, approvedBadgeProps)).toBe(1);
    return source.replace(`${approvedBadgeProps}\n`, "");
  }

  if (file !== medicalTeamPath) return source;

  expect(count(source, approvedMedicalTeamDestructure)).toBe(1);
  expect(count(source, approvedMedicalTeamTypes)).toBe(1);
  expect(count(source, trustRowStart)).toBe(1);
  expect(count(source, trustRowEnd)).toBe(1);
  const withoutBadgeProps = source
    .replace(approvedMedicalTeamDestructure, "")
    .replace(approvedMedicalTeamTypes, "");
  const start = withoutBadgeProps.indexOf(trustRowStart);
  const end = withoutBadgeProps.indexOf(trustRowEnd);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return withoutBadgeProps.slice(0, start) + withoutBadgeProps.slice(end);
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    // Separately authorized backend-only notification; dedicated GHL suites protect its scope.
    .filter(file => !["server/_core/env.ts", "server/intakePaymentRoutes.ts", "server/ghlIntakeWebhookPayload.ts", "server/ghlIntakeWebhookQueue.ts"].includes(file))
    .filter(file => file !== latePatientInfoFixturePath)
    .filter(file => file !== introducedContinueGuidanceAssetPath)
    .filter(file => !["client/intake/index.html", "client/public/intake/sign-forms-ui.js"].includes(file) || inverseApprovedLatePatientInfo(file, read(file)) !== atBaseline(file))
    .filter(file => file !== masterclassPath || inverseApprovedMscpTrustRow(file, read(file)) !== atBaseline(file));
}

describe("homepage-only MSCP trust row", () => {
  it("adds the exact visible copy, badge accessibility, and approved responsive dimensions", () => {
    const medicalTeam = read(medicalTeamPath);

    expect(count(medicalTeam, "Certified menopause expertise.")).toBe(1);
    expect(count(medicalTeam, "Dr. Al-Deek is a Menopause Society Certified Practitioner.")).toBe(1);
    expect(count(medicalTeam, 'alt="2026 Menopause Society Certified Practitioner badge"')).toBe(1);
    expect(count(medicalTeam, "width={80}")).toBe(1);
    expect(count(medicalTeam, "height={80}")).toBe(1);
    expect(medicalTeam).toContain('className="h-[72px] w-[72px] shrink-0 object-contain sm:h-20 sm:w-20"');
  });

  it("renders directly after patient-volume proof and before the hero CTA sentinel", () => {
    const medicalTeam = read(medicalTeamPath);
    const proof = medicalTeam.indexOf("data-home-patient-volume-proof");
    const trustRow = medicalTeam.indexOf("data-home-mscp-trust-row");
    const ctaSentinel = medicalTeam.indexOf('id="hero-cta-sentinel"');

    expect(proof).toBeGreaterThan(-1);
    expect(trustRow).toBeGreaterThan(proof);
    expect(ctaSentinel).toBeGreaterThan(trustRow);
  });

  it("keeps the shared component default-off and opts in only the root homepage with the exact two asset URLs", () => {
    const home = read(homePath);
    const medicalTeam = read(medicalTeamPath);
    const homeMedicalTeamCall = home.match(/<MedicalTeam[\s\S]*?\n\s*\/>/)?.[0] ?? "";

    expect(medicalTeam).toContain("  mscpBadgeSrc,\n  mscpBadgeFallbackSrc,");
    expect(medicalTeam).toContain("  mscpBadgeSrc?: string;\n  mscpBadgeFallbackSrc?: string;");
    expect(medicalTeam).toContain("{mscpBadgeSrc && (");
    expect(count(home, approvedBadgeProps)).toBe(1);
    expect(homeMedicalTeamCall).toContain(approvedBadgeProps);
    expect(count(home, "mscpBadgeSrc")).toBe(1);
    expect(count(home, "mscpBadgeFallbackSrc")).toBe(1);
    expect(count(medicalTeam, "mscpBadgeSrc")).toBe(4);
    expect(count(medicalTeam, "mscpBadgeFallbackSrc")).toBe(4);
  });

  it("uses the fallback at most once after a badge load error", () => {
    const medicalTeam = read(medicalTeamPath);
    const errorHandler = medicalTeam.match(/onError=\{\(event\) => \{[\s\S]*?\n                    \}\}/)?.[0] ?? "";

    expect(errorHandler).toContain('image.dataset.fallbackUsed !== "true"');
    expect(errorHandler).toContain('image.dataset.fallbackUsed = "true"');
    expect(errorHandler).toContain("image.src = mscpBadgeFallbackSrc;");
    expect(count(errorHandler, "image.src = mscpBadgeFallbackSrc;")).toBe(1);
    expect(errorHandler.indexOf('image.dataset.fallbackUsed = "true"')).toBeLessThan(
      errorHandler.indexOf("image.src = mscpBadgeFallbackSrc;"),
    );
  });

  it("is exactly reversible to 59e7c056 through only the two approved source inverses", () => {
    expect(inverseApprovedMscpTrustRow(homePath, read(homePath))).toBe(atBaseline(homePath));
    expect(inverseApprovedMscpTrustRow(medicalTeamPath, read(medicalTeamPath))).toBe(
      atBaseline(medicalTeamPath),
    );
  });

  it("changes no other production source relative to 59e7c056", () => {
    expect(changedProductionFiles()).toEqual([medicalTeamPath, homePath]);
  });
});
