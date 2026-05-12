/**
 * LocationHoustonTX.tsx — Houston, Texas City Page
 * medmethod-location-seo skill compliant
 * Primary keyword: hormone therapy Houston TX
 * IMAGE RULE: Single physician or patient face on laptop screen only — no group Zoom calls
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { CheckCircle, ChevronDown, ChevronUp, MapPin, Package, Smartphone, Star, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import { pricingFaqs } from "@/data/pricingFaqs";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-houston-9hTc5LM7cxkXxFo9knev4F.webp";
const HERO_IMAGE_OG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tx-hero-houston-kGPsMBfrPFJkfHuYHHoEV9.png";

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
        <meta property="og:image" content={HERO_IMAGE_OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={HERO_IMAGE_OG} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
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
                <span style={{ color: "#333" }}>{city}</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase"
                style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Serving {city}, TX
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
                for {city} women
              </h1>
              <p
                className="text-base mb-6 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}
              >
                A virtual clinic combining physician-prescribed hormone therapy, GLP-1 medical weight loss, and menopause care — all in one program, for women in {city}, TX.
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
                  <circle cx="8" cy="8" r="8" fill="url(#vcGradHouston)"/>
                  <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs><linearGradient id="vcGradHouston" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#E8339E"/><stop offset="1" stopColor="#7A1E7E"/></linearGradient></defs>
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
                  alt="Virtual menopause doctor and hormone therapy for women in Houston, TX — MedMethod Direct"
                  className="w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Serving Houston · Katy · Sugar Land · The Woodlands
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(135deg, #E8339E 0%, #B040B0 50%, #7A1E7E 100%)" }} />
      </section>

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
