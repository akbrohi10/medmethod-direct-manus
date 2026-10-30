import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type V2FaqData = {
  V2_FAQ_CATEGORIES: Array<{ items: unknown[] }>;
  V2_FAQ_FOOTER_PARAGRAPHS: string[];
};

const BASELINE = "15da38f3";
const root = resolve(import.meta.dirname, "..");

// Separately approved WeightCare and signed-intake paths are covered independently.
// Keep all other sources frozen.
const approvedWeightCareRegressionPaths = new Set([
  "client/intake/index.html",
  "client/public/intake/weight-care-uploads.js",
  "client/public/intake/weight-care-uploads.css",
  "client/public/intake/sign-forms-data.js",
  "client/public/intake/sign-forms-ui.js",
  "client/public/intake/sign-forms.css",
  "server/fixtures/intakeSigningFixture.ts",
  "server/fixtures/intake-sign-forms-copy.json",
  "server/intakePaymentRoutes.ts",
  "server/intakeSubmissionContract.ts",
  "server/intakePrivateUploads.ts",
  "server/intakeSignedFormsStore.ts",
  "server/intakeSignedPdf.ts",
  "server/intakeSigningInput.ts",
  "server/intakeTestAuthorization.ts",
  "shared/intakeSignForms.json",
]);
// Exact inverse coverage for these separately approved copy-only deltas lives in thankYouNextStepsCopy.test.ts.
const approvedThankYouNextStepsPaths = new Set([
  "client/intake/thank-you/index.html",
  "client/src/pages/ThankYouVideo.tsx",
]);
const pagePath = "client/src/pages/Masterclass2.tsx";
const componentPath = "client/src/components/masterclass2/FinalFaq.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const dataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const cssPath = "client/src/components/masterclass2/FinalFaq.css";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";

const footerParagraphImport =
  'import { V2_FAQ_FOOTER_PARAGRAPHS } from "@/pages/WeightLossMenopauseV2FaqData";\n';
const footerDisclaimers = `
          <div data-masterclass-footer-disclaimers className="mx-auto mt-6 max-w-3xl space-y-3 text-center text-xs leading-6 text-[#766d75] sm:text-[13px]">
            {V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>`;
const oldMobilePadding =
  "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px)); }\n        }";
const approvedMobilePadding =
  "        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(144px + env(safe-area-inset-bottom, 0px)); }\n        }";
const oldMobileBookingAria = 'aria-label="Video visit — $97 per visit"';
const approvedMobileBookingAria = 'aria-label="Video visit — $97"';
const oldMobileBookingPrice =
  '<span className="block whitespace-nowrap text-[10px] font-normal">$97 per visit</span>';
