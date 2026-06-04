/* =============================================================================
   Popular Programs — MedMethod Direct
   Updated: tier copy, pricing, and structure now match the official
   MedMethod Pricing Plans reference (Ignite / Transformation / Longevity).

   Pricing (per-month, paid upfront):
     Ignite          → 3mo $129 · 6mo $109 · 12mo $99   (was $129)
     Transformation  → 3mo $249 · 6mo $215 · 12mo $199  (was $249)
     Longevity       → 3mo $379 · 6mo $325 · 12mo $299  (was $379)

   Card structure:
     - Plan name + tagline + price (visible)
     - Initiation fee line under price
     - One-line "for the patient who…" description
     - Two collapsible accordions (chevron, FAQ-style):
         · INITIATION FEE INCLUDES
         · ONGOING MONTHLY INCLUDES
     - CTA at the bottom (wired to ConsultationModal via onConsultClick)

   Brand: magenta #E8339E → deep purple #7A1E7E gradient.
   ============================================================================= */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Term = 3 | 6 | 12;

interface TierPricing {
  base: number;          // line-through "was" price (always 3-month rate)
  m3: number; m6: number; m12: number;
}

interface InitiationFee {
  m3: number; m6: number; m12: number;
  m12Note?: string;       // e.g. "waived on 12-month plan"
  m12Was?: number;        // optional strikethrough on the 12-month fee line
}

interface Tier {
  id: "ignite" | "transformation" | "longevity";
  tierTag: string;        // "TIER U1", "TIER U2 · ★ MOST POPULAR", etc.
  badge?: { label: string; variant: "featured" | "longevity" };
  name: string;
  tagline: string;        // short eyebrow under name
  valueStack: string;     // bold one-liner above price — pre-frames the dollar figure
  description: string;    // italic "for the patient who…" line
  pricing: TierPricing;
  initiation: InitiationFee;
  inheritsFrom?: string;  // name of tier whose features carry up (used in ongoing list)
  initiationIncludes: string[];
  ongoingIncludes: string[];
  ctaVariant: "outline" | "solid" | "purple";
}

