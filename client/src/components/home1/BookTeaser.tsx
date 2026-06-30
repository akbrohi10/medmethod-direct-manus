/* =============================================================================
   BookTeaser — MedMethod Direct
   
   Design: Dark plum/aubergine background. Book cover on the left with "NEW BOOK"
   badge overlaying the top. Right side has elegant serif headings, body copy,
   italic tagline, and a pink "ORDER ON AMAZON" CTA button.
   ============================================================================= */

const BOOK_COVER_URL = "/manus-storage/dr-aldeek-holding-book_27c4bf09.png";

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
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

          {/* ── Dr. Al-Deek holding the book — Left side ── */}
          <div className="flex-shrink-0 relative self-center lg:self-start">
            {/* Ambient glow behind photo */}
            <div
              className="absolute rounded-full blur-3xl"
              style={{
                width: 380,
                height: 450,
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
                filter: "drop-shadow(0 20px 40px rgba(90,20,120,0.35)) drop-shadow(0 8px 20px rgba(0,0,0,0.35))",
              }}
            >
              <img
                src={BOOK_COVER_URL}
                alt="Dr. Al-Deek holding The Menopause Weight Loss Trap book"
                className="relative z-10 object-cover"
                loading="lazy"
                decoding="async"
                style={{
                  width: 440,
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 20,
                  aspectRatio: "1 / 1",
                  objectPosition: "center top",
                }}
              />
            </div>
          </div>

          {/* ── Copy — Right side ── */}
          <div className="flex-1 text-center lg:text-left pt-0 lg:pt-4">

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
              href="https://www.barnesandnoble.com/w/the-menopause-weight-loss-trap-jumana-al-deek/1150481457?ean=9798996539000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 w-full sm:w-auto text-sm sm:text-base lg:text-lg px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-5"
              style={{
                letterSpacing: "3px",
                background: "linear-gradient(135deg, #E8339E, #d64a8f)",
                color: "#fff",
                border: "none",
                boxShadow: "0 12px 40px rgba(232,51,158,0.45), 0 4px 16px rgba(232,51,158,0.25)",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Order on Barnes & Noble
              <span className="text-sm sm:text-base lg:text-lg">→</span>
            </a>

            {/* Internal link to book page for SEO */}
            <a
              href="/the-menopause-weight-loss-trap"
              className="flex items-center gap-2 mt-6 group transition-all hover:gap-3 justify-center lg:justify-start"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
              }}
            >
              Learn more about the book
              <span className="transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.5)" }}>→</span>
            </a>

            {/* Secondary link — Dr. Al-Deek personal site */}
            <a
              href="https://drjumanaaldeek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-3 group transition-all hover:gap-3 justify-center lg:justify-start"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
              }}
            >
              Read more about Dr. Jumana Al-Deek
              <span className="transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.4)" }}>→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
