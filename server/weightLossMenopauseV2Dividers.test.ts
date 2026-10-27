import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const baseline = "e7166374";
const cssPath = "client/src/pages/WeightLossMenopauseV2.css";
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const marker = "/* V2 section dividers — straight, content-width transitions only. */";
const firstTextVisitNoteMarker = "/* V2 first text visit note — pricing helper only. */";
const previousHeroSupportingLine = '<p className="hero-description">Explore your options for<br /><strong>GLP-1s, menopause &amp; hormone therapy.</strong></p>';
const approvedHeroSupportingLine = '<p className="hero-description"><strong>GLP-1s, menopause &amp; hormone therapy.</strong><br /><b>Done right for you. 100% virtual</b></p>';
const legacyFirstTextVisitRow = '<div><dt>First text visit</dt><dd>FREE</dd></div>';
const approvedFirstTextVisitRow = '<div><dt>First text visit<small className="first-text-visit-note">Includes 7 days of follow-up messaging.</small></dt><dd>FREE</dd></div>';
const finalFaqComponentImport = 'import WeightLossMenopauseV2Faq from "./WeightLossMenopauseV2Faq";\n';
const finalFaqDataImport = 'import { V2_FAQ_FOOTER_PARAGRAPHS, V2_FAQ_COPYRIGHT } from "./WeightLossMenopauseV2FaqData";\n';
const finalFaqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
const targets = [
  "#how-it-works",
  ".medication-pricing",
  "#doctor",
  ".support-section",
  "#testimonials",
  "#faq",
] as const;
const protectedNonCssFiles = [
  pagePath,
  doctorBioPath,
  "client/src/pages/WeightLossMenopauseV2MobileBar.tsx",
  "client/src/pages/weightLossMenopauseV2Interactions.ts",
  "shared/treatmentCatalog.json",
] as const;

type CssRule = { selectors: string[]; declarations: string };

function read(file: string): string {
  return readFileSync(resolve(root, file), "utf8");
}

function atBaseline(file: string): string {
  return execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function countExactOccurrences(source: string, value: string): number {
  return source.split(value).length - 1;
}

function normalizeApprovedHeroSupportingLine(source: string): string {
  return source.replace(approvedHeroSupportingLine, previousHeroSupportingLine);
}

function normalizeApprovedFirstTextVisitNote(source: string): string {
  return source.replace(approvedFirstTextVisitRow, legacyFirstTextVisitRow);
}

function normalizeFinalFaq(source: string): string {
  const baselinePage = atBaseline(pagePath);
  const baselineFaq = baselinePage.match(/<section className="section wave-top wave-surface" id="faq">[\s\S]*?<\/section>/)?.[0] ?? "";
  const baselineDisclosures = baselinePage.match(/<div className="disclosures">[\s\S]*?<\/div>/)?.[0] ?? "";
  const baselineCopyright = baselinePage.match(/<span className="footer-legal-copy">[\s\S]*?<\/span>/)?.[0] ?? "";
  const finalDisclosures = source.match(/<div className="disclosures">[\s\S]*?<\/div>/)?.[0] ?? "";
  const finalCopyright = source.match(/<span className="footer-legal-copy">[\s\S]*?<\/span>/)?.[0] ?? "";
  if (!baselineFaq || !baselineDisclosures || !baselineCopyright || !finalDisclosures || !finalCopyright) {
    throw new Error("Missing final FAQ or pinned footer replacement");
  }
  return source
    .replace(finalFaqComponentImport, "")
    .replace(finalFaqDataImport, "")
    .replace(finalFaqMount, baselineFaq)
    .replace(finalDisclosures, baselineDisclosures)
    .replace(finalCopyright, baselineCopyright);
}

function normalizeApprovedV2DoctorBioCredential(file: string, source: string): string {
  return file === doctorBioPath ? source.replace('"Family Physician"', '"Board-Certified DO"') : source;
}

function cssRules(css: string): CssRule[] {
  return Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g), match => ({
    selectors: match[1].split(",").map(selector => selector.trim().replace(/\s+/g, " ")).filter(Boolean),
    declarations: match[2].replace(/\s+/g, " ").trim(),
  }));
}

function parentSelector(target: string): string {
  return `.wlm-v2-content ${target}`;
}

function isParentSelector(selector: string): boolean {
  return targets.some(target => selector === parentSelector(target) || selector === `${parentSelector(target)}.wave-top`);
}

function isDividerSelector(selector: string): boolean {
  return targets.some(target => selector === `${parentSelector(target)}::before` || selector === `${parentSelector(target)}.wave-top::before`);
}

function containsEveryTarget(selectors: string[], pseudo: boolean): boolean {
  return targets.every(target => selectors.some(selector => pseudo
    ? selector === `${parentSelector(target)}::before` || selector === `${parentSelector(target)}.wave-top::before`
    : selector === parentSelector(target) || selector === `${parentSelector(target)}.wave-top`));
}

function has(declarations: string, property: string, value: string): boolean {
  return new RegExp(`${property}\\s*:\\s*${value}(?:\\s*!important)?\\s*(?:;|$)`, "i").test(declarations);
}

