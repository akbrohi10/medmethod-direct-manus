/* =============================================================================
   /virginia/vienna — Vienna & Tysons Corner, VA Location Page
   Design: Clinical Noir — dark hero, white content sections, pink accents
   Target keywords: menopause doctor Vienna VA, virtual hormone therapy Tysons Corner,
   GLP-1 weight loss Vienna Virginia, perimenopause treatment Vienna VA,
   bioidentical hormone therapy Tysons, semaglutide Vienna Virginia telehealth,
   testosterone therapy for women Tysons Corner, online menopause doctor Fairfax County
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const JSONLD_LOCAL = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Vienna & Tysons Corner, VA",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Vienna, Tysons Corner, and Fairfax County, Virginia. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Virginia.",
  "url": "https://medmethoddirect.com/virginia/vienna",
  "priceRange": "$$",
  "medicalSpecialty": ["Obstetrics and Gynecology", "Endocrinology", "Internal Medicine"],
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", "name": "GLP-1 Weight Loss (Semaglutide & Tirzepatide)" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" },
    { "@type": "MedicalTherapy", "name": "Perimenopause Treatment" },
    { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
    { "@type": "MedicalTherapy", "name": "Bioidentical Hormone Therapy (BHRT)" },
    { "@type": "MedicalTherapy", "name": "Thyroid Optimization" },
  ],
  "areaServed": [
    { "@type": "City", "name": "Vienna", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "Place", "name": "Tysons Corner", "containedInPlace": { "@type": "State", "name": "Virginia" } },
  ],
  "isAcceptingNewPatients": true,
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": {
    "@type": "Physician",
    "name": "Dr. Jumana Al-Deek",
    "honorificSuffix": "DO",
    "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "10000",
    "bestRating": "5",
  },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a menopause doctor near Vienna or Tysons Corner, VA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Vienna, Tysons Corner, and all of Fairfax County. All care is delivered 100% virtually — no commute to Tysons traffic required. Dr. Jumana Al-Deek, DO, can typically see new patients within days.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide online near Vienna, Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Vienna and Tysons Corner. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your Vienna or Tysons address.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from a local OB/GYN in Fairfax County?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MedMethod Direct is a specialized hormone, menopause, and medical weight loss practice — not a general OB/GYN. Appointments are 30–60 minutes (vs. 10–15 at most local practices), you can be seen within days (vs. 3–6 week waits), and your physician integrates hormone therapy and weight loss into one comprehensive program rather than treating them separately.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need to go to a Tysons Corner office for bloodwork?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Vienna or Tysons Corner. You go in, get your blood drawn, and results come directly to Dr. Al-Deek. No office visit to MedMethod Direct is ever required.",
      },
    },
    {
      "@type": "Question",
      "name": "What is bioidentical hormone therapy (BHRT) and is it available near Tysons?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing. All prescriptions are managed virtually and shipped to your Vienna or Tysons address.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. MedMethod Direct also integrates hormone therapy and weight loss into a single program — rather than treating each issue separately as most telehealth platforms do.",
      },
    },
    {
      "@type": "Question",
      "name": "Does MedMethod Direct accept insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We are a direct-care practice and do not bill insurance. This allows same-week availability, 30–60 minute appointments, and care not limited by insurance coverage. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement.",
      },
    },
    {
      "@type": "Question",
      "name": "What does the $449 Clinical Diagnostic & Setup Fee include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
      },
    },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Virginia", "item": "https://medmethoddirect.com/virginia" },
    { "@type": "ListItem", "position": 3, "name": "Vienna & Tysons Corner", "item": "https://medmethoddirect.com/virginia/vienna" },
  ],
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is there a menopause doctor near Vienna or Tysons Corner, VA?",
    a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Vienna, Tysons Corner, and all of Fairfax County. All care is delivered 100% virtually — no commute through Tysons traffic required. Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation.",
  },
  {
    q: "Can I get semaglutide or tirzepatide online near Vienna, Virginia?",
    a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Vienna and Tysons Corner. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door.",
  },
  {
    q: "Do I need to go to a Tysons Corner office for bloodwork or appointments?",
    a: "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Vienna or Tysons Corner. You go in, get your blood drawn, and results come directly to Dr. Al-Deek. Every appointment and follow-up is virtual — no office visit to MedMethod Direct is ever required.",
  },
  {
    q: "What is bioidentical hormone therapy (BHRT) and is it available near Tysons?",
    a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing. All prescriptions are managed virtually and shipped to your Vienna or Tysons address.",
  },
  {
    q: "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?",
    a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program — rather than treating each issue separately as most telehealth platforms do.",
  },
  ...pricingFaqs,
  {
    q: "Does MedMethod Direct accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
  },
  {
    q: "What does the $449 Clinical Diagnostic & Setup Fee include?",
    a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
  },
  {
    q: "How soon can I start as a patient in Vienna or Tysons Corner?",
    a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day as your consultation. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Vienna and Tysons patients are on their program within 1–2 weeks of their first call.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#111111] text-base leading-snug" style={{ fontFamily: "Montserrat, sans-serif" }}>
          {q}
        </span>
        {open ? <ChevronUp className="w-5 h-5 text-[#E8339E] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <p className="pb-5 text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Why Vienna Women Choose Us Cards ────────────────────────────────────────
const whyCards = [
  {
    icon: "⚡",
    title: "No Tysons Traffic. Ever.",
    desc: "100% virtual care means your appointment happens from your home, office, or anywhere in Fairfax County — not a Tysons parking garage.",
  },
  {
    icon: "🔬",
    title: "Hormones + Weight Loss: Treated Together",
    desc: "We're one of the only virtual practices that treats hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals.",
  },
  {
    icon: "📅",
    title: "Same-Week Availability",
    desc: "No 6-week wait for a specialist appointment. Most Vienna and Tysons patients are seen within days of their free consultation.",
  },
  {
    icon: "🧬",
    title: "Lab-Driven Protocols",
    desc: "Every protocol starts with comprehensive bloodwork — hormone panel, metabolic panel, thyroid — ordered to a LabCorp or Quest near Vienna or Tysons.",
  },
  {
    icon: "💊",
    title: "Semaglutide, Tirzepatide & BHRT Delivered",
    desc: "Medications shipped directly to your Vienna or Tysons address. No pharmacy runs, no prior authorization battles.",
  },
  {
    icon: "👩‍⚕️",
    title: "One Physician. Your Whole Journey.",
    desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I work in Tysons and the last thing I needed was another appointment to drive to. MedMethod Direct was exactly what I was looking for — same-week virtual visit, labs ordered nearby, and I started my protocol within two weeks. My energy and weight are finally moving in the right direction.",
    name: "Rachel M.",
    location: "Vienna, VA — Maple Avenue area",
    rating: 5,
  },
  {
    quote: "I'd been dismissed by two local OB/GYNs who told me my labs were 'normal.' Dr. Al-Deek looked at the same numbers and immediately saw the hormonal pattern. Three months in and I feel like myself again — plus 18 pounds down.",
    name: "Diane K.",
    location: "Tysons Corner, VA",
    rating: 5,
  },
  {
    quote: "The combination of hormone therapy and semaglutide together made all the difference. I'd tried semaglutide alone before and hit a wall. Treating the hormones at the same time broke through it. I wish I'd found this program two years ago.",
    name: "Susan T.",
    location: "Vienna, VA — Oakton area",
    rating: 5,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationVienna() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Vienna & Tysons Corner, VA | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Vienna, Tysons Corner, and Fairfax County, VA. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/vienna" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Vienna & Tysons Corner, VA | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Vienna and Tysons Corner, VA. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/vienna" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone & Weight Loss Doctor in Vienna & Tysons Corner, VA" />
        <meta name="twitter:description" content="Same-week virtual menopause and GLP-1 weight loss care for women in Vienna and Tysons Corner, VA. Dr. Jumana Al-Deek, DO." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ── */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }}
        />
        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

              {/* LEFT: Text + CTAs + Stats */}
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                  style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Serving Vienna &amp; Tysons Corner, Virginia
                </div>

                <h1
                  className="font-black leading-[1.05] mb-5"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}
                >
                  Virtual{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                  <br />
                  FOR VIENNA &amp; TYSONS WOMEN
                </h1>

                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  The only virtual clinic serving Fairfax County that combines physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care in one program. No Tysons traffic. Same-week availability.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Virginia
                </p>

                <div className="flex flex-wrap gap-5 lg:gap-7">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        {stat.value}
                      </div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Hero Image */}
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-vienna-hero-Ztchnr7oZCDoxdpKpT5zBd.webp"
                    alt="Virtual menopause and hormone therapy doctor for women in Vienna and Tysons Corner, Virginia — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      Serving Vienna · Tysons Corner · McLean · Reston · Fairfax
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(90deg, #E8339E 0%, #7A1E7E 100%)" }} />
      </section>

      {/* ── INTRO / KEYWORD SECTION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SERVING VIENNA & TYSONS CORNER, VA
          </p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause & Weight Loss Physician for Fairfax County Women — From Wherever You Are
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Vienna VA</strong> or a <strong>GLP-1 weight loss physician near Tysons Corner</strong>, you already know the problem: local specialists have 6-week wait times, 10-minute appointments, and rarely treat hormones and weight loss together. MedMethod Direct was built to fix exactly that.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct is a Virginia-licensed virtual clinic offering <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated program. Bloodwork is ordered to a <strong>LabCorp or Quest Diagnostics near Vienna or Tysons Corner</strong>. Medications are shipped to your door. Every appointment is virtual.
            </p>
            <p>
              Women in Vienna and Tysons Corner often come to us after plateauing on GLP-1 medications elsewhere. The reason is almost always hormonal — declining estrogen, low testosterone, and insulin resistance all blunt the effectiveness of semaglutide and tirzepatide. By treating <strong>hormones and weight loss as a unified clinical problem</strong>, we consistently achieve results that single-specialty programs miss.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Vienna VA", "GLP-1 Weight Loss Tysons", "Hormone Therapy Fairfax County", "BHRT Vienna Virginia", "Semaglutide Tysons Corner", "Perimenopause Specialist Vienna", "Testosterone Therapy Women VA", "Online Hormone Testing Virginia"].map((kw) => (
                <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/30 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Related reading:{" "}
              <a href="/blog" className="text-[#E8339E] hover:underline">Semaglutide vs. Tirzepatide for Women in Midlife</a>
              {" · "}
              <a href="/blog" className="text-[#E8339E] hover:underline">Can Hormone Therapy Help With Weight, Sleep & Metabolism?</a>
              {" · "}
              <a href="/blog" className="text-[#E8339E] hover:underline">Why Weight Gain Feels Different in Menopause</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── $449 DIAGNOSTIC SETUP ── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />

      {/* ── POPULAR PROGRAMS ── */}
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS ── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── DARK DIVIDER BAND ── */}
      <div className="relative py-12 overflow-hidden" style={{ background: "#0D0D1A" }}>
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            THE MEDMETHOD STANDARD
          </p>
          <h2 className="font-black text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
            "The system you've been missing —{" "}
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              built by physicians, for women.
            </span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
          </p>
        </div>
      </div>

      {/* ── WHY MOST PEOPLE FAIL ── */}
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── WHY VIENNA WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY VIENNA & TYSONS WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy Fairfax County Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-[#111111] text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              PATIENT STORIES
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              What Women in Virginia Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-[#E8339E] text-base">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1" style={{ fontFamily: "Montserrat, sans-serif" }}>"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#111111] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.name}</p>
                  <p className="text-[#E8339E] text-xs" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#F8F4F9]" id="faq">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Vienna & Tysons Corner — Common Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            VIENNA & TYSONS CORNER, VIRGINIA
          </p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            Ready to Feel Like Yourself Again?
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Serving Vienna, Tysons Corner, Oakton, Fairfax, Merrifield, and all of Fairfax County
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
