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

const LocationSanAntonio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const localFaqs = [
    {
      q: "Do you offer in-person appointments in San Antonio?",
      a: "MedMethod Direct is a 100% virtual clinic. Dr. Jumana Al-Deek, DO provides comprehensive telehealth consultations for women across San Antonio, from Alamo Heights to Stone Oak, without the need for an office visit."
    },
    {
      q: "Where can I get my lab work done in San Antonio?",
      a: "We partner with major national laboratories. You can visit any LabCorp or Quest Diagnostics location in the San Antonio area, including New Braunfels and Boerne, for your required blood work."
    },
    {
      q: "Do you accept insurance for hormone therapy or GLP-1 in San Antonio?",
      a: "We do not bill insurance directly, allowing us to provide transparent pricing and personalized care without insurance restrictions. However, we do accept HSA/FSA cards for our services."
    },
    {
      q: "What is the cost to get started?",
      a: "There is a one-time $449 Clinical Diagnostic & Setup Fee, which covers your initial comprehensive consultation with Dr. Al-Deek, lab order review, and personalized treatment plan creation."
    },
    {
      q: "How quickly can I get an appointment in San Antonio?",
      a: "Because we operate virtually, we can often accommodate new patients from San Antonio and surrounding Hill Country areas much faster than traditional in-person clinics. You can schedule your consultation online today."
    },
    {
      q: "Are your weight loss and menopause programs available to military families?",
      a: "Yes! We proudly serve women throughout San Antonio, including military families. As long as you are physically located in Texas during your consultation, you are eligible for our telehealth services."
    }
  ];

  const nearbyCities = [
    { name: 'Austin', slug: 'austin' },
    { name: 'Houston', slug: 'houston' },
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Fort Worth', slug: 'fort-worth' },
    { name: 'El Paso', slug: 'el-paso' },
    { name: 'Arlington', slug: 'arlington' },
    { name: 'Corpus Christi', slug: 'corpus-christi' },
    { name: 'Plano', slug: 'plano' },
    { name: 'Lubbock', slug: 'lubbock' }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "name": "MedMethod Direct - San Antonio",
        "image": "https://medmethoddirect.com/logo.png",
        "url": "https://medmethoddirect.com/texas/san-antonio",
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "San Antonio",
          "addressRegion": "TX",
          "addressCountry": "US"
        },
        "medicalSpecialty": ["Endocrine", "PrimaryCare"],
        "description": "Virtual menopause, hormone therapy, and GLP-1 weight loss clinic for women in San Antonio, TX.",
        "founder": {
          "@type": "Person",
          "name": "Dr. Jumana Al-Deek, DO"
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
            "name": "San Antonio",
            "item": "https://medmethoddirect.com/texas/san-antonio"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#111111] font-['Montserrat',sans-serif]">
      <Helmet>
        <title>Menopause & GLP-1 Weight Loss Clinic San Antonio, TX | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause, hormone therapy, and GLP-1 weight loss clinic for women in San Antonio, TX. Consult with Dr. Jumana Al-Deek, DO online. HSA/FSA accepted." />
        <link rel="canonical" href="https://medmethoddirect.com/texas/san-antonio" />
        <meta property="og:title" content="Menopause & GLP-1 Weight Loss Clinic San Antonio, TX | MedMethod Direct" />
        <meta property="og:description" content="Virtual menopause, hormone therapy, and GLP-1 weight loss clinic for women in San Antonio, TX. Consult with Dr. Jumana Al-Deek, DO online. HSA/FSA accepted." />
        <meta property="og:url" content="https://medmethoddirect.com/texas/san-antonio" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <Navbar onConsultClick={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#E8339E] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white mb-8">
              <MapPin className="w-4 h-4 text-[#E8339E]" />
              <span className="text-sm font-medium tracking-wide uppercase">Licensed in Texas</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Women's Healthcare in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]">
                San Antonio, TX
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Comprehensive virtual care for menopause, hormone optimization, and medical weight loss. Expert guidance from Dr. Jumana Al-Deek, DO, from the comfort of your home.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(232,51,158,0.3)]"
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-8">
              Specialized Care for San Antonio Women
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Whether you're navigating the challenges of perimenopause or seeking effective weight management solutions, finding the right <strong>menopause doctor in San Antonio, TX</strong> shouldn't be a struggle. MedMethod Direct brings specialized care directly to you. Our virtual clinic serves women throughout the Alamo City, from Alamo Heights and Stone Oak to Boerne, New Braunfels, Helotes, Shavano Park, and Fair Oaks Ranch.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We offer personalized <strong>hormone therapy in San Antonio, TX</strong> tailored to your unique biology and symptoms. Dr. Jumana Al-Deek, DO, takes the time to understand your health history and goals, creating a comprehensive treatment plan that addresses the root cause of your concerns.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              For those struggling with weight management, our medical weight loss programs include access to <strong>GLP-1 in San Antonio, TX</strong>. By combining advanced medications with lifestyle guidance, we help you achieve sustainable results. Experience the convenience of premium <strong>telehealth in San Antonio, TX</strong>—no waiting rooms, no traffic, just expert care when and where you need it.
            </p>
          </div>
        </div>
      </section>

      <Services onConsultClick={() => setIsModalOpen(true)} />
      <PopularPrograms onConsultClick={() => setIsModalOpen(true)} />
      <HowItWorks onConsultClick={() => setIsModalOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setIsModalOpen(true)} />

      {/* Local FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
                San Antonio Patient FAQs
              </h2>
              <p className="text-lg text-gray-600">
                Common questions about our virtual clinic services in the San Antonio area.
              </p>
            </div>
            
            <div className="space-y-4">
              {localFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-semibold text-[#111111] pr-4">{faq.q}</span>
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

      {/* Nearby Cities */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              Other Texas Cities We Serve
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/texas/${city.slug}`}
                  className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#E8339E] hover:text-white hover:border-[#E8339E] transition-colors text-sm font-medium"
                >
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0D0D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7A1E7E] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Health in San Antonio?
            </h2>
            <p className="text-lg text-gray-300 mb-10">
              Join the women across Texas who have found relief and vitality through our personalized virtual care programs.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(232,51,158,0.3)]"
            >
              Start Your Journey Today
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

export default LocationSanAntonio;
