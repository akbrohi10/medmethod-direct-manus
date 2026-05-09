/* =============================================================================
   Popular Programs — MedMethod Direct — v2.15 (Enhanced UX)
   
   Enhancements:
   1. Subtitle under "Popular Programs" header
   2. "What's the difference?" helper tooltip
   3. Tab transition animation (fade)
   4. Mentorship card repositioned as "Bring your own medication"
   5. Social proof counter on recommended card
   6. Mobile highlighted card treatment (gradient left border)
   7. Sticky term toggle on scroll
   8. Compare programs overlay
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
import { Check, Shield, Star, ArrowRight, Stethoscope, Dumbbell, MessageCircle, Apple, UserCheck, HelpCircle, X } from "lucide-react";

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
  socialProof?: string;
}

// Tab 1: Weight Loss
const WEIGHT_LOSS_TIERS: TierDef[] = [
  {
    key: "t1",
    label: "Mentorship",
    subtitle: "Already have a GLP-1 prescription? Bring your own medication.",
    medication: [
      "Your physician manages your Rx",
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
    socialProof: "127 women enrolled this month",
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
    subtitle: "Already have prescriptions? Bring your own GLP-1 + hormones.",
    medication: [
      "Your physician manages GLP-1 + hormone Rx",
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
    socialProof: "Most chosen integrated program",
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

// ── Compare data ────────────────────────────────────────────────────────────
const COMPARE_ROWS = [
  { label: "Dedicated physician", wl: true, wlh: true, hrt: true },
  { label: "Performance coach (bi-weekly)", wl: true, wlh: true, hrt: true },
  { label: "Custom nutrition plan", wl: true, wlh: true, hrt: true },
  { label: "Custom exercise program", wl: true, wlh: true, hrt: true },
  { label: "Direct text access", wl: true, wlh: true, hrt: true },
  { label: "GLP-1 medication included", wl: "Tier 2+", wlh: "Tier 2+", hrt: false },
  { label: "Estradiol patch", wl: false, wlh: true, hrt: true },
  { label: "Micronized progesterone", wl: false, wlh: true, hrt: true },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);
  const [activeTab, setActiveTab] = useState<TabId>("weight_loss");
  const [showHelper, setShowHelper] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Tab switch with fade animation
  const switchTab = (id: TabId) => {
    setActiveTab(id);
    setFadeKey((k) => k + 1);
  };

  // Sticky term toggle logic
  useEffect(() => {
    const handleScroll = () => {
      if (!toggleRef.current || !sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const toggleRect = toggleRef.current.getBoundingClientRect();
      // Make sticky when toggle would scroll off top, but only while section is visible
      const shouldStick = toggleRect.top <= 0 && sectionRect.bottom > 200;
      setIsSticky(shouldStick);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 px-4 relative"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header + Subtitle ───────────────────────────────────── */}
        <div className="text-center mb-10">
          <h2
            className="font-extrabold tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#111", letterSpacing: "-0.5px" }}
          >
            Popular Programs
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Physician-led programs designed around your biology
          </p>
        </div>

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
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

        {/* ── "What's the difference?" helper ─────────────────────────────── */}
        <div className="text-center mb-8 relative">
          <button
            onClick={() => setShowHelper(!showHelper)}
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[#E8339E]"
            style={{ color: "#999", background: "none", border: "none", cursor: "pointer" }}
          >
            <HelpCircle size={13} />
            Not sure which is right for you?
          </button>
          {showHelper && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-8 z-20 rounded-xl shadow-xl p-5 text-left max-w-sm w-full"
              style={{ background: "#fff", border: "1px solid #E2E2EA" }}
            >
              <button
                onClick={() => setShowHelper(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={14} />
              </button>
              <p className="text-xs font-bold text-gray-800 mb-3">Quick guide:</p>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Weight Loss</p>
                  <p className="text-[11px] text-gray-500">GLP-1 medication only — for women focused on weight loss without hormone therapy.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Weight Loss + Hormones</p>
                  <p className="text-[11px] text-gray-500">GLP-1 + estradiol + progesterone — for women in perimenopause/menopause who also want weight loss.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Hormones Only</p>
                  <p className="text-[11px] text-gray-500">Estradiol + progesterone — for women who want hormone therapy without weight loss medication.</p>
                </div>
              </div>
              <button
                onClick={() => { setShowHelper(false); setShowCompare(true); }}
                className="mt-4 text-[11px] font-semibold underline underline-offset-2"
                style={{ color: "#E8339E", background: "none", border: "none", cursor: "pointer" }}
              >
                Compare all programs side-by-side →
              </button>
            </div>
          )}
        </div>

        {/* ── Term Toggle (sticky on scroll) ─────────────────────────────── */}
        <div ref={toggleRef}>
          <div
            className={`flex flex-col items-center gap-2 mb-6 transition-all duration-200 ${
              isSticky ? "fixed top-0 left-0 right-0 z-30 py-3 shadow-md" : ""
            }`}
            style={isSticky ? { background: "rgba(244,244,248,0.97)", backdropFilter: "blur(8px)" } : undefined}
          >
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
            {!isSticky && (
              <>
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
              </>
            )}
          </div>
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

        {/* ── Cards (with fade transition) ────────────────────────────────── */}
        <div
          key={fadeKey}
          className="animate-fade-in"
        >
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

        {/* ── Compare link ────────────────────────────────────────────────── */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowCompare(true)}
            className="text-xs font-semibold underline underline-offset-2 transition-colors hover:text-[#E8339E]"
            style={{ color: "#888", background: "none", border: "none", cursor: "pointer" }}
          >
            Compare all programs side-by-side
          </button>
        </div>

      </div>

      {/* ── Compare Overlay ──────────────────────────────────────────────── */}
      {showCompare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowCompare(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          >
            <button
              onClick={() => setShowCompare(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              style={{ border: "none", cursor: "pointer" }}
            >
              <X size={14} className="text-gray-500" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Compare Programs</h3>
            <p className="text-xs text-gray-500 mb-5">See what's included in each category at a glance.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600 w-1/3">Feature</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Weight Loss</th>
                    <th className="text-center py-2 px-2 font-semibold" style={{ color: "#E8339E" }}>WL + Hormones</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Hormones Only</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-gray-50">
                      <td className="py-2.5 pr-4 font-medium text-gray-700">{row.label}</td>
                      <td className="py-2.5 text-center">{renderCompareCell(row.wl)}</td>
                      <td className="py-2.5 text-center">{renderCompareCell(row.wlh)}</td>
                      <td className="py-2.5 text-center">{renderCompareCell(row.hrt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 text-center">
              <button
                onClick={() => setShowCompare(false)}
                className="text-xs font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", border: "none", cursor: "pointer" }}
              >
                Got it — choose my program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </section>
  );
}

// ── Compare cell renderer ───────────────────────────────────────────────────
function renderCompareCell(value: boolean | string) {
  if (value === true) return <Check size={14} color="#16A34A" strokeWidth={2.5} className="inline" />;
  if (value === false) return <span className="text-gray-300">—</span>;
  return <span className="text-[11px] font-medium text-gray-600">{value}</span>;
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
  const { key, label, subtitle, badge, dark, highlighted, medication, socialProof } = tier;
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
      className={`rounded-2xl flex flex-col relative ${
        isHighlighted && !isDark ? "md:scale-[1.02]" : ""
      }`}
      style={{
        background: isDark ? "#0D1B2A" : "#fff",
        border: cardBorder,
        padding: "32px 24px 28px",
        boxShadow: cardShadow,
        // Mobile: highlighted card gets left gradient border
        borderLeft: isHighlighted && !isDark ? "4px solid #E8339E" : undefined,
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

      {/* Social proof counter */}
      {socialProof && (
        <div
          className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg w-fit"
          style={{ background: isDark ? "rgba(22,163,74,0.1)" : "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-700">{socialProof}</span>
        </div>
      )}

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

      {/* ── Medication Block ──────────────────────────────────────────── */}
      <div className="mb-4">
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

      {/* ── Universal Value Block ─────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-6 flex-1"
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
