/* =============================================================================
   DiagnosticSetup.tsx — MedMethod Direct
   Compact banner: "Step 1 · $449 Clinical Diagnostic & Setup Fee"
   Click the arrow to expand a clean detail panel showing what's included.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { useState } from "react";
import { ChevronDown, FlaskConical, UserRound, Scale, Smartphone, Check } from "lucide-react";
import MetabolicQuiz from "./MetabolicQuiz";

const items = [
  {
    icon: FlaskConical,
    title: "Comprehensive Diagnostic Bloodwork",
    desc: "Full professional blood lab work for hormone & metabolic health.",
    value: "$350+",
  },
  {
    icon: UserRound,
    title: "Dedicated Doctor Consultation",
    desc: "Private strategy session to build your clinical protocol.",
    value: "$250+",
  },
  {
    icon: Scale,
    title: "MedMethod Smart Scale + FedEx Shipping",
    desc: "Sync-enabled hardware for real-time body monitoring.",
    value: "$100+",
  },
  {
    icon: Smartphone,
    title: "Fitness & Nutrition App Set Up",
    desc: "Custom movement & nutrition command center.",
    value: "$50+",
  },
];

export default function DiagnosticSetup({ onConsultClick }: { onConsultClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
      className="px-4 pt-4 pb-0"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Compact banner row ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 transition-all"
          style={{
            background: "#0D0D1A",
            border: "1.5px solid rgba(232,51,158,0.25)",
            cursor: "pointer",
            textAlign: "left",
          }}
          aria-expanded={open}
        >
          {/* Left: step pill + label */}
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
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

          {/* Right: price + chevron */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span
              className="text-xs font-bold tracking-wide hidden sm:block"
              style={{ color: "#E8339E" }}
            >
              See what's included
            </span>
            <ChevronDown
              className="w-5 h-5 transition-transform duration-300"
              style={{
                color: "#E8339E",
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
            style={{ border: "1.5px solid #E2E2EA", borderTop: "none", background: "#fff" }}
          >
            {/* Left: item list */}
            <div className="flex-1 p-7">
              <p
                className="text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-5"
              >
                What's Included
              </p>
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 mb-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(232,51,158,0.10), rgba(122,30,126,0.10))",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-[#111]">{item.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                    <div
                      className="text-sm font-bold flex-shrink-0"
                      style={{ color: "#BBBBC8" }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div
                className="flex items-center justify-between pt-4 mt-2"
                style={{ borderTop: "1.5px solid #EBEBF0" }}
              >
                <span className="text-sm font-extrabold uppercase tracking-wider text-[#111]">
                  Total Real-World Value
                </span>
                <span
                  className="text-xl font-black"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
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
              className="md:w-64 flex-shrink-0 flex flex-col justify-between p-7 rounded-b-2xl md:rounded-b-none md:rounded-br-2xl"
              style={{ background: "#0D0D1A", borderTop: "1px solid rgba(255,255,255,0.10)" }}
            >
              <div>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">
                  Your Setup Fee
                </p>
                <div className="flex items-start gap-1 mb-1">
                  <span className="text-white font-black text-lg mt-1">$</span>
                  <span
                    className="font-black text-white leading-none text-5xl md:text-6xl"
                  >
                    449
                  </span>
                </div>
                <p
                  className="font-bold text-xs mb-5"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E, #B040C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  One-Time Diagnostic Investment
                </p>
                <ul className="space-y-2">
                  {[
                    "Diagnostic Bloodwork",
                    "Doctor Consultation",
                    "Smart Scale + FedEx Shipping",
                    "Fitness & Nutrition App",
                  ].map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#E8339E" }} />
                      <span className="text-gray-300 text-xs">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                onClick={onConsultClick}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 rounded-full font-extrabold text-xs text-white transition-opacity hover:opacity-90 text-center leading-none"
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  letterSpacing: "0.08em",
                  boxShadow: "0 4px 14px rgba(232,51,158,0.4)",
                }}
              >
                <span>FREE CONSULTATION</span>
                <span style={{ fontSize: "0.9em", lineHeight: 1 }}>→</span>
              </a>
              <p
                className="text-gray-400 text-center mt-2"
                style={{ fontSize: "0.6rem", letterSpacing: "0.04em" }}
              >
                *MEDICATION PRESCRIBED SEPARATELY AFTER BLOODWORK REVIEW.
              </p>
              <button
                onClick={() => setQuizOpen(true)}
                className="mt-3 w-full text-center text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                Not sure if you qualify? Take the 2-min Metabolic Quiz →
              </button>
            </div>
          </div>
        </div>

      </div>
      <MetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
  );
}
