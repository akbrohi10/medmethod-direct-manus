/* =============================================================================
   Thank You / Booking Confirmation Page
   - Fires GTM dataLayer event for conversion tracking
   - Focused on two actions: accept calendar invite + reply to text
   - No navigation distractions — keep patient focused
   ============================================================================= */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Mail, MessageSquare, Clock, HelpCircle, ArrowRight } from "lucide-react";

export default function ThankYou() {
  // Fire GTM conversion event on page load
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "booking_complete" });
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
        <div className="w-full max-w-lg py-6 mb-6">
          <a href="/" className="inline-flex flex-col items-start leading-none" style={{ width: "fit-content" }}>
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
            You're Confirmed!
          </h1>
          <p
            className="text-[#4a4a5a] text-base md:text-lg max-w-md mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Your Discovery Call with our care team is scheduled. Here's what to do next to secure your spot.
          </p>
        </div>

        {/* Two Action Steps */}
        <div className="w-full max-w-lg space-y-5 mb-10">
          {/* Step 1: Calendar Invite */}
          <div className="bg-white rounded-2xl border border-[#e8e6e3] p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8339E]/10 to-[#7A1E7E]/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#E8339E]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold tracking-[0.1em] uppercase text-[#E8339E]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Step 1
                  </span>
                </div>
                <h2
                  className="text-lg font-bold text-[#1a1a2e] mb-1.5"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Accept Your Calendar Invite
                </h2>
                <p
                  className="text-[#4a4a5a] text-sm leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Check your email for a calendar invitation and accept it now. This confirms your time slot with our care team.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Reply to Text */}
          <div className="bg-white rounded-2xl border border-[#e8e6e3] p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8339E]/10 to-[#7A1E7E]/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#7A1E7E]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold tracking-[0.1em] uppercase text-[#7A1E7E]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Step 2
                  </span>
                </div>
                <h2
                  className="text-lg font-bold text-[#1a1a2e] mb-1.5"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Reply to Our Text Message
                </h2>
                <p
                  className="text-[#4a4a5a] text-sm leading-relaxed"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  You'll receive a text from our team shortly. Please reply to confirm — this lets your care coordinator know you're ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Notice */}
        <div className="w-full max-w-lg mb-10">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p
              className="text-amber-900 text-sm leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <strong>Please confirm within 24 hours.</strong> Due to high demand, appointments that are not confirmed (calendar accepted + text replied) are automatically released to the next patient on our waitlist.
            </p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="w-full max-w-lg mb-10">
          <h3
            className="text-sm font-bold tracking-[0.1em] uppercase text-[#4a4a5a] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            What to Expect
          </h3>
          <div className="bg-white rounded-2xl border border-[#e8e6e3] p-6 shadow-sm">
            <ul className="space-y-3">
              {[
                "Your call will be 15 minutes with a care coordinator",
                "No preparation needed — just come with your questions",
                "We'll discuss your goals and whether our program is the right fit",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8339E] mt-2 flex-shrink-0" />
                  <span
                    className="text-[#4a4a5a] text-sm leading-relaxed"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Questions CTA */}
        <div className="w-full max-w-lg text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-[#4a4a5a]">
            <HelpCircle className="w-4 h-4" />
            <p
              className="text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Questions before your call?{" "}
              <a
                href="tel:8883627011"
                className="text-[#E8339E] font-semibold hover:underline"
              >
                (888) 362-7011
              </a>
            </p>
          </div>
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
