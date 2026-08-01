/* =============================================================================
   FAQ Section — MedMethod Direct
   Tabbed category layout | Compact accordion | Women 40+ focused questions
   ============================================================================= */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pricingFaqs } from "@/data/pricingFaqs";

/* ── FAQ Item (compact accordion row) ──────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(232,51,158,0.15)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="font-bold text-base"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ color: "#E8339E", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p
          className="pb-5 text-sm leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#444" }}
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
    id: "about",
    label: "About Our Care",
    icon: "🩺",
    questions: [
      {
        q: "What makes MedMethod Direct different from other telehealth services?",
        a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path — starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Performance Coach throughout your entire journey.",
      },
      {
        q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
        a: "Yes — this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido — these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
      },
      {
        q: "What does the process look like from start to finish?",
        a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Performance Coach.",
      },
      {
        q: "How is this different from just getting a prescription online?",
        a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Performance Coach who supports you every step of the way. We treat the whole person, not just a symptom.",
      },
    ],
  },
  {
    id: "medications",
    label: "Medications & Labs",
    icon: "💊",
    questions: [
      {
        q: "What kind of lab work do you order?",
        a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan — not a guess.",
      },
      {
        q: "Is everything done virtually?",
        a: "Yes — all consultations, follow-ups, and ongoing care are conducted via telehealth. You'll complete lab work at a local lab near you (we'll provide the order), and your FDA-approved medications and supplements are shipped directly to your home. No waiting rooms, no commuting, no disruption to your schedule.",
      },
      {
        q: "How quickly will I see results?",
        a: "Many patients report noticeable improvements in sleep, energy, and mood within 4–6 weeks of starting treatment. Optimal hormone balance typically occurs at the 3–6 month mark. Weight loss results vary, but most patients see meaningful progress within the first 4–8 weeks, especially when the nutrition and fitness plan is followed alongside medical treatment.",
      },
      {
        q: "What medications do you prescribe?",
        a: "We prescribe FDA-approved brand-name medications including Ozempic®, Wegovy®, Mounjaro®, and Zepbound® — all of which have undergone full FDA review for safety and efficacy. Your physician will discuss the best option during your consultation based on your clinical needs and goals. Your medication ships directly to your door.",
      },
      {
        q: "Can you prescribe brand-name GLP-1 medications so I can use my insurance at the pharmacy?",
        a: "Yes — we can write prescriptions for brand-name medications (Ozempic®, Wegovy®, Mounjaro®, Zepbound®) that you can take to your pharmacy and attempt to run through your insurance. However, most insurance plans either exclude GLP-1s for weight loss entirely, or require prior authorization. If your plan requires a prior authorization, we can complete one for an additional fee — but please be aware that if it is denied, we do not complete appeals. Your physician will walk you through all options during your consultation.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: "💳",
    questions: [
      {
        q: "How is pricing structured?",
        a: "Your first visit is $199 total — $50 deposit to reserve your appointment, $149 due at the time of your visit. This covers your 45-minute consultation with Dr. Al-Deek, your personalized treatment plan, prescription (if appropriate), and 30 days of direct text access with Dr. Al-Deek. Medication is separate and billed based on what Dr. Al-Deek prescribes — both brand-name and compounded options are available. After your first visit, follow-up options depend on which plan works best for your care — Dr. Al-Deek will walk you through both at your appointment. We accept HSA/FSA. No insurance needed.",
      },
      ...pricingFaqs,
      {
        q: "Do you accept insurance?",
        a: "MedMethod Direct is a cash-pay practice. We do not bill insurance directly. Many patients use HSA or FSA funds, and we provide detailed receipts that can be submitted for potential out-of-network reimbursement. We're happy to provide documentation to support that process.",
      },
    ],
  },
];

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function FAQ() {
  const [activeTab, setActiveTab] = useState("about");
  const activeCategory = faqCategories.find((c) => c.id === activeTab)!;

  return (
    <section id="faq" className="bg-white py-16 lg:py-24">
      <div className="max-w-[900px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Questions & Answers
          </p>
          <h2
            className="font-black leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#111111",
            }}
          >
            Frequently Asked{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Questions
            </span>
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
                    ? "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)"
                    : "#fff",
                color: activeTab === cat.id ? "#fff" : "#555",
                borderColor: activeTab === cat.id ? "transparent" : "#e5e5e5",
                boxShadow:
                  activeTab === cat.id
                    ? "0 4px 14px rgba(232,51,158,0.25)"
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
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
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
