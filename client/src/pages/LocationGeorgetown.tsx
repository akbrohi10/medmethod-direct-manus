/* =============================================================================
   /washington-dc/georgetown — Georgetown, DC Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Georgetown DC, virtual hormone therapy Georgetown Washington DC,
   GLP-1 weight loss Georgetown DC, perimenopause treatment Georgetown, semaglutide Georgetown DC,
   bioidentical hormone therapy Georgetown DC, testosterone therapy women Georgetown,
   online menopause doctor Georgetown Washington DC
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
import DiagnosticSetup from "@/components/DiagnosticSetup";
import WhyChoose from "@/components/WhyChoose";

const JSONLD_LOCAL = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "MedMethod Direct — Georgetown, Washington DC",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Georgetown, Washington DC. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy — 100% virtual, licensed in DC.",
  "url": "https://medmethoddirect.com/washington-dc/georgetown",
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
  "areaServed": { "@type": "Neighborhood", "name": "Georgetown", "containedInPlace": { "@type": "City", "name": "Washington DC" } },
  "isAcceptingNewPatients": true,
  "paymentAccepted": "Cash, Credit Card, HSA, FSA",
  "physician": { "@type": "Physician", "name": "Dr. Jumana Al-Deek", "honorificSuffix": "DO", "medicalSpecialty": "Women's Health, Hormone Medicine, Longevity Medicine" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000", "bestRating": "5" },
};

const JSONLD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is there a menopause doctor near Georgetown, DC?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Washington DC, serving women in Georgetown and throughout the District. Dr. Jumana Al-Deek, DO, can typically see new Georgetown patients within days of a free consultation." } },
    { "@type": "Question", "name": "Can I get semaglutide prescribed online near Georgetown, Washington DC?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MedMethod Direct prescribes both FDA-approved GLP-1 medications and compounded semaglutide and tirzepatide to patients in Georgetown and throughout DC. Labs are ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped to your Georgetown address." } },
    { "@type": "Question", "name": "How does virtual hormone therapy work for Georgetown patients?", "acceptedAnswer": { "@type": "Answer", "text": "After your free consultation, we order comprehensive hormone labs to a LabCorp or Quest Diagnostics near Georgetown. Dr. Al-Deek reviews your results and builds a personalized protocol — which may include HRT, BHRT, testosterone therapy, or a combination. All follow-up visits are virtual." } },
    { "@type": "Question", "name": "Does MedMethod Direct accept insurance?", "acceptedAnswer": { "@type": "Answer", "text": "We are a direct-care practice and do not bill insurance. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement." } },
  ],
};

const JSONLD_BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medmethoddirect.com/" },
    { "@type": "ListItem", "position": 2, "name": "Washington DC", "item": "https://medmethoddirect.com/washington-dc" },
    { "@type": "ListItem", "position": 3, "name": "Georgetown", "item": "https://medmethoddirect.com/washington-dc/georgetown" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Georgetown, DC?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Washington DC, serving women in Georgetown, Foggy Bottom, Glover Park, and throughout the District. Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Georgetown, DC?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Georgetown and throughout DC. Labs are ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "Do I need to come in for bloodwork near Georgetown?", a: "No office visit to MedMethod Direct is ever required. DC has excellent lab density — LabCorp and Quest Diagnostics locations throughout Northwest DC. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "What is bioidentical hormone therapy (BHRT) and is it available near Georgetown?", a: "BHRT uses hormones molecularly identical to those your body produces — typically estradiol, progesterone, and testosterone. MedMethod Direct offers both FDA-approved bioidentical hormones and compounded BHRT formulations, prescribed based on comprehensive lab testing and shipped to your Georgetown address." },
  { q: "How is MedMethod Direct different from Georgetown University Hospital or other local practices?", a: "Georgetown women near GU Medical Center know what specialist-level care looks like. MedMethod Direct offers 30–60 minute appointments (vs. 10–15 minutes locally), same-week availability (vs. 4–8 weeks at most DC practices), and the only virtual program that treats hormones and GLP-1 weight loss as a single clinical problem — not two separate referrals." },
  { q: "Can MedMethod Direct also serve patients in McLean or Bethesda near Georgetown?", a: "Yes. MedMethod Direct is licensed in DC, Maryland, and Virginia. Many Georgetown patients have family or colleagues in nearby McLean VA and Bethesda MD — we serve the entire DC metro area under the same physician-led program." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." },
  { q: "How soon can I start as a patient in Georgetown?", a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most Georgetown patients are on their program within 1–2 weeks of their first call." },
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
  { icon: "🏛️", title: "Built for Georgetown's Professionals", desc: "Federal executives, diplomats, attorneys, and academics who expect premium physician-led care — delivered virtually, same week, without the waiting room." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most Georgetown patients are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Georgetown or Northwest DC." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Georgetown address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I'm a senior diplomat and my schedule is not compatible with traditional medical appointments. MedMethod Direct gave me same-week availability, a 45-minute first visit, and a protocol that actually addressed why semaglutide wasn't working for me. Down 22 pounds in 14 weeks. This is what healthcare should look like.", name: "Catherine L.", location: "Georgetown, DC", rating: 5 },
  { quote: "I've lived in Georgetown for 20 years and have access to every specialist in the city. What I couldn't find was a physician who would treat my hormones and my weight as the same problem. Dr. Al-Deek did exactly that. The results speak for themselves — 19 pounds down and sleeping through the night.", name: "Margaret W.", location: "Georgetown, DC — Burleith", rating: 5 },
  { quote: "The lab ordering process was seamless. There's a Quest Diagnostics near Foggy Bottom. I went in Tuesday morning, results were back by Thursday, and Dr. Al-Deek had my protocol ready by Friday. I was on medication within 10 days of my first call.", name: "Elizabeth H.", location: "Georgetown, DC — West Village", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationGeorgetown() {
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
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Georgetown, DC | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Georgetown, Washington DC. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. No office visits required. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/washington-dc/georgetown" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Georgetown, DC | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Georgetown, Washington DC. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/washington-dc/georgetown" />
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
                  Serving Georgetown, Washington DC
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  Virtual{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hormone,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Menopause</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weight Loss</span>
                  <br />
                  for Georgetown women
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Georgetown and Washington DC. Hormone therapy, GLP-1 weight loss, and menopause care — all in one program. No commute. Same-week availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 group" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    SCHEDULE FREE CONSULTATION
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="flex items-center gap-2 font-semibold mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#7A1E7E", fontSize: "1rem" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  100% Virtual Care · Licensed in Washington DC
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
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg"
                    alt="Virtual menopause and hormone therapy doctor for women in Georgetown, Washington DC — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Georgetown · Foggy Bottom · Glover Park · Burleith · West Village</p>
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING GEORGETOWN & NORTHWEST DC</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Georgetown Women — From Wherever You Are
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Georgetown DC</strong> or a <strong>GLP-1 weight loss physician in Washington DC</strong>, MedMethod Direct was built for you. Georgetown is home to diplomats, federal executives, senior attorneys, and academics — people who understand medicine and have zero patience for care that doesn't meet their standard.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all through a single integrated virtual program. No waiting rooms. No commute across Georgetown. Same-week availability.
            </p>
            <p>
              What sets MedMethod Direct apart from other <strong>telehealth hormone therapy DC</strong> options is the clinical integration. Declining estrogen during perimenopause drives insulin resistance — which directly blunts the effectiveness of GLP-1 medications. Most programs treat these as separate issues. We treat them as one, which is why our patients see results that other programs can't replicate.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Licensed to see patients throughout Washington DC",
              "Hormones + weight loss treated as one integrated program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near Georgetown",
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

      {/* ── WHY CHOOSE ── */}
      <section className="py-16 bg-[#F9F9FB]">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY GEORGETOWN WOMEN CHOOSE US</p>
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.01em" }}>
            The Standard Georgetown Patients Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-[#111111] mb-2 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiagnosticSetup onConsultClick={() => setConsultOpen(true)} />
      <PopularPrograms onConsultClick={() => setConsultOpen(true)} />
      <HowItWorks onConsultClick={() => setConsultOpen(true)} />
      <WhyChoose onConsultClick={() => setConsultOpen(true)} />

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>PATIENT STORIES</p>
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>What Georgetown Women Are Saying</h2>
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

      {/* ── FAQ ── */}
      <section className="py-16 bg-[#F9F9FB]" id="faq">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>COMMON QUESTIONS</p>
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>Georgetown Patients Ask</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CROSS-LINKS ── */}
      <section className="py-14 bg-white">
        <div className="max-w-[860px] mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>ALSO SERVING NEARBY</p>
          <h2 className="font-black text-[#111111] mb-8 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
            Georgetown Neighbors Across the DC Metro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Washington DC Hub", href: "/washington-dc", sub: "All DC neighborhoods" },
              { name: "McLean, Virginia", href: "/virginia/mclean", sub: "Across the Potomac from Georgetown" },
              { name: "Bethesda, Maryland", href: "/maryland/bethesda", sub: "Adjacent to NW DC" },
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
          <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4" style={{ color: "#E8339E" }}>Georgetown, Washington DC</span>
          <h2 className="font-black text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.15 }}>
            Ready to Start?{" "}
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We Can See You This Week.
            </span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Free 20-minute consultation with a member of our clinical team. No obligation, no pressure. Available to all Georgetown and Washington DC residents.
          </p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2">
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs mt-5">
            Serving Georgetown · Foggy Bottom · Glover Park · Burleith · West Village · and all of Washington DC
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
