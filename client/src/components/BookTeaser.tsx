/* =============================================================================
   BookTeaser — MedMethod Direct
   
   Design: White/light background — editorial magazine-spread feel.
   The book cover (lavender/purple) pops naturally against white, matching
   how it appears on Amazon. Creates a deliberate light break between the
   dark Testimonials section and the dark ToolsForSuccess section.
   ============================================================================= */
import { useState } from "react";
import { X, BookOpen, Phone, ChevronRight, Star } from "lucide-react";

const BOOK_COVER_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/book_front_cover_45993884.png";

// ── Modal ────────────────────────────────────────────────────────────────────
function PrefaceModal({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) {
      setError("Please enter your first name and mobile number.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,8,20,0.82)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "#0D0D1A",
          border: "1.5px solid rgba(232,51,158,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #E8339E, #7A1E7E)" }}
        />

        <div className="p-8">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(232,51,158,0.12)",
                    border: "1px solid rgba(232,51,158,0.2)",
                  }}
                >
                  <BookOpen size={20} color="#E8339E" />
                </div>
                <div>
                  <p
                    className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
                    style={{ color: "#E8339E", letterSpacing: "2px" }}
                  >
                    Free Download
                  </p>
                  <h3
                    className="font-black leading-tight"
                    style={{ fontSize: 18, color: "#fff" }}
                  >
                    Get the Free Preface
                  </h3>
                </div>
              </div>

              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                We'll text you a direct link to the preface of{" "}
                <em style={{ color: "rgba(255,255,255,0.85)" }}>
                  The Menopause Weight Loss Trap
                </em>{" "}
                — no app download needed.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#E8339E")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1.5px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#E8339E")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1.5px solid rgba(255,255,255,0.07)",
                      color: "#fff",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(232,51,158,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
                  />
                </div>

                {error && (
                  <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    padding: "14px",
                    fontSize: 11,
                    letterSpacing: "1.5px",
                    background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 6px 24px rgba(232,51,158,0.35)",
                    cursor: "pointer",
                  }}
                >
                  Send Me the Preface →
                </button>

                <p
                  className="text-[10px] text-center leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  By submitting, you agree to receive SMS from MedMethod Direct.
                  Message &amp; data rates may apply. Reply STOP to opt out.
                </p>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(232,51,158,0.12)", border: "1.5px solid rgba(232,51,158,0.3)" }}
              >
                <ChevronRight size={28} color="#E8339E" />
              </div>
              <h3
                className="font-black mb-3"
                style={{ fontSize: 22, color: "#fff" }}
              >
                You're all set, {firstName}!
              </h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                We'll text you the preface link shortly. In the meantime, feel
                free to explore our programs or schedule a free consultation.
              </p>
              <button
                onClick={onClose}
                className="rounded-xl font-bold text-sm px-6 py-3 transition-all hover:opacity-80"
                style={{
                  background: "rgba(232,51,158,0.12)",
                  border: "1px solid rgba(232,51,158,0.25)",
                  color: "#E8339E",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookTeaser({ onConsultClick }: { onConsultClick: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);

  const bullets = [
    "Why metabolism changes in menopause — and what actually matters",
    "How GLP-1 medications work (and when they don't)",
    "The critical role of muscle in long-term weight loss",
    "How to reduce food noise and regain control of appetite",
    "What most weight loss plans get wrong — and how to avoid it",
  ];

  return (
    <>
      {modalOpen && <PrefaceModal onClose={() => setModalOpen(false)} />}

      <section
        className="py-16 lg:py-24 px-4 relative overflow-hidden"
        style={{
          background: "#FFFFFF",
          fontFamily: "Montserrat, sans-serif",
          borderTop: "1px solid #EBEBF0",
          borderBottom: "1px solid #EBEBF0",
        }}
      >
        {/* Subtle lavender tint in background — echoes cover palette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 90% 50%, rgba(122,30,126,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 max-w-16" style={{ background: "rgba(232,51,158,0.25)" }} />
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: "#E8339E", letterSpacing: "3px" }}
            >
              The Book Behind the Method
            </span>
            <div className="h-px flex-1 max-w-16" style={{ background: "rgba(232,51,158,0.25)" }} />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ── Book Cover ── */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="relative"
                style={{
                  filter: "drop-shadow(0 24px 48px rgba(122,30,126,0.22)) drop-shadow(0 6px 18px rgba(0,0,0,0.12))",
                  transform: "perspective(800px) rotateY(-6deg) rotateX(2deg)",
                }}
              >
                <img
                  src={BOOK_COVER_URL}
                  alt="The Menopause Weight Loss Trap book cover"
                  className="rounded-lg"
                  style={{ width: 220, height: "auto" }}
                />
                {/* Subtle shine overlay */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
                  }}
                />
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1 mt-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#E8339E" color="#E8339E" />
                ))}
                <span
                  className="text-xs font-semibold ml-1"
                  style={{ color: "#9CA3AF" }}
                >
                  Available on Amazon
                </span>
              </div>
            </div>

            {/* ── Copy ── */}
            <div className="flex-1 text-center lg:text-left">
              <p
                className="font-extrabold uppercase tracking-widest mb-2"
                style={{ fontSize: 11, color: "#E8339E", letterSpacing: "2.5px" }}
              >
                Dr. Jumana Al-Deek, DO
              </p>

              <h2
                className="font-black leading-tight mb-4"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  color: "#111",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                }}
              >
                The Menopause{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Weight Loss Trap
                </span>
              </h2>

              <p
                className="text-sm font-medium mb-6 italic"
                style={{ color: "#9CA3AF" }}
              >
                A Physician's Guide to GLP-1s &amp; Metabolism
              </p>

              <p
                className="mb-6 leading-relaxed"
                style={{ fontSize: 15, color: "#4B5563", maxWidth: 520 }}
              >
                You're eating well. You're exercising. You're doing everything right — and yet the
                scale won't budge. This book explains exactly why, and what to do instead.
              </p>

              {/* Bullet points */}
              <ul className="space-y-2.5 mb-8">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                      style={{
                        width: 18,
                        height: 18,
                        background: "rgba(232,51,158,0.1)",
                        border: "1px solid rgba(232,51,158,0.25)",
                      }}
                    >
                      <ChevronRight size={10} color="#E8339E" strokeWidth={3} />
                    </span>
                    <span
                      className="text-sm leading-snug"
                      style={{ color: "#374151" }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setModalOpen(true)}
                  className="rounded-xl font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    padding: "14px 28px",
                    fontSize: 11,
                    letterSpacing: "1.5px",
                    background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 6px 24px rgba(232,51,158,0.3)",
                    cursor: "pointer",
                  }}
                >
                  Get the Free Preface
                </button>

                <a
                  href="#"
                  className="rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    padding: "14px 24px",
                    background: "transparent",
                    color: "#111",
                    border: "1.5px solid #D1D1DB",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8339E";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#E8339E";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D1D1DB";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#111";
                  }}
                >
                  View on Amazon
                  <ChevronRight size={14} />
                </a>
              </div>

              <p
                className="text-[11px] mt-4"
                style={{ color: "#9CA3AF" }}
              >
                We'll text you a direct link — no app download needed.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
