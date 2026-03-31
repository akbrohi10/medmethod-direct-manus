/* =============================================================================
   MalePopularPrograms — Men's Pricing Section
   Single-axis pricing: Choose term (3 / 6 / 12 months), pay in full upfront.
   Cherry financing available for patients who need monthly installments.
   Warm Cream + Navy + Teal theme — mirrors women's PopularPrograms model.
   ============================================================================= */
import { useState } from "react";
import { Check } from "lucide-react";

// ── Pricing table (upfront only) ─────────────────────────────────────────────
// [term][tier] → per-month equivalent rate (patient pays total upfront)
const PRICES = {
  3:  { t1: 199, t2: 349, t3: 449 },
  6:  { t1: 189, t2: 329, t3: 419 },
  12: { t1: 179, t2: 299, t3: 374 },
} as const;

type Term = 3 | 6 | 12;
type Tier = "t1" | "t2" | "t3";

const BASE = PRICES[3]; // 3-month = standard rate, no discount

function totalCost(term: Term, tier: Tier) {
  return PRICES[term][tier] * term;
}

function savingsVsBase(term: Term, tier: Tier) {
  return (BASE[tier] - PRICES[term][tier]) * term;
}

// ── Term selector data ────────────────────────────────────────────────────────
const TERMS: { label: string; value: Term; clinicalNote: string }[] = [
  { label: "3 Months",  value: 3,  clinicalNote: "Minimum commitment — see early results" },
  { label: "6 Months",  value: 6,  clinicalNote: "Recommended — full transformation window" },
  { label: "12 Months", value: 12, clinicalNote: "Complete protocol — lasting change" },
];

// ── Feature data ──────────────────────────────────────────────────────────────
interface Feature { text: string; sub?: string; badge?: string }

const TIER1_FEATURES: Feature[] = [
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Prescriptions Called In to Your Local Pharmacy" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
];

