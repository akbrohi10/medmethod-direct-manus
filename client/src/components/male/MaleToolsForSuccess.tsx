/* MaleToolsForSuccess.tsx */
const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const tools = [
  { icon: "📱", title: "Patient App", desc: "Track your labs, symptoms, and progress. Message your care team anytime." },
  { icon: "🧬", title: "Quarterly Labs", desc: "Comprehensive hormone and metabolic panels every 90 days — included in your program." },
  { icon: "👨‍⚕️", title: "Same Physician", desc: "You work with the same board-certified doctor throughout your entire journey." },
  { icon: "💊", title: "Pharmacy Delivery", desc: "Licensed compounding pharmacy ships your medication discreetly to your door." },
  { icon: "📞", title: "Bi-Weekly Check-ins", desc: "Regular advisor calls to review progress, adjust protocols, and answer questions." },
  { icon: "🏋️", title: "Training Partner", desc: "40% off Send Me a Trainer — certified personal trainers for patients." },
];

export default function MaleToolsForSuccess({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section className="py-14 px-4" style={{ background: "#0A0F1E", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>YOUR TOOLKIT</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            TOOLS FOR SUCCESS
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto", fontSize: "0.9rem" }}>
            Everything you need to optimize your health — built into every program.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {tools.map((tool) => (
            <div key={tool.title} className="p-6 rounded-2xl flex flex-col gap-3 transition-all"
              style={{ background: "rgba(0,194,203,0.05)", border: "1px solid rgba(0,194,203,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,194,203,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,194,203,0.12)")}>
              <span className="text-3xl">{tool.icon}</span>
              <h3 className="font-black text-white text-base">{tool.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{tool.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onConsultClick}
            className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wider text-white transition-all"
            style={{ fontFamily: "Montserrat, sans-serif", background: TEAL_GRADIENT, boxShadow: "0 6px 24px rgba(0,194,203,0.35)" }}>
            SCHEDULE FREE CONSULTATION →
          </button>
        </div>
      </div>
    </section>
  );
}
