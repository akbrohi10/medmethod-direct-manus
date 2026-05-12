/* =============================================================================
   /washington-dc — Washington DC Hub Page
   Design: Clinical Noir — dark hero, white content sections, pink gradient accents
   SEO Strategy: DC hub targeting Georgetown, Capitol Hill, Dupont Circle, NW DC
   Primary keywords:
     - menopause doctor Washington DC
     - hormone therapy Washington DC
     - GLP-1 weight loss Washington DC
     - semaglutide Washington DC
     - bioidentical hormone therapy DC
     - perimenopause treatment Washington DC
     - virtual menopause care DC
     - women's health telehealth Washington DC
   Secondary (neighborhood):
     - menopause doctor Georgetown / Capitol Hill / Dupont Circle / Chevy Chase DC / Friendship Heights
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ChevronDown, ChevronUp, MapPin, ArrowRight, CheckCircle2, Star } from "lucide-react";
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
  "name": "MedMethod Direct — Washington DC",
  "description": "Washington DC's premier virtual hormone therapy, GLP-1 medical weight loss, and menopause clinic. Physician-prescribed semaglutide, tirzepatide, BHRT, HRT, and testosterone therapy — serving Georgetown, Capitol Hill, Dupont Circle, Chevy Chase DC, Friendship Heights, and all of Washington DC. 100% virtual, licensed in DC.",
  "url": "https://medmethoddirect.com/washington-dc",
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
  "areaServed": { "@type": "City", "name": "Washington", "containedInPlace": { "@type": "Country", "name": "United States" } },
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
      "name": "Is MedMethod Direct licensed to see patients in Washington DC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. MedMethod Direct is fully licensed to see patients throughout Washington DC — including Georgetown, Capitol Hill, Dupont Circle, Chevy Chase DC, Friendship Heights, Tenleytown, Adams Morgan, Logan Circle, and every neighborhood in the District. All care is delivered 100% virtually.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide prescribed online in Washington DC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. Prescriptions are issued after a thorough review of your labs and health history. Medications are shipped directly to your DC address.",
      },
    },
    {
      "@type": "Question",
      "name": "How does virtual hormone therapy work in Washington DC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in DC. The District has excellent lab access with locations in Northwest DC, Capitol Hill, and throughout the metro area. Dr. Al-Deek reviews your results and builds a personalized protocol including HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from local practices in DC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DC professionals are among the most time-constrained patients in the country. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most DC practices), and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem. No in-person competitor in DC offers this combination.",
      },
    },
    {
      "@type": "Question",
      "name": "Does MedMethod Direct accept insurance in Washington DC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We are a direct-care practice and do not bill insurance. This allows same-week availability, 30–60 minute appointments, and care not limited by insurance coverage. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement.",
      },
    },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Washington DC", "item": "https://medmethoddirect.com/washington-dc" },
  ],
};

// ─── Neighborhood Data ────────────────────────────────────────────────────────
const neighborhoods = [
  {
    name: "Georgetown",
    href: "/washington-dc/georgetown",
    tagline: "Highest income neighborhood in DC",
    description: "DC's most affluent neighborhood — federal executives, diplomats, and senior attorneys who expect premium physician-led care and have zero tolerance for waiting rooms or rushed appointments.",
    services: ["Menopause Management", "Hormone Therapy", "GLP-1 Weight Loss"],
    badge: "Premium Market",
    badgeColor: "#E8339E",
  },
  {
    name: "Capitol Hill",
    href: "/washington-dc/capitol-hill",
    tagline: "Policy professionals, staffers, and attorneys",
    description: "A dense, high-income professional community with demanding schedules and very low tolerance for traditional healthcare friction. Telehealth adoption is extremely high in this neighborhood.",
    services: ["BHRT", "Menopause", "Semaglutide"],
    badge: "High Demand",
    badgeColor: "#7A1E7E",
  },
  {
    name: "Dupont Circle",
    href: "/washington-dc/dupont-circle",
    tagline: "Urban professionals, consultants, and creatives",
    description: "One of DC's most progressive and health-conscious neighborhoods. Strong demand for integrative hormone care and GLP-1 programs, with very limited virtual telehealth competition.",
    services: ["Menopause", "Hormone Therapy", "Tirzepatide"],
    badge: "Low Competition",
    badgeColor: "#7A1E7E",
  },
  {
    name: "Chevy Chase DC",
    href: "/washington-dc/chevy-chase-dc",
    tagline: "Borders Maryland — serves both sides of Western Ave",
    description: "The DC side of Chevy Chase is one of the wealthiest ZIP codes in the country. Patients here cross the state line for care — MedMethod Direct serves both DC and Maryland Chevy Chase patients seamlessly.",
    services: ["BHRT", "Menopause", "Semaglutide"],
    badge: "Highest Income",
    badgeColor: "#E8339E",
  },
  {
    name: "Friendship Heights",
    href: "/washington-dc/friendship-heights",
    tagline: "Northwest DC — adjacent to Bethesda and Chevy Chase",
    description: "Upscale Northwest DC neighborhood bordering Bethesda. Affluent, health-conscious women with strong demand for hormone and weight loss care and minimal virtual competition in this specific area.",
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
  { quote: "As a Black woman, I felt like my symptoms were being dismissed by every doctor I saw. \'It\'s stress.\' \'Try yoga.\' \'Lose weight.\' Dr. Al-Deek was the first physician who actually ran comprehensive labs and said \'your hormones are a mess — let\'s fix this.\' That validation alone was worth it. The results — 23 lbs lost, no more night sweats, mental clarity back — that\'s the bonus.", name: "Jasmine W.", location: "Washington, DC", rating: 5 },
  { quote: "The accountability factor is what sets MedMethod apart. I\'ve done every diet, every app, every challenge. What I never had was someone checking in weekly who actually understood the medical side — not just \'eat less, move more\' but \'your cortisol is elevated, let\'s adjust your protocol.\' My performance coach is the reason I stuck with it past the hard part.", name: "Christine A.", location: "Washington, DC", rating: 5 },
  { quote: "I travel constantly for work — international flights, different time zones, hotel food. MedMethod works from anywhere. My meds ship to wherever I am, my virtual visits happen between meetings, and my performance coach adjusts my plan when I\'m in a tough travel stretch. I\'ve lost 20 lbs while living out of a suitcase. That shouldn\'t be possible but here we are.", name: "Samantha G.", location: "DC Metro", rating: 5 },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is MedMethod Direct licensed to see patients in Washington DC?",
    a: "Yes. We are fully licensed to see patients throughout Washington DC — including Georgetown, Capitol Hill, Dupont Circle, Chevy Chase DC, Friendship Heights, Tenleytown, Adams Morgan, Logan Circle, and every neighborhood in the District. Because care is 100% virtual, your location within DC does not affect your access.",
  },
  {
    q: "Can I get semaglutide or tirzepatide prescribed online in Washington DC?",
    a: "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. All prescriptions are issued after a thorough review of your labs and health history, and medications are shipped directly to your DC address.",
  },
  {
    q: "How does virtual hormone therapy work in Washington DC?",
    a: "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near you in DC. The District has excellent lab access in Northwest DC, Capitol Hill, and throughout the metro area. Dr. Al-Deek reviews your results and builds a personalized protocol. All follow-up visits are virtual, and prescriptions are sent to your pharmacy or shipped to your door.",
  },
  {
    q: "I live near the DC/Maryland or DC/Virginia border — which page should I use?",
    a: "It doesn't matter — we serve patients on both sides of every border. If you're in Chevy Chase DC, you're a neighbor to both Chevy Chase MD and Bethesda MD patients. If you're near Georgetown, you're minutes from McLean VA. MedMethod Direct is licensed in DC, Maryland, and Virginia, so your address never limits your access to care.",
  },
  {
    q: "How is MedMethod Direct different from local practices in Washington DC?",
    a: "DC professionals are among the most time-constrained patients in the country. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most DC practices), and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem. No in-person competitor in DC offers this combination.",
  },
  {
    q: "Why do hormones affect GLP-1 weight loss results?",
    a: "Declining estrogen during perimenopause and menopause drives insulin resistance — which directly blunts the effectiveness of GLP-1 medications like semaglutide and tirzepatide. Many women on GLP-1s plateau or see minimal results because their hormones are working against the medication. MedMethod Direct is one of the only programs that addresses both simultaneously, which is why our patients see results that other programs can't replicate.",
  },
  {
    q: "What is the $449 Clinical Diagnostic & Setup Fee?",
    a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee.",
  },
  ...pricingFaqs,
  {
    q: "Does MedMethod Direct accept insurance in Washington DC?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many DC patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. DC has a high concentration of federal employees with FEHB coverage — we can provide documentation to support any out-of-network claims.",
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
export default function LocationDC() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── SEO HEAD ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Washington DC | MedMethod Direct</title>
        <meta
          name="description"
          content="Washington DC's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone therapy — serving Georgetown, Capitol Hill, Dupont Circle, Chevy Chase DC, Friendship Heights & all of DC. Same-week appointments. Dr. Jumana Al-Deek, DO."
        />
        <link rel="canonical" href="https://medmethoddirect.com/washington-dc" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Washington DC | MedMethod Direct" />
        <meta property="og:description" content="Washington DC's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of DC." />
        <meta property="og:url" content="https://medmethoddirect.com/washington-dc" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Washington DC | MedMethod Direct" />
        <meta name="twitter:description" content="Washington DC's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Same-week appointments. Dr. Jumana Al-Deek, DO." />
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
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse 60% 60% at 15% 50%, rgba(232,51,158,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 85% 20%, rgba(122,30,126,0.10) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.12)", color: "#E8339E" }}>
                <MapPin className="w-3.5 h-3.5" />
                Licensed in Washington DC · Serving All Neighborhoods
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
                for DC women
              </h1>
              <p className="mb-8 max-w-[560px] text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                Washington DC's only virtual clinic combining physician-led{" "}
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
                  SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#neighborhoods"
                  className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wider border transition-all hover:border-[#E8339E]/50"
                  style={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.15)" }}
                >
                  VIEW NEIGHBORHOODS
                </a>
              </div>

            </div>

            {/* Right: service highlights card */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-physician-female-v3b-3NEpBwyZhzMihSjxBbfYig.webp"
                  alt="Virtual hormone therapy and menopause doctor for women in Washington DC — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
                  <p className="text-white font-bold text-sm tracking-wide">Serving Georgetown · Capitol Hill · Dupont Circle · Chevy Chase DC · Friendship Heights</p>
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
            Washington DC's Premier Virtual Hormone Clinic
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
            Washington DC Has Been Missing
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-base">
            <p>
              If you've been searching for a{" "}
              <strong className="text-[#111111]">virtual hormone therapy doctor in Washington DC</strong>,{" "}
              a <strong className="text-[#111111]">perimenopause specialist DC telehealth</strong> practice,
              or a physician who can prescribe{" "}
              <strong className="text-[#111111]">semaglutide or tirzepatide online in DC</strong> — you've found it.
              MedMethod Direct is a physician-led virtual clinic serving women throughout the entire District of Columbia,
              from Georgetown and Capitol Hill to Dupont Circle, Chevy Chase DC, and beyond.
            </p>
            <p>
              Washington DC is home to federal executives, senior attorneys, lobbyists, diplomats, and policy professionals —
              people who understand medicine and have zero patience for healthcare that doesn't meet their standard. The problem
              isn't access to doctors in DC. It's access to <em>time</em>. A 12-minute appointment with a rotating provider
              isn't care. It's triage. MedMethod Direct was built for DC women who expect 30–60 minute, physician-led
              appointments — without the 4–8 week wait or the parking garage.
            </p>
            <p>
              What makes MedMethod Direct different from other{" "}
              <strong className="text-[#111111]">telehealth menopause treatment DC</strong> options is the integration.
              Most virtual platforms treat hormones and weight loss as separate programs. We treat them as the same problem —
              because for most women in perimenopause and menopause, they are. Declining estrogen drives insulin resistance.
              Insulin resistance makes GLP-1 medications less effective. Treating one without the other is why so many women
              plateau. Our program addresses both simultaneously, under the direct oversight of{" "}
              <strong className="text-[#111111]">Dr. Jumana Al-Deek, DO</strong>.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Licensed to see patients throughout all of Washington DC",
              "Hormones + weight loss treated as one integrated program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near you in DC",
              "Same-week availability — no 4–8 week wait",
              "One physician for your full 6 or 12-month program",
              "Medications shipped directly to your DC address",
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
              "Online Menopause Doctor Washington DC",
              "Virtual Hormone Therapy DC",
              "GLP-1 Weight Loss Washington DC",
              "Semaglutide DC Online",
              "Perimenopause Specialist DC",
              "BHRT Washington DC Virtual",
              "Menopause Doctor Georgetown DC",
              "Telehealth Women's Health DC",
              "Tirzepatide Washington DC",
              "Testosterone Therapy Women DC",
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
              Georgetown · Capitol Hill · Dupont Circle · NW DC
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
              Each page is tailored with neighborhood-specific content, local FAQs, and the same physician-led care. Click your area to learn more.
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
                    <span className="font-black text-[#111111] text-base">{n.name}, DC</span>
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
            {/* General DC card */}
            <div
              className="rounded-2xl border p-6 flex flex-col justify-between"
              style={{ borderColor: "rgba(232,51,158,0.25)", background: "linear-gradient(135deg, rgba(232,51,158,0.04), rgba(122,30,126,0.04))" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                  <span className="font-black text-[#111111] text-base">All of Washington DC</span>
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: "#E8339E" }}>District-wide coverage</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Don't see your neighborhood? We serve patients throughout the entire District — from Adams Morgan and Logan Circle to Anacostia, Brookland, and everywhere in between.
                </p>
                <p className="text-xs font-bold text-gray-400">Adams Morgan · Logan Circle · Columbia Heights · Brookland · Anacostia · and more</p>
              </div>
              <button
                onClick={() => setConsultOpen(true)}
                className="mt-5 w-full btn-gradient py-2.5 rounded-full text-xs font-bold tracking-wider"
              >
                SCHEDULE FREE CONSULTATION
              </button>
            </div>
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>More DC-Area Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Alexandria", href: "/dc/alexandria" },
                { name: "Falls Church", href: "/dc/falls-church" },
                { name: "Tysons", href: "/dc/tysons" },
                { name: "Herndon", href: "/dc/herndon" },
                { name: "Chevy Chase MD", href: "/dc/chevy-chase-md" },
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
              MedMethod Direct vs. Local DC Practices
            </h2>
            <p className="mt-3 text-gray-500 text-sm max-w-[480px] mx-auto">
              DC has excellent in-person medicine — but even the best local practices can't offer what a physician-led virtual program can.
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
              What DC Women Are Saying
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
              DC Patients Ask
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── TRI-STATE CROSS-LINK ──────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8">
            <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-3" style={{ color: "#E8339E" }}>
              The DC Metro Tri-State Cluster
            </span>
            <h2
              className="font-black"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                color: "#111111",
              }}
            >
              Also Serving Virginia &amp; Maryland
            </h2>
            <p className="mt-3 text-gray-500 text-sm max-w-[560px] mx-auto">
              MedMethod Direct is licensed in DC, Virginia, and Maryland. If you live near the DC border, your neighbors across the state line have their own dedicated pages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <a
              href="/virginia/mclean"
              className="group flex items-center justify-between rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FAFAFA" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4" style={{ color: "#E8339E" }} />
                  <span className="font-black text-[#111111] text-sm">McLean, Virginia</span>
                </div>
                <p className="text-xs text-gray-500">Minutes from Georgetown — across the Potomac</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E8339E] transition-colors" />
            </a>
            <a
              href="/maryland/bethesda"
              className="group flex items-center justify-between rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FAFAFA" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4" style={{ color: "#E8339E" }} />
                  <span className="font-black text-[#111111] text-sm">Bethesda, Maryland</span>
                </div>
                <p className="text-xs text-gray-500">Adjacent to Friendship Heights and Chevy Chase DC</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E8339E] transition-colors" />
            </a>
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
            Washington DC — District-wide
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
            Available to all Washington DC residents — from Georgetown and Capitol Hill to Dupont Circle and beyond.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
          >
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs mt-5">
            Serving Georgetown · Capitol Hill · Dupont Circle · Chevy Chase DC · Friendship Heights · Adams Morgan · Logan Circle · and all of Washington DC
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
