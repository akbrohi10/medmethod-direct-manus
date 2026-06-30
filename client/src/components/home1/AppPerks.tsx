/* =============================================================================
   AppPerks.tsx — "Everything You Need. All in One App."
   Showcases the 4 app perks exclusive to Transformation & Longevity members.
   Positioned ABOVE the PopularPrograms pricing section.
   Brand: Montserrat, #E8339E (pink), #7A1E7E (deep purple)
   ============================================================================= */

import { Dumbbell, TrendingUp, Apple, Watch } from "lucide-react";

const PINK = "#E8339E";
const GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";

interface Perk {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const perks: Perk[] = [
  {
    number: "01",
    icon: Dumbbell,
    title: "Custom Fitness Plan",
    description:
      "A personalized exercise protocol designed around your health profile, mobility, and goals.",
  },
  {
    number: "02",
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Monitor labs, body composition, and milestones in real time — all in one dashboard.",
  },
  {
    number: "03",
    icon: Apple,
    title: "Custom Nutrition Plan",
    description:
      "Macro-optimized meal guidance built by your care team to complement your protocol.",
  },
  {
    number: "04",
    icon: Watch,
    title: "Sync & Monitor Activity",
    description:
      "Connect your wearable to track steps, sleep, and heart rate — visible to your physician.",
  },
];

export default function AppPerks() {
  return (
    <section
      className="py-14 md:py-18 lg:py-22 px-4"
      style={{ background: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="font-extrabold mb-3"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.25rem)",
              color: "#111",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            Everything You Need. All in One App.
          </h2>
          <p
            className="mx-auto max-w-lg"
            style={{ fontSize: 15, color: "#6B6B6B", lineHeight: 1.6 }}
          >
            Included exclusively for{" "}
            <span className="font-semibold" style={{ color: PINK }}>
              Transformation
            </span>{" "}
            &amp;{" "}
            <span className="font-semibold" style={{ color: PINK }}>
              Longevity
            </span>{" "}
            members.
          </p>
        </div>

        {/* ── Perks Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.number}
                className="relative rounded-2xl p-6 lg:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #EEEEEE",
                }}
              >
                {/* Number badge */}
                <span
                  className="inline-block text-xs font-bold tracking-widest mb-4 opacity-40"
                  style={{ color: "#111" }}
                >
                  {perk.number}
                </span>

                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: GRADIENT }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3
                  className="font-bold mb-2"
                  style={{ fontSize: "1rem", color: "#111", lineHeight: 1.3 }}
                >
                  {perk.title}
                </h3>

                {/* Description */}
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "0.82rem", color: "#666" }}
                >
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Subtle bottom note ─────────────────────────────────────── */}
        <p
          className="text-center mt-8 md:mt-10"
          style={{ fontSize: 12, color: "#999", letterSpacing: "0.02em" }}
        >
          Available through the MedMethod patient portal after enrollment.
        </p>
      </div>
    </section>
  );
}
