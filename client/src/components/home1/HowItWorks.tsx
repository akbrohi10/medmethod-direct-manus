/* =============================================================================
   HowItWorks.tsx — "This Isn't a Subscription. It's a Program."
   DARK background section. Step cards: dark surface, white text, pink accents.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { ChevronRight } from "lucide-react";

const PINK = "#E8339E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const DARK_BG = "#161628";
const CARD_BG = "rgba(255,255,255,0.05)";
const CARD_BORDER = "rgba(255,255,255,0.10)";
const CARD_BORDER_HOVER = PINK;

interface Step {
  step: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    step: "01",
    title: "Schedule Your Discovery Call",
    description:
      "A 15-minute call with our care team to understand your goals and see if MedMethod is the right fit. Dr. Al-Deek personally reviews every case.",
  },
  {
    step: "02",
    title: "Your Personalized Protocol Is Built",
    description:
      "Your physician reviews your health, goals, and (if your program includes labs) your bloodwork — then designs a protocol made for you. No templates. No 5-minute prescription mills.",
  },
  {
    step: "03",
    title: "Your Program Begins",
    description:
      "Medication ships to your door. Your coach checks in every two weeks. Real change starts here.",
  },
];

export default function HowItWorks({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-16 lg:py-24"
      style={{ fontFamily: "Montserrat, sans-serif", background: DARK_BG }}
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-14">
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
          <p className="mt-5 text-white/80 text-base max-w-2xl mx-auto leading-relaxed">
            Real doctors. Real labs. A protocol built for{" "}
            <span className="font-bold text-white">you</span>{" "}— not a template.
          </p>
        </div>

        {/* Steps — 3-column grid optimized for cold-traffic skim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
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
                  <p className="text-white/75 text-sm leading-relaxed">
                    {item.description}
                  </p>
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
        <div className="text-center mt-8 md:mt-12">
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
