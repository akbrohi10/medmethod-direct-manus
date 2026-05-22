/* =============================================================================
   Popular Programs — MedMethod Direct — v2.16 (Compact Hybrid)
   
   Layout: Header → Subtitle → Tabs → Toggle (with from-prices + badges) →
           Savings banner → Cherry link → Cards

   Compact, decisive, old-style toggle feel with new 3-tab + value-stack cards.
   ============================================================================= */
import { useState } from "react";
import { Check, Stethoscope, Dumbbell, MessageCircle, UserCheck, ArrowRight } from "lucide-react";

// ── Pricing Data ────────────────────────────────────────────────────────────
type Term = 3 | 6 | 12;
type TierKey = "t1" | "t2a" | "t2b" | "t2a_starter" | "t2b_starter" | "hrt";

// Mentorship fee per term (whole dollar rounding from chart)
const MENTORSHIP_FEE: Record<Term, number> = { 3: 199, 6: 189, 12: 179 };

// SlimMethod (t2a): Mentorship + Semaglutide Injection
// Chart: 3mo=$399, 6mo=$379, 12mo=$359
const SLIM_DRUG: Record<Term, number> = { 3: 200, 6: 190, 12: 180 };

// SlimMethod Oral (T2A-Oral): Mentorship + Semaglutide Oral
// Chart: 3mo=$368, 6mo=$350, 12mo=$331
const SLIM_DRUG_ORAL: Record<Term, number> = { 3: 169, 6: 161, 12: 152 };
const SLIM_TOTAL_ORAL: Record<Term, number> = { 3: 368, 6: 350, 12: 331 };

// AccelerateMethod (t2b): Mentorship + Tirzepatide Injection
// Chart: 3mo=$509, 6mo=$484, 12mo=$458
const ACCELERATE_DRUG: Record<Term, number> = { 3: 310, 6: 295, 12: 279 };

// AccelerateMethod Oral (T2B-Oral): Mentorship + Tirzepatide Oral
// Chart: 3mo=$468, 6mo=$445, 12mo=$421
const ACCELERATE_DRUG_ORAL: Record<Term, number> = { 3: 269, 6: 256, 12: 242 };
const ACCELERATE_TOTAL_ORAL: Record<Term, number> = { 3: 468, 6: 445, 12: 421 };

// RestoreMethod (t2a_starter): Mentorship + Sema Inj + HRT Drug
// Chart Drug+HRT total: 3mo=$329, 6mo=$313, 12mo=$296
const RESTORE_DRUG_TOTAL: Record<Term, number> = { 3: 329, 6: 313, 12: 296 };
// HRT portion placeholder — user to provide Estradiol + Progesterone cost
const RESTORE_HRT: Record<Term, number> = { 3: 129, 6: 123, 12: 116 };

// RestoreMethod Oral (T2A+S-Oral): Mentorship + Sema Oral + HRT Drug
// Chart: 3mo=$497, 6mo=$472, 12mo=$447
const RESTORE_TOTAL_ORAL: Record<Term, number> = { 3: 497, 6: 472, 12: 447 };
// Oral drug portion = total - membership; HRT stays same, sema oral portion = total drug - HRT
const RESTORE_SEMA_ORAL: Record<Term, number> = { 3: 169, 6: 160, 12: 152 }; // = SLIM_DRUG_ORAL
const RESTORE_HRT_ORAL: Record<Term, number> = { 3: 129, 6: 123, 12: 116 }; // HRT same as injectable

// LongevityMethod (t2b_starter): Mentorship + Tirz Inj + HRT Drug
// Chart Drug+HRT total: 3mo=$440, 6mo=$418, 12mo=$396
const LONGEVITY_DRUG_TOTAL: Record<Term, number> = { 3: 440, 6: 418, 12: 396 };
// HRT portion placeholder — user to provide Estradiol + Progesterone cost
const LONGEVITY_HRT: Record<Term, number> = { 3: 130, 6: 123, 12: 117 };

