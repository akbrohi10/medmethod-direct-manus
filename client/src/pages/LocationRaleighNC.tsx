/**
 * MedMethod Direct — Raleigh, NC
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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-raleigh-nbvnddfQdnf65AfFQSQ8mf.webp";

const FAQS = [
  {
    q: "Is MedMethod Direct licensed to practice in North Carolina?",
    a: "Yes. MedMethod Direct is fully licensed to practice medicine in North Carolina. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the state — including Raleigh — entirely via telehealth, with no in-person visit required.",
  },
  {
    q: "Do I need to visit an office to become a patient in Raleigh?",
    a: "No. MedMethod Direct is a 100% virtual practice. Everything — your consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication ships directly from a licensed 503B compounding pharmacy to your Raleigh address.",
  },
  {
    q: "Why is Raleigh a strong market for telehealth hormone therapy?",
    a: "Raleigh sits at the heart of the Research Triangle, home to one of the most educated and health-literate populations in the Southeast. Many women in Raleigh work in biotech, pharma, and academia — they research their healthcare options thoroughly and are early adopters of evidence-based telehealth. Despite the Triangle's rapid growth, specialist wait times for perimenopause and HRT care remain long, making virtual care a practical and preferred solution.",
  },
  {
    q: "What makes MedMethod Direct different from local Raleigh hormone clinics?",
    a: "Traditional Raleigh hormone clinics require in-person visits, often have weeks-long wait times, and may not offer the full spectrum of GLP-1 weight loss programs alongside hormone therapy. MedMethod Direct provides same-week consultations, personalized lab-based protocols, and ships medication directly to your door — all from board-certified physicians with deep expertise in women's hormonal health.",
  },
  {
    q: "What services does MedMethod Direct offer Raleigh patients?",
    a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight included.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden cursor-pointer" style={{ border: "1.5px solid #E2E2EA" }} onClick={() => setOpen(v => !v)}>
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-bold text-sm" style={{ color: "#111" }}>{question}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      {open && <div className="px-6 pb-5 text-sm font-medium leading-relaxed" style={{ color: "#555" }}>{answer}</div>}
    </div>
  );
}

export default function LocationRaleighNC() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Raleigh NC Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit. Serving the Research Triangle & all of Raleigh." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina/raleigh" />
        <meta property="og:title" content="Raleigh NC Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina/raleigh" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Raleigh NC Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Raleigh, NC. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "MedMethod Direct", "url": "https://www.medmethoddirect.com/north-carolina/raleigh", "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women in Raleigh, NC and the Research Triangle.", "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], "areaServed": { "@type": "City", "name": "Raleigh, North Carolina" }, "availableService": [{ "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", "name": "Medical Weight Loss" }, { "@type": "MedicalTherapy", "name": "Menopause Management" }] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" }, { "@type": "ListItem", "position": 2, "name": "North Carolina", "item": "https://www.medmethoddirect.com/north-carolina" }, { "@type": "ListItem", "position": 3, "name": "Raleigh", "item": "https://www.medmethoddirect.com/north-carolina/raleigh" }] })}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/north-carolina" className="hover:text-white transition-colors">North Carolina</Link><span>/</span>
              <span style={{ color: "#E8339E" }}>Raleigh</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Raleigh, NC</p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Menopause & Weight Loss Care in <span style={{ color: "#E8339E" }}>Raleigh, NC</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Board-certified physicians. GLP-1 therapy. Hormone optimization. 100% virtual — serving Raleigh and the Research Triangle.
            </p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}>
              Schedule Free Consultation
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Raleigh, NC" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Raleigh, NC</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>Raleigh is the capital of the Research Triangle and home to one of the most educated, health-literate populations in the Southeast. Women in Raleigh — many working in biotech, pharmaceutical research, academia, and technology — are sophisticated healthcare consumers who research their options and expect evidence-based care. The Triangle's explosive growth has created a large population of women in their 40s and 50s navigating perimenopause and menopause, often without timely access to specialists.</p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>MedMethod Direct delivers the same quality of care as a top-tier in-person specialist — personalized lab-based hormone protocols, semaglutide and tirzepatide prescriptions, and ongoing physician oversight — entirely via telehealth. Same-week consultations, no waiting rooms, medication shipped directly to your Raleigh address.</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>MedMethod Direct is fully licensed to practice medicine in North Carolina. Our physicians comply with all NC telehealth prescribing regulations and every program uses FDA-approved and compounded medications from accredited 503B pharmacies.</p>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>Frequently Asked Questions — Raleigh</h2>
          <div className="flex flex-col gap-4">{FAQS.map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}</div>
        </div>
      </section>
      <section className="py-12 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#999" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{ name: "Cary", slug: "cary" }, { name: "Chapel Hill", slug: "chapel-hill" }, { name: "Charlotte", slug: "charlotte" }].map(c => (
              <Link key={c.slug} href={`/north-carolina/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white" style={{ background: "#EBEBF0", color: "#444" }}>{c.name}</Link>
            ))}
            <Link href="/north-carolina" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#E8339E", color: "#fff" }}>All NC Locations →</Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in North Carolina</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>Ready to Start in Raleigh?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>Your free 20-minute consultation is the first step. No commitment required.</p>
        <button onClick={() => setConsultOpen(true)} className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}>Schedule Free Consultation</button>
        <p className="mt-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
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
