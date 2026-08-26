import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const clientRoot = resolve(projectRoot, "client");
const sourceRoot = resolve(clientRoot, "src");

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = resolve(directory, entry);
    if (statSync(fullPath).isDirectory()) return collectTextFiles(fullPath);
    return [".ts", ".tsx", ".xml", ".txt", ".html"].includes(
      extname(fullPath),
    )
      ? [fullPath]
      : [];
  });
}

function readClientText(): string {
  return collectTextFiles(clientRoot)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

describe("LegitScript compliance remediation", () => {
  it("keeps requested articles and comparison-heavy legacy pages unpublished", () => {
    const appSource = readFileSync(resolve(sourceRoot, "App.tsx"), "utf8");
    const blogRegistry = readFileSync(
      resolve(sourceRoot, "data/blogPosts.ts"),
      "utf8",
    );
    const sitemap = readFileSync(resolve(clientRoot, "public/sitemap.xml"), "utf8");
    const llms = readFileSync(resolve(clientRoot, "public/llms.txt"), "utf8");
    const removedSlug = "semaglutide-vs-tirzepatide-women-midlife";

    expect(
      existsSync(
        resolve(
          sourceRoot,
          "articles/semaglutide-vs-tirzepatide-women-midlife.tsx",
        ),
      ),
    ).toBe(false);
    expect(existsSync(resolve(sourceRoot, "pages/MedicationPricing.tsx"))).toBe(false);
    expect(existsSync(resolve(sourceRoot, "pages/BookPage.tsx"))).toBe(false);
    expect(existsSync(resolve(sourceRoot, "pages/GuideHowItWorks.tsx"))).toBe(false);
    expect(appSource).not.toContain("MedicationPricing");
    expect(appSource).not.toContain('path="/pricing-guide"');
    expect(appSource).not.toContain('path="/male"');
    expect(blogRegistry).not.toContain(removedSlug);
    expect(sitemap).not.toContain(removedSlug);
    expect(llms).not.toContain(removedSlug);
  });

  it("keeps prohibited jurisdictions, brands, claims, comparisons, and service labels out of client files", () => {
    const clientText = readClientText();
    const prohibitedPatterns = [
      /\b(?:Wegovy|Zepbound|Ozempic|Mounjaro)\b/i,
      /\b(?:Tennessee|New Jersey|Alabama|Ohio)\b/i,
      /Washington State/i,
      /(?:17 states|licensed in 17|seventeen states|9 states|licensed in 9)/i,
      /(?:build muscle|gain muscle|develop lean muscle|tone your body|change body composition|body composition|feel stronger|perform better|muscle gain|sports recovery)/i,
      /(?:clinically proven|studies show|before[- ]and[- ]after|effortless transformation|results speak for themselves|patients see results|minimal results|guaranteed results)/i,
      /(?:same active ingredient|lower cost|affordable alternative|works just like|equivalent|essentially the same|replaces the brand|brand[- ]name)/i,
      /(?:men's testosterone|testosterone replacement|male TRT|male sexual health|thyroid optimization|thyroid therapy|thyroid treatment|longevity medicine|longevity program|sexual health|performance coach|performance program)/i,
      /(?:Everfit|fitness app|exercise coach|custom workouts|custom meal plans|workout plan|meal plan|personal training)/i,
    ];

    for (const pattern of prohibitedPatterns) {
      expect(clientText).not.toMatch(pattern);
    }
  });

  it("keeps hardcoded testimonial and noncompliant program-section components removed", () => {
    const removedComponents = [
      "components/Testimonials.tsx",
      "components/home1/Testimonials.tsx",
      "components/PopularPrograms.tsx",
      "components/WhyChoose.tsx",
      "components/home1/PopularPrograms.tsx",
      "components/home1/AppPerks.tsx",
      "components/home1/PatientTools.tsx",
    ];

    for (const component of removedComponents) {
      expect(existsSync(resolve(sourceRoot, component))).toBe(false);
    }

    const locationFiles = readdirSync(resolve(sourceRoot, "pages")).filter((name) =>
      /^Location.*\.tsx$/.test(name),
    );

    for (const file of locationFiles) {
      const source = readFileSync(resolve(sourceRoot, "pages", file), "utf8");
      expect(source).not.toContain("quote:");
      expect(source).not.toContain("testimonials.map");
      expect(source).not.toContain("<PopularPrograms");
      expect(source).not.toContain("<WhyChoose");
    }
  });

  it("uses the exact required disclosures on every remaining treatment-bearing page", () => {
    const compoundedDisclosure =
      "Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.";
    const testosteroneDisclosure =
      "Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.";

    for (const file of collectTextFiles(sourceRoot).filter((file) => file.endsWith(".tsx"))) {
      const source = readFileSync(file, "utf8");
      const isDisclosureComponent = file.endsWith("ComplianceDisclosures.tsx");

      if (/compounded (?:semaglutide|tirzepatide)/i.test(source)) {
        expect(
          isDisclosureComponent ||
            source.includes(compoundedDisclosure) ||
            /<ComplianceDisclosures[^>]*\bcompounded\b/.test(source),
        ).toBe(true);
      }

      if (/\btestosterone\b/i.test(source) && !isDisclosureComponent) {
        expect(
          source.includes(testosteroneDisclosure) ||
            /<ComplianceDisclosures[^>]*\btestosteroneForWomen\b/.test(source),
        ).toBe(true);
      }
    }
  });

  it("serves permanent redirects for removed public routes and no placeholder footer links", () => {
    const serverSource = readFileSync(
      resolve(projectRoot, "server/_core/index.ts"),
      "utf8",
    );
    const footerSources = [
      resolve(sourceRoot, "components/Footer.tsx"),
      resolve(sourceRoot, "components/home1/Footer.tsx"),
    ].map((file) => readFileSync(file, "utf8"));

    for (const route of [
      "/male",
      "/home-1",
      "/home-2",
      "/lp/hrt",
      "/start/women",
      "/the-menopause-weight-loss-trap",
      "/guide/how-it-works",
      "/pricing-guide",
      "/blog/semaglutide-vs-tirzepatide-women-midlife",
      "/lp/glp1",
    ]) {
      expect(serverSource).toContain(`"${route}"`);
    }
    expect(serverSource).toContain("res.redirect(301");

    for (const footer of footerSources) {
      expect(footer).not.toMatch(/href=["']#["']/);
      expect(footer).not.toContain("Your Path to Longevity");
      expect(footer).not.toContain("Schedule a Discovery Call");
    }
  });
});
