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

const LocationSugarLand = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const city = "Sugar Land";
  const state = "TX";
  const stateFull = "Texas";
  const slug = "sugar-land";
  const canonicalUrl = `https://medmethoddirect.com/texas/${slug}`;

  const nearbyCities = [
    { name: "Missouri City", slug: "missouri-city" },
    { name: "Stafford", slug: "stafford" },
    { name: "Richmond", slug: "richmond" },
    { name: "Rosenberg", slug: "rosenberg" },
    { name: "Fulshear", slug: "fulshear" },
    { name: "Sienna", slug: "sienna" }
  ];

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for my menopause consultation?`,
      a: `No, MedMethod Direct is a 100% virtual clinic. You can consult with Dr. Jumana Al-Deek, DO from the comfort of your home in ${city} or anywhere in Fort Bend County via our secure telehealth platform.`
    },
    {
      q: `Where can I get my lab work done in ${city}?`,
      a: `We partner with major national laboratories. You can visit any convenient LabCorp or Quest Diagnostics location in ${city}, Missouri City, or surrounding areas for your required blood work.`
    },
    {
      q: `How much does the initial consultation cost for ${city} residents?`,
      a: `The initial Clinical Diagnostic & Setup Fee is $449. This comprehensive fee covers your initial consultation with Dr. Al-Deek, lab orders, and personalized treatment plan development.`
    },
    {
      q: `Do you accept insurance for hormone therapy in ${city}?`,
      a: `We do not bill insurance directly, which allows us to provide highly personalized care without restrictions. However, we do accept HSA and FSA cards for payment.`
    },
    {
      q: `How quickly can I get started with GLP-1 weight loss in ${city}?`,
      a: `You can schedule your initial telehealth consultation typically within a few days. Once your lab results are in from a local ${city} facility, Dr. Al-Deek will review them and prescribe your customized GLP-1 treatment plan if appropriate.`
    },
    {
      q: `Is my prescription sent to a local pharmacy in ${city}?`,
      a: `Depending on your specific treatment plan, prescriptions may be sent to your preferred local pharmacy in ${city} or fulfilled through our partner compounding pharmacies and shipped directly to your door.`
    }
  ];

  const allFaqs = [...localFaqs, ...pricingFaqs.slice(0, 4)];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city} Menopause & Hormone Therapy`,
        "image": "https://medmethoddirect.com/images/logo.png",
        "url": canonicalUrl,
        "telephone": "+1-800-555-0199",
        "priceRange": "$$",
        "medicalSpecialty": ["Endocrine", "Gynecologic"],
        "areaServed": {
          "@type": "City",
          "name": city,
          "containedInPlace": {
            "@type": "State",
            "name": stateFull
          }
        },
        "description": `Virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving ${city}, ${state}. Led by Dr. Jumana Al-Deek, DO.`,
        "makesOffer": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "Hormone Replacement Therapy"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "GLP-1 Weight Loss"
            }
          }
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
            "item": "https://medmethoddirect.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": stateFull,
            "item": "https://medmethoddirect.com/texas"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": city,
            "item": canonicalUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#111111] font-['Montserrat',sans-serif]">
      <Helmet>
        <title>Menopause Doctor & Hormone Therapy in {city}, {state} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in ${city}, ${state}. Consult with Dr. Jumana Al-Deek, DO from home. HSA/FSA accepted.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Menopause Doctor & Hormone Therapy in ${city}, ${state} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss in ${city}, ${state}. Consult with Dr. Jumana Al-Deek, DO from home.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrg)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7A1E7E]/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8339E]/10 text-[#E8339E] font-semibold text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Licensed in {stateFull}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Menopause Care & Hormone Therapy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">{city}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Get personalized, physician-led care from the comfort of your home. Specializing in BHRT and GLP-1 weight loss for women in {city} and Fort Bend County.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
              >
                Book Your Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro & SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6">Comprehensive Women's Health in {city}</h2>
            <p>
              Finding a specialized <strong>menopause doctor in {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, we bring expert care directly to you. Led by Dr. Jumana Al-Deek, DO, our virtual clinic provides comprehensive solutions for women navigating perimenopause and menopause.
            </p>
            <p>
              Whether you're experiencing hot flashes, sleep disturbances, or mood changes, our personalized <strong>hormone therapy in {city} TX</strong> is designed to restore your balance and vitality. We utilize bioidentical hormone replacement therapy (BHRT) tailored to your unique physiological needs.
            </p>
            <p>
              In addition to hormone optimization, we offer medical weight management. If you're looking for effective <strong>GLP-1 in {city} TX</strong>, our medically supervised programs provide the support and medication necessary for sustainable weight loss.
            </p>
            <p>
              Experience the convenience of modern healthcare with our <strong>telehealth in {city} TX</strong> services. From your initial consultation to ongoing monitoring, receive top-tier medical care without leaving your home in Fort Bend County. We partner with local LabCorp and Quest Diagnostics facilities for your convenience, and while we don't bill insurance, we gladly accept HSA/FSA cards for our $449 Clinical Diagnostic & Setup Fee and ongoing care.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />
      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D1A] mb-4">Frequently Asked Questions in {city}</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our virtual clinic services in your area.</p>
          </div>
          
          <div className="space-y-4">
            {allFaqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-lg text-[#0D0D1A] pr-8">{faq.q}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-center text-[#0D0D1A] mb-8">Serving {city} and Surrounding Areas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyCities.map((nearby) => (
              <a
                key={nearby.slug}
                href={`/texas/${nearby.slug}`}
                className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#E8339E]/5 hover:border-[#E8339E]/30 hover:text-[#E8339E] transition-colors text-sm font-medium"
              >
                {nearby.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7A1E7E]/20 to-[#E8339E]/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the women in {city} who have transformed their lives with our personalized hormone therapy and weight loss programs.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8339E]/20"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationSugarLand;
