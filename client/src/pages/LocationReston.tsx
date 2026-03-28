/* =============================================================================
   /virginia/reston — Reston, VA Location Page
   Design: Clinical Noir — dark hero, white content sections, pink accents
   Target keywords: menopause doctor Reston VA, virtual hormone therapy Reston Virginia,
   GLP-1 weight loss Reston VA, perimenopause treatment Reston, semaglutide Reston Virginia,
   bioidentical hormone therapy Reston, testosterone therapy women Reston VA,
   online menopause doctor Loudoun County
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import PopularPrograms from "@/components/PopularPrograms";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";

const JSONLD_LOCAL = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Reston, VA",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Reston, Herndon, and the Dulles corridor, Virginia. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Virginia.",
  "url": "https://medmethoddirect.com/virginia/reston",
  "priceRange": "$$",
  "medicalSpecialty": ["Obstetrics and Gynecology", "Endocrinology", "Internal Medicine"],
  "availableService": [
    { "@type": "MedicalTherapy", "name": "Hormone Replacement Therapy" },
    { "@type": "MedicalTherapy", "name": "GLP-1 Weight Loss (Semaglutide & Tirzepatide)" },
    { "@type": "MedicalTherapy", "name": "Menopause Management" },
    { "@type": "MedicalTherapy", "name": "Perimenopause Treatment" },
    { "@type": "MedicalTherapy", "name": "Testosterone Therapy for Women" },
    { "@type": "MedicalTherapy", "name": "Bioidentical Hormone Therapy (BHRT)" },
  ],
  "areaServed": [
    { "@type": "City", "name": "Reston", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Herndon", "containedInPlace": { "@type": "State", "name": "Virginia" } },
  ],
  "isAcceptingNewPatients": true,
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": { "@type": "Physician", "name": "Dr. Jumana Al-Deek", "honorificSuffix": "DO", "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is there a menopause doctor near Reston, VA?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Reston, Herndon, Sterling, and the Dulles corridor. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide prescribed online near Reston, Virginia?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Reston and Herndon. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped to your Reston address." } },
    { "@type": "Question", "name": "How does virtual hormone therapy work for Reston patients?", "acceptedAnswer": { "@type": "Answer", "text": "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near Reston or Herndon. Dr. Al-Deek reviews your results and builds a personalized protocol — which may include HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual." } },
    { "@type": "Question", "name": "Do I need to come in for bloodwork near Reston?", "acceptedAnswer": { "@type": "Answer", "text": "No office visit to MedMethod Direct is ever required. We order your labs to a LabCorp or Quest Diagnostics draw site near Reston or Herndon. You go in, get your blood drawn, and results come directly to Dr. Al-Deek." } },
    { "@type": "Question", "name": "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?", "acceptedAnswer": { "@type": "Answer", "text": "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "We are a direct-care practice and do not bill insurance. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." } },
    { "@type": "Question", "name": "What does the $449 Clinical Diagnostic & Setup Fee include?", "acceptedAnswer": { "@type": "Answer", "text": "The $449 fee covers your comprehensive initial bloodwork, your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app." } },
    { "@type": "Question", "name": "How soon can I start as a patient in Reston?", "acceptedAnswer": { "@type": "Answer", "text": "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Reston patients are on their program within 1–2 weeks." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Virginia", "item": "https://medmethoddirect.com/virginia" },
    { "@type": "ListItem", "position": 3, "name": "Reston", "item": "https://medmethoddirect.com/virginia/reston" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Reston, VA?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Reston, Herndon, Sterling, and the Dulles corridor. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Reston, Virginia?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Reston and Herndon. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "Do I need to come in for bloodwork near Reston?", a: "No office visit to MedMethod Direct is ever required. We order your labs to a LabCorp or Quest Diagnostics draw site near Reston or Herndon. You go in, get your blood drawn, and results come directly to Dr. Al-Deek. Every appointment and follow-up is virtual." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Reston?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Reston address." },
  { q: "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?", a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program — rather than treating each issue separately." },
  { q: "Does MedMethod Direct accept insurance?", a: "We are a direct-care practice and do not bill insurance. This allows same-week availability, 30–60 minute appointments, and care not limited by insurance coverage. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." },
  { q: "What does the $449 Clinical Diagnostic & Setup Fee include?", a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee." },
  { q: "How soon can I start as a patient in Reston?", a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Reston patients are on their program within 1–2 weeks of their first call." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex items-center justify-between py-5 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-[#111111] text-base leading-snug" style={{ fontFamily: "Montserrat, sans-serif" }}>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#E8339E] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && <p className="pb-5 text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{a}</p>}
    </div>
  );
}

const whyCards = [
  { icon: "💻", title: "Built for Tech-Sector Women", desc: "Reston's tech workforce already lives virtually. MedMethod Direct fits seamlessly into a schedule that doesn't have room for 6-week specialist waits." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most Reston patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Reston or Herndon." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Reston address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I work at a tech company in Reston and I simply don't have time for traditional doctor's office visits. MedMethod Direct fit perfectly into my schedule — free consultation on a Tuesday, labs ordered that week, protocol started within 10 days. Down 22 pounds and my brain fog is gone.", name: "Jennifer L.", location: "Reston, VA — Lake Anne area", rating: 5 },
  { quote: "I'd been on semaglutide for four months with barely any results. Dr. Al-Deek ran a full hormone panel and found my estrogen and testosterone were both low — which was blunting the medication. Three months after adding hormone therapy, I've lost 19 pounds and feel completely different.", name: "Michelle R.", location: "Herndon, VA", rating: 5 },
  { quote: "The virtual model was a game-changer for me. I travel constantly for work and the last thing I needed was a practice that required in-person visits. Everything is handled virtually — labs, prescriptions, follow-ups. It just works.", name: "Karen S.", location: "Reston, VA — North Point area", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationReston() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Reston, VA | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Reston, Herndon, and the Dulles corridor, VA. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/reston" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Reston, VA | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Reston and Herndon, VA. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/reston" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone & Weight Loss Doctor in Reston, VA" />
        <meta name="twitter:description" content="Same-week virtual menopause and GLP-1 weight loss care for women in Reston and Herndon, VA. Dr. Jumana Al-Deek, DO." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ── */}
      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* LEFT */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  Serving Reston, Virginia
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  VIRTUAL{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HORMONE,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MENOPAUSE</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>WEIGHT LOSS</span>
                  <br />
                  FOR RESTON WOMEN
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Reston, Herndon, and the Dulles corridor. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Virginia
                </p>
                <div className="flex flex-wrap gap-5 lg:gap-7">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.7rem", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat.value}</div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* RIGHT: Hero Image */}
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/reston-hero-3ChgGExRTk83tGNFsWKJYL.webp"
                    alt="Virtual menopause and hormone therapy doctor for women in Reston, Virginia — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Reston · Herndon · Sterling · Ashburn · Dulles Corridor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(90deg, #E8339E 0%, #7A1E7E 100%)" }} />
      </section>

      {/* ── INTRO ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING RESTON & THE DULLES CORRIDOR, VA</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause & Weight Loss Physician for Reston Women — From Wherever You Work
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              Reston has one of the highest telehealth adoption rates in Northern Virginia — driven by a tech-sector workforce that already lives virtually. If you've been searching for a <strong>menopause doctor near Reston VA</strong> or a <strong>GLP-1 weight loss physician in the Dulles corridor</strong>, MedMethod Direct was built for you.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated virtual program. Labs ordered to <strong>LabCorp or Quest Diagnostics near Reston or Herndon</strong>. Medications shipped to your door.
            </p>
            <p>
              Many Reston women come to us after plateauing on GLP-1 medications. The reason is almost always hormonal — declining estrogen, low testosterone, and insulin resistance all reduce the effectiveness of semaglutide and tirzepatide. By treating <strong>hormones and weight loss as a unified clinical problem</strong>, we achieve results that single-specialty programs miss.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Reston VA", "GLP-1 Weight Loss Herndon", "Hormone Therapy Dulles Corridor", "BHRT Reston Virginia", "Semaglutide Reston VA", "Perimenopause Specialist Reston", "Testosterone Therapy Women Reston", "Online Hormone Testing Virginia"].map((kw) => (
                <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/30 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{kw}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Related reading:{" "}
              <a href="/blog/semaglutide-vs-tirzepatide-women-midlife" className="text-[#E8339E] hover:underline">Semaglutide vs. Tirzepatide for Women in Midlife</a>
              {" · "}
              <a href="/blog/hormone-therapy-weight-sleep-metabolism" className="text-[#E8339E] hover:underline">Can Hormone Therapy Help With Weight, Sleep & Metabolism?</a>
            </p>
          </div>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      {/* ── DARK DIVIDER ── */}
      <div className="relative py-12 overflow-hidden" style={{ background: "#0D0D1A" }}>
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>THE MEDMETHOD STANDARD</p>
          <h2 className="font-black text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
            "The system you've been missing —{" "}
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>built by physicians, for women.</span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.</p>
        </div>
      </div>

      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── WHY RESTON WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY RESTON WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Built for the Dulles Corridor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-[#111111] text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>PATIENT STORIES</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>What Women in Virginia Are Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-[#E8339E] text-base">★</span>)}</div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1" style={{ fontFamily: "Montserrat, sans-serif" }}>"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#111111] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.name}</p>
                  <p className="text-[#E8339E] text-xs" style={{ fontFamily: "Montserrat, sans-serif" }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#F8F4F9]" id="faq">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>FREQUENTLY ASKED QUESTIONS</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Reston & Herndon — Common Questions</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>RESTON, VIRGINIA</p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.</p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Reston, Herndon, Sterling, Ashburn, and the Dulles corridor</p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
