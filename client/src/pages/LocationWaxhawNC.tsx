/* =============================================================================
   Location: Waxhaw, North Carolina — Tier 2 Rural/Exurban Page
   Target keyword: menopause doctor Waxhaw NC | hormone therapy Waxhaw North Carolina
   Access gap: Union County — one of fastest-growing affluent suburbs, limited specialists
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
import { Link } from 'wouter';

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-t2-waxhaw-JX4Mfvhc9ko9tgwLbZSKBq.webp";

const JSONLD_MEDICAL = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/north-carolina/waxhaw",
  description: "MedMethod Direct provides board-certified virtual women's health care in Waxhaw, NC — hormone therapy, menopause management, and medical weight loss for Union County women.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "City", "name": "Waxhaw, North Carolina" },
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
    { "@type": "ListItem", position: 3, name: "Waxhaw", item: "https://www.medmethoddirect.com/north-carolina/waxhaw" },
  ],
};

const faqs = [
  {
    q: "Why do Waxhaw women choose MedMethod Direct?",
    a: "Waxhaw and Union County are among the fastest-growing and most affluent communities in North Carolina, yet access to physicians specializing in hormone therapy or GLP-1 weight loss remains limited. Most women need to drive 30–40 minutes to Charlotte for specialist care. MedMethod Direct eliminates that commute with same-week virtual appointments and medications shipped directly to your Waxhaw home.",
  },
  {
    q: "Is MedMethod Direct licensed to prescribe in North Carolina?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in North Carolina and prescribe medications to patients throughout the state, including Waxhaw and Union County. All prescriptions are fulfilled through an FDA-registered 503B compounding pharmacy.",
  },
  {
    q: "What treatments are available to Waxhaw women?",
    a: "We specialize in bioidentical hormone replacement therapy (BHRT), perimenopause and menopause management, medical weight loss with semaglutide and tirzepatide (GLP-1), thyroid optimization, and longevity protocols. Every plan is personalized based on your comprehensive lab results.",
  },
  {
    q: "How does the virtual prescription process work in North Carolina?",
    a: "North Carolina law allows licensed physicians to evaluate, diagnose, and prescribe medications via secure video without an in-person visit. After your consultation, your prescription is sent to a compounding pharmacy and shipped to your Waxhaw address, typically within 3–5 business days.",
  },
  {
    q: "What does getting started cost?",
    a: "The initial diagnostic setup is $449, covering a comprehensive hormone and metabolic lab panel plus a physician consultation. Ongoing memberships are available in 6 or 12-month commitments with transparent monthly pricing.",
  },
];

export default function LocationWaxhawNC() {
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
        <title>Waxhaw NC Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Board-certified hormone therapy & menopause care for Waxhaw, NC women. No drive to Charlotte — same-week virtual appointments. MedMethod Direct." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina/waxhaw" />
        <meta property="og:title" content="Waxhaw NC Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Expert hormone therapy & GLP-1 weight loss for Waxhaw, NC women. Virtual, same-week appointments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina/waxhaw" />
        <meta property="og:image" content={HERO_IMG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Waxhaw NC Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Board-certified hormone therapy for Waxhaw, NC women. Virtual, same-week appointments." />
        <meta name="twitter:image" content={HERO_IMG} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Waxhaw NC telehealth women's health consultation" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 pt-32 pb-20">
          <nav className="flex items-center gap-1.5 text-white/40 text-xs mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/north-carolina" className="hover:text-white transition-colors">North Carolina</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Waxhaw</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[#E8339E]/10 border border-[#E8339E]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#E8339E] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Waxhaw, North Carolina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Waxhaw Women's<br />
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hormone & Menopause
            </span>
            <br />Care — Virtually
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Union County's most desirable community deserves expert women's health care. MedMethod Direct brings board-certified hormone therapy and GLP-1 weight loss to Waxhaw women — same-week appointments, no Charlotte commute.
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
              { stat: "30–40 min", label: "drive to Charlotte specialist — eliminated" },
              { stat: "Same week", label: "virtual appointments available" },
              { stat: "Shipped to you", label: "medications delivered to Waxhaw" },
            ].map(({ stat, label }) => (
              <div key={stat} className="p-6 rounded-2xl border border-white/5 bg-white/2">
                <div className="text-3xl font-black mb-2" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E, #7A1E7E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat}</div>
                <div className="text-white/50 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Local Context / Body Copy */}
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Waxhaw, NC</h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Waxhaw and you have been searching for a <strong>menopause doctor near Waxhaw, NC</strong>, a <strong>medical weight loss physician serving Waxhaw, North Carolina</strong>, or a hormone specialist who treats the whole picture, you have found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              We specialize in the full spectrum of women's metabolic and hormonal health: <strong>perimenopause and menopause management</strong>, <strong>hormone replacement therapy (HRT)</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone optimization for women</strong>, GLP-1 medications including <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care, all managed virtually by Dr. Jumana Al-Deek, DO.
            </p>
            <p>
              Whether you are experiencing <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you have tried GLP-1s elsewhere and hit a plateau, the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in North Carolina that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. Women in Waxhaw no longer need to drive to Charlotte or Monroe for specialist care.
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

      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      <section className="bg-[#0d0d0d] py-24 border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-widest uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>Questions from Waxhaw Women</h2>
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
              { name: "Charlotte", href: "/north-carolina/charlotte" },
              { name: "Mooresville", href: "/north-carolina/mooresville" },
              { name: "Apex", href: "/north-carolina/apex" },
              { name: "Cary", href: "/north-carolina/cary" },
              { name: "Raleigh", href: "/north-carolina/raleigh" },
              { name: "All NC Locations", href: "/north-carolina" },
            ].map(({ name, href }) => (
              <a key={name} href={href} className="px-5 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#E8339E]/50 text-sm transition-all" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Waxhaw Deserves Expert Care</h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            You shouldn't need to drive to Charlotte for hormone care. Your first consultation is free.
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
