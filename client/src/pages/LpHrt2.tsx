/* =============================================================================
   /lp/hrt2 — A/B Test Landing Page (3-month plan)
   Design: Midi Health–inspired editorial/magazine style
   - Cream backgrounds, serif headlines, condition carousel
   - Stripped nav (logo + Book Now only)
   - Single repeated CTA → opens existing ConsultationModal
   ============================================================================= */
import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
const LpConsultationModal2 = React.lazy(() => import("@/components/home1/LpConsultationModal2"));
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ─── Assets ──────────────────────────────────────────────────────────────────
const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";
const DR_PHOTO = "/manus-storage/dr-aldeek-hero-2026_628d7e54_ddae4722.png";
const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/hrt2-hero-telehealth-patch-PjquXUwLssTUdwpgQBRfTK.webp";

const CONDITIONS = [
  {
    title: "Hot Flashes & Night Sweats",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-hotflashes-ayi2TzXcHCcgkcufKazGTN.webp",
  },
  {
    title: "Weight Gain",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-weightgain-v2-nK2psrLF5MCkdvbZgXMQWN.webp",
  },
  {
    title: "Brain Fog & Moodiness",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-brainfog-v2-cUscmfbqbvpMk9eBdkNgvX.webp",
  },
  {
    title: "Trouble Sleeping",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-sleep-cAHyrBU4YjcA4UgCAyPWmy.webp",
  },
  {
    title: "Mood Changes & Anxiety",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-mood-v2-EdYkds9dXSDNPvLRcXEQDL.webp",
  },
  {
    title: "Menopause",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-menopause-a79CVoKTMNP2ZhyD8UMeBp.webp",
  },
  {
    title: "Painful Sex, Vaginal Dryness & Libido",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-sexual-v2-iSrXZ39brxC7LWgBRUtfr2.webp",
  },
  {
    title: "Hair & Skin Changes",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-hairskin-diverse-DuDBJom9nS6f8rRiiiFJh6.webp",
  },
  {
    title: "Irregular Periods",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-periods-P8hMHgBRemkLcBZeNNGUVa.webp",
  },
  {
    title: "Joint Pain & Bone Loss",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-jointpain-diverse-DDFsWqK9XutCXLGXbD9TPQ.webp",
  },
  {
    title: "Hormone Optimization",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-hormones-jmbuf4UVP6j9jChDVDvpQK.webp",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Book Your Visit",
    desc: "Pick a time that works for you and schedule your virtual appointment in under 5 minutes.",
  },
  {
    num: "02",
    title: "Fill Out Your Intake Form",
    desc: "Complete your health questionnaire and upload recent labs (within 6 months). Don't have labs? We can order them for you.",
  },
  {
    num: "03",
    title: "Virtual Consultation",
    desc: "Meet Dr. Al-Deek one-on-one via video to discuss your concerns and build your care plan.",
  },
  {
    num: "04",
    title: "Your Treatment Plan",
    desc: "Receive your personalized protocol — medications shipped to your door with ongoing support.",
  },
];

