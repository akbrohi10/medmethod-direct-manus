/* =============================================================================
   MaleWhyChoose.tsx — "The System Is Failing Men"
   Mirrors women's WhyChoose exactly:
   Part 1: 3 failure reason cards with stats (low-T narrative)
   Part 2: Dark "The MedMethod Way" panel with 5 feature cards + CTA card
   Brand: Montserrat, Teal #00E5FF, Navy #0A1628, Cream #F5F2EC
   ============================================================================= */
import { AlertTriangle, TrendingDown, Pill, FlaskConical, Stethoscope, CalendarCheck, Smartphone, UserCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import MaleMetabolicQuiz from "./MaleMetabolicQuiz";

const TEAL = "#00E5FF";
const NAVY = "#0A1628";
const TEAL_GRADIENT = "linear-gradient(135deg, #00E5FF 0%, #00B8CC 100%)";

const failureReasons = [
  {
    icon: TrendingDown,
    label: "The Testosterone Decline",
    headline: "Your Biology Is Working Against You",
    body: "After age 30, testosterone drops 1–2% every single year. By 40, most men are operating at a fraction of their peak. The decline is so gradual that most men blame themselves — assuming they're just getting older or not trying hard enough. They push harder at the gym, eat less, sleep more — and still see no results. That's not a willpower problem. That's low T.",
    stat: "40%",
    statLabel: "of men over 40 have clinically low testosterone — most go undiagnosed",
  },
  {
    icon: Pill,
    label: "The Symptom Trap",
    headline: "Treating the Surface, Missing the Root",
    body: "Most primary care doctors check a single testosterone number and call it normal — even when you feel anything but. They prescribe antidepressants for mood, sleep aids for fatigue, and ED medication for performance. None of it addresses the hormonal root cause. You're managing symptoms while the underlying imbalance continues to compound year after year.",
    stat: "1 in 4",
    statLabel: "men with low T are told their levels are 'normal' by a general practitioner",
  },
  {
    icon: AlertTriangle,
    label: "The Missing Foundation",
    headline: "No Plan, No Accountability, No Results",
    body: "Even men who discover their low T often get a testosterone prescription and nothing else — no nutrition protocol, no fitness guidance, no monitoring for estrogen conversion or side effects. Medication without a system is just another shortcut. Without the infrastructure to support your body's transformation, results stall and most men quietly give up.",
    stat: "68%",
    statLabel: "of men who start TRT alone discontinue within 12 months due to lack of support",
  },
];

const medmethodWay = [
  {
    icon: FlaskConical,
    title: "Comprehensive Hormone Panel First",
    body: "Before we prescribe anything, we diagnose everything. A full hormone panel — testosterone, estradiol, thyroid, metabolic markers — maps your biology precisely so your protocol is built on data, not assumptions.",
  },
  {
    icon: Stethoscope,
    title: "A Men's Health Physician Who Knows You",
    body: "You work with the same board-certified men's health physician for your entire program — 6 or 12 months. They review your labs, adjust your protocol, and are clinically accountable to your results. No rotating providers. No starting over.",
  },
  {
    icon: CalendarCheck,
    title: "Bi-Weekly Wellness Advisor Check-Ins",
    body: "Every two weeks, your dedicated Wellness Advisor meets with you to track your energy, strength, and body composition — and adjusts your plan in real time before small setbacks become full stops.",
  },
  {
    icon: Smartphone,
    title: "Custom Fitness & Nutrition App",
    body: "Your program lives in a personalized app — a strength plan built for your hormonal profile, a nutrition protocol designed for your metabolism, and daily tracking that adapts as your levels optimize.",
  },
  {
    icon: UserCheck,
    title: "Responsible Hormone Management",
    body: "TRT is a clinical tool, not a subscription product. We monitor estrogen conversion, manage side effects proactively, and combine medication with lifestyle infrastructure. Our goal is a body that performs at its peak — sustainably.",
  },
];

export default function MaleWhyChoose({ onConsultClick }: { onConsultClick: () => void }) {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <section className="py-16 lg:py-24" style={{ background: "#F5F2EC", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* ── Part 1: Why Men Fail ── */}
        <div className="mb-20">
          <div className="mb-10">
            <span className="block mb-3 text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>
              The Hard Truth
            </span>
            <h2
              className="font-black leading-tight mb-4"
              style={{ color: NAVY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              THE SYSTEM IS{" "}
              <span
                style={{
                  backgroundImage: TEAL_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FAILING MEN
              </span>
            </h2>
            <p className="max-w-2xl" style={{ color: "rgba(10,22,40,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              It's not a lack of discipline. It's a lack of the right diagnosis. Here are the three patterns that keep men stuck — and why the standard options don't solve them.
            </p>
            <button
              onClick={() => setQuizOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider border-2 transition-all hover:bg-white"
              style={{ borderColor: TEAL, color: TEAL }}
            >
              CHECK YOUR TESTOSTERONE SCORE →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {failureReasons.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border bg-white p-6 flex flex-col"
                  style={{ borderColor: "rgba(0,229,255,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
                >
                  {/* Icon + label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,229,255,0.1)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: TEAL }} />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: TEAL }}>
                      {item.label}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-black mb-3" style={{ color: NAVY, fontSize: "1rem", lineHeight: 1.3 }}>
                    {item.headline}
                  </h3>

                  {/* Body */}
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(10,22,40,0.55)" }}>
                    {item.body}
                  </p>

                  {/* Stat */}
                  <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(0,229,255,0.15)" }}>
                    <div
                      className="font-black"
                      style={{
                        fontSize: "1.6rem",
                        backgroundImage: TEAL_GRADIENT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.stat}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(10,22,40,0.4)" }}>
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
          style={{ background: "linear-gradient(135deg, #060E1C 0%, #0A1628 100%)" }}
        >
          <div className="mb-10">
            <span className="block mb-3 text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>
              Our Difference
            </span>
            <h2
              className="font-black text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              THE MEDMETHOD{" "}
              <span
                style={{
                  backgroundImage: TEAL_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                WAY
              </span>
            </h2>
            <p className="max-w-2xl" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              We built MedMethod Direct because the existing options were failing men. Here's exactly what we do differently — and why it works.
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
                    border: "1px solid rgba(0,229,255,0.15)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,229,255,0.12)", border: "1px solid rgba(0,229,255,0.3)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: TEAL }} />
                    </div>
                    <h3 className="font-bold text-white" style={{ fontSize: "0.9rem" }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item.body}
                  </p>
                </div>
              );
            })}

            {/* CTA card */}
            <div
              className="rounded-2xl p-5 flex flex-col justify-between"
              style={{ background: TEAL_GRADIENT }}
            >
              <p className="text-white font-bold text-sm leading-snug mb-6">
                "We don't just treat symptoms. We restore the hormonal foundation your body needs to perform — and keep performing."
              </p>
              <button
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-5 py-3 rounded-full self-start hover:bg-white/90 transition-colors"
                style={{ color: TEAL }}
              >
                START YOUR JOURNEY <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
      <MaleMetabolicQuiz onConsultClick={onConsultClick} open={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
  );
}
