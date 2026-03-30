/* =============================================================================
   Miami, Florida Location Page — MedMethod Direct
   Primary keyword: menopause doctor Miami FL telehealth
   Secondary: hormone therapy Miami Florida, GLP-1 weight loss Miami,
   semaglutide Miami telehealth, virtual menopause care Miami,
   bioidentical hormone therapy Miami, perimenopause treatment Miami FL,
   women's health telehealth Miami, testosterone therapy women Miami
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
import { pricingFaqs } from "@/data/pricingFaqs";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Clock, Video, Star, MapPin, ChevronDown, Quote } from "lucide-react";
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
import { Link } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/florida-miami-hero-Y4tu8nuXLsdGU7XHcoa6vf.webp";

const gradientText = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const JSONLD_MEDICAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Miami, Florida",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Miami, Florida. Physician-prescribed GLP-1 weight loss (semaglutide, tirzepatide), HRT, BHRT, testosterone therapy, perimenopause management, and longevity medicine — 100% virtual, licensed in Florida.",
  "url": "https://medmethoddirect.com/florida/miami",
  "telephone": "",
  "hasMap": "https://medmethoddirect.com/florida/miami",
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
    { "@type": "City", "name": "Miami", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Miami Beach", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Coral Gables", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Coconut Grove", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Brickell", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Fort Lauderdale", "containedInPlace": { "@type": "State", "name": "Florida" } },
  ],
  "isAcceptingNewPatients": true,
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": {
    "@type": "Physician",
    "name": "Dr. Jumana Al-Deek",
    "honorificSuffix": "DO",
    "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine",
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you serve patients in Miami, Florida?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — MedMethod Direct is fully licensed to serve patients throughout Miami and South Florida, including Miami Beach, Coral Gables, Coconut Grove, Brickell, Fort Lauderdale, and beyond. All care is delivered 100% virtually, so you never need to leave Miami." },
    },
    {
      "@type": "Question",
      "name": "Can I get semaglutide or tirzepatide online in Miami?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your Miami address." },
    },
    {
      "@type": "Question",
      "name": "Do I need to come into an office for bloodwork in Miami?",
      "acceptedAnswer": { "@type": "Answer", "text": "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you in Miami or South Florida. You go in for a standard blood draw, and we review the results together on your next virtual visit." },
    },
    {
      "@type": "Question",
      "name": "Why choose virtual care over a local OB/GYN in Miami?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most local practices in Miami have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home or condo in Miami." },
    },
  ],
};

const localFaqs = [
  { q: "Do you serve patients in Miami, Florida?", a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Miami and South Florida, including Miami Beach, Coral Gables, Coconut Grove, Brickell, Fort Lauderdale, and beyond. All care is delivered 100% virtually, so you never need to leave Miami." },
  { q: "Is there a menopause specialist near Miami?", a: "Yes — MedMethod Direct provides specialist-level menopause care to women in Miami and throughout Miami-Dade County. Dr. Al-Deek is board-certified in family medicine with advanced training in hormone therapy, menopause management, and metabolic health. All visits are 100% virtual, so you get expert care without fighting Miami traffic to see a specialist." },
  { q: "What areas near Miami do you serve?", a: "We serve women throughout Miami-Dade County and South Florida, including Miami, Miami Beach, Coral Gables, Coconut Grove, Brickell, Doral, Kendall, Aventura, and Homestead. Since all care is virtual, you can connect with us from anywhere in Florida." },
  { q: "How does the $449 diagnostic setup work for Miami patients?", a: "After your free consultation, you pay a one-time $449 clinical diagnostic fee. This includes a comprehensive lab panel ordered to a LabCorp or Quest near you in Miami-Dade, a MedMethod Smart Scale shipped to your door, a full hormone and metabolic assessment, and your first physician strategy session to review results and build your personalized protocol." },
  { q: "Can Miami patients get medications delivered to their home?", a: "Absolutely. All compounded medications — including semaglutide and tirzepatide — are shipped directly from our FDA-registered 503B pharmacy to your Miami address. Brand-name prescriptions can also be sent to your local pharmacy in Miami-Dade County if you prefer to use insurance." },
  { q: "Can I get semaglutide or tirzepatide online in Miami?", a: "Yes. We offer access to both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your Miami address." },
  { q: "Do I need to come into an office for bloodwork in Miami?", a: "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you in Miami or South Florida. You go in for a standard blood draw, and we review the results together on your next virtual visit." },
  { q: "Why choose virtual care over a local OB/GYN in Miami?", a: "Most local practices in Miami have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home or condo in Miami." },
  { q: "Do you accept insurance?", a: "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by insurance coverage limits. Many patients use HSA or FSA funds for their program. We provide itemized receipts for potential out-of-network reimbursement." },
  { q: "How is MedMethod Direct different from other telehealth services like Hers or Winona?", a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation." },
  { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door. Your physician will walk you through both options during your consultation." },
];

const faqs = [...localFaqs, ...pricingFaqs,
  {
    q: "What makes MedMethod Direct different from other telehealth services?",
    a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path \u2014 starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Wellness Advisor throughout your entire journey.",
  },
  {
    q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
    a: "Yes \u2014 this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido \u2014 these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Wellness Advisor.",
  },
  {
    q: "How is this different from just getting a prescription online?",
    a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Wellness Advisor who supports you every step of the way. We treat the whole person, not just a symptom.",
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
    q: "What does treatment cost?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your free consultation will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible \u2014 and we're committed to being upfront about every cost.",
  },
];

const testimonials = [
  { quote: "I live in Brickell and had been searching for a menopause specialist for months. Every local practice had a 2-month wait. MedMethod Direct saw me within days and I finally have answers.", name: "Patient", location: "Miami, FL" },
  { quote: "The combination of GLP-1 and hormone therapy was the missing piece. I'd tried semaglutide through another service but it wasn't working. Once they balanced my hormones, everything changed.", name: "Patient", location: "Coral Gables, FL" },
  { quote: "I was skeptical about telehealth but it's honestly better than in-person. No traffic on I-95, no parking — just real, focused time with my doctor from my condo.", name: "Patient", location: "Miami Beach, FL" },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-bold text-base" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>{q}</span>
        <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>{a}</p>
      </div>
    </div>
  );
}

const faqCategories = [
  {
    id: "local",
    label: "Miami & FL",
    icon: "\uD83D\uDCCD",
    questions: faqs.slice(0, 5),
  },
  {
    id: "care",
    label: "About Our Care",
    icon: "\uD83E\uDE7A",
    questions: faqs.slice(5, 10),
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "\uD83D\uDC8A",
    questions: faqs.slice(10, 14),
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "\uD83D\uDCB3",
    questions: faqs.slice(14),
  },
];

export default function LocationMiami() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const [consultOpen, setConsultOpen] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        animateCount(setCount1, 0, 10000, 1500);
        animateCount(setCount2, 0, 98, 1200);
        animateCount(setCount3, 0, 15, 1400);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  function animateCount(setter: (v: number) => void, from: number, to: number, duration: number) {
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setter(Math.round(from + (to - from) * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Miami, FL | MedMethod Direct</title>
        <meta name="description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Miami, FL. Physician-prescribed semaglutide, BHRT & testosterone. See a doctor this week — free consultation." />
        <link rel="canonical" href="https://medmethoddirect.com/florida/miami" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Miami, FL | MedMethod Direct" />
        <meta property="og:url" content="https://medmethoddirect.com/florida/miami" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta property="og:description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Miami, FL. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Miami, FL | MedMethod Direct" />
        <meta name="twitter:description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Miami, FL. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL_BUSINESS)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
                <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": "Virtual Hormone, Menopause & Weight Loss Doctor in Miami, FL",
            "url": "https://medmethoddirect.com/florida/miami",
  "telephone": "",
  "hasMap": "https://medmethoddirect.com/florida/miami",
            "description": "MedMethod Direct provides physician-led virtual hormone therapy, GLP-1 medical weight loss (semaglutide, tirzepatide), menopause management, BHRT, and testosterone therapy for women in Miami, Florida.",
            "about": [
              { "@type": "MedicalCondition", "name": "Menopause" },
              { "@type": "MedicalCondition", "name": "Perimenopause" },
              { "@type": "MedicalCondition", "name": "Hormonal Imbalance" },
              { "@type": "MedicalCondition", "name": "Obesity" },
              { "@type": "MedicalCondition", "name": "Insulin Resistance" },
            ],
            "specialty": "Women's Health, Hormone Medicine, Medical Weight Loss",
            "lastReviewed": "2026-03-28",
            "reviewedBy": {
              "@type": "Physician",
              "name": "Dr. Jumana Al-Deek",
              "honorificSuffix": "DO",
            },
          })}
        </script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" }, { "@type": "ListItem", "position": 2, "name": "Florida", "item": "https://medmethoddirect.com/florida" }, { "@type": "ListItem", "position": 3, "name": "Miami", "item": "https://medmethoddirect.com/florida/miami" }] })}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* HERO */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  Serving Miami, Florida
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}<span style={gradientText}>hormone,</span><br />
                  <span style={gradientText}>menopause</span>{" "}&amp;{" "}<span style={gradientText}>weight loss</span><br />
                  for Miami women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  The only virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Miami and South Florida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="url(#vcGradMIA)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGradMIA" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                  </svg>
                  100% Virtual Care · Licensed in Florida
                </p>
                <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                  {[{ value: `${count1.toLocaleString()}+`, label: "Women Served" }, { value: `${count2}%`, label: "Satisfaction Rate" }, { value: "4.9★", label: "Patient Rating" }, { value: `${count3}%+`, label: "Avg. Weight Loss" }].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", ...gradientText }}>{stat.value}</div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img src={HERO_IMAGE} alt="Virtual menopause and hormone therapy doctor for women in Miami, Florida — MedMethod Direct" className="w-full h-full object-cover" width="640" height="480" loading="eager" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3 shadow-xl" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>
                  <p className="text-white text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Licensed in Florida</p>
                  <p className="text-white/80 text-xs mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Miami · Coral Gables · Miami Beach · Brickell</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Virtual Care for Miami Women</p>
          <h2 className="font-black leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
            Miami's premier virtual clinic for{" "}<span style={gradientText}>hormones, menopause & weight loss</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#444" }}>
            <p>
              If you live in Miami and you've been searching for a <strong>menopause doctor near Miami, FL</strong> or a <strong>medical weight loss physician serving Miami</strong>, you've found the right place.
            </p>
            <p>
              MedMethod Direct is now accepting patients throughout Miami and South Florida — from Brickell and Coral Gables to Miami Beach, Coconut Grove, and Fort Lauderdale. Our physician-led virtual clinic brings expert <strong>perimenopause and menopause management</strong>, <strong>hormone replacement therapy (HRT)</strong>, <strong>bioidentical hormone therapy</strong>, <strong>testosterone optimization for women</strong>, GLP-1 medications including <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care directly to you.
            </p>
            <p>
              Miami is one of the most health-conscious cities in the country — yet specialized menopause and hormone care remains surprisingly hard to access. Most practices are overbooked, rushed, and insurance-driven. MedMethod Direct is different: a direct-care model where Dr. Jumana Al-Deek, DO, personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. Whether you're in a Brickell high-rise or a Coral Gables estate, your care comes to you.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
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
                  color: "#E8339E",
                  borderColor: "rgba(232,51,158,0.3)",
                  background: "rgba(232,51,158,0.04)",
                }}
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      {/* ── PATIENT STORIES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              PATIENT STORIES
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              What Women in Florida Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I spent two years bouncing between my OB-GYN and an endocrinologist. MedMethod got me on the right protocol in one visit. My hot flashes are gone, I'm sleeping through the night, and I've lost 18 pounds.", name: "Sarah M.", location: "Florida Patient", rating: 5 },
              { quote: "The combination of hormone therapy and GLP-1 medication changed everything. I finally feel like myself again — more energy, clearer thinking, and the weight is actually coming off.", name: "Jennifer L.", location: "Florida Patient", rating: 5 },
              { quote: "I was skeptical about telehealth for something this personal, but my MedMethod physician spent a full hour with me. She knew more about menopause than any doctor I've seen in person.", name: "Patricia K.", location: "Florida Patient", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%)" }}>
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

      {/* DARK DIVIDER */}
      <div className="w-full flex flex-col items-center justify-center text-center px-6" style={{ background: "#0D0D1A", borderTop: "1px solid rgba(232,51,158,0.18)", borderBottom: "1px solid rgba(232,51,158,0.18)", padding: "52px 24px" }}>
        <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-5" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>The MedMethod Standard</span>
        <p className="font-black leading-tight max-w-3xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.3rem, 2.8vw, 2rem)", color: "#ffffff", letterSpacing: "-0.02em" }}>
          "The system you've been missing —{" "}
          <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #B06FE8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>built by physicians, for women.</span>"
        </p>
        <p className="mt-4 text-sm max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
        </p>
      </div>

      <WhyChoose onConsultClick={() => setConsultOpen(true)} />
{/* WHY MIAMI WOMEN CHOOSE US */}
      <section className="py-20" style={{ background: "#f9f9fb" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Built for Your Life</p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", color: "#111111" }}>
              Why Miami women choose{" "}<span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "No more 6-week waits", body: "Miami's top practices are booked out for months. We can see you this week — from your condo, your home, or anywhere in South Florida." },
              { icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "30–60 minute appointments", body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life." },
              { icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Hormones + weight loss: treated together", body: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, testosterone optimization, and metabolic medicine into one unified program." },
              { icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Dedicated wellness advisor", body: "Between every physician visit, your personal wellness advisor is available to answer questions, adjust your plan, and keep you on track." },
              { icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Lab work near you in Miami", body: "We order your labs to a convenient LabCorp or Quest Diagnostics draw site near you in Miami or South Florida. Results reviewed within 48 hours." },
              { icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "GLP-1s + hormones delivered to your door", body: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your Miami address, discreetly and on schedule." },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-6 bg-white shadow-sm border" style={{ borderColor: "rgba(232,51,158,0.12)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(232,51,158,0.08)" }}>{card.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#666" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Real Patients</p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              What women in{" "}<span style={gradientText}>Miami are saying</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.location} className="rounded-2xl p-7 flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%)", border: "1px solid rgba(232,51,158,0.12)" }}>
                <Quote className="w-8 h-8 opacity-30" style={{ color: "#E8339E" }} />
                <p className="text-sm leading-relaxed flex-1 italic" style={{ fontFamily: "Montserrat, sans-serif", color: "#333" }}>"{t.quote}"</p>
                <div>
                  <p className="text-xs font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#111" }}>{t.name}</p>
                  <p className="text-xs" style={{ fontFamily: "Montserrat, sans-serif", color: "#999" }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MedicalTeam />
      {/* ── FAQ (Categorized Tabs) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Miami Patients</span>
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

      {/* FINAL CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }}>
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>Miami, Florida</p>
          <h2 className="font-black text-white leading-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>Ready to feel like yourself again?</h2>
          <p className="text-white/85 text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Miami women deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you. Your free consultation is 20 minutes and completely obligation-free.
          </p>
          <button onClick={() => setConsultOpen(true)} className="bg-white font-bold rounded-full px-8 py-4 text-sm tracking-wider flex items-center gap-2 mx-auto group hover:shadow-xl transition-shadow" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>
            SCHEDULE MY FREE CONSULTATION
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/70 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>100% Virtual · No Obligation · No Pressure · Licensed in Florida</p>
        </div>
      </section>

      {/* Cross-link to Florida hub */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>ALSO SERVING NEARBY</p>
            <h3 className="font-black text-xl mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#0D0D1A", letterSpacing: "-0.02em" }}>Boca Raton, Florida — Just Up the Coast</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              MedMethod Direct serves patients throughout South Florida. If you live or work in Boca Raton, Delray Beach, or Palm Beach County, you can access the same physician-led hormone therapy and GLP-1 weight loss programs — 100% virtually, from home.
            </p>
          </div>
          <a href="/florida/boca-raton" className="inline-flex items-center gap-2 font-bold text-sm tracking-wider rounded-full px-7 py-3 whitespace-nowrap transition-all hover:shadow-lg flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", color: "#fff" }}>
            View Boca Raton Service Area <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
