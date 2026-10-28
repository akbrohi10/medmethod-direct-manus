import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type FaqCategory = { id: string; label: string };

const baseline = "94e43fdc";
const root = resolve(import.meta.dirname, "..");
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const faqComponentPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const mobileGridMarker = "\n/* V2 mobile FAQ chips — six equal cells, no horizontal scrolling. */";
const expectedMobileGridOverride = `${mobileGridMarker}
@media(max-width:767px) {
  .wlm-v2-content #faq .v2-faq-tabs {
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    overflow-x:visible;
  }
  .wlm-v2-content #faq .v2-faq-tabs button {
    width:100%;
    min-width:0;
    height:44px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:9px 4px;
    text-align:center;
  }
}
`;
const approvedV2HeroFontAppend = `
/* V2 hero headline — homepage font match only. */
.wlm-v2-content .hero[data-medmethod-scope] h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}
`;
const approvedV2DesktopHeroSizingAppend = `
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

const explicitUnchangedSources = [
  "client/src/pages/WeightLossMenopauseV2.tsx",
  faqComponentPath,
  faqDataPath,
  "client/src/pages/WeightLossMenopauseV2MobileBar.tsx",
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx",
  "client/src/components/weight-loss-menopause-v2/checkout97/videoVisitCheckout97Storage.ts",
  "server/_core/vite.ts",
  "server/routers/stripe.wl2.test.ts",
  "server/routers/paypal.wl2.test.ts",
  "server/wl2OneTimePayment.ts",
  "server/wl2PaymentResume.test.ts",
  "shared/treatmentCatalog.json",
] as const;
const approvedMasterclassFinalFaqPaths = new Set([
  "client/src/components/masterclass2/FinalFaq.tsx",
  "client/src/components/masterclass2/FinalFaq.css",
]);
const legitScriptFooterSealStart =
  '\n          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">';
const legitScriptFooterSealEnd = "\n          </div>";
const footerParagraphImport =
  'import { V2_FAQ_FOOTER_PARAGRAPHS } from "@/pages/WeightLossMenopauseV2FaqData";\n';
const footerDisclaimers = `
          <div data-masterclass-footer-disclaimers className="mx-auto mt-6 max-w-3xl space-y-3 text-center text-xs leading-6 text-[#766d75] sm:text-[13px]">
            {V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>`;
const oldDefaultOpenQuestions =
  'const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];';
const approvedDefaultOpenQuestions = `const DEFAULT_OPEN_QUESTIONS = V2_FAQ_CATEGORIES.flatMap(category =>
  category.items.slice(0, 3).map((_, index) => \`\${category.id}-\${index}\`),
);`;
const approvedSelectCategory = `  function selectCategory(categoryId: string) {
    const category = V2_FAQ_CATEGORIES.find(item => item.id === categoryId);
    if (!category) return;
    setExpandedCategories(previous => ({ ...previous, [categoryId]: false }));
    setOpenQuestions(previous => ({
      ...previous,
      ...Object.fromEntries(category.items.map((_, index) => [\`\${categoryId}-\${index}\`, index < 3])),
    }));
    setSelectedCategory(categoryId);
  }

`;
const originalV2ShowAllButton = `                <button
                  type="button"
                  className="btn secondary v2-faq-show-all"
                  aria-expanded={expanded}
                  aria-controls={\`v2-faq-questions-\${category.id}\`}
                  onClick={() => setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }))}
                >{expanded ? "Show fewer" : \`Show all \${category.items.length} questions\`}</button>`;
const approvedV2ShowAllButton = `                {category.items.length > 3 && (
                <button
                  type="button"
                  className="btn secondary v2-faq-show-all"
                  aria-expanded={expanded}
                  aria-controls={\`v2-faq-questions-\${category.id}\`}
                  onClick={() => {
                    setOpenQuestions(previous => ({
                      ...previous,
                      ...Object.fromEntries(category.items.slice(3).map((_, index) => [\`\${category.id}-\${index + 3}\`, false])),
                    }));
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}
                >{expanded ? "Show fewer" : \`Show all \${category.items.length} questions\`}</button>
                )}`;

const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const atBaseline = (file: string) => execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });

function normalizeApprovedV2FaqFirstThreeOpen(source: string): string {
  const count = (value: string) => source.split(value).length - 1;
  expect(count(approvedDefaultOpenQuestions)).toBe(1);
  expect(count(approvedSelectCategory)).toBe(1);
  expect(count("selectCategory(V2_FAQ_CATEGORIES[next].id);")).toBe(1);
  expect(count("onClick={() => selectCategory(category.id)}")).toBe(1);
  expect(count(approvedV2ShowAllButton)).toBe(1);
  return source
    .replace(approvedDefaultOpenQuestions, oldDefaultOpenQuestions)
    .replace(approvedSelectCategory, "")
    .replace("selectCategory(V2_FAQ_CATEGORIES[next].id);", "setSelectedCategory(V2_FAQ_CATEGORIES[next].id);")
    .replace("onClick={() => selectCategory(category.id)}", "onClick={() => setSelectedCategory(category.id)}")
    .replace(approvedV2ShowAllButton, originalV2ShowAllButton);
}

function faqCssWithoutApprovedAuditPriorityFixes(): string {
  const css = read(faqCssPath);
  return css.endsWith(approvedFaqAnswerFontAppend)
    ? css.slice(0, -approvedFaqAnswerFontAppend.length)
    : css;
}

function loadFaqCategories(): FaqCategory[] {
  const moduleUrl = pathToFileURL(resolve(root, faqDataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify(module.V2_FAQ_CATEGORIES.map(({ id, label }) => ({ id, label })))));`;
  return JSON.parse(execFileSync(process.execPath, ["--import", "tsx", "-e", script], { cwd: root, encoding: "utf8" })) as FaqCategory[];
}

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => !approvedMasterclassFinalFaqPaths.has(file) && file !== "client/src/pages/Masterclass2.tsx")
    .filter(file => normalizeApprovedV2HeroFontAppend(
      file,
      file === faqComponentPath ? normalizeApprovedV2FaqFirstThreeOpen(read(file)) : read(file),
    ) !== atBaseline(file));
}

function normalizeApprovedV2HeroFontAppend(file: string, source: string): string {
  return file === "client/src/pages/WeightLossMenopauseV2.css"
    ? source.endsWith(approvedAuditPriorityFixesAppend)
      ? source.slice(0, -approvedAuditPriorityFixesAppend.length).replace(approvedV2DesktopHeroSizingAppend, "").replace(approvedV2HeroFontAppend, "")
      : source.replace(approvedV2DesktopHeroSizingAppend, "").replace(approvedV2HeroFontAppend, "")
    : source;
}

function normalizeApprovedFinalFaqPageLines(source: string): string {
  const withoutFinalFaq = source
    .replace(footerParagraphImport, "")
    .replace(footerDisclaimers, "")
    .replace(
      "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(144px + env(safe-area-inset-bottom, 0px)); }\n        }",
      "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }\n        }",
    )
    .replace('aria-label="Video visit — $97"', 'aria-label="Video visit — $97 per visit"')
    .replace(
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97</span>',
      '<span className="block whitespace-nowrap text-[10px] font-normal">$97 per visit</span>',
    )
    .replace('import FinalFaq from "@/components/masterclass2/FinalFaq";\n', "")
    .replace('        <FinalFaq intakeHref="https://intake.medmethoddirect.com/" />\n', "");
  const start = withoutFinalFaq.indexOf(legitScriptFooterSealStart);
  if (start < 0) return withoutFinalFaq;
  const end = withoutFinalFaq.indexOf(legitScriptFooterSealEnd, start);
  if (end < 0) throw new Error("Missing end of marked Masterclass LegitScript footer seal");
  return withoutFinalFaq.slice(0, start) + withoutFinalFaq.slice(end + legitScriptFooterSealEnd.length);
}

describe("Weight-Loss & Menopause V2 mobile FAQ chip grid", () => {
  it("is an append-only CSS change: the prefix is byte-identical to 94e43fdc and the appended mobile block is exact", () => {
    const css = faqCssWithoutApprovedAuditPriorityFixes();
    const markerIndex = css.indexOf(mobileGridMarker);

    expect(markerIndex, "mobile FAQ chip marker missing").toBeGreaterThan(-1);
    expect(css.indexOf(mobileGridMarker, markerIndex + mobileGridMarker.length), "mobile FAQ chip marker must occur once").toBe(-1);
    expect(css.slice(0, markerIndex)).toBe(atBaseline(faqCssPath));
    expect(css.slice(markerIndex)).toBe(expectedMobileGridOverride);
  });

  it("uses exactly the six immutable FAQ categories in their original ordered labels, with Cost selected by default", () => {
    const data = read(faqDataPath);
    const component = read(faqComponentPath);

    expect(data).toBe(atBaseline(faqDataPath));
    expect(normalizeApprovedV2FaqFirstThreeOpen(component)).toBe(atBaseline(faqComponentPath));
    expect(loadFaqCategories()).toEqual([
      { id: "cost", label: "Cost" },
      { id: "visits", label: "Visits" },
      { id: "weight-loss", label: "Weight loss" },
      { id: "menopause", label: "Menopause" },
      { id: "both", label: "Both" },
      { id: "safety", label: "Safety" },
    ]);
    expect(component).toContain('const [selectedCategory, setSelectedCategory] = useState("cost");');
    expect(component).toContain("{V2_FAQ_CATEGORIES.map((category, index) => (");
    expect(component).toContain(">{category.label}</button>");
  });

  it("limits the override to the #faq mobile query and keeps six equal, centered 44px cells without horizontal overflow", () => {
    const css = faqCssWithoutApprovedAuditPriorityFixes();
    const appended = css.slice(css.indexOf(mobileGridMarker));

    expect(appended).toContain("@media(max-width:767px)");
    expect(appended).not.toMatch(/@media\(max-width:(?!767px)/);
    expect(appended).toMatch(/\.wlm-v2-content #faq \.v2-faq-tabs \{[\s\S]*display:grid;[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\);[\s\S]*overflow-x:visible;[\s\S]*\}/);
    expect(appended).toMatch(/\.wlm-v2-content #faq \.v2-faq-tabs button \{[\s\S]*width:100%;[\s\S]*min-width:0;[\s\S]*height:44px;[\s\S]*display:flex;[\s\S]*align-items:center;[\s\S]*justify-content:center;[\s\S]*padding:9px 4px;[\s\S]*text-align:center;[\s\S]*\}/);
    expect(appended).not.toMatch(/(?:font|color|border-radius|aria-selected|sticky|position)\s*:/);
  });

  it("leaves every production source byte-identical to 94e43fdc except the approved FAQ stylesheet append", () => {
    for (const file of explicitUnchangedSources) {
      expect(
        file === faqComponentPath ? normalizeApprovedV2FaqFirstThreeOpen(read(file)) : read(file),
        file,
      ).toBe(atBaseline(file));
    }
    expect(normalizeApprovedFinalFaqPageLines(read("client/src/pages/Masterclass2.tsx"))).toBe(atBaseline("client/src/pages/Masterclass2.tsx"));
    expect(changedProductionFiles()).toEqual([faqCssPath]);
  });
});
