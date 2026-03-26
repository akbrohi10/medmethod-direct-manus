/* =============================================================================
   ToolsForSuccess.tsx — Additional tools & perks section
   Design: Full-width dark background with lifestyle photo overlay on left,
           headline + feature grid on right. Inspired by Nava Health reference.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { Dumbbell, Apple, Scale, Activity, MessageCircle, ClipboardList, Heart, Zap } from "lucide-react";

const tools = [
  {
    icon: Dumbbell,
    title: "Custom Fitness Plan",
    desc: "Personalized workout programs built around your body, fitness level, and goals.",
  },
  {
    icon: Apple,
    title: "Nutrition Tracking",
    desc: "Daily calorie, macro, and micronutrient tracking with doctor-reviewed guidance.",
  },
  {
    icon: Scale,
    title: "Weight & Progress Tracking",
    desc: "Log your weight, measurements, and milestones — visualize your transformation over time.",
  },
  {
    icon: Activity,
    title: "Bi-Weekly Check-In Visits",
    desc: "Virtual weigh-ins every two weeks with your dedicated physician and Wellness Advisor.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging with Your Team",
    desc: "Message your doctor and Wellness Advisor anytime — real answers, not automated bots.",
  },
  {
    icon: ClipboardList,
    title: "Lab Results Dashboard",
    desc: "Review your comprehensive lab results with plain-language explanations from your physician.",
  },
  {
    icon: Heart,
    title: "Symptom & Hormone Monitoring",
    desc: "Track how you feel day-to-day so your care team can fine-tune your protocol in real time.",
  },
  {
    icon: Zap,
    title: "Personalized Supplement Guidance",
    desc: "Evidence-based supplement recommendations tailored to your labs and health goals.",
  },
];

export default function ToolsForSuccess({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tools-bg-RkspdpYxysaAMKJvfG8agn.webp)`,
        }}
      />
      {/* Gradient overlay: dark on right where text sits, lighter on left for photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12">

          {/* Left: Headline + description */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <span
              className="text-xs font-bold tracking-widest mb-4 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
            >
              YOUR SUCCESS TOOLKIT
            </span>
            <h2
              className="font-black text-white leading-tight mb-5"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Everything You Need
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #E8339E, #B040C0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                to Actually Succeed
              </span>
            </h2>
            <p
              className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              We don't just prescribe and disappear. MedMethod Direct gives you a complete suite of tools — fitness, nutrition, tracking, and direct access to your care team — so you have the accountability and support to finally achieve your goals.
            </p>
            <a
              onClick={onConsultClick}
              className="inline-block self-start text-sm font-bold tracking-wider px-7 py-3 rounded-full text-white transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              }}
            >
              GET STARTED FREE
            </a>
          </div>

          {/* Right: Feature grid */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(232,51,158,0.25) 0%, rgba(122,30,126,0.25) 100%)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#E8339E" }} />
                  </div>
                  {/* Text */}
                  <div>
                    <h4
                      className="text-white font-bold text-sm mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {tool.title}
                    </h4>
                    <p
                      className="text-gray-400 text-xs leading-relaxed"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
