import { useState, useRef, useEffect } from "react";
// IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import PopularPrograms from "@/components/PopularPrograms";
import { ChevronDown, ArrowRight } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/fl-t2-palm-beach-gardens_cf7b35fe.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Palm Beach Gardens, FL?",
    "a": "Palm Beach Gardens has general OB-GYN practices, but dedicated menopause specialists managing comprehensive HRT are concentrated in Boca Raton or West Palm Beach. MedMethod Direct provides board-certified hormone therapy via telehealth so Palm Beach Gardens women get specialist-level care without the commute."
  },
  {
    "q": "Can I get bioidentical HRT online in Florida?",
    "a": "Yes. Florida-licensed physicians can prescribe bioidentical hormone replacement therapy via telehealth. MedMethod Direct physicians are FL-licensed and prescribe customized bioidentical estrogen, progesterone, and testosterone shipped to your Palm Beach Gardens address."
  },
  {
    "q": "What is included in the $449 diagnostic consultation?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Most patients receive their first prescription within 5\u20137 days of completing labs."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Palm Beach Gardens?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout Northern Palm Beach County. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other Palm Beach County communities?",
    "a": "Yes \u2014 we serve all of Palm Beach County including Jupiter, Boca Raton, Delray Beach, and West Palm Beach. Any Florida resident can schedule a telehealth appointment."
  }
];

const nearbyCities = [
  {
    "name": "Jupiter, FL",
    "path": "/jupiter-fl"
  },
  {
    "name": "Vero Beach, FL",
    "path": "/vero-beach-fl"
  },
  {
    "name": "Miami, FL",
    "path": "/miami-fl"
  },
  {
    "name": "Marco Island, FL",
    "path": "/marco-island-fl"
  },
  {
    "name": "Ponte Vedra, FL",
    "path": "/ponte-vedra-fl"
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
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>{a}</p>
      )}
    </div>
  );
}

