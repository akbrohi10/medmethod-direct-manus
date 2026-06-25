/* =============================================================================
   Popular Programs — MedMethod Direct
   Updated: New pricing structure — labs replace initiation fee as commitment.
   Patients who bring their own labs (within 3 months) pay a Clinical Review Fee.

   Pricing (per-month, paid upfront):
     Ignite          → 3mo $129 · 6mo $109 · 12mo $99
     Transformation  → 3mo $249 · 6mo $215 · 12mo $199
     Longevity       → 3mo $379 · 6mo $325 · 12mo $299

   Get Started:
     Labs through us → no separate setup fee (labs ARE the commitment)
     Bring own labs  → Clinical Review Fee: Ignite $39, Transformation $129, Longevity $199

   Lab panels shown:
     Ignite & Transformation: GLP-1 ($69), Hormones ($311), GLP-1 + Hormones ($373)
     Longevity: All 4 (adds Longevity Labs $192)

   Brand: magenta #E8339E → deep purple #7A1E7E gradient.
   ============================================================================= */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Term = 3 | 6 | 12;

interface TierPricing {
  base: number;
  m3: number; m6: number; m12: number;
}

interface LabPanel {
  name: string;
  price: number;
  tests: string[];
}

interface Tier {
  id: "ignite" | "transformation" | "longevity";
  tierTag: string;
  badge?: { label: string; variant: "featured" | "longevity" };
  name: string;
  tagline: string;
  valueStack: string;
  description: string;
  pricing: TierPricing;
  clinicalReviewFee: number;
  inheritsFrom?: string;
  initiationIncludes: string[];
  ongoingIncludes: string[];
  ctaVariant: "outline" | "solid" | "purple";
  labPanels: LabPanel[];
}

// ── Lab Panel Data ──────────────────────────────────────────────────────────
const GLP1_PANEL: LabPanel = {
  name: "GLP-1 Panel",
  price: 69,
  tests: [
    "CMP (Comprehensive Metabolic Panel)",
    "TSH (Thyroid Stimulating Hormone)",
    "HbA1c (W/EAG REFL)",
    "CBC with Differential/Platelet",
    "Basic Lipid Panel (HDL, Total Cholesterol, Triglycerides, LDL, LDL/HDL ratio)",
  ],
};

const HORMONE_PANEL: LabPanel = {
  name: "Hormone Panel",
  price: 311,
  tests: [
    "Free T3",
    "Progesterone",
    "Prolactin",
    "Estradiol",
    "FSH & LH",
    "Testosterone Free and Total (DIAL)",
    "DHEA-Sulfate",
    "Vitamin D",
    "CBC (DIFF/PLT)",
  ],
};

const GLP1_HORMONE_PANEL: LabPanel = {
  name: "GLP-1 + Hormones",
  price: 373,
  tests: [
    "CMP (Comprehensive Metabolic Panel)",
    "TSH (Thyroid Stimulating Hormone)",
    "HbA1c (W/EAG REFL)",
    "CBC with Differential/Platelet",
    "Basic Lipid Panel (HDL, Total Cholesterol, Triglycerides, LDL, LDL/HDL ratio)",
    "Free T3",
    "Progesterone",
    "Prolactin",
    "Estradiol",
    "FSH & LH",
    "Testosterone Free and Total (DIAL)",
    "DHEA-Sulfate",
    "Vitamin D",
  ],
};

const LONGEVITY_PANEL: LabPanel = {
  name: "Longevity Panel",
  price: 192,
  tests: [
    "Cardiac IQ Panel (APO B)",
    "Homocysteine",
    "HsCRP (High-Sensitivity C-Reactive Protein)",
    "Insulin",
    "Iron, Total TIBC",
    "Magnesium",
    "Ferritin",
    "B12",
    "Folate",
    "Cortisol A.M.",
  ],
};

