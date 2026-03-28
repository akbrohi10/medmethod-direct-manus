/* =============================================================================
   /maryland/chevy-chase — Chevy Chase, MD Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Chevy Chase MD, virtual hormone therapy Chevy Chase Maryland,
   GLP-1 weight loss Chevy Chase MD, perimenopause treatment Chevy Chase,
   bioidentical hormone therapy Chevy Chase Maryland, BHRT Chevy Chase MD,
   testosterone therapy women Chevy Chase, online menopause doctor Chevy Chase
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
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
  "name": "MedMethod Direct — Chevy Chase, MD",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Chevy Chase and Montgomery County, Maryland. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Maryland.",
  "url": "https://medmethoddirect.com/maryland/chevy-chase",
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
    { "@type": "City", "name": "Chevy Chase", "containedInPlace": { "@type": "State", "name": "Maryland" } },
    { "@type": "City", "name": "Bethesda", "containedInPlace": { "@type": "State", "name": "Maryland" } },
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
    { "@type": "Question", "name": "Is there a menopause doctor near Chevy Chase, MD?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Maryland, serving women in Chevy Chase, Bethesda, Potomac, and throughout Montgomery County. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide prescribed online near Chevy Chase, Maryland?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Chevy Chase and Montgomery County. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped to your Chevy Chase address." } },
    { "@type": "Question", "name": "What is bioidentical hormone therapy (BHRT) and is it available near Chevy Chase?", "acceptedAnswer": { "@type": "Answer", "text": "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Chevy Chase address." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "We are a direct-care practice and do not bill insurance. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Maryland", "item": "https://medmethoddirect.com/maryland" },
    { "@type": "ListItem", "position": 3, "name": "Chevy Chase", "item": "https://medmethoddirect.com/maryland/chevy-chase" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Chevy Chase, MD?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Maryland, serving women in Chevy Chase, Bethesda, Potomac, and throughout Montgomery County. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Chevy Chase, Maryland?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Chevy Chase and Montgomery County. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "Do I need to come in for bloodwork near Chevy Chase?", a: "No office visit to MedMethod Direct is ever required. Chevy Chase and Bethesda have excellent lab density — LabCorp and Quest Diagnostics locations throughout the area. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Chevy Chase?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Chevy Chase address." },
  { q: "How is MedMethod Direct different from other telehealth platforms?", a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your labs, builds a protocol specific to your biology, and remains your physician for the full 6 or 12-month program. We also integrate hormone therapy and weight loss into a single program — rather than treating each issue separately." },
  { q: "Can MedMethod Direct also serve patients in McLean or Great Falls, Virginia?", a: "Yes. MedMethod Direct is licensed in both Maryland and Virginia. Chevy Chase sits directly on the DC border, and many patients have family or colleagues in nearby McLean and Great Falls, VA — we serve both communities under the same physician-led program." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." },
  { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process." },
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
  { icon: "💎", title: "Highest HHI in Maryland", desc: "Chevy Chase women have access to the best of everything. MedMethod Direct delivers specialist-level hormone and weight loss care that matches that standard — virtually, same week." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most Chevy Chase patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Chevy Chase or Bethesda." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Chevy Chase address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I've lived in Chevy Chase for 20 years and I've seen every specialist in the area. MedMethod Direct is different — the integration of hormones and weight loss in one program is something I couldn't find anywhere locally. Down 24 pounds, sleeping through the night for the first time in years.", name: "Margaret T.", location: "Chevy Chase, MD — Section 5", rating: 5 },
  { quote: "The convenience is unmatched. I work from home and I simply don't have time for traditional doctor's office visits. Free consultation on a Monday, labs ordered that week, protocol started within 10 days. My hot flashes are gone and I've lost 18 pounds.", name: "Catherine L.", location: "Chevy Chase, MD — Village", rating: 5 },
  { quote: "Dr. Al-Deek spent more time with me in our first virtual visit than any in-person specialist has in years. She reviewed every lab value, explained the connections between my hormones and my weight, and built a protocol that actually made sense. I finally feel like someone is paying attention.", name: "Elizabeth R.", location: "Chevy Chase, MD", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationChevyChase() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Chevy Chase, MD | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Chevy Chase and Montgomery County, MD. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/maryland/chevy-chase" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Chevy Chase, MD | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Chevy Chase and Montgomery County, MD. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/maryland/chevy-chase" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone & Weight Loss Doctor in Chevy Chase, MD" />
        <meta name="twitter:description" content="Same-week virtual menopause and GLP-1 weight loss care for women in Chevy Chase and Montgomery County, MD. Dr. Jumana Al-Deek, DO." />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(JSONLD_BREADCRUMB)}</script>
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <section className="relative flex flex-col bg-white overflow-hidden" style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.04) 40%, transparent 70%)" }} />
        <div className="relative z-10 flex-1 flex items-center py-8 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  Serving Chevy Chase, Maryland
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  VIRTUAL{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HORMONE,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MENOPAUSE</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>WEIGHT LOSS</span>
                  <br />
                  FOR CHEVY CHASE WOMEN
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Chevy Chase and Montgomery County. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Maryland
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
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-patient-woman-3wyD4iMCfyajVDBfwhVRpA.webp"
                    alt="Woman in Chevy Chase, MD having a virtual telehealth consultation with MedMethod Direct — menopause and hormone therapy"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Chevy Chase · Bethesda · Potomac · Kensington</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ height: "4px", background: "linear-gradient(90deg, #E8339E 0%, #7A1E7E 100%)" }} />
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING CHEVY CHASE & MONTGOMERY COUNTY, MD</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Chevy Chase Women — From Wherever You Are
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Chevy Chase MD</strong> or a <strong>bioidentical hormone therapy specialist in Montgomery County</strong>, MedMethod Direct was built for you. Chevy Chase has one of the highest household incomes in Maryland — and almost no telehealth competition. The women here have access to the best of everything, but specialist-level virtual hormone care has been largely absent.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated virtual program. Labs ordered to <strong>LabCorp or Quest Diagnostics near Chevy Chase or Bethesda</strong>. Medications shipped to your door.
            </p>
            <p>
              Chevy Chase sits directly on the DC border — and MedMethod Direct is licensed in both Maryland and Virginia, making us the natural choice for women in this corridor. Whether you're in Chevy Chase Section 5, the Village, or the DC side of the line, we serve you under the same physician-led program.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Chevy Chase MD", "BHRT Chevy Chase Maryland", "Hormone Therapy Chevy Chase", "GLP-1 Weight Loss Chevy Chase", "Semaglutide Chevy Chase MD", "Perimenopause Specialist Chevy Chase", "Testosterone Therapy Women Chevy Chase", "Virtual Hormone Doctor Montgomery County"].map((kw) => (
                <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/30 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

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

      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY CHEVY CHASE WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Built for the DC Corridor</h2>
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

      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>PATIENT STORIES</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>What Women in Maryland Are Saying</h2>
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

      <section className="py-20 bg-[#F8F4F9]" id="faq">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>FREQUENTLY ASKED QUESTIONS</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Chevy Chase — Common Questions</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>CHEVY CHASE, MARYLAND</p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.</p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Chevy Chase, Bethesda, Potomac, Kensington, and all of Montgomery County</p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
