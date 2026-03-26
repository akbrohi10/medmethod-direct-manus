/* MaleDiagnosticSetup.tsx — $449 Clinical Diagnostic Setup Fee for men */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const included = [
  { icon: "🧪", title: "Comprehensive Hormone Panel", desc: "Total & free testosterone, SHBG, estradiol, LH, FSH, prolactin, DHEA-S, and cortisol." },
  { icon: "🩸", title: "Metabolic & Cardiovascular Markers", desc: "CBC, CMP, lipid panel, HbA1c, insulin, thyroid (TSH, T3, T4), PSA, and vitamin D." },
  { icon: "👨‍⚕️", title: "Physician Consultation", desc: "One-on-one review with a board-certified men's health physician who interprets your results." },
  { icon: "📋", title: "Personalized Protocol", desc: "A custom TRT and/or weight loss plan built around your labs, symptoms, and lifestyle goals." },
  { icon: "🚚", title: "Lab Kit Shipped to You", desc: "At-home blood draw kit or local lab order — no clinic visit required." },
];

export default function MaleDiagnosticSetup({ onConsultClick }: { onConsultClick: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-10 px-4" style={{ background: "#0A0F1E", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,194,203,0.2)", background: "rgba(0,194,203,0.04)" }}>
          {/* Banner */}
          <div className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: TEAL_GRADIENT }}>
                <span className="text-xl">🔬</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: TEAL }}>ONE-TIME FEE</span>
                </div>
                <h3 className="font-black text-white text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>
                  $449 Clinical Diagnostic Setup
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem" }}>
                  Comprehensive labs + physician review before your first monthly program. Paid once, never again.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
              <button onClick={onConsultClick}
                className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wider text-white whitespace-nowrap"
                style={{ background: TEAL_GRADIENT, boxShadow: "0 4px 16px rgba(0,194,203,0.3)" }}>
                GET STARTED →
              </button>
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: "rgba(0,194,203,0.7)", background: "none", border: "none", cursor: "pointer" }}>
                {expanded ? "Hide details" : "What's included?"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Expandable */}
          {expanded && (
            <div className="px-6 pb-6 pt-2" style={{ borderTop: "1px solid rgba(0,194,203,0.12)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {included.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(0,194,203,0.05)", border: "1px solid rgba(0,194,203,0.1)" }}>
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-white mb-0.5">{item.title}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                Not sure if you qualify? <button onClick={onConsultClick} className="underline" style={{ color: TEAL, background: "none", border: "none", cursor: "pointer" }}>Book a free call first</button> — no commitment required.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
