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

const LocationMcKinney = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const localFaqs = [
    {
      q: "Do you offer in-person appointments in McKinney?",
      a: "MedMethod Direct is a 100% virtual clinic. Dr. Jumana Al-Deek, DO provides comprehensive telehealth care for women in McKinney, Allen, Prosper, and surrounding areas, meaning you can receive expert menopause and hormone therapy from the comfort of your home."
    },
    {
      q: "Where can I get my labs done in McKinney?",
      a: "We partner with major national laboratories. You can easily complete your required blood work at any convenient LabCorp or Quest Diagnostics location in McKinney or nearby Collin County cities."
    },
    {
      q: "Do you accept insurance for telehealth visits in Texas?",
      a: "We do not bill insurance directly, allowing us to provide highly personalized, transparently priced care without restrictions. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee."
    },
    {
      q: "What does the $449 Clinical Diagnostic & Setup Fee cover?",
      a: "This one-time fee covers your comprehensive initial evaluation with Dr. Al-Deek, a detailed review of your medical history, ordering and interpretation of your baseline labs, and the development of your personalized hormone therapy or GLP-1 weight loss plan."
    },
    {
      q: "Can I get GLP-1 weight loss medications prescribed in McKinney?",
      a: "Yes. If clinically appropriate based on your evaluation and lab results, Dr. Al-Deek can prescribe GLP-1 medications for weight loss. We provide ongoing monitoring and support throughout your treatment."
    },
    {
      q: "How quickly can I start hormone therapy after my consultation?",
      a: "Once your lab results are in and you've had your comprehensive consultation with Dr. Al-Deek, your personalized treatment plan is finalized. Prescriptions are typically sent to your preferred local pharmacy in McKinney or a mail-order pharmacy promptly."
    }
  ];

  const allFaqs = [...localFaqs, ...pricingFaqs];

  const nearbyCities = [
    { name: 'Allen', slug: 'allen' },
    { name: 'Prosper', slug: 'prosper' },
    { name: 'Celina', slug: 'celina' },
    { name: 'Anna', slug: 'anna' },
    { name: 'Melissa', slug: 'melissa' },
    { name: 'Princeton', slug: 'princeton' }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": "MedMethod Direct - McKinney",
        "image": "https://medmethoddirect.com/images/og-image.jpg",
        "url": "https://medmethoddirect.com/texas/mckinney",
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "McKinney",
          "addressRegion": "TX",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.1976",
          "longitude": "-96.6153"
        },
        "medicalSpecialty": ["Endocrine", "Gynecologic"],
        "isAcceptingNewPatients": true,
        "priceRange": "$$"
      },
      {
        "@type": "FAQPage",
        "mainEntity": allFaqs.map(faq => ({
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
            "name": "McKinney",
            "item": "https://medmethoddirect.com/texas/mckinney"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#111111] font-['Montserrat']">
      <Helmet>
        <title>Menopause Doctor & Hormone Therapy in McKinney, TX | MedMethod Direct</title>
        <meta name="description" content="Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in McKinney, TX. Consult with Dr. Jumana Al-Deek, DO. HSA/FSA accepted." />
        <link rel="canonical" href="https://medmethoddirect.com/texas/mckinney" />
        <meta property="og:title" content="Menopause Doctor & Hormone Therapy in McKinney, TX | MedMethod Direct" />
        <meta property="og:description" content="Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in McKinney, TX. Consult with Dr. Jumana Al-Deek, DO. HSA/FSA accepted." />
        <meta property="og:url" content="https://medmethoddirect.com/texas/mckinney" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D0D1A] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-[#7A1E7E]/30 text-[#E8339E] font-semibold text-sm mb-6 border border-[#E8339E]/30">
            Licensed in Texas
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Expert Menopause & Hormone Therapy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">McKinney, TX</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Comprehensive, personalized virtual care for women entering perimenopause and menopause. Led by Dr. Jumana Al-Deek, DO.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E8339E] hover:bg-[#7A1E7E] text-white font-bold py-4 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg shadow-[#E8339E]/30"
          >
            Book Your Consultation
          </button>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6 text-center">
              Specialized Women's Healthcare for McKinney Residents
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                As one of the fastest-growing cities in the US, McKinney is home to many young, affluent families and women who are navigating the complex transitions of perimenopause and menopause. Finding a specialized <strong>menopause doctor in McKinney, TX</strong> shouldn't be a challenge. MedMethod Direct brings expert, compassionate care directly to you through our secure telehealth platform.
              </p>
              <p className="mb-4">
                Whether you live near Historic Downtown McKinney, Craig Ranch, Stonebridge Ranch, or anywhere in Collin County, our 100% virtual clinic offers convenient access to personalized <strong>hormone therapy in McKinney, TX</strong>. Dr. Jumana Al-Deek, DO, provides comprehensive evaluations and evidence-based treatments tailored to your unique symptoms and health goals.
              </p>
              <p className="mb-4">
                In addition to hormone optimization, we offer medically supervised <strong>GLP-1 in McKinney, TX</strong> for effective, sustainable weight loss. Our approach combines advanced medical treatments with lifestyle guidance to help you feel your best.
              </p>
              <p>
                Experience the convenience of premium <strong>telehealth in McKinney, TX</strong>. We partner with local LabCorp and Quest Diagnostics facilities for your necessary blood work, making the process seamless. While we do not bill insurance, we proudly accept HSA and FSA cards for our services, including the initial $449 Clinical Diagnostic & Setup Fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />
      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />

      {/* Nearby Cities Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-[#0D0D1A] mb-6 flex items-center justify-center gap-2">
            <MapPin className="text-[#E8339E]" size={24} />
            Serving McKinney & Surrounding Areas
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyCities.map((city) => (
              <a 
                key={city.slug}
                href={`/texas/${city.slug}`}
                className="bg-white border border-gray-300 hover:border-[#E8339E] hover:text-[#E8339E] text-gray-700 py-2 px-4 rounded-full transition-colors duration-300 text-sm font-medium shadow-sm"
              >
                {city.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D1A] mb-10 text-center">
              Frequently Asked Questions in McKinney
            </h2>
            <div className="space-y-4">
              {allFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-[#0D0D1A] pr-4">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="text-[#E8339E] flex-shrink-0" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-gray-700">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7A1E7E]/30 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Reclaim Your Vitality?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the women in McKinney who have transformed their health with MedMethod Direct. Schedule your consultation with Dr. Al-Deek today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#E8339E] hover:bg-[#7A1E7E] text-white font-bold py-4 px-8 rounded-full transition-colors duration-300 text-lg w-full sm:w-auto shadow-lg shadow-[#E8339E]/30"
            >
              Start Your Journey
            </button>
            <div className="flex items-center gap-2 text-gray-300 mt-4 sm:mt-0">
              <CheckCircle2 className="text-[#E8339E]" size={20} />
              <span>HSA/FSA Accepted</span>
            </div>
          </div>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationMcKinney;
