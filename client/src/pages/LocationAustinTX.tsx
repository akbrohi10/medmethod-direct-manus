import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsultationModal from '@/components/ConsultationModal';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import HowItWorks from '@/components/HowItWorks';
import PopularPrograms from '@/components/PopularPrograms';
import Services from '@/components/Services';
import DiagnosticSetup from '@/components/DiagnosticSetup';
import { pricingFaqs } from '@/data/pricingFaqs';

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-austin-3ZrSjpRPpCtMVvZdpz4cGG.webp";
const HERO_IMAGE_OG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-austin-HckKt9V2ZofiYJk44z6CL2.png";

const LocationAustin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const cityFaqs = [
    {
      q: "Do I need to visit a clinic in Austin for my menopause or hormone therapy consultation?",
      a: "No, all consultations with Dr. Jumana Al-Deek, DO are conducted 100% virtually via telehealth. You can receive expert care from the comfort of your home in Austin, Round Rock, Cedar Park, or anywhere in the metro area."
    },
    {
      q: "Where can I get my lab work done in Austin?",
      a: "We partner with major national laboratories including LabCorp and Quest Diagnostics. There are numerous convenient locations throughout Austin, Pflugerville, Georgetown, and surrounding areas where you can complete your required blood work."
    },
    {
      q: "How much does the initial consultation cost?",
      a: "We charge a one-time $449 Clinical Diagnostic & Setup Fee. This covers your comprehensive initial evaluation, lab order generation, and personalized treatment plan development. We do not bill insurance, but we do accept HSA/FSA cards."
    },
    {
      q: "Can I get GLP-1 weight loss medications prescribed in Austin?",
      a: "Yes, if clinically appropriate based on your lab results and medical history, Dr. Al-Deek can prescribe GLP-1 medications for weight loss. The medication is shipped directly to your door in Austin."
    },
    {
      q: "Do you treat patients in the Austin suburbs like Lakeway or Dripping Springs?",
      a: "Absolutely. Because our practice is entirely virtual, we serve patients throughout the entire Austin metropolitan area, including Lakeway, Bee Cave, Westlake Hills, Dripping Springs, and all other Texas communities."
    },
    {
      q: "How quickly can I get an appointment?",
      a: "As a virtual clinic, we typically have availability much sooner than traditional brick-and-mortar practices. You can often schedule your initial telehealth consultation within a few days."
    }
  ];

  const nearbyCities = [
    { name: "Houston", slug: "houston" },
    { name: "Dallas", slug: "dallas" },
    { name: "San Antonio", slug: "san-antonio" },
    { name: "Fort Worth", slug: "fort-worth" },
    { name: "El Paso", slug: "el-paso" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": "MedMethod Direct - Austin",
        "image": "https://medmethoddirect.com/logo.png",
        "url": "https://medmethoddirect.com/texas/austin",
        "telephone": "+1-800-555-0199",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Austin",
          "addressRegion": "TX",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 30.2672,
          "longitude": -97.7431
        },
        "medicalSpecialty": ["Endocrine", "Gynecologic"],
        "isAcceptingNewPatients": true,
        "paymentAccepted": "Cash, Credit Card, HSA, FSA"
      },
      {
        "@type": "FAQPage",
        "mainEntity": cityFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://medmethoddirect.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Texas",
            "item": "https://medmethoddirect.com/texas"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Austin",
            "item": "https://medmethoddirect.com/texas/austin"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-['Montserrat',sans-serif] bg-[#0D0D1A] text-[#111111]">
      <Helmet>
        <title>Menopause Doctor & Hormone Therapy in Austin, TX | MedMethod Direct</title>
        <meta name="description" content="Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in Austin, TX. Telehealth consultations with Dr. Jumana Al-Deek, DO. HSA/FSA accepted." />
        <link rel="canonical" href="https://medmethoddirect.com/texas/austin" />
        <meta property="og:title" content="Menopause Doctor & Hormone Therapy in Austin, TX | MedMethod Direct" />
        <meta property="og:description" content="Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in Austin, TX. Telehealth consultations with Dr. Jumana Al-Deek, DO. HSA/FSA accepted." />
        <meta property="og:url" content="https://medmethoddirect.com/texas/austin" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE_OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={HERO_IMAGE_OG} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />
      {/* Hero Section */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-16">
            {/* LEFT: Copy */}
            <div>
              <nav className="flex items-center gap-2 text-xs font-semibold mb-5" style={{ color: "#aaa", fontFamily: "Montserrat, sans-serif" }}>
                <Link href="/" className="hover:text-[#E8339E] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/texas" className="hover:text-[#E8339E] transition-colors">Texas</Link>
                <span>/</span>
                <span style={{ color: "#333" }}>Austin</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Serving Austin, TX
              </div>
              <h1
                className="font-black leading-[1.05] mb-5"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)",
                  letterSpacing: "-0.02em",
                  color: "#111111",
                }}
              >
                Virtual{" "}
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                <br />
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                <br />
                for Austin women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Austin, TX.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  SCHEDULE FREE CONSULTATION
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              <p
                className="flex items-center gap-2 font-semibold mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradAustin)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradAustin" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
                </svg>
                100% Virtual Care · Licensed in Texas
              </p>
            </div>
            {/* RIGHT: Hero Image */}
            <div className="relative lg:-ml-6">
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                <img
                  src={HERO_IMAGE}
                  alt="Virtual menopause doctor and hormone therapy for women in Austin, TX — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Round Rock · Cedar Park · Georgetown · Pflugerville
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>
      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111111] mb-6 text-center">
              Specialized Women's Healthcare for Austin Residents
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Finding a specialized <strong>menopause doctor in Austin TX</strong> shouldn't be a challenge. At MedMethod Direct, we bring expert care directly to you through our comprehensive <strong>telehealth in Austin TX</strong> platform. Whether you're navigating perimenopause, seeking relief from severe symptoms, or looking for medical weight management, Dr. Jumana Al-Deek, DO provides personalized, evidence-based care.
              </p>
              <p className="mb-4">
                Our virtual clinic offers advanced <strong>hormone therapy in Austin TX</strong> tailored to your unique biological needs. We understand that the fast-paced lifestyle of Austin's tech workers and health-conscious residents demands convenient, high-quality healthcare. That's why we've eliminated the waiting room.
              </p>
              <p className="mb-4">
                In addition to hormone optimization, we offer comprehensive medical weight loss programs, including <strong>GLP-1 in Austin TX</strong>. We proudly serve the entire Austin metropolitan area, including Round Rock, Cedar Park, Georgetown, Pflugerville, Lakeway, Bee Cave, Westlake Hills, and Dripping Springs.
              </p>
              <div className="bg-gray-50 p-6 rounded-xl mt-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-[#7A1E7E] mb-4">Why Choose MedMethod Direct in Austin?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                    <span><strong>100% Virtual Care:</strong> Consultations from your home or office.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                    <span><strong>Local Lab Testing:</strong> Convenient blood work at LabCorp or Quest Diagnostics locations throughout the Austin area.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                    <span><strong>Transparent Pricing:</strong> $449 Clinical Diagnostic & Setup Fee. HSA/FSA accepted (no insurance billing).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />
      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
                Austin Patient FAQs
              </h2>
              <p className="text-lg text-gray-600">
                Common questions about our virtual clinic services in the Austin area.
              </p>
            </div>
            <div className="space-y-4">
              {cityFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-[#E8339E]/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-semibold text-[#111111] pr-8">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Also Serving These Texas Cities</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/texas/${city.slug}`}
                  className="px-4 py-2 bg-gray-50 hover:bg-[#E8339E]/10 text-gray-700 hover:text-[#E8339E] rounded-full text-sm font-medium transition-colors border border-gray-200 hover:border-[#E8339E]/30"
                >
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Health in Austin?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule your virtual consultation with Dr. Al-Deek today and start your journey to better health.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-[#E8339E]/20 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationAustin;
