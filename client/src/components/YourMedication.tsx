/*
 * YourMedication.tsx
 * Design: Horizontal scroll carousel showcasing all 6 MedMethod Direct medications.
 * Each card: product image, medication name, form type, key details, In Stock badge, program link.
 * Snap-scroll on mobile, arrow navigation on desktop.
 * Light background (#FAFAFA) for contrast against surrounding dark sections.
 */

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, ArrowRight, Pill } from "lucide-react";

/* ── CDN URLs ─────────────────────────────────────────────────────────── */
const SEMAGLUTIDE_VIAL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/slimmethod-vial-cropped_c84475b1.png";
const TIRZEPATIDE_VIAL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/accelerate-vial-cropped_56761b54.png";
const ORAL_SEMAGLUTIDE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/oral-semaglutide-CRXNcURBAuXf3pPBYJDmsN.webp";
const ORAL_TIRZEPATIDE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/oral-tirzepatide-T6ebaHYeA8hGfU7U2vmFL9.webp";
const ESTRADIOL_PATCH =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/estradiol-patch-pouch-hfwRbiG4gLEMGqGLeSsQPr.png";
const PROGESTERONE_CAPSULES =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/progesterone-capsules-DpQK32e9NSccVpv8UMzW7Q.png";
const TESTOSTERONE_CREAM =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/testosterone-cream-dispenser-QgDipMcSxgrkYn593aBNsm.png";
const ZEPBOUND_PEN =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CEVzfjoRpvjPssOc.webp";
const ZEPBOUND_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/nzQKifmLIHhUmqKx.png";
const WEGOVY_PEN =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/xULqFLzJRzLBIKIs.png";
const WEGOVY_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/RsueKshBHQxlBMUU.png";
const WEGOVY_PILL =
  "/manus-storage/wegovy-pill-dark_fe6ce9f7.png";
const FOUNDAYO_BOTTLE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/mZQtjRShlxknoDgQ.png";
const FOUNDAYO_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/vuFGUEgaqyBIXccG.png";

/* ── Medication Data ──────────────────────────────────────────────────── */
interface Med {
  name: string;
  form: string;
  image: string;
  program: string;
  accent: string;
  badge: string;
  details: string[];
  isBrandName?: boolean;
  elevated?: boolean;
  price?: string;
  priceNote?: string;
  logo?: string;
  bgImage?: string;
  bgSize?: string;
  detailSubtitles?: string[];
}

