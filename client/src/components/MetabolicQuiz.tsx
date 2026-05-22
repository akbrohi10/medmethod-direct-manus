/* =============================================================================
   Metabolic Health Score Quiz — MedMethod Direct
   Multi-step modal: 7 symptom questions → scored result → personalized CTA
   ============================================================================= */
import { useState } from "react";
import { X, ChevronRight, ChevronLeft, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 1,
    question: "How would you describe your energy levels throughout the day?",
    options: [
      { label: "Consistently good — I feel energized most of the day", score: 0 },
      { label: "Moderate — I have some afternoon slumps but manage", score: 1 },
      { label: "Low — I feel tired most of the day even after sleeping", score: 2 },
      { label: "Exhausted — I struggle to get through the day", score: 3 },
    ],
  },
  {
    id: 2,
    question: "Have you noticed unexplained weight gain, especially around your midsection?",
    options: [
      { label: "No — my weight has been stable", score: 0 },
      { label: "Slight gain — a few pounds I can't explain", score: 1 },
      { label: "Moderate gain — 10–20 lbs despite no major lifestyle changes", score: 2 },
      { label: "Significant gain — 20+ lbs that won't respond to diet or exercise", score: 3 },
    ],
  },
  {
    id: 3,
    question: "How is your sleep quality?",
    options: [
      { label: "Great — I fall asleep easily and wake refreshed", score: 0 },
      { label: "Okay — occasional trouble but mostly fine", score: 1 },
      { label: "Poor — I wake frequently or struggle to fall asleep", score: 2 },
      { label: "Very poor — night sweats, insomnia, or waking exhausted", score: 3 },
    ],
  },
  {
    id: 4,
    question: "Do you experience mood changes, anxiety, or brain fog?",
    options: [
      { label: "Rarely — I feel mentally sharp and emotionally stable", score: 0 },
      { label: "Occasionally — some mood swings or forgetfulness", score: 1 },
      { label: "Frequently — noticeable brain fog, irritability, or anxiety", score: 2 },
      { label: "Daily — significant mood swings, depression, or inability to focus", score: 3 },
    ],
  },
  {
    id: 5,
    question: "Are you experiencing hot flashes, night sweats, or other menopause symptoms?",
    options: [
      { label: "No symptoms", score: 0 },
      { label: "Mild — occasional and manageable", score: 1 },
      { label: "Moderate — several times a week, affecting daily life", score: 2 },
      { label: "Severe — daily and significantly disruptive", score: 3 },
    ],
  },
  {
    id: 6,
    question: "How would you describe your relationship with food and cravings?",
    options: [
      { label: "Balanced — I eat well and rarely have intense cravings", score: 0 },
      { label: "Some cravings — especially for sugar or carbs in the afternoon", score: 1 },
      { label: "Frequent cravings — hard to control, especially at night", score: 2 },
      { label: "Constant cravings — I feel like I'm always fighting hunger or urges", score: 3 },
    ],
  },
  {
    id: 7,
    question: "Have you tried diets or fitness programs in the past without lasting results?",
    options: [
      { label: "No — I've maintained my health without major programs", score: 0 },
      { label: "Once or twice — saw some results but they didn't last", score: 1 },
      { label: "Several times — initial progress but always regained the weight", score: 2 },
      { label: "Many times — nothing has worked long-term despite real effort", score: 3 },
    ],
  },
];

type ResultLevel = "optimal" | "moderate" | "elevated" | "critical";

function getResult(score: number): {
  level: ResultLevel;
  label: string;
  headline: string;
  body: string;
  cta: string;
  color: string;
  bgColor: string;
  icon: typeof CheckCircle;
} {
  if (score <= 4) return {
    level: "optimal",
    label: "Metabolic Score: Optimal",
    headline: "Your metabolic health looks strong.",
    body: "Your symptoms suggest your hormones and metabolism are relatively well-balanced. That said, women's metabolic health can shift quickly — especially around perimenopause. A baseline lab panel is still a smart investment to catch early changes before they become problems.",
    cta: "Schedule Your Free Consultation",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.08)",
    icon: CheckCircle,
  };
  if (score <= 9) return {
    level: "moderate",
    label: "Metabolic Score: Moderate Concern",
    headline: "Your body is sending early warning signals.",
    body: "Your symptoms suggest early-stage hormonal or metabolic imbalances that are common in women 35–55. Left unaddressed, these patterns tend to worsen over time. A comprehensive lab panel would give you a clear picture of what's happening — and what to do about it.",
    cta: "Schedule Your Free Consultation",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.08)",
    icon: AlertTriangle,
  };
  if (score <= 15) return {
    level: "elevated",
    label: "Metabolic Score: Elevated Concern",
    headline: "Your symptoms point to significant hormonal disruption.",
    body: "The pattern of symptoms you're experiencing is consistent with hormonal imbalance, insulin resistance, or metabolic dysfunction. These are clinical issues — not willpower issues. Comprehensive bloodwork and a physician-guided protocol could make a dramatic difference in how you feel.",
    cta: "Schedule Your Free Consultation",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.08)",
    icon: AlertTriangle,
  };
  return {
    level: "critical",
    label: "Metabolic Score: Immediate Attention Recommended",
    headline: "Your body is telling you it needs clinical support.",
    body: "Your symptoms strongly suggest significant hormonal, metabolic, or thyroid dysfunction. This level of disruption rarely resolves on its own — and no diet or fitness program will work effectively until the underlying biology is addressed. We strongly recommend a clinical consultation and comprehensive lab work as your first step.",
    cta: "Schedule Your Free Consultation",
    color: "#E8339E",
    bgColor: "rgba(232,51,158,0.08)",
    icon: AlertCircle,
  };
}

