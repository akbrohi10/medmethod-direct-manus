/* =============================================================================
   Services.tsx — Key Services Section
   Style: Clinical Noir — light surface (#F4F4F8) sits between dark Testimonials
   and white FAQ. 4-column responsive grid. Photo card + name + desc + outline CTA.
   Each "START NOW" pre-fills the discovery-call modal with the service name.
   ============================================================================= */

const services = [
  {
    title: "Menopause",
    description: "Safe, effective, physician-prescribed solutions for symptom relief — night sweats, brain fog, mood swings, and more…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-menopause-HYnWSNUNbueATEj9EFMHvU.webp",
    alt: "Confident woman in her 40s smiling by a window",
  },
  {
    title: "GLP-1 Weight Care",
    description: "FDA-approved or 503B-compounded Semaglutide & Tirzepatide programs with bi-weekly check-ins and expert support…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-weight-dQbnaFgp7jCDrEp4DMNUvC.webp",
    alt: "Fit woman in athletic wear outdoors in golden light",
  },
  {
    title: "Sexual Health",
    description: "Physician-guided treatments for vaginal health, libido restoration, and a more fulfilling sex life…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-sexual-health-FtCRG5hkhWok6PsHUn3T3Z.webp",
    alt: "Woman resting peacefully in white bed linens",
  },
  {
    title: "Hormone Optimization",
    description: "Comprehensive hormone testing and personalized HRT plans tailored to your unique biology…",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    alt: "Doctor consulting with patient",
  },
  {
    title: "Hair Care",
    description: "Medically supervised treatments for hair thinning and loss — fuller, thicker results in months…",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop",
    alt: "Woman with healthy flowing hair",
  },
  {
    title: "Gut Health",
    description: "Personalized nutrition and synbiotic programs formulated specifically for women in midlife…",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop",
    alt: "Healthy nutrition and gut health",
  },
  {
    title: "Longevity & Healthy Aging",
    description: "Advanced diagnostics and precision medicine to keep you strong, energetic, and mentally sharp for years ahead…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-longevity-7Bx5nrzEiFaTG3M5kYTgbL.webp",
    alt: "Active woman cycling outdoors in golden light",
  },
  {
    title: "Virtual Primary Care",
    description: "Preventive care from your own board-certified physician — annual labs, acute visits, and direct doctor access, all virtual…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/service-virtual-care-bT8MJnTPigpptvKDzcLPpq.webp",
    alt: "Doctor conducting a warm virtual consultation on laptop",
  },
  {
    title: "Eyelash Serum",
    description: "Clinically formulated lash growth serums for longer, fuller, darker lashes — physician-prescribed and delivered to your door…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/eyelash-serum-9PtRPdxFFSw83CquvUTUpN.webp",
    alt: "Close-up of woman's eye with long healthy lashes applying serum with a brush",
  },
  {
    title: "Skincare",
    description: "Medical-grade skincare protocols targeting fine lines, hyperpigmentation, and texture — smooth, firm, and radiant at any age…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/7BkSbbvZQW7t_2977f444.jpg",
    alt: "Woman with radiant glowing skin touching her face",
  },
  {
    title: "Vitamins & Supplements",
    description: "Physician-curated supplement protocols designed for women in midlife — targeted nutrition to fill the gaps your diet misses…",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/vitamins-supplements-premium-EN85Gh6fY5ag6GR8x3Fa68.webp",
    alt: "Premium supplement capsules and softgels on warm natural wood surface with botanicals",
  },
  {
    title: "Personal Training",
    description: "In-home & virtual personal training programs built for women 40+ — strength, mobility, and metabolic health on your schedule…",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop",
    alt: "Woman doing strength training with a personal trainer",
    partnerLogo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/smat-logo-crisp_9d1fd1b1.png",
    ribbon: "40% OFF FOR PATIENTS",
  },
] as const;

interface Props {
  onConsultClick: (service?: string) => void;
}

export default function Services({ onConsultClick }: Props) {
  return (
    <section id="services" className="py-16 lg:py-20" style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="font-black text-[#111111] leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            KEY SERVICES
          </h2>
          <p className="mt-3 text-gray-600 text-base">
            Holistic, doctor-led solutions at every stage of your journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div key={i} className="flex flex-col">
              {/* Photo */}
              <div className="rounded-xl overflow-hidden mb-4 relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                {/* Discount ribbon — bottom-left */}
                {(service as any).ribbon && (
                  <div
                    className="absolute bottom-2 left-2"
                    style={{
                      background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: 6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(service as any).ribbon}
                  </div>
                )}
                {/* Partner logo — top-right */}
                {(service as any).partnerLogo && (
                  <div
                    className="absolute top-2 right-2"
                    style={{
                      background: "#ffffff",
                      borderRadius: 6,
                      padding: "4px 8px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={(service as any).partnerLogo}
                      alt="Send Me a Trainer"
                      style={{ height: 22, width: "auto", display: "block", maxWidth: 110 }}
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-[#111111] text-xl mb-2">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                {service.description}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => onConsultClick(service.title)}
                className="block w-full text-center py-3 px-6 rounded-full border-2 text-sm font-bold tracking-wider transition-all duration-200"
                style={{
                  borderColor: "#E8339E",
                  color: "#E8339E",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8339E";
                  (e.currentTarget as HTMLButtonElement).style.color = "#E8339E";
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
