/* =============================================================================
   /maryland/bethesda — Bethesda, MD Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Bethesda MD, virtual hormone therapy Bethesda Maryland,
   GLP-1 weight loss Bethesda MD, perimenopause treatment Bethesda, semaglutide Bethesda Maryland,
   bioidentical hormone therapy Bethesda, testosterone therapy women Bethesda MD,
   online menopause doctor Montgomery County Maryland
   ============================================================================= */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ArrowRight, Building2, Calendar, CheckCircle2, ChevronDown, ChevronUp, FlaskConical, MapPin, Microscope, Pill, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HowItWorks from "@/components/HowItWorks";
import PopularPrograms from "@/components/PopularPrograms";
import Services from "@/components/Services";
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";

const JSONLD_LOCAL = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Bethesda, MD",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Bethesda, Chevy Chase, and Montgomery County, Maryland. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Maryland.",
  "url": "https://medmethoddirect.com/maryland/bethesda",
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
    { "@type": "City", "name": "Bethesda", "containedInPlace": { "@type": "State", "name": "Maryland" } },
    { "@type": "City", "name": "Chevy Chase", "containedInPlace": { "@type": "State", "name": "Maryland" } },
    { "@type": "City", "name": "Rockville", "containedInPlace": { "@type": "State", "name": "Maryland" } },
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
    { "@type": "Question", "name": "Is there a menopause doctor near Bethesda, MD?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Maryland, serving women in Bethesda, Chevy Chase, Potomac, Rockville, and throughout Montgomery County. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your appointment." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide prescribed online near Bethesda, Maryland?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Bethesda and Montgomery County. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped to your Bethesda address." } },
    { "@type": "Question", "name": "How does virtual hormone therapy work for Bethesda patients?", "acceptedAnswer": { "@type": "Answer", "text": "After your appointment, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near Bethesda. Dr. Al-Deek reviews your results and builds a personalized protocol — which may include HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual." } },
    { "@type": "Question", "name": "Do I need to come in for bloodwork near Bethesda?", "acceptedAnswer": { "@type": "Answer", "text": "No office visit to MedMethod Direct is ever required. We order your labs to a LabCorp or Quest Diagnostics draw site near Bethesda. Bethesda and Montgomery County have excellent lab density — you go in, get your blood drawn, and results come directly to Dr. Al-Deek." } },
    { "@type": "Question", "name": "How is MedMethod Direct different from practices near NIH or Georgetown?", "acceptedAnswer": { "@type": "Answer", "text": "Bethesda women near NIH and Georgetown know what specialist-level care looks like. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at Montgomery County practices), and a virtual program that treats hormones and GLP-1 weight loss as a single clinical problem." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "We are a direct-care practice and do not bill insurance. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Maryland", "item": "https://medmethoddirect.com/maryland" },
    { "@type": "ListItem", "position": 3, "name": "Bethesda", "item": "https://medmethoddirect.com/maryland/bethesda" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Bethesda, MD?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Maryland, serving women in Bethesda, Chevy Chase, Potomac, Rockville, and throughout Montgomery County. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your appointment." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Bethesda, Maryland?", a: "Yes. After reviewing your health history and clinical needs, Dr. Al-Deek can prescribe an appropriate medication when indicated. Medication selection, pharmacy fulfillment, and insurance considerations are discussed during your visit. If a compounded medication is considered, it is not FDA-approved, and FDA does not review compounded drugs for safety, effectiveness, or quality before marketing." },
  { q: "Do I need to come in for bloodwork near Bethesda?", a: "No office visit to MedMethod Direct is ever required. Bethesda and Montgomery County have excellent lab density — LabCorp and Quest Diagnostics locations throughout the area. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Bethesda?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Bethesda address." },
  { q: "How is MedMethod Direct different from practices near NIH or Georgetown?", a: "Bethesda women near NIH and Georgetown know what specialist-level care looks like — and they know when they're not getting it. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most Montgomery County practices), and a virtual program that treats hormones and GLP-1 weight loss as a single clinical problem." },
  { q: "Can MedMethod Direct also serve patients in McLean or Great Falls, Virginia?", a: "Yes. MedMethod Direct is licensed in both Maryland and Virginia. Many patients in Bethesda and Chevy Chase have family or colleagues in nearby McLean, Great Falls, and Northern Virginia — we serve both communities under the same physician-led program." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process." },
  { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "When clinically appropriate, Dr. Al-Deek can send a prescription to a retail or mail-order pharmacy. Coverage and prior-authorization requirements vary by insurance plan. If prior authorization is required, our team can explain the available support and any applicable fee before proceeding; denied requests do not include an appeal. Medication and fulfillment options will be reviewed during your consultation." },
  { q: "What does the $449 Clinical Diagnostic & Setup Fee include?", a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee." },
  { q: "How soon can I start as a patient in Bethesda?", a: "Most patients complete their appointment within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Bethesda patients are on their program within 1–2 weeks of their first call." },

  {
    q: "What makes MedMethod Direct different from other telehealth services?",
    a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path \u2014 starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Performance Coach throughout your entire journey.",
  },
  {
    q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
    a: "Yes \u2014 this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido \u2014 these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Performance Coach.",
  },
  {
    q: "How is this different from just getting a prescription online?",
    a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Performance Coach who supports you every step of the way. We treat the whole person, not just a symptom.",
  },
  {
    q: "What kind of lab work do you order?",
    a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan \u2014 not a guess.",
  },
  {
    q: "Is everything done virtually?",
    a: "Yes — consultations, follow-ups, and ongoing care are conducted through secure telehealth. You may complete ordered lab work at a local lab, and any medication prescribed by your physician will be fulfilled through an appropriate pharmacy. No waiting rooms, commuting, or unnecessary disruption to your schedule.",
  },
  {
    q: "How quickly will I see results?",
    a: "Responses to treatment vary. Dr. Al-Deek will monitor your symptoms, laboratory findings, medication response, and goals and will adjust your plan when clinically appropriate.",
  },
  {
    q: "Do you use FDA-approved medications or compounded ones?",
    a: "Medication selection is individualized and based on your health history, clinical needs, and treatment goals. If a compounded medication is clinically appropriate, Dr. Al-Deek will explain why it is being considered, available alternatives, expected costs, and pharmacy fulfillment before you decide how to proceed. Compounded medications are not FDA-approved, and FDA does not review compounded drugs for safety, effectiveness, or quality before marketing.",
  },
  {
    q: "How is pricing structured?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your appointment will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible \u2014 and we're committed to being upfront about every cost.",
  },
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "When clinically appropriate, Dr. Al-Deek can send a prescription to a retail or mail-order pharmacy. Coverage and prior-authorization requirements vary by insurance plan. If prior authorization is required, our team can explain the available support and any applicable fee before proceeding; denied requests do not include an appeal. Medication and fulfillment options will be reviewed during your consultation.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-bold text-base" style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}>{q}</span>
        <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>{a}</p>
      </div>
    </div>
  );
}

const faqCategories = [
  {
    id: "local",
    label: "Bethesda & MD",
    icon: "\uD83D\uDCCD",
    questions: faqs.slice(0, 11),
  },
  {
    id: "care",
    label: "About Our Care",
    icon: "\uD83E\uDE7A",
    questions: faqs.slice(11, 16),
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "\uD83D\uDC8A",
    questions: faqs.slice(16, 20),
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "\uD83D\uDCB3",
    questions: faqs.slice(20),
  },
];

const whyCards = [
  { icon: <Building2 className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Built for NIH-Adjacent Women", desc: "Bethesda women near NIH and Georgetown know what specialist-level care looks like. MedMethod Direct delivers it — virtually, same week, without the 4–8 week wait." },
  { icon: <Microscope className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Hormones + Weight Loss: One Program", desc: "We're one of the few virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: <Calendar className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Same-Week Availability", desc: "No long waits. Most Bethesda patients are seen within days of their appointment and on their protocol within two weeks." },
  { icon: <FlaskConical className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Bethesda or Chevy Chase." },
  { icon: <Pill className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Bethesda address. No pharmacy runs, no prior authorization battles." },
  { icon: <UserCheck className="w-6 h-6" style={{ color: "#E8339E" }} />, title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];



export default function LocationBethesda() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Bethesda, MD | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Bethesda, Chevy Chase, and Montgomery County, MD. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/maryland/bethesda" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Bethesda, MD | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Bethesda and Montgomery County, MD. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/maryland/bethesda" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Hormone & Weight Loss Doctor in Bethesda, MD" />
        <meta name="twitter:description" content="Same-week virtual menopause and GLP-1 weight loss care for women in Bethesda and Montgomery County, MD. Dr. Jumana Al-Deek, DO." />
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
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(232,51,158,0.08)", color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  Serving Bethesda, Maryland
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}
                  <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                  <br />
                  <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                  <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                  <br />
                  for Bethesda women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Bethesda, Chevy Chase, and Montgomery County. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE appointment
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Maryland
                </p>
              </div>
              <div className="relative lg:-ml-6">
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }} />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-physician-female-v3a_18c4eb42.jpg"
                    alt="Virtual menopause and hormone therapy doctor for women in Bethesda, Maryland — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Bethesda · Chevy Chase · Potomac · Rockville · Silver Spring</p>
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING BETHESDA & MONTGOMERY COUNTY, MD</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Bethesda Women — From Wherever You Are
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Bethesda MD</strong> or a <strong>GLP-1 weight loss physician in Montgomery County</strong>, MedMethod Direct was built for you. Bethesda women near NIH, Walter Reed, and Georgetown University Medical Center are among the most medically sophisticated patients in the country — and they deserve care that matches that standard.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated virtual program. Labs ordered to <strong>LabCorp or Quest Diagnostics near Bethesda or Chevy Chase</strong>. Medications shipped to your door.
            </p>
            <p>
              Many Bethesda women come to us after plateauing on GLP-1 medications prescribed elsewhere. The reason is almost always hormonal — declining estrogen, low testosterone, and insulin resistance all reduce the effectiveness of semaglutide and tirzepatide. By treating <strong>hormones and weight loss as a unified clinical problem</strong>, we achieve results that single-specialty programs miss. MedMethod Direct is also licensed in Virginia, making us the natural choice for women in the DC metro corridor spanning both states.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Bethesda MD", "GLP-1 Weight Loss Montgomery County", "Hormone Therapy Bethesda", "BHRT Bethesda Maryland", "Semaglutide Bethesda MD", "Perimenopause Specialist Bethesda", "Testosterone Therapy Women Bethesda", "Online Hormone Testing Maryland"].map((kw) => (
                <span key={kw} className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E8339E]/30 text-[#E8339E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{kw}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Related reading:{" "}
              <a href="/blog" className="text-[#E8339E] hover:underline">Semaglutide vs. Tirzepatide for Women in Midlife</a>
              {" · "}
              <a href="/blog" className="text-[#E8339E] hover:underline">Can Hormone Therapy Help With Weight, Sleep &amp; Metabolism?</a>
            </p>
          </div>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <Services onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />

      <div className="relative py-12 overflow-hidden" style={{ background: "#0D0D1A" }}>
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8339E, transparent)" }} />
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 text-center">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>THE MEDMETHOD STANDARD</p>
          <h2 className="font-black text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
            "The system you've been missing —{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>built by physicians, for women.</span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.</p>
        </div>
      </div>

      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY BETHESDA WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Built for Montgomery County</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(232,51,158,0.08)" }}>{card.icon}</div>
                <h3 className="font-bold text-[#111111] text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── FAQ (Categorized Tabs) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Bethesda Patients</span>
            </h2>
          </div>
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqTab(cat.id)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  background: activeFaqTab === cat.id ? "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" : "#fff",
                  color: activeFaqTab === cat.id ? "#fff" : "#555",
                  borderColor: activeFaqTab === cat.id ? "transparent" : "#e5e5e5",
                  boxShadow: activeFaqTab === cat.id ? "0 4px 14px rgba(232,51,158,0.25)" : "none",
                }}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          {/* Active tab content */}
          <div className="min-h-[200px]">
            <div className="mb-4">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
                {activeFaqCategory.label}
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#888" }}>
                {activeFaqCategory.questions.length} questions
              </p>
            </div>
            {activeFaqCategory.questions.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>BETHESDA, MARYLAND</p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.</p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SCHEDULE appointment <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Bethesda, Chevy Chase, Potomac, Rockville, and all of Montgomery County</p>
        </div>
      </section>

      {/* Cross-link: Bethesda → McLean */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}>ALSO SERVING NEARBY</p>
            <h3 className="font-black text-xl mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#0D0D1A", letterSpacing: "-0.02em" }}>McLean, Virginia — Just Across the DC Line</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              MedMethod Direct serves patients throughout the DC metro area, including McLean, Great Falls, Vienna, and all of Northern Virginia. If you work in McLean or have family there, you and your loved ones can access the same physician-led hormone therapy and GLP-1 weight loss programs — 100% virtually, no matter which side of the state line you’re on.
            </p>
          </div>
          <a
            href="/virginia/mclean"
            className="inline-flex items-center gap-2 font-bold text-sm tracking-wider rounded-full px-7 py-3 whitespace-nowrap transition-all hover:shadow-lg flex-shrink-0"
            style={{ fontFamily: "Montserrat, sans-serif", background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", color: "#fff" }}
          >
            View McLean, VA Service Area <ArrowRight className="w-4 h-4" />
          </a>
        </div>
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
    </div>
  );
}
