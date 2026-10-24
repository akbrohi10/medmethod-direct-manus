import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");
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
  it("copies all existing credential, specialty and full narrative data without new claims", () => {
    for (const name of ["CREDENTIAL_PILLS", "FOCUS_AREA_PILLS", "BIO_SECTIONS"]) {
      expect(initializer(profile, name)).toBe(initializer(homepage, name));
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
    expect(page).not.toContain("jumana-family-masterclass");
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
    expect(page).toContain('</section>\n\n        <FeaturedInStrip />\n\n        <PhysicianProfile />');
    expect(page).not.toContain('className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16"');
  });

  it("preserves original headline, video, arrow, booking and pricing markup exactly", () => {
    for (const marker of ["data-masterclass-video-first-hero", "data-masterclass-video-first-player", "data-masterclass-video-first-booking"]) {
      expect(section(page, marker)).toBe(section(original, marker));
    }
    const pricing = (s: string) => s.slice(s.indexOf("function PricingDetails()"), s.indexOf("export default function"));
    expect(pricing(page)).toBe(pricing(original));
    expect(page).toContain('<LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />');
  });
});
