/* =============================================================================
   MaleHome.tsx — MedMethod Direct Men's Health Page
   Brand: Dark Navy #0A0F1E, Teal/Cyan #00E5FF, "ENTER YOUR PRIME."
   Mirrors all sections from women's Home.tsx adapted for TRT & men's health
   ============================================================================= */
import { useState } from "react";
import MaleConsultationModal from "@/components/male/MaleConsultationModal";
import MaleNavbar from "@/components/male/MaleNavbar";
import MaleHero from "@/components/male/MaleHero";
import MaleHowItWorks from "@/components/male/MaleHowItWorks";
import MaleDiagnosticSetup from "@/components/male/MaleDiagnosticSetup";
import MalePopularPrograms from "@/components/male/MalePopularPrograms";
import MaleServices from "@/components/male/MaleServices";
import MaleToolsForSuccess from "@/components/male/MaleToolsForSuccess";
import MaleWhyChoose from "@/components/male/MaleWhyChoose";
import MaleFAQ from "@/components/male/MaleFAQ";
import MaleFooter from "@/components/male/MaleFooter";
import MaleStickyMobileCTA from "@/components/male/MaleStickyMobileCTA";
import MaleMetabolicQuiz from "@/components/male/MaleMetabolicQuiz";

export default function MaleHome() {
  const [consultOpen, setConsultOpen] = useState(false);
  const openConsult = () => setConsultOpen(true);
  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif", background: "#F5F2EC" }}>
      <MaleNavbar onConsultClick={openConsult} />
      <MaleHero onConsultClick={openConsult} />
      <MaleHowItWorks onConsultClick={openConsult} />
      <MaleDiagnosticSetup onConsultClick={openConsult} />
      <MalePopularPrograms onConsultClick={openConsult} />
      <MaleServices />
      <MaleToolsForSuccess onConsultClick={openConsult} />
      <MaleWhyChoose onConsultClick={openConsult} />
      <MaleMetabolicQuiz onConsultClick={openConsult} />
      <MaleFAQ />
      <MaleFooter onConsultClick={openConsult} />
      <MaleStickyMobileCTA onConsultClick={openConsult} />
      <MaleConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
