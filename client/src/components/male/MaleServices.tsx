/* MaleServices.tsx — Men's Health Services Grid — 4 per row on desktop */
const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";

const services = [
  {
    title: "TRT / Testosterone",
    description: "Clinically optimized testosterone replacement therapy — injections, creams, or pellets tailored to your levels and lifestyle.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-service-trt-vial-HNyhJa9yVZkXc86NGZv55p.webp",
    alt: "Testosterone Cypionate medical vial",
  },
  {
    title: "GLP-1 Weight Loss",
    description: "Medically supervised Semaglutide & Tirzepatide programs with bi-weekly check-ins and expert support.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-service-fit-shirt-oM2mnVoPDL933mShNpPZvY.webp",
    alt: "Fit confident man buttoning white dress shirt — restored vitality",
  },
  {
    title: "Longevity & Healthy Aging",
    description: "Advanced diagnostics and precision medicine to keep you strong, sharp, and performing at your peak for decades.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-service-longevity-aCr8S9DtmWXwhAjFi5v2Fv.webp",
    alt: "Fit man over 45 at sunrise — reclaim your prime",
  },
  {
    title: "Sexual Health & ED",
    description: "Proven treatments for erectile dysfunction, libido restoration, and peak sexual performance.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-service-ed-defeated-2ZKX3c65nKAhXDAoKobH69.webp",
    alt: "Man lying in bed exhausted and defeated — low testosterone, ED",
  },
  {
    title: "Peptide Therapy",
    description: "BPC-157, TB-500, CJC-1295, Ipamorelin — cutting-edge peptides for recovery, muscle, and longevity.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&fit=crop",
    alt: "Medical vials and peptides",
  },
  {
    title: "Hair Restoration",
    description: "Finasteride, minoxidil, and peptide-based protocols to stop hair loss and regrow thicker hair.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&fit=crop",
    alt: "Man with healthy hair",
  },
  {
    title: "Thyroid & Metabolic",
    description: "Comprehensive thyroid optimization and metabolic testing to restore energy, focus, and fat-burning.",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80&fit=crop",
    alt: "Doctor reviewing lab results",
  },
  {
    title: "Gut Health & Nutrition",
    description: "Personalized nutrition and synbiotic programs formulated for men's metabolic health and performance.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop",
    alt: "Healthy nutrition",
  },
  {
    title: "Personal Training",
    description: "Partner program with Send Me a Trainer — certified trainers delivered to your home or gym.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop",
    alt: "Personal trainer with client",
    badge: "40% OFF FOR PATIENTS",
    partner: true,
  },
];

export default function MaleServices() {
  return (
    <section id="services" className="py-14 px-4" style={{ background: "#0A0F1E", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>TREATMENTS</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            MEN'S HEALTH SERVICES
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto", fontSize: "0.9rem" }}>
            Every service is physician-supervised, evidence-based, and delivered virtually to your door.
          </p>
        </div>

        {/* 4-per-row on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc) => (
            <div key={svc.title} className="rounded-2xl overflow-hidden flex flex-col group transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,194,203,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,194,203,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,194,203,0.12)")}>
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <img src={svc.image} alt={svc.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,15,30,0.85) 100%)" }} />
                {svc.badge && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-extrabold tracking-wider text-white" style={{ background: TEAL_GRADIENT }}>
                    {svc.badge}
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-black text-white text-sm mb-1.5">{svc.title}</h3>
                <p className="text-xs flex-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{svc.description}</p>
                <a href="#consultation" className="mt-3 text-xs font-bold tracking-wider transition-colors" style={{ color: TEAL }}>
                  LEARN MORE →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
