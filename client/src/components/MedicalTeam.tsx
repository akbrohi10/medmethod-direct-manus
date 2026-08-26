/* =============================================================================
   Medical Team — Clinical Noir Design
   Dark background, photo grid with gradient overlays
   ============================================================================= */
const DOCTOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/doctor-consult-65ULkU9ZVxvNFPTLGJr9pR.webp";

const team = [
  {
    name: "Dr. Amanda Chen, MD",
    role: "Medical Director",
    specialty: "Hormone &",
    image: DOCTOR_IMG,
  },
  {
    name: "Dr. Sarah Williams, DO",
    role: "Lead Physician",
    specialty: "Women's Hormonal Health",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Rachel Torres, MD",
    role: "Metabolic Specialist",
    specialty: "Medical Weight Loss",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Lisa Park, MD",
    role: "Longevity Physician",
    specialty: "Anti-Aging & Cellular Health",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Monica Foster, NP",
    role: "Nurse Practitioner",
    specialty: "Perimenopause Specialist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Jennifer Zhao, DO",
    role: "Wellness Physician",
    specialty: "Nutrition and Vitamin Optimization",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=533&fit=crop&q=80",
  },
];

export default function MedicalTeam() {
  return (
    <section id="about" className="py-16 lg:py-24" style={{ background: "#F4F4F8" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <div>
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Our Experts
            </span>
            <h2
              className="font-black text-[#111111] leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              BOARD-CERTIFIED DOCTORS
              <br />
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                WHO SPECIALIZE IN YOU.
              </span>
            </h2>
          </div>
          <a
            href="#consultation"
            className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider self-start lg:self-auto whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            MEET YOUR CARE TEAM
          </a>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {team.map((member, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Photo */}
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E44 100%)" }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div
                  className="text-white font-bold leading-tight mb-0.5"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(0.65rem, 1.8vw, 0.75rem)" }}
                >
                  {member.name}
                </div>
                <div
                  className="font-medium"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(0.58rem, 1.5vw, 0.65rem)", color: "#E8339E" }}
                >
                  {member.role}
                </div>
                <div
                  className="text-white/50 mt-0.5 hidden sm:block"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.58rem" }}
                >
                  {member.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        
      </div>
    </section>
  );
}
