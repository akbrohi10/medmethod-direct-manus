/**
 * MedMethod Direct — Wilmington, NC
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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-wilmington-jWGMJM8UtSHaJnFVHHDaD4.webp";

const FAQS = [
  { q: "Is MedMethod Direct licensed to practice in North Carolina?", a: "Yes. MedMethod Direct is fully licensed to practice medicine in North Carolina. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the state — including Wilmington — entirely via telehealth, with no in-person visit required." },
  { q: "Do I need to visit an office to become a patient in Wilmington?", a: "No. MedMethod Direct is a 100% virtual practice. Everything — your consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication ships directly from a licensed 503B compounding pharmacy to your Wilmington address." },
  { q: "Why do Wilmington women choose telehealth for hormone therapy?", a: "Wilmington and the Cape Fear coast — including Wrightsville Beach and Figure Eight Island — have a significant population of women 45–65 who are active, health-conscious, and accustomed to quality services. Specialist access in the Wilmington area is limited compared to the Triangle; many women have historically driven hours to Raleigh or Charlotte for care that MedMethod Direct can now deliver virtually, directly to their coastal home." },
  { q: "How quickly can I start a program from Wilmington?", a: "Most Wilmington patients complete their free consultation within 24–48 hours of scheduling. After your consultation and lab work, your physician typically reviews results and issues your prescription within 3–5 business days. Medication ships directly from our 503B compounding pharmacy to your Wilmington or Wrightsville Beach address." },
  { q: "What services does MedMethod Direct offer Wilmington patients?", a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight included." },
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

export default function LocationWilmingtonNC() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Wilmington NC Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women in Wilmington, NC. Board-certified physicians, no office visit. Serving Wrightsville Beach & the Cape Fear coast." />
        <link rel="canonical" href="https://www.medmethoddirect.com/north-carolina/wilmington" />
        <meta property="og:title" content="Wilmington NC Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Wilmington, NC. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/north-carolina/wilmington" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wilmington NC Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Wilmington, NC. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "MedMethod Direct", "url": "https://www.medmethoddirect.com/north-carolina/wilmington", "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women in Wilmington, NC and the Cape Fear coast.", "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], "areaServed": { "@type": "City", "name": "Wilmington, North Carolina" }, "availableService": [{ "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", "name": "Medical Weight Loss" }, { "@type": "MedicalTherapy", "name": "Menopause Management" }] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" }, { "@type": "ListItem", "position": 2, "name": "North Carolina", "item": "https://www.medmethoddirect.com/north-carolina" }, { "@type": "ListItem", "position": 3, "name": "Wilmington", "item": "https://www.medmethoddirect.com/north-carolina/wilmington" }] })}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/north-carolina" className="hover:text-white transition-colors">North Carolina</Link><span>/</span>
              <span style={{ color: "#E8339E" }}>Wilmington</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Wilmington, NC</p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Menopause & Weight Loss Care in <span style={{ color: "#E8339E" }}>Wilmington, NC</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Board-certified physicians. GLP-1 therapy. Hormone optimization. 100% virtual — serving Wilmington, Wrightsville Beach & the Cape Fear coast.</p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}>Schedule Free Consultation</button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Wilmington, NC" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Wilmington, NC</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>Wilmington and the surrounding Cape Fear coast — including Wrightsville Beach, one of North Carolina's most expensive zip codes, and Figure Eight Island — attract affluent retirees, second-home owners, and established professionals. The area has a significant population of women 45–65 who are active, health-conscious, and living their best coastal lives. Yet specialist access in Wilmington is limited compared to the Research Triangle; women have historically had to drive hours to Raleigh or Charlotte for the kind of hormone therapy and weight loss care that MedMethod Direct now delivers virtually.</p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>Our board-certified physicians provide personalized lab-based BHRT protocols, semaglutide and tirzepatide prescriptions, and ongoing physician oversight — all via telehealth, with medication shipped directly to your Wilmington or Wrightsville Beach address. No drive, no waiting room, no compromise on quality.</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>MedMethod Direct is fully licensed to practice medicine in North Carolina. Our physicians comply with all NC telehealth prescribing regulations and every program uses FDA-approved and compounded medications from accredited 503B pharmacies.</p>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>Frequently Asked Questions — Wilmington</h2>
          <div className="flex flex-col gap-4">{FAQS.map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}</div>
        </div>
      </section>
      <section className="py-12 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#999" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{ name: "Charlotte", slug: "charlotte" }, { name: "Raleigh", slug: "raleigh" }, { name: "Asheville", slug: "asheville" }].map(c => (
              <Link key={c.slug} href={`/north-carolina/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white" style={{ background: "#EBEBF0", color: "#444" }}>{c.name}</Link>
            ))}
            <Link href="/north-carolina" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#E8339E", color: "#fff" }}>All NC Locations →</Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in North Carolina</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>Ready to Start in Wilmington?</h2>
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
