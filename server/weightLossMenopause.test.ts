import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateCrawlerHtml, getMetaForPath, injectRouteMetaIntoHtml } from "./crawlerMiddleware";
const read = (file: string) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8");
const page = read("client/src/pages/WeightLossMenopause.tsx");
const css = read("client/src/pages/WeightLossMenopause.css");
const interaction = read("client/src/pages/weightLossMenopauseInteractions.ts");
const treatmentCatalogSource = read("shared/treatmentCatalog.json");
const treatmentCatalog = JSON.parse(read("shared/treatmentCatalog.json"));

describe("Weight-Loss & Menopause supplied page integration", () => {
  it("registers a real React page rather than a standalone document or iframe", () => {
    expect(read("client/src/App.tsx")).toContain('<Route path="/weight-loss-menopause" component={WeightLossMenopause} />');
    expect(page).toContain("export default function WeightLossMenopause()");
    expect(page).not.toMatch(/<iframe|dangerouslySetInnerHTML|window\.location/);
  });
  it("preserves the default GLP-1 choice and renders shared GLP-1 and HRT catalogs", () => {
    expect(page).toContain('aria-pressed="true" aria-controls="glp1-medication-panel"');
    expect(page).toContain('data-medication-panel="hrt" role="region" aria-label="HRT medication options" hidden={true}');
    expect(page).toContain('import treatmentCatalogJson from "@shared/treatmentCatalog.json"');
    expect(page).toContain('treatmentCatalog.glp1.options.map');
    expect(page).toContain('treatmentCatalog.hrt.options.map');
    expect(page).toContain('className="medication-supply"');
    expect(treatmentCatalog.glp1.notSure).toEqual({ value: "not_sure", name: "I'm not sure", helper: "I would like a recommendation" });
    expect(treatmentCatalog.glp1.options).toHaveLength(7);
    expect(treatmentCatalog.hrt.options).toHaveLength(12);
    expect(treatmentCatalog.hrt.options.map((option: { name: string }) => option.name)).not.toContain("Estradiol Gel (Divigel)");
    expect(treatmentCatalog.hrt.options.map((option: { name: string }) => option.name)).not.toContain("Spironolactone + Biotin + Minoxidil Combination Pill");
    expect(page).toContain('className="hero-cta-timing">5-10 min');
  });
  it("uses this project’s exact imported assets, not old task storage or substitutions", () => {
    const manifest = JSON.parse(read("client/src/pages/weightLossMenopauseAssets.json"));
    expect(manifest.assets).toHaveLength(33);
    expect(manifest.source_commit).toBe("702ee3a7eb15ed3ed3394d13672c1851ff2f0a34");
    for (const asset of manifest.assets.filter((asset: { source_name: string }) => asset.source_name !== "estradiol-gel-transparent-candidate.png")) {
      expect(`${page}\n${treatmentCatalogSource}`).toContain(asset.storage_path);
    }
    expect(`${page}\n${treatmentCatalogSource}`).not.toContain("estradiol-gel-transparent-candidate_9fcff251.png");
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
  it("keeps the shared header, original page-only ZIP footer and external intake destination", () => {
    expect(page).toContain("<Navbar");
    expect(page).not.toMatch(/<header|<Footer|import Footer/);
    const footer = page.match(/<footer className="wave-top wave-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
    expect(footer).toContain('className="footer-wordmark">MMD Weight Loss');
    expect(footer).toContain("Physician-guided GLP-1 care with fitness, nutrition, and ongoing support in one program.");
    expect(footer).toContain("© 2026 MMD Weight Loss. Working title and prototype content.");
    expect((footer.match(/<a[\s\S]*?href=/g) ?? []).length).toBe(13);
    for (const anchor of ["how-it-works", "app", "pricing", "faq"]) expect(footer).toContain(`href="#${anchor}"`);
    expect(footer).toContain('className="footer-legitscript-seal"');
    expect(footer).toContain('href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com"');
    expect(footer).toContain('src="https://static.legitscript.com/seals/51795425.png"');
    expect(footer).toContain('title="Verify LegitScript Approval for www.medmethoddirect.com"');
    expect(footer).toContain('alt="Verify Approval for www.medmethoddirect.com"');
    expect(footer).toContain('width="73"');
    expect(footer).toContain('height="79"');
    expect(footer).toContain('rel="noopener noreferrer"');
    expect(footer).toContain('className="footer-legal-nav" aria-label="MedMethod Direct legal links"');
    expect(footer).toContain('className="footer-phone" href="tel:+18883627011"');
    expect(footer).toContain('Call us: <span>+1 888-362-7011</span>');
    expect(footer).toContain('className="footer-legal-login" href="https://medmethoddirect.md-hq.com/"');
    for (const [label, href] of [
      ["Terms", "/terms"],
      ["Privacy", "/privacy-policy"],
      ["HIPAA Notice", "/hipaa-notice"],
      ["Subscription &amp; Refunds", "/subscription-policy"],
      ["Shipping", "/shipping-policy"],
      ["Accessibility", "/accessibility"],
    ]) expect(footer).toContain(`href="${href}">${label}</a>`);
    expect(footer).not.toMatch(/Book Appointment|Explore|Legal & Compliance|MetabolicQuiz/);
    expect(css).toContain(".wlm-content footer{padding:54px 0 30px;background:#7a1e7e;color:#fff}");
    expect(css).toContain(".wlm-content .footer-bottom{display:flex;align-items:center;justify-content:space-between");
    expect(css).toContain(".wlm-content .footer-legitscript-seal img{display:block;width:73px;height:79px");
    expect(css).toContain(".wlm-content .footer-legal-nav{display:flex;flex-wrap:wrap;align-items:center");
    expect(css).toContain(".wlm-content .footer-phone{display:inline-flex;align-items:center;justify-content:center;min-height:44px");
    expect(page).toContain("showVirtualBanner={false} stickyOnPage");
    expect(read("client/src/components/home1/Footer.tsx")).toContain('{ label: "Weight-Loss & Menopause", href: "/weight-loss-menopause" }');
    const intakeUrl = "https://intake.medmethoddirect.com/";
    expect(page).toContain(`WEIGHT_MENOPAUSE_INTAKE_URL = "${intakeUrl}"`);
    expect(page).not.toContain("https://muse.ai/s/mmd-weight-care-intake-xtv6fxmhn89rxp");
    expect((page.match(/href=\{WEIGHT_MENOPAUSE_INTAKE_URL\}/g) ?? []).length).toBe(5);
    expect(page).toContain("primaryHref={WEIGHT_MENOPAUSE_INTAKE_URL}");
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
