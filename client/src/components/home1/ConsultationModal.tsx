// ConsultationModal.tsx
// Design: Clean white mobile-style, large serif question title, thin divider radio rows,
// full-width brand-gradient "Next" button pinned at bottom.
// Step 0: Service selection (multi-select grid, can be pre-selected from service card CTAs)
// Steps 1-5: Intake questions
// Step 6: Lead capture form
// Step 7: Expectation screen
// Step 8: Calendly embed
// Replace CALENDLY_URL with your actual Calendly link.

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";

const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Qxw3vN2dmBw9LSUQag8J";
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/66201c6d-9b98-4fac-9725-e44c0415f8e7";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const SERVICE_OPTIONS = [
  { label: "Weight Loss", subtitle: "GLP-1 / Semaglutide · Tirzepatide", icon: "🔥" },
  { label: "Hormone Therapy", subtitle: "", icon: "🧬" },
  { label: "Menopause", subtitle: "", icon: "🌸" },
  { label: "Sexual Health", subtitle: "", icon: "💗" },
  { label: "Hair Care", subtitle: "", icon: "💇‍♀️" },
  { label: "Gut Health", subtitle: "", icon: "🥗" },
  { label: "Skincare", subtitle: "", icon: "✨" },
  { label: "Longevity & Aging", subtitle: "", icon: "⏳" },
  { label: "Vitamins & Supplements", subtitle: "", icon: "💊" },
  { label: "Personal Training", subtitle: "", icon: "🏋️‍♀️" },
  { label: "Virtual Primary Care", subtitle: "", icon: "🩺" },
  { label: "Virtual Urgent Care", subtitle: "", icon: "⚡" },
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
      "Yes, but didn't get results",
      "Yes, results didn't last",
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
    subtitle: "Optional — helps your Care Coordinator prepare for your call",
    options: [], // free-text textarea (optional)
  },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BRAND_DISABLED = "#f0abcf";
const ITEM_H = 44;

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
            onPointerUp={() => { /* bubble to parent */ }}
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

