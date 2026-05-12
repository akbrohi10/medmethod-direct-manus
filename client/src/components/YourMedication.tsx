/*
 * YourMedication.tsx
 * Design: Clean white section with two medication cards side by side.
 * Each card shows the branded vial, medication name, key details, and an "In Stock" badge.
 * Placed below the Popular Programs pricing section.
 */

import { useState } from "react";
import { Check, Package, Shield, Truck } from "lucide-react";

const SEMAGLUTIDE_VIAL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/slimmethod-vial-cropped_c84475b1.png";
const TIRZEPATIDE_VIAL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/accelerate-vial-cropped_56761b54.png";

const medications = [
  {
    name: "Semaglutide + B12",
    program: "SlimMethod",
    vial: SEMAGLUTIDE_VIAL,
    details: [
      "Compounded GLP-1 receptor agonist",
      "Vitamin B12 for energy support",
      "Personalized dosing plan",
      "2mL multi-dose vial",
    ],
    badge: "In Stock",
    accent: "#E8339E",
  },
  {
    name: "Tirzepatide + Niacinamide",
    program: "AccelerateMethod",
    vial: TIRZEPATIDE_VIAL,
    details: [
      "Dual GIP/GLP-1 receptor agonist",
      "Niacinamide for metabolic support",
      "Personalized dosing plan",
      "2mL multi-dose vial",
    ],
    badge: "In Stock",
    accent: "#7A1E7E",
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: "Licensed 503B Pharmacy",
    desc: "Compounded in a PCAB-accredited, FDA-registered facility",
  },
  {
    icon: Truck,
    title: "Shipped Monthly to Your Door",
    desc: "Cold-packed and delivered — no pharmacy visits",
  },
  {
    icon: Package,
    title: "Dose Changes. Price Doesn't.",
    desc: "Your dose adjusts as you progress — your cost stays the same",
  },
];

export default function YourMedication() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="medication"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Subtle top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #E8339E33, #7A1E7E33, transparent)",
        }}
      />

      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: "#E8339E" }}
          >
            Your Medication
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: "#111", fontFamily: "'Playfair Display', serif" }}
          >
            Prescribed by Your Doctor.{" "}
            <span style={{ color: "#E8339E" }}>Shipped to Your Door.</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#666" }}>
            Every vial is compounded specifically for you — based on your labs,
            your body, and your physician's clinical judgment. Not a
            one-size-fits-all dose.
          </p>
        </div>

        {/* Medication Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {medications.map((med, idx) => (
            <div
              key={med.name}
              className="relative rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "#fff",
                border: `1.5px solid ${hoveredIdx === idx ? med.accent + "44" : "#E5E5E5"}`,
                boxShadow:
                  hoveredIdx === idx
                    ? `0 12px 40px ${med.accent}15`
                    : "0 2px 12px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex flex-col sm:flex-row items-center p-6 md:p-8 gap-6">
                {/* Vial Image */}
                <div className="flex-shrink-0 w-[120px] md:w-[150px]">
                  <img
                    src={med.vial}
                    alt={`${med.name} vial`}
                    className="w-full h-auto drop-shadow-lg transition-transform duration-300"
                    style={{
                      transform: hoveredIdx === idx ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  {/* In Stock badge */}
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3"
                    style={{
                      background: "#E6F9F0",
                      color: "#0D8050",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#0D8050" }}
                    />
                    {med.badge}
                  </span>

                  <h3
                    className="text-xl md:text-2xl font-extrabold mb-1"
                    style={{ color: "#111" }}
                  >
                    {med.name}
                  </h3>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ color: med.accent }}
                  >
                    Included in {med.program}
                  </p>

                  <ul className="space-y-2">
                    {med.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "#444" }}
                      >
                        <Check
                          size={15}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: med.accent }}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <p
                    className="mt-4 text-[11px] font-medium"
                    style={{ color: "#999" }}
                  >
                    Rx Only — prescribed by your MedMethod physician
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex items-start gap-4 p-5 rounded-xl"
              style={{ background: "#fff", border: "1px solid #EBEBEB" }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #E8339E15, #7A1E7E15)",
                }}
              >
                <point.icon size={18} style={{ color: "#E8339E" }} />
              </div>
              <div>
                <p
                  className="text-sm font-bold mb-1"
                  style={{ color: "#111" }}
                >
                  {point.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#777" }}>
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
