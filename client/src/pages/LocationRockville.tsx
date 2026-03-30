/* =============================================================================
   /maryland/rockville — Rockville, MD Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Rockville MD, virtual hormone therapy Rockville Maryland,
   GLP-1 weight loss Rockville MD, perimenopause treatment Rockville,
   semaglutide Rockville Maryland, bioidentical hormone therapy Rockville,
   testosterone therapy women Rockville MD, online menopause doctor Rockville Maryland
   ============================================================================= */
import { useState, useRef, useEffect } from "react";
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
  "name": "MedMethod Direct — Rockville, MD",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Rockville and Montgomery County, Maryland. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy, perimenopause management — 100% virtual, licensed in Maryland.",
  "url": "https://medmethoddirect.com/maryland/rockville",
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
    { "@type": "City", "name": "Rockville", "containedInPlace": { "@type": "State", "name": "Maryland" } },
    { "@type": "City", "name": "Gaithersburg", "containedInPlace": { "@type": "State", "name": "Maryland" } },
  ],
  "isAcceptingNewPatients": true,
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": { "@type": "Physician", "name": "Dr. Jumana Al-Deek", "honorificSuffix": "DO", "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Maryland", "item": "https://medmethoddirect.com/maryland" },
    { "@type": "ListItem", "position": 3, "name": "Rockville", "item": "https://medmethoddirect.com/maryland/rockville" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Rockville, MD?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Maryland, serving women in Rockville, Gaithersburg, North Potomac, and throughout Montgomery County. All care is 100% virtual — Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Rockville, Maryland?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Rockville and Montgomery County. Bloodwork is ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "Do I need to come in for bloodwork near Rockville?", a: "No office visit to MedMethod Direct is ever required. Rockville has excellent lab density — multiple LabCorp and Quest Diagnostics locations throughout the city. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "How is MedMethod Direct different from local practices in Rockville?", a: "Rockville has established in-person competitors — but even the best local practices offer 10–15 minute appointments and 4–8 week waits for new patients. MedMethod Direct offers 30–60 minute appointments, same-week availability, and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Rockville?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Rockville address." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." },
  { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door." },
  { q: "What does the $449 Clinical Diagnostic & Setup Fee include?", a: "The $449 fee covers your comprehensive initial bloodwork (hormone panel, metabolic panel, thyroid), your first physician consultation with Dr. Al-Deek, a smart scale for tracking body composition, and access to a personalized fitness and nutrition app. This one-time fee is separate from your monthly program fee." },
  { q: "How soon can I start as a patient in Rockville?", a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Rockville patients are on their program within 1–2 weeks of their first call." },

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
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555" }}>{a}</p>
      )}
    </div>
  );
}

const whyCards = [
  { icon: "🏙️", title: "Rockville's Largest Population Center", desc: "Rockville is the largest city in Montgomery County — and GLP-1 search growth here is among the strongest in Maryland. MedMethod Direct is positioned to serve this demand virtually, same week." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most Rockville patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Rockville — excellent lab density throughout the city." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Rockville address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I live in Rockville and I'd been on semaglutide for five months with almost no results. Dr. Al-Deek ran a full hormone panel and found my estrogen was critically low — which was blunting the medication entirely. Three months after adding hormone therapy, I've lost 20 pounds and feel completely different.", name: "Jennifer M.", location: "Rockville, MD — King Farm", rating: 5 },
  { quote: "The virtual model was perfect for my schedule. I work full-time and I simply don't have time for traditional doctor's office visits. Free consultation on a Wednesday, labs ordered that week at the Quest near my house, protocol started within 10 days. My hot flashes are gone and I've lost 16 pounds.", name: "Sarah K.", location: "Rockville, MD — Fallsgrove", rating: 5 },
  { quote: "I was skeptical of telehealth after bad experiences with other platforms. MedMethod Direct is completely different. Dr. Al-Deek spent 45 minutes with me on my first visit, reviewed every lab value, and explained exactly why my previous treatment wasn't working. I finally feel like I have a physician who's paying attention.", name: "Michelle R.", location: "Rockville, MD — Twinbrook", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationRockville() {
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
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Rockville, MD | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Rockville and Montgomery County, MD. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/maryland/rockville" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Rockville, MD | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Rockville and Montgomery County, MD. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/maryland/rockville" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
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
                  Serving Rockville, Maryland
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                  <br />
                  for Rockville women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Rockville and Montgomery County. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
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
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-patient-woman-v2_e1b75152.jpg"
                    alt="Virtual menopause and hormone therapy doctor for women in Rockville, Maryland — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Rockville · Gaithersburg · North Potomac · Germantown</p>
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING ROCKVILLE & MONTGOMERY COUNTY, MD</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Rockville Women — From Wherever You Are
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Rockville MD</strong> or a <strong>GLP-1 weight loss physician in Montgomery County</strong>, MedMethod Direct was built for you. Rockville is the largest city in Montgomery County — and GLP-1 search growth here is among the strongest in Maryland. Established in-person competitors exist, but none offer the integrated hormone and weight loss approach that MedMethod Direct provides.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all in one integrated virtual program. Labs ordered to <strong>LabCorp or Quest Diagnostics near Rockville</strong> — excellent lab density throughout the city. Medications shipped to your door.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Menopause Doctor Rockville MD", "GLP-1 Weight Loss Rockville", "Hormone Therapy Rockville", "BHRT Rockville Maryland", "Semaglutide Rockville MD", "Perimenopause Specialist Rockville", "Testosterone Therapy Women Rockville", "Virtual Hormone Doctor Montgomery County"].map((kw) => (
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
            <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY ROCKVILLE WOMEN CHOOSE US</p>
            <h2 className="font-black text-[#111111]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Built for Montgomery County</h2>
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

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>
              Questions & Answers
            </p>
            <h2 className="font-black leading-tight" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#111111" }}>
              Frequently Asked Questions for{" "}<span style={{background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Rockville Patients</span>
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D0D1A] text-white text-center">
        <div className="max-w-[700px] mx-auto px-4 lg:px-8">
          <p className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>ROCKVILLE, MARYLAND</p>
          <h2 className="font-black mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>Ready to Feel Like Yourself Again?</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>Your free 20-minute consultation is the first step. No obligation, no pressure — just a real conversation with a physician who understands what you're going through.</p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Rockville, Gaithersburg, North Potomac, Germantown, and all of Montgomery County</p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
