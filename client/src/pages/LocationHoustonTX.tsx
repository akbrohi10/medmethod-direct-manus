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

const LocationHouston = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const city = "Houston";
  const state = "Texas";
  const stateAbbr = "TX";
  const slug = "houston";
  const url = `https://medmethoddirect.com/texas/${slug}`;

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for menopause treatment?`,
      a: `No, MedMethod Direct is a 100% virtual clinic. Dr. Jumana Al-Deek, DO provides expert telehealth care for women in ${city} and surrounding areas like Katy, Sugar Land, and The Woodlands. You can complete your consultation from the comfort of your home.`
    },
    {
      q: `Where can I get my labs done in ${city}?`,
      a: `We partner with major national laboratories. You can visit any convenient LabCorp or Quest Diagnostics location in the ${city} metro area for your required blood work.`
    },
    {
      q: `Do you accept insurance for hormone therapy in ${city}?`,
      a: `We do not bill insurance directly, which allows us to provide highly personalized care without restrictions. However, we do accept HSA and FSA cards for our services, including the $449 Clinical Diagnostic & Setup Fee.`
    },
    {
      q: `What weight loss programs are available for women in ${city}?`,
      a: `We offer comprehensive medical weight loss programs including GLP-1 medications, tailored specifically for women's unique metabolic needs during perimenopause and menopause.`
    },
    {
      q: `How quickly can I get an appointment with a menopause doctor in ${city}?`,
      a: `Because we operate via telehealth, we can often schedule your initial consultation with Dr. Al-Deek much sooner than traditional in-person clinics in the ${city} area.`
    },
    {
      q: `Are your services available in ${city} suburbs?`,
      a: `Yes! Our telehealth services are available to all women residing in Texas, including ${city} suburbs such as Pearland, Missouri City, Cypress, Spring, Memorial, River Oaks, and West University Place.`
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city} Menopause & Hormone Therapy`,
        "image": "https://medmethoddirect.com/logo.png",
        "url": url,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": stateAbbr,
          "addressCountry": "US"
        },
        "medicalSpecialty": ["Endocrine", "Gynecologic"],
        "description": `Virtual menopause, hormone therapy, and GLP-1 weight loss clinic serving women in ${city}, ${stateAbbr}.`,
        "areaServed": {
          "@type": "City",
          "name": city
        }
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
    <div className="min-h-screen bg-white font-['Montserrat',sans-serif] text-[#111111]">
      <Helmet>
        <title>Menopause Doctor & Hormone Therapy in {city}, {stateAbbr} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss for women in ${city}, ${stateAbbr}. Telehealth with Dr. Jumana Al-Deek, DO. HSA/FSA accepted.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Menopause Doctor & Hormone Therapy in ${city}, ${stateAbbr} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss for women in ${city}, ${stateAbbr}. Telehealth with Dr. Jumana Al-Deek, DO.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative bg-[#0D0D1A] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/20 opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-[#E8339E]" />
            <span className="text-sm font-medium tracking-wide uppercase">Licensed in {state}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Expert Menopause Care &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">
              Hormone Therapy in {city}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Comprehensive virtual care for women in {city} and surrounding areas. 
            Led by Dr. Jumana Al-Deek, DO.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E8339E] hover:bg-[#7A1E7E] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Book Your Consultation
          </button>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-sm text-gray-500">
          <a href="/" className="hover:text-[#E8339E]">Home</a>
          <span className="mx-2">&gt;</span>
          <a href="/texas" className="hover:text-[#E8339E]">{state}</a>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">{city}</span>
        </div>
      </div>

      {/* Keyword-Rich Intro Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#7A1E7E]">Virtual Women's Health Clinic Serving {city}</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Finding a specialized <strong>menopause doctor {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, we bring expert care directly to you through our secure telehealth platform. Whether you're experiencing hot flashes, weight gain, mood changes, or sleep disturbances, Dr. Jumana Al-Deek, DO provides personalized treatment plans tailored to your unique needs.
          </p>
          <p>
            Our comprehensive <strong>hormone therapy {city} TX</strong> is designed to help you regain balance and vitality during perimenopause and menopause. We understand that every woman's journey is different, which is why we focus on individualized care rather than a one-size-fits-all approach.
          </p>
          <p>
            Struggling with weight management? We also offer medically supervised <strong>GLP-1 {city} TX</strong> programs specifically formulated for women navigating hormonal changes. Combined with our convenient <strong>telehealth {city} TX</strong> services, achieving your health goals has never been more accessible.
          </p>
          <p>
            We proudly serve the entire {city} metro area, including Katy, Sugar Land, The Woodlands, Pearland, Missouri City, Cypress, Spring, Memorial, River Oaks, and West University Place. With local lab testing available through LabCorp and Quest Diagnostics, and a transparent $449 Clinical Diagnostic & Setup Fee (HSA/FSA accepted), getting started is simple and straightforward.
          </p>
        </div>
      </section>

      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />
      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#111111]">Frequently Asked Questions in {city}</h2>
          <div className="space-y-4">
            {localFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-lg text-[#7A1E7E]">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
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
      </section>

      {/* Nearby Cities */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Other Texas Cities We Serve</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['Austin', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock'].map((nearbyCity) => (
            <a 
              key={nearbyCity}
              href={`/texas/${nearbyCity.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-[#E8339E] hover:text-[#E8339E] transition-colors"
            >
              {nearbyCity}
            </a>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-gradient-to-br from-[#7A1E7E] to-[#E8339E] text-white px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health in {city}?</h2>
          <p className="text-xl mb-10 text-white/90">
            Schedule your consultation with Dr. Jumana Al-Deek today and start your journey to feeling like yourself again.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-[#7A1E7E] hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Get Started Now
          </button>
          <p className="mt-6 text-sm text-white/80">
            HSA/FSA Accepted • No Insurance Required
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationHouston;
