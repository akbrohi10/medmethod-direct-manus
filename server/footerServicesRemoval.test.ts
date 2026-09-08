import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homepageFooter = readFileSync(
  resolve(process.cwd(), "client/src/components/home1/Footer.tsx"),
  "utf8",
);
const secondaryFooter = readFileSync(
  resolve(process.cwd(), "client/src/components/Footer.tsx"),
  "utf8",
);

const footerSources = [homepageFooter, secondaryFooter];
const removedServiceLabels = [
  "Medical weight management (GLP-1)",
  "Hormone therapy for women",
  "Nutrition and vitamin optimization",
  "Dermatology and skin",
  "Hair restoration",
];

describe("footer Services-column removal", () => {
  it("removes the Services heading, links, and stale footer anchor from both footers", () => {
    for (const source of footerSources) {
      expect(source).not.toMatch(/>\s*Services\s*</);
      expect(source).not.toContain('href="#services"');
      for (const label of removedServiceLabels) {
        expect(source).not.toContain(label);
      }
    }
  });

  it("preserves the remaining footer navigation and compliance destinations", () => {
    expect(homepageFooter).toContain("Explore");
    expect(homepageFooter).toContain("Get Started");
    expect(homepageFooter).toContain("Legal & Compliance");
    expect(secondaryFooter).toContain("Company");
    expect(secondaryFooter).toContain("Locations");
    expect(secondaryFooter).toContain("Get Started");

    for (const source of footerSources) {
      expect(source).toContain('href: "/blog"');
      expect(source).toContain('href: "/locations"');
      expect(source).toContain('href: "/shipping-policy"');
      expect(source).toContain('href: "/accessibility"');
    }
  });

  it("uses the rebalanced desktop grids", () => {
    expect(homepageFooter).toContain("lg:grid-cols-4");
    expect(secondaryFooter).toContain("lg:grid-cols-5");
  });

  it("shows the supplied accessible LegitScript approval badge in both shared footer variants", () => {
    for (const source of footerSources) {
      expect(source).toContain("data-legitscript-footer-badge");
      expect(source).toContain('href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com"');
      expect(source).toContain('src="/manus-storage/legitscript-certified-seal-51795425_51edddb5.png"');
      expect(source).toContain('alt="Verify Approval for www.medmethoddirect.com"');
      expect(source).toContain('title="Verify LegitScript Approval for www.medmethoddirect.com"');
      expect(source).toContain('target="_blank"');
      expect(source).toContain('rel="noopener noreferrer"');
      expect(source).toContain('width="73"');
      expect(source).toContain('height="79"');
      expect(source).toContain('loading="eager"');
      expect(source).toContain("justify-center");
    }
  });
});
