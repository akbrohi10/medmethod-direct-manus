/* =============================================================================
   LocationChandlerAZ.tsx — Chandler, Arizona City Page
   medmethod-location-seo skill compliant
   Primary keyword: hormone therapy Chandler AZ
   IMAGE RULE: Single physician or patient face on laptop screen only — no group Zoom calls
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import HowItWorks from "@/components/HowItWorks";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Is MedMethod Direct licensed to serve Chandler, Arizona patients?", a: "Yes. MedMethod Direct holds an active Arizona medical license and is fully authorized to provide telehealth services to patients in Chandler and throughout the state. Our board-certified physicians can evaluate, diagnose, and prescribe medications — including bioidentical hormones and GLP-1 weight loss therapies — through secure video consultations." },
  { q: "Do Chandler patients need to visit a clinic or office?", a: "No in-person visit is ever required. MedMethod Direct is a 100% virtual practice. All consultations, lab reviews, follow-ups, and prescription management happen through secure video appointments. Medications are compounded and shipped directly to your Chandler address through our FDA-registered 503B pharmacy partners." },
  { q: "Why is Chandler a strong market for telehealth hormone care?", a: "Chandler's tech corridor — anchored by Intel, PayPal, and a growing biotech cluster — is home to a large population of professional women in their 40s and 50s who are health-conscious but time-constrained. MedMethod Direct's virtual model removes the scheduling friction that prevents many Chandler women from getting the specialist hormone care they need." },
  { q: "What treatments are available for Chandler patients?", a: "We offer hormone replacement therapy (HRT) including estradiol, progesterone, and testosterone optimization; GLP-1 medical weight loss with semaglutide and tirzepatide; perimenopause and menopause management; thyroid optimization; and longevity protocols. All treatments are personalized based on your comprehensive lab results." },
  { q: "How does telehealth prescribing work in Arizona for Chandler residents?", a: "Arizona's telehealth laws allow licensed physicians to evaluate, diagnose, and prescribe medications through synchronous video consultations. Your MedMethod Direct physician conducts a thorough evaluation, reviews your lab results, and issues prescriptions through our 503B-certified compounding pharmacy partners — all without you leaving Chandler." },
];

const JSONLD_Business = { "@context": "https://schema.org", "@type": "MedicalBusiness", name: "MedMethod Direct — Chandler", url: "https://www.medmethoddirect.com/arizona/chandler", description: "MedMethod Direct provides premium virtual women's health care in Chandler, AZ — hormone replacement therapy, GLP-1 medical weight loss, and menopause management.", medicalSpecialty: ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"], areaServed: { "@type": "City", name: "Chandler, Arizona" }, availableService: [{ "@type": "MedicalTherapy", name: "Hormone Replacement Therapy" }, { "@type": "MedicalTherapy", name: "Medical Weight Loss" }, { "@type": "MedicalTherapy", name: "Menopause Management" }] };
const JSONLD_FAQ = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const JSONLD_Breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.medmethoddirect.com" }, { "@type": "ListItem", position: 2, name: "Arizona", item: "https://www.medmethoddirect.com/arizona" }, { "@type": "ListItem", position: 3, name: "Chandler", item: "https://www.medmethoddirect.com/arizona/chandler" }] };

export default function LocationChandlerAZ() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <>
      <Helmet>
        <title>Chandler Women's Health | Hormone Therapy & Weight Loss | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct offers virtual hormone therapy, GLP-1 weight loss, and menopause care for Chandler, AZ women. Board-certified physicians, no office visit required. Book a free consultation." />
        <link rel="canonical" href="https://www.medmethoddirect.com/arizona/chandler" />
        <meta property="og:title" content="Chandler Women's Health | MedMethod Direct" />
        <meta property="og:description" content="Premium virtual hormone therapy and medical weight loss for Chandler women. Board-certified physicians, 100% telehealth." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.medmethoddirect.com/arizona/chandler" />
        <meta property="og:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-chandler-ebH8Q42TifE4TzECbR2ZP8.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chandler Women's Health | MedMethod Direct" />
        <meta name="twitter:description" content="Premium virtual hormone therapy and medical weight loss for Chandler women." />
        <meta name="twitter:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-chandler-ebH8Q42TifE4TzECbR2ZP8.png" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_Business)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_Breadcrumb)}</script>
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <section className="relative min-h-[92vh] flex items-center bg-[#0d0d0d] overflow-hidden pt-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-chandler-2EAADmQzLjiBd9gZymm82E.webp')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 py-24">
          <nav className="flex items-center gap-2 text-white/40 text-xs mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
            <Link href="/arizona" className="hover:text-white transition-colors">Arizona</Link><span>/</span>
            <span className="text-white/70">Chandler</span>
          </nav>
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Chandler, Arizona</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6 max-w-2xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Chandler Women's<br /><span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone & Weight Loss</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>Virtual hormone therapy, GLP-1 medical weight loss, and menopause management for Chandler's professional women. Board-certified physicians. Licensed in Arizona. No office visit required.</p>
          <button onClick={() => setConsultOpen(true)} className="px-8 py-4 font-bold text-sm tracking-widest uppercase text-white hover:opacity-90 transition-all" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>Schedule Free Consultation</button>
        </div>
      </section>
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Why Chandler Women Choose Us</p>
            <h2 className="text-3xl font-black text-[#0d0d0d] mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Expert Care for<br />Chandler's Busy Professionals</h2>
            
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#444" }}>
            <p>
              If you live in Chandler and you've been searching for a{" "}
              <strong>menopause doctor near Chandler, AZ</strong>, a{" "}
              <strong>medical weight loss physician serving Chandler, Arizona</strong>, or a hormone specialist who treats the whole picture — you've found the right place. MedMethod Direct is a virtual women's health clinic built around one insight most practices miss: <strong>hormones and weight are the same problem</strong>. You cannot fix one without addressing the other.
            </p>
            <p>
              We specialize in the full spectrum of women's metabolic and hormonal health:{" "}
              <strong>perimenopause and menopause management</strong>,{" "}
              <strong>hormone replacement therapy (HRT)</strong>,{" "}
              <strong>bioidentical hormone therapy (BHRT)</strong>,{" "}
              <strong>testosterone optimization for women</strong>, GLP-1 medications including{" "}
              <strong>compounded semaglutide and tirzepatide</strong>, insulin resistance, thyroid optimization, and longevity-focused care — all managed virtually by Dr. Jumana Al-Deek, DO.
            </p>
            <p>
              Whether you're experiencing{" "}
              <strong>perimenopause weight gain</strong>, brain fog, night sweats, low libido, or you've tried GLP-1s elsewhere and hit a plateau — the missing piece is almost always hormonal. MedMethod Direct is one of the only virtual practices in Arizona that addresses <strong>weight loss and hormone balance together</strong>, in a single physician-led program. No driving to Gilbert or Tempe. No waiting rooms. Just one team, one plan, and results that last.
            </p>
          </div>

          {/* Internal links to blog articles */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#999" }}>
              Related reading:
            </span>
            {[
              { label: "Why menopause weight gain feels different", href: "/blog/why-weight-gain-feels-different-in-menopause" },
              { label: "Semaglutide vs. tirzepatide for women", href: "/blog/semaglutide-vs-tirzepatide-women-midlife" },
              { label: "Can hormone therapy help with weight & sleep?", href: "/blog/hormone-therapy-weight-sleep-metabolism" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                style={{
                  color: "#E8339E",
                  borderColor: "rgba(232,51,158,0.3)",
                  background: "rgba(232,51,158,0.04)",
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div></div>
          <div className="flex flex-col gap-4">
            {[{ title: "Hormone Replacement Therapy", desc: "Personalized estradiol, progesterone, and testosterone protocols based on your labs." }, { title: "GLP-1 Medical Weight Loss", desc: "Semaglutide and tirzepatide with physician oversight and metabolic monitoring." }, { title: "Menopause Management", desc: "Comprehensive perimenopause and menopause care for hot flashes, sleep, and cognition." }, { title: "Thyroid Optimization", desc: "Full thyroid panel review and optimization to address fatigue and weight gain." }].map(({ title, desc }) => (
              <div key={title} className="bg-white border border-[#0d0d0d]/8 p-5">
                <p className="font-bold text-[#0d0d0d] mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{title}</p>
                <p className="text-[#0d0d0d]/60 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <section className="bg-[#f9f6f1] py-20">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12"><p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Chandler FAQ</p><h2 className="text-3xl font-black text-[#0d0d0d]" style={{ fontFamily: "Montserrat, sans-serif" }}>Common Questions</h2></div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#0d0d0d]/10 bg-white">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-bold text-[#0d0d0d] pr-4" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8339E] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-6"><p className="text-[#0d0d0d]/70 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <p className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Also Serving Nearby</p>
          <div className="flex flex-wrap gap-3">
            {[{ name: "Gilbert", href: "/arizona/gilbert" }, { name: "Scottsdale", href: "/arizona/scottsdale" }, { name: "Tempe", href: "/arizona/tempe" }, { name: "All Arizona Cities", href: "/arizona" }].map(({ name, href }) => (
              <Link key={name} href={href}><span className="border border-white/10 text-white/60 hover:text-white hover:border-[#E8339E]/40 text-sm px-4 py-2 transition-all cursor-pointer" style={{ fontFamily: "Montserrat, sans-serif" }}>{name}</span></Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#0d0d0d] py-20 border-t border-white/5">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your first consultation is free. A board-certified physician reviews your history and outlines a personalized plan — all in one 45-minute video call from your Chandler home.</p>
          <button onClick={() => setConsultOpen(true)} className="px-10 py-4 font-bold text-sm tracking-widest uppercase text-white hover:opacity-90 transition-all" style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}>Schedule Free Consultation</button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Licensed in Arizona · Serving Chandler · 100% Virtual</p>
        </div>
      </section>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
