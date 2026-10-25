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
type Glp1PageDisplay = {
  name: string;
  price: string;
  supply?: string;
  specs: { label: string; value: string }[];
};

const treatmentCatalog = JSON.parse(read("shared/treatmentCatalog.json")) as {
  glp1: {
    options: Array<{ value: string }>;
    pageDisplays: { weightLossIntake: Record<string, Glp1PageDisplay> };
  };
  hrt: { options: Array<{ value: string; images: { weightLossMenopause?: string | null } }> };
};

const approvedGlp1DisplayMap: Record<string, Glp1PageDisplay> = {
  compounded_semaglutide: {
    name: "Compounded Semaglutide",
    price: "$129/month — fixed price",
    specs: [
      { label: "Vial size", value: "2.5–12.5 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  compounded_tirzepatide: {
    name: "Compounded Tirzepatide",
    price: "$149 to $299/month",
    specs: [
      { label: "Vial size", value: "10–60 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  compounded_liraglutide: {
    name: "Compounded Liraglutide",
    price: "$115",
    supply: "28-day supply",
    specs: [
      { label: "Strength", value: "6mg/mL" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  wegovy_direct_novocare: {
    name: "Wegovy® Pen — Direct from NovoCare®",
    price: "$349/month — fixed price",
    supply: "Four single-dose, prefilled pens",
    specs: [{ label: "Dose per Pen", value: "0.25–2.4 mg" }],
  },
  wegovy_pill_direct_novocare: {
    name: "Wegovy® Pill — Direct from NovoCare®",
    price: "$149 to $299/month",
    specs: [{ label: "Strength", value: "1.5–25 mg" }],
  },
  zepbound_kwikpen_direct_lillydirect: {
    name: "Zepbound® KwikPen — Direct from LillyDirect®",
    price: "$299 to $449/month",
    supply: "Four prefilled pens",
    specs: [{ label: "Dose per Pen", value: "2.5–15 mg" }],
  },
  foundayo_pill_direct_lillydirect: {
    name: "Foundayo® Pill — Direct from LillyDirect®",
    price: "$149 to $299/month",
    specs: [{ label: "Strength", value: "0.8–17.2 mg" }],
  },
};

const approvedHeroHeadline = '<h1><span className="hero-headline-line">Text a Doctor now</span><span className="hero-headline-line"><em>For FREE!</em></span></h1>';
const approvedHeroSupportingLine = '<p className="hero-description">to explore <strong>GLP-1s, menopause &amp; hormone therapy.</strong></p>';
const approvedHowItWorksSection = '<section className="section wave-top wave-soft" id="how-it-works"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps"><article className="step"><div className="step-num">1</div><h3>Complete your intake (5–10 min)</h3></article><article className="step"><div className="step-num">2</div><h3>Text with your doctor</h3></article><article className="step"><div className="step-num">3</div><h3>Discuss your options with your doctor, based on your evaluation.</h3></article></div></div></section>';
const originalHeroHeadline = originalPage.match(/<h1>.*?<\/h1>/)?.[0] ?? "";
const originalHeroSupportingLine = originalPage.match(/<span className="hero-eyebrow">.*?<\/span>/)?.[0] ?? "";
const originalHeroPricingBlock = originalPage.match(/<div className="hero-offer"[\s\S]*?<\/div>\n/)?.[0] ?? "";
const originalHowItWorksSection = originalPage.match(/<section className="section wave-top wave-soft" id="how-it-works">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalGlp1CatalogTypeCast = originalPage.match(/const treatmentCatalog = treatmentCatalogJson as \{[\s\S]*?\n\};/)?.[0] ?? "";
const originalMedicationCard = originalPage.match(/function MedicationCard\([\s\S]*?\n}\n/)?.[0] ?? "";
const approvedGlp1PageDisplayType = `type Glp1PageDisplay = {
  name: string;
  price: string;
  supply?: string;
  specs: { label: string; value: string }[];
};

`;
const approvedGlp1CatalogTypeCast = originalGlp1CatalogTypeCast.replace(
  "  glp1: { options: TreatmentCatalogOption[] };",
  "  glp1: { options: TreatmentCatalogOption[]; pageDisplays: { weightLossIntake: Record<string, Glp1PageDisplay> } };",
);
const approvedMedicationCard = originalMedicationCard
  .replace(
    "  const image = treatment.images.weightLossMenopause;\n",
    "  const image = treatment.images.weightLossMenopause;\n  const display = category === \"glp1\" ? treatmentCatalog.glp1.pageDisplays.weightLossIntake[treatment.value] : undefined;\n  const name = display?.name ?? treatment.name;\n  const price = display?.price ?? treatment.price;\n  const supply = display ? display.supply : treatment.supply;\n",
  )
  .replace("<div className=\"medication-card-name\"><h3>{treatment.name}</h3></div>", "<div className=\"medication-card-name\"><h3>{name}</h3></div>")
  .replace("<div className=\"medication-price\"><small>Price</small><strong>{treatment.price}</strong>{treatment.supply ? <span className=\"medication-supply\">{treatment.supply}</span> : null}</div>", "<div className=\"medication-price\"><small>Price</small><strong>{price}</strong>{supply ? <span className=\"medication-supply\">{supply}</span> : null}</div>")
  .replace("{treatment.frequency || treatment.form ? <dl className=\"medication-specs\">{treatment.frequency ? <><dt>Frequency</dt><dd>{treatment.frequency}</dd></> : null}{treatment.form ? <><dt>Form</dt><dd>{treatment.form}</dd></> : null}</dl> : null}", "{display ? <dl className=\"medication-specs\">{display.specs.map(spec => <div key={spec.label} style={{ display: \"contents\" }}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl> : treatment.frequency || treatment.form ? <dl className=\"medication-specs\">{treatment.frequency ? <><dt>Frequency</dt><dd>{treatment.frequency}</dd></> : null}{treatment.form ? <><dt>Form</dt><dd>{treatment.form}</dd></> : null}</dl> : null}")
  .replace("aria-label={`Get started with an intake for ${treatment.name}`}", "aria-label={`Get started with an intake for ${name}`}");
const refinementMarker = "\n/* Approved V2 hero refinement: breathing room and clean supporting text only. */";
const conciseHeroMarker = "\n/* Approved V2 concise hero hierarchy: typography only. */";
const supportingLineMarker = "\n/* Approved V2 supporting-line readability: supporting text only. */";
const compactHowItWorksMarker = "\n/* Approved V2 compact How it works: this section only. */";
const heroFontLink = '        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" />\n';

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
  it("preserves exact source parity outside the approved hero and How it works changes", () => {
    expect(page).toContain('import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions"');
    expect(page).toContain('import "./WeightLossMenopauseV2.css"');
    expect(page).toContain("export default function WeightLossMenopauseV2()");
    expect(page).toContain('const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(page).toContain('className="wlm-v2-page"');
    expect(page).toContain('className="wlm-v2-content"');
    expect(originalHeroHeadline).not.toBe("");
    expect(originalHeroSupportingLine).not.toBe("");
    expect(originalHeroPricingBlock).not.toBe("");
    expect(originalHowItWorksSection).not.toBe("");
    expect(originalGlp1CatalogTypeCast).not.toBe("");
    expect(originalMedicationCard).not.toBe("");
    expect(approvedGlp1CatalogTypeCast).not.toBe(originalGlp1CatalogTypeCast);
    expect(approvedMedicationCard).not.toBe(originalMedicationCard);
    const restoredApprovedCopy = page
      .replace(approvedGlp1PageDisplayType, "")
      .replace(approvedGlp1CatalogTypeCast, originalGlp1CatalogTypeCast)
      .replace(approvedMedicationCard, originalMedicationCard)
      .replace(heroFontLink, "")
      .replace(approvedHeroHeadline, originalHeroHeadline)
      .replace(approvedHeroSupportingLine, originalHeroSupportingLine)
      .replace('<div className="hero-actions">', originalHeroPricingBlock + '<div className="hero-actions">')
      .replace(approvedHowItWorksSection + "\n", "")
      .replace('<section className="section wave-top wave-surface wave-flip" id="doctor">', originalHowItWorksSection + '\n<section className="section wave-top wave-surface wave-flip" id="doctor">');
    expect(restoreOriginalNames(restoredApprovedCopy)).toBe(originalPage);

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

  it("limits the previous refinement to its original hero typography and breathing-room contract", () => {
    const previousHeroCss = css.slice(css.indexOf(refinementMarker), css.indexOf(conciseHeroMarker));
    expect(previousHeroCss).toContain("margin-bottom:32px");
    expect(previousHeroCss).toContain("white-space:normal");
    expect(previousHeroCss).toContain("margin:0 auto 36px");
    expect(previousHeroCss).toContain("padding:0;border:0;background:none");
    expect(previousHeroCss).toContain("font-size:1.0625rem;line-height:1.6");
    expect(previousHeroCss).toContain(".hero-description strong{color:var(--teal-dark);font-weight:700}");
    expect(previousHeroCss).not.toMatch(/phone|medication|#pricing|\.hero-actions|\bbody\b|\bhtml\b/);
  });

  it("uses DM Serif Display for the approved V2 hero headline and Montserrat for its supporting line, preserving all V2 palette and layout rules", () => {
    const head = page.slice(page.indexOf("<Helmet>"), page.indexOf("</Helmet>"));
    expect(head).toContain(heroFontLink.trim());
    expect(css).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1{font-family:"DM Serif Display",Georgia,serif;font-weight:400}');
    expect(css.slice(0, css.indexOf(compactHowItWorksMarker)).match(/font-family:"DM Serif Display"/g)).toHaveLength(2);
    expect(originalPage).not.toContain("DM Serif Display");
    expect(originalCss).not.toContain("DM Serif Display");
    expect(read("client/src/index.css")).not.toContain('.wlm-v2-content .hero[data-medmethod-scope] h1');
    expect(page).not.toMatch(/Bodoni|Playfair|DM\+Sans/);
    expect(css).not.toMatch(/Bodoni|Playfair|--hero-deep-teal|Approved reference match/);
  });

  it("appends only the approved concise hero typography hierarchy", () => {
    expect(css).toContain(conciseHeroMarker);
    expect(css).toContain(supportingLineMarker);
    const conciseHeroCss = css.slice(css.indexOf(conciseHeroMarker) + conciseHeroMarker.length, css.indexOf(supportingLineMarker));
    const normalizedCss = conciseHeroCss.replace(/\s+/g, "");
    expect(normalizedCss).toContain('.wlm-v2-content.hero[data-medmethod-scope]h1{font-size:clamp(2.5rem,5.1vw,4.25rem);line-height:1.05;margin-bottom:24px}');
    expect(normalizedCss).toContain('.wlm-v2-content.hero[data-medmethod-scope].hero-headline-line{display:block;white-space:normal;text-wrap:balance}');
    expect(normalizedCss).toContain('.wlm-v2-content.hero[data-medmethod-scope].hero-description{font-family:"DMSerifDisplay",Georgia,serif;font-size:clamp(1.125rem,2.3vw,1.55rem);font-weight:400;line-height:1.35;max-width:32ch;margin-bottom:32px}');
    expect(normalizedCss).toContain('.wlm-v2-content.hero[data-medmethod-scope].hero-descriptionstrong{font-weight:400}');
    expect(normalizedCss).toContain('@media(max-width:700px){.wlm-v2-content.hero[data-medmethod-scope]h1{font-size:clamp(2rem,10.5vw,3rem)}.wlm-v2-content.hero[data-medmethod-scope].hero-description{font-size:clamp(1.1rem,4.8vw,1.25rem);max-width:30ch}}');

    const selectors = Array.from(conciseHeroCss.matchAll(/(?:^|[{}])\s*([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));
    const declarations = Array.from(conciseHeroCss.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:/g), match => match[1]);
    expect(selectors).toEqual([
      ".wlm-v2-content .hero[data-medmethod-scope] h1",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-headline-line",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description strong",
      ".wlm-v2-content .hero[data-medmethod-scope] h1",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description",
    ]);
    expect(declarations).toEqual([
      "font-size", "line-height", "margin-bottom",
      "display", "white-space", "text-wrap",
      "font-family", "font-size", "font-weight", "line-height", "max-width", "margin-bottom",
      "font-weight",
      "font-size",
      "font-size", "max-width",
    ]);
    expect(conciseHeroCss).not.toMatch(/\b(?:color|background)\s*:|phone|\.btn\b|\bbutton\b|\.hero-actions\b|\.(?:featured-in|medication-|estimator-|pricing-section|everything|support-section|testimonials|privacy-band|footer|section)\b|(?:^|[}\n])\s*(?:body|html|:root)\b/i);
  });

  it("appends exactly the approved supporting-line readability rules", () => {
    expect(css).toContain(supportingLineMarker);
    expect(css).toContain(compactHowItWorksMarker);
    expect(css.indexOf(supportingLineMarker)).toBeLessThan(css.indexOf(compactHowItWorksMarker));
    const supportingLineCss = css.slice(css.indexOf(supportingLineMarker) + supportingLineMarker.length, css.indexOf(compactHowItWorksMarker));
    const normalizedCss = supportingLineCss.replace(/\s+/g, "");
    expect(normalizedCss).toBe('.wlm-v2-content.hero[data-medmethod-scope].hero-description{font-family:"Montserrat",sans-serif;font-size:clamp(1.25rem,2.55vw,1.7rem);font-weight:500;line-height:1.5;color:var(--navy)}.wlm-v2-content.hero[data-medmethod-scope].hero-descriptionstrong{font-weight:500;color:var(--teal-dark)}@media(max-width:700px){.wlm-v2-content.hero[data-medmethod-scope].hero-description{font-size:clamp(1.175rem,5.2vw,1.375rem)}}');

    const selectors = Array.from(supportingLineCss.matchAll(/(?:^|[{}])\s*([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));
    const declarations = Array.from(supportingLineCss.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:/g), match => match[1]);
    expect(selectors).toEqual([
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description strong",
      ".wlm-v2-content .hero[data-medmethod-scope] .hero-description",
    ]);
    expect(declarations).toEqual([
      "font-family", "font-size", "font-weight", "line-height", "color",
      "font-weight", "color",
      "font-size",
    ]);
  });

  it("uses exactly the approved compact How it works copy with no extra text or markup", () => {
    const howItWorks = page.match(/<section className="section wave-top wave-soft" id="how-it-works">[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(howItWorks).toBe(approvedHowItWorksSection);
    expect([...howItWorks.matchAll(/<h3>(.*?)<\/h3>/g)].map(match => match[1])).toEqual([
      "Complete your intake (5–10 min)",
      "Text with your doctor",
      "Discuss your options with your doctor, based on your evaluation.",
    ]);
    expect(howItWorks.match(/<article className="step">/g)).toHaveLength(3);
    expect([...howItWorks.matchAll(/<div className="step-num">(\d)<\/div>/g)].map(match => match[1])).toEqual(["1", "2", "3"]);
    expect(howItWorks).not.toMatch(/<p\b|<ul\b|<li\b|<span\b|<a\b|<button\b/);
  });

  it("places the unchanged How it works section directly after Featured In", () => {
    const sections = Array.from(page.matchAll(/<section\b[^>]*>/g), match => match[0]);
    expect(sections[0]).toContain('className="hero"');
    expect(sections[1]).toContain('className="featured-in"');
    expect(sections[2]).toContain('id="how-it-works"');
    expect(sections[3]).toContain('className="medication-pricing"');
    expect(page.match(/id="how-it-works"/g)).toHaveLength(1);
  });

  it("appends scoped compact How it works typography, geometry, and token-only colors", () => {
    expect(css.match(/\/\* Approved V2 compact How it works: this section only\. \*\//g)).toHaveLength(1);
    const compactHowItWorksCss = css.slice(css.indexOf(compactHowItWorksMarker) + compactHowItWorksMarker.length);
    const normalizedCss = compactHowItWorksCss.replace(/\s+/g, "");

    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works{padding:36px0}');
    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works.section-headingh2{margin:0;font-family:"DMSerifDisplay",Georgia,serif;font-size:clamp(1.875rem,4vw,3rem);font-weight:400;color:var(--navy)}');
    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works.steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:20px}');
    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works.step{display:grid;grid-template-columns:34pxminmax(0,1fr);align-items:center;gap:12px;min-height:0;padding:18px;border-radius:16px}');
    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works.step-num{width:34px;height:34px;margin:0;font-family:"Montserrat",sans-serif;font-size:1rem;line-height:1;background:var(--teal-dark)}');
    expect(normalizedCss).toContain('.wlm-v2-content#how-it-works.steph3{margin:0;font-family:"DMSerifDisplay",Georgia,serif;font-size:1.25rem;font-weight:400;line-height:1.35;letter-spacing:-.025em;white-space:normal;color:var(--navy)}');
    expect(normalizedCss).toContain('@media(max-width:900px){.wlm-v2-content#how-it-works{padding:28px0}.wlm-v2-content#how-it-works.steps{grid-template-columns:1fr;gap:24px;margin-top:18px}.wlm-v2-content#how-it-works.step{padding:16px}');

    const selectors = Array.from(compactHowItWorksCss.matchAll(/(?:^|[{}])\s*([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));
    expect(selectors.length).toBeGreaterThan(7);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-content #how-it-works(?:\b|\s|[.:#])/);

    const colorValues = Array.from(compactHowItWorksCss.matchAll(/(?:^|[;{])\s*(?:color|background)\s*:\s*([^;}\n]+)/g), match => match[1].trim());
    expect(colorValues).toEqual(["var(--navy)", "var(--teal-dark)", "var(--navy)", "var(--teal-dark)"]);
    expect(compactHowItWorksCss).not.toMatch(/--[\w-]+\s*:/);
    expect(compactHowItWorksCss).not.toMatch(/#[\da-f]{3,8}\b|(?:rgba?|hsla?)\(|color-mix\(/i);
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

  it("renders the approved GLP-1 display mapping while retaining the original HRT card branch", () => {
    const glp1DisplayMap = treatmentCatalog.glp1.pageDisplays.weightLossIntake;
    expect(glp1DisplayMap).toEqual(approvedGlp1DisplayMap);
    expect(Object.keys(glp1DisplayMap)).toEqual(treatmentCatalog.glp1.options.map(option => option.value));
    expect(Object.keys(glp1DisplayMap)).toHaveLength(7);

    const pageGlp1PageDisplayType = page.match(/type Glp1PageDisplay = \{[\s\S]*?\n};\n\n/)?.[0] ?? "";
    const pageGlp1CatalogTypeCast = page.match(/const treatmentCatalog = treatmentCatalogJson as \{[\s\S]*?\n\};/)?.[0] ?? "";
    const pageMedicationCard = page.match(/function MedicationCard\([\s\S]*?\n}\n/)?.[0] ?? "";
    expect(pageGlp1PageDisplayType).toBe(approvedGlp1PageDisplayType);
    expect(pageGlp1CatalogTypeCast).toBe(approvedGlp1CatalogTypeCast);
    expect(pageMedicationCard).toBe(approvedMedicationCard);

    expect(pageMedicationCard).toContain('const display = category === "glp1" ? treatmentCatalog.glp1.pageDisplays.weightLossIntake[treatment.value] : undefined;');
    expect(pageMedicationCard).toContain("const name = display?.name ?? treatment.name;");
    expect(pageMedicationCard).toContain("const price = display?.price ?? treatment.price;");
    expect(pageMedicationCard).toContain("const supply = display ? display.supply : treatment.supply;");
    expect(pageMedicationCard).toContain('<dl className="medication-specs">{display.specs.map(spec => <div key={spec.label} style={{ display: "contents" }}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>');
    expect(pageMedicationCard).toContain('<dl className="medication-specs">{treatment.frequency ? <><dt>Frequency</dt><dd>{treatment.frequency}</dd></> : null}{treatment.form ? <><dt>Form</dt><dd>{treatment.form}</dd></> : null}</dl>');
    expect(pageMedicationCard).toContain('<p className="medication-note">{treatment.note}</p>');
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