const medications: Med[] = [
  /* ── Brand-Name Cards (front of carousel) ── */
  {
    name: "Wegovy",
    form: "Semaglutide Injection · Novo Nordisk",
    image: "/manus-storage/wegovy-pen-dark-v2_dc45550a.png",
    bgImage: "/manus-storage/wegovy-pen-dark-v2_dc45550a.png",
    program: "NovoCare / Telehealth",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$199–$399/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved GLP-1 receptor agonist",
      "Pre-filled single-dose pen",
      "Once-weekly injection",
    ],
  },
  {
    name: "Wegovy Pill",
    form: "Oral Semaglutide · Novo Nordisk",
    image: WEGOVY_PILL,
    bgImage: WEGOVY_PILL,
    program: "NovoCare / Telehealth",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$149–$299/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved oral GLP-1",
      "Daily tablet — no injections",
      "Take on empty stomach with water",
    ],
  },
  {
    name: "Zepbound",
    form: "Tirzepatide Injection · Eli Lilly",
    image: "/manus-storage/zepbound-dark-v2_664c26d8.png",
    bgImage: "/manus-storage/zepbound-dark-v2_664c26d8.png",
    program: "LillyDirect",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$299–$449/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "FDA-approved dual GIP/GLP-1 agonist",
      "Pre-filled single-use pen",
      "Dose escalation: 2.5mg → 15mg",
    ],
  },
  {
    name: "Foundayo",
    form: "Orforglipron Tablet · Eli Lilly",
    image: "/manus-storage/foundayo-dark-v2_70c487ed.png",
    bgImage: "/manus-storage/foundayo-dark-v2_70c487ed.png",
    program: "LillyDirect",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$149–$299/mo",
    priceNote: "Price increases as dose increases",
    details: [
      "First non-peptide oral GLP-1",
      "Daily pill — no food/water restrictions",
      "Once-daily dosing",
    ],
  },
  /* ── Compounded Cards ── */
  {
    name: "Semaglutide + B12",
    form: "Injectable Vial",
    image: SEMAGLUTIDE_VIAL,
    program: "SlimMethod",
    accent: "#E8339E",
    badge: "In Stock",
    details: [
      "Compounded GLP-1 receptor agonist",
      "Vitamin B12 for energy support",
      "2mL multi-dose vial",
    ],
  },
  {
    name: "Oral Semaglutide",
    form: "Oral Capsule",
    image: ORAL_SEMAGLUTIDE,
    program: "SlimMethod",
    accent: "#E8339E",
    badge: "In Stock",
    details: [
      "Compounded GLP-1 oral form",
      "No injections required",
      "Daily oral dosing",
    ],
  },
  {
    name: "Tirzepatide + Niacinamide",
    form: "Injectable Vial",
    image: TIRZEPATIDE_VIAL,
    program: "AccelerateMethod",
    accent: "#7A1E7E",
    badge: "In Stock",
    details: [
      "Dual GIP/GLP-1 receptor agonist",
      "Niacinamide for metabolic support",
      "2mL multi-dose vial",
    ],
  },
  {
    name: "Oral Tirzepatide + Niacinamide",
    form: "Oral Capsule",
    image: ORAL_TIRZEPATIDE,
    program: "AccelerateMethod",
    accent: "#7A1E7E",
    badge: "In Stock",
    details: [
      "Dual GIP/GLP-1 oral form",
      "Niacinamide for metabolic support",
      "No injections required",
    ],
  },
  {
    name: "Estradiol Patch",
    form: "Transdermal Patch",
    image: ESTRADIOL_PATCH,
    program: "HormoneMethod",
    accent: "#D4628A",
    badge: "In Stock",
    details: [
      "Bioidentical estradiol",
      "Applied twice weekly",
      "Menopause & perimenopause relief",
    ],
  },
  {
    name: "Progesterone Capsules",
    form: "Oral Capsule",
    image: PROGESTERONE_CAPSULES,
    program: "HormoneMethod",
    accent: "#C44D7B",
    badge: "In Stock",
    details: [
      "Compounded 100mg capsules",
      "Taken orally at bedtime",
      "Hormonal balance support",
    ],
  },
  {
    name: "Testosterone Cream",
    form: "Topi-CLICK Dispenser",
    image: TESTOSTERONE_CREAM,
    program: "HormoneMethod",
    accent: "#B8336A",
    badge: "In Stock",
    details: [
      "Compounded for women",
      "Metered dose precision",
      "Energy, libido & mood support",
    ],
  },
];

