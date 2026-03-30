/**
 * MedMethod Direct — Colorado State Hub
 * IMAGE RULE: single face on laptop screen only (physician or patient in telehealth).
 * Design: Clinical Noir — dark hero, pink/purple accents, Montserrat font
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { MapPin, ChevronRight, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/co-hero-state-LHRPRyCbvcv2PfGZZrD6R3.webp";

const CITIES = [
  { name: "Denver", slug: "denver", desc: "Cherry Creek, Washington Park & the broader metro" },
  { name: "Boulder", slug: "boulder", desc: "Health-forward community with a highly educated patient base" },
  { name: "Colorado Springs", slug: "colorado-springs", desc: "Pikes Peak corridor — large affluent suburban population" },
  { name: "Highlands Ranch", slug: "highlands-ranch", desc: "Douglas County's highest-income suburb" },
  { name: "Fort Collins", slug: "fort-collins", desc: "CSU corridor — professional & academic demographic" },
  { name: "Greenwood Village", slug: "greenwood-village", desc: "Denver Tech Center executive community" },
];

const FAQS = [
  { q: "Is MedMethod Direct licensed to practice in Colorado?", a: "Yes. MedMethod Direct is fully licensed to practice medicine in Colorado. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the state — entirely via telehealth, with no in-person visit required." },
  { q: "How does telehealth prescribing work in Colorado?", a: "Colorado has robust telehealth prescribing laws that allow licensed physicians to evaluate patients, order labs, and prescribe medications — including bioidentical hormones and GLP-1 medications — via secure video consultation. MedMethod Direct's physicians comply with all Colorado telehealth regulations, and your medication ships directly from a licensed 503B compounding pharmacy to your Colorado address." },
  { q: "Do I need to visit an office to become a patient in Colorado?", a: "No. MedMethod Direct is a 100% virtual practice. Everything — your initial consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. There is no in-person requirement at any stage of your care." },
  { q: "What services does MedMethod Direct offer Colorado patients?", a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your comprehensive lab results and health history, with ongoing physician oversight included at every tier." },
  { q: "Which Colorado cities does MedMethod Direct serve?", a: "MedMethod Direct serves patients across Colorado, including Denver, Boulder, Colorado Springs, Highlands Ranch, Fort Collins, Greenwood Village, and all surrounding communities. Because we are 100% virtual, your specific location within Colorado does not affect access to care — you receive the same physician-led programs regardless of where you live in the state." },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden cursor-pointer" style={{ border: "1.5px solid #E2E2EA" }} onClick={() => setOpen(v => !v)}>
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-bold text-sm" style={{ color: "#111", fontFamily: "Montserrat, sans-serif" }}>{question}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      {open && <div className="px-6 pb-5 text-sm font-medium leading-relaxed" style={{ color: "#555", fontFamily: "Montserrat, sans-serif" }}>{answer}</div>}
    </div>
  );
}

const JSONLD_MEDICAL = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MedMethod Direct",
  url: "https://www.medmethoddirect.com/colorado",
  description: "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women across Colorado, including Denver, Boulder, Colorado Springs, Highlands Ranch, Fort Collins, and Greenwood Village.",
  medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
  areaServed: { "@type": "State", "name": "Colorado" },
  availableService: [
    { "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", name: "Medical Weight Loss" },
    { "@type": "MedicalTherapy", name: "Menopause Management" },
  ],
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" },
    { "@type": "ListItem", position: 2, name: "Colorado", item: "https://www.medmethoddirect.com/colorado" },
  ],
};

export default function LocationColorado() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Colorado Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women across Colorado. Board-certified physicians, no office visit required. Serving Denver, Boulder, Colorado Springs, Highlands Ranch, Fort Collins & Greenwood Village." />
        <link rel="canonical" href="https://www.medmethoddirect.com/colorado" />
        <meta property="og:title" content="Colorado Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women across Colorado. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/colorado" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Colorado Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women across Colorado. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_MEDICAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-24 overflow-hidden" style={{ background: "#0d0d0d" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(232,51,158,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(232,51,158,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Montserrat, sans-serif" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: "#E8339E" }}>Colorado</span>
            </nav>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#E8339E]/30 bg-[#E8339E]/5">
              <MapPin className="w-3 h-3 text-[#E8339E]" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>Licensed in Colorado</span>
            </div>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", color: "#fff", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>
              Colorado Women's Health —{" "}
              <span style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                100% Virtual
              </span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "Montserrat, sans-serif" }}>
              Physician-led hormone therapy, GLP-1 weight loss, and menopause care — delivered entirely online to women across Colorado. No commute, no waiting room.
            </p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)", fontFamily: "Montserrat, sans-serif" }}>
              Schedule Free Consultation
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Colorado" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* About Colorado */}
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Virtual Women's Health Across Colorado</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            Colorado is one of the healthiest and most health-conscious states in the country — a place where outdoor lifestyle, wellness culture, and high educational attainment converge. From the Denver Tech Center's executive corridor to Boulder's research and wellness community, Colorado women are proactive about their health and increasingly frustrated by the limitations of traditional specialist care: long wait times, limited appointment availability, and a one-size-fits-all approach to perimenopause and weight management.
          </p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            MedMethod Direct was built for exactly this patient. Our board-certified physicians deliver personalized, lab-based bioidentical hormone replacement therapy (BHRT), semaglutide and tirzepatide GLP-1 programs, and comprehensive menopause management — all via telehealth, with medication shipped directly to your Colorado address from a licensed 503B compounding pharmacy.
          </p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>
            MedMethod Direct is fully licensed to practice medicine in Colorado. Our physicians comply with all Colorado telehealth prescribing regulations, and every program is built on FDA-approved and compounded medications from accredited pharmacies.
          </p>
        </div>
      </section>

      {/* City Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Service Cities</p>
            <h2 className="font-black text-3xl" style={{ color: "#111", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Colorado Locations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map((city) => (
              <Link key={city.slug} href={`/colorado/${city.slug}`}>
                <div className="group rounded-2xl p-6 border border-gray-100 hover:border-[#E8339E]/30 hover:shadow-lg transition-all cursor-pointer h-full" style={{ background: "#FAFAFA" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                      <span className="font-black text-base" style={{ color: "#111", fontFamily: "Montserrat, sans-serif" }}>{city.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#E8339E" }} />
                  </div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "#777", fontFamily: "Montserrat, sans-serif" }}>{city.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Tier 2 — More Cities */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>More Colorado Cities We Serve</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Castle Rock", href: "/colorado/castle-rock" },
                { name: "Parker", href: "/colorado/parker" },
                { name: "Longmont", href: "/colorado/longmont" },
                { name: "Loveland", href: "/colorado/loveland" },
                { name: "Steamboat Springs", href: "/colorado/steamboat-springs" },
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

      {/* FAQ */}
      <section className="py-20 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Frequently Asked Questions — Colorado</h2>
          <div className="flex flex-col gap-4">
            {FAQS.map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Licensed in Colorado</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Ready to Start in Colorado?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No commitment required.</p>
        <button onClick={() => setConsultOpen(true)} className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", fontFamily: "Montserrat, sans-serif" }}>
          Schedule Free Consultation
        </button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif" }}>
          <Link href="/locations" className="hover:text-white transition-colors">View all locations</Link>{" · "}
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
