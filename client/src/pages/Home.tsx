/* =============================================================================
   Home Page — MedMethod Direct
   Clinical Noir Design: Precision in Darkness
   Sections: Navbar, Hero, Services, Stats+Difference, HowItWorks,
             WhyChoose, Testimonials, Treatments, MedicalTeam, FAQ,
             ConsultationCTA, Blog, Footer
   ============================================================================= */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import ToolsForSuccess from "@/components/ToolsForSuccess";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import Treatments from "@/components/Treatments";
import MedicalTeam from "@/components/MedicalTeam";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <DiagnosticSetup />
      <PopularPrograms />
      <Services />
      <ToolsForSuccess />
      <WhyChoose />
      <Testimonials />
      <Treatments />
      <MedicalTeam />
      <FAQ />
      <Blog />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
