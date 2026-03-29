/* =============================================================================
   LocationScottsdaleAZ.tsx — Scottsdale, Arizona City Page
   medmethod-location-seo skill compliant
   Primary keyword: menopause doctor Scottsdale AZ
   IMAGE RULE: Single physician or patient face on laptop screen only — no group Zoom calls
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is MedMethod Direct licensed to practice medicine in Scottsdale, Arizona?",
    a: "Yes. MedMethod Direct holds an active Arizona medical license and is fully authorized to provide telehealth services to patients in Scottsdale and throughout the state. Our board-certified physicians can evaluate, diagnose, and prescribe medications — including bioidentical hormones and GLP-1 weight loss therapies — through secure video consultations.",
  },
  {
    q: "Do Scottsdale patients need to visit a clinic or office?",
    a: "No in-person visit is ever required. MedMethod Direct is a 100% virtual practice. Scottsdale patients complete all consultations, lab reviews, and follow-ups via secure video appointment. Compounded medications are shipped directly to your Scottsdale address through our FDA-registered 503B pharmacy partners.",
  },
  {
    q: "Why is Scottsdale such a strong market for telehealth hormone care?",
    a: "Scottsdale's affluent, health-conscious population — particularly in North Scottsdale, McCormick Ranch, and the Kierland corridor — has high awareness of preventive and longevity medicine. Yet local specialist wait times for hormone therapy and menopause care can stretch to 3–6 months. MedMethod Direct offers Scottsdale women access to board-certified hormone specialists within 48 hours, without leaving home.",
  },
  {
    q: "What hormone and weight loss treatments are available in Scottsdale?",
    a: "MedMethod Direct offers comprehensive hormone replacement therapy including estradiol, progesterone, and testosterone optimization; GLP-1 medical weight loss with semaglutide and tirzepatide; perimenopause and menopause management; thyroid optimization; and longevity protocols. All treatments are personalized based on your lab results and health history.",
  },
  {
    q: "How does the initial consultation work for Scottsdale patients?",
    a: "Your first consultation is a free 45-minute video call with a board-certified physician. You'll discuss your symptoms, health history, and goals. If labs are needed, we provide a requisition for a local Scottsdale draw site. Once results are in, your physician reviews them and presents a personalized treatment plan — typically within 3–5 business days of your initial call.",
  },
];

const JSONLD_Business = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct — Scottsdale",
  url: "https://www.medmethoddirect.com/arizona/scottsdale",
  description: "MedMethod Direct provides premium virtual women's health care in Scottsdale, AZ — hormone replacement therapy, GLP-1 medical weight loss, and menopause management. Board-certified physicians, 100% telehealth.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "City", name: "Scottsdale, Arizona" },
  availableService: [
    { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", name: "Medical Weight Loss" },
    { "@type": "MedicalTherapy", name: "Menopause Management" },
  ],
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const JSONLD_Breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
    { "@type": "ListItem", position: 2, name: "Arizona", item: "https://www.medmethoddirect.com/arizona" },
    { "@type": "ListItem", position: 3, name: "Scottsdale", item: "https://www.medmethoddirect.com/arizona/scottsdale" },
  ],
};

export default function LocationScottsdaleAZ() {
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Scottsdale Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct offers virtual hormone therapy, GLP-1 weight loss, and menopause care for Scottsdale, AZ women. Board-certified physicians, no office visit required. Book a free consultation." />
        <link rel="canonical" href="https://www.medmethoddirect.com/arizona/scottsdale" />
        <meta property="og:title" content="Scottsdale Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Premium virtual hormone therapy and medical weight loss for Scottsdale women. Board-certified physicians, 100% telehealth." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/arizona/scottsdale" />
        <meta property="og:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-scottsdale-6brpYLQ8G9fKa2JcfUB2pF.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scottsdale Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Premium virtual hormone therapy and medical weight loss for Scottsdale women." />
        <meta name="twitter:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-scottsdale-6brpYLQ8G9fKa2JcfUB2pF.png" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_Business)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_Breadcrumb)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

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
                <span style={{ color: "#333" }}>Scottsdale</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Serving Scottsdale, AZ
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
                for Scottsdale women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                The only virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Scottsdale, AZ.
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
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradScottsdale)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradScottsdale" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care · Licensed in Arizona
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
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-scottsdale-FWg5CHPnXV4e2ZDzbbPJcQ.webp"
                  alt="Virtual menopause doctor and hormone therapy for women in Scottsdale, AZ — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Scottsdale · Paradise Valley · Chandler · Gilbert
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>

      {/* Body copy */}
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Why Scottsdale Women Choose Us</p>
            <h2 className="text-3xl font-black text-[#0d0d0d] mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Expert Hormone Care,<br />Scottsdale Convenience</h2>
            
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Scottsdale and you've been searching for a{" "}
              <strong>menopause doctor near Scottsdale, AZ</strong>, a{" "}
              <strong>medical weight loss physician serving Scottsdale, Arizona</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
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
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Arizona that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Phoenix or Tempe. No waiting rooms. Just one team, one plan, and results that last.
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
          <div className="flex flex-col gap-4">
            {[
              { title: "Hormone Replacement Therapy", desc: "Personalized estradiol, progesterone, and testosterone protocols based on your labs and symptoms." },
              { title: "GLP-1 Medical Weight Loss", desc: "Semaglutide and tirzepatide programs with physician oversight, metabolic monitoring, and ongoing support." },
              { title: "Menopause Management", desc: "Comprehensive perimenopause and menopause care addressing hot flashes, sleep, cognition, and libido." },
              { title: "Thyroid Optimization", desc: "Full thyroid panel review and optimization to address fatigue, weight gain, and brain fog at the source." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white border border-[#0d0d0d]/8 p-5">
                <p className="font-bold text-[#0d0d0d] mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{title}</p>
                <p className="text-[#0d0d0d]/60 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* FAQ */}
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Scottsdale FAQ</p>
            <h2 className="text-3xl font-black text-[#0d0d0d]" style={{ fontFamily: "Montserrat, sans-serif" }}>Common Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#0d0d0d]/10 bg-white">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-bold text-[#0d0d0d] pr-4" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8339E] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-6"><p className="text-[#0d0d0d]/70 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby cities */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <p className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Paradise Valley", href: "/arizona/paradise-valley" },
              { name: "Chandler", href: "/arizona/chandler" },
              { name: "Gilbert", href: "/arizona/gilbert" },
              { name: "All Arizona Cities", href: "/arizona" },
            ].map(({ name, href }) => (
              <Link key={name} href={href}>
                <span className="border border-white/10 text-white/60 hover:text-white hover:border-[#E8339E]/40 text-sm px-4 py-2 transition-all cursor-pointer" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-20 border-t border-white/5">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your first consultation is free. A board-certified physician reviews your history, discusses your goals, and outlines a personalized plan — all in one 45-minute video call from your Scottsdale home.</p>
          <button onClick={() => setConsultOpen(true)} className="px-10 py-4 font-bold text-sm tracking-widest uppercase text-white hover:opacity-90 transition-all" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>
            Schedule Free Consultation
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Licensed in Arizona · Serving Scottsdale · 100% Virtual</p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
