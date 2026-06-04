/* =============================================================================
   FAQ Section — MedMethod Direct
   Tabbed/filtered layout to keep the section compact.
   Content sourced verbatim from the official MedMethod Direct FAQ.
   ============================================================================= */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ── FAQ Item (compact accordion row) ──────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(232,51,158,0.12)" }}>
      <button
        className="w-full flex items-start justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="font-bold text-[15px] md:text-base leading-snug transition-colors duration-200 group-hover:text-[#7A1E7E]"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#111111" }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{
            color: "#E8339E",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <p
          className="pb-5 pr-9 text-[14.5px] leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif", color: "#3F3F46" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

/* ── FAQ Categories ────────────────────────────────────────────────────────── */
const faqCategories: {
  id: string;
  label: string;
  icon: string;
  questions: { q: string; a: string }[];
}[] = [
  {
    id: "model",
    label: "How It Works",
    icon: "🧭",
    questions: [
      {
        q: "Why is my membership separate from my medication?",
        a: "Your membership pays for the clinical relationship — physician oversight, protocol design, coaching, and ongoing care — and it stays the same regardless of which medications you take. Medications are priced separately and transparently, so you only pay for what your physician actually prescribes. This keeps your cost honest: you're never paying a bundled markup on a drug you don't use, and you can adjust your medication stack without changing your membership.",
      },
      {
        q: "What am I actually paying for in the membership?",
        a: "The depth of your care. Ignite covers asynchronous physician access and protocol design; Transformation adds live video visits, baseline labs, structured nutrition and fitness plans, and a Performance Coach; Longevity adds quarterly physician strategy sessions, expanded diagnostics, and premium peptide access. Medications are a separate line item layered on top.",
      },
      {
        q: "Do I have to buy medication to have a membership?",
        a: "No. Your membership covers your clinical oversight whether or not you fill a prescription in a given month. Most patients pair a membership with at least one medication, but the structures are independent.",
      },
    ],
  },
  {
    id: "tier",
    label: "Choosing a Tier",
    icon: "🎯",
    questions: [
      {
        q: "How do I know whether I need Ignite, Transformation, or Longevity?",
        a: "Ignite is for the patient who knows what they want and values speed and price over coaching. Transformation is for most people — it adds the live physician relationship, baseline labs, and a Performance Coach who keeps you accountable. Longevity is for patients who want more physician strategy time, deeper diagnostic testing, and access to premium peptide protocols. When in doubt, Transformation is the right starting point for the majority of patients.",
      },
      {
        q: "Can I start on one tier and upgrade later?",
        a: "Yes. Tier upgrades are available at any time without re-enrolling, and your medication pricing carries over unchanged. Many patients begin on Transformation and move to Longevity as they get deeper into hormone optimization or want quarterly diagnostics.",
      },
      {
        q: "What's the real difference in physician access between tiers?",
        a: "Ignite is asynchronous, with live video available at $49 per visit. Transformation includes an initial live consultation plus regular video check-ins and unlimited secure messaging at a 24-hour response standard. Longevity adds a quarterly 45-minute physician strategy session and priority access at a 12-hour standard.",
      },
    ],
  },
  {
    id: "billing",
    label: "Cost & Billing",
    icon: "💳",
    questions: [
      {
        q: "Why is everything billed upfront for the full term?",
        a: "Term pricing rewards commitment with lower monthly membership rates — up to 15% on the 6-month plan and up to 23% on the 12-month plan — and committing upfront is what makes those rates possible. Your membership rate is locked in for the full term you choose.",
      },
      {
        q: "What is the initiation fee and what does it cover?",
        a: "The one-time initiation fee covers your onboarding: physician intake, custom protocol design, and dashboard setup at every tier. At Transformation it also includes your 45-minute live consultation and a baseline 30+ biomarker lab panel; at Longevity it includes a premium 75+ biomarker panel and at-home phlebotomy where available. It is not a recurring charge.",
      },
      {
        q: "Is the Ignite 12-month initiation fee waiver real?",
        a: "Yes. The $49 Ignite initiation fee is waived in full when you enroll on a 12-month plan. It applies automatically at checkout.",
      },
      {
        q: "Is financing available?",
        a: "Yes. Cherry financing is available on the 6- and 12-month plans, so you can spread the upfront cost over monthly installments while still locking in term pricing.",
      },
      {
        q: "Are there hidden fees?",
        a: "No. Your total at checkout is your membership plus any medications you select. All of our pricing is listed transparently on our website, so you always know exactly what you are paying for before you enroll. Any labs beyond what your tier includes are quoted before you commit.",
      },
      {
        q: "Does my medication price change as my dose increases?",
        a: "For some medications, yes — pricing can vary by dosage, and your cost may change if your physician adjusts your dose. We are fully transparent about this: every medication and dosage is priced exactly as listed on our website, so you always know what you will pay before any change takes effect. There are no surprise markups — just the prices as shown.",
      },
    ],
  },
  {
    id: "meds",
    label: "Medications",
    icon: "💊",
    questions: [
      {
        q: "What's the difference between compounded and brand-name medications?",
        a: "Compounded medications are prepared by licensed 503A pharmacies, while brand-name medications come from the manufacturers' own direct-pay programs. Either way, our pricing is fully transparent — every medication is priced exactly as listed on our website, so you always know what you will pay. Your physician will discuss which option is the right fit for you during your evaluation.",
      },
      {
        q: "Is compounded semaglutide or tirzepatide legitimate?",
        a: "Compounded GLP-1 medications are prepared by licensed, accredited 503A compounding pharmacies and dispensed only against a valid prescription from your physician. Your physician will discuss whether a compounded or brand-name option is appropriate for you during your evaluation.",
      },
      {
        q: "Can I switch or pause my medication mid-term?",
        a: "Yes. With physician approval, medications can be swapped or paused at any point during your term, and your membership continues uninterrupted. Any medication you add or change is priced exactly as listed on our website.",
      },
    ],
  },
  {
    id: "clinical",
    label: "Clinical & Eligibility",
    icon: "🩺",
    questions: [
      {
        q: "Is there a real doctor, and who prescribes my medication?",
        a: "Yes. MedMethod is physician-led, and every prescription is written by a licensed physician after an individual evaluation. No medication is dispensed without that review.",
      },
      {
        q: "Do I need lab work before starting?",
        a: "It depends on your tier and your physician's judgment. Transformation and Longevity include a baseline lab panel as part of onboarding; on Ignite, labs can be purchased separately if your physician determines they're needed before prescribing.",
      },
      {
        q: "What states do you serve?",
        a: "We operate across multiple states and are expanding our licensure footprint. You'll confirm eligibility for your state during enrollment before any charge is finalized.",
      },
      {
        q: "What happens if I'm not eligible after my intake?",
        a: "Eligibility for your state is confirmed during enrollment before your charge is finalized, and your membership covers a real physician evaluation regardless of the outcome. If your physician determines a specific medication isn't appropriate for you, they'll work with you to find a suitable alternative within your protocol. Please note that subscription and medication charges are final once made — we don't issue refunds. You can review the complete details in our Subscription and Refund Policy at medmethoddirect.com/subscription-policy.",
      },
    ],
  },
  {
    id: "combined",
    label: "GLP-1 + Hormones",
    icon: "⚖️",
    questions: [
      {
        q: "Can I do weight loss and hormone therapy at the same time?",
        a: "Yes — and this is what sets MedMethod apart. We're built specifically to manage GLP-1 weight-loss therapy and hormone optimization (BHRT for women, TRT for men) together, under one physician, as a single coordinated protocol. Most programs treat these in isolation; we don't.",
      },
      {
        q: "Is it safe to combine them?",
        a: "Combining metabolic and hormone therapy is exactly the kind of integrated care our model is designed to manage, with a single physician overseeing both so the protocols are coordinated rather than working against each other. Your physician will evaluate your full picture and design a plan specific to you. Both BHRT and TRT are available starting at the Transformation tier.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Logistics",
    icon: "🔒",
    questions: [
      {
        q: "Is my health information private?",
        a: "Yes, and we take it seriously. Your records live in a HIPAA-compliant clinical system, and we've deliberately built our infrastructure to avoid the kind of large-scale data exposure that has affected other telehealth operators. We don't sell your data.",
      },
      {
        q: "How fast can I get started?",
        a: "Most patients complete enrollment and physician intake quickly, with medication shipping shortly after your prescription is written. Transformation and Longevity patients schedule their live consultation as part of onboarding.",
      },
      {
        q: "How does my medication ship?",
        a: "Compounded medications ship directly from our partner pharmacies to your door; brand-name prescriptions ship from the manufacturers' direct programs. Refills are coordinated through your dashboard so you're not managing it manually.",
      },
      {
        q: "What's the cancellation and refund policy?",
        a: "You can cancel your subscription at any time, and it will stop renewing going forward — you're never locked into another term. All sales are final, however: subscription and medication charges are final at the time they're made, and we don't issue refunds for any period already billed. Full billing and cancellation details are in our Subscription and Refund Policy at medmethoddirect.com/subscription-policy. Tier upgrades and medication changes never require re-enrollment.",
      },
    ],
  },
];

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function FAQ({ onConsultClick }: { onConsultClick?: () => void }) {
  const [activeTab, setActiveTab] = useState(faqCategories[0].id);
  const activeCategory = faqCategories.find((c) => c.id === activeTab)!;

  return (
    <section id="faq" className="bg-white py-12 md:py-16 lg:py-24">
      <div className="max-w-[900px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-7 md:mb-10">
          <p
            className="text-sm font-bold tracking-normal mb-3"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Before you enroll
          </p>
          <h2
            className="font-black leading-[1.1]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
              color: "#111111",
            }}
          >
            Frequently Asked{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
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
        <div className="flex flex-wrap justify-center gap-2 mb-7 md:mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-3.5 md:px-4 py-2 md:py-2.5 rounded-full text-[13px] md:text-sm font-semibold transition-all duration-200 border cursor-pointer whitespace-nowrap"
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
        <div className="min-h-[260px]">
          <div className="mb-3 flex items-baseline justify-between">
            <p
              className="text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#7A1E7E", fontFamily: "Montserrat, sans-serif" }}
            >
              {activeCategory.label}
            </p>
            <p
              className="text-xs"
              style={{ fontFamily: "Inter, sans-serif", color: "#888" }}
            >
              {activeCategory.questions.length}{" "}
              {activeCategory.questions.length === 1 ? "question" : "questions"}
            </p>
          </div>
          {activeCategory.questions.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* ── Post-FAQ CTA ─────────────────────────────────────────────── */}
        <div
          className="mt-10 md:mt-14 text-center rounded-2xl px-6 py-8 md:py-10"
          style={{
            background: "linear-gradient(135deg, rgba(232,51,158,0.06) 0%, rgba(122,30,126,0.06) 100%)",
            border: "1px solid rgba(232,51,158,0.15)",
          }}
        >
          <p
            className="font-bold mb-2"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", color: "#111", fontFamily: "Montserrat, sans-serif" }}
          >
            Still have questions?
          </p>
          <p
            className="mb-5 mx-auto max-w-md"
            style={{ fontSize: 14.5, color: "#555", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
          >
            Schedule a free 15-minute discovery call with our care team. No commitment, no pressure — just answers.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onConsultClick?.(); }}
            className="inline-flex items-center gap-2 font-bold text-white text-sm tracking-wide px-7 py-3.5 rounded-full transition-transform duration-150 active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
          >
            Schedule a Discovery Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
