/* =============================================================================
   Locations Overview Page — /locations
   Clinical Noir Design: dark hero, state cards, city grids, coming-soon strip
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { MapPin, ChevronRight, Clock } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const activeStates = [
  {
    name: "Virginia",
    href: "/virginia",
    tagline: "Northern Virginia's Premier Virtual Women's Health Clinic",
    cities: [
      { name: "McLean", href: "/virginia/mclean" },
      { name: "Great Falls", href: "/virginia/great-falls" },
      { name: "Vienna", href: "/virginia/vienna" },
      { name: "Reston", href: "/virginia/reston" },
      { name: "Arlington", href: "/virginia/arlington" },
    ],
  },
  {
    name: "Maryland",
    href: "/maryland",
    tagline: "Serving the DC Metro's Maryland Communities Virtually",
    cities: [
      { name: "Bethesda", href: "/maryland/bethesda" },
      { name: "Chevy Chase", href: "/maryland/chevy-chase" },
      { name: "Potomac", href: "/maryland/potomac" },
      { name: "Rockville", href: "/maryland/rockville" },
      { name: "Silver Spring", href: "/maryland/silver-spring" },
    ],
  },
  {
    name: "Washington DC",
    href: "/washington-dc",
    tagline: "Virtual Women's Health Care Across the District",
    cities: [
      { name: "Georgetown", href: "/washington-dc/georgetown" },
      { name: "Capitol Hill", href: "/washington-dc/capitol-hill" },
      { name: "Dupont Circle", href: "/washington-dc/dupont-circle" },
      { name: "Chevy Chase DC", href: "/washington-dc/chevy-chase-dc" },
      { name: "Friendship Heights", href: "/washington-dc/friendship-heights" },
    ],
  },
  {
    name: "Florida",
    href: "/florida",
    tagline: "Telehealth Women's Health for Florida's Discerning Patients",
    cities: [
      { name: "Miami", href: "/florida/miami" },
      { name: "Boca Raton", href: "/florida/boca-raton" },
      { name: "Naples", href: "/florida/naples" },
      { name: "Sarasota", href: "/florida/sarasota" },
      { name: "Tampa", href: "/florida/tampa" },
    ],
  },
];

const comingSoonStates = [
  { name: "North Carolina", abbr: "NC" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Arizona", abbr: "AZ" },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/locations",
  description:
    "MedMethod Direct is a premium virtual women's health clinic licensed in Virginia, Maryland, Washington DC, Florida, and 4 additional states. Specializing in hormone therapy, medical weight loss, and menopause care.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: ["Virginia", "Maryland", "Washington DC", "Florida", "North Carolina", "Pennsylvania", "Colorado", "Arizona"],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Locations() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Service Locations | MedMethod Direct — Virtual Women's Health in 8 States</title>
        <meta
          name="description"
          content="MedMethod Direct provides premium virtual women's health care — hormone therapy, medical weight loss, and menopause management — across Virginia, Maryland, DC, Florida, and more."
        />
        <link rel="canonical" href="https://www.medmethoddirect.com/locations" />
        <meta property="og:title" content="Service Locations | MedMethod Direct" />
        <meta
          property="og:description"
          content="Premium virtual women's health care licensed in 8 states. Find your location and book a free consultation today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/locations" />
        <script type="application/ld+json">{JSON.stringify(JSONLD)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 60%, #0d0d0d 100%)" }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,51,158,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(232,51,158,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#E8339E]/30 bg-[#E8339E]/5">
            <MapPin className="w-3.5 h-3.5 text-[#E8339E]" />
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8339E]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Licensed in 8 States
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
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
          <p
            className="text-white/60 text-lg max-w-2xl mx-auto mb-10"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            MedMethod Direct delivers doctor-led hormone therapy, medical weight loss, and menopause care entirely online — no commute, no waiting room, no compromise on quality.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-8 py-3.5 rounded-full text-sm font-bold tracking-wider"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE FREE CONSULTATION →
          </button>
        </div>
      </section>

      {/* ── Active States Grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
            >
              Currently Accepting Patients
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-[#111111]"
              style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
            >
              Active Service Areas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeStates.map((state) => (
              <div
                key={state.name}
                className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#E8339E]/20"
              >
                {/* State Header */}
                <div
                  className="px-7 py-6 flex items-start justify-between"
                  style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 100%)" }}
                >
                  <div>
                    <h3
                      className="text-xl font-black text-white mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {state.name}
                    </h3>
                    <p
                      className="text-white/50 text-xs leading-relaxed max-w-xs"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {state.tagline}
                    </p>
                  </div>
                  <a
                    href={state.href}
                    className="shrink-0 ml-4 mt-1 flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors"
                    style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
                  >
                    View State <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Cities */}
                <div className="px-7 py-5 bg-white">
                  <p
                    className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Service Cities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {state.cities.map((city) => (
                      <a
                        key={city.name}
                        href={city.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:border-[#E8339E]/40 hover:text-[#E8339E] hover:bg-[#E8339E]/5 transition-all"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        {city.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming Soon Strip ── */}
      <section
        className="py-16 border-t border-white/5"
        style={{ background: "#111111" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white/30" />
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Expanding Soon
                </p>
              </div>
              <p
                className="text-white/60 text-sm max-w-xs"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                We're actively licensing in additional states. Join the waitlist to be notified when we launch in your area.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {comingSoonStates.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/3"
                >
                  <span
                    className="text-xs font-black tracking-widest text-white/20"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {s.abbr}
                  </span>
                  <span
                    className="text-xs text-white/35"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="md:ml-auto shrink-0">
              <button
                onClick={() => setConsultOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-bold tracking-wider border border-[#E8339E]/40 text-[#E8339E] hover:bg-[#E8339E]/10 transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                JOIN WAITLIST →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Virtual ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 text-[#E8339E]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              100% Virtual
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-[#111111] mb-4"
              style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
            >
              Your Location Doesn't Limit Your Care
            </h2>
            <p
              className="text-gray-500 text-base leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Whether you're in McLean, Virginia or Miami, Florida, your care experience is identical — the same board-certified physicians, the same personalized protocols, the same concierge-level attention. Telehealth removes geography as a barrier to exceptional medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "No Commute Required",
                body: "Consult from your home, office, or anywhere with a private internet connection. Your appointment fits your schedule.",
              },
              {
                title: "Same-State Licensing",
                body: "Our physicians are fully licensed in your state. Every prescription, lab order, and protocol is 100% compliant with your state's medical regulations.",
              },
              {
                title: "Pharmacy Delivery",
                body: "Medications are dispensed through licensed compounding pharmacies and shipped directly to your door — no pharmacy trips needed.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl border border-gray-100 hover:border-[#E8339E]/20 hover:shadow-lg transition-all"
              >
                <div
                  className="w-8 h-1 rounded-full mb-5"
                  style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
                />
                <h3
                  className="text-base font-black text-[#111111] mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a1a 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-black text-white mb-5"
            style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
          >
            Ready to Get Started?
          </h2>
          <p
            className="text-white/55 text-base mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Book your free consultation today. A board-certified physician will review your history and design a protocol built around your goals.
          </p>
          <button
            onClick={() => setConsultOpen(true)}
            className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            SCHEDULE FREE CONSULTATION →
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
