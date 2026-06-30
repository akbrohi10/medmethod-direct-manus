/* =============================================================================
   Navbar — Clinical Noir Design
   Sticky white header, gradient logo, smooth-scroll anchor links, CTA button.
   Services dropdown removed — single link scrolls to #services section.
   All anchor links use smooth-scroll with navbar offset compensation.
   ============================================================================= */
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// scrollTo: smooth-scrolls to a section id, compensating for fixed navbar height
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbarHeight = 110; // 72px nav + ~38px top banner
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top, behavior: "smooth" });
}

const navLinks: { label: string; anchor?: string; href?: string }[] = [
  { label: "How It Works", anchor: "how-it-works" },
  { label: "Programs",     anchor: "programs" },
  { label: "Services",     anchor: "services" },
  { label: "Doctors",      anchor: "medical-team" },
  { label: "FAQ",           anchor: "faq" },
  { label: "The Book",     href: "/the-menopause-weight-loss-trap" },
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
      {/* ── 100% VIRTUAL TOP BANNER ─────────────────────────────── */}
      <div
        className="w-full text-center py-2 px-4"
        style={{
          background: "linear-gradient(90deg, #7A1E7E 0%, #E8339E 100%)",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <p className="text-white text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          100% Virtual Care — See Your Doctor From Home, Anywhere in 17 States
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/manus-storage/medmethod-logo-navbar_99a2ea82.png"
              alt="MedMethod Direct — Feel Like Yourself Again"
              className="h-12 lg:h-14 w-auto object-contain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
        href={link.href ?? (isHomePage ? `#${link.anchor}` : `/#${link.anchor}`)}
        onClick={(e) => handleNavClick(link, e)}
        className="px-3 py-2 text-gray-600 hover:text-[#E8339E] font-medium text-[13px] tracking-wide transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.05em" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+18883627011"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-[#7A1E7E] hover:text-[#E8339E] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              (888) 362-7011
            </a>
            <button
              onClick={onConsultClick}
              className="btn-gradient btn-gradient-pulse px-6 py-2.5 rounded-full text-sm font-bold tracking-wider"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              SCHEDULE A DISCOVERY CALL
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

            <button
              onClick={() => { onConsultClick(); setMobileOpen(false); }}
              className="btn-gradient mt-3 py-3 rounded-full text-sm font-bold tracking-wider text-center"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              SCHEDULE A DISCOVERY CALL
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
