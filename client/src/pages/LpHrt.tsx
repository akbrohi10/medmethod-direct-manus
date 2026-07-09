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
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lp-hrt-hero-patch-v5-mMuEFMeaNE5vW6YPpLj4Te.webp";

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
    desc: "Pick a time that works for you and schedule your virtual appointment in under 5 minutes.",
  },
  {
    num: "02",
    title: "Fill Out Your Intake Form",
    desc: "Complete your health questionnaire and upload recent labs (within 6 months). Don't have labs? We'll order them for you.",
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* Left — Copy */}
            <div className="order-2 md:order-1">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8339E] tracking-wide uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E8339E] animate-pulse" />
                100% Virtual Care
              </p>
              <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] font-bold text-gray-900 mb-4 sm:mb-6">
                Hormone therapy &amp; weight loss,{" "}
                <span className="text-[#E8339E]">prescribed by a specialist.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Board-certified physician care for menopause, GLP-1 weight loss, and hormone optimization — from the comfort of your home.
              </p>
              <button
                onClick={openConsult}
                className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Book My Discovery Call
              </button>
              {/* Social proof */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
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
                className="w-full max-w-[280px] sm:max-w-md rounded-2xl shadow-2xl object-cover aspect-[3/4]"
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
                className="w-48 sm:w-64 md:w-full max-w-[360px] rounded-2xl shadow-lg object-cover aspect-[3/4]"
              />
            </div>
            {/* Bio */}
            <div>
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Your Physician
              </p>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Dr. Jumana Al-Deek, DO
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Author of <em className="text-gray-900 font-medium">The Menopause Weight Loss Trap</em> — one of the fastest-emerging books in its category.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Board-Certified DO", "Menopause Specialist", "Metabolism", "Author", "Mom of Four", "Licensed in 17 States"].map(
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
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                How Hormone Replacement Therapy Works
              </h2>
              <p className="text-gray-600 max-w-3xl text-base sm:text-lg leading-relaxed">
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
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
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
        <section className="bg-[#FDF8F3] py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
              Transparent Pricing
            </p>
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple, Straightforward Pricing
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 sm:mb-12">
              No hidden fees. No surprise bills. Just expert physician care at a fair price.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {/* Initial */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100">
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100">
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

        {/* ═══════════════ PHARMACY OPTIONS ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide mb-2">
                Filling Your Prescription
              </p>
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Convenient Options to Fit Your Life
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We guide you toward the most convenient and affordable way to fill your prescriptions. Dr. Al-Deek will discuss your options and make a recommendation during your initial consultation.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {/* Brand-Name */}
              <div className="bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.997 2.997 0 00.177-.756L3.75 4.5h16.5l.573 4.093c.068.487.03.964-.177 1.756"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Brand-Name Medications</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  FDA-approved brand-name hormones shipped to your door or picked up at your local pharmacy — your choice.
                </p>
              </div>
              {/* Compounded */}
              <div className="bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 text-center border border-gray-100 ring-2 ring-[#E8339E]/20">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Compounded Medications</h3>
                <p className="text-xs font-semibold text-[#E8339E] uppercase tracking-wide mb-2">Discounted Pre-Negotiated Rates</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bioidentical hormones custom-compounded for you through our partnered pharmacies at pre-negotiated rates — shipped directly to your door.
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
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
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
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
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
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to feel like yourself again?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Book a virtual discovery call with Dr. Al-Deek. No commitment, no pressure — just expert guidance on your next step.
            </p>
            <button
              onClick={openConsult}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
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
