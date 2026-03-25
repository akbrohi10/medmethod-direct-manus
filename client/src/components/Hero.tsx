/* =============================================================================
   Hero Section — Clinical Noir Design
   Full-bleed dark background with hero image, gradient CTAs, ticker strip
   ============================================================================= */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/hero-bg-5nAbKDYmK4csnxnSdezEyH.webp";

const tickerItems = [
  "HORMONE OPTIMIZATION",
  "MEDICALLY SUPERVISED WEIGHT LOSS",
  "PEPTIDE THERAPY",
  "ANTI-AGING & LONGEVITY",
  "TELEHEALTH CONVENIENCE",
  "SCIENCE-BASED PROTOCOLS",
  "LICENSED PROVIDERS",
  "PERSONALIZED TREATMENT PLANS",
];

export default function Hero() {
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
          animateCount(setCount3, 0, 50, 1000);
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

  const tickerContent = [...tickerItems, ...tickerItems];

  return (
    <section className="relative min-h-screen flex flex-col bg-[#111111] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Premium medical wellness"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center pt-20 lg:pt-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }} />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                Premium Virtual Medical Clinic
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white font-black leading-[1.05] mb-6"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              A VIRTUAL CLINIC
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                BUILT FOR YOUR
              </span>
              <br />
              LONGEVITY
            </h1>

            {/* Subheadline */}
            <p
              className="text-white/70 mb-10 max-w-xl"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Physician-guided hormone optimization, medically supervised weight loss,
              and cutting-edge longevity protocols — all from the comfort of your home.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#consultation"
                className="btn-gradient btn-gradient-pulse px-8 py-4 rounded-full text-sm font-bold tracking-wider flex items-center justify-center gap-2 group"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                START YOUR JOURNEY NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="btn-outline-white px-8 py-4 rounded-full text-sm font-bold tracking-wider flex items-center justify-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Play className="w-4 h-4" />
                HOW IT WORKS
              </a>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8 lg:gap-12">
              <div>
                <div
                  className="font-black leading-none"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "2.5rem",
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {count1.toLocaleString()}+
                </div>
                <div
                  className="text-white/50 text-xs font-medium tracking-wider uppercase mt-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Patients Served
                </div>
              </div>
              <div>
                <div
                  className="font-black leading-none"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "2.5rem",
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {count2}%
                </div>
                <div
                  className="text-white/50 text-xs font-medium tracking-wider uppercase mt-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Patient Satisfaction
                </div>
              </div>
              <div>
                <div
                  className="font-black leading-none"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "2.5rem",
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {count3}+
                </div>
                <div
                  className="text-white/50 text-xs font-medium tracking-wider uppercase mt-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Licensed Providers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="relative z-10 py-5 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10">
            {[
              { icon: "🔒", text: "HIPAA Compliant" },
              { icon: "🏥", text: "Board-Certified Physicians" },
              { icon: "📦", text: "Discreet Delivery" },
              { icon: "💊", text: "FDA-Cleared Medications" },
              { icon: "⭐", text: "4.9/5 Patient Rating" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm">{badge.icon}</span>
                <span
                  className="text-white/50 text-xs font-semibold tracking-wider uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker Strip */}
      <div
        className="relative z-10 overflow-hidden py-4 border-t border-white/10"
        style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
      >
        <div className="flex ticker-animate whitespace-nowrap">
          {tickerContent.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-6 text-white font-bold text-xs tracking-[0.15em]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {item}
              <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
