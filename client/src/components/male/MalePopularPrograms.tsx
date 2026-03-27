/* MalePopularPrograms.tsx — Warm Cream + Navy theme — exact data from pricing_sheet_men.html */
import { useState } from "react";
import { Check } from "lucide-react";

const MONTHLY = { t1: 199, t2: 349, t3: 449 };
const ANNUAL  = { t1: 166, t2: 291, t3: 374 };
const ANNUAL_TOTAL = { t1: 1990, t2: 3490, t3: 4490 };
const SAVINGS = { t1: 398, t2: 698, t3: 898 };

interface Feature { text: string; sub?: string; included?: boolean; }

const TIER1_FEATURES: Feature[] = [
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Prescriptions Called In to Your Local Pharmacy" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
];

const TIER2_FEATURES: Feature[] = [
  { text: "Testosterone Replacement Therapy (TRT) — Delivered to Your Door" },
  { text: "Semaglutide (FDA-approved brand or 503B-compounded) — For Metabolic & Weight Optimization" },
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
  { text: "Quarterly Blood Lab Testing", included: true },
];

const TIER3_FEATURES: Feature[] = [
  { text: "Testosterone Replacement Therapy (TRT) — Optimized Dosing Protocol" },
  { text: "Tirzepatide (FDA-approved brand or 503B-compounded) — Superior Body Composition Results" },
  { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
  { text: "Quarterly 1-on-1 Doctor Strategy Session" },
  { text: "Direct Text Access (Business Hours)" },
  { text: "Custom Fitness & Nutrition Program (on the app)" },
  { text: "Clinical Performance Dashboard" },
  { text: "Quarterly Blood Lab Testing", included: true },
];

function FeatureItem({ feature, navy }: { feature: Feature; navy?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: navy ? "rgba(13,26,42,0.07)" : "#EDF7F7" }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: navy ? "#0A1628" : "#2ABFBF" }} strokeWidth={2.5} />
      </span>
      <span className="text-[13px] font-semibold leading-snug" style={{ color: "#2A3545" }}>
        {feature.text}
        {feature.included && (
          <span
            className="ml-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{
              background: navy ? "rgba(13,26,42,0.08)" : "rgba(42,191,191,0.12)",
              color: navy ? "#0A1628" : "#1A9090",
            }}
          >
            Included
          </span>
        )}
        {feature.sub && (
          <span
            className="block text-[10px] font-bold uppercase tracking-wide mt-0.5"
            style={{ color: navy ? "#0A1628" : "#2ABFBF" }}
          >
            {feature.sub}
          </span>
        )}
      </span>
    </li>
  );
}

