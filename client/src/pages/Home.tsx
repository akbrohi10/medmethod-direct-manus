/* =============================================================================
   Home Page — MedMethod Direct
   Clinical Noir Design: Precision in Darkness
   Sections: Navbar, Hero, Services, Stats+Difference, HowItWorks,
             WhyChoose, Testimonials, Treatments, MedicalTeam, FAQ,
             ConsultationCTA, Blog, Footer
   ============================================================================= */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ConsultationModal from "@/components/ConsultationModal";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import ToolsForSuccess from "@/components/ToolsForSuccess";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import MedicalTeam from "@/components/MedicalTeam";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";

export default function Home() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const openConsult = (service?: string) => {
    setPreselectedService(service);
    setConsultOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Navbar onConsultClick={() => openConsult()} />
      <Hero onConsultClick={() => openConsult()} />
      <HowItWorks onConsultClick={() => openConsult()} />
      <DiagnosticSetup onConsultClick={() => openConsult()} />
      <PopularPrograms onConsultClick={() => openConsult()} />
      <Services onConsultClick={openConsult} />
      <Testimonials />
      <ToolsForSuccess onConsultClick={() => openConsult()} />
      <WhyChoose onConsultClick={() => openConsult()} />
      <MedicalTeam />
      <FAQ />
      <Blog />

      {/* ── LICENSED STATES BAND ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#0D0D1A",
          borderTop: "1px solid rgba(232,51,158,0.15)",
          borderBottom: "1px solid rgba(232,51,158,0.15)",
          padding: "36px 24px",
        }}
      >
        <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-5">
          <span
            className="text-xs font-extrabold tracking-[0.22em] uppercase"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Now Accepting Patients In
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Virginia", href: "/virginia" },
              { label: "Florida", href: "/florida" },
              { label: "Maryland", href: "/maryland" },
              { label: "Washington DC", href: "/washington-dc" },
              { label: "Colorado", href: "/colorado" },
              { label: "Arizona", href: "/arizona" },
              { label: "North Carolina", href: "/north-carolina" },
              { label: "Pennsylvania", href: "/pennsylvania" },
            ].map((state) => (
              <a
                key={state.label}
                href={state.href}
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border transition-all hover:border-pink-400 hover:text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "rgba(255,255,255,0.55)",
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {state.label}
              </a>
            ))}
          </div>
          <p
            className="text-xs text-center"
            style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.25)", maxWidth: "480px", lineHeight: 1.6 }}
          >
            100% virtual care — no commute, no waiting room. Licensed physicians available this week.
          </p>
        </div>
      </div>

      <Footer onConsultClick={() => openConsult()} />
      <StickyMobileCTA onConsultClick={() => openConsult()} />
      <ConsultationModal
        open={consultOpen}
        onClose={() => { setConsultOpen(false); setPreselectedService(undefined); }}
        preselectedService={preselectedService}
      />
    </div>
  );
}
