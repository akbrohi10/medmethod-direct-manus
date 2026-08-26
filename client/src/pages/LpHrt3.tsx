import ComplianceDisclosures from "@/components/ComplianceDisclosures";
/* =============================================================================
   /lp/hrt3 — Hybrid Landing Page
   Hero: MedicalTeam (Dr. Al-Deek profile) from /home-1
   Body: All sections from /lp/hrt2 starting at "How Hormone Replacement
         Therapy Works" (conditions carousel onward)
   Modal: LpConsultationModal2 (intake + Stripe deposit)
   ============================================================================= */
import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import MedicalTeam from "@/components/home1/MedicalTeam";
const LpConsultationModal2 = React.lazy(() => import("@/components/home1/LpConsultationModal2"));
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ─── Assets ──────────────────────────────────────────────────────────────────
const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";

const CONDITIONS = [
  {
    title: "Hot Flashes & Night Sweats",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-hotflashes-ayi2TzXcHCcgkcufKazGTN.webp",
  },
  {
    title: "Weight Gain & Metabolism",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-weightgain-v2-nK2psrLF5MCkdvbZgXMQWN.webp",
  },
  {
    title: "Brain Fog & Fatigue",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-brainfog-v2-cUscmfbqbvpMk9eBdkNgvX.webp",
  },
  {
    title: "Sleep Changes",
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
    desc: "Choose a time that works for you and reserve your 45-minute virtual visit with a $50 deposit.",
  },
  {
    num: "02",
    title: "Complete Your Intake Form",
    desc: "Tell us about your health, symptoms, current medications, treatment history, and goals. Upload recent labs if available.",
  },
  {
    num: "03",
    title: "Meet With Dr. Al-Deek",
    desc: "Meet one-on-one with Dr. Al-Deek to review your health, current treatment, concerns, and goals.",
  },
  {
    num: "04",
    title: "Get Your Personalized Plan",
    desc: "Leave with a personalized treatment plan, including medication or treatment adjustments when clinically appropriate.",
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
    a: "There's no single right age — it depends on your symptoms, health history, and goals. Many women begin noticing hormonal changes in their late 30s or 40s, during perimenopause, and can benefit from evaluation and treatment well before their last period. If you're experiencing symptoms like irregular cycles, sleep disruption, mood changes, brain fog, or weight gain, it may be worth a conversation — regardless of your age. During your consultation, Dr. Al-Deek will review your symptoms and health history to determine whether treatment makes sense for you.",
  },
  {
    q: "How long can I safely be on HRT?",
    a: "There is no universal time limit. Many women stay on HRT for years with regular monitoring. We reassess your protocol annually based on your symptoms, how your body is responding, and the latest clinical guidelines.",
  },

  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a direct-care practice. We do not bill insurance directly, but we provide superbills you can submit for potential reimbursement. Many patients find our pricing comparable to — or less than — specialist copays.",
  },
  {
    q: "How much does medication cost?",
    a: "Your physician care fee covers your consultation, personalized protocol, and ongoing monitoring. Medication is billed separately, and costs vary by the medication prescribed, dosage, dispensing pharmacy, and insurance coverage. Dr. Al-Deek will review clinically appropriate options and expected costs during your consultation.",
  },
  {
    q: "What states are you licensed in?",
    a: "Dr. Al-Deek is licensed to practice in Florida, Arizona, Colorado, the District of Columbia, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, and Virginia.",
  },
  {
    q: "Do I need bloodwork before my appointment?",
    a: "No — you don't need to bring any bloodwork to your first visit. If you have recent results, you're welcome to upload them and Dr. Al-Deek will review them. If not, she'll guide you on any next steps after your consultation. Nothing is required upfront.",
  },
  {
    q: "What if I don't qualify for HRT or GLP-1?",
    a: "Dr. Al-Deek will always be honest with you. If HRT or GLP-1 therapy isn't the right fit based on your health history, she'll explain why and discuss what alternatives may be appropriate for your situation. You'll never leave without a clear path forward.",
  },
  {
    q: "How quickly will I see results?",
    a: "It depends on the treatment. Most women on GLP-1 therapy begin noticing appetite changes within the first 1–2 weeks, with meaningful weight loss typically visible by weeks 4–8. For HRT, many women report improved sleep and reduced hot flashes within 2–4 weeks, with fuller hormonal balance developing over 2–3 months. Dr. Al-Deek will set realistic expectations for your specific protocol at your visit.",
  },
  {
    q: "What happens after the 30-day text access period?",
    a: "The 30 days of direct text access with Dr. Al-Deek is included with your initial visit to make sure your first weeks on treatment go smoothly. After that, you can choose between follow-up visits ($150 each, as needed) or ongoing monthly care ($50/mo) which includes direct secure messaging, prescription refills, medication adjustments, and lab review. Dr. Al-Deek will go over both options at your appointment.",
  },
];

