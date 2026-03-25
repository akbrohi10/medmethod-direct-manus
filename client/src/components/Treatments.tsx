/* =============================================================================
   Treatments Carousel — Clinical Noir Design
   Scrollable treatment cards on white background
   ============================================================================= */
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const treatments = [
  {
    tags: ["Hormone Balance", "Best Seller"],
    title: "Testosterone Replacement Therapy",
    body: "Physician-guided testosterone optimization to restore energy, libido, muscle mass, and overall vitality. Delivered via injections, topicals, or pellets based on your preference.",
  },
  {
    tags: ["Weight Loss", "GLP-1"],
    title: "Semaglutide (Ozempic/Wegovy)",
    body: "FDA-approved GLP-1 medication that reduces appetite, curbs cravings, and supports steady, sustainable weight loss. Integrated into a personalized weight management program.",
  },
  {
    tags: ["Weight Loss", "Dual-Action"],
    title: "Tirzepatide (Mounjaro)",
    body: "Dual-action metabolic therapy that improves insulin sensitivity, reduces appetite, and enhances satiety for superior weight loss results compared to single-agent GLP-1s.",
  },
  {
    tags: ["Recovery", "Vitality"],
    title: "Sermorelin Peptide Therapy",
    body: "Stimulates your body's natural growth hormone production, supporting lean muscle, enhanced recovery, improved sleep quality, and greater vitality.",
  },
  {
    tags: ["Fertility", "Natural"],
    title: "Clomid / Enclomiphene",
    body: "Stimulates your body's hormonal response to naturally boost testosterone and support fertility — ideal for men who want hormone balance without traditional TRT.",
  },
  {
    tags: ["Energy", "Metabolism"],
    title: "Vitamin B12 & MIC Injections",
    body: "Potent B12 and lipotropic injections to boost energy, improve focus, support fat metabolism, and enhance overall metabolic health.",
  },
  {
    tags: ["Anti-Aging", "Cellular"],
    title: "NAD+ Therapy",
    body: "Cutting-edge cellular energy therapy that supports mitochondrial function, cognitive clarity, and longevity at the cellular level.",
  },
  {
    tags: ["Sexual Wellness", "Non-Invasive"],
    title: "ED Treatment Protocol",
    body: "Comprehensive erectile dysfunction treatment including PDE5 inhibitors, shockwave therapy, and peptide protocols for lasting results.",
  },
];

export default function Treatments() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Our Protocols
            </span>
            <h2
              className="font-black text-[#111111] leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              FIND THE RIGHT
              <br />
              TREATMENT
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#E8339E] hover:text-[#E8339E] transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#E8339E] hover:text-[#E8339E] transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {treatments.map((t, i) => (
            <div
              key={i}
              className="flex-none w-72 lg:w-80 bg-[#f8f8f8] rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-[#E8339E]/20"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {t.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      background: j === 0
                        ? "linear-gradient(135deg, #E8339E22 0%, #7A1E7E33 100%)"
                        : "rgba(0,0,0,0.06)",
                      color: j === 0 ? "#E8339E" : "#666",
                      fontFamily: "Montserrat, sans-serif",
                      border: j === 0 ? "1px solid rgba(232,51,158,0.3)" : "1px solid transparent",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3
                className="text-[#111111] font-black mb-3 leading-tight"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {t.title}
              </h3>

              {/* Gradient rule */}
              <div
                className="h-0.5 w-8 mb-4"
                style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
              />

              {/* Body */}
              <p
                className="text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem" }}
              >
                {t.body}
              </p>

              {/* CTA */}
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <a
            href="#consultation"
            className="btn-gradient px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            EXPLORE ALL TREATMENTS
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
