/* =============================================================================
   Testimonials — Clinical Noir Design
   Dark background carousel with star ratings and patient quotes
   ============================================================================= */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "James R.",
    location: "Austin, TX",
    stars: 5,
    text: "I was skeptical about telehealth for something this personal, but MedMethod Direct completely changed my mind. My provider took the time to actually listen, reviewed my labs thoroughly, and within a week I had a personalized protocol. Three months in and I feel like I'm 35 again.",
    treatment: "Hormone Therapy",
  },
  {
    name: "Michael T.",
    location: "Denver, CO",
    stars: 5,
    text: "The convenience alone is worth it — no waiting rooms, no commuting, just a real doctor who knows what they're doing. My testosterone levels were optimized within 8 weeks and the difference in energy and focus is night and day. Highly recommend to any man over 40.",
    treatment: "Testosterone Optimization",
  },
  {
    name: "David K.",
    location: "Miami, FL",
    stars: 5,
    text: "I've tried every diet and exercise program out there. Nothing worked until I started the medically supervised weight loss program here. Down 34 lbs in 4 months and my metabolic markers have completely transformed. The ongoing support from my care team makes all the difference.",
    treatment: "Medical Weight Loss",
  },
  {
    name: "Robert W.",
    location: "Chicago, IL",
    stars: 5,
    text: "What sets MedMethod apart is the personalization. They didn't just hand me a generic protocol — they analyzed my specific labs, symptoms, and lifestyle. The peptide therapy combined with hormone optimization has been life-changing. My sleep, recovery, and energy are all dramatically improved.",
    treatment: "Peptide Therapy",
  },
  {
    name: "Carlos M.",
    location: "Los Angeles, CA",
    stars: 5,
    text: "From the first consultation to ongoing monitoring, the experience has been exceptional. My care coordinator checks in regularly, my provider is always available for questions, and the results speak for themselves. This is what modern medicine should look like.",
    treatment: "Longevity Protocol",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="bg-[#0d0d0d] py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="section-label block mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Patient Stories
          </span>
          <h2
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            REAL RESULTS FROM
            <br />
            REAL PATIENTS
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-[#1a1a1a] rounded-3xl p-8 lg:p-12 border border-white/5">
            {/* Gradient quote mark */}
            <div
              className="absolute top-6 left-8 font-black leading-none select-none"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "6rem",
                lineHeight: 1,
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: 0.3,
              }}
            >
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} style={{ color: "#E8339E", fontSize: "1.2rem" }}>★</span>
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="text-white/85 leading-relaxed mb-8 relative z-10"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              "{t.text}"
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-white font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  — {t.name}
                </div>
                <div
                  className="text-white/40 text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t.location}
                </div>
              </div>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
                style={{
                  background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E33 100%)",
                  border: "1px solid rgba(232,51,158,0.3)",
                  color: "#E8339E",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {t.treatment}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? "2rem" : "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    background: i === current
                      ? "linear-gradient(90deg, #E8339E, #7A1E7E)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
