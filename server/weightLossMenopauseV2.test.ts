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

const approvedHeroHeadline = '<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>For FREE!</em></span></h1>';
const approvedHeroSupportingLine = '<p className="hero-description">Explore your options for<br /><strong>GLP-1s, menopause &amp; hormone therapy.</strong></p>';
const approvedPatientMessage = '<div className="chat-message" data-chat-at="400"><div className="bubble me">Hi Dr. Al-Deek,<br />I\'d like to learn about my options for weight loss and hormones.</div><div className="chat-time patient-time">9:41 AM</div></div>';
const approvedDoctorMessage = '<div className="chat-message" data-chat-at="2400"><div className="bubble">Of course! I\'m happy to help. Let\'s discuss your goals and see what options may be right for you.</div><div className="chat-time">9:42 AM</div></div>';
const approvedHowItWorksSection = '<section className="section wave-top wave-soft" id="how-it-works"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps"><article className="step"><div className="step-num">1</div><h3>Complete your intake (5–10 min)</h3></article><article className="step"><div className="step-num">2</div><h3>Text with your doctor</h3></article><article className="step"><div className="step-num">3</div><h3>Discuss your options with your doctor, based on your evaluation.</h3></article></div></div></section>';
const originalHero = originalPage.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
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
  .replace("aria-label={`Get started with an intake for ${treatment.name}`}", "aria-label={`Get started with an intake for ${name}`}")
  .replace('const price = display?.price ?? treatment.price;', 'const price = display?.price.replace(" — fixed price", " — same price at every dose") ?? treatment.price;');
