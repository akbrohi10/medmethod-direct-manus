/* =============================================================================
   MaleHero.tsx — Men's Health Hero
   Brand: Dark Navy #0A0F1E, Teal #00C2CB, "ENTER YOUR PRIME."
   ============================================================================= */
import { useState, useRef, useEffect } from "react";

const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const tickerItems = [
  "TESTOSTERONE REPLACEMENT THERAPY",
  "MEDICALLY SUPERVISED WEIGHT LOSS",
  "PEPTIDE THERAPY",
  "SEXUAL HEALTH",
  "HAIR RESTORATION",
  "LONGEVITY MEDICINE",
  "100% VIRTUAL CARE",
];

export default function MaleHero({ onConsultClick }: { onConsultClick: () => void }) {
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
          animateCount(setCount1, 0, 8000, 1500);
          animateCount(setCount2, 0, 97, 1200);
          animateCount(setCount3, 0, 22, 1400);
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
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ paddingTop: "72px", background: "#0A0F1E", minHeight: "100vh" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 65% 40%, rgba(0,194,203,0.08) 0%, rgba(0,153,168,0.04) 40%, transparent 70%)" }} />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(0,194,203,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,203,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8" style={{ background: TEAL }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}>
                  Men's Health · Virtual Care
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black leading-none mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
              >
                <span className="text-white">LOW T.</span>
                <br />
                <span style={{ background: TEAL_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  LOW ENERGY.
                </span>
                <br />
                <span className="text-white">NOT ANYMORE.</span>
              </h1>

              <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", fontFamily: "Montserrat, sans-serif", maxWidth: 480 }}>
                Board-certified physicians. Real lab work. Personalized TRT and weight loss protocols — all from your phone, no waiting rooms.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={onConsultClick}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-wider text-white transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif", background: TEAL_GRADIENT, boxShadow: "0 6px 28px rgba(0,194,203,0.4)" }}
                >
                  SCHEDULE FREE CONSULTATION →
                </button>
                <a href="#quiz"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-wider transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif", color: TEAL, border: `2px solid rgba(0,194,203,0.4)`, background: "transparent" }}
                >
                  CHECK YOUR T-LEVELS →
                </a>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(0,194,203,0.2)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: TEAL }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Montserrat, sans-serif" }}>
                  100% Virtual Care — Available Nationwide
                </span>
              </div>
            </div>

            {/* RIGHT: Video embed */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(0,194,203,0.2)", boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,194,203,0.1)" }}>
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                    title="MedMethod Direct Men — Enter Your Prime"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ background: "rgba(0,194,203,0.08)", borderTop: "1px solid rgba(0,194,203,0.15)" }}>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Montserrat, sans-serif" }}>
                    WATCH OUR STORY
                  </span>
                  <span className="text-xs font-bold" style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}>▶ ENTER YOUR PRIME.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10"
            style={{ borderTop: "1px solid rgba(0,194,203,0.12)" }}>
            {[
              { value: `${count1.toLocaleString()}+`, label: "MEN TREATED" },
              { value: `${count2}%`, label: "SATISFACTION RATE" },
              { value: "4.9★", label: "PATIENT RATING" },
              { value: `${count3}%+`, label: "AVG. TESTOSTERONE INCREASE" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="font-black mb-1" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: TEAL, letterSpacing: "-0.02em" }}>
                  {stat.value}
                </div>
                <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Montserrat, sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden py-3" style={{ background: "rgba(0,194,203,0.08)", borderTop: "1px solid rgba(0,194,203,0.15)", borderBottom: "1px solid rgba(0,194,203,0.15)" }}>
        <div className="flex gap-0 animate-[ticker_30s_linear_infinite]" style={{ width: "max-content" }}>
          {tickerContent.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-6 text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap"
              style={{ color: "rgba(0,194,203,0.6)", fontFamily: "Montserrat, sans-serif" }}>
              {item}
              <span style={{ color: "rgba(0,194,203,0.3)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
