/* =============================================================================
   Thank You / Booking Confirmation Page
   - Fires GTM dataLayer event for conversion tracking
   - Dotted timeline layout for next steps (no boxes)
   - Step 4: Create patient account
   ============================================================================= */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Mail, MessageSquare, Clock, HelpCircle, ArrowRight, BookOpen, Download, UserPlus } from "lucide-react";

const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";

const STEPS = [
  {
    icon: UserPlus,
    label: "Step 1",
    title: "Create Your Patient Account",
    description:
      "Set up your secure patient portal to complete intake forms, sign waivers, upload labs, and communicate with Dr. Al-Deek and our care team before your appointment.",
    color: BRAND_PINK,
    link: { href: "https://medmethoddirect.md-hq.com/registration", text: "Create Account", external: true },
  },
  {
    icon: Mail,
    label: "Step 2",
    title: "Accept Your Calendar Invite",
    description:
      "Check your email for a calendar invitation and accept it now. This confirms your time slot with our care team.",
    color: BRAND_PLUM,
    link: null,
  },
  {
    icon: MessageSquare,
    label: "Step 3",
    title: "Reply to Our Text to Secure Your Spot",
    description:
      "You'll receive a confirmation text shortly. We keep our schedule open and available so serious patients can get in quickly — reply to confirm and lock in your time. Unconfirmed appointments are released within 24 hours.",
    color: BRAND_PINK,
    link: null,
  },
];

export default function ThankYou() {
  // Fire GTM conversion event on page load
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "booking_complete" });
    }
    // Meta Pixel — fire PageView + Purchase on thank-you page load
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "PageView");
      (window as any).fbq("track", "Purchase", { value: 50.00, currency: "USD" });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>You're Confirmed | MedMethod Direct</title>
        <meta name="description" content="Your Discovery Call is scheduled. Accept your calendar invite and reply to our text to confirm your spot." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-start px-4 pt-0 pb-12 md:pb-20">
        {/* Minimal Logo Header */}
        <div className="w-full max-w-2xl py-5 mb-6 flex items-center justify-between">
          <a href="/" className="inline-flex flex-col items-center leading-none" style={{ width: "fit-content" }}>
            <div className="flex items-baseline gap-0">
              <span
                className="font-black text-[#1a1a2e]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.3rem", letterSpacing: "-0.02em" }}
              >
                Med
              </span>
              <span
                className="font-black"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.3rem",
                  letterSpacing: "-0.02em",
                  backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Method
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 w-full">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }} />
              <span
                className="text-[#1a1a2e] font-semibold tracking-[0.25em]"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.5rem" }}
              >
                DIRECT
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #7A1E7E, #E8339E)" }} />
            </div>
          </a>
          {/* Phone number — right side of header */}
          <a
            href="tel:+18883627011"
            className="inline-flex items-center gap-2 text-[#7A1E7E] hover:text-[#E8339E] transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">(888) 362-7011</span>
              <span className="text-[10px] font-medium text-[#4a4a5a] hidden sm:block">Need help?</span>
            </div>
          </a>
        </div>

        {/* Confirmation Icon + Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E8339E]/10 to-[#7A1E7E]/10 mb-6">
            <CheckCircle className="w-10 h-10 text-[#E8339E]" strokeWidth={1.8} />
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Payment Confirmed!
          </h1>
          <p
            className="text-[#4a4a5a] text-base md:text-lg max-w-md mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Your $50 deposit is confirmed. Now pick a time below to meet with Dr. Al-Deek.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#E8339E]/5 border border-[#E8339E]/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span
              className="text-sm font-medium text-[#1a1a2e]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              100% Virtual — No Office Visit Needed
            </span>
          </div>
        </div>

        {/* ── GHL Calendar Embed ── */}
        <div className="w-full max-w-2xl mb-10">
          <div className="bg-white rounded-2xl border border-[#e8e6e3] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f0eee9]">
              <h2
                className="text-lg font-bold text-[#1a1a2e]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Book Your 45-Min Appointment with Dr. Al-Deek
              </h2>
              <p
                className="text-sm text-[#4a4a5a] mt-0.5"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Choose a date and time that works for you
              </p>
            </div>
            <iframe
              src="https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826"
              style={{ width: "100%", height: "clamp(700px, 90vw, 900px)", border: "none" }}
              title="Book your appointment with Dr. Al-Deek"
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Info Band ── */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-white rounded-2xl border border-[#e8e6e3] divide-y divide-[#f0eee9]">
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="text-[#E8339E] mt-0.5 flex-shrink-0">📋</span>
              <p className="text-sm text-[#4a4a5a] leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <strong className="text-[#1a1a2e]">Your physician will review your intake information</strong> before the visit so your consultation is personalized from the first minute.
              </p>
            </div>
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="text-[#E8339E] mt-0.5 flex-shrink-0">💳</span>
              <p className="text-sm text-[#4a4a5a] leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <strong className="text-[#1a1a2e]">The remaining $149 will be charged on the day of your appointment.</strong> No surprises.
              </p>
            </div>
          </div>
        </div>

        {/* ── What Happens Next heading ── */}
        <div className="w-full max-w-lg mb-5 text-center">
          <span
            className="text-xs font-extrabold tracking-[0.2em] uppercase"
            style={{ fontFamily: "Montserrat, sans-serif", color: BRAND_PINK }}
          >
            What Happens Next
          </span>
          <h3
            className="text-xl font-bold text-[#1a1a2e] mt-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Complete these 3 steps to prepare for your visit
          </h3>
        </div>

        {/* ── Steps with cards + subtle connector ── */}
        <div className="w-full max-w-lg mb-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <div key={i}>
                {/* Step card */}
                <div className="bg-white rounded-2xl border border-[#e8e6e3] p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${step.color}12, ${step.color}22)` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-xs font-bold tracking-[0.1em] uppercase mb-1 block"
                        style={{ fontFamily: "Montserrat, sans-serif", color: step.color }}
                      >
                        {step.label}
                      </span>
                      <h2
                        className="text-lg font-bold text-[#1a1a2e] mb-1.5"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {step.title}
                      </h2>
                      <p
                        className="text-[#4a4a5a] text-sm leading-relaxed"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {step.description}
                      </p>
                      {step.link && (
                        <a
                          href={step.link.href}
                          {...((step.link as any).external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {step.link.text}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector dots between cards */}
                {!isLast && (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-1 h-1 rounded-full bg-[#E8339E]/30" />
                    <div className="w-1 h-1 rounded-full bg-[#E8339E]/30 mt-1.5" />
                    <div className="w-1 h-1 rounded-full bg-[#E8339E]/30 mt-1.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Big Call Button */}
        <div className="w-full max-w-lg mb-10">
          <a
            href="tel:8883627011"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="text-left">
              <span
                className="block text-lg font-bold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                (888) 362-7011
              </span>
              <span
                className="block text-xs text-white/80 font-medium"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Questions? Call us anytime
              </span>
            </div>
          </a>
        </div>

        {/* Continue Exploring Link */}
        <div className="w-full max-w-lg text-center pt-6 border-t border-[#e8e6e3]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#4a4a5a] hover:text-[#E8339E] text-sm font-medium transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Continue exploring MedMethod Direct
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}
