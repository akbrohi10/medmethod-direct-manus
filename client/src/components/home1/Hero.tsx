/* =============================================================================
   Hero Section — MedMethod Direct (Ad Landing Page)
   - Desktop (md+): 50/50 split. Live HTML left panel + original photo right.
   - Mobile (< md): cold-traffic optimized:
       * tighter portrait photo crop (faces + product lineup, not full landscape)
       * top-bottom gradient overlay so the headline can sit ON the image
       * headline + 1-line value prop sit on the photo (above the fold)
       * full-width gradient CTA right below the image (within first scroll)
       * slim 3-up trust strip (icon + label) — no big circles
       * total mobile hero height is roughly one viewport, not two
   Brand: Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { ArrowRight, Scale, Stethoscope, Monitor } from "lucide-react";

const HERO_PHOTO_DESKTOP =
  "/manus-storage/hero-photo-right-blend_69fe9751_ad73d2c6.png";
const HERO_PHOTO_MOBILE = "/manus-storage/hero-photo-mobile_58542d69_a70dc6e5.png";
const PINK = "#E8339E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";

/* ---------- Desktop sub-components (unchanged behavior) ---------- */
function DesktopBadge({
  icon: Icon,
  label,
}: {
  icon: typeof Scale;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          border: `1.5px solid ${PINK}`,
          background: "rgba(232,51,158,0.10)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: PINK }} />
      </span>
      <span className="text-xs font-semibold leading-tight text-white/90 whitespace-pre-line">
        {label}
      </span>
    </li>
  );
}

function DesktopCopy({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-16">
      <h1
        className="font-black leading-[1.02] tracking-tight text-white"
        style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
      >
        A Doctor.
        <br />
        A Trainer.
        <br />
        <span
          style={{
            background: GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          A Real Plan.
        </span>
      </h1>
      <div
        className="mt-5 h-[3px] w-16 rounded-full"
        style={{ background: PINK }}
      />
      <p
        className="mt-6 text-white/85 leading-relaxed max-w-md"
        style={{ fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)" }}
      >
        Doctor-led weight loss and hormone optimization with real
        accountability, personalized care, and a custom fitness and nutrition
        plan.
      </p>
      <button
        type="button"
        onClick={onConsultClick}
        className="mt-7 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white text-[15px] font-bold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/60"
        style={{
          background: GRADIENT,
          boxShadow: "0 12px 32px rgba(232,51,158,0.40)",
        }}
      >
        Start Your Consultation
        <ArrowRight className="w-5 h-5" />
      </button>
      <ul className="mt-8 flex items-center gap-7 divide-x divide-white/10">
        <DesktopBadge icon={Scale} label={"Biweekly\nWeigh-ins"} />
        <DesktopBadge icon={Stethoscope} label={"Doctor-led\nCare"} />
        <DesktopBadge icon={Monitor} label={"100%\nVirtual"} />
      </ul>
    </div>
  );
}

/* ---------- Mobile sub-components (rebuilt for ad-page conversions) ---------- */
function MobileBadge({
  icon: Icon,
  label,
}: {
  icon: typeof Scale;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 min-w-0">
      <Icon className="w-4 h-4 shrink-0" style={{ color: PINK }} />
      <span className="text-[12px] font-semibold leading-tight text-white/90 whitespace-nowrap">
        {label}
      </span>
    </li>
  );
}

function MobileHero({ onConsultClick }: { onConsultClick: () => void }) {
  // Layout: navbar gap (pt-16) → headline block → full-bleed photo (faces
  // unobstructed) → CTA + trust badges. Keeps the photo clean.
  return (
    <div className="md:hidden bg-black pt-16">
      {/* Headline block — sits above the photo */}
      <div className="px-5 pt-7 pb-6">
        <h1
          className="font-black leading-[1.04] tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 9vw, 2.6rem)" }}
        >
          A Doctor.
          <br />
          A Trainer.
          <br />
          <span
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            A Real Plan.
          </span>
        </h1>
        <div
          className="mt-4 h-[3px] w-14 rounded-full"
          style={{ background: PINK }}
        />
        <p className="mt-5 text-[15px] leading-snug text-white/85">
          Doctor-led weight loss &amp; hormone optimization — real
          accountability, a real plan, real results.
        </p>
      </div>

      {/* Photo — full-bleed, no overlay text, faces visible */}
      <div className="relative w-full">
        <img
          src={HERO_PHOTO_MOBILE}
          alt="A doctor with a trainer and a coach next to a lineup of medication options"
          className="block w-full h-auto max-h-[65vh] sm:max-h-[58vh] object-cover object-center select-none"
          draggable={false}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Action block — CTA + trust badges */}
      <div className="px-5 pt-6 pb-7">
        <button
          type="button"
          onClick={onConsultClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white text-[15px] font-bold tracking-wide active:scale-[0.98] transition-transform duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/60"
          style={{
            background: GRADIENT,
            boxShadow: "0 10px 26px rgba(232,51,158,0.45)",
          }}
        >
          Start Your Consultation
          <ArrowRight className="w-5 h-5" />
        </button>

        <ul className="mt-5 flex items-center justify-between gap-2">
          <MobileBadge icon={Scale} label="Biweekly Weigh-ins" />
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <MobileBadge icon={Stethoscope} label="Doctor-led" />
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <MobileBadge icon={Monitor} label="100% Virtual" />
        </ul>
      </div>
    </div>
  );
}

/* ---------- Top-level component ---------- */
export default function Hero({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      aria-label="A Doctor. A Trainer. A Real Plan."
      className="relative w-full bg-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <MobileHero onConsultClick={onConsultClick} />

      {/* Desktop: 50/50 split — live copy left, original photo right */}
      <div className="hidden md:grid md:grid-cols-2 md:items-stretch min-h-[560px] lg:min-h-[640px] xl:min-h-[680px]">
        <DesktopCopy onConsultClick={onConsultClick} />
        <div className="relative w-full h-full bg-black" aria-hidden="true">
          <img
            src={HERO_PHOTO_DESKTOP}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
            draggable={false}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* CSS-side blend: black-to-transparent so the photo dissolves into
              the left panel even on wider viewports where the image fade alone
              isn't enough. */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
            style={{
              background:
                "linear-gradient(to right, #000 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
