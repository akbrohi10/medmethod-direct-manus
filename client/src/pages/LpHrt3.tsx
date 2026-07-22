/* =============================================================================
   /lp/hrt3 — Hybrid Landing Page
   Hero: MedicalTeam (Dr. Al-Deek profile) from /home-1
   Body: All sections from /lp/hrt2 starting at "How Hormone Replacement
         Therapy Works" (conditions carousel onward)
   Modal: LpConsultationModal2 (intake + Stripe deposit)
   ============================================================================= */
import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import MedicalTeam from "@/components/home1/MedicalTeam";
import LpConsultationModal2 from "@/components/home1/LpConsultationModal2";
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
    a: "Our program fee covers your physician visits, lab review, personalized protocol, and ongoing monitoring. Medication is billed separately based on your prescription and pharmacy choice. Dr. Al-Deek will walk you through your specific options and costs during your consultation — including brand-name and lower-cost compounded alternatives.",
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
export default function LpHrt3() {
  const [consultOpen, setConsultOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      <main className="overflow-x-hidden">

        {/* ═══════════════ HERO — Dr. Al-Deek Profile ═══════════════ */}
        {/* MedicalTeam already has its own top padding (pt-[7rem]) which
            we override here since we have a fixed 64px nav instead of
            the home-1 sticky nav + banner combo. */}
        <div className="[&_section]:!pt-8 [&_section]:md:!pt-12 [&_section]:lg:!pt-16">
          <MedicalTeam onConsultClick={openConsult} />
        </div>

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
            <h2 className="font-['Nunito_Sans',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your <span style={{fontVariantNumeric: 'lining-nums'}}>3</span>-Month Care Plan
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-2">
              No insurance. No middlemen. Just results.
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mb-8 sm:mb-12">
              Pricing above covers physician care, monitoring, and prescribing. Medication cost is separate and will be discussed during your consultation — compounded options typically cost less than brand-name.
            </p>

            {/* Unified Timeline Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto p-6 sm:p-10 text-left">

              {/* Month 1 */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-[#E8339E]/40 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 1</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$199</span>
                </div>
                <p className="text-base text-gray-600 mb-4">$199 total for Month 1 — $50 today to reserve your appointment, $149 due the day of your visit.</p>

                {/* Hero feature */}
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
                  {["Comprehensive lab review", "Custom protocol design", "Personalized treatment & prescription", "Direct text access with Dr. Al-Deek", "Patient dashboard & tracking"].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-base text-gray-700">{item}</span>
                    </div>
                  ))}
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
                  {["Direct text access with Dr. Al-Deek", "Prescription renewals & refills", "Dosage adjustments as needed"].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-base text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Month 3 */}
              <div className="relative pl-10 sm:pl-12 pb-8 border-l-[3px] border-[#E8339E]/10 ml-3 sm:ml-4">
                <div className="absolute -left-[14px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-sm font-semibold text-[#E8339E] uppercase tracking-wide">Month 3</span>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$99</span>
                </div>
                <p className="text-base text-gray-700 mb-4 leading-relaxed">
                  Fine-tuning your protocol for long-term results and sustainable health.
                </p>
                <div className="space-y-2">
                  {["Follow-up lab review", "Protocol refinement", "Transition to ongoing care plan"].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-base mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-base text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + CTA */}
              <div className="ml-3 sm:ml-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">3-Month Total</p>
                    <p className="text-3xl font-bold text-gray-900">$397</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      No hidden fees
                    </span>
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
                </div>
                <button
                  onClick={openConsult}
                  className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Reserve Your Appt. — $50 Deposit
                </button>
                <p className="mt-3 text-sm text-gray-500">$50 deposit today, $149 due at your visit — $199 total for Month 1.</p>
                <p className="mt-1 text-xs text-gray-400">Currently accepting new patients — limited availability</p>
              </div>
            </div>

            {/* À la carte note */}
            <div className="mt-8 text-center">
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
                We guide you toward the most convenient and affordable way to fill your prescriptions. Dr. Al-Deek will discuss your options and make a recommendation during your initial consultation.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
              <div className="bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.997 2.997 0 00.177-.756L3.75 4.5h16.5l.573 4.093c.068.487.03.964-.177 1.756"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Brand-Name Medications</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  FDA-approved brand-name medications shipped to your door or picked up at your local pharmacy — your choice.
                </p>
              </div>
              <div className="bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 text-center border border-gray-100 ring-2 ring-[#E8339E]/20">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#E8339E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Compounded Medications</h3>
                <p className="text-xs font-semibold text-[#E8339E] uppercase tracking-wide mb-2">Save 30–45% vs. Brand-Name</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Compounded for you through our partnered pharmacies — typically 30–45% less than brand-name, shipped directly to your door.
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

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">17</p>
                <p className="text-sm text-gray-500 mt-1">States Licensed</p>
              </div>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {[
                { quote: "I spent years counting calories, exercising five days a week, and trying every diet imaginable. Nothing seemed to work anymore. Dr. Al-Deek helped me realize my hormones were the missing piece. Once we balanced my hormones, my body finally started responding again.", name: "Emily", age: 42 },
                { quote: "I thought I needed more willpower, but what I really needed was a doctor who understood perimenopause. Between my hormone treatment and personalized weight loss plan, I've lost 28 pounds, I'm sleeping through the night again, and my mood has completely changed.", name: "Jessica", age: 44 },
                { quote: "I had been taking a GLP-1 through another clinic, but my progress stalled after the first few months. Dr. Al-Deek looked beyond the medication and found that my hormones were working against me. After adjusting my treatment plan, the weight loss started again.", name: "Michelle", age: 47 },
                { quote: "Hot flashes, brain fog, weight gain, and exhaustion became my new normal. Dr. Al-Deek explained what was happening to my body and developed a plan that actually addressed the root cause. Within a few months I felt like myself again.", name: "Karen", age: 53 },
                { quote: "Dr. Al-Deek spent so much time getting to know me, my health history, and my goals. I can send her a quick message whenever I have questions, and she adjusts my treatment whenever needed. It's the easiest healthcare experience I've ever had.", name: "Lisa", age: 56 },
                { quote: "I was skeptical about hormone therapy, but Dr. Al-Deek answered every question I had. Now my sleep has improved, my hot flashes are almost gone, and I've lost over 30 pounds with a combination of hormone therapy and physician-guided medical weight loss.", name: "Rachel", age: 49 },
              ].map((t, i) => (
                <div key={i} className="min-w-[300px] sm:min-w-[340px] max-w-[360px] flex-shrink-0 snap-start bg-[#FDF8F3] border border-gray-100 rounded-2xl p-6 shadow-sm">
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

      {/* ═══════════════ CONSULTATION MODAL ═══════════════ */}
      <LpConsultationModal2
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
    </>
  );
}
