/* =============================================================================
   McLean, Virginia Location Page — MedMethod Direct
   Brand: Montserrat, Medical Pink #E8339E → Deep Purple #7A1E7E gradient
   Structure: Helmet SEO → Navbar → Hero → Intro → Services → HowItWorks →
   VirtualVsLocal → WhyChoose → Testimonials → MedicalTeam → FAQ → CTA → Footer
   Primary keyword: menopause doctor McLean VA
   Secondary: hormone therapy McLean Virginia, GLP-1 weight loss McLean VA,
   semaglutide McLean Virginia, bioidentical hormone therapy McLean,
   perimenopause treatment McLean VA, virtual menopause care McLean Virginia,
   women's health telehealth McLean, testosterone therapy for women Virginia
   Long-tail: perimenopause weight gain doctor McLean, compounded semaglutide
   Virginia telehealth, online hormone testing Virginia, can I get semaglutide
   online in Virginia, menopause brain fog doctor Northern Virginia
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
import StickyMobileCTA from "@/components/StickyMobileCTA";

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
  "name": "MedMethod Direct — McLean, Virginia",
  "description": "Virtual menopause doctor and hormone therapy clinic serving women in McLean, Virginia. Specializing in GLP-1 weight loss, HRT, perimenopause management, and longevity medicine.",
  "url": "https://medmethoddirect.com/virginia/mclean",
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
    { "@type": "City", "name": "McLean", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Great Falls", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Vienna", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Reston", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Arlington", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Tysons Corner", "containedInPlace": { "@type": "State", "name": "Virginia" } },
  ],
  "hasMap": "https://medmethoddirect.com/virginia/mclean",
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
      "name": "Do you serve patients in McLean, Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — MedMethod Direct is fully licensed to serve patients throughout Virginia, including McLean, Great Falls, Vienna, Reston, Arlington, and the greater Northern Virginia area. All care is delivered 100% virtually, so you never need to leave McLean.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide online in Virginia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your McLean address.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need to come into an office for bloodwork?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you in McLean or Northern Virginia. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Is telehealth as effective as in-person care for menopause and hormones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near McLean, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
      },
    },
    {
      "@type": "Question",
      "name": "Why choose virtual care over a local OB/GYN or endocrinologist in McLean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most local practices in McLean and Tysons have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home in McLean.",
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
      "name": "What is the cost of a program for McLean patients?",
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
    q: "Do you serve patients in McLean, Virginia?",
    a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Virginia, including McLean, Great Falls, Vienna, Reston, Arlington, and the greater Northern Virginia area. All care is delivered 100% virtually, so you never need to leave McLean.",
  },
  {
    q: "Can I get semaglutide or tirzepatide online in Virginia?",
    a: "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your McLean address.",
  },
  {
    q: "Do I need to come into an office for bloodwork?",
    a: "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you in McLean or Northern Virginia. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
  },
  {
    q: "Is telehealth as effective as in-person care for menopause and hormones?",
    a: "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. A 2024 Yale University study found telehealth and in-person care equally effective for improving patient quality of life. Lab work is ordered to a local draw site near McLean, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
  },
  {
    q: "Why choose virtual care over a local OB/GYN or endocrinologist in McLean?",
    a: "Most local practices in McLean and Tysons have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home in McLean.",
  },
  {
    q: "How is MedMethod Direct different from other telehealth services like Hers or Winona?",
    a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation.",
  },
  {
    q: "Do you accept insurance?",
    a: "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by insurance coverage limits. Many patients use HSA or FSA funds for their program. We provide itemized receipts for potential out-of-network reimbursement.",
  },
  {
    q: "What is the cost of a program for McLean patients?",
    a: "Programs require a commitment of either six or twelve months. Pricing is discussed during your free consultation so we can match you to the right program for your goals and budget. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I had been to three different doctors in Northern Virginia and none of them took my symptoms seriously. My first call with MedMethod Direct was the first time I felt genuinely heard. Within 60 days I had more energy than I'd had in years.",
    name: "Patient",
    location: "Fairfax County, VA",
  },
  {
    quote: "I was skeptical about virtual care at first. But the convenience is unreal — no traffic on the Beltway, no waiting room, and I actually get to talk to my doctor for more than 10 minutes. The hormone therapy has been life-changing.",
    name: "Patient",
    location: "McLean, VA",
  },
  {
    quote: "The GLP-1 program changed everything for me. I'd tried everything locally and nothing worked. This was different — they actually looked at my hormones alongside the weight loss piece. Down 22 lbs and I feel like myself again.",
    name: "Patient",
    location: "Northern Virginia",
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
export default function LocationMcLean() {
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
        <title>Virtual Menopause Doctor in McLean, VA | MedMethod Direct</title>
        <meta
          name="description"
          content="Expert virtual menopause, hormone therapy & GLP-1 weight loss for women in McLean, VA. See a physician this week — no waiting room, no commute. Free consultation."
        />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/mclean" />
        <meta property="og:title" content="Virtual Menopause Doctor in McLean, VA | MedMethod Direct" />
        <meta
          property="og:description"
          content="Expert virtual menopause, hormone therapy & GLP-1 weight loss for women in McLean, VA. See a physician this week — no waiting room, no commute. Free consultation."
        />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/mclean" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Menopause Doctor in McLean, VA | MedMethod Direct" />
        <meta
          name="twitter:description"
          content="Expert virtual menopause, hormone therapy & GLP-1 weight loss for women in McLean, VA. See a physician this week — no waiting room, no commute."
        />
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_MEDICAL_BUSINESS)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(JSONLD_FAQ)}
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
                  Serving McLean, Virginia
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
                  <span style={gradientText}>MENOPAUSE</span>
                  <br />
                  &{" "}
                  <span style={gradientText}>HORMONE CARE</span>
                  <br />
                  FOR MCLEAN WOMEN
                </h1>

                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
                >
                  Physician-prescribed hormone therapy, GLP-1 weight loss, and menopause management for women in McLean, Northern Virginia — no waiting rooms, no rushed appointments, no commute.
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
                    <circle cx="8" cy="8" r="8" fill="url(#vcGrad2)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGrad2" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
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
                    alt="Virtual menopause doctor and hormone therapy for women in McLean, Virginia — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                  >
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      Serving McLean · Great Falls · Vienna · Reston · Arlington
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
            Serving Women in McLean, VA —{" "}
            <span style={gradientText}>From Wherever You Are</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you live in McLean and you've been searching for a{" "}
              <strong>menopause doctor near McLean, VA</strong>, a hormone specialist, or a physician who can help with{" "}
              <strong>GLP-1 weight loss in McLean, Virginia</strong> — you've found the right place. MedMethod Direct is a virtual women's health clinic serving patients throughout Virginia, including McLean, Great Falls, Tysons Corner, Vienna, Reston, and Arlington.
            </p>
            <p>
              We specialize in the health concerns that matter most to women in midlife:{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide</strong> and tirzepatide, and longevity-focused care. Everything is managed virtually by Dr. Jumana Al-Deek, DO — a physician who has dedicated her practice to helping women in their 40s, 50s, and beyond feel like themselves again.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low energy, or low libido — or you're simply looking for a physician who will actually look at your labs and build a plan specific to you — MedMethod Direct offers a level of care that most local practices in Northern Virginia simply cannot match. And because everything is virtual, you can access it from your home in McLean, your office in Tysons, or anywhere in Virginia.
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

      {/* ── POPULAR PROGRAMS ─────────────────────────────────────────────── */}
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES (reused from homepage) ──────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS (reused from homepage) ──────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── VIRTUAL VS. LOCAL ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Why Virtual Wins
            </p>
            <h2
              className="font-black leading-tight mb-4"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", color: "#111111" }}
            >
              Looking for a Menopause Doctor{" "}
              <span style={gradientText}>Near McLean?</span>
              <br />
              Here's Why Virtual Care Delivers More.
            </h2>
            <p
              className="text-base max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}
            >
              We understand the instinct to find someone local. But for menopause, hormone therapy, and GLP-1 weight loss, virtual care isn't just convenient — it's clinically superior in almost every way that matters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-lg border" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
            <table className="w-full text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>
                  <th className="text-left px-6 py-4 text-white font-bold text-xs tracking-wider uppercase">What Matters to You</th>
                  <th className="px-6 py-4 text-white font-bold text-xs tracking-wider uppercase text-center">Local OB/GYN in McLean</th>
                  <th className="px-6 py-4 text-white font-bold text-xs tracking-wider uppercase text-center">MedMethod Direct</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { factor: "Wait time for new patient", local: "3–6 weeks", mmd: "This week", mmdWin: true },
                  { factor: "Appointment length", local: "10–15 minutes", mmd: "30–60 minutes", mmdWin: true },
                  { factor: "Menopause specialization", local: "General OB/GYN", mmd: "Dedicated specialty", mmdWin: true },
                  { factor: "GLP-1 / Semaglutide access", local: "Rarely offered", mmd: "Core service", mmdWin: true },
                  { factor: "Ongoing monitoring", local: "Annual check-in", mmd: "Monthly physician reviews", mmdWin: true },
                  { factor: "Commute required", local: "Yes — Tysons/McLean traffic", mmd: "None — 100% virtual", mmdWin: true },
                  { factor: "Dedicated wellness advisor", local: "No", mmd: "Yes — between every visit", mmdWin: true },
                  { factor: "Lab work", local: "In-office only", mmd: "Local LabCorp/Quest near McLean", mmdWin: true },
                  { factor: "Bioidentical hormone options", local: "Limited", mmd: "Full range available", mmdWin: true },
                  { factor: "Testosterone therapy for women", local: "Rarely offered", mmd: "Core service", mmdWin: true },
                ].map((row, i) => (
                  <tr key={row.factor} style={{ background: i % 2 === 0 ? "#fff" : "rgba(232,51,158,0.02)" }}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{row.factor}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.local}</td>
                    <td className="px-6 py-4 text-center font-bold" style={{ color: row.mmdWin ? "#E8339E" : "#555" }}>
                      {row.mmdWin && <CheckCircle className="w-4 h-4 inline mr-1.5 mb-0.5" style={{ color: "#E8339E" }} />}
                      {row.mmd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Persuasion block */}
          <div
            className="mt-12 rounded-2xl p-8 lg:p-10"
            style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.06) 100%)", border: "1px solid rgba(232,51,158,0.15)" }}
          >
            <p className="text-lg font-bold leading-relaxed text-center" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>
              "It's easy to click out, and difficult to show up. But this time it's for you."
            </p>
            <p className="text-sm text-center mt-3 mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#666" }}>
              Women in McLean, Great Falls, and Vienna are discovering that the best care isn't always the closest — it's the most attentive, the most specialized, and the most convenient for your actual life.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setConsultOpen(true)}
                className="btn-gradient px-6 py-3 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 group"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Schedule My Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY MCLEAN WOMEN CHOOSE US ────────────────────────────────────────── */}
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
              Why McLean Women Choose{" "}
              <span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "No More 6-Week Waits",
                body: "McLean's top OB/GYN practices are booked out for months. We can see you this week — from your home, your office, or anywhere in Northern Virginia.",
              },
              {
                icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "30–60 Minute Appointments",
                body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life — not a generic template.",
              },
              {
                icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Menopause & Hormone Specialists",
                body: "We specialize in hormones, menopause, perimenopause, GLP-1 weight loss, testosterone therapy for women, and longevity medicine — depth of expertise a generalist can't match.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Dedicated Wellness Advisor",
                body: "Between every physician visit, your personal wellness advisor is available to answer questions, adjust your plan, and keep you on track — something no local practice offers.",
              },
              {
                icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Lab Work Near McLean",
                body: "We order your labs to a convenient LabCorp or Quest Diagnostics draw site near McLean or Tysons. No in-office phlebotomy required — results reviewed within 48 hours.",
              },
              {
                icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Medications Delivered to Your Door",
                body: "FDA-approved brands or compounded alternatives from our 503B pharmacy — shipped directly to your McLean address, discreetly and on schedule.",
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

      {/* ── MEDICAL TEAM (reused from homepage) ──────────────────────────────── */}
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
              <span style={gradientText}>McLean Patients</span>
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
            McLean, Virginia
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
            Women in McLean deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you — not for the average patient. Your free consultation is 20 minutes and completely obligation-free.
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
