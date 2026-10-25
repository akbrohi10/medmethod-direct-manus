import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import treatmentCatalogJson from "@shared/treatmentCatalog.json";
import Navbar from "@/components/home1/Navbar";
import { initializeWeightLossMenopauseV2 } from "./weightLossMenopauseV2Interactions";
import "./WeightLossMenopauseV2.css";

export const WEIGHT_MENOPAUSE_INTAKE_URL = "https://intake.medmethoddirect.com/";
const PAGE_URL = "https://medmethoddirect.com/weight-loss-menopauseV2";
const PAGE_TITLE = "Weight-Loss & Menopause | MedMethod Direct";
const PAGE_DESCRIPTION = "Explore physician-guided GLP-1 weight management and menopause care with Dr. Jumana Al-Deek, including medication pricing and ongoing support.";
const PAGE_IMAGE = "https://medmethoddirect.com/manus-storage/wlm-embedded-3f0ba6b015e6_ac0b276d.jpg";
const PAGE_NAVIGATION = [
  { label: "How it works", anchor: "how-it-works" },
  { label: "The app", anchor: "app" },
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
<h1><span className="hero-headline-line">Text a Weight Loss <span className="hero-ampersand">&amp;</span><br />Hormone Doctor now.</span><span className="hero-headline-line hero-free"><em>For FREE!</em></span></h1>
<p className="hero-description">Explore your options for<br /><strong>GLP-1s, menopause &amp; hormone therapy.</strong></p>
<div className="hero-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}><span className="hero-cta-label">Start your visit <span className="arrow" aria-hidden="true">→</span></span><span className="hero-cta-timing">5–10 min</span></a></div>
<p className="hero-text-note">100% by text message — no video needed.</p>
</div><div className="phone-stage" aria-label="Illustrative secure text conversation with Dr. Al-Deek"><div className="phone"><div className="phone-screen"><div className="phone-top"><div className="notch"></div></div><div className="chat-head"><img className="chat-avatar" src="/manus-storage/wlm-embedded-bfde38427412_0754b2a5.jpg" alt="Dr. Jumana Al-Deek" /><div><strong>Dr. Al-Deek</strong><small><i className="online"></i> Secure text with your doctor</small></div></div><div className="chat-body" data-live-chat=""><div className="chat-date">Illustrative conversation</div><div className="chat-message" data-chat-at="400"><div className="bubble me">Hi Dr. Al-Deek,<br />I'd like to learn about my options for weight loss and hormones.</div><div className="chat-time patient-time">9:41 AM</div></div><div className="bubble typing-bubble" data-chat-at="1400" data-chat-hide="900" aria-hidden="true"><i></i><i></i><i></i></div><div className="chat-message" data-chat-at="2400"><div className="bubble">Of course! I'm happy to help. Let's discuss your goals and see what options may be right for you.</div><div className="chat-time">9:42 AM</div></div></div><div className="chat-composer" aria-hidden="true"><span>Type a message...</span><span className="chat-send">➤</span></div></div></div><div className="hipaa-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>HIPAA-compliant • secure text</div></div></div></section>
<section className="featured-in" aria-labelledby="featured-in-title" data-medmethod-scope=""><div className="featured-label" id="featured-in-title">Featured In</div><div className="featured-rail"><div className="featured-track"><div className="featured-set"><div className="featured-logo flow"><img src="/manus-storage/wlm-embedded-83ae62555e53_0c74bd61.png" alt="Flow Space" /></div><div className="featured-logo singlecare"><img src="/manus-storage/wlm-embedded-23f382110e31_32711544.png" alt="SingleCare" /></div><div className="featured-logo ntd"><img src="/manus-storage/wlm-embedded-12565d12c863_6e38e292.png" alt="NTD" /></div><div className="featured-logo scary"><img src="/manus-storage/wlm-embedded-5358c6c40f83_5daa438f.png" alt="Scary Mommy" /></div><div className="featured-logo daily-mail"><img src="/manus-storage/wlm-embedded-012f44dc2cde_10378029.png" alt="Daily Mail" /></div><div className="featured-logo yahoo-health"><img src="/manus-storage/wlm-embedded-08fb73a8f1d9_b8ef319d.png" alt="Yahoo Health" /></div><div className="featured-logo this-is-menopause"><img src="/manus-storage/wlm-embedded-003978802679_7273ba1a.png" alt="This Is Menopause" /></div><div className="featured-logo womans-world"><img src="/manus-storage/wlm-embedded-9dbf04b103e4_d30ff97e.png" alt="Woman’s World" /></div></div><div className="featured-set" aria-hidden="true"><div className="featured-logo flow"><img src="/manus-storage/wlm-embedded-83ae62555e53_0c74bd61.png" alt="" /></div><div className="featured-logo singlecare"><img src="/manus-storage/wlm-embedded-23f382110e31_32711544.png" alt="" /></div><div className="featured-logo ntd"><img src="/manus-storage/wlm-embedded-12565d12c863_6e38e292.png" alt="" /></div><div className="featured-logo scary"><img src="/manus-storage/wlm-embedded-5358c6c40f83_5daa438f.png" alt="" /></div><div className="featured-logo daily-mail"><img src="/manus-storage/wlm-embedded-012f44dc2cde_10378029.png" alt="" /></div><div className="featured-logo yahoo-health"><img src="/manus-storage/wlm-embedded-08fb73a8f1d9_b8ef319d.png" alt="" /></div><div className="featured-logo this-is-menopause"><img src="/manus-storage/wlm-embedded-003978802679_7273ba1a.png" alt="" /></div><div className="featured-logo womans-world"><img src="/manus-storage/wlm-embedded-9dbf04b103e4_d30ff97e.png" alt="" /></div></div></div></div></section>
<section className="section wave-top wave-soft" id="how-it-works"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps"><article className="step"><div className="step-num">1</div><h3>Complete your intake (5–10 min)</h3></article><article className="step"><div className="step-num">2</div><h3>Text with your doctor</h3></article><article className="step"><div className="step-num">3</div><h3>Discuss your options with your doctor, based on your evaluation.</h3></article></div></div></section>
<section className="medication-pricing" aria-labelledby="medication-pricing-title"><div className="container"><div className="section-heading"><h2 id="medication-pricing-title">Medication pricing, upfront.</h2><p><span>$49/month plus the cost of medication.</span><span data-glp1-price-copy=""> Exact medication prices are shown below.</span></p></div><div className="medication-switch" role="group" aria-label="Medication type"><button type="button" aria-pressed="true" aria-controls="glp1-medication-panel" data-medication-choice="glp1">GLP-1</button><button type="button" aria-pressed="false" aria-controls="hrt-medication-panel" data-medication-choice="hrt">HRT</button></div><div id="glp1-medication-panel" className="medication-panel" data-medication-panel="glp1" role="region" aria-label="GLP-1 medication options"><div className="medication-grid">{treatmentCatalog.glp1.options.map(treatment => <MedicationCard key={treatment.value} treatment={treatment} category="glp1" />)}</div></div><div id="hrt-medication-panel" className="medication-panel" data-medication-panel="hrt" role="region" aria-label="HRT medication options" hidden={true}><div className="medication-grid">{pageHrtOptions.map(treatment => <MedicationCard key={treatment.value} treatment={treatment} category="hrt" />)}</div></div></div></section><section className="estimator-band" aria-label="Weight-loss estimate"><div className="container"><div className="estimator-card"><div className="estimator-control"><label htmlFor="weight-estimate"><span>Select your current weight</span><output id="weight-value" htmlFor="weight-estimate">250 lbs</output></label><input id="weight-estimate" type="range" min="130" max="400" step="5" defaultValue="250" aria-describedby="estimate-note" /></div><div className="estimator-result"><strong aria-live="polite">You could lose around <span id="estimated-loss">50</span> lbs</strong><p id="estimate-note">Based on published manufacturer clinical trials of GLP-1 medications at the highest studied doses in adults without diabetes. Individual results vary — this is an estimate, not a guarantee.</p><a href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your visit →</a></div></div></div></section>
<section className="section wave-top wave-surface wave-flip" id="doctor"><div className="container doctor-grid"><div className="doctor-photo-wrap"><img className="doctor-photo" src="/manus-storage/wlm-embedded-3f0ba6b015e6_ac0b276d.jpg" alt="Portrait of Dr. Jumana Al-Deek" /><div className="doctor-tag"><strong>Dr. Jumana Al-Deek, DO, MS</strong><span>Board-certified family physician · Medical weight loss + metabolic health · Menopause specialist</span><span className="doctor-stat"><strong>50,000+</strong> patients seen</span><span className="doctor-reply">Typically within 4 hours, always within 24 hours.</span></div></div><div className="doctor-copy"><span className="section-kicker">The physician behind your care</span><h2>The doctor who was born for this!</h2><p className="doctor-wedge">You text Dr. Al-Deek directly — the same doctor, every time (she gets to know you).</p><p>Dr. Jumana Al-Deek is a board-certified family physician specializing in medical weight loss and metabolic health — and before medical school, she was a <strong>Certified Personal Trainer</strong>. She doesn't just understand the science of weight loss; she understands the challenge of it. With the right treatment plan and a provider who knows how to manage your journey responsibly, real change is possible. Author of <em>The Menopause Weight Loss Trap</em>.</p><div className="doctor-points"><div className="doctor-point"><strong>Clinical oversight</strong><span>Eligibility, medication choice, and dose decisions stay with the physician.</span></div><div className="doctor-point"><strong>Ongoing support</strong><span>Messaging and follow-up help keep treatment responsive over time.</span></div></div></div></div></section>
<section className="section everything wave-top wave-soft" id="app"><div className="container"><div className="app-combined-head"><div className="section-heading"><span className="section-kicker">FREE BONUS</span><h2>Fitness and nutrition, working together.</h2><p>One focused app experience brings workouts, food guidance, and progress tracking together—so every next step is easy to see.</p></div><ul className="app-summary" aria-label="Included app features"><li>2,500+ exercise videos</li><li>Custom workout plans</li><li>Meal plans + recipes</li><li>Macro + progress tracking</li></ul></div><div className="app-console"><div className="app-tabs" role="tablist" aria-label="Explore app features"><button className="feature-tab" type="button" role="tab" aria-selected="true" aria-controls="screen-workouts" data-screen="workouts"><span className="tab-index">01</span><span><strong>Guided workouts</strong><small>Videos, sets, reps, and timers</small></span></button><button className="feature-tab" type="button" role="tab" aria-selected="false" aria-controls="screen-nutrition" data-screen="nutrition"><span className="tab-index">02</span><span><strong>Nutrition planning</strong><small>Daily meals and macro targets</small></span></button><button className="feature-tab" type="button" role="tab" aria-selected="false" aria-controls="screen-recipes" data-screen="recipes"><span className="tab-index">03</span><span><strong>Recipe library</strong><small>Practical ideas built around goals</small></span></button><button className="feature-tab" type="button" role="tab" aria-selected="false" aria-controls="screen-library" data-screen="library"><span className="tab-index">04</span><span><strong>Exercise library</strong><small>2,500+ guided movements</small></span></button><button className="feature-tab" type="button" role="tab" aria-selected="false" aria-controls="screen-calendar" data-screen="calendar"><span className="tab-index">05</span><span><strong>Weekly progress</strong><small>Training schedule and check-ins</small></span></button></div><div className="app-viewport" aria-live="polite"><figure className="app-screen app-screen-workout" id="screen-workouts" role="tabpanel"><img src="/manus-storage/wlm-embedded-fbd2b168c8ca_a89fd235.webp" alt="Workout app screens with exercise videos, sets, repetitions, and interval timer" /><figcaption><strong>Every exercise, right in front of you.</strong><span>Follow the demonstration, log the work, and move through your session without guessing.</span></figcaption></figure><figure className="app-screen app-screen-square" id="screen-nutrition" role="tabpanel" hidden={true}><img src="/manus-storage/wlm-embedded-1f48e4523dc3_1680e6c5.webp" alt="Meal planner with large recipe photos for breakfast, lunch, and dinner" /><figcaption><strong>Know what’s on the menu.</strong><span>Daily meal guidance keeps nutrition practical instead of abstract.</span></figcaption></figure><figure className="app-screen app-screen-recipe" id="screen-recipes" role="tabpanel" hidden={true}><img src="/manus-storage/wlm-embedded-ea3f297d5b2e_7f5cf331.webp" alt="App recipe library with high-protein and weight-loss meal plan collections" /><figcaption><strong>Recipes built for real routines.</strong><span>Browse useful meal collections and turn nutrition targets into food you’ll actually make.</span></figcaption></figure><figure className="app-screen app-screen-library" id="screen-library" role="tabpanel" hidden={true}><div className="exercise-library-grid" aria-label="Sample exercise video library"><article className="exercise-card"><img src="/manus-storage/wlm-embedded-59e2999226cb_779a3328.webp" alt="Medicine-ball mountain climber exercise" /><strong>Mountain climbers</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-52a0cc7ed038_46fd0e8e.webp" alt="Banded squat exercise" /><strong>Banded squats</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-4ad8a436ed55_71c03368.webp" alt="Kettlebell lunge exercise" /><strong>Kettlebell lunges</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-6949a0cd0213_7d18c665.webp" alt="Jump rope exercise" /><strong>Jump rope</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-2f042902b7bb_0a4b80c0.webp" alt="Barbell lunge exercise" /><strong>Barbell lunges</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-aaff648e80c2_168d8738.webp" alt="Resistance band arm exercise" /><strong>Band training</strong></article><article className="exercise-card"><img src="/manus-storage/wlm-embedded-490b711e0687_5fca23a6.webp" alt="High lunge mobility exercise" /><strong>Mobility flow</strong></article></div><figcaption><strong>A real library, not a one-size-fits-all routine.</strong><span>Browse 2,500+ clear exercise demonstrations across strength, cardio, and mobility.</span></figcaption></figure><figure className="app-screen app-screen-calendar" id="screen-calendar" role="tabpanel" hidden={true}><img src="/manus-storage/wlm-embedded-5bfa212f950a_26cb9761.webp" alt="Training calendar with scheduled workouts and detailed exercise tracking" /><figcaption><strong>See the plan. See the progress.</strong><span>Your schedule, completed sessions, and next workout stay visible in one view.</span></figcaption></figure></div></div><p className="app-source-note">App experience shown for illustration; final MMD branding and app name are in development.</p></div></section>
<section className="section support-section wave-top wave-surface wave-flip"><div className="container"><div className="section-heading"><span className="section-kicker">More than a prescription</span><h2>The support around the medication matters.</h2><p>Your program brings clinical guidance and practical tools together, without forcing you to stitch them together yourself.</p></div><div className="feature-grid"><article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path></svg><h3>Physician-led decisions</h3><p>Your history and goals guide the plan. Medication is prescribed only when clinically appropriate.</p></article><article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 3h10v4H7zM5 7h14v14H5z"></path><path d="M9 12h6M12 9v6"></path></svg><h3>Medication management</h3><p>Receive refill support, dose guidance, and clear next steps based on your response to treatment.</p></article><article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19c4-9 8-12 16-14-1 8-4 14-12 14H4Z"></path><path d="M8 19c2-5 5-8 9-10"></path></svg><h3>Personalized nutrition</h3><p>Use personalized meal plans, a recipe builder, macro targets, and a food journal to make daily choices easier.</p></article><article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"></path></svg><h3>2,500+ exercise videos</h3><p>Explore a broad video library and follow custom workout plans created through the in-app workout builder.</p></article><article className="feature-item"><svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"></path></svg><h3>Progress you can see</h3><p>Track key metrics and progress photos over time, so changes are easier to recognize beyond the scale.</p></article></div></div></section>
<section className="section pricing-section wave-top wave-soft" id="pricing"><div className="container"><div className="section-heading"><span className="section-kicker">Straightforward pricing</span><h2>$49 today. $49 monthly.</h2><p>One membership: physician-led care, direct texting with Dr. Al-Deek — plus a free bonus: the fitness + nutrition app.</p></div><div className="bonus-banner"><div><div className="bonus-main"><strong>FREE BONUS</strong><span>Guided workouts, meal plans &amp; macro tracking, included at no extra cost.</span></div><p className="bonus-frame">Medication alone rarely keeps weight off — so the full program is included, free.</p></div><blockquote className="bonus-quote">“Having guided workouts and nutrition plans to follow gives me structure without having to figure everything out myself.”<cite>— Sarah, 32</cite></blockquote></div><div className="membership-price" aria-label="Membership pricing"><strong>$49/month</strong><span>First month due today · then monthly · cancel anytime.</span><p className="video-addon">Want face time? Add a video visit for $30.</p></div><div className="pricing-actions"><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your visit <span className="arrow">→</span></a></div><p className="price-footnote">Medication priced separately</p></div></section>
<section className="section testimonials wave-top wave-band wave-flip" id="testimonials"><div className="container"><div className="section-heading"><span className="section-kicker">Member perspectives</span><h2>Care that feels connected to real life.</h2></div><div className="testimonial-grid"><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>I was nervous about starting medical weight loss and had so many questions. Dr. Al-Deek is incredibly easy to chat with. Being able to text her directly makes me comfortable asking questions as they come up.</blockquote><footer>Layla, 25</footer></article><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>The free mobile app has been such a helpful addition. Having guided workouts and nutrition plans to follow gives me structure without having to figure everything out myself. It makes the day-to-day part of my weight loss plan feel more manageable.</blockquote><footer>Sarah, 32</footer></article><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>Having the same doctor throughout my care is a big reason I continue working with Dr. Al-Deek. She knows my history, remembers what we’ve discussed, and builds on those conversations. We’ve developed a real rapport, and I feel comfortable being honest about my challenges.</blockquote><footer>Lindsey, 39</footer></article><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>I appreciate how much thought Dr. Al-Deek puts into her recommendations. She asks questions, gets to know my situation, and explains her reasoning. Even through messaging, I feel heard and involved in my care.</blockquote><footer>Michelle, 45</footer></article><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>I wanted guidance with exercise and nutrition alongside my medical weight loss care. The free app gives me workouts and nutrition plans to follow, while Dr. Al-Deek provides personalized medical guidance. Having both has helped me feel more supported.</blockquote><footer>Rania, 50</footer></article><article className="testimonial-card"><span className="testimonial-rating" aria-label="5 out of 5 stars">★★★★★</span><blockquote>The convenience initially drew me in, but the ongoing relationship is what keeps me here. Everything happens through messaging, and I continue working with Dr. Al-Deek as we discuss my progress and any changes needed. She’s approachable, straightforward, and easy to talk to.</blockquote><footer>Omar, 42</footer></article></div></div></section>
<section className="section wave-top wave-surface" id="faq"><div className="container faq-layout"><div className="section-heading"><span className="section-kicker">Questions, answered</span><h2>What to know before you begin.</h2><p>Final clinical, pharmacy, pricing, and state-availability language should be reviewed before launch.</p></div><div className="faq-list"><details><summary>Who may be eligible for GLP-1 treatment?</summary><p>Eligibility depends on factors such as health history, current medications, weight-related goals, and the clinician’s judgment. Completing an assessment does not guarantee a prescription.</p></details><details><summary>How do GLP-1 medications support weight loss?</summary><p>GLP-1 medicines act on pathways involved in appetite, fullness, and blood-sugar regulation. The physician will explain whether a particular option may be appropriate for you.</p></details><details><summary>What side effects should I know about?</summary><p>Side effects vary by medication and person. Gastrointestinal symptoms can occur. Your clinician will review risks, warning signs, and what to do if you have a concern before treatment begins.</p></details><details><summary>How much does medication cost?</summary><p>Medication is priced separately and shown up front before purchase. Cost may vary by medication and dose. The clinical membership fee does not include medication.</p></details><details><summary>What is included in the fitness + nutrition app?</summary><p>Membership includes MMD’s fitness and nutrition app with a library of 2,500+ exercise videos, custom workout plans, personalized meal plans and recipe-building tools, macro and food-journal tracking, plus progress metrics and photos. The final app name and store links are still TBD.</p></details><details><summary>Do I need a video appointment?</summary><p>Your visit begins asynchronously. After you submit the intake, you log in to your secure patient portal and we send a secure text message straight to your phone. That text thread is your care chat—there’s no separate messaging app to download. Dr. Al-Deek typically responds within 4 hours, always within 24 hours, and may request a visit or additional information when clinically needed.</p></details><details><summary>Which states are available?</summary><p>State availability is TBD. A verified list must be added before launch.</p></details><details><summary>When is the $49 consultation refunded?</summary><p>The proposed policy is to refund the consultation when the clinician determines no prescription is appropriate after review. Final terms, timing, and exclusions are TBD.</p></details><details><summary>Are compounded medications FDA-approved?</summary><p>No. Compounded medications are not FDA-approved. If a compounded option is considered, your clinician should explain why and discuss relevant risks and alternatives.</p></details></div></div></section>
<section className="privacy-band wave-top wave-soft wave-flip"><div className="container privacy-row"><div className="shield"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><rect x="9" y="10" width="6" height="5" rx="1"></rect><path d="M10.5 10V8.7a1.5 1.5 0 0 1 3 0V10"></path></svg></div><div><h3>Private by design. Secure by standard.</h3><p>Health information and care-team messaging are handled through a secure care experience.</p></div><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your visit</a></div></section>
</main>
        <footer className="wave-top wave-footer">
          <div className="container">
            <div className="footer-top">
              <div>
                <div className="footer-wordmark">MMD Weight Loss</div>
                <p>Physician-guided GLP-1 care with fitness, nutrition, and ongoing support in one program.</p>
              </div>
              <div className="footer-navigation">
                <div className="footer-links">
                  <a href="#how-it-works">How it works</a>
                  <a href="#app">The app</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#faq">FAQ</a>
                </div>
                <a className="footer-phone" href="tel:+18883627011" aria-label="Call MedMethod Direct at +1 888-362-7011">Call us: <span>+1 888-362-7011</span></a>
              </div>
            </div>
            <div className="disclosures">
              <p><strong>Prototype disclosure:</strong> state availability, app details, refund terms, and other operational details marked TBD must be confirmed before launch.</p>
              <p>Compounded medications are not FDA-approved. A prescription is never guaranteed and is issued only when a licensed clinician determines treatment is appropriate. Individual results vary. Weight-loss medication carries risks and may not be appropriate for everyone.</p>
              <p>For adults age 18 and older. Services are available only in states where the treating clinician is licensed; final state availability list is TBD. This website does not provide emergency care.</p>
            </div>
            <div className="footer-bottom">
              <span className="footer-legal-copy">© 2026 MMD Weight Loss. Working title and prototype content.</span>
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
              <a href="/subscription-policy">Subscription &amp; Refunds</a>
              <a href="/shipping-policy">Shipping</a>
              <a href="/accessibility">Accessibility</a>
            </nav>
          </div>
        </footer>
        <div className="sticky-cta" aria-hidden="true"><span className="sticky-cta-price">$49<small>/mo</small></span><a className="btn" href={WEIGHT_MENOPAUSE_INTAKE_URL} aria-label="Start your visit — $49 per month membership">Start your visit <span className="arrow">→</span></a></div>
      </div>
    </div>
  );
}