const TIER2_FEATURES: Feature[] = [
  { text: "Testosterone Replacement Therapy (TRT) — Delivered to Your Door" },
  { text: "Semaglutide (FDA-approved brand or 503B-compounded) — Metabolic & Weight Optimization" },
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
  { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
];

const TIER3_FEATURES: Feature[] = [
  { text: "Testosterone Replacement Therapy (TRT) — Optimized Dosing Protocol" },
  { text: "Tirzepatide (FDA-approved brand or 503B-compounded) — Superior Body Recomposition" },
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
  { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function FeatureItem({ feature, teal }: { feature: Feature; teal?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: teal ? "rgba(0,229,255,0.12)" : "rgba(13,26,42,0.07)" }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: teal ? "#00E5FF" : "#0A1628" }} strokeWidth={2.5} />
      </span>
      <span className="text-[13px] font-semibold leading-snug" style={{ color: "#2A3545" }}>
        {feature.text}
        {feature.badge && (
          <span
            className="ml-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{
              background: teal ? "rgba(0,229,255,0.12)" : "rgba(13,26,42,0.08)",
              color: teal ? "#00B8CC" : "#0A1628",
            }}
          >
            {feature.badge}
          </span>
        )}
        {feature.sub && (
          <span
            className="block text-[10px] font-bold uppercase tracking-wide mt-0.5"
            style={{ color: teal ? "#00E5FF" : "#0A1628" }}
          >
            {feature.sub}
          </span>
        )}
      </span>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MalePopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);

  const p = PRICES[term];
  const maxSavings = savingsVsBase(term, "t3");

  return (
    <section id="programs" className="py-20 px-4" style={{ background: "#EDE9E1" }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[4px] uppercase mb-3" style={{ color: "#00E5FF" }}>PRICING</p>
          <h2
            className="font-black mb-3"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#0A1628", letterSpacing: "-0.02em" }}
          >
            Choose Your <span style={{ color: "#00E5FF" }}>Track</span>
          </h2>
          <p className="text-sm max-w-xl mx-auto font-medium" style={{ color: "#6A6050" }}>
            Testosterone Optimization · Medical Weight Loss · Longevity — Physician-Led. Advisor-Supported. Results-Driven.
          </p>
          <p className="text-sm mt-1 font-medium" style={{ color: "#9A9080" }}>
            Choose your program length — all plans are paid in full upfront.
          </p>
        </div>

        {/* ── Term Selector ── */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#9A9080", letterSpacing: "2px" }}>
            Choose your commitment
          </p>
          <div
            className="inline-flex rounded-2xl p-1.5 gap-1"
            style={{ background: "#D8D3CA" }}
          >
            {TERMS.map(({ label, value }) => {
              const active = term === value;
              const isMostPop = value === 6;
              const isBestVal = value === 12;
              return (
                <button
                  key={value}
                  onClick={() => setTerm(value)}
                  className="relative flex flex-col items-center rounded-xl transition-all"
                  style={{
                    padding: "10px 22px",
                    background: active
                      ? "linear-gradient(135deg, #00E5FF, #00B8CC)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 118,
                  }}
                >
                  {(isMostPop || isBestVal) && (
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
                        background: active ? "#fff" : isBestVal ? "#0A1628" : "#00E5FF",
                        color: active ? "#00E5FF" : "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {isMostPop ? "Most Popular" : "Best Value"}
                    </span>
                  )}
                  <span
                    className="font-extrabold"
                    style={{ fontSize: 13, color: active ? "#fff" : "#555", letterSpacing: "0.5px" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.75)" : "#999", marginTop: 2 }}
                  >
                    from ${(PRICES[value].t1 * value).toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-medium italic" style={{ color: "#9A9080" }}>
            {TERMS.find(t => t.value === term)?.clinicalNote}
          </p>

          {/* Savings banner — only when term > 3 */}
          {term > 3 && maxSavings > 0 && (
            <div
              className="inline-flex items-center gap-2 rounded-full font-bold text-white px-4 py-1.5 mt-1"
              style={{
                background: "linear-gradient(135deg, #00E5FF, #00B8CC)",
                fontSize: 11,
                letterSpacing: "1.5px",
              }}
            >
              <span>🎉</span>
              <span className="uppercase tracking-widest">
                Save up to ${maxSavings.toLocaleString()} on Elite vs. 3-month rate
              </span>
            </div>
          )}
        </div>

        {/* ── Cherry micro-note ── */}
        <p className="text-xs text-center -mt-2 mb-4" style={{ color: "#9A9080" }}>
          Prefer monthly payments?{" "}
          <a
            href="https://www.withcherry.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 transition-colors"
            style={{ color: "#00E5FF" }}
          >
            Monthly financing available through Cherry
          </a>
          .
        </p>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

          {/* TIER 1 — Hormone & Health Management */}
          <div
            className="bg-white rounded-2xl flex flex-col relative"
            style={{ border: "1.5px solid #E5DFD5", padding: "34px 28px 30px", boxShadow: "0 4px 20px rgba(13,26,42,0.06)" }}
          >
            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#9A9080" }}>
              Hormone &amp; Health Management
            </p>

            {/* Price — upfront total */}
            <div className="flex items-end gap-1 mb-0.5">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#0A1628" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 56, color: "#0A1628", letterSpacing: "-3px" }}>
                {totalCost(term, "t1").toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: "#9A9080" }}>
                ${p.t1}/mo equivalent
              </span>
              {savingsVsBase(term, "t1") > 0 && (
                <span className="text-xs font-extrabold" style={{ color: "#00E5FF" }}>
                  Save ${savingsVsBase(term, "t1").toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: "#9A9080" }}>
              Physician-supervised hormone oversight and accountability coaching — for men who want expert guidance managing their own health.
            </p>

            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "#F0EBE0", color: "#9A9080", border: "1px solid #E5DFD5" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              No Medication Included
            </div>

            <hr className="mb-5" style={{ borderTop: "1px solid #EBEBF0" }} />

            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER1_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} />)}
            </ul>

            <div
              className="rounded-lg px-3 py-2.5 text-xs mb-6 leading-relaxed"
              style={{ background: "#F5F0E8", border: "1px solid #E5DFD5", color: "#9A9080" }}
            >
              🩸 <strong style={{ color: "#2A3545" }}>Quarterly Blood Lab Testing</strong> — Add-on available at discounted rate
            </div>

            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
              style={{ border: "2px solid #D5CFC5", background: "transparent", color: "#0A1628" }}
            >
              Start Hormone Track
            </button>
          </div>

          {/* TIER 2 — Metabolic & Testosterone Track (HERO) */}
          <div
            className="rounded-2xl flex flex-col relative"
            style={{
              background: "#0A1628",
              border: "2px solid #00E5FF",
              padding: "40px 28px 34px",
              boxShadow: "0 0 0 5px rgba(0,229,255,0.09), 0 16px 48px rgba(0,229,255,0.13)",
            }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #00E5FF, #00B8CC)" }}
            >
              ⭐ Most Popular
            </div>

            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#00E5FF" }}>
              Metabolic &amp; Testosterone Track
            </p>

            {/* Price — upfront total */}
            <div className="flex items-end gap-1 mb-0.5">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#00E5FF" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 56, color: "#fff", letterSpacing: "-3px" }}>
                {totalCost(term, "t2").toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                ${p.t2}/mo equivalent
              </span>
              {term === 12 ? (
                <span
                  className="inline-flex items-center gap-1 text-xs font-extrabold rounded-full px-2.5 py-0.5"
                  style={{ background: "linear-gradient(135deg, #00E5FF, #00B8CC)", color: "#fff", fontSize: 10 }}
                >
                  🎉 Over 2 months free
                </span>
              ) : savingsVsBase(term, "t2") > 0 ? (
                <span className="text-xs font-extrabold" style={{ color: "#00E5FF" }}>
                  Save ${savingsVsBase(term, "t2").toLocaleString()}
                </span>
              ) : null}
            </div>

            <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              Our complete men's metabolic reset — TRT + FDA-approved or 503B-compounded GLP-1 therapy, physician-designed for body recomposition.
            </p>

            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "rgba(0,229,255,0.12)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.28)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              TRT + Semaglutide
            </div>

            <hr className="mb-5" style={{ borderTop: "1px solid rgba(0,229,255,0.2)" }} />

            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER2_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} teal />)}
            </ul>

            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00E5FF, #00B8CC)", boxShadow: "0 8px 24px rgba(0,229,255,0.26)" }}
            >
              Start Metabolic Track
            </button>
          </div>

          {/* TIER 3 — Elite Performance & Longevity */}
          <div
            className="bg-white rounded-2xl flex flex-col relative"
            style={{ border: "2px solid #0A1628", padding: "40px 28px 34px", boxShadow: "0 4px 20px rgba(13,26,42,0.10)" }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{ background: "#0A1628" }}
            >
              ✦ Most Complete
            </div>

            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#0A1628" }}>
              Elite Performance &amp; Longevity Track
            </p>

            {/* Price — upfront total */}
            <div className="flex items-end gap-1 mb-0.5">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#0A1628" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 56, color: "#0A1628", letterSpacing: "-3px" }}>
                {totalCost(term, "t3").toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: "#9A9080" }}>
                ${p.t3}/mo equivalent
              </span>
              {term === 12 ? (
                <span
                  className="inline-flex items-center gap-1 text-xs font-extrabold rounded-full px-2.5 py-0.5"
                  style={{ background: "#0A1628", color: "#fff", fontSize: 10 }}
                >
                  🎉 Over 2 months free
                </span>
              ) : savingsVsBase(term, "t3") > 0 ? (
                <span className="text-xs font-extrabold" style={{ color: "#0A1628" }}>
                  Save ${savingsVsBase(term, "t3").toLocaleString()}
                </span>
              ) : null}
            </div>

            <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: "#9A9080" }}>
              The full longevity stack — TRT + FDA-approved or 503B-compounded Tirzepatide for maximum body recomposition, energy, and peak performance at any age.
            </p>

            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "rgba(13,26,42,0.06)", color: "#0A1628", border: "1px solid rgba(13,26,42,0.18)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              TRT + Tirzepatide
            </div>

            <hr className="mb-5" style={{ borderTop: "1px solid rgba(13,26,42,0.12)" }} />

            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER3_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} />)}
            </ul>

            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-80"
              style={{ background: "#0A1628" }}
            >
              Go Elite Performance
            </button>
          </div>

        </div>

        {/* ── Footer trust pills ── */}
        <div className="mt-10 pt-6 border-t flex flex-wrap justify-center gap-6" style={{ borderColor: "#E5DFD5" }}>
          {[
            "3, 6, or 12-Month Programs",
            "Paid in Full Upfront",
            "$449 One-Time Onboarding Fee",
            "HIPAA Compliant & Secure",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs font-semibold" style={{ color: "#6A6050" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #00E5FF, #00B8CC)" }} />
              {item}
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-medium mt-3" style={{ color: "#B0A898" }}>
          All programs are paid in full for the selected term. Non-refundable. HSA/FSA accepted.
        </p>
        <p className="text-center text-[10.5px] mt-1" style={{ color: "#B0A898" }}>
          FDA-approved brand medications or compounded alternatives from licensed 503B outsourcing pharmacies. Individual results may vary.
        </p>

      </div>
    </section>
  );
}
