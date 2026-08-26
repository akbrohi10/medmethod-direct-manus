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
    return [".ts", ".tsx", ".xml", ".txt"].includes(extname(fullPath))
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
  it("keeps the requested article and comparison pricing page unpublished", () => {
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
    expect(appSource).not.toContain("MedicationPricing");
    expect(appSource).not.toContain('path="/pricing-guide"');
    expect(blogRegistry).not.toContain(removedSlug);
    expect(sitemap).not.toContain(removedSlug);
    expect(llms).not.toContain(removedSlug);
  });

  it("keeps explicitly prohibited comparison and outcome phrases out of public client files", () => {
    const clientText = readClientText();
    const prohibitedPhrases = [
      "30–45% more affordable",
      "Save 30–45%",
      "typically 30–45% less",
      "same active ingredient",
      "active ingredient in Ozempic",
      "active ingredient in Mounjaro",
      "lower-cost compounded",
      "No insurance. No middlemen. Just results.",
      "I've lost 28 pounds",
      "lost over 30 pounds",
      "weight loss started again",
      "hormones were the missing piece",
      "Avg. Body Weight Loss",
      "15–20% avg body weight loss",
    ];

    for (const phrase of prohibitedPhrases) {
      expect(clientText).not.toContain(phrase);
    }
  });

  it("removes hardcoded testimonial components and location-page quote data", () => {
    expect(existsSync(resolve(sourceRoot, "components/Testimonials.tsx"))).toBe(false);
    expect(
      existsSync(resolve(sourceRoot, "components/home1/Testimonials.tsx")),
    ).toBe(false);

    const locationFiles = readdirSync(resolve(sourceRoot, "pages")).filter((name) =>
      /^Location.*\.tsx$/.test(name),
    );

    for (const file of locationFiles) {
      const source = readFileSync(resolve(sourceRoot, "pages", file), "utf8");
      expect(source).not.toContain("quote:");
      expect(source).not.toContain("testimonials.map");
    }
  });

  it("retains the required compounded-medication disclosure in key patient-facing pages", () => {
    const disclosure = "Compounded medications are not FDA-approved";
    const requiredPages = ["LpGlp1.tsx", "LpWL2.tsx", "LpHrt2.tsx", "LpHrt3.tsx"];

    for (const page of requiredPages) {
      const source = readFileSync(resolve(sourceRoot, "pages", page), "utf8");
      expect(source).toContain(disclosure);
    }
  });
});
