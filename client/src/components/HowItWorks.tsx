/* =============================================================================
   HowItWorks.tsx — "The Path to Your Breakthrough"
   5-step horizontal card flow matching the reference design:
   1. Free Advisor Consultation
   2. Clinical Registration ($449)
   3. Lab Review & Strategy
   4. Select Your Track
   5. Bi-Weekly Check-In & Optimization
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { PhoneCall, FlaskConical, ClipboardCheck, LayoutGrid, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    step: "1",
    title: "Free Advisor Consultation",
    description:
      "Speak with an Enrollment Specialist to discuss your goals and see if MedMethod Direct is the right fit for your lifestyle.",
    badge: null,
  },
  {
    icon: FlaskConical,
    step: "2",
    title: "Clinical Registration",
    description:
      "Pay your $449 setup fee to unlock your diagnostic suite, order your labs, and ship your MedMethod Smart Scale.",
    badge: "$449 ONE-TIME",
  },
  {
    icon: ClipboardCheck,
    step: "3",
    title: "Lab Review & Strategy",
    description:
      "Meet with your dedicated Doctor to review your bloodwork and receive your personalized clinical recommendation.",
    badge: null,
  },
  {
    icon: LayoutGrid,
    step: "4",
    title: "Select Your Track",
    description:
      "Based on your biology, you'll choose your ongoing monthly program for medication, coaching, and accountability.",
    badge: null,
  },
  {
    icon: RefreshCw,
    step: "5",
    title: "Meet Your Wellness Advisor",
    description:
      "Your dedicated Wellness Advisor guides bi-weekly check-ins, tracks your progress, and fine-tunes your plan so your results keep accelerating.",
    badge: "ONGOING",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="font-black text-[#111111] leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            The Path to Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              Breakthrough
            </span>
          </h2>
          <p
            className="mt-3 text-gray-500 text-base max-w-xl mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            From your first call to your long-term transformation, we ensure you never walk your health journey alone.
          </p>
        </div>

        {/* Steps — horizontal scroll on mobile, 5-col on desktop */}
        <div
          className="flex gap-0 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {steps.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === steps.length - 1;
            return (
              <div
                key={i}
                className="flex items-stretch flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Card */}
                <div
                  className="flex flex-col rounded-2xl p-5 bg-[#F6F7FB] border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  style={{ width: "clamp(200px, 18vw, 260px)", minHeight: 0 }}
                >
                  {/* Icon box */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(232,51,158,0.10), rgba(122,30,126,0.10))",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#E8339E" }} />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-black text-[#111] leading-snug mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
                  >
                    {item.step}. {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-500 text-sm leading-relaxed flex-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.description}
                  </p>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className="mt-3 self-start text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full"
                      style={
                        item.badge === "$449 ONE-TIME"
                          ? {
                              background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                              color: "#fff",
                              fontFamily: "Montserrat, sans-serif",
                            }
                          : {
                              background: "linear-gradient(135deg, rgba(232,51,158,0.12), rgba(122,30,126,0.12))",
                              color: "#E8339E",
                              fontFamily: "Montserrat, sans-serif",
                            }
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Arrow connector — hidden after last card */}
                {!isLast && (
                  <div className="flex items-center justify-center flex-shrink-0 px-2" style={{ width: 36 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="#CCCCDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <a
            href="#consultation"
            className="inline-block text-sm font-bold tracking-wider px-8 py-3 rounded-full text-white transition-opacity duration-200 hover:opacity-90"
            style={{
              fontFamily: "Montserrat, sans-serif",
              background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
            }}
          >
            START YOUR JOURNEY TODAY
          </a>
        </div>

      </div>
    </section>
  );
}
