import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateCrawlerHtml, getMetaForPath, injectRouteMetaIntoHtml } from "./crawlerMiddleware";

const read = (file: string) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8");
const root = resolve(import.meta.dirname, "..");
const approvedHeroSupportingLineBaseline = "9b081b83";
const boldOnlyHeroSupportingLineBaseline = "01fc6439";
const currentBaseline = "d587bc75";
const v2PagePath = "client/src/pages/WeightLossMenopauseV2.tsx";
const v2CssPath = "client/src/pages/WeightLossMenopauseV2.css";
const v2DoctorBioPath = "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx";
const originalPage = read("client/src/pages/WeightLossMenopause.tsx");
const originalCss = read("client/src/pages/WeightLossMenopause.css");
const originalInteraction = read("client/src/pages/weightLossMenopauseInteractions.ts");
const page = read("client/src/pages/WeightLossMenopauseV2.tsx");
const css = read("client/src/pages/WeightLossMenopauseV2.css");
const doctorBio = read(v2DoctorBioPath);
const homepageMedicalTeam = read("client/src/components/home1/MedicalTeam.tsx");
const home1Navbar = read("client/src/components/home1/Navbar.tsx");
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

const approvedHeroHeadline = '<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>First visit FREE!</em></span></h1>';
const previousHeroSupportingLine = '<p className="hero-description">Explore your options for<br /><strong>GLP-1s, menopause &amp; hormone therapy.</strong></p>';
const previousApprovedHeroSupportingLine = '<p className="hero-description"><strong>GLP-1s, menopause &amp; hormone therapy.</strong><br />Done right for you. 100% virtual</p>';
const approvedHeroSupportingLine = '<p className="hero-description"><strong>GLP-1s, menopause &amp; hormone therapy.</strong><br /><b>Done right for you. 100% virtual</b></p>';
const approvedPatientMessage = '<div className="chat-message" data-chat-at="400"><div className="bubble me">Hi Dr. Al-Deek,<br />I\'d like to learn about my options for weight loss and hormones.</div><div className="chat-time patient-time">9:41 AM</div></div>';
const approvedDoctorMessage = '<div className="chat-message" data-chat-at="2400"><div className="bubble">Of course! I\'m happy to help. Let\'s discuss your goals and see what options may be right for you.</div><div className="chat-time">9:42 AM</div></div>';
const previousApprovedHowItWorksSection = '<section className="section wave-top wave-soft" id="how-it-works"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps"><article className="step"><div className="step-num">1</div><h3>Complete your intake (5–10 min)</h3></article><article className="step"><div className="step-num">2</div><h3>Text with your doctor</h3></article><article className="step"><div className="step-num">3</div><h3>Discuss your options with your doctor, based on your evaluation.</h3></article></div></div></section>';
const approvedHowItWorksSection = '<section className="section wave-top wave-soft" id="how-it-works"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps"><article className="step"><div className="step-num">1</div><h3>Complete your intake (5–10 min)</h3></article><article className="step"><div className="step-num">2</div><h3>Receive your doctor’s assessment by text</h3></article><article className="step"><div className="step-num">3</div><h3>Get seven days of follow-up support</h3></article></div></div></section>';
const originalHero = originalPage.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalFeaturedInSection = originalPage.match(/<section className="featured-in"[\s\S]*?<\/section>/)?.[0] ?? "";
const originalHowItWorksSection = originalPage.match(/<section className="section wave-top wave-soft" id="how-it-works">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalDoctorSection = originalPage.match(/<section className="section wave-top wave-surface wave-flip" id="doctor">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalAppSection = originalPage.match(/<section className="section everything wave-top wave-soft" id="app">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalSupportSection = originalPage.match(/<section className="section support-section wave-top wave-surface wave-flip">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalPricingSection = originalPage.match(/<section className="section pricing-section wave-top wave-soft" id="pricing">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalTestimonialsSection = originalPage.match(/<section className="section testimonials wave-top wave-band wave-flip" id="testimonials">[\s\S]*?<\/section>/)?.[0] ?? "";
const originalFaqSection = originalPage.match(/<section className="section wave-top wave-surface" id="faq">[\s\S]*?<\/section>/)?.[0] ?? "";
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
const doctorBioMarker = "\n/* Approved V2 homepage-style doctor biography: doctor section only. */";
const mobileBarMarker = "\n/* Approved V2 three-option mobile bar: content clearance only. */";
const mobileHeaderMarker = "\n/* Approved V2 mobile header: centered original wordmark without tagline only. */";
const visitBasedCareMarker = "\n/* Approved V2 visit-based care: app removed, clinical content only. */";
const pricingOfferCardMarker = "\n/* Approved V2 pricing offer card: pricing section only. */";
const combinedProcessPricingMarker = "\n/* V2 combined process and visit pricing */";
const firstTextVisitNoteMarker = "/* V2 first text visit note — pricing helper only. */";
const heroFontMatchMarker = "/* V2 hero headline — homepage font match only. */";
const heroFontLink = '        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" />\n';
const uploadedHeroFontLink = '        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" />\n';
const approvedDoctorCredentials = ["Family Physician", "Menopause Specialist", "Author"];
const approvedDoctorFocusAreas = [
  "Medical Weight Loss",
  "Menopause & Perimenopause",
  "GLP-1 & Metabolic Therapy",
  "Hormone Optimization",
  "Thyroid Specialist",
  "Metabolism",
];
const approvedDoctorTraining = [
  ["West Virginia School of Osteopathic Medicine", "Doctor of Osteopathic Medicine"],
  ["AdventHealth Winter Park", "Family Medicine Residency"],
  ["Georgetown University", "Graduate Training, Physiology & Biophysics"],
  ["The Menopause Society", "Advanced Menopause Training"],
  ["Obesity Medicine Association", "Obesity & Metabolic Health Certification"],
] as const;
const approvedDoctorBioCopy = [
  "The prescription is only the beginning. Hormone and weight-loss treatments aren’t one-size-fits-all. Whether you’re considering treatment or already taking medication, Dr. Al-Deek reviews your symptoms, health history, current medications, response to treatment, and goals to create—or optimize—a plan built around you.",
  "Dr. Al-Deek is a board-certified physician, menopause specialist, and author of",
  "Long before medical school, Dr. Al-Deek was a certified personal trainer working exclusively with women struggling through hormonal weight gain. She spent years watching the same story repeat — women doing everything “right” but losing the battle against their own biology.",
  "That experience drove her to medicine so she could better understand the health concerns women bring to care. Today, as a physician and a mom of four, she combines clinical expertise with a personal understanding of what midlife women are going through.",
  "Her clinical background includes outpatient family medicine, obesity medicine, preventive care, chronic disease management, and women's health.",
  "She completed her Family Medicine residency at AdventHealth Winter Park after earning her Doctor of Osteopathic Medicine degree from West Virginia School of Osteopathic Medicine.",
  "She also holds graduate training in physiology and biophysics from Georgetown University.",
  "Dr. Al-Deek has completed advanced menopause training through The Menopause Society as well as additional training in obesity medicine and metabolic health.",
];
const freeCareCopyReplacements: ReadonlyArray<readonly [v2Copy: string, originalCopy: string]> = [
  ["Free doctor evaluation by text. Medication priced separately.", "$49/month plus the cost of medication."],
  ["<h2>Free doctor evaluation by text.</h2>", "<h2>$49 today. $49 monthly.</h2>"],
  ["Connect with your doctor by text for free. Medication priced separately.", "One membership: physician-led care, direct texting with Dr. Al-Deek — plus a free bonus: the fitness + nutrition app."],
  ['aria-label="Free text-care pricing"', 'aria-label="Membership pricing"'],
  ["<strong>FREE</strong><span>Doctor evaluation and care by text.</span>", '<strong>$49/month</strong><span>First month due today · then monthly · cancel anytime.</span><p className="video-addon">Want face time? Add a video visit for $30.</p>'],
  ["Patient perspectives", "Member perspectives"],
  ["Medication is priced separately and shown up front before purchase. Cost may vary by medication and dose. Your doctor evaluation and text care are free.", "Medication is priced separately and shown up front before purchase. Cost may vary by medication and dose. The clinical membership fee does not include medication."],
  ["The app includes MMD’s fitness and nutrition tools", "Membership includes MMD’s fitness and nutrition app"],
  ["<details><summary>Is doctor evaluation by text free?</summary><p>Yes. Doctor evaluation and care by text are free. Medication is priced separately. A prescription is issued only when clinically appropriate.</p></details>", "<details><summary>When is the $49 consultation refunded?</summary><p>The proposed policy is to refund the consultation when the clinician determines no prescription is appropriate after review. Final terms, timing, and exclusions are TBD.</p></details>"],
  ['<span className="sticky-cta-price">FREE<small> text care</small></span>', '<span className="sticky-cta-price">$49<small>/mo</small></span>'],
  ['aria-label="Start your free doctor evaluation by text"', 'aria-label="Start your visit — $49 per month membership"'],
];

const approvedZoomOffer = '<p className="video-addon">Prefer face-to-face care?<br />Add a virtual Zoom visit — <b>only $39 per visit.</b></p>';
const approvedZoomFaq = '<details><summary>Can I add a virtual Zoom visit?</summary><p>Yes. You can add an optional virtual Zoom visit for $39 per visit. Doctor evaluation and text care remain free. Medication is priced separately.</p></details>';
const legacyStickyCta = '<div className="sticky-cta" aria-hidden="true"><span className="sticky-cta-price">FREE<small> text care</small></span><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL} aria-label="Start your free doctor evaluation by text">Start your visit <span className="arrow">→</span></a></div>';
const legacyFirstTextVisitRow = '<div><dt>First text visit</dt><dd>FREE</dd></div>';
const approvedFirstTextVisitRow = '<div><dt>First text visit<small className="first-text-visit-note">Includes 7 days of follow-up messaging.</small></dt><dd>FREE</dd></div>';
const firstTextVisitNoteSelector = ".wlm-v2-content #how-it-works .process-pricing-rates .first-text-visit-note";
const firstTextVisitAlignmentSelector = ".wlm-v2-content #how-it-works .process-pricing-rates > div:first-child";
const approvedFirstTextVisitNoteCss = `${firstTextVisitNoteSelector} {
  display: block;
  margin-top: 4px;
  color: #63516b;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
}
${firstTextVisitAlignmentSelector} {
  align-items: start;
}`;
const approvedCombinedProcessPricingSection = `<section className="section process-pricing-section" id="how-it-works" aria-labelledby="process-pricing-title">
  <div className="container process-pricing-layout">
    <div className="process-pricing-intro">
      <span className="section-kicker">How it works</span>
      <h2 id="process-pricing-title"><span>Your doctor.</span><span>One text away.</span></h2>
      <p className="process-pricing-lead">Start with a 5–10 minute intake.</p>
      <ol className="process-pricing-steps">
        <li><span className="process-step-number" aria-hidden="true">1</span><div><h3>Fill out your intake</h3><p>Tell us about your health and goals.</p></div></li>
        <li><span className="process-step-number" aria-hidden="true">2</span><div><h3>Text with your doctor</h3><p>Your doctor reviews your intake, then discusses your options with you.</p></div></li>
        <li><span className="process-step-number" aria-hidden="true">3</span><div><h3>Make a plan together</h3><p>Agree on the next steps that are right for you.</p></div></li>
      </ol>
    </div>
    <div className="process-pricing-offer" id="pricing" aria-labelledby="visit-pricing-title">
      <div className="process-pricing-card">
        <h3 id="visit-pricing-title">Simple, pay-per-visit care</h3>
        <dl className="process-pricing-rates">
          ${approvedFirstTextVisitRow}
          <div><dt>Additional text visits</dt><dd>$29 <span>each</span></dd></div>
          <div><dt>Video visit</dt><dd>$97</dd></div>
        </dl>
        <div className="process-pricing-followup">
          <span className="process-followup-icon" aria-hidden="true">✓</span>
          <div><strong>7 days of follow-up messaging</strong><p>Included with every visit—even your free first visit.</p></div>
        </div>
        <p className="process-medication-note">Medication costs extra, if prescribed.</p>
      </div>
      <a className="btn process-pricing-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start Your Free Text Visit <span className="arrow" aria-hidden="true">→</span></a>
      <p className="process-intake-note">Intake first. Then text your doctor.</p>
      <p className="process-pricing-terms">Prescriptions only when medically appropriate. Follow-up covers that visit’s assessment and care plan. New concerns or additional treatments require a separate visit.</p>
      <p className="process-no-membership">No membership or long-term commitment.</p>
    </div>
  </div>
</section>`;
const approvedFirstVisitSupportCard = '<article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 3h10v4H7zM5 7h14v14H5z"></path><path d="M9 12h6M12 9v6"></path></svg><h3>Your care plan, explained</h3><p>Ask questions about the recommendations from your visit. New concerns or additional treatments require a separate visit.</p></article>';
const approvedSevenDaySupportCard = '<article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"></path></svg><h3>Seven days of follow-up</h3><p>Messaging support for the assessment and care plan from your visit—not a new assessment for unrelated concerns.</p></article>';

function applyFreeCareCopy(source: string): string {
  return freeCareCopyReplacements.reduce(
    (approved, [v2Copy, originalCopy]) => approved.replace(originalCopy, v2Copy),
    source,
  );
}

function requiredDetails(source: string, summary: string): string {
  const literalSummary = summary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const details = source.match(new RegExp(`<details><summary>${literalSummary}</summary>[\\s\\S]*?</details>`))?.[0] ?? "";
  if (!details) throw new Error(`Missing required FAQ detail: ${summary}`);
  return details;
}

const previousApprovedPricingSection = applyFreeCareCopy(originalPricingSection)
  .replace('<strong>FREE</strong><span>Doctor evaluation and care by text.</span>', '<strong>FREE</strong><span>Doctor evaluation and care by text.</span>' + approvedZoomOffer);
const previousFreeBonusBannerStart = previousApprovedPricingSection.indexOf('<div className="bonus-banner">');
const previousMembershipPriceStart = previousApprovedPricingSection.indexOf('<div className="membership-price"');
const previousFreeBonusBanner = previousFreeBonusBannerStart >= 0 && previousMembershipPriceStart > previousFreeBonusBannerStart
  ? previousApprovedPricingSection.slice(previousFreeBonusBannerStart, previousMembershipPriceStart)
  : "";
const approvedFirstVisitPricingSection = previousApprovedPricingSection
  .replace('<h2>Free doctor evaluation by text.</h2>', '<h2>Your first text visit is free.</h2>')
  .replace('<p>Connect with your doctor by text for free. Medication priced separately.</p>', '<p>A doctor’s assessment, a care plan, and seven days of follow-up messaging.</p>')
  .replace(previousFreeBonusBanner, "")
  .replace('aria-label="Free text-care pricing"', 'aria-label="First text-visit pricing"')
  .replace('<strong>FREE</strong><span>Doctor evaluation and care by text.</span>', '<strong>FREE</strong><span>Your first doctor text visit.</span>')
  .replace(approvedZoomOffer, '<p className="video-addon">Prefer face-to-face care?<br />Add a virtual Zoom visit — <b>only $39 per visit.</b><br />Includes seven days of follow-up messaging.</p>')
  .replace('>Start your visit <span className="arrow">→</span></a></div><p className="price-footnote">Medication priced separately</p>', '>Start your free visit <span className="arrow">→</span></a></div><p className="visit-support-scope">Follow-up messaging supports the care plan from that visit. New concerns or additional treatments require a separate visit.</p><p className="price-footnote">Medication priced separately. No membership or long-term commitment.</p>');
const approvedPricingOfferCard = `<section className="section pricing-section wave-top wave-soft" id="pricing">
  <div className="container">
    <div className="section-heading">
      <span className="section-kicker">Straightforward pricing</span>
      <h2>Your first text visit is free.</h2>
    </div>
    <div className="visit-pricing-card">
      <div className="visit-pricing-grid">
        <div className="visit-pricing-main">
          <div className="membership-price" aria-label="First text-visit pricing">
            <span>Your first doctor text visit.</span>
            <strong>FREE</strong>
          </div>
          <ul className="visit-pricing-benefits" aria-label="Included in your first text visit">
            <li>A doctor’s assessment</li>
            <li>A care plan</li>
            <li>Seven days of follow-up messaging</li>
          </ul>
        </div>
        <aside className="visit-pricing-addon" aria-label="Optional virtual Zoom visit">
          <span className="visit-pricing-addon-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="12" height="14" rx="3" /><path d="m15 10 6-4v12l-6-4" /></svg></span>
          <h3>Prefer face-to-face care?</h3>
          <p className="video-addon">Add a virtual Zoom visit — <b>only $39 per visit.</b></p>
          <p className="visit-pricing-addon-support">Includes seven days of follow-up messaging.</p>
        </aside>
      </div>
      <div className="pricing-actions">
        <a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your free visit <span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <div className="visit-pricing-notes">
        <p className="visit-support-scope">Follow-up messaging supports the care plan from that visit. New concerns or additional treatments require a separate visit.</p>
        <p className="price-footnote">Medication priced separately. No membership or long-term commitment.</p>
      </div>
    </div>
  </div>
</section>`;

const previousApprovedFaqSection = applyFreeCareCopy(originalFaqSection)
  .replace('<details><summary>Which states are available?</summary>', `${approvedZoomFaq}<details><summary>Which states are available?</summary>`);
const previousFaqMedication = requiredDetails(previousApprovedFaqSection, "How much does medication cost?");
const previousAppFaq = requiredDetails(previousApprovedFaqSection, "What is included in the fitness + nutrition app?");
const previousZoomFaq = requiredDetails(previousApprovedFaqSection, "Can I add a virtual Zoom visit?");
const previousFreeFaq = requiredDetails(previousApprovedFaqSection, "Is doctor evaluation by text free?");
const approvedFirstVisitFaqSection = previousApprovedFaqSection
  .replace(previousFaqMedication, '<details><summary>How much does medication cost?</summary><p>Medication is priced separately and shown up front before purchase. Cost may vary by medication and dose. Your first doctor text visit is free and includes seven days of follow-up messaging about that visit’s care plan.</p></details>')
  .replace(previousAppFaq, "")
  .replace(previousZoomFaq, '<details><summary>Can I add a virtual Zoom visit?</summary><p>Yes. An optional virtual Zoom visit is $39 per visit and includes seven days of follow-up messaging about its care plan. Your first doctor text visit is free. Medication is priced separately.</p></details>')
  .replace(previousFreeFaq, '<details><summary>What does my free first text visit include?</summary><p>Your first visit includes a doctor’s assessment, a recommended care plan, and seven days of follow-up messaging about that assessment. Medication is priced separately. A prescription is issued only when clinically appropriate.</p></details><details><summary>What does seven-day follow-up cover?</summary><p>Questions and clarification about the assessment and care plan from that visit. It does not include opening a new concern or starting an additional treatment. For example, a separate hormone-therapy assessment after a weight-loss visit requires another visit.</p></details><details><summary>When do I need another visit?</summary><p>A new concern, an additional treatment, or a new assessment beyond your follow-up window requires a separate visit. Follow-up messages within your visit’s seven-day support window are included. Any new visit fee will be explained before you proceed.</p></details>');
const approved97ZoomFaq = "Yes. A virtual Zoom visit is $97 and includes seven days of follow-up messaging about its care plan. Your first doctor text visit is free. Additional text visits are $29 each. Medication is priced separately.";
const approved29AdditionalTextFaq = "A new concern, an additional treatment, or a new assessment beyond your follow-up window requires a separate visit. Additional text visits are $29 each. Follow-up messages within your visit’s seven-day support window are included.";
const previousZoomFaqCopy = "Yes. An optional virtual Zoom visit is $39 per visit and includes seven days of follow-up messaging about its care plan. Your first doctor text visit is free. Medication is priced separately.";
const previousAdditionalVisitFaqCopy = "A new concern, an additional treatment, or a new assessment beyond your follow-up window requires a separate visit. Follow-up messages within your visit’s seven-day support window are included. Any new visit fee will be explained before you proceed.";
const finalFaqComponentImport = 'import WeightLossMenopauseV2Faq from "./WeightLossMenopauseV2Faq";\n';
const finalFaqDataImport = 'import { V2_FAQ_FOOTER_PARAGRAPHS, V2_FAQ_COPYRIGHT } from "./WeightLossMenopauseV2FaqData";\n';
const finalFaqMount = '<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
const preFinalFaqFooterDisclosures = `<div className="disclosures">
              <p><strong>Prototype disclosure:</strong> state availability, refund terms, and other operational details marked TBD must be confirmed before launch.</p>
              <p>Compounded medications are not FDA-approved. A prescription is never guaranteed and is issued only when a licensed clinician determines treatment is appropriate. Individual results vary. Weight-loss medication carries risks and may not be appropriate for everyone.</p>
              <p>For adults age 18 and older. Services are available only in states where the treating clinician is licensed; final state availability list is TBD. This website does not provide emergency care.</p>
            </div>`;
const preFinalFaqFooterCopyright = '<span className="footer-legal-copy">© 2026 MMD Weight Loss. Working title and prototype content.</span>';

const originalSupportCards = Array.from(originalSupportSection.matchAll(/<article className="feature-item">[\s\S]*?<\/article>/g), match => match[0]);
const approvedFirstVisitSupportSection = originalSupportSection
  .replace('<h2>The support around the medication matters.</h2>', '<h2>A doctor’s assessment. A clear care plan.</h2>')
  .replace('<p>Your program brings clinical guidance and practical tools together, without forcing you to stitch them together yourself.</p>', '<p>Every visit includes seven days of follow-up messaging to support its recommendations.</p>')
  .replace(`<div className="feature-grid">${originalSupportCards.join("")}</div>`, `<div className="feature-grid">${originalSupportCards[0]}${approvedFirstVisitSupportCard}${approvedSevenDaySupportCard}</div>`);
const previousApprovedTestimonialsSection = applyFreeCareCopy(originalTestimonialsSection);
const previousApprovedTestimonialCards = Array.from(previousApprovedTestimonialsSection.matchAll(/<article className="testimonial-card">[\s\S]*?<\/article>/g), match => match[0]);
const previousAppSarahTestimonial = previousApprovedTestimonialCards.find(card => card.includes('<footer>Sarah, 32</footer>')) ?? "";
const previousAppRaniaTestimonial = previousApprovedTestimonialCards.find(card => card.includes('<footer>Rania, 50</footer>')) ?? "";
const approvedFirstVisitTestimonialsSection = previousApprovedTestimonialsSection
  .replace(previousAppSarahTestimonial, "")
  .replace(previousAppRaniaTestimonial, "");

function restoreFirstVisitScope(source: string): string {
  return source
    .replace('  { label: "How it works", anchor: "how-it-works" },\n  { label: "Pricing", anchor: "pricing" },', '  { label: "How it works", anchor: "how-it-works" },\n  { label: "The app", anchor: "app" },\n  { label: "Pricing", anchor: "pricing" },')
    .replace('<em>First visit FREE!</em>', '<em>For FREE!</em>')
    .replace(`${approvedCombinedProcessPricingSection}\n${originalFeaturedInSection}`, originalFeaturedInSection)
    .replace("<WeightLossMenopauseV2DoctorBio />", `${approvedHowItWorksSection}\n<WeightLossMenopauseV2DoctorBio />`)
    .replace('<span>Your first doctor text visit is free. Medication priced separately.</span>', '<span>Free doctor evaluation by text. Medication priced separately.</span>')
    .replace(`<WeightLossMenopauseV2DoctorBio />\n\n${approvedFirstVisitSupportSection}`, `<WeightLossMenopauseV2DoctorBio />\n${originalAppSection}\n${originalSupportSection}`)
    .replace(approvedFirstVisitTestimonialsSection, `${previousApprovedPricingSection}\n${previousApprovedTestimonialsSection}`)
    .replace(approved97ZoomFaq, previousZoomFaqCopy)
    .replace(approved29AdditionalTextFaq, previousAdditionalVisitFaqCopy)
    .replace(approvedFirstVisitFaqSection, previousApprovedFaqSection)
    .replace('Physician-guided weight-loss and hormone care, with seven days of follow-up support for each visit.', 'Physician-guided GLP-1 care with fitness, nutrition, and ongoing support in one program.')
    .replace('                  <a href="#how-it-works">How it works</a>\n                  <a href="#pricing">Pricing</a>', '                  <a href="#how-it-works">How it works</a>\n                  <a href="#app">The app</a>\n                  <a href="#pricing">Pricing</a>')
    .replace('state availability, refund terms, and other operational details', 'state availability, app details, refund terms, and other operational details')
    .replace('              <a href="/hipaa-notice">HIPAA Notice</a>\n              <a href="/shipping-policy">Shipping</a>', '              <a href="/hipaa-notice">HIPAA Notice</a>\n              <a href="/subscription-policy">Subscription &amp; Refunds</a>\n              <a href="/shipping-policy">Shipping</a>')
    .replaceAll('Start your free visit', 'Start your visit');
}

function normalizeFinalFaq(source: string): string {
  const finalDisclosures = source.match(/<div className="disclosures">[\s\S]*?<\/div>/)?.[0] ?? "";
  const finalCopyright = source.match(/<span className="footer-legal-copy">[\s\S]*?<\/span>/)?.[0] ?? "";
  const preFinalFaq = atCurrentBaseline(v2PagePath).match(/<section className="section wave-top wave-surface" id="faq">[\s\S]*?<\/section>/)?.[0] ?? "";
  if (!finalDisclosures || !finalCopyright) throw new Error("Missing final FAQ footer replacement");
  if (!preFinalFaq) throw new Error("Missing pinned pre-final FAQ section");
  return source
    .replace(finalFaqComponentImport, "")
    .replace(finalFaqDataImport, "")
    .replace(finalFaqMount, preFinalFaq)
    .replace(finalDisclosures, preFinalFaqFooterDisclosures)
    .replace(finalCopyright, preFinalFaqFooterCopyright);
}

function normalizeApprovedMobileBar(source: string): string {
  return source
    .replace(
      'import WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";\nimport WeightLossMenopauseV2MobileBar from "./WeightLossMenopauseV2MobileBar";\n',
      'import WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";\n',
    )
    .replace(
      '      </div>\n      <WeightLossMenopauseV2MobileBar />\n    </div>',
      `        ${legacyStickyCta}\n      </div>\n    </div>`,
    );
}

function restoreFreeCareCopy(source: string): string {
  return freeCareCopyReplacements.reduce(
    (restored, [v2Copy, originalCopy]) => restored.replace(v2Copy, originalCopy),
    source.replace(approvedZoomOffer, "").replace(approvedZoomFaq, ""),
  );
}

function restoreOriginalNames(source: string): string {
  return source
    .replaceAll("WeightLossMenopauseV2", "WeightLossMenopause")
    .replaceAll("weightLossMenopauseV2Interactions", "weightLossMenopauseInteractions")
    .replaceAll("weight-loss-menopauseV2", "weight-loss-menopause")
    .replaceAll("wlm-v2-page", "wlm-page")
    .replaceAll("wlm-v2-content", "wlm-content")
    .replaceAll("wlm-v2-", "wlm-");
}

function atApprovedHeroSupportingLineBaseline(file: string): string {
  return execFileSync("git", ["show", `${approvedHeroSupportingLineBaseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function atBoldOnlyHeroSupportingLineBaseline(file: string): string {
  return execFileSync("git", ["show", `${boldOnlyHeroSupportingLineBaseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function atFirstTextVisitNoteBaseline(file: string): string {
  return execFileSync("git", ["show", `ac46db89:${file}`], { cwd: root, encoding: "utf8" });
}

function atCurrentBaseline(file: string): string {
  return execFileSync("git", ["show", `${currentBaseline}:${file}`], { cwd: root, encoding: "utf8" });
}

function normalizeApprovedHeroSupportingLine(source: string): string {
  return source.replace(approvedHeroSupportingLine, previousApprovedHeroSupportingLine);
}

function normalizeApprovedFirstTextVisitNote(source: string): string {
  return source.replace(approvedFirstTextVisitRow, legacyFirstTextVisitRow);
}

function normalizeV2DoctorBioCredential(source: string): string {
  return source.replace('"Family Physician"', '"Board-Certified DO"');
}

function countExactOccurrences(source: string, value: string): number {
  return source.split(value).length - 1;
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
    expect(originalFeaturedInSection).not.toBe("");
    expect(originalHowItWorksSection).not.toBe("");
    expect(originalDoctorSection).not.toBe("");
    expect(originalGlp1CatalogTypeCast).not.toBe("");
    expect(originalMedicationCard).not.toBe("");
    expect(approvedGlp1CatalogTypeCast).not.toBe(originalGlp1CatalogTypeCast);
    expect(approvedMedicationCard).not.toBe(originalMedicationCard);

    expect(originalAppSection).not.toBe("");
    expect(originalSupportSection).not.toBe("");
    expect(originalPricingSection).not.toBe("");
    expect(originalTestimonialsSection).not.toBe("");
    expect(originalFaqSection).not.toBe("");

    const completeNewHero = page.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(completeNewHero).not.toBe("");
    const restoredFirstVisitCopy = restoreFirstVisitScope(normalizeFinalFaq(page));
    const previousApprovedHero = restoredFirstVisitCopy.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(previousApprovedHero).not.toBe("");
    const restoredApprovedCopy = restoreFreeCareCopy(normalizeApprovedMobileBar(restoredFirstVisitCopy))
      .replace('import WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";\n', "")
      .replace("<WeightLossMenopauseV2DoctorBio />", originalDoctorSection)
      .replace(approvedGlp1PageDisplayType, "")
      .replace(approvedGlp1CatalogTypeCast, originalGlp1CatalogTypeCast)
      .replace(approvedMedicationCard, originalMedicationCard)
      .replace(heroFontLink, "")
      .replace(uploadedHeroFontLink, "")
      .replace(previousApprovedHero, originalHero)
      .replace(approvedHowItWorksSection + "\n", "")
      .replace(originalDoctorSection, originalHowItWorksSection + "\n" + originalDoctorSection);
    expect(restoreOriginalNames(restoredApprovedCopy)).toBe(originalPage);

    expect(interaction).toContain("export function initializeWeightLossMenopauseV2(root: HTMLElement): () => void");
    expect(restoreOriginalNames(interaction)).toBe(originalInteraction);

    expect(css).toContain(refinementMarker);
    expect(css).toContain(compactHowItWorksMarker);
    expect(css).toContain(uploadedHeroMarker);
    expect(css).toContain(doctorBioMarker);
    expect(css).toContain(mobileBarMarker);
    expect(css).toContain(mobileHeaderMarker);
    expect(css).toContain(visitBasedCareMarker);
    expect(css).toContain(pricingOfferCardMarker);
    expect(css).toContain(combinedProcessPricingMarker);
    expect(css.indexOf(refinementMarker)).toBeLessThan(css.indexOf(compactHowItWorksMarker));
    expect(css.indexOf(compactHowItWorksMarker)).toBeLessThan(css.indexOf(uploadedHeroMarker));
    expect(css.indexOf(uploadedHeroMarker)).toBeLessThan(css.indexOf(doctorBioMarker));
    expect(css.indexOf(doctorBioMarker)).toBeLessThan(css.indexOf(mobileBarMarker));
    expect(css.indexOf(mobileBarMarker)).toBeLessThan(css.indexOf(mobileHeaderMarker));
    expect(css.indexOf(mobileHeaderMarker)).toBeLessThan(css.indexOf(visitBasedCareMarker));
    expect(css.indexOf(visitBasedCareMarker)).toBeLessThan(css.indexOf(pricingOfferCardMarker));
    expect(css.indexOf(pricingOfferCardMarker)).toBeLessThan(css.indexOf(combinedProcessPricingMarker));
    expect(restoreOriginalNames(css.split(refinementMarker)[0])).toBe(originalCss);
  });

  it("allows only the approved bold hero supporting-line wrapper against the pinned pages and CSS", () => {
    expect(countExactOccurrences(page, approvedHeroSupportingLine)).toBe(1);
    expect(countExactOccurrences(page, previousApprovedHeroSupportingLine)).toBe(0);
    expect(countExactOccurrences(page, previousHeroSupportingLine)).toBe(0);
    const restoredBoldOnlyPage = normalizeApprovedHeroSupportingLine(normalizeApprovedFirstTextVisitNote(normalizeFinalFaq(page)));
    expect(restoredBoldOnlyPage).toBe(atBoldOnlyHeroSupportingLineBaseline(v2PagePath));
    expect(css.slice(0, css.indexOf(firstTextVisitNoteMarker))).toBe(atBoldOnlyHeroSupportingLineBaseline(v2CssPath));
    expect(restoredBoldOnlyPage.replace(previousApprovedHeroSupportingLine, previousHeroSupportingLine)).toBe(atApprovedHeroSupportingLineBaseline(v2PagePath));
    expect(css.slice(0, css.indexOf(firstTextVisitNoteMarker))).toBe(atApprovedHeroSupportingLineBaseline(v2CssPath));
  });
  it("adds only the approved first-text-visit helper line and its two scoped pricing rules", () => {
    const markerIndex = css.indexOf(firstTextVisitNoteMarker);
    const helperCss = css.slice(markerIndex + firstTextVisitNoteMarker.length, css.indexOf(heroFontMatchMarker)).trim();
    expect(countExactOccurrences(page, approvedFirstTextVisitRow)).toBe(1);
    expect(countExactOccurrences(page, legacyFirstTextVisitRow)).toBe(0);
    expect(normalizeApprovedFirstTextVisitNote(normalizeFinalFaq(page))).toBe(atFirstTextVisitNoteBaseline(v2PagePath));
    expect(css.match(/\/\* V2 first text visit note — pricing helper only\. \*\//g)).toHaveLength(1);
    expect(markerIndex).toBeGreaterThanOrEqual(0);
    expect(css.indexOf(heroFontMatchMarker)).toBeGreaterThan(markerIndex);
    expect(css.slice(0, markerIndex)).toBe(atFirstTextVisitNoteBaseline(v2CssPath));
    expect(helperCss.match(/\.wlm-v2-content #how-it-works \.process-pricing-rates \.first-text-visit-note/g)).toHaveLength(1);
    expect(helperCss).toBe(approvedFirstTextVisitNoteCss);
  });

  it("adds only a page-scoped mobile crop and centered original wordmark without changing the shared Navbar or desktop header", () => {
    const pageNavbar = '<Navbar onConsultClick={() => {}} navigationLinks={PAGE_NAVIGATION} localSections showVirtualBanner={false} stickyOnPage primaryHref={WEIGHT_MENOPAUSE_INTAKE_URL} />';
    const headerStart = css.indexOf(mobileHeaderMarker);
    const mobileHeaderCss = css.slice(headerStart + mobileHeaderMarker.length, css.indexOf(visitBasedCareMarker)).trim();
    const root = ".wlm-v2-page > header > div:first-of-type > div:first-child";
    const logoLink = `${root} > a[href="/"]`;
    const logoImage = `${logoLink} > img`;
    const menu = `${root} > button[aria-label="Toggle menu"]`;
    const selectors = Array.from(mobileHeaderCss.matchAll(/(?:^|[{}])\s*(?!@)([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));

    expect(css.match(/\/\* Approved V2 mobile header: centered original wordmark without tagline only\. \*\//g)).toHaveLength(1);
    expect(headerStart).toBeGreaterThan(css.indexOf(mobileBarMarker));
    expect(css.indexOf(visitBasedCareMarker)).toBeGreaterThan(headerStart);
    expect(mobileHeaderCss).toMatch(/^@media\s*\(\s*max-width\s*:\s*767px\s*\)\s*\{[\s\S]*\}\s*$/);
    expect(mobileHeaderCss).not.toMatch(/min-width|@media\s*\([^)]*(?:768|desktop)/i);
    expect(selectors).toEqual([root, logoLink, logoImage, menu]);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-page > header > div:first-of-type > div:first-child(?:$| > (?:a\[href="\/"\](?: > img)?|button\[aria-label="Toggle menu"\]))$/);

    expect(mobileHeaderCss).toContain(`${root} { position: relative; }`);
    expect(mobileHeaderCss).toContain(`${logoLink} { position: absolute; left: 50%; transform: translateX(-50%); height: 48px; overflow: hidden; }`);
    expect(mobileHeaderCss).toContain(`${logoImage} { height: 48px; width: auto; max-width: none; clip-path: inset(0 0 14px 0); transform: translateY(7px); }`);
    expect(mobileHeaderCss).toContain(`${menu} { margin-left: auto; }`);
    expect(mobileHeaderCss).not.toMatch(/(?:^|[;}])\s*(?:body|html|:root)\b|\*\s*\{/);
    expect(mobileHeaderCss).not.toMatch(/\b(?:filter|opacity|color|background(?:-color)?)\s*:/);

    expect(page.match(/<Navbar\s/g)).toHaveLength(1);
    expect(page).toContain(pageNavbar);
    expect(home1Navbar).toContain('src="/manus-storage/medmethod-logo-navbar_99a2ea82.png"');
    expect(home1Navbar).toContain('alt="MedMethod Direct"');
    expect(home1Navbar).toContain('className="h-12 lg:h-14 w-auto object-contain"');
    expect(home1Navbar).toContain('className="lg:hidden text-[#111111] p-2"');
  });

  it("uses the complete approved uploaded hero while preserving legacy hero hooks and the external intake CTA", () => {
    const hero = page.match(/<section className="hero" data-medmethod-scope="">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(hero).not.toBe("");
    expect(hero.startsWith('<section className="hero" data-medmethod-scope="">')).toBe(true);
    expect(hero).toContain('<div className="container hero-grid"><div className="hero-copy">');
    expect(hero).toContain(approvedHeroHeadline);
    expect(hero).toContain(approvedHeroSupportingLine);
    expect(countExactOccurrences(hero, approvedHeroSupportingLine)).toBe(1);
    expect(hero).not.toContain(previousHeroSupportingLine);
    expect(hero).toContain('<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>');
    expect(hero).toContain('<span className="hero-cta-timing">Complete intake · 5–10 min</span>');
    expect(hero).not.toContain('className="hero-text-note"');
    expect(hero).not.toContain('className="hero-offer"');
    expect(hero).not.toContain('className="hero-eyebrow"');
    expect(hero).not.toContain("$49/month");
    expect(hero).not.toContain("100% refunded if not approved.");
    expect(hero).toContain('<em>First visit FREE!</em>');
    expect(hero).toContain('<span className="hero-cta-label">Start your free visit <span className="arrow" aria-hidden="true">→</span></span>');
    expect(page).toContain("Your first doctor text visit is free. Medication priced separately.");
    expect(page).not.toContain("Start your visit — free forever");
    expect(page).toContain('WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/"');
    expect(interaction).toContain('root.querySelector<HTMLElement>(".hero-actions .btn")');
  });

  it("uses the exact uploaded glyph mask for only the headline ampersand", () => {
    expect(page.match(/className="hero-ampersand"/g)).toHaveLength(1);
    expect(approvedHeroHeadline).toContain('<span className="hero-ampersand">&amp;</span>');
    const symbolRule = css.match(/\.wlm-v2-content \.hero\[data-medmethod-scope\] h1 \.hero-ampersand\{([^}]+)\}/)?.[1] ?? "";
    expect(symbolRule).toContain('font-family:"DM Sans",Arial,sans-serif;line-height:0');
    expect(symbolRule).toContain('width:.7em;height:.78em;vertical-align:-.015em;background-color:currentColor');
    expect(symbolRule).toContain('-webkit-mask-image:url("/manus-storage/menopause-v2-reference-ampersand_40428d79.png")');
    expect(symbolRule).toContain('mask-image:url("/manus-storage/menopause-v2-reference-ampersand_40428d79.png")');
    expect(symbolRule).toContain('mask-size:contain');
    expect(symbolRule).toContain('mask-repeat:no-repeat');
    expect(symbolRule).toContain('forced-color-adjust:none');
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

  it("appends only the supplied design's scoped hero styles before the doctor-biography CSS", () => {
    expect(css.match(/\/\* Approved uploaded V2 hero: supplied design with original phone only\. \*\//g)).toHaveLength(1);
    const appendedHeroCss = css.slice(css.indexOf(uploadedHeroMarker) + uploadedHeroMarker.length, css.indexOf(doctorBioMarker)).trim();
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

  it("replaces only the original V2 doctor section with the independent approved homepage-style biography", () => {
    expect(page).toContain('import "./WeightLossMenopauseV2.css";\nimport WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";');
    expect(page).toContain("<WeightLossMenopauseV2DoctorBio />");
    expect(page).not.toContain('id="doctor"><div className="container doctor-grid">');
    expect(page.match(/<WeightLossMenopauseV2DoctorBio \/>/g)).toHaveLength(1);
    expect(page.match(/id="doctor"/g) ?? []).toHaveLength(0);

    expect(doctorBio).toContain("export default function WeightLossMenopauseV2DoctorBio()");
    expect(doctorBio).toContain('<section className="section wave-top wave-surface wave-flip" id="doctor" aria-labelledby="v2-doctor-heading">');
    expect(doctorBio).not.toContain("MedicalTeam");
    expect(doctorBio).not.toMatch(/^\s*import\s/m);
    expect(doctorBio).not.toMatch(/\b(?:fetch|axios|useEffect|useState|XMLHttpRequest)\b/);
  });

  it("copies the approved homepage physician facts and full biography source without adding claims", () => {
    for (const credential of approvedDoctorCredentials) {
      expect(doctorBio).toContain(`"${credential}"`);
    }
    expect(countExactOccurrences(doctorBio, '"Family Physician"')).toBe(1);
    expect(doctorBio).not.toContain('"Board-Certified DO"');
    expect(doctorBio).toContain('const CREDENTIALS = ["Family Physician", "Menopause Specialist", "Metabolism", "Author", "Mom of Four", "Licensed in 12 states"];');
    const credentials = Array.from((doctorBio.match(/const CREDENTIALS = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g), match => match[1]);
    const normalizedCredentials = Array.from((normalizeV2DoctorBioCredential(doctorBio).match(/const CREDENTIALS = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g), match => match[1]);
    const homepageCredentials = Array.from((homepageMedicalTeam.match(/const CREDENTIAL_PILLS = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g), match => match[1]);
    expect(normalizedCredentials).toEqual(homepageCredentials);
    expect(credentials).toHaveLength(6);
    expect(normalizeV2DoctorBioCredential(doctorBio)).toBe(atCurrentBaseline(v2DoctorBioPath));
    expect(doctorBio.match(/Licensed in \d+ states/g)).toEqual(["Licensed in 12 states"]);

    for (const focusArea of approvedDoctorFocusAreas) {
      expect(homepageMedicalTeam).toContain(`"${focusArea}"`);
      expect(doctorBio).toContain(`"${focusArea}"`);
    }

    for (const [organization, detail] of approvedDoctorTraining) {
      expect(homepageMedicalTeam).toContain(`org: "${organization}"`);
      expect(homepageMedicalTeam).toContain(`detail: "${detail}"`);
      expect(doctorBio).toContain(`org: "${organization}"`);
      expect(doctorBio).toContain(`detail: "${detail}"`);
    }
    expect(doctorBio).toContain("Background in Fitness &amp; Exercise Science");
    expect(doctorBio).toContain("Former NASM-Certified Personal Trainer");
    expect(homepageMedicalTeam).toContain("Former NASM-Certified Personal Trainer");

    const normalizedHomepageMedicalTeam = homepageMedicalTeam
      .replaceAll("\\u2014", "—")
      .replaceAll("\\u201C", "“")
      .replaceAll("\\u201D", "”")
      .replace(/\s+/g, " ");
    for (const copy of approvedDoctorBioCopy) {
      expect(normalizedHomepageMedicalTeam).toContain(copy.replace(/\s+/g, " "));
      expect(doctorBio).toContain(copy);
    }
    expect(doctorBio).toContain("The Menopause Weight Loss Trap");
    expect(homepageMedicalTeam).toContain("The Menopause Weight Loss Trap");
    expect(doctorBio).toContain("50,000+</strong> patients seen");
    expect(doctorBio).toContain("Your first doctor text visit is free, with seven days of follow-up support.");
    expect(doctorBio).not.toContain("Connect directly with your doctor by text — for free.");
  });

  it("uses the approved portrait and responsive card hooks without cropping either viewport rendering", () => {
    const portrait = "/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp";
    expect(homepageMedicalTeam).toContain(portrait);
    expect(doctorBio).toContain(`const DOCTOR_PORTRAIT = "${portrait}";`);
    expect(doctorBio.match(/src=\{DOCTOR_PORTRAIT\}/g)).toHaveLength(2);
    expect(doctorBio.match(/alt="Dr\. Jumana Al-Deek, DO, MS"/g)).toHaveLength(2);
    expect(doctorBio).toContain('className="doctor-bio-portrait doctor-bio-desktop-portrait"');
    expect(doctorBio).toContain('className="doctor-bio-portrait doctor-bio-mobile-portrait"');

    const doctorBioCss = css.slice(css.indexOf(doctorBioMarker) + doctorBioMarker.length, css.indexOf(mobileBarMarker));
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-portrait{position:relative;aspect-ratio:3/4');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-portrait img{display:block;width:100%;height:100%;object-fit:contain}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-mobile-portrait{display:none}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-desktop-portrait{display:none}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-mobile-portrait{display:block');
  });

  it("keeps all three supporting biography sections as native accessible details with decorative plus/minus state", () => {
    expect(doctorBio).toContain("const BIO_DETAILS = [");
    expect(doctorBio).toContain("{BIO_DETAILS.map(item => (");
    expect(doctorBio).toContain('<details key={item.label}>');
    expect(doctorBio).toContain('<summary>{item.label}<span className="doctor-bio-toggle" aria-hidden="true"><span className="doctor-bio-plus">+</span><span className="doctor-bio-minus">−</span></span></summary>');
    expect(doctorBio).not.toMatch(/<button\b|onClick=|aria-expanded=/);

    for (const label of ["Clinical Background", "Medical Training", "Advanced Training & Approach"]) {
      expect(homepageMedicalTeam).toContain(`label: "${label}"`);
      expect(doctorBio).toContain(`label: "${label}"`);
    }

    const doctorBioCss = css.slice(css.indexOf(doctorBioMarker) + doctorBioMarker.length, css.indexOf(mobileBarMarker));
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-minus{display:none}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-details details[open] .doctor-bio-plus{display:none}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-details details[open] .doctor-bio-minus{display:block}');
    expect(doctorBioCss).toContain('.wlm-v2-content #doctor .doctor-bio-details summary:focus-visible{outline:2px solid #7A1E7E');
  });

  it("adds no booking, paid, coach, or Featured In content and confines new CSS to the V2 doctor section", () => {
    for (const forbiddenContent of [
      "Featured In",
      "Coach",
      "COACH",
      "Schedule",
      "Discovery Call",
      "$",
      "href=",
      "<button",
    ]) {
      expect(doctorBio).not.toContain(forbiddenContent);
    }
    expect(doctorBio).not.toMatch(/<a(?:\s|>)/);

    expect(css.match(/\/\* Approved V2 homepage-style doctor biography: doctor section only\. \*\//g)).toHaveLength(1);
    const doctorBioCss = css.slice(css.indexOf(doctorBioMarker) + doctorBioMarker.length, css.indexOf(mobileBarMarker));
    const selectors = Array.from(doctorBioCss.matchAll(/(?:^|[{}])\s*(?!@)([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));
    expect(selectors.length).toBeGreaterThan(30);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-content #doctor(?:\b|\s|[.:#])/);
    expect(doctorBioCss).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\b/);
    expect(doctorBioCss).not.toMatch(/(?:^|[}\n])\s*\.wlm-v2-content(?! #doctor)/);
  });

  it("uses the finalized combined process and visit-pricing section exactly, with the pricing anchor nested inside it", () => {
    const howItWorks = page.match(/<section className="section process-pricing-section" id="how-it-works"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(howItWorks).toBe(approvedCombinedProcessPricingSection);
    expect(howItWorks.match(/id="how-it-works"/g)).toHaveLength(1);
    expect(howItWorks.match(/id="pricing"/g)).toHaveLength(1);
    expect(howItWorks.indexOf('id="pricing"')).toBeGreaterThan(howItWorks.indexOf('id="how-it-works"'));
    expect(page.match(/<section\b[^>]*\bid="pricing"/g) ?? []).toHaveLength(0);
    expect(page.match(/id="how-it-works"/g)).toHaveLength(1);
    expect(page.match(/id="pricing"/g)).toHaveLength(1);
  });

  it("places the combined section immediately after the hero and restores the unchanged Featured In strip immediately after it", () => {
    const sections = Array.from(page.matchAll(/<section\b[^>]*>/g), match => match[0]);
    expect(sections[0]).toContain('className="hero"');
    expect(sections[1]).toContain("process-pricing-section");
    expect(sections[1]).toContain('id="how-it-works"');
    expect(sections[2]).toContain('className="featured-in"');
    expect(sections[3]).toContain('className="medication-pricing"');
    const currentFeaturedInSection = page.match(/<section className="featured-in"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(currentFeaturedInSection).toBe(originalFeaturedInSection);
  });

  it("uses the approved process copy, three visit prices, care-plan follow-up scope, and free-text intake CTA without wiring a payment flow", () => {
    const combined = approvedCombinedProcessPricingSection;
    expect(combined).toContain('<h2 id="process-pricing-title"><span>Your doctor.</span><span>One text away.</span></h2>');
    expect(combined).toContain('<p className="process-pricing-lead">Start with a 5–10 minute intake.</p>');
    expect([...combined.matchAll(/<li><span className="process-step-number" aria-hidden="true">(\d)<\/span><div><h3>(.*?)<\/h3><p>(.*?)<\/p><\/div><\/li>/g)].map(match => match.slice(1))).toEqual([
      ["1", "Fill out your intake", "Tell us about your health and goals."],
      ["2", "Text with your doctor", "Your doctor reviews your intake, then discusses your options with you."],
      ["3", "Make a plan together", "Agree on the next steps that are right for you."],
    ]);
    expect(combined).toContain('<h3 id="visit-pricing-title">Simple, pay-per-visit care</h3>');
    expect(combined).toContain(approvedFirstTextVisitRow);
    expect(combined).toContain('<div><dt>Additional text visits</dt><dd>$29 <span>each</span></dd></div>');
    expect(combined).toContain('<div><dt>Video visit</dt><dd>$97</dd></div>');
    expect(combined).toContain('Included with every visit—even your free first visit.');
    expect(combined).toContain('Medication costs extra, if prescribed.');
    expect(combined).toContain('Prescriptions only when medically appropriate. Follow-up covers that visit’s assessment and care plan. New concerns or additional treatments require a separate visit.');
    expect(combined).toContain('No membership or long-term commitment.');
    expect(combined).toContain('<a className="btn process-pricing-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start Your Free Text Visit <span className="arrow" aria-hidden="true">→</span></a>');
    expect(combined).not.toMatch(/<form\b|<input\b|<button\b|paypal|stripe|createOrder|captureOrder/i);
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
    expect((page.match(/href=\{WEIGHT_MENOPAUSE_INTAKE_URL\}/g) ?? [])).toHaveLength(5);
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

  it("keeps medication pricing separate while the only care-pricing anchor is the combined process section", () => {
    const medicationPricing = page.match(/<section className="medication-pricing"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(medicationPricing).not.toBe("");
    expect(medicationPricing).toContain('<p><span>Your first doctor text visit is free. Medication priced separately.</span><span data-glp1-price-copy=""> Exact medication prices are shown below.</span></p>');
    expect(medicationPricing).not.toContain("$49/month plus the cost of medication.");
    expect(page).not.toMatch(/<section className="section pricing-section wave-top wave-soft" id="pricing">/);
    expect(page.match(/className="process-pricing-offer" id="pricing"/g)).toHaveLength(1);
    expect(page).not.toContain('className="visit-pricing-card"');
    expect(page).not.toContain('className="visit-pricing-addon"');
    expect(page).not.toContain('className="bonus-banner"');
    expect(page).not.toContain("$39");
    expect(page).not.toContain("$47");
    expect(page).not.toContain("$19.99");
  });

  it("removes every app promotion while keeping real physician fitness history and the four unchanged non-app testimonials", () => {
    const support = page.match(/<section className="section support-section wave-top wave-surface wave-flip">[\s\S]*?<\/section>/)?.[0] ?? "";
    const testimonials = page.match(/<section className="section testimonials wave-top wave-band wave-flip" id="testimonials">[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(page).not.toContain('id="app"');
    expect(page).not.toContain('anchor: "app"');
    expect(page).not.toContain('href="#app"');
    expect(page).not.toContain("FREE BONUS");
    expect(page).not.toContain('className="bonus-banner"');
    expect(page).not.toContain("What is included in the fitness + nutrition app?");
    for (const appPromotion of [
      "Fitness and nutrition, working together.",
      "2,500+ exercise videos",
      "Custom workout plans",
      "Meal plans + recipes",
      "Macro + progress tracking",
      "Personalized nutrition",
      "in-app workout builder",
      "free mobile app",
      "The free app gives me workouts",
    ]) expect(page).not.toContain(appPromotion);

    expect(support).not.toBe("");
    expect(support).toContain("<h2>A doctor’s assessment. A clear care plan.</h2>");
    expect(support).toContain("Every visit includes seven days of follow-up messaging to support its recommendations.");
    expect(support.match(/<article className="feature-item">/g)).toHaveLength(3);
    expect(support).toContain("Physician-led decisions");
    expect(support).toContain(approvedFirstVisitSupportCard);
    expect(support).toContain(approvedSevenDaySupportCard);
    expect(support).not.toContain("Medication management");
    expect(support).not.toContain("Personalized nutrition");
    expect(support).not.toContain("2,500+ exercise videos");
    expect(support).not.toContain("Progress you can see");

    expect(testimonials.match(/<article className="testimonial-card">/g)).toHaveLength(4);
    for (const retainedPatient of ["Layla, 25", "Lindsey, 39", "Michelle, 45", "Omar, 42"]) expect(testimonials).toContain(`<footer>${retainedPatient}</footer>`);
    for (const removedAppTestimonial of ["Sarah, 32", "Rania, 50"]) expect(testimonials).not.toContain(removedAppTestimonial);

    expect(doctorBio).toContain("Background in Fitness &amp; Exercise Science");
    expect(doctorBio).toContain("Former NASM-Certified Personal Trainer");
    expect(doctorBio).toContain("certified personal trainer working exclusively with women struggling through hormonal weight gain");
  });

  it("replaces the obsolete inline FAQ only with the final fixture-backed FAQ component and keeps prior FAQ copy out of the page shell", () => {
    expect(page).toContain(finalFaqComponentImport.trim());
    expect(page).toContain(finalFaqDataImport.trim());
    expect(page).toContain(finalFaqMount);
    expect(page.match(/<WeightLossMenopauseV2Faq intakeHref=\{WEIGHT_MENOPAUSE_INTAKE_URL\} \/>/g)).toHaveLength(1);
    expect(page).not.toMatch(/<section className="section wave-top wave-surface" id="faq">/);
    expect(page).not.toContain("Final clinical, pharmacy, pricing, and state-availability language should be reviewed before launch.");
    expect(page).not.toContain("What does my free first text visit include?");
    expect(page).not.toContain("Can I add a virtual Zoom visit?");
    expect(page).not.toContain("When do I need another visit?");
    expect(page).not.toContain("State availability is TBD.");
    expect(page).not.toContain("Prototype disclosure:");
    expect(page).not.toContain("© 2026 MMD Weight Loss. Working title and prototype content.");

    for (const legacyCopy of [
      "$49/month plus the cost of medication.",
      "$49 today. $49 monthly.",
      "One membership: physician-led care, direct texting with Dr. Al-Deek — plus a free bonus: the fitness + nutrition app.",
      'aria-label="Membership pricing"',
      "First month due today · then monthly · cancel anytime.",
      "Want face time? Add a video visit for $30.",
      "The clinical membership fee does not include medication.",
      "Membership includes MMD’s fitness and nutrition app",
      "When is the $49 consultation refunded?",
      "The proposed policy is to refund the consultation when the clinician determines no prescription is appropriate after review.",
      '<span className="sticky-cta-price">$49<small>/mo</small></span>',
      'aria-label="Start your visit — $49 per month membership"',
      "$30",
      "$49",
    ]) {
      expect(page).not.toContain(legacyCopy);
    }
  });

  it("appends only the scoped visit-based layout rules after the byte-preserved mobile-header block", () => {
    expect(css.match(/\/\* Approved V2 visit-based care: app removed, clinical content only\. \*\//g)).toHaveLength(1);
    const visitCss = css.slice(css.indexOf(visitBasedCareMarker) + visitBasedCareMarker.length, css.indexOf(pricingOfferCardMarker)).trim();
    expect(css.slice(0, css.indexOf(visitBasedCareMarker))).toContain(mobileHeaderMarker.trim());
    expect(visitCss).toBe(`.wlm-v2-content .support-section .feature-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.wlm-v2-content .support-section .feature-grid > .feature-item,
.wlm-v2-content .support-section .feature-grid > .feature-item:nth-last-child(2),
.wlm-v2-content .support-section .feature-grid > .feature-item:last-child { grid-column: auto; }
.wlm-v2-content .testimonials .testimonial-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.wlm-v2-content .pricing-section .visit-support-scope { max-width: 640px; margin: 20px auto 0; color: var(--muted); font-size: 15px; line-height: 1.6; }
@media (max-width: 700px) {
  .wlm-v2-content .support-section .feature-grid,
  .wlm-v2-content .testimonials .testimonial-grid { grid-template-columns: minmax(0, 1fr); }
}`);
    expect(visitCss).not.toMatch(/(?:^|[}\n])\s*(?:body|html|:root)\b|#app|\.hero|\.sticky-cta/);
  });

  it("appends the pricing offer-card styles after visit-based care and scopes every selector to the V2 pricing section", () => {
    const pricingCss = css.slice(css.indexOf(pricingOfferCardMarker) + pricingOfferCardMarker.length, css.indexOf(combinedProcessPricingMarker)).trim();
    const selectors = Array.from(pricingCss.matchAll(/(?:^|[{}])\s*(?!@)([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));

    expect(css.match(/\/\* Approved V2 pricing offer card: pricing section only\. \*\//g)).toHaveLength(1);
    expect(css.indexOf(pricingOfferCardMarker)).toBeGreaterThan(css.indexOf(visitBasedCareMarker));
    expect(css.indexOf(combinedProcessPricingMarker)).toBeGreaterThan(css.indexOf(pricingOfferCardMarker));
    expect(pricingCss).toContain('.wlm-v2-content #pricing .visit-pricing-card { padding: 36px;');
    expect(pricingCss).toContain('.wlm-v2-content #pricing .visit-pricing-benefits > li::before { content: "✓";');
    expect(pricingCss).toContain('.wlm-v2-content #pricing .visit-pricing-addon { min-width: 0;');
    expect(pricingCss).toContain('.wlm-v2-content #pricing .pricing-actions .btn { display: flex;');
    expect(selectors.length).toBeGreaterThan(20);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-content #pricing(?:$|\s|[.:#>])/);
    expect(pricingCss).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\b|(^|[}\n])\s*\.wlm-v2-content(?! #pricing)/);
    expect(pricingCss).not.toMatch(/#app|\.hero|\.sticky-cta|\.support-section|\.testimonials/);
  });

  it("appends the final combined process and visit-pricing CSS once, with every selector scoped to the V2 How-it-works section", () => {
    expect(css.match(/\/\* V2 combined process and visit pricing \*\//g)).toHaveLength(1);
    const combinedCss = css.slice(css.indexOf(combinedProcessPricingMarker) + combinedProcessPricingMarker.length, css.indexOf("/* V2 section dividers — straight, content-width transitions only. */")).trim();
    const selectors = Array.from(combinedCss.matchAll(/(?:^|[{}])\s*(?!@)([^@{}]+?)\s*\{/g), match => match[1].trim().replace(/\s+/g, " "));
    expect(combinedCss).toContain('.wlm-v2-content #how-it-works.process-pricing-section { padding: 64px 0;');
    expect(combinedCss).toContain('.wlm-v2-content #how-it-works .process-pricing-layout { display: grid;');
    expect(combinedCss).toContain('.wlm-v2-content #how-it-works .process-pricing-rates > div { display: grid;');
    expect(combinedCss).toContain('.wlm-v2-content #how-it-works .process-pricing-cta { display: flex;');
    expect(combinedCss).toContain('@media(max-width:900px)');
    expect(combinedCss).toContain('@media(max-width:480px)');
    expect(selectors.length).toBeGreaterThan(20);
    for (const selector of selectors) expect(selector).toMatch(/^\.wlm-v2-content #how-it-works(?:\b|\s|[.:#>])/);
    expect(combinedCss).not.toMatch(/(^|[}\n])\s*(?:body|html|:root)\b|(^|[}\n])\s*\.wlm-v2-content(?! #how-it-works)/);
    expect(combinedCss).not.toMatch(/#pricing(?![\w-])|#app|\.hero|\.sticky-cta|\.support-section|\.testimonials/);
  });

  it("aligns the three price amounts while keeping each beneath $29 without shifting its amount baseline", () => {
    const combinedCss = css.slice(css.indexOf(combinedProcessPricingMarker));
    expect(combinedCss).toContain("align-items: center; min-height: 84px; padding: 18px 0;");
    expect(combinedCss).toContain(".process-pricing-rates > div:first-child { padding-top: 18px; }");
    expect(combinedCss).toContain(".process-pricing-rates dd { display: flex; flex-direction: column; align-items: flex-end; position: relative;");
    expect(combinedCss).toContain(".process-pricing-rates dd > span { position: absolute; top: calc(100% + 2px); right: 0;");
    expect(approvedCombinedProcessPricingSection).toContain("<dd>$29 <span>each</span></dd>");
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
