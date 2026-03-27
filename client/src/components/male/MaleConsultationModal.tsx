/* =============================================================================
   MaleConsultationModal.tsx — Men's Health Consultation Modal
   Brand: Dark Navy #0A0F1E, Teal #00C2CB
   Same step structure as women's: 3 questions → DOB → goals → lead → expectation → Calendly
   ============================================================================= */
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/medmethoddirect/free-consultation-men";

const TEAL = "#00C2CB";
const TEAL_DARK = "#0099A8";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";
const TEAL_DISABLED = "rgba(0,194,203,0.35)";
const ITEM_H = 44;

interface Props {
  open: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: "goal",
    question: "What's your primary goal?",
    subtitle: "This helps us personalize your protocol",
    options: [
      "Optimize testosterone levels",
      "Lose weight & build muscle",
      "Improve energy & performance",
      "Restore sexual health",
      "All of the above",
    ],
  },
  {
    id: "duration",
    question: "How long have you been experiencing these symptoms?",
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
    question: "Have you tried testosterone therapy or hormone treatment before?",
    subtitle: "No judgment — we just want to help you succeed this time",
    options: [
      "No, this is my first time",
      "Yes, but stopped due to side effects",
      "Yes, but results weren't optimal",
      "I've tried everything",
    ],
  },
  {
    id: "age",
    question: "What is your date of birth?",
    subtitle: "We use your age to tailor your hormone protocol",
    options: [],
  },
  {
    id: "goals",
    question: "In your own words, what do you most want to change?",
    subtitle: "There are no wrong answers — this helps your advisor prepare for your call",
    options: [],
  },
];

