import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const landing = read("client/weight-loss-intake.html");
const css = read("client/public/weight-loss-intake/ui-polish.css");
const browserCatalog = read("client/public/treatment-catalog.js");

function renderCatalog(optIn: boolean) {
  const target = { innerHTML: "", getAttribute: () => optIn ? "lazy" : null };
  const window: Record<string, unknown> = {};
  runInNewContext(browserCatalog, {
    window,
    document: { readyState: "complete", querySelector: () => target },
  });
  return { html: target.innerHTML, catalog: window.MMD_TREATMENT_CATALOG };
}

function contrast(hex: string) {
  const rgb = hex.match(/.{2}/g)!.map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return 1.05 / (.2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2] + .05);
}

describe("Weight-loss landing mobile audit polish", () => {
  it("uses accessible deep-teal CTAs while retaining the latest brand-teal accent", () => {
    expect(css).toContain("--cta-teal: #003B3E");
    expect(contrast("003B3E")).toBeGreaterThanOrEqual(4.5);
    expect(css).toContain(".hero .hero-actions .btn, .sticky-cta .btn { background: var(--cta-teal); color: #fff; }");
    expect(css).toContain("background: var(--navy); filter: none;");
    expect(landing).toContain("--teal:#008F83");
  });

  it("keeps readability and tap refinements within the mobile media query", () => {
    const mobile = css.split("/* Approved mobile audit polish")[1];
    expect(mobile).toContain("@media (max-width: 900px)");
    expect(mobile).toContain("font-size: .8125rem;");
    expect(mobile).toContain(".medication-specs dt, .medication-specs dd");
    expect(mobile).toContain("footer .disclosures p");
    expect(mobile).toContain(".estimator-result a { min-height: 44px");
    expect(mobile).toContain("padding-bottom: 122px;");
  });

  it("includes the live What to expect section in header-aware anchor offsets", () => {
    expect(css).toContain("#pricing, #expect, #testimonials");
    expect(css).toContain("scroll-margin-top: calc(var(--site-header-height) + 12px)");
  });

  it("removes noncritical preloads and supplies stable dimensions and lazy decoding to page images", () => {
    expect(landing).not.toMatch(/rel="preload" as="image"/);
    const images = landing.match(/<img\b[^>]*>/g)!;
    expect(images.length).toBe(28);
    for (const image of images) {
      expect(image).toContain('loading="lazy"');
      expect(image).toContain('decoding="async"');
      expect(image).toMatch(/width="\d+"/);
      expect(image).toMatch(/height="\d+"/);
      expect(image).not.toMatch(/\/\s+(?:loading|decoding)=/);
    }
    expect(landing).toContain('data-shared-glp1-catalog data-catalog-image-loading="lazy"');
  });

  it("makes catalog image loading opt-in while keeping all default markup and catalog data the same", () => {
    const standard = renderCatalog(false), lazy = renderCatalog(true);
    expect(standard.html).not.toContain('loading="lazy"');
    expect(lazy.html.match(/loading="lazy"/g)).toHaveLength(7);
    expect(lazy.html.replaceAll(' loading="lazy" decoding="async"', "")).toBe(standard.html);
    expect(lazy.catalog).toEqual(standard.catalog);
    expect(standard.catalog).toEqual(JSON.parse(read("shared/treatmentCatalog.json")));
    expect(read("scripts/generate-treatment-catalog.mjs")).toContain('target.getAttribute("data-catalog-image-loading")');
    expect(read("client/intake/index.html")).not.toContain("data-catalog-image-loading");
    expect(read("client/src/pages/WeightLossMenopause.tsx")).not.toContain("data-catalog-image-loading");
  });

  it("preserves all five local intake destinations with free submission", () => {
    expect(landing.split('href="/intake/"').length - 1).toBe(5);
    expect(read("client/intake/index.html")).toContain("Submit My Free Intake");
    expect(landing).toContain("<h2>A real doctor. Not a chatbot.</h2>");
    expect(landing).toContain("#how-it-works.wave-top::before{display:none}");
  });
});