const refinementMarker = "\n/* Approved V2 hero refinement: breathing room and clean supporting text only. */";
const compactHowItWorksMarker = "\n/* Approved V2 compact How it works: this section only. */";
const uploadedHeroMarker = "\n/* Approved uploaded V2 hero: supplied design with original phone only. */";
const heroFontLink = '        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" />\n';
const uploadedHeroFontLink = '        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" />\n';

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
  it("preserves exact source parity outside the approved hero and established V2-only changes", () => {
    expect(page).toContain('import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions"');
    expect(page).toContain('import "./WeightLossMenopauseV2.css"');
    expect(page).toContain("export default function WeightLossMenopauseV2()");
    expect(page).toContain('const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2"');
    expect(page).toContain('className="wlm-v2-page"');
    expect(page).toContain('className="wlm-v2-content"');
    expect(originalHero).not.toBe("");
    expect(originalHowItWorksSection).not.toBe("");
    expect(originalGlp1CatalogTypeCast).not.toBe("");
    expect(originalMedicationCard).not.toBe("");
    expect(approvedGlp1CatalogTypeCast).not.toBe(originalGlp1CatalogTypeCast);
    expect(approvedMedicationCard).not.toBe(originalMedicationCard);

    const completeNewHero = page.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(completeNewHero).not.toBe("");
    const restoredApprovedCopy = page
      .replace(approvedGlp1PageDisplayType, "")
      .replace(approvedGlp1CatalogTypeCast, originalGlp1CatalogTypeCast)
      .replace(approvedMedicationCard, originalMedicationCard)
      .replace(heroFontLink, "")
      .replace(uploadedHeroFontLink, "")
      .replace(completeNewHero, originalHero)
      .replace(approvedHowItWorksSection + "\n", "")
      .replace('<section className="section wave-top wave-surface wave-flip" id="doctor">', originalHowItWorksSection + '\n<section className="section wave-top wave-surface wave-flip" id="doctor">');
    expect(restoreOriginalNames(restoredApprovedCopy)).toBe(originalPage);

    expect(interaction).toContain("export function initializeWeightLossMenopauseV2(root: HTMLElement): () => void");
    expect(restoreOriginalNames(interaction)).toBe(originalInteraction);

    expect(css).toContain(refinementMarker);
    expect(css).toContain(compactHowItWorksMarker);
    expect(css).toContain(uploadedHeroMarker);
    expect(css.indexOf(refinementMarker)).toBeLessThan(css.indexOf(compactHowItWorksMarker));
    expect(css.indexOf(compactHowItWorksMarker)).toBeLessThan(css.indexOf(uploadedHeroMarker));
    expect(restoreOriginalNames(css.split(refinementMarker)[0])).toBe(originalCss);
  });

  it("uses the complete approved uploaded hero while preserving legacy hero hooks and the external intake CTA", () => {
    const hero = page.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(hero).not.toBe("");
    expect(hero.startsWith('<section className="hero" data-medmethod-scope="">')).toBe(true);
    expect(hero).toContain('<div className="container hero-grid"><div className="hero-copy">');
    expect(hero).toContain(approvedHeroHeadline);
    expect(hero).toContain(approvedHeroSupportingLine);
    expect(hero).toContain('<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>');
    expect(hero).toContain('<span className="hero-cta-timing">5–10 min</span>');
    expect(hero).toContain('<p className="hero-text-note">100% by text message — no video needed.</p>');
    expect(hero).not.toContain('className="hero-offer"');
    expect(hero).not.toContain('className="hero-eyebrow"');
    expect(hero).not.toContain("$49/month");
    expect(hero).not.toContain("100% refunded if not approved.");
    expect(page).toContain("$49/month plus the cost of medication.");
    expect(page).toContain('WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/"');
    expect(interaction).toContain('root.querySelector<HTMLElement>(".hero-actions .btn")');
  });

  it("uses the simpler DM Sans font for only the headline ampersand", () => {
    expect(page.match(/className="hero-ampersand"/g)).toHaveLength(1);
    expect(approvedHeroHeadline).toContain('<span className="hero-ampersand">&amp;</span>');
    expect(css).toContain('.wlm-v2-content .hero[data-medmethod-scope] h1 .hero-ampersand{font-family:"DM Sans",Arial,sans-serif;line-height:0}');
    expect(css.match(/\.hero-ampersand\{/g)).toHaveLength(1);
    expect(css).toContain('font-family:"Playfair Display",Georgia,serif');
    expect(originalPage).not.toContain("hero-ampersand");
    expect(originalCss).not.toContain("hero-ampersand");
  });

  it("uses exactly two large, illustrative chat messages inside the original phone frame", () => {
    const hero = page.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    const chatMessages = Array.from(hero.matchAll(/<div className="chat-message" data-chat-at="(\d+)">/g), match => match[1]);

    expect(hero).toContain('<div className="phone"><div className="phone-screen"><div className="phone-top"><div className="notch"></div></div>');
    expect(hero).toContain('<img className="chat-avatar" src="/manus-storage/wlm-embedded-bfde38427412_0754b2a5.jpg" alt="Dr. Jumana Al-Deek" />');
    expect(hero).toContain(approvedPatientMessage);
    expect(hero).toContain(approvedDoctorMessage);
    expect(chatMessages).toEqual(["400", "2400"]);
    expect(hero.match(/className="bubble(?: me)?"/g)).toHaveLength(2);
    expect(hero).toContain('className="bubble typing-bubble" data-chat-at="1400" data-chat-hide="900" aria-hidden="true"');
    expect(hero).toMatch(/className="chat-date"[^>]*>[^<]*Illustrative conversation[^<]*<\/div>/);
    expect(hero).toContain('className="chat-composer" aria-hidden="true"');
    expect(hero).toContain("Type a message...");
    expect(hero).not.toMatch(/👩🏻‍⚕️|mmd-(?:phone|screen|avatar|send)|<input\b|<textarea\b|<form\b|<button\b|on(?:Click|Submit|KeyDown)=/);
    expect(hero).toContain('<div className="hipaa-badge"><svg width="24" height="24"');
    expect(hero).toContain("HIPAA-compliant • secure text");
  });

  it("keeps the original How it works design font and adds page-owned uploaded-hero fonts only", () => {
    const head = page.slice(page.indexOf("<Helmet>"), page.indexOf("</Helmet>"));
    expect(head).toContain(heroFontLink.trim());
    expect(head).toContain(uploadedHeroFontLink.trim());
    expect((head.match(/DM\+Serif\+Display/g) ?? [])).toHaveLength(1);
    expect((head.match(/DM\+Sans/g) ?? [])).toHaveLength(1);
    expect((head.match(/Playfair\+Display/g) ?? [])).toHaveLength(1);
    expect(originalPage).not.toContain("DM Serif Display");
    expect(originalCss).not.toContain("DM Serif Display");
  });

  it("appends only the supplied design's scoped hero styles after the historical How it works CSS", () => {
    expect(css.match(/\/\* Approved uploaded V2 hero: supplied design with original phone only\. \*\//g)).toHaveLength(1);
    const appendedHeroCss = css.slice(css.indexOf(uploadedHeroMarker) + uploadedHeroMarker.length).trim();
    const normalizedCss = appendedHeroCss.replace(/\s+/g, "");
    const selectors = Array.from(appendedHeroCss.matchAll(/(?:^|[{}])\s*(?!@)([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));

    expect(normalizedCss).toMatch(/\.wlm-v2-content\.hero\[data-medmethod-scope\]\{[^}]*background:#fff[^}]*color:#101523/);
    expect(normalizedCss).toMatch(/\.wlm-v2-content\.hero\[data-medmethod-scope\]h1\{[^}]*font-family:"PlayfairDisplay",Georgia,serif[^}]*font-weight:700/);
    expect(normalizedCss).toContain('font-family:"DMSans",Arial,sans-serif');
    expect(normalizedCss).toMatch(/\.hero-freeem\{[^}]*background-image:linear-gradient\(105deg,#fa2c99,#91238f\)/);
    expect(normalizedCss).toContain("background:#eea4d2");
    expect(normalizedCss).toMatch(/\.hero-actions\.btn\{[^}]*background:linear-gradient\(105deg,#f42b9a,#84218c\)/);
    expect(normalizedCss).toMatch(/\.phone\{[^}]*width:min\(310px,100%\)/);
    expect(normalizedCss).toMatch(/\.phone-screen\{[^}]*height:580px[^}]*background:#fff/);
    expect(normalizedCss).toMatch(/\.bubble\{[^}]*font-size:18px/);
    expect(selectors.length).toBeGreaterThan(8);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-content \.hero\[data-medmethod-scope\](?:$|[\s.:#>])/);
    expect(appendedHeroCss).not.toMatch(/(?:^|[;{])\s*--[\w-]+\s*:/);
    expect(appendedHeroCss).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\b/);
    expect(appendedHeroCss).not.toMatch(/(^|[}\n])\s*\.wlm-v2-content(?! \.hero\[data-medmethod-scope\])/);
  });

  it("retains the earlier V2 hero and How it works CSS as historic rules, ending the latter at the uploaded-hero marker", () => {
    const historicCss = css.slice(0, css.indexOf(uploadedHeroMarker));
    const compactHowItWorksCss = css.slice(css.indexOf(compactHowItWorksMarker) + compactHowItWorksMarker.length, css.indexOf(uploadedHeroMarker));

    expect(historicCss).toContain(refinementMarker);
    expect(historicCss).toContain(compactHowItWorksMarker);
    expect(compactHowItWorksCss).toContain('.wlm-v2-content #how-it-works{padding:36px 0}');
    expect(compactHowItWorksCss).toContain('font-family:"DM Serif Display",Georgia,serif');
    expect(compactHowItWorksCss).not.toContain(uploadedHeroMarker.trim());
    expect(restoreOriginalNames(historicCss.split(refinementMarker)[0])).toBe(originalCss);
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
    const compactHowItWorksCss = css.slice(css.indexOf(compactHowItWorksMarker) + compactHowItWorksMarker.length, css.indexOf(uploadedHeroMarker));
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
    expect(pageMedicationCard).toContain('const price = display?.price.replace(" — fixed price", " — same price at every dose") ?? treatment.price;');
    expect(pageMedicationCard).toContain("const supply = display ? display.supply : treatment.supply;");
    expect(pageMedicationCard).toContain('<dl className="medication-specs">{display.specs.map(spec => <div key={spec.label} style={{ display: "contents" }}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>');
    expect(pageMedicationCard).toContain('<dl className="medication-specs">{treatment.frequency ? <><dt>Frequency</dt><dd>{treatment.frequency}</dd></> : null}{treatment.form ? <><dt>Form</dt><dd>{treatment.form}</dd></> : null}</dl>');
    expect(pageMedicationCard).toContain('<p className="medication-note">{treatment.note}</p>');
  });

  it("changes only the two V2 fixed-price labels, without altering shared prices or dose-based ranges", () => {
    const displays = treatmentCatalog.glp1.pageDisplays.weightLossIntake;
    const renderedPrices = Object.fromEntries(Object.entries(displays).map(([id, display]) => [id, display.price.replace(" — fixed price", " — same price at every dose")]));
    expect(renderedPrices).toEqual({
      compounded_semaglutide: "$129/month — same price at every dose",
      compounded_tirzepatide: "$149 to $299/month",
      compounded_liraglutide: "$115",
      wegovy_direct_novocare: "$349/month — same price at every dose",
      wegovy_pill_direct_novocare: "$149 to $299/month",
      zepbound_kwikpen_direct_lillydirect: "$299 to $449/month",
      foundayo_pill_direct_lillydirect: "$149 to $299/month",
    });
    expect(Object.keys(renderedPrices).filter(id => renderedPrices[id] !== displays[id].price)).toEqual(["compounded_semaglutide", "wegovy_direct_novocare"]);
    expect(displays).toEqual(approvedGlp1DisplayMap);
    expect(page.match(/same price at every dose/g)).toHaveLength(1);
    expect(originalPage).not.toContain("same price at every dose");
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
