import { ArrowRight, CheckCircle, Mail, MessageSquare, UserPlus } from "lucide-react";

const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";

const steps = [
  {
    icon: UserPlus,
    label: "Step 1",
    title: "Create Your Patient Account",
    description: "Set up your secure patient portal to complete intake forms, sign waivers, upload labs, and communicate with Dr. Al-Deek and our care team before your appointment.",
    color: BRAND_PINK,
    link: { href: "https://medmethoddirect.md-hq.com/registration", text: "Create Account" },
  },
  {
    icon: Mail,
    label: "Step 2",
    title: "Accept Your Calendar Invite",
    description: "Check your email for a calendar invitation and accept it now. This confirms your time slot with Dr. Al-Deek.",
    color: BRAND_PLUM,
  },
  {
    icon: MessageSquare,
    label: "Step 3",
    title: "Reply to Our Text to Secure Your Spot",
    description: "You'll receive a confirmation text shortly. Reply to confirm and lock in your time. Unconfirmed appointments are released within 24 hours.",
    color: BRAND_PINK,
  },
];

interface WL2BookingFollowupProps {
  firstName?: string;
  email?: string;
  compact?: boolean;
}

/** Shared booking and follow-up material used on /thank-you2 and inside the WL2 modal. */
export default function WL2BookingFollowup({ firstName, email, compact = false }: WL2BookingFollowupProps) {
  const calendarParams = new URLSearchParams();
  if (firstName) calendarParams.set("name", firstName);
  if (email) calendarParams.set("email", email);
  const calendarSrc = `${BOOKING_URL}${calendarParams.size ? `?${calendarParams.toString()}` : ""}`;
  const spacing = compact ? "mb-6" : "mb-10";

  return (
    <div className={compact ? "pb-6" : ""}>
      <div className={`text-center ${spacing}`}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#E8339E]/10 to-[#7A1E7E]/10 mb-4">
          <CheckCircle className="w-8 h-8 text-[#E8339E]" strokeWidth={1.8} />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>You're Booked!</h2>
        <p className="text-[#4a4a5a] text-sm max-w-md mx-auto">
          Your $15 hold is confirmed. Now pick a time below to meet with Dr. Al-Deek.
        </p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#E8339E]/5 border border-[#E8339E]/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-[#1a1a2e]">100% Virtual — No Office Visit Needed</span>
        </div>
      </div>

      <div className={`w-full max-w-2xl mx-auto ${spacing}`}>
        <div className="bg-white rounded-2xl border border-[#e8e6e3] shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-[#f0eee9]">
            <h3 className="text-base font-bold text-[#1a1a2e]">Book Your 15-Minute Visit with Dr. Al-Deek</h3>
            <p className="text-sm text-[#4a4a5a] mt-0.5">Choose a date and time that works for you</p>
          </div>
          <iframe
            src={calendarSrc}
            className="w-full border-0"
            style={{ height: compact ? "min(760px, calc(95vh - 200px))" : "clamp(700px, 90vw, 900px)" }}
            title="Book your 15-minute visit with Dr. Al-Deek"
            loading="lazy"
          />
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto mb-5 text-center">
        <span className="text-xs font-extrabold tracking-[0.2em] uppercase" style={{ color: BRAND_PINK }}>What Happens Next</span>
        <h3 className="text-lg font-bold text-[#1a1a2e] mt-1">Complete these 3 steps to prepare for your visit</h3>
      </div>

      <div className={`w-full max-w-lg mx-auto ${spacing}`}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label}>
              <div className="bg-white rounded-2xl border border-[#e8e6e3] p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${step.color}12, ${step.color}22)` }}><Icon className="w-5 h-5" style={{ color: step.color }} /></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold tracking-[0.1em] uppercase mb-1 block" style={{ color: step.color }}>{step.label}</span>
                    <h4 className="text-base font-bold text-[#1a1a2e] mb-1">{step.title}</h4>
                    <p className="text-[#4a4a5a] text-sm leading-relaxed">{step.description}</p>
                    {step.link && <a href={step.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">{step.link.text}<ArrowRight className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && <div className="flex flex-col items-center py-2"><div className="w-1 h-1 rounded-full bg-[#E8339E]/30" /><div className="w-1 h-1 rounded-full bg-[#E8339E]/30 mt-1.5" /><div className="w-1 h-1 rounded-full bg-[#E8339E]/30 mt-1.5" /></div>}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-lg mx-auto">
        <a href="tel:8883627011" className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E8339E] to-[#7A1E7E] text-white shadow-lg hover:shadow-xl transition-all">
          <div className="text-center"><span className="block text-lg font-bold">(888) 362-7011</span><span className="block text-xs text-white/80 font-medium">Questions? Call us anytime</span></div>
        </a>
      </div>
    </div>
  );
}
