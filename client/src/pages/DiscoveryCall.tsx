/* =============================================================================
   DiscoveryCall.tsx — Booking page for scheduling a free discovery call
   Embeds Go High Level calendar widget. Clean, brand-aligned layout.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const YOUTUBE_ID = "AGrpLj1jmfw";
const THUMBNAIL_URL = `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = () => {
    setPlaying(true);
  };

  // Once iframe loads, send a postMessage to start playback
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*"
        );
      }, 300);
    }
  };

  if (playing) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-md" style={{ aspectRatio: "16/9" }}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
          className="w-full h-full"
          style={{ border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="MedMethod Direct program overview"
          onLoad={handleIframeLoad}
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-md cursor-pointer group"
      style={{ aspectRatio: "16/9" }}
      onClick={handlePlay}
      role="button"
      aria-label="Play video: Learn about MedMethod Direct"
    >
      <img
        src={THUMBNAIL_URL}
        alt="MedMethod Direct program overview"
        className="w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          style={{ background: GRADIENT }}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

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
                src="/manus-storage/medmethod-logo-navbar_99a2ea82.png"
                alt="MedMethod Direct — Your Path to Longevity"
                className="h-12 md:h-14"
              />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            {/* Headline + Trust signals — compact */}
            <div className="text-center mb-5">
              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
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
                className="text-gray-600 text-sm md:text-base mb-3"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                A free 15-minute call with our care team. No cost, no obligation.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8339E]/8 border border-[#E8339E]/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-[#1a1a2e]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  100% Virtual — No Office Visit Needed
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 text-xs md:text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Same Doctor. Every Visit.
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#E8339E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Licensed in 12 states
                </span>
              </div>
            </div>

            {/* Video Section - YouTube */}
            <div className="mb-8">
              <VideoEmbed />
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
