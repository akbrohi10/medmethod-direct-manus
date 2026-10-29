import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type FaqItem = { question: string; answer: string };
const baseline = "62bec055";
const root = resolve(import.meta.dirname, "..");
const heroCssPath = "client/src/pages/WeightLossMenopauseV2.css";
const faqCssPath = "client/src/pages/WeightLossMenopauseV2Faq.css";
const pagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const doctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const faqComponentPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const masterclassFaqComponentPath = "client/src/components/masterclass2/FinalFaq.tsx";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const oldDefaultOpenQuestions =
  'const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];';
const approvedDefaultOpenQuestions = `const DEFAULT_OPEN_QUESTIONS = V2_FAQ_CATEGORIES.flatMap(category =>
  category.items.slice(0, 3).map((_, index) => \`\${category.id}-\${index}\`),
);`;
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS, MSCP</h2>';
const baselineV2DoctorHeading = '<h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
const approvedHomepageMscpOptIn = "          showMscpCredential\n";
const approvedHomepageMscpDestructuredDefault = "  showMscpCredential = false,\n";
const approvedHomepageMscpType = "  showMscpCredential?: boolean;\n";
const approvedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");
const approvedHomepageMscpCredentialMap = "{credentialPills.map((pill) => (";
const defaultHomepageCredentialMap = "{CREDENTIAL_PILLS.map((pill) => (";
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
const heroAuditPriorityFixesAppend = `
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
const faqAnswerFontAppend = `
/* V2 audit priority fix — readable FAQ answers only. */
.wlm-v2-content #faq .faq-list details > p {
  font-size: 17px;
}
`;

function read(file: string): string {
  return readFileSync(resolve(root, file), "utf8");
}

function atBaseline(file: string): string {
  return execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function normalizeOnlyApprovedAuditPriorityAppend(file: string, source: string): string {
  if (file === heroCssPath && source.endsWith(heroAuditPriorityFixesAppend)) {
    return source.slice(0, -heroAuditPriorityFixesAppend.length);
  }
  if (file === faqCssPath && source.endsWith(faqAnswerFontAppend)) {
    return source.slice(0, -faqAnswerFontAppend.length);
  }
  return source;
}

function normalizeApprovedV2DoctorBioMscpCredential(file: string, source: string): string {
  if (file !== doctorBioPath) return source;
  const count = (value: string) => source.split(value).length - 1;
  expect(count(approvedMscpCredential)).toBe(1);
  expect(count(approvedV2DoctorHeading)).toBe(1);
  return source
    .replace(approvedMscpCredential, "")
    .replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
}

function normalizeApprovedMasterclassMscpCredential(file: string, source: string): string {
  if (file !== masterclassProfilePath) return source;
  expect(source.split(approvedMasterclassMscpCredentialLine).length - 1).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
}

function normalizeApprovedHomepageMscpCredential(file: string, source: string): string {
  const count = (value: string) => source.split(value).length - 1;
  if (file === homepagePath) {
    expect(count(approvedHomepageMscpOptIn)).toBe(1);
    return source.replace(approvedHomepageMscpOptIn, "");
  }
  if (file !== homepageMedicalTeamPath) return source;
  expect(count(approvedHomepageMscpDestructuredDefault)).toBe(1);
  expect(count(approvedHomepageMscpType)).toBe(1);
  expect(count(approvedHomepageMscpCredentialSelection)).toBe(1);
  expect(count(approvedHomepageMscpCredentialMap)).toBe(1);
  return source
    .replace(approvedHomepageMscpDestructuredDefault, "")
    .replace(approvedHomepageMscpType, "")
    .replace(approvedHomepageMscpCredentialSelection, "")
    .replace(approvedHomepageMscpCredentialMap, defaultHomepageCredentialMap);
}

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

function changedProductionFiles(): string[] {
  return execFileSync("git", ["diff", "--name-only", baseline, "--", "client", "server", "shared"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter(file => !/\.test\.[cm]?[jt]sx?$/.test(file))
    .filter(file => file !== faqComponentPath && file !== masterclassFaqComponentPath)
    .filter(file => normalizeApprovedHomepageMscpCredential(file, normalizeApprovedMasterclassMscpCredential(file, read(file))) !== atBaseline(file));
}

function loadFaqItems(): FaqItem[] {
  const moduleUrl = pathToFileURL(resolve(root, faqDataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify(module.V2_FAQ_CATEGORIES.flatMap(category => category.items))))`;
  return JSON.parse(execFileSync(process.execPath, ["--import", "tsx", "-e", script], { cwd: root, encoding: "utf8" })) as FaqItem[];
}