describe("Weight-Loss & Menopause V2 section dividers", () => {
  it("is a CSS-only append to the pinned approved V2 baseline after normalizing the separately approved final FAQ/footer delta", () => {
    const css = read(cssPath);
    const markerIndex = css.indexOf(marker);

    expect(css.match(/\/\* V2 section dividers — straight, content-width transitions only\. \*\//g)).toHaveLength(1);
    expect(markerIndex).toBeGreaterThanOrEqual(0);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(cssPath));
    for (const file of protectedNonCssFiles) {
      const source = read(file);
      if (file === pagePath) {
        expect(countExactOccurrences(source, approvedHeroSupportingLine)).toBe(1);
        expect(countExactOccurrences(source, previousHeroSupportingLine)).toBe(0);
        expect(normalizeApprovedHeroSupportingLine(normalizeApprovedFirstTextVisitNote(normalizeFinalFaq(source)))).toBe(atBaseline(file));
      } else {
        expect(normalizeApprovedV2DoctorBioCredential(file, source)).toBe(atBaseline(file));
      }
    }
  });

  it("uses only grouped V2 target parent and ::before selectors, never global styling", () => {
    const css = read(cssPath);
    const dividerCss = css.slice(css.indexOf(marker) + marker.length, css.indexOf(firstTextVisitNoteMarker)).trim();
    const rules = cssRules(dividerCss);

    expect(dividerCss).not.toBe("");
    expect(rules).not.toHaveLength(0);
    for (const rule of rules) {
      expect(rule.selectors).not.toHaveLength(0);
      for (const selector of rule.selectors) expect(isParentSelector(selector) || isDividerSelector(selector)).toBe(true);
    }
    expect(dividerCss).toMatch(/@media\s*\(\s*max-width\s*:\s*620px\s*\)/);
    expect(dividerCss).not.toMatch(/(?:^|[}\n])\s*(?:body|html|:root|\*)\b/);
  });

  it("adds the six straight, content-width, non-interactive pink-to-purple dividers and keeps wave resets on their pseudo-elements", () => {
    const css = read(cssPath);
    const dividerCss = css.slice(css.indexOf(marker) + marker.length, css.indexOf(firstTextVisitNoteMarker)).trim();
    const rules = cssRules(dividerCss);
    const parentRule = rules.find(rule =>
      containsEveryTarget(rule.selectors, false)
      && rule.selectors.every(isParentSelector)
      && has(rule.declarations, "position", "relative"),
    );
    const dividerRule = rules.find(rule =>
      containsEveryTarget(rule.selectors, true)
      && rule.selectors.every(isDividerSelector)
      && has(rule.declarations, "content", "[\"']{2}")
      && has(rule.declarations, "position", "absolute")
      && has(rule.declarations, "top", "0")
      && has(rule.declarations, "left", "0")
      && has(rule.declarations, "right", "0")
      && has(rule.declarations, "margin-inline", "auto")
      && has(rule.declarations, "width", "min\\(calc\\(100% - 40px\\),\\s*var\\(--max\\)\\)")
      && has(rule.declarations, "height", "1px")
      && has(rule.declarations, "border-radius", "0")
      && has(rule.declarations, "transform", "none")
      && has(rule.declarations, "(?:-webkit-)?mask", "none")
      && has(rule.declarations, "clip-path", "none")
      && has(rule.declarations, "box-shadow", "none")
      && has(rule.declarations, "pointer-events", "none"),
    );

    expect(parentRule, "missing the grouped six-target relative positioning rule").toBeDefined();
    expect(parentRule?.declarations).not.toMatch(/(?:transform|(?:-webkit-)?mask|clip-path|box-shadow)\s*:/i);
    expect(dividerRule, "missing the grouped six-target ::before divider rule").toBeDefined();
    expect(dividerRule?.selectors).toContain(".wlm-v2-content .support-section.wave-top::before");

    const gradient = dividerRule?.declarations.match(/(?:background|background-image)\s*:\s*(linear-gradient\([^;]+\))/i)?.[1] ?? "";
    expect(gradient).toMatch(/^linear-gradient\(\s*(?:90deg|to right)\s*,\s*transparent\s+0%/i);
    expect(gradient).toMatch(/transparent\s+100%\s*\)$/i);
    expect(gradient.match(/rgba\(/gi)).toHaveLength(3);
    expect(gradient).toBe("linear-gradient(90deg, transparent 0%, rgba(232, 51, 158, .55) 16%, rgba(122, 30, 126, .55) 50%, rgba(232, 51, 158, .55) 84%, transparent 100%)");

    const mobileStart = dividerCss.search(/@media\s*\(\s*max-width\s*:\s*620px\s*\)/);
    const mobileRules = cssRules(dividerCss.slice(mobileStart));
    const mobileWidthRule = mobileRules.find(rule =>
      containsEveryTarget(rule.selectors, true)
      && rule.selectors.every(isDividerSelector)
      && has(rule.declarations, "width", "min\\(calc\\(100% - 28px\\),\\s*var\\(--max\\)\\)"),
    );
    expect(mobileWidthRule, "missing the grouped 620px mobile content-width adjustment").toBeDefined();
  });
});
