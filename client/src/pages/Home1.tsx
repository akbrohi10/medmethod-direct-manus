/* =============================================================================
   Home1 Page — MedMethod Direct (Dr. AL-Deek Landing Page - Exact Replica)
   Clinical Noir Design: Precision in Darkness
   Sections (cold-traffic ad landing page):
     Navbar → MedicalTeam (Dr. Al-Deek hero) → BookTeaser
            → HowItWorks → PopularPrograms → YourMedication
            → Testimonials → Services → FAQ → Footer
   ============================================================================= */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/home1/Navbar";
import ConsultationModal from "@/components/home1/ConsultationModal";
import HowItWorks from "@/components/home1/HowItWorks";
import YourMedication from "@/components/home1/YourMedication";
import PopularPrograms from "@/components/home1/PopularPrograms";
import MedicalTeam from "@/components/home1/MedicalTeam";
import Testimonials from "@/components/home1/Testimonials";
import Services from "@/components/home1/Services";
import BookTeaser from "@/components/home1/BookTeaser";
import FAQ from "@/components/home1/FAQ";
import Footer from "@/components/home1/Footer";
import StickyMobileCTA from "@/components/home1/StickyMobileCTA";

// Scroll to hash section after page load (e.g. navigating from /blog to /#services)
function useHashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    // Wait for DOM to fully render
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const navbarHeight = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: "smooth" });
        // Clean up hash from URL without triggering re-render
        window.history.replaceState(null, "", window.location.pathname);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);
}

// ─── Section Visibility Flags ─────────────────────────────────────────────────
// Flip to `true` to bring the section back
const SHOW_MEDICATIONS = false;

export default function Home1() {
  useHashScroll();
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
    "description": "Physician-led virtual hormone therapy, menopause care, medical weight loss, and longevity medicine for women. Serving Virginia, Florida, Maryland, Washington DC, Colorado, Arizona, North Carolina, Pennsylvania, and Texas.",
    "url": "https://medmethoddirect.com",
    "logo": "https://medmethoddirect.com/favicon.ico",
    "telephone": "+1-561-594-4949",
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
      { "@type": "State", "name": "Pennsylvania" },
      { "@type": "State", "name": "Texas" }
    ],
    "sameAs": []
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>MedMethod Direct | Hormone & Weight Loss Clinic</title>
        <meta name="description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 9 states. Schedule your free consultation today." />
        <meta name="keywords" content="hormone therapy, menopause treatment, weight loss clinic, GLP-1, semaglutide, tirzepatide, BHRT, virtual doctor, telehealth, longevity medicine, women's health" />
        <link rel="canonical" href="https://medmethoddirect.com/" />
        <meta property="og:title" content="MedMethod Direct | Virtual Hormone Therapy, Menopause & Weight Loss for Women" />
        <meta property="og:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 9 states." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medmethoddirect.com/" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedMethod Direct | Virtual Hormone Therapy, Menopause & Weight Loss for Women" />
        <meta name="twitter:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 9 states." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_ORG)}</script>
      </Helmet>
      <Navbar onConsultClick={() => openConsult()} />
      {/* ── Cold-traffic ad landing page section order ────────── */}
      {/* Dr. Al-Deek / Medical Team is now the top hero */}
      <MedicalTeam onConsultClick={() => openConsult()} />
      <BookTeaser onConsultClick={openConsult} />
      <HowItWorks onConsultClick={() => openConsult()} />
      <PopularPrograms onConsultClick={openConsult} />
      {SHOW_MEDICATIONS && <YourMedication onConsultClick={() => openConsult()} />}
      <Testimonials />
      <Services onConsultClick={openConsult} />
      <FAQ onConsultClick={() => openConsult()} />
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
