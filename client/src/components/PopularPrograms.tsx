/* =============================================================================
   Popular Programs — MedMethod Direct — v2.13 (Conversion-Optimized)
   Simplified: Tabs → Term Toggle → Trust → Cards
   
   Conversion optimizations:
   1. Simplified cards (removed description, medications section)
   2. Unified CTA: "Book Free Consult"
   3. Visual hierarchy: RECOMMENDED badge on Semaglutide (Tab 1 middle card)
   4. Removed $449 initiation fee from cards
   5. Micro-trust element above cards
   6. Single-card tab: wider card + nudge to integrated tab
   7. Soft urgency near CTA

   - Tab 1: "Weight Loss" → T1 Mentorship, T2A Sema (RECOMMENDED), T2B Tirz
   - Tab 2: "Weight Loss + Hormones" → T1 Mentorship, T2A+Starter (MOST POPULAR), T2B+Starter (FLAGSHIP)
   - Tab 3: "Hormones Only" → HRT Starter + nudge

   Term toggle: 3 / 6 / 12 months — savings baked into buttons.
   ============================================================================= */
import { useState } from "react";
import { Check, Shield, Star, ArrowRight } from "lucide-react";

// ── Pricing Data ────────────────────────────────────────────────────────────
type Term = 3 | 6 | 12;
type TierKey = "t1" | "t2a" | "t2b" | "t2a_starter" | "t2b_starter" | "hrt";

const BASE_PRICES: Record<TierKey, number> = {
  t1: 199,
  t2a: 399,
  t2b: 669,
  t2a_starter: 528,
  t2b_starter: 798,
  hrt: 328,
};

const DISCOUNTS: Record<Term, number> = {
  3: 0,
  6: 0.05,
  12: 0.10,
};

function monthlyRate(tier: TierKey, term: Term): number {
  return +(BASE_PRICES[tier] * (1 - DISCOUNTS[term])).toFixed(2);
}

function upfrontTotal(tier: TierKey, term: Term): number {
  return +(monthlyRate(tier, term) * term).toFixed(2);
}

function totalSavings(tier: TierKey, term: Term): number {
  return +((BASE_PRICES[tier] * term) - upfrontTotal(tier, term)).toFixed(2);
}

// ── Tier Definitions ────────────────────────────────────────────────────────
interface TierDef {
  key: TierKey;
  label: string;
  subtitle: string;
  badge?: "RECOMMENDED" | "MOST POPULAR" | "FLAGSHIP";
  dark?: boolean;
  highlighted?: boolean;
  features: string[];
}

// Tab 1: Weight Loss
const WEIGHT_LOSS_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Clinical oversight · meds called to your pharmacy",
    features: [
      "Physician-managed clinical oversight",
      "Bi-weekly wellness advisor coaching",
      "Quarterly MD strategy session",
      "Rx called to your local pharmacy",
    ],
  },
  {
    key: "t2a",
    label: "Semaglutide",
    subtitle: "GLP-1 weight loss · medications included",
    badge: "RECOMMENDED",
    highlighted: true,
    features: [
      "Everything in Mentorship",
      "Semaglutide+B12 shipped monthly",
      "Personalized titration protocol",
      "Drug price locked — no escalation",
    ],
  },
  {
    key: "t2b",
    label: "Tirzepatide",
    subtitle: "Premium dual-action GLP-1 · medications included",
    features: [
      "Everything in Mentorship",
      "Tirzepatide+niacinamide shipped monthly",
      "Enhanced titration protocol",
      "For higher BMI or sema plateau",
    ],
  },
];

// Tab 2: Weight Loss + Hormones
const INTEGRATED_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Clinical oversight · meds called to your pharmacy",
    features: [
      "GLP-1 + hormone protocol management",
      "Bi-weekly wellness advisor coaching",
      "Quarterly MD strategy session",
      "Rx called to your local pharmacy",
    ],
  },
  {
    key: "t2a_starter",
    label: "Sema · Starter",
    subtitle: "Semaglutide + Estradiol + Progesterone",
    badge: "MOST POPULAR",
    highlighted: true,
    features: [
      "Everything in Mentorship",
      "Semaglutide+B12 shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
    ],
  },
  {
    key: "t2b_starter",
    label: "Tirz · Starter",
    subtitle: "Tirzepatide + Estradiol + Progesterone",
    badge: "FLAGSHIP",
    dark: true,
    features: [
      "Everything in Mentorship",
      "Tirzepatide+niacinamide shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
    ],
  },
];

// Tab 3: Hormones Only
const HRT_TIER: TierDef = {
  key: "hrt",
  label: "HRT Starter",
  subtitle: "Estradiol patch + Progesterone · no weight loss medication",
  features: [
    "Physician-managed clinical oversight",
    "Bi-weekly wellness advisor coaching",
    "Estradiol patch (transdermal)",
    "Micronized progesterone (oral)",
  ],
};

// ── Tab type ────────────────────────────────────────────────────────────────
type TabId = "weight_loss" | "integrated" | "hrt_only";

