/* =============================================================================
   Home Page — MedMethod Direct
   Clinical Noir Design: Precision in Darkness
   Sections: Navbar, Hero, Services, Stats+Difference, HowItWorks,
             WhyChoose, Testimonials, Treatments, MedicalTeam, FAQ,
             ConsultationCTA, Blog, Footer
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
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

  const OG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg";

  const JSONLD_ORG = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "MedMethod Direct",
    "description": "Physician-led virtual hormone therapy, menopause care, medical weight loss, and longevity medicine for women. Serving Virginia, Florida, Maryland, Washington DC, Colorado, Arizona, North Carolina, and Pennsylvania.",
    "url": "https://medmethoddirect.com",
    "logo": "https://medmethoddirect.com/favicon.ico",
    "telephone": "+1-XXX-XXX-XXXX",
    "priceRange": "$$",
    "medicalSpecialty": ["Endocrinology", "Gynecology", "Bariatrics"],
    "availableService": [
      { "@type": "MedicalTherapy", "name": "Bioidentical Hormone Replacement Therapy (BHRT)" },
      { "@type": "MedicalTherapy", "name": "GLP-1 Medical Weight Loss (Semaglutide, Tirzepatide)" },
      { "@type": "MedicalTherapy", "name": "Menopause & Perimenopause Management" },
      { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
      { "@type": "MedicalTherapy", "name": "Longevity & Metabolic Optimization" }
    ],
    "areaServed": [
      { "@type": "State", "name": "Virginia" },
      { "@type": "State", "name": "Florida" },
      { "@type": "State", "name": "Maryland" },
      { "@type": "State", "name": "Washington DC" },
      { "@type": "State", "name": "Colorado" },
      { "@type": "State", "name": "Arizona" },
      { "@type": "State", "name": "North Carolina" },
      { "@type": "State", "name": "Pennsylvania" }
    ],
    "sameAs": []
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>MedMethod Direct | Virtual Hormone Therapy, Menopause & Weight Loss for Women</title>
        <meta name="description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 8 states. Schedule your free consultation today." />
        <link rel="canonical" href="https://medmethoddirect.com/" />
        <meta property="og:title" content="MedMethod Direct | Virtual Hormone Therapy, Menopause & Weight Loss for Women" />
        <meta property="og:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 8 states." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medmethoddirect.com/" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedMethod Direct | Virtual Hormone Therapy, Menopause & Weight Loss for Women" />
        <meta name="twitter:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 8 states." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_ORG)}</script>
      </Helmet>
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
