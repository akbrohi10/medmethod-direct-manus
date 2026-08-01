/* =============================================================================
   /maryland — Maryland State Hub Page
   Design: Clinical Noir — dark hero, white content sections, pink gradient accents
   SEO Strategy: State-level hub targeting Montgomery County + statewide Maryland
   Primary keywords:
     - online menopause doctor Maryland
     - virtual hormone therapy Maryland
     - GLP-1 weight loss Maryland online
     - semaglutide prescription Maryland
     - perimenopause specialist Maryland telehealth
     - bioidentical hormone therapy Maryland virtual
     - menopause doctor Montgomery County MD
     - telehealth women's health Maryland
   Secondary (neighborhood):
     - menopause doctor Bethesda MD / Chevy Chase / Potomac / Rockville / Silver Spring
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, FlaskConical, MapPin, Microscope, Star, Thermometer } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import PopularPrograms from "@/components/PopularPrograms";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const JSONLD_STATE_PAGE = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Maryland",
  "description": "Maryland's premier virtual hormone therapy, GLP-1 medical weight loss, and menopause clinic. Physician-prescribed semaglutide, tirzepatide, BHRT, HRT, and testosterone therapy — serving Bethesda, Chevy Chase, Potomac, Rockville, Silver Spring, Baltimore, Annapolis, and all of Maryland. 100% virtual, licensed in Maryland.",
  "url": "https://medmethoddirect.com/maryland",
  "priceRange": "$$",
  "medicalSpecialty": ["Obstetrics and Gynecology", "Endocrinology", "Internal Medicine"],
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy (HRT)" },
    { "@type": "MedicalTherapy", "name": "Bioidentical Hormone Therapy (BHRT)" },
    { "@type": "MedicalTherapy", "name": "GLP-1 Weight Loss — Semaglutide & Tirzepatide" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" },
    { "@type": "MedicalTherapy", "name": "Perimenopause Treatment" },
    { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
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
        "text": "Yes. MedMethod Direct is fully licensed to see patients throughout Maryland — including Bethesda, Chevy Chase, Potomac, Rockville, Silver Spring, Baltimore, Annapolis, Frederick, Columbia, and every city and county in between. All care is delivered 100% virtually.",
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
        "text": "After your appointment, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in Maryland — Montgomery County has exceptional lab density with locations in Bethesda, Chevy Chase, Rockville, and Silver Spring. Dr. Al-Deek reviews your results and builds a personalized protocol including HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from local practices in Bethesda or Rockville?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Maryland women near NIH and Johns Hopkins are among the most medically sophisticated in the country — and they know when they're not getting specialist-level care. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at Montgomery County practices), and a virtual program that treats hormones and GLP-1 weight loss as a single clinical problem.",
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

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Maryland", "item": "https://medmethoddirect.com/maryland" },
  ],
};

// ─── Neighborhood Data ────────────────────────────────────────────────────────
const neighborhoods = [
  {
    name: "Bethesda",
    href: "/maryland/bethesda",
    tagline: "Highest search volume in Maryland",
    description: "Adjacent to NIH and Walter Reed — medically sophisticated patients with very low telehealth competition. Bethesda women are among the most informed healthcare consumers in the country.",
    services: ["Menopause Management", "Hormone Therapy", "GLP-1 Weight Loss"],
    badge: "Highest Demand",
    badgeColor: "#E8339E",
  },
  {
    name: "Chevy Chase",
    href: "/maryland/chevy-chase",
    tagline: "Highest household income in Maryland",
    description: "Sits directly on the DC border. Bioidentical hormone therapy and GLP-1 demand with almost no telehealth competitors. Chevy Chase patients expect premium, physician-led care.",
    services: ["BHRT", "Menopause", "Semaglutide"],
    badge: "Low Competition",
    badgeColor: "#7A1E7E",
  },
  {
    name: "Potomac",
    href: "/maryland/potomac",
    tagline: "Among the wealthiest communities in the US",
    description: "Very low competition across all telehealth categories. High-income households with strong demand for integrated hormone and weight loss care. Excellent opportunity for virtual medicine.",
    services: ["Menopause", "Hormone Therapy", "Tirzepatide"],
    badge: "High Opportunity",
    badgeColor: "#7A1E7E",
  },
  {
    name: "Rockville",
    href: "/maryland/rockville",
    tagline: "Largest city in Montgomery County",
    description: "Strong GLP-1 search growth with established in-person competitors to differentiate against. Rockville's density and diversity make it the highest-volume opportunity in the county.",
    services: ["GLP-1 Weight Loss", "Menopause", "BHRT"],
    badge: "Highest Volume",
    badgeColor: "#E8339E",
  },
  {
    name: "Silver Spring",
    href: "/maryland/silver-spring",
    tagline: "Gateway to the DC corridor",
    description: "High-density diverse professional community on the DC border. Growing demand for hormone and weight loss care with very little virtual competition serving this market.",
    services: ["Menopause", "Weight Loss", "Testosterone"],
    badge: "Growing Market",
    badgeColor: "#7A1E7E",
  },
];

// ─── Comparison Table Data ────────────────────────────────────────────────────
const comparisonRows = [
  { feature: "Appointment availability", us: "Same week", them: "4–8 weeks" },
  { feature: "Appointment length", us: "30–60 minutes", them: "10–15 minutes" },
  { feature: "Hormones + weight loss integrated", us: "Yes — one program", them: "Separate referrals" },
  { feature: "GLP-1 prescriptions", us: "Semaglutide & tirzepatide", them: "Varies by provider" },
  { feature: "BHRT & testosterone therapy", us: "Yes — lab-driven protocol", them: "Often not offered" },
  { feature: "Physician continuity", us: "Same physician every visit", them: "Rotating providers" },
  { feature: "Lab ordering", us: "LabCorp/Quest near you", them: "In-office only" },
  { feature: "Medication delivery", us: "Shipped to your door", them: "Pharmacy pickup" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "I\'m a single mom running a small business. I don\'t have time to drive to a specialist, sit in a waiting room, and then drive back. MedMethod is a 20-minute video call from my home office. My performance coach texts me every Thursday to check in — she\'s caught me slipping on sleep and hydration more than once. That kind of support doesn\'t exist anywhere else.", name: "Megan F.", location: "Maryland", rating: 5 },
  { quote: "At 58 I thought it was too late to feel good again. I\'d accepted the weight gain, the joint pain, the terrible sleep as just \'getting older.\' MedMethod showed me that most of it was hormonal and treatable. Six months in, I\'ve lost 21 lbs, I\'m back to morning walks, and I genuinely look forward to things again. I only wish I\'d started five years ago.", name: "Patricia H.", location: "Maryland area", rating: 5 },
  { quote: "I work in healthcare myself — I\'m an NP — and I was embarrassed that I couldn\'t figure out my own hormones. Everything I tried on my own wasn\'t working. Dr. Al-Deek\'s protocol was methodical, evidence-based, and actually personalized. The weekly check-ins with my performance coach kept me accountable in a way I never managed alone. Down 19 lbs and my patients keep asking what I\'m doing differently.", name: "Tonya R.", location: "Maryland", rating: 5 },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
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
    a: "After your appointment, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you — Montgomery County has exceptional lab density with locations in Bethesda, Chevy Chase, Rockville, and Silver Spring. Dr. Al-Deek reviews your results and builds a personalized protocol. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
  },
  {
    q: "Do I need to live in the DC suburbs to be a patient?",
    a: "No. We serve patients throughout the entire state of Maryland. Whether you're in Baltimore, Annapolis, Frederick, Columbia, Gaithersburg, or anywhere else in Maryland, you can access the same physician-led care as patients in Montgomery County.",
  },
  {
    q: "How is MedMethod Direct different from local practices near Bethesda or Rockville?",
    a: "Maryland women near NIH and Johns Hopkins know what specialist-level care looks like — and they know when they're not getting it. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most Montgomery County practices), and a virtual program that treats hormones and GLP-1 weight loss as a single clinical problem. No in-person competitor in Maryland offers this combination.",
  },
  {
    q: "Why do hormones affect GLP-1 weight loss results?",
    a: "Declining estrogen during perimenopause and menopause drives insulin resistance — which directly blunts the effectiveness of GLP-1 medications like semaglutide and tirzepatide. Many women on GLP-1s plateau or see minimal results because their hormones are working against the medication. MedMethod Direct is one of the few programs that addresses both simultaneously, which is why our patients see results that other programs can't replicate.",
  },
  {
    q: "What is the $449 Clinical Diagnostic & Setup Fee?",
    a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
  },
  ...pricingFaqs,
  {
    q: "Does MedMethod Direct accept insurance in Maryland?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Maryland has a high rate of employer-sponsored insurance, and we understand this is a common question. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex items-center justify-between py-5 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-[#111111] text-base leading-snug" style={{ fontFamily: "Montserrat, sans-serif" }}>{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-[#E8339E] shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && <p className="pb-5 text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{a}</p>}
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
          content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone therapy — serving Bethesda, Chevy Chase, Potomac, Rockville, Silver Spring, Baltimore, Annapolis & all of Maryland. Same-week appointments. Dr. Jumana Al-Deek, DO."
        />
        <link rel="canonical" href="https://medmethoddirect.com/maryland" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct" />
        <meta property="og:description" content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Maryland." />
        <meta property="og:url" content="https://medmethoddirect.com/maryland" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct" />
        <meta name="twitter:description" content="Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Same-week appointments. Dr. Jumana Al-Deek, DO." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_STATE_PAGE)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center overflow-hidden"
        style={{
          paddingTop: "120px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a1e 50%, #0D0D1A 100%)",
          minHeight: "500px",
        }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse 60% 60% at 15% 50%, rgba(232,51,158,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 85% 20%, rgba(122,30,126,0.10) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.12)", color: "#E8339E" }}>
                <MapPin className="w-3.5 h-3.5" />
                Licensed in Maryland · Serving All 24 Counties
              </div>
              <h1
                className="font-black leading-none mb-6 text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                VIRTUAL{" "}
                <span style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Hormone,</span>
                <br />
                <span style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Menopause</span> &amp;
                <br />
                <span style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Weight Loss</span>
                <br />
                for Maryland women
              </h1>
              <p className="mb-8 max-w-[560px] text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                Maryland's premier virtual clinic combining physician-led{" "}
                <strong style={{ color: "rgba(255,255,255,0.9)" }}>hormone therapy</strong>,{" "}
                <strong style={{ color: "rgba(255,255,255,0.9)" }}>GLP-1 medical weight loss</strong>, and{" "}
                <strong style={{ color: "rgba(255,255,255,0.9)" }}>menopause management</strong> — all in one program.
                No waiting room. No commute. See a physician this week.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => setConsultOpen(true)}
                  className="btn-gradient btn-gradient-pulse px-8 py-3.5 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
                >
                  SCHEDULE appointment <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#neighborhoods"
                  className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wider border transition-all hover:border-[#E8339E]/50"
                  style={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.15)" }}
                >
                  VIEW LOCATIONS
                </a>
              </div>

            </div>

            {/* Right: service highlights card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border p-7" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: "#E8339E" }}>WHAT WE TREAT IN MARYLAND</p>
                <div className="space-y-4">
                  {[
                    { icon: <Thermometer className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Perimenopause & Menopause", desc: "Hot flashes, night sweats, mood changes, brain fog — addressed at the hormonal root cause." },
                    { icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "GLP-1 Medical Weight Loss", desc: "Physician-prescribed semaglutide and tirzepatide — compounded or brand-name, shipped to your door." },
                    { icon: <FlaskConical className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Bioidentical Hormone Therapy", desc: "BHRT and FDA-approved HRT — estradiol, progesterone, testosterone — based on comprehensive labs." },
                    { icon: <Dumbbell className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Testosterone Therapy for Women", desc: "Low libido, fatigue, and muscle loss addressed with physician-supervised testosterone protocols." },
                    { icon: <Microscope className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Thyroid & Metabolic Optimization", desc: "Thyroid function evaluated and optimized as part of every comprehensive hormone workup." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-bold text-white text-sm mb-0.5">{item.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(232,51,158,0.4), transparent)" }} />
      </section>

      {/* ── INTRO / KEYWORD-RICH COPY ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#F9F9FB]">
        <div className="max-w-[900px] mx-auto">
          <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4" style={{ color: "#E8339E" }}>
            Maryland's Premier Virtual Hormone Clinic
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
            The{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Online Menopause Doctor
            </span>{" "}
            Maryland Has Been Missing
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-base">
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
              appointment with a rotating provider isn't care. It's triage. MedMethod Direct was built to give Maryland
              women the 30–60 minute, physician-led appointments they deserve — without the 4–8 week wait.
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
              "Hormones + weight loss treated as one integrated program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near you",
              "Same-week availability — no 4–8 week wait",
              "One physician for your full 6 or 12-month program",
              "Medications shipped directly to your Maryland address",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#E8339E" }} />
                <span className="text-sm text-gray-700 font-semibold">{item}</span>
              </div>
            ))}
          </div>

          {/* Keyword tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              "Online Menopause Doctor Maryland",
              "Virtual Hormone Therapy Maryland",
              "GLP-1 Weight Loss Maryland",
              "Semaglutide Maryland Online",
              "Perimenopause Specialist Maryland",
              "BHRT Maryland Virtual",
              "Menopause Doctor Montgomery County",
              "Telehealth Women's Health Maryland",
              "Tirzepatide Maryland",
              "Testosterone Therapy Women Maryland",
            ].map((kw) => (
              <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/25 text-[#E8339E]">{kw}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEIGHBORHOOD GRID ────────────────────────────────────────────────── */}
      <section id="neighborhoods" className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3" style={{ color: "#E8339E" }}>
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
            <p className="mt-3 text-gray-500 text-sm max-w-[520px] mx-auto">
              Each page is tailored with local SEO content, neighborhood-specific FAQs, and the same physician-led care. Click your area to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {neighborhoods.map((n) => (
              <a
                key={n.name}
                href={n.href}
                className="group block rounded-2xl border p-6 transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FAFAFA" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                    <span className="font-black text-[#111111] text-base">{n.name}, MD</span>
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: `${n.badgeColor}15`, color: n.badgeColor }}
                  >
                    {n.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: "#E8339E" }}>{n.tagline}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{n.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {n.services.map((s) => (
                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-[#E8339E] transition-colors">
                  View page <ArrowRight className="w-3 h-3" />
                </div>
              </a>
            ))}
            {/* General Maryland card */}
            <div
              className="rounded-2xl border p-6 flex flex-col justify-between"
              style={{ borderColor: "rgba(232,51,158,0.25)", background: "linear-gradient(135deg, rgba(232,51,158,0.04), rgba(122,30,126,0.04))" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                  <span className="font-black text-[#111111] text-base">All of Maryland</span>
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: "#E8339E" }}>Statewide coverage</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Don't see your city? We serve patients throughout the entire state of Maryland — from Baltimore to Annapolis, Frederick to Columbia, and everywhere in between.
                </p>
                <p className="text-xs font-bold text-gray-400">Baltimore · Annapolis · Frederick · Columbia · Gaithersburg · Germantown · and more</p>
              </div>
              <button
                onClick={() => setConsultOpen(true)}
                className="mt-5 w-full btn-gradient py-2.5 rounded-full text-xs font-bold tracking-wider"
              >
                SCHEDULE appointment
              </button>
            </div>
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>More Maryland Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Easton", href: "/maryland/easton" },
                { name: "Frederick", href: "/maryland/frederick" },
                { name: "Annapolis", href: "/maryland/annapolis" },
                { name: "Bel Air", href: "/maryland/bel-air" },
                { name: "Ellicott City", href: "/maryland/ellicott-city" },
                { name: "Chevy Chase MD", href: "/maryland/chevy-chase-md" },
              ].map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-[#E8339E] transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3 h-3" style={{ color: "#E8339E" }} />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F9F9FB]">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-10">
            <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3" style={{ color: "#E8339E" }}>
              Why MedMethod Direct
            </span>
            <h2
              className="font-black"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#111111",
              }}
            >
              MedMethod Direct vs. Local Maryland Practices
            </h2>
            <p className="mt-3 text-gray-500 text-sm max-w-[480px] mx-auto">
              Maryland has excellent in-person medicine — but even the best local practices can't offer what a physician-led virtual program can.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid grid-cols-3 text-xs font-bold tracking-wider uppercase" style={{ background: "#111111", color: "white" }}>
              <div className="px-5 py-3.5">Feature</div>
              <div className="px-5 py-3.5 text-center" style={{ color: "#E8339E" }}>MedMethod Direct</div>
              <div className="px-5 py-3.5 text-center text-white/40">Local Practice</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 text-sm border-b border-gray-100 last:border-0"
                style={{ background: i % 2 === 0 ? "#ffffff" : "#FAFAFA" }}
              >
                <div className="px-5 py-4 font-semibold text-gray-700 text-xs">{row.feature}</div>
                <div className="px-5 py-4 text-center font-bold text-xs" style={{ color: "#E8339E" }}>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{row.us}</span>
                </div>
                <div className="px-5 py-4 text-center text-xs text-gray-400">{row.them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC SETUP + PROGRAMS ──────────────────────────────────────── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3" style={{ color: "#E8339E" }}>
              Patient Stories
            </span>
            <h2
              className="font-black"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#111111",
              }}
            >
              What Maryland Women Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8339E] text-[#E8339E]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#111111] text-sm">{t.name}</p>
                  <p className="text-[#E8339E] text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F9F9FB]" id="faq">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3" style={{ color: "#E8339E" }}>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a1e 100%)" }}
      >
        <div className="max-w-[640px] mx-auto">
          <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4" style={{ color: "#E8339E" }}>
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
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              We Can See You This Week.
            </span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Free 20-minute consultation with a member of our clinical team. No obligation, no pressure.
            Available to all Maryland residents — from Bethesda and Chevy Chase to Baltimore and Annapolis.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
          >
            SCHEDULE appointment <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs mt-5">
            Serving Bethesda · Chevy Chase · Potomac · Rockville · Silver Spring · Baltimore · Annapolis · Frederick · Columbia · and all of Maryland
          </p>
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
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
