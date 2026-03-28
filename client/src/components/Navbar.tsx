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
      { label: "Florida", href: "/florida" },
      { label: "Maryland", href: "/maryland" },
      { label: "Washington DC", href: "/dc" },
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
                  <div className="absolute top-full left-0 mt-1 w-52 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
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