export default function MetabolicQuiz({ open, onClose }: Props) {
  const [step, setStep] = useState(0); // 0 = intro, 1-7 = questions, 8 = result
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [selected, setSelected] = useState<number>(-1);

  if (!open) return null;

  const totalScore = answers.reduce((sum, a) => sum + (a >= 0 ? a : 0), 0);
  const result = getResult(totalScore);
  const ResultIcon = result.icon;

  const currentQ = step >= 1 && step <= 7 ? questions[step - 1] : null;
  const progress = step === 0 ? 0 : step === 8 ? 100 : Math.round((step / 7) * 100);

  function handleStart() {
    setStep(1);
    setSelected(answers[0]);
  }

  function handleSelect(score: number) {
    setSelected(score);
  }

  function handleNext() {
    if (selected === -1) return;
    const newAnswers = [...answers];
    newAnswers[step - 1] = selected;
    setAnswers(newAnswers);
    if (step === 7) {
      setStep(8);
    } else {
      setStep(step + 1);
      setSelected(answers[step] ?? -1);
    }
  }

  function handleBack() {
    if (step === 1) { setStep(0); return; }
    setStep(step - 1);
    setSelected(answers[step - 2]);
  }

  function handleRestart() {
    setStep(0);
    setAnswers(Array(questions.length).fill(-1));
    setSelected(-1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Progress bar */}
        {step > 0 && step < 8 && (
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

        <div className="p-5 sm:p-8">

          {/* ── Intro ── */}
          {step === 0 && (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
              >
                <span className="text-white text-2xl font-black" style={{ fontFamily: "Montserrat, sans-serif" }}>M</span>
              </div>
              <span
                className="text-xs font-bold tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                Free Assessment
              </span>
              <h2
                className="font-black text-[#111111] mb-3"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", letterSpacing: "-0.02em" }}
              >
                Metabolic Health Score Quiz
              </h2>
              <p
                className="text-gray-500 text-sm leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Answer 7 quick questions about your symptoms and lifestyle. We'll calculate your personalized Metabolic Health Score and tell you exactly what it means — and what to do next.
              </p>
              <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-400" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <span>⏱ 2 minutes</span>
                <span>·</span>
                <span>7 questions</span>
                <span>·</span>
                <span>100% free</span>
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
                START MY FREE ASSESSMENT →
              </button>
            </div>
          )}

          {/* ── Questions ── */}
          {currentQ && (
            <div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E" }}
              >
                Question {step} of 7
              </div>
              <h3
                className="font-black text-[#111111] mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.05rem", lineHeight: 1.4 }}
              >
                {currentQ.question}
              </h3>
              <div className="flex flex-col gap-3 mb-8">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.score)}
                    className="text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      borderColor: selected === opt.score ? "#E8339E" : "#e5e7eb",
                      background: selected === opt.score ? "rgba(232,51,158,0.05)" : "#fff",
                      color: selected === opt.score ? "#E8339E" : "#374151",
                      fontWeight: selected === opt.score ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
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
                  onClick={handleNext}
                  disabled={selected === -1}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background: selected === -1
                      ? "#d1d5db"
                      : "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    cursor: selected === -1 ? "not-allowed" : "pointer",
                  }}
                >
                  {step === 7 ? "See My Results" : "Next"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {step === 8 && (
            <div>
              {/* Score badge */}
              <div
                className="rounded-2xl p-5 mb-6 flex items-start gap-4"
                style={{ background: result.bgColor, border: `1px solid ${result.color}33` }}
              >
                <ResultIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: result.color }} />
                <div>
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif", color: result.color }}
                  >
                    {result.label}
                  </div>
                  <div
                    className="font-black text-[#111111] mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
                  >
                    {result.headline}
                  </div>
                  <div
                    className="text-gray-500 text-sm leading-relaxed"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {result.body}
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((totalScore / 21) * 100)}%`,
                      background: `linear-gradient(90deg, #22c55e, #f59e0b, ${result.color})`,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif", color: result.color }}
                >
                  {totalScore}/21
                </span>
              </div>

              {/* CTA */}
              <a
                href="#consultation"
                onClick={onClose}
                className="block w-full py-4 rounded-full font-bold text-white text-sm tracking-wider text-center mb-3"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  boxShadow: "0 8px 24px rgba(232,51,158,0.3)",
                }}
              >
                {result.cta.toUpperCase()} →
              </a>
              <button
                onClick={handleRestart}
                className="block w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Retake the quiz
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
