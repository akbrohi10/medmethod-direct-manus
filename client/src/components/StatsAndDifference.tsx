/* =============================================================================
   Stats + The MedMethod Difference — Clinical Noir Design
   Stats cards on white, then dark section with 3 feature columns
   ============================================================================= */
import { useEffect, useRef, useState } from "react";
import { Zap, Stethoscope, ShieldCheck } from "lucide-react";

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const update = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const stats = [
  { value: 10000, suffix: "+", label: "Patients Served Nationwide", sub: "and growing every month" },
  { value: 98, suffix: "%", label: "Patient Satisfaction Rate", sub: "based on verified reviews" },
  { value: 50, suffix: "+", label: "Licensed Medical Providers", sub: "board-certified specialists" },
];

const differences = [
  {
    icon: Zap,
    title: "FAST, CONVENIENT CARE",
    body: "Virtual consultations available same-day. No waiting rooms, no commutes — just expert care delivered directly to you. Get answers and begin treatment from the comfort of your home.",
  },
  {
    icon: Stethoscope,
    title: "SCIENCE-BASED PROTOCOLS",
    body: "Every treatment plan is grounded in the latest clinical research and guided by board-certified physicians. No guesswork — just evidence-based medicine optimized for your biology.",
  },
  {
    icon: ShieldCheck,
    title: "PERSONALIZED TO YOU",
    body: "Your treatment is never one-size-fits-all. We analyze your labs, symptoms, and goals to build a protocol uniquely yours — then monitor and adjust as you progress.",
  },
];

function StatCard({ value, suffix, label, sub }: { value: number; suffix: string; label: string; sub: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="bg-[#f8f8f8] rounded-2xl p-8 lg:p-10">
      <div
        className="font-black leading-none mb-2"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
          background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div
        className="font-bold text-[#111111] mb-1"
        style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
      >
        {label}
      </div>
      <div
        className="text-gray-500 text-sm"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {sub}
      </div>
    </div>
  );
}

export default function StatsAndDifference() {
  return (
    <>
      {/* Stats Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          {/* Press logos */}
          <div className="text-center mb-10">
            <p
              className="text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              As Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-40">
              {["Forbes", "Healthline", "WebMD", "Men's Health", "Everyday Health"].map((pub) => (
                <span
                  key={pub}
                  className="text-[#111111] font-black text-lg tracking-tight"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {pub}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* The MedMethod Difference */}
      <section className="bg-[#111111] py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Why Choose Us
            </span>
            <h2
              className="font-black text-white leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              THE MEDMETHOD DIFFERENCE
            </h2>
            <div
              className="mx-auto mt-4 h-0.5 w-24"
              style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {differences.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center lg:text-left">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                    style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E44 100%)", border: "1px solid rgba(232,51,158,0.3)" }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{ color: "#E8339E" }}
                    />
                  </div>
                  <h3
                    className="text-white font-black mb-4 tracking-wide"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/60 leading-relaxed"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                  >
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
