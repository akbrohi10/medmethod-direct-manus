/* =============================================================================
   McLean, Virginia Location Page — MedMethod Direct
   Brand: Montserrat, Medical Pink #E8339E → Deep Purple #7A1E7E gradient
   Structure mirrors Home.tsx: Navbar → Hero → Services → HowItWorks →
   VirtualVsLocal → WhyChoose → MedicalTeam → FAQ → CTA → Footer
   Local keywords: menopause doctor McLean VA, hormone therapy McLean,
   GLP-1 weight loss McLean Virginia, virtual menopause care Northern Virginia
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
import { ArrowRight, CheckCircle, Clock, Video, Star, MapPin, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalTeam from "@/components/MedicalTeam";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/mclean-va-hero-hiQN5USVEHUpy3yYQuwFUK.webp";

const gradientText = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
};

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do you serve patients in McLean, Virginia?",
    a: "Yes — MedMethod Direct is fully licensed to serve patients throughout Virginia, including McLean, Great Falls, Vienna, Reston, Arlington, and the greater Northern Virginia area. All care is delivered 100% virtually, so you never need to leave McLean.",
  },
  {
    q: "Why choose virtual care over a local OB/GYN or endocrinologist in McLean?",
    a: "Most local practices in McLean and Tysons have 3–6 week wait times for new patients, and appointments are often limited to 10–15 minutes. With MedMethod Direct, you can be seen within days, your appointments are 30–60 minutes, and you have a dedicated wellness advisor between visits. You get more time, more attention, and deeper expertise — all from your home in McLean.",
  },
  {
    q: "What services are available to McLean patients?",
    a: "All MedMethod Direct services are available to McLean patients: GLP-1 weight loss (Semaglutide and Tirzepatide), hormone replacement therapy, testosterone optimization for women, menopause and perimenopause management, thyroid support, gut health, and longevity medicine.",
  },
  {
    q: "Are the medications FDA-approved?",
    a: "We offer both FDA-approved brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded alternatives prepared by an FDA-registered 503B outsourcing pharmacy. Your physician will recommend the right option based on your goals, insurance, and medical history.",
  },
  {
    q: "How does the first consultation work for McLean patients?",
    a: "Your free 20-minute wellness consultation is conducted via secure video call — no commute, no parking, no waiting room. A wellness advisor will review your symptoms, health history, and goals, then walk you through your program options. If you decide to move forward, your physician intake is scheduled within days.",
  },
  {
    q: "Is telehealth as effective as in-person care for menopause and hormones?",
    a: "For hormone therapy, GLP-1 weight loss, and menopause management, telehealth is equally effective as in-person care. Lab work is ordered to a local draw site near McLean, prescriptions are sent to your pharmacy or delivered to your door, and your physician monitors your progress remotely with the same clinical rigor as an office visit.",
  },
  {
    q: "What is the cost of a program for McLean patients?",
    a: "Program pricing varies based on your selected services and commitment length (6 or 12 months). All pricing is discussed transparently during your free consultation — no hidden fees, no surprise bills. Most patients find our programs significantly more affordable than comparable in-person concierge practices in Northern Virginia.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b"
      style={{ borderColor: "rgba(232,51,158,0.15)" }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span
          className="font-bold text-base"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p
          className="pb-5 text-sm leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationMcLean() {
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        {/* Subtle pink radial background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

              {/* LEFT: Text + CTAs + Stats */}
              <div>
                {/* Location badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                  style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Serving McLean, Virginia
                </div>

                {/* Headline */}
                <h1
                  className="font-black leading-[1.05] mb-8"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)",
                    letterSpacing: "-0.02em",
                    color: "#111111",
                  }}
                >
                  VIRTUAL{" "}
                  <span style={gradientText}>MENOPAUSE</span>
                  <br />
                  &{" "}
                  <span style={gradientText}>HORMONE CARE</span>
                  <br />
                  FOR MCLEAN WOMEN
                </h1>

                {/* Subheadline */}
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
                >
                  Premium virtual care for women in McLean, Northern Virginia — no waiting rooms, no rushed appointments, no commute. Expert hormone therapy, GLP-1 weight loss, and menopause management from the comfort of your home.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Virtual care tagline */}
                <p
                  className="flex items-center gap-2 font-semibold mb-8"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="url(#vcGrad2)"/>
                    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="vcGrad2" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                  </svg>
                  100% Virtual Care · Licensed in Virginia
                </p>

                {/* Stats */}
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
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "1.7rem",
                          ...gradientText,
                        }}
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
                <div
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                  style={gradientBg}
                />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={HERO_IMAGE}
                    alt="Virtual menopause and hormone care for women in McLean, Virginia"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay for text legibility */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                  >
                    <p
                      className="text-white font-bold text-sm tracking-wide"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Serving McLean · Great Falls · Vienna · Reston · Arlington
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div className="w-full" style={{ height: "4px", ...gradientBg }} />
      </section>

      {/* ── SERVICES (reused from homepage) ──────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />

      {/* ── HOW IT WORKS (reused from homepage) ──────────────────────────────── */}
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── VIRTUAL VS. LOCAL ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Why Virtual Wins
            </p>
            <h2
              className="font-black leading-tight mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                color: "#111111",
              }}
            >
              Looking for a Menopause Doctor{" "}
              <span style={gradientText}>Near McLean?</span>
              <br />
              Here's Why Virtual Care Delivers More.
            </h2>
            <p
              className="text-base max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}
            >
              We understand the instinct to find someone local. But for menopause, hormone therapy, and GLP-1 weight loss, virtual care isn't just convenient — it's clinically superior in almost every way that matters.
            </p>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-2xl shadow-lg border" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
            <table className="w-full text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>
                  <th className="text-left px-6 py-4 text-white font-bold text-xs tracking-wider uppercase">What Matters to You</th>
                  <th className="px-6 py-4 text-white font-bold text-xs tracking-wider uppercase text-center">Local OB/GYN in McLean</th>
                  <th className="px-6 py-4 text-white font-bold text-xs tracking-wider uppercase text-center">MedMethod Direct</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { factor: "Wait time for new patient", local: "3–6 weeks", mmd: "This week", mmdWin: true },
                  { factor: "Appointment length", local: "10–15 minutes", mmd: "30–60 minutes", mmdWin: true },
                  { factor: "Menopause specialization", local: "General OB/GYN", mmd: "Dedicated specialty", mmdWin: true },
                  { factor: "GLP-1 / Semaglutide access", local: "Rarely offered", mmd: "Core service", mmdWin: true },
                  { factor: "Ongoing monitoring", local: "Annual check-in", mmd: "Monthly physician reviews", mmdWin: true },
                  { factor: "Commute required", local: "Yes — Tysons/McLean traffic", mmd: "None — 100% virtual", mmdWin: true },
                  { factor: "Dedicated wellness advisor", local: "No", mmd: "Yes — between every visit", mmdWin: true },
                  { factor: "Lab work", local: "In-office only", mmd: "Local draw site near McLean", mmdWin: false },
                ].map((row, i) => (
                  <tr key={row.factor} style={{ background: i % 2 === 0 ? "#fff" : "rgba(232,51,158,0.02)" }}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{row.factor}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.local}</td>
                    <td className="px-6 py-4 text-center font-bold" style={{ color: row.mmdWin ? "#E8339E" : "#555" }}>
                      {row.mmdWin && <CheckCircle className="w-4 h-4 inline mr-1.5 mb-0.5" style={{ color: "#E8339E" }} />}
                      {row.mmd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Persuasion block */}
          <div
            className="mt-12 rounded-2xl p-8 lg:p-10"
            style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.06) 100%)", border: "1px solid rgba(232,51,158,0.15)" }}
          >
            <p
              className="text-lg font-bold leading-relaxed text-center"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
            >
              "It's easy to click out, and difficult to show up. But this time it's for you."
            </p>
            <p
              className="text-sm text-center mt-3 mb-6"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#666" }}
            >
              Women in McLean, Great Falls, and Vienna are discovering that the best care isn't always the closest — it's the most attentive, the most specialized, and the most convenient for your actual life.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setConsultOpen(true)}
                className="btn-gradient px-6 py-3 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 group"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Schedule My Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY MCLEAN WOMEN CHOOSE US ────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#f9f9fb" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Built for Your Life
            </p>
            <h2
              className="font-black leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                color: "#111111",
              }}
            >
              Why McLean Women Choose{" "}
              <span style={gradientText}>MedMethod Direct</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "No More 6-Week Waits",
                body: "McLean's top OB/GYN practices are booked out for months. We can see you this week — from your home, your office, or anywhere in Northern Virginia.",
              },
              {
                icon: <Video className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "30–60 Minute Appointments",
                body: "Not a rushed 10-minute slot. Your physician has time to actually listen, review your labs, and build a protocol that fits your life — not a generic template.",
              },
              {
                icon: <Star className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Menopause Specialists Only",
                body: "We don't treat everything. We specialize in hormones, menopause, GLP-1 weight loss, and longevity medicine — so you get depth of expertise that a generalist simply can't match.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Dedicated Wellness Advisor",
                body: "Between every physician visit, your personal wellness advisor is available to answer questions, adjust your plan, and keep you on track — something no local practice offers.",
              },
              {
                icon: <MapPin className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Lab Work Near McLean",
                body: "We order your labs to a convenient draw site near McLean or Tysons. No in-office phlebotomy required — your results are reviewed by your physician within 48 hours.",
              },
              {
                icon: <ArrowRight className="w-6 h-6" style={{ color: "#E8339E" }} />,
                title: "Medications Delivered to Your Door",
                body: "Whether you choose an FDA-approved brand or a compounded alternative from our 503B pharmacy, your medication is shipped directly to your McLean address — discreetly and on schedule.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-6 bg-white shadow-sm border"
                style={{ borderColor: "rgba(232,51,158,0.12)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(232,51,158,0.08)" }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#666" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICAL TEAM (reused from homepage) ──────────────────────────────── */}
      <MedicalTeam />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Questions & Answers
            </p>
            <h2
              className="font-black leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: "#111111",
              }}
            >
              Frequently Asked Questions for{" "}
              <span style={gradientText}>McLean Patients</span>
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }}
      >
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            McLean, Virginia
          </p>
          <h2
            className="font-black text-white leading-tight mb-4"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            }}
          >
            Your First Step Starts Here.
          </h2>
          <p
            className="text-white/85 text-base leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Women in McLean, Great Falls, Vienna, Reston, and Arlington are reclaiming their health — without waiting rooms, without rushed appointments, without putting themselves last. Your free consultation is 20 minutes and completely obligation-free.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="bg-white font-bold rounded-full px-8 py-4 text-sm tracking-wider flex items-center gap-2 mx-auto group hover:shadow-xl transition-shadow"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
          >
            SCHEDULE MY FREE CONSULTATION
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p
            className="text-white/70 text-xs mt-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            100% Virtual · No Obligation · No Pressure · Licensed in Virginia
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
