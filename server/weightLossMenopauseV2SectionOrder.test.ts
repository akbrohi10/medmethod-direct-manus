import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = "d3b42db5";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const faqPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const medicationPricingStart = '<section className="medication-pricing"';
const estimatorStart = '<section className="estimator-band"';
const doctorBioMount = "<WeightLossMenopauseV2DoctorBio />";
const faqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const count = (source: string, value: string) => source.split(value).length - 1;

function medicationAndEstimatorBlock(source: string, endMarker: string): string {
  const start = source.indexOf(medicationPricingStart);
  const end = source.indexOf(endMarker, start);
  expect(start, "medication pricing section missing").toBeGreaterThan(-1);
  expect(end, "section-order end marker missing").toBeGreaterThan(start);
  return source.slice(start, end);
}

function section(source: string, start: string): string {
  return source.match(new RegExp(`${start}[\\s\\S]*?<\\/section>`))?.[0] ?? "";
}

function restoreApprovedMedicationEstimatorOrder(source: string): string {
  expect(count(source, medicationPricingStart)).toBe(1);
  expect(count(source, estimatorStart)).toBe(1);
  expect(count(source, doctorBioMount)).toBe(1);
  expect(count(source, faqMount)).toBe(1);

  const medicationIndex = source.indexOf(medicationPricingStart);
  const doctorIndex = source.indexOf(doctorBioMount);
  const faqIndex = source.indexOf(faqMount);
  expect(medicationIndex).toBeGreaterThan(doctorIndex);
  expect(medicationIndex).toBeLessThan(faqIndex);

  const movedBlock = source.slice(medicationIndex, faqIndex);
  const medicationPricing = section(movedBlock, medicationPricingStart);
  const estimator = section(movedBlock, estimatorStart);
  expect(medicationPricing).not.toBe("");
  expect(estimator).not.toBe("");
  expect(movedBlock).toBe(`${medicationPricing}${estimator}\n`);

  const withoutMovedBlock = source.slice(0, medicationIndex) + source.slice(faqIndex);
  const doctorAnchor = withoutMovedBlock.indexOf(doctorBioMount);
  expect(doctorAnchor).toBeGreaterThan(-1);
  return withoutMovedBlock.slice(0, doctorAnchor) + movedBlock + withoutMovedBlock.slice(doctorAnchor);
}

describe("Weight-Loss & Menopause V2 approved section order", () => {
  it("mounts each top-level section and component once in the approved conversion order", () => {
    const page = read(pagePath);
    const main = page.slice(page.indexOf("<main id=\"top\">"), page.indexOf("</main>"));
    const expectedOrder = [
      '<section className="hero"',
      '<section className="section process-pricing-section"',
      '<section className="featured-in"',
      doctorBioMount,
      '<section className="section support-section',
      '<section className="section testimonials',
      medicationPricingStart,
      estimatorStart,
      faqMount,
      '<section className="privacy-band',
    ];

    let previousIndex = -1;
    for (const marker of expectedOrder) {
      expect(count(main, marker), `${marker} must mount exactly once`).toBe(1);
      const index = main.indexOf(marker);
      expect(index, `${marker} must follow the preceding approved top-level item`).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(count(page, '<footer className="wave-top wave-footer">')).toBe(1);
    expect(page.indexOf('<footer className="wave-top wave-footer">')).toBeGreaterThan(page.indexOf('<section className="privacy-band'));
    expect(read(faqPath)).toContain('<h3 id="v2-faq-closing-title">Still have questions?</h3>');
  });

  it("keeps the hero immediately followed by the combined How It Works/visit-pricing section", () => {
    const page = read(pagePath);
    const main = page.slice(page.indexOf("<main id=\"top\">"), page.indexOf("</main>"));
    const heroStart = main.indexOf('<section className="hero"');
    const heroEnd = main.indexOf("</section>", heroStart) + "</section>".length;

    expect(main.slice(heroEnd).startsWith('\n<section className="section process-pricing-section"')).toBe(true);
    expect(main).toContain('className="process-pricing-offer" id="pricing"');
  });

  it("preserves byte-identical medication and estimator sections, adjacency, and the exact reversible d3b42db5 page", () => {
    const page = read(pagePath);
    const baselinePage = atBaseline(pagePath);
    const currentBlock = medicationAndEstimatorBlock(page, faqMount);
    const baselineBlock = medicationAndEstimatorBlock(baselinePage, doctorBioMount);
    const currentMedication = section(page, medicationPricingStart);
    const currentEstimator = section(page, estimatorStart);
    const baselineMedication = section(baselinePage, medicationPricingStart);
    const baselineEstimator = section(baselinePage, estimatorStart);

    expect(currentBlock).toBe(baselineBlock);
    expect(currentMedication).toBe(baselineMedication);
    expect(currentEstimator).toBe(baselineEstimator);
    expect(currentBlock).toBe(`${currentMedication}${currentEstimator}\n`);
    expect(restoreApprovedMedicationEstimatorOrder(page)).toBe(baselinePage);
  });

  it("changes no production source other than the approved V2 page move", () => {
    const changedProductionFiles = execFileSync(
      "git",
      ["diff", "--name-only", baseline, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file));

    expect(changedProductionFiles).toEqual([pagePath]);
  });
});
