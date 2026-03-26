// ConsultationModal.tsx
// Design: Clean white mobile-style, large serif question title, thin divider radio rows,
// full-width brand-gradient "Next" button pinned at bottom.
// Replace CALENDLY_URL with your actual Calendly link.

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/medmethoddirect/free-consultation";

interface Props {
  open: boolean;
  onClose: () => void;
}

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
    question: "How long have you been struggling with this?",
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
    question: "Have you tried medical weight loss programs before?",
    subtitle: "No judgment — we just want to help you succeed this time",
    options: [
      "No, this is my first time",
      "Yes, but didn't get results",
      "Yes, results didn't last",
      "I've tried everything",
    ],
  },
  {
    id: "age",
    question: "What is your date of birth?",
    subtitle: "We use your age to tailor your hormonal protocol",
    options: [],
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

  // Scroll to selected index on mount / external change
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
      {/* top fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to bottom, #fafafa 0%, transparent 100%)" }}
      />
      {/* bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * 2, background: "linear-gradient(to top, #fafafa 0%, transparent 100%)" }}
      />
      {/* highlight bar */}
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

// ── Main modal ───────────────────────────────────────────────────────────────
export default function ConsultationModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const months = useMemo(() => ["January","February","March","April","May","June","July","August","September","October","November","December"], []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")), []);
  const years = useMemo(() => Array.from({ length: currentYear - 1919 }, (_, i) => String(currentYear - i)).filter(y => parseInt(y) <= currentYear - 18), [currentYear]);

  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(new Date().getDate() - 1);
  const [yearIdx, setYearIdx] = useState(30); // default ~30 years ago

  const computedAge = useMemo(() => {
    const dob = new Date(parseInt(years[yearIdx]), monthIdx, parseInt(days[dayIdx]));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    return age;
  }, [monthIdx, dayIdx, yearIdx, months, days, years]);

  if (!open) return null;

  const totalSteps = questions.length + 1;
  const progressPct = Math.round(((step + 1) / (totalSteps + 1)) * 100);
  const isQuestionStep = step < questions.length;
  const isAgeStep = isQuestionStep && questions[step].id === "age";
  const isExpectationStep = step === questions.length;
  const isCalendarStep = step === questions.length + 1;

  const handleNext = () => {
    if (isQuestionStep) {
      if (isAgeStep) {
        if (computedAge < 18) return;
        const dobStr = `${months[monthIdx]} ${days[dayIdx]}, ${years[yearIdx]}`;
        setAnswers((prev) => ({ ...prev, age: dobStr, computedAge: String(computedAge) }));
        setSelected(null);
        setStep((s) => s + 1);
        return;
      }
      if (!selected) return;
      setAnswers((prev) => ({ ...prev, [questions[step].id]: selected }));
      setSelected(null);
      setStep((s) => s + 1);
    } else if (isExpectationStep) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevStep = step - 1;
    setStep(prevStep);
    if (prevStep < questions.length) {
      setSelected(answers[questions[prevStep].id] || null);
    } else {
      setSelected(null);
    }
  };

  const handleClose = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
    onClose();
  };

  const isNextDisabled = isQuestionStep
    ? isAgeStep ? computedAge < 18 : !selected
    : false;

  const calendlyWithParams = `${CALENDLY_URL}?utm_source=website&utm_medium=modal&utm_campaign=${encodeURIComponent(answers["goal"] || "")}&utm_content=${encodeURIComponent(answers["age"] || "")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
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
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X size={16} className="text-gray-500" />
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Question steps */}
          {isQuestionStep && (
            <div className="px-6 pt-8 pb-2">
              <h2
                className="text-2xl font-bold text-gray-900 mb-1 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {questions[step].question}
              </h2>
              <p className="text-sm text-gray-400 mb-5">{questions[step].subtitle}</p>

              {isAgeStep ? (
                <div className="mt-2">
                  <div
                    className="flex rounded-xl overflow-hidden"
                    style={{ background: "#fafafa", userSelect: "none" }}
                  >
                    <WheelColumn items={months} selectedIndex={monthIdx} onSelect={setMonthIdx} />
                    <WheelColumn items={days} selectedIndex={dayIdx} onSelect={setDayIdx} />
                    <WheelColumn items={years} selectedIndex={yearIdx} onSelect={setYearIdx} />
                  </div>
                  <p className="text-xs text-center mt-3" style={{ color: computedAge >= 18 ? "#9ca3af" : BRAND_PINK }}>
                    {computedAge >= 18 ? `Age: ${computedAge} years old` : "Must be 18 or older to enroll"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {questions[step].options.map((option) => {
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

          {/* Expectation screen */}
          {isExpectationStep && (
            <div className="px-6 pt-8 pb-2">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BRAND_PINK }}>
                ALMOST THERE
              </p>
              <h2
                className="text-2xl font-bold text-gray-900 mb-2 pr-10 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Here's what to expect on your free call
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Your 20-minute call with a MedMethod Enrollment Specialist is completely free and pressure-free.
              </p>
              <div className="divide-y divide-gray-100">
                {[
                  { icon: "🩺", title: "Review your goals", desc: "We'll discuss what you've tried and what hasn't worked." },
                  { icon: "💬", title: "Answer your questions", desc: "Ask anything about our programs, medications, or process." },
                  { icon: "📋", title: "Get a personalized recommendation", desc: "We'll tell you exactly which program fits your biology and lifestyle." },
                  { icon: "🚫", title: "No pressure, no obligation", desc: "This is a conversation — not a sales pitch." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 py-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar embed */}
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
                Pick a 20-minute slot with a MedMethod Enrollment Specialist.
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <iframe
                  src={calendlyWithParams}
                  width="100%"
                  height="560"
                  frameBorder="0"
                  title="Schedule your free consultation"
                  style={{ border: "none", display: "block" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom sticky button */}
        {!isCalendarStep && (
          <div className="flex-shrink-0 px-6 pb-8 pt-3 bg-white border-t border-gray-50">
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
              {isExpectationStep ? "Choose a Time →" : "Next"}
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
