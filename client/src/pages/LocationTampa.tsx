import ComplianceDisclosures from "@/components/ComplianceDisclosures";
/* =============================================================================
   Tampa, Florida Location Page — MedMethod Direct
   Primary keyword: menopause doctor Tampa FL telehealth
   Secondary: hormone therapy Tampa Florida, GLP-1 weight loss Tampa,
   semaglutide Tampa telehealth, virtual menopause care Tampa FL,
   bioidentical hormone therapy Tampa, perimenopause treatment Tampa Florida
   ============================================================================= */
import { useState, useEffect } from "react";
import { pricingFaqs } from "@/data/pricingFaqs";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Clock, Video, Star, MapPin, ChevronDown, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalTeam from "@/components/MedicalTeam";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Link } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/florida-tampa-hero-v2-Y8n5rfysWA5nszstbpVYh3.webp";

const gradientText = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const JSONLD_MEDICAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Tampa, Florida",
  "url": "https://medmethoddirect.com/florida/tampa",
  "telephone": "",
  "hasMap": "https://medmethoddirect.com/florida/tampa",
  "priceRange": "$$",
  "medicalSpecialty": ["Obstetrics and Gynecology", "Endocrinology", "Internal Medicine"],
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", "name": "GLP-1 Weight Loss (Semaglutide & Tirzepatide)" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" },
    { "@type": "MedicalTherapy", "name": "Perimenopause Treatment" },
    { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
  ],
  "areaServed": [
    { "@type": "City", "name": "Tampa", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "St. Petersburg", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Clearwater", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Wesley Chapel", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Brandon", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Lakeland", "containedInPlace": { "@type": "State", "name": "Florida" } },
  ],
  "isAcceptingNewPatients": true,
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": { "@type": "Physician", "name": "Dr. Jumana Al-Deek", "honorificSuffix": "DO", "medicalSpecialty": "Women's Health, Hormone Medicine" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do you serve patients in Tampa, Florida?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — MedMethod Direct is fully licensed to serve patients throughout Tampa and the Tampa Bay area, including St. Petersburg, Clearwater, Wesley Chapel, Brandon, and Lakeland. All care is delivered 100% virtually, so you never need to leave Tampa." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide online in Tampa?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We offer access to both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your Tampa address." } },
  ],
};

