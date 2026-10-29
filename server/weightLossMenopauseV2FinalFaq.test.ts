import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type FaqItem = { question: string; answer: string };
type FaqCategory = { id: string; label: string; title: string; items: FaqItem[] };
type FinalFaqFixture = {
  categories: FaqCategory[];
  closing: { question: string; answer: string };
  footer: { paragraphs: string[]; copyright: string };
};
type FinalFaqData = {
  V2_FAQ_CATEGORIES: FaqCategory[];
  V2_FAQ_CLOSING_TEXT: string;
  V2_FAQ_FOOTER_PARAGRAPHS: string[];
  V2_FAQ_COPYRIGHT: string;
};

const baseline = "7ed813a6";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const pageCssPath = "client/src/pages/WeightLossMenopauseV2.css";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const faqComponentPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const fixturePath = "server/fixtures/v2FaqFinal.json";
const approvedHeroFontAppend = `
/* V2 hero headline — homepage font match only. */
.wlm-v2-content .hero[data-medmethod-scope] h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}
`;
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
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
const fixture = JSON.parse(read(fixturePath)) as FinalFaqFixture;

function normalizeApprovedHeroFontAppend(path: string, source: string): string {
  return path === pageCssPath
    ? source.endsWith(approvedAuditPriorityFixesAppend)
      ? source.slice(0, -approvedAuditPriorityFixesAppend.length).replace(approvedDesktopHeroSizingAppend, "").replace(approvedHeroFontAppend, "")
      : source.replace(approvedDesktopHeroSizingAppend, "").replace(approvedHeroFontAppend, "")
    : source;
}

function normalizeApprovedV2DoctorBioMscpCredential(path: string, source: string): string {
  return path === "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx"
    ? source.replace(approvedMscpCredential, "")
    : source;
}

