/* =============================================================================
   Testimonials — MedMethod Direct
   Clinical Noir Design | Women 40+ patient stories
   ============================================================================= */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    age: "Age 47",
    stars: 5,
    text: "I was waking up at 3 AM every single night, drenched in sweat, and my doctor kept telling me my labs were 'normal.' MedMethod Direct did a comprehensive panel and found exactly what was off. Within 6 weeks of my personalized protocol, I was sleeping through the night for the first time in two years. I feel like myself again.",
    treatment: "Hormone Therapy",
  },
  {
    name: "Jennifer L.",
    location: "Denver, CO",
    age: "Age 52",
    stars: 5,
    text: "I'd been trying to lose the same 30 pounds for three years. Diet, exercise, willpower — nothing worked. My Wellness Advisor explained that my hormones were working against me, not my effort. The medically supervised weight loss program combined with my custom nutrition plan has me down 28 lbs in 4 months. The bi-weekly check-ins are what make the difference — I'm never alone in this.",
    treatment: "Medical Weight Loss",
  },
  {
    name: "Michelle R.",
    location: "Chicago, IL",
    age: "Age 44",
    stars: 5,
    text: "The brain fog was the worst part. I'm an executive and I couldn't remember words mid-sentence. I was terrified something was seriously wrong. Turns out my hormones were completely out of balance. My MedMethod doctor took the time to actually explain everything — the labs, the plan, the timeline. Three months in and my clarity is back. My team has noticed. My family has noticed. I've noticed.",
    treatment: "Perimenopause Care",
  },
  {
    name: "Karen T.",
    location: "Miami, FL",
    age: "Age 49",
    stars: 5,
    text: "What sets MedMethod apart is that they treat you like a whole person, not a symptom. I have the same doctor every visit. My Wellness Advisor knows my goals, my struggles, my schedule. The custom fitness plan they built for me actually fits my life. I've lost 22 lbs, my mood swings are gone, and I have energy I haven't felt since my 30s.",
    treatment: "Longevity Protocol",
  },
  {
    name: "Patricia W.",
    location: "Seattle, WA",
    age: "Age 55",
    stars: 5,
    text: "I tried another telehealth service before this one. They shipped me a box and I never heard from them again. MedMethod Direct is completely different. My doctor checks in every two weeks, my Wellness Advisor is always available, and my plan has been adjusted three times as I've progressed. This is what real medical care looks like.",
    treatment: "Comprehensive Program",
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
            REAL WOMEN
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
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              "{t.text}"
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div
                  className="text-white font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  — {t.name}, <span className="text-white/50 font-normal">{t.age}</span>
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