// ── Wheel Column ─────────────────────────────────────────────────────────────
function WheelColumn({ items, selectedIndex, onSelect }: { items: string[]; selectedIndex: number; onSelect: (idx: number) => void }) {
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
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to bottom, #0d1526 0%, transparent 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to top, #0d1526 0%, transparent 100%)" }} />
      <div className="absolute inset-x-0 z-10 pointer-events-none"
        style={{ top: ITEM_H * 2, height: ITEM_H, background: "rgba(0,194,203,0.08)", borderTop: "1.5px solid rgba(0,194,203,0.3)", borderBottom: "1.5px solid rgba(0,194,203,0.3)" }} />
      <div ref={ref} onScroll={handleScroll}
        style={{ height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory", paddingTop: ITEM_H * 2, paddingBottom: ITEM_H * 2, scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="[&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <div key={item} onClick={() => { onSelect(i); if (ref.current) ref.current.scrollTop = i * ITEM_H; }}
            style={{ height: ITEM_H, scrollSnapAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", fontWeight: i === selectedIndex ? 700 : 400, color: i === selectedIndex ? TEAL : "rgba(255,255,255,0.35)", fontSize: i === selectedIndex ? 15 : 13 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lead Capture Form ────────────────────────────────────────────────────────
interface LeadData { firstName: string; email: string; phone: string; zip: string; }
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v: string) { return v.replace(/\D/g, "").length >= 10; }
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function LeadCaptureForm({ data, onChange }: { data: LeadData; onChange: (d: LeadData) => void }) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const blur = (f: string) => setTouched((p) => ({ ...p, [f]: true }));

  const inputBase: React.CSSProperties = {
    outline: "none", borderWidth: 1, borderStyle: "solid", borderRadius: 12,
    padding: "12px 16px", width: "100%", fontSize: 16, color: "#fff",
    background: "rgba(255,255,255,0.06)", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
    fontFamily: "Montserrat, sans-serif",
  };
  const fieldStyle = (field: string, valid: boolean): React.CSSProperties => ({
    ...inputBase,
    borderColor: touched[field] && !valid ? "#ef4444" : touched[field] && valid ? TEAL : "rgba(255,255,255,0.15)",
    boxShadow: touched[field] && valid ? `0 0 0 3px rgba(0,194,203,0.15)` : "none",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontFamily: "Montserrat, sans-serif" }}>
          First Name <span style={{ color: TEAL }}>*</span>
        </label>
        <input type="text" value={data.firstName} placeholder="John" autoComplete="given-name"
          onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          onBlur={() => blur("firstName")}
          style={fieldStyle("firstName", data.firstName.trim().length >= 2)} />
        {touched.firstName && data.firstName.trim().length < 2 && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>Please enter your first name</p>
        )}
      </div>

      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontFamily: "Montserrat, sans-serif" }}>
          Email Address <span style={{ color: TEAL }}>*</span>
        </label>
        <input type="email" value={data.email} placeholder="john@example.com" autoComplete="email"
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          onBlur={() => blur("email")}
          style={fieldStyle("email", isValidEmail(data.email))} />
        {touched.email && !isValidEmail(data.email) && (
          <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>Please enter a valid email address</p>
        )}
      </div>

      <div>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontFamily: "Montserrat, sans-serif" }}>
          Phone Number <span style={{ color: TEAL }}>*</span>
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
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontFamily: "Montserrat, sans-serif" }}>
          ZIP Code <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>(optional)</span>
        </label>
        <input type="text" value={data.zip} placeholder="90210" autoComplete="postal-code" maxLength={10}
          onChange={(e) => onChange({ ...data, zip: e.target.value.replace(/[^0-9-]/g, "") })}
          style={{ ...inputBase, borderColor: "rgba(255,255,255,0.15)" }}
          onFocus={(e) => { e.target.style.borderColor = TEAL; e.target.style.boxShadow = "0 0 0 3px rgba(0,194,203,0.15)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none"; }} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 12, padding: "12px 14px", background: "rgba(0,194,203,0.06)", border: "1px solid rgba(0,194,203,0.2)", marginTop: 4 }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0, fontFamily: "Montserrat, sans-serif" }}>
          We respect your privacy. No spam, ever. Your information is used only to prepare for your consultation and will never be sold or shared.
        </p>
      </div>
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
export default function MaleConsultationModal({ open, onClose }: Props) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [goalsText, setGoalsText] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({ firstName: "", email: "", phone: "", zip: "" });

  const currentYear = new Date().getFullYear();
  const months = useMemo(() => ["January","February","March","April","May","June","July","August","September","October","November","December"], []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")), []);
  const years = useMemo(() => Array.from({ length: currentYear - 1919 }, (_, i) => String(currentYear - i)).filter(y => parseInt(y) <= currentYear - 18), [currentYear]);

  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(new Date().getDate() - 1);
  const [yearIdx, setYearIdx] = useState(30);

  const computedAge = useMemo(() => {
    const dob = new Date(parseInt(years[yearIdx]), monthIdx, parseInt(days[dayIdx]));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    return age;
  }, [monthIdx, dayIdx, yearIdx, months, days, years]);

  if (!open) return null;

  const LEAD_STEP = questions.length;
  const EXPECTATION_STEP = questions.length + 1;
  const CALENDAR_STEP = questions.length + 2;
  const TOTAL_STEPS = CALENDAR_STEP + 1;

  const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  const isQuestionStep = step < questions.length;
  const isAgeStep = isQuestionStep && questions[step].id === "age";
  const isGoalsStep = isQuestionStep && questions[step].id === "goals";
  const isLeadStep = step === LEAD_STEP;
  const isExpectationStep = step === EXPECTATION_STEP;
  const isCalendarStep = step === CALENDAR_STEP;

  const isLeadValid = leadData.firstName.trim().length >= 2 && isValidEmail(leadData.email) && isValidPhone(leadData.phone);
  const isNextDisabled = isQuestionStep
    ? isAgeStep ? computedAge < 18 : isGoalsStep ? goalsText.trim().length < 3 : !selected
    : isLeadStep ? !isLeadValid : false;

  const handleNext = () => {
    if (isQuestionStep) {
      if (isAgeStep) {
        if (computedAge < 18) return;
        const dobStr = `${months[monthIdx]} ${days[dayIdx]}, ${years[yearIdx]}`;
        setAnswers((prev) => ({ ...prev, age: dobStr, computedAge: String(computedAge) }));
        setSelected(null); setStep((s) => s + 1); return;
      }
      if (isGoalsStep) {
        if (goalsText.trim().length < 3) return;
        setAnswers((prev) => ({ ...prev, goals: goalsText.trim() }));
        setSelected(null); setStep((s) => s + 1); return;
      }
      if (!selected) return;
      setAnswers((prev) => ({ ...prev, [questions[step].id]: selected }));
      setSelected(null); setStep((s) => s + 1);
    } else if (isLeadStep) {
      if (!isLeadValid) return;
      setAnswers((prev) => ({ ...prev, firstName: leadData.firstName.trim(), email: leadData.email.trim(), phone: leadData.phone, zip: leadData.zip }));
      setStep((s) => s + 1);
    } else if (isExpectationStep) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevStep = step - 1;
    setStep(prevStep);
    if (prevStep < questions.length) setSelected(answers[questions[prevStep].id] || null);
    else setSelected(null);
  };

  const handleClose = () => {
    setStep(0); setAnswers({}); setSelected(null); setGoalsText("");
    setLeadData({ firstName: "", email: "", phone: "", zip: "" });
    setShowExitConfirm(false);
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCalendarStep) { handleClose(); return; }
    setShowExitConfirm(true);
  };

  const calendlyWithParams = `${CALENDLY_URL}?utm_source=website&utm_medium=modal&utm_campaign=${encodeURIComponent(answers["goal"] || "")}&name=${encodeURIComponent(answers["firstName"] || "")}&email=${encodeURIComponent(answers["email"] || "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && handleAttemptClose()}>
      <div className="relative w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: isCalendarStep ? 860 : 480, maxHeight: "95vh",
          borderRadius: "20px 20px 0 0",
          background: "#0d1526",
          border: "1px solid rgba(0,194,203,0.2)",
          transition: "max-width 0.4s ease",
        }}>

        {/* Progress bar */}
        {!isCalendarStep && (
          <div className="h-1 w-full flex-shrink-0" style={{ background: "rgba(0,194,203,0.1)" }}>
            <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: TEAL_GRADIENT }} />
          </div>
        )}

        {/* Close button */}
        <button onClick={handleAttemptClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors z-10"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <X size={16} style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>

        {/* Exit-intent confirmation overlay */}
        {showExitConfirm && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center p-6"
            style={{ background: "rgba(13,21,38,0.97)", backdropFilter: "blur(4px)", borderRadius: "inherit" }}
          >
            <div className="flex flex-col items-center text-center max-w-xs">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: "rgba(0,194,203,0.12)", border: "1.5px solid rgba(0,194,203,0.3)" }}
              >
                <span style={{ fontSize: 26 }}>💪</span>
              </div>
              <h3
                className="text-xl font-bold mb-3 leading-snug text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Before you go...
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                It's easy to click out, and difficult to show up. But this time it's for you.
              </p>
              <p className="text-xs font-bold tracking-wider uppercase mb-6" style={{ color: TEAL }}>
                100% Free · No Pressure · Just Answers
              </p>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3.5 rounded-full text-sm font-bold tracking-wider text-white mb-3 transition-all hover:opacity-90"
                style={{ background: TEAL_GRADIENT, boxShadow: "0 6px 20px rgba(0,194,203,0.35)" }}
              >
                I'm Doing This For Me →
              </button>
              <button
                onClick={handleClose}
                className="text-xs font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                Not Today
              </button>
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Question steps */}
          {isQuestionStep && (
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-2xl font-bold text-white mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {questions[step].question}
              </h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>{questions[step].subtitle}</p>

              {isGoalsStep ? (
                <div className="mt-2">
                  <textarea value={goalsText} onChange={(e) => setGoalsText(e.target.value)}
                    placeholder="e.g. I've been feeling exhausted and gaining weight despite working out. My doctor says my levels are 'normal' but I feel terrible. I want my energy and drive back..."
                    rows={6}
                    className="w-full rounded-xl p-4 text-base placeholder-gray-600 resize-none focus:outline-none transition-all"
                    style={{ fontFamily: "Montserrat, sans-serif", lineHeight: 1.6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,194,203,0.2)", color: "#fff" }}
                    onFocus={(e) => (e.target.style.borderColor = TEAL)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,194,203,0.2)")} />
                  <p className="text-xs mt-2 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {goalsText.trim().length < 3 ? "Please share a little about your goals" : `${goalsText.trim().length} characters`}
                  </p>
                </div>
              ) : isAgeStep ? (
                <div className="mt-2">
                  <div className="flex rounded-xl overflow-hidden" style={{ background: "#0d1526", userSelect: "none" }}>
                    <WheelColumn items={months} selectedIndex={monthIdx} onSelect={setMonthIdx} />
                    <WheelColumn items={days} selectedIndex={dayIdx} onSelect={setDayIdx} />
                    <WheelColumn items={years} selectedIndex={yearIdx} onSelect={setYearIdx} />
                  </div>
                  <p className="text-xs text-center mt-3" style={{ color: computedAge >= 18 ? "rgba(255,255,255,0.4)" : "#f87171" }}>
                    {computedAge >= 18 ? `Age: ${computedAge} years old` : "Must be 18 or older to enroll"}
                  </p>
                </div>
              ) : (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {questions[step].options.map((option) => {
                    const isSelected = selected === option;
                    return (
                      <button key={option} onClick={() => setSelected(option)}
                        className="w-full flex items-center gap-4 py-4 text-left transition-colors"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: isSelected ? "rgba(0,194,203,0.06)" : "transparent" }}>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{ borderColor: isSelected ? TEAL : "rgba(255,255,255,0.2)", backgroundColor: isSelected ? TEAL : "transparent" }}>
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-base transition-all" style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: isSelected ? 600 : 400 }}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Lead capture form */}
          {isLeadStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}>
                ALMOST THERE
              </p>
              <h2 className="text-2xl font-bold text-white mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Last step before your free call
              </h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                We'll use this to confirm your appointment and send your personalized summary.
              </p>
              <LeadCaptureForm data={leadData} onChange={setLeadData} />
            </div>
          )}

          {/* Expectation screen */}
          {isExpectationStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}>
                YOU'RE ALL SET
              </p>
              <h2 className="text-2xl font-bold text-white mb-2 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Here's what to expect on your free call
              </h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Your 20-minute call with a MedMethod Men's Health Specialist is completely free and pressure-free.
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { icon: "🧪", title: "Review your hormone symptoms", desc: "We'll discuss your energy, performance, body composition, and lab history." },
                  { icon: "💬", title: "Answer your questions", desc: "Ask anything about TRT, peptides, weight loss, or our process." },
                  { icon: "📋", title: "Get a personalized protocol recommendation", desc: "We'll tell you exactly which program fits your biology and goals." },
                  { icon: "🚫", title: "No pressure, no obligation", desc: "This is a conversation — not a sales pitch." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar embed */}
          {isCalendarStep && (
            <div className="px-6 pt-8 pb-4">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}>
                BOOK YOUR SPOT
              </p>
              <h2 className="text-2xl font-bold text-white mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Choose a time that works for you
              </h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Pick a 20-minute slot with a MedMethod Men's Health Specialist.
              </p>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,194,203,0.2)" }}>
                <iframe src={calendlyWithParams} width="100%" height="560" frameBorder="0"
                  title="Schedule your free men's health consultation" style={{ border: "none", display: "block" }} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom sticky button */}
        {!isCalendarStep && (
          <div className="flex-shrink-0 px-6 pb-8 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d1526" }}>
            <button onClick={handleNext} disabled={isNextDisabled}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{ background: isNextDisabled ? TEAL_DISABLED : TEAL_GRADIENT, cursor: isNextDisabled ? "not-allowed" : "pointer", boxShadow: isNextDisabled ? "none" : "0 8px 24px rgba(0,194,203,0.3)", fontFamily: "Montserrat, sans-serif" }}>
              {isExpectationStep ? "Choose a Time →" : "Next →"}
            </button>
            {step > 0 && (
              <button onClick={handleBack}
                className="w-full mt-2 py-2 text-sm font-semibold transition-colors"
                style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                ← Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
