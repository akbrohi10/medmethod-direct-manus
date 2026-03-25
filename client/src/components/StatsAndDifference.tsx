/* =============================================================================
   Empathy + Stats + The MedMethod Difference — MedMethod Direct
   Clinical Noir Design | Women 40+ focused
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
  { value: 10000, suffix: "+", label: "Women Served Nationwide", sub: "and growing every month" },
  { value: 98, suffix: "%", label: "Patient Satisfaction Rate", sub: "based on verified reviews" },
  { value: 50, suffix: "+", label: "Licensed Medical Providers", sub: "board-certified specialists" },
];

const differences = [
  {
    icon: Zap,
    title: "DOCTOR-LED, NOT BOX-SHIPPED",
    body: "You deserve more than an automated website that ships a box and disappears. Every MedMethod Direct patient works with a real, board-certified physician who knows your name, your labs, and your goals.",
  },
  {
    icon: Stethoscope,
    title: "BI-WEEKLY CHECK-INS, ALWAYS",
    body: "We meet with you virtually every two weeks — weigh-in, progress tracking, and personalized recommendations. You'll work with the same doctor and the same dedicated Wellness Advisor throughout your entire journey.",
  },
  {
    icon: ShieldCheck,
    title: "COMPREHENSIVE, NOT COOKIE-CUTTER",
    body: "We start with comprehensive labs and a deep-dive diagnostic. Your plan includes a custom fitness program, personalized nutrition protocol, and ongoing adjustments — not a one-size-fits-all prescription.",
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
      {/* Empathy Section — "We See You" */}
      <section className="bg-[#111111] py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="section-label block mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                We Understand
              </span>
              <h2
                className="font-black text-white leading-tight mb-6"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                THE OLD RULES DON'T
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  APPLY ANYMORE.
                </span>
              </h2>
              <p
                className="text-white/70 leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
              >
                If you're a woman over 40, you've probably noticed it. You're waking up at 3:00 AM with night sweats. Struggling through midday brain fog. Facing unpredictable mood swings. Dealing with a hormonal belly that willpower alone cannot fix.
              </p>
              <p
                className="text-white/70 leading-relaxed mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
              >
                It's exhausting to feel like your own biology is working against you — leaving you with no clear path forward. You deserve better. You deserve a doctor who actually listens, labs that reveal the truth, and a plan built around <em>your</em> biology.
              </p>
              <a
                href="#consultation"
                className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                START YOUR JOURNEY
              </a>
            </div>

            {/* Symptom cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { symptom: "Night Sweats", detail: "Waking at 3 AM, drenched and exhausted" },
                { symptom: "Brain Fog", detail: "Struggling to focus, forgetting words mid-sentence" },
                { symptom: "Mood Swings", detail: "Unpredictable emotions that feel out of control" },
                { symptom: "Hormonal Weight", detail: "Belly fat that diet and exercise won't budge" },
                { symptom: "Low Energy", detail: "Exhausted no matter how much you sleep" },
                { symptom: "Low Libido", detail: "Loss of desire and intimacy that affects relationships" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#E8339E]/30 transition-colors"
                >
                  <div
                    className="font-bold text-white mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem" }}
                  >
                    {item.symptom}
                  </div>
                  <div
                    className="text-white/40 leading-snug"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
                  >
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              {["Forbes", "Healthline", "WebMD", "Women's Health", "Everyday Health"].map((pub) => (
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