// LongevityMethod Oral (T2B+S-Oral): Mentorship + Tirz Oral + HRT Drug
// Chart: 3mo=$597, 6mo=$567, 12mo=$537
const LONGEVITY_TOTAL_ORAL: Record<Term, number> = { 3: 597, 6: 567, 12: 537 };
const LONGEVITY_TIRZ_ORAL: Record<Term, number> = { 3: 269, 6: 255, 12: 242 }; // = ACCELERATE_DRUG_ORAL
const LONGEVITY_HRT_ORAL: Record<Term, number> = { 3: 129, 6: 123, 12: 116 }; // HRT same as injectable

// Explicit total monthly rates per tier per term (from chart, whole dollar rounding)
const TIER_MONTHLY: Record<TierKey, Record<Term, number>> = {
  t1:          { 3: 199, 6: 189, 12: 179 },
  t2a:         { 3: 399, 6: 379, 12: 359 },
  t2b:         { 3: 509, 6: 484, 12: 458 },
  t2a_starter: { 3: 528, 6: 502, 12: 475 },
  t2b_starter: { 3: 639, 6: 607, 12: 575 },
  hrt:         { 3: 328, 6: 312, 12: 295 },
};

// Base prices (3-month baseline) for savings calculation
const BASE_PRICES: Record<TierKey, number> = {
  t1: 199,
  t2a: 399,
  t2b: 509,
  t2a_starter: 528,
  t2b_starter: 639,
  hrt: 328,
};

function monthlyRate(tier: TierKey, term: Term): number {
  return TIER_MONTHLY[tier][term];
}

function upfrontTotal(tier: TierKey, term: Term): number {
  return monthlyRate(tier, term) * term;
}

function totalSavings(tier: TierKey, term: Term): number {
  return (BASE_PRICES[tier] * term) - upfrontTotal(tier, term);
}

// ── Universal value props ───────────────────────────────────────────────────
const UNIVERSAL_VALUE = [
  { icon: Stethoscope, text: "Same doctor every visit — gets to know you" },
  { icon: UserCheck, text: "Performance coach (bi-weekly virtual weigh-in)" },
  { icon: Dumbbell, text: "Custom exercise + nutrition plan" },
  { icon: MessageCircle, text: "Direct text access to your care team" },
];

// ── Tier Definitions ────────────────────────────────────────────────────────
interface TierDef {
  key: TierKey;
  label: string;
  subtitle: string;
  badge?: "RECOMMENDED" | "MOST POPULAR" | "FLAGSHIP";
  dark?: boolean;
  highlighted?: boolean;
  medication: string[];
  brandName?: [string, string]; // [prefix, suffix] e.g. ["Slim", "Method"]
  drugHighlight?: string; // drug name to highlight in the subtitle
}

// Tab 1: Weight Loss
const WEIGHT_LOSS_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Physician-led · medication delivered your way · coaching included",
    medication: [
      "Your doctor writes and manages your prescription",
      "Shipped via LillyDirect, NovoCare, or our compounding pharmacy — or called to your local pharmacy",
      "Meds not included in price",
    ],
  },
  {
    key: "t2a",
    label: "Semaglutide",
    subtitle: "Semaglutide · GLP-1 weight loss · medications included",
    badge: "RECOMMENDED",
    highlighted: true,
    brandName: ["Slim", "Method"],
    drugHighlight: "Semaglutide",
    medication: [
      "Semaglutide + B12 shipped monthly",
      "Personalized dosing plan",
      "Dose changes. Price doesn't.",
    ],
  },
  {
    key: "t2b",
    label: "Tirzepatide",
    subtitle: "Tirzepatide · GLP-1/GIP weight loss · medications included",
    brandName: ["Accelerate", "Method"],
    drugHighlight: "Tirzepatide",
    medication: [
      "Tirzepatide + niacinamide shipped monthly",
      "Personalized dosing plan",
      "Dose changes. Price doesn't.",
    ],
  },
];

