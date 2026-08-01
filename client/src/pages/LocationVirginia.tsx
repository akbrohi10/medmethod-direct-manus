/* =============================================================================
   /virginia — Virginia State Hub Page
   Design: Clinical Noir — dark hero, white content sections, pink accents
   Target keywords: online menopause doctor Virginia, virtual hormone therapy Virginia,
   telehealth menopause treatment Virginia, GLP-1 weight loss Virginia online,
   semaglutide prescription Virginia, perimenopause specialist Virginia telehealth,
   online women's health Virginia
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ChevronDown, ChevronUp, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import PopularPrograms from "@/components/PopularPrograms";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const JSONLD_STATE_PAGE = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Virginia",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women throughout Virginia. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Virginia.",
  "url": "https://medmethoddirect.com/virginia",
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
    { "@type": "MedicalTherapy", "name": "Longevity Medicine" },
  ],
  "areaServed": { "@type": "State", "name": "Virginia", "containedInPlace": { "@type": "Country", "name": "United States" } },
  "isAcceptingNewPatients": true,
  "currenciesAccepted": "USD",
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
      "name": "Is MedMethod Direct licensed to see patients in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MedMethod Direct is fully licensed to see patients throughout Virginia, including Northern Virginia (McLean, Great Falls, Vienna, Reston, Arlington), Richmond, Virginia Beach, Charlottesville, and all other Virginia cities and counties. All care is delivered 100% virtually.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide prescribed online in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. Prescriptions are issued after a thorough review of your labs and health history. Medications are shipped directly to your Virginia address.",
      },
    },
    {
      "@type": "Question",
      "name": "How does virtual hormone therapy work in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "After your appointment, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in Virginia. Dr. Al-Deek reviews your results and builds a personalized protocol — which may include HRT, BHRT, testosterone therapy, or a combination. Prescriptions are sent to your pharmacy or shipped to your door. All follow-up visits are virtual.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between MedMethod Direct and a local OB/GYN in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MedMethod Direct is a specialized hormone, menopause, and medical weight loss practice — not a general OB/GYN. Appointments are 30–60 minutes (vs. 10–15 minutes at most local practices), you can be seen within days (vs. 3–6 week wait times), and your physician integrates hormone therapy and weight loss into a single comprehensive program.",
      },
    },
    {
      "@type": "Question",
      "name": "Do you serve patients outside of Northern Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We serve patients throughout the entire state of Virginia — from Northern Virginia (McLean, Reston, Arlington) to Richmond, Virginia Beach, Charlottesville, Roanoke, and beyond. Because care is 100% virtual, your location within Virginia does not affect your access.",
      },
    },
    {
      "@type": "Question",
      "name": "Does MedMethod Direct accept insurance in Virginia?",
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

// ─── Neighborhood Data ────────────────────────────────────────────────────────
const neighborhoods = [
  {
    name: "McLean",
    href: "/virginia/mclean",
    description: "Highest-income zip codes in Virginia. Serving Chesterbrook, Langley, and the Tysons corridor.",
    keywords: "Menopause · Hormone Therapy · GLP-1 Weight Loss",
    available: true,
  },
  {
    name: "Great Falls",
    href: "/virginia/great-falls",
    description: "One of the wealthiest communities in the US. Very low telehealth competition — high opportunity.",
    keywords: "Menopause · Hormone Therapy · GLP-1 Weight Loss",
    available: true,
  },
  {
    name: "Vienna / Tysons",
    href: "/virginia/vienna",
    description: "Tysons Corner and Vienna — dense professional population, strong demand for hormone care.",
    keywords: "Menopause · BHRT · Semaglutide",
    available: true,
  },
  {
    name: "Reston",
    href: "/virginia/reston",
    description: "Large tech-sector professional community with high telehealth adoption rates.",
    keywords: "Menopause · Hormone Therapy · Tirzepatide",
    available: true,
  },
  {
    name: "Arlington",
    href: "/virginia/arlington",
    description: "Dense, educated, urban — strong GLP-1 and hormone search growth.",
    keywords: "Menopause · Weight Loss · Testosterone",
    available: true,
  },
  {
    name: "All of Virginia",
    href: "#consult",
    description: "Don't see your city? We serve patients throughout the entire state of Virginia.",
    keywords: "Richmond · Virginia Beach · Charlottesville · Roanoke · and more",
    available: true,
    isGeneral: true,
  },
];

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is MedMethod Direct licensed to see patients in Virginia?",
    a: "Yes. We are fully licensed to see patients throughout Virginia — from Northern Virginia (McLean, Great Falls, Vienna, Reston, Arlington) to Richmond, Virginia Beach, Charlottesville, Roanoke, and every city and county in between. Because care is 100% virtual, your location within Virginia does not affect your access.",
  },
  {
    q: "Can I get semaglutide or tirzepatide prescribed online in Virginia?",
    a: "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. All prescriptions are issued after a thorough review of your labs and health history, and medications are shipped directly to your Virginia address.",
  },
  {
    q: "How does virtual hormone therapy work in Virginia?",
    a: "After your appointment, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in Virginia. Dr. Al-Deek reviews your results and builds a personalized protocol — which may include HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
  },
  {
    q: "Do I need to live in Northern Virginia to be a patient?",
    a: "No. We serve patients throughout the entire state of Virginia. Whether you're in Richmond, Virginia Beach, Charlottesville, Roanoke, or anywhere else in Virginia, you can access the same physician-led care as patients in Northern Virginia.",
  },
  {
    q: "What is the $449 Clinical Diagnostic & Setup Fee?",
    a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
  },
  ...pricingFaqs,
  {
    q: "Does MedMethod Direct accept insurance in Virginia?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b cursor-pointer"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-5 gap-4">
        <span className="font-bold text-[#111111] text-sm md:text-base pr-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
          {q}
        </span>
        {open
          ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: "#E8339E" }} />
          : <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />}
      </div>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LocationVirginia() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── SEO HEAD ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Virginia | MedMethod Direct</title>
        <meta
          name="description"
          content="Virginia's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Virginia. appointment."
        />
        <link rel="canonical" href="https://medmethoddirect.com/virginia" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Virginia | MedMethod Direct" />
        <meta
          property="og:description"
          content="Virginia's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Virginia."
        />
        <meta property="og:url" content="https://medmethoddirect.com/virginia" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Virginia | MedMethod Direct" />
        <meta
          name="twitter:description"
          content="Virginia's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Virginia."
        />
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_STATE_PAGE)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_FAQ)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
              { "@type": "ListItem", "position": 2, "name": "Virginia", "item": "https://medmethoddirect.com/virginia" },
            ],
          })}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center overflow-hidden"
        style={{
          paddingTop: "120px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a1e 50%, #0D0D1A 100%)",
          minHeight: "480px",
        }}
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #E8339E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7A1E7E 0%, transparent 50%)",
        }} />

        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-4 h-4" style={{ color: "#E8339E" }} />
            <span
              className="text-xs font-extrabold tracking-[0.22em] uppercase"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Licensed in Virginia
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-black leading-none mb-6"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            Virtual hormone,{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              menopause
            </span>{" "}
            &amp; weight loss
            <br />
            for women in Virginia
          </h1>

          {/* Subheadline */}
          <p
            className="mb-8 max-w-[640px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Virginia's premier virtual clinic combining physician-led{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>hormone therapy</strong>,{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>GLP-1 medical weight loss</strong>, and{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>menopause management</strong> — all in one program.
            No waiting room. No commute. See a physician this week.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => setConsultOpen(true)}
              className="btn-gradient btn-gradient-pulse px-8 py-3.5 rounded-full text-sm font-bold tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              SCHEDULE appointment →
            </button>
            <a
              href="#neighborhoods"
              className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wider border transition-all"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              VIEW LOCATIONS
            </a>
          </div>
        </div>
      </section>

      {/* ── INTRO / KEYWORD-RICH COPY ─────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "#F9F9FB" }}>
        <div className="max-w-[900px] mx-auto">
          <span
            className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Serving All of Virginia
          </span>
          <h2
            className="font-black mb-6"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              color: "#111111",
              lineHeight: 1.2,
            }}
          >
            Virginia's Premier{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Online Menopause Doctor
            </span>{" "}
            &amp; Medical Weight Loss Clinic
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem" }}>
            <p>
              If you've been searching for a{" "}
              <strong className="text-[#111111]">virtual hormone therapy doctor in Virginia</strong>,{" "}
              a <strong className="text-[#111111]">perimenopause specialist Virginia telehealth</strong> practice,
              or a physician who can prescribe{" "}
              <strong className="text-[#111111]">semaglutide or tirzepatide online in Virginia</strong> — you've found it.
              MedMethod Direct is a physician-led virtual clinic serving women throughout the entire state of Virginia,
              from Northern Virginia to Richmond, Virginia Beach, Charlottesville, and beyond.
            </p>
            <p>
              What makes MedMethod Direct different from other{" "}
              <strong className="text-[#111111]">telehealth menopause treatment Virginia</strong> options is the integration.
              Most virtual platforms treat hormones and weight loss as separate programs. We treat them as the same problem —
              because for most women in perimenopause and menopause, they are. Declining estrogen drives insulin resistance.
              Insulin resistance makes GLP-1 medications less effective. Treating one without the other is why so many women
              plateau. Our program addresses both simultaneously, under the direct oversight of{" "}
              <strong className="text-[#111111]">Dr. Jumana Al-Deek, DO</strong>.
            </p>
            <p>
              Whether you need{" "}
              <strong className="text-[#111111]">online women's health Virginia</strong> care for hot flashes, brain fog,
              low libido, and sleep disruption — or you're looking for{" "}
              <strong className="text-[#111111]">GLP-1 weight loss Virginia online</strong> with a physician who actually
              understands your hormones — MedMethod Direct is a Virginia-licensed virtual practice built to do both.
            </p>
          </div>

          {/* Key differentiators */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Licensed to see patients throughout all of Virginia",
              "Hormones + weight loss treated as one program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near you",
              "Same-week availability — no 6-week wait",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#E8339E" }} />
                <span className="text-sm text-gray-700 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEIGHBORHOOD GRID ────────────────────────────────────────────────── */}
      <section id="neighborhoods" className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span
              className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Northern Virginia &amp; Beyond
            </span>
            <h2
              className="font-black"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                color: "#111111",
              }}
            >
              Find Your Neighborhood Page
            </h2>
            <p className="mt-3 text-gray-500 text-sm max-w-[520px] mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Each page is tailored with local content, neighborhood-specific FAQs, and the same physician-led care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {neighborhoods.map((n) => (
              <a
                key={n.name}
                href={n.href}
                className="group block rounded-2xl border p-6 transition-all hover:shadow-lg hover:border-pink-200"
                style={{
                  borderColor: n.isGeneral ? "rgba(232,51,158,0.3)" : "rgba(0,0,0,0.08)",
                  background: n.isGeneral ? "linear-gradient(135deg, rgba(232,51,158,0.04), rgba(122,30,126,0.04))" : "#FAFAFA",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                    <span
                      className="font-black text-[#111111] text-base"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {n.name}
                    </span>
                  </div>
                  {n.available
                    ? <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(232,51,158,0.1)", color: "#E8339E" }}>LIVE</span>
                    : <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.35)" }}>COMING SOON</span>
                  }
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {n.description}
                </p>
                <p className="text-xs font-bold" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  {n.keywords}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {n.available ? "View page" : "Notify me when live"} <ArrowRight className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>More Virginia Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Culpeper", href: "/virginia/culpeper" },
                { name: "Warrenton", href: "/virginia/warrenton" },
                { name: "Middleburg", href: "/virginia/middleburg" },
                { name: "Leesburg", href: "/virginia/leesburg" },
                { name: "Fredericksburg", href: "/virginia/fredericksburg" },
                { name: "Alexandria", href: "/virginia/alexandria" },
                { name: "Falls Church", href: "/virginia/falls-church" },
                { name: "Tysons", href: "/virginia/tysons" },
                { name: "Herndon", href: "/virginia/herndon" },
              ].map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-[#E8339E] transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3 h-3" />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC SETUP + PROGRAMS ──────────────────────────────────────── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />


      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#F9F9FB" }}>
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span
              className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Common Questions
            </span>
            <h2
              className="font-black"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#111111",
              }}
            >
              Virginia Patients Ask
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a1e 100%)" }}
      >
        <div className="max-w-[640px] mx-auto">
          <span
            className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Virginia — Statewide
          </span>
          <h2
            className="font-black text-white mb-4"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.15,
            }}
          >
            Ready to Start?{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              We Can See You This Week.
            </span>
          </h2>
          <p
            className="mb-8 text-sm leading-relaxed"
            style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.55)" }}
          >
            Free 20-minute consultation with a member of our clinical team. No obligation, no pressure.
            Available to all Virginia residents — no matter where you are in the state.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE appointment →
          </button>
        </div>
      </section>


      {/* ── Legal / LegitScript compliance disclaimer ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <p className="text-xs text-gray-400 leading-relaxed text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <strong className="text-gray-500">Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. All prescriptions are issued only after a valid patient-provider relationship has been established through a proper medical evaluation. Individual results may vary. Consult your healthcare provider before starting any new treatment. MedMethod Direct is licensed to practice in the states listed on this site only.{" "}
            <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>{" · "}
            <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" · "}
            <a href="/hipaa-notice" className="underline hover:text-gray-600">HIPAA Notice</a>
          </p>
        </div>
      </div>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
    </div>
  );
}
