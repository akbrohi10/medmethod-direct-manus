/* =============================================================================
   MaleHero.tsx — Men's Health Hero
   Mirrors women's Hero.tsx exactly — same layout, same structure, same stat positions
   Colors: white background → dark navy bg, pink gradient → teal gradient
   ============================================================================= */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import MaleMetabolicQuiz from "./MaleMetabolicQuiz";

const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

const TEAL_GRADIENT = "linear-gradient(135deg, #00E5FF 0%, #00B8CC 50%, #0099AA 100%)";
const TEAL = "#00E5FF";

const tickerItems = [
  "TESTOSTERONE REPLACEMENT THERAPY",
  "MEDICALLY SUPERVISED WEIGHT LOSS",
  "PEPTIDE THERAPY",
  "SEXUAL HEALTH & ED",
  "HAIR RESTORATION",
  "BI-WEEKLY PHYSICIAN CHECK-INS",
  "DEDICATED WELLNESS ADVISOR",
  "COMPREHENSIVE HORMONE DIAGNOSTICS",
];

export default function MaleHero({ onConsultClick }: { onConsultClick: () => void }) {
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
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
    <section className="relative flex flex-col overflow-hidden" style={{ paddingTop: "80px", background: "#0A0F1E" }}>
      {/* Subtle background texture — mirrors women's radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,229,255,0.07) 0%, rgba(0,153,168,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* LEFT: Text + CTAs + Stats */}
            <div>
              {/* Headline — mirrors women's exactly */}
              <h1
                className="font-black leading-[1.05] mb-8"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(2rem, 3.6vw, 3.5rem)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                STRUGGLING WITH
                <br />
                <span
                  style={{
                    backgroundImage: TEAL_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  WEIGHT LOSS
                </span>
                <br />
                OR{" "}
                <span style={{ color: "#ffffff" }}>LOW </span><span
                  style={{
                    backgroundImage: TEAL_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  TESTOSTERONE
                </span>
                ?
              </h1>

              {/* CTAs — mirrors women's button layout */}
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <a
                  onClick={onConsultClick}
                  className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group cursor-pointer text-white"
                  style={{ fontFamily: "Montserrat, sans-serif", background: TEAL_GRADIENT, boxShadow: "0 6px 24px rgba(0,229,255,0.4)" }}
                >
                  SCHEDULE FREE CONSULTATION
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

              </div>

              {/* 100% Virtual Care tagline — mirrors women's */}
              <p
                className="flex items-center gap-2 font-semibold mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", color: TEAL, fontSize: "1rem" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradM)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradM" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#00E5FF"/><stop offset="1" stopColor="#0099AA"/></linearGradient></defs>
                </svg>
                100% Virtual Care
              </p>

              {/* Stats — same position and layout as women's */}
              <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      backgroundImage: TEAL_GRADIENT,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    8K+
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.45)" }}>
                    Men Treated
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      backgroundImage: TEAL_GRADIENT,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {count2}%
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.45)" }}>
                    Satisfaction Rate
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      backgroundImage: TEAL_GRADIENT,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    4.9★
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.45)" }}>
                    Patient Rating
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      backgroundImage: TEAL_GRADIENT,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {count3}%+
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.45)" }}>
                    Avg. T Increase
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: YouTube Video — mirrors women's exactly */}
            <div className="relative lg:-ml-6">
              {/* Decorative glow behind video */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                style={{ background: TEAL_GRADIENT }}
              />

              {/* Video Container */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              >
                {!videoPlaying ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                      alt="Watch our story"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
                      }}
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Play button */}
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                      aria-label="Play video"
                    >
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                        style={{ background: TEAL_GRADIENT }}
                      >
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      </div>
                      <span
                        className="text-white font-bold text-sm tracking-wider uppercase"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Watch Our Story
                      </span>
                    </button>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="MedMethod Direct Men — Enter Your Prime"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video caption */}
              <p
                className="text-center text-xs mt-3 tracking-wide"
                style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.35)" }}
              >
                Discover the MedMethod Direct difference
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Gradient Divider — teal version of women's pink divider */}
      <div
        className="w-full"
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #00E5FF 0%, #00B8CC 50%, #0099AA 100%)",
        }}
      />

      {/* Hormone Quiz Modal */}
      <MaleMetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onConsultClick={onConsultClick} />
    </section>
  );
}
