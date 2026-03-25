/* =============================================================================
   Services.tsx — Key Services section
   Design: Clean 3-column grid, large photo top, service name, short desc, CTA
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

const services = [
  {
    title: "Menopause",
    description: "Safe, effective, FDA-approved solutions for symptom relief — night sweats, brain fog, mood swings, and more.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop",
    alt: "Confident woman in her 40s smiling",
    href: "#consultation",
  },
  {
    title: "GLP-1 Weight Care",
    description: "Medically supervised Semaglutide and Tirzepatide programs with bi-weekly check-ins and expert support.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop",
    alt: "Woman stretching and feeling energetic",
    href: "#consultation",
  },
  {
    title: "Sexual Health",
    description: "Treatments for better vaginal health, libido restoration, and a more fulfilling sex life.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80&fit=crop",
    alt: "Woman relaxing comfortably",
    href: "#consultation",
  },
  {
    title: "Hormone Optimization",
    description: "Comprehensive hormone testing and personalized HRT plans tailored to your unique biology.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    alt: "Doctor consulting with patient",
    href: "#consultation",
  },
  {
    title: "Hair Care",
    description: "Clinically proven treatments for hair thinning and loss — fuller, thicker hair in months.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop",
    alt: "Woman with healthy flowing hair",
    href: "#consultation",
  },
  {
    title: "Gut Health",
    description: "Personalized nutrition and synbiotic programs formulated specifically for women in midlife.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop",
    alt: "Healthy nutrition and gut health",
    href: "#consultation",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 lg:py-20">
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
            KEY SERVICES
          </h2>
          <p
            className="mt-3 text-gray-500 text-base"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Holistic, doctor-led solutions at every stage of your journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="flex flex-col">
              {/* Photo */}
              <div className="rounded-xl overflow-hidden mb-4" style={{ aspectRatio: "4/3" }}>
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3
                className="font-bold text-[#111111] text-xl mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                className="text-gray-500 text-sm leading-relaxed mb-4 flex-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {service.description}
              </p>

              {/* CTA Button */}
              <a
                href={service.href}
                className="block text-center py-3 px-6 rounded-full border-2 text-sm font-bold tracking-wider transition-all duration-200 hover:text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  borderColor: "#E8339E",
                  color: "#E8339E",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8339E";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#E8339E";
                }}
              >
                START NOW
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
