/* =============================================================================
   How It Works — MedMethod Direct
   Clinical Noir Design | Women 40+ focused 3-step process
   ============================================================================= */
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "FREE VIRTUAL CONSULTATION",
    body: "Schedule your free, no-pressure virtual consultation with one of our board-certified physicians. Tell us what you're experiencing — the night sweats, the brain fog, the weight that won't budge — and we'll listen. Really listen. No judgment, no rushed appointments.",
    cta: "Book Free Consultation",
  },
  {
    number: "02",
    title: "COMPREHENSIVE LABS & DEEP-DIVE DIAGNOSTIC",
    body: "We order comprehensive lab work at a local lab near you — full hormone panels, metabolic markers, thyroid, and more. Our physicians analyze your results in depth to build a complete picture of your biology. This is where we find the real answers.",
    cta: "Learn About Our Labs",
  },
  {
    number: "03",
    title: "YOUR FULLY CUSTOMIZED PLAN",
    body: "You receive a fully personalized treatment protocol, custom nutrition program, and fitness plan — built around your specific biology, lifestyle, and goals. Then we meet with you virtually every two weeks to track your progress and fine-tune your plan. The same doctor. The same Wellness Advisor. Every step of the way.",
    cta: "See Treatment Options",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Process
            </span>
            <h2
              className="font-black text-[#111111] leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              START FEELING LIKE
              <br />
              YOURSELF AGAIN —
              <br />
              IN 3 SIMPLE STEPS
            </h2>
          </div>
          <a
            href="#consultation"
            className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 self-start lg:self-auto whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            START YOUR JOURNEY
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-[#f8f8f8] rounded-2xl p-8 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              {/* Oversized step number */}
              <div
                className="absolute -top-4 -right-2 font-black leading-none select-none pointer-events-none"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "8rem",
                  background: "linear-gradient(135deg, #E8339E08 0%, #7A1E7E12 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {step.number}
              </div>

              {/* Step label */}
              <div
                className="font-bold mb-4"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.75rem",
                  color: "#E8339E",
                  letterSpacing: "0.1em",
                }}
              >
                Step {step.number}
              </div>

              {/* Gradient rule */}
              <div
                className="h-0.5 w-12 mb-5"
                style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
              />

              <h3
                className="text-[#111111] font-black mb-4 leading-tight"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.03em",
                }}
              >
                {step.title}
              </h3>

              <p
                className="text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}
              >
                {step.body}
              </p>

              <a
                href="#consultation"
                className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#E8339E",
                  letterSpacing: "0.05em",
                }}
              >
                {step.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
