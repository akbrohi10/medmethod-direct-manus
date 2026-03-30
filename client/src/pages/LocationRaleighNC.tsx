/**
 * MedMethod Direct — Raleigh, NC
 * IMAGE RULE: single face on laptop screen only (physician or patient in telehealth).
 */
import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConsultationModal from "@/components/ConsultationModal";
import WhyChoose from "@/components/WhyChoose";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-raleigh-nbvnddfQdnf65AfFQSQ8mf.webp";

const faqs = [
  {
    q: "Is MedMethod Direct licensed to practice in North Carolina?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in North Carolina. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the state — including Raleigh — entirely via telehealth, with no in-person visit required.",
  },
  {
    q: "Do I need to visit an office to become a patient in Raleigh?",
    a: "No. MedMethod Direct is a 100% virtual practice. Everything — your consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication ships directly from a licensed 503B compounding pharmacy to your Raleigh address.",
  },
  {
    q: "Why is Raleigh a strong market for telehealth hormone therapy?",
    a: "Raleigh sits at the heart of the Research Triangle, home to one of the most educated and health-literate populations in the Southeast. Many women in Raleigh work in biotech, pharma, and academia — they research their healthcare options thoroughly and are early adopters of evidence-based telehealth. Despite the Triangle's rapid growth, specialist wait times for perimenopause and HRT care remain long, making virtual care a practical and preferred solution.",
  },
  {
    q: "What makes MedMethod Direct different from local Raleigh hormone clinics?",
    a: "Traditional Raleigh hormone clinics require in-person visits, often have weeks-long wait times, and may not offer the full spectrum of GLP-1 weight loss programs alongside hormone therapy. MedMethod Direct provides same-week consultations, personalized lab-based protocols, and ships medication directly to your door — all from board-certified physicians with deep expertise in women's hormonal health.",
  },
  {
    q: "What services does MedMethod Direct offer Raleigh patients?",
    a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight included.",
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
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>{a}</p>
      )}
    </div>
  );
}

export default function LocationRaleighNC() {
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
        <title>Raleigh NC Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit. Serving the Research Triangle & all of Raleigh." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina/raleigh" />
        <meta property="og:title" content="Raleigh NC Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina/raleigh" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Raleigh NC Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "MedMethod Direct", "url": "https://www.medmethoddirect.com/north-carolina/raleigh", "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women in Raleigh, NC and the Research Triangle.", "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], "areaServed": { "@type": "City", "name": "Raleigh, North Carolina" }, "availableService": [{ "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", "name": "Medical Weight Loss" }, { "@type": "MedicalTherapy", "name": "Menopause Management" }] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" }, { "@type": "ListItem", "position": 2, "name": "North Carolina", "item": "https://www.medmethoddirect.com/north-carolina" }, { "@type": "ListItem", "position": 3, "name": "Raleigh", "item": "https://www.medmethoddirect.com/north-carolina/raleigh" }] })}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
            <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-16">
            {/* LEFT: Copy */}
            <div>
              <nav className="flex items-center gap-2 text-xs font-semibold mb-5" style={{ color: "#aaa", fontFamily: "Montserrat, sans-serif" }}>
                <Link href="/" className="hover:text-[#E8339E] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/north-carolina" className="hover:text-[#E8339E] transition-colors">North Carolina</Link>
                <span>/</span>
                <span style={{ color: "#333" }}>Raleigh</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Serving Raleigh, NC
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
                for Raleigh women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                The only virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Raleigh, NC.
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
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradRaleigh)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradRaleigh" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care · Licensed in North Carolina
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
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-raleigh-nbvnddfQdnf65AfFQSQ8mf.webp"
                  alt="Virtual menopause doctor and hormone therapy for women in Raleigh, NC — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Raleigh · Durham · Cary · Chapel Hill
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Raleigh, NC</h2>
          
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Raleigh and you've been searching for a{" "}
              <strong>menopause doctor near Raleigh, NC</strong>, a{" "}
              <strong>medical weight loss physician serving Raleigh, North Carolina</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
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
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in North Carolina that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Chapel Hill or Durham. No waiting rooms. Just one team, one plan, and results that last.
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
      {/* ── WHY RALEIGH WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              WHY RALEIGH WOMEN CHOOSE US
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Built for Busy Wake County Women
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🩺", title: "60-Minute Physician Consultations", desc: "Not a rushed 10-minute slot. Your physician has time to listen, review your labs, and build a protocol that fits your life." },
              { icon: "⚖️", title: "Hormones + Weight Loss: Treated Together", desc: "Most practices treat weight loss or hormones — never both. We combine GLP-1 therapy, BHRT, and metabolic medicine into one unified program." },
              { icon: "💬", title: "Dedicated Wellness Advisor", desc: "Between every physician visit, your personal wellness advisor answers questions, adjusts your plan, and keeps you on track." },
              { icon: "🧪", title: "Lab Work Near Raleigh", desc: "We order your labs to a convenient LabCorp or Quest draw site near Raleigh. Results reviewed within 48 hours." },
              { icon: "📦", title: "Medications Delivered to Your Door", desc: "Semaglutide, tirzepatide, BHRT, testosterone — shipped directly to your Raleigh address, discreetly and on schedule." },
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
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              PATIENT STORIES
            </p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              What Women in North Carolina Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I spent two years bouncing between my OB-GYN and an endocrinologist. MedMethod got me on the right protocol in one visit. My hot flashes are gone, I'm sleeping through the night, and I've lost 18 pounds.", name: "Sarah M.", location: "North Carolina Patient", rating: 5 },
              { quote: "The combination of hormone therapy and GLP-1 medication changed everything. I finally feel like myself again — more energy, clearer thinking, and the weight is actually coming off.", name: "Jennifer L.", location: "North Carolina Patient", rating: 5 },
              { quote: "I was skeptical about telehealth for something this personal, but my MedMethod physician spent a full hour with me. She knew more about menopause than any doctor I've seen in person.", name: "Patricia K.", location: "North Carolina Patient", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4" style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%)" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-[#E8339E] text-base">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1" style={{ fontFamily: "Montserrat, sans-serif" }}>"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#111111] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.name}</p>
                  <p className="text-[#E8339E] text-xs" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.location}</p>
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
              Frequently Asked Questions for{" "}<span style={{background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Raleigh Patients</span>
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#999" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{ name: "Cary", slug: "cary" }, { name: "Chapel Hill", slug: "chapel-hill" }, { name: "Charlotte", slug: "charlotte" }].map(c => (
              <Link key={c.slug} href={`/north-carolina/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white" style={{ background: "#EBEBF0", color: "#444" }}>{c.name}</Link>
            ))}
            <Link href="/north-carolina" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#E8339E", color: "#fff" }}>All NC Locations →</Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in North Carolina</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>Ready to Start in Raleigh?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>Your free 20-minute consultation is the first step. No commitment required.</p>
        <button onClick={() => setConsultOpen(true)} className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}>Schedule Free Consultation</button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Link href="/locations" className="hover:text-white transition-colors">View all locations</Link>{" · "}
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
      </section>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
