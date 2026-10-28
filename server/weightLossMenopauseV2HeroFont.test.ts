import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "c8783393";
const root = resolve(import.meta.dirname, "..");
const cssPath = "client/src/pages/WeightLossMenopauseV2.css";
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const indexPath = "client/index.html";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const heroFontMarker = "/* V2 hero headline — homepage font match only. */";
const approvedHeroFontAppend = `
/* V2 hero headline — homepage font match only. */
.wlm-v2-content .hero[data-medmethod-scope] h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}
`;
const desktopHeroSizingMarker = "/* V2 desktop hero headline — restrained sizing only. */";
const approvedDesktopHeroSizingAppend = `
/* V2 desktop hero headline — restrained sizing only. */
@media (min-width: 1025px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
`;

function read(file: string): string {
  return readFileSync(resolve(root, file), "utf8");
}

function atBaseline(file: string): string {
  return execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file));
}

describe("Weight-Loss & Menopause V2 homepage hero font match", () => {
  it("keeps the approved six-line font append exact before the separately approved terminal desktop sizing append", () => {
    const css = read(cssPath);
    const markerIndex = css.indexOf(heroFontMarker);
    const sizingMarkerIndex = css.indexOf(desktopHeroSizingMarker);

    expect(markerIndex).toBe(atBaseline(cssPath).length + 1);
    expect(sizingMarkerIndex).toBe(atBaseline(cssPath).length + approvedHeroFontAppend.length + 1);
    expect(css.match(/\/\* V2 hero headline — homepage font match only\. \*\//g)).toHaveLength(1);
    expect(css.match(/\/\* V2 desktop hero headline — restrained sizing only\. \*\//g)).toHaveLength(1);
    expect(css).toBe(`${atBaseline(cssPath)}${approvedHeroFontAppend}${approvedDesktopHeroSizingAppend}`);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(cssPath) + "\n");
    expect(css.slice(markerIndex, sizingMarkerIndex)).toBe(`${approvedHeroFontAppend.trimStart()}\n`);
    expect(css.slice(sizingMarkerIndex)).toBe(approvedDesktopHeroSizingAppend.trimStart());
  });

  it("changes only the scoped hero h1 family and weight, letting headline spans inherit while preserving the masked ampersand's DM Sans rule", () => {
    const css = read(cssPath);
    const append = css.slice(css.indexOf(heroFontMarker), css.indexOf(desktopHeroSizingMarker));
    const page = read(pagePath);
    const cssPrefix = css.slice(0, css.indexOf(heroFontMarker));

    expect(append).toBe(`${approvedHeroFontAppend.trimStart()}\n`);
    expect(append).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1 {\n  font-family: "Montserrat", sans-serif;\n  font-weight: 900;\n}');
    expect(append).not.toMatch(/(?:font-size|line-height|letter-spacing|color|background|margin|padding|mask|text-decoration|transform)\s*:/);
    expect(append).not.toContain(".hero-headline-line");
    expect(append).not.toContain(".hero-ampersand");
    expect(append).not.toContain(".hero-free");
    expect(page).toBe(atBaseline(pagePath));
    expect(page).toContain('<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>');
    expect(cssPrefix).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1 .hero-ampersand{font-family:"DM Sans",Arial,sans-serif;line-height:0');
  });

  it("uses the existing globally loaded Montserrat 900 and the same homepage headline source convention", () => {
    const index = read(indexPath);
    const homepage = read(homepagePath);
    const homepageMedicalTeam = read(homepageMedicalTeamPath);

    expect(index).toBe(atBaseline(indexPath));
    expect(index).toMatch(/fonts\.googleapis\.com\/css2\?family=Montserrat:wght@400;500;600;700;800;900&/);
    expect(homepage).toBe(atBaseline(homepagePath));
    expect(homepage).toContain('import MedicalTeam from "@/components/home1/MedicalTeam";');
    expect(homepageMedicalTeam).toBe(atBaseline(homepageMedicalTeamPath));
    expect(homepageMedicalTeam).toMatch(/<h1\s+className="font-black text-\[#111111\] leading-\[1\.05\]"\s+style=\{\{[\s\S]*?fontFamily: "Montserrat, sans-serif"/);
  });

  it("leaves every other production source at c8783393, including markup, global font links, content, data, and payment paths", () => {
    expect(changedProductionFiles()).toEqual([cssPath]);
  });
});
