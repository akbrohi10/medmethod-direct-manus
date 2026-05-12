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

const LocationPlano = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const city = "Plano";
  const state = "TX";
  const slug = "plano";
  const url = `https://medmethoddirect.com/texas/${slug}`;

  const localFaqs = [
    {
      q: `Do I need to visit a clinic in ${city} for menopause treatment?`,
      a: `No, MedMethod Direct provides 100% virtual care. You can consult with Dr. Jumana Al-Deek, DO from the comfort of your home in ${city}, whether you're near Legacy West, Downtown Plano, or anywhere else in the area. We use local LabCorp and Quest Diagnostics facilities for any necessary blood work.`
    },
    {
      q: `How do I get my GLP-1 medication in ${city}?`,
      a: `After your consultation and lab work, if a GLP-1 medication is prescribed, it will be shipped directly to your door in ${city} from our partner compounding pharmacies. You don't need to wait in line at a local pharmacy.`
    },
    {
      q: `Can I use my HSA/FSA for hormone therapy in ${city}?`,
      a: `Yes! While we do not bill insurance directly, you can use your HSA or FSA cards to pay for your consultations, the $449 Clinical Diagnostic & Setup Fee, and your ongoing hormone therapy or weight loss programs.`
    },
    {
      q: `Where can I get my lab work done in ${city}?`,
      a: `We partner with major national laboratories including LabCorp and Quest Diagnostics. There are multiple convenient locations throughout ${city} and neighboring areas like Richardson and Allen where you can complete your required lab work.`
    },
    {
      q: `How quickly can I start my weight loss program in ${city}?`,
      a: `You can schedule your initial virtual consultation within days. Once your lab results are in and reviewed by Dr. Al-Deek, your customized GLP-1 or hormone therapy plan is created, and medications are shipped directly to your home.`
    },
    {
      q: `What makes MedMethod Direct different from other clinics in ${city}?`,
      a: `Unlike traditional clinics that require in-person visits, we offer specialized, physician-led care focused exclusively on women's health, menopause, and medical weight loss. Dr. Al-Deek provides personalized, evidence-based treatments with the convenience of telehealth.`
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": `MedMethod Direct - ${city}, ${state}`,
        "image": "https://medmethoddirect.com/logo.png",
        "url": url,
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state,
          "addressCountry": "US"
        },
        "medicalSpecialty": ["Endocrine", "PrimaryCare"],
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
            "item": "https://medmethoddirect.com"
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
        <title>Menopause & GLP-1 Weight Loss Clinic in {city}, {state} | MedMethod Direct</title>
        <meta name="description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss for women in ${city}, ${state}. Consult with Dr. Jumana Al-Deek, DO online. HSA/FSA accepted.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Menopause & GLP-1 Weight Loss Clinic in ${city}, ${state} | MedMethod Direct`} />
        <meta property="og:description" content={`Expert virtual menopause care, hormone therapy, and GLP-1 weight loss for women in ${city}, ${state}. Consult with Dr. Jumana Al-Deek, DO online.`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/10 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-6">
              <MapPin className="w-4 h-4 text-[#E8339E]" />
              <span className="text-sm font-medium tracking-wide uppercase">Licensed in Texas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Menopause & Weight Loss Care in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">{city}, {state}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Virtual, physician-led care for women. Access premium hormone therapy and GLP-1 medications from the comfort of your home.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-[#E8339E]/30 transition-all duration-300"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-[#E8339E] transition-colors">Home</a>
            <span className="mx-2">›</span>
            <a href="/texas" className="hover:text-[#E8339E] transition-colors">Texas</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{city}</span>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0D0D1A] mb-6">
              Comprehensive Women's Health Care in {city}
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Finding a specialized <strong>menopause doctor in {city} TX</strong> shouldn't be a challenge. At MedMethod Direct, we bring expert care directly to you. Whether you're navigating the corporate world at Toyota, FedEx, or JCPenney headquarters, or managing a busy family life in West Plano, our telehealth platform makes it easy to prioritize your health.
              </p>
              <p className="mb-4">
                We offer customized <strong>hormone therapy in {city} TX</strong> designed to alleviate hot flashes, mood changes, sleep disturbances, and other symptoms of perimenopause and menopause. Led by Dr. Jumana Al-Deek, DO, our approach is rooted in evidence-based medicine and tailored to your unique biology.
              </p>
              <p className="mb-4">
                For women struggling with weight management, our medical weight loss programs feature advanced <strong>GLP-1 in {city} TX</strong>. Combined with personalized lifestyle guidance, these treatments offer a sustainable path to achieving your health goals.
              </p>
              <p>
                Experience the convenience of <strong>telehealth in {city} TX</strong>. Complete your lab work at local LabCorp or Quest Diagnostics facilities, and have your medications shipped directly to your door. We accept HSA/FSA cards for all services, including our comprehensive $449 Clinical Diagnostic & Setup Fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />
      <Services onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D0D1A] mb-12">
              Frequently Asked Questions in {city}
            </h2>
            <div className="space-y-4">
              {localFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-semibold text-[#0D0D1A] pr-8">{faq.q}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-[#E8339E] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === index && (
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
            <h3 className="text-xl font-bold text-[#0D0D1A] mb-6">Serving {city} and Surrounding Areas</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Richardson', 'Allen', 'Murphy', 'Wylie', 'Lucas', 'Parker'].map((nearbyCity) => (
                <a 
                  key={nearbyCity}
                  href={`/texas/${nearbyCity.toLowerCase().replace(/ /g, '-')}`}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-[#E8339E] hover:text-white transition-colors text-sm font-medium"
                >
                  {nearbyCity}, TX
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A1E7E]/20 to-[#E8339E]/10 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Reclaim Your Vitality?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the women in {city} who have transformed their lives with MedMethod Direct. Schedule your virtual consultation today.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-[#E8339E]/30 transition-all duration-300"
            >
              Book Your Consultation
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

export default LocationPlano;
