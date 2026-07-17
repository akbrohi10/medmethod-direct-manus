import { useState } from "react";

// Standalone Brand Ambassador page — self-contained, does not modify any existing components
// Brand: Pink #E8339E, Deep Purple #7A1E7E, gradient pink→purple, Montserrat, premium clinical tone

export default function BrandAmbassador() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    socialHandle: "",
    platform: "",
    followerCount: "",
    whyJoin: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — would connect to GHL or backend
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "Is there a cost to join?",
      a: "No. The MedMethod Direct Ambassador Program is completely free to join.",
    },
    {
      q: "How do I know if I've been accepted?",
      a: "You'll receive an email notification. Make sure your email address is correct when you apply.",
    },
    {
      q: "How are commissions tracked?",
      a: "Your personal ambassador portal tracks all link clicks, promo code uses, and earnings in real time.",
    },
    {
      q: "When and how do I get paid?",
      a: "Commissions are paid monthly. Payment details are configured inside your ambassador portal after approval.",
    },
    {
      q: "Can I reapply if I'm not accepted?",
      a: "Yes. You're welcome to reapply at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-[Montserrat,sans-serif]">
      {/* Top gradient accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]" />

      {/* Standalone Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold text-[#111111]">Med</span>
            <span className="text-xl font-bold text-[#7A1E7E]">Method</span>
            <span className="text-[9px] font-semibold text-[#111111] uppercase tracking-[0.2em] ml-1 self-end mb-0.5">
              DIRECT
            </span>
          </div>
          <a
            href="https://medmethoddirect.com"
            className="text-sm text-[#888780] hover:text-[#7A1E7E] transition-colors"
          >
            ← Back to Main Site
          </a>
        </div>
      </header>

      {/* Section 1 — Hero */}
      <section className="bg-[#F9F9F9] py-20 sm:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7A1E7E] mb-4">
            THE MEDMETHOD DIRECT AMBASSADOR PROGRAM
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4 leading-tight">
            Be the Face of Longevity
          </h1>
          <p className="text-lg text-[#888780] font-normal max-w-2xl mx-auto mb-8">
            Join a community of health-forward voices helping people discover their path to living longer, better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowForm(true);
                document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Apply Now
            </button>
            <button className="px-8 py-3 border-2 border-[#7A1E7E] text-[#7A1E7E] font-semibold rounded-lg hover:bg-[#7A1E7E]/5 transition-colors text-sm">
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Section 2 — What You Get */}
      <section className="bg-white py-20 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] text-center mb-12">
            Why Join the MMD Ambassador Program?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="border border-gray-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#7A1E7E] flex items-center justify-center mb-4 mt-2">
                <svg className="w-5 h-5 text-[#7A1E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Exclusive Webinar Access with Dr. Aldeek</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                As an MMD Ambassador, you'll get exclusive access to live webinar consultations hosted by Dr. Aldeek — covering longevity, hormone health, and the science behind what we do.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#7A1E7E] flex items-center justify-center mb-4 mt-2">
                <svg className="w-5 h-5 text-[#7A1E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Commission on Every Referral</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                Earn a commission every time someone purchases using your unique link or promo code.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#7A1E7E] flex items-center justify-center mb-4 mt-2">
                <svg className="w-5 h-5 text-[#7A1E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Join a Premium Health Community</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                Connect with like-minded advocates in the longevity, hormone health, and wellness space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — How It Works */}
      <section className="bg-[#F9F9F9] py-20 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] text-center mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-0.5 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E]" />

            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 relative z-10">
                1
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Apply</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                Fill out the short application form. We review submissions within 5 to 7 business days.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 relative z-10">
                2
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Get Approved</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                Once approved, you'll receive your ambassador portal, unique promo code, and affiliate link.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 relative z-10">
                3
              </div>
              <h3 className="font-bold text-[#111111] mb-2">Share &amp; Earn</h3>
              <p className="text-sm text-[#888780] leading-relaxed">
                Post your authentic experience, refer your audience, and earn commissions paid monthly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Ambassador Guidelines */}
      <section className="bg-white py-20 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] text-center mb-12">
            Ambassador Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[#888780] leading-relaxed">
                We partner with voices who reflect our values — premium, credible, and science-minded. Here's what we look for in an MMD Ambassador:
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Public social media profile with an engaged, health-focused audience",
                "Minimum 3,000 followers (Instagram, TikTok, Facebook, or YouTube)",
                "Content that is high quality, clear, and authentically yours",
                "Aligned values: longevity, wellness, hormone health, or medically supervised weight loss",
                "No profanity, explicit content, or messaging that conflicts with clinical positioning",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#7A1E7E] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-[#111111] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — FAQ Accordion */}
      <section className="bg-[#F9F9F9] py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] text-center mb-12">
            Got Questions?
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-sm text-[#111111]">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#7A1E7E] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-[#888780] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Closing CTA Banner */}
      <section className="bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Join the Movement?
          </h2>
          <p className="text-white/80 mb-8">
            Your audience is looking for something real. Give them a path to longevity.
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-white text-[#7A1E7E] font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
          >
            Apply to Become an Ambassador
          </button>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-section" className="bg-white py-20 sm:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-4">
                Ready to Apply?
              </h2>
              <p className="text-[#888780] mb-8">
                Click below to open the application form.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Open Application
              </button>
            </div>
          ) : submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#111111] mb-3">Application Submitted!</h2>
              <p className="text-[#888780]">
                Thank you for applying. We'll review your submission and get back to you within 5–7 business days via email.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] text-center mb-2">
                Ambassador Application
              </h2>
              <p className="text-[#888780] text-center mb-8">
                Tell us a bit about yourself and your platform.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Social Media Handle (primary)</label>
                  <input
                    type="text"
                    required
                    value={formData.socialHandle}
                    onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors"
                    placeholder="@yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Platform</label>
                  <select
                    required
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors bg-white"
                  >
                    <option value="">Select your primary platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Approximate Follower Count</label>
                  <input
                    type="text"
                    required
                    value={formData.followerCount}
                    onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors"
                    placeholder="e.g. 5,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">
                    Why do you want to be an MMD Ambassador?{" "}
                    <span className="font-normal text-[#888780]">(max 300 characters)</span>
                  </label>
                  <textarea
                    required
                    maxLength={300}
                    rows={4}
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1E7E] transition-colors resize-none"
                    placeholder="Tell us why you'd be a great fit..."
                  />
                  <p className="text-xs text-[#888780] mt-1 text-right">
                    {formData.whyJoin.length}/300
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Standalone Footer */}
      <footer className="bg-[#111111] py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-baseline gap-0.5 justify-center mb-3">
            <span className="text-lg font-bold text-white">Med</span>
            <span className="text-lg font-bold text-[#E8339E]">Method</span>
            <span className="text-[8px] font-semibold text-white uppercase tracking-[0.2em] ml-1 self-end mb-0.5">
              DIRECT
            </span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MedMethod Direct. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
