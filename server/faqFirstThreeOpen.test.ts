import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type FaqCategory = { id: string; label: string; items: unknown[] };

const BASELINE = "9c65e262";
const root = resolve(import.meta.dirname, "..");
const masterclassFaqPath = "client/src/components/masterclass2/FinalFaq.tsx";
const masterclassProfilePath = "client/src/components/masterclass2/PhysicianProfile.tsx";
const v2FaqPath = "client/src/pages/WeightLossMenopauseV2Faq.tsx";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const faqDataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const approvedComponentPaths = [masterclassFaqPath, v2FaqPath] as const;
const approvedMscpCredential = '"Menopause Certified (MSCP)", ';
const approvedMasterclassMscpCredentialLine = '  "Menopause Certified (MSCP)",\n';
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
  return source.replace(approvedMscpCredential, "");
}

function normalizeApprovedMasterclassMscpCredential(path: string, source: string): string {
  if (path !== masterclassProfilePath) return source;
  expect(count(source, approvedMasterclassMscpCredentialLine)).toBe(1);
  return source.replace(approvedMasterclassMscpCredentialLine, "");
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
      .filter(path => normalizeApprovedMasterclassMscpCredential(path, read(path)) !== atBaseline(path));

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
