/* =============================================================================
   DiagnosticSetup.tsx — MedMethod Direct
   Compact banner: "Step 1 · $449 Clinical Diagnostic & Setup Fee"
   Click the arrow to expand a clean detail panel showing what's included.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { useState } from "react";
import { ChevronDown, FlaskConical, UserRound, Scale, Smartphone, Check, ChevronRight } from "lucide-react";
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

// ── Collapsible Labs FAQ ────────────────────────────────────────────────────
function LabsFAQ() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[12px] font-bold transition-opacity hover:opacity-80"
        style={{ color: "#E833FE", fontFamily: "Montserrat, sans-serif", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span>Do I Really Need Labs to Get Started?</span>
        <ChevronRight
          className="w-3.5 h-3.5 transition-transform duration-300"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <div className="mt-3 text-[13.5px] text-gray-600 leading-relaxed space-y-3 pr-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <p>Most telehealth programs ask you to fill out a questionnaire and ship you a medication within 48 hours. We understand the appeal — it feels like progress.</p>
          <p>But here's the problem. <strong style={{ color: "#111111", fontWeight: 800 }}>70% of women with hormonal imbalances have no idea they have one.</strong> A woman struggling to lose weight may not have a discipline problem — <strong style={{ color: "#111111", fontWeight: 800 }}>she may have an undiagnosed thyroid condition, insulin resistance, or a hormonal imbalance that no questionnaire can detect.</strong></p>
          <p>Only your bloodwork can tell us that.</p>
          <p>This is why we require labs before we prescribe anything. Not to create a barrier — but because treating a symptom without understanding the cause isn’t medicine. It’s guesswork.</p>
          <p>Your $179 includes your full diagnostic lab panel and a 60-minute physician strategy session — where your doctor has already reviewed your results before you sit down together. Your first appointment isn't a meet-and-greet. It's a real plan.</p>
          <p className="font-bold" style={{ color: "#111" }}>That’s not a fee. That’s the difference.</p>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticSetup({ onConsultClick }: { onConsultClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
    <style>{`
      @keyframes bounceArrow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(4px); }
      }
    `}</style>
    <section
      style={{ background: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
      className="px-4 pt-4 pb-10 lg:pb-14"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Compact banner row ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 transition-all group"
          style={{
            background: "#0D0D1A",
            border: "1.5px solid rgba(232,51,158,0.25)",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,51,158,0.7)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(232,51,158,0.12)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,51,158,0.25)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
          aria-expanded={open}
        >
          {/* Left: step pill + label */}
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
            >
              ONE-TIME SETUP
            </span>
            <div>
              {/* Price line: strikethrough + new price */}
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-gray-500 text-sm font-bold line-through leading-none">$449</span>
                <span className="text-white font-black text-3xl leading-none" style={{ letterSpacing: "-0.02em" }}>$179</span>
              </div>
              {/* Savings badge on its own line */}
              <div className="mb-1.5">
                <span
                  className="inline-block text-[9px] font-extrabold uppercase tracking-wider rounded-full px-2.5 py-0.5"
                  style={{ background: "#FFFFFF", color: "#E8339E", border: "1.5px solid #E8339E", letterSpacing: "1px" }}
                >
                  SAVE $270 · JUNE ONLY
                </span>
              </div>
              {/* Program description */}
              <span className="text-white font-bold text-sm leading-snug block" style={{ letterSpacing: "-0.01em" }}>
                Bloodwork + 60-Min Physician Strategy Session + Program Setup
              </span>

            </div>
          </div>

          {/* Right: pill button + bouncing chevron */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="hidden sm:flex items-center gap-1.5 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                letterSpacing: "0.8px",
                boxShadow: "0 2px 12px rgba(232,51,158,0.35)",
              }}
            >
              See What's Included
            </span>
            <ChevronDown
              className="w-6 h-6 transition-transform duration-300"
              style={{
                color: "#E8339E",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                animation: open ? "none" : "bounceArrow 1.4s ease-in-out infinite",
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

              <p className="text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-3">
                What's Included
              </p>

              {/* Collapsible labs FAQ */}
              <LabsFAQ />

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
                  Typical Out-of-Pocket Cost Elsewhere
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
                {/* Strikethrough original price */}
                <p className="text-gray-500 text-sm font-bold line-through mb-0.5">$449</p>

                {/* New discounted price */}
                <div className="flex items-start gap-1 mb-1">
                  <span className="text-white font-black text-lg mt-1">$</span>
                  <span className="font-black text-white leading-none text-5xl md:text-6xl">
                    179
                  </span>
                </div>

                {/* Savings badge — full width like screenshot */}
                <div className="mb-3">
                  <span
                    className="flex items-center justify-center w-full rounded-full py-1.5 text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ background: "#FFFFFF", color: "#E8339E", border: "1.5px solid #E8339E", letterSpacing: "1.5px" }}
                  >
                    SAVE $270 · JUNE ONLY
                  </span>
                </div>

                <ul className="space-y-2">
                  {[
                    "Diagnostic Bloodwork",
                    "Doctor Consultation",
                    "Smart Scale + FedEx Shipping",
                    "Fitness & Nutrition App Set Up",
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
                className="text-gray-500 text-center mt-2"
                style={{ fontSize: "0.7rem", letterSpacing: "0.04em" }}
              >
                *MEDICATION PRESCRIBED SEPARATELY AFTER BLOODWORK REVIEW.
              </p>

              {/* METABOLIC QUIZ BUTTON — hidden for now, may re-enable later
              <button
                onClick={() => setQuizOpen(true)}
                className="mt-3 w-full text-center text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                Not sure if you qualify? Take the 2-min Metabolic Quiz →
              </button>
              */}
            </div>
          </div>
        </div>

      </div>
      <MetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
    </>
  );
}
