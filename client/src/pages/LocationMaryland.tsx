/* =============================================================================
   /maryland — Maryland State Hub Page
   Design: Clinical Noir — dark hero, white content sections, pink accents
   Target keywords: online menopause doctor Maryland, virtual hormone therapy Maryland,
   telehealth menopause treatment Maryland, GLP-1 weight loss Maryland online,
   semaglutide prescription Maryland, perimenopause specialist Maryland telehealth,
   bioidentical hormone therapy Maryland virtual, online women's health Maryland
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
import DiagnosticSetup from "@/components/DiagnosticSetup";

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const JSONLD_STATE_PAGE = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Maryland",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women throughout Maryland. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Maryland.",
  "url": "https://medmethoddirect.com/maryland",
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
  "areaServed": { "@type": "State", "name": "Maryland", "containedInPlace": { "@type": "Country", "name": "United States" } },
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
      "name": "Is MedMethod Direct licensed to see patients in Maryland?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MedMethod Direct is fully licensed to see patients throughout Maryland — including Bethesda, Chevy Chase, Potomac, Rockville, Silver Spring, Baltimore, Annapolis, and every city and county in between. All care is delivered 100% virtually.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide prescribed online in Maryland?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. Prescriptions are issued after a thorough review of your labs and health history. Medications are shipped directly to your Maryland address.",
      },
    },
    {
      "@type": "Question",
      "name": "How does virtual hormone therapy work in Maryland?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in Maryland — Montgomery County has exceptional lab density. Dr. Al-Deek reviews your results and builds a personalized protocol including HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from local practices in Bethesda or Chevy Chase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Maryland women near NIH and Johns Hopkins are among the most medically sophisticated in the country — and they know when they're not getting specialist-level care. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at Montgomery County practices), and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem.",
      },
    },
    {
      "@type": "Question",
      "name": "Does MedMethod Direct accept insurance in Maryland?",
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
    name: "Bethesda",
    href: "/maryland/bethesda",
    description: "Highest search volume in Maryland. Adjacent to NIH and Walter Reed — medically sophisticated patients with very low telehealth competition.",
    keywords: "Menopause · Hormone Therapy · GLP-1 Weight Loss",
    available: true,
  },
  {
    name: "Chevy Chase",
    href: "/maryland/chevy-chase",
    description: "Highest household income in Maryland. Bioidentical hormone therapy and GLP-1 demand with almost no telehealth competitors.",
    keywords: "BHRT · Menopause · Semaglutide",
    available: true,
  },
  {
    name: "Potomac",
    href: "/maryland/potomac",
    description: "Among the wealthiest communities in the US. Very low competition across all categories — high opportunity for telehealth.",
    keywords: "Menopause · Hormone Therapy · Tirzepatide",
    available: true,
  },
  {
    name: "Rockville",
    href: "/maryland/rockville",
    description: "Largest population center in Montgomery County. Strong GLP-1 search growth with established in-person competitors to differentiate against.",
    keywords: "GLP-1 Weight Loss · Menopause · BHRT",
    available: true,
  },
  {
    name: "Silver Spring",
    href: "/maryland/silver-spring",
    description: "High-density diverse professional community with growing demand for hormone and weight loss care.",
    keywords: "Menopause · Weight Loss · Testosterone",
    available: true,
  },
  {
    name: "All of Maryland",
    href: "#consult",
    description: "Don't see your city? We serve patients throughout the entire state of Maryland — from Baltimore to Annapolis and beyond.",
    keywords: "Baltimore · Annapolis · Frederick · Columbia · and more",
    available: true,
    isGeneral: true,
  },
];

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is MedMethod Direct licensed to see patients in Maryland?",
    a: "Yes. We are fully licensed to see patients throughout Maryland — from Bethesda, Chevy Chase, Potomac, Rockville, and Silver Spring to Baltimore, Annapolis, Frederick, Columbia, and every city and county in between. Because care is 100% virtual, your location within Maryland does not affect your access.",
  },
  {
    q: "Can I get semaglutide or tirzepatide prescribed online in Maryland?",
    a: "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. All prescriptions are issued after a thorough review of your labs and health history, and medications are shipped directly to your Maryland address.",
  },
  {
    q: "How does virtual hormone therapy work in Maryland?",
    a: "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you — Montgomery County has exceptional lab density with locations in Bethesda, Chevy Chase, Rockville, and Silver Spring. Dr. Al-Deek reviews your results and builds a personalized protocol. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
  },
  {
    q: "Do I need to live in the DC suburbs to be a patient?",
    a: "No. We serve patients throughout the entire state of Maryland. Whether you're in Baltimore, Annapolis, Frederick, Columbia, or anywhere else in Maryland, you can access the same physician-led care as patients in Montgomery County.",
  },
  {
    q: "How is MedMethod Direct different from local practices near Bethesda or Chevy Chase?",
    a: "Maryland women near NIH and Johns Hopkins know what specialist-level care looks like — and they know when they're not getting it. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most Montgomery County practices), and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem. No in-person competitor in Maryland offers this combination.",
  },
  {
    q: "What is the $449 Clinical Diagnostic & Setup Fee?",
    a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
  },
  ...pricingFaqs,
  {
    q: "Does MedMethod Direct accept insurance in Maryland?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Maryland has a high rate of employer-sponsored insurance, and we understand this is a common question. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
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
export default function LocationMaryland() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── SEO HEAD ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct</title>
        <meta
          name="description"
          content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving Bethesda, Chevy Chase, Potomac, Rockville, Silver Spring & all of Maryland. Free consultation."
        />
        <link rel="canonical" href="https://medmethoddirect.com/maryland" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct" />
        <meta
          property="og:description"
          content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Maryland."
        />
        <meta property="og:url" content="https://medmethoddirect.com/maryland" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct" />
        <meta
          name="twitter:description"
          content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Maryland."
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
              { "@type": "ListItem", "position": 2, "name": "Maryland", "item": "https://medmethoddirect.com/maryland" },
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
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #E8339E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7A1E7E 0%, transparent 50%)",
        }} />

        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-4 h-4" style={{ color: "#E8339E" }} />
            <span
              className="text-xs font-extrabold tracking-[0.22em] uppercase"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Licensed in Maryland
            </span>
          </div>

          <h1
            className="font-black leading-none mb-6"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            VIRTUAL HORMONE,{" "}
            <span style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              MENOPAUSE
            </span>{" "}
            &amp; WEIGHT LOSS
            <br />
            FOR WOMEN IN MARYLAND
          </h1>

          <p
            className="mb-8 max-w-[640px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Maryland's only virtual clinic combining physician-led{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>hormone therapy</strong>,{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>GLP-1 medical weight loss</strong>, and{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>menopause management</strong> — all in one program.
            No waiting room. No commute. See a physician this week.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => setConsultOpen(true)}
              className="btn-gradient btn-gradient-pulse px-8 py-3.5 rounded-full text-sm font-bold tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              SCHEDULE FREE CONSULTATION →
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

          <div className="flex flex-wrap gap-8">
            {[
              { value: "10K+", label: "Women Served" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "4.9★", label: "Patient Rating" },
              { value: "All MD", label: "Statewide Coverage" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-black text-2xl" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.35)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
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
            Serving All of Maryland
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
            Maryland's Premier{" "}
            <span style={{
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
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
              <strong className="text-[#111111]">virtual hormone therapy doctor in Maryland</strong>,{" "}
              a <strong className="text-[#111111]">perimenopause specialist Maryland telehealth</strong> practice,
              or a physician who can prescribe{" "}
              <strong className="text-[#111111]">semaglutide or tirzepatide online in Maryland</strong> — you've found it.
              MedMethod Direct is a physician-led virtual clinic serving women throughout the entire state of Maryland,
              from Bethesda and Chevy Chase to Baltimore, Annapolis, and beyond.
            </p>
            <p>
              Maryland women near NIH, Johns Hopkins, and Georgetown University Medical Center are among the most
              medically literate in the country. You know what specialist-level care looks like — and you know when
              you're not getting it. The problem isn't access to medicine. It's access to <em>time</em>. A 12-minute
              appointment at a prestigious local practice, a 6-week wait for a new patient slot, a generalist who
              treats menopause as a footnote. MedMethod Direct was built for exactly this gap.
            </p>
            <p>
              What makes MedMethod Direct different from other{" "}
              <strong className="text-[#111111]">telehealth menopause treatment Maryland</strong> options is the integration.
              Most virtual platforms treat hormones and weight loss as separate programs. We treat them as the same problem —
              because for most women in perimenopause and menopause, they are. Declining estrogen drives insulin resistance.
              Insulin resistance makes GLP-1 medications less effective. Treating one without the other is why so many women
              plateau. Our program addresses both simultaneously, under the direct oversight of{" "}
              <strong className="text-[#111111]">Dr. Jumana Al-Deek, DO</strong>.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Licensed to see patients throughout all of Maryland",
              "Hormones + weight loss treated as one program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near you",
              "Same-week availability — no 4–8 week wait",
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
              Montgomery County &amp; Beyond
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
                    <span className="font-black text-[#111111] text-base" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {n.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(232,51,158,0.1)", color: "#E8339E" }}>LIVE</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {n.description}
                </p>
                <p className="text-xs font-bold" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  {n.keywords}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  View page <ArrowRight className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC SETUP + PROGRAMS ──────────────────────────────────────── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
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
              Maryland Patients Ask
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
            Maryland — Statewide
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
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
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
            Available to all Maryland residents — from Bethesda and Chevy Chase to Baltimore and Annapolis.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE FREE CONSULTATION →
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
    </div>
  );
}
