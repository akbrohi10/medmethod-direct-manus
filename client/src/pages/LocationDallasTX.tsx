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

const LocationDallas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const city = "Dallas";
  const state = "Texas";
  const stateAbbr = "TX";
  const slug = "dallas";
  const url = `https://medmethoddirect.com/texas/${slug}`;

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for hormone therapy?`,
      a: `No, MedMethod Direct is a 100% virtual clinic. Dr. Jumana Al-Deek, DO provides telehealth consultations for women across ${city} and its suburbs like Plano, Frisco, and Highland Park. You can complete your lab work at any local LabCorp or Quest Diagnostics in the DFW area.`
    },
    {
      q: `How do I get my lab work done in ${city}?`,
      a: `We partner with major national laboratories. You can visit any convenient LabCorp or Quest Diagnostics location in ${city}, Richardson, McKinney, or surrounding areas. Your results are sent directly to us for review.`
    },
    {
      q: `Do you accept insurance for GLP-1 weight loss in ${city}?`,
      a: `We do not bill insurance directly, allowing us to provide transparent pricing and personalized care without insurance restrictions. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee.`
    },
    {
      q: `What areas of the Dallas-Fort Worth metroplex do you serve?`,
      a: `We serve all of ${city} and the surrounding areas, including Plano, Frisco, McKinney, Allen, Richardson, Highland Park, University Park, Addison, and Carrollton. As long as you are in Texas, you can access our telehealth services.`
    },
    {
      q: `How quickly can I see a menopause doctor in ${city}?`,
      a: `Because we operate via telehealth, we can often schedule your initial consultation with Dr. Al-Deek much faster than traditional in-person clinics in ${city}. You can start the process today by booking a consultation online.`
    },
    {
      q: `Are GLP-1 medications available for delivery in ${city}?`,
      a: `Yes, if prescribed, your medications can be shipped directly to your home or office in ${city} or any of the surrounding suburbs, providing a discreet and convenient experience for busy corporate professionals.`
    }
  ];

  const allFaqs = [...localFaqs, ...pricingFaqs.slice(0, 4)];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city} Hormone Therapy & Weight Loss`,
        "image": "https://medmethoddirect.com/logo.png",
        "@id": url,
        "url": url,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": stateAbbr,
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "32.7767",
          "longitude": "-96.7970"
        },
        "medicalSpecialty": ["Endocrine", "PrimaryCare"],
        "priceRange": "$$",
        "acceptsReservations": true,
        "areaServed": [
          city,
          "Plano",
          "Frisco",
          "McKinney",
          "Allen",
          "Richardson",
          "Highland Park",
          "University Park",
          "Addison",
          "Carrollton"
        ]
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
            "item": "https://medmethoddirect.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": state,
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
        <title>Menopause Doctor & Hormone Therapy in {city}, {stateAbbr} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in ${city}, ${stateAbbr}. Telehealth consultations with Dr. Jumana Al-Deek, DO. HSA/FSA accepted.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Menopause Doctor & Hormone Therapy in ${city}, ${stateAbbr} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in ${city}, ${stateAbbr}. Telehealth consultations with Dr. Jumana Al-Deek, DO.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/10 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white mb-6">
              <MapPin className="w-4 h-4 text-[#E8339E]" />
              <span className="text-sm font-medium tracking-wide uppercase">Licensed in {state}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Menopause & Weight Loss Care in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">{city}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Access premium, personalized virtual care from Dr. Jumana Al-Deek, DO. Serving corporate professionals and women across the DFW metroplex with comprehensive hormone therapy and GLP-1 programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
              >
                Book Your Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6 text-center">
              Your Premier Virtual Clinic in {city}, {stateAbbr}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Finding a specialized <strong>menopause doctor in {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, we bring expert care directly to you through our secure telehealth platform. Whether you're navigating perimenopause, seeking comprehensive <strong>hormone therapy in {city} TX</strong>, or exploring medical weight loss options, Dr. Jumana Al-Deek, DO provides personalized, evidence-based treatment plans tailored to your unique needs.
              </p>
              <p>
                Our virtual clinic is designed for busy women and corporate professionals across the DFW area, including affluent northern suburbs like Plano, Frisco, McKinney, Allen, Richardson, Highland Park, University Park, Addison, and Carrollton. With our convenient <strong>telehealth in {city} TX</strong> services, you can skip the waiting room and access top-tier medical care from the comfort of your home or office.
              </p>
              <p>
                We also offer advanced <strong>GLP-1 in {city} TX</strong> programs for sustainable weight management. We partner with local LabCorp and Quest Diagnostics facilities throughout the metroplex for your required lab work. While we do not bill insurance, we proudly accept HSA and FSA cards for all services, including our transparent $449 Clinical Diagnostic & Setup Fee.
              </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D1A] mb-12 text-center">
              Frequently Asked Questions in {city}
            </h2>
            <div className="space-y-4">
              {allFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-semibold text-[#0D0D1A] pr-8">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.a}
                    </div>
                  )}
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
            <h3 className="text-xl font-semibold text-[#0D0D1A] mb-6">Serving Other Texas Cities</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Houston', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock'].map((siblingCity) => (
                <a
                  key={siblingCity}
                  href={`/texas/${siblingCity.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-[#E8339E]/10 hover:text-[#E8339E] hover:border-[#E8339E]/30 transition-colors text-sm font-medium"
                >
                  {siblingCity}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/10 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Health in {city}?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take the first step towards feeling like yourself again. Book your virtual consultation with Dr. Al-Deek today.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
            >
              Start Your Journey
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

export default LocationDallas;
