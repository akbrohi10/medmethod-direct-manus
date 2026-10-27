import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

type FaqItem = { question: string; answer: string };
type FaqCategory = {
  id: string;
  label: string;
  title: string;
  items: FaqItem[];
};
type V2FaqData = {
  V2_FAQ_CATEGORIES: FaqCategory[];
  V2_FAQ_LEFT_TEXT: string;
  V2_FAQ_CLOSING_TEXT: string;
};
type FinalFaqFixture = {
  categories: FaqCategory[];
  closing: { question: string; answer: string };
};

const BASELINE = "40e49baf";
const root = resolve(import.meta.dirname, "..");
const pagePath = "client/src/pages/Masterclass2.tsx";
const componentPath = "client/src/components/masterclass2/FinalFaq.tsx";
const cssPath = "client/src/components/masterclass2/FinalFaq.css";
const dataPath = "client/src/pages/WeightLossMenopauseV2FaqData.ts";
const fixturePath = "server/fixtures/v2FaqFinal.json";
const pageImport =
  'import FinalFaq from "@/components/masterclass2/FinalFaq";\n';
const pageMount =
  '        <FinalFaq intakeHref="https://intake.medmethoddirect.com/" />\n';

const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const atBaseline = (path: string) =>
  execFileSync("git", ["show", `${BASELINE}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const count = (source: string, value: string) => source.split(value).length - 1;
const fixture = JSON.parse(read(fixturePath)) as FinalFaqFixture;

function baselineV2ProductionPaths(): string[] {
  return execFileSync(
    "git",
    ["ls-tree", "-r", "--name-only", BASELINE, "--", "client/src"],
    {
      cwd: root,
      encoding: "utf8",
    }
  )
    .split("\n")
    .filter(Boolean)
    .filter(path =>
      /(?:WeightLossMenopauseV2|weightLossMenopauseV2|weight-loss-menopause-v2)/.test(
        path
      )
    );
}

function loadV2FaqData(): V2FaqData {
  const moduleUrl = pathToFileURL(resolve(root, dataPath)).href;
  const script = `import(${JSON.stringify(moduleUrl)}).then(module => process.stdout.write(JSON.stringify({ V2_FAQ_CATEGORIES: module.V2_FAQ_CATEGORIES, V2_FAQ_LEFT_TEXT: module.V2_FAQ_LEFT_TEXT, V2_FAQ_CLOSING_TEXT: module.V2_FAQ_CLOSING_TEXT })))`;
  return JSON.parse(
    execFileSync(process.execPath, ["--import", "tsx", "-e", script], {
      cwd: root,
      encoding: "utf8",
    })
  ) as V2FaqData;
}

function removeApprovedFinalFaqPageLines(source: string): string {
  expect(
    count(source, pageImport),
    "FinalFaq import must occur exactly once"
  ).toBe(1);
  expect(
    count(source, pageMount),
    "FinalFaq mount must occur exactly once"
  ).toBe(1);
  return source.replace(pageImport, "").replace(pageMount, "");
}

function classNames(source: string): string[] {
  return [...source.matchAll(/className="([^"]+)"/g)].flatMap(([, value]) =>
    value.split(/\s+/).filter(Boolean)
  );
}

const protectedRouteMetadataAndPaymentPaths = [
  "client/src/App.tsx",
  "client/src/lib/masterclassMetaPixel.ts",
  "server/crawlerMiddleware.ts",
  "server/routers.ts",
  "server/routers/masterclassVideo.ts",
  "server/routers/masterclassVideo4799.ts",
  "server/routers/menopauseVideo97.ts",
  "client/src/components/masterclass2/VideoVisitCheckout.tsx",
  "client/src/components/masterclass2/VideoVisitPaypalPayment.tsx",
  "client/src/components/masterclass2/VideoVisitStripePayment.tsx",
  "client/src/components/masterclass2/videoVisitCheckoutStorage.ts",
  "client/src/components/masterclass2/checkout4799/VideoVisitCheckout4799.tsx",
  "client/src/components/masterclass2/checkout4799/VideoVisitPaypalPayment4799.tsx",
  "client/src/components/masterclass2/checkout4799/VideoVisitStripePayment4799.tsx",
  "client/src/components/masterclass2/checkout4799/videoVisitCheckout4799Storage.ts",
] as const;

describe("Masterclass final FAQ", () => {
  it("reuses the exact immutable V2 44-question source fixture, without copying question or answer text into the Masterclass component", () => {
    const component = read(componentPath);
    const production = loadV2FaqData();

    expect(read(dataPath)).toBe(atBaseline(dataPath));
    expect(production.V2_FAQ_CATEGORIES).toEqual(fixture.categories);
    expect(
      production.V2_FAQ_CATEGORIES.map(category => [
        category.id,
        category.label,
        category.title,
        category.items.length,
      ])
    ).toEqual([
      ["cost", "Cost", "Getting started and cost", 9],
      ["visits", "Visits", "Text and video visits", 7],
      ["weight-loss", "Weight loss", "Weight loss with GLP-1 medications", 11],
      ["menopause", "Menopause", "Menopause and hormone therapy", 7],
      ["both", "Both", "Treating weight and menopause together", 3],
      ["safety", "Safety", "Your doctor, safety, and privacy", 7],
    ]);
    expect(
      production.V2_FAQ_CATEGORIES.flatMap(category => category.items)
    ).toHaveLength(44);
    expect(production.V2_FAQ_LEFT_TEXT).toBe(
      "Straight answers on cost, care, and what to expect. Still wondering? Ask Dr. Al-Deek in your free first visit."
    );
    expect(production.V2_FAQ_CLOSING_TEXT).toBe(fixture.closing.answer);

    expect(component).toMatch(
      /import\s*\{[\s\S]*\bV2_FAQ_CATEGORIES\b[\s\S]*\bV2_FAQ_CLOSING_TEXT\b[\s\S]*\bV2_FAQ_LEFT_TEXT\b[\s\S]*\}\s*from "@\/pages\/WeightLossMenopauseV2FaqData";/
    );
    expect(component).toContain('import "./FinalFaq.css";');
    for (const item of fixture.categories.flatMap(category => category.items)) {
      expect(component).not.toContain(item.question);
      expect(component).not.toContain(item.answer);
    }
  });

  it("is exactly reversible to 40e49baf outside the two approved Masterclass page lines, with every V2 production source byte-pinned", () => {
    const page = read(pagePath);

    expect(removeApprovedFinalFaqPageLines(page)).toBe(atBaseline(pagePath));
    const v2Paths = baselineV2ProductionPaths();
    expect(v2Paths.length).toBeGreaterThan(0);
    for (const path of v2Paths) {
      expect(read(path), path).toBe(atBaseline(path));
    }
  });

  it("imports and mounts FinalFaq once immediately before the unchanged footer", () => {
    const page = read(pagePath);

    expect(count(page, pageImport)).toBe(1);
    expect(count(page, pageMount)).toBe(1);
    expect(page).toContain(
      `${pageMount}        <footer className="border-t border-[#eee4e9] px-5 py-8 sm:px-10">`
    );
    expect(page.indexOf(pageMount)).toBeLessThan(
      page.indexOf("        <footer")
    );
  });

  it("renders the six category tabs and all 44 native details in source order, while showing three questions per category by default", () => {
    const component = read(componentPath);

    expect(component).toContain('data-masterclass-final-faq=""');
    expect(component).toContain('id="masterclass-faq"');
    expect(component).toContain("V2_FAQ_CATEGORIES.map((category, index) =>");
    expect(component).toContain("V2_FAQ_CATEGORIES.map(category =>");
    expect(component).toContain("category.items.map((item, index) =>");
    expect(component).toContain("<details");
    expect(component).toContain("data-faq-category={category.id}");
    expect(component).toContain("data-faq-question={id}");
    expect(component).toContain("hidden={index >= 3 && !expanded}");
    expect(component).toContain(
      'const [selectedCategory, setSelectedCategory] = useState("cost");'
    );
    expect(component).toContain(
      'const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];'
    );
    expect(component).toContain("open={Boolean(openQuestions[id])}");
    expect(component).toContain('role="tablist"');
    expect(component).toContain('role="tab"');
    expect(component).toContain('role="tabpanel"');
    expect(component).not.toMatch(
      /<(?:Accordion|Collapsible)\b|@radix-ui\/react-accordion/
    );
  });

  it("keeps accessible native expansion, category CTAs, the closing CTA and phone link, including scroll-back when questions collapse", () => {
    const component = read(componentPath);

    expect(component).toContain(
      '>{expanded ? "Show fewer" : `Show all ${category.items.length} questions`}</button>'
    );
    expect(component).toContain("aria-expanded={expanded}");
    expect(component).toContain(
      "aria-controls={`mc-faq-questions-${category.id}`}"
    );
    expect(component).toContain(
      "if (expanded) collapseTarget.current = category.id;"
    );
    expect(component).toContain(
      "const title = document.getElementById(`mc-faq-category-${category}`);"
    );
    expect(component).toContain("window.scrollTo({");
    expect(component).toContain(
      '<a className="mc-faq-category-cta" href={intakeHref}>Ready? Start your free visit →</a>'
    );
    expect(component).toContain(
      '<a className="mc-faq-button mc-faq-closing-start" href={intakeHref}>Start your free visit</a>'
    );
    expect(component).toContain(
      '<a className="mc-faq-closing-phone" href="tel:+18883627011">(888) 362-7011</a>'
    );
    expect(component).toContain("V2_FAQ_CLOSING_TEXT");
    expect(component).not.toMatch(
      /<form\b|<input\b|fetch\(|trpc\.|paypal|stripe|checkout/i
    );
  });

  it("uses bounded JS pinning below the actual global header because the article clips overflow, rather than CSS sticky", () => {
    const component = read(componentPath);

    expect(component).toContain(
      'document.querySelectorAll<HTMLElement>("header, [data-site-header]")'
    );
    expect(component).toContain("const top = headerBottom() + 12;");
    expect(component).toContain('position: "fixed"');
    expect(component).toContain(
      'const desktop = window.matchMedia("(min-width: 1024px)");'
    );
    expect(component).toContain("setPinnedChips");
    expect(component).toContain("setPinnedCta");
    expect(component).toContain(
      'window.addEventListener("scroll", queueUpdate, { passive: true });'
    );
    expect(component).toContain("observer?.disconnect();");
    expect(component).not.toContain('position: "sticky"');
  });

  it("keeps FinalFaq styles strictly locally scoped with Montserrat, pink/purple actions, 17px dark answers, a desktop tab row, and a three-column mobile grid", () => {
    const component = read(componentPath);
    const css = read(cssPath);
    const selectors: string[] = [];
    postcss.parse(css).walkRules(rule => selectors.push(...rule.selectors));

    expect(selectors.length).toBeGreaterThan(15);
    for (const selector of selectors) {
      expect(selector).toMatch(/^\[data-masterclass-final-faq\](?:\s|$)/);
    }
    expect(css).toContain("[data-masterclass-final-faq]");
    expect(css).toMatch(/font-family:\s*"Montserrat",\s*sans-serif/);
    expect(css).toMatch(/#e8339e/i);
    expect(css).toMatch(/#7a1e7e/i);
    expect(css).toMatch(
      /(?:\.mc-faq-list\s+)?details p\s*\{[\s\S]*color:\s*#(?:25212a|463b46|2[0-9a-f]{5});[\s\S]*font-size:\s*17px/i
    );
    expect(css).toMatch(/\.mc-faq-tabs\s*\{[\s\S]*display:\s*flex;/);
    expect(css).toMatch(
      /@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*\.mc-faq-tabs\s*\{[\s\S]*display:\s*grid;[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/
    );
    expect(css).not.toMatch(/(?:^|\n)\s*(?:html|body|main|article)\b/);
    for (const name of classNames(component)) {
      expect(name).toMatch(/^mc-faq-/);
    }
  });

  it("leaves route metadata and every existing Masterclass payment contract byte-identical to 40e49baf", () => {
    for (const path of protectedRouteMetadataAndPaymentPaths) {
      expect(read(path), path).toBe(atBaseline(path));
    }
  });
});
