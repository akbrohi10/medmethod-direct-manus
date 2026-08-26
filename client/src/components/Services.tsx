/* =============================================================================
   Services.tsx — approved service categories used by location pages
   ============================================================================= */

const services = [
  {
    title: "Medical weight management (GLP-1)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-weight-dQbnaFgp7jCDrEp4DMNUvC.webp",
    alt: "Woman outdoors",
    href: "#consultation",
  },
  {
    title: "Hormone therapy for women",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    alt: "Doctor consulting with patient",
    href: "#consultation",
  },
  {
    title: "Nutrition and vitamin optimization",
    image: "/manus-storage/vitamins-supplements-v3_09616af9.png",
    alt: "Supplement bottles",
    href: "#consultation",
  },
  {
    title: "Dermatology and skin",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/7BkSbbvZQW7t_2977f444.jpg",
    alt: "Skincare",
    href: "#consultation",
  },
  {
    title: "Hair restoration",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop",
    alt: "Hair care",
    href: "#consultation",
  },
];

interface Props {
  onConsultClick?: (service?: string) => void;
}

export default function Services({ onConsultClick }: Props) {
  return (
    <section id="services" className="py-16 lg:py-20" style={{ background: "#F4F4F8" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <div key={service.title} className="flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <h3
                className="font-bold text-[#111111] text-xl mb-4 flex-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {service.title}
              </h3>

              <button
                onClick={() => onConsultClick?.(service.title)}
                className="block w-full text-center py-3 px-6 rounded-full border-2 text-sm font-bold tracking-wider transition-all duration-200 hover:text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  borderColor: "#E8339E",
                  color: "#E8339E",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
                  event.currentTarget.style.borderColor = "transparent";
                  event.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.borderColor = "#E8339E";
                  event.currentTarget.style.color = "#E8339E";
                }}
              >
                START NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