function section(source: string, id: string): string {
  return source.match(new RegExp(`<section[^>]*\\bid="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? "";
}

function footerDisclosures(source: string): string {
  return source.match(/<div className="disclosures">[\s\S]*?<\/div>/)?.[0] ?? "";
}

function footerCopyright(source: string): string {
  return source.match(/<span className="footer-legal-copy">[\s\S]*?<\/span>/)?.[0] ?? "";
}

function loadProductionFaqData(): FinalFaqData {
  const moduleUrl = pathToFileURL(resolve(root, faqDataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify({ V2_FAQ_CATEGORIES: module.V2_FAQ_CATEGORIES, V2_FAQ_CLOSING_TEXT: module.V2_FAQ_CLOSING_TEXT, V2_FAQ_FOOTER_PARAGRAPHS: module.V2_FAQ_FOOTER_PARAGRAPHS, V2_FAQ_COPYRIGHT: module.V2_FAQ_COPYRIGHT })))`;
  return JSON.parse(execFileSync(process.execPath, ["--import", "tsx", "-e", script], { cwd: root, encoding: "utf8" })) as FinalFaqData;
}

function normalizeFinalFaqPage(source: string, baselinePage: string): string {
  const baselineFaq = section(baselinePage, "faq");
  const baselineDisclosures = footerDisclosures(baselinePage);
  const baselineCopyright = footerCopyright(baselinePage);
  const finalFaqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';

  expect(baselineFaq, "baseline FAQ section missing").not.toBe("");
  expect(baselineDisclosures, "baseline footer disclosures missing").not.toBe("");
  expect(baselineCopyright, "baseline footer copyright missing").not.toBe("");
  expect(source.match(/import[^;\n]*WeightLossMenopauseV2Faq(?:Data)?[^;\n]*;\n/g) ?? []).toHaveLength(2);
  expect(source.match(/<WeightLossMenopauseV2Faq intakeHref=\{WEIGHT_MENOPAUSE_INTAKE_URL\} \/>/g) ?? []).toHaveLength(1);
  expect(footerDisclosures(source), "final footer disclosures missing").not.toBe("");
  expect(footerCopyright(source), "final footer copyright missing").not.toBe("");

  return source
    .replace(/import[^;\n]*WeightLossMenopauseV2Faq(?:Data)?[^;\n]*;\n/g, "")
    .replace(finalFaqMount, baselineFaq)
    .replace(footerDisclosures(source), baselineDisclosures)
    .replace(footerCopyright(source), baselineCopyright);
}

describe("Weight-Loss & Menopause V2 final approved FAQ", () => {
  it("keeps the independently extracted final DOCX fixture structurally complete", () => {
    expect(fixture.categories.map(category => [category.id, category.label, category.title, category.items.length])).toEqual([
      ["cost", "Cost", "Getting started and cost", 9],
      ["visits", "Visits", "Text and video visits", 7],
      ["weight-loss", "Weight loss", "Weight loss with GLP-1 medications", 11],
      ["menopause", "Menopause", "Menopause and hormone therapy", 7],
      ["both", "Both", "Treating weight and menopause together", 3],
      ["safety", "Safety", "Your doctor, safety, and privacy", 7],
    ]);
    expect(fixture.categories.flatMap(category => category.items)).toHaveLength(44);
    expect(fixture.closing).toEqual({
      question: "Still have questions?",
      answer: "Ask Dr. Al-Deek and her care team directly in your free first text visit. It takes 5–10 minutes to start, with no cost and no commitment. Prefer to talk to someone first? Call our care team at (888) 362-7011.",
    });
    expect(fixture.footer.paragraphs).toHaveLength(2);
    expect(fixture.footer.copyright).toBe("© 2026 MedMethod Direct. All rights reserved.");
  });

  it("exports exactly the 44 final source questions, answers, order, closing, and footer copy with no additions", () => {
    const production = loadProductionFaqData();

    expect(production.V2_FAQ_CATEGORIES).toEqual(fixture.categories);
    expect(production.V2_FAQ_CATEGORIES).toHaveLength(6);
    expect(production.V2_FAQ_CATEGORIES.flatMap(category => category.items)).toHaveLength(44);
    expect(production.V2_FAQ_CATEGORIES.flatMap(category => category.items.map(item => item.question))).toEqual(
      fixture.categories.flatMap(category => category.items.map(item => item.question)),
    );
    expect(production.V2_FAQ_CATEGORIES.flatMap(category => category.items.map(item => item.answer))).toEqual(
      fixture.categories.flatMap(category => category.items.map(item => item.answer)),
    );
    expect(production.V2_FAQ_CLOSING_TEXT).toBe(fixture.closing.answer);
    expect(production.V2_FAQ_FOOTER_PARAGRAPHS).toEqual(fixture.footer.paragraphs);
    expect(production.V2_FAQ_COPYRIGHT).toBe(fixture.footer.copyright);
  });

  it("uses the final data through an isolated native-details FAQ component and keeps its CSS out of the existing page stylesheet", () => {
    const component = read(faqComponentPath);
    const page = read(pagePath);

    expect(component).toMatch(/import\s*\{[\s\S]*\bV2_FAQ_CATEGORIES\b[\s\S]*\bV2_FAQ_CLOSING_TEXT\b[\s\S]*\}\s*from "\.\/WeightLossMenopauseV2FaqData";/);
    expect(component).toContain('import "./WeightLossMenopauseV2Faq.css";');
    expect(component).toContain("export default function WeightLossMenopauseV2Faq({ intakeHref }: { intakeHref: string })");
    expect(component).toContain('section className="section wave-top wave-surface" id="faq"');
    expect(component).toContain('data-v2-final-faq');
    expect(component).toContain("V2_FAQ_CATEGORIES.map");
    expect(component).toContain("category.items.map");
    expect(component).toContain("<details");
    expect(component).toContain('hidden={selectedCategory !== category.id}');
    expect(component).toContain('hidden={index >= 3 && !expanded}');
    expect(component).toContain(`const DEFAULT_OPEN_QUESTIONS = V2_FAQ_CATEGORIES.flatMap(category =>
  category.items.slice(0, 3).map((_, index) => \`\${category.id}-\${index}\`),
);`);
    expect(component).toContain("Show all");
    expect(component).toContain("Show fewer");
    expect(fixture.categories[0].items[0].question).toBe("Is my first visit really free?");
    expect(fixture.categories[0].items[2].question).toBe("How much will my care cost each month?");
    expect(fixture.categories[1].items[0].question).toBe("Do I need a video appointment?");
    expect(component).toContain(fixture.closing.question);
    expect(component).toContain("V2_FAQ_CLOSING_TEXT");
    expect(component).toContain("intakeHref");
    expect(component).not.toContain("Prototype disclosure:");
    expect(read(faqCssPath)).not.toBe("");
    expect(normalizeApprovedHeroFontAppend(pageCssPath, read(pageCssPath))).toBe(atBaseline(pageCssPath));
    expect(page).toContain('import WeightLossMenopauseV2Faq from "./WeightLossMenopauseV2Faq";');
  });

  it("is exactly reversible to 7ed813a6 outside the approved FAQ replacement, its imports, and the final footer copy", () => {
    const page = read(pagePath);
    const baselinePage = atBaseline(pagePath);
    const baselineFaq = section(baselinePage, "faq");

    expect(section(page, "faq")).toBe("");
    expect(page).not.toContain(baselineFaq);
    expect(page).not.toContain("Final clinical, pharmacy, pricing, and state-availability language should be reviewed before launch.");
    expect(page).toContain('import { V2_FAQ_FOOTER_PARAGRAPHS, V2_FAQ_COPYRIGHT } from "./WeightLossMenopauseV2FaqData";');
    expect(footerDisclosures(page)).toContain("V2_FAQ_FOOTER_PARAGRAPHS");
    expect(footerCopyright(page)).toContain("V2_FAQ_COPYRIGHT");
    expect(footerDisclosures(page)).not.toContain("Prototype disclosure:");
    expect(footerCopyright(page)).not.toContain("MMD Weight Loss. Working title and prototype content.");
    expect(normalizeFinalFaqPage(page, baselinePage)).toBe(baselinePage);
  });

  it("leaves all other V2 page ownership boundaries unchanged: styles, catalog, intake, payments, and routing remain pinned to 7ed813a6", () => {
    for (const file of [
      "client/src/pages/WeightLossMenopauseV2.css",
      "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx",
      "client/src/pages/WeightLossMenopauseV2MobileBar.tsx",
      "client/src/pages/weightLossMenopauseV2Interactions.ts",
      "client/src/App.tsx",
      "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx",
      "client/src/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage.ts",
      "shared/treatmentCatalog.json",
      "server/_core/vite.ts",
      "server/routers/stripe.wl2.test.ts",
      "server/routers/paypal.wl2.test.ts",
      "server/wl2OneTimePayment.ts",
      "server/wl2PaymentResume.test.ts",
    ]) {
      expect(normalizeApprovedHeroFontAppend(file, normalizeApprovedV2DoctorBioMscpCredential(file, read(file))), file).toBe(atBaseline(file));
    }
  });
});
