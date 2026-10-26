import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Mail, MessageSquare, UserPlus } from "lucide-react";
import "./thank-you-video.css";

export default function ThankYouVideo4799() {
  return (
    <>
      <Helmet>
        <title>You're Confirmed | MedMethod Direct</title>
        <meta name="description" content="Your $47.99 Zoom video visit payment is confirmed. Choose a time with Dr. Al-Deek, then follow the next steps." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div id="thank-you-video-root" className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-start px-4 pt-0 pb-12 md:pb-20">
        {/* Minimal Logo Header */}
        <div className="w-full max-w-2xl py-5 mb-6 flex items-center justify-between">
          <a href="/" className="inline-flex flex-col items-center leading-none" style={{ width: "fit-content" }}>
            <div className="flex items-baseline gap-0">
              <span
                className="font-black text-[#113a3a]"
                style={{ fontFamily: "Montserrat, Arial, sans-serif", fontSize: "1.3rem", letterSpacing: "-0.02em" }}
              >
                Med
              </span>
              <span
                className="font-black"
                style={{
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontSize: "1.3rem",
                  letterSpacing: "-0.02em",
                  backgroundImage: "linear-gradient(135deg, #0e7c7b 0%, #075c5c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Method
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 w-full">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #0e7c7b, #075c5c)" }} />
              <span
                className="text-[#113a3a] font-semibold tracking-[0.25em]"
                style={{ fontFamily: "Montserrat, Arial, sans-serif", fontSize: "0.5rem" }}
              >
                DIRECT
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #075c5c, #0e7c7b)" }} />
            </div>
          </a>
          <a
            href="tel:+18883627011"
            className="inline-flex items-center gap-2 text-[#075c5c] hover:text-[#0e7c7b] transition-colors"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">(888) 362-7011</span>
              <span className="text-[10px] font-medium text-[#59656f] hidden sm:block">Need help?</span>
            </div>
          </a>
        </div>

        <VideoBookingFollowup />

        {/* Continue Exploring Link */}
        <div className="w-full max-w-lg text-center pt-6 border-t border-[#d7e1dd]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#59656f] hover:text-[#0e7c7b] text-sm font-medium transition-colors"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            Continue exploring MedMethod Direct
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}

const BRAND_ACCENT = "#0e7c7b";
const BRAND_DEEP = "#075c5c";
const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";

const steps = [
  {
    icon: UserPlus,
    label: "Step 1",
    title: "Create Your Patient Account",
    description: "Set up your secure patient portal to complete intake forms, sign waivers, upload labs, and communicate with Dr. Al-Deek and our care team before your appointment.",
    color: BRAND_ACCENT,
    link: { href: "https://medmethoddirect.md-hq.com/registration", text: "Create Account" },
  },
  {
    icon: Mail,
    label: "Step 2",
    title: "Accept Your Calendar Invite",
    description: "Check your email for a calendar invitation and accept it now. This confirms your time slot with Dr. Al-Deek.",
    color: BRAND_DEEP,
  },
  {
    icon: MessageSquare,
    label: "Step 3",
    title: "Reply to Our Text to Secure Your Spot",
    description: "You'll receive a confirmation text shortly. Reply to confirm and lock in your time. Unconfirmed appointments are released within 24 hours.",
    color: BRAND_ACCENT,
  },
];

interface VideoBookingFollowupProps {
  firstName?: string;
  email?: string;
  compact?: boolean;
}

/** Shared booking and follow-up material used on /thank-you-video only; original booking page is unchanged. */
function VideoBookingFollowup({ firstName, email, compact = false }: VideoBookingFollowupProps) {
  const calendarParams = new URLSearchParams();
  if (firstName) calendarParams.set("name", firstName);
  if (email) calendarParams.set("email", email);
  const calendarSrc = `${BOOKING_URL}${calendarParams.size ? `?${calendarParams.toString()}` : ""}`;
  const spacing = compact ? "mb-6" : "mb-10";

  return (
    <div className={compact ? "pb-6" : ""}>
      <div className={`text-center ${spacing}`}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#0e7c7b]/10 to-[#075c5c]/10 mb-4">
          <CheckCircle className="w-8 h-8 text-[#0e7c7b]" strokeWidth={1.8} />
        </div>
        <h2 className="text-2xl font-bold text-[#113a3a] mb-2" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>You're Booked!</h2>
        <p className="text-[#59656f] text-sm max-w-md mx-auto">
          Your $47.99 Zoom video visit payment is confirmed. Now pick a time below to meet with Dr. Al-Deek.
        </p>
        <div className="tyv-intake-primary inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#0e7c7b]/5 border border-[#0e7c7b]/20">
          <span className="w-2 h-2 rounded-full bg-[#72a40b] animate-pulse" />
          <span className="text-xs font-medium text-[#113a3a]">100% Virtual - No Office Visit Needed</span>
        </div>
      </div>

      <div className={`w-full max-w-2xl mx-auto ${spacing}`}>
        <div className="bg-white rounded-2xl border border-[#d7e1dd] shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-[#d7e1dd]">
            <h3 className="text-base font-bold text-[#113a3a]">Book Your Zoom Video Visit with Dr. Al-Deek</h3>
            <p className="text-sm text-[#59656f] mt-0.5">Choose a date and time that works for you</p>
          </div>
          <iframe
            src={calendarSrc}
            className="w-full border-0"
            style={{ height: compact ? "min(760px, calc(95vh - 200px))" : "clamp(700px, 90vw, 900px)" }}
            title="Book your Zoom video visit with Dr. Al-Deek"
            loading="lazy"
          />
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto mb-5 text-center">
        <span className="text-xs font-extrabold tracking-[0.2em] uppercase" style={{ color: BRAND_ACCENT }}>What Happens Next</span>
        <h3 className="text-lg font-bold text-[#113a3a] mt-1">Complete these 3 steps to prepare for your visit</h3>
      </div>

      <div className={`w-full max-w-lg mx-auto ${spacing}`}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label}>
              <div className="bg-white rounded-2xl border border-[#d7e1dd] p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${step.color}12, ${step.color}22)` }}><Icon className="w-5 h-5" style={{ color: step.color }} /></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold tracking-[0.1em] uppercase mb-1 block" style={{ color: step.color }}>{step.label}</span>
                    <h4 className="text-base font-bold text-[#113a3a] mb-1">{step.title}</h4>
                    <p className="text-[#59656f] text-sm leading-relaxed">{step.description}</p>
                    {step.link && <a href={step.link.href} target="_blank" rel="noopener noreferrer" className="tyv-intake-primary inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#0e7c7b] to-[#075c5c] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">{step.link.text}<ArrowRight className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && <div className="flex flex-col items-center py-2"><div className="w-1 h-1 rounded-full bg-[#0e7c7b]/30" /><div className="w-1 h-1 rounded-full bg-[#0e7c7b]/30 mt-1.5" /><div className="w-1 h-1 rounded-full bg-[#0e7c7b]/30 mt-1.5" /></div>}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-lg mx-auto">
        <a href="tel:8883627011" className="tyv-intake-primary flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0e7c7b] to-[#075c5c] text-white shadow-lg hover:shadow-xl transition-all">
          <div className="text-center"><span className="block text-lg font-bold">(888) 362-7011</span><span className="block text-xs text-white/80 font-medium">Questions? Call us anytime</span></div>
        </a>
      </div>
    </div>
  );
}
