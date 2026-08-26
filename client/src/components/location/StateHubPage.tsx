import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ChevronDown, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConsultationModal from "@/components/ConsultationModal";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-state-BTbJpCUp5vmWkE8yyaagjE.webp";

export type StateHubConfig = {
  state: string;
  abbreviation: string;
  slug: string;
  cities: string[];
  regionalIntro: string;
  metaDescription: string;
};

const APPROVED_SERVICES = [
  "Medical weight management (GLP-1)",
  "Hormone therapy for women",
  "Nutrition and vitamin optimization",
  "Dermatology and skin",
  "Hair restoration",
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #E2E2EA" }}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 gap-4 text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="font-bold text-sm" style={{ color: "#111" }}>{question}</span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm font-medium leading-relaxed" style={{ color: "#555" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function StateHubPage({
  state,
  abbreviation,
  slug,
  cities,
  regionalIntro,
  metaDescription,
}: StateHubConfig) {
  const [consultOpen, setConsultOpen] = useState(false);
  const canonicalUrl = `https://www.medmethoddirect.com/${slug}`;
  const cityList = cities.join(", ");

  const faqs = [
    {
      q: `Is MedMethod Direct licensed to serve patients in ${state}?`,
      a: `Yes. MedMethod Direct is licensed to provide telehealth services to eligible patients located in ${state}. Care is delivered virtually by a licensed physician after an appropriate medical evaluation.`,
    },
    {
      q: `Do I need to visit an office to become a patient in ${state}?`,
      a: `No. Visits are completed through secure telehealth. If laboratory testing is appropriate, orders can be sent to a convenient local draw site and reviewed during your virtual care.`,
    },
    {
      q: `How does telehealth prescribing work in ${state}?`,
      a: `Dr. Al-Deek reviews your health history, current medications, goals, and any relevant laboratory information. A prescription is issued only when clinically appropriate and after a valid patient-provider relationship has been established.`,
    },
    {
      q: `What services are available to ${state} patients?`,
      a: `Available services include medical weight management, hormone therapy for women, nutrition and vitamin optimization, dermatology and skin care, and hair restoration. Your consultation is used to determine which options are appropriate for your needs.`,
    },
    {
      q: "Does MedMethod Direct accept insurance?",
      a: "MedMethod Direct is a direct-care practice and does not bill insurance directly. Eligible patients may use HSA or FSA funds, and itemized receipts can be provided for possible out-of-network reimbursement.",
    },
  ];

  const medicalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "MedMethod Direct",
    url: canonicalUrl,
    description: metaDescription,
    medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
    areaServed: { "@type": "State", name: state },
    availableService: APPROVED_SERVICES.map((name) => ({ "@type": "MedicalTherapy", name })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
      { "@type": "ListItem", position: 2, name: state, item: canonicalUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{state} Women's Health | MedMethod Direct</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${state} Women's Health | MedMethod Direct`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${state} Women's Health | MedMethod Direct`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(medicalBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <section className="relative min-h-[72vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.45)" }} aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/locations" className="hover:text-white transition-colors">Locations</Link>
              <span>/</span>
              <span style={{ color: "#E8339E" }}>{state}</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>
              Licensed in {state}
            </p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Virtual Women's Health Care Across <span style={{ color: "#E8339E" }}>{state}</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              Physician-led medical weight management, hormone therapy for women, and personalized virtual care for eligible patients located throughout {state}.
            </p>
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
            >
              Book Your 45-Min Appointment
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            <img
              src={HERO_IMAGE}
              alt={`Telehealth consultation for women's health in ${state}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase text-center mb-3" style={{ color: "#E8339E" }}>
            Statewide Virtual Care
          </p>
          <h2 className="font-black text-3xl text-center mb-3" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Serving Patients Throughout {state}
          </h2>
          <p className="text-sm font-medium text-center mb-10 max-w-2xl mx-auto" style={{ color: "#666" }}>
            Care is available statewide, including {cityList}, and surrounding communities. You do not need a city-specific page to book care from your location.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div key={city} className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                <div>
                  <p className="font-black text-sm" style={{ color: "#111" }}>{city}</p>
                  <p className="text-xs mt-1" style={{ color: "#777" }}>{abbreviation} statewide telehealth</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Physician-Led Virtual Care in {state}
          </h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>
            {regionalIntro}
          </p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>
            Each patient receives an individualized medical evaluation. Treatment recommendations and prescriptions are provided only when clinically appropriate, with ongoing care coordinated through secure telehealth.
          </p>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      <section className="py-20 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>
            Frequently Asked Questions — {state}
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map(({ q, a }) => (
              <FAQItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in {state}</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
          Ready to Speak With Our Care Team?
        </h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          Book a virtual appointment to discuss your health history, goals, and appropriate next steps.
        </p>
        <button
          type="button"
          onClick={() => setConsultOpen(true)}
          className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
        >
          Book Your 45-Min Appointment
        </button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Link href="/locations" className="hover:text-white transition-colors">View all locations</Link>
          {" · "}
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
      </section>

      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <p className="text-xs text-gray-400 leading-relaxed text-center">
            <strong className="text-gray-500">Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice. Services are provided by licensed medical professionals. Prescriptions are issued only after a valid patient-provider relationship and appropriate medical evaluation. Individual results may vary. Consult your healthcare provider before starting any new treatment.{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>{" · "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>{" · "}
            <Link href="/hipaa-notice" className="underline hover:text-gray-600">HIPAA Notice</Link>
          </p>
        </div>
      </div>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
