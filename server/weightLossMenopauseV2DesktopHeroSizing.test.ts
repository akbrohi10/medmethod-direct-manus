import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "120cf596";
const root = resolve(import.meta.dirname, "..");
const cssPath = "client/src/pages/WeightLossMenopauseV2.css";
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const approvedFaqBehaviorComponentPaths = new Set([
  "client/src/components/masterclass2/FinalFaq.tsx",
  "client/src/pages/WeightLossMenopauseV2Faq.tsx",
]);
const desktopHeroSizingMarker = "/* V2 desktop hero headline — restrained sizing only. */";
const approvedDesktopHeroSizingAppend = `
/* V2 desktop hero headline — restrained sizing only. */
@media (min-width: 1025px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
`;
const approvedAuditPriorityFixesAppend = `
/* V2 audit priority fixes — hero handoff and book-title contrast. */
@media (min-width: 901px) and (max-width: 1024px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}
.wlm-v2-content #doctor .doctor-bio-book {
  color: #7A1E7E;
}
`;
const approvedFaqAnswerFontAppend = `
/* V2 audit priority fix — readable FAQ answers only. */
.wlm-v2-content #faq .faq-list details > p {
  font-size: 17px;
}
`;
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';

function read(file: string): string {
  return readFileSync(resolve(root, file), "utf8");
}

function atBaseline(file: string): string {
  return execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function cssWithoutApprovedAuditPriorityFixes(): string {
  const css = read(cssPath);
  return css.endsWith(approvedAuditPriorityFixesAppend)
    ? css.slice(0, -approvedAuditPriorityFixesAppend.length)
    : css;
}

function normalizeApprovedAuditPriorityAppend(file: string, source: string): string {
  return file === faqCssPath && source.endsWith(approvedFaqAnswerFontAppend)
    ? source.slice(0, -approvedFaqAnswerFontAppend.length)
    : source;
}

function normalizeApprovedV2DoctorBioMscpCredential(file: string, source: string): string {
  return file === doctorBioPath ? source.replace(approvedMscpCredential, "") : source;
}

function normalizeApprovedMasterclassMscpCredential(file: string, source: string): string {
  if (file !== masterclassProfilePath) return source;
  expect(source.split(approvedMasterclassMscpCredentialLine).length - 1).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedFaqBehaviorComponentPaths.has(file))
    .filter(file => normalizeApprovedAuditPriorityAppend(file, normalizeApprovedV2DoctorBioMscpCredential(file, normalizeApprovedMasterclassMscpCredential(file, read(file)))) !== atBaseline(file));
}

describe("Weight-Loss & Menopause V2 desktop hero sizing", () => {
  it("is exactly the approved terminal CSS append to the 120cf596 stylesheet baseline", () => {
    const css = cssWithoutApprovedAuditPriorityFixes();
    const markerIndex = css.indexOf(desktopHeroSizingMarker);

    expect(markerIndex).toBe(atBaseline(cssPath).length + 1);
    expect(css.match(/\/\* V2 desktop hero headline — restrained sizing only\. \*\//g)).toHaveLength(1);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(cssPath) + "\n");
    expect(css.slice(markerIndex)).toBe(approvedDesktopHeroSizingAppend.trimStart());
    expect(css).toBe(`${atBaseline(cssPath)}${approvedDesktopHeroSizingAppend}`);
  });

  it("sets only the scoped headline font size in a desktop media query beginning at 1025px", () => {
    const css = cssWithoutApprovedAuditPriorityFixes();
    const append = css.slice(css.indexOf(desktopHeroSizingMarker));

    expect(append).toBe(approvedDesktopHeroSizingAppend.trimStart());
    expect(append).toContain("@media (min-width: 1025px)");
    expect(append).toContain(".wlm-v2-content .hero[data-medmethod-scope] h1");
    expect(append).toContain("font-size: clamp(36px, 3vw, 50px);");
    expect(append.match(/font-size\s*:/g)).toHaveLength(1);
    expect(append).not.toMatch(/(?:^|[;{])\s*(?:font-family|font-weight|line-height|letter-spacing|color|background|margin|padding|display|position|width|height|gap|transform)\s*:/);
    expect(append).not.toMatch(/@media\s*\(\s*max-width\s*:/);
    expect(append).not.toContain(".hero-headline-line");
    expect(append).not.toContain(".hero-free");
    expect(append).not.toContain(".hero-ampersand");
  });

  it("leaves the entire pre-existing stylesheet, markup, and every other production source at 120cf596", () => {
    const css = cssWithoutApprovedAuditPriorityFixes();
    const markerIndex = css.indexOf(desktopHeroSizingMarker);
    const page = read(pagePath);

    expect(css.slice(0, markerIndex)).toBe(atBaseline(cssPath) + "\n");
    expect(page).toBe(atBaseline(pagePath));
    expect(page).toContain('<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>');
    expect(changedProductionFiles()).toEqual([cssPath]);
  });
});
