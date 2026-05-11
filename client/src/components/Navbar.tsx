/* =============================================================================
   Navbar — Clinical Noir Design
   Sticky white header, gradient logo, smooth-scroll anchor links, CTA button.
   Services dropdown removed — single link scrolls to #services section.
   All anchor links use smooth-scroll with navbar offset compensation.
   ============================================================================= */
import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// scrollTo: smooth-scrolls to a section id, compensating for fixed navbar height
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbarHeight = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top, behavior: "smooth" });
}

const navLinks = [
  { label: "Services",    anchor: "services" },
  { label: "How It Works", anchor: "how-it-works" },
  { label: "About",       anchor: "about" },
  { label: "Blog",        href: "/blog" },
  { label: "Our Book",    anchor: "book" },
  { label: "FAQ",         anchor: "faq" },
];

export default function Navbar({ onConsultClick }: { onConsultClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: typeof navLinks[number], e: React.MouseEvent) => {
    if (link.anchor) {
      e.preventDefault();
      setMobileOpen(false);
      if (isHomePage) {
        // Already on homepage — smooth scroll directly
        scrollTo(link.anchor);
      } else {
        // On a sub-page — navigate to homepage with hash, then scroll after load
        window.location.href = `/#${link.anchor}`;
      }
    } else {
      setMobileOpen(false);
    }
  };

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
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
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
              <a
                key={link.label}
        href={link.href ?? (isHomePage ? `#${link.anchor}` : `/#${link.anchor}`)}
        onClick={(e) => handleNavClick(link, e)}
        className="px-4 py-2 text-gray-600 hover:text-[#E8339E] font-semibold text-sm tracking-wide transition-colors duration-200"
                style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.05em" }}
              >
                {link.label}
              </a>
            ))}

            {/* Licensed in 8 States */}
            <a
              href="/locations"
              className="flex items-center gap-1.5 px-4 py-2 text-gray-500 hover:text-[#E8339E] font-semibold text-sm tracking-wide transition-colors duration-200"
              style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.05em" }}
            >
              <MapPin className="w-3.5 h-3.5" />
              8 States
            </a>
          </nav>

          {/* CTA + FOR MEN */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => toast("Men's program coming soon! Stay tuned.", {
                description: "We're putting the finishing touches on it.",
                duration: 4000,
              })}
              className="text-xs font-bold tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={{
                color: "#00E5FF",
                border: "1px solid rgba(0,229,255,0.35)",
                fontFamily: "Montserrat, sans-serif",
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              FOR MEN →
            </button>
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
              href={link.href ?? (isHomePage ? `#${link.anchor}` : `/#${link.anchor}`)}
              onClick={(e) => handleNavClick(link, e)}
              className="py-3 text-gray-600 hover:text-[#E8339E] font-semibold text-sm tracking-wide border-b border-gray-100 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/locations"
              className="py-3 font-semibold text-sm tracking-wide border-b border-gray-100 transition-colors flex items-center gap-1.5"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              onClick={() => setMobileOpen(false)}
            >
              <MapPin className="w-3.5 h-3.5" />
              Licensed in 8 States
            </a>
            <button
              onClick={() => {
                setMobileOpen(false);
                toast("Men's program coming soon! Stay tuned.", {
                  description: "We're putting the finishing touches on it.",
                  duration: 4000,
                });
              }}
              className="py-3 font-semibold text-sm tracking-wide border-b border-gray-100 transition-colors text-left w-full"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#00E5FF", background: "transparent", cursor: "pointer" }}
            >
              For Men →
            </button>
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
