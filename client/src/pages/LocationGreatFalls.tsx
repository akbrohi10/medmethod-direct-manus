/* =============================================================================
   /virginia/great-falls — Great Falls, Virginia Location Page
   Brand: Montserrat, Medical Pink #E8339E → Deep Purple #7A1E7E gradient
   Structure: Helmet SEO → Navbar → Hero → Intro → DiagnosticSetup →
   PopularPrograms → Services → HowItWorks → DarkDivider → WhyChoose →
   WhyGreatFalls cards → Testimonials → MedicalTeam → FAQ → CTA → Footer
   Primary keyword: menopause doctor Great Falls VA
   Secondary: hormone therapy Great Falls Virginia, GLP-1 weight loss Great Falls VA,
   menopause specialist near Great Falls, virtual women's health Great Falls Virginia,
   bioidentical hormone therapy Great Falls, perimenopause treatment Great Falls VA,
   semaglutide Great Falls Virginia, testosterone therapy for women Virginia
   Long-tail: perimenopause weight gain doctor Great Falls, compounded semaglutide
   Virginia telehealth, online hormone testing Virginia, virtual menopause care
   Northern Virginia, menopause brain fog doctor Great Falls
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
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

// Hero image — upscale Great Falls / Northern Virginia aesthetic
const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/mclean-va-hero-hiQN5USVEHUpy3yYQuwFUK.webp";

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
  "name": "MedMethod Direct — Great Falls, Virginia",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Great Falls, Virginia. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Virginia.",
  "url": "https://medmethoddirect.com/virginia/great-falls",
  "telephone": "",
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
  "areaServed": [
    { "@type": "City", "name": "Great Falls", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "McLean", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Vienna", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Reston", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Herndon", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Potomac", "containedInPlace": { "@type": "State", "name": "Maryland" } },
  ],
  "hasMap": "https://medmethoddirect.com/virginia/great-falls",
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
      "name": "Do you serve patients in Great Falls, Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — MedMethod Direct is fully licensed to serve patients throughout Virginia, including Great Falls, McLean, Vienna, Reston, Herndon, and the greater Northern Virginia area. All care is delivered 100% virtually, so you never need to leave Great Falls.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide prescribed online in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. Prescriptions are issued after a thorough review of your labs and health history, and medications are shipped directly to your Great Falls address.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need to drive to an office for bloodwork?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Great Falls — including locations in Reston, Herndon, and McLean. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Is telehealth as effective as in-person care for menopause and hormones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near Great Falls, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Why choose virtual care over a local specialist near Great Falls?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Great Falls has limited local options for specialized menopause and hormone care — most women drive to McLean, Reston, or Tysons for specialist appointments, often waiting 3–6 weeks. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — without leaving Great Falls.",
      },
    },
    {
      "@type": "Question",
      "name": "How is MedMethod Direct different from other telehealth services like Hers or Winona?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation.",
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
    {
      "@type": "Question",
      "name": "What is the cost of a program for Great Falls patients?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Programs require a commitment of either six or twelve months. Pricing is discussed during your free consultation so we can match you to the right program for your goals and budget. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
      },
    },
  ],
};

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do you serve patients in Great Falls, Virginia?",
    a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Virginia, including Great Falls, McLean, Vienna, Reston, Herndon, and the greater Northern Virginia area. All care is delivered 100% virtually, so you never need to leave Great Falls.",
  },
  {
    q: "Can I get semaglutide or tirzepatide prescribed online in Virginia?",
    a: "Yes. Dr. Al-Deek can prescribe both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy. Medications are shipped directly to your Great Falls address.",
  },
  {
    q: "Do I need to drive to an office for bloodwork?",
    a: "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Great Falls — including locations in Reston, Herndon, and McLean. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
  },
  {
    q: "Is telehealth as effective as in-person care for menopause and hormones?",
    a: "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near Great Falls, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
  },
  {
    q: "Why choose virtual care over a local specialist near Great Falls?",
    a: "Great Falls has limited local options for specialized menopause and hormone care — most women drive to McLean, Reston, or Tysons for specialist appointments, often waiting 3–6 weeks. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — without leaving Great Falls.",
  },
  {
    q: "How is MedMethod Direct different from other telehealth services like Hers or Winona?",
    a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation.",
  },
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
  },
  {
    q: "What is the cost of a program for Great Falls patients?",
    a: "Programs require a commitment of either six or twelve months. Pricing is discussed during your free consultation so we can match you to the right program for your goals and budget. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "There are almost no specialist options in Great Falls itself — I was driving to Reston and waiting six weeks for every appointment. MedMethod Direct was a revelation. Same-week availability, a doctor who actually listened, and I finally have a hormone protocol that works.",
    name: "Patient",
    location: "Great Falls, VA",
  },
  {
    quote: "I had been struggling with perimenopause weight gain for two years and nothing was working. The combination of hormone therapy and GLP-1 together was the missing piece. Down 19 lbs and my energy is completely different.",
    name: "Patient",
    location: "Great Falls, VA — Walker Road area",
  },
  {
    quote: "The convenience is unreal. I'm a busy professional and the last thing I need is a 45-minute drive to McLean or Tysons for a 12-minute appointment. Virtual care with a physician who actually knows my case has been transformative.",
    name: "Patient",
    location: "McLean, VA",
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
        <span
          className="font-bold text-base"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p
          className="pb-5 text-sm leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationGreatFalls() {
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
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Great Falls, VA | MedMethod Direct</title>
        <meta
          name="description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Great Falls, VA. Physician-prescribed semaglutide, BHRT & testosterone. See a doctor this week — free consultation."
        />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/great-falls" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Great Falls, VA | MedMethod Direct" />
        <meta
          property="og:description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Great Falls, VA. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation."
        />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/great-falls" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Great Falls, VA | MedMethod Direct" />
        <meta
          name="twitter:description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Great Falls, VA. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation."
        />
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_MEDICAL_BUSINESS)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_FAQ)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": "Virtual Hormone, Menopause & Weight Loss Doctor in Great Falls, VA",
            "url": "https://medmethoddirect.com/virginia/great-falls",
            "description": "MedMethod Direct provides physician-led virtual hormone therapy, GLP-1 medical weight loss (semaglutide, tirzepatide), menopause management, BHRT, and testosterone therapy for women in Great Falls, Virginia.",
            "about": [
              { "@type": "MedicalCondition", "name": "Menopause" },
              { "@type": "MedicalCondition", "name": "Perimenopause" },
              { "@type": "MedicalCondition", "name": "Hormonal Imbalance" },
              { "@type": "MedicalCondition", "name": "Obesity" },
              { "@type": "MedicalCondition", "name": "Insulin Resistance" },
            ],
            "specialty": "Women's Health, Hormone Medicine, Medical Weight Loss",
            "lastReviewed": "2026-03-01",
            "reviewedBy": {
              "@type": "Physician",
              "name": "Dr. Jumana Al-Deek",
              "honorificSuffix": "DO",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
              { "@type": "ListItem", "position": 2, "name": "Virginia", "item": "https://medmethoddirect.com/virginia" },
              { "@type": "ListItem", "position": 3, "name": "Great Falls", "item": "https://medmethoddirect.com/virginia/great-falls" },
            ],
          })}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)",
          }}
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
                  Serving Great Falls, Virginia
                </div>

                <h1
                  className="font-black leading-[1.05] mb-5"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)",
                    letterSpacing: "-0.02em",
                    color: "#111111",
                  }}
                >
                  VIRTUAL{" "}
                  <span style={gradientText}>HORMONE,</span>
                  <br />
                  <span style={gradientText}>MENOPAUSE</span>{" "}&amp;{" "}
                  <span style={gradientText}>WEIGHT LOSS</span>
                  <br />
                  FOR GREAT FALLS WOMEN
                </h1>

                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
                >
                  The only virtual clinic in Virginia combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Great Falls.
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
                    <circle cx="8" cy="8" r="8" fill="url(#vcGradGF)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGradGF" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                  </svg>
                  100% Virtual Care · Licensed in Virginia
                </p>

                <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                  {[
                    { value: `${count1.toLocaleString()}+`, label: "Women Served" },
                    { value: `${count2}%`, label: "Satisfaction Rate" },
                    { value: "4.9★", label: "Patient Rating" },
                    { value: `${count3}%+`, label: "Avg. Weight Loss" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        className="font-black leading-none"
                        style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", ...gradientText }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Hero Image */}
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={gradientBg} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={HERO_IMAGE}
                    alt="Virtual menopause doctor and hormone therapy for women in Great Falls, Virginia — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                  >
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      Serving Great Falls · McLean · Vienna · Reston · Herndon
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="w-full" style={{ height: "4px", ...gradientBg }} />
      </section>

      {/* ── KEYWORD-RICH INTRO ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <h2
            className="font-black mb-6 leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#111111" }}
          >
            Hormone Therapy. Medical Weight Loss. Menopause Care.{" "}
            <span style={gradientText}>All in One Place — For Great Falls Women.</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you live in Great Falls and you've been searching for a{" "}
              <strong>menopause doctor near Great Falls, VA</strong>, a{" "}
              <strong>medical weight loss physician serving Great Falls, Virginia</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              Great Falls is one of the wealthiest communities in the United States — and one of the most underserved when it comes to specialized women's hormone and metabolic care. Most women in Great Falls are driving to McLean, Reston, or Tysons for specialist appointments, waiting weeks, and getting 12-minute slots. MedMethod Direct changes that entirely. We specialize in{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy (BHRT)</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care — all managed virtually by Dr. Jumana Al-Deek, DO.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Virginia that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No siloed specialists. No commute. Just one team, one plan, and results that last.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999", fontFamily: "Montserrat, sans-serif" }}>
              Related reading:
            </span>
            {[
              { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
              { label: "Semaglutide vs. tirzepatide for women", href: "/blog/semaglutide-vs-tirzepatide-women-midlife" },
              { label: "Can hormone therapy help with weight & sleep?", href: "/blog/hormone-therapy-weight-sleep-metabolism" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#E8339E",
                  borderColor: "rgba(232,51,158,0.3)",
                  background: "rgba(232,51,158,0.04)",
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC SETUP ($449) ───────────────────────────────────────── */}
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />

      {/* ── POPULAR PROGRAMS ─────────────────────────────────────────────── */}
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── DARK DIVIDER BAND ─────────────────────────────────────────────── */}
      <div
        className="w-full flex flex-col items-center justify-center text-center px-6"
        style={{
          background: "#0D0D1A",
          borderTop: "1px solid rgba(232,51,158,0.18)",
          borderBottom: "1px solid rgba(232,51,158,0.18)",
          padding: "52px 24px",
        }}
      >
        <span
          className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-5"
          style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
        >
          The MedMethod Standard
        </span>
        <p
          className="font-black leading-tight max-w-3xl mx-auto"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(1.3rem, 2.8vw, 2rem)",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          "The system you've been missing —{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #E8339E 0%, #B06FE8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            built by physicians, for women.
          </span>
          "
        </p>
        <p
          className="mt-4 text-sm max-w-xl mx-auto"
          style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}
        >
          Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
        </p>
      </div>

      {/* ── WHY MOST PEOPLE FAIL / THE MEDMETHOD WAY ─────────────────────── */}
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── WHY GREAT FALLS WOMEN CHOOSE US ──────────────────────────────── */}
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
              Why Great Falls Women Choose{" "}
              <span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "No Drive to McLean or Reston",
                body: "Great Falls has limited local specialist options. Most women are commuting 20–30 minutes each way for a 12-minute appointment. We bring the specialist to you — from your home, on your schedule.",
              },
              {
                icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "30–60 Minute Appointments",
                body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life — not a generic template.",
              },
              {
                icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Hormones + Weight Loss: Treated Together",
                body: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, testosterone optimization, and metabolic medicine into one unified program. That's why our results last.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Dedicated Wellness Advisor",
                body: "Between every physician visit, your personal wellness advisor is available to answer questions, adjust your plan, and keep you on track — something no local practice offers.",
              },
              {
                icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Lab Work Near Great Falls",
                body: "We order your labs to a convenient LabCorp or Quest Diagnostics draw site near Great Falls — including locations in Reston, Herndon, and McLean. Results reviewed within 48 hours.",
              },
              {
                icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "GLP-1s + Hormones Delivered to Your Door",
                body: "Semaglutide, tirzepatide, BHRT, testosterone — FDA-approved brands or compounded alternatives from our 503B pharmacy, shipped directly to your Great Falls address, discreetly and on schedule.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-6 bg-white shadow-sm border"
                style={{ borderColor: "rgba(232,51,158,0.12)" }}
              >
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

      {/* ── PATIENT TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Real Patients
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}
            >
              What Women in{" "}
              <span style={gradientText}>Virginia Are Saying</span>
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

      {/* ── MEDICAL TEAM ──────────────────────────────────────────────────────── */}
      <MedicalTeam />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}
            >
              Frequently Asked Questions for{" "}
              <span style={gradientText}>Great Falls Patients</span>
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
            Great Falls, Virginia
          </p>
          <h2
            className="font-black text-white leading-tight mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Ready to Feel Like Yourself Again?
          </h2>
          <p
            className="text-white/85 text-base leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Women in Great Falls deserve more than a rushed appointment and a long commute. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you — not for the average patient. Your free consultation is 20 minutes and completely obligation-free.
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
            100% Virtual · No Obligation · No Pressure · Licensed in Virginia
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
