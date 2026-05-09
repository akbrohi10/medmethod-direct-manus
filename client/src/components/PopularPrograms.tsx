/* =============================================================================
   Popular Programs — MedMethod Direct — v2.10
   Six programs. One foundation. Build your protocol.

   Option B: Tabbed layout
   - Tab 1: "GLP-1 + Weight Loss" → T1 Mentorship, T2A Sema, T2B Tirz, T2A+Starter, T2B+Starter
   - Tab 2: "Hormone Therapy Only" → HRT-Only Starter

   Term toggle: 3 / 6 / 12 months — all paid in full upfront.
   Discount: 3-mo = 0%, 6-mo = 5%, 12-mo = 10%
   ============================================================================= */
import { useState } from "react";
import { Check, Shield, FlaskConical, Pill, Sparkles } from "lucide-react";

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
  badge?: "MOST POPULAR" | "FLAGSHIP";
  dark?: boolean;
  description: string;
  features: { text: string; sub?: string; badge?: string }[];
  medications: string;
  pharmacy: string;
}

const GLP1_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Foundation · clinical oversight only",
    description: "Physician-led care for patients who purchase GLP-1 prescriptions separately or want hormone oversight without medications.",
    features: [
      { text: "Physician-managed clinical oversight" },
      { text: "Bi-weekly wellness advisor coaching" },
      { text: "Quarterly MD strategy session" },
      { text: "Custom protocol design" },
    ],
    medications: "No medication included",
    pharmacy: "—",
  },
  {
    key: "t2a",
    label: "Semaglutide",
    subtitle: "Weight loss · value GLP-1",
    description: "Everything in Tier 01, plus physician-prescribed semaglutide. Drug pricing locked for your full term — no escalation as you titrate.",
    features: [
      { text: "Everything in Tier 01" },
      { text: "Semaglutide+B12 — monthly dose" },
      { text: "Monthly dose management" },
      { text: "Personalized titration protocol" },
    ],
    medications: "Semaglutide+B12 (compounded)",
    pharmacy: "Empower Pharmacy",
  },
  {
    key: "t2b",
    label: "Tirzepatide",
    subtitle: "Weight loss · premium GLP-1",
    description: "Everything in Tier 01, plus physician-prescribed tirzepatide — clinically superior dual-action GLP-1.",
    features: [
      { text: "Everything in Tier 01" },
      { text: "Tirzepatide+niacinamide monthly" },
      { text: "Enhanced titration protocol" },
      { text: "For higher BMI or sema plateau" },
    ],
    medications: "Tirzepatide+niacinamide (compounded)",
    pharmacy: "Empower Pharmacy",
  },
  {
    key: "t2a_starter",
    label: "Sema · Starter",
    subtitle: "The bridge · easy-yes upgrade",
    badge: "MOST POPULAR",
    description: "Semaglutide weight loss plus the foundational hormone protocol — Estradiol patch and bioidentical progesterone. Add other à la carte hormones as needed for a Full Integrated Protocol.",
    features: [
      { text: "Everything in Tier 02-A" },
      { text: "Estradiol patch (transdermal)" },
      { text: "Micronized progesterone (oral)" },
      { text: "Stack à la carte hormones below" },
    ],
    medications: "Sema + Estradiol Patch + Progesterone",
    pharmacy: "Empower Pharmacy",
  },
  {
    key: "t2b_starter",
    label: "Tirz · Starter",
    subtitle: "Premium weight loss + foundational HRT",
    badge: "FLAGSHIP",
    dark: true,
    description: "Premium tirzepatide weight loss plus the foundational hormone protocol — Estradiol patch and bioidentical progesterone. Add other à la carte hormones as needed for a Full Integrated Protocol.",
    features: [
      { text: "Everything in Tier 02-B" },
      { text: "Estradiol patch (transdermal)" },
      { text: "Micronized progesterone (oral)" },
      { text: "Stack à la carte hormones below" },
    ],
    medications: "Tirz + Estradiol Patch + Progesterone",
    pharmacy: "Empower Pharmacy",
  },
];

const HRT_TIER: TierDef = {
  key: "hrt",
  label: "HRT Starter",
  subtitle: "Hormone therapy · no weight loss",
  description: "Foundational hormone protocol — Estradiol patch and bioidentical progesterone — with physician oversight. Add other à la carte hormones as needed for a Full Integrated Protocol. No weight loss medication.",
  features: [
    { text: "Mentorship & physician access" },
    { text: "Estradiol patch (transdermal)" },
    { text: "Micronized progesterone (oral)" },
    { text: "Stack à la carte hormones below" },
  ],
  medications: "Estradiol Patch + Progesterone",
  pharmacy: "Empower Pharmacy",
};

