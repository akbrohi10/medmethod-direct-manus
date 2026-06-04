/* =============================================================================
   BookTeaser — MedMethod Direct
   
   Design: Dark plum/aubergine background. Book cover on the left with 3D
   perspective. Right side has elegant serif headings, body copy, italic tagline,
   and a pink "ORDER ON AMAZON" CTA button.
   ============================================================================= */

const BOOK_COVER_URL = "/manus-storage/dr-aldeek-book-hero_65fd1689.png";

export default function BookTeaser({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      id="book"
      className="py-20 lg:py-28 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0a1e 0%, #2d1233 30%, #1f0d24 70%, #140a17 100%)",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 30% 50%, rgba(90,20,120,0.2) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Book Cover — Left side ── */}
          <div className="flex-shrink-0 flex flex-col items-center relative">
            {/* Big NEW BOOK label above the photo */}
            <h3
              className="font-black uppercase tracking-wider text-center mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                color: "#fff",
                letterSpacing: "6px",
                textShadow: "0 2px 20px rgba(232,51,158,0.4)",
              }}
            >
              New Book
            </h3>
            {/* Ambient glow behind book */}
            <div
              className="absolute rounded-full blur-3xl"
              style={{
                width: 320,
                height: 400,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(122,30,126,0.35) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative transition-transform duration-500 hover:scale-[1.01]"
              style={{
                filter: "drop-shadow(0 24px 48px rgba(90,20,120,0.4)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
              }}
            >
              <img
                src={BOOK_COVER_URL}
                alt="Dr. Al-Deek holding The Menopause Weight Loss Trap book"
                className="relative z-10 object-cover"
                style={{
                  width: 460,
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 16,
                }}
              />
            </div>
          </div>

          {/* ── Copy — Right side ── */}
          <div className="flex-1 text-center lg:text-left">



            {/* Heading — serif style */}
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              The Menopause<br />
              <span
                style={{
                  fontStyle: "italic",
                  color: "#E8339E",
                }}
              >
                Weight Loss Trap.
              </span>
            </h2>

            {/* Body copy */}
            <p
              className="mb-6 leading-relaxed"
              style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 560 }}
            >
              You're doing everything right — and the scale still climbs. The fatigue, the
              fog, the frustration don't just wear on your body; they chip away at your
              confidence and your life. You're not failing. The rules changed, and no
              one told you.
            </p>

            <p
              className="mb-8 leading-relaxed"
              style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 560 }}
            >
              This book hands you the missing knowledge to make your body respond
              again — so you don't just lose the weight, you{" "}
              <strong style={{ color: "#fff", fontWeight: 700 }}>
                reclaim your energy, your clarity, and your life
              </strong>.
            </p>

            {/* Italic tagline */}
            <p
              className="mb-10"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Your best days aren't behind you — they're still ahead.
            </p>

            {/* CTA Button */}
            <a
              href="https://www.amazon.com/dp/B0F1TQ2MBM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              style={{
                padding: "16px 36px",
                fontSize: 12,
                letterSpacing: "2px",
                background: "linear-gradient(135deg, #E8339E, #d64a8f)",
                color: "#fff",
                border: "none",
                boxShadow: "0 8px 32px rgba(232,51,158,0.35)",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Order on Amazon
              <span style={{ fontSize: 14 }}>→</span>
            </a>

            {/* Secondary link — Dr. Al-Deek personal site */}
            <a
              href="https://drjumanaaldeek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 transition-opacity hover:opacity-100"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: 2,
              }}
            >
              Learn more about Dr. Jumana Al-Deek →
            </a>

            {/* Credit line */}
            <p
              className="mt-6 leading-relaxed"
              style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", maxWidth: 520 }}
            >
              A board-certified physician's guide to GLP-1s, hormones, and metabolism by Dr.
              Jumana Aldeek, DO — the method that turns midlife into your comeback, not your
              decline.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
