/* =============================================================================
   Thank You 2 / Booking Confirmation Page — WL2 ($15 refundable visit flow)
   Same as ThankYou.tsx but:
   - Confirmation text updated for $15 hold
   - Info band: $15 refund message instead of $149 charge notice
   - Calendar title updated for 15-min visit
   ============================================================================= */
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import WL2BookingFollowup from "@/components/home1/WL2BookingFollowup";

const WL2_META_PIXEL_ID = "1589326469554181";

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
  queue?: unknown[][];
  push?: (...args: unknown[]) => void;
};

function initializeWl2MetaPixel() {
  const metaWindow = window as typeof window & { fbq?: MetaPixelFunction; _fbq?: MetaPixelFunction };

  if (!metaWindow.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue?.push(args);
      }
    } as MetaPixelFunction;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    metaWindow.fbq = fbq;
    metaWindow._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  return metaWindow.fbq;
}

export default function ThankYou2() {
  const purchaseTracked = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "booking_complete_wl2" });
    }

    if (!purchaseTracked.current) {
      purchaseTracked.current = true;
      const fbq = initializeWl2MetaPixel();
      fbq?.("init", WL2_META_PIXEL_ID);
      fbq?.("track", "PageView");
      fbq?.("track", "Purchase");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>You're Confirmed | MedMethod Direct</title>
        <meta name="description" content="Your 15-minute visit with Dr. Al-Deek is scheduled. Accept your calendar invite and reply to our text to confirm your spot." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1589326469554181&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

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
