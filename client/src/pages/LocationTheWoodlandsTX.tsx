import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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

const LocationTheWoodlands = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const city = "The Woodlands";
  const state = "TX";
  const slug = "the-woodlands";
  const url = `https://medmethoddirect.com/texas/${slug}`;

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for my appointments?`,
      a: `No, MedMethod Direct is a 100% virtual clinic. You can consult with Dr. Jumana Al-Deek, DO from the comfort of your home in ${city}, Spring, Conroe, or anywhere in the north Houston corridor. We utilize local LabCorp and Quest Diagnostics facilities for any necessary blood work.`
    },
    {
      q: `Where can I get my labs drawn in ${city}?`,
      a: `We partner with major national laboratories. You can visit any convenient LabCorp or Quest Diagnostics location in ${city}, Shenandoah, or surrounding areas. Your lab orders will be sent directly to the facility of your choice.`
    },
    {
      q: `Do you accept insurance for hormone therapy in ${city}?`,
      a: `We do not bill insurance directly, allowing us to provide highly personalized, transparent care without restrictions. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee.`
    },
    {
      q: `How quickly can I get started with GLP-1 weight loss in ${city}?`,
      a: `You can begin immediately by scheduling your initial consultation. After your comprehensive lab work is completed at a local ${city} facility, Dr. Al-Deek will design your personalized GLP-1 or hormone therapy plan.`
    },
    {
      q: `Is Dr. Jumana Al-Deek licensed to practice in Texas?`,
      a: `Yes, Dr. Jumana Al-Deek, DO is fully licensed to practice medicine in Texas, providing expert telehealth care to women in ${city} and throughout the state.`
    },
    {
      q: `What is included in the $449 Clinical Diagnostic & Setup Fee?`,
      a: `The $449 fee covers your comprehensive initial lab panel, a detailed 45-minute telehealth consultation with Dr. Al-Deek, and the creation of your personalized treatment plan for menopause, hormone therapy, or weight loss.`
    }
  ];

  const nearbyCities = [
    { name: 'Spring', slug: 'spring' },
    { name: 'Conroe', slug: 'conroe' },
    { name: 'Magnolia', slug: 'magnolia' },
    { name: 'Tomball', slug: 'tomball' },
    { name: 'Shenandoah', slug: 'shenandoah' }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city}`,
        "image": "https://medmethoddirect.com/logo.png",
        "url": url,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "US"
        },
        "medicalSpecialty": ["Endocrinology", "PrimaryCare"],
        "priceRange": "$$",
        "description": `Expert virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}.`
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
            "item": url
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#111111] font-['Montserrat',sans-serif]">
      <Helmet>
        <title>Menopause & Hormone Therapy Doctor in {city}, {state} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}. Book your telehealth consultation with Dr. Jumana Al-Deek, DO.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Menopause & Hormone Therapy Doctor in ${city}, ${state} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${state}.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7A1E7E]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A1E7E]/10 border border-[#7A1E7E]/20 text-[#E8339E] font-medium mb-6">
              <MapPin className="w-4 h-4" />
              <span>Licensed in Texas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Menopause & Hormone Care in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">{city}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Comprehensive virtual care for menopause, hormone optimization, and medical weight loss. 100% telehealth for women in {city} and the north Houston corridor.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
            >
              Book Your Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Intro & Keywords Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6">
              Specialized Women's Healthcare in {city}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Finding a specialized <strong>menopause doctor {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, Dr. Jumana Al-Deek, DO provides expert, compassionate care tailored to your unique needs. Whether you are seeking comprehensive <strong>hormone therapy {city} TX</strong> to alleviate perimenopause symptoms or looking for an effective <strong>GLP-1 {city} TX</strong> medical weight loss program, our virtual clinic brings top-tier medical expertise directly to you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              As a premier <strong>telehealth {city} TX</strong> provider, we serve women throughout this affluent master-planned community and the greater north Houston corridor. Enjoy the convenience of virtual consultations combined with local lab testing at your nearest LabCorp or Quest Diagnostics. We accept HSA/FSA cards for all services, including our transparent $449 Clinical Diagnostic & Setup Fee, ensuring straightforward access to the care you deserve without the hassle of insurance billing.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />
      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D1A] mb-4">
              Frequently Asked Questions in {city}
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our virtual clinic services in your area.
            </p>
          </div>
          <div className="space-y-4">
            {localFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-[#0D0D1A] pr-8">{faq.q}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaqIndex === index && (
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
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#0D0D1A] mb-6">
              Serving {city} and Surrounding Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyCities.map((nearby) => (
                <a
                  key={nearby.slug}
                  href={`/texas/${nearby.slug}`}
                  className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:border-[#E8339E] hover:text-[#E8339E] transition-colors text-sm font-medium"
                >
                  {nearby.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#7A1E7E]/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the women in {city} who have transformed their lives with our personalized hormone and weight loss programs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
            >
              Schedule Your Consultation
            </button>
            <div className="flex items-center gap-2 text-gray-300 mt-4 sm:mt-0">
              <CheckCircle2 className="w-5 h-5 text-[#E8339E]" />
              <span>HSA/FSA Accepted</span>
            </div>
          </div>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default LocationTheWoodlands;
