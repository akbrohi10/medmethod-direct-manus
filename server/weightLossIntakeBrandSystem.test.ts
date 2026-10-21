import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const landing = read("client/weight-loss-intake.html");
const css = read("client/public/weight-loss-intake/ui-polish.css");
const brand = landing.split("/* Approved MMD brand system — standalone landing page only. */")[1].split("/* Hero label removed")[0];

function whiteContrast(hex: string) {
  const [r, g, b] = hex.match(/.{2}/g)!.map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return 1.05 / (.2126 * r + .7152 * g + .0722 * b + .05);
}

describe("Latest MMD brand on the weight-loss intake landing document", () => {
  it("uses the exact teal, navy, ivory, mint and sage palette throughout the page", () => {
    for (const token of ["--bg:#F7F3EB", "--surface:#FFFFFF", "--soft:#E8F3EC", "--deep-teal:#003B3E", "--teal:#008F83", "--navy:#06263B", "--sage:#91B7AB", "--band:#003B3E"]) {
      expect(brand).toContain(token);
    }
    expect(brand).not.toMatch(/#FFFCF5|#E9ECF8|#061A46|#008A96/);
    expect(landing).toContain('name="theme-color" content="#F7F3EB"');
  });

  it("sets DM Sans for body and controls and DM Serif Display for section headings without changing hero grouping", () => {
    expect(brand).toContain('--font-body:"DM Sans",sans-serif');
    expect(brand).toContain('--font-heading:"DM Serif Display",Georgia,serif');
    expect(brand).toContain('body{background:var(--bg);color:var(--ink);font-family:var(--font-body)}');
    expect(css).toContain('h2, h3 { font-family: var(--font-heading); font-weight: 400; }');
    expect(css).toContain('#doctor .compact-trust-copy h2 { font-weight: 400; }');
    expect(landing).toContain('<span class="hero-headline-main">Text a weight-loss</span><span class="hero-headline-middle">doctor now.</span><span class="hero-headline-last">For FREE!</span>');
    expect(landing).toContain('.hero .phone-screen{background:var(--hero-white);color:var(--hero-navy)}');
  });

  it("keeps small white text readable on the primary CTA and numbered-step surfaces", () => {
    expect(css).toContain('--cta-teal: #003B3E');
    expect(css).toContain('.step-num, .shield { background: var(--deep-teal); }');
    expect(whiteContrast("003B3E")).toBeGreaterThanOrEqual(4.5);
    expect(whiteContrast("06263B")).toBeGreaterThanOrEqual(4.5);
  });

  it("retains route isolation, existing images, original-intake destinations and paid local intake", () => {
    expect(landing).toContain('href="/weight-loss-intake/ui-polish.css"');
    expect(landing.split('href="/intake/"').length - 1).toBe(5);
    expect(landing).toContain('data-shared-glp1-catalog data-catalog-image-loading="lazy"');
    expect(landing).toContain('src="/weight-loss-intake/ui-polish.js"');
    expect(landing).toContain('[data-archived-physician-testimonials]{display:none!important}');
    expect(read("client/intake/index.html")).not.toContain('--font-heading:"DM Serif Display"');
    expect(read("client/intake/index.html")).toContain('Pay $49.00 securely');
    expect(read("client/src/pages/WeightLossMenopause.tsx")).not.toContain('weight-loss-intake/ui-polish.css');
  });
});
