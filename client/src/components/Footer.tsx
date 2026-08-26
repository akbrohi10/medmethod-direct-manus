/* =============================================================================
   Footer — Clinical Noir Design
   Dark background, logo, nav columns, social links, legal
   ============================================================================= */
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
                { label: "Medical weight management (GLP-1)", href: "#services" },
                { label: "Hormone therapy for women", href: "#services" },
                { label: "Nutrition and vitamin optimization", href: "#services" },
                { label: "Dermatology and skin", href: "#services" },
                { label: "Hair restoration", href: "#services" },
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
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Locations", href: "/locations" },
                { label: "Care Team Booking", href: "/care-team-booking" },
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
                { label: "Georgia", href: "/georgia" },
                { label: "Illinois", href: "/illinois" },
                { label: "Michigan", href: "/michigan" },
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
                { label: "Book Appointment", href: null, action: onConsultClick },
                { label: "Terms & Conditions", href: "/terms", action: null },
                { label: "Privacy Policy", href: "/privacy-policy", action: null },
                { label: "HIPAA Notice", href: "/hipaa-notice", action: null },
                { label: "Subscription & Refund Policy", href: "/subscription-policy", action: null },
                { label: "Consent to Telehealth", href: "/consent-to-telehealth", action: null },
                { label: "Accessibility", href: "/accessibility", action: null },
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
            className="text-white/50 text-xs text-center md:text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            © 2026 MedMethod Direct. All rights reserved. | www.medmethoddirect.com
          </p>
          <div className="flex gap-6 flex-wrap justify-center md:justify-end items-center">
            <a
              href="https://medmethoddirect.md-hq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Patient Login
            </a>
            {[
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "HIPAA Notice", href: "/hipaa-notice" },
              { label: "Subscription Policy", href: "/subscription-policy" },
              { label: "Telehealth Consent", href: "/consent-to-telehealth" },
              { label: "Accessibility", href: "/accessibility" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
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
