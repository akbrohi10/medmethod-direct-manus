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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-roundrock-5r6QDwVzHC3Y869nyqAmRB.webp";
const HERO_IMAGE_OG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-roundrock-NMbP3HyVgZZGEjzH9Ybikw.png";

const LocationRoundRock = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const city = "Round Rock";
  const state = "TX";
  const slug = "round-rock";
  const nearbyCities = [
    { name: "Cedar Park", slug: "cedar-park" },
    { name: "Georgetown", slug: "georgetown" },
    { name: "Pflugerville", slug: "pflugerville" },
    { name: "Hutto", slug: "hutto" },
    { name: "Leander", slug: "leander" }
  ];

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for menopause treatment?`,
      a: `No, MedMethod Direct is a 100% virtual clinic. Dr. Jumana Al-Deek, DO, provides expert menopause and hormone therapy via telehealth for women in ${city} and throughout Texas. You can complete your consultation from the comfort of your home.`
    },
    {
      q: `Where can I get my lab work done in ${city}?`,
      a: `We partner with major national laboratories like LabCorp and Quest Diagnostics. There are multiple convenient locations in and around ${city}, including near Dell HQ and downtown, where you can complete your required blood work.`
    },
    {
      q: `Do you prescribe GLP-1 weight loss medications in ${city}?`,
      a: `Yes, we offer comprehensive medical weight loss programs including GLP-1 medications for eligible patients in ${city}. Our programs are tailored to your specific metabolic needs and health goals.`
    },
    {
      q: `Do you accept insurance for telehealth visits in ${city}?`,
      a: `MedMethod Direct is a direct-pay clinic and we do not bill insurance. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee and ongoing memberships.`
    },
    {
      q: `How quickly can I get an appointment in ${city}?`,
      a: `Because we operate virtually, we can often accommodate new patients in ${city} much faster than traditional brick-and-mortar clinics. You can schedule your initial consultation online at your convenience.`
    },
    {
      q: `Is hormone replacement therapy safe?`,
      a: `When prescribed and monitored by a qualified physician like Dr. Al-Deek, hormone replacement therapy (HRT) is safe and highly effective for managing menopause symptoms. We require comprehensive lab work and a thorough medical history to ensure HRT is appropriate for you.`
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city}`,
        "image": "https://medmethoddirect.com/images/logo.png",
        "url": `https://medmethoddirect.com/texas/${slug}`,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "US"
        },
        "medicalSpecialty": ["Endocrine", "Gynecologic", "PrimaryCare"],
        "priceRange": "$$",
        "description": `Virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}.`
      },
      {
        "@type": "FAQPage",
        "mainEntity": localFaqs.map(faq => ({
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
            "name": city,
            "item": `https://medmethoddirect.com/texas/${slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#111111] font-['Montserrat']">
      <Helmet>
        <title>Menopause & Hormone Therapy Doctor in {city}, {state} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}. Telehealth appointments with Dr. Jumana Al-Deek, DO.`} />
        <link rel="canonical" href={`https://medmethoddirect.com/texas/${slug}`} />
        <meta property="og:title" content={`Menopause & Hormone Therapy Doctor in ${city}, ${state} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}. Telehealth appointments with Dr. Jumana Al-Deek, DO.`} />
        <meta property="og:url" content={`https://medmethoddirect.com/texas/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_IMAGE_OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={HERO_IMAGE_OG} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
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
                <span style={{ color: "#333" }}>Round Rock</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Serving Round Rock, TX
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
                for Round Rock women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Round Rock, TX.
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
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradRoundRock)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradRoundRock" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
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
                  alt="Virtual menopause doctor and hormone therapy for women in Round Rock, TX — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Austin · Cedar Park · Georgetown · Pflugerville
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>


      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-[#E8339E]">Home</a></li>
              <li><span className="mx-2">›</span></li>
              <li><a href="/texas" className="hover:text-[#E8339E]">Texas</a></li>
              <li><span className="mx-2">›</span></li>
              <li className="text-gray-900 font-medium">{city}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6">Your Trusted Virtual Clinic in {city}</h2>
            <p>
              Finding a specialized <strong>menopause doctor in {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, led by Dr. Jumana Al-Deek, DO, we bring expert women's healthcare directly to you. Whether you're a tech professional working near Dell HQ or a busy resident in the surrounding Austin suburbs, our <strong>telehealth in {city} TX</strong> services are designed to fit your lifestyle.
            </p>
            <p>
              We specialize in comprehensive <strong>hormone therapy in {city} TX</strong> to help you navigate perimenopause and menopause with confidence. Our personalized approach ensures that your treatment plan addresses your unique symptoms, from hot flashes and sleep disturbances to mood changes and low energy.
            </p>
            <p>
              Additionally, we offer advanced medical weight loss solutions, including <strong>GLP-1 in {city} TX</strong>. Our holistic programs combine medication with lifestyle guidance to help you achieve sustainable weight loss and improve your overall metabolic health.
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl mt-8 border border-gray-100">
              <h3 className="text-xl font-bold text-[#0D0D1A] mb-4">Why Choose MedMethod Direct?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                  <span><strong>Expert Care:</strong> Led by Dr. Jumana Al-Deek, DO, specializing in women's health.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                  <span><strong>Convenient Labs:</strong> Partnered with LabCorp and Quest Diagnostics for easy local testing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#E8339E] flex-shrink-0 mt-0.5" />
                  <span><strong>Transparent Pricing:</strong> $449 Clinical Diagnostic & Setup Fee. HSA/FSA accepted (no insurance billing).</span>
                </li>
              </ul>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D1A] mb-4">Frequently Asked Questions in {city}</h2>
            <p className="text-lg text-gray-600">Common questions from our patients in the {city} area.</p>
          </div>
          <div className="space-y-4">
            {localFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-[#0D0D1A] pr-8">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-center text-[#0D0D1A] mb-6">Serving {city} and Surrounding Areas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyCities.map((nearby) => (
              <a
                key={nearby.slug}
                href={`/texas/${nearby.slug}`}
                className="px-4 py-2 bg-gray-50 hover:bg-[#E8339E]/10 text-gray-700 hover:text-[#E8339E] rounded-full text-sm font-medium transition-colors border border-gray-200 hover:border-[#E8339E]/30"
              >
                {nearby.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#7A1E7E]/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join women across {city} who have transformed their lives with our personalized virtual care.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-[#E8339E] hover:bg-[#E8339E]/90 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(232,51,158,0.3)] hover:shadow-[0_0_30px_rgba(232,51,158,0.5)]"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default LocationRoundRock;
