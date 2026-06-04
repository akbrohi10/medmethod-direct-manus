/* =============================================================================
   Popular Programs — MedMethod Direct
   LEAN conversion-first version (cold-traffic ad landing page).
   
   Enhanced header & toggle (9 suggestions applied):
   1. Headline smaller & tighter (1.5–2rem, max-w-3xl)
   2. Removed "CHOOSE YOUR PLAN" eyebrow (toggle label is enough)
   3. Flattened toggle (no double-pill, just inner toggle on gray bg)
   4. Dollar savings under active button (brand purple, not green)
   5. Replaced filler text with "All plans start with a free 15-minute consultation"
   6. Renamed "COMMITMENT TERM" to "Plan Length" (less clinical)
   7. 6-month default confirmed
   8. Active button uses brand gradient (not pure black)
   9. Save badge color is brand purple (not green)

   Longevity card enhancement:
   - Image hero (200px) at top with overlaid badge (bottom-left, semi-transparent)
   - Plan name, tagline, price, bullets, CTA below image

   Brand: magenta #E8339E → deep purple #7A1E7E gradient.
   ============================================================================= */
import { useState } from "react";

type Term = 3 | 6 | 12;

interface TierPricing {
  base: number;          // 3-month baseline (line-through "was" price)
  m3: number; m6: number; m12: number;
}

interface Tier {
  id: "ignite" | "transformation" | "longevity";
  badge?: { label: string; variant: "featured" | "longevity" };
  name: string;
  tagline: string;       // short customer-facing "for you if…" line
  pricing: TierPricing;
  inheritsFrom?: string; // name of the tier whose features carry up
  bullets: string[];     // 4–5 max
  ctaVariant: "outline" | "solid" | "purple";
}

const TIERS: Tier[] = [
  {
    id: "ignite",
    name: "Ignite",
    tagline: "For self-starters who want a real doctor managing their meds.",
    pricing: { base: 89, m3: 89, m6: 85, m12: 80 },
    bullets: [
      "Physician intake + custom protocol at enrollment",
      "Secure messaging with 48-hr weekday response",
      "Monthly check-ins to keep your plan on track",
      "Full access to our à la carte medication menu",
    ],
    ctaVariant: "outline",
  },
  {
    id: "transformation",
    badge: { label: "★ Most Popular", variant: "featured" },
    name: "Transformation",
    tagline: "For women who want a coach, a plan, and real accountability.",
    pricing: { base: 199, m3: 199, m6: 189, m12: 179 },
    inheritsFrom: "Ignite",
    bullets: [
      "Biweekly video sessions with your performance coach + trainer",
      "Structured nutrition + fitness plan (preserves lean mass)",
      "Monthly live physician video visit",
      "Unlimited secure messaging (24-hr response)",
      "Proactive medication titration as your body adapts",
    ],
    ctaVariant: "solid",
  },
  {
    id: "longevity",
    badge: { label: "✦ Longevity Program", variant: "longevity" },
    name: "Longevity",
    tagline: "For women optimizing labs, hormones, and long-term healthspan.",
    pricing: { base: 349, m3: 349, m6: 332, m12: 314 },
    inheritsFrom: "Transformation",
    bullets: [
      "Quarterly comprehensive lab panel (60+ biomarkers)",
      "45-min physician deep-dive on your labs and protocol",
      "At-home phlebotomy where available",
      "Integrated BHRT / TRT consultation included",
      "Priority physician access (12-hr response)",
    ],
    ctaVariant: "purple",
  },
];