const FAQS = [
  {
    q: "What are the benefits of hormone replacement therapy?",
    a: "HRT can relieve hot flashes, night sweats, vaginal dryness, mood swings, brain fog, and sleep disruption. It also supports bone density, cardiovascular health, and metabolic function when prescribed appropriately.",
  },
  {
    q: "Is virtual care as effective as in-person visits?",
    a: "Yes. Telehealth visits allow the same thorough evaluation, lab review, and treatment planning as in-person appointments — with the added convenience of no commute, no waiting room, and access from any state where we're licensed.",
  },
  {
    q: "I heard that hormone replacement therapy isn't safe — is that true?",
    a: "Modern evidence shows that for most women, the benefits of HRT far outweigh the risks — especially when started within 10 years of menopause onset. Dr. Al-Deek uses bioidentical hormones and evidence-based protocols tailored to your individual risk profile.",
  },
  {
    q: "When should I start hormone replacement therapy?",
    a: "The ideal window is within 10 years of your last period or before age 60. However, many women benefit from HRT at any stage of menopause. During your consultation, we'll evaluate your symptoms, labs, and history to determine the right timing for you.",
  },
  {
    q: "How long can I safely be on HRT?",
    a: "There is no universal time limit. Many women stay on HRT for years with regular monitoring. We reassess your protocol annually based on updated labs, symptoms, and the latest clinical guidelines.",
  },
  {
    q: "What GLP-1 medications do you prescribe for weight loss?",
    a: "We prescribe semaglutide (Ozempic/Wegovy) and tirzepatide (Mounjaro/Zepbound) based on your metabolic profile, goals, and insurance situation. All prescriptions include physician monitoring and dosage titration.",
  },
  {
    q: "Why is it a 3-month plan?",
    a: "Whether it's hormone therapy or GLP-1 medications, your body needs time to respond — and your protocol needs careful adjustment based on how you feel. Month 1 is your consultation, labs review, and initial prescription. Months 2 and 3 give Dr. Al-Deek time to monitor how your body is responding, adjust dosages, manage any side effects, and dial in the right protocol before transitioning you to ongoing maintenance care. Most patients start noticing changes within the first few weeks, but the full benefit comes from staying the course.",
  },
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a membership-based practice. We do not bill insurance directly, but we provide superbills you can submit for potential reimbursement. Many patients find our pricing comparable to — or less than — specialist copays.",
  },
  {
    q: "How much does medication cost?",
    a: "Our program fee covers your physician visits, lab review, personalized protocol, and ongoing monitoring. Medication is billed separately, and costs vary by the medication prescribed, dosage, dispensing pharmacy, and insurance coverage. Dr. Al-Deek will review clinically appropriate options and expected costs during your consultation.",
  },
  {
    q: "What states are you licensed in?",
    a: "Dr. Al-Deek is licensed to practice in 17 states including Virginia, Maryland, DC, Florida, North Carolina, Pennsylvania, Colorado, Arizona, Texas, and more. Check our locations page for the full list.",
  },
];

