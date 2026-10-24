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
const cue = page.match(/<div data-masterclass-video-first-watch-cue[\s\S]*?(?=<svg)/)?.[0] ?? "";
const compact = (source: string) => source.replace(/\s+/g, " ");
const text = (source: string) => source.replace(/\{" "\}/g, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const HOMEPAGE_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";

describe("approved /masterclass2 refined homepage-style hero", () => {
  it("keeps the exact four-line homepage headline and no repeated credentials", () => {
    const lines = [...heading.matchAll(/<span className="block">([^<]*)<\/span>/g)].map(([, line]) => text(line));
    expect(lines).toEqual(["Menopause,", "Hormones", "& Weight Loss.", "Done Right for You."]);
    expect(hero).toContain("data-masterclass2-home-headline");
    expect(hero).not.toContain("Thinking about becoming a patient?");
    expect(hero).not.toContain("data-masterclass-video-first-credentials");
    expect(page.match(/<h1\b/g) ?? []).toHaveLength(1);
  });

  it("preserves the homepage gradient and Montserrat while refining headline spacing and scale", () => {
    expect(homepage).toContain(`backgroundImage: "${HOMEPAGE_GRADIENT}"`);
    expect(heading).toContain(`backgroundImage: "${HOMEPAGE_GRADIENT}"`);
    expect(heading).toContain("font-black");
    expect(heading).toContain("leading-[1.12]");
    expect(compact(heading)).toContain('fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.5rem, 4.5vw, 3.25rem)", letterSpacing: "-0.02em"');
    expect(medicalTeam).toContain('fontFamily: "Montserrat, sans-serif"');
    expect(medicalTeam).toContain("font-black");
  });

  it("makes the single exact virtual-care line a small outlined pill", () => {
    expect(page.match(/<p\s+data-masterclass2-virtual-subheading/g) ?? []).toHaveLength(1);
    expect(text(virtualSubheading)).toBe("100% Virtual");
    expect(virtualSubheading).toContain("inline-flex items-center rounded-full border border-[#e8d5dc]");
    expect(virtualSubheading).toContain("bg-white/80 px-3 py-1 text-xs font-semibold leading-4 text-[#7a1e7e]");
    expect(virtualSubheading).not.toMatch(/font-extrabold|fontSize|clamp/);
  });

  it("uses a smaller unchanged watch prompt with one decorative standard play icon and tighter gaps", () => {
    expect(text(cue)).toBe("Watch Now—Get Answers.");
    expect(cue).toContain("mb-3 flex flex-col items-center gap-1.5 text-center");
    expect(cue).toContain("text-sm font-semibold leading-5 text-[#7a1e7e] sm:text-base");
    expect(cue).toContain('<CirclePlay className="h-4 w-4 shrink-0" aria-hidden="true" />');
    expect(page.match(/<CirclePlay\b/g) ?? []).toHaveLength(1);
    expect(cue).not.toMatch(/<button|onClick|href=|tabIndex=/);
  });

  it("keeps the original background, pulsing arrow, video ID and reduced-motion behavior", () => {
    expect(hero).toContain("repeating-radial-gradient(ellipse at 50% 100%");
    expect(page).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect(page).toContain("mmdMasterclassWatchPulse 2.2s ease-in-out infinite");
    expect(page).toContain("[data-masterclass-video-first-watch-arrow] { animation: none; opacity: 1; transform: none; }");
  });
});
