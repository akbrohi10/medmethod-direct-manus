/**
 * MedMethod Direct — Malvern, PA (Chester County)
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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/pa-hero-malvern-Cf4goP8NRE2Abe99L8MoQ9.webp";

const FAQS = [
  { q: "Is MedMethod Direct licensed to practice in Pennsylvania?", a: "Yes. MedMethod Direct is fully licensed to practice medicine in Pennsylvania. Our board-certified physicians are authorized to evaluate, prescribe, and manage hormone therapy and medical weight loss programs for patients throughout the Commonwealth — including Malvern and Chester County — entirely via telehealth, with no in-person visit required." },
  { q: "Do I need to visit an office to become a patient in Malvern?", a: "No. MedMethod Direct is a 100% virtual practice. Everything — your consultation, lab review, prescription, and ongoing check-ins — happens online via secure video. Your medication ships directly from a licensed 503B compounding pharmacy to your Malvern address." },
  { q: "Why is Malvern a strong fit for MedMethod Direct?", a: "Malvern sits at the heart of Chester County's pharmaceutical and technology corridor — home to Siemens Healthineers, Vanguard, and a dense cluster of biotech and pharma companies. The resident base includes a high proportion of women in science, healthcare, and finance who are health-literate, time-conscious, and accustomed to evidence-based care. MedMethod Direct's physician-led telehealth model is a natural fit for this community." },
  { q: "Does MedMethod Direct serve all of Chester County?", a: "Yes. MedMethod Direct serves patients across Chester County, including Malvern, Paoli, Exton, Downingtown, and West Chester. Because we are 100% virtual, your location within the county does not affect access — you receive the same physician-led care regardless of where you live." },
  { q: "What services does MedMethod Direct offer Malvern patients?", a: "We offer bioidentical hormone replacement therapy (BHRT), GLP-1 medical weight loss (semaglutide and tirzepatide), perimenopause and menopause management, and testosterone optimization. All programs are personalized based on your lab results and health history, with ongoing physician oversight included." },
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

export default function LocationMalvernPA() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Malvern PA Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy & GLP-1 weight loss for women in Malvern, PA. Board-certified physicians, no office visit. Serving Chester County and the Main Line." />
        <link rel="canonical" href="https://www.medmethoddirect.com/pennsylvania/malvern" />
        <meta property="og:title" content="Malvern PA Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Malvern, PA. Board-certified physicians, no office visit required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/pennsylvania/malvern" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Malvern PA Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Virtual hormone therapy & GLP-1 weight loss for women in Malvern, PA. Board-certified physicians, no office visit required." />
        <meta name="twitter:image" content={HERO_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "MedMethod Direct", "url": "https://www.medmethoddirect.com/pennsylvania/malvern", "description": "MedMethod Direct provides virtual hormone therapy and GLP-1 weight loss programs for women in Malvern, PA and Chester County.", "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], "areaServed": { "@type": "City", "name": "Malvern, Pennsylvania" }, "availableService": [{ "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", "name": "Medical Weight Loss" }, { "@type": "MedicalTherapy", "name": "Menopause Management" }] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS.map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.medmethoddirect.com" }, { "@type": "ListItem", "position": 2, "name": "Pennsylvania", "item": "https://www.medmethoddirect.com/pennsylvania" }, { "@type": "ListItem", "position": 3, "name": "Malvern", "item": "https://www.medmethoddirect.com/pennsylvania/malvern" }] })}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <section className="relative min-h-[75vh] flex items-center px-6 py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/pennsylvania" className="hover:text-white transition-colors">Pennsylvania</Link><span>/</span>
              <span style={{ color: "#E8339E" }}>Malvern</span>
            </nav>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Malvern, PA — Chester County</p>
            <h1 className="font-black mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Menopause & Weight Loss Care in <span style={{ color: "#E8339E" }}>Malvern, PA</span>
            </h1>
            <p className="text-base font-medium mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Board-certified physicians. GLP-1 therapy. Hormone optimization. 100% virtual — serving Malvern and Chester County.</p>
            <button onClick={() => setConsultOpen(true)} className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)", boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}>Schedule Free Consultation</button>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
            {/* IMAGE RULE: single face on laptop screen — physician or patient in telehealth only */}
            <img src={HERO_IMAGE} alt="Telehealth consultation for women's health in Malvern, PA" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-2xl mb-5" style={{ color: "#111", letterSpacing: "-0.02em" }}>Women's Health in Malvern, PA</h2>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>Malvern is the western anchor of the Philadelphia Main Line and the heart of Chester County's corporate corridor. Siemens Healthineers, Vanguard, and a dense cluster of pharmaceutical and biotech companies call this area home, creating a resident base of highly educated professionals who bring the same evidence-based rigor to their healthcare decisions that they apply to their work. For women in this community navigating perimenopause or seeking GLP-1 weight loss support, MedMethod Direct offers the quality and convenience they expect.</p>
          <p className="text-base font-medium leading-relaxed mb-4" style={{ color: "#444" }}>Our board-certified physicians deliver personalized lab-based BHRT protocols, semaglutide and tirzepatide prescriptions, and ongoing physician oversight — all via telehealth, with medication shipped directly to your Malvern address. No commute, no wait, no compromise on the quality of care.</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: "#444" }}>MedMethod Direct is fully licensed to practice medicine in Pennsylvania. Our physicians comply with all PA telehealth prescribing regulations and every program uses FDA-approved and compounded medications from accredited 503B pharmacies.</p>
        </div>
      </section>
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-10 text-center" style={{ color: "#111", letterSpacing: "-0.02em" }}>Frequently Asked Questions — Malvern</h2>
          <div className="flex flex-col gap-4">{FAQS.map(({ q, a }, i) => <FAQItem key={i} question={q} answer={a} />)}</div>
        </div>
      </section>
      <section className="py-12 px-6" style={{ background: "#F4F4F8" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#999" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{ name: "Wayne", slug: "wayne" }, { name: "Newtown Square", slug: "newtown-square" }, { name: "Philadelphia", slug: "philadelphia" }].map(c => (
              <Link key={c.slug} href={`/pennsylvania/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white" style={{ background: "#EBEBF0", color: "#444" }}>{c.name}</Link>
            ))}
            <Link href="/pennsylvania" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#E8339E", color: "#fff" }}>All PA Locations →</Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" style={{ background: "#0d0d0d" }}>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#E8339E" }}>Licensed in Pennsylvania</p>
        <h2 className="font-black text-3xl mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>Ready to Start in Malvern?</h2>
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