describe("Weight-Loss & Menopause V2 audit priority fixes", () => {
  it("keeps both production stylesheet prefixes byte-identical to 62bec055 and appends only the two approved blocks", () => {
    const heroCss = read(heroCssPath);
    const faqCss = read(faqCssPath);

    expect(heroCss).toBe(`${atBaseline(heroCssPath)}${heroAuditPriorityFixesAppend}`);
    expect(faqCss).toBe(`${atBaseline(faqCssPath)}${faqAnswerFontAppend}`);
    expect(normalizeOnlyApprovedAuditPriorityAppend(heroCssPath, heroCss)).toBe(atBaseline(heroCssPath));
    expect(normalizeOnlyApprovedAuditPriorityAppend(faqCssPath, faqCss)).toBe(atBaseline(faqCssPath));
    expect(normalizeOnlyApprovedAuditPriorityAppend(pagePath, read(pagePath))).toBe(read(pagePath));
  });

  it("limits the hero handoff to the 901–1024px gap and makes only the existing scoped headline 36px there", () => {
    const baselineHeroCss = atBaseline(heroCssPath);
    const handoffMediaRule = heroAuditPriorityFixesAppend.match(/@media \(min-width: 901px\) and \(max-width: 1024px\) \{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(heroAuditPriorityFixesAppend).toContain("@media (min-width: 901px) and (max-width: 1024px)");
    expect(handoffMediaRule).toBe(`@media (min-width: 901px) and (max-width: 1024px) {
  .wlm-v2-content .hero[data-medmethod-scope] h1 {
    font-size: clamp(36px, 3vw, 50px);
  }
}`);
    expect(heroAuditPriorityFixesAppend).not.toMatch(/@media\s*\(\s*(?:min-width\s*:\s*(?:0|[1-8]\d\d|900)px|max-width\s*:\s*(?:102[5-9]|10[3-9]\d|1[1-9]\d\d|[2-9]\d{3,})px)/);
    expect(baselineHeroCss).toContain("@media (min-width: 1025px) {\n  .wlm-v2-content .hero[data-medmethod-scope] h1 {\n    font-size: clamp(36px, 3vw, 50px);\n  }\n}");
  });

  it("raises only FAQ answer paragraphs to 17px and preserves the existing answer color, line height, questions, answers, and interactions", () => {
    const faqItems = loadFaqItems();
    const faqComponent = read(faqComponentPath);

    expect(faqAnswerFontAppend).toBe(`
/* V2 audit priority fix — readable FAQ answers only. */
.wlm-v2-content #faq .faq-list details > p {
  font-size: 17px;
}
`);
    expect(faqAnswerFontAppend.match(/font-size\s*:/g)).toHaveLength(1);
    expect(faqAnswerFontAppend).not.toMatch(/(?:color|line-height|margin|padding|display|position|height|width|transition|animation)\s*:/);
    expect(read(faqDataPath)).toBe(atBaseline(faqDataPath));
    expect(normalizeApprovedV2FaqFirstThreeOpen(faqComponent)).toBe(atBaseline(faqComponentPath));
    expect(faqItems).toHaveLength(44);
    expect(faqItems.every(item => item.question.length > 0 && item.answer.length > 0)).toBe(true);
    expect(faqComponent).toContain("<details");
    expect(faqComponent).toContain("hidden={index >= 3 && !expanded}");
    expect(faqComponent).toContain("onToggle={event =>");
    expect(faqComponent).toContain("<p>{item.answer}</p>");
  });

  it("sets the existing book-title strong to dark brand purple only, without altering its source or doctor section behavior", () => {
    const doctorBio = read(doctorBioPath);

    expect(heroAuditPriorityFixesAppend).toContain(".wlm-v2-content #doctor .doctor-bio-book {\n  color: #7A1E7E;\n}");
    expect(heroAuditPriorityFixesAppend.match(/\.doctor-bio-book/g)).toHaveLength(1);
    expect(heroAuditPriorityFixesAppend.match(/color\s*:/g)).toHaveLength(1);
    expect(normalizeApprovedV2DoctorBioMscpCredential(doctorBioPath, doctorBio)).toBe(atBaseline(doctorBioPath));
    expect(doctorBio).toContain('<strong className="doctor-bio-book">The Menopause Weight Loss Trap</strong>');
  });

  it("leaves every other production file, including page copy, pricing, links, and payment paths, at the 62bec055 baseline", () => {
    expect(changedProductionFiles()).toEqual([heroCssPath, doctorBioPath, faqCssPath]);
    expect(read(pagePath)).toBe(atBaseline(pagePath));
    expect(read("shared/treatmentCatalog.json")).toBe(atBaseline("shared/treatmentCatalog.json"));
    expect(read("client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx")).toBe(atBaseline("client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitCheckout97.tsx"));
    expect(read("server/routers/stripe.wl2.test.ts")).toBe(atBaseline("server/routers/stripe.wl2.test.ts"));
    expect(read("server/routers/paypal.wl2.test.ts")).toBe(atBaseline("server/routers/paypal.wl2.test.ts"));
  });
});