const ATTRIBUTION_OPTIONS = [
  "Social media",
  "Google search",
  "Friend or family referral",
  "Dr. Al-Deek's book",
  "Podcast",
  "Other",
];

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
        {/* Checkbox 1: Transactional (required) */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", minHeight: 44 }}>
          <input
            type="checkbox"
            checked={data.transactionalConsent}
            onChange={(e) => onChange({ ...data, transactionalConsent: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: BRAND_PINK, cursor: "pointer" }}
          />
          <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.6 }}>
            I consent to receive non-marketing messages about appointment confirmations, reminders, scheduling updates, inquiry responses, and patient care communications from MedMethod Direct. Message frequency varies, up to 8 messages per month. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.
            <span style={{ color: BRAND_PINK, marginLeft: 4, fontWeight: 600 }}>*</span>
          </span>
        </label>

        {showConsentError && !data.transactionalConsent && (
          <p style={{ fontSize: 12, color: "#ef4444", margin: "-4px 0 0 28px", lineHeight: 1.4 }}>
            Please consent to transactional messages to continue.
          </p>
        )}

        {/* Checkbox 2: Promotional (optional) */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", minHeight: 44 }}>
          <input
            type="checkbox"
            checked={data.promotionalConsent}
            onChange={(e) => onChange({ ...data, promotionalConsent: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: BRAND_PINK, cursor: "pointer" }}
          />
          <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.6 }}>
            I consent to receive promotional messages about wellness tips, program updates, new services, educational health content, and special offers from MedMethod Direct at the phone number provided. Message frequency varies, up to 4 messages per month. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.
          </span>
        </label>

        {/* Privacy Policy · Terms of Service footer */}
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4, textAlign: "center" }}>
          <a href="/privacy-policy" style={{ color: BRAND_PINK, textDecoration: "underline" }}>Privacy Policy</a>
          {" · "}
          <a href="/terms" style={{ color: BRAND_PINK, textDecoration: "underline" }}>Terms of Service</a>
        </p>
      </div>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 12, padding: "12px 14px",
        background: "rgba(232,51,158,0.05)", border: "1px solid rgba(232,51,158,0.15)", marginTop: 4,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
          We respect your privacy. No spam, ever. Your information is used only to prepare for your
          consultation and will never be sold or shared with third parties.
        </p>
      </div>
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────
export default function ConsultationModal({ open, onClose, preselectedService }: Props) {
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
  const [schedulingPolicyAgreed, setSchedulingPolicyAgreed] = useState(false);

  const currentYear = new Date().getFullYear();
  const months = useMemo(() => ["January","February","March","April","May","June","July","August","September","October","November","December"], []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")), []);
  const years = useMemo(() => Array.from({ length: currentYear - 1919 }, (_, i) => String(currentYear - i)).filter(y => parseInt(y) <= currentYear - 18), [currentYear]);

  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(new Date().getDate() - 1);
  const [yearIdx, setYearIdx] = useState(30);

  // Track initial DOB indices so we only enable Next when user actually changes a value
  const initialMonthIdx = useRef(new Date().getMonth());
  const initialDayIdx = useRef(new Date().getDate() - 1);
  const initialYearIdx = useRef(30);
  const dobTouched = monthIdx !== initialMonthIdx.current || dayIdx !== initialDayIdx.current || yearIdx !== initialYearIdx.current;

  // Pre-select service when modal opens with a specific service
  useEffect(() => {
    if (open && preselectedService) {
      setSelectedServices([preselectedService]);
    }
  }, [open, preselectedService]);

  const computedAge = useMemo(() => {
    const dob = new Date(parseInt(years[yearIdx]), monthIdx, parseInt(days[dayIdx]));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    return age;
  }, [monthIdx, dayIdx, yearIdx, months, days, years]);

  if (!open) return null;

  // Step layout:
  // 0    = service selection (new)
  // 1-5  = questions (goal, duration, tried, age, goals)
  // 6    = lead capture form
  // 7    = attribution (optional)
  // 8    = expectation screen
  // 9    = calendar embed
  const SERVICE_STEP = 0;
  const QUESTIONS_START = 1;
  const LEAD_STEP = QUESTIONS_START + questions.length;      // 6
  const ATTRIBUTION_STEP = LEAD_STEP + 1;                    // 7
  const EXPECTATION_STEP = ATTRIBUTION_STEP + 1;             // 8
  const CALENDAR_STEP = EXPECTATION_STEP + 1;                // 9
  const TOTAL_STEPS = CALENDAR_STEP + 1;                     // 10

  // "Virtual Urgent Care" skip logic: if only "Virtual Urgent Care" is selected, skip qualifying Qs (goal, duration, tried)
  const isNotSureOnly = selectedServices.length === 1 && selectedServices[0] === "Virtual Urgent Care";

  const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  const isServiceStep = step === SERVICE_STEP;
  const isQuestionStep = step >= QUESTIONS_START && step < LEAD_STEP;
  const questionIndex = step - QUESTIONS_START; // 0-based index into questions[]
  const isAgeStep = isQuestionStep && questions[questionIndex]?.id === "age";
  const isGoalsStep = isQuestionStep && questions[questionIndex]?.id === "goals";
  const isLeadStep = step === LEAD_STEP;
  const isAttributionStep = step === ATTRIBUTION_STEP;
  const isExpectationStep = step === EXPECTATION_STEP;
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
      : isLeadStep ? !isLeadValid
      : isAttributionStep ? false
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
      // If "Virtual Urgent Care" only, skip goal/duration/tried (first 3 Qs) → jump to age (index 3)
      if (isNotSureOnly) {
        setStep(QUESTIONS_START + 3); // age step
      } else {
        setStep((s) => s + 1);
      }
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
        // Goals step is now optional — allow skipping
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
      setStep((s) => s + 1);
    } else if (isAttributionStep) {
      if (attribution) {
        const attrValue = attribution === "Other" && attributionOther.trim()
          ? `Other: ${attributionOther.trim()}`
          : attribution;
        setAnswers((prev) => ({ ...prev, attribution: attrValue }));
      }
      // Fire the GHL webhook when they press Next on the attribution step
      await submitToWebhook();
    } else if (isExpectationStep) {
      // Advance to calendar (webhook already fired on attribution step)
      setStep((s) => s + 1);
    }
  };

  const submitToWebhook = async () => {
    if (webhookSubmitting || webhookSubmitted) {
      setStep((s) => s + 1);
      return;
    }

    const payload = {
      services_selected: answers.services || selectedServices.join(", ") || "",
      primary_goal: answers.goal || "",
      time_on_mind: answers.duration || "",
      previous_treatments: answers.tried || "",
      date_of_birth: answers.age || "",
      desired_change: answers.goals || goalsText.trim() || "",
      how_did_you_find_us: attribution && attribution !== "Other" ? attribution : (attribution === "Other" ? "Other" : ""),
      how_did_you_find_us_other: attribution === "Other" ? attributionOther.trim() : "",
      first_name: leadData.firstName.trim() || answers.firstName || "",
      email: leadData.email.trim() || answers.email || "",
      phone: leadData.phone || answers.phone || "",
      zip_code: leadData.zip || answers.zip || "",
      source: "Manus Website",
      form_name: "New Website Intake Form",
    };

    console.log("GHL webhook payload:", payload);

    setWebhookSubmitting(true);
    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      setWebhookSubmitted(true);
      setStep((s) => s + 1);
    } catch (error) {
      console.error("GHL webhook error:", error);
      toast.error("Something went wrong submitting your information. Please try again.");
    } finally {
      setWebhookSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    // If on age step and "Virtual Urgent Care" only, go back to service selection
    if (isQuestionStep && questions[questionIndex]?.id === "age" && isNotSureOnly) {
      setStep(SERVICE_STEP);
      setSelected(null);
      return;
    }
    const prevStep = step - 1;
    setStep(prevStep);
    if (prevStep >= QUESTIONS_START && prevStep < LEAD_STEP) {
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
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCalendarStep) { handleClose(); return; }
    setShowExitConfirm(true);
  };

  // Booking widget URL (SendMeAPro)
  const bookingWidgetUrl = BOOKING_URL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && handleAttemptClose()}
    >
      <div
        className="relative w-full bg-white flex flex-col overflow-hidden"
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
            className="absolute inset-0 z-20 flex items-center justify-center p-6"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(4px)", borderRadius: "inherit" }}
          >
            <div className="flex flex-col items-center text-center max-w-xs">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(232,51,158,0.12) 0%, rgba(122,30,126,0.12) 100%)", border: "1.5px solid rgba(232,51,158,0.25)" }}
              >
                <span style={{ fontSize: 26 }}>💗</span>
              </div>
              <h3
                className="text-xl font-bold mb-3 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1f2937" }}
              >
                Before you go...
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#6b7280" }}>
                It's easy to click out, and difficult to show up. But this time it's for you.
              </p>
              <p className="text-sm font-bold tracking-wide uppercase mb-6" style={{ color: BRAND_PINK }}>
                No Pressure · Just Answers
              </p>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3.5 rounded-full text-sm font-bold tracking-wider text-white mb-3 transition-all hover:opacity-90"
                style={{ background: BRAND_GRADIENT, boxShadow: "0 6px 20px rgba(232,51,158,0.35)" }}
              >
                I'm Doing This For Me →
              </button>
              <button
                onClick={handleClose}
                className="text-sm font-medium transition-colors hover:text-gray-700"
                style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
              >
                Not Today
              </button>
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

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
                Select one or more services you'd like to learn about. Your advisor will be prepared before your call.
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
                  <p className="text-xs text-gray-300 mt-1">
                    Please don’t include specific diagnoses or medication names — we’ll cover that on your call.
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

          {/* ── Step 6: Lead capture form ── */}
          {isLeadStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                ALMOST THERE
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Last step before scheduling your discovery call
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                We'll use this to confirm your appointment and send your personalized summary.
              </p>
              <LeadCaptureForm data={leadData} onChange={setLeadData} showConsentError={consentAttempted} />
            </div>
          )}

          {/* ── Step 7: Attribution (optional) ── */}
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
                {/* Text input when "Other" is selected */}
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

          {/* ── Step 8: Expectation screen ── */}
          {isExpectationStep && (
            <div className="px-6 pt-6 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: BRAND_PINK }}>
                YOUR DISCOVERY CALL
              </p>
              <h2
                className="text-xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                What to expect on your call
              </h2>
              <p className="text-[13px] font-semibold mb-2" style={{ color: BRAND_PLUM }}>
                Free · 15 min · No obligation · No medical advice provided
              </p>
              <p className="text-[13px] italic mb-3" style={{ color: BRAND_PLUM }}>
                You'll speak with a Care Coordinator who works directly with Dr. Al-Deek.
              </p>
              {answers["services"] && (
                <div
                  className="mb-3 px-3 py-2 rounded-lg text-[13px]"
                  style={{ background: "rgba(232,51,158,0.06)", border: "1px solid rgba(232,51,158,0.2)" }}
                >
                  <span className="font-semibold" style={{ color: BRAND_PLUM }}>Your interest: </span>
                  <span style={{ color: "#374151" }}>{answers["services"]}</span>
                </div>
              )}
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mb-2">On your call, we'll cover:</p>
              <div className="divide-y divide-gray-100">
                {[
                  { title: "What membership includes", desc: "Programs, pricing, and what's right for you." },
                  { title: "How Dr. Al-Deek's approach is different", desc: "Physician-led, personalized care vs. one-size-fits-all prescription mills." },
                  { title: "Determine if we're a good fit", desc: "We'll ask the right questions to see if MedMethod is the right partner for your goals." },
                  { title: "What happens next?", desc: "If you decide to move forward, you'll be connected directly with Dr. Al-Deek for your personalized care plan." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 py-2.5">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" strokeWidth={3} style={{ color: BRAND_PLUM }} />
                    <div>
                      <p className="font-semibold text-gray-900 text-[13px] leading-tight">{item.title}</p>
                      <p className="text-[12px] text-gray-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ── Step 9: Calendar embed ── */}
          {isCalendarStep && (
            <div className="px-6 pt-8 pb-4">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                BOOK YOUR SPOT
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Choose a time that works for you
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Pick a 15-minute slot with a MedMethod Care Coordinator.
              </p>


              {/* No-Show Warning */}
              <div className="rounded-xl p-4 mb-5" style={{ background: "#FFF7ED", border: "1px solid #FDBA74" }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Scheduling Policy</p>
                    <p className="text-sm text-gray-700" style={{ lineHeight: 1.6 }}>
                      If you book and do not attend without 24-hour notice, your account may be restricted from future scheduling. We keep our availability limited to serve each patient personally — a missed slot means another woman waits longer for care.
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer pt-3" style={{ borderTop: "1px solid #FDBA74" }}>
                  <span
                    onClick={() => setSchedulingPolicyAgreed(!schedulingPolicyAgreed)}
                    className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{
                      border: schedulingPolicyAgreed ? "none" : "2px solid #9ca3af",
                      background: schedulingPolicyAgreed ? BRAND_PINK : "transparent",
                    }}
                  >
                    {schedulingPolicyAgreed && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-sm font-semibold text-gray-800" onClick={() => setSchedulingPolicyAgreed(!schedulingPolicyAgreed)}>
                    I agree to attend my scheduled appointment or provide 24-hour notice to reschedule.
                  </span>
                </label>
              </div>

              {schedulingPolicyAgreed ? (
              <div className="rounded-xl overflow-hidden border border-gray-100">
<iframe
                   src="https://link.sendmeapro.com/widget/booking/Qxw3vN2dmBw9LSUQag8J"
                   width="100%"
                   height="800"
                   frameBorder="0"
                   scrolling="yes"
                  id="Qxw3vN2dmBw9LSUQag8J_1780696816287"
                  title="Schedule your free consultation"
                  style={{ border: "none", overflow: "auto", display: "block" }}
                />
              </div>
              ) : (
              <div className="rounded-xl p-6 text-center" style={{ background: "#f9fafb", border: "1px dashed #d1d5db" }}>
                <p className="text-sm text-gray-500">Please agree to the scheduling policy above to view available times.</p>
              </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom sticky button */}
        {!isCalendarStep && (
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
              {webhookSubmitting ? "Submitting..." : isExpectationStep ? "Choose a Time →" : isAttributionStep ? (attribution ? "Next →" : "Skip →") : "Next →"}
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
      </div>
    </div>
  );
}
