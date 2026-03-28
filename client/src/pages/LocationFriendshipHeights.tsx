/* =============================================================================
   /washington-dc/friendship-heights — Friendship Heights / Tenleytown, DC Location Page
   Design: Clinical Noir — white hero with pink gradient accents
   Target keywords: menopause doctor Friendship Heights DC, virtual hormone therapy Tenleytown Washington DC,
   GLP-1 weight loss Friendship Heights DC, perimenopause treatment Tenleytown DC, semaglutide Friendship Heights DC,
   bioidentical hormone therapy Friendship Heights DC, testosterone therapy women Tenleytown DC,
   online menopause doctor Friendship Heights Washington DC
   ============================================================================= */
import { useState } from "react";
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
  "name": "MedMethod Direct — Friendship Heights & Tenleytown, Washington DC",
  "description": "Virtual hormone therapy, medical weight loss, and menopause clinic serving women in Friendship Heights and Tenleytown, Washington DC. Physician-prescribed GLP-1 weight loss, HRT, BHRT, testosterone therapy — 100% virtual, licensed in DC.",
  "url": "https://medmethoddirect.com/washington-dc/friendship-heights",
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
    { "@type": "Neighborhood", "name": "Friendship Heights", "containedInPlace": { "@type": "City", "name": "Washington DC" } },
    { "@type": "Neighborhood", "name": "Tenleytown", "containedInPlace": { "@type": "City", "name": "Washington DC" } },
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
    { "@type": "ListItem", "position": 2, "name": "Washington DC", "item": "https://medmethoddirect.com/washington-dc" },
    { "@type": "ListItem", "position": 3, "name": "Friendship Heights", "item": "https://medmethoddirect.com/washington-dc/friendship-heights" },
  ],
};

const faqs = [
  { q: "Is there a menopause doctor near Friendship Heights or Tenleytown, DC?", a: "Yes. MedMethod Direct is a virtual menopause and hormone clinic licensed in Washington DC, serving women in Friendship Heights, Tenleytown, American University Park, Spring Valley, and throughout Upper Northwest DC. Dr. Jumana Al-Deek, DO, can typically see new patients within days of your free consultation." },
  { q: "Can I get semaglutide or tirzepatide prescribed online near Friendship Heights, DC?", a: "Yes. Dr. Al-Deek prescribes both FDA-approved GLP-1 medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) and compounded semaglutide and tirzepatide to patients in Friendship Heights and throughout DC. Labs are ordered to a LabCorp or Quest Diagnostics near you. Medications are shipped directly to your door." },
  { q: "Do I need to come in for bloodwork near Friendship Heights or Tenleytown?", a: "No office visit to MedMethod Direct is ever required. There are LabCorp and Quest Diagnostics locations throughout Upper Northwest DC and just across the line in Chevy Chase Maryland. We order your labs, you go in for the draw, and results come directly to Dr. Al-Deek." },
  { q: "What is the difference between HRT and BHRT?", a: "HRT (hormone replacement therapy) typically refers to FDA-approved synthetic or bioidentical hormones in standardized doses. BHRT (bioidentical hormone replacement therapy) uses hormones molecularly identical to those your body produces, often in compounded formulations customized to your lab results. MedMethod Direct offers both, and Dr. Al-Deek will recommend the right approach based on your comprehensive bloodwork." },
  { q: "How is MedMethod Direct different from local practices near Friendship Heights?", a: "Friendship Heights and Tenleytown are home to some of DC's most health-conscious residents. Even so, most local practices offer 10–15 minute appointments and 4–8 week waits. MedMethod Direct offers 30–60 minute appointments, same-week availability, and a program that treats hormones and GLP-1 weight loss as a single clinical problem." },
  { q: "Can MedMethod Direct also serve patients in nearby Chevy Chase Maryland?", a: "Yes. MedMethod Direct is licensed in DC, Maryland, and Virginia. Many Friendship Heights and Tenleytown patients have family or colleagues in nearby Chevy Chase MD or Bethesda — we serve the entire DC metro area under the same physician-led program." },
  ...pricingFaqs,
  { q: "Does MedMethod Direct accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement." },
  { q: "How soon can I start as a patient in Friendship Heights or Tenleytown?", a: "Most patients complete their free consultation within 24–48 hours of requesting it. Labs are typically ordered the same day. Once results are in (usually 3–5 business days), Dr. Al-Deek reviews them and your personalized protocol is ready. Most patients in this area are on their program within 1–2 weeks of their first call." },
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
  { icon: "🏘️", title: "Upper Northwest's Most Trusted Virtual Clinic", desc: "Friendship Heights and Tenleytown women expect evidence-based care from physicians who take time. MedMethod Direct delivers exactly that — virtually, on your schedule." },
  { icon: "🔬", title: "Hormones + Weight Loss: One Program", desc: "We're one of the only virtual practices treating hormones and GLP-1 weight loss as a unified clinical problem — not two separate referrals." },
  { icon: "📅", title: "Same-Week Availability", desc: "No long waits. Most patients in this area are seen within days of their free consultation and on their protocol within two weeks." },
  { icon: "🧬", title: "Lab-Driven, Not Symptom-Driven", desc: "Every protocol starts with comprehensive bloodwork ordered to a LabCorp or Quest Diagnostics near Friendship Heights or Upper Northwest DC." },
  { icon: "💊", title: "Semaglutide, Tirzepatide & BHRT Delivered", desc: "Medications shipped directly to your Friendship Heights or Tenleytown address. No pharmacy runs, no prior authorization battles." },
  { icon: "👩‍⚕️", title: "One Physician. Your Whole Journey.", desc: "Dr. Al-Deek is your physician for the full 6 or 12-month program — not a rotating roster of telehealth providers." },
];

