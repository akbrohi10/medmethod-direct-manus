/* =============================================================================
   Medical Team — Clinical Noir Design
   Dark background, photo grid with gradient overlays
   ============================================================================= */
const team = [
  {
    name: "Dr. Sarah Chen, MD",
    role: "Chief Medical Officer",
    specialty: "Endocrinology & Longevity",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Marcus Williams, DO",
    role: "Medical Director",
    specialty: "Hormone Optimization",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Jennifer Park, MD",
    role: "Lead Physician",
    specialty: "Metabolic Medicine",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Robert Torres, NP",
    role: "Nurse Practitioner",
    specialty: "Peptide Therapy",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Amanda Foster, MD",
    role: "Clinical Director",
    specialty: "Anti-Aging Medicine",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=533&fit=crop&q=80",
  },
  {
    name: "Dr. Kevin Zhao, DO",
    role: "Weight Loss Specialist",
    specialty: "Metabolic Health",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=533&fit=crop&q=80",
  },
];

export default function MedicalTeam() {
  return (
    <section id="about" className="bg-[#111111] py-16 lg:py-24">
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
              className="font-black text-white leading-tight"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              BUILT BY SPECIALISTS.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                BACKED BY EXPERTS.
              </span>
            </h2>
          </div>
          <a
            href="#consultation"
            className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider self-start lg:self-auto whitespace-nowrap"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            MEET OUR MEDICAL BOARD
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
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem" }}
                >
                  {member.name}
                </div>
                <div
                  className="font-medium"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem", color: "#E8339E" }}
                >
                  {member.role}
                </div>
                <div
                  className="text-white/50 mt-0.5"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.58rem" }}
                >
                  {member.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <p
          className="text-center text-white/40 mt-8 text-sm"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          All MedMethod Direct providers are board-certified, licensed, and continuously trained in the latest longevity and hormone optimization protocols.
        </p>
      </div>
    </section>
  );
}
