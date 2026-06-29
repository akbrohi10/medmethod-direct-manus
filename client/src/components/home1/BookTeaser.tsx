/* =============================================================================
   BookTeaser — MedMethod Direct (Optimized / Compact)
   
   Design: Dark plum/aubergine background. Dr. Al-Deek holding the book on the
   left. Right side has serif heading, one punchy paragraph, italic tagline,
   and a pink "ORDER ON BARNES & NOBLE" CTA button.
   ============================================================================= */

const BOOK_COVER_URL = "/manus-storage/dr-aldeek-holding-book_27c4bf09.png";

export default function BookTeaser({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <section
      id="book"
      className="py-12 lg:py-16 px-4 relative overflow-hidden"
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
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">

          {/* ── Dr. Al-Deek holding the book — Left side ── */}
          <div className="flex-shrink-0 relative self-center">
            {/* Ambient glow behind photo */}
            <div
              className="absolute rounded-full blur-3xl"
              style={{
                width: 320,
                height: 380,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(122,30,126,0.3) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative transition-transform duration-500 hover:scale-[1.01]"
              style={{
                filter: "drop-shadow(0 16px 32px rgba(90,20,120,0.3)) drop-shadow(0 6px 16px rgba(0,0,0,0.3))",
              }}
            >
              <img
                src={BOOK_COVER_URL}
                alt="Dr. Al-Deek holding The Menopause Weight Loss Trap book"
                className="relative z-10 object-cover"
                loading="lazy"
                decoding="async"
                style={{
                  width: 360,
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 16,
                  aspectRatio: "4 / 5",
                  objectPosition: "center top",
                }}
              />
            </div>
          </div>

          {/* ── Copy — Right side ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Heading — serif style */}
            <h2
              className="mb-5"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              The Menopause{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "#E8339E",
                }}
              >
                Weight Loss Trap.
              </span>
            </h2>

            {/* Single condensed paragraph */}
            <p
              className="mb-5 leading-relaxed"
              style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", maxWidth: 520 }}
            >
              You're doing everything right — and the scale still won't budge. You're not failing.
              The rules changed, and no one told you. This book hands you the missing knowledge
              so you can <strong style={{ color: "#fff", fontWeight: 700 }}>reclaim your energy,
              your clarity, and your life</strong>.
            </p>

            {/* Italic tagline */}
            <p
              className="mb-7"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Your best days aren't behind you — they're still ahead.
            </p>

            {/* CTA Button */}
            <a
              href="https://www.barnesandnoble.com/w/the-menopause-weight-loss-trap-jumana-al-deek/1150481457?ean=9798996539000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 w-full sm:w-auto text-sm sm:text-base px-8 py-3.5 sm:px-10 sm:py-4"
              style={{
                letterSpacing: "2.5px",
                background: "linear-gradient(135deg, #E8339E, #d64a8f)",
                color: "#fff",
                border: "none",
                boxShadow: "0 10px 32px rgba(232,51,158,0.4), 0 4px 12px rgba(232,51,158,0.2)",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Order on Barnes & Noble
              <span className="text-sm sm:text-base">→</span>
            </a>

            {/* Secondary link */}
            <a
              href="https://drjumanaaldeek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 group transition-all hover:gap-3 justify-center lg:justify-start"
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
              }}
            >
              Read more about Dr. Jumana Al-Deek
              <span className="transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.35)" }}>→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
