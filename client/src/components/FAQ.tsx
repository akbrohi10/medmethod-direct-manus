/* =============================================================================
   FAQ Section — Clinical Noir Design
   White background accordion with gradient accents
   ============================================================================= */
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is MedMethod Direct and how does it work?",
    a: "MedMethod Direct is a premium virtual medical clinic specializing in hormone optimization, medically supervised weight loss, and longevity protocols. You start with a free virtual consultation, complete lab work at a local lab, and then receive a personalized treatment plan from a board-certified physician — all from the comfort of your home. Medications are delivered directly to your door.",
  },
  {
    q: "How do I know if I qualify for hormone therapy?",
    a: "Qualification is based on your symptoms, lab results, health history, and a thorough evaluation by our licensed medical providers. Common signs that you may benefit include fatigue, low libido, difficulty building muscle, brain fog, mood changes, or unexplained weight gain. Your free consultation is the first step to finding out.",
  },
  {
    q: "Is MedMethod Direct 100% virtual?",
    a: "Yes — all consultations, follow-ups, and ongoing care are conducted via telehealth. You'll complete lab work at a local lab near you (we'll provide the order), and your medications are shipped directly to your home. No waiting rooms, no commuting.",
  },
  {
    q: "What states do you serve?",
    a: "MedMethod Direct currently serves patients in most U.S. states. During your free consultation, we'll confirm availability in your state and ensure your treatment plan complies with local regulations.",
  },
  {
    q: "How long before I see results?",
    a: "Many patients report noticeable improvements in energy, sleep, and mood within 4–6 weeks of starting treatment. Optimal results for hormone optimization typically occur at the 3–6 month mark as your levels stabilize. Weight loss results vary but most patients see meaningful progress within the first 4–8 weeks.",
  },
  {
    q: "Is my information kept private and confidential?",
    a: "Absolutely. We take your privacy extremely seriously. All consultations are conducted via HIPAA-compliant telehealth platforms, your medical records are encrypted and secure, and your medications arrive in discreet, unmarked packaging.",
  },
  {
    q: "What does treatment cost?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Costs vary by treatment protocol. Your free consultation will include a full breakdown of pricing for your personalized plan. We also offer flexible payment options and accept HSA/FSA.",
  },
  {
    q: "Do I need a referral from my primary care doctor?",
    a: "No referral is required. MedMethod Direct operates as an independent telehealth clinic. However, we encourage open communication with your primary care provider and can share your treatment records with them upon request.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span
              className="section-label block mb-3"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Common Questions
            </span>
            <h2
              className="font-black text-[#111111] leading-tight mb-6"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              FREQUENTLY
              <br />
              ASKED
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                QUESTIONS
              </span>
            </h2>
            <p
              className="text-gray-600 leading-relaxed mb-8"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem" }}
            >
              Have more questions? Our care team is available to help you understand your options and get started on your path to longevity.
            </p>
            <a
              href="#consultation"
              className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider inline-block"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              SPEAK WITH A PROVIDER
            </a>
          </div>

          {/* Right: Accordion */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  borderColor: open === i ? "rgba(232,51,158,0.3)" : "#e5e7eb",
                  background: open === i ? "rgba(232,51,158,0.03)" : "white",
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span
                    className="font-bold text-[#111111] pr-4"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}
                  >
                    {faq.q}
                  </span>
                  <div
                    className="flex-none w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: open === i
                        ? "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)"
                        : "#f3f4f6",
                    }}
                  >
                    {open === i
                      ? <Minus className="w-3.5 h-3.5 text-white" />
                      : <Plus className="w-3.5 h-3.5 text-gray-500" />
                    }
                  </div>
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p
                      className="text-gray-600 leading-relaxed"
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