// Tab 2: Weight Loss + Hormones
const INTEGRATED_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Physician-led · medication delivered your way · coaching included",
    medication: [
      "Your doctor writes and manages your prescription",
      "Shipped via LillyDirect, NovoCare, or our compounding pharmacy — or called to your local pharmacy",
      "Meds not included in price",
    ],
  },
  {
    key: "t2a_starter",
    label: "Sema · Starter",
    subtitle: "Semaglutide + Estradiol + Progesterone · medications included",
    badge: "MOST POPULAR",
    highlighted: true,
    brandName: ["Restore", "Method"],
    drugHighlight: "Semaglutide",
    medication: [
      "Semaglutide + B12 shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
      "Dose changes. Price doesn't.",
    ],
  },
  {
    key: "t2b_starter",
    label: "Tirz · Starter",
    subtitle: "Tirzepatide + Estradiol + Progesterone · medications included",
    badge: "FLAGSHIP",
    dark: true,
    brandName: ["Longevity", "Method"],
    drugHighlight: "Tirzepatide",
    medication: [
      "Tirzepatide + niacinamide shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
      "Dose changes. Price doesn't.",
    ],
  },
];

// Tab 3: Hormones Only
const HRT_TIER: TierDef = {
  key: "hrt",
  label: "HRT Starter",
  subtitle: "Estradiol + Progesterone · medications included",
  brandName: ["Thrive", "Method"],
  drugHighlight: "Estradiol",
  medication: [
    "Estradiol patch (transdermal)",
    "Micronized progesterone (oral)",
"Dose changes. Price doesn't."
  ],
};

// ── Tab type ────────────────────────────────────────────────────────────────
type TabId = "weight_loss" | "integrated" | "hrt_only";


