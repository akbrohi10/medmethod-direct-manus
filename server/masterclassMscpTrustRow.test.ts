import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inverseApprovedLatePatientInfo, latePatientInfoFixturePath, introducedContinueGuidanceAssetPath } from "./intakeLatePatientInfoScope.test";
import { introDetailsPhotoFixturePath, introDetailsPhotoRegistrationPath, introducedDoctorPortraitAssetPath } from "./intakeIntroDetailsPhotoScope.test";
import { inverseApprovedThankYouWording, approvedThankYouWordingPaths, thankYouWordingFixturePath } from "./intakeThankYouWordingScope.test";

const baseline = "8c97c7c2";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/Masterclass2.tsx";
const badgeSrc = "/manus-storage/mscp-badge-2026_09c3feaa.webp";
const badgeFallbackSrc = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/VUbVCEUAQsHMTUAM.webp";
const approvedTrustRow = `          <div data-masterclass-mscp-trust-row className="mx-auto mt-5 flex w-full max-w-[640px] items-center gap-3 text-left">
            <img
              src="${badgeSrc}"
              alt="2026 Menopause Society Certified Practitioner badge"
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              className="h-[72px] w-[72px] shrink-0 object-contain sm:h-20 sm:w-20"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallbackUsed !== "true") {
                  image.dataset.fallbackUsed = "true";
                  image.src = "${badgeFallbackSrc}";
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold leading-snug text-[#7a1e7e]">Certified menopause expertise.</p>
              <p className="mt-1 text-[14px] font-medium leading-relaxed text-[#5a4452]">Dr. Al-Deek is a Menopause Society Certified Practitioner.</p>
            </div>
          </div>
`;

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function inverseApprovedTrustRow(source: string): string {
  expect(count(source, approvedTrustRow)).toBe(1);
  return source.replace(approvedTrustRow, "");
}

function bookingSection(source: string): string {
  const start = source.indexOf("        <section data-masterclass-video-first-booking");
  const end = source.indexOf("\n\n        <FinalFaq", start);
  if (start < 0 || end < 0) throw new Error("Missing Masterclass booking section boundaries");
  return source.slice(start, end);
}

describe("Masterclass MSCP trust row", () => {
  it("adds exactly one approved JSX block with the exact visible copy, accessibility, and responsive badge dimensions", () => {
    const page = read(pagePath);

    expect(count(page, "data-masterclass-mscp-trust-row")).toBe(1);
    expect(count(page, approvedTrustRow)).toBe(1);
    expect(count(page, "Certified menopause expertise.")).toBe(1);
    expect(count(page, "Dr. Al-Deek is a Menopause Society Certified Practitioner.")).toBe(1);
    expect(count(page, 'alt="2026 Menopause Society Certified Practitioner badge"')).toBe(1);
    expect(count(page, `src="${badgeSrc}"`)).toBe(1);
    expect(count(page, "width={80}")).toBe(1);
    expect(count(page, "height={80}")).toBe(1);
    expect(page).toContain('loading="lazy"');
    expect(page).toContain('decoding="async"');
    expect(page).toContain('className="h-[72px] w-[72px] shrink-0 object-contain sm:h-20 sm:w-20"');
  });

  it("keeps the unchanged availability line after Choose How to Connect and places the row before all three booking options", () => {
    const section = bookingSection(read(pagePath));
    const heading = section.indexOf('id="masterclass2-work-heading"');
    const availability = section.indexOf("100% virtual care · Available in 17 states");
    const trustRow = section.indexOf("data-masterclass-mscp-trust-row");
    const options = section.indexOf("data-masterclass2-connection-rows");

    expect(heading).toBeGreaterThan(-1);
    expect(availability).toBeGreaterThan(heading);
    expect(trustRow).toBeGreaterThan(availability);
    expect(options).toBeGreaterThan(trustRow);
    expect(section.match(/data-masterclass2-(?:video-offer|text-visit|free-call)(?=[\s>])/g)).toHaveLength(3);
    expect(section.indexOf("data-masterclass2-video-offer")).toBeGreaterThan(trustRow);
    expect(section.indexOf("data-masterclass2-text-visit")).toBeGreaterThan(trustRow);
    expect(section.indexOf("data-masterclass2-free-call")).toBeGreaterThan(trustRow);
  });

  it("uses the approved fallback only once after an image error", () => {
    const row = approvedTrustRow;
    const fallbackAssignment = `image.src = "${badgeFallbackSrc}";`;

    expect(count(row, 'image.dataset.fallbackUsed !== "true"')).toBe(1);
    expect(count(row, 'image.dataset.fallbackUsed = "true"')).toBe(1);
    expect(count(row, fallbackAssignment)).toBe(1);
    expect(row.indexOf('image.dataset.fallbackUsed = "true"')).toBeLessThan(row.indexOf(fallbackAssignment));
  });

  it("is exactly reversible to 8c97c7c2 by removing only the approved trust row", () => {
    expect(inverseApprovedTrustRow(read(pagePath))).toBe(atBaseline(pagePath));
  });

  it("changes no other production source relative to 8c97c7c2", () => {
    const changedProductionFiles = [...new Set([
      ...execFileSync(
      "git",
      ["diff", "--name-only", baseline, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
      ).split("\n"),
      ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "client", "server", "shared"], { cwd: root, encoding: "utf8" }).split("\n"),
    ])]
      .filter(Boolean).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String(baseline) + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `8c97c7c2:${p}`], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(file => !approvedThankYouWordingPaths.some(approvedPath => approvedPath === file) || inverseApprovedThankYouWording(file, read(file)) !== atBaseline(file))
      .filter(file => ![thankYouWordingFixturePath, glp1CombinedFixturePath, glp1CombinedAssetPath, progressFixturePath, progressAssetPath, shippingSkipFixturePath, finalProgressLabelFixturePath].includes(file))
      .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
      // Separately authorized notification backend, covered by the dedicated GHL regressions.
      .filter(file => !["server/_core/env.ts", "server/intakePaymentRoutes.ts", "server/ghlIntakeWebhookPayload.ts", "server/ghlIntakeWebhookQueue.ts"].includes(file))
      .filter(file => file !== latePatientInfoFixturePath)
      .filter(file => file !== introducedContinueGuidanceAssetPath)
      .filter(file => ![introDetailsPhotoFixturePath, introducedDoctorPortraitAssetPath].includes(file))
      .filter(file => !["client/intake/index.html", "client/public/intake/sign-forms-ui.js", introDetailsPhotoRegistrationPath, "server/intakeSubmissionContract.ts"].includes(file) || inverseApprovedLatePatientInfo(file, read(file)) !== atBaseline(file));

    expect(changedProductionFiles).toEqual([pagePath]);
  });
});