// ── Component ───────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);
  const [activeTab, setActiveTab] = useState<"glp1" | "hrt">("glp1");

  return (
    <section
      className="py-16 lg:py-24 px-4"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[3px] text-gray-400 mb-3">
            Programs · Pricing · Commitment
          </p>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#111",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Six programs. One foundation.
          </h2>
          <p
            className="font-light italic"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              color: "#E8339E",
              lineHeight: 1.2,
            }}
          >
            Build your protocol.
          </p>
          <p className="text-sm text-gray-500 font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Physician-led weight loss and hormone therapy.{" "}
            <strong className="text-gray-700">Drug pricing locked for your term</strong>
            {" "}— medications and clinical care included, no escalation as you titrate doses.
            Labs billed separately at $299 as ordered.
          </p>
        </div>

        {/* ── Differentiator Callouts ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10 max-w-5xl mx-auto">
          {[
            { icon: Shield, title: "Drug price locked", desc: "Medications included. Drug price never escalates as you titrate up — locked for your full term." },
            { icon: FlaskConical, title: "Labs à la carte ($299)", desc: "Initial lab included with $449 initiation. Future labs billed $299 each as your physician orders them." },
            { icon: Pill, title: "Starter = Patch + Progesterone", desc: "Every Starter program includes Estradiol patch and Micronized progesterone." },
            { icon: Sparkles, title: "Full Integrated Protocol", desc: "Add à la carte hormones to any Starter program — your protocol, custom-built." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-4 flex gap-3"
              style={{ background: "#fff", border: "1px solid #E8E8F0" }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(232,51,158,0.08)" }}
              >
                <Icon size={16} color="#E8339E" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">{title}</p>
                <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Term Toggle ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="rounded-2xl p-2 flex gap-1"
            style={{ background: "#E4E4EE" }}
          >
            {([3, 6, 12] as Term[]).map((t) => {
              const active = term === t;
              const isStar = t === 6;
              return (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className="relative rounded-xl transition-all font-bold"
                  style={{
                    padding: "12px 28px",
                    fontSize: 13,
                    background: active
                      ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                      : "transparent",
                    color: active ? "#fff" : "#555",
                    border: "none",
                    cursor: "pointer",
                    minWidth: 120,
                  }}
                >
                  {t} Months{isStar && " ★"}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>3-month: baseline</span>
            <span>·</span>
            <span style={{ color: "#16A34A", fontWeight: 700 }}>6-month: 5% off</span>
            <span>·</span>
            <span style={{ color: "#16A34A", fontWeight: 700 }}>12-month: 10% off</span>
          </div>
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2 mt-1"
            style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}
          >
            <Check size={14} color="#16A34A" strokeWidth={2.5} />
            <p className="text-xs text-gray-600">
              All terms are paid in full at enrollment. The 3-month plan is the entry-level option — no month-to-month available.
            </p>
          </div>
        </div>

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "glp1" as const, label: "GLP-1 + Weight Loss", count: 5 },
            { id: "hrt" as const, label: "Hormone Therapy Only", count: 1 },
          ].map(({ id, label, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="rounded-full font-bold transition-all"
                style={{
                  padding: "10px 24px",
                  fontSize: 12,
                  letterSpacing: "0.5px",
                  background: active
                    ? "linear-gradient(135deg, #E8339E, #7A1E7E)"
                    : "#fff",
                  color: active ? "#fff" : "#555",
                  border: active ? "none" : "1.5px solid #E2E2EA",
                  cursor: "pointer",
                }}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        {activeTab === "glp1" ? (
          <div>
            {/* Section 01: Foundation & Weight Loss (T1, T2A, T2B) */}
            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-[2px] text-gray-400 mb-1">Section 01</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Foundation & Weight Loss</h3>
              <p className="text-xs text-gray-500 mb-5">
                Mentorship is required for every patient. Layer weight loss medication on top, or stop here for clinical oversight only.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {GLP1_TIERS.slice(0, 3).map((tier) => (
                <TierCard key={tier.key} tier={tier} term={term} onConsultClick={onConsultClick} />
              ))}
            </div>

            {/* Section 02: Integrated Programs (T2A+Starter, T2B+Starter) */}
            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-[2px] text-gray-400 mb-1">Section 02</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Integrated Programs — Weight Loss + Foundational HRT</h3>
              <p className="text-xs text-gray-500 mb-5">
                The bridge to integrated care. Includes Estradiol patch and Micronized progesterone — the foundational hormone protocol. Add other hormones à la carte for a Full Integrated Protocol.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {GLP1_TIERS.slice(3, 5).map((tier) => (
                <TierCard key={tier.key} tier={tier} term={term} onConsultClick={onConsultClick} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-[2px] text-gray-400 mb-1">HRT-Only</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Hormone Therapy Without Weight Loss</h3>
              <p className="text-xs text-gray-500 mb-5">
                For women who want bioidentical hormone therapy without a GLP-1 program. Includes Estradiol patch and Micronized progesterone, plus à la carte additions as needed.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <TierCard tier={HRT_TIER} term={term} onConsultClick={onConsultClick} />
            </div>
          </div>
        )}

        {/* ── Footer Notes ────────────────────────────────────────────────── */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-xs text-gray-500 font-medium">
            All programs are paid in full for the selected term. Non-refundable. HSA/FSA accepted.
          </p>
          <p className="text-xs text-gray-400">
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
        </div>

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
  const { key, label, subtitle, badge, dark, description, features, medications, pharmacy } = tier;
  const isDark = !!dark;
  const monthly = monthlyRate(key, term);
  const total = upfrontTotal(key, term);
  const savings = totalSavings(key, term);
  const baseMonthly = BASE_PRICES[key];

  const textColor = isDark ? "rgba(255,255,255,0.9)" : "#2A2A35";
  const subColor = isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF";
  const checkColor = isDark ? "#E8339E" : "#E8339E";
  const checkBg = isDark ? "rgba(232,51,158,0.2)" : "rgba(232,51,158,0.08)";

  return (
    <div
      className="rounded-2xl flex flex-col relative"
      style={{
        background: isDark ? "#0D1B2A" : "#fff",
        border: isDark
          ? "2px solid rgba(232,51,158,0.4)"
          : badge === "MOST POPULAR"
          ? "2px solid #E8339E"
          : "1.5px solid #E2E2EA",
        padding: "32px 26px 28px",
        boxShadow: isDark
          ? "0 0 0 4px rgba(232,51,158,0.08), 0 20px 50px rgba(13,27,42,0.3)"
          : badge === "MOST POPULAR"
          ? "0 0 0 3px rgba(232,51,158,0.08)"
          : undefined,
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

      {/* Tier label */}
      <p
        className="text-[10px] font-extrabold uppercase tracking-[2px] mb-2"
        style={{ color: isDark ? "rgba(232,51,158,0.8)" : "#999" }}
      >
        {key === "t1" ? "TIER 01" : key === "t2a" ? "TIER 02-A" : key === "t2b" ? "TIER 02-B" : key === "t2a_starter" ? "TIER 02-A + STARTER" : key === "t2b_starter" ? "TIER 02-B + STARTER" : "HRT-ONLY · STARTER"}
        {badge && ` · ★ ${badge}`}
      </p>

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
        Billed ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} upfront · {term}-month commitment
      </p>

      {/* Savings chip */}
      {savings > 0 && (
        <span
          className="inline-block rounded text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 mb-3 w-fit"
          style={{
            border: "1.5px solid #16A34A",
            color: "#16A34A",
          }}
        >
          SAVE ${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}
      {savings === 0 && <div className="mb-3" />}

      {/* Drug price locked callout */}
      <div
        className="rounded-lg p-3 mb-3"
        style={{
          background: isDark ? "rgba(232,51,158,0.08)" : "#F8F8FC",
          border: isDark ? "1px solid rgba(232,51,158,0.2)" : "1px solid #EBEBF0",
        }}
      >
        <div className="flex items-start gap-2">
          <Check size={14} color="#16A34A" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#111" }}>
              Drug price locked for your term
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: subColor }}>
              Medications & visits included. No dose-based price increases. Labs billed à la carte ($299).
            </p>
          </div>
        </div>
      </div>

      {/* Initiation fee */}
      <p className="text-[11px] italic mb-4" style={{ color: "#E8339E" }}>
        One-time initiation fee: $449 · includes initial lab + MD consultation
      </p>

      <hr style={{ border: "none", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#EBEBF0"}`, marginBottom: 16 }} />

      {/* Description */}
      <p className="text-xs leading-relaxed mb-4" style={{ color: subColor }}>
        {description}
      </p>

      {/* Feature list */}
      <ul className="flex flex-col gap-2 mb-4 flex-1">
        {features.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
              style={{ width: 18, height: 18, background: checkBg }}
            >
              <Check size={10} color={checkColor} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-medium leading-snug" style={{ color: textColor }}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Medications */}
      <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F0F0F5"}` }}>
        <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] mb-1" style={{ color: isDark ? "rgba(232,51,158,0.7)" : "#999" }}>
          Medications
        </p>
        <p className="text-xs font-semibold" style={{ color: isDark ? "#fff" : "#333" }}>
          {medications}
        </p>
        {pharmacy !== "—" && (
          <p className="text-[11px] italic" style={{ color: subColor }}>{pharmacy}</p>
        )}
      </div>

      {/* CTA */}
      <a
        onClick={onConsultClick}
        className="block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer mt-5"
        style={{
          padding: "14px",
          fontSize: 11,
          letterSpacing: "1.5px",
          textDecoration: "none",
          ...(isDark
            ? {
                backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                color: "#fff",
                border: "none",
                boxShadow: "0 6px 24px rgba(232,51,158,0.35)",
              }
            : badge === "MOST POPULAR"
            ? {
                backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                color: "#fff",
                border: "none",
                boxShadow: "0 6px 24px rgba(232,51,158,0.25)",
              }
            : {
                background: "transparent",
                color: "#111",
                border: "2px solid #111",
              }),
        }}
      >
        Start {label}
      </a>
    </div>
  );
}
