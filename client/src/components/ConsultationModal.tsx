/* =============================================================================
   ConsultationModal.tsx — MedMethod Direct
   Free Consultation booking flow:
     Step 0: Intro
     Step 1–4: Qualifier questions
     Step 5: Expectation-setting screen
     Step 6: Calendly embed
   Replace CALENDLY_URL with your actual Calendly link.
   ============================================================================= */
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Shield, CheckCircle } from "lucide-react";

// ── REPLACE THIS with your real Calendly URL ──────────────────────────────────
const CALENDLY_URL = "https://calendly.com/medmethoddirect/free-consultation";
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 1,
    question: "What's your primary goal?",
    subtitle: "Select the one that matters most to you right now.",
    options: [
      { label: "Weight Loss", emoji: "⚖️" },
      { label: "Hormone Balance", emoji: "🔬" },
      { label: "Menopause Relief", emoji: "🌿" },
      { label: "All of the Above", emoji: "✨" },
    ],
  },
  {
    id: 2,
    question: "How long have you been struggling with this?",
    subtitle: "Be honest — this helps us understand your journey.",
    options: [
      { label: "Less than 6 months", emoji: "📅" },
      { label: "1–2 years", emoji: "📆" },
      { label: "3–5 years", emoji: "🗓️" },
      { label: "More than 5 years", emoji: "⏳" },
    ],
  },
  {
    id: 3,
    question: "Have you tried medical weight loss programs before?",
    subtitle: "No judgment — this helps us tailor the conversation.",
    options: [
      { label: "No, this is my first time", emoji: "🌱" },
      { label: "Yes, but didn't see results", emoji: "😔" },
      { label: "Yes, saw results but regained weight", emoji: "🔄" },
      { label: "Currently on a program", emoji: "💊" },
    ],
  },
  {
    id: 4,
    question: "What's your age range?",
    subtitle: "Our programs are tailored to your hormonal stage of life.",
    options: [
      { label: "30–39", emoji: "🌸" },
      { label: "40–49", emoji: "🌺" },
      { label: "50–59", emoji: "🌻" },
      { label: "60+", emoji: "🌷" },
    ],
  },
];

