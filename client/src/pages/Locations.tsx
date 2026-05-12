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
          { name: "Alexandria", href: "/virginia/alexandria" },
          { name: "Falls Church", href: "/virginia/falls-church" },
          { name: "Tysons", href: "/virginia/tysons" },
          { name: "Herndon", href: "/virginia/herndon" },
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
  {
    name: "South Central",
    states: [
      {
        name: "Texas",
        abbr: "TX",
        href: "/texas",
        tagline: "Virtual Women's Health Across the Lone Star State",
        tier1: [
          { name: "Houston", href: "/texas/houston" },
          { name: "Austin", href: "/texas/austin" },
          { name: "Dallas", href: "/texas/dallas" },
          { name: "San Antonio", href: "/texas/san-antonio" },
          { name: "The Woodlands", href: "/texas/the-woodlands" },
        ],
        tier2: [
          { name: "Plano", href: "/texas/plano" },
          { name: "Frisco", href: "/texas/frisco" },
          { name: "McKinney", href: "/texas/mckinney" },
          { name: "Sugar Land", href: "/texas/sugar-land" },
          { name: "Round Rock", href: "/texas/round-rock" },
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
const ACTIVE_STATE_ABBRS = new Set(["VA", "MD", "DC", "FL", "NC", "PA", "CO", "AZ", "TX"]);

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/locations",
  description:
    "MedMethod Direct is a premium virtual women's health clinic licensed in Virginia, Maryland, Washington DC, Florida, North Carolina, Pennsylvania, Colorado, Arizona, and Texas. Specializing in hormone therapy, medical weight loss, and menopause care.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: ["Virginia", "Maryland", "Washington DC", "Florida", "North Carolina", "Pennsylvania", "Colorado", "Arizona", "Texas"],
};

// ─── Interactive US Map (branded image with clickable state hotspots) ─────────
// Percentage-based hotspot positions mapped to the branded map image
// Each hotspot is positioned as a % of the image dimensions for responsive scaling

const MAP_IMAGE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/us-map-9states-CSDQ9Ff3B2YZB89RAzhrmq.webp";

const STATE_HOTSPOTS: { abbr: string; label: string; top: string; left: string; width: string; height: string }[] = [
  { abbr: "AZ", label: "Arizona", top: "42%", left: "14%", width: "7%", height: "14%" },
  { abbr: "CO", label: "Colorado", top: "32%", left: "23%", width: "7%", height: "10%" },
  { abbr: "FL", label: "Florida", top: "68%", left: "68%", width: "9%", height: "18%" },
  { abbr: "MD", label: "Maryland", top: "35%", left: "72%", width: "6%", height: "7%" },
  { abbr: "DC", label: "Washington DC", top: "40%", left: "74%", width: "3%", height: "4%" },
  { abbr: "NC", label: "North Carolina", top: "48%", left: "66%", width: "10%", height: "8%" },
  { abbr: "PA", label: "Pennsylvania", top: "26%", left: "68%", width: "9%", height: "9%" },
  { abbr: "VA", label: "Virginia", top: "38%", left: "64%", width: "10%", height: "10%" },
  { abbr: "TX", label: "Texas", top: "55%", left: "28%", width: "10%", height: "18%" },
];

function USMap({ onStateClick }: { onStateClick: (abbr: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full" aria-label="Interactive US map showing MedMethod Direct service states">
      {/* Branded map image */}
      <img
        src={MAP_IMAGE_URL}
        alt="US map showing MedMethod Direct active states: Virginia, Maryland, DC, Pennsylvania, Florida, North Carolina, Colorado, Arizona, and Texas highlighted in pink/magenta"
        className="w-full h-auto rounded-2xl"
        loading="eager"
        style={{ maxHeight: 420 }}
      />

      {/* Clickable state hotspots */}
      {STATE_HOTSPOTS.map((spot) => (
        <button
          key={spot.abbr}
          onClick={() => onStateClick(spot.abbr)}
          onMouseEnter={() => setHovered(spot.abbr)}
          onMouseLeave={() => setHovered(null)}
          className="absolute rounded-lg transition-all duration-200"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            background: hovered === spot.abbr ? "rgba(232,51,158,0.3)" : "transparent",
            border: hovered === spot.abbr ? "2px solid rgba(232,51,158,0.6)" : "2px solid transparent",
            cursor: "pointer",
          }}
          aria-label={`View ${spot.label} cities`}
          title={spot.label}
        />
      ))}

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
          style={{
            fontFamily: "Montserrat, sans-serif",
            background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {STATE_HOTSPOTS.find((s) => s.abbr === hovered)?.label}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 right-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(232,51,158,0.5)", border: "1px solid rgba(232,51,158,0.8)" }} />
          <span className="text-[9px] font-semibold text-white/50" style={{ fontFamily: "Montserrat, sans-serif" }}>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <span className="text-[9px] font-semibold text-white/30" style={{ fontFamily: "Montserrat, sans-serif" }}>Coming Soon</span>
        </div>
      </div>
    </div>
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
    "South Central": true,
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
        <title>Service Locations | MedMethod Direct — Virtual Women's Health in 9 States</title>
        <meta
          name="description"
          content="MedMethod Direct provides premium virtual women's health care — hormone therapy, medical weight loss, and menopause management — across Virginia, Maryland, DC, Florida, North Carolina, Pennsylvania, Colorado, Arizona, and Texas."
        />
        <link rel="canonical" href="https://www.medmethoddirect.com/locations" />
        <meta property="og:title" content="Service Locations | MedMethod Direct" />
        <meta property="og:description" content="Premium virtual women's health care licensed in 9 states. Find your city and book a free consultation today." />
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
                  Licensed in 9 States · Expanding Nationwide
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight"
                style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
              >
                Virtual Care,{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
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
                  { value: "9", label: "Active States" },
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
