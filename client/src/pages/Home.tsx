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
  const openConsult = () => setConsultOpen(true);

  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Navbar onConsultClick={openConsult} />
      <Hero onConsultClick={openConsult} />
      <HowItWorks onConsultClick={openConsult} />
      <DiagnosticSetup onConsultClick={openConsult} />
      <PopularPrograms onConsultClick={openConsult} />
      <Services />
      <Testimonials />
      <ToolsForSuccess onConsultClick={openConsult} />
      <WhyChoose onConsultClick={openConsult} />
      <MedicalTeam />
      <FAQ />
      <Blog />
      <Footer onConsultClick={openConsult} />
      <StickyMobileCTA onConsultClick={openConsult} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