// ── Inline check icon (18px circle, soft green) ─────────────────────────────
function CheckIcon() {
  return (
    <span
      className="flex-shrink-0 mt-[1px] flex items-center justify-center rounded-full"
      style={{
        width: 18,
        height: 18,
        background: "#F0FDF4",
        border: "1.5px solid #86EFAC",
      }}
    >
      <svg viewBox="0 0 10 10" fill="none" style={{ width: 9, height: 9 }}>
        <path
          d="M2 5l2 2 4-4"
          stroke="#16A34A"
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

// ── Component ────────────────────────────────────────────────────────────────
export default function PopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [term, setTerm] = useState<Term>(6);

  return (
    <section
      id="programs"
      className="py-12 md:py-16 lg:py-24 px-4"
      style={{ background: "#F4F4F5", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Header (smaller, tighter, no eyebrow) ───────────────────── */}
        <div className="text-center mb-7 md:mb-10">
          <h2
            className="font-extrabold mb-4 mx-auto"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "#111",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              maxWidth: "48rem",
            }}
          >
            Every level of care. One dedicated physician.
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{ fontSize: 14, color: "#767676", lineHeight: 1.55 }}
          >
            All plans start with a free 15-minute consultation. Pick the level of hands-on support that matches your goals.
          </p>
        </div>

        {/* ── Plan Length Toggle (flattened, brand gradient active, dollar savings) ── */}
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
              // Savings calculation: (base price - discounted price) * term length
              const savings = m === 6 ? Math.round((89 - 85) * 6) : m === 12 ? Math.round((89 - 80) * 12) : 0;
              return (
                <div key={m} className="flex flex-col items-center">
                  <button
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
                    {m}-month
                  </button>
                  {/* Savings line under active button only (brand purple, not green) */}
                  {active && savings > 0 && (
                    <span
                      className="font-bold mt-1"
                      style={{
                        fontSize: 10,
                        color: "#7A1E7E",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Save ${savings}
                    </span>
                  )}
                </div>
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
      </div>
    </section>
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
  onConsultClick: () => void;
}) {
  const price = priceFor(tier, term);
  const billedToday = price * term;
  const showWas = term !== 3;
  const isFeatured = tier.badge?.variant === "featured";
  const isLongevity = tier.badge?.variant === "longevity";

  // Card outer styles per variant
  const cardStyle: React.CSSProperties = isFeatured
    ? {
        background:
          "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%) border-box",
        border: "2px solid transparent",
        borderRadius: 18,
        boxShadow: "0 24px 60px rgba(232,51,142,0.15)",
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

  const liftClass = "";

  return (
    <div
      className={`flex flex-col overflow-hidden transition-transform duration-200 ${liftClass}`}
      style={cardStyle}
    >
      {/* Longevity: clean image hero (no badge overlay) */}
      {isLongevity ? (
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px]"
          style={{
            backgroundImage: "url(/manus-storage/97247d01-1ed4-4018-92fe-131d319f63bc_114a6557.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 50%",
            backgroundRepeat: "no-repeat",
            borderRadius: "16px 16px 0 0",
          }}
        />
      ) : isFeatured ? (
        /* Transformation: badge bar + image hero */
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
              backgroundImage: "url(/manus-storage/f803a5c4-622f-48da-9bd3-5321b78e2679_3a4b9616.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 35%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </>
      ) : (
        /* Ignite: clean image hero (no badge overlay) */
        <div
          className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[260px]"
          style={{
            backgroundImage: "url(/manus-storage/90019325-3AC1-4E6A-BF51-9488107393EF_44d8423e.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 50%",
            backgroundRepeat: "no-repeat",
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}

      {/* Body */}
      <div
        className="flex flex-col h-full"
        style={{ padding: "28px 26px 26px" }}
      >
        {/* Plan name */}
        <div
          className="font-extrabold mb-2"
          style={{
            fontSize: 30,
            color: "#111",
            letterSpacing: "-0.7px",
            lineHeight: 1.05,
          }}
        >
          {tier.name}
        </div>

        {/* Tagline — fixed min-height so all three taglines occupy the same vertical space */}
        <div
          className="font-medium mb-6"
          style={{
            fontSize: 13,
            color: "#3A3A3A",
            lineHeight: 1.5,
            minHeight: 60,
          }}
        >
          {tier.tagline}
        </div>

        {/* Price block */}
        <div
          className="mb-6"
          style={{
            padding: "18px 0",
            borderTop: "1px solid #ECECEC",
            borderBottom: "1px solid #ECECEC",
          }}
        >
          {/* Was price (line-through), reserve space when hidden */}
          <span
            className="block mb-1"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#A8A8A8",
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
                fontSize: 60,
                fontWeight: 900,
                letterSpacing: "-2.5px",
                color: "#111",
                lineHeight: 1,
              }}
            >
              {price}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#767676" }}>
              /mo
            </span>
          </div>

          {/* Combined sub-line: term + HSA/FSA */}
          <div
            style={{
              fontSize: 12,
              color: "#767676",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "#111", fontWeight: 700 }}>${billedToday.toLocaleString()} paid upfront</span> · {term}-month term · <span style={{ color: "#16A34A", fontWeight: 700 }}>HSA / FSA</span>
          </div>
        </div>

        {/* Bullets */}
        <ul className="flex flex-col gap-3 mb-8 list-none">
          {tier.inheritsFrom && (
            <li
              className="flex items-start gap-2.5"
              style={{
                fontSize: 13.5,
                color: "#7A1E7E",
                fontWeight: 700,
                lineHeight: 1.5,
                paddingBottom: 10,
                borderBottom: "1px dashed #E5C9E0",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                +
              </span>
              <span>Everything in {tier.inheritsFrom}, plus:</span>
            </li>
          )}
          {tier.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5"
              style={{
                fontSize: 13.5,
                color: "#111",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              <CheckIcon />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA — pushed to bottom of card */}
        <button
          onClick={onConsultClick}
          className="block w-full text-center font-bold transition-all mt-auto"
          style={{
            padding: 15,
            fontSize: 13,
            letterSpacing: "0.5px",
            cursor: "pointer",
            borderRadius: 100,
            ...(tier.ctaVariant === "outline"
              ? {
                  background: "#fff",
                  border: "1.5px solid #D6D6D6",
                  color: "#111",
                }
              : tier.ctaVariant === "solid"
              ? {
                  background:
                    "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(232,51,142,0.3)",
                }
              : {
                  background: "#7A1E7E",
                  color: "#fff",
                  border: "none",
                }),
          }}
        >
          Start My Consultation →
        </button>
      </div>
    </div>
  );
}
