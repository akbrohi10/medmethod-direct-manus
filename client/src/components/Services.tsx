/* =============================================================================
   Services Section — MedMethod Direct
   Clinical Noir Design | Women 40+ focused treatment cards
   ============================================================================= */
import { ArrowRight } from "lucide-react";

const DOCTOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/doctor-consult-65ULkU9ZVxvNFPTLGJr9pR.webp";
const WELLNESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/wellness-lifestyle-YCpwBngCUYcucrbE4264Vc.webp";
const LAB_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/lab-science-6GpH4mKSeYPTWQ2PZcbKLe.webp";

const services = [
  {
    badge: "MOST POPULAR",
    category: "HORMONE THERAPY",
    title: "Balance Your Hormones",
    body: "Physician-guided hormone optimization to relieve night sweats, brain fog, mood swings, and fatigue. Personalized protocols for perimenopause, menopause, and beyond.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
  },
  {
    badge: "BEST RESULTS",
    category: "WEIGHT LOSS",
    title: "Lose the Hormonal Belly",
    body: "Medically supervised GLP-1 programs (Semaglutide, Tirzepatide) combined with personalized nutrition and fitness plans. Finally beat the weight that willpower alone can't fix.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    badge: "SCIENCE-BASED",
    category: "LONGEVITY",
    title: "Renew Your Vitality",
    body: "Cutting-edge protocols to slow aging, boost cellular health, and extend your healthspan. NAD+, peptide therapy, and anti-aging interventions backed by the latest research.",
    image: WELLNESS_IMG,
  },
  {
    badge: "ADVANCED CARE",
    category: "COMPREHENSIVE LABS",
    title: "Deep-Dive Diagnostics",
    body: "We start with comprehensive lab work — not guesswork. Full hormone panels, metabolic markers, thyroid, and more to build a complete picture of your biology.",
    image: LAB_IMG,
  },
  {
    badge: "PERSONALIZED",
    category: "NUTRITION & FITNESS",
    title: "Custom Plans Built for You",
    body: "Your dedicated Wellness Advisor creates a personalized nutrition program and custom fitness plan using our latest tools — giving you the accountability to actually achieve your goals.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
  },
  {
    badge: "ONGOING SUPPORT",
    category: "BI-WEEKLY CHECK-INS",
    title: "Your Doctor, Every 2 Weeks",
    body: "We meet with you virtually every two weeks — weigh-in, progress tracking, and personalized recommendations. You'll work with the same doctor and Wellness Advisor throughout your entire journey.",
    image: DOCTOR_IMG,
  },
  {
    badge: "CLINICAL",
    category: "THYROID & METABOLIC",
    title: "Balance Your System",
    body: "Comprehensive thyroid optimization and metabolic health protocols tailored to your unique biology. Addressing the root causes of fatigue, weight gain, and hormonal imbalance.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  },
  {
    badge: "VIEW ALL",
    category: "ALL SERVICES",
    title: "See All Options",
    body: "Explore our complete menu of premium, physician-guided treatments designed for women who refuse to accept that feeling this way is just 'part of aging.'",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
    isViewAll: true,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
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
            MADE FOR EVERY WOMAN
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {services.map((service, i) => (
            <a
              key={i}
              href={service.isViewAll ? "#consultation" : "#consultation"}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />

              {/* Hover gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E66 100%)" }}
              />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    background: service.isViewAll
                      ? "rgba(255,255,255,0.2)"
                      : "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    fontFamily: "Montserrat, sans-serif",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {service.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div
                  className="font-bold mb-1"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.6rem",
                    color: "#E8339E",
                    letterSpacing: "0.12em",
                  }}
                >
                  {service.category}
                </div>
                <h3
                  className="text-white font-black leading-tight mb-2"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.9rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-white/70 leading-snug mb-3 hidden md:block"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
                >
                  {service.body}
                </p>
                <div
                  className="flex items-center gap-1.5 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                >
                  Get Started
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
