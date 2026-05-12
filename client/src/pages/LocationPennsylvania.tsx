/**
 * MedMethod Direct — Pennsylvania State Hub
 * IMAGE RULE: single face on laptop screen only (physician or patient in telehealth).
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { MapPin, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConsultationModal from "@/components/ConsultationModal";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/pa-hero-state-FoXJjK2ovNWFFhvKLaRMvL.webp";

const CITIES = [
  { name: "Philadelphia", slug: "philadelphia", tagline: "Main Line & Center City's premier virtual women's health clinic" },
  { name: "Pittsburgh", slug: "pittsburgh", tagline: "Shadyside & Fox Chapel hormone therapy and weight loss" },
  { name: "Wayne", slug: "wayne", tagline: "Main Line's highest-income corridor, served virtually" },
  { name: "Doylestown", slug: "doylestown", tagline: "Bucks County women's hormone & GLP-1 care" },
  { name: "Newtown Square", slug: "newtown-square", tagline: "Delaware County virtual women's health" },
  { name: "Malvern", slug: "malvern", tagline: "Chester County pharma corridor telehealth care" },
];

const JSONLD_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "MedMethod Direct",
  "url": "https://www.medmethoddirect.com/pennsylvania",
  "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women across Pennsylvania, including Philadelphia, Pittsburgh, and the Main Line corridor.",
  "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  "areaServed": { "@type": "State", "name": "Pennsylvania" },
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", "name": "Medical Weight Loss" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" }
  ]
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" },
    { "@type": "ListItem", "position": 2, "name": "Pennsylvania", "item": "https://www.medmethoddirect.com/pennsylvania" }
  ]
};

export default function LocationPennsylvania() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Pennsylvania Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women across Pennsylvania. Board-certified physicians, no office visit. Serving Philadelphia, Pittsburgh, Main Line & beyond." />
        <link rel="canonical" href="https://www.medmethoddirect.com/pennsylvania" />
        <meta property="og:title" content="Pennsylvania Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women across Pennsylvania. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/pennsylvania" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pennsylvania Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women across Pennsylvania. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_BUSINESS)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: "#E8339E" }}>Pennsylvania</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Pennsylvania</p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Virtual Women's Health Across <span style={{ color: "#E8339E" }}>Pennsylvania</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Board-certified physicians. GLP-1 therapy. Hormone optimization. 100% virtual — serving Philadelphia, Pittsburgh, the Main Line, and communities across the Commonwealth.
            </p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}>
              Schedule Free Consultation
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Pennsylvania" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* About PA */}
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health Across Pennsylvania</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>
            Pennsylvania is home to some of the most affluent and health-conscious communities on the East Coast. The Philadelphia Main Line corridor — spanning Wayne, Malvern, Newtown Square, and Doylestown — has among the highest household incomes in the state, with a large population of professional women 40–65 who are accustomed to premium, convenient services. Pittsburgh's Shadyside and Fox Chapel neighborhoods mirror that profile on the western side of the Commonwealth.
          </p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>
            Despite access to world-class academic medical centers like Penn Medicine and UPMC, specialist wait times for perimenopause management and hormone therapy can stretch months. MedMethod Direct bypasses that entirely. Our board-certified physicians deliver personalized lab-based BHRT protocols, semaglutide and tirzepatide prescriptions, and ongoing physician oversight — all via telehealth, with medication shipped directly to your Pennsylvania address.
          </p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>
            MedMethod Direct is fully licensed to practice medicine in Pennsylvania. Our physicians comply with all PA telehealth prescribing regulations and every program uses FDA-approved and compounded medications from accredited 503B pharmacies.
          </p>
        </div>
      </section>

      {/* City Grid */}
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase mb-3 text-center" style={{ color: "#E8339E" }}>Pennsylvania Locations</p>
          <h2 className="font-black text-3xl mb-12 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>Select Your City</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map(city => (
              <Link key={city.slug} href={`/pennsylvania/${city.slug}`}>
                <div className="group rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg" style={{ border: "1.5px solid #E2E2EA", background: "#FAFAFA" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                      <span className="font-black text-base" style={{ color: "#111" }}>{city.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "#E8339E" }} />
                  </div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "#777" }}>{city.tagline}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>More Pennsylvania Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "West Chester", href: "/pennsylvania/west-chester" },
                { name: "Newtown", href: "/pennsylvania/newtown" },
                { name: "Horsham", href: "/pennsylvania/horsham" },
                { name: "Lansdale", href: "/pennsylvania/lansdale" },
                { name: "Kennett Square", href: "/pennsylvania/kennett-square" },
              ].map((city) => (
                <a
                  key={city.name}
                  href={city.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-[#E8339E] transition-all"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <MapPin className="w-3 h-3" style={{ color: "#E8339E" }} />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in Pennsylvania</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>Ready to Start?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>Your free 20-minute consultation is the first step. No commitment required.</p>
        <button onClick={() => setConsultOpen(true)} className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}>
          Schedule Free Consultation
        </button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Link href="/locations" className="hover:text-white transition-colors">View all locations</Link>
          {" · "}
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
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
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
