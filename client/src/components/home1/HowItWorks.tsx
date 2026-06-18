/* =============================================================================
   HowItWorks.tsx — "How It Works" section with YouTube explainer video
   Clean circle-line-circle layout. Light off-white background.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

import { Helmet } from "react-helmet-async";

const PINK = "#E8339E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BG = "#F9F7F5";

const YOUTUBE_VIDEO_ID = "AGrpLj1jmfw";

interface Step {
  number: string;
  title: string;
  subtitle: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Schedule a Free Discovery Call",
    subtitle: "A 15-min call with our care team to understand your goals",
  },
  {
    number: "2",
    title: "Dr. Al-Deek Reviews Your Case",
    subtitle: "Your physician builds a personalized protocol — no templates",
  },
  {
    number: "3",
    title: "Your Program Begins",
    subtitle: "Meds shipped to your door or called into your local pharmacy",
  },
];

const JSONLD_VIDEO = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How MedMethod Direct Works — Physician-Led Hormone & Weight Loss Program",
  "description": "Dr. Jumana Al-Deek explains how MedMethod Direct's physician-led virtual program works — from your free Discovery Call through personalized hormone therapy and GLP-1 medical weight loss.",
  "thumbnailUrl": `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`,
  "uploadDate": "2026-06-18",
  "contentUrl": `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`,
  "embedUrl": `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`,
  "publisher": {
    "@type": "Organization",
    "name": "MedMethod Direct",
    "url": "https://medmethoddirect.com"
  }
};

export default function HowItWorks({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-14 lg:py-16"
      style={{ fontFamily: "Montserrat, sans-serif", background: BG }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(JSONLD_VIDEO)}</script>
      </Helmet>

      <div className="max-w-[1100px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <h2
          className="text-center font-bold text-gray-900 mb-8"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontFamily: "Playfair Display, serif" }}
        >
          How It Works
        </h2>

        {/* YouTube Video Embed */}
        <div className="max-w-[640px] mx-auto mb-8">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="How MedMethod Direct Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Positioning statement */}
        <p className="text-center text-gray-600 mb-10 md:mb-12 text-sm md:text-base max-w-xl mx-auto">
          This isn't a subscription. It's a physician-led program — with check-ins on a regular basis.
        </p>

        {/* Steps with connecting line */}
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-0">

          {/* Connecting line — desktop only */}
          <div
            className="hidden md:block absolute top-[32px] left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-[2px]"
            style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
          />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center flex-1 relative z-10">
              {/* Numbered circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 shadow-lg"
                style={{
                  background: GRADIENT,
                  boxShadow: "0 4px 20px rgba(232,51,158,0.3)",
                }}
              >
                {step.number}
              </div>

              {/* Step title */}
              <h3
                className="text-gray-900 font-bold leading-snug mb-2 max-w-[220px]"
                style={{ fontSize: "0.95rem" }}
              >
                {step.title}
              </h3>

              {/* Step subtitle */}
              <p className="text-gray-500 leading-relaxed max-w-[240px]" style={{ fontSize: "0.85rem" }}>
                {step.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10 md:mt-12">
          <button
            onClick={onConsultClick}
            className="inline-block text-sm font-bold tracking-wider px-8 py-3.5 rounded-full text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: GRADIENT, boxShadow: "0 6px 24px rgba(232,51,158,0.35)" }}
          >
            SCHEDULE A DISCOVERY CALL
          </button>
        </div>

      </div>
    </section>
  );
}
