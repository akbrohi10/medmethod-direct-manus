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
  const navbarHeight = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top, behavior: "smooth" });
}

const navLinks: { label: string; anchor?: string; href?: string }[] = [
  { label: "How It Works", anchor: "how-it-works" },
  { label: "Programs",     anchor: "programs" },
  { label: "Medications",  anchor: "medications" },
  { label: "Services",     anchor: "services" },
  { label: "Doctors",      anchor: "medical-team" },
  { label: "FAQ",           anchor: "faq" },
  { label: "The Book",      anchor: "book" },
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
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/medmethod-logo-cropped_d1f53d27.png"
              alt="MedMethod Direct — Your Path to Longevity"
              className="h-12 lg:h-[56px] w-auto object-contain"
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
          <div className="hidden lg:flex items-center gap-3">
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