const TIERS: Tier[] = [
  {
    id: "ignite",
    tierTag: "",
    name: "Ignite",
    tagline: "Async access · price-sensitive",
    valueStack: "Your physician + your protocol, every month.",
    description:
      "Patients who know what they want & value speed + price over coaching.",
    pricing: { base: 129, m3: 129, m6: 109, m12: 99 },
    clinicalReviewFee: 39,
    initiationIncludes: [
      "Asynchronous physician health history review",
      "Custom protocol design tailored to your goals",
      "Personalized treatment recommendations based on your goals",
      "Secure messaging onboarding (48hr response SLA)",
      "Patient dashboard and treatment tracking setup",
      "Full formulary access — all available treatment options",
    ],
    ongoingIncludes: [
      "Asynchronous physician intake at enrollment",
      "Custom protocol design",
      "Secure messaging — 48hr response weekdays",
      "Monthly async check-in",
      "Eligibility maintenance for ongoing Rx",
      "Full formulary access — all available treatment options",
    ],
    ctaVariant: "outline",
    labPanels: [GLP1_PANEL, HORMONE_PANEL, GLP1_HORMONE_PANEL],
  },
  {
    id: "transformation",
    tierTag: "",
    badge: { label: "✦ Most Popular", variant: "featured" },
    name: "Transformation",
    tagline: "Coached & guided · your team in your corner",
    valueStack: "Physician + coach + protocol, every month.",
    description:
      "For the patient who wants structure, accountability, and a team that keeps them on track.",
    pricing: { base: 249, m3: 249, m6: 215, m12: 199 },
    clinicalReviewFee: 129,
    inheritsFrom: "Ignite",
    initiationIncludes: [
      "30-minute in-depth live physician video consultation",
      "Comprehensive baseline lab panel — 30+ biomarkers",
      "Lab review session with your physician",
      "Structured nutrition + fitness plan design",
      "Performance Coach introduction",
    ],
    ongoingIncludes: [
      "Everything in Ignite",
      "Initial live physician video call — labs reviewed & plan prescribed",
      "Monthly or every-other-month physician check-ins — dose titration, lab reviews & plan adjustments",
      "Dedicated Performance Coach",
      "Weigh-ins & ongoing accountability",
      "Structured nutrition & fitness plans (GLP-1 aware, preserves lean mass)",
      "BHRT and TRT available in this tier",
      "Unlimited secure messaging (24hr SLA)",
    ],
    ctaVariant: "solid",
    labPanels: [GLP1_PANEL, HORMONE_PANEL, GLP1_HORMONE_PANEL],
  },
  {
    id: "longevity",
    tierTag: "",
    badge: { label: "✦ Longevity Program", variant: "longevity" },
    name: "Longevity",
    tagline: "More physician time · deeper diagnostics · advanced monitoring",
    valueStack: "Physician + coach + advanced labs + concierge-level care.",
    description:
      "For the patient who wants a true physician partner — advanced imaging, real-time monitoring, and chronic condition management that supplements your PCP.",
    pricing: { base: 379, m3: 379, m6: 325, m12: 299 },
    clinicalReviewFee: 199,
    inheritsFrom: "Transformation",
    initiationIncludes: [
      "45-minute in-depth physician strategy consultation",
      "Premium baseline panel — 75+ biomarkers across:",
      "Full metabolic & advanced cardiovascular (ApoB, Lp(a), homocysteine)",
      "Comprehensive hormone optimization (full sex hormones, SHBG, DHEA-S, IGF-1)",
      "Full thyroid panel (TSH, free T3, free T4, reverse T3)",
      "Insulin resistance markers (fasting insulin, HOMA-IR)",
      "Iron studies (ferritin, TIBC, transferrin saturation)",
      "Vitamin & micronutrient panel (D, B12, folate, magnesium)",
      "Cortisol, methylation markers, oxidative stress",
      "At-home phlebotomy where available",
      "Dedicated care coordinator assignment",
      "White-glove onboarding (first 90 days)",
    ],
    ongoingIncludes: [
      "Everything in Transformation",
      "Quarterly 45-min physician strategy session",
      "Expanded diagnostic testing & advanced lab access",
      "Quarterly comprehensive lab panel (75+ biomarkers)",
      "Advanced diagnostic ordering: CT calcium score, DEXA scan interpretation, CGM monitoring",
      "Chronic condition deep-dives — supplementing your yearly PCP visits",
      "Priority physician access (12hr SLA)",
      "At-home phlebotomy where available",
      "White-glove onboarding (first 90 days)",
    ],
    ctaVariant: "purple",
    labPanels: [GLP1_PANEL, HORMONE_PANEL, GLP1_HORMONE_PANEL, LONGEVITY_PANEL],
  },
];

