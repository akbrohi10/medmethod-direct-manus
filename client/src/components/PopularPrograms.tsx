/* =============================================================================
   Popular Programs — MedMethod Direct — v2.14 (Value-First Cards)
   
   Card structure:
   1. Title + subtitle + price
   2. "Every program includes" — universal value block (identical on all cards)
   3. "Your medication" — tier-specific medication info
   4. CTA button + urgency line

   Tabs: Weight Loss | Weight Loss + Hormones | Hormones Only
   Term toggle: 3 / 6 / 12 months with inline savings
   ============================================================================= */
import { useState } from "react";
import { Check, Shield, Star, ArrowRight, Stethoscope, Dumbbell, MessageCircle, Apple, UserCheck } from "lucide-react";

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

// ── Universal value props (same for every card) ─────────────────────────────
const UNIVERSAL_VALUE = [
  { icon: Stethoscope, text: "Same doctor every visit — gets to know you" },
  { icon: UserCheck, text: "Performance coach (bi-weekly virtual weigh-in)" },
  { icon: Apple, text: "Custom nutrition plan" },
  { icon: Dumbbell, text: "Custom exercise program" },
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
}

// Tab 1: Weight Loss
const WEIGHT_LOSS_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Clinical oversight · you source your own GLP-1",
    medication: [
      "Rx managed by your physician",
      "Called to your local pharmacy",
      "Meds not included in price",
    ],
  },
  {
    key: "t2a",
    label: "Semaglutide",
    subtitle: "GLP-1 weight loss · medications included",
    badge: "RECOMMENDED",
    highlighted: true,
    medication: [
      "Semaglutide + B12 shipped monthly",
      "Personalized titration protocol",
      "Price locked — no escalation",
    ],
  },
  {
    key: "t2b",
    label: "Tirzepatide",
    subtitle: "Premium dual-action GLP-1 · medications included",
    medication: [
      "Tirzepatide + niacinamide shipped monthly",
      "Enhanced titration protocol",
      "Price locked — no escalation",
    ],
  },
];

// Tab 2: Weight Loss + Hormones
const INTEGRATED_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Clinical oversight · you source your own GLP-1 + hormones",
    medication: [
      "GLP-1 + hormone Rx managed by your physician",
      "Called to your local pharmacy",
      "Meds not included in price",
    ],
  },
  {
    key: "t2a_starter",
    label: "Sema · Starter",
    subtitle: "Semaglutide + Estradiol + Progesterone",
    badge: "MOST POPULAR",
    highlighted: true,
    medication: [
      "Semaglutide + B12 shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
      "Price locked — no escalation",
    ],
  },
  {
    key: "t2b_starter",
    label: "Tirz · Starter",
    subtitle: "Tirzepatide + Estradiol + Progesterone",
    badge: "FLAGSHIP",
    dark: true,
    medication: [
      "Tirzepatide + niacinamide shipped monthly",
      "Estradiol patch (transdermal)",
      "Micronized progesterone (oral)",
      "Price locked — no escalation",
    ],
  },
];

// Tab 3: Hormones Only
const HRT_TIER: TierDef = {
  key: "hrt",
  label: "HRT Starter",
  subtitle: "Estradiol patch + Progesterone · no weight loss medication",
  medication: [
    "Estradiol patch (transdermal)",
    "Micronized progesterone (oral)",
    "Price locked — no escalation",
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
  const { key, label, subtitle, badge, dark, highlighted, medication } = tier;
  const isDark = !!dark;
  const isHighlighted = !!highlighted;
  const monthly = monthlyRate(key, term);
  const total = upfrontTotal(key, term);
  const savings = totalSavings(key, term);
  const baseMonthly = BASE_PRICES[key];

  const subColor = isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF";

  // Visual hierarchy
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
        padding: "32px 24px 28px",
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
      <p className="text-xs italic mb-4" style={{ color: subColor }}>{subtitle}</p>

      {/* Price */}
      <div className="mb-1">
        {term > 3 && (
          <p className="text-xs line-through mb-0.5" style={{ color: subColor }}>
            ${baseMonthly}/mo
          </p>
        )}
        <div className="flex items-end gap-0.5">
          <span className="font-black leading-none" style={{ fontSize: 44, color: isDark ? "#fff" : "#111", letterSpacing: "-2px" }}>
            ${Math.floor(monthly)}
          </span>
          <span className="text-sm font-semibold pb-1.5" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#555" }}>
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
          className="inline-block rounded text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 mb-5 w-fit"
          style={{ border: "1.5px solid #16A34A", color: "#16A34A" }}
        >
          SAVE ${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}
      {savings === 0 && <div className="mb-5" />}

      {/* ── Universal Value Block ─────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "#F8F8FC",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #EDEDF5",
        }}
      >
        <p
          className="text-[10px] font-extrabold uppercase tracking-widest mb-3"
          style={{ color: isDark ? "rgba(232,51,158,0.8)" : "#E8339E", letterSpacing: "1.2px" }}
        >
          Every program includes
        </p>
        <ul className="flex flex-col gap-2.5">
          {UNIVERSAL_VALUE.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                style={{
                  width: 20,
                  height: 20,
                  background: isDark ? "rgba(232,51,158,0.15)" : "rgba(232,51,158,0.08)",
                }}
              >
                <Icon size={11} color="#E8339E" strokeWidth={2.5} />
              </span>
              <span
                className="text-xs font-medium leading-snug"
                style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#374151" }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Medication Block ──────────────────────────────────────────── */}
      <div className="mb-6 flex-1">
        <p
          className="text-[10px] font-extrabold uppercase tracking-widest mb-2.5"
          style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#888", letterSpacing: "1.2px" }}
        >
          Your medication
        </p>
        <ul className="flex flex-col gap-2">
          {medication.map((text) => (
            <li key={text} className="flex items-start gap-2">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                style={{
                  width: 18,
                  height: 18,
                  background: isDark ? "rgba(122,30,126,0.25)" : "rgba(122,30,126,0.08)",
                }}
              >
                <Check size={10} color={isDark ? "#c084fc" : "#7A1E7E"} strokeWidth={2.5} />
              </span>
              <span
                className="text-xs font-medium leading-snug"
                style={{ color: isDark ? "rgba(255,255,255,0.75)" : "#555" }}
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
            ? "hover:opacity-90 hover:shadow-[0_8px_32px_rgba(232,51,158,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_4px_16px_rgba(232,51,158,0.3)]"
            : "hover:bg-[#111] hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        }`}
        style={{
          padding: "14px",
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
                color: "#111",
                border: "2px solid #111",
              }),
        }}
      >
        Book Free Consult
      </button>

      {/* Soft urgency */}
      <p className="text-[10px] text-center mt-2.5 font-medium" style={{ color: subColor }}>
        Limited new patient slots available
      </p>
    </div>
  );
}
