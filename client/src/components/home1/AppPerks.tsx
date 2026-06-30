/* =============================================================================
   AppPerks.tsx — "Everything You Need. All in One App."
   Showcases the 4 app perks exclusive to Transformation & Longevity members.
   Uses the provided phone-mockup image to match the reference design.
   Positioned ABOVE the PopularPrograms pricing section.
   Brand: Montserrat, #E8339E (pink), #7A1E7E (deep purple)
   ============================================================================= */

const APP_PERKS_IMAGE = "/manus-storage/app-perks-phones_b95b2c8c.png";

export default function AppPerks() {
  return (
    <section
      className="py-14 md:py-18 lg:py-22 px-4"
      style={{ background: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8 md:mb-12">
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

        {/* ── Full-width image showing the 4 app screens ─────────────── */}
        <div className="w-full">
          <img
            src={APP_PERKS_IMAGE}
            alt="App features: Custom Fitness Plan, Track Your Progress, Custom Nutrition Plan, and Sync & Monitor Activity — shown on phone mockups"
            className="w-full h-auto rounded-2xl"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ── Subtle bottom note ─────────────────────────────────────── */}
        <p
          className="text-center mt-6 md:mt-8"
          style={{ fontSize: 12, color: "#999", letterSpacing: "0.02em" }}
        >
          Available through the MedMethod patient portal after enrollment.
        </p>
      </div>
    </section>
  );
}
