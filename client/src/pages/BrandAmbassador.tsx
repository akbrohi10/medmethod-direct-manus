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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — would connect to GHL or backend
    setSubmitted(true);
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
      {/* Global style overrides for dot-grid texture and body text color */}
      <style>{`
        .ba-section-tinted {
          background-color: #F9F9F9;
          background-image: radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .ba-card {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ba-card:hover {
          box-shadow: 0 4px 32px rgba(232,51,158,0.15), 0 0 0 1.5px transparent;
          border-color: transparent;
          background-clip: padding-box;
        }
        .ba-card::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 17px;
          background: linear-gradient(135deg,#E8339E,#7A1E7E);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .ba-card:hover::before {
          opacity: 1;
        }
        .ba-card > * {
          position: relative;
          z-index: 1;
        }
        .ba-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(232,51,158,0.12) 0%, rgba(122,30,126,0.10) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          margin-top: 8px;
        }
        .ba-faq-item {
          background: #fff;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          overflow: hidden;
          margin-bottom: 8px;
          transition: border-color 0.2s;
        }
        .ba-faq-item.open {
          border-left: 3px solid transparent;
          background-image: linear-gradient(#fff,#fff), linear-gradient(180deg,#E8339E,#7A1E7E);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .ba-faq-chevron {
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
        }
        .ba-faq-chevron.open {
          transform: rotate(180deg);
        }
        .ba-input {
          width: 100%;
          padding: 14px;
          border: 1px solid #D0D0D0;
          border-radius: 8px;
          font-size: 14px;
          font-family: Montserrat, sans-serif;
          color: #444444;
          outline: none;
          transition: border-color 0.18s;
          background: #fff;
          box-sizing: border-box;
        }
        .ba-input:focus {
          border-color: #E833FE;
        }
        .ba-input::placeholder {
          color: #AAAAAA;
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
            style={{ color: "#888780", fontSize: 14, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#7A1E7E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888780")}
          >
            ← Back to Main Site
          </a>
        </div>
      </header>

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────────── */}
      <section
        className="ba-section-tinted relative overflow-hidden"
        style={{ padding: "90px 24px 100px" }}
      >
        {/* Ambient gradient orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-80px",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,51,254,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            left: "-100px",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,30,126,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#7A1E7E",
              marginBottom: 16,
            }}
          >
            THE MEDMETHOD DIRECT AMBASSADOR PROGRAM
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              fontWeight: 800,
              color: "#111111",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Be the Face of Longevity
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#444444",
              maxWidth: 560,
              margin: "0 auto 36px",
              lineHeight: 1.65,
            }}
          >
            Join a community of health-forward voices helping people discover their path to living longer, better.
          </p>
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
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "Montserrat,sans-serif",
              }}
            >
              Apply Now
            </button>
            <button
              style={{
                padding: "12px 32px",
                border: "2px solid #7A1E7E",
                color: "#7A1E7E",
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
            }}
          >
            {["Science-Backed Protocol", "Physician-Led Program", "Monthly Referral Rewards"].map((label) => (
              <span
                key={label}
                style={{
                  padding: "6px 16px",
                  border: "1px solid #E0E0E0",
                  borderRadius: 999,
                  background: "#F9F9F9",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#888888",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Why Join Cards ───────────────────────────────────────── */}
      <section className="bg-white" style={{ padding: "90px 24px 100px" }}>
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow label */}
          <p
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
            {/* Card 1 */}
            <div className="ba-card">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />
              <div className="ba-icon-circle">
                <svg className="w-5 h-5" style={{ color: "#7A1E7E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 8, fontSize: 15 }}>Exclusive Webinar Access with Dr. Aldeek</h3>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                As an MMD Ambassador, you'll get exclusive access to live webinar consultations hosted by Dr. Aldeek — covering longevity, hormone health, and the science behind what we do.
              </p>
            </div>

            {/* Card 2 — updated copy */}
            <div className="ba-card">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />
              <div className="ba-icon-circle">
                <svg className="w-5 h-5" style={{ color: "#7A1E7E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 8, fontSize: 15 }}>Referral Rewards Program</h3>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                Receive referral rewards each time your audience shops through your personal link or promo code.
              </p>
            </div>

            {/* Card 3 */}
            <div className="ba-card">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,#E8339E,#7A1E7E)" }} />
              <div className="ba-icon-circle">
                <svg className="w-5 h-5" style={{ color: "#7A1E7E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 8, fontSize: 15 }}>Join a Premium Health Community</h3>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                Connect with like-minded advocates in the longevity, hormone health, and wellness space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — How It Works ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "90px 24px 100px",
          background: "linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%), #F9F9F9",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(135deg, rgba(232,51,158,0.04) 0%, rgba(122,30,126,0.04) 100%)",
          backgroundSize: "22px 22px, 100% 100%",
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
            {/* Connecting line (desktop only) */}
            <div
              aria-hidden="true"
              style={{
                display: "none",
                position: "absolute",
                top: 22,
                left: "calc(16.67% + 24px)",
                right: "calc(16.67% + 24px)",
                height: 3,
                background: "linear-gradient(90deg,#E8339E,#7A1E7E)",
                borderRadius: 2,
              }}
              className="md-connecting-line"
            />
            <style>{`@media(min-width:768px){.md-connecting-line{display:block!important}}`}</style>

            {/* Step 1 */}
            <div style={{ textAlign: "center", position: "relative" }}>
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
                  margin: "0 auto 16px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                1
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 6, fontSize: 15 }}>Apply</h3>
              <p style={{ fontSize: 12, color: "#888888", fontStyle: "italic", marginBottom: 6 }}>Takes less than 2 minutes</p>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                Fill out the short application form. We review submissions within 5 to 7 business days.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: "center", position: "relative" }}>
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
                  margin: "0 auto 16px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                2
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 6, fontSize: 15 }}>Get Approved</h3>
              <p style={{ fontSize: 12, color: "#888888", fontStyle: "italic", marginBottom: 6 }}>Usually within 5–7 business days</p>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                Once approved, you'll receive your ambassador portal, unique promo code, and affiliate link.
              </p>
            </div>

            {/* Step 3 — updated copy */}
            <div style={{ textAlign: "center", position: "relative" }}>
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
                  margin: "0 auto 16px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                3
              </div>
              <h3 style={{ fontWeight: 700, color: "#111111", marginBottom: 6, fontSize: 15 }}>Share &amp; Earn</h3>
              <p style={{ fontSize: 12, color: "#888888", fontStyle: "italic", marginBottom: 6 }}>Rewards paid every month</p>
              <p style={{ fontSize: 14, color: "#444444", lineHeight: 1.65 }}>
                Post your authentic experience, refer your audience, and receive referral rewards paid monthly.
              </p>
            </div>
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
              alignItems: "start",
            }}
          >
            {/* Left column — decorative gradient bar */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div
                aria-hidden="true"
                style={{
                  width: 4,
                  borderRadius: 4,
                  background: "linear-gradient(180deg,#E8339E,#7A1E7E)",
                  alignSelf: "stretch",
                  flexShrink: 0,
                  minHeight: 80,
                }}
              />
              <p style={{ fontSize: 15, color: "#444444", lineHeight: 1.75 }}>
                We partner with voices who reflect our values — premium, credible, and science-minded. Here's what we look for in an MMD Ambassador:
              </p>
            </div>

            {/* Right column — checklist card */}
            <div
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                padding: "24px 28px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Public social media profile with an engaged, health-focused audience",
                  "Minimum 3,000 followers (Instagram, TikTok, Facebook, or YouTube)",
                  "Content that is high quality, clear, and authentically yours",
                  "Aligned values: longevity, wellness, hormone health, or medically supervised weight loss",
                  "No profanity, explicit content, or messaging that conflicts with clinical positioning",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    {/* Gradient checkmark */}
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
      </section>

      {/* ── SECTION 5 — FAQ Accordion ────────────────────────────────────────── */}
      <section
        className="ba-section-tinted"
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
                    padding: "16px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "Montserrat,sans-serif",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111111" }}>{faq.q}</span>
                  <svg
                    className={`ba-faq-chevron${openFaq === i ? " open" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7A1E7E"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginLeft: 12 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 16px" }}>
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
          background: "linear-gradient(135deg,#E8339E 0%,#7A1E7E 100%)",
          padding: "80px 24px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Abstract white circle bottom-left */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            pointerEvents: "none",
          }}
        />
        <div className="max-w-3xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Ready to Join the Movement?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: 32, fontSize: 16 }}>
            Your audience is looking for something real. Give them a path to longevity.
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
            }}
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
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            Apply to Become an Ambassador
          </button>
        </div>
      </section>

      {/* ── SECTION 7 — Application Form ─────────────────────────────────────── */}
      <section id="apply-section" className="bg-white" style={{ padding: "90px 24px 100px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {!showForm ? (
            <div style={{ textAlign: "center" }}>
              {/* MMD Logo lockup */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#111111" }}>Med</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#7A1E7E" }}>Method</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#111111", textTransform: "uppercase", letterSpacing: "0.2em", marginLeft: 4, alignSelf: "flex-end", marginBottom: 2 }}>DIRECT</span>
              </div>
              <p style={{ fontSize: 14, color: "#444444", marginBottom: 8 }}>
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
                style={{
                  padding: "14px 36px",
                  background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "Montserrat,sans-serif",
                }}
              >
                Open Application
              </button>
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
                <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginBottom: 12 }}>Application Submitted!</h2>
              <p style={{ color: "#444444", fontSize: 15, lineHeight: 1.65 }}>
                Thank you for applying. We'll review your submission and get back to you within 5–7 business days via email.
              </p>
            </div>
          ) : (
            <div>
              {/* MMD Logo lockup */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#111111" }}>Med</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#7A1E7E" }}>Method</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#111111", textTransform: "uppercase", letterSpacing: "0.2em", marginLeft: 4, alignSelf: "flex-end", marginBottom: 2 }}>DIRECT</span>
              </div>
              <p style={{ textAlign: "center", fontSize: 14, color: "#444444", marginBottom: 8 }}>
                It only takes a few minutes. We review every application personally.
              </p>
              <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#111111", textAlign: "center", marginBottom: 32 }}>
                Ambassador Application
              </h2>
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
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg,#E8339E,#7A1E7E)",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    fontFamily: "Montserrat,sans-serif",
                  }}
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

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
