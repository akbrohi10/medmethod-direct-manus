/* =============================================================================
   Popular Programs — MedMethod Direct
   Single-axis pricing: Choose your term (3 / 6 / 12 months), pay in full.
   Cherry financing available for patients who need monthly installments.

   Discount philosophy:
     - Tier 1 (Management): shallow discounts — protect margin on lowest tier
     - Tier 2 (Core Weight): moderate discounts — volume driver
     - Tier 3 (Elite):       deepest discounts — reward highest-value patients

   All programs are paid in full upfront for the selected term.
   ============================================================================= */
import { useState } from "react";
import { Check } from "lucide-react";

// ── Pricing table (upfront only) ─────────────────────────────────────────────
// [term][tier] → per-month equivalent rate (patient pays total upfront)
const PRICES = {
  3:  { t1: 189, t2: 319, t3: 419 },
  6:  { t1: 184, t2: 299, t3: 379 },
  12: { t1: 179, t2: 279, t3: 339 },
} as const;

type Term = 3 | 6 | 12;
type Tier = "t1" | "t2" | "t3";

// Baseline = 3-month rate (the standard rate, no commitment discount)
const BASE = PRICES[3];

function totalCost(term: Term, tier: Tier) {
  return PRICES[term][tier] * term;
}

function savingsVsBase(term: Term, tier: Tier) {
  return (BASE[tier] - PRICES[term][tier]) * term;
}

