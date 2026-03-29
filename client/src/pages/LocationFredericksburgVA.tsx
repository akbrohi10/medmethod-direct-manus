/* =============================================================================
   Location: Fredericksburg, Virginia — Tier 2 Rural/Exurban Page
   Target keyword: menopause doctor Fredericksburg VA | hormone therapy Fredericksburg Virginia
   Access gap: Stafford/Spotsylvania corridor — large population, limited specialist coverage
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
import { Link } from "wouter";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/va-t2-fredericksburg-AEc9GTzzswXmjRtZhNXMFW.webp";

const JSONLD_MEDICAL = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/virginia/fredericksburg",
  description: "MedMethod Direct provides board-certified virtual women's health care in Fredericksburg, VA — hormone therapy, menopause management, and medical weight loss for Stafford and Spotsylvania County women.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "City", "name": "Fredericksburg, Virginia" },
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
    { "@type": "ListItem", position: 3, name: "Fredericksburg", item: "https://www.medmethoddirect.com/virginia/fredericksburg" },
  ],
};

const faqs = [
  {
    q: "Is there a hormone specialist in Fredericksburg I can see virtually?",
    a: "MedMethod Direct serves Fredericksburg, Stafford, and Spotsylvania County women entirely via secure video. The Fredericksburg corridor has a large and growing population of women 35–65, yet access to physicians who specialize in bioidentical hormone therapy or GLP-1 weight loss is limited. MedMethod Direct provides same-week appointments with board-certified physicians, and all medications are shipped directly to your home.",
  },
  {
    q: "Is MedMethod Direct licensed to prescribe in Virginia?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in Virginia and prescribe medications to patients throughout the state, including Fredericksburg, Stafford County, and Spotsylvania County. All prescriptions are fulfilled through an FDA-registered 503B compounding pharmacy.",
  },
  {
    q: "What treatments are available to Fredericksburg women?",
    a: "We specialize in bioidentical hormone replacement therapy (BHRT), perimenopause and menopause management, medical weight loss with semaglutide and tirzepatide (GLP-1), thyroid optimization, and longevity protocols. Every plan is personalized based on your comprehensive lab results.",
  },
  {
    q: "Do I need to drive to Northern Virginia or Richmond for care?",
    a: "No. MedMethod Direct is 100% virtual. Your consultation, follow-ups, and prescription management all happen via secure video. Labs can be drawn at a local Fredericksburg-area facility, and your medications are shipped directly to your home.",
  },
  {
    q: "What does getting started cost?",
    a: "The initial diagnostic setup is $449, which includes a comprehensive hormone and metabolic lab panel plus a physician consultation. Ongoing memberships are available in 6 or 12-month commitments with transparent monthly pricing.",
  },
];

export default function LocationFredericksburgVA() {
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
        <title>Fredericksburg VA Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Board-certified hormone therapy, menopause care & medical weight loss for Fredericksburg, VA women. No drive to NoVA or Richmond — same-week virtual appointments. MedMethod Direct." />
        <link rel="canonical" href="https://www.medmethoddirect.com/virginia/fredericksburg" />
        <meta property="og:title" content="Fredericksburg VA Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Expert hormone therapy & GLP-1 weight loss for Fredericksburg, VA women. Same-week virtual appointments, medications shipped to your door." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/virginia/fredericksburg" />
        <meta property="og:image" content={HERO_IMG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fredericksburg VA Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Board-certified hormone therapy for Fredericksburg, VA women. Virtual, same-week appointments." />
        <meta name="twitter:image" content={HERO_IMG} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Fredericksburg VA telehealth women's health consultation" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 pt-32 pb-20">
          <nav className="flex items-center gap-1.5 text-white/40 text-xs mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/virginia" className="hover:text-white transition-colors">Virginia</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Fredericksburg</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[#E8339E]/10 border border-[#E8339E]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#E8339E] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Fredericksburg, Virginia</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Fredericksburg Women's<br />
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hormone & Menopause
            </span>
            <br />Care — No Long Drive
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Fredericksburg women no longer need to drive to Northern Virginia or Richmond for expert hormone care. MedMethod Direct brings board-certified physicians to you — via secure video, with medications shipped directly to your Stafford or Spotsylvania home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-bold text-white text-sm tracking-widest uppercase transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}>
              Schedule Free Consultation
            </button>
            <a href="/virginia" className="px-8 py-4 rounded-full font-bold text-white/70 text-sm tracking-widest uppercase border border-white/20 hover:border-white/50 hover:text-white transition-all text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
              All Virginia Locations
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#111] py-16 border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "50+ miles", label: "to nearest NoVA hormone specialist" },
              { stat: "Same week", label: "virtual appointments available" },
              { stat: "Shipped to you", label: "medications delivered to Fredericksburg" },
            ].map(({ stat, label }) => (
              <div key={stat} className="p-6 rounded-2xl border border-white/5 bg-white/2">
                <div className="text-3xl font-black mb-2" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E, #7A1E7E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat}</div>
                <div className="text-white/50 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* ── Local Context / Body Copy ── */}
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Fredericksburg, VA</h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Fredericksburg and you've been searching for a{" "}
              <strong>menopause doctor near Fredericksburg, VA</strong>, a{" "}
              <strong>medical weight loss physician serving Fredericksburg, Virginia</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              We specialize in the full spectrum of women's metabolic and hormonal health:{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy (BHRT)</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care — all managed virtually by Dr. Jumana Al-Deek, DO.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Virginia that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. Women in Fredericksburg no longer need to drive to Richmond or Northern Virginia for specialist care. Just one team, one plan, and results that last.
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
                {link.label} →
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
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>Questions from Fredericksburg Women</h2>
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
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby Virginia Communities</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Culpeper", href: "/virginia/culpeper" },
              { name: "Warrenton", href: "/virginia/warrenton" },
              { name: "McLean", href: "/virginia/mclean" },
              { name: "Reston", href: "/virginia/reston" },
              { name: "Leesburg", href: "/virginia/leesburg" },
              { name: "All Virginia Locations", href: "/virginia" },
            ].map(({ name, href }) => (
              <a key={name} href={href} className="px-5 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#E8339E]/50 text-sm transition-all" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Expert Care, Right Here in Fredericksburg</h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            You shouldn't have to drive an hour for a hormone specialist. Your first consultation is free.
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
