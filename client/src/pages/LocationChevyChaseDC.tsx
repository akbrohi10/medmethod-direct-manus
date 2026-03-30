/* =============================================================================
   /washington-dc/chevy-chase-dc — Chevy Chase DC Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Chevy Chase DC, virtual hormone therapy Chevy Chase Washington DC,
   GLP-1 weight loss Chevy Chase DC, perimenopause treatment Chevy Chase DC, semaglutide Chevy Chase DC,
   bioidentical hormone therapy Chevy Chase DC, testosterone therapy women Chevy Chase DC,
   online menopause doctor Chevy Chase Washington DC
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, ArrowRight, Star } from "lucide-react";
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
  "name": "MedMethod Direct — Chevy Chase DC, Washington DC",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Chevy Chase DC, Washington DC. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy — 100% virtual, licensed in DC.",
  "url": "https://medmethoddirect.com/washington-dc/chevy-chase-dc",
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
  "areaServed": { "@type": "Neighborhood", "name": "Chevy Chase DC", "containedInPlace": { "@type": "City", "name": "Washington DC" } },
  "isAcceptingNewPatients": true,
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": { "@type": "Physician", "name": "Dr. Jumana Al-Deek", "honorificSuffix": "DO", "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is there a menopause doctor near Chevy Chase DC?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Washington DC, serving women in Chevy Chase DC, Friendship Heights, Tenleytown, and throughout Upper Northwest DC. Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." } },
    { "@type": "Question", "name": "Can I get semaglutide or tirzepatide prescribed online near Chevy Chase DC?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Chevy Chase DC and throughout the District. Labs are ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." } },
    { "@type": "Question", "name": "How is Chevy Chase DC different from Chevy Chase Maryland — and do you serve both?", "acceptedAnswer": { "@type": "Answer", "text": "Chevy Chase DC is the portion of the Chevy Chase neighborhood within the District of Columbia boundary, while Chevy Chase Maryland is just across the state line. MedMethod Direct is licensed in both DC and Maryland, so we serve patients on both sides of the line under the same physician-led program." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Washington DC", "item": "https://medmethoddirect.com/washington-dc" },
    { "@type": "ListItem", "position": 3, "name": "Chevy Chase DC", "item": "https://medmethoddirect.com/washington-dc/chevy-chase-dc" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Chevy Chase DC?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Washington DC, serving women in Chevy Chase DC, Friendship Heights, Tenleytown, and throughout Upper Northwest DC. Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Chevy Chase DC?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Chevy Chase DC and throughout the District. Labs are ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "How is Chevy Chase DC different from Chevy Chase Maryland — and do you serve both?", a: "Chevy Chase DC is the portion of the Chevy Chase neighborhood within the District of Columbia boundary, while Chevy Chase Maryland is just across the state line. MedMethod Direct is licensed in both DC and Maryland, so we serve patients on both sides of the line under the same physician-led program." },
  { q: "Do I need to come in for bloodwork near Chevy Chase DC?", a: "No office visit to MedMethod Direct is ever required. There are LabCorp and Quest Diagnostics locations in Upper Northwest DC and just across the line in Chevy Chase Maryland. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "How is MedMethod Direct different from local practices near Chevy Chase DC?", a: "Chevy Chase DC is one of Washington's most affluent and health-conscious neighborhoods. Even so, most local practices offer 10–15 minute appointments and 4–8 week waits. MedMethod Direct offers 30–60 minute appointments, same-week availability, and a program that treats hormones and GLP-1 weight loss as a single clinical problem." },
  { q: "Can MedMethod Direct also serve patients in nearby Chevy Chase Maryland or Bethesda?", a: "Yes. MedMethod Direct is licensed in DC, Maryland, and Virginia. Many Chevy Chase DC patients have family or colleagues in nearby Chevy Chase MD, Bethesda, or Potomac — we serve the entire DC metro area under the same physician-led program." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." },
  { q: "How soon can I start as a patient in Chevy Chase DC?", a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Chevy Chase DC patients are on their program within 1–2 weeks of their first call." },

  {
    q: "What makes MedMethod Direct different from other telehealth services?",
    a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path \u2014 starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Wellness Advisor throughout your entire journey.",
  },
  {
    q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
    a: "Yes \u2014 this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido \u2014 these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Wellness Advisor.",
  },
  {
    q: "How is this different from just getting a prescription online?",
    a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Wellness Advisor who supports you every step of the way. We treat the whole person, not just a symptom.",
  },
  {
    q: "What kind of lab work do you order?",
    a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan \u2014 not a guess.",
  },
  {
    q: "Is everything done virtually?",
    a: "Yes \u2014 all consultations, follow-ups, and ongoing care are conducted via telehealth. You'll complete lab work at a local lab near you (we'll provide the order), and your medications (FDA-approved brand or compounded from a licensed 503B outsourcing pharmacy) and supplements are shipped directly to your home. No waiting rooms, no commuting, no disruption to your schedule.",
  },
  {
    q: "How quickly will I see results?",
    a: "Many patients report noticeable improvements in sleep, energy, and mood within 4\u20136 weeks of starting treatment. Optimal hormone balance typically occurs at the 3\u20136 month mark. Weight loss results vary, but most patients see meaningful progress within the first 4\u20138 weeks, especially when the nutrition and fitness plan is followed alongside medical treatment.",
  },
  {
    q: "Do you use FDA-approved medications or compounded ones?",
    a: "Both \u2014 and the distinction matters. FDA-approved brand-name medications like Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, and Zepbound\u00ae have undergone full FDA review for safety and efficacy. Compounded medications use the same active ingredients (Semaglutide or Tirzepatide) but are prepared by a licensed 503B outsourcing facility \u2014 a federally registered, FDA-inspected pharmacy held to strict quality and sterility standards. Compounded options are often more affordable and allow for custom dosing. Your physician will discuss both options during your consultation and recommend the best fit based on your insurance, budget, and clinical needs. Either way, your medication ships directly to your door.",
  },
  {
    q: "What does treatment cost?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your free consultation will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible \u2014 and we're committed to being upfront about every cost.",
  },
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes \u2014 we can write prescriptions for brand-name medications (Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, Zepbound\u00ae) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee \u2014 but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
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
    label: "Chevy Chase DC & DC",
    icon: "\uD83D\uDCCD",
    questions: faqs.slice(0, 9),
  },
  {
    id: "care",
    label: "About Our Care",
    icon: "\uD83E\uDE7A",
    questions: faqs.slice(9, 14),
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "\uD83D\uDC8A",
    questions: faqs.slice(14, 18),
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "\uD83D\uDCB3",
    questions: faqs.slice(18),
  },
];

const whyCards = [
  { icon: "🏡", title: "Upper Northwest's Premier Virtual Clinic", desc: "Chevy Chase DC women expect the best — MedMethod Direct delivers physician-led, lab-driven hormone and weight loss care that matches the standard of the neighborhood." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most Chevy Chase DC patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Chevy Chase DC or Upper Northwest." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Chevy Chase DC address. No pharmacy runs, no prior authorization battles." },
  { icon: "🗺️", title: "Serving Both Sides of the DC-MD Line", desc: "Licensed in DC and Maryland — we serve Chevy Chase DC and Chevy Chase MD under the same program, so your care doesn't change if you move across the line." },
];

const testimonials = [
  { quote: "I've lived in Chevy Chase DC for 20 years and I've seen every doctor in the area. MedMethod Direct is different because they actually spend time on your case. Dr. Al-Deek reviewed my labs personally and explained the hormone-weight connection in a way no one ever had. Down 19 pounds in 11 weeks.", name: "Catherine B.", location: "Chevy Chase DC", rating: 5 },
  { quote: "I was skeptical of telehealth but the convenience sold me. I scheduled my consultation during a lunch break, had labs done at the LabCorp on Wisconsin Ave, and was on my protocol within 10 days. The results have been remarkable — 22 pounds down and my hot flashes are completely gone.", name: "Margaret H.", location: "Chevy Chase DC — Friendship Heights", rating: 5 },
  { quote: "What I appreciate most is that Dr. Al-Deek treats the whole picture. My previous doctor wanted to treat my menopause symptoms and my weight separately. MedMethod Direct understood from day one that they're the same problem. That insight changed everything.", name: "Susan W.", location: "Chevy Chase DC — Tenleytown", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationChevyChaseDC() {
  const [activeFaqTab, setActiveFaqTab] = useState("local");
  const activeFaqCategory = faqCategories.find((c) => c.id === activeFaqTab)!;
  const [consultOpen, setConsultOpen] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateCount(setCount1, 0, 10000, 1500);
          animateCount(setCount2, 0, 98, 1200);
          animateCount(setCount3, 0, 15, 1400);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  function animateCount(setter: (v: number) => void, from: number, to: number, duration: number) {
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Chevy Chase DC | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Chevy Chase DC, Washington DC. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/washington-dc/chevy-chase-dc" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Chevy Chase DC | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Chevy Chase DC. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/washington-dc/chevy-chase-dc" />
        <meta property="og:type" content="website" />
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
                  Serving Chevy Chase DC, Washington DC
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                  <br />
                  for Chevy Chase DC women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Chevy Chase DC and Upper Northwest Washington. Hormone therapy, GLP-1 weight loss, and menopause care — all in one integrated program. No commute. Same-week availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Washington DC &amp; Maryland
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
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-physician-female-v3a_18c4eb42.jpg"
                    alt="Virtual menopause and hormone therapy doctor for women in Chevy Chase DC — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Chevy Chase DC · Friendship Heights · Tenleytown · American University Park · Upper Northwest DC</p>
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING CHEVY CHASE DC & UPPER NORTHWEST</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Chevy Chase DC Women
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Chevy Chase DC</strong> or a <strong>GLP-1 weight loss physician in Upper Northwest Washington</strong>, MedMethod Direct was built for you. Chevy Chase DC is one of the District's most affluent and health-conscious neighborhoods — home to professionals, executives, and families who expect the highest standard of care.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all through a single integrated virtual program. No waiting rooms. No commute. Same-week availability.
            </p>
            <p>
              MedMethod Direct is also unique in serving both <strong>Chevy Chase DC</strong> and <strong>Chevy Chase Maryland</strong> under the same physician-led program. If you live on the DC side but work or shop on the Maryland side, your care is seamless — one physician, one program, one relationship.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Licensed in both Washington DC and Maryland",
              "Hormones + weight loss treated as one integrated program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near Chevy Chase DC",
              "Same-week availability — no 4–8 week wait",
              "One physician for your full 6 or 12-month program",
              "Medications shipped directly to your DC address",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#E8339E" }} />
                <span className="text-sm text-gray-700 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{item}</span>
              </div>
            ))}
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
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #C026D3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>built by physicians, for women.</span>"
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>Most programs treat the symptom. We treat the biology — and we stay with you until the results are real.</p>
        </div>
      </div>

      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── LOCAL WHY CARDS ── */}
      <section className="py-20 bg-[#F8F4F9]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY CHEVY CHASE DC WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Premium Care for Upper Northwest DC Women</h2>
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
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>PATIENT STORIES</p>
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>What Chevy Chase DC Women Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8339E] text-[#E8339E]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#111111] text-sm">{t.name}</p>
                  <p className="text-[#E8339E] text-xs">{t.location}</p>
                </div>
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
              Frequently Asked Questions for{" "}<span style={{background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Chevy Chase DC Patients</span>
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

      {/* ── CROSS-LINKS ── */}
      <section className="py-14 bg-white">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>ALSO SERVING NEARBY</p>
          <h2 className="font-black text-[#111111] mb-8 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
            Chevy Chase Neighbors on Both Sides of the Line
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Washington DC Hub", href: "/washington-dc", sub: "All DC neighborhoods" },
              { name: "Chevy Chase, Maryland", href: "/maryland/chevy-chase", sub: "Just across the DC-MD line" },
              { name: "Bethesda, Maryland", href: "/maryland/bethesda", sub: "Montgomery County, MD" },
            ].map((link) => (
              <a key={link.name} href={link.href} className="group flex items-center justify-between rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#FAFAFA" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: "#E8339E" }} />
                    <span className="font-black text-[#111111] text-sm">{link.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{link.sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E8339E] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a1e 100%)" }}>
        <div className="max-w-[640px] mx-auto">
          <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4" style={{ color: "#E8339E" }}>Chevy Chase DC, Washington DC</span>
          <h2 className="font-black text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.15 }}>
            Ready to Start?{" "}
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We Can See You This Week.
            </span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Free 20-minute consultation with a member of our clinical team. No obligation, no pressure. Available to all Chevy Chase DC and Washington DC residents.
          </p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2">
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs mt-5">
            Serving Chevy Chase DC · Friendship Heights · Tenleytown · American University Park · Upper Northwest DC
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
