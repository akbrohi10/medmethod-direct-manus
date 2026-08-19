/* =============================================================================
   Care Team Booking Page — MedMethod Direct
   Simple landing page with embedded SendMeAPro booking calendar
   ============================================================================= */
import { useEffect } from "react";

const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";

export default function CareTeamBooking() {
  useEffect(() => {
    // Load the form embed script
    const existing = document.querySelector('script[src="https://link.sendmeapro.com/js/form_embed.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://link.sendmeapro.com/js/form_embed.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 relative">
          {/* Logo — far left */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src={LOGO}
              alt="MedMethod Direct"
              className="h-8 sm:h-11 w-auto object-contain"
              style={{ clipPath: "inset(0 0 30% 0)", marginBottom: "-6px" }}
              loading="eager"
            />
          </a>
          {/* Phone — centered */}
          <a
            href="tel:+18883627011"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-bold text-[#E8339E] hover:text-[#7A1E7E] transition-colors whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="text-[13px] sm:text-[15px]">(888) 362-7011</span>
          </a>
          {/* Patient Login — far right */}
          <a
            href="https://medmethoddirect.md-hq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-semibold border border-gray-300 text-gray-600 hover:border-[#E8339E] hover:text-[#E8339E] transition-colors whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Patient Login
          </a>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Book with Our Care Team
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Choose a date and time that works for you. Our care team is here to help.
          </p>
        </div>

        {/* Embedded Calendar */}
        <div className="w-full">
          <iframe
            src="https://link.sendmeapro.com/widget/booking/18sbmUpLKjc7pcLE8jdN"
            allow="payment"
            style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
            scrolling="no"
            id="18sbmUpLKjc7pcLE8jdN_178716643455O"
            title="Care Team Booking Calendar"
          />
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400" style={{ fontFamily: "Montserrat, sans-serif" }}>
            &copy; {new Date().getFullYear()} MedMethod Direct. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
