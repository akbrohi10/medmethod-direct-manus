/* =============================================================================
   FAQ Section — MedMethod Direct
   Clinical Noir Design | Women 40+ focused questions
   ============================================================================= */
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What makes MedMethod Direct different from other telehealth services?",
    a: "Most telehealth services ship you a box and disappear. MedMethod Direct provides a more responsible, doctor-led path — starting with comprehensive labs and a deep-dive diagnostic to build a fully customized plan. We meet with you virtually every two weeks to complete a weigh-in, closely track your progress, and provide personalized recommendations. You'll work with the same doctor and the same dedicated Wellness Advisor throughout your entire journey.",
  },
  {
    q: "I'm a woman over 40 and feel like my body is working against me. Can you help?",
    a: "Yes — this is exactly who we're built for. Night sweats, brain fog, mood swings, hormonal weight gain, low energy, low libido — these are not just 'part of aging.' They're symptoms of hormonal imbalance that can be addressed with the right clinical approach. We start with comprehensive labs to find the real answers, then build a personalized plan to help you feel like yourself again.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "It starts with a free virtual consultation with one of our board-certified physicians. Then we order comprehensive lab work at a local lab near you. Once we have your results, your doctor builds a fully customized treatment protocol, personalized nutrition program, and custom fitness plan. After that, we meet with you virtually every two weeks to track progress and adjust your plan. You'll always work with the same doctor and Wellness Advisor.",
  },
  {
    q: "How is this different from just getting a prescription online?",
    a: "We don't just prescribe and disappear. Our approach includes comprehensive diagnostics, a personalized multi-faceted plan (treatment + nutrition + fitness), bi-weekly check-ins with your doctor, ongoing monitoring and adjustments, and a dedicated Wellness Advisor who supports you every step of the way. We treat the whole person, not just a symptom.",
  },
  {
    q: "What kind of lab work do you order?",
    a: "We order comprehensive panels that go far beyond what most primary care physicians check. This includes full hormone panels (estrogen, progesterone, testosterone, DHEA, cortisol), thyroid function, metabolic markers, inflammatory markers, vitamin levels, and more. This deep-dive diagnostic is what allows us to build a truly personalized plan — not a guess.",
  },
  {
    q: "Is everything done virtually?",
    a: "Yes — all consultations, follow-ups, and ongoing care are conducted via telehealth. You'll complete lab work at a local lab near you (we'll provide the order), and your medications (FDA-approved brand or compounded from a licensed 503B outsourcing pharmacy) and supplements are shipped directly to your home. No waiting rooms, no commuting, no disruption to your schedule.",
  },
  {
    q: "How quickly will I see results?",
    a: "Many patients report noticeable improvements in sleep, energy, and mood within 4–6 weeks of starting treatment. Optimal hormone balance typically occurs at the 3–6 month mark. Weight loss results vary, but most patients see meaningful progress within the first 4–8 weeks, especially when the nutrition and fitness plan is followed alongside medical treatment.",
  },
  {
    q: "What does treatment cost?",
    a: "We offer transparent, flat-rate pricing with no hidden fees. Your free consultation will include a full breakdown of pricing for your personalized plan. We offer flexible payment options and accept HSA/FSA. We believe premium, personalized care should be accessible — and we're committed to being upfront about every cost.",
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
