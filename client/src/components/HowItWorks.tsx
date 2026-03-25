/* =============================================================================
   HowItWorks.tsx — Process steps section
   Design: 4-column step cards, clean minimal layout with brand accent step labels
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

const steps = [
  {
    step: "Step 1",
    title: "Schedule Your Free Consultation",
    description:
      "Book a complimentary virtual consultation with our care team. We'll listen to your symptoms, health history, and goals to determine the right path forward.",
  },
  {
    step: "Step 2",
    title: "Complete Comprehensive Labs",
    description:
      "We order advanced lab testing that analyzes key biomarkers — hormones, thyroid, metabolic panel, and more — to uncover hidden imbalances guiding your care.",
  },
  {
    step: "Step 3",
    title: "Receive Your Personalized Plan",
    description:
      "Your dedicated physician reviews your results and builds a fully customized treatment plan with targeted therapies, nutrition, and lifestyle strategies.",
  },
  {
    step: "Step 4",
    title: "Bi-Weekly Check-Ins & Optimization",
    description:
      "We meet virtually every two weeks to track your progress, adjust your plan, and provide ongoing support from the same doctor and Wellness Advisor throughout.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAFAFA] py-16 lg:py-20">
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
            HOW IT WORKS
          </h2>
          <p
            className="mt-3 text-gray-500 text-base max-w-xl mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            A responsible, doctor-led path — from your first consultation to lasting results
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
            >
              {/* Step label */}
              <span
                className="inline-block self-start text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, rgba(232,51,158,0.12) 0%, rgba(122,30,126,0.12) 100%)",
                  color: "#E8339E",
                  letterSpacing: "0.04em",
                }}
              >
                {item.step}
              </span>

              {/* Title */}
              <h3
                className="font-bold text-[#111111] text-lg leading-snug"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.description}
              </p>
            </div>
          ))}
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