export default function ConsultationModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0); // 0=intro, 1-4=questions, 5=expectation, 6=calendar
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));
  const [selected, setSelected] = useState<string>("");

  if (!open) return null;

  const progress = step === 0 ? 0 : step >= 5 ? 100 : Math.round((step / 4) * 100);
  const currentQ = step >= 1 && step <= 4 ? questions[step - 1] : null;

  // Build Calendly URL with prefilled answers as utm params for advisor context
  const calendlyWithParams = `${CALENDLY_URL}?utm_source=website&utm_medium=modal&utm_campaign=${encodeURIComponent(answers[0] || "")}&utm_content=${encodeURIComponent(answers[3] || "")}`;

  function handleStart() {
    setStep(1);
    setSelected(answers[0]);
  }

  function handleSelect(label: string) {
    setSelected(label);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers];
    newAnswers[step - 1] = selected;
    setAnswers(newAnswers);
    if (step === 4) {
      setStep(5);
    } else {
      setStep(step + 1);
      setSelected(answers[step] || "");
    }
  }

  function handleBack() {
    if (step === 1) { setStep(0); return; }
    if (step === 5) { setStep(4); setSelected(answers[3]); return; }
    setStep(step - 1);
    setSelected(answers[step - 2] || "");
  }

  function handleShowCalendar() {
    setStep(6);
  }

  function handleRestart() {
    setStep(0);
    setAnswers(Array(4).fill(""));
    setSelected("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-white"
        style={{
          maxWidth: step === 6 ? "860px" : "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          transition: "max-width 0.4s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Progress bar */}
        {step > 0 && step < 5 && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #E8339E 0%, #7A1E7E 100%)",
              }}
            />
          </div>
        )}

        <div className="p-8">

          {/* ── Step 0: Intro ── */}
          {step === 0 && (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
              >
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <span
                className="text-xs font-bold tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                No Cost · No Obligation
              </span>
              <h2
                className="font-black text-[#111111] mb-3"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", letterSpacing: "-0.02em" }}
              >
                Schedule Your Free Consultation
              </h2>
              <p
                className="text-gray-500 text-sm leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Answer 4 quick questions so your Enrollment Specialist can personalize your call — then pick a time that works for you.
              </p>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Clock, label: "20-min call" },
                  { icon: Shield, label: "100% confidential" },
                  { icon: CheckCircle, label: "No pressure" },
                ].map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 flex flex-col items-center gap-1.5"
                    style={{ background: "#F8F7F5" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    <span
                      className="text-xs font-semibold text-gray-600"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="w-full py-4 rounded-full font-bold text-white text-sm tracking-wider"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  boxShadow: "0 8px 24px rgba(232,51,158,0.3)",
                }}
              >
                LET'S GET STARTED →
              </button>
            </div>
          )}

          {/* ── Steps 1–4: Questions ── */}
          {currentQ && (
            <div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                Question {step} of 4
              </div>
              <h3
                className="font-black text-[#111111] mb-1"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", lineHeight: 1.35 }}
              >
                {currentQ.question}
              </h3>
              <p
                className="text-gray-400 text-xs mb-5"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {currentQ.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.label)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      borderColor: selected === opt.label ? "#E8339E" : "#e5e7eb",
                      background: selected === opt.label ? "rgba(232,51,158,0.05)" : "#fff",
                      boxShadow: selected === opt.label ? "0 0 0 1px #E8339E" : "none",
                    }}
                  >
                    <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: selected === opt.label ? "#E8339E" : "#374151" }}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background: !selected
                      ? "#d1d5db"
                      : "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    cursor: !selected ? "not-allowed" : "pointer",
                    boxShadow: selected ? "0 4px 14px rgba(232,51,158,0.3)" : "none",
                  }}
                >
                  {step === 4 ? "See Next Step" : "Next"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Expectation Setting ── */}
          {step === 5 && (
            <div>
              {/* Summary of answers */}
              <div
                className="rounded-2xl p-4 mb-6"
                style={{ background: "rgba(232,51,158,0.05)", border: "1px solid rgba(232,51,158,0.15)" }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
                >
                  Your Profile
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {questions.map((q, i) => (
                    <div key={i} className="flex flex-col">
                      <span
                        className="text-xs text-gray-400"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {q.question.replace("?", "")}
                      </span>
                      <span
                        className="text-sm font-bold text-[#111111]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {answers[i] || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <h3
                className="font-black text-[#111111] mb-3"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.15rem", lineHeight: 1.35 }}
              >
                Here's what to expect on your call
              </h3>

              <div className="space-y-3 mb-7">
                {[
                  { title: "20 minutes, no pressure", body: "Your call is with a MedMethod Enrollment Specialist — not a salesperson. They're here to understand your goals and answer your questions honestly." },
                  { title: "We'll review your goals together", body: "Based on what you've shared, your specialist will walk you through which program aligns with your biology, lifestyle, and timeline." },
                  { title: "You'll leave with a clear next step", body: "Whether you're ready to start or just exploring, you'll have a concrete, personalized recommendation — and zero obligation to commit on the call." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p
                        className="font-bold text-[#111111] text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-gray-500 text-xs leading-relaxed mt-0.5"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleShowCalendar}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    boxShadow: "0 8px 24px rgba(232,51,158,0.3)",
                  }}
                >
                  <Calendar className="w-4 h-4" /> PICK MY TIME SLOT →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 6: Calendly Embed ── */}
          {step === 6 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3
                    className="font-black text-[#111111]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem" }}
                  >
                    Pick a time that works for you
                  </h3>
                  <p
                    className="text-gray-400 text-xs mt-0.5"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    20-minute free consultation · 100% virtual
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              </div>

              {/* Calendly inline embed */}
              <div
                className="rounded-2xl overflow-hidden border border-gray-100"
                style={{ height: "580px" }}
              >
                <iframe
                  src={calendlyWithParams}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Schedule your free consultation"
                  style={{ border: "none" }}
                />
              </div>

              <p
                className="text-center text-gray-400 text-xs mt-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Powered by Calendly · Your information is kept 100% confidential
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
