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
  price?: string;
  priceNote?: string;
  logo?: string;
}

const medications: Med[] = [
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
    name: "Zepbound",
    form: "Tirzepatide Injection",
    image: ZEPBOUND_PEN,
    program: "LillyDirect",
    accent: "#E8339E",
    badge: "Brand Name",
    isBrandName: true,
    price: "$299–$449/mo",
    priceNote: "Dose-dependent · escalates if refill missed",
    logo: ZEPBOUND_LOGO,
    details: [
      "FDA-approved dual GIP/GLP-1 agonist",
      "Pre-filled single-use pen",
      "Dose escalation: 2.5mg → 15mg",
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

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
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
            Our most prescribed medications — compounded specifically for you
            based on your labs, your body, and your physician's clinical judgment.
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
            className="flex gap-5 overflow-x-auto pb-4 px-1 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {medications.map((med) => (
              <MedCard key={med.name} med={med} />
            ))}

            {/* End-of-carousel CTA card */}
            <div
              className="flex-shrink-0 snap-start rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8"
              style={{
                width: "280px",
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
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 0 ? "#E8339E" : "#ddd" }}
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
function MedCard({ med }: { med: Med }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 snap-start rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        width: "280px",
        background: "#fff",
        border: `1.5px solid ${hovered ? med.accent + "44" : "#EBEBEB"}`,
        boxShadow: hovered
          ? `0 12px 36px ${med.accent}12`
          : "0 2px 10px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "220px",
          background: med.isBrandName
            ? "linear-gradient(135deg, #E8339E08, #E8339E04)"
            : `linear-gradient(135deg, ${med.accent}08, ${med.accent}04)`,
        }}
      >
        {/* Brand logo (top-left) */}
        {med.logo && (
          <img
            src={med.logo}
            alt={`${med.name} logo`}
            className="absolute top-3 left-3 h-5 w-auto object-contain opacity-80"
          />
        )}

        <img
          src={med.image}
          alt={med.name}
          className="h-[180px] w-auto object-contain drop-shadow-md transition-transform duration-300"
          style={{
            transform: hovered ? "scale(1.06) translateY(-4px)" : "scale(1)",
          }}
        />

        {/* Badge */}
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: med.isBrandName ? "#1B3A4B" : "#E6F9F0",
            color: med.isBrandName ? "#fff" : "#0D8050",
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

      {/* Content */}
      <div className="p-5">
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

        {/* Details */}
        <ul className="space-y-1.5">
          {med.details.map((d) => (
            <li
              key={d}
              className="flex items-start gap-1.5 text-xs"
              style={{ color: "#555" }}
            >
              <Check
                size={12}
                className="mt-0.5 flex-shrink-0"
                style={{ color: med.accent }}
              />
              {d}
            </li>
          ))}
        </ul>

        {/* Price (brand-name cards only) */}
        {med.price && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
            <p className="text-sm font-extrabold" style={{ color: "#111" }}>
              {med.price}
            </p>
            {med.priceNote && (
              <p className="text-[10px] mt-0.5" style={{ color: "#999" }}>
                {med.priceNote}
              </p>
            )}
          </div>
        )}

        {/* Rx disclaimer */}
        {!med.isBrandName && (
          <p
            className="mt-3 pt-3 text-[10px] font-medium"
            style={{ color: "#bbb", borderTop: "1px solid #f0f0f0" }}
          >
            Rx Only — prescribed by your MedMethod physician
          </p>
        )}
      </div>
    </div>
  );
}