const TREATMENTS = [
  {
    title: "Safety First",
    desc: "Every treatment plan begins with a comprehensive health evaluation. Dr. Al-Deek reviews your medical history, current medications, symptoms, and relevant lab work to help determine which treatment options may be appropriate and to monitor your progress over time.",
  },
  {
    title: "Dosing & Treatment Adjustments",
    desc: "Already on treatment? Dr. Al-Deek can review how you're responding and whether your medication, dose, formulation, or overall treatment strategy may need adjustment. Treatment can evolve based on your symptoms, response, lab findings, and clinical needs.",
  },
  {
    title: "Ongoing Physician Management",
    desc: "Your care doesn't end with a prescription. Dr. Al-Deek can continue to monitor your response, review relevant labs, manage medications, and make treatment adjustments as your needs change over time.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function LpHrt3() {
  const [consultOpen, setConsultOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  // Show sticky mobile CTA only after user has scrolled past the hero button.
  // Start hidden; become visible once the sentinel's bottom edge passes the top of the viewport.
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.getElementById('hero-cta-sentinel');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Show once the bottom of the hero CTA row is above the viewport top
      setShowStickyCTA(rect.bottom < 0);
    };
    window.addEventListener('scroll', check, { passive: true });
    check(); // run once on mount
    return () => window.removeEventListener('scroll', check);
  }, []);

  const openConsult = () => setConsultOpen(true);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="w-full px-2 sm:px-6 lg:px-8 flex items-center justify-between h-14 relative">
          {/* Logo — far left */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src={LOGO}
              alt="MedMethod Direct"
              className="h-8 sm:h-11 w-auto object-contain"
              style={{ clipPath: "inset(0 0 30% 0)", marginBottom: "-6px" }}
            />
          </a>
          {/* Phone — absolutely centered on the page */}
          <a
            href="tel:+18883627011"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-bold text-[#E8339E] hover:text-[#7A1E7E] transition-colors whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="text-[13px] sm:text-[15px]">(888) 362-7011</span>
          </a>
          {/* Patient Login — far right */}
          <a
            href="https://medmethoddirect.md-hq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-semibold border border-gray-300 text-gray-600 hover:border-[#E8339E] hover:text-[#E8339E] transition-colors whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Patient Login
          </a>
        </div>
      </header>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      <main className="overflow-x-hidden">

        {/* ═══════════════ HERO — Dr. Al-Deek Profile ═══════════════ */}
        {/* MedicalTeam already has its own top padding (pt-[7rem]) which
            we override here since we have a fixed 64px nav instead of
            the home-1 sticky nav + banner combo. */}
        <div className="[&_section]:!pt-8 [&_section]:md:!pt-12 [&_section]:lg:!pt-16">
        <ComplianceDisclosures testosteroneForWomen />

          <MedicalTeam
            onConsultClick={openConsult}
            hideBullets
            overrideHeadline={
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Menopause, Hormones
                <br />
                &amp; Weight Loss.
                <br />
                Done Right for You.
              </span>
            }
            overrideSubline="100% Virtual"
            overrideBody="A 45-minute visit with Dr. Al-Deek to review your health, medications, and goals—and create or optimize a personalized treatment plan for you."
            ctaLabel="Book Your 45-Min Appt."
            ctaMicrocopy={
              <div style={{ fontFamily: "Montserrat, sans-serif" }}>
                {/* 3-column pricing strip */}
                <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border" style={{ borderColor: "rgba(122,30,126,0.18)", background: "#fdf6fb" }}>
                  <div className="flex-1 flex flex-col items-center justify-center px-3 py-2.5 text-center">
                    <span className="text-[13px] font-bold tracking-[0.08em] uppercase" style={{ color: "#6B2D6B" }}>YOUR 1<span style={{ textTransform: "lowercase" }}>st</span> VISIT</span>
                    <span className="text-[22px] font-extrabold leading-tight mt-0.5" style={{ color: "#7A1E7E" }}>$199</span>
                    <span className="text-[14px] font-semibold mt-0.5 leading-tight" style={{ color: "#5A2060" }}>$50 today</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('pricing-details');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-3 text-[13px] font-semibold tracking-wide flex items-center gap-1 transition-opacity hover:opacity-80 self-center sm:self-start"
                  style={{ color: "#7A1E7E", fontFamily: "Montserrat, sans-serif" }}
                >
                  See full pricing details
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M6 2.5v7M3 7l3 3 3-3" stroke="#7A1E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            }
          />
        </div>

        {/* ═══════════════ CONDITIONS CAROUSEL ═══════════════ */}
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-6 sm:mb-10">
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Menopause, Hormones &amp; Weight Loss — Connected Care
              </h2>
              <p className="text-gray-600 max-w-3xl text-base sm:text-lg leading-relaxed">
                Midlife symptoms rarely happen in isolation. Hormones, metabolism, thyroid health, sleep, mood, and weight can overlap. Dr. Al-Deek looks at the whole picture to understand what may be contributing and determine which treatment approach may be appropriate for you.
              </p>
            </div>
            {/* Carousel controls — hidden on mobile (touch swipe works) */}
            <div className="hidden sm:flex justify-end gap-2 mb-4">
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
            {/* Scrollable cards */}
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
                Your Treatment Should Evolve With You
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Whether you're starting treatment or already taking medication, your plan should evolve as your symptoms, response, health, and goals change.
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
                  <AccordionContent className="text-gray-600 leading-relaxed text-base pb-5">
                    {t.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ═══════════════ PRICING ═══════════════ */}
        <section id="pricing-details" className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

            {/* Unified Timeline Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto p-6 sm:p-10 text-left">

              {/* 1st Visit */}
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
                      <p className="text-base text-gray-600 mt-1">Meet one-on-one with Dr. Jumana Al-Deek to review your health, symptoms, current medications, and goals—and create or optimize your personalized treatment plan.</p>
                    </div>
                  </div>
                </div>

                <p className="text-base font-semibold text-gray-700 uppercase tracking-wide mb-3">Also included:</p>
                <div className="space-y-2">
                  {["Comprehensive medical review", "Review of your current medications & treatment", "Personalized treatment plan", "Prescription at your visit — if clinically appropriate", "Personalized dosing & adjustment guidance", "Medication options based on your needs & preferences", "Direct text access with Dr. Al-Deek — 30 days included", "Patient dashboard & progress tracking"].map((item) => (
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
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Option 1 — Pay As You Go</p>
                    <p className="text-lg font-bold text-gray-900">$150 Follow-up Visits</p>
                    <p className="mt-2 text-sm text-gray-600">Schedule a physician follow-up when needed to review your progress, treatment, labs, or medications.</p>
                    <p className="mt-2 text-sm text-gray-500">No monthly commitment. Pay only when you need a follow-up.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Option 2</p>
                    <p className="text-lg font-bold text-gray-900">$50<span className="text-sm font-medium text-gray-500">/month Ongoing Care</span></p>
                    <p className="mt-2 mb-2 text-sm text-gray-600">For patients who want continued physician support between visits.</p>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      {["Direct secure messaging with Dr. Al-Deek", "Medication & dosing management", "Prescription refills & lab review"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#E8339E] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-700">Video visits available for $50.</p>
                    <p className="mt-1 text-xs text-gray-700">Cancel anytime with 30 days' notice.</p>
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

        {/* ═══════════════ MEDICATION COST ESTIMATES ═══════════════ */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">Your Prescription Options</p>
              <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Your Medication Options
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Medication is separate from your visit. When clinically appropriate, Dr. Al-Deek will review available treatment and fulfillment options, expected costs, and insurance considerations so you can make an informed decision based on your clinical needs and preferences.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Weight Loss Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Weight-Loss Medication</h3>
                </div>
                <p className="text-base text-gray-600 mb-4">Medication selection and fulfillment are based on your individual clinical needs.</p>
                <div className="rounded-xl bg-[#FDF8F3] border border-gray-100 p-4 space-y-3">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Costs vary by the medication prescribed, dosage, dispensing pharmacy, and insurance coverage. Dr. Al-Deek will review appropriate options and expected costs before you decide how to proceed.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Compounded medications are not FDA-approved. FDA does not review compounded drugs for safety, effectiveness, or quality before marketing.
                  </p>
                </div>
              </div>

              {/* Hormone Therapy Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Hormone Therapy</h3>
                </div>
                <p className="text-base text-gray-600 mb-4">Priced per hormone, based on your protocol</p>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Individual hormones (compounded)</p>
                      <p className="text-base text-gray-600">Estrogen · progesterone · testosterone · DHEA · vaginal estrogen</p>
                      <p className="text-sm text-[#E8339E] font-medium mt-1">Preferred pricing may be available through partner pharmacies.</p>
                      <p className="text-base text-gray-600 mt-0.5">Shipped directly to your door</p>
                    </div>
                    <span className="text-lg font-bold text-[#7A1E7E] whitespace-nowrap">~$30–$100<span className="text-sm font-semibold text-gray-500">/mo</span></span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Most patients (2–3 hormones)</p>
                      <p className="text-base text-gray-600">Typical combined protocol</p>
                      </div>
                    <span className="text-lg font-bold text-[#7A1E7E] whitespace-nowrap">~$150–$250<span className="text-sm font-semibold text-gray-500">/mo</span></span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base text-gray-500 text-center mt-6 max-w-xl mx-auto leading-relaxed">
              Estimates only. Actual medication costs vary by medication, dose, pharmacy, insurance coverage, and treatment plan. Dr. Al-Deek will review appropriate options with you during your consultation.
            </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {STEPS.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{s.num}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2" style={{ minHeight: "3.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{s.desc}</p>
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
                  <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base pb-2">
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
            <p className="text-gray-200 text-xl mb-8 max-w-xl mx-auto leading-relaxed">
              Book your Initial Consultation with Dr. Al-Deek — a 45-minute physician appointment where you'll review your symptoms, health history, and goals, and leave with a personalized treatment plan and prescription.
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
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MedMethod Direct. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-300">
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
          landingPage="/lp/hrt3"
        />
      </React.Suspense>

      {/* ═══════════════ STICKY MOBILE CTA ═══════════════ */}
      {/* Visible on mobile only — fixed to bottom of screen, follows scroll */}
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