const testimonials = [
  { quote: "I live in Tenleytown and I've been seeing doctors in this neighborhood for 15 years. MedMethod Direct is the first practice that actually connected the dots between my hormones and my weight. I'm down 17 pounds in 9 weeks and my energy is completely different.", name: "Patricia N.", location: "Tenleytown, DC", rating: 5 },
  { quote: "The convenience is unmatched. I scheduled my consultation between meetings, had labs done at the Quest on Wisconsin Ave, and was on my protocol within 10 days. Dr. Al-Deek is thorough, responsive, and genuinely invested in your outcomes.", name: "Linda M.", location: "Friendship Heights, DC", rating: 5 },
  { quote: "I was in perimenopause and gaining weight despite eating well and exercising. MedMethod Direct explained the estrogen-insulin resistance connection that was blocking my results. Six months later I'm down 24 pounds and feel like myself again.", name: "Karen S.", location: "American University Park, DC", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Women Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Patient Rating" },
  { value: "15%+", label: "Avg. Weight Loss" },
];

export default function LocationFriendshipHeights() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Virtual Hormone, Menopause & Weight Loss Doctor in Friendship Heights & Tenleytown DC | MedMethod Direct</title>
        <meta name="description" content="Virtual menopause doctor and GLP-1 weight loss physician serving Friendship Heights and Tenleytown, Washington DC. Same-week appointments. Semaglutide, tirzepatide, HRT, BHRT, testosterone therapy. Dr. Jumana Al-Deek, DO." />
        <link rel="canonical" href="https://medmethoddirect.com/washington-dc/friendship-heights" />
        <meta property="og:title" content="Virtual Hormone, Menopause & Weight Loss Doctor in Friendship Heights & Tenleytown DC | MedMethod Direct" />
        <meta property="og:description" content="Physician-led virtual clinic for women in Friendship Heights and Tenleytown, Washington DC. Hormone therapy, GLP-1 weight loss, menopause care — all virtual, same-week availability." />
        <meta property="og:url" content="https://medmethoddirect.com/washington-dc/friendship-heights" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(JSONLD_LOCAL)}</script>
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
                  Serving Friendship Heights &amp; Tenleytown, Washington DC
                </div>
                <h1 className="font-black leading-[1.05] mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.9rem, 3.4vw, 3.3rem)", letterSpacing: "-0.02em", color: "#111111" }}>
                  VIRTUAL{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HORMONE,</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MENOPAUSE</span>{" "}&amp;{" "}
                  <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>WEIGHT LOSS</span>
                  <br />
                  FOR FRIENDSHIP HEIGHTS WOMEN
                </h1>
                <p className="text-base mb-6 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", color: "#555", maxWidth: "480px" }}>
                  Physician-led virtual care for women in Friendship Heights, Tenleytown, and Upper Northwest DC. Hormone therapy, GLP-1 weight loss, and menopause care — all in one integrated program. No commute. Same-week availability.
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
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-patient-woman-v2-Wt6Ht4Xz8jFdKTYqmvNpSe.webp"
                    alt="Virtual menopause and hormone therapy doctor for women in Friendship Heights and Tenleytown, Washington DC — MedMethod Direct"
                    className="w-full h-full object-cover"
                    width="640"
                    height="480"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                    <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>Serving Friendship Heights · Tenleytown · American University Park · Spring Valley · Upper Northwest DC</p>
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>SERVING FRIENDSHIP HEIGHTS, TENLEYTOWN & UPPER NORTHWEST DC</p>
          <h2 className="font-black text-[#111111] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
            A Menopause &amp; Weight Loss Physician for Upper Northwest DC Women
          </h2>
          <div className="text-gray-600 text-base leading-relaxed space-y-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <p>
              If you've been searching for a <strong>menopause doctor near Friendship Heights DC</strong> or a <strong>GLP-1 weight loss physician in Tenleytown Washington DC</strong>, MedMethod Direct was built for you. This corridor of Upper Northwest DC — from Friendship Heights through Tenleytown to American University Park — is home to professionals, academics, and families who take their health seriously and expect care that matches.
            </p>
            <p>
              Led by <strong>Dr. Jumana Al-Deek, DO</strong>, MedMethod Direct offers <strong>perimenopause and menopause management</strong>, <strong>bioidentical hormone therapy (BHRT)</strong>, <strong>testosterone therapy for women</strong>, and <strong>physician-prescribed semaglutide and tirzepatide</strong> — all through a single integrated virtual program. No waiting rooms. No commute. Same-week availability.
            </p>
            <p>
              The Friendship Heights Metro station puts you at the center of one of DC's most convenient Upper Northwest corridors — but you still shouldn't have to commute to a doctor's office for a 10-minute appointment. MedMethod Direct brings the physician to you, virtually, with 30–60 minute appointments and a program that treats your hormones and your weight as one integrated clinical problem.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Licensed to see patients throughout Washington DC",
              "Hormones + weight loss treated as one integrated program",
              "Physician-prescribed semaglutide & tirzepatide",
              "BHRT, HRT & testosterone therapy for women",
              "Labs ordered to LabCorp or Quest near Friendship Heights",
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8339E] mb-3 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>WHY FRIENDSHIP HEIGHTS WOMEN CHOOSE US</p>
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
            Evidence-Based Care for Upper Northwest DC Women
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
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>What Friendship Heights &amp; Tenleytown Women Are Saying</h2>
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
          <h2 className="font-black text-[#111111] mb-10 text-center" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>Friendship Heights &amp; Tenleytown Patients Ask</h2>
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
            Upper Northwest DC Neighbors Across the Metro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Washington DC Hub", href: "/washington-dc", sub: "All DC neighborhoods" },
              { name: "Chevy Chase DC", href: "/washington-dc/chevy-chase-dc", sub: "Upper Northwest DC" },
              { name: "Chevy Chase, Maryland", href: "/maryland/chevy-chase", sub: "Just across the DC-MD line" },
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
          <span className="block text-xs font-extrabold tracking-[0.22em] uppercase mb-4" style={{ color: "#E8339E" }}>Friendship Heights &amp; Tenleytown, Washington DC</span>
          <h2 className="font-black text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.15 }}>
            Ready to Start?{" "}
            <span style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We Can See You This Week.
            </span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Free 20-minute consultation with a member of our clinical team. No obligation, no pressure. Available to all Friendship Heights, Tenleytown, and Washington DC residents.
          </p>
          <button onClick={() => setConsultOpen(true)} className="btn-gradient btn-gradient-pulse px-10 py-4 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2">
            SCHEDULE FREE CONSULTATION <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs mt-5">
            Serving Friendship Heights · Tenleytown · American University Park · Spring Valley · Upper Northwest DC
          </p>
        </div>
      </section>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <StickyMobileCTA onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
