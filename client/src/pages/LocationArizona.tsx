/* =============================================================================
   LocationArizona.tsx — Arizona State Hub Page
   medmethod-location-seo skill compliant
   Cities: Scottsdale, Paradise Valley, Chandler, Gilbert, Tempe, Tucson
   IMAGE RULE: Single physician or patient face on laptop screen only — no group Zoom calls
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import { ChevronDown, MapPin } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const cities = [
  { name: "Scottsdale", href: "/arizona/scottsdale", tagline: "North Scottsdale's Premier Virtual Women's Health Clinic" },
  { name: "Paradise Valley", href: "/arizona/paradise-valley", tagline: "Exclusive Concierge-Level Telehealth for Paradise Valley" },
  { name: "Chandler", href: "/arizona/chandler", tagline: "Virtual Hormone & Weight Loss Care for Chandler Professionals" },
  { name: "Gilbert", href: "/arizona/gilbert", tagline: "Personalized Telehealth Women's Health in Gilbert" },
  { name: "Tempe", href: "/arizona/tempe", tagline: "Expert Virtual Women's Health Care in Tempe" },
  { name: "Tucson", href: "/arizona/tucson", tagline: "Southern Arizona's Trusted Virtual Women's Health Provider" },
];

const faqs = [
  {
    q: "Is MedMethod Direct licensed to practice medicine in Arizona?",
    a: "Yes. MedMethod Direct is fully licensed to provide telehealth medical services in the state of Arizona. Our board-certified physicians hold active Arizona medical licenses and can prescribe, diagnose, and manage your care entirely through our secure virtual platform — no in-person visit required.",
  },
  {
    q: "Do I need to visit an office or clinic in Arizona?",
    a: "No in-person visit is ever required. MedMethod Direct is a 100% virtual practice. All consultations, follow-ups, lab reviews, and prescription management happen through secure video appointments. Medications are compounded and shipped directly to your home anywhere in Arizona.",
  },
  {
    q: "How does telehealth prescribing work in Arizona?",
    a: "Arizona has robust telehealth prescribing laws that allow licensed physicians to evaluate, diagnose, and prescribe medications — including hormone therapy and GLP-1 weight loss medications — through a synchronous video consultation. Your MedMethod Direct physician conducts a thorough evaluation, reviews your lab results, and can issue prescriptions through our 503B-certified compounding pharmacy partners.",
  },
  {
    q: "What makes Arizona women particularly well-suited for telehealth hormone care?",
    a: "Arizona's active outdoor lifestyle, intense heat, and high UV exposure can accelerate the hormonal symptoms of perimenopause and menopause — including fatigue, hot flashes, and metabolic changes. Many Arizona women also live in communities like Scottsdale, Paradise Valley, and Chandler where demanding professional and social schedules make in-person clinic visits impractical. Telehealth removes that barrier entirely.",
  },
  {
    q: "Which Arizona cities does MedMethod Direct serve?",
    a: "We serve women across the entire state of Arizona, with particular depth in the Phoenix metro area including Scottsdale, Paradise Valley, Chandler, Gilbert, and Tempe, as well as Tucson and the surrounding Southern Arizona region. If you live anywhere in Arizona and hold an Arizona address, you are eligible for care.",
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const JSONLD_Business = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/arizona",
  description:
    "MedMethod Direct is a premium virtual women's health clinic licensed in Arizona, specializing in hormone replacement therapy, medical weight loss with GLP-1 medications, and menopause management for women across Scottsdale, Paradise Valley, Chandler, Gilbert, Tempe, and Tucson.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "State", "name": "Arizona" },
  availableService: [
    { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", name: "Medical Weight Loss" },
    { "@type": "MedicalTherapy", name: "Menopause Management" },
  ],
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const JSONLD_Breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
    { "@type": "ListItem", position: 2, name: "Arizona", item: "https://www.medmethoddirect.com/arizona" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LocationArizona() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Arizona Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta
          name="description"
          content="MedMethod Direct provides premium virtual women's health care across Arizona — hormone replacement therapy, GLP-1 weight loss, and menopause management. Board-certified physicians, 100% telehealth."
        />
        <link rel="canonical" href="https://www.medmethoddirect.com/arizona" />
        <meta property="og:title" content="Arizona Women's Health | MedMethod Direct" />
        <meta
          property="og:description"
          content="Premium virtual hormone therapy, medical weight loss, and menopause care for Arizona women. Scottsdale, Paradise Valley, Chandler, Gilbert, Tempe, Tucson."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/arizona" />
        <meta property="og:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-state-EwZEMZx6BjJT36PS22ktj2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Arizona Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Premium virtual hormone therapy, medical weight loss, and menopause care for Arizona women." />
        <meta name="twitter:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-state-EwZEMZx6BjJT36PS22ktj2.png" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_Business)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_Breadcrumb)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-[#0d0d0d] overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-state-Dnp6R8DBEbsUfwQc6KQ3Lq.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />

        <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/40 text-xs mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/locations" className="hover:text-white transition-colors">Locations</Link>
              <span>/</span>
              <span className="text-white/70">Arizona</span>
            </nav>

            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Now Serving Arizona
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Arizona Women's<br />
              <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Health & Hormones
              </span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Board-certified physicians delivering premium virtual hormone therapy, GLP-1 medical weight loss, and menopause management to women across Arizona — from Scottsdale and Paradise Valley to Tucson. 100% telehealth, licensed in Arizona.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setConsultOpen(true)}
                className="px-8 py-4 rounded-none font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90"
                style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
              >
                Book Your 45-Min Appointment
              </button>
            </div>
          </div>

          {/* City grid */}
          <div className="grid grid-cols-2 gap-3">
            {cities.map((city) => (
              <Link key={city.name} href={city.href}>
                <div className="border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#E8339E]/40 transition-all p-4 cursor-pointer group">
                  <p className="text-white font-bold text-sm mb-1 group-hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.name}</p>
                  <p className="text-white/40 text-xs leading-snug" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Arizona */}
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Why Arizona Women Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#0d0d0d] leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Premium Care Without<br />the Phoenix Traffic
              </h2>
              <p className="text-[#0d0d0d]/70 leading-relaxed mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Arizona's active outdoor lifestyle, intense desert heat, and high UV exposure can accelerate the hormonal symptoms of perimenopause and menopause — including fatigue, hot flashes, and metabolic changes that make weight management increasingly difficult. Yet many Arizona women find that local specialist wait times stretch to 3–6 months, and the state's sprawling geography makes regular clinic visits impractical.
              </p>
              <p className="text-[#0d0d0d]/70 leading-relaxed mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                MedMethod Direct solves this. Our board-certified physicians are licensed in Arizona and specialize in bioidentical hormone replacement therapy (BHRT), GLP-1 medications including semaglutide and tirzepatide, and comprehensive menopause management. Every consultation happens via secure video — no commute, no waiting room, no time off work.
              </p>
              <p className="text-[#0d0d0d]/70 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Medications are compounded at FDA-registered 503B pharmacies and shipped directly to your Arizona home. Whether you're in a North Scottsdale estate, a Chandler tech-corridor townhome, or a Tucson foothills property, your care arrives on your schedule.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Programs */}

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* Cities Section */}
      <section className="bg-[#0d0d0d] py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Arizona Locations</p>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>Find Your City</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Link key={city.name} href={city.href}>
                <div className="border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#E8339E]/40 transition-all p-6 cursor-pointer group">
                  <p className="text-white font-bold text-lg mb-2 group-hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.name}</p>
                  <p className="text-white/50 text-sm leading-snug mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.tagline}</p>
                  <span className="text-[#E8339E] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Learn More →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>More Arizona Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Peoria", href: "/arizona/peoria" },
                { name: "Queen Creek", href: "/arizona/queen-creek" },
                { name: "Surprise", href: "/arizona/surprise" },
                { name: "Fountain Hills", href: "/arizona/fountain-hills" },
                { name: "Prescott", href: "/arizona/prescott" },
              ].map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 bg-white/5 text-white/60 hover:border-[#E8339E]/50 hover:text-[#E8339E] transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3 h-3" />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Arizona FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0d0d0d]" style={{ fontFamily: "Montserrat, sans-serif" }}>Common Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#0d0d0d]/10 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-[#0d0d0d] pr-4" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8339E] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[#0d0d0d]/70 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-20">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Start Today</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Arizona Women Deserve<br />Better Healthcare
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Your first consultation is free. A board-certified physician reviews your health history, discusses your goals, and outlines a personalized treatment plan — all in one 45-minute video call.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="px-10 py-4 font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90"
            style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
          >
            Book Your 45-Min Appointment
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Licensed in Arizona · 100% Virtual · No Office Visit Required
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
    </>
  );
}
