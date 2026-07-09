/* =============================================================================
   /lp/hrt — A/B Test Landing Page
   Design: Midi Health–inspired editorial/magazine style
   - Cream backgrounds, serif headlines, condition carousel
   - Stripped nav (logo + Book Now only)
   - Single repeated CTA → opens existing ConsultationModal
   ============================================================================= */
import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import ConsultationModal from "@/components/home1/ConsultationModal";
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
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-hrt-hero-FfBFvJKUnDLiaJbGtcV7o3.webp";

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
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-hairskin-EMAYf6Pxz9WR9dQwrmDwis.webp",
  },
  {
    title: "Irregular Periods",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-periods-P8hMHgBRemkLcBZeNNGUVa.webp",
  },
  {
    title: "Joint Pain & Bone Loss",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-condition-jointpain-Vw5AeDiMRfHffN2Xb97FXh.webp",
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
    desc: "Complete a brief intake and schedule your virtual appointment — takes less than 5 minutes.",
  },
  {
    num: "02",
    title: "Virtual Consultation",
    desc: "Meet with Dr. Al-Deek one-on-one via video. Discuss your symptoms, goals, and medical history.",
  },
  {
    num: "03",
    title: "Lab Work & Diagnosis",
    desc: "We order targeted labs (at-home or local draw) to uncover the root cause of your symptoms.",
  },
  {
    num: "04",
    title: "Your Treatment Plan",
    desc: "Receive a personalized protocol — medications shipped to your door, with ongoing physician support.",
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
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a membership-based practice. We do not bill insurance directly, but we provide superbills you can submit for potential reimbursement. Many patients find our pricing comparable to — or less than — specialist copays.",
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
            <img src={LOGO} alt="MedMethod Direct" className="h-9 w-auto" />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            {/* Left — Copy */}
            <div className="order-2 md:order-1">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8339E] tracking-wide uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E8339E] animate-pulse" />
                100% Virtual Care
              </p>
              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] font-bold text-gray-900 mb-6">
                Hormone therapy &amp; weight loss,{" "}
                <span className="text-[#E8339E]">prescribed by a specialist.</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Board-certified physician care for menopause, GLP-1 weight loss, and hormone optimization — from the comfort of your home.
              </p>
              <button
                onClick={openConsult}
                className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Book My Discovery Call
              </button>
              {/* Social proof */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
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
                className="w-full max-w-md rounded-2xl shadow-2xl object-cover aspect-[3/4]"
              />
            </div>
          </div>
        </section>

        {/* ═══════════════ DR. BIO ═══════════════ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-10 items-start">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              <img
                src={DR_PHOTO}
                alt="Dr. Jumana Al-Deek, DO"
                className="w-64 md:w-full max-w-[360px] rounded-2xl shadow-lg object-cover aspect-[3/4]"
              />
            </div>
            {/* Bio */}
            <div>
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Your Physician
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Dr. Jumana Al-Deek, DO
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Board-Certified DO", "Menopause Specialist", "Licensed in 17 States"].map(
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
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Dr. Jumana Al-Deek is a board-certified family physician and co-founder of MedMethod Direct, a telehealth-based medical practice focused on menopause medicine, metabolic health, hormone optimization, and medical weight management.
                </p>
                <p>
                  She specializes in evidence-based, personalized care for women navigating midlife health, body composition changes, and long-term wellness. Her clinical background includes obesity medicine, preventive care, chronic disease management, and women's health.
                </p>
                <p>
                  Dr. Al-Deek believes in a holistic, whole-person approach — understanding how hormones, metabolism, nutrition, sleep, stress, and lifestyle all work together to impact overall well-being and healthy aging.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Medical Weight Loss",
                  "Menopause & Perimenopause",
                  "GLP-1 Therapy",
                  "Hormone Optimization",
                  "Thyroid",
                  "Longevity Medicine",
                ].map((area) => (
                  <span
                    key={area}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CONDITIONS CAROUSEL ═══════════════ */}
        <section className="bg-[#FDF8F3] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-10">
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How Hormone Replacement Therapy Works
              </h2>
              <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
                When hormone levels drop during the menopause transition, you can experience symptoms from head to toe. HRT replenishes just enough estrogen and progesterone to bring you relief.
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
                  className="snap-start shrink-0 w-[260px] sm:w-[300px] lg:w-[320px] group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {c.title}
                  </h3>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════ PERSONALIZED TREATMENT ═══════════════ */}
        <section className="bg-white py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Your Protocol
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900">
                Personalized Treatment, Prescribed by an Expert
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Every patient receives a treatment plan built around their unique labs, symptoms, and goals — not a one-size-fits-all protocol.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {TREATMENTS.map((t, i) => (
                <AccordionItem key={i} value={`treatment-${i}`} className="border-gray-200">
                  <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-5">
                    {t.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-[15px]">
                    {t.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ═══════════════ PRICING ═══════════════ */}
        <section className="bg-[#FDF8F3] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
              Transparent Pricing
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Straightforward Pricing
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-12">
              No hidden fees. No surprise bills. Just expert physician care at a fair price.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Initial */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Initial Consultation
                </p>
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  $250
                </p>
                <p className="text-sm text-gray-500">
                  Comprehensive evaluation, lab review &amp; treatment plan
                </p>
              </div>
              {/* Follow-up */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Follow-Up Visits
                </p>
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  $150
                </p>
                <p className="text-sm text-gray-500">
                  Ongoing monitoring, dosage adjustments &amp; support
                </p>
              </div>
            </div>
            <button
              onClick={openConsult}
              className="mt-10 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Book My Discovery Call
            </button>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Getting Started
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <section className="bg-[#FDF8F3] py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Questions?
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900">
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
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to feel like yourself again?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Book a virtual discovery call with Dr. Al-Deek. No commitment, no pressure — just expert guidance on your next step.
            </p>
            <button
              onClick={openConsult}
              className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Book My Discovery Call
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
          <img src={LOGO} alt="MedMethod Direct" className="h-7 w-auto brightness-0 invert" />
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
      <ConsultationModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
    </>
  );
}
