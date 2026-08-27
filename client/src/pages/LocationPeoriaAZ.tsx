import { useState, useEffect } from "react";
// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import Services from "@/components/Services";
import { ArrowRight, CheckCircle, ChevronDown, MapPin, Package, Smartphone, Star, Video } from "lucide-react";
import { pricingFaqs } from "@/data/pricingFaqs";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-t2-peoria_d909469c.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Peoria, AZ?",
    "a": "Peoria and the West Valley have limited menopause specialists \u2014 most are in Scottsdale or central Phoenix. MedMethod Direct provides board-certified hormone therapy via telehealth so Peoria women get specialist-level care without the drive."
  },
  {
    "q": "Can I get HRT prescribed online in Arizona?",
    "a": "Yes. Arizona-licensed physicians can prescribe hormone replacement therapy via telehealth. MedMethod Direct physicians are AZ-licensed and can prescribe bioidentical HRT shipped to your Peoria address."
  },
  {
    "q": "What does the $449 diagnostic setup include?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Most patients receive their first prescription within 5\u20137 days of completing labs."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Peoria?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout the West Valley. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other West Valley communities?",
    "a": "Yes \u2014 we serve all of the West Valley including Surprise, Glendale, Goodyear, Avondale, and Buckeye. Any Arizona resident can schedule a telehealth appointment."
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
  ...pricingFaqs,
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
];

const nearbyCities = [
  {
    "name": "Surprise, AZ",
    "path": "/surprise-az"
  },
  {
    "name": "Scottsdale, AZ",
    "path": "/scottsdale-az"
  },
  {
    "name": "Chandler, AZ",
    "path": "/chandler-az"
  },
  {
    "name": "Gilbert, AZ",
    "path": "/gilbert-az"
  },
  {
    "name": "Tempe, AZ",
    "path": "/tempe-az"
  }
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
    label: "Peoria & AZ",
    icon: "\uD83D\uDCCD",
    questions: faqs.slice(0, 6),
  },
  {
    id: "care",
    label: "About Our Care",
    icon: "\uD83E\uDE7A",
    questions: faqs.slice(6, 11),
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "\uD83D\uDC8A",
    questions: faqs.slice(11, 15),
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "\uD83D\uDCB3",
    questions: faqs.slice(15),
  },
];

export default function LocationPeoriaAZ() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Peoria, AZ",
        url: "https://www.medmethoddirect.com/peoria-az",
        description: "Board-certified telehealth menopause and hormone therapy for women in Peoria, Arizona.",
        areaServed: { "@type": "City", name: "Peoria", containedInPlace: { "@type": "State", name: "Arizona" } },
        medicalSpecialty: "Endocrinology",
        availableService: [
          { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
          { "@type": "MedicalTherapy", name: "GLP-1 Weight Loss" },
          { "@type": "MedicalTherapy", name: "Menopause Management" }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
          { "@type": "ListItem", position: 2, name: "Arizona", item: "https://www.medmethoddirect.com/arizona" },
          { "@type": "ListItem", position: 3, name: "Peoria", item: "https://www.medmethoddirect.com/peoria-az" }
        ]
      }
    ]
  };

  const [consultOpen, setConsultOpen] = useState(false);
  
  return (
    <>
      <Helmet>
        <title>Menopause Doctor Peoria AZ | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Peoria, AZ. Specialist-level HRT and GLP-1 weight loss via telehealth — no drive to Scottsdale." />
        <link rel="canonical" href="https://www.medmethoddirect.com/peoria-az" />
        <meta property="og:title" content="Menopause Doctor Peoria AZ | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Peoria, AZ. Specialist-level HRT and GLP-1 weight loss via telehealth — no drive to Scottsdale." />
        <meta property="og:url" content="https://www.medmethoddirect.com/peoria-az" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />
      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/arizona" className="hover:text-stone-800">Arizona</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Peoria</span>
        </div>
      </nav>

      {/* Hero */}
            <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-16">
            {/* LEFT: Copy */}
            <div>
              <nav className="flex items-center gap-2 text-xs font-semibold mb-5" style={{ color: "#aaa", fontFamily: "Montserrat, sans-serif" }}>
                <Link href="/" className="hover:text-[#E8339E] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/arizona" className="hover:text-[#E8339E] transition-colors">Arizona</Link>
                <span>/</span>
                <span style={{ color: "#333" }}>Peoria</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Serving Peoria, AZ
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
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                <br />
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                <br />
                for Peoria women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Peoria, AZ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <button
                  onClick={() => setConsultOpen(true)}
                  className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  SCHEDULE appointment
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              <p
                className="flex items-center gap-2 font-semibold mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradPeoria)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradPeoria" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care · Licensed in Arizona
              </p>
            </div>
            {/* RIGHT: Hero Image */}
            <div className="relative lg:-ml-6">
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-t2-peoria_d909469c.png"
                  alt="Virtual menopause doctor and hormone therapy for women in Peoria, AZ — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Peoria · Glendale · Surprise · Phoenix
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>

      {/* Access Gap */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-4">The Specialist Gap in the West Valley</h2>
            
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Peoria and you've been searching for a{" "}
              <strong>menopause doctor near Peoria, AZ</strong>, a{" "}
              <strong>medical weight loss physician serving Peoria, Arizona</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the few virtual practices in Arizona that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Glendale or Phoenix. No waiting rooms. Just one team, one plan, and results that last.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
              Related reading:
            </span>
            {[
              { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
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
          </div></div>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      {/* ── DARK DIVIDER BAND — THE MEDMETHOD STANDARD ── */}
      <div className="relative py-12 overflow-hidden" style={{ background: "#0D0D1A" }}>
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            THE MEDMETHOD STANDARD
          </p>
          <h2 className="font-black text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
            "The system you've been missing —{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              built by physicians, for women.
            </span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
          </p>
        </div>
      </div>
      {/* ── WHY PEORIA WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY PEORIA WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy West Valley Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "60-Minute Physician Consultations", desc: "Not a rushed 10-minute slot. Your physician has time to listen, review your labs, and build a protocol that fits your life." },
              { icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Hormones + Weight Loss: Treated Together", desc: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, and metabolic medicine into one unified program." },
              { icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Lab Work Near Peoria", desc: "We order your labs to a convenient LabCorp or Quest draw site near Peoria. Results reviewed within 48 hours." },
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
      {/* ── CLOSING CTA ── */}
      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            PEORIA, ARIZONA
          </p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            Ready to Feel Like Yourself Again?
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE appointment <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            100% Virtual Care · Licensed in Arizona
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
      {consultOpen && (
        <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
      )}
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
    </>
  );
}
