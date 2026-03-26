/* MaleWhyChoose.tsx */
const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const failures = [
  { stat: "60%", label: "of men with Low T go undiagnosed for years", desc: "Standard 'normal' ranges are set too low. Most men feel terrible well within the reference range." },
  { stat: "3x", label: "more likely to gain weight with Low T", desc: "Testosterone directly regulates fat metabolism. Without it, diet and exercise alone rarely work." },
  { stat: "72%", label: "of online TRT clinics don't monitor estrogen", desc: "Unmanaged estradiol causes water retention, mood swings, and cardiovascular risk. We monitor everything." },
];

const differentiators = [
  { icon: "🧪", title: "Comprehensive Labs Every Quarter", desc: "Full hormone panel, metabolic markers, PSA, and cardiovascular risk — not just testosterone." },
  { icon: "👨‍⚕️", title: "Same Physician Throughout", desc: "You build a real relationship with one doctor who knows your history and goals." },
  { icon: "📞", title: "Bi-Weekly Advisor Check-ins", desc: "A dedicated health advisor reviews your progress and flags any concerns before your next lab draw." },
  { icon: "📱", title: "Custom Patient App", desc: "Log symptoms, track labs, message your team, and see your optimization timeline in one place." },
  { icon: "💊", title: "Responsible Prescribing", desc: "We never over-prescribe. Our protocols are designed for long-term health, not just short-term numbers." },
];

export default function MaleWhyChoose({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section className="py-14 px-4" style={{ background: "#0d1526", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        {/* Part 1: Failures */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>WHY IT HASN'T WORKED</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black text-white mb-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}>
            THE SYSTEM IS FAILING MEN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {failures.map((f) => (
            <div key={f.stat} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,194,203,0.1)" }}>
              <div className="font-black mb-1" style={{ fontSize: "2.5rem", color: TEAL, letterSpacing: "-0.03em" }}>{f.stat}</div>
              <p className="font-bold text-white text-sm mb-2">{f.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Part 2: Differentiators */}
        <div className="rounded-2xl p-8" style={{ background: "rgba(0,194,203,0.05)", border: "1px solid rgba(0,194,203,0.2)" }}>
          <h3 className="font-black text-white text-xl mb-6 text-center" style={{ letterSpacing: "-0.01em" }}>
            THE MEDMETHOD DIFFERENCE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {differentiators.map((d) => (
              <div key={d.title} className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{d.icon}</span>
                <div>
                  <p className="font-bold text-white text-sm mb-1">{d.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={onConsultClick}
              className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wider text-white"
              style={{ fontFamily: "Montserrat, sans-serif", background: TEAL_GRADIENT, boxShadow: "0 6px 24px rgba(0,194,203,0.35)" }}>
              CHECK YOUR HORMONE LEVELS →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
