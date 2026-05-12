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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-plano-cWs2iCpx65xUPh34NZVtu9.webp";
const HERO_IMAGE_OG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-plano-Nrz5PYewGXoN8XH69exon5.png";

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
        <meta property="og:image" content={HERO_IMAGE_OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={HERO_IMAGE_OG} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
                <span style={{ color: "#333" }}>Plano</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Serving Plano, TX
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
                for Plano women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in Plano, TX.
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
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradPlano)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradPlano" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
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
                  alt="Virtual menopause doctor and hormone therapy for women in Plano, TX — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Frisco · Richardson · Allen · McKinney
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


      {/* ── Legal / LegitScript compliance disclaimer ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <p className="text-xs text-gray-400 leading-relaxed text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <strong className="text-gray-500">Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. All prescriptions are issued only after a valid patient-provider relationship has been established through a proper medical evaluation. Individual results may vary. Consult your healthcare provider before starting any new treatment. MedMethod Direct is licensed to practice in the states listed on this site only.{" "}
            <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>{" · "}
            <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" · "}
            <a href="/hipaa-notice" className="underline hover:text-gray-600">HIPAA Notice</a>
          </p>
        </div>
      </div>
      <Footer onConsultClick={() => setIsModalOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setIsModalOpen(true)} />
      <ConsultationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationPlano;
