import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateCrawlerHtml, getMetaForPath, injectRouteMetaIntoHtml } from "./crawlerMiddleware";
const read = (file: string) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8");
const page = read("client/src/pages/WeightLossMenopause.tsx");
const css = read("client/src/pages/WeightLossMenopause.css");
const interaction = read("client/src/pages/weightLossMenopauseInteractions.ts");

describe("Weight-Loss & Menopause supplied page integration", () => {
  it("registers a real React page rather than a standalone document or iframe", () => {
    expect(read("client/src/App.tsx")).toContain('<Route path="/weight-loss-menopause" component={WeightLossMenopause} />');
    expect(page).toContain("export default function WeightLossMenopause()");
    expect(page).not.toMatch(/<iframe|dangerouslySetInnerHTML|window\.location/);
  });
  it("preserves the default GLP-1 choice, complete catalog and HRT supplies", () => {
    expect(page).toContain('aria-pressed="true" aria-controls="glp1-medication-panel"');
    expect(page).toContain('data-medication-panel="hrt" role="region" aria-label="HRT medication options" hidden={true}');
    expect((page.match(/className="medication-card"/g) ?? []).length).toBe(12);
    for (const price of ["$299", "$149", "$199", "$70", "$100", "$115", "$29", "$99", "$69", "$79"]) expect(page).toContain(price);
    for (const supply of ["1-month supply", "3-month supply", "2-month supply"]) expect(page).toContain(supply);
    expect(page).toContain('className="hero-cta-timing">5-10 min');
  });
  it("uses this project’s exact imported assets, not old task storage or substitutions", () => {
    const manifest = JSON.parse(read("client/src/pages/weightLossMenopauseAssets.json"));
    expect(manifest.assets).toHaveLength(33);
    expect(manifest.source_commit).toBe("702ee3a7eb15ed3ed3394d13672c1851ff2f0a34");
    for (const asset of manifest.assets) expect(page).toContain(asset.storage_path);
    for (const retired of ["7543c31c", "afb3ff87", "cab52469", "bd4c65f6", "b3ee02dc"]) expect(page).not.toContain(retired);
    expect(page).not.toContain("data:image");
  });
  it("scopes styles and animation names and retains the ivory contain treatment", () => {
    expect(css).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\s*\{/);
    expect(css).toContain(".wlm-content");
    for (const name of ["messagePop", "typingDot", "livePulse", "featuredScroll", "medmethod-pulse"]) expect(css).toContain(`wlm-${name}`);
    expect(css).toContain("background:#F4F0E9");
    expect(css).toContain("object-fit:contain;object-position:center");
    expect(css).toContain(".hero-cta-label .arrow{position:absolute");
  });
  it("limits DOM queries to the mounted root and cleans up all asynchronous resources", () => {
    expect(interaction).not.toMatch(/document\.(?:querySelector|getElementById)|fetch\(|trpc\.|stripe|paypal/);
    expect(interaction).toContain('estimator.hidden = choice === "hrt"');
    expect(interaction).toContain("target.removeEventListener");
    expect(interaction).toContain("observer?.disconnect()");
    expect(interaction).toContain("cancelAnimationFrame(stickyFrame)");
    expect(interaction).toContain("clearChatTimers()");
  });
  it("reuses one shared header/footer and preserves the external intake destination", () => {
    expect(page).toContain("<Navbar"); expect(page).toContain("<Footer");
    expect(page).not.toMatch(/<header|<footer className=/);
    expect(page).toContain("showQuiz={false} showStates={false}");
    expect(page).toContain("showVirtualBanner={false} stickyOnPage");
    expect(read("client/src/components/home1/Footer.tsx")).toContain('{ label: "Weight-Loss & Menopause", href: "/weight-loss-menopause" }');
    expect(page).toContain("https://muse.ai/s/mmd-weight-care-intake-xtv6fxmhn89rxp");
    expect(page).toContain("Prototype disclosure:");
  });
  it("keeps prototype SEO noindex and out of the active sitemap", () => {
    const meta = getMetaForPath("/weight-loss-menopause/?test=1");
    expect(meta.title).toBe("Weight-Loss & Menopause | MedMethod Direct");
    expect(meta.robots).toBe("noindex,follow");
    expect(meta.url).toBe("https://medmethoddirect.com/weight-loss-menopause");
    const crawler = generateCrawlerHtml(meta);
    expect(crawler).toContain('name="robots" content="noindex,follow"');
    expect(crawler).toContain('name="facebook-domain-verification"');
    expect(injectRouteMetaIntoHtml("<html><head></head></html>", meta)).toContain('rel="canonical" href="https://medmethoddirect.com/weight-loss-menopause"');
    expect(read("client/public/sitemap.xml")).not.toContain("/weight-loss-menopause");
  });
});
