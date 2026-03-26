/* =============================================================================
   ToolsForSuccess.tsx — MedMethod Direct
   Design: Dark section with left headline/CTA + right dual phone mockups
           showing the custom fitness app and nutrition tracking app
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */
import { Dumbbell, Apple, Scale, Activity, MessageCircle, ClipboardList, Heart, Zap } from "lucide-react";

const features = [
  { icon: Dumbbell,      title: "Custom Fitness Plan",           desc: "Personalized workouts built around your body and goals." },
  { icon: Apple,         title: "Nutrition Tracking",            desc: "Daily macro tracking with doctor-reviewed guidance." },
  { icon: Scale,         title: "Weight & Progress Tracking",    desc: "Visualize your transformation with milestone logs." },
  { icon: Activity,      title: "Bi-Weekly Check-In Visits",     desc: "Virtual weigh-ins with your physician every two weeks." },
  { icon: MessageCircle, title: "Direct Messaging with Your Team", desc: "Real answers from your doctor — not automated bots." },
  { icon: ClipboardList, title: "Lab Results Dashboard",         desc: "Plain-language explanations of your comprehensive labs." },
  { icon: Heart,         title: "Symptom & Hormone Monitoring",  desc: "Track how you feel so your team can fine-tune your protocol." },
  { icon: Zap,           title: "Supplement Guidance",           desc: "Evidence-based recommendations tailored to your labs." },
];

const FITNESS_APP_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/jBIwLbps6LSl_0715a70f.jpg";
const NUTRITION_APP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/p1oFdcu41UaL_f3db7a4d.png";

export default function ToolsForSuccess() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#0A0A14" }}
    >
      {/* Subtle gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(232,51,158,0.10) 0%, rgba(122,30,126,0.08) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

          {/* ── LEFT: Headline + feature list + CTA ── */}
          <div className="lg:w-5/12 flex flex-col">
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
              className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              We don't just prescribe and disappear. MedMethod Direct gives you a complete suite of tools — fitness, nutrition, tracking, and direct access to your care team — so you have the accountability to finally achieve your goals.
            </p>

            {/* Feature grid — 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(232,51,158,0.25), rgba(122,30,126,0.25))",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                    <div>
                      <h4
                        className="text-white font-bold text-xs mb-0.5"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {f.title}
                      </h4>
                      <p
                        className="text-gray-500 leading-relaxed"
                        style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem" }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="#consultation"
              className="inline-block self-start text-sm font-bold tracking-wider px-7 py-3 rounded-full text-white transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
              }}
            >
              GET STARTED FREE →
            </a>
          </div>

          {/* ── RIGHT: Dual phone mockups ── */}
          <div className="lg:w-7/12 flex items-end justify-center gap-4 lg:gap-6">

            {/* Fitness App phone */}
            <div className="flex flex-col items-center gap-3" style={{ flex: "0 0 auto" }}>
              {/* Phone frame */}
              <div
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                style={{
                  width: "clamp(160px, 18vw, 220px)",
                  aspectRatio: "9/19",
                  border: "3px solid rgba(255,255,255,0.12)",
                  background: "#111",
                  boxShadow: "0 30px 80px rgba(232,51,158,0.25), 0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                {/* Notch */}
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full"
                  style={{ width: 60, height: 10, background: "#0A0A14" }}
                />
                <img
                  src={FITNESS_APP_IMG}
                  alt="Custom Fitness App"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span
                className="text-white text-xs font-bold tracking-wider uppercase text-center"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                Fitness App
              </span>
            </div>

            {/* Nutrition App phone — slightly elevated */}
            <div
              className="flex flex-col items-center gap-3"
              style={{ flex: "0 0 auto", marginBottom: "2rem" }}
            >
              <div
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                style={{
                  width: "clamp(160px, 18vw, 220px)",
                  aspectRatio: "9/19",
                  border: "3px solid rgba(232,51,158,0.35)",
                  background: "#111",
                  boxShadow: "0 30px 80px rgba(122,30,126,0.30), 0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                {/* Notch */}
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full"
                  style={{ width: 60, height: 10, background: "#0A0A14" }}
                />
                <img
                  src={NUTRITION_APP_IMG}
                  alt="Nutrition Tracking App"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span
                className="text-xs font-bold tracking-wider uppercase text-center"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#B040C0" }}
              >
                Nutrition Tracker
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
