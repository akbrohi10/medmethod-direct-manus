/* =============================================================================
   Why Choose MedMethod — Redesigned
   Two-part section: "Why Most People Fail" + "The MedMethod Way"
   Light background, dark text, pink accent
   ============================================================================= */
import { AlertTriangle, TrendingDown, Pill, FlaskConical, UserCheck, CalendarCheck, Smartphone, Stethoscope, ArrowRight } from "lucide-react";
import { useState } from "react";
import MetabolicQuiz from "./MetabolicQuiz";

const failureReasons = [
  {
    icon: Pill,
    label: "The Pill Mill Trap",
    headline: "Medication Without Medicine",
    body: "Online weight-loss clinics ship GLP-1s to your door with zero lab work, no doctor relationship, and no lifestyle support. The scale moves — until it doesn't. Without addressing the root hormonal and metabolic causes, the weight returns the moment you stop. You paid for a shortcut that led you back to the start.",
    stat: "95%",
    statLabel: "of pill-mill patients regain weight within 2 years",
  },
  {
    icon: TrendingDown,
    label: "The Fitness & Diet Cycle",
    headline: "Motivation Runs Out. Accountability Doesn't.",
    body: "You start a new program with real intention. But results take weeks. No one is measuring your progress, adjusting your plan, or catching you when discouragement sets in. By week 4, the old habits creep back — not because you failed, but because the program failed you. Willpower was never the problem. Infrastructure was.",
    stat: "80%",
    statLabel: "of people quit a new fitness or nutrition program within 5 weeks",
  },
  {
    icon: AlertTriangle,
    label: "The Missing Foundation",
    headline: "Treating Symptoms, Not Biology",
    body: "Hormonal imbalances, thyroid dysfunction, insulin resistance, and cortisol dysregulation silently sabotage every diet and workout plan. Without a comprehensive lab panel and a physician who understands women's metabolic health, you're building on sand. No program can outwork an undiagnosed hormonal issue.",
    stat: "1 in 3",
    statLabel: "women over 40 have an undiagnosed hormonal or metabolic condition",
  },
];

const medmethodWay = [
  {
    icon: FlaskConical,
    title: "Accurate Medicine First",
    body: "Before we prescribe anything, we diagnose everything. Comprehensive bloodwork maps your hormones, metabolism, thyroid, and insulin levels — so your protocol is built on your biology, not a best guess.",
  },
  {
    icon: Stethoscope,
    title: "A Doctor Who Actually Knows You",
    body: "You work with the same board-certified physician for your entire program — 6 or 12 months. They review your labs, adjust your protocol, and are clinically accountable to your results. No rotating providers. No starting over.",
  },
  {
    icon: CalendarCheck,
    title: "Bi-Weekly Performance Coach Check-Ins",
    body: "Every two weeks, your dedicated Performance Coach meets with you for a weigh-in, body measurements, and a progress review. They catch discouragement early, adjust your plan in real time, and keep you moving forward — even when motivation fades.",
  },
  {
    icon: Smartphone,
    title: "Custom Fitness & Nutrition App",
    body: "Your program lives in a personalized app — a fitness plan built for your body, a nutrition protocol designed for your metabolism, and daily tracking that adapts as you progress. Not a generic PDF. A living system.",
  },
  {
    icon: UserCheck,
    title: "Responsible Medical Management",
    body: "Medication is a clinical tool, not a subscription product. We use it precisely, monitor it carefully, and combine it with lifestyle infrastructure. Our goal is a body that works without dependency — long-term transformation, not a temporary fix.",
  },
];

export default function WhyChoose({ onConsultClick }: { onConsultClick: () => void }) {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* ── Part 1: Why Most People Fail ── */}
        <div className="mb-20">
          <div className="mb-10">
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Hard Truth
            </span>
            <h2
              className="font-black text-[#111111] leading-tight mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              WHY MOST PEOPLE{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FAIL
              </span>
            </h2>
            <p
              className="text-gray-500 max-w-2xl"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", lineHeight: 1.7 }}
            >
              It's not a lack of willpower. It's a lack of the right system. Here are the three patterns that keep women stuck — and why the standard options don't solve them.
            </p>
            <button
              onClick={() => setQuizOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wider border-2 transition-all hover:bg-gray-50"
              style={{ fontFamily: "Montserrat, sans-serif", borderColor: "#E8339E", color: "#E8339E" }}
            >
              CHECK YOUR METABOLIC SCORE →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {failureReasons.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-[#FAFAFA] p-6 flex flex-col"
                  style={{
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1.5px solid #E8339E",
                  }}
                >
                  {/* Icon + label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(232,51,158,0.08)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className="font-black text-[#111111] mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", lineHeight: 1.3 }}
                  >
                    {item.headline}
                  </h3>

                  {/* Body */}
                  <p
                    className="text-gray-600 text-sm leading-relaxed flex-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.body}
                  </p>

                  {/* Stat */}
                  <div
                    className="mt-5 pt-4 border-t border-gray-100"
                  >
                    <div
                      className="font-black"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "1.6rem",
                        backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.stat}
                    </div>
                    <div
                      className="text-gray-500 text-sm mt-0.5"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.statLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Part 2: The MedMethod Way ── */}
        <div
          className="rounded-3xl p-8 lg:p-12"
          style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a14 100%)" }}
        >
          <div className="mb-10">
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Our Difference
            </span>
            <h2
              className="font-black text-white leading-tight mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              THE MEDMETHOD{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                WAY
              </span>
            </h2>
            <p
              className="text-white/50 max-w-2xl"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", lineHeight: 1.7 }}
            >
              We built MedMethod Direct because the existing options were failing women. Here's exactly what we do differently — and why it works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {medmethodWay.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E33 100%)", border: "1px solid rgba(232,51,158,0.3)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                    <h3
                      className="font-bold text-white"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p
                    className="text-white/50 text-sm leading-relaxed"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.body}
                  </p>
                </div>
              );
            })}

            {/* CTA card */}
            <div
              className="rounded-2xl p-5 flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              }}
            >
              <p
                className="text-white font-bold text-sm leading-snug mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                "We don't just treat symptoms. We build the foundation your body needs to transform — and stay transformed."
              </p>
              <a
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 bg-white text-[#E8339E] font-bold text-sm px-5 py-3 rounded-full self-start hover:bg-white/90 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                START YOUR JOURNEY <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
      <MetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
  );
}
