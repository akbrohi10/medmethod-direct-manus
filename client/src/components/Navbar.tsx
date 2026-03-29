/* =============================================================================
   Navbar — Clinical Noir Design
   Sticky dark header, gradient logo, CTA button
   ============================================================================= */
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  {
    label: "Services",
    href: "#services",
    dropdown: [
      { label: "Hormone Replacement Therapy", href: "#services" },
      { label: "Medical Weight Loss", href: "#services" },
      { label: "Perimenopause & Menopause", href: "#services" },
      { label: "Thyroid Optimization", href: "#services" },
      { label: "Longevity Protocols", href: "#services" },
      { label: "All Services", href: "#services" },
    ],
  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
  {
    label: "Locations",
    href: "/virginia",
    dropdown: [
      { label: "Virginia", href: "/virginia" },
      { label: "— McLean, VA", href: "/virginia/mclean" },
      { label: "— Great Falls, VA", href: "/virginia/great-falls" },
      { label: "— Vienna, VA", href: "/virginia/vienna" },
      { label: "— Reston, VA", href: "/virginia/reston" },
      { label: "— Arlington, VA", href: "/virginia/arlington" },
      { label: "Maryland", href: "/maryland" },
      { label: "— Bethesda, MD", href: "/maryland/bethesda" },
      { label: "— Chevy Chase, MD", href: "/maryland/chevy-chase" },
      { label: "— Potomac, MD", href: "/maryland/potomac" },
      { label: "— Rockville, MD", href: "/maryland/rockville" },
      { label: "— Silver Spring, MD", href: "/maryland/silver-spring" },
      { label: "Washington DC", href: "/washington-dc" },
      { label: "— Georgetown, DC", href: "/washington-dc/georgetown" },
      { label: "— Capitol Hill, DC", href: "/washington-dc/capitol-hill" },
      { label: "— Dupont Circle, DC", href: "/washington-dc/dupont-circle" },
      { label: "— Chevy Chase DC", href: "/washington-dc/chevy-chase-dc" },
      { label: "— Friendship Heights, DC", href: "/washington-dc/friendship-heights" },
      { label: "Colorado", href: "/colorado" },
      { label: "Arizona", href: "/arizona" },
      { label: "North Carolina", href: "/north-carolina" },
      { label: "Pennsylvania", href: "/pennsylvania" },
    ],
  },
];

