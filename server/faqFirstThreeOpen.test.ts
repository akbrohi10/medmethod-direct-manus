import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type FaqCategory = { id: string; label: string; items: unknown[] };

const BASELINE = "9c65e262";
const root = resolve(import.meta.dirname, "..");

// Separately approved WeightCare paths; server/intakeWeightCareDetails.test.ts and
// server/intakePrivateUploads.test.ts cover them independently. Keep all other sources frozen.
const approvedWeightCareRegressionPaths = new Set([
  "client/intake/index.html",
  "client/public/intake/weight-care-uploads.js",
  "client/public/intake/weight-care-uploads.css",
  "server/intakePaymentRoutes.ts",
  "server/intakeSubmissionContract.ts",
  "server/intakePrivateUploads.ts",
]);
const masterclassFaqPath = "client/src/components/masterclass2/FinalFaq.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const v2FaqPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const homepagePath = "client/src/pages/HomeHrt3.tsx";
const homepageMedicalTeamPath = "client/src/components/home1/MedicalTeam.tsx";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const approvedComponentPaths = [masterclassFaqPath, v2FaqPath] as const;
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

const oldDefaultOpenQuestions = 'const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];';
const approvedDefaultOpenQuestions = `const DEFAULT_OPEN_QUESTIONS = V2_FAQ_CATEGORIES.flatMap(category =>
  category.items.slice(0, 3).map((_, index) => \`${"${category.id}"}-${"${index}"}\`),
);`;
const approvedSelectCategory = `  function selectCategory(categoryId: string) {
    const category = V2_FAQ_CATEGORIES.find(item => item.id === categoryId);
    if (!category) return;
    setExpandedCategories(previous => ({ ...previous, [categoryId]: false }));
    setOpenQuestions(previous => ({
      ...previous,
      ...Object.fromEntries(category.items.map((_, index) => [\`${"${categoryId}"}-${"${index}"}\`, index < 3])),
    }));
    setSelectedCategory(categoryId);
  }

`;
const masterclassOldShowAllClick = `                  onClick={() => {
                    if (expanded) collapseTarget.current = category.id;
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}`;
const masterclassApprovedShowAllClick = `                  onClick={() => {
                    if (expanded) collapseTarget.current = category.id;
                    setOpenQuestions(previous => ({
                      ...previous,
                      ...Object.fromEntries(category.items.slice(3).map((_, index) => [\`${"${category.id}"}-${"${index + 3}"}\`, false])),
                    }));
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}`;
const v2OldShowAllButton = `                <button
                  type="button"
                  className="btn secondary v2-faq-show-all"
                  aria-expanded={expanded}
                  aria-controls={\`v2-faq-questions-${"${category.id}"}\`}
                  onClick={() => setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }))}
                >{expanded ? "Show fewer" : \`Show all ${"${category.items.length}"} questions\`}</button>`;
const v2ApprovedShowAllButton = `                {category.items.length > 3 && (
                <button
                  type="button"
                  className="btn secondary v2-faq-show-all"
                  aria-expanded={expanded}
                  aria-controls={\`v2-faq-questions-${"${category.id}"}\`}
                  onClick={() => {
                    setOpenQuestions(previous => ({
                      ...previous,
                      ...Object.fromEntries(category.items.slice(3).map((_, index) => [\`${"${category.id}"}-${"${index + 3}"}\`, false])),
                    }));
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}
                >{expanded ? "Show fewer" : \`Show all ${"${category.items.length}"} questions\`}</button>
                )}`;

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const atBaseline = (path: string) => execFileSync(
  "git",
  ["show", `${BASELINE}:${path}`],
  { cwd: root, encoding: "utf8" },
);
const count = (source: string, value: string) => source.split(value).length - 1;

function replaceOnce(source: string, before: string, after: string, description: string): string {
  expect(count(source, before), `${description} must occur once in the clean baseline`).toBe(1);
  return source.replace(before, after);
}

