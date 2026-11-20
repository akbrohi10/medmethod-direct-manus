import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { beforeMasterclass3MagentaHero, NEW_COLOR, OLD_COLOR, NEW_SUB, OLD_SUB, OLD_BANNER } from "./masterclass3MagentaHeroBaseline";
const root = new URL("../", import.meta.url);
const path = "client/src/pages/Masterclass3.tsx";
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `bdcce637:${p}`], { cwd: root, encoding: "utf8" });
const page = read(path);
function luminance(hex: string): number {
  const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(fg: string, bg: string): number { return (luminance(bg) + 0.05) / (luminance(fg) + 0.05); }

describe("V3 approved banner, deep-magenta headline and free-video sentence only", () => {
  it("exactly reconstructs the entire prior page and has no banner", () => {
    expect(beforeMasterclass3MagentaHero(path, page)).toBe(old(path));
    expect(old(path)).toContain(OLD_BANNER);
    expect(page).not.toContain("data-masterclass-video-first-banner");
    expect(page).not.toContain("FREE ON-DEMAND MASTERCLASS");
    const article = page.slice(page.indexOf("      <article"));
    expect(article.split("\n")[1]).toContain("data-masterclass-video-first-hero");
  });
  it("preserves exact headline, sizing, credentials, original patient emphasis and all below-hero code", () => {
    expect(page).toContain("Hot flashes. Waking up at 3 AM. Low libido. Weight that won't move no matter what you do.");
    expect(page).toContain("text-[clamp(1.125rem,4.8vw,1.25rem)] font-black leading-[1.08] tracking-[-0.045em] " + NEW_COLOR);
    expect(page).toContain(NEW_SUB);
    expect(page).not.toContain(OLD_SUB);
    expect(page).toContain('Dr. Jumana Al-Deek, DO · Board-certified family physician · <span className="font-black text-[#7a1e7e]">50,000+ patients</span> seen');
    const start = '        <section ref={videoRef} data-masterclass-video-first-player';
    expect(page.slice(page.indexOf(start))).toBe(old(path).slice(old(path).indexOf(start)));
    expect(page).not.toContain(OLD_COLOR);
  });
  it("uses dark rich magenta with at least seven-to-one text contrast", () => {
    expect(contrast("9d1768", "ffffff")).toBeGreaterThan(7.6);
    expect(contrast("9d1768", "fff9fb")).toBeGreaterThan(7.3);
  });
  it("preserves every prior assertion and all other V3 components, pages, pricing, actions and video helper", () => {
    const imp = 'import { beforeMasterclass3MagentaHero } from "./masterclass3MagentaHeroBaseline";\n';
    expect(read("server/masterclass3PatientEmphasisBaseline.ts").replace(imp, "").replace("  source = beforeMasterclass3MagentaHero(path, source);\n", "")).toBe(old("server/masterclass3PatientEmphasisBaseline.ts"));
    expect(read("server/masterclass3PatientEmphasis.test.ts").replace(imp, "").replace('const read = (p: string) => beforeMasterclass3MagentaHero(p, readFileSync(new URL(p, root), "utf8"));', 'const read = (p: string) => readFileSync(new URL(p, root), "utf8");')).toBe(old("server/masterclass3PatientEmphasis.test.ts"));
    for (const p of ["client/src/pages/Masterclass2.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/HomeHrt3.tsx", "client/src/index.css", "client/src/App.tsx", "client/src/components/masterclass3/Masterclass3FullBio.tsx", "client/src/components/home1/LpConsultationModal2.tsx", "client/src/lib/masterclass3VideoTracking.ts", "server/masterclass3HeroBaseline.ts", "server/masterclass3Hero.test.ts", "server/masterclass3Membership.test.ts", "server/masterclass3FullBio.test.ts", "server/masterclass3Page.test.ts", "server/masterclass3BookingActions.test.ts", "server/masterclass3SingleBooking.test.ts", "server/masterclass3LearningLabel.test.ts", "server/fixtures/masterclass3HeroEdits.json"]) expect(read(p)).toBe(old(p));
  });
  it("fails closed on partial, duplicate or restored-banner changes, and passes historical/unrelated sources unchanged", () => {
    expect(() => beforeMasterclass3MagentaHero(path, page.replace(NEW_SUB, OLD_SUB))).toThrow();
    expect(() => beforeMasterclass3MagentaHero(path, page + NEW_COLOR)).toThrow();
    expect(() => beforeMasterclass3MagentaHero(path, page + OLD_BANNER)).toThrow();
    expect(beforeMasterclass3MagentaHero(path, old(path))).toBe(old(path));
    expect(beforeMasterclass3MagentaHero("unrelated", page)).toBe(page);
  });
});
