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
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
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
            </div>

            {/* Office Address */}
            <div className="mb-6">
              <p
                className="text-white/40 text-xs font-semibold tracking-[0.12em] uppercase mb-1.5"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Office
              </p>
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                274 Wilshire Blvd<br />
                Suite 231<br />
                Casselberry, FL 32707
              </p>
            </div>

          </div>

          {/* Explore Column */}
          <div>
            <h4
              className="text-white font-bold text-xs tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Explore
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
                  Book Appointment
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
                { label: "Terms and Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Notice of Privacy Practices", href: "/hipaa-notice" },
                { label: "Subscription and Refund Policy", href: "/subscription-policy" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Accessibility Statement", href: "/accessibility" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
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
            Florida · Arizona · Colorado · District of Columbia · Georgia · Illinois · Maryland · Michigan · North Carolina · Pennsylvania · Texas · Virginia
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
          <div className="flex gap-x-5 gap-y-2 flex-wrap justify-center md:justify-end items-center">
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
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy-policy" },
              { label: "HIPAA Notice", href: "/hipaa-notice" },
              { label: "Subscription & Refunds", href: "/subscription-policy" },
              { label: "Shipping", href: "/shipping-policy" },
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
