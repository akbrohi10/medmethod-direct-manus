/*
 * LpWL2.tsx — /lp/WL2
 * GLP-1 Weight Loss landing page — conversion-focused
 * $15 fully refundable booking fee · 15-min virtual visit with Dr. Al-Deek
 */
import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { X, Check, ChevronDown, Upload } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import WL2PayPalPaymentForm from "@/components/home1/WL2PayPalPaymentForm";
import WL2StripePaymentForm from "@/components/home1/WL2StripePaymentForm";
import { clearWl2PaymentResume, getWl2PaymentResume, getWl2ThreeDsPaymentIntent, saveWl2PaymentResume } from "@/lib/wl2PaymentResume";
import { isPreviewEnvironment } from "@/lib/isPreviewEnvironment";
import { getWl2FirstMissingField, getWl2IntakeNextButtonState, isWl2IntakeComplete, WL2_FIELD_LABELS, WL2_SCROLL_AFFORDANCE_LABEL, type Wl2MissingField } from "@/lib/wl2IntakeValidation";
import { handoffWl2PostPayment, WL2_PREVIEW_PAYMENT_SKIP_PATH } from "@/lib/wl2PostPayment";
import { formatWl2DateOfBirthInput, toWl2IsoDateOfBirth } from "@/lib/wl2DateOfBirth";

// ─── Constants ───────────────────────────────────────────────────────────────

const GHL_PAYMENT_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093";

const DR_PHOTO = "/manus-storage/wl2-dr-aldeek-hero_8cc8a264.webp";
const LOGO = "/manus-storage/wl2-medmethod-logo_7ec29944.webp";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BRAND_DISABLED = "#f0abcf";

const WL2_FIELD_ANCHORS: Record<Wl2MissingField, string> = {
  heightFt: "wl2-field-height",
  heightIn: "wl2-field-height",
  weight: "wl2-field-height",
  dateOfBirth: "wl2-field-dob",
  sex: "wl2-field-dob",
  weightGoal: "wl2-field-weight-goal",
  weightDuration: "wl2-field-weight-duration",
  glp1Before: "wl2-field-glp1-history",
  glp1Details: "wl2-field-glp1-history",
  conditions: "wl2-field-conditions",
  medications: "wl2-field-medications",
  hasLabs: "wl2-field-labs",
  primaryGoal: "wl2-field-primary-goal",
  activityLevel: "wl2-field-activity-level",
};

