import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const page = read("client/src/pages/Masterclass2.tsx");
const homepage = read("client/src/pages/HomeHrt3.tsx");
const medicalTeam = read("client/src/components/home1/MedicalTeam.tsx");

const hero = page.match(/<section data-masterclass-video-first-hero[\s\S]*?<\/section>/)?.[0] ?? "";
const heading = hero.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
const virtualSubheading = hero.match(/<p\s+data-masterclass2-virtual-subheading[\s\S]*?<\/p>/)?.[0] ?? "";

const compact = (source: string) => source.replace(/\s+/g, " ");
const normalizeStyleSyntax = (source: string) => compact(source).replace(/,\s*}/g, " }");
const text = (source: string) => source
  .replace(/\{" "\}/g, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

const HOMEPAGE_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const HEADING_CLASS = 'className="mx-auto max-w-[810px] font-black text-[#111111] leading-[1.05]"';
const HEADING_STYLE = 'style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.55rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}';
const VIRTUAL_CLASS = 'className="mt-2 font-extrabold text-[#111111]"';
const VIRTUAL_STYLE = 'style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", letterSpacing: "-0.01em" }}';

describe("approved /masterclass2 homepage header", () => {
  it("uses the exact four-line homepage headline and removes the previous hero copy", () => {
    const lines = [...heading.matchAll(/<span className="block">([^<]*)<\/span>/g)]
      .map(([, line]) => text(line));

    expect(lines).toEqual([
      "Menopause,",
      "Hormones",
      "& Weight Loss.",
      "Done Right for You.",
    ]);
    expect(hero).toContain("data-masterclass2-home-headline");
    expect(hero).not.toContain("Thinking about becoming a patient?");
    expect(hero).not.toContain("Meet Dr. Jumana Al-Deek, DO.");
    expect(page.match(/<h1\b/g) ?? []).toHaveLength(1);
  });

  it("copies the homepage gradient and exact MedicalTeam heading typography", () => {
    expect(homepage).toContain(`backgroundImage: "${HOMEPAGE_GRADIENT}"`);
    expect(heading).toContain(`backgroundImage: "${HOMEPAGE_GRADIENT}"`);
    expect(compact(heading)).toContain(HEADING_CLASS);
    expect(compact(heading)).toContain(HEADING_STYLE);
    expect(compact(medicalTeam)).toContain('className="font-black text-[#111111] leading-[1.05]"');
    expect(normalizeStyleSyntax(medicalTeam)).toContain(HEADING_STYLE);
  });

  it("keeps the single exact 100% Virtual subheading with MedicalTeam typography", () => {
    expect(page.match(/<p\s+data-masterclass2-virtual-subheading/g) ?? []).toHaveLength(1);
    expect(text(virtualSubheading)).toBe("100% Virtual");
    expect(compact(virtualSubheading)).toContain(VIRTUAL_CLASS);
    expect(compact(virtualSubheading)).toContain(VIRTUAL_STYLE);
    expect(compact(medicalTeam)).toContain(VIRTUAL_CLASS);
    expect(normalizeStyleSyntax(medicalTeam)).toContain(VIRTUAL_STYLE);
  });
});
