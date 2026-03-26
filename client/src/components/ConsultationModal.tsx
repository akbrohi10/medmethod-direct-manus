// ConsultationModal — MedMethod Direct
// Design: Clean white mobile-style, large serif question title, thin divider radio rows,
// full-width teal "Next" button pinned at bottom. Inspired by reference UI.
// Replace CALENDLY_URL with your actual Calendly link.

import { useState } from "react";
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
    question: "How old are you?",
    subtitle: "We use your age to tailor your hormonal protocol",
    options: [], // number input — handled separately
  },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)";
const BRAND_PINK = "#E8339E";
const BRAND_PLUM = "#7A1E7E";
const BRAND_DISABLED = "#f0abcf";

export default function ConsultationModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0); // 0-3 = questions, 4 = expectation, 5 = calendar
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  const totalSteps = questions.length + 1; // 4 questions + expectation (calendar is final)
  const progressPct = Math.round(((step + 1) / (totalSteps + 1)) * 100);

  const isQuestionStep = step < questions.length;
  const isAgeStep = isQuestionStep && questions[step].id === "age";
  const isExpectationStep = step === questions.length;
  const isCalendarStep = step === questions.length + 1;

  const handleNext = () => {
    if (isQuestionStep) {
      if (!selected) return;
      // validate age is a number between 18 and 110
      if (questions[step].id === "age") {
        const age = parseInt(selected, 10);
        if (isNaN(age) || age < 18 || age > 110) return;
      }
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
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="number"
                      min={18}
                      max={110}
                      placeholder="Enter your age"
                      value={selected || ""}
                      onChange={(e) => setSelected(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      autoFocus
                      className="w-full text-3xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-pink-500 outline-none py-3 bg-transparent transition-colors"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    />
                    <span className="absolute right-0 bottom-3 text-sm text-gray-400">years old</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Must be 18 or older to enroll</p>
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
                      {/* Radio circle */}
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
              disabled={isQuestionStep && (!selected || (isAgeStep && (parseInt(selected || "0", 10) < 18 || parseInt(selected || "0", 10) > 110)))}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{
                background: (isQuestionStep && (!selected || (isAgeStep && (parseInt(selected || "0", 10) < 18 || parseInt(selected || "0", 10) > 110)))) ? BRAND_DISABLED : BRAND_GRADIENT,
                cursor: (isQuestionStep && (!selected || (isAgeStep && (parseInt(selected || "0", 10) < 18 || parseInt(selected || "0", 10) > 110)))) ? "not-allowed" : "pointer",
                boxShadow: (isQuestionStep && (!selected || (isAgeStep && (parseInt(selected || "0", 10) < 18 || parseInt(selected || "0", 10) > 110)))) ? "none" : "0 8px 24px rgba(232,51,158,0.3)",
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
