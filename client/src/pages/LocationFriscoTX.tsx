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

const LocationFrisco = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const city = "Frisco";
  const state = "TX";
  const slug = "frisco";
  const url = `https://medmethoddirect.com/texas/${slug}`;

  const nearbyCities = [
    { name: "Prosper", slug: "prosper" },
    { name: "Little Elm", slug: "little-elm" },
    { name: "The Colony", slug: "the-colony" },
    { name: "Celina", slug: "celina" },
    { name: "McKinney", slug: "mckinney" }
  ];

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for menopause treatment?`,
      a: `No, MedMethod Direct is a 100% virtual telehealth clinic. Dr. Jumana Al-Deek, DO, provides comprehensive menopause and hormone therapy consultations online for women in ${city} and throughout Texas. You can complete your lab work at any local LabCorp or Quest Diagnostics in the ${city} area.`
    },
    {
      q: `Where can I get my labs done in ${city}?`,
      a: `We partner with major national laboratories. You can visit any convenient LabCorp or Quest Diagnostics location in ${city}, whether you're near the Star, Stonebriar Centre, or closer to West ${city}.`
    },
    {
      q: `Do you prescribe GLP-1 weight loss medications for ${city} residents?`,
      a: `Yes, we offer medically supervised GLP-1 weight loss programs for eligible patients in ${city}. Our comprehensive approach includes medication management, nutritional guidance, and regular virtual check-ins.`
    },
    {
      q: `Do you accept insurance for patients in ${city}?`,
      a: `MedMethod Direct operates on a direct-pay model and does not bill insurance. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee and ongoing memberships.`
    },
    {
      q: `How quickly can I get an appointment in ${city}?`,
      a: `Because we are a telehealth clinic, we can often accommodate new patients from ${city} much faster than traditional brick-and-mortar clinics. You can schedule your initial consultation online at your convenience.`
    },
    {
      q: `Is hormone therapy safe?`,
      a: `When prescribed and monitored by a qualified physician like Dr. Al-Deek, hormone therapy is a safe and effective treatment for many women experiencing menopause symptoms. We conduct thorough evaluations and regular lab testing to ensure your safety and optimal results.`
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city}, ${state}`,
        "url": url,
        "logo": "https://medmethoddirect.com/logo.png",
        "image": "https://medmethoddirect.com/images/telehealth-consultation.jpg",
        "description": `Virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving ${city}, ${state}.`,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.1507",
          "longitude": "-96.8236"
        },
        "areaServed": [
          city,
          ...nearbyCities.map(c => c.name)
        ],
        "medicalSpecialty": ["Endocrinology", "Gynecology", "PrimaryCare"],
        "priceRange": "$$"
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
        <title>Menopause Doctor & Hormone Therapy in {city}, {state} | MedMethod Direct</title>
        <meta name="description" content={`Virtual menopause clinic serving ${city}, ${state}. Expert hormone therapy and GLP-1 weight loss with Dr. Jumana Al-Deek, DO. Telehealth appointments available.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Menopause Doctor & Hormone Therapy in ${city}, ${state} | MedMethod Direct`} />
        <meta property="og:description" content={`Virtual menopause clinic serving ${city}, ${state}. Expert hormone therapy and GLP-1 weight loss with Dr. Jumana Al-Deek, DO. Telehealth appointments available.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D0D1A] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
              <MapPin className="w-4 h-4 text-[#E8339E]" />
              <span className="text-sm font-medium tracking-wider uppercase">Licensed in Texas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Menopause & Weight Loss Care for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">{city}</span> Women
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Skip the waiting room. Get personalized hormone therapy and GLP-1 weight loss treatments from the comfort of your home in {city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg hover:shadow-lg hover:shadow-[#E8339E]/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Book Your Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#E8339E] transition-colors">Home</a>
              <span>&gt;</span>
              <a href="/texas" className="hover:text-[#E8339E] transition-colors">Texas</a>
              <span>&gt;</span>
              <span className="text-[#111111] font-medium">{city}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-8">
              Your Premier Virtual Clinic in {city}, {state}
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                As one of the fastest-growing large cities in Texas, {city} is home to busy, active women who deserve healthcare that fits their lifestyle. Whether you're juggling family life in Prosper, managing a career near the Star, or enjoying the vibrant community of Stonebriar, finding the right <strong>menopause doctor {city} TX</strong> shouldn't add stress to your day.
              </p>
              <p className="mb-6">
                MedMethod Direct brings expert care directly to you. Led by Dr. Jumana Al-Deek, DO, our 100% virtual clinic specializes in personalized <strong>hormone therapy {city} TX</strong> and medically supervised <strong>GLP-1 {city} TX</strong> weight loss programs. We understand the unique needs of women in our community and provide compassionate, evidence-based care without the hassle of traditional office visits.
              </p>
              <p className="mb-6">
                Experience the convenience of <strong>telehealth {city} TX</strong>. We partner with local LabCorp and Quest Diagnostics facilities throughout the {city} area, making it easy to complete your necessary lab work. While we do not bill insurance, we proudly accept HSA and FSA cards for our services, including our comprehensive $449 Clinical Diagnostic & Setup Fee.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-[#7A1E7E] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Why Choose Us
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8339E] mt-2 flex-shrink-0"></div>
                    <span>100% virtual consultations from home</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8339E] mt-2 flex-shrink-0"></div>
                    <span>Expert care by Dr. Jumana Al-Deek, DO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8339E] mt-2 flex-shrink-0"></div>
                    <span>Convenient local lab testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8339E] mt-2 flex-shrink-0"></div>
                    <span>HSA/FSA accepted</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-[#7A1E7E] mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Serving {city} & Beyond
                </h3>
                <p className="text-gray-700 mb-4">
                  We proudly serve patients throughout the {city} area, including nearby communities:
                </p>
                <div className="flex flex-wrap gap-2">
                  {nearbyCities.map((nc) => (
                    <a 
                      key={nc.slug} 
                      href={`/texas/${nc.slug}`}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#E8339E] hover:text-[#E8339E] transition-colors"
                    >
                      {nc.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />
      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
                Frequently Asked Questions in {city}
              </h2>
              <p className="text-lg text-gray-600">
                Common questions from our patients in the {city} area.
              </p>
            </div>
            
            <div className="space-y-4">
              {localFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E8339E]/30 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-[#111111] pr-8">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Feel Like Yourself Again?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join the women in {city} who have transformed their health with MedMethod Direct. Schedule your virtual consultation today.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg hover:shadow-lg hover:shadow-[#E8339E]/30 transition-all duration-300 transform hover:-translate-y-1"
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

export default LocationFrisco;