const TIERS: Tier[] = [
  {
    id: "ignite",
    tierTag: "",
    name: "Ignite",
    tagline: "Async access · price-sensitive",
    valueStack: "Your physician + your medication, every month.",
    description:
      "Patients who know what they want & value speed + price over coaching.",
    pricing: { base: 129, m3: 129, m6: 109, m12: 99 },
    initiation: { m3: 49, m6: 49, m12: 0, m12Was: 49, m12Note: "waived on 12-month plan" },
    initiationIncludes: [
      "Asynchronous physician health history review",
      "Custom protocol design tailored to your goals",
      "Personalized medication recommendations from the menu",
      "Secure messaging onboarding (48hr response SLA)",
      "Patient dashboard and treatment tracking setup",
      "À la carte drug menu access activation",
    ],
    ongoingIncludes: [
      "Asynchronous physician intake at enrollment",
      "Custom protocol design",
      "Secure messaging — 48hr response weekdays",
      "Monthly async check-in",
      "Eligibility maintenance for ongoing Rx",
      "Full access to the à la carte drug menu",
    ],
    ctaVariant: "outline",
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
    initiation: { m3: 199, m6: 199, m12: 199 },
    inheritsFrom: "Ignite",
    initiationIncludes: [
      "30-minute in-depth live physician video consultation",
      "Baseline lab panel — 30+ biomarkers",
      "Includes: CBC, comprehensive metabolic panel, lipid panel",
      "HbA1c & fasting glucose, full thyroid (TSH, free T4)",
      "Hormone baseline (testosterone, estradiol, progesterone where applicable)",
      "Vitamin D, hsCRP inflammation marker",
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
    initiation: { m3: 349, m6: 349, m12: 349 },
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

function initiationFeeFor(t: Tier, term: Term): number {
  return term === 3 ? t.initiation.m3 : term === 6 ? t.initiation.m6 : t.initiation.m12;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PopularPrograms({
  onConsultClick,
}: {
  // Accept an optional tier name so each Get Started button can pre-fill the
  // ConsultationModal with the chosen tier (e.g. "Ignite", "Transformation",
  // "Longevity") for clean tier-attribution on every booked discovery call.
  onConsultClick: (tierName?: string) => void;
}) {
  const [term, setTerm] = useState<Term>(12);

  return (
    <section
      id="programs"
      className="pt-7 pb-12 md:pt-10 md:pb-16 lg:pt-14 lg:pb-24 px-4"
      style={{ background: "#F4F4F5", fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Responsive rules for the pricing cards.
         - On mobile (<lg) cards stack, so we drop minHeight reservations and shrink
           the dark card's heavy pink halo shadow so it doesn't bleed into Longevity.
         - On desktop (>=lg) we reserve uniform vertical space row-by-row so all three
           cards align (tagline, price block, description, accordions, CTA). */}
      <style>{`
        .pp-card-body { padding: 30px 26px 24px; }
        @media (min-width: 1024px) {
          .pp-card-body { padding: 30px 24px 24px; }
          .pp-tagline { min-height: 60px; }
          .pp-price-block { min-height: 186px; }
          .pp-description { min-height: 84px; }
        }
        .pp-card { box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
        .pp-featured-card {
          /* mobile: tighter, less-bleeding halo */
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
            Your membership covers your clinical relationship — physician oversight, coaching, and protocol design. Medications are prescribed and priced separately so you only pay for what your physician recommends.
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
            />
          ))}
        </div>

        {/* ── Footnote ───────────────────────────────────────────────── */}
        <p
          className="text-center mt-6 italic"
          style={{ fontSize: 12, color: "#767676" }}
        >
          All terms paid upfront at enrollment.
        </p>
      </div>
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

  // Theme tokens — light is default; dark is used inside the lifted Transformation card
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
}: {
  tier: Tier;
  term: Term;
  onConsultClick: (tierName?: string) => void;
}) {
  const price = priceFor(tier, term);
  const billedToday = price * term;
  const showWas = term !== 3;
  // Per-card savings vs. 3-month rate across the full term
  const cardSavings =
    term === 6 ? Math.round((tier.pricing.m3 - tier.pricing.m6) * 6)
    : term === 12 ? Math.round((tier.pricing.m3 - tier.pricing.m12) * 12)
    : 0;
  const isFeatured = tier.badge?.variant === "featured";
  const isLongevity = tier.badge?.variant === "longevity";

  const feeAmount = initiationFeeFor(tier, term);
  const feeIsWaived = feeAmount === 0;
  const showFeeWas = term === 12 && tier.initiation.m12Was !== undefined && feeIsWaived;
  const feeNote = term === 12 ? tier.initiation.m12Note : undefined;

  // Theme: Transformation now renders dark, lifted, and visually "won".
  // Photo at the top of every card is preserved exactly as-is.
  const dark = isFeatured;

  // Card outer styles per variant — note: heavy pink halo shadow is desktop-only
  // (it gets reduced on mobile via the .pp-featured-card class below to prevent
  // bleeding into the Longevity card stacked underneath).
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
      {/* Image hero with optional badge bar (Transformation only) */}
      {isLongevity ? (
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px]"
          style={{
            backgroundImage: "url(/manus-storage/longevity-v2_9056b984.png)",
            backgroundSize: "115%",
            backgroundPosition: "center 55%",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#F5C9A1",
            borderRadius: "16px 16px 0 0",
          }}
        />
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
            className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[220px]"
            style={{
              backgroundImage: "url(/manus-storage/transformation-v3-wide_8903c169.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#1a1a2e",
            }}
          />
        </>
      ) : (
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px]"
          style={{
            backgroundImage: "url(/manus-storage/Ignite_94bcb442.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}

      {/* Body */}
      <div className="pp-card-body flex flex-col h-full">
        {/* Tier tag — only rendered when present (kept for Longevity "Concierge") */}
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

        {/* Tagline — desktop reserves uniform vertical space (60px) so 1- vs 2-line
            taglines align across all three cards. On mobile the cards are stacked so
            we drop the reserved space and let the tagline auto-size. */}
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

        {/* Value-stack — bold one-liner that pre-frames the price ("why am I paying this?") */}
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

        {/* Price block — desktop reserves 186px so initiation fee block aligns
            across all three cards. On mobile we drop the minHeight since cards stack. */}
        <div
          className="pp-price-block mb-5"
          style={{
            padding: "16px 0",
            borderTop: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #ECECEC",
            borderBottom: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #ECECEC",
          }}
        >
          {/* Was price (line-through), reserve space when hidden */}
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
                marginBottom: 6,
              }}
            >
              You save ${cardSavings.toLocaleString()} vs. 3-month plan
            </div>
          )}

          {/* Initiation fee — primary line + optional muted secondary line */}
          {feeIsWaived ? (
            <>
              <div
                style={{
                  fontFamily: "Inter, Montserrat, sans-serif",
                  fontSize: 13,
                  color: dark ? "#4ADE80" : "#16A34A",
                  fontWeight: 800,
                  lineHeight: 1.4,
                }}
              >
                + $0 initiation fee
              </div>
              {(tier.initiation.m12Was !== undefined || feeNote) && (
                <div
                  style={{
                    fontFamily: "Inter, Montserrat, sans-serif",
                    fontSize: 11.5,
                    color: dark ? "#9CA3AF" : "#767676",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    marginTop: 2,
                  }}
                >
                  ({tier.initiation.m12Was !== undefined && (
                    <>was <span style={{ textDecoration: "line-through" }}>${tier.initiation.m12Was}</span>{feeNote ? " — " : ""}</>
                  )}{feeNote})
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                fontFamily: "Inter, Montserrat, sans-serif",
                fontSize: 12.5,
                color: dark ? "#D4D4D8" : "#3A3A3A",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              + ${feeAmount} one-time initiation fee
            </div>
          )}
        </div>

        {/* Description — desktop reserves 84px so the next row (accordions) aligns
            across all three cards. On mobile we drop it since cards are stacked. */}
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

        {/* Accordions wrapper — flex-1 pushes CTA to a uniform bottom across all cards */}
        <div className="flex-1 flex flex-col">
          <CollapsibleList
            label="Initiation Fee Includes"
            items={tier.initiationIncludes}
            dark={dark}
          />
          <CollapsibleList
            label="Ongoing Monthly Includes"
            items={tier.ongoingIncludes}
            dark={dark}
          />
        </div>

        {/* CTA — unified magenta→purple gradient on all three tiers, anchored to the bottom.
            Pre-fills the ConsultationModal with the chosen tier name for attribution. */}
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
