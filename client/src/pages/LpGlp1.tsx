/* =============================================================================
   /lp/glp1 — GLP-1 Weight Loss Landing Page
   Design: Bold visual energy hero with brush-stroke style emphasis
   - Weight loss focused for all women (30-60+)
   - Same structure as /lp/hrt2 but adapted for GLP-1 audience
   ============================================================================= */
import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
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
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-hero-seated-telehealth-v2-SfEcjWqMdpjwZWuFHrkh9R.webp";

const BARRIERS = [
  {
    title: "Slow Metabolism",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-weightgain-v2-nK2psrLF5MCkdvbZgXMQWN.webp",
  },
  {
    title: "Constant Cravings",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-cravings-8iJjjCutCDpHRnerUK2Fpv.webp",
  },
  {
    title: "Weight Loss Plateau",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-plateau-3AFH4ovwwXQ9LYNwh9e8QP.webp",
  },
  {
    title: "Emotional Eating",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-mood-v2-EdYkds9dXSDNPvLRcXEQDL.webp",
  },
  {
    title: "Insulin Resistance",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-insulin-ksrcXet3nSkk2pTJoUDwmd.webp",
  },
  {
    title: "Hormonal Weight Gain",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-hormonal-weightgain-T7EYmm92fFhinGUE9wRfBJ.webp",
  },
  {
    title: "Post-Pregnancy Weight",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-postpregnancy-TazbDoT99TaVNkuWuMh3fF.webp",
  },
  {
    title: "Fatigue & Low Energy",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-fatigue-CNiWCfCedPGfSevVHrAXBo.webp",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Book Your Visit",
    desc: "Pick a time that works and schedule your virtual appointment in under 5 minutes.",
  },
  {
    num: "02",
    title: "Complete Intake",
    desc: "Fill out your health questionnaire and upload recent labs. No labs? We'll order them for you.",
  },
  {
    num: "03",
    title: "Meet Your Doctor",
    desc: "Video consultation with Dr. Al-Deek to discuss your goals and build your personalized care plan.",
  },
  {
    num: "04",
    title: "Start Treatment",
    desc: "Receive your GLP-1 protocol — medications shipped to your door with ongoing physician support.",
  },
];

const FAQS = [
  {
    q: "What are GLP-1 medications and how do they work?",
    a: "GLP-1 receptor agonists (like semaglutide and tirzepatide) mimic a natural hormone that regulates appetite, slows digestion, and improves insulin sensitivity. They help you feel full sooner and reduce cravings — making it easier to eat less without constant willpower.",
  },
  {
    q: "What medications do you prescribe?",
    a: "We prescribe semaglutide (the active ingredient in Ozempic and Wegovy) and tirzepatide (the active ingredient in Mounjaro and Zepbound). Dr. Al-Deek will recommend the best option based on your health profile, goals, and budget.",
  },
  {
    q: "How much weight can I expect to lose?",
    a: "Clinical studies show patients typically lose 15–20% of their body weight over 12–18 months. Individual results vary based on starting weight, adherence, and lifestyle factors. Dr. Al-Deek monitors your progress monthly and adjusts your protocol to optimize results.",
  },
  {
    q: "What are the common side effects?",
    a: "The most common side effects are mild nausea, reduced appetite, and occasional digestive changes — especially in the first few weeks. These typically improve as your body adjusts. Dr. Al-Deek starts you at a low dose and titrates slowly to minimize side effects.",
  },
  {
    q: "Why is it a 3-month plan?",
    a: "GLP-1 medications require careful dosage titration — starting low and gradually increasing based on how your body responds. Month 1 is your consultation and initial prescription. Months 2 and 3 give Dr. Al-Deek time to monitor your progress, adjust dosages, manage any side effects, and dial in the right protocol. Most patients start noticing changes within the first few weeks, but the full benefit comes from staying the course.",
  },
  {
    q: "Is virtual care as effective as in-person visits?",
    a: "Yes. Telehealth visits allow the same thorough evaluation, lab review, and treatment planning as in-person appointments — with the added convenience of no commute, no waiting room, and access from any state where we're licensed.",
  },
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a membership-based practice. We do not bill insurance directly, but we can prescribe brand-name medications to your local pharmacy for insurance pickup. If your insurance doesn't cover GLP-1s for weight loss, we're happy to complete a prior authorization for an additional cost.",
  },
  {
    q: "What states are you licensed in?",
    a: "Dr. Al-Deek is licensed to practice in 17 states including Virginia, Maryland, DC, Florida, North Carolina, Pennsylvania, Colorado, Arizona, Texas, and more. Check our locations page for the full list.",
  },
];


