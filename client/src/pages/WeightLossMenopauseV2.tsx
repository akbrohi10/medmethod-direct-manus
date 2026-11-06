import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import treatmentCatalogJson from "@shared/treatmentCatalog.json";
import Navbar from "@/components/home1/Navbar";
import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions";
import "./WeightLossMenopauseV2.css";
import WeightLossMenopauseV2DoctorBio from "./WeightLossMenopauseV2DoctorBio";
import WeightLossMenopauseV2MobileBar from "./WeightLossMenopauseV2MobileBar";
import WeightLossMenopauseV2Faq from "./WeightLossMenopauseV2Faq";
import { V2_FAQ_FOOTER_PARAGRAPHS, V2_FAQ_COPYRIGHT } from "./WeightLossMenopauseV2FaqData";

export const WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/";
const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2";
const PAGE_TITLE = "Weight-Loss & Menopause | MedMethod Direct";
const PAGE_DESCRIPTION = "Explore physician-guided GLP-1 weight management and menopause care with Dr. Jumana Al-Deek, including medication pricing and ongoing support.";
const PAGE_IMAGE = "https://medmethoddirect.com/manus-storage/wlm-embedded-3f0ba6b015e6_ac0b276d.jpg";
const PAGE_NAVIGATION = [
  { label: "How it works", anchor: "how-it-works" },
  { label: "Pricing", anchor: "pricing" },
  { label: "FAQ", anchor: "faq" },
];

type TreatmentCatalogOption = {
  value: string;
  name: string;
  price: string;
  supply?: string;
  frequency?: string;
  form?: string;
  note: string;
  images: Record<string, string | null | undefined>;
  imageAlt?: string;
};

type Glp1PageDisplay = {
  name: string;
  price: string;
  supply?: string;
  specs: { label: string; value: string }[];
};

const treatmentCatalog = treatmentCatalogJson as {
  glp1: { options: TreatmentCatalogOption[]; pageDisplays: { weightLossIntake: Record<string, Glp1PageDisplay> } };
  hrt: { options: TreatmentCatalogOption[] };
};

// Only the four pictured HRT options are shown on this landing page.
const PAGE_HRT_TREATMENT_IDS = new Set([
  "estradiol_tablets",
  "estradiol_patch",
  "micronized_progesterone_pill",
  "vaginal_estrogen_cream",
]);
const pageHrtOptions = treatmentCatalog.hrt.options.filter(treatment => PAGE_HRT_TREATMENT_IDS.has(treatment.value));

