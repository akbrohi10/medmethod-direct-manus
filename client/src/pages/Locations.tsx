/* =============================================================================
   Locations Overview Page — /locations
   Scalable to 50 states: Interactive SVG US map (active states only),
   city search bar, regional accordion with Tier 1 + Tier 2 cities,
   and a "Not in your state yet?" waitlist CTA.
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { MapPin, Search, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";

// ─── Full location data (Tier 1 + Tier 2) ────────────────────────────────────

const REGIONS = [
  {
    name: "Mid-Atlantic",
    states: [
      {
        name: "Virginia",
        abbr: "VA",
        href: "/virginia",
        tagline: "Northern Virginia's Premier Virtual Women's Health Clinic",
        tier1: [
          { name: "McLean", href: "/virginia/mclean" },
          { name: "Great Falls", href: "/virginia/great-falls" },
          { name: "Vienna", href: "/virginia/vienna" },
          { name: "Reston", href: "/virginia/reston" },
          { name: "Arlington", href: "/virginia/arlington" },
        ],
        tier2: [
          { name: "Culpeper", href: "/virginia/culpeper" },
          { name: "Warrenton", href: "/virginia/warrenton" },
          { name: "Middleburg", href: "/virginia/middleburg" },
          { name: "Leesburg", href: "/virginia/leesburg" },
          { name: "Fredericksburg", href: "/virginia/fredericksburg" },
        ],
      },
      {
        name: "Maryland",
        abbr: "MD",
        href: "/maryland",
        tagline: "Serving the DC Metro's Maryland Communities Virtually",
        tier1: [
          { name: "Bethesda", href: "/maryland/bethesda" },
          { name: "Chevy Chase", href: "/maryland/chevy-chase" },
          { name: "Potomac", href: "/maryland/potomac" },
          { name: "Rockville", href: "/maryland/rockville" },
          { name: "Silver Spring", href: "/maryland/silver-spring" },
        ],
        tier2: [
          { name: "Easton", href: "/maryland/easton" },
          { name: "Frederick", href: "/maryland/frederick" },
          { name: "Annapolis", href: "/maryland/annapolis" },
          { name: "Bel Air", href: "/maryland/bel-air" },
          { name: "Ellicott City", href: "/maryland/ellicott-city" },
        ],
      },
      {
        name: "Washington DC",
        abbr: "DC",
        href: "/washington-dc",
        tagline: "Virtual Women's Health Care Across the District",
        tier1: [
          { name: "Georgetown", href: "/washington-dc/georgetown" },
          { name: "Capitol Hill", href: "/washington-dc/capitol-hill" },
          { name: "Dupont Circle", href: "/washington-dc/dupont-circle" },
          { name: "Chevy Chase DC", href: "/washington-dc/chevy-chase-dc" },
          { name: "Friendship Heights", href: "/washington-dc/friendship-heights" },
        ],
        tier2: [
          { name: "Alexandria", href: "/dc/alexandria" },
          { name: "Falls Church", href: "/dc/falls-church" },
          { name: "Tysons", href: "/dc/tysons" },
          { name: "Herndon", href: "/dc/herndon" },
        ],
      },
      {
        name: "Pennsylvania",
        abbr: "PA",
        href: "/pennsylvania",
        tagline: "Main Line, Pittsburgh & Bucks County Virtual Women's Health",
        tier1: [
          { name: "Philadelphia", href: "/pennsylvania/philadelphia" },
          { name: "Pittsburgh", href: "/pennsylvania/pittsburgh" },
          { name: "Wayne", href: "/pennsylvania/wayne" },
          { name: "Doylestown", href: "/pennsylvania/doylestown" },
          { name: "Newtown Square", href: "/pennsylvania/newtown-square" },
          { name: "Malvern", href: "/pennsylvania/malvern" },
        ],
        tier2: [
          { name: "Kennett Square", href: "/pennsylvania/kennett-square" },
          { name: "West Chester", href: "/pennsylvania/west-chester" },
          { name: "Newtown", href: "/pennsylvania/newtown" },
          { name: "Horsham", href: "/pennsylvania/horsham" },
          { name: "Lansdale", href: "/pennsylvania/lansdale" },
        ],
      },
    ],
  },
  {
    name: "Southeast",
    states: [
      {
        name: "Florida",
        abbr: "FL",
        href: "/florida",
        tagline: "Telehealth Women's Health for Florida's Discerning Patients",
        tier1: [
          { name: "Miami", href: "/florida/miami" },
          { name: "Boca Raton", href: "/florida/boca-raton" },
          { name: "Naples", href: "/florida/naples" },
          { name: "Sarasota", href: "/florida/sarasota" },
          { name: "Tampa", href: "/florida/tampa" },
        ],
        tier2: [
          { name: "Marco Island", href: "/florida/marco-island" },
          { name: "Vero Beach", href: "/florida/vero-beach" },
          { name: "Jupiter", href: "/florida/jupiter" },
          { name: "Palm Beach Gardens", href: "/florida/palm-beach-gardens" },
          { name: "Ponte Vedra", href: "/florida/ponte-vedra" },
        ],
      },
      {
        name: "North Carolina",
        abbr: "NC",
        href: "/north-carolina",
        tagline: "Virtual Women's Health Across the Tar Heel State",
        tier1: [
          { name: "Charlotte", href: "/north-carolina/charlotte" },
          { name: "Raleigh", href: "/north-carolina/raleigh" },
          { name: "Cary", href: "/north-carolina/cary" },
          { name: "Chapel Hill", href: "/north-carolina/chapel-hill" },
          { name: "Wilmington", href: "/north-carolina/wilmington" },
          { name: "Asheville", href: "/north-carolina/asheville" },
        ],
        tier2: [
          { name: "Pinehurst", href: "/north-carolina/pinehurst" },
          { name: "Southern Pines", href: "/north-carolina/southern-pines" },
          { name: "Mooresville", href: "/north-carolina/mooresville" },
          { name: "Waxhaw", href: "/north-carolina/waxhaw" },
          { name: "Apex", href: "/north-carolina/apex" },
        ],
      },
    ],
  },
  {
    name: "Mountain West",
    states: [
      {
        name: "Colorado",
        abbr: "CO",
        href: "/colorado",
        tagline: "Virtual Women's Health Across the Front Range & Beyond",
        tier1: [
          { name: "Denver", href: "/colorado/denver" },
          { name: "Boulder", href: "/colorado/boulder" },
          { name: "Colorado Springs", href: "/colorado/colorado-springs" },
          { name: "Highlands Ranch", href: "/colorado/highlands-ranch" },
          { name: "Fort Collins", href: "/colorado/fort-collins" },
          { name: "Greenwood Village", href: "/colorado/greenwood-village" },
        ],
        tier2: [
          { name: "Castle Rock", href: "/colorado/castle-rock" },
          { name: "Parker", href: "/colorado/parker" },
          { name: "Longmont", href: "/colorado/longmont" },
          { name: "Loveland", href: "/colorado/loveland" },
          { name: "Steamboat Springs", href: "/colorado/steamboat-springs" },
        ],
      },
      {
        name: "Arizona",
        abbr: "AZ",
        href: "/arizona",
        tagline: "Virtual Women's Health Across the Desert Southwest",
        tier1: [
          { name: "Scottsdale", href: "/arizona/scottsdale" },
          { name: "Paradise Valley", href: "/arizona/paradise-valley" },
          { name: "Chandler", href: "/arizona/chandler" },
          { name: "Gilbert", href: "/arizona/gilbert" },
          { name: "Tempe", href: "/arizona/tempe" },
          { name: "Tucson", href: "/arizona/tucson" },
        ],
        tier2: [
          { name: "Peoria", href: "/arizona/peoria" },
          { name: "Queen Creek", href: "/arizona/queen-creek" },
          { name: "Surprise", href: "/arizona/surprise" },
          { name: "Fountain Hills", href: "/arizona/fountain-hills" },
          { name: "Prescott", href: "/arizona/prescott" },
        ],
      },
    ],
  },
];

// Flat list for search
const ALL_CITIES = REGIONS.flatMap((r) =>
  r.states.flatMap((s) => [
    ...s.tier1.map((c) => ({ ...c, state: s.name, abbr: s.abbr, stateHref: s.href })),
    ...s.tier2.map((c) => ({ ...c, state: s.name, abbr: s.abbr, stateHref: s.href })),
  ])
);

// Active state abbreviations for SVG map highlight
const ACTIVE_STATE_ABBRS = new Set(["VA", "MD", "DC", "FL", "NC", "PA", "CO", "AZ"]);

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/locations",
  description:
    "MedMethod Direct is a premium virtual women's health clinic licensed in Virginia, Maryland, Washington DC, Florida, North Carolina, Pennsylvania, Colorado, and Arizona. Specializing in hormone therapy, medical weight loss, and menopause care.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: ["Virginia", "Maryland", "Washington DC", "Florida", "North Carolina", "Pennsylvania", "Colorado", "Arizona"],
};

// ─── SVG US Map (simplified state paths) ─────────────────────────────────────
// Simplified rectangular approximations for each state positioned on a 960×600 viewBox

const STATE_POSITIONS: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  WA: { x: 55, y: 40, w: 80, h: 65, label: "WA" },
  OR: { x: 55, y: 110, w: 80, h: 65, label: "OR" },
  CA: { x: 45, y: 180, w: 75, h: 130, label: "CA" },
  NV: { x: 100, y: 175, w: 65, h: 90, label: "NV" },
  ID: { x: 130, y: 80, w: 65, h: 90, label: "ID" },
  MT: { x: 175, y: 45, w: 100, h: 70, label: "MT" },
  WY: { x: 195, y: 120, w: 90, h: 65, label: "WY" },
  UT: { x: 155, y: 185, w: 65, h: 75, label: "UT" },
  AZ: { x: 145, y: 265, w: 75, h: 80, label: "AZ" },
  CO: { x: 220, y: 195, w: 90, h: 65, label: "CO" },
  NM: { x: 205, y: 265, w: 80, h: 80, label: "NM" },
  ND: { x: 290, y: 50, w: 90, h: 60, label: "ND" },
  SD: { x: 290, y: 115, w: 90, h: 60, label: "SD" },
  NE: { x: 285, y: 180, w: 100, h: 55, label: "NE" },
  KS: { x: 285, y: 240, w: 100, h: 55, label: "KS" },
  OK: { x: 280, y: 300, w: 110, h: 55, label: "OK" },
  TX: { x: 255, y: 355, w: 130, h: 110, label: "TX" },
  MN: { x: 380, y: 55, w: 90, h: 80, label: "MN" },
  IA: { x: 385, y: 175, w: 85, h: 55, label: "IA" },
  MO: { x: 390, y: 235, w: 85, h: 65, label: "MO" },
  AR: { x: 395, y: 305, w: 80, h: 55, label: "AR" },
  LA: { x: 395, y: 365, w: 80, h: 55, label: "LA" },
  WI: { x: 455, y: 90, w: 75, h: 75, label: "WI" },
  IL: { x: 460, y: 185, w: 60, h: 90, label: "IL" },
  MS: { x: 455, y: 320, w: 60, h: 65, label: "MS" },
  MI: { x: 510, y: 90, w: 80, h: 80, label: "MI" },
  IN: { x: 510, y: 185, w: 60, h: 80, label: "IN" },
  KY: { x: 520, y: 270, w: 90, h: 50, label: "KY" },
  TN: { x: 510, y: 325, w: 100, h: 45, label: "TN" },
  AL: { x: 520, y: 375, w: 60, h: 65, label: "AL" },
  GA: { x: 565, y: 340, w: 70, h: 80, label: "GA" },
  FL: { x: 570, y: 420, w: 80, h: 100, label: "FL" },
  OH: { x: 565, y: 185, w: 75, h: 75, label: "OH" },
  WV: { x: 590, y: 265, w: 55, h: 55, label: "WV" },
  VA: { x: 610, y: 235, w: 90, h: 50, label: "VA" },
  NC: { x: 615, y: 290, w: 95, h: 45, label: "NC" },
  SC: { x: 630, y: 340, w: 65, h: 50, label: "SC" },
  PA: { x: 640, y: 175, w: 85, h: 55, label: "PA" },
  NY: { x: 680, y: 110, w: 90, h: 65, label: "NY" },
  NJ: { x: 720, y: 180, w: 40, h: 55, label: "NJ" },
  DE: { x: 730, y: 215, w: 30, h: 35, label: "DE" },
  MD: { x: 695, y: 210, w: 65, h: 35, label: "MD" },
  DC: { x: 718, y: 228, w: 18, h: 18, label: "DC" },
  CT: { x: 755, y: 155, w: 35, h: 30, label: "CT" },
  RI: { x: 790, y: 155, w: 25, h: 30, label: "RI" },
  MA: { x: 755, y: 120, w: 75, h: 35, label: "MA" },
  VT: { x: 745, y: 85, w: 35, h: 40, label: "VT" },
  NH: { x: 780, y: 80, w: 35, h: 45, label: "NH" },
  ME: { x: 800, y: 45, w: 55, h: 70, label: "ME" },
  AK: { x: 60, y: 460, w: 100, h: 80, label: "AK" },
  HI: { x: 200, y: 490, w: 80, h: 40, label: "HI" },
};

function USMap({ onStateClick }: { onStateClick: (abbr: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 960 580"
      className="w-full h-auto"
      style={{ maxHeight: 420 }}
      aria-label="Interactive US map showing MedMethod Direct service states"
    >
      {/* Background */}
      <rect width="960" height="580" fill="#0d0d0d" rx="16" />

      {/* State rectangles */}
      {Object.entries(STATE_POSITIONS).map(([abbr, pos]) => {
        const isActive = ACTIVE_STATE_ABBRS.has(abbr);
        const isHovered = hovered === abbr;
        const isDC = abbr === "DC";

        return (
          <g
            key={abbr}
            onClick={() => isActive && onStateClick(abbr)}
            onMouseEnter={() => setHovered(abbr)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: isActive ? "pointer" : "default" }}
          >
            <rect
              x={pos.x}
              y={pos.y}
              width={pos.w}
              height={pos.h}
              rx={isDC ? 4 : 6}
              fill={
                isActive
                  ? isHovered
                    ? "#E8339E"
                    : "rgba(232,51,158,0.35)"
                  : "rgba(255,255,255,0.06)"
              }
              stroke={
                isActive
                  ? isHovered
                    ? "#E8339E"
                    : "rgba(232,51,158,0.6)"
                  : "rgba(255,255,255,0.08)"
              }
              strokeWidth={isActive ? 1.5 : 0.8}
              style={{ transition: "fill 0.2s, stroke 0.2s" }}
            />
            {/* State label — only show if large enough */}
            {pos.w >= 35 && pos.h >= 30 && (
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + pos.h / 2 + 4}
                textAnchor="middle"
                fontSize={isDC ? 7 : pos.w < 50 ? 8 : 10}
                fontWeight="700"
                fontFamily="Montserrat, sans-serif"
                fill={
                  isActive
                    ? isHovered
                      ? "#fff"
                      : "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.2)"
                }
                style={{ pointerEvents: "none", transition: "fill 0.2s" }}
              >
                {pos.label}
              </text>
            )}
            {/* Active indicator dot */}
            {isActive && (
              <circle
                cx={pos.x + pos.w / 2}
                cy={pos.y + pos.h - 10}
                r={3}
                fill={isHovered ? "#fff" : "#E8339E"}
                style={{ transition: "fill 0.2s" }}
              />
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(820, 520)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill="rgba(232,51,158,0.35)" stroke="rgba(232,51,158,0.6)" strokeWidth={1.5} />
        <text x={16} y={10} fontSize={9} fill="rgba(255,255,255,0.5)" fontFamily="Montserrat, sans-serif">Active</text>
        <rect x={0} y={18} width={12} height={12} rx={2} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
        <text x={16} y={28} fontSize={9} fill="rgba(255,255,255,0.3)" fontFamily="Montserrat, sans-serif">Coming Soon</text>
      </g>
    </svg>
  );
}

// ─── State Card ───────────────────────────────────────────────────────────────

function StateCard({ state }: { state: (typeof REGIONS)[0]["states"][0] }) {
  const [expanded, setExpanded] = useState(false);
  const totalCities = state.tier1.length + state.tier2.length;

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[#E8339E]/20">
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-black text-white"
            style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
          >
            {state.abbr}
          </span>
          <div>
            <a
              href={state.href}
              className="text-sm font-bold text-white hover:text-[#E8339E] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {state.name}
            </a>
            <p className="text-white/40 text-[10px] mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {totalCities} cities served
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={state.href}
            className="hidden sm:flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-[#E8339E] hover:text-[#c4207e] transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            View State <ChevronRight className="w-3 h-3" />
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-white/40 hover:text-white/70 transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
            aria-expanded={expanded}
          >
            {expanded ? "Less" : "Cities"}
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform duration-200"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </div>

      {/* Cities — always show Tier 1, expand to show Tier 2 */}
      <div className="px-6 py-4 bg-white">
        {/* Tier 1 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {state.tier1.map((city) => (
            <a
              key={city.name}
              href={city.href}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-gray-200 text-gray-700 hover:border-[#E8339E]/50 hover:text-[#E8339E] hover:bg-[#E8339E]/5 transition-all"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              {city.name}
            </a>
          ))}
        </div>

        {/* Tier 2 — shown on expand */}
        {expanded && (
          <div>
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-300 mb-1.5 mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              More Cities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {state.tier2.map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-dashed border-gray-200 text-gray-400 hover:border-[#E8339E]/40 hover:text-[#E8339E] hover:bg-[#E8339E]/5 transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Expand toggle hint */}
        {!expanded && state.tier2.length > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-1.5 text-[10px] font-semibold text-gray-400 hover:text-[#E8339E] transition-colors flex items-center gap-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            +{state.tier2.length} more cities <ChevronDown className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Locations() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({
    "Mid-Atlantic": true,
    "Southeast": true,
    "Mountain West": true,
  });

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.abbr.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [searchQuery]);

  // Scroll to state section when map state is clicked
  function handleMapStateClick(abbr: string) {
    const el = document.getElementById(`state-${abbr}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleRegion(name: string) {
    setOpenRegions((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <>
      <Helmet>
        <title>Service Locations | MedMethod Direct — Virtual Women's Health in 8 States</title>
        <meta
          name="description"
          content="MedMethod Direct provides premium virtual women's health care — hormone therapy, medical weight loss, and menopause management — across Virginia, Maryland, DC, Florida, North Carolina, Pennsylvania, Colorado, and Arizona."
        />
        <link rel="canonical" href="https://www.medmethoddirect.com/locations" />
        <meta property="og:title" content="Service Locations | MedMethod Direct" />
        <meta property="og:description" content="Premium virtual women's health care licensed in 8 states. Find your city and book a free consultation today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/locations" />
        <script type="application/ld+json">{JSON.stringify(JSONLD)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 60%, #0d0d0d 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,51,158,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(232,51,158,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#E8339E]/30 bg-[#E8339E]/5">
                <MapPin className="w-3.5 h-3.5 text-[#E8339E]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Licensed in 8 States · Expanding Nationwide
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight"
                style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
              >
                Virtual Care,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Wherever You Are
                </span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Doctor-led hormone therapy, medical weight loss, and menopause care — entirely online. No commute, no waiting room, no compromise on quality.
              </p>

              {/* Search bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search your city or state…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-[#E8339E]/50 focus:bg-white/8 transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a0a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                    {searchResults.map((city) => (
                      <a
                        key={city.href}
                        href={city.href}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#E8339E]/10 transition-colors border-b border-white/5 last:border-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#E8339E]" />
                          <span className="text-sm font-semibold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.name}</span>
                          <span className="text-xs text-white/40" style={{ fontFamily: "Montserrat, sans-serif" }}>{city.abbr}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                      </a>
                    ))}
                  </div>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a0a1a] border border-white/10 rounded-2xl px-4 py-4 shadow-2xl z-50">
                    <p className="text-sm text-white/50 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      No cities found. <button onClick={() => { setSearchQuery(""); setConsultOpen(true); }} className="text-[#E8339E] underline">Book anyway →</button>
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-8">
                {[
                  { value: "8", label: "Active States" },
                  { value: "99+", label: "Cities Served" },
                  { value: "50", label: "States Goal" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.value}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/40" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Interactive US Map */}
            <div className="relative">
              <USMap onStateClick={handleMapStateClick} />
              <p className="text-center text-[10px] text-white/30 mt-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Click an active state to jump to its cities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regional Accordion ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Currently Accepting Patients
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>
              Active Service Areas
            </h2>
          </div>

          <div className="space-y-6">
            {REGIONS.map((region) => (
              <div key={region.name} className="border border-gray-100 rounded-2xl overflow-hidden">
                {/* Region header */}
                <button
                  onClick={() => toggleRegion(region.name)}
                  className="w-full flex items-center justify-between px-7 py-5 bg-[#FAFAFA] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.01em" }}>
                      {region.name}
                    </span>
                    <span
                      className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                    >
                      {region.states.length} {region.states.length === 1 ? "state" : "states"}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 text-gray-400 transition-transform duration-200"
                    style={{ transform: openRegions[region.name] ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* State cards */}
                {openRegions[region.name] && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {region.states.map((state) => (
                      <div key={state.abbr} id={`state-${state.abbr}`}>
                        <StateCard state={state} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Not in your state CTA ── */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 100%)" }}
      >
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-[#E8339E]/20 bg-[#E8339E]/5">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Expanding to All 50 States
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>
            Don't See Your State Yet?
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            We're actively licensing in new states every quarter. Join the waitlist and we'll notify you the moment we launch in your area — you'll be first in line.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-8 py-3.5 rounded-full text-sm font-bold tracking-wider"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            JOIN THE WAITLIST →
          </button>
          <p className="text-white/25 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            No spam. One email when we launch in your state.
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
