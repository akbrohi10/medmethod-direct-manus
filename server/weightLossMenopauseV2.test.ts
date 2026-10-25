import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateCrawlerHtml, getMetaForPath, injectRouteMetaIntoHtml } from "./crawlerMiddleware";

const read = (file: string) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8");
const originalPage = read("client/src/pages/WeightLossMenopause.tsx");
const originalCss = read("client/src/pages/WeightLossMenopause.css");
const originalInteraction = read("client/src/pages/weightLossMenopauseInteractions.ts");
const page = read("client/src/pages/WeightLossMenopauseV2.tsx");
const css = read("client/src/pages/WeightLossMenopauseV2.css");
const interaction = read("client/src/pages/weightLossMenopauseV2Interactions.ts");
const app = read("client/src/App.tsx");
const vite = read("server/_core/vite.ts");
const sitemap = read("client/public/sitemap.xml");
const treatmentCatalog = JSON.parse(read("shared/treatmentCatalog.json")) as {
  glp1: { options: Array<{ value: string }> };
  hrt: { options: Array<{ value: string; images: { weightLossMenopause?: string | null } }> };
};

const approvedHeroHeadline = '<h1><span className="hero-headline-line">Text a Weight Loss &amp; Hormone Specialist NOW</span><br className="hero-mobile-headline-break" /> <span className="hero-headline-line">— <em>For FREE!</em></span></h1>';
const approvedHeroSupportingLine = '<p className="hero-description">Explore your options for <strong>GLP-1s, Menopause &amp; Hormone Therapy.</strong></p>';
const originalHeroHeadline = originalPage.match(/<h1>.*?<\/h1>/)?.[0] ?? "";
const originalHeroSupportingLine = originalPage.match(/<span className="hero-eyebrow">.*?<\/span>/)?.[0] ?? "";
const originalHeroPricingBlock = originalPage.match(/<div className="hero-offer"[\s\S]*?<\/div>\n/)?.[0] ?? "";
const refinementMarker = "\n/* Approved V2 hero refinement: breathing room and clean supporting text only. */";

function restoreOriginalNames(source: string): string {
  return source
    .replaceAll("WeightLossMenopauseV2", "WeightLossMenopause")
    .replaceAll("weightLossMenopauseV2Interactions", "weightLossMenopauseInteractions")
    .replaceAll("weight-loss-menopauseV2", "weight-loss-menopause")
    .replaceAll("wlm-v2-page", "wlm-page")
    .replaceAll("wlm-v2-content", "wlm-content")
    .replaceAll("wlm-v2-", "wlm-");
}