/* ── Component ────────────────────────────────────────────────────────── */
export default function YourMedication({ onConsultClick }: { onConsultClick?: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    // Calculate active card index based on scroll position (center-snap)
    const cardWidth = 300; // 280px card + 20px gap
    const centerOffset = el.clientWidth / 2 - 140; // half viewport minus half card
    const idx = Math.round((el.scrollLeft) / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), medications.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section
      id="medication"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #E8339E33, #7A1E7E33, transparent)",
        }}
      />

      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: "#E8339E" }}
          >
            Your Medication
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: "#111", fontFamily: "'Playfair Display', serif" }}
          >
            Prescribed by Your Doctor.{" "}
            <span style={{ color: "#E8339E" }}>Shipped to Your Door.</span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-2"
            style={{ color: "#666" }}
          >
            Brand-name or compounded, we prescribe both. Your doctor guides you through the options — so you choose what fits your body and your budget.
          </p>
        </div>

        {/* Brand-name callout */}
        <div
          className="max-w-3xl mx-auto mb-10 rounded-xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "linear-gradient(135deg, #F9F0F5, #F5F0FA)",
            border: "1px solid #E8339E18",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "#E8339E12" }}
          >
            <Pill size={15} style={{ color: "#E8339E" }} />
          </div>
          <div>
            <p
              className="text-sm font-bold mb-0.5"
              style={{ color: "#222" }}
            >
              We also prescribe brand-name medications
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#666" }}
            >
              Including Ozempic<span style={{ verticalAlign: "super", fontSize: "8px" }}>&reg;</span>, Wegovy<span style={{ verticalAlign: "super", fontSize: "8px" }}>&reg;</span>, Mounjaro<span style={{ verticalAlign: "super", fontSize: "8px" }}>&reg;</span>, and Zepbound<span style={{ verticalAlign: "super", fontSize: "8px" }}>&reg;</span>. The compounded options below are our most popular — same active ingredients at a lower cost.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              background: canScrollLeft ? "#fff" : "#f5f5f5",
              borderColor: canScrollLeft ? "#E8339E44" : "#e0e0e0",
              opacity: canScrollLeft ? 1 : 0.4,
              boxShadow: canScrollLeft ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
              cursor: canScrollLeft ? "pointer" : "default",
            }}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} style={{ color: canScrollLeft ? "#E8339E" : "#aaa" }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              background: canScrollRight ? "#fff" : "#f5f5f5",
              borderColor: canScrollRight ? "#E8339E44" : "#e0e0e0",
              opacity: canScrollRight ? 1 : 0.4,
              boxShadow: canScrollRight ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
              cursor: canScrollRight ? "pointer" : "default",
            }}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} style={{ color: canScrollRight ? "#E8339E" : "#aaa" }} />
          </button>

          {/* Left fade */}
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #FAFAFA, transparent)",
              }}
            />
          )}

          {/* Right fade */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(270deg, #FAFAFA, transparent)",
              }}
            />
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory pl-4 pr-4 md:pl-0 md:pr-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {medications.map((med, idx) => (
              <MedCard key={med.name} med={med} isActive={idx === activeIndex} onConsultClick={onConsultClick} />
            ))}

            {/* End-of-carousel CTA card */}
            <div
              className="flex-shrink-0 snap-center rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8"
              style={{
                width: "clamp(260px, calc(100vw - 48px), 280px)",
                minHeight: "420px",
                background: "linear-gradient(135deg, #0D0D1A, #1A0D2E)",
                border: "1.5px solid rgba(232,51,158,0.2)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(232,51,158,0.12)" }}
              >
                <Pill size={24} style={{ color: "#E8339E" }} />
              </div>
              <h3
                className="text-lg font-extrabold mb-3"
                style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
              >
                Looking for a different medication?
              </h3>
              <p
                className="text-xs leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                We have access to a full compounding formulary across weight loss, hormones, and longevity. Your physician will find the right fit for you.
              </p>
              <button
                onClick={() => onConsultClick?.()}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                  color: "#fff",
                }}
              >
                Book Free Consult
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Scroll indicator dots (mobile) */}
          <div className="flex md:hidden justify-center gap-1.5 mt-4">
            {medications.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? "#E8339E" : "#ddd",
                  transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center"
        >
          {[
            "Licensed 503B Pharmacy",
            "Cold-Packed & Shipped Monthly",
            "Dose Changes. Price Doesn't.",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#E8339E15" }}
              >
                <Check size={12} style={{ color: "#E8339E" }} />
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#444" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        #medication [class*="overflow-x-auto"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

/* ── Individual Card ──────────────────────────────────────────────────── */
/* Elevated card icons */
const ElevatedCheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const ElevatedPenIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const ElevatedCalIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ELEVATED_ICONS = [ElevatedCheckIcon, ElevatedPenIcon, ElevatedCalIcon];

function MedCard({ med, isActive = false, onConsultClick }: { med: Med; isActive?: boolean; onConsultClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isActive;

  /* ── Elevated (premium) card layout ── */
  if (med.elevated) {
    return (
      <div
        className="flex-shrink-0 snap-center rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col"
        style={{
          width: "clamp(260px, calc(100vw - 48px), 280px)",
          background: "#fff",
          border: `1.5px solid ${med.accent}40`,
          boxShadow: active
            ? `0 16px 48px ${med.accent}25, 0 0 0 2px ${med.accent}30`
            : `0 4px 20px ${med.accent}12, 0 1px 4px rgba(0,0,0,0.04)`,
          transform: isActive ? "scale(1.03)" : "scale(1)",
          transformOrigin: "center top",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image area with dark background */}
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
          style={{
            height: "200px",
            background: med.bgImage
              ? `url(${med.bgImage}) center/${med.bgSize || 'cover'} no-repeat`
              : `linear-gradient(160deg, #0D0B1F, #1A0D2E)`,
            backgroundColor: '#0D0B1F',
          }}
        >
          {/* Badge */}
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider z-[2]"
            style={{
              background: "rgba(27,58,75,0.85)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {med.badge}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Form type + manufacturer */}
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1"
            style={{ color: med.accent }}
          >
            {med.form}
          </p>

          {/* Name with ® */}
          <h3
            className="text-lg font-extrabold mb-0.5"
            style={{ color: "#111", lineHeight: 1.2 }}
          >
            {med.name}<span style={{ fontSize: "10px", verticalAlign: "super" }}>&reg;</span>
          </h3>

          {/* Program */}
          <p
            className="text-[11px] font-medium mb-3"
            style={{ color: "#888" }}
          >
            Included in {med.program}
          </p>

          {/* Divider */}
          <div className="h-px w-full mb-3" style={{ background: "#f0f0f0" }} />

          {/* Details — elevated with icons + subtitles */}
          <ul className="space-y-3 flex-1">
            {med.details.map((d, i) => {
              const IconComp = ELEVATED_ICONS[i % ELEVATED_ICONS.length];
              return (
                <li key={d} className="flex items-start gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${med.accent}10` }}
                  >
                    <IconComp color={med.accent} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold leading-tight" style={{ color: "#222" }}>{d}</span>
                    {med.detailSubtitles?.[i] && (
                      <span className="text-[10px] leading-tight mt-0.5" style={{ color: "#888" }}>
                        {med.detailSubtitles[i]}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Price bar + Start Now button */}
          {med.price && (
            <div
              className="mt-3 -mx-4 px-4 py-3 flex items-center justify-between"
              style={{
                borderTop: `1.5px solid ${med.accent}20`,
                background: `linear-gradient(90deg, ${med.accent}05, ${med.accent}08)`,
              }}
            >
              <div>
                <p className="text-sm font-extrabold" style={{ color: "#111" }}>
                  {med.price}
                </p>
                {med.priceNote && (
                  <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>
                    {med.priceNote}
                  </p>
                )}
              </div>
              <button
                onClick={() => onConsultClick?.()}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[10px] font-bold text-white transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${med.accent}, #7A1E7E)`,
                  boxShadow: `0 4px 12px ${med.accent}40`,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Start Now
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Standard card layout ── */
  return (
    <div
      className="flex-shrink-0 snap-center rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col"
      style={{
        width: "clamp(260px, calc(100vw - 48px), 280px)",
        background: "#fff",
        border: active ? `2px solid ${med.accent}66` : "1.5px solid #EBEBEB",
        boxShadow: active
          ? `0 16px 48px ${med.accent}20, 0 4px 12px rgba(0,0,0,0.06)`
          : "0 4px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)",
        transform: isActive ? "scale(1.03)" : "scale(1)",
        transformOrigin: "center top",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
        style={{
          height: "220px",
          background: med.bgImage
            ? `url(${med.bgImage}) center/${med.bgSize || 'cover'} no-repeat`
            : `linear-gradient(160deg, ${med.accent}08 0%, ${med.accent}04 40%, ${med.accent}0A 100%)`,
          backgroundColor: med.bgImage ? '#0D0B1F' : undefined,
        }}
      >
        {/* Radial glow behind product (only when no bgImage) */}
        {!med.bgImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${med.accent}15, transparent 70%)`,
            }}
          />
        )}

        {/* Brand logo (top-left) */}
        {med.logo && (
          <img
            src={med.logo}
            alt={`${med.name} logo`}
            className="absolute top-3 left-3 object-contain z-[2]"
            style={{
              height: "28px",
              maxWidth: "100px",
              filter: med.bgImage ? "brightness(0) invert(1)" : "none",
            }}
          />
        )}

        {!med.bgImage && (
          <img
            src={med.image}
            alt={med.name}
            className="object-contain transition-transform duration-300 relative z-[1]"
            style={{
              height: med.isBrandName ? "160px" : "180px",
              width: "auto",
              maxWidth: med.isBrandName ? "160px" : "auto",
              marginTop: med.logo ? "24px" : "0",
              transform: active ? "scale(1.08) translateY(-6px)" : "scale(1)",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
            }}
          />
        )}

        {/* Badge — frosted glass style */}
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider z-[2]"
          style={{
            background: med.isBrandName
              ? "rgba(27,58,75,0.85)"
              : "rgba(230,249,240,0.9)",
            backdropFilter: "blur(8px)",
            color: med.isBrandName ? "#fff" : "#0D8050",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {!med.isBrandName && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#0D8050" }}
            />
          )}
          {med.badge}
        </span>
      </div>

      {/* Gradient divider */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${med.accent}40, transparent)`,
        }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Form type */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
          style={{ color: med.accent }}
        >
          {med.form}
        </p>

        {/* Name */}
        <h3
          className="text-base font-extrabold mb-1"
          style={{ color: "#111", lineHeight: 1.3 }}
        >
          {med.name}
        </h3>

        {/* Program */}
        <p
          className="text-[11px] font-medium mb-3"
          style={{ color: "#999" }}
        >
          Included in {med.program}
        </p>

        {/* Details — enhanced checkmarks */}
        <ul className="space-y-2 flex-1">
          {med.details.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2 text-xs"
              style={{ color: "#444" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0"
                style={{ background: `${med.accent}12` }}
              >
                <Check
                  size={11}
                  strokeWidth={3}
                  style={{ color: med.accent }}
                />
              </span>
              <span className="leading-[1.4] pt-0.5">{d}</span>
            </li>
          ))}
        </ul>

        {/* Price — accent strip */}
        {med.price && (
          <div
            className="mt-4 -mx-5 px-5 py-3"
            style={{
              background: `linear-gradient(90deg, ${med.accent}06, ${med.accent}10, ${med.accent}06)`,
              borderTop: `1px solid ${med.accent}15`,
              borderBottom: `1px solid ${med.accent}15`,
            }}
          >
            <p className="text-base font-extrabold" style={{ color: "#111" }}>
              {med.price}
            </p>
            {med.priceNote && (
              <p className="text-[13px] mt-0.5" style={{ color: "#555", fontWeight: 500 }}>
                {med.priceNote}
              </p>
            )}
          </div>
        )}

        {/* Price — accent strip (brand-name only) */}
        {/* already rendered above */}

        {/* Rx disclaimer — styled with shield icon (compounded only) */}
        {!med.isBrandName && (
          <div
            className="mt-4 pt-3 flex items-center gap-2"
            style={{ borderTop: "1px solid #f0f0f0" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={med.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p className="text-[11px] font-medium" style={{ color: "#777" }}>
              Rx Only — prescribed by your MedMethod physician
            </p>
          </div>
        )}

        {/* Start Now button — always at the bottom, aligned across all cards */}
        <button
          onClick={() => onConsultClick?.()}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: med.isBrandName
              ? `linear-gradient(135deg, ${med.accent}, #7A1E7E)`
              : `linear-gradient(135deg, ${med.accent}, #0D8050)`,
            boxShadow: `0 4px 16px ${med.accent}40`,
            cursor: "pointer",
            border: "none",
          }}
        >
          Start Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
