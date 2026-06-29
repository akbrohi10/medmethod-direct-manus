/* =============================================================================
   HowItWorks.tsx — "This Isn't a Subscription. It's a Program."
   DARK background section. Step cards: dark surface, white text, pink accents.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { ChevronRight } from "lucide-react";

const PINK = "#E8339E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const DARK_BG = "#0D0D1A";
const CARD_BG = "rgba(255,255,255,0.05)";
const CARD_BORDER = "rgba(255,255,255,0.10)";
const CARD_BORDER_HOVER = PINK;

interface Step {
  step: string;
  title: string;
  description: string;
  subNote?: string;
}

const steps: Step[] = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "Speak with an Enrollment Specialist who'll walk you through your goals, your symptoms, and exactly what your program would look like — before you commit to anything.",
    subNote: "No cost · No commitment",
  },
  {
    step: "02",
    title: "Schedule Your Lab Work",
    description:
      "We order your comprehensive diagnostic labs and get everything ready — so when you meet virtually with your doctor, the full picture of your health is already on the table. Your Enrollment Specialist will walk you through exactly what's needed for your specific program.",
  },
  {
    step: "03",
    title: "Your 60-Minute Physician Strategy Session",
    description:
      "This isn't a quick check-in. Your doctor comes prepared with your full lab results and goes deep — your history, your challenges, your goals. You leave with a protocol built specifically for you.",
  },
  {
    step: "04",
    title: "Your Program Launches",
    description:
      "Your physician sends your prescription to a licensed pharmacy, which dispenses and ships your medication to you. You meet your dedicated Performance Coach, set up your custom fitness and nutrition plan, and begin bi-weekly weigh-ins. This is where real change starts.",
    subNote: "Ongoing · Your team, always on",
  },
];

export default function HowItWorks({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24"
      style={{ fontFamily: "Montserrat, sans-serif", background: DARK_BG }}
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: GRADIENT }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: PINK }}>THE PROCESS</span>
            <div className="h-px w-10" style={{ background: GRADIENT }} />
          </div>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            This Isn't a Subscription.{" "}
            <br />
            <span
              style={{
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              It's a Program.
            </span>
          </h2>
          <p className="mt-5 text-white/75 text-base max-w-3xl mx-auto leading-relaxed">
            Most telehealth sends a prescription and moves on. We give you a{" "}
            <span className="font-bold text-white">doctor who actually gets to know you</span>, a{" "}
            <span className="font-bold text-white">dedicated performance coach who checks in every two weeks for a weigh-in</span>, and a{" "}
            <span className="font-bold text-white">nutrition and fitness plan built around your biology</span>{" "}
            — not a template.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="relative flex items-stretch">
                {/* Card */}
                <div
                  className="group relative flex flex-col rounded-2xl p-6 w-full transition-all duration-300"
                  style={{
                    background: CARD_BG,
                    border: `1.5px solid ${CARD_BORDER}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    minHeight: "240px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(232,51,158,0.25)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER;
                  }}
                >
                  {/* Step label */}
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                    style={{ color: PINK }}
                  >
                    Step {item.step}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-black text-white leading-snug mb-3"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/75 text-sm leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Sub-note */}
                  {item.subNote && (
                    <p
                      className="mt-4 text-xs font-bold tracking-wide"
                      style={{ color: PINK }}
                    >
                      {item.subNote}
                    </p>
                  )}
                </div>

                {/* Connector arrow — desktop only, between cards */}
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "0 2px 8px rgba(232,51,158,0.2)",
                        border: "1px solid rgba(232,51,158,0.3)",
                      }}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: PINK }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onConsultClick}
            className="inline-block text-sm font-bold tracking-wider px-8 py-3.5 rounded-full text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: GRADIENT, boxShadow: "0 6px 24px rgba(232,51,158,0.4)" }}
          >
            START YOUR JOURNEY TODAY
          </button>
        </div>

      </div>
    </section>
  );
}
