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
  it("is an exact source duplicate after only the approved page, dependency, URL, and scope inversions", () => {
    expect(page).toContain('import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions"');
    expect(page).toContain('import "./WeightLossMenopauseV2.css"');
    expect(page).toContain("export default function WeightLossMenopauseV2()");
    expect(page).toContain('const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(page).toContain('className="wlm-v2-page"');
    expect(page).toContain('className="wlm-v2-content"');
    expect(restoreOriginalNames(page)).toBe(originalPage);

    expect(interaction).toContain("export function initializeWeightLossMenopauseV2(root: HTMLElement): () => void");
    expect(restoreOriginalNames(interaction)).toBe(originalInteraction);

    expect(restoreOriginalNames(css)).toBe(originalCss);
  });

  it("registers the exact user-cased V2 URL, its trailing-slash variant, and no social-proof overlay", () => {
    expect(app).toContain('const WeightLossMenopauseV2 = lazy(() => import("@/pages/WeightLossMenopauseV2"));');
    expect(app).toContain('<Route path="/weight-loss-menopauseV2" component={WeightLossMenopauseV2} />');
    expect(app).toContain('<Route path="/weight-loss-menopauseV2/" component={WeightLossMenopauseV2} />');

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
