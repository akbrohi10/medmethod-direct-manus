import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");
const readBaselineProfile = () =>
  execFileSync("git", ["show", "75d55770:client/src/components/masterclass2/PhysicianProfile.tsx"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
const readImmediateBaselineProfile = () =>
  execFileSync("git", ["show", "e4960372:client/src/components/masterclass2/PhysicianProfile.tsx"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
const approvedMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const count = (source: string, value: string) => source.split(value).length - 1;
const normalizeApprovedMscpCredential = (source: string) => {
  expect(count(source, approvedMscpCredentialLine)).toBe(1);
  return source.replace(approvedMscpCredentialLine, "");
};
const normalizeApprovedCredential = (source: string) =>
  source.replace('"Family Physician"', '"Board-Certified DO"');
const restoreImmediateBaselineCredential = (source: string) =>
  source.replace('"Family Physician"', '"Board-Certified Family Physician"');
const page = read("client/src/pages/Masterclass2.tsx");
const profile = read("client/src/components/masterclass2/PhysicianProfile.tsx");
const homepage = read("client/src/components/home1/MedicalTeam.tsx");
const original = read("client/src/pages/MasterclassVideoFirst.tsx");

function initializer(source: string, name: string) {
  const file = ts.createSourceFile("profile.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let result = "";
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(file) === name) result = node.initializer?.getText(file) ?? "";
    ts.forEachChild(node, visit);
  }
  visit(file);
  expect(result).not.toBe("");
  return result.replace(/\s+/g, "");
}

function section(source: string, marker: string) {
  const start = source.lastIndexOf("<section", source.indexOf(marker));
  const end = source.indexOf("</section>", start) + "</section>".length;
  return source.slice(start, end);
}

describe("masterclass2 full homepage-style physician profile", () => {
  it("introduces the unchanged biography with the exact approved visible heading and supporting line", () => {
    expect(profile).toContain("data-masterclass2-profile-introduction");
    expect(profile.match(/<h2\s+id="masterclass2-profile-heading"[^>]*>([\s\S]*?)<\/h2>/)?.[1]?.trim()).toBe("Meet Dr. Jumana Al-Deek, DO,MS");
    expect(profile).toContain("Her background, qualifications &amp; approach to care.");
    expect(profile).toContain('aria-labelledby="masterclass2-profile-heading"');
    expect(profile).toContain('id="masterclass2-profile-heading"');
    expect(profile).not.toContain('id="masterclass2-profile-heading" className="sr-only"');
    expect(profile.indexOf("data-masterclass2-profile-introduction")).toBeLessThan(profile.indexOf("<article"));
    expect(profile).toContain("text-[26px] font-bold leading-tight text-[#7A1E7E] sm:text-[32px]");
  });

  it("adds only the approved 2026 recognition with a safe link to the magazine's official listing", () => {
    expect(profile).toContain("Recognized as a 2026 Top Physician");
    expect(profile).toContain("Orlando Family Magazine");
    expect(profile).toContain('href="https://www.orlandofamilymagazine.com/current-issue/2026-top-physicians/"');
    expect(profile).toContain('target="_blank"');
    expect(profile).toContain('rel="noopener noreferrer"');
    expect(profile).toContain("(opens in a new tab)");
    expect(profile.match(/data-masterclass2-physician-recognition/g)).toHaveLength(1);
    expect(profile.indexOf("data-masterclass2-physician-recognition")).toBeGreaterThan(profile.indexOf("Meet Dr. Jumana Al-Deek, DO"));
    expect(profile.indexOf("data-masterclass2-physician-recognition")).toBeLessThan(profile.indexOf("Her background, qualifications"));
    expect(profile).not.toMatch(/#1 doctor|top-ranked doctor/i);
    expect(homepage).not.toContain("data-masterclass2-physician-recognition");
    expect(original).not.toContain("data-masterclass2-physician-recognition");
  });

  it("copies all existing credential, specialty and full narrative data with only the approved MSCP pill", () => {
    expect(profile.match(/"Family Physician"/g)).toHaveLength(1);
    expect(profile.match(/"Menopause Certified \(MSCP\)"/g)).toHaveLength(1);
    expect(profile).not.toContain('"Board-Certified Family Physician"');
    expect(profile).not.toContain('"Board-Certified DO"');
    expect(normalizeApprovedMscpCredential(profile)).toBe(readImmediateBaselineProfile().replace('"Board-Certified Family Physician"', '"Family Physician"'));
    expect(normalizeApprovedCredential(normalizeApprovedMscpCredential(profile))).toBe(readBaselineProfile());
    expect(restoreImmediateBaselineCredential(normalizeApprovedMscpCredential(profile))).toBe(readImmediateBaselineProfile());
    for (const name of ["CREDENTIAL_PILLS", "FOCUS_AREA_PILLS", "BIO_SECTIONS"]) {
      expect(initializer(normalizeApprovedCredential(normalizeApprovedMscpCredential(profile)), name)).toBe(initializer(homepage, name));
    }
    for (const phrase of ["West Virginia School of Osteopathic Medicine", "Doctor of Osteopathic Medicine", "AdventHealth Winter Park", "Family Medicine Residency", "Georgetown University", "Graduate Training, Physiology & Biophysics", "The Menopause Society", "Advanced Menopause Training", "Obesity Medicine Association", "Obesity & Metabolic Health Certification", "Pre-Medicine Background", "Former NASM-Certified Personal Trainer"]) {
      expect(profile).toContain(phrase);
      expect(homepage).toContain(phrase);
    }
    expect(profile).toContain("Midlife can involve changes in hormones, metabolism,");
    expect(profile.replace(/\s+/g, " ")).toContain("with each patient and discuss options that may be appropriate.");
  });

  it("removes only the new portrait and its reserved space while keeping the homepage pink/purple typography", () => {
    expect(profile).not.toContain('/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp');
    expect(profile).not.toMatch(/<img|const PORTRAIT|data-masterclass2-presenter-photo|aspect-\[3\/4\]/);
    expect(homepage).toContain('/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp');
    for (const color of ["#B8336A", "#7A1E7E", "#E8339E", "#F4E8EE", "#E8D5DC"]) {
      expect(profile).toContain(color);
      expect(homepage).toContain(color);
    }
    expect(profile).toContain('fontFamily: "Montserrat, sans-serif"');
    expect(profile).toContain('fontFamily: "Georgia, serif"');
    expect(profile).not.toContain("jumana-family-masterclass");
  });

  it("keeps both narrative sections visible and all three deeper sections expandable with local accessible controls", () => {
    expect(profile).toContain("BIO_SECTIONS.slice(0, 2)");
    expect(profile).toContain("BIO_SECTIONS.slice(2)");
    expect(profile).toContain("aria-expanded={isOpen}");
    expect(profile).toContain("aria-hidden={!isOpen}");
    expect(profile).toContain("aria-controls={`masterclass2-bio-panel-${i}`}");
    expect(profile).toContain("aria-labelledby={`masterclass2-bio-toggle-${i}`}");
    expect(profile).not.toContain("<h1");
    expect(profile).not.toMatch(/<form|<iframe|trpc\.|fetch\(|<MedicalTeam/);
  });

  it("fully removes only the learning and previous short presenter sections", () => {
    expect(page).not.toMatch(/learningChecklist|data-webinar2-learning|What You’ll Learn|Because You Deserve to Know/);
    expect(original).toContain("What You’ll Learn");
    expect(page).toContain("<PhysicianProfile />");
    expect(page.indexOf("<PhysicianProfile />")).toBeGreaterThan(page.indexOf("data-masterclass-video-first-player"));
    expect(page.indexOf("<FeaturedInStrip />")).toBeGreaterThan(page.indexOf("data-masterclass-video-first-player"));
    expect(page).not.toContain("data-masterclass-watch-button");
    expect(page.indexOf("<PhysicianProfile />")).toBeGreaterThan(page.indexOf("<FeaturedInStrip />"));
    expect([...page.matchAll(/<FeaturedInStrip \/>/g)]).toHaveLength(1);
    expect(page).toContain('</section>\n\n        <FeaturedInStrip />\n\n        <div data-masterclass2-family-photo-section');
    expect(page).toContain('</div>\n\n        <PhysicianProfile />');
    expect(page).not.toContain('className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16"');
  });

  it("preserves original video and arrow while using the approved homepage-style headline and Work With Me section", () => {
    expect(section(page, "data-masterclass-video-first-player")).toBe(section(original, "data-masterclass-video-first-player"));
    expect(section(page, "data-masterclass-video-first-hero")).toContain("Done Right for You.");
    expect(section(page, "data-masterclass-video-first-hero")).toContain("100% Virtual");
    expect(section(page, "data-masterclass-video-first-hero")).not.toContain("data-masterclass-video-first-credentials");
    expect(page).not.toContain("function PricingDetails()");
    expect(original).toContain("function PricingDetails()");
    expect(page).toContain('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />');
  });
});
