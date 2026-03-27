/* MaleHowItWorks.tsx — Warm Cream + Navy theme */
const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";
const NAVY = "#0A1628";
const CREAM = "#F5F2EC";

const steps = [
  { num: "01", title: "Free Consultation", desc: "Book a no-pressure 20-minute call with a MedMethod Enrollment Specialist who will review your symptoms and goals." },
  { num: "02", title: "Lab Work Ordered", desc: "We order a comprehensive hormone panel — testosterone, thyroid, metabolic markers — shipped directly to you or a local lab." },
  { num: "03", title: "Physician Review", desc: "A board-certified men's health physician reviews your labs and builds a protocol personalized to your biology." },
  { num: "04", title: "Medication Delivered", desc: "Your prescription is dispensed from a licensed compounding pharmacy and delivered discreetly to your door." },
  { num: "05", title: "Ongoing Optimization", desc: "Bi-weekly check-ins, quarterly labs, and dose adjustments ensure you keep performing at your peak." },
];

export default function MaleHowItWorks({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section id="how-it-works" className="py-16 px-4" style={{ background: CREAM, fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>THE PROCESS</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black mb-3" style={{ color: NAVY, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            THE PATH TO YOUR <span style={{ background: TEAL_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>PRIME</span>
          </h2>
          <p style={{ color: "rgba(10,22,40,0.5)", maxWidth: 520, margin: "0 auto", fontSize: "0.95rem" }}>
            From your first call to peak performance — we handle everything so you can focus on results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,194,203,0.3), transparent)" }} />

          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center px-3 py-6 relative">
              {/* Number circle */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10"
                style={{ background: i === 0 ? TEAL_GRADIENT : "#fff", border: `2px solid ${i === 0 ? "transparent" : "rgba(0,194,203,0.35)"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <span className="font-black text-lg" style={{ color: i === 0 ? "#fff" : TEAL }}>{step.num}</span>
              </div>
              <h3 className="font-bold mb-2 text-sm tracking-wide" style={{ color: NAVY }}>{step.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(10,22,40,0.5)" }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={onConsultClick}
            className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wider text-white transition-all"
            style={{ fontFamily: "Montserrat, sans-serif", background: TEAL_GRADIENT, boxShadow: "0 6px 24px rgba(0,194,203,0.35)" }}>
            START YOUR JOURNEY →
          </button>
        </div>
      </div>
    </section>
  );
}
