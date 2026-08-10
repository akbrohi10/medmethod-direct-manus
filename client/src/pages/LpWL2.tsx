/*
 * LpWL2.tsx — /lp/WL2
 * GLP-1 Weight Loss landing page — conversion-focused
 * $15 fully refundable booking fee · 15-min virtual visit with Dr. Al-Deek
 * Membership: $49/month · Cancel anytime with 30 days' notice
 */
import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { X, Check, ChevronDown, Upload } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import PayPalPaymentForm from "@/components/home1/PayPalPaymentForm";
import StripePaymentForm from "@/components/home1/StripePaymentForm";

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/66201c6d-9b98-4fac-9725-e44c0415f8e7";
const GHL_PAYMENT_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/d37a2de2-c00f-40ed-bb00-a8efa3127093";

const DR_PHOTO = "/manus-storage/dr-aldeek-hero-2026_628d7e54_ddae4722.png";
const LOGO = "/manus-storage/medmethod-logo-navbar_99a2ea82.png";

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BRAND_DISABLED = "#f0abcf";

// ─── Intake Modal ─────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function WL2Modal({ open, onClose }: ModalProps) {
  type Step = "intake" | "lead" | "payment" | "calendar";
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
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  // Lead capture state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Payment state
  const [stripePaymentId, setStripePaymentId] = useState<number | null>(null);
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<string | null>(null);
  const [paypalPaymentId, setPaypalPaymentId] = useState<number | null>(null);

  const activeProviderQuery = trpc.paypal.getPublicClientId.useQuery();
  const activeProvider = activeProviderQuery.data?.activeProvider ?? "stripe";

  const stripeScheduleCharge = trpc.stripe.scheduleRemainingCharge.useMutation();
  const paypalScheduleCharge = trpc.paypal.scheduleRemainingCharge.useMutation();

  const [chargeScheduled, setChargeScheduled] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("intake");
      setWeightGoal(""); setWeightDuration(""); setGlp1Before(""); setGlp1Details("");
      setConditions([]); setMedications(""); setHasLabs(""); setPrimaryGoal("");
      setActivityLevel(""); setHeightFt(""); setHeightIn(""); setWeight(""); setAge(""); setSex("");
      setFirstName(""); setEmail(""); setPhone("");
      setStripePaymentId(null); setStripePaymentIntentId(null); setPaypalPaymentId(null);
      setChargeScheduled(false);
    }
  }, [open]);

  const handlePaymentComplete = (piId?: string) => {
    const effectivePaymentId = stripePaymentId ?? paypalPaymentId;
    if (effectivePaymentId && !chargeScheduled) {
      setChargeScheduled(true);
      // Fire GHL payment webhook
      fetch(GHL_PAYMENT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          email,
          phone,
          payment_id: effectivePaymentId,
          transaction_id: piId ?? stripePaymentIntentId ?? "",
          payment_processor: activeProvider,
          landing_page: "/lp/WL2",
          amount: 15,
        }),
      }).catch(() => {});
    }
    setStep("calendar");
  };

  const toggleCondition = (c: string) => {
    setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const intakeValid =
    weightGoal.trim() !== "" &&
    weightDuration !== "" &&
    glp1Before !== "" &&
    sex !== "" &&
    heightFt !== "" &&
    weight !== "" &&
    age !== "";

  const leadValid = firstName.trim() !== "" && email.includes("@") && phone.trim().length >= 7;

  const handleLeadSubmit = () => {
    // Fire GHL intake webhook
    fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        email,
        phone,
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
        age,
        sex,
        landing_page: "/lp/WL2",
      }),
    }).catch(() => {});
    setStep("payment");
  };

  const STEP_LABELS: Record<Step, string> = {
    intake: "About You",
    lead: "Your Info",
    payment: "Reserve ($15)",
    calendar: "Book Your Call",
  };
  const STEPS: Step[] = ["intake", "lead", "payment", "calendar"];
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
        <div className="flex-1 overflow-y-auto">

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
              <div className="grid grid-cols-3 gap-3">
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

              {/* Age & Sex */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Age</label>
                  <input className={inputCls} placeholder="38" value={age} onChange={(e) => setAge(e.target.value)} type="number" min="18" max="99" />
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
                {hasLabs === "yes" && (
                  <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                    <Upload size={14} className="flex-shrink-0" />
                    <span>You can share your labs with Dr. Al-Deek during your call or via the patient portal.</span>
                  </div>
                )}
              </div>

              {/* Primary goal */}
              <div>
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
              <div>
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
              {activeProvider === "paypal" ? (
                <PayPalPaymentForm
                  patientName={firstName}
                  patientEmail={email}
                  patientPhone={phone}
                  landingPage="/lp/WL2"
                  onComplete={() => handlePaymentComplete(undefined)}
                  onPaymentId={(id) => setPaypalPaymentId(id)}
                  onError={(msg) => toast.error(msg)}
                />
              ) : (
                <StripePaymentForm
                  patientName={firstName}
                  patientEmail={email}
                  patientPhone={phone}
                  landingPage="/lp/WL2"
                  onComplete={() => handlePaymentComplete(stripePaymentIntentId ?? undefined)}
                  onPaymentId={(id) => setStripePaymentId(id)}
                  onPaymentIntentId={(piId) => {
                    setStripePaymentIntentId(piId);
                    handlePaymentComplete(piId);
                  }}
                />
              )}
            </div>
          )}

          {/* ── STEP 4: Calendar ── */}
          {step === "calendar" && (
            <div className="px-6 py-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                YOU'RE ALL SET
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-1 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Pick your time with Dr. Al-Deek
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Your $15 hold is confirmed. Choose a 15-minute slot below.
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <iframe
                  src={`${BOOKING_URL}?name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`}
                  width="100%"
                  height="700"
                  frameBorder="0"
                  scrolling="yes"
                  title="Book your appointment"
                  style={{ border: "none", display: "block", minHeight: "500px", maxHeight: "calc(95vh - 200px)" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer button */}
        {step !== "payment" && step !== "calendar" && (
          <div className="flex-shrink-0 px-6 pt-3 pb-6 bg-white border-t border-gray-50">
            <button
              onClick={() => {
                if (step === "intake") setStep("lead");
                else if (step === "lead") handleLeadSubmit();
              }}
              disabled={step === "intake" ? !intakeValid : !leadValid}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{
                background: (step === "intake" ? !intakeValid : !leadValid) ? BRAND_DISABLED : BRAND_GRADIENT,
                cursor: (step === "intake" ? !intakeValid : !leadValid) ? "not-allowed" : "pointer",
                boxShadow: (step === "intake" ? !intakeValid : !leadValid) ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
              }}
            >
              {step === "lead" ? "Continue to Payment →" : "Next →"}
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
      </Helmet>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/">
            <img src={LOGO} alt="MedMethod Direct" className="h-10 w-auto object-contain" />
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
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: BRAND_PINK }}>
              MEDICAL WEIGHT LOSS · 15-MINUTE VIRTUAL VISIT
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-gray-900">Medical Weight Loss.</span>
              <br />
              <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Done Right.</span>
            </h1>
            <p className="text-base text-gray-600 mb-7 leading-relaxed">
              Talk one-on-one with Dr. Al-Deek to find out which weight-loss approach may be right for you.
            </p>

            {/* $15 refund — inline, no box */}
            <div className="mb-8">
              <p className="text-base font-semibold text-gray-800 mb-1">
                $15 reserves your visit ·{" "}
                <span style={{ color: BRAND_PLUM }}>Show up → Get your $15 back</span>
              </p>
              <p className="text-sm text-gray-500 italic">Even if you decide not to continue.</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90"
              style={{ background: BRAND_GRADIENT, boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
            >
              Reserve My Visit →
            </button>

            {/* Single trust line */}
            <p className="text-xs text-gray-500 mt-3">
              <span className="mr-1" style={{ color: BRAND_PINK }}>✓</span>Board-Certified Physician
              <span className="mx-2 text-gray-200">·</span>
              <span className="mr-1" style={{ color: BRAND_PINK }}>✓</span>100% Virtual
              <span className="mx-2 text-gray-200">·</span>
              <span className="mr-1" style={{ color: BRAND_PINK }}>✓</span>No Insurance Needed
            </p>
          </div>

          {/* Right: Dr. Al-Deek photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={DR_PHOTO}
                alt="Dr. Jumana Al-Deek, DO"
                className="w-72 sm:w-80 lg:w-96 rounded-2xl object-cover shadow-xl"
                style={{ aspectRatio: "3/4", objectPosition: "top" }}
              />
              {/* Name card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="font-bold text-gray-900 text-sm">Dr. Jumana Al-Deek, DO</p>
                <p className="text-xs text-gray-500">Board-Certified Physician · Medical Weight Loss Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-center mb-2" style={{ color: BRAND_PINK }}>HOW IT WORKS</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: "Georgia, serif" }}>
            Simple. Transparent. No surprises.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Fill out your intake form", desc: "Takes 3 minutes. Dr. Al-Deek reviews it before your call so you can make the most of your 15 minutes." },
              { step: "02", title: "Reserve with a $15 hold", desc: "Fully refunded when you attend — even if GLP-1 isn't the right fit for you." },
              { step: "03", title: "Meet virtually with Dr. Al-Deek", desc: "She'll review your health, determine if GLP-1 is appropriate, and outline your personalized plan." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-3xl font-extrabold mb-3" style={{ color: "rgba(232,51,158,0.25)" }}>{item.step}</p>
                <p className="font-bold text-gray-900 mb-2">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership ── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-center mb-2" style={{ color: BRAND_PINK }}>ONGOING CARE</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2" style={{ fontFamily: "Georgia, serif" }}>
            If GLP-1 is right for you
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8 max-w-xl mx-auto">
            Dr. Al-Deek will write your prescription on the call. You'll then have the option to join our membership for ongoing physician support.
          </p>
          <div className="max-w-sm mx-auto bg-white rounded-2xl border-2 shadow-lg overflow-hidden" style={{ borderColor: BRAND_PINK }}>
            <div className="px-6 py-5" style={{ background: BRAND_GRADIENT }}>
              <p className="text-white font-bold text-lg">Monthly Membership</p>
              <p className="text-white/80 text-sm">Ongoing physician-led care</p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-gray-900">$49</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="flex flex-col gap-3 mb-5">
                {[
                  "Direct secure messaging with Dr. Al-Deek",
                  "Prescription management",
                  "Dosing adjustments",
                  "Prescription refills",
                  "Ongoing support & guidance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: BRAND_PINK }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400">Cancel anytime with 30 days' notice.</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Want a video visit? Add one for <strong>$50</strong> — 30 minutes with Dr. Al-Deek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Medication Pricing ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold tracking-widest uppercase text-center mb-2" style={{ color: BRAND_PINK }}>MEDICATION PRICING</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Weight-Loss Medication
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">Semaglutide &amp; tirzepatide — priced monthly</p>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Compounded</p>
                  <p className="text-sm text-gray-500">Semaglutide or tirzepatide</p>
                  <p className="text-xs mt-1" style={{ color: BRAND_PINK }}>Preferred pricing may be available through partner pharmacies.</p>
                  <p className="text-sm text-gray-500 mt-1">Shipped directly to your door</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-lg" style={{ color: BRAND_PINK }}>~$100–$300</p>
                  <p className="text-xs text-gray-400">/mo</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Brand-Name</p>
                  <p className="text-sm text-gray-500">Wegovy or Zepbound</p>
                  <p className="text-sm text-gray-500 mt-1">Shipped to your door or picked up at your local pharmacy — your choice</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-lg" style={{ color: BRAND_PINK }}>~$150–$450</p>
                  <p className="text-xs text-gray-400">/mo</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4 max-w-sm mx-auto">
            Medication pricing varies based on dosage, formulation, and pharmacy. Dr. Al-Deek will discuss your options on your call.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-14 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Ready to find out if GLP-1 is right for you?
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          15 minutes with Dr. Al-Deek. $15 fully refunded when you attend.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="px-10 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: "0 8px 32px rgba(232,51,158,0.35)" }}
        >
          Book My Appt.
        </button>
        <p className="text-xs text-gray-400 mt-3">No insurance needed · 100% virtual · Cancel anytime</p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center">
        <img src={LOGO} alt="MedMethod Direct" className="h-8 w-auto mx-auto mb-3 object-contain" />
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
          MedMethod Direct is a physician-led virtual telehealth practice. All prescriptions are issued only after a valid patient-provider relationship is established through a proper medical evaluation. Individual results may vary. This page is not intended as medical advice.
        </p>
        <p className="text-xs text-gray-300 mt-3">© {new Date().getFullYear()} MedMethod Direct. All rights reserved.</p>
      </footer>

      <WL2Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
