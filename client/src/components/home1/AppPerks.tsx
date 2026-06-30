/* =============================================================================
   AppPerks.tsx — "Everything You Need. All in One App."
   4 individual cards: icon + numbered badge + title + description above phone image.
   Matches the reference design with individual phone mockup PNGs.
   Order: Custom Fitness Plan, Track Your Progress, Custom Nutrition Plan, Sync & Monitor Activity
   ============================================================================= */

import { Dumbbell, TrendingUp, Apple, Watch } from "lucide-react";

const PERKS = [
  {
    number: "01",
    title: "Custom Fitness Plan",
    description:
      "Personalized workouts built for your goals, fitness level, and schedule.",
    icon: Dumbbell,
    iconColor: "#7C3AED",
    iconBg: "#F3E8FF",
    image: "/manus-storage/phone-fitness_7ec5cfb5.png",
    alt: "App screen showing Today's Workout with Upper Body Strength exercises",
  },
  {
    number: "02",
    title: "Track Your Progress",
    description:
      "Monitor your workouts, results, and habits so you can see your progress and stay motivated.",
    icon: TrendingUp,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    image: "/manus-storage/phone-progress_7f660b82.png",
    alt: "App screen showing Progress with weight loss chart and body measurements",
  },
  {
    number: "03",
    title: "Custom Nutrition Plan",
    description:
      "Personalized meal plans and guidance to fuel your body, support your goals, and fit your lifestyle.",
    icon: Apple,
    iconColor: "#E11D48",
    iconBg: "#FFF1F2",
    image: "/manus-storage/phone-nutrition_e2ad6578.png",
    alt: "App screen showing Nutrition tracker with calories, macros, and meals",
  },
  {
    number: "04",
    title: "Sync & Monitor Activity",
    description:
      "Sync your smartwatch or preferred device to track steps, activity, and wellness in real time.",
    icon: Watch,
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    image: "/manus-storage/phone-activity_16180640.png",
    alt: "App screen showing Activity with steps, calories, distance, and connected Apple Watch",
  },
];

export default function AppPerks() {
  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
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
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Everything You Need. All in One App.
          </h2>
          <p
            className="mx-auto max-w-lg"
            style={{
              fontSize: 15,
              color: "#6B6B6B",
              lineHeight: 1.6,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Included exclusively for{" "}
            <span className="font-semibold" style={{ color: "#E8339E" }}>
              Transformation
            </span>{" "}
            &amp;{" "}
            <span className="font-semibold" style={{ color: "#E8339E" }}>
              Longevity
            </span>{" "}
            members.
          </p>
        </div>

        {/* ── 4-Card Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PERKS.map((perk) => (
            <div
              key={perk.number}
              className="flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-[#FAF8F5] p-5 pt-7 pb-4"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: perk.iconBg }}
              >
                <perk.icon
                  size={26}
                  strokeWidth={1.8}
                  style={{ color: perk.iconColor }}
                />
              </div>

              {/* Number Badge */}
              <span
                className="inline-block text-xs font-bold text-white rounded-full px-3 py-0.5 mb-2"
                style={{ backgroundColor: perk.iconColor }}
              >
                {perk.number}
              </span>

              {/* Title */}
              <h3
                className="font-bold mb-1"
                style={{
                  fontSize: 15,
                  color: "#1a1a1a",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {perk.title}
              </h3>

              {/* Divider */}
              <div
                className="w-8 h-0.5 rounded-full my-2"
                style={{ backgroundColor: perk.iconColor }}
              />

              {/* Description */}
              <p
                className="mb-4"
                style={{
                  fontSize: 13,
                  color: "#666",
                  lineHeight: 1.55,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {perk.description}
              </p>

              {/* Phone Image */}
              <div className="mt-auto w-full flex justify-center">
                <img
                  src={perk.image}
                  alt={perk.alt}
                  className="w-full max-w-[200px] h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Tagline ──────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mt-10 md:mt-12">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#F3E8FF" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#333",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <span className="font-bold">Your plan. Your progress. Your results.</span>{" "}
            <span style={{ color: "#666" }}>All in one app.</span>
          </p>
        </div>

        {/* ── Footer Note ─────────────────────────────────────────────── */}
        <p
          className="text-center mt-5"
          style={{
            fontSize: 12,
            color: "#999",
            letterSpacing: "0.02em",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Available through the MedMethod patient portal after enrollment.
        </p>
      </div>
    </section>
  );
}
