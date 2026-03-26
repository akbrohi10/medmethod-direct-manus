/* =============================================================================
   MaleToolsForSuccess.tsx — Additional tools & perks section (men's version)
   Design: Mirrors women's ToolsForSuccess exactly — full-width dark background
           with lifestyle photo overlay, headline + feature grid layout.
   Brand: Montserrat, Teal #00C2CB, Navy #0A0F1E
   ============================================================================= */
import { Dumbbell, Apple, Scale, Activity, MessageCircle, ClipboardList, Heart, Zap } from "lucide-react";

const TEAL = "#00C2CB";

const tools = [
  {
    icon: Dumbbell,
    title: "Custom Fitness Plan",
    desc: "Personalized workout programs built around your body, fitness level, and performance goals.",
  },
  {
    icon: Activity,
    title: "Quarterly Lab Panels",
    desc: "Comprehensive hormone, testosterone, and metabolic panels every 90 days — included in your program.",
  },
  {
    icon: Scale,
    title: "Weight & Body Composition",
    desc: "Track weight, lean mass, and body fat over time — visualize your transformation with real data.",
  },
  {
    icon: ClipboardList,
    title: "Bi-Weekly Check-In Visits",
    desc: "Virtual check-ins every two weeks with your dedicated physician and Men's Health Advisor.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging with Your Team",
    desc: "Message your doctor and advisor anytime — real answers, not automated bots.",
  },
  {
    icon: Apple,
    title: "Nutrition & Macro Tracking",
    desc: "Daily calorie, protein, and micronutrient guidance reviewed by your physician.",
  },
  {
    icon: Heart,
    title: "Symptom & Hormone Monitoring",
    desc: "Track energy, libido, mood, and sleep so your care team can fine-tune your protocol in real time.",
  },
  {
    icon: Zap,
    title: "Supplement & Peptide Guidance",
    desc: "Evidence-based supplement and peptide recommendations tailored to your labs and health goals.",
  },
];

export default function MaleToolsForSuccess({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>
      {/* Background image — fit man at sunrise */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-service-longevity-aCr8S9DtmWXwhAjFi5v2Fv.webp)`,
        }}
      />
      {/* Gradient overlay: lighter on left for photo, dark on right for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,15,30,0.45) 0%, rgba(10,15,30,0.75) 45%, rgba(10,15,30,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12">

          {/* Left: Headline + description */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <span
              className="text-xs font-bold tracking-widest mb-4 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: TEAL }}
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
                  background: "linear-gradient(90deg, #00C2CB, #0099A8)",
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
              className="inline-block self-start text-sm font-bold tracking-wider px-7 py-3 rounded-full text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)",
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
                    border: "1px solid rgba(0,194,203,0.15)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(0,194,203,0.15)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: TEAL }} />
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
