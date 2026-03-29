/* =============================================================================
   Location: Southern Pines, North Carolina — Tier 2 Rural/Exurban Page
   Target keyword: menopause doctor Southern Pines NC | hormone therapy Southern Pines NC
   Access gap: Moore County Sandhills — adjacent to Pinehurst, limited specialist access
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

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-t2-southern-pines-o89kcobmbhbRKYV8AWXHjU.webp";

const JSONLD_MEDICAL = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/north-carolina/southern-pines",
  description: "MedMethod Direct provides board-certified virtual women's health care in Southern Pines, NC — hormone therapy, menopause management, and medical weight loss for Moore County women.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "City", "name": "Southern Pines, North Carolina" },
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
    { "@type": "ListItem", position: 2, name: "North Carolina", item: "https://www.medmethoddirect.com/north-carolina" },
    { "@type": "ListItem", position: 3, name: "Southern Pines", item: "https://www.medmethoddirect.com/north-carolina/southern-pines" },
  ],
};

const faqs = [
  {
    q: "Is there a hormone specialist serving Southern Pines women?",
    a: "MedMethod Direct serves Southern Pines and all of Moore County entirely via secure video. The Sandhills region has limited access to physicians who specialize in bioidentical hormone therapy or GLP-1 weight loss — the nearest specialists are in Raleigh or Charlotte. MedMethod Direct offers same-week virtual appointments with board-certified physicians and ships all medications directly to your Southern Pines home.",
  },
  {
    q: "Is MedMethod Direct licensed to prescribe in North Carolina?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in North Carolina and prescribe medications to patients throughout the state, including Southern Pines and Moore County. All prescriptions are fulfilled through an FDA-registered 503B compounding pharmacy.",
  },
  {
    q: "What treatments are available?",
    a: "We specialize in bioidentical hormone replacement therapy (BHRT), perimenopause and menopause management, medical weight loss with semaglutide and tirzepatide (GLP-1), thyroid optimization, and longevity protocols. Every plan is personalized based on your comprehensive lab results.",
  },
  {
    q: "How does the virtual prescription process work?",
    a: "North Carolina law allows licensed physicians to evaluate, diagnose, and prescribe medications via secure video without an in-person visit. After your consultation, your prescription is sent to a compounding pharmacy and shipped to your Southern Pines address, typically within 3–5 business days.",
  },
  {
    q: "What does getting started cost?",
    a: "The initial diagnostic setup is $449, covering a comprehensive hormone and metabolic lab panel plus a physician consultation. Ongoing memberships are available in 6 or 12-month commitments with transparent monthly pricing.",
  },
];

export default function LocationSouthernPinesNC() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const JSONLD_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>Southern Pines NC Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Board-certified hormone therapy & menopause care for Southern Pines, NC women. No drive to Raleigh — same-week virtual appointments. MedMethod Direct." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina/southern-pines" />
        <meta property="og:title" content="Southern Pines NC Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Expert hormone therapy & GLP-1 weight loss for Southern Pines, NC women. Virtual, same-week appointments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina/southern-pines" />
        <meta property="og:image" content={HERO_IMG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Southern Pines NC Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Board-certified hormone therapy for Southern Pines, NC women. Virtual, same-week appointments." />
        <meta name="twitter:image" content={HERO_IMG} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Southern Pines NC telehealth women's health consultation" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 pt-32 pb-20">
          <nav className="flex items-center gap-1.5 text-white/40 text-xs mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/north-carolina" className="hover:text-white transition-colors">North Carolina</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Southern Pines</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[#E8339E]/10 border border-[#E8339E]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#E8339E] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Southern Pines, North Carolina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Southern Pines Women's<br />
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hormone & Weight Loss
            </span>
            <br />Care — Virtually
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            The Sandhills deserves expert women's health care. MedMethod Direct brings board-certified hormone therapy and GLP-1 weight loss to Southern Pines women — same-week appointments, no long drive to Raleigh or Charlotte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}>
              Schedule Free Consultation
            </button>
            <a href="/north-carolina" className="px-8 py-4 rounded-full font-bold text-white/70 text-sm tracking-widest uppercase border border-white/20 hover:border-white/50 hover:text-white transition-all text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
              All NC Locations
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#111] py-16 border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "70+ miles", label: "to nearest Raleigh hormone specialist" },
              { stat: "Same week", label: "virtual appointments available" },
              { stat: "3–5 days", label: "medication delivery to Southern Pines" },
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

      <section className="bg-[#0d0d0d] py-24 border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-widest uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>Questions from Southern Pines Women</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white/2 hover:bg-white/5 transition-colors">
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

      <section className="bg-[#111] py-16 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby NC Communities</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Pinehurst", href: "/north-carolina/pinehurst" },
              { name: "Charlotte", href: "/north-carolina/charlotte" },
              { name: "Raleigh", href: "/north-carolina/raleigh" },
              { name: "Cary", href: "/north-carolina/cary" },
              { name: "Apex", href: "/north-carolina/apex" },
              { name: "All NC Locations", href: "/north-carolina" },
            ].map(({ name, href }) => (
              <a key={name} href={href} className="px-5 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#E8339E]/50 text-sm transition-all" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Expert Care, Right Here</h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Southern Pines women deserve expert hormone care without the drive. Your first consultation is free.
          </p>
          <button onClick={() => setConsultOpen(true)} className="px-10 py-5 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}>
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
