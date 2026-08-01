/* =============================================================================
   BookTeaser — MedMethod Direct
   
   Design: Deep navy/purple background with ambient glow behind the book cover.
   The purple cover "radiates" against the dark backdrop. Gold accents from the
   caduceus are echoed in star ratings and decorative details. The book floats
   with a 3D perspective shadow, scaled large to command attention.
   ============================================================================= */
import { useState } from "react";
import { X, BookOpen, Phone, ChevronRight, Star } from "lucide-react";

const BOOK_COVER_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/KzPyKVdwkqgxjlHd.png";

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
                free to explore our programs or schedule a appointment.
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
        id="book"
        className="py-20 lg:py-28 px-4 relative overflow-hidden"
        style={{
          background: "#080613",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* ── Ambient background layers ── */}
        {/* Deep purple radial glow — centered behind the book area */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 30% 50%, rgba(90,20,120,0.35) 0%, transparent 65%)",
          }}
        />
        {/* Secondary magenta accent — top right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 40% 50% at 85% 20%, rgba(232,51,158,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-14">
            <div className="h-px flex-1 max-w-20" style={{ background: "rgba(212,175,55,0.3)" }} />
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: "#D4AF37", letterSpacing: "3px" }}
            >
              The Book Behind the Method
            </span>
            <div className="h-px flex-1 max-w-20" style={{ background: "rgba(212,175,55,0.3)" }} />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            {/* ── Book Cover — Large, floating, with ambient glow ── */}
            <div className="flex-shrink-0 flex flex-col items-center relative">
              {/* Ambient glow behind book */}
              <div
                className="absolute rounded-full blur-3xl"
                style={{
                  width: 340,
                  height: 420,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(ellipse at center, rgba(122,30,126,0.5) 0%, rgba(90,20,120,0.25) 40%, transparent 70%)",
                }}
              />
              {/* Secondary warm glow — picks up the gold */}
              <div
                className="absolute rounded-full blur-2xl"
                style={{
                  width: 200,
                  height: 260,
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)",
                }}
              />

              <div
                className="relative transition-transform duration-500 hover:scale-[1.03]"
                style={{
                  filter:
                    "drop-shadow(0 32px 64px rgba(90,20,120,0.45)) drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
                  transform: "perspective(900px) rotateY(-5deg) rotateX(2deg)",
                }}
              >
                <img
                  src={BOOK_COVER_URL}
                  alt="The Menopause Weight Loss Trap book cover"
                  className="rounded-lg relative z-10"
                  style={{ width: 300, height: "auto" }}
                />
                {/* Glossy shine overlay */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none z-20"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
                  }}
                />
              </div>

              {/* Star rating — gold stars */}
              <div className="flex items-center gap-1.5 mt-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                ))}
                <span
                  className="text-xs font-semibold ml-2"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Available on Barnes & Noble
                </span>
              </div>
            </div>

            {/* ── Copy ── */}
            <div className="flex-1 text-center lg:text-left">
              <p
                className="font-extrabold uppercase tracking-widest mb-3"
                style={{ fontSize: 11, color: "#D4AF37", letterSpacing: "2.5px" }}
              >
                Dr. Jumana Al-Deek, DO
              </p>

              <h2
                className="font-black leading-tight mb-4"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.08,
                }}
              >
                The Menopause{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E, #C850C0, #7A1E7E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Weight Loss Trap
                </span>
              </h2>

              <p
                className="text-sm font-medium mb-7 italic"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                A Physician's Guide to GLP-1s &amp; Metabolism
              </p>

              <p
                className="mb-7 leading-relaxed"
                style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", maxWidth: 520 }}
              >
                You're eating well. You're exercising. You're doing everything right — and yet the
                scale won't budge. This book explains exactly why, and what to do instead.
              </p>

              {/* Bullet points */}
              <ul className="space-y-3 mb-9">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                      style={{
                        width: 20,
                        height: 20,
                        background: "rgba(212,175,55,0.12)",
                        border: "1px solid rgba(212,175,55,0.25)",
                      }}
                    >
                      <ChevronRight size={10} color="#D4AF37" strokeWidth={3} />
                    </span>
                    <span
                      className="text-sm leading-snug"
                      style={{ color: "rgba(255,255,255,0.92)" }}
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
                  className="rounded-xl font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  style={{
                    padding: "15px 32px",
                    fontSize: 11,
                    letterSpacing: "1.5px",
                    background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 8px 32px rgba(232,51,158,0.4), 0 0 0 1px rgba(232,51,158,0.15)",
                    cursor: "pointer",
                  }}
                >
                  Get the Free Preface
                </button>

                <a
                  href="https://www.barnesandnoble.com/w/the-menopause-weight-loss-trap-jumana-al-deek/1150481457?ean=9798996539000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    padding: "15px 24px",
                    background: "transparent",
                    color: "rgba(255,255,255,0.9)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D4AF37";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  View on Barnes & Noble
                  <ChevronRight size={14} />
                </a>
              </div>

              <p
                className="text-[11px] mt-5"
                style={{ color: "rgba(255,255,255,0.45)" }}
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
