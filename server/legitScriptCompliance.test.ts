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

  it("keeps the homepage prescription and treatment-response copy appropriately qualified", () => {
    const homepageSource = readFileSync(
      resolve(sourceRoot, "pages/HomeHrt3.tsx"),
      "utf8",
    );

    expect(homepageSource).toContain(
      "when clinically appropriate, a prescription",
    );
    expect(homepageSource).not.toContain(
      "leave with a personalized treatment plan and prescription",
    );
    expect(homepageSource).not.toContain("benefits of HRT far outweigh the risks");
    expect(homepageSource).not.toMatch(
      /(?:1–2 weeks|4–8 weeks|2–4 weeks|2–3 months)/,
    );
    expect(homepageSource).toContain(
      "no specific outcome or timeline can be guaranteed",
    );
  });

  it("keeps the auditor-flagged blog and location FAQ language fully removed", () => {
    const articleSource = readFileSync(
      resolve(
        sourceRoot,
        "articles/why-weight-gain-feels-different-in-menopause.tsx",
      ),
      "utf8",
    );

    expect(articleSource).not.toContain("Protecting and building muscle mass");
    expect(articleSource).not.toContain("improved body composition");

    const locationFiles = readdirSync(resolve(sourceRoot, "pages")).filter(
      (name) => /^Location.*\.tsx$/.test(name),
    );

    expect(locationFiles.length).toBeGreaterThan(0);
    for (const file of locationFiles) {
      const source = readFileSync(resolve(sourceRoot, "pages", file), "utf8");
      expect(source).not.toContain(
        "hormonal weight gain, low energy, low libido",
      );
      expect(source).not.toContain("They're symptoms of hormonal imbalance");
      expect(source).not.toContain(
        "I'm a woman over 40 and feel like my body is working against me. Can you help?",
      );
    }
  });

  it("keeps the additional auditor-flagged article and homepage claims removed", () => {
    const menopauseArticle = readFileSync(
      resolve(
        sourceRoot,
        "articles/why-weight-gain-feels-different-in-menopause.tsx",
      ),
      "utf8",
    );
    const foodNoiseArticle = readFileSync(
      resolve(sourceRoot, "articles/what-is-food-noise-midlife.tsx"),
      "utf8",
    );
    const homepageSources = [
      "pages/HomeHrt3.tsx",
      "components/home1/MedicalTeam.tsx",
      "components/home1/Navbar.tsx",
      "components/home1/ConsultationModal.tsx",
      "components/home1/LpConsultationModal.tsx",
      "components/home1/LpConsultationModal2.tsx",
    ]
      .map(path => readFileSync(resolve(sourceRoot, path), "utf8"))
      .join("\n");

    for (const phrase of [
      "addresses the root cause directly",
      "can reduce visceral fat accumulation, improve insulin sensitivity",
      "compounded semaglutide and tirzepatide",
      "biology can be addressed",
      "directly reduces cortisol, improves insulin",
    ]) {
      expect(menopauseArticle).not.toContain(phrase);
    }

    for (const phrase of [
      "within days to weeks of starting treatment",
      "genuinely transformative",
      "Hormone optimization",
      "restores estrogen's regulatory effect",
      "some combination of all three",
      "benefit from a combined approach",
    ]) {
      expect(foodNoiseArticle).not.toContain(phrase);
    }

    for (const phrase of [
      "Virtual Urgent Care",
      "come out of it stronger",
      "fix what’s actually happening inside",
      "feel like yourself again",
    ]) {
      expect(homepageSources).not.toContain(phrase);
    }
  });

  it("keeps the incomplete hormone-therapy article unpublished with a permanent redirect", () => {
    const removedSlug = "hormone-therapy-weight-sleep-metabolism";
    const appSource = readFileSync(resolve(sourceRoot, "App.tsx"), "utf8");
    const blogRegistry = readFileSync(
      resolve(sourceRoot, "data/blogPosts.ts"),
      "utf8",
    );
    const sitemap = readFileSync(resolve(clientRoot, "public/sitemap.xml"), "utf8");
    const llms = readFileSync(resolve(clientRoot, "public/llms.txt"), "utf8");
    const serverSource = readFileSync(
      resolve(process.cwd(), "server/_core/index.ts"),
      "utf8",
    );
    const locationFiles = readdirSync(resolve(sourceRoot, "pages")).filter(
      name => /^Location.*\.tsx$/.test(name),
    );

    expect(
      existsSync(
        resolve(sourceRoot, `articles/${removedSlug}.tsx`),
      ),
    ).toBe(false);
    expect(appSource).not.toContain(removedSlug);
    expect(blogRegistry).not.toContain(removedSlug);
    expect(sitemap).not.toContain(removedSlug);
    expect(llms).not.toContain(removedSlug);
    for (const file of locationFiles) {
      const source = readFileSync(resolve(sourceRoot, "pages", file), "utf8");
      expect(source).not.toContain(removedSlug);
    }
    expect(serverSource).toContain(
      `app.get("/blog/${removedSlug}", (_req, res) =>`,
    );
    expect(serverSource).toContain('res.redirect(301, "/blog")');
  });

  it("uses the exact 12 jurisdictions supplied in the approved instructions", () => {
    const locationsSource = readFileSync(
      resolve(sourceRoot, "pages/Locations.tsx"),
      "utf8",
    );
    const approvedJurisdictions = [
      "Florida",
      "Arizona",
      "Colorado",
      "District of Columbia",
      "Georgia",
      "Illinois",
      "Maryland",
      "Michigan",
      "North Carolina",
      "Pennsylvania",
      "Texas",
      "Virginia",
    ];

    for (const jurisdiction of approvedJurisdictions) {
      expect(locationsSource).toContain(`\"${jurisdiction}\"`);
    }

    expect(locationsSource).not.toContain('"Nevada"');
    expect(locationsSource).not.toContain('"Oregon"');
    expect(locationsSource).not.toContain('"West Virginia"');
  });

  it("uses the approved customer-facing 12 states wording sitewide", () => {
    const clientText = readClientText();
    const navbarSource = readFileSync(
      resolve(sourceRoot, "components/Navbar.tsx"),
      "utf8",
    );
    const locationsSource = readFileSync(
      resolve(sourceRoot, "pages/Locations.tsx"),
      "utf8",
    );

    expect(clientText).not.toMatch(/12 (?:approved )?jurisdictions/i);
    expect(navbarSource).toContain("Licensed in 12 states");
    expect(locationsSource).toContain("Licensed in 12 states");
    expect(locationsSource).toContain("Women's Health in 12 States");
    expect(locationsSource).toContain('label: "Licensed States"');
    expect(locationsSource).toContain("Approved States");
    expect(locationsSource).not.toContain("Licensed Jurisdictions");
    expect(locationsSource).not.toContain("Approved Jurisdictions");
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
    const webinarEducationDisclosure =
      "Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. [APPROVED AVAILABILITY DISCLAIMER]";

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
            (file.endsWith("LiveWebinar2.tsx") && source.includes(webinarEducationDisclosure)) ||
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
