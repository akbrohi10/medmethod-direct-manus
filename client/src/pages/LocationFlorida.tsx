/* =============================================================================
   Florida Hub Page — MedMethod Direct
   Brand: Montserrat, Medical Pink #E8339E → Deep Purple #7A1E7E gradient
   Structure: Helmet SEO → Navbar → Hero → Intro → Services → HowItWorks →
   WhyChoose → Testimonials → MedicalTeam → FAQ → CTA → Footer
   Primary keyword: menopause doctor Florida telehealth
   Secondary: hormone therapy Florida online, GLP-1 weight loss Florida,
   semaglutide Florida telehealth, virtual menopause care Florida,
   bioidentical hormone therapy Florida, perimenopause treatment Florida,
   women's health telehealth Florida, testosterone therapy women Florida
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
import { pricingFaqs } from "@/data/pricingFaqs";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Clock, Video, Star, MapPin, ChevronDown, Quote } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalTeam from "@/components/MedicalTeam";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/florida-hub-hero-ggUpBHC7z4TNuVPwpZ8K58.webp";

const gradientText = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const JSONLD_MEDICAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Florida",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women throughout Florida. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Florida.",
  "url": "https://medmethoddirect.com/florida",
  "telephone": "",
  "priceRange": "$$",
  "medicalSpecialty": ["Obstetrics and Gynecology", "Endocrinology", "Internal Medicine"],
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", "name": "GLP-1 Weight Loss (Semaglutide & Tirzepatide)" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" },
    { "@type": "MedicalTherapy", "name": "Perimenopause Treatment" },
    { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
    { "@type": "MedicalTherapy", "name": "Thyroid Optimization" },
    { "@type": "MedicalTherapy", "name": "Longevity Medicine" },
  ],
  "areaServed": [
    { "@type": "State", "name": "Florida" },
    { "@type": "City", "name": "Miami", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Boca Raton", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Naples", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Sarasota", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Tampa", "containedInPlace": { "@type": "State", "name": "Florida" } },
  ],
  "hasMap": "https://medmethoddirect.com/florida",
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
      "name": "Do you serve patients in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — MedMethod Direct is fully licensed to serve patients throughout Florida, including Miami, Boca Raton, Naples, Sarasota, Tampa, Fort Lauderdale, Palm Beach, Orlando, and beyond. All care is delivered 100% virtually, so you never need to leave home.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide online in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your Florida address.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need to come into an office for bloodwork in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you anywhere in Florida. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Is telehealth as effective as in-person care for menopause and hormones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near you in Florida, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Why choose virtual care over a local OB/GYN or endocrinologist in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most local practices in Florida have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home in Florida.",
      },
    },
    {
      "@type": "Question",
      "name": "Do you accept insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by insurance coverage limits. Many patients use HSA or FSA funds for their program. We provide itemized receipts for potential out-of-network reimbursement.",
      },
    },
  ],
};

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const localFaqs = [
  {
    q: "Do you serve patients in Florida?",
    a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Florida, including Miami, Boca Raton, Naples, Sarasota, Tampa, Fort Lauderdale, Palm Beach, Orlando, and beyond. All care is delivered 100% virtually, so you never need to leave home.",
  },
  {
    q: "Can I get semaglutide or tirzepatide online in Florida?",
    a: "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your Florida address.",
  },
  {
    q: "Do I need to come into an office for bloodwork in Florida?",
    a: "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you anywhere in Florida. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
  },
  {
    q: "Is telehealth as effective as in-person care for menopause and hormones?",
    a: "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near you in Florida, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
  },
  {
    q: "Why choose virtual care over a local OB/GYN or endocrinologist in Florida?",
    a: "Most local practices in Florida have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home in Florida.",
  },
  {
    q: "Do you accept insurance?",
    a: "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by insurance coverage limits. Many patients use HSA or FSA funds for their program. We provide itemized receipts for potential out-of-network reimbursement.",
  },
];

const faqs = [...localFaqs, ...pricingFaqs];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I live in Boca Raton and had been searching for a menopause specialist for over a year. Every local practice had a 2-month wait. MedMethod Direct saw me within days and I finally feel like myself again.",
    name: "Patient",
    location: "Boca Raton, FL",
  },
  {
    quote: "The GLP-1 program combined with hormone therapy was the missing piece for me. I'd tried semaglutide through another service but it wasn't working. Once they balanced my hormones, the weight finally started moving.",
    name: "Patient",
    location: "Naples, FL",
  },
  {
    quote: "I was nervous about telehealth but honestly it's better than in-person. I'm in Miami and I can do my appointments from my condo. No traffic, no waiting room — just real, focused time with my doctor.",
    name: "Patient",
    location: "Miami, FL",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-bold text-base" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationFlorida() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateCount(setCount1, 0, 10000, 1500);
          animateCount(setCount2, 0, 98, 1200);
          animateCount(setCount3, 0, 15, 1400);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  function animateCount(setter: (v: number) => void, from: number, to: number, duration: number) {
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── SEO HEAD ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Florida | MedMethod Direct</title>
        <meta
          name="description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women throughout Florida. Physician-prescribed semaglutide, BHRT & testosterone. See a doctor this week — free consultation."
        />
        <link rel="canonical" href="https://medmethoddirect.com/florida" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Florida | MedMethod Direct" />
        <meta property="og:description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women throughout Florida. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation." />
        <meta property="og:url" content="https://medmethoddirect.com/florida" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL_BUSINESS)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
            { "@type": "ListItem", "position": 2, "name": "Florida", "item": "https://medmethoddirect.com/florida" },
          ],
        })}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }}
        />
        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* LEFT */}
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                  style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Now Accepting Florida Patients
                </div>
                <h1
                  className="font-black leading-[1.05] mb-5"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}
                >
                  Virtual{" "}
                  <span style={gradientText}>hormone,</span>
                  <br />
                  <span style={gradientText}>menopause</span>{" "}&amp;{" "}
                  <span style={gradientText}>weight loss</span>
                  <br />
                  for Florida women
                </h1>
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
                >
                  The only virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women throughout Florida.
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
                <p
                  className="flex items-center gap-2 font-semibold mb-8"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="url(#vcGradFL)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGradFL" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                  </svg>
                  100% Virtual Care · Licensed in Florida
                </p>
                <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                  {[
                    { value: `${count1.toLocaleString()}+`, label: "Women Served" },
                    { value: `${count2}%`, label: "Satisfaction Rate" },
                    { value: "4.9★", label: "Patient Rating" },
                    { value: `${count3}%+`, label: "Avg. Weight Loss" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", ...gradientText }}>
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
                    src={HERO_IMAGE}
                    alt="Virtual menopause and hormone therapy doctor for women in Florida — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                    loading="eager"
                  />
                </div>
                {/* Trust badge */}
                <div
                  className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3 shadow-xl"
                  style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
                >
                  <p className="text-white text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Licensed in Florida
                  </p>
                  <p className="text-white/80 text-xs mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Miami · Boca · Naples · Sarasota · Tampa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLORIDA CITY LINKS ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-6 text-center" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
            Florida Service Areas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { city: "Miami", href: "/florida/miami" },
              { city: "Boca Raton", href: "/florida/boca-raton" },
              { city: "Naples", href: "/florida/naples" },
              { city: "Sarasota", href: "/florida/sarasota" },
              { city: "Tampa", href: "/florida/tampa" },
            ].map((item) => (
              <Link
                key={item.city}
                href={item.href}
                className="flex flex-col items-center justify-center rounded-2xl p-5 text-center border transition-all hover:shadow-md hover:border-pink-200"
                style={{ borderColor: "rgba(232,51,158,0.15)", background: "rgba(232,51,158,0.02)" }}
              >
                <MapPin className="w-5 h-5 mb-2" style={{ color: "#E8339E" }} />
                <span className="font-bold text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#111" }}>
                  {item.city}
                </span>
                <span className="text-xs mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>
                  View page →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
            Virtual Care for Florida Women
          </p>
          <h2
            className="font-black leading-tight mb-6"
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}
          >
            Florida's premier virtual clinic for{" "}
            <span style={gradientText}>hormones, menopause & weight loss</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#444" }}>
            <p>
              MedMethod Direct is now accepting patients throughout Florida — from Miami and Fort Lauderdale to Naples, Sarasota, Tampa, and beyond. Whether you're in a beachside condo, a suburban home, or anywhere in between, our physician-led virtual clinic brings expert{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care directly to you.
            </p>
            <p>
              Florida has one of the highest concentrations of women in perimenopause and menopause in the country — yet access to specialized, attentive care remains frustratingly limited. Most practices are overbooked, rushed, and insurance-driven. MedMethod Direct is different: a direct-care model where Dr. Jumana Al-Deek, DO, personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. No rushed 10-minute slots. No starting over with a new specialist every time.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC SETUP ─────────────────────────────────────────────────── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />

      {/* ── POPULAR PROGRAMS ─────────────────────────────────────────────────── */}
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── DARK DIVIDER BAND ─────────────────────────────────────────────────── */}
      <div
        className="w-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: "#0D0D1A", borderTop: "1px solid rgba(232,51,158,0.18)", borderBottom: "1px solid rgba(232,51,158,0.18)", padding: "52px 24px" }}
      >
        <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-5" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
          The MedMethod Standard
        </span>
        <p
          className="font-black leading-tight max-w-3xl mx-auto"
          style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.3rem, 2.8vw, 2rem)", color: "#ffffff", letterSpacing: "-0.02em" }}
        >
          "The system you've been missing —{" "}
          <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #B06FE8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            built by physicians, for women.
          </span>
          "
        </p>
        <p className="mt-4 text-sm max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
        </p>
      </div>

      {/* ── WHY CHOOSE ───────────────────────────────────────────────────────── */}
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── WHY FLORIDA WOMEN CHOOSE US ──────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#f9f9fb" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Built for Your Life
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", color: "#111111" }}
            >
              Why Florida women choose{" "}
              <span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "No more 6-week waits",
                body: "Florida's top OB/GYN practices are booked out for months. We can see you this week — from your home, your condo, or anywhere in the Sunshine State.",
              },
              {
                icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "30–60 minute appointments",
                body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life — not a generic template.",
              },
              {
                icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Hormones + weight loss: treated together",
                body: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, testosterone optimization, and metabolic medicine into one unified program.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Dedicated wellness advisor",
                body: "Between every physician visit, your personal wellness advisor is available to answer questions, adjust your plan, and keep you on track — something no local practice offers.",
              },
              {
                icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Lab work near you in Florida",
                body: "We order your labs to a convenient LabCorp or Quest Diagnostics draw site near you anywhere in Florida. No in-office phlebotomy required — results reviewed within 48 hours.",
              },
              {
                icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "GLP-1s + hormones delivered to your door",
                body: "Semaglutide, tirzepatide, BHRT, testosterone — FDA-approved brands or compounded alternatives from our 503B pharmacy, shipped directly to your Florida address, discreetly and on schedule.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-6 bg-white shadow-sm border" style={{ borderColor: "rgba(232,51,158,0.12)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(232,51,158,0.08)" }}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#666" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Real Patients
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              What women in{" "}
              <span style={gradientText}>Florida are saying</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.location}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%)", border: "1px solid rgba(232,51,158,0.12)" }}
              >
                <Quote className="w-8 h-8 opacity-30" style={{ color: "#E8339E" }} />
                <p className="text-sm leading-relaxed flex-1 italic" style={{ fontFamily: "Montserrat, sans-serif", color: "#333" }}>
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-xs font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#111" }}>{t.name}</p>
                  <p className="text-xs" style={{ fontFamily: "Montserrat, sans-serif", color: "#999" }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICAL TEAM ─────────────────────────────────────────────────────── */}
      <MedicalTeam />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently asked questions for{" "}
              <span style={gradientText}>Florida patients</span>
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }}>
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Florida
          </p>
          <h2 className="font-black text-white leading-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            Ready to feel like yourself again?
          </h2>
          <p className="text-white/85 text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Florida women deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you. Your free consultation is 20 minutes and completely obligation-free.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="bg-white font-bold rounded-full px-8 py-4 text-sm tracking-wider flex items-center gap-2 mx-auto group hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
          >
            SCHEDULE MY FREE CONSULTATION
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/70 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            100% Virtual · No Obligation · No Pressure · Licensed in Florida
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
