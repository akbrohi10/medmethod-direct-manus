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
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex flex-col items-start leading-none mb-4" style={{ width: "fit-content" }}>
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
              <div className="flex items-center gap-1.5 mt-0.5 w-full">
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
                className="mt-1 text-center w-full"
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
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "Hormone Replacement Therapy",
                "Medical Weight Loss",
                "Perimenopause Care",
                "Menopause Management",
                "Thyroid Optimization",
                "Longevity Protocols",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#services"
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
              Explore
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "About", href: "#about" },
                { label: "Our Providers", href: "#about" },
                { label: "FAQ", href: "#faq" },
                { label: "Dr. Jumana Al-Deek", href: "https://drjumanaaldeek.com" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Get Started
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  onClick={onConsultClick}
                  className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Schedule a Discovery Call
                </a>
              </li>

              <li>
                <button
                  onClick={() => setQuizOpen(true)}
                  className="text-white/50 hover:text-white text-sm transition-colors text-left"
                  style={{ fontFamily: "Montserrat, sans-serif", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Take the Free Health Quiz
                </button>
              </li>
              <li className="mt-3 pt-3 border-t border-white/5">
                <h5
                  className="text-white/40 font-semibold text-[10px] tracking-[0.18em] uppercase mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Legal & Compliance
                </h5>
              </li>
              {[
                // All 5 links match the v3 compliance doc URL spec exactly.
                // Some destination pages (/privacy, /subscription-policy, /accessibility) may
                // temporarily 404 on medmethoddirect.com until those pages are published or
                // until redirects are configured.
                { label: "Terms and Conditions", href: "https://medmethoddirect.com/terms" },
                { label: "Privacy Policy", href: "https://medmethoddirect.com/privacy" },
                { label: "Notice of Privacy Practices", href: "https://medmethoddirect.com/hipaa-notice" },
                { label: "Subscription and Refund Policy", href: "https://medmethoddirect.com/subscription-policy" },
                { label: "Accessibility Statement", href: "https://medmethoddirect.com/accessibility" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* States Served */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <p
            className="text-white/40 text-xs font-semibold tracking-[0.12em] uppercase mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Currently Serving Patients In:
          </p>
          <p
            className="text-white/50 text-sm leading-relaxed"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Florida · Virginia · Colorado · Maryland · Michigan · Illinois · Texas · Arizona · Tennessee · New Jersey · Washington, D.C. · Georgia · Alabama · Washington · North Carolina · Pennsylvania · Ohio
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-white/50 text-xs text-center md:text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            © 2026 MedMethod Direct. All rights reserved. | www.medmethoddirect.com
          </p>
          <div className="flex gap-x-5 gap-y-2 flex-wrap justify-center md:justify-end">
            {[
              // Mirrors the Legal & Compliance column above — all 5 links per spec.
              { label: "Terms", href: "https://medmethoddirect.com/terms" },
              { label: "Privacy", href: "https://medmethoddirect.com/privacy" },
              { label: "HIPAA Notice", href: "https://medmethoddirect.com/hipaa-notice" },
              { label: "Subscription & Refunds", href: "https://medmethoddirect.com/subscription-policy" },
              { label: "Accessibility", href: "https://medmethoddirect.com/accessibility" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/80 text-xs transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <p
          className="text-white/40 text-xs mt-6 leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <strong className="text-white/50">Medical Disclaimer:</strong> The information provided on this website is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. Individual results may vary. Consult your healthcare provider before starting any new treatment.
        </p>
      </div>
    </footer>
    <MetabolicQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
  </>);
}