// ─── Intake Modal ─────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function WL2Modal({ open, onClose }: ModalProps) {
  type Step = "intake" | "lead" | "payment";
  const [step, setStep] = useState<Step>("intake");

  // Intake form state
  const [weightGoal, setWeightGoal] = useState("");
  const [weightDuration, setWeightDuration] = useState("");
  const [glp1Before, setGlp1Before] = useState<"yes" | "no" | "">("");
  const [glp1Details, setGlp1Details] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState("");
  const [hasLabs, setHasLabs] = useState<"yes" | "no" | "">("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");

  // Lead capture state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [resumingStripePayment, setResumingStripePayment] = useState(false);
  const [intakeScrolledToEnd, setIntakeScrolledToEnd] = useState(false);
  const [missingField, setMissingField] = useState<Wl2MissingField | null>(null);
  const resumeHandled = useRef(false);
  const intakeScrollRef = useRef<HTMLDivElement>(null);
  const showPreviewPaymentSkip = isPreviewEnvironment(window.location.hostname);

  // Payment state
  const activeProviderQuery = trpc.paypal.getPublicClientId.useQuery();
  const activeProvider = activeProviderQuery.data?.activeProvider ?? "stripe";
  const submitWl2Intake = trpc.wl2Intake.submit.useMutation();

  useEffect(() => {
    if (!open) {
      setStep("intake");
      setWeightGoal(""); setWeightDuration(""); setGlp1Before(""); setGlp1Details("");
      setConditions([]); setMedications(""); setHasLabs(""); setPrimaryGoal("");
      setActivityLevel(""); setHeightFt(""); setHeightIn(""); setWeight(""); setDateOfBirth(""); setSex("");
      setFirstName(""); setEmail(""); setPhone(""); setZipCode("");
      setIntakeScrolledToEnd(false);
      setMissingField(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || step !== "intake") return;
    const frame = requestAnimationFrame(() => {
      const container = intakeScrollRef.current;
      if (container) setIntakeScrolledToEnd(container.scrollHeight <= container.clientHeight + 16);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, step]);

  const handleOneTimePaymentComplete = (paymentId: number, transactionId: string, processor = activeProvider) => {
    // The $15 WL2 hold is fully paid at capture. No $149 charge is created or scheduled.
    clearWl2PaymentResume();
    setResumingStripePayment(false);
    if (window.location.search.includes("wl2_3ds")) {
      window.history.replaceState({}, "", "/lp/WL2");
    }
    handoffWl2PostPayment({
      fetchImpl: fetch,
      navigate: (path) => window.location.assign(path),
      webhookUrl: GHL_PAYMENT_WEBHOOK_URL,
      payload: {
        first_name: firstName,
        email,
        phone,
        payment_id: paymentId,
        transaction_id: transactionId,
        payment_processor: processor,
        landing_page: "/lp/WL2",
        amount: 15,
        remaining_amount: 0,
        payment_status: "fully_paid",
        payment_type: "one_time_refundable_hold",
      },
    });
  };

  const confirmThreeDsReturn = trpc.stripe.confirmWl2OneTimePayment.useMutation({
    onSuccess: (_, variables) => handleOneTimePaymentComplete(variables.paymentId, variables.paymentIntentId, "stripe"),
    onError: (error) => {
      setResumingStripePayment(false);
      toast.error(`Payment confirmation failed: ${error.message}`);
      clearWl2PaymentResume();
    },
  });

  useEffect(() => {
    if (!open || resumeHandled.current) return;
    const paymentIntentId = getWl2ThreeDsPaymentIntent(window.location.search);
    if (!paymentIntentId) return;

    const resume = getWl2PaymentResume();
    if (!resume) return;
    resumeHandled.current = true;
    setFirstName(resume.firstName);
    setEmail(resume.email);
    setPhone(resume.phone);
    setStep("payment");
    setResumingStripePayment(true);
    confirmThreeDsReturn.mutate({ paymentId: resume.paymentId, paymentIntentId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleCondition = (c: string) => {
    setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const intakeAnswers = {
    weightGoal,
    weightDuration,
    glp1Before,
    glp1Details,
    conditions,
    medications,
    hasLabs,
    primaryGoal,
    activityLevel,
    heightFt,
    heightIn,
    weight,
    dateOfBirth,
    sex,
  };
  const intakeValid = isWl2IntakeComplete(intakeAnswers);
  const intakeNextButton = getWl2IntakeNextButtonState(intakeAnswers);
  const firstMissingField = getWl2FirstMissingField(intakeAnswers);

  useEffect(() => {
    if (missingField && firstMissingField !== missingField) setMissingField(null);
  }, [missingField, firstMissingField]);

  const leadValid = firstName.trim() !== "" && email.includes("@") && phone.trim().length >= 7 && zipCode.trim() !== "";

  const handleIntakeNext = () => {
    const missing = getWl2FirstMissingField(intakeAnswers);
    if (!missing) {
      setStep("lead");
      return;
    }
    setMissingField(missing);
    requestAnimationFrame(() => {
      document.getElementById(WL2_FIELD_ANCHORS[missing])?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const isMissing = (...fields: Wl2MissingField[]) => missingField !== null && fields.includes(missingField);

  const handleLeadSubmit = () => {
    if (glp1Before !== "yes" && glp1Before !== "no") return;

    // Submit intake in the background. A temporary GHL outage must not prevent checkout.
    submitWl2Intake.mutate({
      first_name: firstName,
      email,
      phone,
      zip_code: zipCode,
      weight_goal: weightGoal,
      weight_duration: weightDuration,
      glp1_before: glp1Before,
      glp1_details: glp1Details,
      conditions: conditions.join(", "),
      medications,
      has_labs: hasLabs,
      primary_goal: primaryGoal,
      activity_level: activityLevel,
      height: `${heightFt}'${heightIn}"`,
      weight_lbs: weight,
      date_of_birth: toWl2IsoDateOfBirth(dateOfBirth)!,
      sex,
      landing_page: "/lp/WL2",
    });
    setStep("payment");
  };

  const STEP_LABELS: Record<Step, string> = {
    intake: "About You",
    lead: "Your Info",
    payment: "Reserve ($15)",
  };
  const STEPS: Step[] = ["intake", "lead", "payment"];
  const stepIdx = STEPS.indexOf(step);
  const progressPct = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  if (!open) return null;

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh", fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: BRAND_PINK }}>
              GLP-1 WEIGHT LOSS ASSESSMENT
            </p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: BRAND_GRADIENT }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {STEPS.map((s, i) => (
              <span key={s} className="text-[10px]" style={{ color: i <= stepIdx ? BRAND_PINK : "#9ca3af" }}>
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div
          ref={intakeScrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={(event) => {
            if (step !== "intake") return;
            const target = event.currentTarget;
            setIntakeScrolledToEnd(target.scrollTop + target.clientHeight >= target.scrollHeight - 16);
          }}
        >
          {step === "intake" && !intakeScrolledToEnd && (
            <button
              type="button"
              aria-label={WL2_SCROLL_AFFORDANCE_LABEL}
              onClick={() => intakeScrollRef.current?.scrollBy({ top: Math.max(320, intakeScrollRef.current.clientHeight * 0.72), behavior: "smooth" })}
              className="sticky top-3 z-10 ml-auto mr-4 mt-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-300 bg-white shadow-lg animate-bounce transition-transform hover:scale-105"
              style={{ color: BRAND_PLUM }}
            >
              <ChevronDown size={28} strokeWidth={3} />
            </button>
          )}

          {/* ── STEP 1: Intake form ── */}
          {step === "intake" && (
            <div className="px-6 py-6 flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                  Tell us about yourself
                </h2>
                <p className="text-sm text-gray-500">Dr. Al-Deek reviews this before your call so you can make the most of your 15 minutes.</p>
              </div>

              {/* Height & Weight */}
              <div id="wl2-field-height" className={`grid grid-cols-3 gap-3 rounded-xl transition-shadow ${isMissing("heightFt", "heightIn", "weight") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <div className="col-span-1">
                  <label className={labelCls}>Height (ft)</label>
                  <input className={inputCls} placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} type="number" min="3" max="8" />
                </div>
                <div className="col-span-1">
                  <label className={labelCls}>Height (in)</label>
                  <input className={inputCls} placeholder="6" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} type="number" min="0" max="11" />
                </div>
                <div className="col-span-1">
                  <label className={labelCls}>Weight (lbs)</label>
                  <input className={inputCls} placeholder="180" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" />
                </div>
              </div>

              {/* Date of Birth & Sex */}
              <div id="wl2-field-dob" className={`grid grid-cols-2 gap-3 rounded-xl transition-shadow ${isMissing("dateOfBirth", "sex") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input
                    className={inputCls}
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(formatWl2DateOfBirthInput(e.target.value))}
                    type="text"
                    inputMode="numeric"
                    autoComplete="bday"
                    placeholder="MM/DD/YYYY"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className={labelCls}>Sex assigned at birth</label>
                  <div className="flex gap-2 mt-1">
                    {["Female", "Male"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSex(s)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                        style={{
                          borderColor: sex === s ? BRAND_PINK : "#e5e7eb",
                          background: sex === s ? "rgba(232,51,158,0.06)" : "white",
                          color: sex === s ? BRAND_PLUM : "#6b7280",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight loss goal */}
              <div id="wl2-field-weight-goal" className={`rounded-xl transition-shadow ${isMissing("weightGoal") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>How much weight are you looking to lose?</label>
                <div className="grid grid-cols-2 gap-2">
                  {["10–20 lbs", "21–40 lbs", "41–60 lbs", "60+ lbs"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWeightGoal(opt)}
                      className="py-3 rounded-xl text-sm font-semibold border transition-all"
                      style={{
                        borderColor: weightGoal === opt ? BRAND_PINK : "#e5e7eb",
                        background: weightGoal === opt ? "rgba(232,51,158,0.06)" : "white",
                        color: weightGoal === opt ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* How long */}
              <div id="wl2-field-weight-duration" className={`rounded-xl transition-shadow ${isMissing("weightDuration") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>How long have you struggled with weight?</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Less than 1 year", "1–3 years", "3–5 years", "5+ years"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWeightDuration(opt)}
                      className="py-3 rounded-xl text-sm font-semibold border transition-all"
                      style={{
                        borderColor: weightDuration === opt ? BRAND_PINK : "#e5e7eb",
                        background: weightDuration === opt ? "rgba(232,51,158,0.06)" : "white",
                        color: weightDuration === opt ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* GLP-1 before */}
              <div id="wl2-field-glp1-history" className={`rounded-xl transition-shadow ${isMissing("glp1Before", "glp1Details") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Have you taken semaglutide or tirzepatide before?</label>
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGlp1Before(v)}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all capitalize"
                      style={{
                        borderColor: glp1Before === v ? BRAND_PINK : "#e5e7eb",
                        background: glp1Before === v ? "rgba(232,51,158,0.06)" : "white",
                        color: glp1Before === v ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
                {glp1Before === "yes" && (
                  <textarea
                    className={`${inputCls} mt-2`}
                    rows={2}
                    placeholder="Which medication, what dose, and why did you stop?"
                    value={glp1Details}
                    onChange={(e) => setGlp1Details(e.target.value)}
                  />
                )}
              </div>

              {/* Medical conditions */}
              <div id="wl2-field-conditions" className={`rounded-xl transition-shadow ${isMissing("conditions") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Do you have any of the following? (select all that apply)</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Type 2 diabetes", "History of thyroid cancer", "Pancreatitis", "Kidney disease", "Heart disease", "None of the above"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all"
                      style={{
                        borderColor: conditions.includes(c) ? BRAND_PINK : "#e5e7eb",
                        background: conditions.includes(c) ? "rgba(232,51,158,0.06)" : "white",
                        color: conditions.includes(c) ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border"
                        style={{
                          borderColor: conditions.includes(c) ? BRAND_PINK : "#d1d5db",
                          background: conditions.includes(c) ? BRAND_PINK : "white",
                        }}
                      >
                        {conditions.includes(c) && <Check size={10} className="text-white" />}
                      </div>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current medications */}
              <div id="wl2-field-medications" className={`rounded-xl transition-shadow ${isMissing("medications") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Current medications & supplements</label>
                <textarea
                  className={inputCls}
                  rows={2}
                  placeholder="List any medications or supplements you currently take (or type 'none')"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
              </div>

              {/* Labs */}
              <div id="wl2-field-labs" className={`rounded-xl transition-shadow ${isMissing("hasLabs") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Do you have labs from the past 6–12 months?</label>
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setHasLabs(v)}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                      style={{
                        borderColor: hasLabs === v ? BRAND_PINK : "#e5e7eb",
                        background: hasLabs === v ? "rgba(232,51,158,0.06)" : "white",
                        color: hasLabs === v ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {v === "yes" ? "Yes, I have labs" : "No labs available"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary goal */}
              <div id="wl2-field-primary-goal" className={`rounded-xl transition-shadow ${isMissing("primaryGoal") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Primary goal</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Weight loss", "Blood sugar control", "Both weight loss & blood sugar"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPrimaryGoal(opt)}
                      className="py-3 px-4 rounded-xl text-sm font-semibold border text-left transition-all"
                      style={{
                        borderColor: primaryGoal === opt ? BRAND_PINK : "#e5e7eb",
                        background: primaryGoal === opt ? "rgba(232,51,158,0.06)" : "white",
                        color: primaryGoal === opt ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity level */}
              <div id="wl2-field-activity-level" className={`rounded-xl transition-shadow ${isMissing("activityLevel") ? "ring-2 ring-pink-300 p-2" : ""}`}>
                <label className={labelCls}>Activity level</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Sedentary", "Lightly active", "Moderately active", "Very active"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setActivityLevel(opt)}
                      className="py-3 rounded-xl text-sm font-semibold border transition-all"
                      style={{
                        borderColor: activityLevel === opt ? BRAND_PINK : "#e5e7eb",
                        background: activityLevel === opt ? "rgba(232,51,158,0.06)" : "white",
                        color: activityLevel === opt ? BRAND_PLUM : "#6b7280",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Lead capture ── */}
          {step === "lead" && (
            <div className="px-6 py-6 flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                  Almost there
                </h2>
                <p className="text-sm text-gray-500">We'll use this to confirm your appointment and send you pre-call instructions.</p>
              </div>
              <div>
                <label className={labelCls}>First name</label>
                <input className={inputCls} placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                <input className={inputCls} type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Phone number</label>
                <input className={inputCls} type="tel" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>ZIP Code</label>
                <input className={inputCls} type="text" inputMode="numeric" maxLength={10} placeholder="12345" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </div>
            </div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === "payment" && (
            <div className="px-6 py-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                RESERVE YOUR APPOINTMENT
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-1 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Secure your spot with a $15 hold
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Attend your appointment and your $15 is refunded — even if you decide not to move forward.
              </p>
              {activeProviderQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }} />
                  <p className="text-sm text-gray-500">Preparing secure $15 payment...</p>
                </div>
              ) : resumingStripePayment ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: BRAND_PINK, borderTopColor: "transparent" }} />
                  <p className="text-sm text-gray-500">Confirming your payment and opening booking…</p>
                </div>
              ) : activeProvider === "paypal" && !activeProviderQuery.data?.clientId ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700">
                  PayPal is not configured. Please contact the clinic to complete your booking.
                </div>
              ) : activeProvider === "paypal" ? (
                <WL2PayPalPaymentForm
                  clientId={activeProviderQuery.data!.clientId!}
                  mode={activeProviderQuery.data?.mode ?? "sandbox"}
                  patientName={firstName}
                  patientEmail={email}
                  patientPhone={phone}
                  onComplete={handleOneTimePaymentComplete}
                  onError={(msg) => toast.error(msg)}
                />
              ) : (
                <WL2StripePaymentForm
                  patientName={firstName}
                  patientEmail={email}
                  patientPhone={phone}
                  onComplete={handleOneTimePaymentComplete}
                  onThreeDsRedirect={(paymentId) => saveWl2PaymentResume({ paymentId, firstName, email, phone })}
                />
              )}
              {showPreviewPaymentSkip && !resumingStripePayment && (
                <div className="mt-5 pt-4 border-t border-dashed border-gray-200 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Preview mode only</p>
                  <button
                    type="button"
                    onClick={() => window.location.assign(WL2_PREVIEW_PAYMENT_SKIP_PATH)}
                    className="text-sm font-semibold text-[#7A1E7E] underline underline-offset-4 hover:text-[#E8339E] transition-colors"
                  >
                    Skip payment and preview thank-you page →
                  </button>
                  <p className="text-xs text-gray-500 mt-1">No payment is created or charged in this preview shortcut.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer button */}
        {step !== "payment" && (
          <div className="flex-shrink-0 px-6 pt-3 pb-6 bg-white border-t border-gray-50">
            {step === "intake" && missingField && (
              <p role="alert" className="mb-2 rounded-lg bg-pink-50 px-3 py-2 text-center text-xs font-semibold" style={{ color: BRAND_PLUM }}>
                Please complete {WL2_FIELD_LABELS[missingField]} to continue.
              </p>
            )}
            <button
              onClick={() => {
                if (step === "intake") handleIntakeNext();
                else if (step === "lead") handleLeadSubmit();
              }}
              disabled={step === "lead" && !leadValid}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{
                background: (step === "lead" && !leadValid) ? BRAND_DISABLED : BRAND_GRADIENT,
                cursor: (step === "lead" && !leadValid) ? "not-allowed" : "pointer",
                boxShadow: (step === "lead" && !leadValid) ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
              }}
            >
              {step === "lead" ? "Continue to Payment →" : intakeNextButton.label}
            </button>
            {step !== "intake" && (
              <button
                onClick={() => setStep(step === "lead" ? "intake" : "lead")}
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LpWL2() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("wl2_3ds") === "1") {
      setModalOpen(true);
    }
  }, []);

  const OG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Is GLP-1 Right for You? | MedMethod Direct</title>
        <meta name="description" content="Book a 15-minute virtual visit with Dr. Al-Deek to find out if GLP-1 is right for you. Fully refundable $15 hold." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Is GLP-1 Right for You? | MedMethod Direct" />
        <meta property="og:description" content="Book a 15-minute virtual visit with Dr. Al-Deek to find out if GLP-1 is right for you." />
        <meta property="og:image" content={OG_IMAGE} />
        <link rel="preload" as="image" href={DR_PHOTO} type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href={LOGO} type="image/webp" fetchPriority="high" />
      </Helmet>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/">
            <img src={LOGO} alt="MedMethod Direct" width="240" height="80" fetchPriority="high" decoding="async" className="h-10 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-3">
            <a href="tel:+18883627011" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              (888) 362-7011
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="text-white font-semibold text-sm px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: BRAND_GRADIENT }}
            >
              Book My Appt.
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-gray-900">Medical Weight Loss.</span>
              <br />
              <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Done Right.</span>
            </h1>
            <div className="flex items-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{ borderColor: "rgba(232,51,158,0.35)", color: BRAND_PLUM, background: "rgba(232,51,158,0.06)" }}
              >
                100% Virtual
              </span>
            </div>
            <p className="text-base text-gray-700 mb-7 leading-relaxed">
              Talk one-on-one with Dr. Al-Deek to find out which weight-loss approach may be right for you.
            </p>

            {/* $15 refund — inline, no box */}
            <div className="mb-8">
              <p className="text-base font-semibold text-gray-800 mb-1">
                $15 reserves your visit ·{" "}
                <span style={{ color: BRAND_PLUM }}>Show up → Get your $15 back</span>
              </p>
              <p className="text-sm text-gray-600 italic">Even if you decide not to continue.</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90"
              style={{ background: BRAND_GRADIENT, boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
            >
              Book My Visit →
            </button>
          </div>

          {/* Right: Dr. Al-Deek photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex flex-col items-center lg:items-end">
              <img
                src={DR_PHOTO}
                alt="Dr. Jumana Al-Deek, DO"
                width="960"
                height="1280"
                fetchPriority="high"
                decoding="async"
                className="w-72 sm:w-80 lg:w-96 rounded-2xl object-cover shadow-xl"
                style={{ aspectRatio: "3/4", objectPosition: "top" }}
              />
              {/* Name card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="font-bold text-gray-900 text-sm">Dr. Jumana Al-Deek, DO</p>
                <p className="text-xs text-gray-500">Board-Certified Physician · Medical Weight Loss & Menopause Specialist</p>
                <p className="text-xs mt-1.5 font-semibold" style={{ color: BRAND_PINK }}>✓ No Insurance Needed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="border-y py-9 sm:py-10 bg-[#fdfafb]" style={{ borderColor: "#eee3e6" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-1 rounded-full mx-auto mb-7" style={{ background: BRAND_GRADIENT }} />
          {/* 2-stat row */}
          <div className="flex justify-center items-center gap-0 mb-6">
            <div className="text-center px-8 sm:px-14">
              <p className="text-3xl leading-none font-black tracking-tight text-gray-900">10K+</p>
              <p className="text-sm font-medium leading-none text-gray-600 mt-1.5">Patients Seen</p>
            </div>
            <div className="w-px h-14 flex-shrink-0" style={{ background: "#d8cbd0" }} />
            <div className="text-center px-8 sm:px-14">
              <p className="text-3xl leading-none font-black tracking-tight text-gray-900">17</p>
              <p className="text-sm font-medium leading-none text-gray-600 mt-1.5">States Licensed</p>
            </div>
          </div>
          {/* Divider */}
          <div className="w-20 h-px mx-auto mb-6" style={{ background: "#d8cbd0" }} />
          {/* Physician quote */}
          <div className="max-w-xl mx-auto text-center">
            <p className="text-lg font-bold mb-1" style={{ color: BRAND_PINK }}>"</p>
            <p className="text-base text-gray-700 italic leading-relaxed mb-3">
              My goal is simple — to understand your health, your goals, and what hasn't worked before. Then we build a plan that actually fits your life.
            </p>
            <p className="text-sm font-semibold text-gray-800">Dr. Jumana Al-Deek, DO</p>
            <p className="text-xs text-gray-500 mt-0.5">Author, <em>The Menopause Weight Loss Trap</em></p>
          </div>
        </div>
      </section>

      {/* ── Medication Pricing ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-2" style={{ color: BRAND_PINK }}>MEDICATION PRICING</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: "Georgia, serif" }}>
            Weight-Loss Medication
          </h2>
          <div className="text-center mb-8">
            <p className="text-base text-gray-500">Semaglutide &amp; tirzepatide — priced monthly</p>
            <p className="text-sm italic mt-1" style={{ color: "#7A1E7E" }}>Hormone therapy pricing available upon consultation.</p>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Compounded</p>
                  <p className="text-base text-gray-700">Semaglutide or tirzepatide</p>
                  <p className="text-sm mt-1" style={{ color: BRAND_PINK }}>Access pre-negotiated rates through our preferred partner pharmacies.</p>
                  <p className="text-base text-gray-700 mt-1">Shipped directly to your door</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-lg" style={{ color: BRAND_PINK }}>~$100–$300</p>
                  <p className="text-sm text-gray-600">/mo</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Brand-Name</p>
                  <p className="text-base text-gray-700">Wegovy or Zepbound</p>
                  <p className="text-base text-gray-700 mt-1">Shipped to your door or picked up at your local pharmacy — your choice</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-lg" style={{ color: BRAND_PINK }}>~$150–$450</p>
                  <p className="text-xs text-gray-400">/mo</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4 max-w-sm mx-auto">
            Medication pricing varies based on dosage, formulation, and pharmacy. Dr. Al-Deek will discuss your options on your call.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-center mb-2" style={{ color: BRAND_PINK }}>HOW IT WORKS</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: "Georgia, serif" }}>
            Simple. Transparent. No surprises.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex flex-col">
              <p className="text-2xl font-extrabold mb-2" style={{ color: "rgba(232,51,158,0.2)" }}>01</p>
              <p className="font-bold text-gray-900 mb-2 text-sm">Tell us about yourself</p>
              <p className="text-sm text-gray-700 leading-relaxed">Complete a quick 3-minute intake so Dr. Al-Deek can review your health and goals before your visit.</p>
            </div>
            <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex flex-col">
              <p className="text-2xl font-extrabold mb-2" style={{ color: "rgba(232,51,158,0.2)" }}>02</p>
              <p className="font-bold text-gray-900 mb-2 text-sm">Reserve your visit for $15</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your $15 is <span className="font-semibold" style={{ color: BRAND_PLUM }}>fully refunded when you attend</span>—even if you decide not to continue.
              </p>
            </div>
            <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex flex-col">
              <p className="text-2xl font-extrabold mb-2" style={{ color: "rgba(232,51,158,0.2)" }}>03</p>
              <p className="font-bold text-gray-900 mb-2 text-sm">Meet one-on-one with Dr. Al-Deek</p>
              <p className="text-sm text-gray-700 leading-relaxed">Together, you and Dr. Al-Deek will map out a personalized weight-loss approach based on your health, goals, and needs.</p>
            </div>
            <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex flex-col">
              <p className="text-2xl font-extrabold mb-2" style={{ color: "rgba(232,51,158,0.2)" }}>04</p>
              <p className="font-bold text-gray-900 mb-2 text-sm">Start Treatment</p>
              <p className="text-sm text-gray-700 leading-relaxed">Receive your GLP-1 protocol — medications shipped to your door with ongoing physician support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-14 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Ready to find out if GLP-1 is right for you?
        </h2>
        <p className="text-base text-gray-700 mb-6 max-w-md mx-auto">
          15 minutes with Dr. Al-Deek. $15 fully refunded when you attend.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
        >
          Book My Appt.
        </button>
        <p className="text-sm text-gray-600 mt-3">No insurance needed · 100% virtual · Cancel anytime</p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center">
        <img src={LOGO} alt="MedMethod Direct" width="240" height="80" loading="lazy" decoding="async" className="h-8 w-auto mx-auto mb-3 object-contain" />
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
          MedMethod Direct is a physician-led virtual telehealth practice. All prescriptions are issued only after a valid patient-provider relationship is established through a proper medical evaluation. Individual results may vary. This page is not intended as medical advice.
        </p>
        <p className="text-xs text-gray-300 mt-3">© {new Date().getFullYear()} MedMethod Direct. All rights reserved.</p>
      </footer>

      <WL2Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {!modalOpen && (
        <>
          {/* ── Sticky Mobile CTA Bar ── */}
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex gap-3">
            <a
              href="tel:+18883627011"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all"
              style={{ borderColor: BRAND_PINK, color: BRAND_PINK }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12 19.79 19.79 0 0 1 1.14 3.38 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div className="flex flex-col leading-tight items-center text-center">
                <span className="text-xs font-medium" style={{ color: BRAND_PLUM }}>Have questions?</span>
                <span className="font-bold text-sm" style={{ color: BRAND_PINK }}>Call Now</span>
              </div>
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
              style={{ background: BRAND_GRADIENT }}
            >
              Book My Appt.
            </button>
          </div>
          {/* Spacer so footer isn't hidden behind sticky bar on mobile */}
          <div className="h-20 sm:hidden" />
        </>
      )}
    </div>
  );
}
