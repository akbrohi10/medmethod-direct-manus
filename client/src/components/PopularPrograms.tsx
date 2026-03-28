/* =============================================================================
   Popular Programs — MedMethod Direct
   Commitment-based pricing: 3 / 6 / 12 months
   - 3 months = base rate (highest per-month price)
   - 6 months = "Most Popular" with savings callout
   - 12 months = "Best Value" with largest savings callout
   ============================================================================= */
import { useState } from "react";
import { Check } from "lucide-react";

// ── Pricing tables ────────────────────────────────────────────────────────────
// Per-month rates for each commitment length
const pricing = {
  3:  { t1: 199, t2: 349, t3: 449 },
  6:  { t1: 179, t2: 319, t3: 409 },
  12: { t1: 159, t2: 289, t3: 369 },
} as const;

type Term = 3 | 6 | 12;

// Total billed upfront (per-month × months)
function totalBilled(term: Term, tier: "t1" | "t2" | "t3") {
  return pricing[term][tier] * term;
}

// Dollar savings vs. 3-month rate over the same period
function savingsVs3Mo(term: Term, tier: "t1" | "t2" | "t3") {
  if (term === 3) return 0;
  return (pricing[3][tier] - pricing[term][tier]) * term;
}

const TERMS: { label: string; value: Term; badge?: string }[] = [
  { label: "3 Months",  value: 3  },
  { label: "6 Months",  value: 6,  badge: "Most Popular" },
  { label: "12 Months", value: 12, badge: "Best Value"   },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);

  const p = pricing[term];

  return (
    <section
      className="py-10 px-4"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "#111",
              letterSpacing: "-0.02em",
            }}
          >
            POPULAR PROGRAMS
          </h2>
        </div>

        {/* ── Commitment Tab Selector ─────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {/* Tab row */}
          <div
            className="inline-flex rounded-2xl p-1.5 gap-1"
            style={{ background: "#E4E4EE" }}
          >
            {TERMS.map(({ label, value, badge }) => {
              const active = term === value;
              return (
                <button
                  key={value}
                  onClick={() => setTerm(value)}
                  className="relative flex flex-col items-center rounded-xl transition-all"
                  style={{
                    padding: "10px 22px",
                    background: active
                      ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 110,
                  }}
                >
                  {/* Badge pill (Most Popular / Best Value) */}
                  {badge && (
                    <span
                      className="absolute font-extrabold uppercase rounded-full"
                      style={{
                        top: -11,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 9,
                        letterSpacing: "1.5px",
                        padding: "3px 10px",
                        whiteSpace: "nowrap",
                        background: active
                          ? "#fff"
                          : value === 12
                          ? "#7A1E7E"
                          : "#E8339E",
                        color: active
                          ? "#E8339E"
                          : "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                  <span
                    className="font-extrabold tracking-wide"
                    style={{
                      fontSize: 13,
                      color: active ? "#fff" : "#555",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {label}
                  </span>
                  {/* Per-month hint */}
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: 10,
                      color: active ? "rgba(255,255,255,0.75)" : "#999",
                      marginTop: 2,
                    }}
                  >
                    from ${pricing[value].t1}/mo
                  </span>
                </button>
              );
            })}
          </div>

          {/* Savings callout line */}
          {term > 3 && (
            <div
              className="inline-flex items-center gap-2 rounded-full font-bold text-white text-xs uppercase tracking-widest px-4 py-1.5"
              style={{
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                fontSize: 11,
                letterSpacing: "1.5px",
              }}
            >
              <span>🎉</span>
              <span>
                Save up to ${savingsVs3Mo(term, "t3").toLocaleString()} vs. month-to-month over {term} months
              </span>
            </div>
          )}

          {/* Billing note */}
          <p className="text-xs text-gray-400 font-medium">
            {term === 3
              ? "Billed as a single 3-month payment at checkout"
              : term === 6
              ? "Billed as a single 6-month payment at checkout"
              : "Billed as a single 12-month payment at checkout — our lowest per-month rate"}
          </p>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

          {/* TIER 1 — Management & Oversight */}
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E2EA",
              padding: "34px 28px 30px",
            }}
          >
            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{ color: "#111", letterSpacing: "2.5px" }}
            >
              Management &amp; Oversight
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#111" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 62, color: "#111", letterSpacing: "-3px" }}>
                {p.t1}
              </span>
              <span className="font-semibold pb-2.5 text-gray-400" style={{ fontSize: 15 }}>/mo</span>
            </div>

            {/* Savings vs 3-month */}
            {term > 3 ? (
              <div className="text-xs font-semibold mb-1" style={{ color: "#E8339E" }}>
                Save ${savingsVs3Mo(term, "t1")} vs. 3-month rate — ${totalBilled(term, "t1").toLocaleString()} total
              </div>
            ) : (
              <div className="text-xs font-semibold mb-1 text-gray-400">
                ${totalBilled(term, "t1").toLocaleString()} billed at checkout
              </div>
            )}

            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">
              For patients who already have medication through insurance but want the MedMethod team managing their results.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "#F1F1F5", color: "#555", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              No Medication Included
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EBEBF0", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Prescriptions Called In to Your Local Pharmacy" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "#F0FDF4" }}
                  >
                    <Check size={10} color="#16A34A" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "#2A2A35" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block text-xs font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#E8339E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="rounded-lg text-xs font-medium leading-relaxed mb-3"
              style={{ background: "#f3f4f6", color: "#555", padding: "10px 14px" }}
            >
              💉 <strong>Quarterly Blood Lab Testing</strong> available as an add-on — <strong>$129/quarter</strong>
            </div>
            <a
              onClick={onConsultClick}
              className="block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all hover:bg-gray-100 cursor-pointer"
              style={{
                padding: "15px",
                border: "2px solid #111",
                color: "#111",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
              }}
            >
              Join Management Track
            </a>
          </div>

          {/* TIER 2 — Core Weight Track (HERO) */}
          <div
            className="rounded-2xl flex flex-col relative"
            style={{
              background: "#0D0F1C",
              border: "2.5px solid #E8339E",
              padding: "40px 30px 34px",
              boxShadow: "0 0 0 5px rgba(232,51,158,0.10), 0 24px 64px rgba(122,30,126,0.22)",
            }}
          >
            {/* Most Popular badge — only shown when 6-month tab is active */}
            {term === 6 && (
              <div
                className="absolute text-white font-extrabold uppercase tracking-widest rounded-full"
                style={{
                  top: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                  fontSize: 10,
                  letterSpacing: "2px",
                  padding: "5px 20px",
                  whiteSpace: "nowrap",
                }}
              >
                ⭐ Most Popular
              </div>
            )}
            {term === 12 && (
              <div
                className="absolute text-white font-extrabold uppercase tracking-widest rounded-full"
                style={{
                  top: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #7A1E7E, #4A0E7E)",
                  fontSize: 10,
                  letterSpacing: "2px",
                  padding: "5px 20px",
                  whiteSpace: "nowrap",
                }}
              >
                🏆 Best Value
              </div>
            )}

            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{
                background: "linear-gradient(135deg, #E8339E, #B06FE8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "2.5px",
              }}
            >
              Core Weight Track
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5 text-white" style={{ fontSize: 20 }}>$</span>
              <span className="font-black leading-none text-white" style={{ fontSize: 62, letterSpacing: "-3px" }}>
                {p.t2}
              </span>
              <span className="font-semibold pb-2.5" style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>/mo</span>
            </div>

            {/* Savings vs 3-month */}
            {term > 3 ? (
              <div className="text-xs font-semibold mb-1" style={{ color: "#F472B6" }}>
                Save ${savingsVs3Mo(term, "t2")} vs. 3-month rate — ${totalBilled(term, "t2").toLocaleString()} total
              </div>
            ) : (
              <div className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                ${totalBilled(term, "t2").toLocaleString()} billed at checkout
              </div>
            )}

            <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              Our complete medical weight loss system — FDA-approved or 503B-compounded GLP-1 therapy, physician-designed for steady, safe, and managed results.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "rgba(232,51,158,0.15)", color: "#F472B6", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#F472B6" }} />
              Includes Semaglutide
            </div>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Semaglutide (FDA-approved brand or 503B-compounded) — Delivered to Your Door" },
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
                { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "rgba(232,51,158,0.18)" }}
                  >
                    <Check size={10} color="#E8339E" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#E8339E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className="inline-block font-bold uppercase rounded ml-1.5"
                        style={{
                          fontSize: 10,
                          background: "rgba(232,51,158,0.15)",
                          color: "#E8339E",
                          padding: "1px 6px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <a
              onClick={onConsultClick}
              className="block w-full text-center text-white font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              style={{
                padding: "15px",
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                border: "none",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(232,51,158,0.38)",
              }}
            >
              Start Core Track
            </a>
          </div>

          {/* TIER 3 — Elite Longevity Track */}
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E2EA",
              padding: "34px 28px 30px",
            }}
          >
            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{ color: "#111", letterSpacing: "2.5px" }}
            >
              Elite Longevity Track
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#111" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 62, color: "#111", letterSpacing: "-3px" }}>
                {p.t3}
              </span>
              <span className="font-semibold pb-2.5 text-gray-400" style={{ fontSize: 15 }}>/mo</span>
            </div>

            {/* Savings vs 3-month */}
            {term > 3 ? (
              <div className="text-xs font-semibold mb-1" style={{ color: "#7A1E7E" }}>
                Save ${savingsVs3Mo(term, "t3")} vs. 3-month rate — ${totalBilled(term, "t3").toLocaleString()} total
              </div>
            ) : (
              <div className="text-xs font-semibold mb-1 text-gray-400">
                ${totalBilled(term, "t3").toLocaleString()} billed at checkout
              </div>
            )}

            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">
              Premium optimization for high-performers — the only program combining GLP-1 therapy with full hormonal balance.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "rgba(122,30,126,0.10)", color: "#7A1E7E", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#7A1E7E" }} />
              Tirzepatide + BHRT
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EBEBF0", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Tirzepatide (FDA-approved brand or 503B-compounded) + BHRT — The Complete Protocol" },
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
                { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "rgba(122,30,126,0.12)" }}
                  >
                    <Check size={10} color="#7A1E7E" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "#2A2A35" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#7A1E7E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className="inline-block font-bold uppercase rounded ml-1.5"
                        style={{
                          fontSize: 10,
                          background: "rgba(122,30,126,0.15)",
                          color: "#7A1E7E",
                          padding: "1px 6px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <a
              onClick={onConsultClick}
              className="block w-full text-center text-white font-extrabold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 cursor-pointer"
              style={{
                padding: "15px",
                background: "#111",
                border: "2px solid #111",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
              }}
            >
              Go Elite Longevity
            </a>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-4" />

      </div>
    </section>
  );
}
