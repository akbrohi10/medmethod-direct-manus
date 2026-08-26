/* =============================================================================
   /lp/WL — GLP-1 Weight Loss Landing Page
   Design: Bold visual energy hero with brush-stroke style emphasis
   - Weight loss focused for all women (30-60+)
   - Same structure as /lp/hrt2 but adapted for GLP-1 audience
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
    desc: "Fill out your health questionnaire. Have recent bloodwork? You can upload it — otherwise Dr. Al-Deek will guide you on next steps.",
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
    a: "Medication selection is individualized and based on your health history, clinical needs, treatment goals, insurance coverage, and pharmacy availability. Dr. Al-Deek will review clinically appropriate options, expected costs, and fulfillment during your consultation.",
  },
  {
    q: "How much weight can I expect to lose?",
    a: "Weight response varies from person to person and cannot be guaranteed. Dr. Al-Deek will monitor your health, medication response, and progress and will adjust your plan when clinically appropriate.",
  },
  {
    q: "What are the common side effects?",
    a: "The most common side effects are mild nausea, reduced appetite, and occasional digestive changes — especially in the first few weeks. These typically improve as your body adjusts. Dr. Al-Deek starts you at a low dose and titrates slowly to minimize side effects.",
  },
  {
    q: "Is virtual care as effective as in-person visits?",
    a: "Yes. Telehealth visits allow the same thorough evaluation, lab review, and treatment planning as in-person appointments — with the added convenience of no commute, no waiting room, and access from any state where we're licensed.",
  },
  {
    q: "What states are you licensed in?",
    a: "Dr. Al-Deek is licensed to practice in Florida, Arizona, Colorado, the District of Columbia, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, and Virginia.",
  },
];


// ─── Component ───────────────────────────────────────────────────────────────
export default function LpGlp1() {
  const [consultOpen, setConsultOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

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
            className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-semibold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:opacity-90 transition-opacity"
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
              <h1 className="text-[1.65rem] sm:text-4xl lg:text-[2.85rem] xl:text-5xl leading-[1.15] font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                A Custom Medical<br />Weight Loss Plan<br /><span className="text-[#E8339E]">Built Around You.</span>
              </h1>
              <p className="text-[1.35rem] sm:text-2xl lg:text-[1.75rem] font-extrabold text-[#111111] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>100% Virtual</p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                A 45-minute visit with Dr. Al-Deek — physician-prescribed semaglutide or tirzepatide <span className="text-[#E8339E] font-semibold">if it's right for you.</span> No insurance needed.
              </p>
              <button
                onClick={openConsult}
                className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Book Your 45-Min Appt.
              </button>

              {/* Hero pricing strip */}
              <div id="hero-cta-sentinel" className="mt-5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <div className="inline-flex items-center gap-3 rounded-full border px-5 py-2.5" style={{ borderColor: "rgba(122,30,126,0.18)", background: "#fdf6fb" }}>
                  <span className="text-[12px] font-bold tracking-[0.08em] uppercase" style={{ color: "#6B2D6B" }}>Your 1<span className="normal-case">st</span> Visit</span>
                  <span className="w-px h-4 bg-[#7A1E7E]/20" />
                  <span className="text-[20px] font-extrabold leading-none" style={{ color: "#7A1E7E" }}>$199</span>
                  <span className="w-px h-4 bg-[#7A1E7E]/20" />
                  <span className="text-[13px] font-semibold" style={{ color: "#5A2060" }}>$50 today</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('pricing-details');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-3 text-[13px] font-semibold tracking-wide flex items-center gap-1 transition-opacity hover:opacity-80"
                  style={{ color: "#7A1E7E", fontFamily: "Montserrat, sans-serif" }}
                >
                  See full pricing details
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M6 2.5v7M3 7l3 3 3-3" stroke="#7A1E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-sm text-gray-500">
                {[
                  "Helped thousands of patients",
                  "Licensed in 12 jurisdictions",
                  "Progress monitored over time",
                  "Same doctor, every visit",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    {item}
                  </span>
                ))}
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
                Dr. Jumana Al-Deek, DO, MS
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Author of <em className="text-gray-900 font-medium">The Menopause Weight Loss Trap</em> — one of the fastest-emerging books in its category.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Board-Certified DO", "Medical Weight Loss", "Metabolism Expert", "GLP-1 Specialist", "Author", "Licensed in 12 jurisdictions"].map(
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
                  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-barrier-cravings-8iJjjCutCDpHRnerUK2Fpv.webp",
                  objectPosition: "center",
                },
                {
                  step: "02",
                  title: "Boost Metabolism",
                  desc: "Enhance insulin sensitivity and help your body process glucose more efficiently — addressing the root cause of metabolic weight gain.",
                  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-boost-metabolism-walk-v1-XvUbciFYZNVrSLgyKKNPrJ.webp",
                  objectPosition: "center top",
                },
                {
                  step: "03",
                  title: "Silence Cravings",
                  desc: "Quiet the constant food noise and emotional eating triggers that make dieting feel impossible.",
                  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/glp1-cravings-walkaway-v1-L3TkZQgkx9sihRboCcLbEp.webp",
                  objectPosition: "center bottom",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Photo top half with cinematic overlay */}
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: item.objectPosition ?? "center" }}
                    />
                    {/* Dark gradient overlay — stronger at bottom so title reads cleanly */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 100%)",
                      }}
                    />
                    {/* Step number — top right */}
                    <span
                      className="absolute top-4 right-4 text-xs font-bold tracking-widest"
                      style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.step}
                    </span>
                    {/* Title printed on photo at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                      <h3
                        className="font-['Nunito_Sans',sans-serif] text-xl font-extrabold text-white leading-tight drop-shadow-sm"
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description panel — clean white bottom half */}
                  <div className="bg-white px-5 py-5 flex-1 flex flex-col justify-between border-t-2 border-[#E8339E]/20">
                    <p className="text-[15px] text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PRICING ═══════════════ */}
        <section id="pricing-details" className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Transparent Pricing
              </p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your Care Plan
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-2">
                Thoughtful, physician-led care built around you.
              </p>
              <p className="text-base text-gray-600 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                Pricing covers physician care, monitoring, and prescribing. Medication is billed separately, and costs vary by medication, dosage, dispensing pharmacy, and insurance coverage. Dr. Al-Deek will review clinically appropriate options and expected costs during your consultation.
              </p>
            </div>

            {/* Unified timeline card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto p-6 sm:p-10 text-left">

              {/* Initial Consultation */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-[#E8339E]/40 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Initial Consultation</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$199</span>
                </div>
                <div className="mb-4 space-y-1">
                  <div className="flex items-center justify-between max-w-xs">
                    <span className="text-base font-bold text-gray-800">Reserve Today:</span>
                    <span className="text-base font-semibold text-gray-700">$50 deposit</span>
                  </div>
                  <div className="flex items-center justify-between max-w-xs">
                    <span className="text-base font-bold text-gray-800">Day of Your Visit:</span>
                    <span className="text-base font-semibold text-gray-700">Remaining $149</span>
                  </div>
                  <div className="flex items-center justify-between max-w-xs border-t border-gray-100 pt-1 mt-1">
                    <span className="text-base font-bold text-gray-900">Total Initial Consultation:</span>
                    <span className="text-base font-bold text-[#7A1E7E]">$199</span>
                  </div>
                </div>

                {/* Hero feature */}
                <div className="bg-gradient-to-r from-[#E8339E]/5 to-[#7A1E7E]/5 border border-[#E8339E]/20 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">45-Minute Physician Consultation</p>
                      <p className="text-base text-gray-600 mt-1">Meet one-on-one with Dr. Jumana Al-Deek to review your symptoms, medical history, and create your personalized GLP-1 treatment plan.</p>
                    </div>
                  </div>
                </div>

                <p className="text-base font-semibold text-gray-700 uppercase tracking-wide mb-3">Also included:</p>
                <div className="space-y-2">
                  {["Comprehensive medical diagnostic review", "Personalized treatment plan", "Prescription written at your visit — if clinically appropriate", "Personalized dosing plan & titration guidance", "Medications shipped to your door or picked up at your pharmacy", "Direct text access with Dr. Al-Deek (30 days included)", "Patient dashboard & progress tracking"].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-lg mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-base text-gray-800 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-Up Options */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-[#E8339E]/25 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Follow-Up Options</span>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {/* Option 1 */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7A1E7E] mb-1">Option 1</p>
                    <p className="text-lg font-bold text-gray-900">$150 Follow-up Visits</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                      <li>Schedule whenever medically appropriate.</li>
                      <li>Most patients every 3–6 months.</li>
                      <li>Frequency determined together with Dr. Al-Deek.</li>
                    </ul>
                  </div>
                  {/* Option 2 */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Option 2</p>
                    <p className="text-lg font-bold text-gray-900">$50<span className="text-sm font-medium text-gray-500">/month Ongoing Care</span></p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2 mb-1.5">Includes</p>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      {["Direct secure messaging", "Immediate medication adjustments", "Prescription refills", "Lab review", "Answers without a visit"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#E8339E] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-500 italic">Need a video visit? Just add one for <span className="font-semibold text-gray-700">$50</span>.</p>
                    <p className="mt-1 text-xs text-gray-700">30-day notice to cancel.</p>
                  </div>
                </div>
              </div>

              {/* Total + CTA */}
              <div className="ml-3 sm:ml-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mb-6">
                  <div className="flex flex-wrap gap-3 text-base text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      HIPAA-secure
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Real doctor, not a chatbot
                    </span>
                  </div>
                </div>
                <button
                  onClick={openConsult}
                  className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base w-full sm:w-auto px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Book Your Appt. — $50 Deposit
                </button>
                <p className="mt-3 text-sm text-gray-500">Currently accepting new patients — limited availability</p>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <p className="text-gray-200 text-xl mb-8 max-w-xl mx-auto leading-relaxed">
              Book your Initial Consultation with Dr. Al-Deek — a 45-minute physician appointment where you'll review your symptoms, health history, and goals, and leave with a personalized GLP-1 treatment plan and prescription.
            </p>
            <button
              onClick={openConsult}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Book Your First Visit — $50 Today
            </button>
            <p className="mt-4 text-base text-gray-300">
              $199 total · $50 reserves your appointment · $149 due at your visit
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
      <React.Suspense fallback={null}>
        <LpConsultationModal2
          open={consultOpen}
          onClose={() => setConsultOpen(false)}
          landingPage="/lp/WL"
        />
      </React.Suspense>

      {/* ═══════════════ STICKY MOBILE CTA ═══════════════ */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[env(safe-area-inset-bottom,12px)] pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ pointerEvents: showStickyCTA ? 'auto' : 'none' }}
        aria-hidden={!showStickyCTA}
      >
        <div className="flex gap-2">
          {/* Primary: Book Now */}
          <button
            onClick={openConsult}
            className="flex-1 flex flex-col items-center justify-center gap-0 py-3 rounded-full text-white font-bold shadow-lg active:scale-[0.98] transition-transform duration-150"
            style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              boxShadow: "0 8px 24px rgba(122, 30, 126, 0.35)",
            }}
          >
            <span className="text-[14px] font-extrabold tracking-wide uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Book Now
            </span>
            <span className="text-[11px] font-semibold opacity-90" style={{ fontFamily: "Montserrat, sans-serif" }}>
              $50 Today
            </span>
          </button>
          {/* Secondary: Call Now */}
          <a
            href="tel:+18883627011"
            className="flex-1 flex flex-col items-center justify-center gap-0 py-3 rounded-full font-bold border active:scale-[0.98] transition-transform duration-150"
            style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              boxShadow: "0 8px 24px rgba(122, 30, 126, 0.35)",
              color: "#fff",
            }}
          >
            <span className="text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              Have questions?
            </span>
            <span className="text-[13px] font-extrabold tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Call Now
            </span>
          </a>
        </div>
      </div>

      {/* Bottom spacer so footer content isn't hidden behind sticky CTA on mobile */}
      <div className={`sm:hidden transition-all duration-300 ${showStickyCTA ? 'h-20' : 'h-0'}`} />
    </>
  );
}