function MedicationCard({ treatment, category }: { treatment: TreatmentCatalogOption; category: "glp1" | "hrt" }) {
  const image = treatment.images.weightLossMenopause;
  const display = category === "glp1" ? treatmentCatalog.glp1.pageDisplays.weightLossIntake[treatment.value] : undefined;
  const name = display?.name ?? treatment.name;
  const price = display?.price.replace(" — fixed price", " — same price at every dose") ?? treatment.price;
  const supply = display ? display.supply : treatment.supply;
  const mediaClass = image ? `product-photo ${category === "hrt" ? "hrt-product-photo" : treatment.value.replaceAll("_", "-")}` : "hrt-placeholder";
  return (
    <article className="medication-card" data-treatment-id={treatment.value}>
      <div className="medication-card-name"><h3>{name}</h3></div>
      <div className={`medication-media ${mediaClass}`}>
        {image ? <img src={image} alt={treatment.imageAlt ?? treatment.name} loading="lazy" /> : <span>Image coming soon</span>}
      </div>
      <div className="medication-price"><small>Price</small><strong>{price}</strong>{supply ? <span className="medication-supply">{supply}</span> : null}</div>
      {display ? <dl className="medication-specs">{display.specs.map(spec => <div key={spec.label} style={{ display: "contents" }}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl> : treatment.frequency || treatment.form ? <dl className="medication-specs">{treatment.frequency ? <><dt>Frequency</dt><dd>{treatment.frequency}</dd></> : null}{treatment.form ? <><dt>Form</dt><dd>{treatment.form}</dd></> : null}</dl> : null}
      <p className="medication-note">{treatment.note}</p>
      <a className="btn medication-card-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL} aria-label={`Get started with an intake for ${name}`}>Get started</a>
    </article>
  );
}

/** Imported from the owner-approved ZIP. Page content/order is intentionally preserved. */
export default function WeightLossMenopauseV2() {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.head.querySelectorAll('[data-wlm-server-meta="true"]').forEach(tag => tag.remove());
    if (!contentRef.current) return;
    return initializeWeightLossMenopauseV2(contentRef.current);
  }, []);
  return (
    <div className="wlm-v2-page">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={PAGE_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={PAGE_IMAGE} />
        <link rel="preload" as="image" href="/manus-storage/wlm-embedded-83ae62555e53_0c74bd61.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-23f382110e31_32711544.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-12565d12c863_6e38e292.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-5358c6c40f83_5daa438f.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-012f44dc2cde_10378029.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-08fb73a8f1d9_b8ef319d.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-003978802679_7273ba1a.png" />
<link rel="preload" as="image" href="/manus-storage/wlm-embedded-9dbf04b103e4_d30ff97e.png" />
      </Helmet>
      <Navbar onConsultClick={() => {}} navigationLinks={PAGE_NAVIGATION} localSections showVirtualBanner={false} stickyOnPage primaryHref={WEIGHT_MENOPAUSE_INTAKE_URL} />
      <div className="wlm-v2-content" ref={contentRef}>
        <main id="top">
<section className="hero" data-medmethod-scope=""><div className="container hero-grid"><div className="hero-copy">
<h1><span className="hero-headline-line">Is medical weight loss or hormone therapy right for you?</span><span className="hero-headline-line hero-free"><em>Find out free.</em></span></h1>
<p className="hero-description"><strong>GLP-1s, menopause &amp; hormone therapy.</strong><br /><b>Done right for you. 100% virtual</b></p>
<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}><span className="hero-cta-label">Start your free assessment <span className="arrow" aria-hidden="true">→</span></span><span className="hero-cta-timing">Takes 5–10 min</span></a></div>
</div><div className="phone-stage" aria-label="Illustrative secure text conversation with Dr. Al-Deek"><div className="phone"><div className="phone-screen"><div className="phone-top"><div className="notch"></div></div><div className="chat-head"><img className="chat-avatar" src="/manus-storage/wlm-embedded-bfde38427412_0754b2a5.jpg" alt="Dr. Jumana Al-Deek" /><div><strong>Dr. Al-Deek</strong><small><i className="online"></i> Secure text with your doctor</small></div></div><div className="chat-body" data-live-chat=""><div className="chat-date">Illustrative conversation</div><div className="chat-message" data-chat-at="400"><div className="bubble me">Hi Dr. Al-Deek,<br />I'd like to learn about my options for weight loss and hormones.</div><div className="chat-time patient-time">9:41 AM</div></div><div className="bubble typing-bubble" data-chat-at="1400" data-chat-hide="900" aria-hidden="true"><i></i><i></i><i></i></div><div className="chat-message" data-chat-at="2400"><div className="bubble">Of course! I'm happy to help. Let's discuss your goals and see what options may be right for you.</div><div className="chat-time">9:42 AM</div></div></div><div className="chat-composer" aria-hidden="true"><span>Type a message...</span><span className="chat-send">➤</span></div></div></div><div className="hipaa-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>HIPAA-compliant • secure text</div></div></div></section>
<section className="section process-pricing-section" id="how-it-works" aria-labelledby="process-pricing-title">
  <div className="container process-pricing-layout">
    <div className="process-pricing-intro">
      <span className="section-kicker">How it works</span>
      <h2 id="process-pricing-title"><span>Your doctor.</span><span>One text away.</span></h2>
      <p className="process-pricing-lead">Start with a 5–10 minute intake.</p>
      <ol className="process-pricing-steps" data-v2-four-process-steps>
        <li><span className="process-step-number" aria-hidden="true">1</span><div><h3>Take the free assessment</h3><p>A 5–10 minute intake about your health and goals.</p><small style={{ display: "block", marginTop: 8, color: "#7A1E7E", fontSize: 14, fontWeight: 700 }}>FREE</small></div></li>
        <li><span className="process-step-number" aria-hidden="true">2</span><div><h3>Text with your doctor</h3><p>Your doctor reviews your assessment and talks through your options, with 7 days of follow-up messaging.</p><small style={{ display: "block", marginTop: 8, color: "#7A1E7E", fontSize: 14, fontWeight: 700 }}>FREE</small></div></li>
        <li><span className="process-step-number" aria-hidden="true">3</span><div><h3>Start your treatment</h3><p>If prescribed, medication is shipped to your door. Want to meet face to face first? Add a video visit.</p><small style={{ display: "block", marginTop: 8, color: "#7A1E7E", fontSize: 14, fontWeight: 700 }}>Medication priced separately</small></div></li>
        <li><span className="process-step-number" aria-hidden="true">4</span><div><h3>Keep going your way</h3><p>Pay per visit as you go, or become a member for unlimited texting and $49 video visits.</p><small style={{ display: "block", marginTop: 8, color: "#7A1E7E", fontSize: 14, fontWeight: 700 }}>Membership $300/year</small></div></li>
      </ol>
    </div>
    <div className="process-pricing-offer" id="pricing" aria-label="Visit pricing">
      <div className="process-pricing-card">
        <dl className="process-pricing-rates">
          <div><dt>First text visit<small className="first-text-visit-note">Includes 7 days of follow-up messaging.</small></dt><dd>FREE</dd></div>
          <div><dt>Additional text visits<small className="first-text-visit-note">Pay as you go</small></dt><dd>$29 <span>each</span></dd></div>
          <div className="compact-video-rate"><dt>Video visit</dt><dd>$97 <small className="compact-member-video">Members $49</small></dd></div>
          <div className="compact-membership-rate"><dt>Optional membership<small className="first-text-visit-note">One annual upfront payment</small></dt><dd>$300 <small className="compact-annual-unit">/year</small></dd></div>
        </dl>
        <details className="compact-membership-details">
          <summary><span>See membership benefits</span><svg className="compact-membership-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
          <p><strong>Best value for ongoing care</strong><br />Best if you're on treatment and refilling.</p>
          <ul className="compact-membership-benefits">
            <li><span aria-hidden="true">✓</span><span><strong>Unlimited text visits</strong> with your doctor</span></li>
            <li><span aria-hidden="true">✓</span><span><strong>All refill visits included</strong>, no per-visit fees</span></li>
            <li><span aria-hidden="true">✓</span><span><strong>Video visits just $49</strong> <s>$97</s></span></li>
            <li><span aria-hidden="true">✓</span><span>Dose adjustments and side-effect questions, any time</span></li>
            <li><span aria-hidden="true">✓</span><span>Weight loss, hormones and menopause, all in one plan</span></li>
          </ul>
        </details>
        <p className="process-medication-note">Medication costs extra, if prescribed.</p>
      </div>
      <a className="btn process-pricing-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your free assessment <span className="arrow" aria-hidden="true">→</span></a>
      <p className="process-intake-note">No payment today. You'll choose a plan after your free visit, only if treatment is right for you.</p>
      <p className="process-pricing-terms">Prescriptions only when medically appropriate. Pay-as-you-go follow-up covers that visit’s assessment and care plan. New concerns or additional treatments require a separate visit.</p>
      <p className="process-no-membership">Membership is optional. Pay-as-you-go care has no membership commitment.</p>
    </div>
  </div>
</section>
<section className="featured-in" aria-labelledby="featured-in-title" data-medmethod-scope=""><div className="featured-label" id="featured-in-title">Featured In</div><div className="featured-rail"><div className="featured-track"><div className="featured-set"><div className="featured-logo flow"><img src="/manus-storage/wlm-embedded-83ae62555e53_0c74bd61.png" alt="Flow Space" /></div><div className="featured-logo singlecare"><img src="/manus-storage/wlm-embedded-23f382110e31_32711544.png" alt="SingleCare" /></div><div className="featured-logo ntd"><img src="/manus-storage/wlm-embedded-12565d12c863_6e38e292.png" alt="NTD" /></div><div className="featured-logo scary"><img src="/manus-storage/wlm-embedded-5358c6c40f83_5daa438f.png" alt="Scary Mommy" /></div><div className="featured-logo daily-mail"><img src="/manus-storage/wlm-embedded-012f44dc2cde_10378029.png" alt="Daily Mail" /></div><div className="featured-logo yahoo-health"><img src="/manus-storage/wlm-embedded-08fb73a8f1d9_b8ef319d.png" alt="Yahoo Health" /></div><div className="featured-logo this-is-menopause"><img src="/manus-storage/wlm-embedded-003978802679_7273ba1a.png" alt="This Is Menopause" /></div><div className="featured-logo womans-world"><img src="/manus-storage/wlm-embedded-9dbf04b103e4_d30ff97e.png" alt="Woman’s World" /></div></div><div className="featured-set" aria-hidden="true"><div className="featured-logo flow"><img src="/manus-storage/wlm-embedded-83ae62555e53_0c74bd61.png" alt="" /></div><div className="featured-logo singlecare"><img src="/manus-storage/wlm-embedded-23f382110e31_32711544.png" alt="" /></div><div className="featured-logo ntd"><img src="/manus-storage/wlm-embedded-12565d12c863_6e38e292.png" alt="" /></div><div className="featured-logo scary"><img src="/manus-storage/wlm-embedded-5358c6c40f83_5daa438f.png" alt="" /></div><div className="featured-logo daily-mail"><img src="/manus-storage/wlm-embedded-012f44dc2cde_10378029.png" alt="" /></div><div className="featured-logo yahoo-health"><img src="/manus-storage/wlm-embedded-08fb73a8f1d9_b8ef319d.png" alt="" /></div><div className="featured-logo this-is-menopause"><img src="/manus-storage/wlm-embedded-003978802679_7273ba1a.png" alt="" /></div><div className="featured-logo womans-world"><img src="/manus-storage/wlm-embedded-9dbf04b103e4_d30ff97e.png" alt="" /></div></div></div></div></section>
<WeightLossMenopauseV2DoctorBio />

<section className="section testimonials wave-top wave-band wave-flip" id="testimonials"><div className="container"><div className="section-heading"><span className="section-kicker">Patient perspectives</span><h2>Care that feels connected to real life.</h2></div><div className="testimonial-grid"><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote><strong className="testimonial-story-title">{"“I finally started feeling like myself again.”"}</strong>{"“I was waking up at 3 a.m. almost every night, feeling exhausted during the day, and honestly just not feeling like myself anymore. I decided to try the free text visit because I really had nothing to lose."}<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}><summary role="button" aria-expanded="false"><span className="testimonial-read-more">Read full story</span><span className="testimonial-read-less">Show less</span><span className="testimonial-story-context"> — Salma, 47</span><svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div className="testimonial-story-rest">{"Dr. Al-Deek helped me understand what was happening with my hormones, and we started hormone therapy. A few months later, when I was feeling better but still struggling with my weight, we discussed adding a GLP-1."}<br /><br />{"I love that I can text my doctor when I have questions instead of scheduling an appointment for every little thing. It's been such a different experience from what I was used to.”"}</div></details></blockquote><footer>Salma, 47</footer></article>
<article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote><strong className="testimonial-story-title">{"“I finally feel like I have someone in my corner.”"}</strong>{"“Menopause really caught me off guard. The hot flashes, mood swings, and weight gain were affecting everything, including my confidence."}<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}><summary role="button" aria-expanded="false"><span className="testimonial-read-more">Read full story</span><span className="testimonial-read-less">Show less</span><span className="testimonial-story-context"> — Michelle, 52</span><svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div className="testimonial-story-rest">{"I started hormone therapy with Dr. Al-Deek, and eventually we added a GLP-1 to help with my weight. What I really appreciate is the membership. I don't have to worry about paying for every question or checking in when something changes."}<br /><br />{"It's comforting knowing I have a doctor who knows my history and is helping me manage both my hormones and my weight. I finally feel like I have someone in my corner.”"}</div></details></blockquote><footer>Michelle, 52</footer></article>
<article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote><strong className="testimonial-story-title">{"“I love having the flexibility to text or schedule a video visit.”"}</strong>{"“I've always been pretty healthy and active, but once I hit my mid-40s, my body started changing. I was gaining weight, my sleep was terrible, and no matter how much I exercised, I couldn't seem to get back on track."}<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}><summary role="button" aria-expanded="false"><span className="testimonial-read-more">Read full story</span><span className="testimonial-read-less">Show less</span><span className="testimonial-story-context"> — Huda, 45</span><svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div className="testimonial-story-rest">{"I completed the free assessment and started messaging with Dr. Al-Deek. We also scheduled a video visit because I wanted to talk through everything face-to-face."}<br /><br />{"We started by addressing my perimenopause symptoms, and later discussed GLP-1 treatment for my weight. I love having the flexibility to text most of the time but still schedule a video appointment when I want one.”"}</div></details></blockquote><footer>Huda, 45</footer></article>
<article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote><strong className="testimonial-story-title">{"“It's simple, convenient, and I don't feel locked into anything.”"}</strong>{"“I've been through menopause, and for years I felt like I was just supposed to accept the weight gain, poor sleep, and low energy as part of getting older."}<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}><summary role="button" aria-expanded="false"><span className="testimonial-read-more">Read full story</span><span className="testimonial-read-less">Show less</span><span className="testimonial-story-context"> — Hufsa, 58</span><svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div className="testimonial-story-rest">{"I was surprised that I could start with a free text visit. Dr. Al-Deek took the time to understand my concerns, and we eventually started hormone therapy. Later, we talked about whether a GLP-1 would be appropriate for me."}<br /><br />{"I don't need to communicate with my doctor constantly, so I like being able to pay for visits as I need them. It's simple, convenient, and I don't feel locked into anything.”"}</div></details></blockquote><footer>Hufsa, 58</footer></article>
<article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote><strong className="testimonial-story-title">{"“She looked at the bigger picture, not just my weight.”"}</strong>{"“I originally came to MedMethod Direct because I wanted to learn more about GLP-1 medications. I had been struggling with my weight for a couple of years and was getting really frustrated."}<details className="testimonial-story" onToggle={event => { const details = event.currentTarget; details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open)); }}><summary role="button" aria-expanded="false"><span className="testimonial-read-more">Read full story</span><span className="testimonial-read-less">Show less</span><span className="testimonial-story-context"> — Jennifer, 49</span><svg className="testimonial-story-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div className="testimonial-story-rest">{"During my first visit, Dr. Al-Deek asked about my sleep, periods, mood, and other symptoms. I hadn't even considered that I might be going through perimenopause."}<br /><br />{"We talked about both hormone therapy and medical weight loss, and I decided to start a treatment plan that addressed both. I ended up choosing the membership because I wanted ongoing support while we figured out what worked best for me."}<br /><br />{"It's nice having one doctor who looks at the bigger picture instead of just focusing on my weight.”"}</div></details></blockquote><footer>Jennifer, 49</footer></article></div></div></section>
<section className="medication-pricing" aria-labelledby="medication-pricing-title"><div className="container"><div className="section-heading"><h2 id="medication-pricing-title">Medication pricing, upfront.</h2><p><span>Your first doctor text visit is free. Medication priced separately.</span><span data-glp1-price-copy=""> Exact medication prices are shown below.</span></p></div><div className="medication-switch" role="group" aria-label="Medication type"><button type="button" aria-pressed="true" aria-controls="glp1-medication-panel" data-medication-choice="glp1">GLP-1</button><button type="button" aria-pressed="false" aria-controls="hrt-medication-panel" data-medication-choice="hrt">HRT</button></div><div id="glp1-medication-panel" className="medication-panel" data-medication-panel="glp1" role="region" aria-label="GLP-1 medication options"><div className="medication-grid">{treatmentCatalog.glp1.options.map(treatment => <MedicationCard key={treatment.value} treatment={treatment} category="glp1" />)}</div></div><div id="hrt-medication-panel" className="medication-panel" data-medication-panel="hrt" role="region" aria-label="HRT medication options" hidden={true}><div className="medication-grid">{pageHrtOptions.map(treatment => <MedicationCard key={treatment.value} treatment={treatment} category="hrt" />)}</div></div></div></section><section className="estimator-band" aria-label="Weight-loss estimate"><div className="container"><div className="estimator-card"><div className="estimator-control"><label htmlFor="weight-estimate"><span>Select your current weight</span><output id="weight-value" htmlFor="weight-estimate">250 lbs</output></label><input id="weight-estimate" type="range" min="130" max="400" step="5" defaultValue="250" aria-describedby="estimate-note" /></div><div className="estimator-result"><strong aria-live="polite">You could lose around <span id="estimated-loss">50</span> lbs</strong><p id="estimate-note">Based on published manufacturer clinical trials of GLP-1 medications at the highest studied doses in adults without diabetes. Individual results vary — this is an estimate, not a guarantee.</p><a href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your visit →</a></div></div></div></section>
<WeightLossMenopauseV2Faq intakeHref={WEIGHT_MENOPAUSE_INTAKE_URL} />
<section className="privacy-band wave-top wave-soft wave-flip"><div className="container privacy-row"><div className="shield"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><rect x="9" y="10" width="6" height="5" rx="1"></rect><path d="M10.5 10V8.7a1.5 1.5 0 0 1 3 0V10"></path></svg></div><div><h3>Private by design. Secure by standard.</h3><p>Health information and care-team messaging are handled through a secure care experience.</p></div><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your visit</a></div></section>
</main>
        <footer className="wave-top wave-footer">
          <div className="container">
            <div className="footer-top">
              <div>
                <div className="footer-wordmark">MMD Weight Loss</div>
                <p>Physician-guided weight-loss and hormone care, with seven days of follow-up support for each visit.</p>
              </div>
              <div className="footer-navigation">
                <div className="footer-links">
                  <a href="#how-it-works">How it works</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#faq">FAQ</a>
                </div>
                <a className="footer-phone" href="tel:+18883627011" aria-label="Call MedMethod Direct at +1 888-362-7011">Call us: <span>+1 888-362-7011</span></a>
              </div>
            </div>
            <div className="disclosures">
              {V2_FAQ_FOOTER_PARAGRAPHS.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="footer-bottom">
              <span className="footer-legal-copy">{V2_FAQ_COPYRIGHT}</span>
              <a
                className="footer-legitscript-seal"
                href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Verify LegitScript Approval for www.medmethoddirect.com"
              >
                <img
                  src="https://static.legitscript.com/seals/51795425.png"
                  alt="Verify Approval for www.medmethoddirect.com"
                  width="73"
                  height="79"
                />
              </a>
            </div>
            <nav className="footer-legal-nav" aria-label="MedMethod Direct legal links">
              <a className="footer-legal-login" href="https://medmethoddirect.md-hq.com/" target="_blank" rel="noopener noreferrer">Patient Login</a>
              <a href="/terms">Terms</a>
              <a href="/privacy-policy">Privacy</a>
              <a href="/hipaa-notice">HIPAA Notice</a>
              <a href="/shipping-policy">Shipping</a>
              <a href="/accessibility">Accessibility</a>
            </nav>
          </div>
        </footer>
      </div>
      <WeightLossMenopauseV2MobileBar />
    </div>
  );
}