// ── Static data ──────────────────────────────────────────────────────────────
const TERMS: { label: string; value: Term; clinicalNote: string }[] = [
  { label: "3 Months",  value: 3,  clinicalNote: "Minimum commitment — see early results" },
  { label: "6 Months",  value: 6,  clinicalNote: "Recommended — full transformation window" },
  { label: "12 Months", value: 12, clinicalNote: "Complete protocol — lasting change" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);

  const p = PRICES[term];

  // Max savings for the banner (use Elite as the showcase)
  const maxSavings = savingsVsBase(term, "t3");

  return (
    <section
      className="py-10 px-4"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <h2
            className="font-black mb-2"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "#111",
              letterSpacing: "-0.02em",
            }}
          >
            POPULAR PROGRAMS
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Choose your program length — all plans are paid in full upfront.
          </p>
        </div>

        {/* ── Term Selector ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400" style={{ letterSpacing: "2px" }}>
            Choose your commitment
          </p>
          <div
            className="inline-flex rounded-2xl p-1.5 gap-1"
            style={{ background: "#E4E4EE" }}
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
                      ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 118,
                  }}
                >
                  {/* Badge */}
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
                        background: active ? "#fff" : isBestVal ? "#7A1E7E" : "#E8339E",
                        color: active ? "#E8339E" : "#fff",
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
          {/* Clinical note for selected term */}
          <p className="text-xs text-gray-400 font-medium italic">
            {TERMS.find(t => t.value === term)?.clinicalNote}
          </p>

          {/* Savings banner — only shown when term > 3 */}
          {term > 3 && maxSavings > 0 && (
            <div
              className="inline-flex items-center gap-2 rounded-full font-bold text-white px-4 py-1.5 mt-1"
              style={{
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                fontSize: 11,
                letterSpacing: "1.5px",
              }}
            >
              <span>🎉</span>
              <span className="uppercase tracking-widest">
                Save up to ${maxSavings.toLocaleString()} on Elite Longevity vs. 3-month rate
              </span>
            </div>
          )}
        </div>

        {/* ── Cherry micro-note ───────────────────────────────────────────── */}
        <p className="text-xs text-center text-gray-400 -mt-2 mb-1">
          Prefer monthly payments?{" "}
          <a
            href="https://www.withcherry.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-[#E8339E] transition-colors"
            style={{ color: "#E8339E" }}
          >
            Monthly financing available through Cherry
          </a>
          .
        </p>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

          {/* ── TIER 1: Management & Oversight ─────────────────────────── */}
          <TierCard
            title="Management &amp; Oversight"
            description="For patients who already have medication through insurance but want the MedMethod team managing their results."
            medicationBadge={{ label: "No Medication Included", color: "#555", bg: "#F1F1F5", dot: "#999" }}
            price={p.t1}
            basePrice={BASE.t1}
            term={term}
            savings={savingsVsBase(term, "t1")}
            total={totalCost(term, "t1")}
            features={[
              { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
              { text: "Quarterly 1-on-1 Doctor Strategy Session" },
              { text: "Prescriptions Called In to Your Local Pharmacy" },
              { text: "Direct Text Access (Business Hours)" },
              { text: "Custom Fitness & Nutrition Program (on the app)" },
              { text: "Clinical Performance Dashboard" },
            ]}
            addOn="💉 Quarterly Blood Lab Testing available as an add-on — $129/quarter"
            ctaLabel="Join Management Track"
            ctaStyle="outline"
            checkColor="#16A34A"
            checkBg="#F0FDF4"
            savingsColor="#E8339E"
            onConsultClick={onConsultClick}
          />

          {/* ── TIER 2: Core Weight Track (HERO) ───────────────────────── */}
          <TierCard
            hero
            title="Core Weight Track"
            description="Our complete medical weight loss system — FDA-approved or 503B-compounded GLP-1 therapy, physician-designed for steady, safe, and managed results."
            medicationBadge={{ label: "Includes Semaglutide", color: "#F472B6", bg: "rgba(232,51,158,0.15)", dot: "#F472B6" }}
            price={p.t2}
            basePrice={BASE.t2}
            term={term}
            savings={savingsVsBase(term, "t2")}
            total={totalCost(term, "t2")}
            features={[
              { text: "Semaglutide (FDA-approved brand or 503B-compounded) — Delivered to Your Door" },
              { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
              { text: "Quarterly 1-on-1 Doctor Strategy Session" },
              { text: "Direct Text Access (Business Hours)" },
              { text: "Custom Fitness & Nutrition Program (on the app)" },
              { text: "Clinical Performance Dashboard" },
              { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
            ]}
            ctaLabel="Start Core Track"
            ctaStyle="hero"
            checkColor="#E8339E"
            checkBg="rgba(232,51,158,0.18)"
            savingsColor="#F472B6"
            onConsultClick={onConsultClick}
          />

          {/* ── TIER 3: Elite Longevity Track ───────────────────────────── */}
          <TierCard
            title="Elite Longevity Track"
            description="Premium optimization for high-performers — the only program combining GLP-1 therapy with full hormonal balance."
            medicationBadge={{ label: "Tirzepatide + BHRT", color: "#7A1E7E", bg: "rgba(122,30,126,0.10)", dot: "#7A1E7E" }}
            price={p.t3}
            basePrice={BASE.t3}
            term={term}
            savings={savingsVsBase(term, "t3")}
            total={totalCost(term, "t3")}
            monthsFreeLabel={term === 12 ? "Over 2 months free" : undefined}
            features={[
              { text: "Tirzepatide (FDA-approved brand or 503B-compounded) + BHRT — The Complete Protocol" },
              { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
              { text: "Quarterly 1-on-1 Doctor Strategy Session" },
              { text: "Direct Text Access (Business Hours)" },
              { text: "Custom Fitness & Nutrition Program (on the app)" },
              { text: "Clinical Performance Dashboard" },
              { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
            ]}
            ctaLabel="Go Elite Longevity"
            ctaStyle="dark"
            checkColor="#7A1E7E"
            checkBg="rgba(122,30,126,0.12)"
            savingsColor="#7A1E7E"
            onConsultClick={onConsultClick}
          />

        </div>

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          All programs are paid in full for the selected term. Non-refundable. HSA/FSA accepted.
        </p>

        {/* ── Cherry Financing Badge ──────────────────────────────────────── */}
        <div className="flex flex-col items-center mt-8 gap-3">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl px-6 py-4 shadow-sm"
            style={{
              background: "#fff",
              border: "1.5px solid rgba(232,51,158,0.18)",
              maxWidth: 560,
              width: "100%",
            }}
          >
            {/* Cherry logo */}
            <div
              className="flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="font-black text-white" style={{ fontSize: 18, letterSpacing: "-0.03em" }}>🍒</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#111", letterSpacing: "-0.01em" }}>
                Need monthly payments? Finance through Cherry
              </p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "Montserrat, sans-serif", color: "#777" }}>
                Split any program into monthly installments — 0% APR options available. Apply in 60 seconds, no hard credit pull.
              </p>
            </div>
            <a
              href="https://www.withcherry.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 sm:flex-shrink rounded-full font-bold text-xs px-4 py-2 transition-all hover:opacity-90 w-full sm:w-auto text-center"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                color: "#fff",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              Apply Now
            </a>
          </div>
          <p className="text-[10px] text-gray-400" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Cherry financing is subject to credit approval. HSA/FSA cards accepted directly.
          </p>
        </div>

      </div>
    </section>
  );
}

// ── Reusable card sub-component ──────────────────────────────────────────────
interface Feature { text: string; sub?: string; badge?: string }
interface MedBadge { label: string; color: string; bg: string; dot: string }

