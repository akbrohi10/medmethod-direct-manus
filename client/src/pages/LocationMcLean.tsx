/**
 * Location Page: McLean, Virginia
 * Design: Warm editorial, premium feel — matches site's rose/cream palette
 * SEO: Targets "menopause doctor McLean VA", "hormone therapy McLean", "GLP-1 weight loss McLean"
 * Hero image: Affluent home office, woman on telehealth call
 */

import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/location-hero-mclean-va-CndTNQk8baXWwkAHsS36yZ.webp";

const services = [
  {
    title: "Menopause & Perimenopause",
    icon: "🌿",
    description:
      "Hot flashes, night sweats, sleep disruption, mood changes, brain fog, and the weight gain that seems to appear overnight — these are not just 'part of aging.' They are treatable. We create personalized menopause management plans for women in McLean and throughout Virginia.",
  },
  {
    title: "Hormone Replacement Therapy (HRT)",
    icon: "⚗️",
    description:
      "Whether you're considering hormone therapy for the first time or looking for a more thoughtful approach than you've received elsewhere, we offer both FDA-approved brand-name HRT and bioidentical hormone options tailored to your labs, your symptoms, and your goals.",
  },
  {
    title: "Testosterone Therapy for Women",
    icon: "⚡",
    description:
      "Low testosterone is one of the most underdiagnosed conditions in women over 40. Fatigue, low libido, difficulty building muscle, and persistent brain fog are often testosterone-related. We test, diagnose, and treat.",
  },
  {
    title: "GLP-1 Weight Loss",
    icon: "🎯",
    description:
      "We offer access to both FDA-approved GLP-1 medications and compounded alternatives from an FDA-registered 503B outsourcing pharmacy. If you've been searching for semaglutide in McLean or wondering whether tirzepatide is right for you, we can walk you through both options.",
  },
  {
    title: "Metabolic & Longevity Care",
    icon: "🔬",
    description:
      "Beyond hormones and weight loss, we look at the full picture — insulin resistance, thyroid function, cortisol, gut health, and the biomarkers that predict how well you'll age. This is precision medicine, not a 12-minute appointment.",
  },
];

const virtualAdvantages = [
  {
    title: "More Time, Not Less",
    body: "The average in-person OB/GYN appointment lasts 12 minutes. Your MedMethod Direct consultation is unhurried, comprehensive, and focused entirely on you — your symptoms, your history, your goals.",
  },
  {
    title: "A Specialist, Not a Generalist",
    body: "Most local practices treat menopause as a side issue. Our entire program is built around hormonal health, metabolic optimization, and longevity for women in midlife. You are not a footnote in a busy practice — you are the whole point.",
  },
  {
    title: "Access This Week, Not in Six Weeks",
    body: "New patient appointments at OB/GYN practices in Northern Virginia average 3–6 weeks out. We can see you this week — from your home in McLean, your office in Tysons, or anywhere in Virginia.",
  },
  {
    title: "Continuity That Follows You",
    body: "If your local doctor leaves the practice or you move across town, you start over. Your MedMethod Direct care follows you anywhere in Virginia — and as we expand, anywhere we're licensed.",
  },
  {
    title: "Privacy for the Conversations That Matter",
    body: "Libido. Weight. Mood. Intimacy. Many women find it easier to be fully honest about these things with a physician they won't run into at the grocery store. Virtual care creates a space where nothing is too awkward to discuss.",
  },
  {
    title: "Your Time Is Worth More",
    body: "Drive time to McLean or Tysons + parking + waiting room + appointment = 2–3 hours of your day, every visit. A MedMethod Direct visit is 20–30 minutes, scheduled around your life.",
  },
];

const steps = [
  {
    number: "01",
    title: "Schedule Your Free Consultation",
    body: "Book a free 20-minute call with our wellness team. Tell us what you're experiencing. We'll explain your options, answer every question, and let you know if MedMethod Direct is the right fit — no pressure, no obligation.",
  },
  {
    number: "02",
    title: "Complete Your Lab Work Locally",
    body: "We order labs to a LabCorp or Quest Diagnostics location near you in McLean or the surrounding Northern Virginia area. You go in, get your blood drawn, and we review results together on your next visit.",
  },
  {
    number: "03",
    title: "Receive Your Personalized Protocol",
    body: "Dr. Al-Deek reviews your labs, your intake, and your goals to build a protocol specific to you. Medications are prescribed and shipped directly to your door from our licensed, FDA-registered 503B pharmacy partner.",
  },
];