export default function LocationPalmBeachGardensFL() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Palm Beach Gardens, FL",
        url: "https://www.medmethoddirect.com/palm-beach-gardens-fl",
        description: "Board-certified telehealth menopause and hormone therapy for women in Palm Beach Gardens, Florida.",
        areaServed: { "@type": "City", name: "Palm Beach Gardens", containedInPlace: { "@type": "State", name: "Florida" } },
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
          { "@type": "ListItem", position: 2, name: "Florida", item: "https://www.medmethoddirect.com/florida" },
          { "@type": "ListItem", position: 3, name: "Palm Beach Gardens", item: "https://www.medmethoddirect.com/palm-beach-gardens-fl" }
        ]
      }
    ]
  };

  const [consultOpen, setConsultOpen] = useState(false);
  
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateCount(setCount1, 0, 10000, 1500);
          animateCount(setCount2, 0, 98, 1200);
          animateCount(setCount3, 0, 15, 1400);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  function animateCount(setter: (v: number) => void, from: number, to: number, duration: number) {
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  return (
    <>
      <Helmet>
        <title>Menopause Doctor Palm Beach Gardens FL | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Palm Beach Gardens, FL. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <link rel="canonical" href="https://www.medmethoddirect.com/palm-beach-gardens-fl" />
        <meta property="og:title" content="Menopause Doctor Palm Beach Gardens FL | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Palm Beach Gardens, FL. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <meta property="og:url" content="https://www.medmethoddirect.com/palm-beach-gardens-fl" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/florida" className="hover:text-stone-800">Florida</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Palm Beach Gardens</span>
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
                <Link href="/florida" className="hover:text-[#E8339E] transition-colors">Florida</Link>
                <span>/</span>
                <span style={{ color: "#333" }}>Palm Beach Gardens</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Serving Palm Beach Gardens, FL
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
                <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                <br />
                <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                <br />
                for Palm Beach Gardens women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                The only virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Palm Beach Gardens, FL.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <button
                  onClick={() => setConsultOpen(true)}
                  className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  SCHEDULE FREE CONSULTATION
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              <p
                className="flex items-center gap-2 font-semibold mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradPalmBeachGardens)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradPalmBeachGardens" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care · Licensed in Florida
              </p>
              <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                {[
                  { value: `${count1.toLocaleString()}+`, label: "Women Served" },
                  { value: `${count2}%`, label: "Satisfaction Rate" },
                  { value: "4.9★", label: "Patient Rating" },
                  { value: `${count3}%+`, label: "Avg. Weight Loss" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-black leading-none"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* RIGHT: Hero Image */}
            <div className="relative lg:-ml-6">
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/fl-t2-palm-beach-gardens_cf7b35fe.png"
                  alt="Virtual menopause doctor and hormone therapy for women in Palm Beach Gardens, FL — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Palm Beach Gardens · Jupiter · North Palm Beach · Boca Raton
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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Specialist-Level Care for Palm Beach Gardens Women</h2>
            
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Palm Beach Gardens and you've been searching for a{" "}
              <strong>menopause doctor near Palm Beach Gardens, FL</strong>, a{" "}
              <strong>medical weight loss physician serving Palm Beach Gardens, Florida</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
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
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Florida that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Jupiter or Boca Raton. No waiting rooms. Just one team, one plan, and results that last.
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
          </div></div>
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            <h3 className="text-xl font-bold text-stone-800 mb-6">What We Treat</h3>
            <ul className="space-y-3 text-stone-600">
              {["Hot flashes & night sweats","Hormonal weight gain","Brain fog & fatigue","Sleep disruption","Low libido & vaginal dryness","Perimenopause symptoms","Thyroid dysfunction","Metabolic optimization"].map(s => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#E8339E] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
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
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              built by physicians, for women.
            </span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.
          </p>
        </div>
      </div>
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />
      {/* ── WHY PALM BEACH GARDENS WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY PALM BEACH GARDENS WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy Palm Beach County Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🩺", title: "60-Minute Physician Consultations", desc: "Not a rushed 10-minute slot. Your physician has time to listen, review your labs, and build a protocol that fits your life." },
              { icon: "⚖️", title: "Hormones + Weight Loss: Treated Together", desc: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, and metabolic medicine into one unified program." },
              { icon: "💬", title: "Dedicated Wellness Advisor", desc: "Between every physician visit, your personal wellness advisor answers questions, adjusts your plan, and keeps you on track." },
              { icon: "🧪", title: "Lab Work Near Palm Beach Gardens", desc: "We order your labs to a convenient LabCorp or Quest draw site near Palm Beach Gardens. Results reviewed within 48 hours." },
              { icon: "📦", title: "Medications Delivered to Your Door", desc: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your Palm Beach Gardens address, discreetly and on schedule." },
              { icon: "📱", title: "100% Virtual — No Commute", desc: "Every consultation happens over secure video. No waiting rooms, no traffic — just expert care from your living room." },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-[#111111] text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* ── PATIENT STORIES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              PATIENT STORIES
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}>
              What Women in Florida Are Saying
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stars: 5, quote: "I finally found a doctor who listens. My energy is back, my sleep is better, and I\'ve lost 18 lbs in 3 months. I wish I\'d started sooner.", name: "Sarah M.", loc: "Palm Beach Gardens, Florida" },
              { stars: 5, quote: "The convenience of virtual visits is a game-changer. No more sitting in waiting rooms. My hormone levels are balanced for the first time in years.", name: "Jennifer L.", loc: "Palm Beach Gardens Area" },
              { stars: 5, quote: "MedMethod Direct gave me my life back. The weight loss program combined with hormone therapy has been transformative. I feel like myself again.", name: "Michelle R.", loc: "Florida" },
            ].map((t, i) => (
              <div key={i} className="bg-[#F8F4F9] rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-[#E8339E] text-base">\u2605</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1 mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-[#111111] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.name}</p>
                  <p className="text-gray-400 text-xs" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Palm Beach Gardens Patients</span>
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
      {/* ── NEARBY CITIES ── */}
      <section className="bg-[#0D0D1A] py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <p className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>ALSO SERVING NEARBY</p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Jupiter", href: "/florida/jupiter" },
              { name: "Boca Raton", href: "/florida/boca-raton" },
              { name: "Vero Beach", href: "/florida/vero-beach" },
              { name: "All Florida Cities", href: "/florida" }
            ].map(({ name, href }) => (
              <Link key={name} href={href}>
                <span className="border border-white/10 text-white/60 hover:text-white hover:border-[#E8339E]/40 text-sm px-4 py-2 rounded-full transition-all cursor-pointer" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ── CLOSING CTA ── */}
      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            PALM BEACH GARDENS, FLORIDA
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
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            100% Virtual Care · Licensed in Florida
          </p>
        </div>
      </section>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      {consultOpen && (
        <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
      )}
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
    </>
  );
}