describe("Weight-Loss & Menopause V2 duplicate integration", () => {
  it("preserves exact source parity outside the approved hero copy, pricing removal and isolated spacing block", () => {
    expect(page).toContain('import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions"');
    expect(page).toContain('import "./WeightLossMenopauseV2.css"');
    expect(page).toContain("export default function WeightLossMenopauseV2()");
    expect(page).toContain('const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(page).toContain('className="wlm-v2-page"');
    expect(page).toContain('className="wlm-v2-content"');
    expect(originalHeroHeadline).not.toBe("");
    expect(originalHeroSupportingLine).not.toBe("");
    expect(originalHeroPricingBlock).not.toBe("");
    const restoredHeroCopy = page.replace(approvedHeroHeadline, originalHeroHeadline).replace(approvedHeroSupportingLine, originalHeroSupportingLine).replace('<div className="hero-actions">', originalHeroPricingBlock + '<div className="hero-actions">');
    expect(restoreOriginalNames(restoredHeroCopy)).toBe(originalPage);

    expect(interaction).toContain("export function initializeWeightLossMenopauseV2(root: HTMLElement): () => void");
    expect(restoreOriginalNames(interaction)).toBe(originalInteraction);

    expect(css).toContain(refinementMarker);
    expect(restoreOriginalNames(css.split(refinementMarker)[0])).toBe(originalCss);
  });

  it("uses the exact approved hero copy without the pricing block, while retaining other pricing and intake links", () => {
    expect(page).toContain(approvedHeroHeadline);
    expect(page).toContain(approvedHeroSupportingLine);
    expect(page).not.toContain(originalHeroHeadline);
    expect(page).not.toContain(originalHeroSupportingLine);
    const hero = page.slice(page.indexOf('<section className="hero"'), page.indexOf('<section className="featured-in"'));
    expect(hero).not.toContain('className="hero-offer"');
    expect(hero).not.toContain('className="hero-eyebrow"');
    expect(hero).not.toContain("$49/month");
    expect(hero).not.toContain("100% refunded if not approved.");
    expect(hero).not.toContain("First month due today");
    expect(page).toContain("$49/month plus the cost of medication.");
    expect(page).toContain('WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/"');
  });

  it("limits added styling to hero typography and breathing room, without phone or other section changes", () => {
    const addedCss = css.split(refinementMarker)[1];
    expect(addedCss).toContain("margin-bottom:32px");
    expect(addedCss).toContain("white-space:normal");
    expect(addedCss).toContain("margin:0 auto 36px");
    expect(addedCss).toContain("padding:0;border:0;background:none");
    expect(addedCss).toContain("font-size:1.0625rem;line-height:1.6");
    expect(addedCss).toContain(".hero-description strong{color:var(--teal-dark);font-weight:700}");
    expect(addedCss).not.toMatch(/phone|medication|#pricing|\.hero-actions|\bbody\b|\bhtml\b/);
  });

  it("registers only one exact user-cased V2 preview entry and no social-proof overlay", () => {
    expect(app).toContain('const WeightLossMenopauseV2 = lazy(() => import("@/pages/WeightLossMenopauseV2"));');
    expect(app).toContain('<Route path="/weight-loss-menopauseV2" component={WeightLossMenopauseV2} />');
    expect(app).not.toContain('<Route path="/weight-loss-menopauseV2/"');
    expect(app.match(/<Route path="\/weight-loss-menopauseV2\/?"/g)).toHaveLength(1);
    expect(app).toContain('<Route path="/weight-loss-menopause" component={WeightLossMenopause} />');

    const socialProofRouter = app.slice(app.indexOf("function SocialProofNotificationsRouter"), app.indexOf("function App()"));
    expect(socialProofRouter).toContain('"/weight-loss-menopauseV2"');
    expect(socialProofRouter).toContain('"/weight-loss-menopauseV2/"');
  });

  it("keeps V2 isolated with V2-only page/content scopes and animation names", () => {
    expect(css).toContain(".wlm-v2-page");
    expect(css).toContain(".wlm-v2-content");
    expect(css).not.toMatch(/\.wlm-(?:page|content)\b/);
    expect(css).not.toMatch(/\bwlm-(?!v2-)/);
    expect(css).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\s*\{/);

    for (const name of ["messagePop", "typingDot", "livePulse", "featuredScroll", "medmethod-pulse"]) {
      expect(css).toContain(`wlm-v2-${name}`);
    }
    for (const name of ["messagePop", "typingDot", "livePulse", "featuredScroll"]) {
      expect(css).toContain(`@keyframes wlm-v2-${name}`);
    }
  });

  it("uses the unchanged shared treatment catalog, exactly four pictured HRT cards, and external intake CTAs", () => {
    expect(page).toContain('import treatmentCatalogJson from "@shared/treatmentCatalog.json"');
    expect(page).toContain("treatmentCatalog.glp1.options.map");
    expect(page).toContain("pageHrtOptions.map");
    expect(page).toContain("const pageHrtOptions = treatmentCatalog.hrt.options.filter(treatment => PAGE_HRT_TREATMENT_IDS.has(treatment.value));");
    expect(page).not.toContain("treatmentCatalog.hrt.options.map");

    const idsBlock = page.match(/const PAGE_HRT_TREATMENT_IDS = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
    const visibleIds = Array.from(idsBlock.matchAll(/"([^"]+)"/g), match => match[1]);
    expect(visibleIds).toEqual([
      "estradiol_tablets",
      "estradiol_patch",
      "micronized_progesterone_pill",
      "vaginal_estrogen_cream",
    ]);
    expect(treatmentCatalog.glp1.options).toHaveLength(7);
    expect(treatmentCatalog.hrt.options).toHaveLength(12);
    expect(treatmentCatalog.hrt.options.filter(option => visibleIds.includes(option.value))).toHaveLength(4);
    for (const option of treatmentCatalog.hrt.options.filter(option => visibleIds.includes(option.value))) {
      expect(option.images.weightLossMenopause).toMatch(/^\/manus-storage\//);
    }

    const intakeUrl = "https://intake.medmethoddirect.com/";
    expect(page).toContain(`WEIGHT_MENOPAUSE_INTAKE_URL = "${intakeUrl}"`);
    expect(page).toContain('className="btn medication-card-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}');
    expect((page.match(/href=\{WEIGHT_MENOPAUSE_INTAKE_URL\}/g) ?? [])).toHaveLength(6);
    expect(page).not.toContain("?treatment");
  });

  it("has V2-owned crawler metadata with original content, its own canonical URL, and no sitemap entry", () => {
    const originalMeta = getMetaForPath("/weight-loss-menopause/?test=1");
    const meta = getMetaForPath("/weight-loss-menopauseV2/?test=1");

    expect(meta.title).toBe(originalMeta.title);
    expect(meta.description).toBe(originalMeta.description);
    expect(meta.image).toBe(originalMeta.image);
    expect(meta.robots).toBe("noindex,follow");
    expect(meta.url).toBe("https://medmethoddirect.com/weight-loss-menopauseV2");

    const crawlerHtml = generateCrawlerHtml(meta);
    expect(crawlerHtml).toContain('name="robots" content="noindex,follow"');
    expect(crawlerHtml).toContain('rel="canonical" href="https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(injectRouteMetaIntoHtml("<html><head></head></html>", meta)).toContain('property="og:url" content="https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(sitemap).not.toContain("/weight-loss-menopauseV2");
  });

  it("extends server-side Vite metadata injection from the original route to V2", () => {
    expect(vite).toContain('"/weight-loss-menopause"');
    expect(vite).toContain('"/weight-loss-menopauseV2"');
    expect(vite).toMatch(/weight-loss-menopauseV2[\s\S]{0,300}injectRouteMetaIntoHtml|injectRouteMetaIntoHtml[\s\S]{0,300}weight-loss-menopauseV2/);
  });
});