const testimonials = [
  {
    quote:
      "I had been to three different doctors in Northern Virginia and none of them took my symptoms seriously. My first call with MedMethod Direct was the first time I felt genuinely heard. Within 60 days I had more energy than I'd had in years.",
    location: "Fairfax County, VA",
  },
  {
    quote:
      "I was skeptical about virtual care at first. But the convenience is unreal — no traffic on the Beltway, no waiting room, and I actually get to talk to my doctor for more than 10 minutes.",
    location: "McLean, VA",
  },
  {
    quote:
      "The GLP-1 program changed everything for me. I'd tried everything locally and nothing worked. This was different — they actually looked at my hormones alongside the weight loss piece.",
    location: "Northern Virginia",
  },
];

const faqs = [
  {
    q: "Is MedMethod Direct available to patients in McLean, Virginia?",
    a: "Yes. We are fully licensed to see patients throughout Virginia, including McLean, Great Falls, Tysons Corner, Vienna, Reston, Arlington, and the greater Northern Virginia area. All visits are conducted virtually — no commute required.",
  },
  {
    q: "Do I need to come into an office for bloodwork?",
    a: "No office visits are required. We order your labs to a LabCorp or Quest Diagnostics location near you in McLean or Northern Virginia. You go in for a standard blood draw, and we review the results together on your next virtual visit.",
  },
  {
    q: "Is virtual hormone therapy as effective as seeing a doctor in person?",
    a: "Yes. For hormone therapy, what matters is accurate lab work, a thorough intake, and consistent monitoring — all of which we do virtually. Many patients find they receive more attentive, personalized care through our program than they ever did in a traditional office setting.",
  },
  {
    q: "Can I get semaglutide or tirzepatide online in Virginia?",
    a: "Yes. We offer access to both FDA-approved GLP-1 medications and compounded alternatives from an FDA-registered 503B outsourcing pharmacy, prescribed by Dr. Al-Deek after a thorough review of your labs and health history. Medications are shipped directly to your McLean address.",
  },
  {
    q: "How is MedMethod Direct different from other telehealth services?",
    a: "MedMethod Direct is a physician-led program, not a subscription service. Dr. Al-Deek personally reviews your case, orders and interprets your labs, and builds a protocol specific to you. We integrate weight loss, hormone therapy, and longevity care into a single comprehensive program — rather than treating each issue in isolation.",
  },
  {
    q: "Do you accept insurance?",
    a: "We are a direct-care practice, which means we do not bill insurance. This allows us to spend more time with each patient, offer same-week availability, and provide care that isn't dictated by coverage limits. Many patients use HSA or FSA funds. We provide itemized receipts for potential out-of-network reimbursement.",
  },
  {
    q: "What is the cost of the program?",
    a: "Programs require a commitment of either six or twelve months. Pricing is discussed during your free consultation so we can match you to the right program for your goals and budget.",
  },
];

