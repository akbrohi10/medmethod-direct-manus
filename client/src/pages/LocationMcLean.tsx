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
import { useState, useEffect } from "react";
import { pricingFaqs } from "@/data/pricingFaqs";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, ChevronDown, Clock, MapPin, Package, Quote, Smartphone, Star, Video } from "lucide-react";
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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg";

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
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in McLean, Virginia. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Virginia.",
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
        "text": "Most local practices in McLean and Tysons have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated performance coach between visits. You get more time, more attention, and deeper expertise — all from your home in McLean.",
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
        "text": "Programs require a commitment of either six or twelve months. Pricing is discussed during your appointment so we can match you to the right program for your goals and budget. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
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
    a: "Most local practices in McLean and Tysons have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated performance coach between visits. You get more time, more attention, and deeper expertise — all from your home in McLean.",
  },
  {
    q: "How is MedMethod Direct different from other telehealth services like Hers or Winona?",
    a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation.",
  },
  ...pricingFaqs,
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
  },
  {
    q: "What is the cost of a program for McLean patients?",
    a: "Programs require a commitment of either six or twelve months. Pricing is discussed during your appointment so we can match you to the right program for your goals and budget. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
  },

  {
    q: "What makes MedMethod Direct different from other telehealth services?",
    a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path \u2014 starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Performance Coach throughout your entire journey.",
  },
  {
    q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
    a: "Yes \u2014 this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido \u2014 these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Performance Coach.",
  },
  {
    q: "How is this different from just getting a prescription online?",
    a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Performance Coach who supports you every step of the way. We treat the whole person, not just a symptom.",
  },
  {
    q: "What kind of lab work do you order?",
    a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan \u2014 not a guess.",
  },
  {
    q: "Is everything done virtually?",
    a: "Yes \u2014 all consultations, follow-ups, and ongoing care are conducted via telehealth. You'll complete lab work at a local lab near you (we'll provide the order), and your medications (FDA-approved brand or compounded from a licensed 503B outsourcing pharmacy) and supplements are shipped directly to your home. No waiting rooms, no commuting, no disruption to your schedule.",
  },
  {
    q: "How quickly will I see results?",
    a: "Many patients report noticeable improvements in sleep, energy, and mood within 4\u20136 weeks of starting treatment. Optimal hormone balance typically occurs at the 3\u20136 month mark. Weight loss results vary, but most patients see meaningful progress within the first 4\u20138 weeks, especially when the nutrition and fitness plan is followed alongside medical treatment.",
  },
  {
    q: "Do you use FDA-approved medications or compounded ones?",
    a: "Both \u2014 and the distinction matters. FDA-approved brand-name medications like Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, and Zepbound\u00ae have undergone full FDA review for safety and efficacy. Compounded medications use the same active ingredients (Semaglutide or Tirzepatide) but are prepared by a licensed 503B outsourcing facility \u2014 a federally registered, FDA-inspected pharmacy held to strict quality and sterility standards. Compounded options are often more affordable and allow for custom dosing. Your physician will discuss both options during your consultation and recommend the best fit based on your insurance, budget, and clinical needs. Either way, your medication ships directly to your door.",
  },
  {
    q: "How is pricing structured?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your appointment will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible \u2014 and we're committed to being upfront about every cost.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "Military spouse life means moving every few years and starting over with new doctors who don\'t know your history. MedMethod follows me wherever we\'re stationed. Virtual visits, meds shipped to my door, and a physician who actually remembers my case. This is what modern healthcare should look like.", name: "Rachel T.", location: "McLean, VA" },
  { quote: "I tried tirzepatide through another telehealth company and lost 12 pounds but then completely plateaued. Turns out my estrogen and thyroid were both tanking and nobody was looking at the full picture. MedMethod added bioidentical hormones and optimized my thyroid — broke through the plateau in three weeks. I\'m down 34 lbs total and my husband says I look ten years younger.", name: "Lauren M.", location: "Virginia area" },
  { quote: "I\'m a federal contractor and my schedule is brutal — 6 AM calls, back-to-back meetings, zero time for myself. I kept putting off my health until the hot flashes made it impossible to focus during briefings. MedMethod got me started in under a week. Down 22 lbs, sleeping through the night, and my performance coach checks in every week to keep me on track. That accountability piece was the game-changer.", name: "Katherine D.", location: "Virginia" },
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

const faqCategories = [
  {
    id: "local",
    label: "McLean & VA",
    icon: "\uD83D\uDCCD",
    questions: faqs.slice(0, 10),
  },
  {
    id: "care",
    label: "About Our Care",
    icon: "\uD83E\uDE7A",
    questions: faqs.slice(10, 15),
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "\uD83D\uDC8A",
    questions: faqs.slice(15, 19),
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "\uD83D\uDCB3",
    questions: faqs.slice(19),
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationMcLean() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const [consultOpen, setConsultOpen] = useState(false);



  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── SEO HEAD ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in McLean, VA | MedMethod Direct</title>
        <meta
          name="description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in McLean, VA. Physician-prescribed semaglutide, BHRT & testosterone. See a doctor this week — appointment."
        />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/mclean" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in McLean, VA | MedMethod Direct" />
        <meta
          property="og:description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in McLean, VA. Physician-prescribed semaglutide, BHRT & testosterone. appointment."
        />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/mclean" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in McLean, VA | MedMethod Direct" />
        <meta
          name="twitter:description"
          content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in McLean, VA. Physician-prescribed semaglutide, BHRT & testosterone. appointment."
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
            "name": "Virtual Hormone, Menopause & Weight Loss Doctor in McLean, VA",
            "url": "https://medmethoddirect.com/virginia/mclean",
            "description": "MedMethod Direct provides physician-led virtual hormone therapy, GLP-1 medical weight loss (semaglutide, tirzepatide), menopause management, BHRT, and testosterone therapy for women in McLean, Virginia.",
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
              { "@type": "ListItem", "position": 3, "name": "McLean", "item": "https://medmethoddirect.com/virginia/mclean" },
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
                  Virtual{" "}
                  <span style={gradientText}>Hormone,</span>
                  <br />
                  <span style={gradientText}>Menopause</span>{" "}&amp;{" "}
                  <span style={gradientText}>Weight Loss</span>
                  <br />
                  for McLean women
                </h1>

                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
                >
                  A virtual clinic in Virginia combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in McLean.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    SCHEDULE appointment
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
            Hormone Therapy. Medical Weight Loss. Menopause Care.{" "}
            <span style={gradientText}>All in One Place — For McLean Women.</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you live in McLean and you've been searching for a{" "}
              <strong>menopause doctor near McLean, VA</strong>, a{" "}
              <strong>medical weight loss physician in McLean, Virginia</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              We specialize in the full spectrum of women's metabolic and hormonal health:{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care. Everything is managed virtually by Dr. Jumana Al-Deek, DO — a physician who has dedicated her practice to helping women in their 40s, 50s, and beyond reclaim their bodies and their energy.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the few virtual practices in Virginia that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No siloed specialists. No starting over. Just one team, one plan, and results that last.
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

      {/* ── SERVICES (reused from homepage) ──────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS (reused from homepage) ──────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      {/* ── WHY MCLEAN WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY MCLEAN WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy Fairfax County Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "60-Minute Physician Consultations", desc: "Not a rushed 10-minute slot. Your physician has time to listen, review your labs, and build a protocol that fits your life." },
              { icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Hormones + Weight Loss: Treated Together", desc: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, and metabolic medicine into one unified program." },
              { icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Dedicated Performance Coach", desc: "Between every physician visit, your personal performance coach answers questions, adjusts your plan, and keeps you on track." },
              { icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Lab Work Near McLean", desc: "We order your labs to a convenient LabCorp or Quest draw site near McLean. Results reviewed within 48 hours." },
              { icon: <Package className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Medications Delivered to Your Door", desc: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your McLean address, discreetly and on schedule." },
              { icon: <Smartphone className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "100% Virtual — No Commute", desc: "Every consultation happens over secure video. No waiting rooms, no traffic — just expert care from your living room." },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(232,51,158,0.08)" }}>{card.icon}</div>
                <h3 className="font-bold text-[#111111] text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B06FE8 100%)",
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
      {/* ── FAQ (Categorized Tabs) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>McLean Patients</span>
            </h2>
          </div>
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqTab(cat.id)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  background: activeFaqTab === cat.id ? "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" : "#fff",
                  color: activeFaqTab === cat.id ? "#fff" : "#555",
                  borderColor: activeFaqTab === cat.id ? "transparent" : "#e5e5e5",
                  boxShadow: activeFaqTab === cat.id ? "0 4px 14px rgba(232,51,158,0.25)" : "none",
                }}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          {/* Active tab content */}
          <div className="min-h-[200px]">
            <div className="mb-4">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                {activeFaqCategory.label}
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#888" }}>
                {activeFaqCategory.questions.length} questions
              </p>
            </div>
            {activeFaqCategory.questions.map((faq) => (
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
            Women in McLean deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you — not for the average patient. Your appointment is 20 minutes and completely obligation-free.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="bg-white font-bold rounded-full px-8 py-4 text-sm tracking-wider flex items-center gap-2 mx-auto group hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
          >
            SCHEDULE MY appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/70 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            100% Virtual · No Obligation · No Pressure · Licensed in Virginia
          </p>
        </div>
      </section>

      {/* Cross-link: McLean → Bethesda */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>ALSO SERVING NEARBY</p>
            <h3 className="font-black text-xl mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#0D0D1A", letterSpacing: "-0.02em" }}>Bethesda, Maryland — Just Across the DC Line</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              MedMethod Direct serves patients on both sides of the Virginia–Maryland border. If you live or work in Bethesda, Chevy Chase, or anywhere in Montgomery County, you can access the same physician-led hormone therapy and GLP-1 weight loss programs available to our McLean patients — 100% virtually, from home. Many of our patients commute between McLean and Bethesda; your care travels with you.
            </p>
          </div>
          <a
            href="/maryland/bethesda"
            className="inline-flex items-center gap-2 font-bold text-sm tracking-wider rounded-full px-7 py-3 whitespace-nowrap transition-all hover:shadow-lg flex-shrink-0"
            style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", color: "#fff" }}
          >
            View Bethesda Service Area <ArrowRight className="w-4 h-4" />
          </a>
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