const TREATMENTS = [
  {
    title: "Safety First",
    desc: "Every treatment plan begins with a comprehensive health evaluation and lab work. We screen for contraindications and monitor your progress with regular check-ins and repeat labs.",
  },
  {
    title: "Personalized Formulations",
    desc: "No two patients are alike. Your hormones, metabolism, and lifestyle inform a protocol built specifically for you — whether that's bioidentical estrogen, progesterone, testosterone, thyroid, or GLP-1 therapy.",
  },
  {
    title: "Precise Dosing",
    desc: "We start conservatively and titrate based on your symptom response and lab values. Dosage adjustments happen in real-time through ongoing physician communication — not on a fixed schedule.",
  },
  {
    title: "Ongoing Monitoring",
    desc: "Your care doesn't end at the prescription. We schedule follow-ups, track biomarkers, and adjust your protocol as your body responds — ensuring optimal outcomes long-term.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function LpHrt() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const el = document.getElementById('hero-cta-sentinel');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setShowStickyCTA(rect.bottom < 0);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  const openConsult = () => setConsultOpen(true);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet>
        <title>Hormone Therapy & Weight Loss — 100% Virtual | MedMethod Direct</title>
        <meta
          name="description"
          content="Board-certified physician-led hormone therapy, menopause care, and GLP-1 weight loss — 100% virtual. Book your consultation with Dr. Al-Deek today."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ═══════════════ STRIPPED NAV ═══════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO} alt="MedMethod Direct" className="h-12 w-auto" />
          </a>
          <button
            onClick={openConsult}
            className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
        </div>
      </header>

      <main className="overflow-x-hidden">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="bg-[#FDF8F3] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* Left — Copy */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8339E] tracking-wide uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E8339E] animate-pulse" />
                100% Virtual Care
              </p>
              <h1 className="font-['Nunito_Sans',sans-serif] text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] font-extrabold text-gray-900 mb-4 sm:mb-6">
                Hormone therapy &amp; GLP-1 weight loss,{" "}
                <span className="text-[#E8339E]">prescribed by a specialist.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Most women notice a difference <span className="text-[#E8339E] font-semibold">within days</span>, not months — 100% virtual, from the comfort of your home.
              </p>
              <div id="hero-cta-sentinel">
                <button
                  onClick={openConsult}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Reserve Your Appt. — $50 Deposit
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto md:mx-0">
                $50 deposit today, $149 due at your visit — $199 total for Month 1.
              </p>
              {/* Social proof */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500 mx-auto md:mx-0 w-fit">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                  Helped thousands of patients
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                  Licensed in 17 states
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                  Author of <em>The Menopause Weight Loss Trap</em>
                </span>
              </div>
            </div>
            {/* Right — Hero image */}
            <div className="order-1 md:order-2 flex justify-center">
              <img
                src={HERO_IMG}
                alt="Confident woman feeling healthy and vital"
                className="w-full max-w-[320px] sm:max-w-md rounded-2xl shadow-2xl object-cover aspect-[3/4]"
              />
            </div>
          </div>
        </section>

        {/* ═══════════════ DR. BIO ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-8 md:gap-10 items-start">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              <img
                src={DR_PHOTO}
                alt="Dr. Jumana Al-Deek, DO"
                className="w-full max-w-[300px] sm:max-w-[320px] md:w-full md:max-w-[360px] rounded-2xl shadow-lg object-cover aspect-[3/4]"
              />
            </div>
            {/* Bio */}
            <div>
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Your Physician
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Dr. Jumana Al-Deek, DO
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Author of <em className="text-gray-900 font-medium">The Menopause Weight Loss Trap</em> — one of the fastest-emerging books in its category.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Board-Certified DO", "Menopause Specialist", "Medical Weight Loss", "Metabolism", "Author", "Mom of Four", "Licensed in 17 States"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FDF2F8] text-[#E8339E] border border-pink-100"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>
              <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-[0.95rem] sm:text-[1.05rem]">
                <p className="text-gray-600 italic text-lg">
                  She gets it. Not from a textbook. From real life.
                </p>
                <p>
                  Dr. Al-Deek's mission is singular: helping women in perimenopause and menopause feel like themselves again. She knows what it feels like when your body stops responding the way it used to — when the brain fog hits mid-sentence, when the scale won't budge no matter what you do, when you don't recognize yourself anymore.
                </p>
                <p className="font-semibold text-gray-900">
                  But here's what makes her different from every other doctor you've seen:
                </p>
                <p>
                  Long before medical school, Dr. Al-Deek was a certified personal trainer working exclusively with women navigating hormonal changes and weight gain. She spent years on the gym floor watching the same story repeat — women doing everything "right" but losing the battle against their own hormones.
                </p>
                <p>
                  That experience didn't just shape her — it <em>drove</em> her to medicine. She went to medical school specifically to solve this problem at its root. Not to manage symptoms. To fix what's actually happening inside.
                </p>
                <p>
                  Today, she's the same advocate who's been in your corner for over a decade — except now she's armed with a medical degree, clinical tools, and the expertise to rebalance your hormones and give you your life back.
                </p>
                <p className="font-semibold text-gray-900 text-lg">
                  She's not just your doctor. She's the doctor who was built for this.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════ CONDITIONS CAROUSEL ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-6 sm:mb-10">
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                How Hormone Replacement Therapy Works
              </h2>
              <p className="text-gray-600 max-w-3xl text-base sm:text-lg leading-relaxed">
                Not only does HRT replenish estrogen and progesterone to bring you relief, but it helps protect your heart, bones and other organs from the side effects of estrogen deficiency.
              </p>
            </div>
            {/* Carousel controls */}
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            {/* Scrollable cards — Midi-style large image + title only */}
            <div
              ref={carouselRef}
              className="relative flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {CONDITIONS.map((c) => (
                <div
                  key={c.title}
                  className="snap-start shrink-0 w-[220px] sm:w-[280px] lg:w-[320px] group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug">
                    {c.title}
                  </h3>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════ PERSONALIZED TREATMENT ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Your Protocol
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Personalized Treatment, Prescribed by an Expert
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Every patient receives a treatment plan built around their unique labs, symptoms, and goals — not a one-size-fits-all protocol.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {TREATMENTS.map((t, i) => (
                <AccordionItem
                  key={i}
                  value={`treatment-${i}`}
                  className="border border-gray-200 rounded-xl px-5 group data-[state=open]:border-[#E8339E] transition-colors duration-150"
                >
                  <AccordionTrigger className="text-base font-semibold text-[#7A1E7E] hover:no-underline py-5 [&>svg]:text-[#E8339E] [&>svg]:stroke-[#E8339E]">
                    {t.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-[15px] pb-5">
                    {t.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ═══════════════ PRICING ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
              Transparent Pricing
            </p>
            <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your <span style={{fontVariantNumeric: 'lining-nums'}}>3</span>-Month Care Plan
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 sm:mb-12">
              Thoughtful, physician-led care built around you.
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto -mt-6 mb-8 sm:mb-12">
              Pricing above covers physician care, monitoring, and prescribing. Medication is billed separately, and costs vary by medication, dosage, dispensing pharmacy, and insurance coverage. Dr. Al-Deek will review clinically appropriate options and expected costs during your consultation.
            </p>

            {/* Unified Timeline Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto p-6 sm:p-10 text-left">

              {/* Month 1 */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-gradient-to-b border-[#E8339E]/40 ml-3 sm:ml-4">
                {/* Timeline dot */}
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 1</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$199</span>
                </div>
                <p className="text-base text-gray-600 mb-1">$199 total for Month 1 — $50 today to reserve your appointment, $149 due the day of your visit.</p>

                {/* Hero feature — Live Video Consultation */}
                <div className="bg-gradient-to-r from-[#E8339E]/5 to-[#7A1E7E]/5 border border-[#E8339E]/20 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">45-Minute Live Video Consultation</p>
                      <p className="text-base text-gray-600 mt-1">Face-to-face with Dr. Al-Deek — your personalized protocol &amp; prescription</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Also included:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Comprehensive lab review</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Custom protocol design</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Personalized treatment &amp; prescription</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Direct text access with Dr. Al-Deek</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Patient dashboard &amp; tracking</span>
                  </div>

                </div>
              </div>

              {/* Month 2 */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-[#E8339E]/25 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 2</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$99</span>
                </div>
                <p className="text-base text-gray-700 mb-4 leading-relaxed">
                  Your plan is in action — Dr. Al-Deek monitors progress and adjusts as needed.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Direct text access with Dr. Al-Deek</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Prescription renewals &amp; refills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Dosage adjustments as needed</span>
                  </div>

                </div>
              </div>

              {/* Month 3 */}
              <div className="relative pl-10 sm:pl-12 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 3</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$99</span>
                </div>
                <p className="text-base text-gray-700 mb-4 leading-relaxed">
                  Your protocol is dialed in — seamlessly continue with ongoing access to Dr. Al-Deek.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Direct text access with Dr. Al-Deek</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Prescription renewals &amp; refills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Dosage adjustments as needed</span>
                  </div>

                </div>
              </div>

              {/* CTA inside card */}
              <div className="mt-10 text-center">
                {/* Trust strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Cancel anytime
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  HIPAA-secure
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Real doctor, not a chatbot
                </span>
              </div>
              <button
                  onClick={openConsult}
                  className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Reserve Your Appt. — $50 Deposit
                </button>
                <p className="mt-3 text-xs text-gray-400">Currently accepting new patients — limited availability</p>
              </div>
            </div>

            {/* Notes below card */}
            <div className="mt-8 max-w-2xl mx-auto space-y-3">
              <p className="text-base text-gray-600">
                After your 3-month plan, keep your physician access active at <span className="font-semibold">$99/mo</span> — cancel anytime with 30 days notice.
              </p>
              <p className="text-base text-gray-500">
                Need an additional video visit? Available à la carte for <span className="font-semibold text-gray-700">$149</span> per appointment.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ PRESCRIPTION FULFILLMENT ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Filling Your Prescription
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your Prescription, Reviewed With You
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                If medication is clinically appropriate, Dr. Al-Deek will explain the medication, expected costs, insurance considerations, and available fulfillment before you decide how to proceed.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Individualized medication review</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Medication choice and fulfillment depend on your health history, clinical needs, pharmacy availability, and insurance coverage. Compounded medications are not FDA-approved, and FDA does not review compounded drugs for safety, effectiveness, or quality before marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-14">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Getting Started
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {STEPS.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{s.num}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Questions?
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-gray-200 bg-white rounded-xl mb-3 px-5 border">
                  <AccordionTrigger className="text-[15px] font-semibold text-gray-900 hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-[15px]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to feel like yourself again?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Book a virtual discovery call with Dr. Al-Deek. No commitment, no pressure — just expert guidance on your next step.
            </p>
            <button
              onClick={openConsult}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Book Now
            </button>
            <p className="mt-4 text-sm text-gray-400">
              100% virtual · Licensed in 17 states · No insurance needed
            </p>
          </div>
        </section>
      </main>

      {/* ═══════════════ MINIMAL FOOTER ═══════════════ */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO} alt="MedMethod Direct" className="h-12 w-auto brightness-0 invert" />
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MedMethod Direct. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/hipaa-notice" className="hover:text-white transition-colors">HIPAA</a>
          </div>
        </div>
      </footer>

      {/* ═══════════════ STICKY MOBILE CTA ═══════════════ */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[env(safe-area-inset-bottom,12px)] pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ pointerEvents: showStickyCTA ? 'auto' : 'none' }}
        aria-hidden={!showStickyCTA}
      >
        <div className="flex gap-2">
          <button
            onClick={openConsult}
            className="flex-1 flex flex-col items-center justify-center gap-0 py-3 rounded-full text-white font-bold shadow-lg active:scale-[0.98] transition-transform duration-150"
            style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              boxShadow: "0 8px 24px rgba(122, 30, 126, 0.35)",
            }}
          >
            <span className="text-[14px] font-extrabold tracking-wide uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Book Now</span>
            <span className="text-[11px] font-semibold opacity-90" style={{ fontFamily: "Montserrat, sans-serif" }}>$50 Today</span>
          </button>
          <a
            href="tel:+18883627011"
            className="flex-1 flex flex-col items-center justify-center gap-0 py-3 rounded-full font-bold active:scale-[0.98] transition-transform duration-150"
            style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              boxShadow: "0 8px 24px rgba(122, 30, 126, 0.35)",
              color: "#fff",
            }}
          >
            <span className="text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.7)" }}>Have questions?</span>
            <span className="text-[13px] font-extrabold tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Call Now</span>
          </a>
        </div>
      </div>
      {/* Bottom spacer so footer content isn't hidden behind sticky CTA on mobile */}
      <div className={`sm:hidden transition-all duration-300 ${showStickyCTA ? 'h-20' : 'h-0'}`} />
      {/* ═══════════════ CONSULTATION MODAL ═══════════════ */}
      <React.Suspense fallback={null}>
        <LpConsultationModal2
          open={consultOpen}
          onClose={() => setConsultOpen(false)}
        />
      </React.Suspense>
    </>
  );
}