const approvedMobileBookingPrice =
  '<span className="block whitespace-nowrap text-[10px] font-normal">$97</span>';
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
const approvedV2AuditPriorityFixesAppend = `
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
const approvedV2FaqAnswerFontAppend = `
/* V2 audit priority fix — readable FAQ answers only. */
.wlm-v2-content #faq .faq-list details > p {
  font-size: 17px;
}
`;
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
const approvedHomepageFamilyPhysicianOptIn = '          firstCredentialLabel="Family Physician"\n';
const approvedHomepageFamilyPhysicianDestructuredDefault = "  firstCredentialLabel = CREDENTIAL_PILLS[0],\n";
const approvedHomepageFamilyPhysicianType = "  firstCredentialLabel?: string;\n";
const approvedHomepageFamilyPhysicianCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];",
  "",
].join("\n");
const retainedHomepageMscpCredentialSelection = [
  "  const credentialPills = showMscpCredential",
  '    ? [CREDENTIAL_PILLS[0], "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]',
  "    : CREDENTIAL_PILLS;",
  "",
].join("\n");

const originalShowAllButton = `                <button type="button" className="mc-faq-show-all" aria-expanded={expanded}
                  aria-controls={\`mc-faq-questions-\${category.id}\`}
                  onClick={() => {
                    if (expanded) collapseTarget.current = category.id;
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}>{expanded ? "Show fewer" : \`Show all \${category.items.length} questions\`}</button>`;
const approvedConditionalShowAllButton = `                {category.items.length > 3 && (
                <button type="button" className="mc-faq-show-all" aria-expanded={expanded}
                  aria-controls={\`mc-faq-questions-\${category.id}\`}
                  onClick={() => {
                    if (expanded) collapseTarget.current = category.id;
                    setOpenQuestions(previous => ({
                      ...previous,
                      ...Object.fromEntries(category.items.slice(3).map((_, index) => [\`\${category.id}-\${index + 3}\`, false])),
                    }));
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}>{expanded ? "Show fewer" : \`Show all \${category.items.length} questions\`}</button>
                )}`;
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

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const atBaseline = (path: string) =>
  execFileSync("git", ["show", `${BASELINE}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const count = (source: string, value: string) => source.split(value).length - 1;

function loadV2FaqData(): V2FaqData {
  const moduleUrl = pathToFileURL(resolve(root, dataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify({ V2_FAQ_CATEGORIES: module.V2_FAQ_CATEGORIES, V2_FAQ_FOOTER_PARAGRAPHS: module.V2_FAQ_FOOTER_PARAGRAPHS })))`;
  return JSON.parse(
    execFileSync(process.execPath, ["--import", "tsx", "-e", script], {
      cwd: root,
      encoding: "utf8",
    }),
  ) as V2FaqData;
}

function v2ProductionPaths(): string[] {
  return execFileSync(
    "git",
    ["ls-tree", "-r", "--name-only", BASELINE, "--", "client/src"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean)
    .filter(path =>
      /(?:WeightLossMenopauseV2|weightLossMenopauseV2|weight-loss-menopause-v2)/.test(
        path,
      ),
    );
}

function changedProductionFiles(): string[] {
  return execFileSync(
    "git",
    ["diff", "--name-only", BASELINE, "--", "client", "server", "shared"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean)
    .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path))
    .filter(path => !approvedWeightCareRegressionPaths.has(path))
    .filter(path => !approvedThankYouNextStepsPaths.has(path))
    .filter(path => normalizeApprovedHomepageMscpCredential(path, normalizeApprovedV2HeroFontAppend(path, normalizeApprovedMasterclassMscpCredential(path, normalizeApprovedV2SectionOrder(path, read(path))))) !== atBaseline(path));
}

function normalizeApprovedMasterclassMscpCredential(path: string, source: string): string {
  if (path !== masterclassProfilePath) return source;
  expect(count(source, approvedMasterclassMscpCredentialLine)).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
}

function normalizeApprovedHomepageMscpCredential(path: string, source: string): string {
  if (path === homepagePath) {
    expect(count(source, approvedHomepageFamilyPhysicianOptIn)).toBe(1);
    expect(count(source, approvedHomepageMscpOptIn)).toBe(1);
    return source
      .replace(approvedHomepageFamilyPhysicianOptIn, "")
      .replace(approvedHomepageMscpOptIn, "");
  }
  if (path !== homepageMedicalTeamPath) return source;
  expect(count(source, approvedHomepageFamilyPhysicianDestructuredDefault)).toBe(1);
  expect(count(source, approvedHomepageFamilyPhysicianType)).toBe(1);
  expect(count(source, approvedHomepageFamilyPhysicianCredentialSelection)).toBe(1);
  expect(count(source, approvedHomepageMscpDestructuredDefault)).toBe(1);
  expect(count(source, approvedHomepageMscpType)).toBe(1);
  expect(count(source, approvedHomepageMscpCredentialMap)).toBe(1);
  const restoredFamilyCredential = source
    .replace(approvedHomepageFamilyPhysicianDestructuredDefault, "")
    .replace(approvedHomepageFamilyPhysicianType, "")
    .replace(approvedHomepageFamilyPhysicianCredentialSelection, retainedHomepageMscpCredentialSelection);
  expect(count(restoredFamilyCredential, approvedHomepageMscpCredentialSelection)).toBe(1);
  return restoredFamilyCredential
    .replace(approvedHomepageMscpDestructuredDefault, "")
    .replace(approvedHomepageMscpType, "")
    .replace(approvedHomepageMscpCredentialSelection, "")
    .replace(approvedHomepageMscpCredentialMap, defaultHomepageCredentialMap);
}

function normalizeApprovedV2HeroFontAppend(path: string, source: string): string {
  const withoutApprovedMscpCredential = path === v2DoctorBioPath
    ? (() => {
      expect(count(source, approvedMscpCredential)).toBe(1);
      expect(count(source, approvedV2DoctorHeading)).toBe(1);
      return source
        .replace(approvedMscpCredential, "")
        .replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
    })()
    : source;
  const withoutApprovedFaqFirstThreeOpen = path === "client/src/pages/WeightLossMenopauseV2Faq.tsx"
    ? normalizeApprovedV2FaqFirstThreeOpen(withoutApprovedMscpCredential)
    : withoutApprovedMscpCredential;
  return path === "client/src/pages/WeightLossMenopauseV2.css"
    ? (withoutApprovedFaqFirstThreeOpen.endsWith(approvedV2AuditPriorityFixesAppend)
      ? withoutApprovedFaqFirstThreeOpen.slice(0, -approvedV2AuditPriorityFixesAppend.length)
      : withoutApprovedFaqFirstThreeOpen).replace(approvedV2DesktopHeroSizingAppend, "").replace(approvedV2HeroFontAppend, "")
    : path === "client/src/pages/WeightLossMenopauseV2Faq.css" && source.endsWith(approvedV2FaqAnswerFontAppend)
      ? withoutApprovedFaqFirstThreeOpen.slice(0, -approvedV2FaqAnswerFontAppend.length)
    : withoutApprovedFaqFirstThreeOpen;
}

function restoreApprovedPage(source: string): string {
  expect(count(source, footerParagraphImport)).toBe(1);
  expect(count(source, footerDisclaimers)).toBe(1);
  expect(count(source, approvedMobilePadding)).toBe(1);
  expect(count(source, approvedMobileBookingAria)).toBe(1);
  expect(count(source, approvedMobileBookingPrice)).toBe(1);

  return source
    .replace(footerParagraphImport, "")
    .replace(footerDisclaimers, "")
    .replace(approvedMobilePadding, oldMobilePadding)
    .replace(approvedMobileBookingAria, oldMobileBookingAria)
    .replace(approvedMobileBookingPrice, oldMobileBookingPrice);
}

function normalizeApprovedV2FaqFirstThreeOpen(source: string): string {
  expect(count(source, approvedDefaultOpenQuestions)).toBe(1);
  expect(count(source, approvedSelectCategory)).toBe(1);
  expect(count(source, "selectCategory(V2_FAQ_CATEGORIES[next].id);")).toBe(1);
  expect(count(source, "onClick={() => selectCategory(category.id)}")).toBe(1);
  expect(count(source, approvedV2ShowAllButton)).toBe(1);
  return source
    .replace(approvedDefaultOpenQuestions, oldDefaultOpenQuestions)
    .replace(approvedSelectCategory, "")
    .replace("selectCategory(V2_FAQ_CATEGORIES[next].id);", "setSelectedCategory(V2_FAQ_CATEGORIES[next].id);")
    .replace("onClick={() => selectCategory(category.id)}", "onClick={() => setSelectedCategory(category.id)}")
    .replace(approvedV2ShowAllButton, originalV2ShowAllButton);
}

function unwrapApprovedShowAllConditional(source: string): string {
  expect(count(source, approvedConditionalShowAllButton)).toBe(1);
  const withoutApprovedFirstThreeOpen = source
    .replace(approvedDefaultOpenQuestions, oldDefaultOpenQuestions)
    .replace(approvedSelectCategory, "")
    .replace("selectCategory(V2_FAQ_CATEGORIES[next].id);", "setSelectedCategory(V2_FAQ_CATEGORIES[next].id);")
    .replace("onClick={() => selectCategory(category.id)}", "onClick={() => setSelectedCategory(category.id)}");
  expect(count(source, approvedDefaultOpenQuestions)).toBe(1);
  expect(count(source, approvedSelectCategory)).toBe(1);
  expect(count(source, "selectCategory(V2_FAQ_CATEGORIES[next].id);")).toBe(1);
  expect(count(source, "onClick={() => selectCategory(category.id)}")).toBe(1);
  return withoutApprovedFirstThreeOpen.replace(approvedConditionalShowAllButton, originalShowAllButton);
}

function normalizeApprovedV2SectionOrder(path: string, source: string): string {
  if (path !== "client/src/pages/WeightLossMenopauseV2.tsx") return source;
  const medicationPricingStart = '<section className="medication-pricing"';
  const estimatorStart = '<section className="estimator-band"';
  const doctorBioMount = "<WeightLossMenopauseV2DoctorBio />";
  const faqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
  const count = (value: string) => source.split(value).length - 1;
  if (count(medicationPricingStart) !== 1 || count(estimatorStart) !== 1 || count(doctorBioMount) !== 1 || count(faqMount) !== 1) {
    throw new Error("Expected exactly one approved V2 medication/estimator reorder boundary");
  }
  const medicationStart = source.indexOf(medicationPricingStart);
  const doctorStart = source.indexOf(doctorBioMount);
  const faqStart = source.indexOf(faqMount);
  if (medicationStart <= doctorStart || medicationStart >= faqStart) {
    throw new Error("Expected medication and estimator block only between doctor bio and final FAQ");
  }
  const medicationAndEstimator = source.slice(medicationStart, faqStart);
  if (!medicationAndEstimator.includes(estimatorStart) || !medicationAndEstimator.endsWith("\n")) {
    throw new Error("Expected the exact adjacent medication and estimator block with its trailing newline");
  }
  const withoutMedicationAndEstimator = source.slice(0, medicationStart) + source.slice(faqStart);
  const restoredDoctorStart = withoutMedicationAndEstimator.indexOf(doctorBioMount);
  if (restoredDoctorStart < 0) throw new Error("Missing V2 doctor-bio restoration anchor");
  return withoutMedicationAndEstimator.slice(0, restoredDoctorStart)
    + medicationAndEstimator
    + withoutMedicationAndEstimator.slice(restoredDoctorStart);
}

describe("Masterclass small footer, FAQ, and mobile-bar fixes", () => {
  it("is exactly reversible to 15da38f3 by undoing only the approved footer import/block, mobile clearance, visible price, and aria label", () => {
    const page = read(pagePath);

    expect(page).toContain(`${footerDisclaimers}\n        </footer>`);
    expect(page.indexOf("data-masterclass-legitscript-footer-seal")).toBeLessThan(
      page.indexOf("data-masterclass-footer-disclaimers"),
    );
    expect(page).not.toContain(oldMobilePadding);
    expect(page).not.toContain(oldMobileBookingAria);
    expect(page).not.toContain(oldMobileBookingPrice);
    expect(restoreApprovedPage(page)).toBe(atBaseline(pagePath));
  });

  it("reuses the immutable two-paragraph V2 disclosures without copying them, while retaining all 44 V2 FAQ items", () => {
    const page = read(pagePath);
    const data = loadV2FaqData();

    expect(read(dataPath)).toBe(atBaseline(dataPath));
    expect(data.V2_FAQ_CATEGORIES.flatMap(category => category.items)).toHaveLength(44);
    expect(data.V2_FAQ_FOOTER_PARAGRAPHS).toEqual([
      "Compounded medications are not FDA-approved. A prescription is never guaranteed and is issued only when a licensed clinician determines treatment is appropriate. Individual results vary. Weight-loss medication carries risks and may not be appropriate for everyone.",
      "For adults age 18 and older. Services are currently available in Arizona, Colorado, the District of Columbia, Florida, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, and Virginia. This website does not provide emergency care. If you are experiencing a medical emergency, call 911.",
    ]);
    expect(page).toContain(footerParagraphImport.trim());
    expect(page).toContain(
      "{V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}",
    );
    for (const paragraph of data.V2_FAQ_FOOTER_PARAGRAPHS) {
      expect(page).not.toContain(paragraph);
    }
  });

  it("uses the taller mobile-only clearance and keeps the bar's simplified $97 text limited to its visible label and accessible name", () => {
    const page = read(pagePath);
    const mobileBar = page.slice(
      page.indexOf("data-masterclass2-mobile-connection-bar"),
      page.indexOf("</nav>", page.indexOf("data-masterclass2-mobile-connection-bar")),
    );

    expect(page).toContain(approvedMobilePadding);
    expect(page).not.toContain("padding-bottom: calc(112px + env(safe-area-inset-bottom, 0px))");
    expect(mobileBar).toContain(approvedMobileBookingAria);
    expect(mobileBar).toContain(approvedMobileBookingPrice);
    expect(mobileBar).not.toContain("per visit");
    expect(page).toContain("Only $97");
  });

  it("makes the existing show-all control conditional only for categories with more than three questions and is otherwise byte-reversible", () => {
    const component = read(componentPath);

    expect(component).toContain("{category.items.length > 3 && (");
    expect(component).toContain(approvedConditionalShowAllButton);
    expect(component).toContain('>{expanded ? "Show fewer" : `Show all \${category.items.length} questions`}</button>');
    expect(unwrapApprovedShowAllConditional(component)).toBe(atBaseline(componentPath));
  });

  it("leaves every V2 source and FinalFaq stylesheet byte-identical and changes no production source outside the approved page, FAQ component, and separately verified thank-you copy", () => {
    expect(read(cssPath)).toBe(atBaseline(cssPath));
    for (const path of v2ProductionPaths()) {
      expect(normalizeApprovedV2HeroFontAppend(path, normalizeApprovedV2SectionOrder(path, read(path))), path).toBe(atBaseline(path));
    }
    expect(changedProductionFiles()).toEqual([componentPath, pagePath]);
  });
});
