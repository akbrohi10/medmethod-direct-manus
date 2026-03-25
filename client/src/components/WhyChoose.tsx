/* =============================================================================
   Why Choose MedMethod — Clinical Noir Design
   Comparison table (us vs others) on dark background
   ============================================================================= */
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Comprehensive Lab Diagnostics", us: true, others: false },
  { feature: "Bi-Weekly Doctor Check-Ins", us: true, others: false },
  { feature: "Same Doctor Throughout Journey", us: true, others: false },
  { feature: "Dedicated Wellness Advisor", us: true, others: false },
  { feature: "Custom Nutrition Program", us: true, others: false },
  { feature: "Personalized Fitness Plan", us: true, others: false },
  { feature: "Women 40+ Specialists", us: true, others: false },
  { feature: "Board-Certified Physicians", us: true, others: true },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#111111] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Headline */}
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Advantage
            </span>
            <h2
              className="font-black text-white leading-tight mb-6"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              WHY WOMEN
              <br />
              CHOOSE
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MEDMETHOD DIRECT
              </span>
            </h2>
            <p
              className="text-white/60 leading-relaxed mb-8"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem" }}
            >
              You deserve more than a box shipped to your door. We provide a doctor-led path with comprehensive labs, bi-weekly check-ins, and a dedicated Wellness Advisor — built specifically for women over 40.
            </p>
            <a
              href="#consultation"
              className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              GET STARTED TODAY
            </a>

            {/* Rating */}
            <div className="mt-8 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl"
                style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", fontFamily: "Montserrat, sans-serif" }}
              >
                4.9
              </div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: "#E8339E", fontSize: "1.1rem" }}>★</span>
                  ))}
                </div>
                <div
                  className="text-white/60 text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Based on 1,000+ verified patient reviews
                </div>
              </div>
            </div>
          </div>

          {/* Right: Comparison Table */}
          <div>
            {/* Column headers */}
            <div className="grid grid-cols-3 mb-4 px-4">
              <div className="col-span-1" />
              <div className="text-center">
                <span
                  className="text-xs font-bold tracking-wider uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                >
                  MedMethod Direct
                </span>
              </div>
              <div className="text-center">
                <span
                  className="text-xs font-bold tracking-wider uppercase text-white/30"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Other Clinics
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10">
              {comparisons.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 items-center px-4 py-3.5 ${
                    i % 2 === 0 ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <div
                    className="col-span-1 text-white/80 text-sm pr-4"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                  >
                    {row.feature}
                  </div>
                  <div className="flex justify-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E33 100%)", border: "1px solid rgba(232,51,158,0.4)" }}
                    >
                      <Check className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                      <X className="w-4 h-4 text-white/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
