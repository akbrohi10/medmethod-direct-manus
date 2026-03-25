/* =============================================================================
   Services Section — Clinical Noir Design
   4x2 grid of service cards with images, hover gradient overlay
   ============================================================================= */
import { ArrowUpRight } from "lucide-react";

const HORMONES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/services-hormones-P3NtDhp9b98JPipRdSeAU4.webp";
const WEIGHT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/services-weight-PbFbZRNzPDC828PneJMun2.webp";
const LONGEVITY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/services-longevity-NdvZUD4WKX77SiKgRE4zts.webp";

const services = [
  {
    title: "HORMONE THERAPY",
    subtitle: "Optimize Your Levels",
    description: "Physician-guided testosterone and hormone optimization to restore energy, vitality, and performance.",
    image: HORMONES_IMG,
    tag: "Most Popular",
  },
  {
    title: "WEIGHT LOSS",
    subtitle: "Improve Metabolism",
    description: "Medically supervised GLP-1, Semaglutide, and Tirzepatide programs for sustainable fat loss.",
    image: WEIGHT_IMG,
    tag: "Best Results",
  },
  {
    title: "ANTI-AGING & LONGEVITY",
    subtitle: "Renew Vitality",
    description: "Cutting-edge protocols to slow aging, boost cellular health, and extend your healthspan.",
    image: LONGEVITY_IMG,
    tag: "Science-Based",
  },
  {
    title: "PEPTIDE THERAPY",
    subtitle: "Revitalize from Within",
    description: "Sermorelin, BPC-157, and other peptides for recovery, muscle, sleep, and overall wellness.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    tag: "Advanced Care",
  },
  {
    title: "SEXUAL WELLNESS",
    subtitle: "Enhance Confidence",
    description: "Discreet, effective treatments for ED and sexual performance — handled with clinical precision.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    tag: "Private & Discreet",
  },
  {
    title: "THYROID & METABOLIC",
    subtitle: "Balance Your System",
    description: "Comprehensive thyroid optimization and metabolic health protocols tailored to your biology.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80",
    tag: "Comprehensive",
  },
  {
    title: "VITAMIN & NUTRIENT IVs",
    subtitle: "Boost Performance",
    description: "B12, MIC lipotropic, and custom vitamin protocols to fuel energy, focus, and recovery.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    tag: "Fast Results",
  },
  {
    title: "ALL SERVICES",
    subtitle: "See All Options",
    description: "Explore our complete menu of premium, physician-guided treatments designed for your goals.",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
    tag: "View All",
    isAll: true,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="section-label block mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            What We Treat
          </span>
          <h2
            className="font-black text-[#111111] leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            PREMIUM HEALTH TREATMENTS
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MADE FOR EVERY GOAL
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {services.map((service, i) => (
            <a
              key={i}
              href="#consultation"
              className="group relative overflow-hidden rounded-xl bg-[#111111] cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E44 100%)" }}
              />

              {/* Tag */}
              <div className="absolute top-3 left-3">
                <span
                  className="px-2 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {service.tag}
                </span>
              </div>

              {/* Arrow */}
              <div className="absolute top-3 right-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                  style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="text-white font-black leading-tight mb-1"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="font-medium"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.7rem",
                    color: "#E8339E",
                    letterSpacing: "0.05em",
                  }}
                >
                  {service.subtitle}
                </p>
                <p
                  className="text-white/60 mt-2 leading-snug hidden lg:block"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
                >
                  {service.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