// ─── Component ───────────────────────────────────────────────────────────────
export default function LpGlp1() {
  const [consultOpen, setConsultOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        <title>Medical Weight Loss — Semaglutide & Tirzepatide | MedMethod Direct</title>
        <meta
          name="description"
          content="Physician-guided GLP-1 weight loss with semaglutide and tirzepatide. Prescribed by a specialist, not a chatbot. 100% virtual. Book your consultation today."
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
        {/* ═══════════════ HERO — BOLD VISUAL ENERGY ═══════════════ */}
        <section className="bg-[#FDF8F3] relative overflow-hidden">
          {/* Subtle gradient accent behind text */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#E8339E]/10 to-[#7A1E7E]/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 lg:py-24 grid md:grid-cols-[1fr_1fr] lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center relative z-10">
            {/* Left — Copy */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8339E] tracking-wide uppercase mb-5">
                <span className="w-2 h-2 rounded-full bg-[#E8339E] animate-pulse" />
                GLP-1 Weight Loss
              </p>
              <h1 className="font-['Nunito_Sans',sans-serif] text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-5xl leading-[1.15] font-extrabold text-gray-900 mb-5">
                Medically guided <span className="whitespace-nowrap">weight loss,</span><br className="hidden md:block" />
                <span className="text-[#E8339E]">prescribed by a specialist.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                Semaglutide & Tirzepatide — most patients see results <span className="text-[#E8339E] font-semibold">within weeks</span>, not months. <span className="text-[#E8339E] font-semibold">100% virtual</span>, from the comfort of your home.
              </p>
              <button
                onClick={openConsult}
                className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Book Now — $50 Deposit
              </button>
              {/* Social proof */}
              <div className="mt-5 flex flex-col sm:flex-row flex-wrap items-start sm:items-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-500">
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
                  15–20% avg body weight loss
                </span>
              </div>
            </div>
            {/* Right — Hero image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <img
                src={HERO_IMG}
                alt="Woman smiling during a virtual telehealth consultation from her kitchen"
                className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[460px] rounded-2xl shadow-2xl object-cover aspect-[4/5]"
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
                {["Board-Certified DO", "Medical Weight Loss", "Metabolism Expert", "GLP-1 Specialist", "Author", "Licensed in 17 States"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FDF2F8] text-[#E8339E] border border-[#E8339E]/20"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
                <p>
                  Dr. Al-Deek is a board-certified physician specializing in medical weight loss and metabolic health. She has helped thousands of patients achieve sustainable weight loss through physician-guided GLP-1 therapy — not quick fixes or one-size-fits-all protocols.
                </p>
                <p>
                  Unlike telehealth mills that hand out prescriptions without real oversight, Dr. Al-Deek personally manages every patient's care. She monitors your progress, adjusts your dosage, and addresses the underlying metabolic factors that make weight loss difficult — including hormonal imbalances, insulin resistance, and thyroid dysfunction.
                </p>
                <p>
                  Her approach combines the latest GLP-1 medications (semaglutide and tirzepatide) with comprehensive metabolic evaluation — because sustainable weight loss requires more than just appetite suppression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ WEIGHT LOSS BARRIERS CAROUSEL ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Sound Familiar?
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                What's Been Holding You Back
              </h2>
            </div>
            {/* Carousel */}
            <div className="relative">
              <button
                onClick={() => scrollCarousel("left")}
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {BARRIERS.map((c) => (
                  <div
                    key={c.title}
                    className="min-w-[240px] sm:min-w-[280px] flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white"
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 text-center">
                      <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollCarousel("right")}
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW GLP-1s WORK ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                The Science
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                How GLP-1 Medications Work
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                GLP-1 receptor agonists work with your body's natural systems to make weight loss achievable — without relying on willpower alone.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "Reduce Appetite",
                  desc: "Signal your brain that you're full sooner, naturally reducing how much you eat without feeling deprived.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m12.02 12.02l.707.707M5.636 18.364l.707-.707m12.02-12.02l.707-.707" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Boost Metabolism",
                  desc: "Enhance insulin sensitivity and help your body process glucose more efficiently — addressing the root cause of metabolic weight gain.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Silence Cravings",
                  desc: "Quiet the constant food noise and emotional eating triggers that make dieting feel impossible.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.172 14.828a4 4 0 010-5.656m5.656 0a4 4 0 010 5.656" />
                      <line x1="4" y1="4" x2="20" y2="20" strokeWidth={2.5} />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="relative bg-white rounded-2xl p-7 sm:p-8 text-center border-l-4 border-l-[#E8339E] border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Step number */}
                  <span className="absolute top-4 right-5 text-xs font-bold text-[#E8339E]/40 tracking-wider">{item.step}</span>
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#E8339E] to-[#7A1E7E] flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PRICING — 3-MONTH TIMELINE ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Transparent Pricing
              </p>
              <p className="text-gray-500 text-sm mb-4 italic">Same doctor. Every visit. Not a prescription mill.</p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Your <span className="font-sans">3</span>-Month Care Plan
              </h2>
              <p className="text-gray-600">No insurance. No middlemen. Just results.</p>
            </div>

            {/* Single unified timeline card */}
            <div className="bg-[#FDF8F3] rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-lg relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] sm:left-[26px] top-[60px] bottom-[180px] w-[2px] bg-gradient-to-b from-[#E8339E] to-[#7A1E7E]/40 ml-3 sm:ml-4" />

              {/* Month 1 */}
              <div className="relative pl-10 sm:pl-12 ml-3 sm:ml-4 mb-10">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 1</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$199</span>
                </div>
                <p className="text-base text-gray-600 mb-4">
                  Only <span className="font-bold text-gray-900">$50</span> today to reserve your appointment — remaining $149 due day of visit
                </p>

                {/* Hero feature — Video consultation */}
                <div className="bg-white rounded-xl p-4 border border-[#E8339E]/20 mb-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8339E] to-[#7A1E7E] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">45-Minute Live Video Consultation</p>
                      <p className="text-sm text-gray-600">Face-to-face with Dr. Al-Deek — comprehensive metabolic evaluation & personalized GLP-1 protocol</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Also included:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Comprehensive lab review</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Custom GLP-1 protocol & prescription</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Direct text access with Dr. Al-Deek</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-base text-gray-700">Patient dashboard & tracking</span>
                  </div>
                </div>
              </div>

              {/* Month 2 */}
              <div className="relative pl-10 sm:pl-12 ml-3 sm:ml-4 mb-10">
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
                    <span className="text-base text-gray-700">Prescription renewals & refills</span>
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
                    <span className="text-base text-gray-700">Prescription renewals & refills</span>
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
                  Start Your Plan — Only $50 Today
                </button>
                <p className="mt-3 text-sm text-gray-500">Currently accepting new patients — limited availability</p>
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

        {/* ═══════════════ PHARMACY OPTIONS ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Filling Your Prescription
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Convenient Options to Fit Your Life
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We guide you toward the most convenient and affordable way to fill your GLP-1 prescription. Dr. Al-Deek will discuss your options during your consultation.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {/* Brand-Name */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.997 2.997 0 00.177-.756L3.75 4.5h16.5l.573 4.093c.068.487.03.964-.177 1.756"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Brand-Name Medications</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  FDA-approved brand-name medications (Ozempic, Wegovy, Mounjaro, Zepbound) shipped to your door or picked up at your local pharmacy — your choice.
                </p>
              </div>
              {/* Compounded */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-100 ring-2 ring-[#E8339E]/20">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Compounded Medications</h3>
                <p className="text-xs font-semibold text-[#E8339E] uppercase tracking-wide mb-2">Save 30–45% vs. Brand-Name</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Compounded semaglutide or tirzepatide through our partnered pharmacies — typically 30–45% less than brand-name, shipped directly to your door.
                </p>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {STEPS.map((s, i) => (
                <div key={s.num} className="relative text-center bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                  {/* Connector arrow (hidden on first card and mobile) */}
                  {i > 0 && (
                    <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 text-[#E8339E]/40">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 3l5 5-5 5V3z"/></svg>
                    </div>
                  )}
                  <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#E8339E] to-[#7A1E7E] flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">{s.num}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">1,000+</p>
                <p className="text-sm text-gray-500 mt-1">Patients Treated</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">4.9<span className="text-[#E8339E]">★</span></p>
                <p className="text-sm text-gray-500 mt-1">Patient Satisfaction</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">15–20%</p>
                <p className="text-sm text-gray-500 mt-1">Avg. Body Weight Loss</p>
              </div>
            </div>

            {/* Testimonial cards — horizontal scroll */}
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {[
                {
                  quote: "I thought I needed more willpower, but what I really needed was a doctor who understood my body. Between my GLP-1 medication and personalized plan, I've lost 28 pounds, I'm sleeping through the night again, and my mood has completely changed.",
                  name: "Jessica",
                  age: 38,
                },
                {
                  quote: "I had been taking a GLP-1 through another clinic, but my progress stalled after the first few months. Dr. Al-Deek looked beyond the medication and found that my hormones were working against me. After adjusting my treatment plan, the weight loss started again.",
                  name: "Michelle",
                  age: 42,
                },
                {
                  quote: "I spent years counting calories, exercising five days a week, and trying every diet imaginable. Nothing seemed to work anymore. Dr. Al-Deek helped me understand why — and the GLP-1 medication finally gave my body the help it needed.",
                  name: "Emily",
                  age: 45,
                },
                {
                  quote: "This wasn't another 'weight loss clinic.' Dr. Al-Deek personalized everything around my metabolism, lifestyle, and goals. For the first time in years, I feel in control of my body instead of fighting against it.",
                  name: "Nicole",
                  age: 46,
                },
                {
                  quote: "I was skeptical about GLP-1 medications, but Dr. Al-Deek answered every question I had during our first visit. She never made me feel rushed. I've lost over 30 pounds and I only wish I had started sooner.",
                  name: "Rachel",
                  age: 49,
                },
                {
                  quote: "I had accepted that my metabolism was just gone. I couldn't understand why I was eating healthy and staying active but still gaining weight. The GLP-1 medication changed everything — my body finally responded to the healthy habits I'd been working so hard to maintain.",
                  name: "Donna",
                  age: 55,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="min-w-[300px] sm:min-w-[340px] max-w-[360px] flex-shrink-0 snap-start bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">"{t.quote}"</p>
                  <p className="text-sm font-semibold text-gray-900">— {t.name}, {t.age}</p>
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
                <AccordionItem key={i} value={`faq-${i}`} className="border-gray-200 bg-[#FDF8F3] rounded-xl mb-3 px-5 border">
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
              Ready to lose the weight for good?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Book a virtual consultation with Dr. Al-Deek. No commitment, no pressure — just expert guidance on your next step.
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

      {/* ═══════════════ CONSULTATION MODAL ═══════════════ */}
      <LpConsultationModal2
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
    </>
  );
}