function TierCard({
  hero = false,
  title,
  description,
  medicationBadge,
  price,
  basePrice,
  term,
  savings,
  total,
  features,
  addOn,
  ctaLabel,
  ctaStyle,
  checkColor,
  checkBg,
  savingsColor,
  monthsFreeLabel,
  onConsultClick,
}: {
  hero?: boolean;
  title: string;
  description: string;
  medicationBadge: MedBadge;
  price: number;
  basePrice: number;
  term: Term;
  savings: number;
  total: number;
  features: Feature[];
  addOn?: string;
  ctaLabel: string;
  ctaStyle: "outline" | "hero" | "dark";
  checkColor: string;
  checkBg: string;
  savingsColor: string;
  monthsFreeLabel?: string;
  onConsultClick: () => void;
}) {
  const isDark = hero;
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "#2A2A35";
  const subColor  = isDark ? "rgba(255,255,255,0.5)"  : "#9CA3AF";

  return (
    <div
      className="rounded-2xl flex flex-col relative"
      style={{
        background: isDark ? "#0D0F1C" : "#fff",
        border: isDark ? "2.5px solid #E8339E" : "1.5px solid #E2E2EA",
        padding: isDark ? "40px 30px 34px" : "34px 28px 30px",
        boxShadow: isDark
          ? "0 0 0 5px rgba(232,51,158,0.10), 0 24px 64px rgba(122,30,126,0.22)"
          : undefined,
      }}
    >
      {/* Title */}
      <div
        className="font-extrabold tracking-widest uppercase mb-4 text-xs"
        style={
          isDark
            ? {
                background: "linear-gradient(135deg, #E8339E, #B06FE8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "2.5px",
              }
            : { color: "#111", letterSpacing: "2.5px" }
        }
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {/* Price row — total upfront as primary */}
      <div className="flex items-end gap-1 mb-0.5">
        <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: isDark ? "#fff" : "#111" }}>$</span>
        <span
          className="font-black leading-none transition-all"
          style={{ fontSize: 56, color: isDark ? "#fff" : "#111", letterSpacing: "-3px" }}
        >
          {total.toLocaleString()}
        </span>
      </div>

      {/* Per-month equivalent & savings */}
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span
          className="text-xs font-semibold"
          style={{ color: subColor, fontSize: 12 }}
        >
          ${price}/mo equivalent
        </span>
        {monthsFreeLabel ? (
          <span
            className="inline-flex items-center gap-1 text-xs font-extrabold rounded-full px-2.5 py-0.5"
            style={{
              background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
              color: "#fff",
              fontSize: 10,
              letterSpacing: "0.5px",
            }}
          >
            🎉 {monthsFreeLabel}
          </span>
        ) : savings > 0 ? (
          <span
            className="text-xs font-extrabold"
            style={{ color: savingsColor }}
          >
            Save ${savings.toLocaleString()}
          </span>
        ) : null}
      </div>

      {/* Description */}
      <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: subColor }}>
        {description}
      </p>

      {/* Medication badge */}
      <div
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
        style={{ background: medicationBadge.bg, color: medicationBadge.color, letterSpacing: "1px" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: medicationBadge.dot }}
        />
        {medicationBadge.label}
      </div>

      <hr style={{ border: "none", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#EBEBF0"}`, marginBottom: 20 }} />

      {/* Feature list */}
      <ul className="flex flex-col gap-2 mb-3 flex-1">
        {features.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
              style={{ width: 19, height: 19, background: checkBg }}
            >
              <Check size={10} color={checkColor} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-semibold leading-snug" style={{ color: textColor }}>
              {item.text}
              {item.sub && (
                <span
                  className="block font-bold uppercase tracking-wide mt-0.5"
                  style={{ color: checkColor, fontSize: 10 }}
                >
                  {item.sub}
                </span>
              )}
              {item.badge && (
                <span
                  className="inline-block font-bold uppercase rounded ml-1.5"
                  style={{
                    fontSize: 10,
                    background: isDark ? "rgba(232,51,158,0.15)" : "rgba(122,30,126,0.1)",
                    color: checkColor,
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

      {/* Add-on note */}
      {addOn && (
        <div
          className="rounded-lg text-xs font-medium leading-relaxed mb-3"
          style={{ background: "#f3f4f6", color: "#555", padding: "10px 14px" }}
          dangerouslySetInnerHTML={{ __html: addOn }}
        />
      )}

      {/* CTA button */}
      <a
        onClick={onConsultClick}
        className="block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
        style={{
          padding: "15px",
          fontSize: 12,
          letterSpacing: "1.5px",
          textDecoration: "none",
          ...(ctaStyle === "hero"
            ? {
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                color: "#fff",
                border: "none",
                boxShadow: "0 8px 28px rgba(232,51,158,0.38)",
              }
            : ctaStyle === "dark"
            ? {
                background: "#111",
                color: "#fff",
                border: "2px solid #111",
              }
            : {
                background: "transparent",
                color: "#111",
                border: "2px solid #111",
              }),
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