export default function Navbar({ onConsultClick }: { onConsultClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/98 shadow-lg border-b border-gray-100" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex flex-col leading-none group">
            <div className="flex items-baseline gap-0">
              <span
                className="font-black text-[#111111]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", letterSpacing: "-0.02em" }}
              >
                Med
              </span>
              <span
                className="font-black"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.5rem",
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Method
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }} />
              <span
                className="text-[#111111] font-semibold tracking-[0.25em]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}
              >
                DIRECT
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #7A1E7E, #E8339E)" }} />
            </div>
            <span
              className="text-center"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                color: "rgba(0,0,0,0.4)",
                fontStyle: "italic",
              }}
            >
              Your Path to Longevity
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-[#111111] font-semibold text-sm tracking-wide transition-colors duration-200"
                  style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.05em" }}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </a>
                {link.dropdown && openDropdown === link.label && (
                  link.label === "Locations" ? (
                    <div className="absolute top-full left-0 pt-2" style={{ width: "820px" }}>
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/8">
                          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#E8339E" }}>Service Areas</p>
                        </div>
                        {/* Row 1: Active states */}
                        <div className="grid grid-cols-4 gap-0 px-4 pt-4 pb-3 border-b border-white/8">
                          {/* Virginia */}
                          <div className="pr-4 border-r border-white/8">
                            <a href="/virginia" className="block mb-2 text-xs font-black tracking-widest uppercase text-white hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Virginia</a>
                            {[
                              { label: "McLean", href: "/virginia/mclean" },
                              { label: "Great Falls", href: "/virginia/great-falls" },
                              { label: "Vienna", href: "/virginia/vienna" },
                              { label: "Reston", href: "/virginia/reston" },
                              { label: "Arlington", href: "/virginia/arlington" },
                            ].map(item => (
                              <a key={item.label} href={item.href} className="block py-1 text-xs text-white/55 hover:text-white transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</a>
                            ))}
                          </div>
                          {/* Maryland */}
                          <div className="px-4 border-r border-white/8">
                            <a href="/maryland" className="block mb-2 text-xs font-black tracking-widest uppercase text-white hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Maryland</a>
                            {[
                              { label: "Bethesda", href: "/maryland/bethesda" },
                              { label: "Chevy Chase", href: "/maryland/chevy-chase" },
                              { label: "Potomac", href: "/maryland/potomac" },
                              { label: "Rockville", href: "/maryland/rockville" },
                              { label: "Silver Spring", href: "/maryland/silver-spring" },
                            ].map(item => (
                              <a key={item.label} href={item.href} className="block py-1 text-xs text-white/55 hover:text-white transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</a>
                            ))}
                          </div>
                          {/* DC */}
                          <div className="px-4 border-r border-white/8">
                            <a href="/washington-dc" className="block mb-2 text-xs font-black tracking-widest uppercase text-white hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Washington DC</a>
                            {[
                              { label: "Georgetown", href: "/washington-dc/georgetown" },
                              { label: "Capitol Hill", href: "/washington-dc/capitol-hill" },
                              { label: "Dupont Circle", href: "/washington-dc/dupont-circle" },
                              { label: "Chevy Chase DC", href: "/washington-dc/chevy-chase-dc" },
                              { label: "Friendship Heights", href: "/washington-dc/friendship-heights" },
                            ].map(item => (
                              <a key={item.label} href={item.href} className="block py-1 text-xs text-white/55 hover:text-white transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</a>
                            ))}
                          </div>
                          {/* Florida */}
                          <div className="pl-4">
                            <a href="/florida" className="block mb-2 text-xs font-black tracking-widest uppercase text-white hover:text-[#E8339E] transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Florida</a>
                            {[
                              { label: "Miami", href: "/florida/miami" },
                              { label: "Boca Raton", href: "/florida/boca-raton" },
                              { label: "Naples", href: "/florida/naples" },
                              { label: "Sarasota", href: "/florida/sarasota" },
                              { label: "Tampa", href: "/florida/tampa" },
                            ].map(item => (
                              <a key={item.label} href={item.href} className="block py-1 text-xs text-white/55 hover:text-white transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</a>
                            ))}
                          </div>
                        </div>
                        {/* Row 2: Coming Soon — full width bottom strip */}
                        <div className="px-4 py-3 flex items-center gap-6">
                          <p className="text-[10px] font-bold tracking-[0.18em] uppercase shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>Coming Soon</p>
                          {["North Carolina", "Pennsylvania", "Colorado", "Arizona"].map(s => (
                            <span key={s} className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Montserrat, sans-serif" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                  <div className="absolute top-full left-0 w-52 pt-2">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                      {link.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                  )
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button + Men link */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/male"
              className="text-xs font-bold tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={{ color: "#00C2CB", border: "1px solid rgba(0,194,203,0.35)", fontFamily: "Montserrat, sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,194,203,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              FOR MEN →
            </a>
            <button
              onClick={onConsultClick}
              className="btn-gradient btn-gradient-pulse px-6 py-2.5 rounded-full text-sm font-bold tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              FREE CONSULTATION
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#111111] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 text-gray-600 hover:text-[#111111] font-semibold text-sm tracking-wide border-b border-gray-100 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="/male" onClick={() => setMobileOpen(false)}
              className="py-3 font-semibold text-sm tracking-wide border-b border-gray-100 transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#00C2CB" }}>
              For Men →
            </a>
            <button
              onClick={() => { onConsultClick(); setMobileOpen(false); }}
              className="btn-gradient mt-3 py-3 rounded-full text-sm font-bold tracking-wider text-center"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              FREE CONSULTATION
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
