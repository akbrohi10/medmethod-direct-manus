/* MaleMetabolicQuiz.tsx — Testosterone & Hormone Health Quiz */
import { useState } from "react";

const TEAL = "#00E5FF";
const TEAL_GRADIENT = "linear-gradient(135deg, #00E5FF 0%, #00B8CC 100%)";

const questions = [
  {
    question: "How would you rate your energy levels throughout the day?",
    options: [
      { text: "Strong and consistent", score: 0 },
      { text: "Good in the morning, fades by afternoon", score: 1 },
      { text: "Low most of the day", score: 2 },
      { text: "Exhausted even after a full night's sleep", score: 3 },
    ],
  },
  {
    question: "How has your body composition changed in the last 2 years?",
    options: [
      { text: "Maintained or improved", score: 0 },
      { text: "Slight increase in belly fat", score: 1 },
      { text: "Noticeable weight gain despite diet/exercise", score: 2 },
      { text: "Significant fat gain, losing muscle", score: 3 },
    ],
  },
  {
    question: "How is your sex drive and sexual performance?",
    options: [
      { text: "Strong and satisfying", score: 0 },
      { text: "Slightly reduced but manageable", score: 1 },
      { text: "Noticeably lower than a few years ago", score: 2 },
      { text: "Very low or experiencing ED", score: 3 },
    ],
  },
  {
    question: "How would you describe your mood and mental sharpness?",
    options: [
      { text: "Sharp, motivated, and positive", score: 0 },
      { text: "Occasional brain fog or irritability", score: 1 },
      { text: "Frequent mood swings or lack of motivation", score: 2 },
      { text: "Persistent depression, anxiety, or brain fog", score: 3 },
    ],
  },
  {
    question: "How is your sleep quality?",
    options: [
      { text: "Sleep well and wake refreshed", score: 0 },
      { text: "Occasional restless nights", score: 1 },
      { text: "Poor sleep most nights", score: 2 },
      { text: "Chronic insomnia or sleep apnea symptoms", score: 3 },
    ],
  },
  {
    question: "How is your strength and gym performance?",
    options: [
      { text: "Making gains or maintaining easily", score: 0 },
      { text: "Progress has slowed significantly", score: 1 },
      { text: "Losing strength despite consistent training", score: 2 },
      { text: "No longer able to train at previous intensity", score: 3 },
    ],
  },
  {
    question: "Have you had your testosterone levels tested?",
    options: [
      { text: "Yes — levels were optimal (700+ ng/dL)", score: 0 },
      { text: "Yes — levels were borderline (400–700 ng/dL)", score: 1 },
      { text: "Yes — levels were low (below 400 ng/dL)", score: 3 },
      { text: "No — never been tested", score: 2 },
    ],
  },
];

const tiers = [
  { min: 0, max: 4, label: "Optimal", color: "#22c55e", icon: "✅", headline: "Your Hormone Profile Looks Strong", body: "Your symptoms suggest your testosterone and hormone levels may be in a healthy range. That said, annual testing is the only way to know for sure — and optimal ranges are higher than most labs report as 'normal'.", cta: "SCHEDULE FREE CONSULTATION" },
  { min: 5, max: 10, label: "Moderate", color: TEAL, icon: "⚡", headline: "Early Signs of Hormonal Decline", body: "Your answers suggest you may be experiencing the early stages of testosterone decline. This is the ideal time to act — catching it early means faster results and less intervention needed.", cta: "SCHEDULE YOUR FREE CONSULTATION" },
  { min: 11, max: 16, label: "Elevated", color: "#f59e0b", icon: "⚠️", headline: "Significant Hormonal Imbalance Likely", body: "Your symptoms are consistent with clinically low testosterone and/or other hormonal imbalances. Many men in your situation see dramatic improvements within 60–90 days of starting a proper protocol.", cta: "SCHEDULE YOUR FREE CONSULTATION" },
  { min: 17, max: 21, label: "Critical", color: "#ef4444", icon: "🚨", headline: "Immediate Evaluation Recommended", body: "Your symptoms indicate a serious hormonal deficiency that is likely affecting every area of your life. Our physicians have helped thousands of men in your exact situation reclaim their health and vitality.", cta: "SCHEDULE YOUR FREE CONSULTATION" },
];

export default function MaleMetabolicQuiz({ onConsultClick, open, onClose }: { onConsultClick: () => void; open?: boolean; onClose?: () => void }) {
  if (open === false) return null;
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<typeof tiers[0] | null>(null);

  const handleAnswer = (score: number) => {
    const newScores = [...scores, score];
    if (step + 1 < questions.length) {
      setScores(newScores);
      setStep(step + 1);
    } else {
      const total = newScores.reduce((a, b) => a + b, 0);
      const tier = tiers.find(t => total >= t.min && total <= t.max) || tiers[tiers.length - 1];
      setResult(tier);
    }
  };

  const reset = () => { setStarted(false); setStep(0); setScores([]); setResult(null); };
  const progress = Math.round(((step) / questions.length) * 100);

  return (
    <section id="quiz" className="py-14 px-4" style={{ background: "#0A0F1E", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>FREE ASSESSMENT</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            CHECK YOUR HORMONE HEALTH
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>7 questions · 2 minutes · Personalized results</p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.2)" }}>
          {!started && !result && (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🧬</div>
              <h3 className="font-black text-white text-xl mb-3">Is Low Testosterone Holding You Back?</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                Answer 7 quick questions about your energy, body composition, and performance. We'll tell you where your hormone health stands and what to do next.
              </p>
              <button onClick={() => setStarted(true)}
                className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wider text-white"
                style={{ background: TEAL_GRADIENT, boxShadow: "0 6px 24px rgba(0,229,255,0.35)" }}>
                START THE ASSESSMENT →
              </button>
            </div>
          )}

          {started && !result && (
            <div className="p-6">
              {/* Progress */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Question {step + 1} of {questions.length}</span>
                <span className="text-xs font-bold" style={{ color: TEAL }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full mb-6" style={{ background: "rgba(0,229,255,0.15)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: TEAL_GRADIENT }} />
              </div>
              <h3 className="font-bold text-white text-lg mb-5 leading-snug" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {questions[step].question}
              </h3>
              <div className="space-y-3">
                {questions[step].options.map((opt) => (
                  <button key={opt.text} onClick={() => handleAnswer(opt.score)}
                    className="w-full text-left px-4 py-3.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(0,229,255,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(0,229,255,0.06)"; }}>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">{result.icon}</div>
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase mb-3"
                style={{ background: `${result.color}22`, color: result.color, border: `1px solid ${result.color}44` }}>
                {result.label} Risk
              </div>
              <h3 className="font-black text-white text-xl mb-3 leading-snug" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {result.headline}
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 420, margin: "0 auto 24px" }}>
                {result.body}
              </p>
              <button onClick={onConsultClick}
                className="w-full py-4 rounded-xl font-bold text-sm tracking-wider text-white mb-3"
                style={{ background: TEAL_GRADIENT, boxShadow: "0 8px 24px rgba(0,229,255,0.35)" }}>
                {result.cta} →
              </button>
              <button onClick={reset} className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}>
                Retake the assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
