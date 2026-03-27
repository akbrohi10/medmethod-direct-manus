/* MalePopularPrograms.tsx — Men's TRT & Weight Loss Program Pricing */
import { useState } from "react";
import { Check } from "lucide-react";

const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const monthly = { t1: 199, t2: 349, t3: 449 };
const annual  = { t1: 166, t2: 291, t3: 374 };

export default function MalePopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const p = isAnnual ? annual : monthly;

  return (
    <section id="programs" className="py-14 px-4" style={{ background: "#0d1526", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>PROGRAMS</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            POPULAR PROGRAMS
          </h2>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="font-bold text-sm cursor-pointer transition-colors" style={{ color: !isAnnual ? "#fff" : "rgba(255,255,255,0.35)" }} onClick={() => setIsAnnual(false)}>Monthly</span>
          <button onClick={() => setIsAnnual(!isAnnual)}
            className="relative flex-shrink-0 rounded-full transition-all"
            style={{ width: 52, height: 28, background: TEAL_GRADIENT, border: "none", cursor: "pointer" }}>
            <span className="absolute rounded-full bg-white transition-all"
              style={{ width: 22, height: 22, top: 3, left: isAnnual ? 27 : 3, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", transition: "left 0.25s ease" }} />
          </button>
          <span className="font-bold text-sm cursor-pointer transition-colors" style={{ color: isAnnual ? "#fff" : "rgba(255,255,255,0.35)" }} onClick={() => setIsAnnual(true)}>Annual</span>
          {isAnnual && (
            <span className="text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: TEAL_GRADIENT }}>2 Months Free</span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* TIER 1 */}
          <div className="rounded-2xl flex flex-col" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,194,203,0.15)" }}>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>TIER 1</p>
              <h3 className="font-black text-white text-lg mb-1">Management & Oversight</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Monitoring + physician guidance for men already on TRT</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-black text-4xl text-white">${p.t1}</span>
                <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              {isAnnual && <p className="text-xs mb-5" style={{ color: TEAL }}>Billed annually · Save $398/yr</p>}
              <div className="space-y-2.5 flex-1">
                {["Monthly physician check-in", "Lab review & dose adjustments", "Secure messaging with care team", "Prescription management", "Patient portal access"].map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={onConsultClick} className="w-full py-3 rounded-xl font-bold text-sm tracking-wider transition-all"
                style={{ background: "transparent", border: `1.5px solid rgba(0,194,203,0.4)`, color: TEAL }}>
                GET STARTED
              </button>
            </div>
          </div>

          {/* TIER 2 — Featured */}
          <div className="rounded-2xl flex flex-col relative" style={{ background: "#0A1628", border: `2px solid ${TEAL}`, boxShadow: `0 0 40px rgba(0,194,203,0.2)` }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full text-xs font-extrabold tracking-widest uppercase text-white" style={{ background: TEAL_GRADIENT }}>MOST POPULAR</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: TEAL }}>TIER 2</p>
              <h3 className="font-black text-white text-lg mb-1">GLP-1 Weight Loss</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Medically supervised Semaglutide program with full physician support</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-black text-4xl text-white">${p.t2}</span>
                <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              {isAnnual && <p className="text-xs mb-5" style={{ color: TEAL }}>Billed annually · Save $698/yr</p>}
              <div className="space-y-2.5 flex-1">
                {["Everything in Tier 1", "GLP-1 / Semaglutide (Ozempic-class)", "Bi-weekly physician check-ins", "Medication shipped to your door", "Nutrition & macro coaching", "Quarterly comprehensive labs"].map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={onConsultClick} className="w-full py-3 rounded-xl font-bold text-sm tracking-wider text-white transition-all"
                style={{ background: TEAL_GRADIENT, boxShadow: "0 6px 20px rgba(0,194,203,0.35)" }}>
                GET STARTED
              </button>
            </div>
          </div>

          {/* TIER 3 */}
          <div className="rounded-2xl flex flex-col" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,194,203,0.15)" }}>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>TIER 3</p>
              <h3 className="font-black text-white text-lg mb-1">TRT + Elite Performance</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Full TRT protocol + peptides, longevity, and complete optimization</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-black text-4xl text-white">${p.t3}</span>
                <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              {isAnnual && <p className="text-xs mb-5" style={{ color: TEAL }}>Billed annually · Save $898/yr</p>}
              <div className="space-y-2.5 flex-1">
                {["Everything in Tier 2", "Testosterone cypionate or enanthate", "Anastrozole / HCG if needed", "Peptide therapy (BPC-157, TB-500, etc.)", "Sexual health & ED protocols", "Hair restoration program", "Priority physician access", "Personal training discount (40% OFF)"].map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={onConsultClick} className="w-full py-3 rounded-xl font-bold text-sm tracking-wider transition-all"
                style={{ background: "transparent", border: `1.5px solid rgba(0,194,203,0.4)`, color: TEAL }}>
                GET STARTED
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.3)" }}>
          All programs require a minimum 6-month commitment. $449 diagnostic setup fee applies once before first program.
        </p>
      </div>
    </section>
  );
}