export default function MalePopularPrograms({ onConsultClick }: { onConsultClick: () => void }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const price = isAnnual ? ANNUAL : MONTHLY;

  return (
    <section id="programs" className="py-20 px-4" style={{ background: "#EDE9E1" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[4px] uppercase mb-3" style={{ color: "#2ABFBF" }}>PRICING</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#0A1628" }}>
            Choose Your <span style={{ color: "#2ABFBF" }}>Track</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#6A6050" }}>
            Testosterone Optimization · Medical Weight Loss · Longevity — Physician-Led. Advisor-Supported. Results-Driven.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span
            className="text-sm font-bold cursor-pointer"
            style={{ color: isAnnual ? "#B0A898" : "#0A1628" }}
            onClick={() => setIsAnnual(false)}
          >Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full transition-all focus:outline-none"
            style={{ background: "linear-gradient(135deg, #2ABFBF, #1A9090)" }}
          >
            <span
              className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-md transition-all duration-300"
              style={{ left: isAnnual ? "27px" : "3px" }}
            />
          </button>
          <span
            className="text-sm font-bold cursor-pointer"
            style={{ color: isAnnual ? "#0A1628" : "#B0A898" }}
            onClick={() => setIsAnnual(true)}
          >Annual</span>
          {isAnnual && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #2ABFBF, #1A9090)" }}
            >2 Months Free</span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

          {/* TIER 1 */}
          <div
            className="bg-white rounded-2xl p-8 flex flex-col relative"
            style={{ border: "1.5px solid #E5DFD5", boxShadow: "0 4px 20px rgba(13,26,42,0.06)" }}
          >
            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#9A9080" }}>
              Hormone &amp; Health Management
            </p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-xl font-black pb-2.5" style={{ color: "#0A1628" }}>$</span>
              <span className="text-6xl font-black leading-none tracking-tight" style={{ color: "#0A1628" }}>{price.t1}</span>
              <span className="text-sm font-semibold pb-2.5" style={{ color: "#B0A898" }}>/mo</span>
            </div>
            {isAnnual && (
              <p className="text-[11px] font-semibold mb-1" style={{ color: "#2ABFBF" }}>
                Billed ${ANNUAL_TOTAL.t1.toLocaleString()}/yr — Save ${SAVINGS.t1}
              </p>
            )}
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#9A9080" }}>
              Physician-supervised hormone oversight and accountability coaching — for men who want expert guidance managing their own health.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "#F0EBE0", color: "#9A9080", border: "1px solid #E5DFD5" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              No Medication Included
            </div>
            <hr className="mb-5" style={{ borderColor: "#EDE8DE" }} />
            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER1_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} />)}
            </ul>
            <div
              className="rounded-lg px-3 py-2.5 text-xs mb-6 leading-relaxed"
              style={{ background: "#F5F0E8", border: "1px solid #E5DFD5", color: "#9A9080" }}
            >
              🩸 <strong style={{ color: "#2A3545" }}>Quarterly Blood Lab Testing</strong> — Add-on available at discounted rate
            </div>
            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
              style={{ border: "2px solid #D5CFC5", background: "transparent", color: "#0A1628" }}
            >
              Start Hormone Track
            </button>
          </div>

          {/* TIER 2 — HERO */}
          <div
            className="bg-white rounded-2xl flex flex-col relative"
            style={{
              border: "2px solid #2ABFBF",
              padding: "40px 28px 34px",
              boxShadow: "0 0 0 5px rgba(42,191,191,0.09), 0 16px 48px rgba(42,191,191,0.13)",
            }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #2ABFBF, #1A9090)" }}
            >
              ⭐ Most Popular
            </div>
            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#2ABFBF" }}>
              Metabolic &amp; Testosterone Track
            </p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-xl font-black pb-2.5" style={{ color: "#2ABFBF" }}>$</span>
              <span className="text-6xl font-black leading-none tracking-tight" style={{ color: "#0A1628" }}>{price.t2}</span>
              <span className="text-sm font-semibold pb-2.5" style={{ color: "#B0A898" }}>/mo</span>
            </div>
            {isAnnual && (
              <p className="text-[11px] font-semibold mb-1" style={{ color: "#2ABFBF" }}>
                Billed ${ANNUAL_TOTAL.t2.toLocaleString()}/yr — Save ${SAVINGS.t2}
              </p>
            )}
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#9A9080" }}>
              Our complete men's metabolic reset — TRT + FDA-approved or 503B-compounded GLP-1 therapy, physician-designed for body recomposition.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "rgba(42,191,191,0.09)", color: "#1A9090", border: "1px solid rgba(42,191,191,0.28)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              TRT + Semaglutide
            </div>
            <hr className="mb-5" style={{ borderColor: "rgba(42,191,191,0.22)" }} />
            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER2_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} />)}
            </ul>
            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2ABFBF, #1A9090)", boxShadow: "0 8px 24px rgba(42,191,191,0.26)" }}
            >
              Start Metabolic Track
            </button>
          </div>

          {/* TIER 3 */}
          <div
            className="bg-white rounded-2xl p-8 flex flex-col relative"
            style={{ border: "2px solid #0A1628", boxShadow: "0 4px 20px rgba(13,26,42,0.10)" }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{ background: "#0A1628" }}
            >
              ✦ Most Complete
            </div>
            <p className="text-[11px] font-black tracking-[2.5px] uppercase mb-4" style={{ color: "#0A1628" }}>
              Elite Performance &amp; Longevity Track
            </p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-xl font-black pb-2.5" style={{ color: "#0A1628" }}>$</span>
              <span className="text-6xl font-black leading-none tracking-tight" style={{ color: "#0A1628" }}>{price.t3}</span>
              <span className="text-sm font-semibold pb-2.5" style={{ color: "#B0A898" }}>/mo</span>
            </div>
            {isAnnual && (
              <p className="text-[11px] font-semibold mb-1" style={{ color: "#0A1628" }}>
                Billed ${ANNUAL_TOTAL.t3.toLocaleString()}/yr — Save ${SAVINGS.t3}
              </p>
            )}
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#9A9080" }}>
              The full longevity stack — TRT + FDA-approved or 503B-compounded Tirzepatide for maximum body recomposition, energy, and peak performance at any age.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide mb-5 w-fit"
              style={{ background: "rgba(13,26,42,0.06)", color: "#0A1628", border: "1px solid rgba(13,26,42,0.18)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              TRT + Tirzepatide
            </div>
            <hr className="mb-5" style={{ borderColor: "rgba(13,26,42,0.12)" }} />
            <ul className="flex flex-col gap-3 mb-6 flex-1">
              {TIER3_FEATURES.map((f, i) => <FeatureItem key={i} feature={f} navy />)}
            </ul>
            <button
              onClick={onConsultClick}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-80"
              style={{ background: "#0A1628", border: "2px solid #0A1628" }}
            >
              Go Elite Performance
            </button>
          </div>

        </div>

        {/* Footer trust pills */}
        <div className="mt-10 pt-6 border-t flex flex-wrap justify-center gap-6" style={{ borderColor: "#E5DFD5" }}>
          {[
            "6 or 12-Month Commitment Programs",
            "$449 One-Time Onboarding Fee",
            "Licensed Physicians — All 50 States",
            "HIPAA Compliant & Secure",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs font-semibold" style={{ color: "#6A6050" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #2ABFBF, #1A9090)" }} />
              {item}
            </div>
          ))}
        </div>
        <p className="text-center text-[10.5px] mt-3" style={{ color: "#B0A898" }}>
          FDA-approved brand medications or compounded alternatives from licensed 503B outsourcing pharmacies. Individual results may vary.
        </p>

      </div>
    </section>
  );
}
