/* MaleFAQ.tsx — Men's Health FAQ */
import { useState } from "react";
import { pricingFaqs } from "@/data/pricingFaqs";
import { ChevronDown } from "lucide-react";

const TEAL = "#00E5FF";

const faqs = [
  { q: "Is TRT safe?", a: "When properly prescribed and monitored by a board-certified physician, TRT is safe and well-tolerated. We monitor your labs quarterly — including testosterone, estradiol, PSA, hematocrit, and cardiovascular markers — to ensure you stay in a healthy range throughout your program." },
  { q: "How long before I see results?", a: "Most men notice improved energy and mood within 2–4 weeks. Body composition changes (fat loss, muscle gain) typically become visible at 8–12 weeks. Full optimization — where you feel your best — usually occurs between 3–6 months." },
  { q: "Do I need to come into a clinic?", a: "No. MedMethod Direct is 100% virtual. Your lab kit is shipped to your home or you visit a local lab. All consultations are conducted via video call. Your medication — FDA-approved brand or compounded from a licensed 503B outsourcing pharmacy — is delivered directly to your door." },
  { q: "What does the $449 diagnostic setup fee cover?", a: "The one-time $449 fee covers your comprehensive hormone panel (testosterone, estradiol, SHBG, LH, FSH, prolactin, DHEA-S, cortisol), metabolic and cardiovascular markers (CBC, CMP, lipid panel, HbA1c, PSA, thyroid, vitamin D), a physician consultation to review your results, and your personalized protocol. You pay this once — never again." },
  { q: "Will TRT affect my fertility?", a: "Exogenous testosterone can suppress sperm production. If fertility is a concern, we can incorporate HCG into your protocol to maintain testicular function and sperm production. This is discussed during your initial physician consultation." },
  { q: "What is the minimum program commitment?", a: "All programs require a minimum 6-month commitment. This is because hormone optimization takes time — most men don't reach their full potential until month 3–4. A 6-month commitment ensures you get the results you came for." },
  { q: "Do you use FDA-approved medications or compounded ones?", a: "Both — and the distinction matters. FDA-approved brand-name medications like Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, and Zepbound\u00ae have undergone full FDA review for safety and efficacy. Compounded medications use the same active ingredients (Semaglutide or Tirzepatide) but are prepared by a licensed 503B outsourcing facility — a federally registered, FDA-inspected pharmacy held to strict quality and sterility standards. Compounded options are often more affordable and allow for custom dosing. Your physician will discuss both options during your consultation and recommend the best fit based on your insurance, budget, and clinical needs. Either way, your medication ships directly to your door." },
  ...pricingFaqs,
  { q: "Do you accept insurance?", a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process." },
  { q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?", a: "Yes — we can write prescriptions for brand-name medications (Ozempic\u00ae, Wegovy\u00ae, Mounjaro\u00ae, Zepbound\u00ae) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. In many cases, compounded semaglutide or tirzepatide from our licensed 503B pharmacy is more affordable and ships directly to your door without the insurance process. Your physician will walk you through both options during your consultation." },
  { q: "What if my levels are already 'normal'?", a: "Standard lab reference ranges are based on population averages — not optimal health. A man at 350 ng/dL is technically 'normal' but may feel terrible. We target functional optimization ranges (typically 700–1100 ng/dL) based on your symptoms and goals." },
];

export default function MaleFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-14 px-4" style={{ background: "#EDE9E1", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: TEAL }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>FAQ</span>
            <div className="h-px w-10" style={{ background: TEAL }} />
          </div>
          <h2 className="font-black mb-2" style={{ color: "#0A1628", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
            COMMON QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all"
              style={{ background: "#fff", border: `1px solid ${open === i ? "rgba(0,229,255,0.5)" : "rgba(0,229,255,0.2)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm pr-4" style={{ color: "#0A1628" }}>{faq.q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: TEAL, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(10,22,40,0.6)" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
