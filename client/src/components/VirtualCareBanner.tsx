/* =============================================================================
   Virtual Care Banner — MedMethod Direct
   Bold, unmissable section immediately communicating 100% Virtual Care
   Positioned right after the hero for instant visibility
   ============================================================================= */
import { Monitor, MapPin, Clock, Shield } from "lucide-react";

const perks = [
  { icon: Monitor, text: "No office visits, ever" },
  { icon: MapPin, text: "Available in all 50 states" },
  { icon: Clock, text: "Flexible scheduling" },
  { icon: Shield, text: "HIPAA-secure platform" },
];

export default function VirtualCareBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 py-6 lg:py-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Main Message */}
          <div className="flex items-center gap-4 text-center lg:text-left">
            {/* Icon */}
            <div
              className="hidden sm:flex items-center justify-center rounded-2xl shrink-0"
              style={{
                width: "56px",
                height: "56px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <div
                className="font-black text-white leading-tight"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                100% VIRTUAL CARE —{" "}
                <span style={{ opacity: 0.9 }}>FROM YOUR HOME.</span>
              </div>
              <p
                className="text-white/80 mt-1"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
                  fontWeight: 500,
                }}
              >
                Doctor-led care delivered entirely online. No waiting rooms, no commute, no hassle.
              </p>
            </div>
          </div>

          {/* Perks Row */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-3 shrink-0">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                  <span
                    className="text-white text-sm font-semibold tracking-wide whitespace-nowrap"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {perk.text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
