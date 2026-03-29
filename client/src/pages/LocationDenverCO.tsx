/**
 * MedMethod Direct — Denver, CO (Cherry Creek / Washington Park)
 * IMAGE RULE: single face on laptop screen only (physician or patient in telehealth).
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConsultationModal from "@/components/ConsultationModal";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/co-hero-denver-BAKJP7EiJHNKMhYZCvAr79.webp";

const FAQS = [
  { q: "Is MedMethod Direct licensed to practice in Colorado?", a: "Yes. MedMethod Direct is fully licensed to practice medicine in Colorado. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the state — including Denver — entirely via telehealth, with no in-person visit required." },
  { q: "Do I need to visit an office to become a patient in Denver?", a: "No. MedMethod Direct is a 100% virtual practice. Everything — your consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication ships directly from a licensed 503B compounding pharmacy to your Denver address." },
  { q: "Why do Denver women choose MedMethod Direct?", a: "Denver's Cherry Creek and Washington Park neighborhoods are home to a highly educated, health-conscious population of women who are accustomed to premium services and frustrated by the limitations of traditional specialist care. MedMethod Direct delivers physician-led hormone therapy and GLP-1 weight loss care without the months-long wait for a specialist appointment — and without leaving home." },
  { q: "Does MedMethod Direct serve the entire Denver metro area?", a: "Yes. MedMethod Direct serves patients across the Denver metro, including Cherry Creek, Washington Park, Stapleton, Highlands, Lowry, and all surrounding neighborhoods and suburbs. Because we are 100% virtual, your specific location within the metro does not affect access to care." },
  { q: "What services does MedMethod Direct offer Denver patients?", a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight included." },
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

export default function LocationDenverCO() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Denver CO Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women in Denver, CO. Board-certified physicians, no office visit. Serving Cherry Creek, Washington Park & the Denver metro." />
        <link rel="canonical" href="https://www.medmethoddirect.com/colorado/denver" />
        <meta property="og:title" content="Denver CO Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Denver, CO. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/colorado/denver" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Denver CO Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Denver, CO. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "MedMethod Direct", "url": "https://www.medmethoddirect.com/colorado/denver", "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women in Denver, CO.", "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], "areaServed": { "@type": "City", "name": "Denver, Colorado" }, "availableService": [{ "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", "name": "Medical Weight Loss" }, { "@type": "MedicalTherapy", "name": "Menopause Management" }] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" }, { "@type": "ListItem", "position": 2, "name": "Colorado", "item": "https://www.medmethoddirect.com/colorado" }, { "@type": "ListItem", "position": 3, "name": "Denver", "item": "https://www.medmethoddirect.com/colorado/denver" }] })}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Montserrat, sans-serif" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/colorado" className="hover:text-white transition-colors">Colorado</Link><span>/</span>
              <span style={{ color: "#E8339E" }}>Denver</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Denver, CO — Cherry Creek & Washington Park</p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>
              Menopause & Weight Loss Care in <span style={{ color: "#E8339E" }}>Denver, CO</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "Montserrat, sans-serif" }}>Board-certified physicians. GLP-1 therapy. Hormone optimization. 100% virtual — serving Denver and the entire metro area.</p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)", fontFamily: "Montserrat, sans-serif" }}>Schedule Free Consultation</button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Denver, CO" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Women's Health in Denver, CO</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>Denver is Colorado's largest city and one of the fastest-growing metros in the country — a place where outdoor culture, entrepreneurial energy, and a highly educated workforce converge. The Cherry Creek and Washington Park neighborhoods in particular attract a demographic of women who are health-forward, professionally accomplished, and increasingly frustrated by the gaps in traditional women's healthcare. Specialist wait times in Denver can stretch 3–6 months, and most OB-GYN practices offer only brief, reactive appointments for perimenopause and weight management concerns.</p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>MedMethod Direct was built to fill exactly that gap. Our board-certified physicians deliver personalized, lab-based BHRT protocols, semaglutide and tirzepatide prescriptions, and ongoing physician oversight via telehealth — with medication shipped directly to your Denver address. No commute, no waiting room, no compromise on the quality of care.</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444", fontFamily: "Montserrat, sans-serif" }}>MedMethod Direct is fully licensed to practice medicine in Colorado. Our physicians comply with all Colorado telehealth prescribing regulations and every program uses FDA-approved and compounded medications from accredited 503B pharmacies.</p>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Frequently Asked Questions — Denver</h2>
          <div className="flex flex-col gap-4">{FAQS.map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}</div>
        </div>
      </section>
      <section className="py-12 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#999", fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{ name: "Boulder", slug: "boulder" }, { name: "Greenwood Village", slug: "greenwood-village" }, { name: "Highlands Ranch", slug: "highlands-ranch" }].map(c => (
              <Link key={c.slug} href={`/colorado/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white" style={{ background: "#EBEBF0", color: "#444", fontFamily: "Montserrat, sans-serif" }}>{c.name}</Link>
            ))}
            <Link href="/colorado" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#E8339E", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>All CO Locations →</Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Licensed in Colorado</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em", fontFamily: "Montserrat, sans-serif" }}>Ready to Start in Denver?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No commitment required.</p>
        <button onClick={() => setConsultOpen(true)} className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", fontFamily: "Montserrat, sans-serif" }}>Schedule Free Consultation</button>
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
