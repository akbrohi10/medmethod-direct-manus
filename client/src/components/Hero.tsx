/* =============================================================================
   Hero Section — MedMethod Direct
   Light/white background, two-column layout: headline + CTAs left, YouTube right
   Subtext under headline removed per design update
   ============================================================================= */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

// Replace with actual YouTube video ID when available
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

const tickerItems = [
  "HORMONE OPTIMIZATION",
  "MEDICALLY SUPERVISED WEIGHT LOSS",
  "PERIMENOPAUSE & MENOPAUSE CARE",
  "PERSONALIZED NUTRITION PLANS",
  "CUSTOM FITNESS PROGRAMS",
  "BI-WEEKLY DOCTOR CHECK-INS",
  "DEDICATED WELLNESS ADVISOR",
  "COMPREHENSIVE LAB DIAGNOSTICS",
];

export default function Hero() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

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

  const tickerContent = [...tickerItems, ...tickerItems];

  return (
    <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* LEFT: Text + CTAs + Stats */}
            <div>
              {/* Label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }} />
                <span
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                >
                  For Women 40 &amp; Beyond
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black leading-[1.05] mb-8"
                style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(2rem, 3.6vw, 3.5rem)",
                letterSpacing: "-0.02em",
                color: "#111111",
                }}
              >
              STRUGGLING WITH
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                WEIGHT LOSS
              </span>
              <br />
              OR{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MENOPAUSE
              </span>
              ?
              </h1>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <a
                  href="#consultation"
                  className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  SCHEDULE FREE CONSULTATION
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

              </div>

              {/* 100% Virtual Care tagline */}
              <p
                className="flex items-center gap-2 font-semibold mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vcGrad)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care
              </p>

              {/* Stats */}
              <div ref={statsRef} className="flex flex-wrap gap-5 lg:gap-7">
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    10K+
                  </div>
                  <div
                    className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Women Served
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {count2}%
                  </div>
                  <div
                    className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Satisfaction Rate
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    4.9★
                  </div>
                  <div
                    className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Patient Rating
                  </div>
                </div>
                <div>
                  <div
                    className="font-black leading-none"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "1.7rem",
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {count3}%+
                  </div>
                  <div
                    className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Avg. Weight Loss
                  </div>
                </div>
              </div>




            </div>

            {/* RIGHT: YouTube Video */}
            <div className="relative lg:-ml-6">

              {/* Decorative glow behind video */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
              />

              {/* Video Container */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              >
                {!videoPlaying ? (
                  /* Thumbnail / Play overlay */
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
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Play button */}
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                      aria-label="Play video"
                    >
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                        style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
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
                  /* Actual YouTube embed */
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="MedMethod Direct — Your Path to Longevity"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video caption */}
              <p
                className="text-center text-gray-400 text-xs mt-3 tracking-wide"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Discover the MedMethod Direct difference
              </p>
            </div>

          </div>
        </div>
      </div>


      {/* Gradient Divider */}
      <div
        className="w-full"
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
        }}
      />
    </section>
  );
}
