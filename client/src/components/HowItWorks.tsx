/* =============================================================================
   HowItWorks.tsx — "The Path to Your Breakthrough" — Option C Redesign
   Large gradient watermark step numbers, prominent icons, hover lift,
   gradient connector arrows between cards on desktop.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { PhoneCall, FlaskConical, ClipboardCheck, RefreshCw, ChevronRight } from "lucide-react";

const PINK = "#E8339E";
const PURPLE = "#7A1E7E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";

const steps = [
  {
    icon: PhoneCall,
    step: "01",
    title: "Free Advisor Consultation",
    description:
      "Speak with an Enrollment Specialist to discuss your goals and see if MedMethod Direct is the right fit for your lifestyle.",
    badge: null,
    badgeStyle: null,
  },
  {
    icon: FlaskConical,
    step: "02",
    title: "Clinical Registration",
    description:
      "Pay your $449 setup fee to unlock your diagnostic suite, order your labs, and ship your MedMethod Smart Scale.",
    badge: null,
    badgeStyle: null,
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Lab Review & Program Selection",
    description:
      "Your Doctor reviews your bloodwork, walks you through treatment options, and together you select the program that fits your biology and goals.",
    badge: null,
    badgeStyle: null,
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Meet Your Wellness Advisor",
    description:
      "Your dedicated Wellness Advisor guides bi-weekly check-ins, tracks your progress, and fine-tunes your plan so your results keep accelerating.",
    badge: "ONGOING",
    badgeStyle: "outline",
  },
];

export default function HowItWorks({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-24" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: GRADIENT }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: PINK }}>THE PROCESS</span>
            <div className="h-px w-10" style={{ background: GRADIENT }} />
          </div>
          <h2
            className="font-black text-[#111111] leading-tight"
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
          <p className="mt-5 text-gray-400 text-base max-w-3xl mx-auto leading-relaxed">
            Most telehealth sends a prescription and moves on. We give you a{" "}
            <span className="font-bold text-[#1a1a1a]">doctor who actually gets to know you</span>, a{" "}
            <span className="font-bold text-[#1a1a1a]">dedicated performance coach who checks in every two weeks for a weigh-in</span>, and a{" "}
            <span className="font-bold text-[#1a1a1a]">nutrition and fitness plan built around your biology</span>{" "}
            — not a template.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="relative flex items-stretch">
                {/* Card */}
                <div
                  className="group relative flex flex-col rounded-2xl p-6 w-full overflow-hidden transition-all duration-300"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(232,51,158,0.12)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(232,51,158,0.18)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,51,158,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,51,158,0.12)";
                  }}
                >
                  {/* Watermark number */}
                  <span
                    className="absolute -top-3 -right-2 font-black select-none pointer-events-none leading-none"
                    style={{
                      fontSize: "7rem",
                      backgroundImage: "linear-gradient(135deg, rgba(232,51,158,0.07) 0%, rgba(122,30,126,0.07) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 relative z-10"
                    style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.12), rgba(122,30,126,0.12))" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: PINK }} />
                  </div>

                  {/* Step label */}
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase mb-1 relative z-10"
                    style={{ color: "rgba(232,51,158,0.5)" }}
                  >
                    Step {item.step}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-black text-[#111] leading-snug mb-3 relative z-10"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 relative z-10">
                    {item.description}
                  </p>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className="mt-4 self-start text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full relative z-10"
                      style={
                        item.badgeStyle === "filled"
                          ? { background: GRADIENT, color: "#fff" }
                          : {
                              background: "linear-gradient(135deg, rgba(232,51,158,0.1), rgba(122,30,126,0.1))",
                              color: PINK,
                            }
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Connector arrow — desktop only, between cards */}
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#fff", boxShadow: "0 2px 8px rgba(232,51,158,0.2)", border: "1px solid rgba(232,51,158,0.2)" }}
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
            style={{ background: GRADIENT, boxShadow: "0 6px 24px rgba(232,51,158,0.3)" }}
          >
            START YOUR JOURNEY TODAY
          </button>
        </div>

      </div>
    </section>
  );
}
