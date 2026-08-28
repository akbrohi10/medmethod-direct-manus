/* =============================================================================
   LpConsultationModal2.tsx — LP-specific intake modal for /lp/hrt2
   Flow: Questions → Attribution → Lead Capture → Payment (deposit) → Calendar
   Initial visit: $199 (video consultation + protocol). $50 deposit today, $149 due day of appointment.
   Deposit: $50 now, $149 due day of appointment.
   ============================================================================= */
import React, { useState, useMemo, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import PayPalPaymentForm from "./PayPalPaymentForm";
import StripePaymentForm from "./StripePaymentForm";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";
/** Intake form webhook — fires on lead capture (creates/updates contact in GHL) */
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/66201c6d-9b98-4fac-9725-e44c0415f8e7";
/** Payment success webhook — fires after $50 deposit is confirmed */
const GHL_PAYMENT_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093";

interface Props {
  open: boolean;
  onClose: () => void;
  /** The originating landing page path, e.g. "/lp/WL" or "/lp/hrt3" */
  landingPage?: string;
}

const SERVICE_OPTIONS = [
  { label: "Weight Loss", subtitle: "GLP-1 / Semaglutide · Tirzepatide", icon: "🔥" },
  { label: "Hormone Therapy for Women", subtitle: "", icon: "🧬" },
  { label: "Nutrition & Vitamin Optimization", subtitle: "", icon: "💊" },
  { label: "Dermatology & Skin", subtitle: "", icon: "✨" },
  { label: "Hair Restoration", subtitle: "", icon: "💇‍♀️" },
  { label: "Other", subtitle: "", icon: "➕" },
];

const questions = [
  {
    id: "goal",
    question: "What's your primary goal?",
    subtitle: "This helps us personalize your experience",
    options: [
      "Lose weight & burn fat",
      "Balance my hormones",
      "Manage menopause symptoms",
      "Improve energy & metabolism",
      "All of the above",
    ],
  },
  {
    id: "duration",
    question: "How long has this been on your mind?",
    subtitle: "We want to understand your journey",
    options: [
      "Less than 6 months",
      "6 months to 1 year",
      "1 to 3 years",
      "3 years or more",
    ],
  },
  {
    id: "tried",
    question: "Have you tried medical programs or treatments for this before?",
    subtitle: "No judgment — we just want to help you succeed this time",
    options: [
      "No, this is my first time",
      "I've tried multiple approaches",
    ],
  },
  {
    id: "age",
    question: "What is your date of birth?",
    subtitle: "We use your age to tailor your hormonal protocol",
    options: [],
  },
  {
    id: "goals",
    question: "In your own words, what do you most want to change?",
    subtitle: "Optional — helps your doctor prepare for your consultation",
    options: [],
  },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BRAND_DISABLED = "#f0abcf";
const ITEM_H = 44;
const STANDARD_CONSULTATION_PRICING = {
  consultationTotalAmount: 19_900,
  depositAmount: 5_000,
  remainingAmount: 14_900,
  referralCreditAmount: 0,
  referralCode: null as string | null,
};

type ReferralPricing = typeof STANDARD_CONSULTATION_PRICING;

const LECTURE50_PRICING: ReferralPricing = {
  consultationTotalAmount: 14_900,
  depositAmount: 5_000,
  remainingAmount: 9_900,
  referralCreditAmount: 5_000,
  referralCode: "LECTURE50",
};

function dollarsFromCents(amount: number): string {
  return `$${(amount / 100).toFixed(amount % 100 === 0 ? 0 : 2)}`;
}

const ATTRIBUTION_OPTIONS = [
  "Social media",
  "Google search",
  "Friend or family referral",
  "Dr. Al-Deek's book",
  "Live event or webinar",
  "Podcast",
  "Other",
];

// ── Pure CSS scroll-snap column ──────────────────────────────────────────────
function WheelColumn({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (idx: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isScrolling.current) return;
    el.scrollTop = selectedIndex * ITEM_H;
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isScrolling.current = true;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      onSelect(clamped);
      isScrolling.current = false;
    });
  }, [items.length, onSelect]);

  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: ITEM_H * 5 }}>
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to bottom, #fafafa 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to top, #fafafa 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-x-0 z-10 pointer-events-none"
        style={{
          top: ITEM_H * 2,
          height: ITEM_H,
          background: "linear-gradient(135deg, rgba(232,51,158,0.10) 0%, rgba(122,30,126,0.10) 100%)",
          borderTop: "1.5px solid rgba(232,51,158,0.25)",
          borderBottom: "1.5px solid rgba(232,51,158,0.25)",
        }}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          paddingTop: ITEM_H * 2,
          paddingBottom: ITEM_H * 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div
            key={item}
            onClick={() => {
              onSelect(i);
              if (ref.current) ref.current.scrollTop = i * ITEM_H;
            }}
            style={{
              height: ITEM_H,
              scrollSnapAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
              fontWeight: i === selectedIndex ? 700 : 400,
              color: i === selectedIndex ? BRAND_PLUM : "#9ca3af",
              fontSize: i === selectedIndex ? 15 : 13,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lead capture form ────────────────────────────────────────────────────────
interface LeadData {
  firstName: string;
  email: string;
  phone: string;
  zip: string;
  transactionalConsent: boolean;
  promotionalConsent: boolean;
}

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v: string) { return v.replace(/\D/g, "").length >= 10; }
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function LeadCaptureForm({ data, onChange, showConsentError }: { data: LeadData; onChange: (d: LeadData) => void; showConsentError?: boolean }) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const blur = (f: string) => setTouched((p) => ({ ...p, [f]: true }));

  const inputBase: React.CSSProperties = {
    outline: "none", borderWidth: 1, borderStyle: "solid", borderRadius: 12,
    padding: "12px 16px", width: "100%", fontSize: 16, color: "#1f2937",
    background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
  };
  const fieldStyle = (field: string, valid: boolean): React.CSSProperties => ({
    ...inputBase,
    borderColor: touched[field] && !valid ? "#ef4444" : touched[field] && valid ? BRAND_PINK : "#e5e7eb",
    boxShadow: touched[field] && valid ? `0 0 0 3px rgba(232,51,158,0.12)` : "none",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          First Name <span style={{ color: BRAND_PINK }}>*</span>
        </label>
        <input type="text" value={data.firstName} placeholder="Jane" autoComplete="given-name"
          onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          onBlur={() => blur("firstName")}
          style={fieldStyle("firstName", data.firstName.trim().length >= 2)} />
        {touched.firstName && data.firstName.trim().length < 2 && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>Please enter your first name</p>
        )}
      </div>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Email Address <span style={{ color: BRAND_PINK }}>*</span>
        </label>
        <input type="email" value={data.email} placeholder="jane@example.com" autoComplete="email"
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          onBlur={() => blur("email")}
          style={fieldStyle("email", isValidEmail(data.email))} />
        {touched.email && !isValidEmail(data.email) && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>Please enter a valid email address</p>
        )}
      </div>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Phone Number <span style={{ color: BRAND_PINK }}>*</span>
        </label>
        <input type="tel" value={data.phone} placeholder="(555) 000-0000" autoComplete="tel"
          onChange={(e) => onChange({ ...data, phone: formatPhone(e.target.value) })}
          onBlur={() => blur("phone")}
          style={fieldStyle("phone", isValidPhone(data.phone))} />
        {touched.phone && !isValidPhone(data.phone) && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>Please enter a valid 10-digit phone number</p>
        )}
      </div>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          ZIP Code{" "}
          <span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
        </label>
        <input type="text" value={data.zip} placeholder="90210" autoComplete="postal-code" maxLength={10}
          onChange={(e) => onChange({ ...data, zip: e.target.value.replace(/[^0-9-]/g, "") })}
          style={{ ...inputBase, borderColor: "#e5e7eb" }}
          onFocus={(e) => { e.target.style.borderColor = BRAND_PINK; e.target.style.boxShadow = "0 0 0 3px rgba(232,51,158,0.12)"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
      </div>
      {/* ── SMS Consent (A2P 10DLC compliant) ── */}
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", minHeight: 44 }}>
          <input
            type="checkbox"
            checked={data.transactionalConsent}
            onChange={(e) => onChange({ ...data, transactionalConsent: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: BRAND_PINK }}
          />
          <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
            <strong style={{ color: "#374151" }}>Required:</strong> I agree to receive appointment confirmations, reminders, and care-related messages from MedMethod Direct via SMS/text. Message frequency varies. Message & data rates may apply. Reply STOP to opt out.
            {showConsentError && !data.transactionalConsent && (
              <span style={{ display: "block", color: "#ef4444", marginTop: 4, fontWeight: 600 }}>
                Please agree to receive appointment messages to continue.
              </span>
            )}
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", minHeight: 44 }}>
          <input
            type="checkbox"
            checked={data.promotionalConsent}
            onChange={(e) => onChange({ ...data, promotionalConsent: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: BRAND_PINK }}
          />
          <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
            <strong style={{ color: "#374151" }}>Optional:</strong> I'd also like to receive health tips, exclusive offers, and educational content from MedMethod Direct via SMS/text. You can opt out at any time.
          </span>
        </label>
      </div>
    </div>
  );
}

// PaymentForm is now handled by StripePaymentForm component

function ReferralCodeControl({
  paymentId,
  onApplied,
}: {
  paymentId: number | null;
  onApplied: (pricing: ReferralPricing) => void;
}) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const persistedPaymentIdRef = useRef<number | null>(null);
  const redeemReferralCredit = trpc.referralCredits.redeem.useMutation({
    onSuccess: (result) => {
      setMessage(result.message);
      if (!result.applied) {
        setApplied(false);
        onApplied(STANDARD_CONSULTATION_PRICING);
        return;
      }
      setApplied(true);
      onApplied({
        consultationTotalAmount: result.consultationTotalAmount,
        depositAmount: result.depositAmount,
        remainingAmount: result.remainingAmount,
        referralCreditAmount: result.referralCreditAmount,
        referralCode: result.referralCode,
      });
    },
    onError: (error) => {
      persistedPaymentIdRef.current = null;
      setApplied(false);
      onApplied(STANDARD_CONSULTATION_PRICING);
      setMessage(error.message || "Unable to apply referral code");
    },
  });

  const handleApply = () => {
    const normalizedCode = code.trim().toUpperCase();
    setCode(normalizedCode);
    setMessage(null);
    if (!normalizedCode) return;
    if (normalizedCode !== "LECTURE50") {
      setApplied(false);
      onApplied(STANDARD_CONSULTATION_PRICING);
      setMessage("Referral code not recognized");
      return;
    }

    setApplied(true);
    onApplied(LECTURE50_PRICING);
    setMessage("LECTURE50 applied — $50 consultation credit");

    if (paymentId) {
      persistedPaymentIdRef.current = paymentId;
      redeemReferralCredit.mutate({ paymentId, code: normalizedCode });
    }
  };

  useEffect(() => {
    const normalizedCode = code.trim().toUpperCase();
    if (!paymentId || !applied || normalizedCode !== "LECTURE50") return;
    if (persistedPaymentIdRef.current === paymentId || redeemReferralCredit.isPending) return;

    persistedPaymentIdRef.current = paymentId;
    redeemReferralCredit.mutate({ paymentId, code: normalizedCode });
  }, [paymentId, applied, code, redeemReferralCredit]);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-5">
      <label htmlFor="homepage-referral-code" className="block text-sm font-semibold text-gray-800 mb-2">
        Have a referral code?
      </label>
      <div className="flex gap-2">
        <input
          id="homepage-referral-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setMessage(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleApply();
            }
          }}
          placeholder="Enter referral code"
          autoCapitalize="characters"
          autoComplete="off"
          disabled={applied}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium uppercase tracking-wide text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={!code.trim() || redeemReferralCredit.isPending || applied}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: BRAND_GRADIENT }}
        >
          {redeemReferralCredit.isPending ? "Applying..." : applied ? "Applied" : "Apply Code"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs font-semibold ${applied ? "text-green-700" : "text-red-600"}`} role="status">
          {message}
        </p>
      )}
      {applied && !paymentId && (
        <p className="mt-2 text-xs text-gray-500">Your credit will be secured with the checkout record automatically.</p>
      )}
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────
export default function LpConsultationModal2({ open, onClose, landingPage = "/lp/hrt2" }: Props) {
  const [, navigate] = useLocation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [goalsText, setGoalsText] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({ firstName: "", email: "", phone: "", zip: "", transactionalConsent: false, promotionalConsent: false });
  const [attribution, setAttribution] = useState<string | null>(null);
  const [attributionOther, setAttributionOther] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [webhookSubmitting, setWebhookSubmitting] = useState(false);
  const [webhookSubmitted, setWebhookSubmitted] = useState(false);
  const [consentAttempted, setConsentAttempted] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [stripePaymentId, setStripePaymentId] = useState<number | null>(null);
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<string | null>(null);
  const [paypalPaymentId, setPaypalPaymentId] = useState<number | null>(null);
  const [referralPricing, setReferralPricing] = useState<ReferralPricing>(STANDARD_CONSULTATION_PRICING);
  const [chargeScheduled, setChargeScheduled] = useState(false);
  // Fetch the active payment provider (stripe | paypal) — public endpoint, no auth needed
  const activeProviderQuery = trpc.paypal.getPublicClientId.useQuery(undefined, {
    enabled: open,
  });
  const activeProvider = activeProviderQuery.data?.activeProvider ?? "stripe";
  const currentPaymentId = activeProvider === "paypal" ? paypalPaymentId : stripePaymentId;
  const referralCodeEnabled = landingPage === "/";
  const remainingBalanceLabel = dollarsFromCents(referralPricing.remainingAmount);
  const consultationTotalLabel = dollarsFromCents(referralPricing.consultationTotalAmount);
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  // ── Option B: postMessage listener for GHL calendar iframe ──────────────────
  // GHL fires a window.postMessage when the patient completes booking.
  // We parse the appointment date and call scheduleRemainingCharge automatically.
  const stripeScheduleCharge = trpc.stripe.scheduleRemainingCharge.useMutation({
    onSuccess: () => {
      setChargeScheduled(true);
      toast.success(
        `Appointment booked! Your remaining ${remainingBalanceLabel} balance will be charged on your appointment date.`,
        { duration: 6000 }
      );
    },
    onError: (err) => {
      console.error("[GHL postMessage] stripe scheduleRemainingCharge failed:", err);
    },
  });
  const paypalScheduleCharge = trpc.paypal.scheduleRemainingCharge.useMutation({
    onSuccess: () => {
      setChargeScheduled(true);
      toast.success(
        `Appointment booked! Your remaining ${remainingBalanceLabel} balance will be charged on your appointment date.`,
        { duration: 6000 }
      );
    },
    onError: (err) => {
      console.error("[GHL postMessage] paypal scheduleRemainingCharge failed:", err);
    },
  });
  // Alias: picks the right mutation based on active provider
  const scheduleRemainingCharge = activeProvider === "paypal" ? paypalScheduleCharge : stripeScheduleCharge;
  // Keep a dummy reference to the original to avoid unused-var TS errors
  const _scheduleRemainingCharge = trpc.stripe.scheduleRemainingCharge.useMutation({
    onSuccess: () => {
      setChargeScheduled(true);
      toast.success(
        `Appointment booked! Your remaining ${remainingBalanceLabel} balance will be charged on your appointment date.`,
        { duration: 6000 }
      );
    },
    onError: (err) => {
      console.error("[GHL postMessage] scheduleRemainingCharge (unused ref) failed:", err);
    },
  });
  void _scheduleRemainingCharge;

  // CALENDAR_STEP = 9 (PAYMENT_STEP + 1 = 8 + 1)
  const CALENDAR_STEP_VALUE = 9;

  useEffect(() => {
    if (step !== CALENDAR_STEP_VALUE) return;

    const handleMessage = (event: MessageEvent) => {
      // Only process messages from the GHL booking iframe domain
      const allowedOrigins = [
        "https://link.sendmeapro.com",
        "https://app.gohighlevel.com",
        "https://crm.gohighlevel.com",
        "https://app.leadconnectorhq.com",
      ];
      if (!allowedOrigins.some((o) => event.origin.startsWith(o))) return;

      try {
        // Skip iFrameResizer internal messages (e.g. "[iFrameResizer]...") and
        // any other non-JSON strings that come from the GHL iframe origin.
        if (typeof event.data === "string" && !event.data.trim().startsWith("{")) return;
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;

        console.log("[GHL postMessage] Received:", data);

        // GHL sends various event types — look for booking confirmation signals
        const isBookingEvent =
          data.type === "appointment_booked" ||
          data.type === "booking_confirmed" ||
          data.type === "appointmentBooked" ||
          data.event === "appointment_booked" ||
          data.event === "booking_confirmed" ||
          data.action === "appointment_booked" ||
          // GHL sometimes sends a generic 'formSubmit' or 'calendarBooked' event
          data.type === "calendarBooked" ||
          data.type === "formSubmit" ||
          data.type === "APPOINTMENT_BOOKED";

        if (!isBookingEvent) return;

        // Extract appointment date/time from the message
        const rawDate =
          data.startTime ||
          data.start_time ||
          data.appointmentDate ||
          data.appointment_date ||
          data.date ||
          data.selectedDate ||
          data.appointment?.startTime ||
          data.appointment?.start_time;

        if (!rawDate) {
          console.warn("[GHL postMessage] Booking event received but no date found", data);
          return;
        }

        const appointmentDate = new Date(rawDate);
        if (isNaN(appointmentDate.getTime())) {
          console.warn("[GHL postMessage] Invalid date:", rawDate);
          return;
        }

        const appointmentTimestamp = appointmentDate.getTime();

        // Redirect to thank-you page for conversion tracking
        navigate("/thank-you");

        // Schedule remaining charge if payment ID is available
        const effectivePaymentId = stripePaymentId ?? paypalPaymentId;
        if (effectivePaymentId && !chargeScheduled) {
          console.log(
            `[GHL postMessage] Scheduling ${remainingBalanceLabel} charge for payment #${effectivePaymentId} on ${appointmentDate.toISOString()}`
          );
          scheduleRemainingCharge.mutate({
            paymentId: effectivePaymentId,
            appointmentDate: appointmentTimestamp,
          });
        }
      } catch (err) {
        console.error("[GHL postMessage] Parse error:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stripePaymentId, chargeScheduled]);

  // Scroll modal body to top whenever step changes
  useLayoutEffect(() => {
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
    const timer = setTimeout(() => {
      if (scrollBodyRef.current) {
        scrollBodyRef.current.scrollTop = 0;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [step]);

  const currentYear = new Date().getFullYear();
  const months = useMemo(() => ["January","February","March","April","May","June","July","August","September","October","November","December"], []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")), []);
  const years = useMemo(() => Array.from({ length: currentYear - 1919 }, (_, i) => String(currentYear - i)).filter(y => parseInt(y) <= currentYear - 18), [currentYear]);

  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(new Date().getDate() - 1);
  const [yearIdx, setYearIdx] = useState(30);

  const initialMonthIdx = useRef(new Date().getMonth());
  const initialDayIdx = useRef(new Date().getDate() - 1);
  const initialYearIdx = useRef(30);
  const dobTouched = monthIdx !== initialMonthIdx.current || dayIdx !== initialDayIdx.current || yearIdx !== initialYearIdx.current;

  useEffect(() => {
    if (open) {
      // No pre-selection — let user choose
      setSelectedServices([]);
    }
  }, [open]);

  const computedAge = useMemo(() => {
    const dob = new Date(parseInt(years[yearIdx]), monthIdx, parseInt(days[dayIdx]));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    return age;
  }, [monthIdx, dayIdx, yearIdx, months, days, years]);

  if (!open) return null;

  // Step layout for LP:
  // 0    = service selection
  // 1-5  = questions (goal, duration, tried, age, goals)
  // 6    = attribution
  // 7    = lead capture
  // 8    = PAYMENT (replaces budget/video/plan)
  // 9    = calendar
  const SERVICE_STEP = 0;
  const QUESTIONS_START = 1;
  const ATTRIBUTION_STEP = QUESTIONS_START + questions.length; // 6
  const LEAD_STEP = ATTRIBUTION_STEP + 1;                     // 7
  const PAYMENT_STEP = LEAD_STEP + 1;                         // 8
  const CALENDAR_STEP = PAYMENT_STEP + 1;                     // 9
  const TOTAL_STEPS = CALENDAR_STEP + 1;                      // 10

  const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  const isServiceStep = step === SERVICE_STEP;
  const isQuestionStep = step >= QUESTIONS_START && step < ATTRIBUTION_STEP;
  const questionIndex = step - QUESTIONS_START;
  const isAgeStep = isQuestionStep && questions[questionIndex]?.id === "age";
  const isGoalsStep = isQuestionStep && questions[questionIndex]?.id === "goals";
  const isLeadStep = step === LEAD_STEP;
  const isAttributionStep = step === ATTRIBUTION_STEP;
  const isPaymentStep = step === PAYMENT_STEP;
  const isCalendarStep = step === CALENDAR_STEP;

  const isLeadValid =
    leadData.firstName.trim().length >= 2 &&
    isValidEmail(leadData.email) &&
    isValidPhone(leadData.phone) &&
    leadData.transactionalConsent;

  const isNextDisabled = webhookSubmitting || (isServiceStep
    ? selectedServices.length === 0
    : isQuestionStep
      ? isAgeStep ? !dobTouched || computedAge < 18 : isGoalsStep ? false : !selected
      : isAttributionStep ? false
      : isLeadStep ? !isLeadValid
      : false);

  const toggleService = (label: string) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleNext = async () => {
    if (isServiceStep) {
      if (selectedServices.length === 0) return;
      setAnswers((prev) => ({ ...prev, services: selectedServices.join(", ") }));
      setStep((s) => s + 1);
      return;
    } else if (isQuestionStep) {
      if (isAgeStep) {
        if (computedAge < 18) return;
        const dobStr = `${months[monthIdx]} ${days[dayIdx]}, ${years[yearIdx]}`;
        setAnswers((prev) => ({ ...prev, age: dobStr, computedAge: String(computedAge) }));
        setSelected(null);
        setStep((s) => s + 1);
        return;
      }
      if (isGoalsStep) {
        if (goalsText.trim().length > 0) {
          setAnswers((prev) => ({ ...prev, goals: goalsText.trim() }));
        }
        setSelected(null);
        setStep((s) => s + 1);
        return;
      }
      if (!selected) return;
      setAnswers((prev) => ({ ...prev, [questions[questionIndex].id]: selected }));
      setSelected(null);
      setStep((s) => s + 1);
    } else if (isAttributionStep) {
      if (attribution) {
        const attrValue = attribution === "Other" && attributionOther.trim()
          ? `Other: ${attributionOther.trim()}`
          : attribution;
        setAnswers((prev) => ({ ...prev, attribution: attrValue }));
      }
      setStep((s) => s + 1);
    } else if (isLeadStep) {
      setConsentAttempted(true);
      if (!isLeadValid) return;
      setAnswers((prev) => ({
        ...prev,
        firstName: leadData.firstName.trim(),
        email: leadData.email.trim(),
        phone: leadData.phone,
        zip: leadData.zip,
        transactionalConsent: String(leadData.transactionalConsent),
        promotionalConsent: String(leadData.promotionalConsent),
      }));
      await submitLeadWebhook();
      setStep((s) => s + 1);
    }
  };

  const handlePaymentComplete = async (piId?: string) => {
    // Fire GHL payment webhook with all 14 required fields
    await submitPaymentWebhook(piId);
    // Navigate to thank-you page immediately after payment — calendar is embedded there
    navigate("/thank-you");
  };

  // First webhook: fires after lead capture
  const submitLeadWebhook = async () => {
    const payload = {
      services_selected: selectedServices.join(", ") || "",
      primary_goal: answers.goal || "",
      time_on_mind: answers.duration || "",
      previous_treatments: answers.tried || "",
      date_of_birth: answers.age || "",
      desired_change: answers.goals || goalsText.trim() || "",
      how_did_you_find_us: attribution && attribution !== "Other" ? attribution : (attribution === "Other" ? "Other" : ""),
      how_did_you_find_us_other: attribution === "Other" ? attributionOther.trim() : "",
      first_name: leadData.firstName.trim(),
      email: leadData.email.trim(),
      phone: leadData.phone,
      zip_code: leadData.zip,
      selected_plan: "3-Month Care Plan - $199 + $99/mo",
      selected_term_months: "3",
      source: "LP /lp/hrt2",
      form_name: "LP HRT2 Intake Form",
    };

    console.log("GHL webhook (LP lead capture):", payload);

    setWebhookSubmitting(true);
    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Webhook failed with status ${response.status}`);
      setWebhookSubmitted(true);
    } catch (error) {
      console.error("GHL webhook (LP lead capture) error:", error);
    } finally {
      setWebhookSubmitting(false);
    }
  };

  // Second webhook: fires after payment — posts to the dedicated payment webhook URL
  // Uses all 14 required fields so GHL can trigger the correct automation.
  const submitPaymentWebhook = async (paymentIntentId?: string | null) => {
    const firstName = leadData.firstName.trim() || answers.firstName || "";
    const lastName = ""; // LP form only collects first name
    const email = leadData.email.trim() || answers.email || "";
    const phone = leadData.phone || answers.phone || "";

    const payload = {
      event: "payment_success",
      landing_page_path: landingPage,
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
      form_submission_id: stripePaymentId ? String(stripePaymentId) : (paypalPaymentId ? String(paypalPaymentId) : ""),
      payment_amount: "50.00",
      payment_currency: "USD",
      payment_status: "succeeded",
      transaction_id: paymentIntentId || stripePaymentIntentId || "",
      payment_processor: activeProvider,
      product_name: `MedMethod Direct \u2014 $50 deposit (${landingPage.includes("glp") ? "GLP-1" : "HRT"} consultation)`,
      referral_code: referralPricing.referralCode ?? "",
      referral_credit_amount: (referralPricing.referralCreditAmount / 100).toFixed(2),
      consultation_total_amount: (referralPricing.consultationTotalAmount / 100).toFixed(2),
      deposit_amount: (referralPricing.depositAmount / 100).toFixed(2),
      remaining_balance: (referralPricing.remainingAmount / 100).toFixed(2),
      paid_at: new Date().toISOString(),
    };

    console.log("GHL payment webhook:", payload);

    try {
      const response = await fetch(GHL_PAYMENT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Payment webhook failed with status ${response.status}`);
      console.log("GHL payment webhook delivered ✓");
    } catch (error) {
      console.error("GHL payment webhook error:", error);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevStep = step - 1;
    setStep(prevStep);
    if (prevStep >= QUESTIONS_START && prevStep < ATTRIBUTION_STEP) {
      const qi = prevStep - QUESTIONS_START;
      setSelected(answers[questions[qi].id] || null);
    } else {
      setSelected(null);
    }
  };

  const handleClose = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
    setGoalsText("");
    setLeadData({ firstName: "", email: "", phone: "", zip: "", transactionalConsent: false, promotionalConsent: false });
    setSelectedServices([]);
    setAttribution(null);
    setAttributionOther("");
    setShowExitConfirm(false);
    setWebhookSubmitting(false);
    setWebhookSubmitted(false);
    setConsentAttempted(false);
    setPaymentSubmitting(false);
    setStripePaymentId(null);
    setStripePaymentIntentId(null);
    setPaypalPaymentId(null);
    setReferralPricing(STANDARD_CONSULTATION_PRICING);
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCalendarStep) { handleClose(); return; }
    setShowExitConfirm(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && handleAttemptClose()}
    >
      <div
        className="relative w-full bg-white flex flex-col overflow-hidden sm:rounded-[20px]"
        style={{
          maxWidth: isCalendarStep ? 860 : 480,
          maxHeight: "95vh",
          borderRadius: "20px 20px 0 0",
          transition: "max-width 0.4s ease",
        }}
      >
        {/* Progress bar */}
        {!isCalendarStep && (
          <div className="h-1 w-full bg-gray-100 flex-shrink-0">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: BRAND_GRADIENT }}
            />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleAttemptClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X size={16} className="text-gray-500" />
        </button>

        {/* Exit-intent confirmation overlay */}
        {showExitConfirm && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(4px)" }}
          >
            <h3
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Are you sure you want to leave?
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Your progress won't be saved. You can always come back later.
            </p>
            <button
              onClick={() => setShowExitConfirm(false)}
              className="w-full max-w-xs py-3.5 rounded-xl text-white font-semibold text-sm mb-3"
              style={{ background: BRAND_GRADIENT }}
            >
              Continue Where I Left Off
            </button>
            <button
              onClick={handleClose}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Not Today
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" ref={scrollBodyRef}>

          {/* ── Step 0: Service selection ── */}
          {isServiceStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                STEP 1 OF {TOTAL_STEPS - 1}
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                What brings you in today?
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Select one or more areas you'd like help with. This helps Dr. Al-Deek prepare for your visit.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {SERVICE_OPTIONS.map((svc) => {
                  const isActive = selectedServices.includes(svc.label);
                  return (
                    <button
                      key={svc.label}
                      onClick={() => toggleService(svc.label)}
                      className="relative flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150"
                      style={{
                        border: `2px solid ${isActive ? BRAND_PINK : "#e5e7eb"}`,
                        background: isActive ? "rgba(232,51,158,0.06)" : "#fff",
                        boxShadow: isActive ? `0 0 0 3px rgba(232,51,158,0.10)` : "none",
                      }}
                    >
                      <span className="text-xl flex-shrink-0">{svc.icon}</span>
                      <span className="flex flex-col">
                        <span
                          className="text-sm leading-tight"
                          style={{
                            color: isActive ? BRAND_PLUM : "#374151",
                            fontWeight: isActive ? 700 : 500,
                          }}
                        >
                          {svc.label}
                        </span>
                        {svc.subtitle && (
                          <span
                            className="text-xs leading-tight mt-0.5"
                            style={{ color: isActive ? BRAND_PINK : "#9ca3af", fontWeight: 500 }}
                          >
                            {svc.subtitle}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <span
                          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: BRAND_PINK }}
                        >
                          <Check size={10} color="#fff" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedServices.length > 0 && (
                <p className="text-xs text-center mt-4" style={{ color: BRAND_PINK }}>
                  {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* ── Steps 1-5: Intake questions ── */}
          {isQuestionStep && (
            <div className="px-6 pt-8 pb-2">
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {questions[questionIndex].question}
              </h2>
              <p className="text-sm text-gray-400 mb-5">{questions[questionIndex].subtitle}</p>

              {isGoalsStep ? (
                <div className="mt-2">
                  <textarea
                    value={goalsText}
                    onChange={(e) => setGoalsText(e.target.value)}
                    placeholder="e.g. I want to feel like myself again, have more energy, and finally find something that works long-term..."
                    rows={6}
                    className="w-full rounded-xl border border-gray-200 p-4 text-base text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 transition-all"
                    style={{ fontFamily: "inherit", lineHeight: 1.6, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)" }}
                    onFocus={(e) => (e.target.style.borderColor = BRAND_PINK)}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    {goalsText.trim().length === 0 ? "Optional — you can skip this step" : `${goalsText.trim().length} characters`}
                  </p>
                </div>
              ) : isAgeStep ? (
                <div className="mt-2">
                  <div
                    className="flex rounded-xl overflow-hidden"
                    style={{ background: "#fafafa", userSelect: "none" }}
                  >
                    <WheelColumn items={months} selectedIndex={monthIdx} onSelect={setMonthIdx} />
                    <WheelColumn items={days} selectedIndex={dayIdx} onSelect={setDayIdx} />
                    <WheelColumn items={years} selectedIndex={yearIdx} onSelect={setYearIdx} />
                  </div>
                  <p className="text-xs text-center mt-3" style={{ color: !dobTouched ? "#9ca3af" : computedAge >= 18 ? "#9ca3af" : BRAND_PINK }}>
                    {!dobTouched ? "Scroll to select your date of birth" : computedAge >= 18 ? `Age: ${computedAge} years old` : "Must be 18 or older to enroll"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {questions[questionIndex].options.map((option) => {
                    const isSelected = selected === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setSelected(option)}
                        className="w-full flex items-center gap-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: isSelected ? BRAND_PINK : "#d1d5db",
                            backgroundColor: isSelected ? BRAND_PINK : "transparent",
                          }}
                        >
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </span>
                        <span
                          className="text-base transition-all"
                          style={{
                            color: isSelected ? BRAND_PLUM : "#374151",
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Step 6: Attribution (optional) ── */}
          {isAttributionStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                ONE QUICK QUESTION
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                How did you find us?
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Optional — helps us serve you better.
              </p>
              <div className="flex flex-col gap-1">
                {ATTRIBUTION_OPTIONS.map((option) => {
                  const isActive = attribution === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setAttribution(isActive ? null : option)}
                      className="w-full flex items-center gap-4 py-3.5 px-1 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 rounded-lg"
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: isActive ? BRAND_PINK : "#d1d5db",
                          backgroundColor: isActive ? BRAND_PINK : "transparent",
                        }}
                      >
                        {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      <span
                        className="text-sm transition-all"
                        style={{
                          color: isActive ? BRAND_PLUM : "#374151",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
                {attribution === "Other" && (
                  <input
                    type="text"
                    value={attributionOther}
                    onChange={(e) => setAttributionOther(e.target.value)}
                    placeholder="Tell us where you heard about us"
                    autoFocus
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      borderColor: BRAND_PINK,
                      boxShadow: "0 0 0 3px rgba(232,51,158,0.12)",
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Step 7: Lead capture form ── */}
          {isLeadStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                ALMOST THERE
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Let's get your info to reserve your spot
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                We'll use this to confirm your appointment and send your personalized summary.
              </p>
              <LeadCaptureForm data={leadData} onChange={setLeadData} showConsentError={consentAttempted} />
            </div>
          )}

          {/* ── Step 8: Payment (deposit) ── */}
          {isPaymentStep && (
            <div className="px-6 pt-8 pb-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                RESERVE YOUR CONSULTATION
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Secure your appointment with a small deposit
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                We only charge a <strong>$50 deposit</strong> today to hold your spot. The remaining {remainingBalanceLabel} is due the day of your appointment — <strong>{consultationTotalLabel} total for your 1st visit</strong>. Cancel anytime with 24-hour notice for a full refund.
              </p>
              {referralCodeEnabled && (
                <ReferralCodeControl paymentId={currentPaymentId} onApplied={setReferralPricing} />
              )}
              {activeProvider === "paypal" ? (
                <PayPalPaymentForm
                  patientName={leadData.firstName.trim() || answers.firstName || "Patient"}
                  patientEmail={leadData.email.trim() || answers.email || ""}
                  patientPhone={leadData.phone || answers.phone}
                  landingPage={landingPage}
                  consultationTotalAmountCents={referralPricing.consultationTotalAmount}
                  remainingAmountCents={referralPricing.remainingAmount}
                  referralCreditAmountCents={referralPricing.referralCreditAmount}
                  onComplete={() => handlePaymentComplete(undefined)}
                  onPaymentId={(id) => setPaypalPaymentId(id)}
                  onError={(msg) => toast.error(msg)}
                />
              ) : (
                <StripePaymentForm
                  patientName={leadData.firstName.trim() || answers.firstName || "Patient"}
                  patientEmail={leadData.email.trim() || answers.email || ""}
                  patientPhone={leadData.phone || answers.phone}
                  landingPage={landingPage}
                  consultationTotalAmountCents={referralPricing.consultationTotalAmount}
                  remainingAmountCents={referralPricing.remainingAmount}
                  referralCreditAmountCents={referralPricing.referralCreditAmount}
                  onComplete={() => handlePaymentComplete(stripePaymentIntentId ?? undefined)}
                  onPaymentId={(id) => setStripePaymentId(id)}
                  onPaymentIntentId={(piId) => {
                    setStripePaymentIntentId(piId);
                    // Fire the GHL webhook immediately when we have the PaymentIntent ID
                    // (before confirmDeposit DB call completes, to minimise latency)
                    handlePaymentComplete(piId);
                  }}
                />
              )}
            </div>
          )}

          {/* ── Step 9: Calendar embed ── */}
          {isCalendarStep && (
            <div className="px-6 pt-8 pb-4">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                BOOK YOUR APPOINTMENT
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                You're all set! Pick your time.
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Your <strong>$50 deposit</strong> is confirmed. Choose a time below for your video consultation with Dr. Al-Deek.
              </p>
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                <Check size={14} className="text-green-600" />
                Remaining {remainingBalanceLabel} will be charged the day of your appointment
              </p>

              <div className="rounded-xl overflow-hidden border border-gray-100">
                <iframe
                  src={BOOKING_URL}
                  width="100%"
                  height="700"
                  frameBorder="0"
                  scrolling="yes"
                  title="Schedule your consultation"
                  style={{ border: "none", overflow: "auto", display: "block", minHeight: "500px", maxHeight: "calc(95vh - 200px)" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom sticky button — only for non-payment, non-calendar steps */}
        {!isCalendarStep && !isPaymentStep && (
          <div className="flex-shrink-0 px-6 pt-3 bg-white border-t border-gray-50" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>
            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{
                background: isNextDisabled ? BRAND_DISABLED : BRAND_GRADIENT,
                cursor: isNextDisabled ? "not-allowed" : "pointer",
                boxShadow: isNextDisabled ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
              }}
            >
              {webhookSubmitting ? "Submitting..." : isAttributionStep ? (attribution ? "Next →" : "Skip →") : "Next →"}
            </button>
            {step > 0 && (
              <button
                onClick={handleBack}
                className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Back button for payment step (no Next — PaymentForm has its own submit) */}
        {isPaymentStep && (
          <div className="flex-shrink-0 px-6 pt-2 pb-4 bg-white border-t border-gray-50">
            <button
              onClick={handleBack}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </button>
            {/* Dev-only skip button — hidden in production builds */}
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  navigate("/thank-you");
                  toast.success("[DEV] Payment skipped — going to thank-you");
                }}
                className="w-full mt-2 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                ⚡ Skip payment (test mode)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
