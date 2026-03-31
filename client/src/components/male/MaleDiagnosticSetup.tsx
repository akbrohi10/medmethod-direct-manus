/* =============================================================================
   MaleDiagnosticSetup.tsx — MedMethod Direct Men
   Mirrors DiagnosticSetup.tsx exactly — same layout, same expand/collapse,
   same item list + price panel structure.
   Colors: pink → teal, purple → teal-dark, white bg → dark navy
   ============================================================================= */
import { useState } from "react";
import { ChevronDown, FlaskConical, UserRound, Scale, Smartphone, Check } from "lucide-react";
import MaleMetabolicQuiz from "./MaleMetabolicQuiz";

const TEAL = "#00E5FF";
const TEAL_GRADIENT = "linear-gradient(135deg, #00E5FF, #0099AA)";

const items = [
  {
    icon: FlaskConical,
    title: "Comprehensive Hormone & Metabolic Panel",
    desc: "Full blood lab work: testosterone, estradiol, SHBG, LH, FSH, thyroid, PSA, CBC, lipids & more.",
    value: "$350+",
  },
  {
    icon: UserRound,
    title: "Dedicated Physician Consultation",
    desc: "Private strategy session with a board-certified men's health doctor to build your protocol.",
    value: "$250+",
  },
  {
    icon: Scale,
    title: "MedMethod Smart Scale + FedEx Shipping",
    desc: "Sync-enabled hardware for real-time body composition monitoring.",
    value: "$100+",
  },
  {
    icon: Smartphone,
    title: "Fitness & Nutrition App Set Up",
    desc: "Custom movement & nutrition command center tailored to your protocol.",
    value: "$50+",
  },
];

export default function MaleDiagnosticSetup({ onConsultClick }: { onConsultClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section
      style={{ background: "#F5F2EC", fontFamily: "Montserrat, sans-serif" }}
      className="px-4 pt-10 pb-0"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Compact banner row ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 transition-all"
          style={{
            background: "#0A1628",
            border: `1.5px solid rgba(0,229,255,0.25)`,
            cursor: "pointer",
            textAlign: "left",
          }}
          aria-expanded={open}
        >
          {/* Left: step pill + label */}
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: TEAL_GRADIENT }}
            >
              Step 1
            </span>
            <div>
              <span
                className="text-white font-black text-base block leading-tight"
                style={{ letterSpacing: "-0.01em" }}
              >
                $449 Clinical Diagnostic &amp; Setup Fee
              </span>
              <span className="text-gray-400 text-xs font-medium">
                One-time investment · $750+ real-world value included
              </span>
            </div>
          </div>

          {/* Right: label + chevron */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span
              className="text-xs font-bold tracking-wide hidden sm:block"
              style={{ color: TEAL }}
            >
              See what's included
            </span>
            <ChevronDown
              className="w-5 h-5 transition-transform duration-300"
              style={{
                color: TEAL,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </button>

        {/* ── Expandable detail panel ── */}
        <div
          style={{
            maxHeight: open ? "900px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          <div
            className="rounded-b-2xl mt-0 flex flex-col md:flex-row overflow-hidden"
            style={{ border: `1.5px solid rgba(0,229,255,0.15)`, borderTop: "none", background: "#0A1628" }}
          >
            {/* Left: item list */}
            <div className="flex-1 p-7">
              <p className="text-xs font-extrabold tracking-widest uppercase mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                What's Included
              </p>
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 mb-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(0,229,255,0.15)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: TEAL }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{item.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                    </div>
                    <div className="text-sm font-bold flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {item.value}
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div
                className="flex items-center justify-between pt-4 mt-2"
                style={{ borderTop: "1.5px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Total Real-World Value
                </span>
                <span
                  className="text-xl font-black"
                  style={{
                    background: TEAL_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  $750+
                </span>
              </div>
            </div>

            {/* Right: price summary + CTA */}
            <div
              className="md:w-64 flex-shrink-0 flex flex-col justify-between p-7 border-t border-t-[rgba(0,229,255,0.15)] md:border-t-0 md:border-l md:border-l-[rgba(0,229,255,0.15)]"
              style={{ background: "#071020" }}
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Your Setup Fee
                </p>
                <div className="flex items-start gap-1 mb-1">
                  <span className="text-white font-black text-xl mt-1">$</span>
                  <span className="font-black text-white leading-none text-5xl md:text-6xl">449</span>
                </div>
                <p
                  className="font-bold text-xs mb-5"
                  style={{
                    background: TEAL_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  One-Time Diagnostic Investment
                </p>
                <ul className="space-y-2">
                  {[
                    "Hormone & Metabolic Panel",
                    "Physician Consultation",
                    "Smart Scale + FedEx Shipping",
                    "Fitness & Nutrition App",
                  ].map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                      <span className="text-gray-300 text-xs">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                onClick={onConsultClick}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 rounded-full font-extrabold text-xs text-white transition-opacity hover:opacity-90 text-center leading-none cursor-pointer"
                style={{
                  background: TEAL_GRADIENT,
                  letterSpacing: "0.08em",
                  boxShadow: "0 4px 14px rgba(0,229,255,0.35)",
                }}
              >
                <span>FREE CONSULTATION</span>
                <span style={{ fontSize: "0.9em", lineHeight: 1 }}>→</span>
              </a>
              <p className="text-gray-500 text-center mt-2" style={{ fontSize: "0.6rem", letterSpacing: "0.04em" }}>
                *MEDICATION PRESCRIBED SEPARATELY AFTER BLOODWORK REVIEW.
              </p>
              <button
                onClick={() => setQuizOpen(true)}
                className="mt-3 w-full text-center text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: TEAL, fontFamily: "Montserrat, sans-serif", background: "none", border: "none", cursor: "pointer" }}
              >
                Not sure if you qualify? Check your T-levels →
              </button>
            </div>
          </div>
        </div>

      </div>
      <MaleMetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onConsultClick={onConsultClick} />
    </section>
  );
}
