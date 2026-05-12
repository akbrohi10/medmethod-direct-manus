/* =============================================================================
   Footer — Clinical Noir Design
   Dark background, logo, nav columns, social links, legal
   ============================================================================= */
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import MetabolicQuiz from "./MetabolicQuiz";

export default function Footer({ onConsultClick }: { onConsultClick: () => void }) {
  const [quizOpen, setQuizOpen] = useState(false);
  return (<>
    <footer className="bg-[#0d0d0d] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex flex-col leading-none mb-4">
              <div className="flex items-baseline gap-0">
                <span
                  className="font-black text-white"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.6rem", letterSpacing: "-0.02em" }}
                >
                  Med
                </span>
                <span
                  className="font-black"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "1.6rem",
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
                  className="text-white font-semibold tracking-[0.25em]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}
                >
                  DIRECT
                </span>
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #7A1E7E, #E8339E)" }} />
              </div>
              <span
                className="text-center"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.4)",
                  fontStyle: "italic",
                }}
              >
                Your Path to Longevity
              </span>
            </div>

            <p
              className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
  Premium virtual medical clinic focused on longevity, hormones, and medically supervised weight loss for women over 40. Doctor-led. Personalized. Accountable.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#E8339E]/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-10">
          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Hormone Replacement Therapy", "Medical Weight Loss", "Perimenopause Care", "Menopause Management", "Thyroid Optimization", "Longevity Protocols"].map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    className="text-white/50 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["About Us", "Our Providers", "How It Works", "Blog", "FAQ", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#about"
                    className="text-white/50 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>

          {/* Locations Column */}
          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Locations
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="/locations" className="text-[#E8339E] hover:text-white text-xs font-bold tracking-widest uppercase transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>All Locations →</a>
              </li>
              {[
                { label: "Virginia", href: "/virginia" },
                { label: "Maryland", href: "/maryland" },
                { label: "Washington DC", href: "/washington-dc" },
                { label: "Florida", href: "/florida" },
                { label: "North Carolina", href: "/north-carolina" },
                { label: "Pennsylvania", href: "/pennsylvania" },
                { label: "Colorado", href: "/colorado" },
                { label: "Arizona", href: "/arizona" },
                { label: "Texas", href: "/texas" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Get Started
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Free Consultation", href: null, action: onConsultClick },
                { label: "Consent to Telehealth", href: "/consent-to-telehealth", action: null },
                { label: "Privacy Policy", href: "/privacy-policy", action: null },
                { label: "HIPAA Notice", href: "/hipaa-notice", action: null },
                { label: "Terms of Service", href: "/terms", action: null },
              ].map(({ label, href, action }) => (
                <li key={label}>
                  <a
                    href={href ?? undefined}
                    onClick={action ?? undefined}
                    className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setQuizOpen(true)}
                  className="text-white/50 hover:text-white text-sm transition-colors text-left"
                  style={{ fontFamily: "Montserrat, sans-serif", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Take the Free Health Quiz
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-white/30 text-xs text-center md:text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            © 2026 MedMethod Direct. All rights reserved. | www.medmethoddirect.com
          </p>
          <div className="flex gap-6 flex-wrap justify-center md:justify-end">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "HIPAA Notice", href: "/hipaa-notice" },
              { label: "Consent to Telehealth", href: "/consent-to-telehealth" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <p
          className="text-white/20 text-xs mt-6 leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <strong className="text-white/30">Medical Disclaimer:</strong> The information provided on this website is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. Individual results may vary. Consult your healthcare provider before starting any new treatment.
        </p>
      </div>
    </footer>
    <MetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
  </>);
}
