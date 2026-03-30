/**
 * MedMethod Direct — North Carolina State Hub
 * IMAGE RULE: single face on laptop screen only (physician or patient in telehealth).
 * Never a multi-person Zoom grid, group consultation, or in-person clinic imagery.
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PopularPrograms from "@/components/PopularPrograms";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConsultationModal from "@/components/ConsultationModal";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-state-BTbJpCUp5vmWkE8yyaagjE.webp";

const NC_CITIES = [
  { name: "Charlotte", slug: "charlotte", desc: "SouthPark & Myers Park corridor" },
  { name: "Raleigh", slug: "raleigh", desc: "Research Triangle hub" },
  { name: "Cary", slug: "cary", desc: "Highest-income zip in NC" },
  { name: "Chapel Hill", slug: "chapel-hill", desc: "University & medical community" },
  { name: "Wilmington", slug: "wilmington", desc: "Coastal affluent community" },
  { name: "Asheville", slug: "asheville", desc: "Mountain wellness culture" },
];

const FAQS = [
  {
    q: "Is MedMethod Direct licensed to practice in North Carolina?",
    a: "Yes. MedMethod Direct is fully licensed to provide telehealth services throughout North Carolina. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients across the state — all virtually, with no in-person visit required.",
  },
  {
    q: "Do I need to visit an office to become a patient in North Carolina?",
    a: "No. MedMethod Direct is a 100% virtual practice. Everything — your initial consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication is shipped directly to your door from a licensed 503B compounding pharmacy, typically within 5–7 business days.",
  },
  {
    q: "How does telehealth prescribing work in North Carolina?",
    a: "North Carolina law permits licensed physicians to prescribe medications via telehealth following a proper medical evaluation. MedMethod Direct complies with all NC telehealth prescribing regulations. After reviewing your bloodwork, your physician will prescribe the appropriate hormone or GLP-1 protocol and your compounding pharmacy will ship directly to your home.",
  },
  {
    q: "What women's health services does MedMethod Direct offer in North Carolina?",
    a: "We offer comprehensive virtual women's health programs including bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight.",
  },
  {
    q: "How quickly can I get started as a North Carolina patient?",
    a: "Most patients complete their free consultation within 24–48 hours of scheduling. After your consultation and lab work, your physician typically reviews results and issues your prescription within 3–5 business days. Medication ships directly from our 503B compounding pharmacy to your North Carolina address.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ border: "1.5px solid #E2E2EA" }}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-bold text-sm" style={{ color: "#111" }}>{question}</span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open && (
        <div className="px-6 pb-5 text-sm font-medium leading-relaxed" style={{ color: "#555" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LocationNorthCarolina() {
  const [consultOpen, setConsultOpen] = useState(false);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "MedMethod Direct",
    "url": "https://www.medmethoddirect.com/north-carolina",
    "description": "MedMethod Direct provides virtual hormone therapy and medical weight loss programs for women throughout North Carolina, including Charlotte, Raleigh, Cary, Chapel Hill, Wilmington, and Asheville.",
    "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
    "areaServed": { "@type": "State", "name": "North Carolina" },
    "availableService": [
      { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
      { "@type": "MedicalTherapy", "name": "Medical Weight Loss" },
      { "@type": "MedicalTherapy", "name": "Menopause Management" },
      { "@type": "MedicalTherapy", "name": "GLP-1 Therapy" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" },
      { "@type": "ListItem", "position": 2, "name": "North Carolina", "item": "https://www.medmethoddirect.com/north-carolina" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>North Carolina Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women across North Carolina. Board-certified physicians, no office visit required. Serving Charlotte, Raleigh, Cary, Chapel Hill, Wilmington & Asheville." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina" />
        <meta property="og:title" content="North Carolina Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women across North Carolina. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="North Carolina Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women across North Carolina. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Visible breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: "#E8339E" }}>North Carolina</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>
              Now Serving North Carolina
            </p>
            <h1
              className="font-black mb-5 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}
            >
              Women's Health Care Across{" "}
              <span style={{ color: "#E8339E" }}>North Carolina</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Board-certified physicians delivering hormone therapy, GLP-1 weight loss, and menopause management — 100% virtually. Licensed in North Carolina. No office visit, ever.
            </p>
            <button
              onClick={() => setConsultOpen(true)}
              className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
            >
              Schedule Free Consultation
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img
              src={HERO_IMAGE}
              alt="Telehealth consultation for women's health in North Carolina"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* City grid */}
      <section className="py-20 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase text-center mb-3" style={{ color: "#E8339E" }}>
            Cities We Serve
          </p>
          <h2 className="font-black text-3xl text-center mb-3" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Find Your City in North Carolina
          </h2>
          <p className="text-sm font-medium text-center mb-12 max-w-xl mx-auto" style={{ color: "#666" }}>
            MedMethod Direct is fully licensed in North Carolina. Select your city for localized information, or schedule a free consultation from anywhere in the state.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NC_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/north-carolina/${city.slug}`}
                className="group block rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{ background: "#fff", border: "1.5px solid #E2E2EA", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-black text-lg" style={{ color: "#111" }}>{city.name}</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E" }}>NC</span>
                </div>
                <p className="text-xs font-medium mb-4" style={{ color: "#888" }}>{city.desc}</p>
                <span className="text-xs font-black tracking-wide uppercase group-hover:underline" style={{ color: "#E8339E" }}>
                  View {city.name} →
                </span>
              </Link>
            ))}
          </div>
          <p className="text-center mt-8 text-sm font-medium" style={{ color: "#888" }}>
            Don't see your city?{" "}
            <button onClick={() => setConsultOpen(true)} className="font-bold underline" style={{ color: "#E8339E" }}>
              Schedule a consultation
            </button>{" "}
            — we serve all of North Carolina.
          </p>

          {/* Tier 2 — More Cities */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>More North Carolina Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Pinehurst", href: "/north-carolina/pinehurst" },
                { name: "Southern Pines", href: "/north-carolina/southern-pines" },
                { name: "Mooresville", href: "/north-carolina/mooresville" },
                { name: "Waxhaw", href: "/north-carolina/waxhaw" },
                { name: "Apex", href: "/north-carolina/apex" },
              ].map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-[#E8339E] transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <span style={{ color: "#E8339E" }}>📍</span>
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why NC intro */}
      <section className="py-16 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Why North Carolina Women Choose MedMethod Direct
          </h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>
            North Carolina's rapid growth — particularly in the Research Triangle and Charlotte metro — has created a large, educated, health-conscious population of women who expect more from their healthcare. Yet access to specialized hormone and weight loss physicians remains concentrated in a handful of urban centers, leaving women in Cary, Wilmington, Asheville, and smaller communities with limited options for perimenopause management, bioidentical hormone therapy, or GLP-1 prescriptions.
          </p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>
            MedMethod Direct was built for exactly this gap. Our board-certified physicians provide the same level of care as a top-tier in-person specialist — personalized lab-based protocols, semaglutide and tirzepatide prescriptions, BHRT programs, and ongoing physician oversight — entirely via telehealth. Your medication ships from a licensed 503B compounding pharmacy directly to your North Carolina address.
          </p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>
            MedMethod Direct is fully licensed to practice medicine in North Carolina. Our physicians comply with all state telehealth prescribing regulations, and every program is grounded in evidence-based medicine with FDA-approved and compounded medications sourced from accredited pharmacies.
          </p>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* FAQ */}
      <section className="py-20 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Frequently Asked Questions — North Carolina
          </h2>
          <div className="flex flex-col gap-4">
            {FAQS.map(({ q, a }, i) => (
              <FAQItem key={i} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in North Carolina</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
          Ready to Start Your NC Program?
        </h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
          Your free 20-minute consultation is the first step. No commitment required.
        </p>
        <button
          onClick={() => setConsultOpen(true)}
          className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
        >
          Schedule Free Consultation
        </button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Link href="/locations" className="hover:text-white transition-colors">View all locations</Link>
          {" · "}
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