const localFaqs = [
  { q: "Do you serve patients in Tampa, Florida?", a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Tampa and the Tampa Bay area, including St. Petersburg, Clearwater, Wesley Chapel, Brandon, and Lakeland. All care is delivered 100% virtually, so you never need to leave Tampa." },
  { q: "Is there a menopause specialist near Tampa?", a: "Yes — MedMethod Direct provides specialist-level menopause care to women in Tampa and throughout the Tampa Bay area. Dr. Al-Deek is board-certified in family medicine with advanced training in hormone therapy, menopause management, and metabolic health. All visits are 100% virtual, so you get expert care without sitting in Tampa Bay traffic to see a specialist." },
  { q: "What areas near Tampa do you serve?", a: "We serve women throughout the Tampa Bay metro, including Tampa, St. Petersburg, Clearwater, Wesley Chapel, Brandon, Lakeland, Temple Terrace, and Plant City. Since all care is virtual, you can connect with us from anywhere in Florida." },
  { q: "How does the $449 diagnostic setup work for Tampa patients?", a: "After your appointment, you pay a one-time $449 clinical diagnostic fee. This includes a comprehensive lab panel ordered to a LabCorp or Quest near you in the Tampa Bay area, a MedMethod Smart Scale shipped to your door, a full hormone and metabolic assessment, and your first physician strategy session to review results and build your personalized protocol." },
  { q: "Can Tampa patients get medications delivered to their home?", a: "Yes. Medication fulfillment depends on the prescription and dispensing pharmacy. If medication is clinically appropriate, Dr. Al-Deek will explain available shipping or local pharmacy options during your visit." },
  { q: "Can I get semaglutide or tirzepatide online in Tampa?", a: "Yes. After reviewing your health history and clinical needs, Dr. Al-Deek can prescribe an appropriate medication when indicated. Medication selection, pharmacy fulfillment, and insurance considerations are discussed during your visit. If a compounded medication is considered, it is not FDA-approved, and FDA does not review compounded drugs for safety, effectiveness, or quality before marketing." },
  { q: "Do I need to come into an office for bloodwork in Tampa?", a: "No office visits required. We order your labs to a LabCorp or Quest Diagnostics location near you in Tampa or the Tampa Bay area. You go in for a standard blood draw, and we review the results together on your next virtual visit." },
  { q: "Do you accept insurance?", a: "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by insurance coverage limits. Many patients use HSA or FSA funds for their program." },
  { q: "How is MedMethod Direct different from other telehealth services like Hers or Winona?", a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We also integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation." },
];

const faqs = [...localFaqs, ...pricingFaqs,
  {
    q: "What kind of lab work do you order?",
    a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan \u2014 not a guess.",
  },
  {
    q: "Is everything done virtually?",
    a: "Yes — consultations, follow-ups, and ongoing care are conducted through secure telehealth. You may complete ordered lab work at a local lab, and any medication prescribed by your physician will be fulfilled through an appropriate pharmacy. No waiting rooms, commuting, or unnecessary disruption to your schedule.",
  },
  {
    q: "How quickly will I see results?",
    a: "Responses to treatment vary. Dr. Al-Deek will monitor your symptoms, laboratory findings, medication response, and goals and will adjust your plan when clinically appropriate.",
  },
  {
    q: "Do you use FDA-approved medications or compounded ones?",
    a: "Medication selection is individualized and based on your health history, clinical needs, and treatment goals. If a compounded medication is clinically appropriate, Dr. Al-Deek will explain why it is being considered, available alternatives, expected costs, and pharmacy fulfillment before you decide how to proceed. Compounded medications are not FDA-approved, and FDA does not review compounded drugs for safety, effectiveness, or quality before marketing.",
  },
  {
    q: "How is pricing structured?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your appointment will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible \u2014 and we're committed to being upfront about every cost.",
  },
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
    label: "Tampa & FL",
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

export default function LocationTampa() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const [consultOpen, setConsultOpen] = useState(false);



  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Tampa, FL | MedMethod Direct</title>
        <meta name="description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Tampa, FL. Physician-prescribed semaglutide, BHRT & testosterone. See a doctor this week — appointment." />
        <link rel="canonical" href="https://medmethoddirect.com/florida/tampa" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Tampa, FL | MedMethod Direct" />
        <meta property="og:url" content="https://medmethoddirect.com/florida/tampa" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta property="og:description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Tampa, FL. Physician-prescribed semaglutide, BHRT & testosterone. appointment." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Tampa, FL | MedMethod Direct" />
        <meta name="twitter:description" content="Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women in Tampa, FL. Physician-prescribed semaglutide, BHRT & testosterone. appointment." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL_BUSINESS)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
                <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": "Virtual Hormone, Menopause & Weight Loss Doctor in Tampa, FL",
            "url": "https://medmethoddirect.com/florida/tampa",
  "telephone": "",
  "hasMap": "https://medmethoddirect.com/florida/tampa",
            "description": "MedMethod Direct provides physician-led virtual hormone therapy, GLP-1 medical weight loss (semaglutide, tirzepatide), menopause management, BHRT, and testosterone therapy for women in Tampa, Florida.",
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
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" }, { "@type": "ListItem", "position": 2, "name": "Florida", "item": "https://medmethoddirect.com/florida" }, { "@type": "ListItem", "position": 3, "name": "Tampa", "item": "https://medmethoddirect.com/florida/tampa" }] })}</script>
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
                  Serving Tampa, Florida
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}<span style={gradientText}>hormone,</span><br />
                  <span style={gradientText}>menopause</span>{" "}&amp;{" "}<span style={gradientText}>weight loss</span><br />
                  for Tampa women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Tampa and the Bay Area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE appointment
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="url(#vcGradTPA)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGradTPA" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                  </svg>
                  100% Virtual Care · Licensed in Florida
                </p>
              </div>
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img src={HERO_IMAGE} alt="Virtual menopause and hormone therapy doctor for women in Tampa, Florida — MedMethod Direct" className="w-full h-full object-cover" width="640" height="480" loading="eager" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3 shadow-xl" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>
                  <p className="text-white text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Licensed in Florida</p>
                  <p className="text-white/80 text-xs mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Tampa · St. Pete · Clearwater · Wesley Chapel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Virtual Care for Tampa Women</p>
          <h2 className="font-black leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
            Tampa's premier virtual clinic for{" "}<span style={gradientText}>hormones, menopause & weight loss</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#444" }}>
            <p>
              If you live in Tampa and you've been searching for a <strong>menopause doctor near Tampa, FL</strong> or a <strong>medical weight loss physician serving Tampa</strong>, you've found the right place.
            </p>
            <p>
              Tampa is one of Florida's fastest-growing cities, with a vibrant and health-forward population — yet specialized menopause and hormone care can still be surprisingly hard to access. MedMethod Direct is a direct-care model where Dr. Jumana Al-Deek, DO, personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. Whether you're in South Tampa, Westchase, or anywhere in the Bay Area, your care comes to you.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
              Related reading:
            </span>
            {[
              { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
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
      <ComplianceDisclosures compounded testosteroneForWomen />

      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      <div className="w-full flex flex-col items-center justify-center text-center px-6" style={{ background: "#0D0D1A", borderTop: "1px solid rgba(232,51,158,0.18)", borderBottom: "1px solid rgba(232,51,158,0.18)", padding: "52px 24px" }}>
        <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-5" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>The MedMethod Standard</span>
        <p className="font-black leading-tight max-w-3xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.3rem, 2.8vw, 2rem)", color: "#ffffff", letterSpacing: "-0.02em" }}>
          "The system you've been missing —{" "}
          <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B06FE8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>built by physicians, for women.</span>"
        </p>
        <p className="mt-4 text-sm max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.</p>
      </div>

{/* WHY TAMPA WOMEN CHOOSE US */}
      <section className="py-20" style={{ background: "#f9f9fb" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Built for Your Life</p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", color: "#111111" }}>
              Why Tampa women choose{" "}<span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "No more 6-week waits", body: "Tampa's top practices are booked out for months. We can see you this week — from your home, your office, or anywhere in the Tampa Bay area." },
              { icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "30–60 minute appointments", body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life." },
              { icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Hormones + weight loss: treated together", body: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, testosterone optimization, and metabolic medicine into one unified program." },
              { icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Lab work near you in Tampa", body: "We order your labs to a convenient LabCorp or Quest Diagnostics draw site near you in Tampa or the Bay Area. Results reviewed within 48 hours." },
              { icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "GLP-1s + hormones delivered to your door", body: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your Tampa address, discreetly and on schedule." },
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

      <MedicalTeam />
      {/* ── FAQ (Categorized Tabs) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Tampa Patients</span>
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
          <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>Tampa, Florida</p>
          <h2 className="font-black text-white leading-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>Ready to feel like yourself again?</h2>
          <p className="text-white/85 text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Tampa women deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you. Your appointment is 20 minutes and completely obligation-free.
          </p>
          <button onClick={() => setConsultOpen(true)} className="bg-white font-bold rounded-full px-8 py-4 text-sm tracking-wider flex items-center gap-2 mx-auto group hover:shadow-xl transition-shadow" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>
            SCHEDULE MY appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/70 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>100% Virtual · No Obligation · No Pressure · Licensed in Florida</p>
        </div>
      </section>

      {/* Cross-link back to Florida hub */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>EXPLORE ALL FLORIDA LOCATIONS</p>
            <h3 className="font-black text-xl mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#0D0D1A", letterSpacing: "-0.02em" }}>MedMethod Direct serves all of Florida</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              From Miami and Boca Raton to Naples, Sarasota, and Tampa — MedMethod Direct serves women throughout Florida with the same physician-led hormone therapy and GLP-1 weight loss programs, 100% virtually.
            </p>
          </div>
          <a href="/florida" className="inline-flex items-center gap-2 font-bold text-sm tracking-wider rounded-full px-7 py-3 whitespace-nowrap transition-all hover:shadow-lg flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", color: "#fff" }}>
            View All Florida Locations <ArrowRight className="w-4 h-4" />
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
