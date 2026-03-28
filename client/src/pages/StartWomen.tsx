/* =============================================================================
   /start/women — Ad Landing Page
   Design: Conversion-optimised, no navbar, no footer, single CTA
   Philosophy: Remove all exit paths. Lead with empathy, close with trust.
   ============================================================================= */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Star, Shield, Clock, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/start-women-hero-3J5AcqPitLvutL4uiaW78u.webp";

const symptoms = [
  "Weight that won't move no matter what you try",
  "Hot flashes, night sweats, or broken sleep",
  "Brain fog and exhaustion that feel permanent",
  "Mood swings or anxiety that came out of nowhere",
  "Low libido or intimacy changes",
  "Feeling dismissed by your doctor",
];

const trustPoints = [
  { icon: Shield, label: "Board-Certified Physician", sub: "Not a nurse practitioner or PA" },
  { icon: Clock, label: "60-Minute Appointments", sub: "Not a 7-minute rushed visit" },
  { icon: CheckCircle, label: "Lab-to-Door Delivery", sub: "Medications shipped to your home" },
  { icon: Star, label: "4.9★ Patient Rating", sub: "Across 10,000+ women served" },
];

const testimonials = [
  {
    quote: "I lost 22 lbs in 4 months and my hot flashes are completely gone. I finally feel like myself again.",
    name: "Sarah M.",
    location: "McLean, VA",
    result: "22 lbs lost · Menopause symptoms resolved",
  },
  {
    quote: "After years of being told my labs were 'normal,' Dr. Al-Deek found the real problem in our first visit.",
    name: "Jennifer K.",
    location: "Reston, VA",
    result: "Hormone imbalance identified & treated",
  },
  {
    quote: "The combination of GLP-1 and hormone therapy is what finally worked. No other doctor offered both.",
    name: "Michelle R.",
    location: "Tysons, VA",
    result: "18 lbs lost · Energy fully restored",
  },
];

const faqs = [
  {
    q: "Do you accept insurance?",
    a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
  },
  {
    q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
    a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation.",
  },
  {
    q: "What states do you serve?",
    a: "We are currently licensed in Virginia, Florida, Maryland, Washington DC, Colorado, Arizona, North Carolina, and Pennsylvania. All care is delivered virtually — no office visits required.",
  },
  {
    q: "How quickly can I get started?",
    a: "Most patients complete their initial consultation within 3–5 business days of scheduling. Your lab kit ships the same week, and your first prescription is typically issued within 7–10 days of your consultation.",
  },
  {
    q: "What's included in the $449 setup fee?",
    a: "The $449 Clinical Diagnostic & Setup Fee includes a comprehensive at-home lab panel (hormones, metabolic markers, thyroid, inflammation), your first physician consultation (60 minutes), a Withings Body+ smart scale, and 3 months of the Withings Health Mate app. This is a one-time fee — your ongoing monthly membership covers everything after that.",
  },
];

