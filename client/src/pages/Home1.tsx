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
        const navbarHeight = 110; // 72px nav + ~38px top banner
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

  const JSONLD_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Why is my membership separate from my medication?", "acceptedAnswer": { "@type": "Answer", "text": "Your membership pays for the clinical relationship — physician oversight, protocol design, coaching, and ongoing care — and it stays the same regardless of which medications you take. Medications are priced separately and transparently, so you only pay for what your physician actually prescribes. This keeps your cost honest: you're never paying a bundled markup on a drug you don't use, and you can adjust your medication stack without changing your membership." } },
      { "@type": "Question", "name": "What am I actually paying for in the membership?", "acceptedAnswer": { "@type": "Answer", "text": "The depth of your care. Ignite covers asynchronous physician access and protocol design; Transformation adds live video visits, baseline labs, structured nutrition and fitness plans, and a Performance Coach; Longevity adds quarterly physician strategy sessions, expanded diagnostics, and advanced monitoring. Medications are a separate line item layered on top." } },
      { "@type": "Question", "name": "Do I need to be on medication to have a membership?", "acceptedAnswer": { "@type": "Answer", "text": "No. Your membership covers your clinical oversight whether or not you fill a prescription in a given month. Most patients pair a membership with at least one medication, but the structures are independent." } },
      { "@type": "Question", "name": "How do I know whether I need Ignite, Transformation, or Longevity?", "acceptedAnswer": { "@type": "Answer", "text": "Ignite is for the patient who knows what they want and values speed and price over coaching. Transformation is for most people — it adds the live physician relationship, baseline labs, and a Performance Coach who keeps you accountable. Longevity is for patients who want more physician strategy time, deeper diagnostic testing, and advanced monitoring. When in doubt, Transformation is the right starting point for the majority of patients." } },
      { "@type": "Question", "name": "Can I start on one tier and upgrade later?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Tier upgrades are available at any time without re-enrolling, and your medication pricing carries over unchanged. Many patients begin on Transformation and move to Longevity as they get deeper into hormone optimization or want quarterly diagnostics." } },
      { "@type": "Question", "name": "What's the real difference in physician access between tiers?", "acceptedAnswer": { "@type": "Answer", "text": "Ignite is asynchronous, with live video available at $49 per visit. Transformation includes an initial live consultation plus regular video check-ins and unlimited secure messaging at a 24-hour response standard. Longevity adds a quarterly 45-minute physician strategy session and priority access at a 12-hour standard." } },
      { "@type": "Question", "name": "Why is everything billed upfront for the full term?", "acceptedAnswer": { "@type": "Answer", "text": "Term pricing rewards commitment with lower monthly membership rates — up to 15% on the 6-month plan and up to 23% on the 12-month plan — and committing upfront is what makes those rates possible. Your membership rate is locked in for the full term you choose." } },
      { "@type": "Question", "name": "What is the initiation fee and what does it cover?", "acceptedAnswer": { "@type": "Answer", "text": "The one-time initiation fee covers your onboarding: physician intake, custom protocol design, and dashboard setup at every tier. At Transformation it also includes your 30-minute live consultation and a baseline 30+ biomarker lab panel; at Longevity it includes a premium 75+ biomarker panel and at-home phlebotomy where available. It is not a recurring charge." } },
      { "@type": "Question", "name": "Is the Ignite 12-month initiation fee waiver real?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The $49 Ignite initiation fee is waived in full when you enroll on a 12-month plan. It applies automatically at checkout." } },
      { "@type": "Question", "name": "Is financing available?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Cherry financing is available on the 6- and 12-month plans, so you can spread the upfront cost over monthly installments while still locking in term pricing." } },
      { "@type": "Question", "name": "Are there hidden fees?", "acceptedAnswer": { "@type": "Answer", "text": "No. Your membership fee at enrollment covers your clinical services. Any prescribed medications are billed separately and transparently by the pharmacy. All pricing is listed on our website so you always know exactly what you are paying for before you enroll. Any labs beyond what your tier includes are quoted before you commit." } },
      { "@type": "Question", "name": "Does my medication price change as my dose increases?", "acceptedAnswer": { "@type": "Answer", "text": "For some medications, yes — pricing can vary by dosage, and your cost may change if your physician adjusts your dose. We are fully transparent about this: every medication and dosage is priced exactly as listed on our website, so you always know what you will pay before any change takes effect. There are no surprise markups — just the prices as shown." } },
      { "@type": "Question", "name": "Can I switch or pause my medication mid-term?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. With physician approval, medications can be swapped or paused at any point during your term, and your membership continues uninterrupted. Any medication you add or change is priced exactly as listed on our website." } },
      { "@type": "Question", "name": "Is there a real doctor, and who prescribes my medication?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod is physician-led, and every prescription is written by a licensed physician after an individual evaluation. No medication is dispensed without that review." } },
      { "@type": "Question", "name": "Do I need lab work before starting?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your tier and your physician's judgment. Transformation and Longevity include a baseline lab panel as part of onboarding; on Ignite, labs can be purchased separately if your physician determines they're needed before prescribing." } },
      { "@type": "Question", "name": "What states do you serve?", "acceptedAnswer": { "@type": "Answer", "text": "We are currently licensed in 17 states: Florida, Virginia, Colorado, Maryland, Michigan, Illinois, Texas, Arizona, Tennessee, New Jersey, Washington D.C., Georgia, Alabama, Washington, North Carolina, Pennsylvania, and Ohio." } },
      { "@type": "Question", "name": "What happens if I'm not eligible after my intake?", "acceptedAnswer": { "@type": "Answer", "text": "Eligibility for your state is confirmed during enrollment before your charge is finalized, and your membership covers a real physician evaluation regardless of the outcome. If your physician determines a specific medication isn't appropriate for you, they'll work with you to find a suitable alternative within your protocol." } },
      { "@type": "Question", "name": "Can I do weight loss and hormone therapy at the same time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — and this is what sets MedMethod apart. We're built specifically to manage GLP-1 weight-loss therapy and hormone optimization (BHRT for women, TRT for men) together, under one physician, as a single coordinated protocol. Most programs treat these in isolation; we don't." } },
      { "@type": "Question", "name": "Is it safe to combine GLP-1 weight loss and hormone therapy?", "acceptedAnswer": { "@type": "Answer", "text": "Combining metabolic and hormone therapy is exactly the kind of integrated care our model is designed to manage, with a single physician overseeing both so the protocols are coordinated rather than working against each other. Your physician will evaluate your full picture and design a plan specific to you." } },
      { "@type": "Question", "name": "Is my health information private?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, and we take it seriously. Your records live in a HIPAA-compliant clinical system, and we've deliberately built our infrastructure to avoid the kind of large-scale data exposure that has affected other telehealth operators. We don't sell your data." } },
      { "@type": "Question", "name": "How fast can I get started?", "acceptedAnswer": { "@type": "Answer", "text": "Most patients complete enrollment and physician intake quickly, with medication shipping shortly after your prescription is written. Transformation and Longevity patients schedule their live consultation as part of onboarding." } },
      { "@type": "Question", "name": "How does my medication ship?", "acceptedAnswer": { "@type": "Answer", "text": "Compounded medications ship directly from licensed partner pharmacies to your door; brand-name prescriptions ship from the manufacturers' direct programs. Your dashboard helps you track the refills your pharmacy fills, so you're not managing it manually." } },
      { "@type": "Question", "name": "What's the cancellation and refund policy?", "acceptedAnswer": { "@type": "Answer", "text": "You can cancel your subscription at any time, and it will stop renewing going forward — you're never locked into another term. Membership charges are final at the time they're billed, and we don't issue refunds for any period already billed. Medications are billed separately by the pharmacy and are subject to the pharmacy's own policies." } }
    ]
  };

  const JSONLD_ORG = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "MedMethod Direct",
    "description": "Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 17 states.",
    "url": "https://medmethoddirect.com",
    "logo": "https://medmethoddirect.com/favicon.ico",
    "telephone": "+1-888-362-7011",
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
      { "@type": "State", "name": "Florida" },
      { "@type": "State", "name": "Virginia" },
      { "@type": "State", "name": "Colorado" },
      { "@type": "State", "name": "Maryland" },
      { "@type": "State", "name": "Michigan" },
      { "@type": "State", "name": "Illinois" },
      { "@type": "State", "name": "Texas" },
      { "@type": "State", "name": "Arizona" },
      { "@type": "State", "name": "Tennessee" },
      { "@type": "State", "name": "New Jersey" },
      { "@type": "State", "name": "Washington DC" },
      { "@type": "State", "name": "Georgia" },
      { "@type": "State", "name": "Alabama" },
      { "@type": "State", "name": "Washington" },
      { "@type": "State", "name": "North Carolina" },
      { "@type": "State", "name": "Pennsylvania" },
      { "@type": "State", "name": "Ohio" }
    ],
    "sameAs": []
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>MedMethod Direct | Hormone & Weight Loss Clinic</title>
        <meta name="description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 17 states. Schedule your free Discovery Call today." />
        <meta name="keywords" content="hormone therapy, menopause treatment, weight loss clinic, GLP-1, semaglutide, tirzepatide, BHRT, virtual doctor, telehealth, longevity medicine, women's health" />
        <link rel="canonical" href="https://medmethoddirect.com/" />
        <meta property="og:title" content="MedMethod Direct | Virtual Hormone, Menopause & Weight Loss Clinic — 17 States" />
        <meta property="og:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 17 states." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medmethoddirect.com/" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedMethod Direct | Virtual Hormone, Menopause & Weight Loss Clinic — 17 States" />
        <meta name="twitter:description" content="Physician-led virtual hormone therapy, menopause care, GLP-1 medical weight loss, and longevity medicine for women. 100% virtual, licensed in 17 states." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_ORG)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
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
