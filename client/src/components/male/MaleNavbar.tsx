/* =============================================================================
   MaleNavbar.tsx — Men's Health Navbar
   Brand: Dark Navy #0A0F1E, Teal #00C2CB
   ============================================================================= */
import { useState } from "react";
import { ChevronDown, X, Menu } from "lucide-react";

const MEN_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/medmethod-men-logo_c015511e.png";

const TEAL = "#00C2CB";
const NAVY = "#0A0F1E";

const navLinks = [
  {
    label: "Services",
    href: "#services",
    dropdown: [
      { label: "TRT / Testosterone", href: "#services" },
      { label: "Weight Loss", href: "#services" },
      { label: "Sexual Health", href: "#services" },
      { label: "Hair Restoration", href: "#services" },
      { label: "Peptide Therapy", href: "#services" },
    ],
  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#programs" },
  { label: "Results", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function MaleNavbar({ onConsultClick }: { onConsultClick: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{ background: "rgba(245,242,236,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,194,203,0.2)" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/male" className="flex-shrink-0">
            <img src={MEN_LOGO} alt="MedMethod Direct Men" style={{ height: 44, width: "auto", objectFit: "contain" }} />
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
                  className="flex items-center gap-1 px-4 py-2 font-semibold text-sm tracking-wide transition-colors duration-200"
                  style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.05em", color: "rgba(10,22,40,0.65)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(10,22,40,0.65)")}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </a>
                {link.dropdown && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 rounded-lg shadow-2xl overflow-hidden"
                    style={{ background: "#fff", border: "1px solid rgba(0,194,203,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    {link.dropdown.map((item) => (
                      <a key={item.label} href={item.href}
                        className="block px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "rgba(10,22,40,0.65)", fontFamily: "Montserrat, sans-serif" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = TEAL; e.currentTarget.style.background = "rgba(0,194,203,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(10,22,40,0.65)"; e.currentTarget.style.background = "transparent"; }}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Women switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/"
              className="text-xs font-bold tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={{ color: "rgba(10,22,40,0.5)", border: "1px solid rgba(10,22,40,0.2)", fontFamily: "Montserrat, sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#0A1628"; e.currentTarget.style.borderColor = "rgba(10,22,40,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(10,22,40,0.5)"; e.currentTarget.style.borderColor = "rgba(10,22,40,0.2)"; }}>
              FOR WOMEN →
            </a>
            <button
              onClick={onConsultClick}
              className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)`,
                color: "#fff",
                boxShadow: `0 4px 20px rgba(0,194,203,0.35)`,
              }}
            >
              FREE CONSULTATION
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            style={{ color: "rgba(10,22,40,0.7)" }}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: "#F5F2EC", borderTop: "1px solid rgba(0,194,203,0.2)" }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="py-3 font-semibold text-sm tracking-wide border-b transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(10,22,40,0.7)", borderColor: "rgba(10,22,40,0.1)" }}
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="/" className="py-3 font-semibold text-sm tracking-wide border-b"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(10,22,40,0.45)", borderColor: "rgba(10,22,40,0.1)" }}
              onClick={() => setMobileOpen(false)}>
              Switch to Women's →
            </a>
            <button onClick={() => { onConsultClick(); setMobileOpen(false); }}
              className="mt-3 py-3 rounded-full text-sm font-bold tracking-wider text-center text-white"
              style={{ fontFamily: "Montserrat, sans-serif", background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)` }}>
              FREE CONSULTATION
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
