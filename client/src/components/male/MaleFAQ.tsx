/* =============================================================================
   MaleFAQ.tsx — Men's Health FAQ
   Tabbed category layout | Compact accordion | Cyan (#00E5FF) accent
   ============================================================================= */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pricingFaqs } from "@/data/pricingFaqs";

const TEAL = "#00E5FF";
const DARK = "#0A1628";

/* ── FAQ Item (compact accordion row) ──────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(0,229,255,0.15)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="font-bold text-base"
          style={{ fontFamily: "Montserrat, sans-serif", color: DARK }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ color: TEAL, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p
          className="pb-5 text-sm leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(10,22,40,0.6)" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

/* ── FAQ Categories ────────────────────────────────────────────────────────── */
const faqCategories = [
  {
    id: "trt",
    label: "TRT & Hormones",
    icon: "💉",
    questions: [
      { q: "Is TRT safe?", a: "When properly prescribed and monitored by a board-certified physician, TRT is safe and well-tolerated. We monitor your labs quarterly — including testosterone, estradiol, PSA, hematocrit, and cardiovascular markers — to ensure you stay in a healthy range throughout your program." },
      { q: "How long before I see results?", a: "Most men notice improved energy and mood within 2–4 weeks. Body composition changes (fat loss, muscle gain) typically become visible at 8–12 weeks. Full optimization — where you feel your best — usually occurs between 3–6 months." },
      { q: "Will TRT affect my fertility?", a: "Exogenous testosterone can suppress sperm production. If fertility is a concern, we can incorporate HCG into your protocol to maintain testicular function and sperm production. This is discussed during your initial physician consultation." },
      { q: "What if my levels are already 'normal'?", a: "Standard lab reference ranges are based on population averages — not optimal health. A man at 350 ng/dL is technically 'normal' but may feel terrible. We target functional optimization ranges (typically 700–1100 ng/dL) based on your symptoms and goals." },
    ],
  },
  {
    id: "program",
    label: "Program & Process",
    icon: "🩺",
    questions: [
      { q: "Do I need to come into a clinic?", a: "No. MedMethod Direct is 100% virtual. Your lab kit is shipped to your home or you visit a local lab. All consultations are conducted via video call. Your medication — FDA-approved brand or compounded from a licensed 503B pharmacy — is delivered directly to your door." },
      { q: "What does the $449 diagnostic setup fee cover?", a: "The one-time $449 fee covers your comprehensive hormone panel (testosterone, estradiol, SHBG, LH, FSH, prolactin, DHEA-S, cortisol), metabolic and cardiovascular markers (CBC, CMP, lipid panel, HbA1c, PSA, thyroid, vitamin D), a physician consultation to review your results, and your personalized protocol. You pay this once — never again." },
      { q: "What is the minimum program commitment?", a: "All programs require a minimum 6-month commitment. This is because hormone optimization takes time — most men don't reach their full potential until month 3–4. A 6-month commitment ensures you get the results you came for." },
      { q: "Do you use FDA-approved medications or compounded ones?", a: "Both — and the distinction matters. FDA-approved brand-name medications like Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, and Zepbound\u00ae have undergone full FDA review for safety and efficacy. Compounded medications use the same active ingredients (Semaglutide or Tirzepatide) but are prepared by a licensed 503B outsourcing facility — a federally registered, FDA-inspected pharmacy held to strict quality and sterility standards. Compounded options are often more affordable and allow for custom dosing. Your physician will discuss both options during your consultation and recommend the best fit based on your insurance, budget, and clinical needs. Either way, your medication ships directly to your door." },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "💳",
    questions: [
      ...pricingFaqs,
      { q: "Do you accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process." },
      { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "Yes — we can write prescriptions for brand-name medications (Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, Zepbound\u00ae) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation." },
    ],
  },
];

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function MaleFAQ() {
  const [activeTab, setActiveTab] = useState("trt");
  const activeCategory = faqCategories.find((c) => c.id === activeTab)!;

  return (
    <section id="faq" className="py-14 px-4" style={{ background: "#EDE9E1", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>FAQ</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black mb-2" style={{ color: DARK, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            COMMON QUESTIONS
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background:
                  activeTab === cat.id
                    ? `linear-gradient(135deg, ${TEAL} 0%, #00B8CC 100%)`
                    : "#fff",
                color: activeTab === cat.id ? DARK : "#555",
                borderColor: activeTab === cat.id ? "transparent" : "#e5e5e5",
                boxShadow:
                  activeTab === cat.id
                    ? "0 4px 14px rgba(0,229,255,0.25)"
                    : "none",
              }}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div className="min-h-[200px]">
          <div className="mb-4">
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: TEAL, fontFamily: "Montserrat, sans-serif" }}
            >
              {activeCategory.label}
            </p>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#888" }}
            >
              {activeCategory.questions.length} questions
            </p>
          </div>
          {activeCategory.questions.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
