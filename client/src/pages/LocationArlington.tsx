/* =============================================================================
   /virginia/arlington — Arlington, VA Location Page
   Design: Clinical Noir — dark hero, white content sections, pink accents
   Target keywords: menopause doctor Arlington VA, virtual hormone therapy Arlington Virginia,
   GLP-1 weight loss Arlington VA, perimenopause treatment Arlington, semaglutide Arlington VA,
   bioidentical hormone therapy Arlington, testosterone therapy women Arlington VA,
   online menopause doctor Northern Virginia
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
  "name": "MedMethod Direct — Arlington, VA",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Arlington, Alexandria, and Northern Virginia. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Virginia.",
  "url": "https://medmethoddirect.com/virginia/arlington",
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
    { "@type": "City", "name": "Arlington", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Alexandria", "containedInPlace": { "@type": "State", "name": "Virginia" } },
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
    { "@type": "Question", "name": "Is there a menopause doctor near Arlington, VA?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Arlington, Alexandria, Crystal City, Rosslyn, and the broader Northern Virginia area. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide prescribed online near Arlington, Virginia?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Arlington and Alexandria. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped to your Arlington address." } },
    { "@type": "Question", "name": "How is MedMethod Direct different from local practices in Arlington?", "acceptedAnswer": { "@type": "Answer", "text": "Arlington has more medical practices per capita than most Northern Virginia cities, but very few specialize in the intersection of hormones and weight loss. MedMethod Direct treats both as a unified clinical problem — not two separate referrals. Appointments are 30–60 minutes, same-week availability, and your physician stays with you for the full program." } },
    { "@type": "Question", "name": "Do I need to come in for bloodwork near Arlington?", "acceptedAnswer": { "@type": "Answer", "text": "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Arlington or Alexandria. You go in, get your blood drawn, and results come directly to Dr. Al-Deek. No office visit to MedMethod Direct is ever required." } },
    { "@type": "Question", "name": "What is bioidentical hormone therapy (BHRT) and is it available near Arlington?", "acceptedAnswer": { "@type": "Answer", "text": "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Arlington address." } },
    { "@type": "Question", "name": "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?", "acceptedAnswer": { "@type": "Answer", "text": "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "We are a direct-care practice and do not bill insurance. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." } },
    { "@type": "Question", "name": "What does the $449 Clinical Diagnostic & Setup Fee include?", "acceptedAnswer": { "@type": "Answer", "text": "The $449 fee covers your comprehensive initial bloodwork, your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Virginia", "item": "https://medmethoddirect.com/virginia" },
    { "@type": "ListItem", "position": 3, "name": "Arlington", "item": "https://medmethoddirect.com/virginia/arlington" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Arlington, VA?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Virginia, serving women in Arlington, Alexandria, Crystal City, Rosslyn, Clarendon, and the broader Northern Virginia area. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Arlington, Virginia?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Arlington and Alexandria. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "How is MedMethod Direct different from local practices in Arlington?", a: "Arlington has more medical practices per capita than most Northern Virginia cities, but very few specialize in the intersection of hormones and weight loss. MedMethod Direct treats both as a unified clinical problem. Appointments are 30–60 minutes, same-week availability, and your physician stays with you for the full 6 or 12-month program." },
  { q: "Do I need to come in for bloodwork near Arlington?", a: "No. We order your labs to a LabCorp or Quest Diagnostics draw site near Arlington or Alexandria. You go in, get your blood drawn, and results come directly to Dr. Al-Deek. No office visit to MedMethod Direct is ever required." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Arlington?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Arlington address." },
  { q: "How is MedMethod Direct different from Hers, Winona, or other telehealth platforms?", a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program — rather than treating each issue separately." },
  { q: "Does MedMethod Direct accept insurance?", a: "We are a direct-care practice and do not bill insurance. This allows same-week availability, 30–60 minute appointments, and care not limited by insurance coverage. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." },
  { q: "What does the $449 Clinical Diagnostic & Setup Fee include?", a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee." },
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
  { icon: "🏙️", title: "Urban Convenience, Zero Commute", desc: "Arlington is dense and fast-paced. MedMethod Direct gives you specialist-level care without adding another appointment to your commute." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No 6-week specialist waits. Most Arlington patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven Protocols", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Arlington or Alexandria." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Arlington address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I live in Clarendon and work in DC — my schedule is relentless. MedMethod Direct was the only option that actually fit my life. Virtual consultation, labs ordered nearby, medication shipped to my door. Down 24 pounds and my perimenopause symptoms are finally under control.", name: "Amanda P.", location: "Arlington, VA — Clarendon", rating: 5 },
  { quote: "I'd seen three different doctors in Arlington about my weight and hormones and kept getting told my labs were 'within normal range.' Dr. Al-Deek looked at the same numbers differently — and within 90 days I understood what had been going wrong for years.", name: "Stephanie W.", location: "Alexandria, VA", rating: 5 },
  { quote: "The combination of hormone therapy and tirzepatide together was the key. I'd tried tirzepatide alone for six months with limited results. Adding the hormone protocol broke through the plateau completely. I'm down 31 pounds and feel better than I did at 35.", name: "Nicole B.", location: "Arlington, VA — Rosslyn area", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationArlington() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Arlington, VA | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Arlington, Alexandria, and Northern Virginia. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/virginia/arlington" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Arlington, VA | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Arlington and Alexandria, VA. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/virginia/arlington" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone & Weight Loss Doctor in Arlington, VA" />
        <meta name="twitter:description" content="Same-week virtual menopause and GLP-1 weight loss care for women in Arlington and Alexandria, VA. Dr. Jumana Al-Deek, DO." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0D0D1A]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1600&q=80')" }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,13,26,0.97) 0%, rgba(13,13,26,0.75) 60%, rgba(232,51,158,0.12) 100%)" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-8 w-full py-24 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-[#E8339E]" />
                <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>Arlington, Virginia</span>
              </div>
              <h1 className="font-black leading-none mb-6 text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
                VIRTUAL HORMONE,{" "}
                <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MENOPAUSE</span>{" "}
                &{" "}
                <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>WEIGHT LOSS</span>{" "}
                FOR ARLINGTON WOMEN
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Physician-led virtual care for women in Arlington, Alexandria, and Northern Virginia. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-8 py-4 rounded-full text-sm font-bold tracking-wider" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  SCHEDULE FREE CONSULTATION →
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <CheckCircle2 className="w-4 h-4 text-[#E8339E]" />
                <span>100% Virtual · Licensed in Virginia · No Office Visits Required</span>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="font-black mb-1" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2.4rem", background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                  <div className="text-white/50 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING ARLINGTON & NORTHERN VIRGINIA</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause & Weight Loss Physician for Arlington Women — Without the Wait
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              Arlington is one of the most competitive medical markets in Northern Virginia — but very few local practices specialize in the intersection of <strong>hormone therapy and medical weight loss</strong>. If you've been searching for a <strong>menopause doctor near Arlington VA</strong> or a <strong>GLP-1 weight loss physician in Northern Virginia</strong>, MedMethod Direct offers something the local market doesn't: a physician who treats both as one problem.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated virtual program. Labs ordered to <strong>LabCorp or Quest Diagnostics near Arlington or Alexandria</strong>. Medications shipped to your door.
            </p>
            <p>
              Arlington women often come to us after being told their labs are "normal" by local practices. The issue is that standard reference ranges don't reflect optimal hormonal function for women in perimenopause. Dr. Al-Deek reads the same labs differently — and the results speak for themselves.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Arlington VA", "GLP-1 Weight Loss Alexandria", "Hormone Therapy Northern Virginia", "BHRT Arlington Virginia", "Semaglutide Arlington VA", "Perimenopause Specialist Arlington", "Testosterone Therapy Women VA", "Online Menopause Doctor Northern Virginia"].map((kw) => (
                <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/30 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{kw}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Related reading:{" "}
              <a href="/blog/semaglutide-vs-tirzepatide-women-midlife" className="text-[#E8339E] hover:underline">Semaglutide vs. Tirzepatide for Women in Midlife</a>
              {" · "}
              <a href="/blog/why-weight-gain-feels-different-in-menopause" className="text-[#E8339E] hover:underline">Why Weight Gain Feels Different in Menopause</a>
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

      {/* ── WHY ARLINGTON WOMEN CHOOSE US ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY ARLINGTON WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Built for Northern Virginia's Most Demanding Schedules</h2>
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
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Arlington & Alexandria — Common Questions</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>ARLINGTON, VIRGINIA</p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.</p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Arlington, Alexandria, Crystal City, Rosslyn, Clarendon, and Northern Virginia</p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