export default function StartWomen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCTA = () => {
    window.open("https://calendly.com/medmethoddirect", "_blank");
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Finally, a Doctor Who Treats the Whole Picture | MedMethod Direct</title>
        <meta name="description" content="Virtual hormone therapy, menopause care, and GLP-1 medical weight loss — all in one program. Led by a board-certified physician. Schedule your free consultation today." />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Minimal Header — Logo + CTA only, no nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-black text-[#111111] text-lg tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Med<span style={{ color: "#E8339E" }}>Method</span>
              <span className="font-light text-gray-400 text-sm ml-1">DIRECT</span>
            </span>
          </a>
          <button
            onClick={handleCTA}
            className="px-5 py-2.5 rounded-full text-white text-sm font-bold tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.05em" }}
          >
            SCHEDULE FREE CONSULT
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16">
        <div className="grid lg:grid-cols-2 min-h-[90vh]">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-24 bg-[#0D0D1A]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-[#E8339E]" />
              <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase">
                Virtual Care · 8 States
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white font-black leading-[0.95] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.03em" }}
            >
              YOU'VE BEEN
              <br />
              <span style={{ color: "#E8339E" }}>PUTTING</span>
              <br />
              YOURSELF LAST.
              <br />
              <span className="text-white/60 text-[0.7em]">That ends today.</span>
            </h1>

            {/* Sub */}
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
              The first virtual clinic that treats <strong className="text-white">hormones and weight loss as one problem</strong> — because they are. Led by a board-certified physician who actually listens.
            </p>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-black text-sm tracking-wider w-fit transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.08em" }}
            >
              SCHEDULE FREE CONSULTATION
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-white/40 text-xs">No commitment · 15-minute call · Results in 7–10 days</p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
              {[
                { n: "10K+", l: "Women Served" },
                { n: "4.9★", l: "Patient Rating" },
                { n: "15%+", l: "Avg. Weight Loss" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-white font-black text-xl" style={{ letterSpacing: "-0.02em" }}>{s.n}</div>
                  <div className="text-white/40 text-xs font-medium tracking-wider uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative overflow-hidden min-h-[50vh] lg:min-h-full">
            <img
              src={HERO_IMAGE}
              alt="Confident woman on telehealth consultation with MedMethod Direct physician"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Symptom Recognition — "Does this sound familiar?" */}
      <section className="bg-[#F8F8F8] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-4">You Are Not Alone</span>
          <h2 className="font-black text-[#111111] text-3xl lg:text-4xl mb-4" style={{ letterSpacing: "-0.02em" }}>
            Does this sound familiar?
          </h2>
          <p className="text-gray-500 mb-10">Most women we work with have been struggling with one or more of these for years — and been told it's "just aging."</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {symptoms.map((s) => (
              <div key={s} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#E8339E" }} />
                <span className="text-[#111111] text-sm font-semibold">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <button
              onClick={handleCTA}
              className="px-8 py-4 rounded-full text-white font-black text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.08em" }}
            >
              YES — SCHEDULE MY FREE CONSULT
            </button>
            <p className="text-gray-400 text-xs mt-3">Takes 2 minutes · No credit card required</p>
          </div>
        </div>
      </section>

      {/* Why MedMethod is Different */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-4">The MedMethod Difference</span>
            <h2 className="font-black text-[#111111] text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              Not another telehealth mill.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">We built MedMethod Direct because the existing system wasn't working for women. Here's what's different.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trustPoints.map((t) => (
              <div key={t.label} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-pink-100 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #E8339E22 0%, #7A1E7E22 100%)" }}>
                  <t.icon className="w-5 h-5" style={{ color: "#E8339E" }} />
                </div>
                <div>
                  <div className="font-black text-[#111111] text-sm" style={{ letterSpacing: "-0.01em" }}>{t.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0D0D1A] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-4">Real Women · Real Results</span>
            <h2 className="font-black text-white text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              What our patients say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#E8339E" }} />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.location}</div>
                  <div className="mt-2 text-xs font-bold tracking-wider" style={{ color: "#E8339E" }}>{t.result}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={handleCTA}
              className="px-8 py-4 rounded-full text-white font-black text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.08em" }}
            >
              START MY JOURNEY →
            </button>
            <p className="text-white/30 text-xs mt-3">Free 15-minute consultation · No commitment</p>
          </div>
        </div>
      </section>

      {/* How It Works — 3 steps */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-4">Simple Process</span>
            <h2 className="font-black text-[#111111] text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              From today to results in 3 steps
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { n: "01", title: "Schedule Your Free Consultation", body: "A 15-minute call to understand your goals and confirm we're a fit. No pressure, no commitment." },
              { n: "02", title: "Complete Your At-Home Lab Panel", body: "Your comprehensive hormone and metabolic lab kit ships to your door. Results reviewed by Dr. Al-Deek before your first full appointment." },
              { n: "03", title: "Start Your Personalised Program", body: "Your 60-minute physician consultation, your custom protocol, and your first prescription — all within 7–10 days of signing up." },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 items-start p-6 rounded-2xl border border-gray-100 hover:border-pink-100 hover:shadow-md transition-all duration-200">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
                >
                  {step.n}
                </div>
                <div>
                  <div className="font-black text-[#111111] text-base mb-1" style={{ letterSpacing: "-0.01em" }}>{step.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{step.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={handleCTA}
              className="px-8 py-4 rounded-full text-white font-black text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.08em" }}
            >
              SCHEDULE FREE CONSULTATION
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F8F8F8] py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-4">Common Questions</span>
            <h2 className="font-black text-[#111111] text-2xl lg:text-3xl" style={{ letterSpacing: "-0.02em" }}>
              Before you schedule
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-black text-[#111111] text-sm pr-4" style={{ letterSpacing: "-0.01em" }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0D0D1A] py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[#E8339E] text-xs font-bold tracking-[0.2em] uppercase block mb-6">Your Next Step</span>
          <h2
            className="font-black text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            THE SYSTEM YOU'VE BEEN
            <br />
            <span style={{ color: "#E8339E" }}>MISSING</span> IS HERE.
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Built by a physician who got tired of watching women be dismissed. Schedule your free 15-minute consultation today — no commitment, no pressure.
          </p>
          <button
            onClick={handleCTA}
            className="px-10 py-5 rounded-full text-white font-black text-base tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)", letterSpacing: "0.08em" }}
          >
            SCHEDULE FREE CONSULTATION →
          </button>
          <p className="text-white/30 text-xs">
            Licensed in VA · FL · MD · DC · CO · AZ · NC · PA
          </p>
        </div>
      </section>

      {/* Minimal Footer — compliance only */}
      <footer className="bg-[#080810] py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-white/20 text-xs">© 2025 MedMethod Direct. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/privacy" className="text-white/20 text-xs hover:text-white/40 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-white/20 text-xs hover:text-white/40 transition-colors">Terms of Service</a>
            <a href="/" className="text-white/20 text-xs hover:text-white/40 transition-colors">Main Site</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
