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
    icon: Mail,
    label: "Step 1",
    title: "Accept Your Calendar Invite",
    description:
      "Check your email for a calendar invitation and accept it now. This confirms your time slot with our care team.",
    color: BRAND_PINK,
    link: null,
  },
  {
    icon: MessageSquare,
    label: "Step 2",
    title: "Reply to Our Text to Secure Your Spot",
    description:
      "You'll receive a confirmation text shortly. We keep our schedule open and available so serious patients can get in quickly — reply to confirm and lock in your time. Unconfirmed appointments are released within 24 hours.",
    color: BRAND_PLUM,
    link: null,
  },
  {
    icon: BookOpen,
    label: "Step 3",
    title: "Review Our Programs & Pricing",
    description:
      "Your Care Coordinator will ask which program interests you and answer your specific questions. Patients who review our site beforehand get significantly more out of their call.",
    color: BRAND_PINK,
    link: { href: "/#programs", text: "View Programs & Pricing" },
  },
  {
    icon: UserPlus,
    label: "Step 4",
    title: "Create Your Patient Account",
    description:
      "Set up your secure patient portal to complete intake forms, sign waivers, upload labs, and communicate directly with Dr. Al-Deek before your appointment.",
    color: BRAND_PLUM,
    link: { href: "https://medmethoddirect.md-hq.com/registration", text: "Create Account", external: true },
  },
];

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
        <div className="w-full max-w-lg py-6 mb-6 flex justify-center">
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

        {/* ── Timeline Steps (no boxes, dotted line on left) ── */}
        <div className="w-full max-w-lg mb-10">
          <div className="relative pl-10 md:pl-14">
            {/* Dotted vertical line */}
            <div
              className="absolute left-[22px] md:left-[30px] top-6 bottom-6"
              style={{
                width: 2,
                backgroundImage: `repeating-linear-gradient(to bottom, ${BRAND_PINK} 0px, ${BRAND_PINK} 6px, transparent 6px, transparent 14px)`,
              }}
            />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === STEPS.length - 1;
              return (
                <div key={i} className={`relative ${!isLast ? "pb-10" : "pb-0"}`}>
                  {/* Timeline node */}
                  <div
                    className="absolute left-[-18px] md:left-[-22px] w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}25)`,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    <Icon className="w-5 h-5 md:w-5.5 md:h-5.5" style={{ color: step.color }} />
                  </div>

                  {/* Step content */}
                  <div className="ml-4 md:ml-6 pt-1">
                    <span
                      className="text-xs font-bold tracking-[0.12em] uppercase mb-1 block"
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
              );
            })}
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
              <strong>Please confirm within 24 hours.</strong> We keep our availability open for patients who are ready to take action. Unconfirmed appointments (calendar not accepted + text not replied) are automatically released so those serious about their health can get in quickly.
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
                "Please review our programs and pricing before your call",
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

        {/* Free PDF Guide Download */}
        <div className="w-full max-w-lg mb-8">
          <a
            href="/manus-storage/medmethod_direct_guide_with_contact-5_3418a630.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-[#fdf2f8] to-[#faf5ff] rounded-xl border-2 border-[#E8339E]/20 p-5 hover:border-[#E8339E]/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#E8339E] to-[#9b1d7a] flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-bold text-[#1a1a2e] group-hover:text-[#E8339E] transition-colors mb-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Free Guide: Before You Start GLP-1s or Hormone Therapy
                </h3>
                <p
                  className="text-sm text-[#4a4a5a] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  A 9-page guide on safety, personalization, and choosing the right care model — written by Dr. Al-Deek.
                </p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8339E]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Download Your Free Guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
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
