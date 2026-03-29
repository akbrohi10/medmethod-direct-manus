/* =============================================================================
   Location: Culpeper, Virginia — Tier 2 Rural/Exurban Page
   Target keyword: menopause doctor Culpeper VA | hormone therapy Culpeper Virginia
   Access gap: Nearest hormone specialist is 60+ miles away in Tysons Corner or Charlottesville
   IMAGE RULE: Single physician or patient face on laptop screen ONLY — no group Zoom calls
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import { ChevronRight, ChevronDown } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/va-t2-culpeper-bYBhrxcG97q5ukgQxZfsaq.webp";

const JSONLD_MEDICAL = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/virginia/culpeper",
  description: "MedMethod Direct provides board-certified virtual women's health care in Culpeper, VA — hormone therapy, medical weight loss, and menopause management without the long drive to Northern Virginia or Charlottesville.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "City", "name": "Culpeper, Virginia" },
  availableService: [
    { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", name: "Medical Weight Loss" },
    { "@type": "MedicalTherapy", name: "Menopause Management" },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
    { "@type": "ListItem", position: 2, name: "Virginia", item: "https://www.medmethoddirect.com/virginia" },
    { "@type": "ListItem", position: 3, name: "Culpeper", item: "https://www.medmethoddirect.com/virginia/culpeper" },
  ],
};

const faqs = [
  {
    q: "Do Culpeper women really need to drive to Tysons Corner or Charlottesville for hormone care?",
    a: "Until now, most Culpeper-area women had to make a 60–90 minute drive to find a specialist who manages bioidentical hormones or GLP-1 weight loss therapy. MedMethod Direct eliminates that entirely. Your board-certified physician sees you via secure video, reviews your labs, and ships your medications directly to your Culpeper home — same-week appointments available.",
  },
  {
    q: "Is MedMethod Direct licensed to prescribe in Virginia?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in Virginia and prescribe medications to patients throughout the state, including Culpeper, Rappahannock County, and the surrounding Piedmont region. All prescriptions are fulfilled through an FDA-registered 503B compounding pharmacy.",
  },
  {
    q: "What conditions does MedMethod Direct treat for Culpeper women?",
    a: "We specialize in perimenopause, menopause, hormone imbalance, medical weight loss (including semaglutide and tirzepatide), thyroid optimization, and longevity protocols. If you're experiencing hot flashes, brain fog, weight gain, fatigue, or low libido, a MedMethod physician can evaluate and treat you — all without leaving Culpeper.",
  },
  {
    q: "How does the telehealth prescription process work in Virginia?",
    a: "Virginia's telehealth laws allow licensed physicians to evaluate, diagnose, and prescribe medications via secure video without an in-person visit. After your consultation, your prescription is sent to a compounding pharmacy and shipped directly to your address in Culpeper, typically within 3–5 business days.",
  },
  {
    q: "What does the initial diagnostic workup cost?",
    a: "The initial diagnostic setup is $449 and includes a comprehensive hormone panel, metabolic markers, and a physician consultation to review your results and build your personalized protocol. Ongoing program memberships start at 6 or 12-month commitments with transparent monthly pricing.",
  },
];

export default function LocationCulpeperVA() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const JSONLD_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Culpeper VA Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Board-certified hormone therapy, menopause care & medical weight loss for Culpeper, VA women. No 90-minute drive to NoVA — same-week virtual appointments. MedMethod Direct." />
        <link rel="canonical" href="https://www.medmethoddirect.com/virginia/culpeper" />
        <meta property="og:title" content="Culpeper VA Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Skip the drive to Tysons Corner. Board-certified hormone therapy & GLP-1 weight loss for Culpeper, VA women — virtual, same-week appointments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/virginia/culpeper" />
        <meta property="og:image" content={HERO_IMG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Culpeper VA Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Board-certified hormone therapy & medical weight loss for Culpeper, VA women. Virtual, same-week appointments." />
        <meta name="twitter:image" content={HERO_IMG} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Culpeper VA telehealth women's health consultation" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 pt-32 pb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-white/40 text-xs mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/virginia" className="hover:text-white transition-colors">Virginia</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Culpeper</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[#E8339E]/10 border border-[#E8339E]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#E8339E] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Culpeper, Virginia</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Culpeper Women's<br />
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hormone & Weight Loss
            </span>
            <br />Care — No Long Drive
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Culpeper women no longer need to drive 60+ miles to Tysons Corner or Charlottesville for a hormone specialist. MedMethod Direct delivers board-certified care via secure video — same-week appointments, medications shipped to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setConsultOpen(true)}
              className="px-8 py-4 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}
            >
              Schedule Free Consultation
            </button>
            <a href="/virginia" className="px-8 py-4 rounded-full font-bold text-white/70 text-sm tracking-widest uppercase border border-white/20 hover:border-white/50 hover:text-white transition-all text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
              All Virginia Locations
            </a>
          </div>
        </div>
      </section>

      {/* ── Access Gap Section ── */}
      <section className="bg-[#111] py-16 border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "60+ miles", label: "to the nearest NoVA hormone specialist" },
              { stat: "Same week", label: "virtual appointments available" },
              { stat: "Shipped to you", label: "medications delivered to Culpeper" },
            ].map(({ stat, label }) => (
              <div key={stat} className="p-6 rounded-2xl border border-white/5 bg-white/2">
                <div className="text-3xl font-black mb-2" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E, #7A1E7E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat}</div>
                <div className="text-white/50 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── FAQ ── */}
      <section className="bg-[#0d0d0d] py-24 border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-widest uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>Questions from Culpeper Women</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white/2 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold text-sm leading-snug" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8339E] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-2 bg-white/2">
                    <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Cities ── */}
      <section className="bg-[#111] py-16 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby Virginia Communities</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Warrenton", href: "/virginia/warrenton" },
              { name: "Fredericksburg", href: "/virginia/fredericksburg" },
              { name: "Leesburg", href: "/virginia/leesburg" },
              { name: "McLean", href: "/virginia/mclean" },
              { name: "Reston", href: "/virginia/reston" },
              { name: "All Virginia Locations", href: "/virginia" },
            ].map(({ name, href }) => (
              <a key={name} href={href} className="px-5 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#E8339E]/50 text-sm transition-all" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Ready to Feel Like Yourself Again?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Culpeper women deserve the same access to expert hormone care as anyone in Northern Virginia. Your first consultation is free.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="px-10 py-5 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}
          >
            Schedule Free Consultation
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
