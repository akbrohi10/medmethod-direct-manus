/* =============================================================================
   DiscoveryCall.tsx — Booking page for scheduling a free discovery call
   Embeds Go High Level calendar widget. Clean, brand-aligned layout.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";

export default function DiscoveryCall() {
  useEffect(() => {
    // Dynamically resize the iframe to fit content
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "resize" && event.data.height) {
        const iframe = document.getElementById("Qxw3vN2dmBw9LSUQag8J_1781812832314") as HTMLIFrameElement;
        if (iframe) {
          iframe.style.height = event.data.height + "px";
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Book a Discovery Call | MedMethod Direct</title>
        <meta
          name="description"
          content="Schedule your free 15-minute discovery call with the MedMethod Direct care team. No cost, no obligation — learn how our physician-led program can help you."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://medmethoddirect.com/discovery-call" />
        <meta property="og:title" content="Book a Discovery Call | MedMethod Direct" />
        <meta property="og:description" content="Schedule your free 15-minute discovery call. No cost, no obligation." />
        <meta property="og:url" content="https://medmethoddirect.com/discovery-call" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-[#F9F7F5]">
        {/* Header */}
        <header className="w-full py-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <a href="/" className="block">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/medmethod-logo-cropped_d1f53d27.png"
                alt="MedMethod Direct — Your Path to Longevity"
                className="h-12 md:h-14"
              />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-8 md:mb-10">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Book Your Discovery Call
              </h1>
              <p
                className="text-gray-600 text-base md:text-lg max-w-xl mx-auto"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                A free 15-minute call with our care team to understand your goals.
                No cost, no obligation.
              </p>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8 text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% Virtual
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Same Doctor. Every Visit.
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Licensed in 17 States
              </span>
            </div>

            {/* Calendar Embed */}
            <div className="bg-white rounded-2xl shadow-lg">
              <iframe
                src="https://link.sendmeapro.com/widget/booking/Qxw3vN2dmBw9LSUQag8J"
                style={{ width: "100%", height: "1000px", border: "none" }}
                id="Qxw3vN2dmBw9LSUQag8J_1781812832314"
                title="Schedule a Discovery Call"
                loading="lazy"
              />
            </div>

            {/* Back to home link */}
            <div className="text-center mt-8">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-[#E8339E] transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ← Back to medmethoddirect.com
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
