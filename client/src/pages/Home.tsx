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
import StatsAndDifference from "@/components/StatsAndDifference";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import Treatments from "@/components/Treatments";
import MedicalTeam from "@/components/MedicalTeam";
import FAQ from "@/components/FAQ";
import ConsultationCTA from "@/components/ConsultationCTA";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <StatsAndDifference />
      <WhyChoose />
      <Testimonials />
      <Treatments />
      <MedicalTeam />
      <FAQ />
      <ConsultationCTA />
      <Blog />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
