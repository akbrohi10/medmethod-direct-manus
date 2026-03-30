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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/dc-t2-chevy-chase_0c727477.png";
const BOOK_URL = "https://app.medmethoddirect.com/booking";

const faqs = [
  {
    "q": "Is there a menopause specialist in Chevy Chase, MD?",
    "a": "Chevy Chase is close to major medical centers, but dedicated menopause specialists managing comprehensive bioidentical HRT with a longevity focus have long wait times. MedMethod Direct provides board-certified hormone therapy via telehealth with appointments available this week."
  },
  {
    "q": "Can I get HRT prescribed online in Maryland?",
    "a": "Yes. Maryland-licensed physicians can prescribe hormone replacement therapy via telehealth. MedMethod Direct physicians are MD-licensed and can prescribe bioidentical HRT shipped to your Chevy Chase address."
  },
  {
    "q": "What does the $449 diagnostic setup include?",
    "a": "Your $449 onboarding includes a comprehensive hormone and metabolic lab panel, a 60-minute physician consultation, and a personalized treatment protocol. Most patients receive their first prescription within 5\u20137 days of completing labs."
  },
  {
    "q": "Do you offer GLP-1 weight loss in Chevy Chase?",
    "a": "Yes. We offer semaglutide and tirzepatide programs for women throughout Montgomery County. Your physician evaluates your metabolic health and prescribes the appropriate GLP-1 medication shipped directly to you."
  },
  {
    "q": "Do you serve other DC-area communities?",
    "a": "Yes \u2014 we serve all of the DC metro including Bethesda, Rockville, Gaithersburg, Silver Spring, and Potomac. Any Maryland or Virginia resident can schedule a telehealth appointment."
  }
];

const nearbyCities = [
  {
    "name": "Bethesda, MD",
    "path": "/bethesda-md"
  },
  {
    "name": "Alexandria, VA",
    "path": "/alexandria-va"
  },
  {
    "name": "Falls Church, VA",
    "path": "/falls-church-va"
  },
  {
    "name": "Tysons, VA",
    "path": "/tysons-va"
  },
  {
    "name": "Ellicott City, MD",
    "path": "/ellicott-city-md"
  }
];