// ── Inline check icon (18px circle, soft green) ─────────────────────────────
function CheckIcon({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="flex-shrink-0 mt-[1px] flex items-center justify-center rounded-full"
      style={{
        width: 16,
        height: 16,
        background: dark ? "rgba(34,197,94,0.18)" : "#F0FDF4",
        border: dark ? "1.5px solid rgba(134,239,172,0.65)" : "1.5px solid #86EFAC",
      }}
    >
      <svg viewBox="0 0 10 10" fill="none" style={{ width: 8, height: 8 }}>
        <path
          d="M2 5l2 2 4-4"
          stroke={dark ? "#86EFAC" : "#16A34A"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// ── Per-term price helper ────────────────────────────────────────────────────
function priceFor(t: Tier, term: Term): number {
  return term === 3 ? t.pricing.m3 : term === 6 ? t.pricing.m6 : t.pricing.m12;
}

// ── Lab Options Modal ──────────────────────────────────────────────────────
function LabOptionsModal({ open, onClose, panels }: { open: boolean; onClose: () => void; panels: LabPanel[] }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#F3F1EF",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#555",
          }}
        >
          ×
        </button>

        <h3
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 20,
            fontWeight: 800,
            color: "#111",
            marginBottom: 6,
            letterSpacing: "-0.3px",
          }}
        >
          Lab Panel Options
        </h3>
        <p
          style={{
            fontFamily: "Inter, Montserrat, sans-serif",
            fontSize: 13,
            color: "#767676",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          Your physician will recommend the right panel based on your treatment plan. One-time cost at onboarding.
        </p>

        {panels.map((panel, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 16,
              border: "1px solid #ECECEC",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                padding: "14px 16px",
                background: "#FAFAFA",
                borderBottom: "1px solid #ECECEC",
              }}
            >
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {panel.name}
              </span>
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#E8339E",
                }}
              >
                ${panel.price}
              </span>
            </div>
            <ul
              style={{
                padding: "12px 16px",
                listStyle: "none",
                margin: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 12px",
              }}
            >
              {panel.tests.map((test, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "Inter, Montserrat, sans-serif",
                    fontSize: 11.5,
                    color: "#555",
                    lineHeight: 1.5,
                    padding: "2px 0",
                  }}
                >
                  <span style={{ color: "#E8339E", fontWeight: 700, marginRight: 4 }}>·</span>
                  {test}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Bring your own labs note */}
        <div
          style={{
            marginTop: 8,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px dashed #D6D6D6",
            background: "#FAFAFA",
          }}
        >
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#111",
              marginBottom: 4,
            }}
          >
            Already have recent labs? (within 3 months)
          </div>
          <div
            style={{
              fontFamily: "Inter, Montserrat, sans-serif",
              fontSize: 12,
              color: "#767676",
              lineHeight: 1.5,
            }}
          >
            Skip the lab order — Clinical Review Fee: <span style={{ fontWeight: 700, color: "#E8339E" }}>$39–$199</span> depending on your plan.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PopularPrograms({
  onConsultClick,
}: {
  onConsultClick: (tierName?: string) => void;
}) {
  const [term, setTerm] = useState<Term>(12);
  const [labModalOpen, setLabModalOpen] = useState(false);

  // Combine all unique panels for the modal
  const allPanels = [GLP1_PANEL, HORMONE_PANEL, GLP1_HORMONE_PANEL, LONGEVITY_PANEL];

  return (
    <section
      id="programs"
      className="pt-7 pb-12 md:pt-10 md:pb-16 lg:pt-14 lg:pb-24 px-4"
      style={{ background: "#F3F1EF", fontFamily: "Montserrat, sans-serif" }}
    >
      <style>{`
        .pp-card-body { padding: 30px 26px 24px; }
        @media (min-width: 1024px) {
          .pp-card-body { padding: 30px 24px 24px; }
          .pp-tagline { min-height: 60px; }
          .pp-price-block { min-height: 140px; }
          .pp-description { min-height: 84px; }
        }
        .pp-card { box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
        .pp-featured-card {
          box-shadow: 0 10px 28px rgba(232,51,142,0.16), 0 4px 12px rgba(0,0,0,0.18) !important;
        }
        @media (min-width: 1024px) {
          .pp-featured-card {
            box-shadow: 0 32px 70px rgba(232,51,142,0.28), 0 8px 24px rgba(0,0,0,0.20) !important;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-7 md:mb-10">
          <h2
            className="font-extrabold mb-4 mx-auto"
            style={{
              fontSize: "clamp(1.75rem, 3.4vw, 2.25rem)",
              color: "#111",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              maxWidth: "48rem",
            }}
          >
            Choose your level of care.
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{ fontSize: 14, color: "#5A5A5A", lineHeight: 1.6 }}
          >
            Your membership covers your clinical relationship — physician oversight, coaching, and protocol design. Labs are ordered separately based on your treatment plan.
          </p>
        </div>

        {/* ── Plan Length Toggle ───────────────────────────────────────── */}
        <div className="flex justify-center mb-6 md:mb-8 px-2 items-center gap-4 flex-wrap">
          <span
            className="font-bold uppercase"
            style={{ fontSize: 11, letterSpacing: "2px", color: "#767676" }}
          >
            Plan Length
          </span>
          <div
            className="flex gap-1"
            style={{
              background: "#fff",
              padding: 4,
              borderRadius: 100,
              border: "1px solid #ECECEC",
            }}
          >
            {([3, 6, 12] as Term[]).map((m) => {
              const active = term === m;
              return (
                <button
                  key={m}
                  onClick={() => setTerm(m)}
                  className="font-semibold transition-all whitespace-nowrap"
                  style={{
                    fontSize: 12,
                    padding: "10px 18px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 100,
                    background: active
                      ? "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)"
                      : "transparent",
                    color: active ? "#fff" : "#767676",
                  }}
                >
                  {m}-month{m === 12 && active ? "  ✦ BEST VALUE" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards Grid ────────────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:gap-[22px] grid-cols-1 lg:grid-cols-3 items-stretch max-w-[1060px] mx-auto">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              term={term}
              onConsultClick={onConsultClick}
              onLabModalOpen={() => setLabModalOpen(true)}
            />
          ))}
        </div>

        {/* ── Footnote ───────────────────────────────────────────────── */}
        <p
          className="text-center mt-6 italic"
          style={{ fontSize: 12, color: "#767676" }}
        >
          All terms paid upfront at enrollment. Lab costs are one-time at onboarding.
        </p>
      </div>

      {/* Lab Options Modal */}
      <LabOptionsModal open={labModalOpen} onClose={() => setLabModalOpen(false)} panels={allPanels} />
    </section>
  );
}

// ── Collapsible accordion section ───────────────────────────────────────────
function CollapsibleList({
  label,
  items,
  dark = false,
}: {
  label: string;
  items: string[];
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const restingBg = dark
    ? (open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)")
    : (open ? "#FFFFFF" : "#F7F4FA");
  const borderCol = dark
    ? (open ? "rgba(232,51,142,0.45)" : "rgba(255,255,255,0.10)")
    : (open ? "#E5C9E0" : "#ECECEC");
  const hoverBg = dark ? "rgba(232,51,142,0.10)" : "#F0E6F2";
  const labelCol = dark ? "#F4C8E2" : "#7A1E7E";
  const chevCol = dark ? "#F4C8E2" : "#7A1E7E";
  const itemCol = dark ? "#E5E5EA" : "#1F1F1F";
  const dividerCol = dark ? "rgba(255,255,255,0.08)" : "#F0E6F2";

  return (
    <div
      style={{
        border: `1px solid ${borderCol}`,
        borderRadius: 10,
        background: restingBg,
        marginBottom: 10,
        overflow: "hidden",
        transition: "background 180ms ease-out, border-color 180ms ease-out",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-full flex items-center justify-between text-left"
        style={{
          padding: "13px 14px",
          background: hover && !open ? hoverBg : "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          transition: "background 150ms ease-out",
        }}
        aria-expanded={open}
      >
        <span
          className="font-bold"
          style={{
            fontSize: 13.5,
            letterSpacing: "-0.005em",
            color: labelCol,
          }}
        >
          {label}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: chevCol,
            transition: "transform 200ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>
      {open && (
        <ul
          className="flex flex-col list-none"
          style={{
            padding: "6px 14px 14px",
            gap: 9,
            borderTop: `1px solid ${dividerCol}`,
          }}
        >
          {items.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2"
              style={{
                fontFamily: "Inter, Montserrat, sans-serif",
                fontSize: 13,
                color: itemCol,
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            >
              <CheckIcon dark={dark} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
function PricingCard({
  tier,
  term,
  onConsultClick,
  onLabModalOpen,
}: {
  tier: Tier;
  term: Term;
  onConsultClick: (tierName?: string) => void;
  onLabModalOpen: () => void;
}) {
  const price = priceFor(tier, term);
  const billedToday = price * term;
  const showWas = term !== 3;
  const cardSavings =
    term === 6 ? Math.round((tier.pricing.m3 - tier.pricing.m6) * 6)
    : term === 12 ? Math.round((tier.pricing.m3 - tier.pricing.m12) * 12)
    : 0;
  const isFeatured = tier.badge?.variant === "featured";
  const isLongevity = tier.badge?.variant === "longevity";
  const dark = isFeatured;

  const cardStyle: React.CSSProperties = isFeatured
    ? {
        background:
          "linear-gradient(#0F0F12, #0F0F12) padding-box, linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%) border-box",
        border: "2px solid transparent",
        borderRadius: 18,
      }
    : isLongevity
    ? {
        background: "#fff",
        border: "2px solid rgba(232,51,142,0.2)",
        borderRadius: 18,
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
      }
    : {
        background: "#fff",
        border: "2px solid #D6D6D6",
        borderRadius: 18,
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
      };

  return (
    <div
      className={`pp-card flex flex-col overflow-hidden transition-transform duration-200 ${
        isFeatured ? "pp-featured-card lg:-translate-y-3" : ""
      }`}
      style={cardStyle}
    >
      {/* Image hero with optional badge bar */}
      {isLongevity ? (
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px] overflow-hidden"
          style={{
            backgroundColor: "#F5C9A1",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <img
            src="/manus-storage/longevity-card_5cb8f20e.png"
            alt="Longevity program — live at your peak"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 55%", transform: "scale(1.15)" }}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : isFeatured ? (
        <>
          <div
            className="text-center flex items-center justify-center"
            style={{
              height: 40,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#fff",
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
            }}
          >
            {tier.badge?.label}
          </div>
          <div
            className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[220px] overflow-hidden"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            <img
              src="/manus-storage/transformation-card_86b62a37.jpg"
              alt="Transformation program — physician-led care team"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        </>
      ) : (
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px] overflow-hidden"
          style={{ borderRadius: "16px 16px 0 0" }}
        >
          <img
            src="/manus-storage/ignite-program-card-v3_7203d5db.png"
            alt="Ignite program — confident woman walking at sunrise"
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* Body */}
      <div className="pp-card-body flex flex-col h-full">
        {/* Tier tag */}
        {tier.tierTag && (
          <div
            className="font-bold uppercase mb-2"
            style={{
              fontSize: 10,
              letterSpacing: "2.5px",
              color: dark ? "#F4C8E2" : "#7A1E7E",
            }}
          >
            {tier.tierTag}
          </div>
        )}

        {/* Plan name */}
        <div
          className="font-extrabold mb-2"
          style={{
            fontSize: 30,
            color: dark ? "#FFFFFF" : "#111",
            letterSpacing: "-0.7px",
            lineHeight: 1.15,
          }}
        >
          {tier.name}
        </div>

        {/* Tagline */}
        <div
          className="pp-tagline mb-5"
          style={{
            fontFamily: "Inter, Montserrat, sans-serif",
            fontSize: 13.5,
            fontWeight: 500,
            color: dark ? "#D4D4D8" : "#1F1F1F",
            lineHeight: 1.5,
          }}
        >
          {tier.tagline}
        </div>

        {/* Value-stack */}
        <div
          className="mb-3"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.1px",
            color: dark ? "#FFFFFF" : "#111",
            lineHeight: 1.4,
          }}
        >
          {tier.valueStack}
        </div>

        {/* Price block */}
        <div
          className="pp-price-block mb-5"
          style={{
            padding: "16px 0",
            borderTop: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #ECECEC",
            borderBottom: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #ECECEC",
          }}
        >
          {/* Was price */}
          <span
            className="block mb-1"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: dark ? "#9CA3AF" : "#A8A8A8",
              textDecoration: "line-through",
              minHeight: 20,
              visibility: showWas ? "visible" : "hidden",
            }}
          >
            ${tier.pricing.base}/mo
          </span>

          {/* Price row */}
          <div className="flex items-baseline gap-[3px] mb-2">
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#E8339E",
                position: "relative",
                top: -6,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: "-2.5px",
                color: dark ? "#FFFFFF" : "#111",
                lineHeight: 1,
              }}
            >
              {price}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: dark ? "#9CA3AF" : "#767676" }}>
              /mo
            </span>
          </div>

          {/* Billed line */}
          <div
            style={{
              fontFamily: "Inter, Montserrat, sans-serif",
              fontSize: 12.5,
              color: dark ? "#D4D4D8" : "#3A3A3A",
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: 6,
            }}
          >
            <span style={{ color: dark ? "#FFFFFF" : "#111", fontWeight: 700 }}>
              ${billedToday.toLocaleString()} billed at enrollment
            </span>{" "}
            · {term}-month term
          </div>

          {/* Per-card savings badge */}
          {cardSavings > 0 && (
            <div
              style={{
                fontFamily: "Inter, Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: "#E8339E",
                letterSpacing: "0.3px",
              }}
            >
              You save ${cardSavings.toLocaleString()} vs. 3-month plan
            </div>
          )}
        </div>

        {/* ── One-line lab cost + modal trigger ─────────────────────────── */}
        <div
          className="mb-5"
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #ECECEC",
            background: dark ? "rgba(255,255,255,0.04)" : "#FAFAFA",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "Inter, Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: dark ? "#E5E5EA" : "#1F1F1F",
              }}
            >
              One-time labs: from{" "}
              <span style={{ fontWeight: 800, color: "#E8339E" }}>$69</span>
            </span>
            <button
              onClick={() => onLabModalOpen()}
              style={{
                fontFamily: "Inter, Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: dark ? "#F4C8E2" : "#7A1E7E",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              View lab options →
            </button>
          </div>
        </div>

        {/* Description */}
        <p
          className="pp-description italic mb-5"
          style={{
            fontFamily: "Inter, Montserrat, sans-serif",
            fontSize: 14,
            color: dark ? "#D4D4D8" : "#1F1F1F",
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          {tier.description}
        </p>

        {/* Accordions */}
        <div className="flex-1 flex flex-col">
          <CollapsibleList
            label="Onboarding Includes"
            items={tier.initiationIncludes}
            dark={dark}
          />
          <CollapsibleList
            label="Ongoing Monthly Includes"
            items={tier.ongoingIncludes}
            dark={dark}
          />
        </div>

        {/* CTA */}
        <button
          onClick={() => onConsultClick(tier.name)}
          aria-label={`Get started with the ${tier.name} plan`}
          className="block w-full text-center font-bold transition-all"
          style={{
            padding: 15,
            fontSize: 13,
            letterSpacing: "0.5px",
            cursor: "pointer",
            borderRadius: 100,
            marginTop: 18,
            background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 6px 20px rgba(232,51,142,0.3)",
          }}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
