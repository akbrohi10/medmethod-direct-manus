/* =============================================================================
   Consultation CTA — Clinical Noir Design
   Full-width gradient background with form
   ============================================================================= */
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ConsultationCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitted(true);
    toast.success("We'll be in touch within 24 hours!");
  };

  return (
    <section
      id="consultation"
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <span
              className="block text-white/70 text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No Cost. No Commitment.
            </span>
            <h2
              className="font-black text-white leading-tight mb-6"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              START YOUR PATH
              <br />
              TO LONGEVITY
              <br />
              TODAY
            </h2>
            <p
              className="text-white/80 leading-relaxed mb-8"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
            >
              Book your free virtual consultation and take the first step toward optimized health. Our licensed providers will review your goals, answer your questions, and outline a personalized plan — at no cost to you.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3">
              {[
                "Free 30-minute virtual consultation",
                "No referral required",
                "Results-focused, personalized protocols",
                "Medications delivered to your door",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-none" />
                  <span
                    className="text-white/90 font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="font-black text-[#111111] text-xl mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  You're All Set!
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                >
                  A MedMethod Direct care coordinator will reach out within 24 hours to schedule your free consultation.
                </p>
              </div>
            ) : (
              <>
                <h3
                  className="font-black text-[#111111] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.3rem" }}
                >
                  Book Your Free Consultation
                </h3>
                <p
                  className="text-gray-500 text-sm mb-6"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Takes less than 2 minutes. No credit card required.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8339E] outline-none transition-colors text-[#111111]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8339E] outline-none transition-colors text-[#111111]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8339E] outline-none transition-colors text-[#111111]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Primary Health Goal
                    </label>
                    <select
                      value={form.goal}
                      onChange={(e) => setForm({ ...form, goal: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8339E] outline-none transition-colors text-[#111111] bg-white"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                    >
                      <option value="">Select your goal...</option>
                      <option value="hormones">Hormone Optimization</option>
                      <option value="weight">Medical Weight Loss</option>
                      <option value="longevity">Anti-Aging & Longevity</option>
                      <option value="peptides">Peptide Therapy</option>
                      <option value="sexual">Sexual Wellness</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-gradient w-full py-4 rounded-xl text-sm font-bold tracking-wider flex items-center justify-center gap-2 mt-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    BOOK MY FREE CONSULTATION
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p
                    className="text-center text-gray-400 text-xs"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    By submitting, you agree to our Privacy Policy. We never share your information.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
