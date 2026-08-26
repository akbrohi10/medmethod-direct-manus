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

const APPROVED_JURISDICTIONS = [
  "Florida",
  "Arizona",
  "Colorado",
  "District of Columbia",
  "Georgia",
  "Illinois",
  "Maryland",
  "Michigan",
  "North Carolina",
  "Pennsylvania",
  "Texas",
  "Virginia",
];

// Flat list for search
const ALL_CITIES = REGIONS.flatMap((r) =>
  r.states.flatMap((s) => [
    ...s.tier1.map((c) => ({ ...c, state: s.name, abbr: s.abbr, stateHref: s.href })),
    ...s.tier2.map((c) => ({ ...c, state: s.name, abbr: s.abbr, stateHref: s.href })),
  ])
);

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/locations",
  description:
    "MedMethod Direct provides virtual hormone therapy for women, medical weight management, and menopause care in 12 approved jurisdictions.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: APPROVED_JURISDICTIONS,
};

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

  function toggleRegion(name: string) {
    setOpenRegions((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <>
      <Helmet>
        <title>Service Locations | MedMethod Direct — Virtual Women's Health in 12 Jurisdictions</title>
        <meta
          name="description"
          content="MedMethod Direct provides virtual hormone therapy for women, medical weight management, and menopause care in Florida, Arizona, Colorado, the District of Columbia, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, and Virginia."
        />
        <link rel="canonical" href="https://www.medmethoddirect.com/locations" />
        <meta property="og:title" content="Service Locations | MedMethod Direct" />
        <meta property="og:description" content="Premium virtual women's health care across our approved licensed jurisdictions. Find your city and book your appointment today." />
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
                  Licensed in 12 jurisdictions
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
                  { value: "12", label: "Licensed Jurisdictions" },
                  { value: "99+", label: "Cities Listed" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.value}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/40" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — exact approved licensing list */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Approved Jurisdictions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {APPROVED_JURISDICTIONS.map((jurisdiction) => (
                  <div key={jurisdiction} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <MapPin className="w-3.5 h-3.5 text-[#E8339E]" />
                    <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {jurisdiction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regional Accordion ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Detailed City Guides
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>
              Explore Service Areas
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

      {/* ── Legal / LegitScript compliance disclaimer ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <p className="text-xs text-gray-400 leading-relaxed text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <strong className="text-gray-500">Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. All prescriptions are issued only after a valid patient-provider relationship has been established through a proper medical evaluation. Individual results may vary. Consult your healthcare provider before starting any new treatment. MedMethod Direct is licensed to practice in the states listed on this site only.{" "}
            <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>{" · "}
            <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" · "}
            <a href="/hipaa-notice" className="underline hover:text-gray-600">HIPAA Notice</a>
          </p>
        </div>
      </div>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