// ── Component ───────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);
  const [activeTab, setActiveTab] = useState<TabId>("weight_loss");

  return (
    <section
      className="py-16 lg:py-24 px-4"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "weight_loss" as TabId, label: "Weight Loss" },
            { id: "integrated" as TabId, label: "Weight Loss + Hormones" },
            { id: "hrt_only" as TabId, label: "Hormones Only" },
          ].map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="rounded-full font-bold transition-all"
                style={{
                  padding: "12px 28px",
                  fontSize: 13,
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

        {/* ── Term Toggle (savings baked in) ──────────────────────────────── */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="rounded-2xl p-1.5 flex gap-1"
            style={{ background: "#E4E4EE" }}
          >
            {([3, 6, 12] as Term[]).map((t) => {
              const active = term === t;
              return (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className="relative rounded-xl transition-all flex flex-col items-center justify-center"
                  style={{
                    padding: "10px 28px",
                    background: active
                      ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                      : "transparent",
                    color: active ? "#fff" : "#555",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 130,
                  }}
                >
                  <span className="font-bold" style={{ fontSize: 14 }}>
                    {t} Months
                  </span>
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: 10,
                      marginTop: 2,
                      color: active ? "rgba(255,255,255,0.85)" : "#16A34A",
                      opacity: t === 3 ? 0.6 : 1,
                    }}
                  >
                    {t === 3 ? "Baseline" : t === 6 ? "Save 5%" : "Save 10%"}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            Paid in full at enrollment
          </p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Drug pricing locked for your term. Labs billed $299 as ordered. HSA/FSA accepted.
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Prefer monthly payments?{" "}
            <a
              href="https://www.withcherry.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-[#E8339E] transition-colors"
              style={{ color: "#E8339E" }}
            >
              Financing available through Cherry
            </a>
          </p>
        </div>

        {/* ── Micro-trust ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <Shield size={14} color="#E8339E" strokeWidth={2} />
            <span className="text-xs font-semibold text-gray-600">Trusted by 10,000+ women</span>
          </div>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1">
            <Star size={14} color="#E8339E" strokeWidth={2} fill="#E8339E" />
            <span className="text-xs font-semibold text-gray-600">4.9 rating</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-semibold text-gray-600">8 states</span>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
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
            {/* Nudge toward integrated tab */}
            <button
              onClick={() => setActiveTab("integrated")}
              className="mt-5 flex items-center justify-center gap-2 mx-auto text-sm font-semibold transition-colors hover:text-[#E8339E]"
              style={{ color: "#777", cursor: "pointer", background: "none", border: "none" }}
            >
              Want weight loss too? See Weight Loss + Hormones
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
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
  const { key, label, subtitle, badge, dark, highlighted, features } = tier;
  const isDark = !!dark;
  const isHighlighted = !!highlighted;
  const monthly = monthlyRate(key, term);
  const total = upfrontTotal(key, term);
  const savings = totalSavings(key, term);
  const baseMonthly = BASE_PRICES[key];

  const textColor = isDark ? "rgba(255,255,255,0.9)" : "#2A2A35";
  const subColor = isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF";
  const checkColor = "#E8339E";
  const checkBg = isDark ? "rgba(232,51,158,0.2)" : "rgba(232,51,158,0.08)";

  // Visual hierarchy: highlighted cards get pink border, dark cards get dark treatment
  const cardBorder = isDark
    ? "2px solid rgba(232,51,158,0.4)"
    : isHighlighted
    ? "2px solid #E8339E"
    : "1.5px solid #E2E2EA";

  const cardShadow = isDark
    ? "0 0 0 4px rgba(232,51,158,0.08), 0 20px 50px rgba(13,27,42,0.3)"
    : isHighlighted
    ? "0 0 0 3px rgba(232,51,158,0.08), 0 8px 32px rgba(232,51,158,0.12)"
    : "0 2px 12px rgba(0,0,0,0.04)";

  return (
    <div
      className="rounded-2xl flex flex-col relative"
      style={{
        background: isDark ? "#0D1B2A" : "#fff",
        border: cardBorder,
        padding: "32px 26px 28px",
        boxShadow: cardShadow,
        transform: isHighlighted && !isDark ? "scale(1.02)" : undefined,
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest"
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

      {/* Title */}
      <h3
        className="font-bold mb-1"
        style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)", color: isDark ? "#fff" : "#111" }}
      >
        {label}
      </h3>
      <p className="text-xs italic mb-5" style={{ color: subColor }}>{subtitle}</p>

      {/* Price */}
      <div className="mb-1">
        {term > 3 && (
          <p className="text-xs line-through mb-0.5" style={{ color: subColor }}>
            ${baseMonthly}/mo
          </p>
        )}
        <div className="flex items-end gap-0.5">
          <span className="font-black leading-none" style={{ fontSize: 48, color: isDark ? "#fff" : "#111", letterSpacing: "-2px" }}>
            ${Math.floor(monthly)}
          </span>
          <span className="text-sm font-semibold pb-2" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
            .{(monthly % 1).toFixed(2).slice(2)}/mo
          </span>
        </div>
      </div>

      {/* Upfront total */}
      <p className="text-xs font-medium mb-1" style={{ color: subColor }}>
        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} upfront · {term} months
      </p>

      {/* Savings chip */}
      {savings > 0 && (
        <span
          className="inline-block rounded text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 mb-4 w-fit"
          style={{
            border: "1.5px solid #16A34A",
            color: "#16A34A",
          }}
        >
          SAVE ${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}
      {savings === 0 && <div className="mb-4" />}

      {/* Feature list */}
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {features.map((text, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
              style={{ width: 18, height: 18, background: checkBg }}
            >
              <Check size={10} color={checkColor} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-medium leading-snug" style={{ color: textColor }}>
              {text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        onClick={onConsultClick}
        className="block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer mt-auto"
        style={{
          padding: "14px",
          fontSize: 11,
          letterSpacing: "1.5px",
          textDecoration: "none",
          ...(isDark || isHighlighted
            ? {
                backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                color: "#fff",
                border: "none",
                boxShadow: "0 6px 24px rgba(232,51,158,0.3)",
              }
            : {
                background: "transparent",
                color: "#111",
                border: "2px solid #111",
              }),
        }}
      >
        Book Free Consult
      </a>

      {/* Soft urgency */}
      <p className="text-[10px] text-center mt-2.5 font-medium" style={{ color: subColor }}>
        Limited new patient slots available
      </p>
    </div>
  );
}