// ── Component ───────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);
  const [activeTab, setActiveTab] = useState<TabId>("weight_loss");
  const [fadeKey, setFadeKey] = useState(0);

  const switchTab = (id: TabId) => {
    setActiveTab(id);
    setFadeKey((k) => k + 1);
  };


  return (
    <section
      className="pt-16 lg:pt-24 pb-6 px-4"
      style={{ background: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <h2
            className="font-black uppercase tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "#111", letterSpacing: "-0.5px" }}
          >
            Popular Programs
          </h2>
          <p className="text-sm text-gray-500 mt-2">
Physician-led care, medication, and coaching — all in one program.
          </p>
        </div>

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 px-1">
          {[
            { id: "weight_loss" as TabId, label: "Weight Loss" },
            { id: "integrated" as TabId, label: "Weight Loss + Hormones" },
            { id: "hrt_only" as TabId, label: "Hormones Only" },
          ].map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className="rounded-full font-bold transition-all"
                style={{
                  padding: "9px 16px",
                  fontSize: 12,
                  letterSpacing: "0.3px",
                  background: active
                    ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                    : "#fff",
                  color: active ? "#fff" : "#555",
                  border: active ? "none" : "1.5px solid #E2E2EA",
                  cursor: "pointer",
                  boxShadow: active ? "0 4px 16px rgba(232,51,158,0.25)" : undefined,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── "CHOOSE YOUR COMMITMENT" label ─────────────────────────────── */}
        <p
          className="text-center font-extrabold uppercase tracking-widest mb-3"
          style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}
        >
          Choose your commitment
        </p>

        {/* ── Term Toggle (old-style with from-prices + badges) ──────────── */}
        <div className="flex justify-center mb-3 px-2">
          <div
            className="rounded-2xl p-1.5 flex gap-0 relative w-full max-w-sm sm:max-w-none sm:w-auto"
            style={{ background: "#E4E4EE" }}
          >
            {([3, 6, 12] as Term[]).map((t) => {
              const active = term === t;
              const badge = t === 6 ? "MOST POPULAR" : t === 12 ? "BEST VALUE" : null;
              return (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className="relative rounded-xl transition-all flex flex-col items-center justify-center flex-1"
                  style={{
                    padding: "12px 16px 10px",
                    background: active
                      ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                      : "transparent",
                    color: active ? "#fff" : "#555",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 0,
                  }}
                >
                  {/* Badge above button */}
                  {badge && (
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap"
                      style={{
                        background: t === 6 ? "#E8339E" : "#111",
                        color: "#fff",
                        letterSpacing: "1px",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                  <span className="font-bold" style={{ fontSize: 15 }}>
                    {t} Months
                  </span>
                  <span
                    className="font-semibold mt-0.5"
                    style={{
                      fontSize: 12,
                      color: active ? "rgba(255,255,255,0.8)" : t === 3 ? "#777" : "#16A34A",
                    }}
                  >
                    {t === 3 ? "Baseline" : t === 6 ? "Save 5%" : "Save 10%"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Recommended note ────────────────────────────────────────────── */}
        {term === 6 && (
          <p className="text-center text-sm italic text-gray-500 mb-3">
            Recommended — full transformation window
          </p>
        )}


        {/* ── Cherry financing + drug price locked ────────────────────────── */}
        <div className="text-center mb-8 space-y-1">
          <p className="text-sm text-gray-600 font-medium">
            Drug pricing locked for your term. Labs billed $299 as ordered. HSA/FSA accepted.
          </p>
          <p className="text-sm text-gray-500">
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
          </p>
        </div>

        {/* ── Cards (with fade) ───────────────────────────────────────────── */}
        <div key={fadeKey} className="animate-fade-in">
          {activeTab === "weight_loss" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {WEIGHT_LOSS_TIERS.map((tier) => (
                <TierCard key={tier.key} tier={tier} term={term} onConsultClick={onConsultClick} />
              ))}
            </div>
          )}

          {activeTab === "integrated" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {INTEGRATED_TIERS.map((tier) => (
                <TierCard key={`int_${tier.key}`} tier={tier} term={term} onConsultClick={onConsultClick} />
              ))}
            </div>
          )}

          {activeTab === "hrt_only" && (
            <div className="max-w-lg mx-auto">
              <TierCard tier={HRT_TIER} term={term} onConsultClick={onConsultClick} />
              <button
                onClick={() => switchTab("integrated")}
                className="mt-5 flex items-center justify-center gap-2 mx-auto text-sm font-semibold transition-colors hover:text-[#E8339E]"
                style={{ color: "#777", cursor: "pointer", background: "none", border: "none" }}
              >
                Want weight loss too? See Weight Loss + Hormones
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}

// ── Tier Card Sub-Component ─────────────────────────────────────────────────
function TierCard({
  tier,
  term,
  onConsultClick,
}: {
  tier: TierDef;
  term: Term;
  onConsultClick: () => void;
}) {
  const { key, label, subtitle, badge, dark, highlighted, medication, brandName, drugHighlight } = tier;
  const isDark = !!dark;
  const isHighlighted = !!highlighted;

  // Injectable/Oral toggle — for t2a, t2b, t2a_starter, t2b_starter
  const hasOralOption = key === "t2a" || key === "t2b" || key === "t2a_starter" || key === "t2b_starter";
  const [isOral, setIsOral] = useState(false);

  // Compute effective pricing based on oral toggle
  const effectiveMonthly = hasOralOption && isOral
    ? (key === "t2a" ? SLIM_TOTAL_ORAL[term]
      : key === "t2b" ? ACCELERATE_TOTAL_ORAL[term]
      : key === "t2a_starter" ? RESTORE_TOTAL_ORAL[term]
      : LONGEVITY_TOTAL_ORAL[term])
    : monthlyRate(key, term);
  const effectiveDrug = hasOralOption && isOral
    ? (key === "t2a" ? SLIM_DRUG_ORAL[term]
      : key === "t2b" ? ACCELERATE_DRUG_ORAL[term]
      : key === "t2a_starter" ? RESTORE_SEMA_ORAL[term]
      : LONGEVITY_TIRZ_ORAL[term])
    : (key === "t2a" ? SLIM_DRUG[term]
      : key === "t2b" ? ACCELERATE_DRUG[term]
      : 0);
  const effectiveBaseMonthly = hasOralOption && isOral
    ? (key === "t2a" ? SLIM_TOTAL_ORAL[3]
      : key === "t2b" ? ACCELERATE_TOTAL_ORAL[3]
      : key === "t2a_starter" ? RESTORE_TOTAL_ORAL[3]
      : LONGEVITY_TOTAL_ORAL[3])
    : BASE_PRICES[key];

  const monthly = effectiveMonthly;
  const total = monthly * term;
  const savings = (effectiveBaseMonthly * term) - total;
  const baseMonthly = effectiveBaseMonthly;

  const subColor = isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF";

  const cardBorder = isDark
    ? "2px solid rgba(232,51,158,0.4)"
    : isHighlighted
    ? "2px solid #E8339E"
    : "1.5px solid #D1D1DB";

  const cardShadow = isDark
    ? "0 0 0 4px rgba(232,51,158,0.08), 0 20px 50px rgba(13,27,42,0.3)"
    : isHighlighted
    ? "0 0 0 3px rgba(232,51,158,0.08), 0 8px 32px rgba(232,51,158,0.12)"
    : "0 2px 12px rgba(0,0,0,0.04)";

  return (
    <div
      className={`rounded-2xl flex flex-col relative ${
        isHighlighted && !isDark ? "lg:scale-[1.02]" : ""
      }`}
      style={{
        background: isDark ? "#0D1B2A" : "#fff",
        border: cardBorder,
        padding: "28px 22px 24px",
        boxShadow: cardShadow,
        overflow: "visible",
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest"
          style={{
            background: badge === "FLAGSHIP"
              ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
              : "#E8339E",
            color: "#fff",
            letterSpacing: "1.5px",
          }}
        >
          ★ {badge}
        </div>
      )}

      {/* Brand Name (split-color) or fallback to label */}
      {brandName ? (
        <h3
          className="font-black mb-1"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.5px", lineHeight: 1.1 }}
        >
          <span style={{ color: isDark ? "#fff" : "#111" }}>{brandName[0]}</span>
          <span style={{ color: isDark ? "#f472b6" : "#E8339E" }}>{brandName[1]}</span>
        </h3>
      ) : (
        <h3
          className="font-bold mb-0.5"
          style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)", color: isDark ? "#fff" : "#111" }}
        >
          {label}
        </h3>
      )}

      {/* Subtitle with drug highlight + medications included */}
      <p className="text-[13px] font-medium mb-4" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
        {(() => {
          let parts = subtitle;
          const elements: React.ReactNode[] = [];
          let idx = 0;

          // Highlight drug name
          if (drugHighlight && parts.includes(drugHighlight)) {
            const [before, after] = parts.split(drugHighlight);
            if (before) elements.push(<span key={idx++}>{before}</span>);
            elements.push(
              <span key={idx++} className="font-bold" style={{ color: isDark ? "#fff" : "#111", fontSize: "14px" }}>
                {drugHighlight}
              </span>
            );
            parts = after;
          }

          // Highlight "medications included"
          if (parts.includes("medications included")) {
            const [before, after] = parts.split("medications included");
            if (before) elements.push(<span key={idx++}>{before}</span>);
            elements.push(
              <span key={idx++} className="font-bold" style={{ color: isDark ? "#f472b6" : "#E8339E" }}>
                medications included
              </span>
            );
            if (after) elements.push(<span key={idx++}>{after}</span>);
          } else {
            if (elements.length === 0) {
              elements.push(<span key={idx++}>{parts}</span>);
            } else {
              elements.push(<span key={idx++}>{parts}</span>);
            }
          }

          return elements;
        })()}
      </p>

      {/* Injectable / Oral toggle — SlimMethod & AccelerateMethod only */}
      {hasOralOption && (
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => setIsOral(false)}
            className="flex-1 py-1 rounded-l-full text-[12px] font-bold uppercase tracking-wide transition-all"
            style={{
              background: !isOral ? (isDark ? "#E8339E" : "#E8339E") : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"),
              color: !isOral ? "#fff" : (isDark ? "rgba(255,255,255,0.5)" : "#999"),
              border: "none",
            }}
          >
            💉 Injectable
          </button>
          <button
            onClick={() => setIsOral(true)}
            className="flex-1 py-1 rounded-r-full text-[12px] font-bold uppercase tracking-wide transition-all"
            style={{
              background: isOral ? (isDark ? "#E8339E" : "#E8339E") : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"),
              color: isOral ? "#fff" : (isDark ? "rgba(255,255,255,0.5)" : "#999"),
              border: "none",
            }}
          >
            💊 Oral
          </button>
        </div>
      )}

      {/* ── Price Section ─────────────────────────────────────────── */}
      <div className="mb-1">
        {term > 3 && (
          <p className="text-[13px] line-through mb-0.5" style={{ color: subColor }}>
            ${baseMonthly}/mo
          </p>
        )}
        <div className="flex items-end gap-0.5">
          <span className="font-black leading-none" style={{ fontSize: 40, color: isDark ? "#fff" : "#111", letterSpacing: "-2px" }}>
            ${Math.floor(monthly)}
          </span>
          <span className="text-sm font-semibold pb-1" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            /mo
          </span>
        </div>
      </div>

      {/* Price breakdown — SlimMethod */}
      {key === "t2a" && (
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Membership</span>
            <span className="font-semibold">${MENTORSHIP_FEE[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>{isOral ? "Semaglutide Oral" : "Semaglutide + B12"}</span>
            <span className="font-semibold">${effectiveDrug}</span>
          </div>
        </div>
      )}

      {/* Price breakdown — AccelerateMethod */}
      {key === "t2b" && (
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Membership</span>
            <span className="font-semibold">${MENTORSHIP_FEE[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>{isOral ? "Tirzepatide Oral" : "Tirzepatide + Niacinamide"}</span>
            <span className="font-semibold">${effectiveDrug}</span>
          </div>
        </div>
      )}

      {/* Price breakdown — RestoreMethod */}
      {key === "t2a_starter" && (
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Membership</span>
            <span className="font-semibold">${MENTORSHIP_FEE[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>{isOral ? "Semaglutide Oral" : "Semaglutide + B12"}</span>
            <span className="font-semibold">${isOral ? RESTORE_SEMA_ORAL[term] : SLIM_DRUG[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Estradiol Patch</span>
            <span className="font-semibold">${({ 3: 99, 6: 94, 12: 89 } as Record<Term, number>)[term]}</span>
            <span className="mx-1" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#ddd" }}>·</span>
            <span>Progesterone</span>
            <span className="font-semibold">${({ 3: 30, 6: 29, 12: 27 } as Record<Term, number>)[term]}</span>
          </div>
        </div>
      )}

      {/* Price breakdown — LongevityMethod */}
      {key === "t2b_starter" && (
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Membership</span>
            <span className="font-semibold">${MENTORSHIP_FEE[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>{isOral ? "Tirzepatide Oral" : "Tirzepatide + Niacinamide"}</span>
            <span className="font-semibold">${isOral ? LONGEVITY_TIRZ_ORAL[term] : ACCELERATE_DRUG[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Estradiol Patch</span>
            <span className="font-semibold">${({ 3: 99, 6: 94, 12: 89 } as Record<Term, number>)[term]}</span>
            <span className="mx-1" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#ddd" }}>·</span>
            <span>Progesterone</span>
            <span className="font-semibold">${({ 3: 30, 6: 29, 12: 27 } as Record<Term, number>)[term]}</span>
          </div>
        </div>
      )}

      {/* Price breakdown — ThriveMethod */}
      {key === "hrt" && (
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Membership</span>
            <span className="font-semibold">${MENTORSHIP_FEE[term]}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            <span>Estradiol Patch</span>
            <span className="font-semibold">${({ 3: 99, 6: 94, 12: 89 } as Record<Term, number>)[term]}</span>
            <span className="mx-1" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#ddd" }}>·</span>
            <span>Progesterone</span>
            <span className="font-semibold">${({ 3: 30, 6: 29, 12: 27 } as Record<Term, number>)[term]}</span>
          </div>
        </div>
      )}

      {/* Upfront total */}
      <p className="text-[13px] font-medium mb-1" style={{ color: subColor }}>
        ${Math.round(total).toLocaleString()} upfront · {term} months
      </p>

      {/* Savings chip */}
      {savings > 0 && (
        <span
          className="inline-block rounded text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 mb-4 w-fit"
          style={{ border: "1.5px solid #16A34A", color: "#16A34A" }}
        >
          SAVE ${Math.round(savings).toLocaleString()}
        </span>
      )}
      {savings === 0 && <div className="mb-4" />}

      {/* ── Medication Block ──────────────────────────────────────────── */}
      <div className="mb-3">
        <p
          className="text-[10px] font-extrabold uppercase tracking-widest mb-2"
          style={{ color: isDark ? "rgba(255,255,255,0.55)" : "#777", letterSpacing: "1.2px" }}
        >
          Your medication
        </p>
        <ul className="flex flex-col gap-1.5">
          {medication.map((text) => (
            <li key={text} className="flex items-start gap-2">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                style={{
                  width: 16,
                  height: 16,
                  background: isDark ? "rgba(122,30,126,0.25)" : "rgba(122,30,126,0.08)",
                }}
              >
                <Check size={9} color={isDark ? "#c084fc" : "#7A1E7E"} strokeWidth={2.5} />
              </span>
              <span
                className="text-[13px] font-medium leading-snug"
                style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#444" }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Universal Value Block ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 mb-5 flex-1"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "#F8F8FC",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #EDEDF5",
        }}
      >
        <p
          className="text-[10px] font-extrabold uppercase tracking-widest mb-2"
          style={{ color: isDark ? "rgba(232,51,158,0.9)" : "#E8339E", letterSpacing: "1.2px" }}
        >
          Every program includes
        </p>
        <ul className="flex flex-col gap-2">
          {UNIVERSAL_VALUE.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                style={{
                  width: 18,
                  height: 18,
                  background: isDark ? "rgba(232,51,158,0.15)" : "rgba(232,51,158,0.08)",
                }}
              >
                <Icon size={10} color="#E8339E" strokeWidth={2.5} />
              </span>
              <span
                className="text-[13px] font-medium leading-snug"
                style={{ color: isDark ? "rgba(255,255,255,0.9)" : "#374151" }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={onConsultClick}
        className={`block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer mt-auto ${
          isDark || isHighlighted
            ? "hover:opacity-90 hover:shadow-[0_8px_32px_rgba(232,51,158,0.45)] hover:-translate-y-0.5 active:translate-y-0"
            : "hover:bg-[#E8339E] hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        }`}
        style={{
          padding: "13px",
          fontSize: 11,
          letterSpacing: "1.5px",
          ...(isDark || isHighlighted
            ? {
                backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                color: "#fff",
                border: "none",
                boxShadow: "0 6px 24px rgba(232,51,158,0.3)",
              }
            : {
                background: "transparent",
                color: "#E8339E",
                border: "2px solid #E8339E",
              }),
        }}
      >
        Book Free Consult
      </button>

      {/* Urgency */}
      <p className="text-[9px] text-center mt-2 font-medium" style={{ color: subColor }}>
        Limited new patient slots available
      </p>
    </div>
  );
}
