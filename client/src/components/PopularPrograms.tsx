/* =============================================================================
   Popular Programs — MedMethod Direct
   Pricing section with monthly/annual toggle, 3 tier cards
   No logo in this section per design spec
   ============================================================================= */
import { useState } from "react";
import { Check, FlaskConical, UserRound, Scale, Smartphone, ShieldCheck } from "lucide-react";

const monthly = { t1: 199, t2: 349, t3: 449 };
const annual  = { t1: 166, t2: 291, t3: 374 };
const annualTotal = { t1: 1990, t2: 3490, t3: 4490 };
const savings = { t1: 398, t2: 698, t3: 898 };

export default function PopularPrograms() {
  const [isAnnual, setIsAnnual] = useState(true);

  const p = isAnnual ? annual : monthly;

  return (
    <section
      className="py-10 px-4"
      style={{ background: "#F4F4F8", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "#111",
              letterSpacing: "-0.02em",
            }}
          >
            POPULAR PROGRAMS
          </h2>

        </div>

        {/* ── STEP 1: Clinical Diagnostic & Setup ── */}
        <div
          className="rounded-2xl overflow-hidden mb-12"
          style={{ border: "1.5px solid #E2E2EA", background: "#fff" }}
        >
          {/* Step label */}
          <div className="text-center pt-8 pb-2">
            <span
              className="text-xs font-extrabold tracking-widest uppercase"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Step 1: Your Foundation
            </span>
            <h3
              className="font-black mt-1 mb-2"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                color: "#111",
                letterSpacing: "-0.02em",
              }}
            >
              Clinical Diagnostic &amp; Setup
            </h3>
            <p
              className="text-gray-500 text-sm max-w-lg mx-auto px-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Before we prescribe, we diagnose. Your setup fee covers the diagnostic bloodwork and
              high-tech tools needed to ensure you never walk alone.
            </p>
          </div>

          {/* Two-column body */}
          <div className="flex flex-col md:flex-row">

            {/* Left: What you receive */}
            <div className="flex-1 p-8">
              <div
                className="flex items-center gap-2 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: "#E8339E" }} />
                <span className="text-xs font-extrabold tracking-widest uppercase text-gray-500">
                  What You Receive
                </span>
              </div>

              {[
                {
                  icon: FlaskConical,
                  title: "Comprehensive Diagnostic Bloodwork",
                  desc: "Full professional blood lab work for hormone & metabolic health.",
                  value: "$350+",
                },
                {
                  icon: UserRound,
                  title: "Dedicated Doctor Consultation",
                  desc: "Private strategy session to build your clinical protocol.",
                  value: "$250+",
                },
                {
                  icon: Scale,
                  title: "MedMethod Smart Scale",
                  desc: "Sync-enabled hardware for real-time body monitoring.",
                  value: "$100+",
                },
                {
                  icon: Smartphone,
                  title: "Fitness & Nutrition App Set Up",
                  desc: "Custom movement & nutrition command center.",
                  value: "$50+",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 mb-5">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(232,51,158,0.12), rgba(122,30,126,0.12))",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#E8339E" }} />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-bold text-sm text-[#111]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-gray-500 text-xs mt-0.5"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.desc}
                      </div>
                    </div>
                    <div
                      className="text-sm font-bold flex-shrink-0"
                      style={{ color: "#BBBBC8", fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}

              {/* Total value */}
              <div
                className="flex items-center justify-between pt-5 mt-2"
                style={{ borderTop: "1.5px solid #E2E2EA" }}
              >
                <span
                  className="text-sm font-extrabold uppercase tracking-wider text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Total Real-World Value
                </span>
                <span
                  className="text-xl font-black"
                  style={{
                    background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  $750+
                </span>
              </div>
            </div>

            {/* Right: Price card */}
            <div
              className="md:w-72 flex-shrink-0 flex flex-col justify-between p-8 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
              style={{ background: "#0D0D1A" }}
            >
              {/* Launch special badge */}
              <div>
                <span
                  className="inline-block text-white text-xs font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                  style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
                >
                  Launch Special
                </span>

                {/* Shield icon */}
                <div className="mb-4">
                  <ShieldCheck
                    className="w-12 h-12 opacity-20"
                    style={{ color: "#fff" }}
                  />
                </div>

                <p
                  className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Your Clinical Setup Fee
                </p>
                <div className="flex items-start gap-1 mb-1">
                  <span
                    className="text-white font-black text-2xl mt-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    $
                  </span>
                  <span
                    className="font-black text-white leading-none"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "5rem" }}
                  >
                    449
                  </span>
                </div>
                <p
                  className="font-bold text-sm mb-6"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background: "linear-gradient(135deg, #E8339E, #B040C0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  One-Time Diagnostic Investment
                </p>

                {/* Checklist */}
                <ul className="space-y-2 mb-8">
                  {[
                    "Includes Diagnostic Bloodwork",
                    "Dedicated Doctor Consultation",
                    "Includes Smart Scale + FedEx Shipping",
                    "Fitness & Nutrition App Set Up",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#E8339E" }} />
                      <span
                        className="text-gray-300 text-xs"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div>
                <a
                  href="#consultation"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-extrabold text-sm tracking-wider text-[#111] transition-opacity hover:opacity-90"
                  style={{
                    background: "#fff",
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  REGISTER &amp; ORDER BLOODWORK →
                </a>
                <p
                  className="text-gray-600 text-center mt-3"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem", letterSpacing: "0.05em" }}
                >
                  *MEDICATION IS PRESCRIBED SEPARATELY FOLLOWING YOUR CLINICAL BLOODWORK REVIEW.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Step 2 label above toggle */}
        <div className="text-center mb-4">
          <span
            className="text-xs font-extrabold tracking-widest uppercase"
            style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
          >
            Step 2: Choose Your Program
          </span>
          <p
            className="text-gray-500 text-sm mt-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            After your doctor reviews your lab results, they'll recommend the right program for your needs.
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span
            className="font-bold text-sm cursor-pointer transition-colors"
            style={{ color: !isAnnual ? "#111" : "#999" }}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative flex-shrink-0 rounded-full transition-all"
            style={{
              width: 52,
              height: 28,
              background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Toggle billing period"
          >
            <span
              className="absolute rounded-full bg-white transition-all"
              style={{
                width: 22,
                height: 22,
                top: 3,
                left: isAnnual ? 27 : 3,
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                transition: "left 0.25s ease",
              }}
            />
          </button>
          <span
            className="font-bold text-sm cursor-pointer transition-colors"
            style={{ color: isAnnual ? "#111" : "#999" }}
            onClick={() => setIsAnnual(true)}
          >
            Annual
          </span>
          {isAnnual && (
            <span
              className="text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: "linear-gradient(135deg, #E8339E, #7A1E7E)" }}
            >
              2 Months Free
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

          {/* TIER 1 — Management & Oversight */}
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E2EA",
              padding: "34px 28px 30px",
            }}
          >
            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{ color: "#111", letterSpacing: "2.5px" }}
            >
              Management &amp; Oversight
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#111" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 62, color: "#111", letterSpacing: "-3px" }}>
                {p.t1}
              </span>
              <span className="font-semibold pb-2.5 text-gray-400" style={{ fontSize: 15 }}>/mo</span>
            </div>
            {isAnnual && (
              <div className="text-xs font-semibold mb-1.5" style={{ color: "#E8339E" }}>
                Billed ${annualTotal.t1.toLocaleString()}/yr — Save ${savings.t1}
              </div>
            )}
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">
              For patients who already have medication through insurance but want the MedMethod team managing their results.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "#F1F1F5", color: "#555", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              No Medication Included
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EBEBF0", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Prescriptions Called In to Your Local Pharmacy" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "#F0FDF4" }}
                  >
                    <Check size={10} color="#16A34A" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "#2A2A35" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block text-xs font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#E8339E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="rounded-lg text-xs font-medium leading-relaxed mb-3"
              style={{ background: "#f3f4f6", color: "#555", padding: "10px 14px" }}
            >
              💉 <strong>Quarterly Blood Lab Testing</strong> available as an add-on — <strong>$129/quarter</strong>
            </div>
            <a
              href="#consultation"
              className="block w-full text-center font-extrabold uppercase tracking-widest rounded-xl transition-all hover:bg-gray-100"
              style={{
                padding: "15px",
                border: "2px solid #111",
                color: "#111",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
              }}
            >
              Join Management Track
            </a>
          </div>

          {/* TIER 2 — Core Weight Track (HERO / Most Popular) */}
          <div
            className="rounded-2xl flex flex-col relative"
            style={{
              background: "#0D0F1C",
              border: "2.5px solid #E8339E",
              padding: "40px 30px 34px",
              boxShadow: "0 0 0 5px rgba(232,51,158,0.10), 0 24px 64px rgba(122,30,126,0.22)",
            }}
          >
            {/* Most Popular badge */}
            <div
              className="absolute text-white font-extrabold uppercase tracking-widest rounded-full"
              style={{
                top: -15,
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                fontSize: 10,
                letterSpacing: "2px",
                padding: "5px 20px",
                whiteSpace: "nowrap",
              }}
            >
              ⭐ Most Popular
            </div>
            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{
                background: "linear-gradient(135deg, #E8339E, #B06FE8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "2.5px",
              }}
            >
              Core Weight Track
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5 text-white" style={{ fontSize: 20 }}>$</span>
              <span className="font-black leading-none text-white" style={{ fontSize: 62, letterSpacing: "-3px" }}>
                {p.t2}
              </span>
              <span className="font-semibold pb-2.5" style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>/mo</span>
            </div>
            {isAnnual && (
              <div className="text-xs font-semibold mb-1.5" style={{ color: "#F472B6" }}>
                Billed ${annualTotal.t2.toLocaleString()}/yr — Save ${savings.t2}
              </div>
            )}
            <p className="text-xs font-medium leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              Our complete medical weight loss system — physician-designed for steady, safe, and managed results.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "rgba(232,51,158,0.15)", color: "#F472B6", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#F472B6" }} />
              Includes Semaglutide
            </div>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Compounded Semaglutide — Delivered to Your Door" },
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
                { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "rgba(232,51,158,0.18)" }}
                  >
                    <Check size={10} color="#E8339E" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#E8339E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className="inline-block font-bold uppercase rounded ml-1.5"
                        style={{
                          fontSize: 10,
                          background: "rgba(232,51,158,0.15)",
                          color: "#E8339E",
                          padding: "1px 6px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#consultation"
              className="block w-full text-center text-white font-extrabold uppercase tracking-widest rounded-xl transition-all"
              style={{
                padding: "15px",
                background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                border: "none",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(232,51,158,0.38)",
              }}
            >
              Start Core Track
            </a>
          </div>

          {/* TIER 3 — Elite Longevity Track */}
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E2EA",
              padding: "34px 28px 30px",
            }}
          >
            <div
              className="font-extrabold tracking-widest uppercase mb-4 text-xs"
              style={{ color: "#111", letterSpacing: "2.5px" }}
            >
              Elite Longevity Track
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-extrabold pb-2.5" style={{ fontSize: 20, color: "#111" }}>$</span>
              <span className="font-black leading-none" style={{ fontSize: 62, color: "#111", letterSpacing: "-3px" }}>
                {p.t3}
              </span>
              <span className="font-semibold pb-2.5 text-gray-400" style={{ fontSize: 15 }}>/mo</span>
            </div>
            {isAnnual && (
              <div className="text-xs font-semibold mb-1.5" style={{ color: "#7A1E7E" }}>
                Billed ${annualTotal.t3.toLocaleString()}/yr — Save ${savings.t3}
              </div>
            )}
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">
              Premium optimization for high-performers — the only program combining GLP-1 therapy with full hormonal balance.
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider mb-5 w-fit"
              style={{ background: "rgba(122,30,126,0.10)", color: "#7A1E7E", letterSpacing: "1px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#7A1E7E" }} />
              Tirzepatide + BHRT
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EBEBF0", marginBottom: 20 }} />
            <ul className="flex flex-col gap-2 mb-3 flex-1">
              {[
                { text: "Compounded Tirzepatide + BHRT — The Complete Protocol" },
                { text: "Dedicated Wellness Advisor", sub: "Bi-Weekly Performance & Weigh-In Check-ins" },
                { text: "Quarterly 1-on-1 Doctor Strategy Session" },
                { text: "Direct Text Access (Business Hours)" },
                { text: "Custom Fitness & Nutrition Program (on the app)" },
                { text: "Clinical Performance Dashboard" },
                { text: "Quarterly Blood Lab Testing", badge: "INCLUDED" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: 19, height: 19, background: "rgba(122,30,126,0.12)" }}
                  >
                    <Check size={10} color="#7A1E7E" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: "#2A2A35" }}>
                    {item.text}
                    {item.sub && (
                      <span
                        className="block font-bold uppercase tracking-wide mt-0.5"
                        style={{ color: "#7A1E7E", fontSize: 10 }}
                      >
                        {item.sub}
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className="inline-block font-bold uppercase rounded ml-1.5"
                        style={{
                          fontSize: 10,
                          background: "rgba(122,30,126,0.15)",
                          color: "#7A1E7E",
                          padding: "1px 6px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#consultation"
              className="block w-full text-center text-white font-extrabold uppercase tracking-widest rounded-xl transition-all hover:opacity-90"
              style={{
                padding: "15px",
                background: "#111",
                border: "2px solid #111",
                fontSize: 12,
                letterSpacing: "1.5px",
                textDecoration: "none",
              }}
            >
              Go Elite Longevity
            </a>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-4">
        </div>

      </div>
    </section>
  );
}
