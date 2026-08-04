import { useState } from "react";

// Standalone Brand Ambassador page — self-contained, does not modify any existing components
// Brand: Pink #E8339E, Deep Purple #7A1E7E, gradient pink→purple, Montserrat, premium clinical tone

export default function BrandAmbassador() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    socialHandle: "",
    platform: "",
    followerCount: "",
    whyJoin: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const GHL_WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/cFQraxSJv1aDKQFAghbI/webhook-trigger/2bbee6b2-07f2-4f8a-b456-ec067152cba4";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        social_handle: formData.socialHandle,
        platform: formData.platform,
        follower_count: formData.followerCount,
        why_join: formData.whyJoin,
        source: "Brand Ambassador Application",
        submitted_at: new Date().toISOString(),
      };
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Submission failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      console.error("[Ambassador Form] GHL webhook error:", err);
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Is there a cost to join?",
      a: "No. The MedMethod Direct Ambassador Program is completely free to join.",
    },
    {
      q: "How do I know if I've been accepted?",
      a: "You'll receive an email notification. Make sure your email address is correct when you apply.",
    },
    {
      q: "How do I track my referral rewards?",
      a: "Your personal ambassador portal tracks all link clicks, promo code uses, and referral reward earnings in real time.",
    },
    {
      q: "When and how do I get paid?",
      a: "Referral rewards are paid monthly. Payment details are configured inside your ambassador portal after approval.",
    },
    {
      q: "Can I reapply if I'm not accepted?",
      a: "Yes. You're welcome to reapply at any time.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* ── Global styles ─────────────────────────────────────────────────────── */}
      <style>{`
        /* Force ALL body/paragraph text to #444444 — no purple bleed */
        .ba-page p,
        .ba-page span:not(.ba-eyebrow):not(.ba-badge):not(.ba-watermark),
        .ba-page li {
          color: #444444;
        }
        /* Prevent inline links from hijacking text color inside content sections */
        .ba-page a:not([class*="ba-back"]) {
          color: inherit;
          text-decoration: none;
        }

        /* ── Shimmer animation for CTA buttons ── */
        @keyframes ba-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ba-btn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .ba-btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.35) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: ba-shimmer 2.8s linear infinite;
          pointer-events: none;
          border-radius: inherit;
        }
        .ba-btn-shimmer:active {
          transform: scale(0.97);
          transition: transform 0.16s cubic-bezier(0.23,1,0.32,1);
        }

        /* ── Card styles ── */
        .ba-card {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: box-shadow 0.2s ease;
        }
        .ba-card:hover {
          box-shadow: 0 8px 40px rgba(232,51,158,0.15);
        }
        .ba-card > * {
          position: relative;
          z-index: 1;
        }

        /* Watermark numbers — 10% opacity */
        .ba-watermark {
          position: absolute;
          bottom: 12px;
          right: 16px;
          font-size: 52px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg,#E8339E,#7A1E7E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.10;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        /* ── Icon circle ── */
        .ba-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(232,51,158,0.28) 0%, rgba(122,30,126,0.22) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          margin-top: 8px;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }

        /* Gradient blob behind icon */
        .ba-icon-blob {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,51,158,0.10) 0%, rgba(122,30,126,0.08) 60%, transparent 100%);
          top: -8px;
          left: -22px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── FAQ rows ── */
        .ba-faq-item {
          background: #fff;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          overflow: hidden;
          margin-bottom: 10px;
          transition: border-color 0.2s;
        }
        .ba-faq-item.open {
          border-left: 3px solid #E8339E;
        }
        .ba-faq-chevron {
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
          flex-shrink: 0;
          margin-left: 12px;
        }
        .ba-faq-chevron.open {
          transform: rotate(180deg);
        }

        /* ── Input styles ── */
        .ba-input {
          width: 100%;
          padding: 14px;
          border: 1px solid #D0D0D0;
          border-radius: 8px;
          font-size: 14px;
          font-family: Montserrat, sans-serif;
          color: #444444;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          background: #fff;
          box-sizing: border-box;
        }
        .ba-input:focus {
          border-color: #E833FE;
          box-shadow: 0 0 0 3px rgba(232,51,254,0.15);
        }
        .ba-input::placeholder {
          color: #AAAAAA;
        }

        /* ── Step glow ring ── */
        .ba-step-glow {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,51,158,0.15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: blur(6px);
        }

        /* ── Section 3 gradient borders ── */
        .ba-section3 {
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
          background-clip: padding-box;
          position: relative;
        }
        .ba-section3::before,
        .ba-section3::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg,#E8339E,#7A1E7E);
        }
        .ba-section3::before { top: 0; }
        .ba-section3::after { bottom: 0; }

        /* ── Section 2 lavender bg ── */
        .ba-section2 {
          background-color: #FAF5FF;
        }

        /* ── Section 5 lavender bg ── */
        .ba-section5 {
          background-image: url('/manus-storage/faq_54577767.png');
          background-size: cover;
          background-position: center;
        }
      `}</style>

      {/* Top gradient accent bar */}
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />

      {/* Standalone Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold" style={{ color: "#111111" }}>Med</span>
            <span className="text-xl font-bold" style={{ color: "#7A1E7E" }}>Method</span>
            <span
              className="text-[9px] font-semibold uppercase ml-1 self-end mb-0.5"
              style={{ color: "#111111", letterSpacing: "0.2em" }}
            >
              DIRECT
            </span>
          </div>
          <a
            href="https://medmethoddirect.com"
            className="ba-back"
            style={{ color: "#888780", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#7A1E7E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888780")}
          >
            ← Back to Main Site
          </a>
        </div>
      </header>

      <div className="ba-page">

        {/* ── SECTION 1 — Hero ─────────────────────────────────────────────────── */}
        <section
          style={{
          backgroundImage: "url('/manus-storage/hero_c7b724be.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          padding: "90px 24px 100px",
          }}
        >
          {/* Dark overlay for text readability */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,0,20,0.50)",
              pointerEvents: "none",
            }}
          />

          <div className="max-w-3xl mx-auto text-center relative" style={{ zIndex: 10 }}>
            <p
              className="ba-eyebrow"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#F0A0D0",
                marginBottom: 16,
              }}
            >
              THE MEDMETHOD DIRECT AMBASSADOR PROGRAM
            </p>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              Earn $50 for Every Qualified Signup You Send Our Way
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 560,
                margin: "0 auto 36px",
                lineHeight: 1.65,
              }}
            >
              Join a community of health-forward voices helping people discover their path to living longer, better.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
                marginBottom: 36,
              }}
            >
              <button
                onClick={() => {
                  setShowForm(true);
                  document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="ba-btn-shimmer"
                style={{
                  padding: "13px 34px",
                  background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "Montserrat,sans-serif",
                  boxShadow: "0 4px 18px rgba(232,51,158,0.35)",
                }}
              >
                Apply Now
              </button>
              <button
                style={{
                  padding: "13px 34px",
                  border: "2px solid rgba(255,255,255,0.70)",
                  color: "#ffffff",
                  fontWeight: 700,
                  borderRadius: 10,
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "Montserrat,sans-serif",
                }}
              >
                Log In
              </button>
            </div>

            {/* Stat badges row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              {["Science-Backed Protocol", "Physician-Led Program", "Monthly Referral Rewards"].map((label) => (
                <span
                  key={label}
                  className="ba-badge"
                  style={{
                    padding: "6px 16px",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.80)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Trust signal row — below pill badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {[
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 12.75l6 6 9-13.5" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ),
                  label: "Physician-Led",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  label: "Clinically Backed",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ),
                  label: "Invite Only",
                },
              ].map((item, i, arr) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 18px" }}>
                    {item.icon}
                    <span                     style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{item.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.30)", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full-width gradient divider */}
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, #E8339E 25%, #7A1E7E 75%, transparent 100%)",
            opacity: 0.35,
          }}
        />

        {/* ── SECTION 2 — Why Join Cards ───────────────────────────────────────── */}
        <section className="ba-section2" style={{ padding: "90px 24px 100px" }}>
          <div className="max-w-5xl mx-auto">
            <p
              className="ba-eyebrow"
              style={{
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#7A1E7E",
                marginBottom: 12,
              }}
            >
              What you get:
            </p>
            <h2
              style={{
                fontSize: "clamp(1.4rem,3vw,1.9rem)",
                fontWeight: 800,
                color: "#111111",
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              Why Join the MMD Ambassador Program?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 24,
              }}
            >
              {/* Card 1 — Webinar */}
              <div className="ba-card" style={{ backgroundImage: "url('/manus-storage/card1_1d57ccab.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                {/* Dark overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,0,18,0.62)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#E8339E,#7A1E7E)", zIndex: 2 }} />
                <span className="ba-watermark">01</span>
                {/* LIVE badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,#E8339E,#7A1E7E)", opacity: 0.4 }} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    LIVE
                  </span>
                  <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,#7A1E7E,#E8339E)", opacity: 0.4 }} />
                </div>
                <div style={{ position: "relative" }}>
                  <div className="ba-icon-blob" />
                  <div className="ba-icon-circle">
                    <svg className="w-6 h-6" style={{ color: "#E8339E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: 8, fontSize: 15 }}>Exclusive Webinar Access with Dr. Aldeek</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>
                  As an MMD Ambassador, you'll get exclusive access to live webinar consultations hosted by Dr. Aldeek — covering longevity, hormone health, and the science behind what we do.
                </p>
              </div>

              {/* Card 2 — Referral Rewards */}
              <div className="ba-card" style={{ backgroundImage: "url('/manus-storage/card2_9b9b7191.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                {/* Dark overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,0,18,0.62)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#E8339E,#7A1E7E)", zIndex: 2 }} />
                <span className="ba-watermark">02</span>
                {/* Decorative % motif */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 40,
                    right: 24,
                    fontSize: 80,
                    fontWeight: 900,
                    lineHeight: 1,
                    background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.07,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                  }}
                >
                  %
                </div>
                <div style={{ position: "relative" }}>
                  <div className="ba-icon-blob" />
                  <div className="ba-icon-circle">
                    <svg className="w-6 h-6" style={{ color: "#E8339E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: 8, fontSize: 15 }}>Referral Rewards Program</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>
                  Receive referral rewards each time your audience shops through your personal link or promo code.
                </p>
              </div>

              {/* Card 3 — Community */}
              <div className="ba-card" style={{ backgroundImage: "url('/manus-storage/card3_b47ae6e7.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                {/* Dark overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,0,18,0.62)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#E8339E,#7A1E7E)", zIndex: 2 }} />
                <span className="ba-watermark">03</span>
                {/* Decorative network nodes motif */}
                <svg
                  aria-hidden="true"
                  width="80"
                  height="60"
                  viewBox="0 0 80 60"
                  style={{
                    position: "absolute",
                    bottom: 32,
                    right: 16,
                    opacity: 0.07,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  <circle cx="10" cy="30" r="6" fill="#E8339E" />
                  <circle cx="40" cy="10" r="6" fill="#7A1E7E" />
                  <circle cx="70" cy="30" r="6" fill="#E8339E" />
                  <circle cx="40" cy="50" r="6" fill="#7A1E7E" />
                  <line x1="10" y1="30" x2="40" y2="10" stroke="#E8339E" strokeWidth="2" />
                  <line x1="40" y1="10" x2="70" y2="30" stroke="#7A1E7E" strokeWidth="2" />
                  <line x1="70" y1="30" x2="40" y2="50" stroke="#E8339E" strokeWidth="2" />
                  <line x1="40" y1="50" x2="10" y2="30" stroke="#7A1E7E" strokeWidth="2" />
                  <line x1="40" y1="10" x2="40" y2="50" stroke="#E8339E" strokeWidth="1.5" strokeDasharray="4 3" />
                </svg>
                <div style={{ position: "relative" }}>
                  <div className="ba-icon-blob" />
                  <div className="ba-icon-circle">
                    <svg className="w-6 h-6" style={{ color: "#E8339E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: 8, fontSize: 15 }}>Join a Premium Health Community</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>
                  Connect with like-minded advocates in the longevity, hormone health, and wellness space.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — How It Works ─────────────────────────────────────────── */}
        <section
          className="ba-section3"
          style={{
            padding: "90px 24px 100px",
            backgroundImage: "url('/manus-storage/sec3_baae4735.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              style={{
                fontSize: "clamp(1.4rem,3vw,1.9rem)",
                fontWeight: 800,
                color: "#111111",
                textAlign: "center",
                marginBottom: 56,
              }}
            >
              How It Works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 32, position: "relative" }}>
              {/* Connecting line — desktop only */}
              <div
                aria-hidden="true"
                style={{
                  display: "none",
                  position: "absolute",
                  top: 22,
                  left: "calc(16.67% + 24px)",
                  right: "calc(16.67% + 24px)",
                  height: 2,
                  background: "linear-gradient(90deg,#E8339E,#7A1E7E)",
                  borderRadius: 2,
                }}
                className="md-connecting-line"
              />
              <style>{`@media(min-width:768px){.md-connecting-line{display:block!important}}`}</style>

              {[
                { n: "1", title: "Apply", sub: "Takes less than 2 minutes", desc: "Fill out the short application form. We review submissions within 5 to 7 business days." },
                { n: "2", title: "Get Approved", sub: "Usually within 5–7 business days", desc: "Once approved, you'll receive your ambassador portal, unique promo code, and affiliate link." },
                { n: "3", title: "Share & Earn", sub: "Rewards paid every month", desc: "Post your authentic experience, refer your audience, and receive referral rewards paid monthly." },
              ].map((step) => (
                <div key={step.n} style={{ textAlign: "center", position: "relative" }}>
                  {/* Glow ring behind circle */}
                  <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto 16px" }}>
                    <div className="ba-step-glow" />
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 10,
                        boxShadow: "0 4px 16px rgba(232,51,158,0.3)",
                      }}
                    >
                      {step.n}
                    </div>
                  </div>
                  <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 6, fontSize: 15 }}>{step.title}</h3>
                  <p style={{ fontSize: 12, color: "#888780", fontStyle: "italic", marginBottom: 6 }}>{step.sub}</p>
                  <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — Ambassador Guidelines ───────────────────────────────── */}
        <section className="bg-white" style={{ padding: "90px 24px 100px" }}>
          <div className="max-w-5xl mx-auto">
            <h2
              style={{
                fontSize: "clamp(1.4rem,3vw,1.9rem)",
                fontWeight: 800,
                color: "#111111",
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              Ambassador Guidelines
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 40,
                alignItems: "center",
              }}
            >
              {/* Left column — image background with text overlay */}
              <div
                style={{
                  backgroundImage: "url('/manus-storage/sec4left_6748e484.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 14,
                  overflow: "hidden",
                  minHeight: 320,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "40px 32px",
                }}
              >
                {/* Dark gradient overlay for text readability */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(8,0,18,0.80) 0%, rgba(8,0,18,0.30) 60%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 4,
                        borderRadius: 4,
                        background: "linear-gradient(180deg,#E8339E,#7A1E7E)",
                        flexShrink: 0,
                        minHeight: 80,
                      }}
                    />
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.90)", lineHeight: 1.75 }}>
                      We partner with voices who reflect our values — premium, credible, and science-minded. Here's what we look for in an MMD Ambassador:
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column — checklist card with full-width gradient top bar */}
              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                {/* Full-width gradient top accent bar */}
                <div style={{ height: 4, width: "100%", background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />
                <div style={{ padding: "40px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      "Public social media profile with an engaged, health-focused audience",
                      "Minimum 3,000 followers (Instagram, TikTok, Facebook, or YouTube)",
                      "Content that is high quality, clear, and authentically yours",
                      "Aligned values: longevity, wellness, hormone health, or medically supervised weight loss",
                      "No profanity, explicit content, or messaging that conflicts with clinical positioning",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        >
                          <defs>
                            <linearGradient id={`chk-${i}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#E8339E" />
                              <stop offset="100%" stopColor="#7A1E7E" />
                            </linearGradient>
                          </defs>
                          <path
                            d="m4.5 12.75 6 6 9-13.5"
                            stroke={`url(#chk-${i})`}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5 — FAQ Accordion ────────────────────────────────────────── */}
        <section
          className="ba-section5"
          style={{ padding: "90px 24px 100px" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              style={{
                fontSize: "clamp(1.4rem,3vw,1.9rem)",
                fontWeight: 800,
                color: "#111111",
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              Got Questions?
            </h2>
            <div>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`ba-faq-item${openFaq === i ? " open" : ""}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "24px 24px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "Montserrat,sans-serif",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: openFaq === i ? "#7A1E7E" : "#111111",
                        transition: "color 0.2s",
                      }}
                    >
                      {faq.q}
                    </span>
                    <svg
                      className={`ba-faq-chevron${openFaq === i ? " open" : ""}`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7A1E7E"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 24px" }}>
                      <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — Closing CTA Banner ──────────────────────────────────── */}
        <section
          style={{
            backgroundImage: "url('/manus-storage/form_22b5f11c.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            padding: "80px 24px 90px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Circle — bottom-left */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-80px",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.13)",
              pointerEvents: "none",
            }}
          />
          {/* Circle — top-right */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              pointerEvents: "none",
            }}
          />
          {/* Circle — centered top, small */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div className="max-w-3xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Ready to Join the Movement?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.90)", marginBottom: 32, fontSize: 16 }}>
              Your audience is looking for something real. Give them a path to longevity.
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="ba-btn-shimmer"
              style={{
                padding: "14px 36px",
                background: "#fff",
                color: "#7A1E7E",
                fontWeight: 700,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "Montserrat,sans-serif",
                boxShadow: "0 8px 24px rgba(0,0,0,0.30)",
              }}
            >
              Apply to Become an Ambassador
            </button>
          </div>
        </section>

        {/* ── SECTION 7 — Application Form ─────────────────────────────────────── */}
        <section
          id="apply-section"
          style={{
            padding: "90px 24px 100px",
            background: "#FFFFFF",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {!showForm ? (
              /* Pre-form teaser card */
              <div
                style={{
                  border: "1px solid #E8E8E8",
                  borderRadius: 20,
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* 4px brand gradient top border */}
                <div style={{ height: 4, width: "100%", background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />
                <div style={{ padding: "48px 44px", textAlign: "center" }}>
                  {/* MMD Logo lockup */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#111111" }}>Med</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#7A1E7E" }}>Method</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#111111", textTransform: "uppercase", letterSpacing: "0.2em", marginLeft: 4, alignSelf: "flex-end", marginBottom: 2 }}>DIRECT</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#888780", fontStyle: "italic", marginBottom: 8 }}>
                    It only takes a few minutes. We review every application personally.
                  </p>
                  <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#111111", marginBottom: 16 }}>
                    Ready to Apply?
                  </h2>
                  <p style={{ color: "#444444", marginBottom: 32, fontSize: 15 }}>
                    Click below to open the application form.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="ba-btn-shimmer"
                    style={{
                      padding: "14px 0",
                      width: "100%",
                      background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      fontFamily: "Montserrat,sans-serif",
                      boxShadow: "0 4px 16px rgba(232,51,158,0.3)",
                    }}
                  >
                    Open Application
                  </button>
                </div>
              </div>
            ) : submitted ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginBottom: 12 }}>Application Submitted!</h2>
                <p style={{ color: "#444444", fontSize: 15, lineHeight: 1.65 }}>
                  Thank you for applying. We'll review your submission and get back to you within 5–7 business days via email.
                </p>
              </div>
            ) : (
              /* Form card */
              <div
                style={{
                  border: "1px solid #E8E8E8",
                  borderRadius: 20,
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* 4px brand gradient top border */}
                <div style={{ height: 4, width: "100%", background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />

                <div style={{ padding: "48px 44px" }}>
                  {/* MMD Logo lockup */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#111111" }}>Med</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#7A1E7E" }}>Method</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#111111", textTransform: "uppercase", letterSpacing: "0.2em", marginLeft: 4, alignSelf: "flex-end", marginBottom: 2 }}>DIRECT</span>
                  </div>

                  <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#111111", textAlign: "center", marginBottom: 8 }}>
                    Ambassador Application
                  </h2>

                  <p style={{ textAlign: "center", fontSize: 13, color: "#888780", fontStyle: "italic", marginBottom: 28 }}>
                    It only takes a few minutes. We review every application personally.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="ba-input"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="ba-input"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>Social Media Handle (primary)</label>
                      <input
                        type="text"
                        required
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                        className="ba-input"
                        placeholder="@yourhandle"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>Platform</label>
                      <select
                        required
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="ba-input"
                        style={{ appearance: "auto" }}
                      >
                        <option value="">Select your primary platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>Approximate Follower Count</label>
                      <input
                        type="text"
                        required
                        value={formData.followerCount}
                        onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                        className="ba-input"
                        placeholder="e.g. 5,000"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 6 }}>
                        Why do you want to be an MMD Ambassador?{" "}
                        <span style={{ fontWeight: 400, color: "#888780" }}>(max 300 characters)</span>
                      </label>
                      <textarea
                        required
                        maxLength={300}
                        rows={4}
                        value={formData.whyJoin}
                        onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                        className="ba-input"
                        placeholder="Tell us why you'd be a great fit..."
                        style={{ resize: "none" }}
                      />
                      <p style={{ fontSize: 12, color: "#888780", textAlign: "right", marginTop: 4 }}>
                        {formData.whyJoin.length}/300
                      </p>
                    </div>
                    {submitError && (
                      <p style={{ fontSize: 13, color: "#E8339E", textAlign: "center", marginTop: -8 }}>
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="ba-btn-shimmer"
                      style={{
                        width: "100%",
                        padding: "15px",
                        background: submitting ? "#ccc" : "linear-gradient(135deg,#E8339E,#7A1E7E)",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 12,
                        border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: 15,
                        fontFamily: "Montserrat,sans-serif",
                        boxShadow: submitting ? "none" : "0 4px 16px rgba(232,51,158,0.30)",
                        opacity: submitting ? 0.7 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {submitting ? "Submitting…" : "Submit Application"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>{/* end .ba-page */}

      {/* Standalone Footer */}
      <footer style={{ background: "#111111", padding: "40px 24px" }}>
        <div className="max-w-5xl mx-auto" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Med</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#E8339E" }}>Method</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.2em", marginLeft: 4, alignSelf: "flex-end", marginBottom: 1 }}>DIRECT</span>
          </div>
          <p style={{ fontSize: 14, color: "#9CA3AF" }}>
            &copy; {new Date().getFullYear()} MedMethod Direct. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