export default function LocationMcLean() {
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* SEO meta tags injected via document.title */}
      {typeof document !== "undefined" &&
        (() => {
          document.title =
            "Virtual Menopause Doctor in McLean, VA | MedMethod Direct";
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement("meta");
            (meta as HTMLMetaElement).name = "description";
            document.head.appendChild(meta);
          }
          (meta as HTMLMetaElement).content =
            "Expert virtual menopause, hormone therapy & GLP-1 weight loss for women in McLean, VA. See a physician this week — no waiting room, no commute. Free consultation.";
          return null;
        })()}

      <Navbar onConsultClick={() => setShowModal(true)} />

      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/75 via-stone-900/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Virginia</span>
            <span>/</span>
            <span className="text-white">McLean</span>
          </nav>
          <div className="max-w-2xl">
            <p className="text-rose-300 text-sm font-medium tracking-widest uppercase mb-4">
              Serving McLean, Virginia
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Virtual Menopause &amp; Hormone Care for Women in McLean, VA
            </h1>
            <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8">
              Physician-prescribed. Pharmacy-grade. Delivered to your door.<br />
              No waiting room. No rushed appointments. Just answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={() => setShowModal(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
              >
                Schedule Your Free Consultation →
              </button>
            </div>
            <p className="text-white/50 text-sm mt-4">
              100% Virtual · Licensed in Virginia · Same-Week Availability
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-4">
            Serving McLean, VA &amp; Northern Virginia
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
            Virtual Women's Health Care, Now Available in McLean
          </h2>
          <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed space-y-4">
            <p>
              If you live in McLean and you've been searching for a menopause doctor, a hormone specialist, or a physician who can help with GLP-1 weight loss — you've found the right place. MedMethod Direct is a virtual women's health clinic serving patients throughout Virginia, including McLean, Great Falls, Tysons Corner, Vienna, Reston, Arlington, and the surrounding Northern Virginia area.
            </p>
            <p>
              We specialize in the health concerns that matter most to women in midlife: perimenopause and menopause management, hormone replacement therapy (HRT), testosterone optimization, GLP-1 medications including compounded Semaglutide and Tirzepatide, and longevity-focused care. Everything is managed virtually by{" "}
              <strong>Dr. Jumana Al-Deek, DO</strong> — a physician who has dedicated her practice to helping women in their 40s, 50s, and beyond feel like themselves again.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">
              What We Treat
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              Services for Women in McLean, VA
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">{s.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIRTUAL VS LOCAL ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">
              Why Virtual Care Wins
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              Looking for a Menopause Doctor Near McLean?<br />
              <span className="text-rose-500">Here's Why Virtual Care Delivers More.</span>
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              We understand the instinct. When something feels wrong with your body, you want someone accessible — someone who will actually listen, not rush you out the door. That is exactly what MedMethod Direct delivers. The difference is, we deliver it without the waiting room, the 6-week wait, and the 12-minute appointment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualAdvantages.map((adv, i) => (
              <div
                key={i}
                className="border-l-4 border-rose-200 pl-6 py-2"
              >
                <h3 className="font-semibold text-stone-900 mb-2">{adv.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{adv.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-rose-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">
              Getting Started
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              How to Get Started From McLean
            </h2>
          </div>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <button
              onClick={() => setShowModal(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
            >
              Schedule My Free Consultation →
            </button>
            <p className="text-stone-400 text-sm mt-3">
              Takes less than 3 minutes to book. No obligation. No pressure.
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">
              Patient Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              What Women in Virginia Are Saying
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-stone-50 rounded-2xl p-8 border border-stone-100"
              >
                <div className="text-rose-400 text-4xl font-serif mb-4">"</div>
                <p className="text-stone-700 leading-relaxed italic mb-6">{t.quote}</p>
                <p className="text-stone-400 text-sm font-medium">— Patient, {t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              Frequently Asked Questions — McLean, VA
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-100 overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-stone-900">{faq.q}</span>
                  <span className="text-rose-400 flex-shrink-0 text-xl">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-stone-600 leading-relaxed border-t border-stone-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-24 bg-gradient-to-br from-rose-900 via-rose-800 to-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Feel Like Yourself Again?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Women in McLean deserve more than a rushed appointment and a prescription handed to them on the way out the door. You deserve a physician who knows your name, knows your labs, and is building a plan specifically for you — not for the average patient.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-rose-700 hover:bg-rose-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:-translate-y-0.5"
          >
            Schedule My Free Consultation →
          </button>
          <p className="text-white/40 text-sm mt-4">
            100% Free · No Obligation · No Pressure · Just Answers
          </p>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      <section className="py-16 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-xl font-semibold text-stone-900 mb-8">
            Related Articles for Women in Virginia
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/why-weight-gain-feels-different-in-menopause" className="group block p-6 rounded-xl border border-stone-100 hover:border-rose-200 hover:shadow-sm transition-all duration-200">
              <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-2">Menopause & Metabolism</p>
              <h4 className="font-semibold text-stone-900 group-hover:text-rose-600 transition-colors leading-snug">Why Does Weight Gain Feel Different in Menopause?</h4>
            </Link>
            <Link href="/blog/semaglutide-vs-tirzepatide-women-midlife" className="group block p-6 rounded-xl border border-stone-100 hover:border-rose-200 hover:shadow-sm transition-all duration-200">
              <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-2">GLP-1 Education</p>
              <h4 className="font-semibold text-stone-900 group-hover:text-rose-600 transition-colors leading-snug">Semaglutide vs. Tirzepatide: What Women in Midlife Should Know</h4>
            </Link>
            <Link href="/blog/hormone-therapy-weight-sleep-metabolism" className="group block p-6 rounded-xl border border-stone-100 hover:border-rose-200 hover:shadow-sm transition-all duration-200">
              <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-2">Hormone Therapy</p>
              <h4 className="font-semibold text-stone-900 group-hover:text-rose-600 transition-colors leading-snug">Can Hormone Therapy Help With Weight, Sleep, and Metabolism?</h4>
            </Link>
          </div>
        </div>
      </section>

      <Footer onConsultClick={() => setShowModal(true)} />
      <ConsultationModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