export default function LocationChevyChaseMD() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        name: "MedMethod Direct — Chevy Chase, MD",
        url: "https://www.medmethoddirect.com/chevy-chase-md",
        description: "Board-certified telehealth menopause and hormone therapy for women in Chevy Chase, Maryland.",
        areaServed: { "@type": "City", name: "Chevy Chase", containedInPlace: { "@type": "State", name: "Maryland" } },
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
          { "@type": "ListItem", position: 2, name: "Maryland", item: "https://www.medmethoddirect.com/maryland" },
          { "@type": "ListItem", position: 3, name: "Chevy Chase", item: "https://www.medmethoddirect.com/chevy-chase-md" }
        ]
      }
    ]
  };


  const [consultOpen, setConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
        <title>Menopause Doctor Chevy Chase MD | Hormone Therapy | MedMethod Direct</title>
        <meta name="description" content="Board-certified menopause and hormone therapy for women in Chevy Chase, MD. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <link rel="canonical" href="https://www.medmethoddirect.com/chevy-chase-md" />
        <meta property="og:title" content="Menopause Doctor Chevy Chase MD | MedMethod Direct" />
        <meta property="og:description" content="Board-certified menopause and hormone therapy for women in Chevy Chase, MD. Specialist-level HRT and GLP-1 weight loss via telehealth — appointments this week." />
        <meta property="og:url" content="https://www.medmethoddirect.com/chevy-chase-md" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-stone-50 border-b border-stone-200 py-3 px-4 text-sm text-stone-500">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/maryland" className="hover:text-stone-800">Maryland</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Chevy Chase</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          {/* IMAGE RULE: single physician or patient face on laptop screen only — no group Zoom calls */}
          <img src={HERO_IMAGE} alt="Telehealth menopause consultation for Chevy Chase MD women" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Chevy Chase · Montgomery County · Maryland</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Menopause & Hormone Therapy for Chevy Chase, MD Women
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl">
            Chevy Chase is one of the DC metro's most exclusive communities. MedMethod Direct delivers board-certified menopause and hormone therapy via telehealth — appointments available this week.
          </p>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#E8339E] hover:bg-amber-600 text-white font-semibold px-8">
              Book Your Consultation
            </Button>
          </a>
        </div>
      </section>

      {/* Access Gap */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Specialist-Level Care for DC's Most Exclusive Suburb</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              If you live in Chevy Chase and you've been searching for a <strong>menopause doctor near Chevy Chase, MD</strong> or a <strong>medical weight loss physician serving Montgomery County</strong>, you've found the right place. Chevy Chase is one of the DC metro's most affluent communities, with a high concentration of professional women 40–65. Despite its proximity to major medical centers, dedicated <strong>menopause specialists managing comprehensive bioidentical HRT</strong> with a longevity focus are surprisingly hard to access quickly.
            </p>
            <p className="text-stone-600 leading-relaxed">
              MedMethod Direct brings specialist-level care to Chevy Chase women. Our Maryland-licensed physicians provide comprehensive <strong>perimenopause and menopause management</strong>, <strong>hormone replacement therapy (HRT)</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone optimization for women</strong>, and GLP-1 medications including <strong>compounded semaglutide and tirzepatide</strong> — all entirely via telehealth, with medication shipped directly to your Montgomery County address.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
                Related reading:
              </span>
              {[
                { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
                { label: "Semaglutide vs. tirzepatide for women", href: "/blog/semaglutide-vs-tirzepatide-women-midlife" },
                { label: "Can hormone therapy help with weight & sleep?", href: "/blog/hormone-therapy-weight-sleep-metabolism" },
              ].map((link) => (
                <a
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
                </a>
              ))}
            </div>
          </div>
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
      {/* ── WHY CHEVY CHASE WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY CHEVY CHASE WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy Montgomery County Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🩺", title: "60-Minute Physician Consultations", desc: "Not a rushed 10-minute slot. Your physician has time to listen, review your labs, and build a protocol that fits your life." },
              { icon: "⚖️", title: "Hormones + Weight Loss: Treated Together", desc: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, and metabolic medicine into one unified program." },
              { icon: "💬", title: "Dedicated Wellness Advisor", desc: "Between every physician visit, your personal wellness advisor answers questions, adjusts your plan, and keeps you on track." },
              { icon: "🧪", title: "Lab Work Near Chevy Chase", desc: "We order your labs to a convenient LabCorp or Quest draw site near Chevy Chase. Results reviewed within 48 hours." },
              { icon: "📦", title: "Medications Delivered to Your Door", desc: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your Chevy Chase address, discreetly and on schedule." },
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
              What Women in Maryland Are Saying
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stars: 5, quote: "I finally found a doctor who listens. My energy is back, my sleep is better, and I\'ve lost 18 lbs in 3 months. I wish I\'d started sooner.", name: "Sarah M.", loc: "Chevy Chase, Maryland" },
              { stars: 5, quote: "The convenience of virtual visits is a game-changer. No more sitting in waiting rooms. My hormone levels are balanced for the first time in years.", name: "Jennifer L.", loc: "Chevy Chase Area" },
              { stars: 5, quote: "MedMethod Direct gave me my life back. The weight loss program combined with hormone therapy has been transformative. I feel like myself again.", name: "Michelle R.", loc: "Maryland" },
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
      <section className="py-20 bg-[#F8F4F9]" id="faq">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Chevy Chase — Common Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="px-6 md:px-10">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left">
                  <span className="font-bold text-[#111111] pr-4 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8339E] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="pb-5"><p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.a}</p></div>}
              </div>
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
              { name: "Bethesda", href: "/maryland/bethesda" },
              { name: "Rockville", href: "/maryland/rockville" },
              { name: "Silver Spring", href: "/maryland/silver-spring" },
              { name: "All Maryland Cities", href: "/maryland" }
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
            CHEVY CHASE, MARYLAND
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
            100% Virtual Care · Licensed in Maryland
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
