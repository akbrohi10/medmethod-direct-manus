/* =============================================================================
   Thank You 2 / Booking Confirmation Page — WL2 ($15 refundable visit flow)
   Same as ThankYou.tsx but:
   - Confirmation text updated for $15 hold
   - Info band: $15 refund message instead of $149 charge notice
   - Calendar title updated for 15-min visit
   ============================================================================= */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import WL2BookingFollowup from "@/components/home1/WL2BookingFollowup";

export default function ThankYou2() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "booking_complete_wl2" });
    }

    // Meta Pixel: ensure the library is loaded and Purchase fires even if the
    // static header script didn't execute (e.g. client-side navigation, caching).
    // This is a belt-and-suspenders approach that guarantees the conversion event.
    const w = window as any;
    // Only bootstrap fbq if the header script didn't already do it
    const alreadyInitialized = w.fbq && w.fbq.callMethod;
    if (!w.fbq) {
      const n: any = (w.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
    }
    // Load fbevents.js if not already present
    if (!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
    }
    // Only fire events if the header script didn't already queue them
    if (!alreadyInitialized) {
      // Check if init was already queued by the header
      const alreadyQueued = w.fbq.queue && w.fbq.queue.some(function (q: any) {
        return q[0] === "init" && q[1] === "1589326469554181";
      });
      if (!alreadyQueued) {
        w.fbq("init", "1589326469554181");
        w.fbq("track", "PageView");
        w.fbq("track", "Purchase");
      }
    } else {
      // Library already fully loaded — just fire Purchase directly
      w.fbq("track", "Purchase");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>You're Confirmed | MedMethod Direct</title>
        <meta name="description" content="Your 15-minute visit with Dr. Al-Deek is scheduled. Accept your calendar invite and reply to our text to confirm your spot." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-start px-4 pt-0 pb-12 md:pb-20">
        {/* Minimal Logo Header */}
        <div className="w-full max-w-2xl py-5 mb-6 flex items-center justify-between">
          <a href="/" className="inline-flex flex-col items-center leading-none" style={{ width: "fit-content" }}>
            <div className="flex items-baseline gap-0">
              <span
                className="font-black text-[#1a1a2e]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.3rem", letterSpacing: "-0.02em" }}
              >
                Med
              </span>
              <span
                className="font-black"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.3rem",
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
            <div className="flex items-center gap-1 mt-0.5 w-full">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }} />
              <span
                className="text-[#1a1a2e] font-semibold tracking-[0.25em]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.5rem" }}
              >
                DIRECT
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #7A1E7E, #E8339E)" }} />
            </div>
          </a>
          <a
            href="tel:+18883627011"
            className="inline-flex items-center gap-2 text-[#7A1E7E] hover:text-[#E8339E] transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">(888) 362-7011</span>
              <span className="text-[10px] font-medium text-[#4a4a5a] hidden sm:block">Need help?</span>
            </div>
          </a>
        </div>

        <WL2BookingFollowup />

        {/* Continue Exploring Link */}
        <div className="w-full max-w-lg text-center pt-6 border-t border-[#e8e6e3]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#4a4a5a] hover:text-[#E8339E] text-sm font-medium transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Continue exploring MedMethod Direct
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}