function approvedComponentSource(path: typeof masterclassFaqPath | typeof v2FaqPath): string {
  let expected = atBaseline(path);

  expected = replaceOnce(expected, oldDefaultOpenQuestions, approvedDefaultOpenQuestions, "old default-open declaration");
  expected = replaceOnce(
    expected,
    "  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {\n",
    `${approvedSelectCategory}  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {\n`,
    "moveTab insertion point",
  );
  expected = replaceOnce(
    expected,
    "    setSelectedCategory(V2_FAQ_CATEGORIES[next].id);",
    "    selectCategory(V2_FAQ_CATEGORIES[next].id);",
    "keyboard category selection",
  );
  expected = replaceOnce(
    expected,
    "onClick={() => setSelectedCategory(category.id)}",
    "onClick={() => selectCategory(category.id)}",
    "mouse category selection",
  );

  if (path === masterclassFaqPath) {
    return replaceOnce(expected, masterclassOldShowAllClick, masterclassApprovedShowAllClick, "Masterclass show-all reset");
  }
  return replaceOnce(expected, v2OldShowAllButton, v2ApprovedShowAllButton, "V2 conditional show-all reset");
}

function normalizeApprovedV2DoctorBioMscpCredential(path: string, source: string): string {
  if (path !== v2DoctorBioPath) return source;
  expect(count(source, approvedMscpCredential)).toBe(1);
  expect(count(source, approvedV2DoctorHeading)).toBe(1);
  return source
    .replace(approvedMscpCredential, "")
    .replace(approvedV2DoctorHeading, baselineV2DoctorHeading);
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

function loadCategories(): FaqCategory[] {
  const moduleUrl = pathToFileURL(resolve(root, faqDataPath)).href;
  const script = "import(" + JSON.stringify(moduleUrl) + ").then(module => process.stdout.write(JSON.stringify(module.V2_FAQ_CATEGORIES.map(({ id, label, items }) => ({ id, label, items })))));";
  return JSON.parse(execFileSync(process.execPath, ["--import", "tsx", "-e", script], {
    cwd: root,
    encoding: "utf8",
  })) as FaqCategory[];
}

function showAllClick(component: string, componentPath: string): string {
  const start = component.indexOf('onClick={() => {', component.indexOf("show-all"));
  const end = component.indexOf("                  }}", start);
  expect(start, `${componentPath} show-all click handler missing`).toBeGreaterThan(-1);
  expect(end, `${componentPath} show-all click handler closing token missing`).toBeGreaterThan(start);
  return component.slice(start, end + "                  }}".length);
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

describe("FAQ first-three-open behavior", () => {
  it("keeps the immutable six-category, 44-question data source and derives all 18 initial opens from each category's first three items", () => {
    const categories = loadCategories();
    const defaultOpenIds = categories.flatMap(category =>
      category.items.slice(0, 3).map((_, index) => `${category.id}-${index}`),
    );

    expect(read(faqDataPath)).toBe(atBaseline(faqDataPath));
    expect(categories.map(category => [category.id, category.label, category.items.length])).toEqual([
      ["cost", "Cost", 9],
      ["visits", "Visits", 7],
      ["weight-loss", "Weight loss", 11],
      ["menopause", "Menopause", 7],
      ["both", "Both", 3],
      ["safety", "Safety", 7],
    ]);
    expect(categories.flatMap(category => category.items)).toHaveLength(44);
    expect(defaultOpenIds).toEqual([
      "cost-0", "cost-1", "cost-2", "visits-0", "visits-1", "visits-2",
      "weight-loss-0", "weight-loss-1", "weight-loss-2", "menopause-0", "menopause-1", "menopause-2",
      "both-0", "both-1", "both-2", "safety-0", "safety-1", "safety-2",
    ]);
    expect(defaultOpenIds).toHaveLength(18);
  });

  it("changes no production source from 9c65e262 except the two authorized FAQ components and the exact reversible MSCP doctor-bio pill", () => {
    const changedProductionFiles = execFileSync(
      "git",
      ["diff", "--name-only", BASELINE, "--", "client", "server", "shared"],
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .filter(path => !/\.test\.[cm]?[jt]sx?$/.test(path))
      .filter(path => !approvedWeightCareRegressionPaths.has(path))
      .filter(path => normalizeApprovedHomepageMscpCredential(path, normalizeApprovedMasterclassMscpCredential(path, normalizeApprovedV2SectionOrder(path, read(path)))) !== atBaseline(path));

    expect(changedProductionFiles).toEqual([...approvedComponentPaths, v2DoctorBioPath].sort());
    for (const path of approvedComponentPaths) {
      expect(read(path), path).toBe(approvedComponentSource(path));
    }
    expect(normalizeApprovedV2DoctorBioMscpCredential(v2DoctorBioPath, read(v2DoctorBioPath))).toBe(atBaseline(v2DoctorBioPath));
  });

  it("initializes every category's first three native details open, while retaining native manual toggles and hiding additional questions by default", () => {
    for (const path of approvedComponentPaths) {
      const component = read(path);

      expect(component).toContain(approvedDefaultOpenQuestions);
      expect(component).toContain("Object.fromEntries(DEFAULT_OPEN_QUESTIONS.map(id => [id, true]))");
      expect(component).toContain("hidden={index >= 3 && !expanded}");
      expect(component).toContain("open={Boolean(openQuestions[id])}");
      expect(component).toContain(`onToggle={event => {
                          const open = event.currentTarget.open;
                          setOpenQuestions(previous => previous[id] === open ? previous : { ...previous, [id]: open });
                        }}`);
      expect(component).not.toMatch(/<(?:Accordion|Collapsible)\b|@radix-ui\/react-accordion/);
    }
  });

  it("routes mouse and roving-keyboard category visits through the same reset, including reselecting the active chip", () => {
    for (const path of approvedComponentPaths) {
      const component = read(path);

      expect(component).toContain(approvedSelectCategory);
      expect(component).toContain("const category = V2_FAQ_CATEGORIES.find(item => item.id === categoryId);");
      expect(component).toContain("setExpandedCategories(previous => ({ ...previous, [categoryId]: false }));");
      expect(component).toContain("...Object.fromEntries(category.items.map((_, index) => [`${categoryId}-${index}`, index < 3])),");
      expect(component).toContain("setSelectedCategory(categoryId);");
      expect(component).toContain("selectCategory(V2_FAQ_CATEGORIES[next].id);");
      expect(component).toContain("onClick={() => selectCategory(category.id)}");
      expect(component).not.toContain("onClick={() => setSelectedCategory(category.id)}");
      expect(component).not.toContain("setSelectedCategory(V2_FAQ_CATEGORIES[next].id);");
    }
  });

  it("resets only additional-question state before every show-all/show-fewer toggle, preserves Masterclass collapse scrolling, and omits the V2 button for the three-item category", () => {
    const masterclass = read(masterclassFaqPath);
    const v2 = read(v2FaqPath);

    for (const [path, component] of [[masterclassFaqPath, masterclass], [v2FaqPath, v2]] as const) {
      const click = showAllClick(component, path);
      expect(click).toContain("category.items.slice(3).map((_, index) => [`${category.id}-${index + 3}`, false])");
      expect(click).not.toContain("category.items.map((_, index) => [`${category.id}-${index}`, index < 3]");
      expect(click).toContain("setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));");
    }
    expect(masterclass).toContain("if (expanded) collapseTarget.current = category.id;");
    expect(masterclass).toContain("const title = document.getElementById(`mc-faq-category-${category}`);");
    expect(masterclass).toContain("window.scrollTo({");
    expect(v2).toContain("{category.items.length > 3 && (");
    expect(v2).toContain('>{expanded ? "Show fewer" : `Show all ${category.items.length} questions`}</button>');
  });
});
