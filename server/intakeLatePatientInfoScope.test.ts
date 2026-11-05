import { finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { inverseApprovedShippingSkip, shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedIntroDetailsPhoto, introDetailsPhotoFixturePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath } from "./intakeIntroDetailsPhotoScope.test";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths, thankYouWordingFixturePath } from "./intakeThankYouWordingScope.test";

const root = resolve(import.meta.dirname, "..");
export const latePatientInfoFixturePath = "server/fixtures/intakeLatePatientInfoFragments.json";
export const introducedContinueGuidanceAssetPath = "client/public/intake/continue-guidance.js";
const signingUiPath = "client/public/intake/sign-forms-ui.js";
const signingStatusFragment = {
  old: '    className: "sign-forms",\n    "data-hj-suppress": "true",\n    children: [',
  new: '    className: "sign-forms",\n    "data-hj-suppress": "true",\n    "data-mmd-missing-name": needsName ? "true" : "false",\n    "data-mmd-missing-signature": !hasSignature ? "true" : "false",\n    "data-mmd-missing-e-sign": !electronicAgreement ? "true" : "false",\n    "data-mmd-missing-documents": JSON.stringify(documentIds.filter(function (id) { return !documentChecks[id]; })),\n    children: [',
};
const fragments = JSON.parse(readFileSync(resolve(root, latePatientInfoFixturePath), "utf8")) as Array<{ old: string; new: string; count?: number }>;

/** Reverse only the exact separately authorized intake fragments; unexpected changes remain visible. */
export function inverseApprovedLatePatientInfo(path: string, source: string): string {
  if (path !== "client/intake/index.html") source = inverseApprovedShippingSkip(path, source);
  if (approvedThankYouWordingPaths.some(approvedPath => approvedPath === path)) return inverseApprovedThankYouWording(path, source);
  if (path === signingUiPath) {
    if (source.split(signingStatusFragment.new).length - 1 !== 1) throw new Error("Unexpected authorized signing-status source fragment count");
    return source.replace(signingStatusFragment.new, signingStatusFragment.old);
  }
  if (path === introDetailsPhotoRegistrationPath) return inverseApprovedIntroDetailsPhoto(path, source);
  if (path !== "client/intake/index.html") return source;
  source = inverseApprovedGlp1Combined(path, source);
  for (const fragment of [...fragments].reverse()) {
    if (source.split(fragment.new).length - 1 !== (fragment.count ?? 1)) throw new Error("Unexpected authorized late-patient-info source fragment count");
    source = source.split(fragment.new).join(fragment.old);
  }
  return source;
}

describe("late patient info complete production scope", () => {
  it("restores the complete intake source and changes only the original three paths plus portrait registration and asset from 87fcd00d", () => {
    const scope = ["client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"];
    const changed = [
      ...execFileSync("git", ["diff", "--name-only", "87fcd00d", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"),
    ].filter(Boolean)
      .filter(path => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === path) || inverseApprovedThankYouWording(path, readFileSync(resolve(root, path), "utf8")) !== execFileSync("git", ["show", `87fcd00d:${path}`], { cwd: root, encoding: "utf8" }))
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path) && ![latePatientInfoFixturePath, introDetailsPhotoFixturePath, thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(path))
      .filter(path => path !== "server/intakeSubmissionContract.ts" || inverseApprovedLatePatientInfo(path, readFileSync(resolve(root, path), "utf8")) !== execFileSync("git", ["show", `87fcd00d:${path}`], { cwd: root, encoding: "utf8" }));
    expect([...new Set(changed)].sort()).toEqual(["client/intake/index.html", introducedContinueGuidanceAssetPath, signingUiPath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath].sort());
    const current = readFileSync(resolve(root, "client/intake/index.html"), "utf8");
    expect(inverseApprovedLatePatientInfo("client/intake/index.html", current)).toBe(execFileSync("git", ["show", "87fcd00d:client/intake/index.html"], { cwd: root, encoding: "utf8" }));
    expect(inverseApprovedLatePatientInfo(introDetailsPhotoRegistrationPath, readFileSync(resolve(root, introDetailsPhotoRegistrationPath), "utf8"))).toBe(execFileSync("git", ["show", `87fcd00d:${introDetailsPhotoRegistrationPath}`], { cwd: root, encoding: "utf8" }));
  });

  it("restores the whole signing UI to 87fcd00d by reversing only the four exact status attributes", () => {
    const current = readFileSync(resolve(root, signingUiPath), "utf8");
    expect(inverseApprovedLatePatientInfo(signingUiPath, current)).toBe(execFileSync("git", ["show", `87fcd00d:${signingUiPath}`], { cwd: root, encoding: "utf8" }));
    expect(() => inverseApprovedLatePatientInfo(signingUiPath, current.replace(signingStatusFragment.new, signingStatusFragment.old))).toThrow("Unexpected authorized signing-status source fragment count");
    expect(() => inverseApprovedLatePatientInfo(signingUiPath, current + signingStatusFragment.new)).toThrow("Unexpected authorized signing-status source fragment count");
    expect(inverseApprovedLatePatientInfo("client/public/intake/sign-forms-data.js", current)).toBe(current);
  });
});
