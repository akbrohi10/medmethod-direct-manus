/* =============================================================================
   BookPage — "The Menopause Weight Loss Trap" Dedicated SEO Landing Page
   
   SEO Strategy: Dominate the search term "The Menopause Weight Loss Trap" by
   placing the exact title in: URL, H1, meta title, meta description, H2s,
   image alts, JSON-LD Book schema, and OG tags.
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/home1/Navbar";

const BN_LINK = "https://www.barnesandnoble.com/w/the-menopause-weight-loss-trap-jumana-al-deek/1150481457?ean=9798996539000";
const DR_HOLDING_BOOK = "/manus-storage/dr-aldeek-holding-book_27c4bf09.png";
const BOOK_COVER_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/KzPyKVdwkqgxjlHd.png";

const JSONLD_BOOK = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "The Menopause Weight Loss Trap",
  alternateName: "The Menopause Weight Loss Trap: A Physician's Guide to GLP-1s & Metabolism",
  author: {
    "@type": "Person",
    name: "Dr. Jumana Al-Deek",
    jobTitle: "Board Certified Physician and Menopause Expert",
    url: "https://drjumanaaldeek.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Med Method Direct Publishing",
  },
  isbn: "979-8-9965390-0-0",
  bookEdition: "First Edition",
  bookFormat: "https://schema.org/Paperback",
  numberOfPages: 192,
  inLanguage: "en",
  genre: ["Health & Fitness", "Menopause", "Weight Loss", "Women's Health"],
  description:
    "A physician's guide to understanding why traditional weight loss fails during menopause and how GLP-1 medications, combined with the DIRECT method, can help women over 40 reclaim their metabolism, energy, and confidence.",
  url: "https://medmethoddirect.com/the-menopause-weight-loss-trap",
  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/KzPyKVdwkqgxjlHd.png",
  offers: {
    "@type": "Offer",
    url: BN_LINK,
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "Barnes & Noble" },
  },
};



export default function BookPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>The Menopause Weight Loss Trap | Book by Dr. Jumana Al-Deek, DO</title>
        <meta
          name="description"
          content="The Menopause Weight Loss Trap: A Physician's Guide to GLP-1s & Metabolism by Dr. Jumana Al-Deek, DO. Discover why traditional weight loss fails in menopause and the evidence-based DIRECT method to reclaim your body. Order now on Barnes & Noble."
        />
        <meta
          name="keywords"
          content="The Menopause Weight Loss Trap, menopause weight loss book, GLP-1 menopause guide, Dr. Jumana Al-Deek book, menopause metabolism, weight loss menopause, GLP-1 for women over 40, semaglutide menopause, tirzepatide menopause"
        />
        <link rel="canonical" href="https://medmethoddirect.com/the-menopause-weight-loss-trap" />
        <meta property="og:title" content="The Menopause Weight Loss Trap | By Dr. Jumana Al-Deek, DO" />
        <meta property="og:description" content="A physician's guide to GLP-1s & metabolism. Why traditional weight loss fails in menopause — and what actually works. Order on Barnes & Noble." />
        <meta property="og:type" content="book" />
        <meta property="og:url" content="https://medmethoddirect.com/the-menopause-weight-loss-trap" />
        <meta property="og:image" content={BOOK_COVER_URL} />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Menopause Weight Loss Trap | Dr. Jumana Al-Deek" />
        <meta name="twitter:description" content="A physician's guide to GLP-1s & metabolism for women in menopause. Order now." />
        <meta name="twitter:image" content={BOOK_COVER_URL} />
        <script type="application/ld+json">{JSON.stringify(JSONLD_BOOK)}</script>
      </Helmet>

      {/* ── Main Site Navigation ── */}
      <Navbar onConsultClick={() => { window.location.href = "/discovery-call"; }} />

      {/* ── Hero Section ── */}
      <section
        className="py-16 lg:py-24 px-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a1e 0%, #2d1233 30%, #1f0d24 70%, #140a17 100%)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 25% 50%, rgba(90,20,120,0.25) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Dr. Al-Deek holding the book */}
            <div className="flex-shrink-0 relative">
              <div
                className="absolute rounded-full blur-3xl"
                style={{
                  width: 400,
                  height: 480,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(ellipse at center, rgba(232,51,158,0.15) 0%, transparent 70%)",
                }}
              />
              <img
                src={DR_HOLDING_BOOK}
                alt="Dr. Jumana Al-Deek holding The Menopause Weight Loss Trap book"
                className="relative z-10"
                loading="eager"
                style={{
                  width: 400,
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 16,
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Hero copy */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#E8339E", letterSpacing: 3 }}>
                New Book by Dr. Jumana Al-Deek, DO
              </p>
              <h1
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                The Menopause<br />
                <span style={{ color: "#E8339E" }}>Weight Loss Trap</span>
              </h1>
              <p
                className="mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                A Physician's Guide to GLP-1s & Metabolism
              </p>
              <p className="mb-8 leading-relaxed max-w-lg" style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>
                Why everything you've tried stopped working — and the evidence-based method that finally makes your body respond again.
              </p>

              {/* CTA */}
              <a
                href={BN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg text-base px-10 py-5"
                style={{
                  letterSpacing: "3px",
                  background: "linear-gradient(135deg, #E8339E, #d64a8f)",
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 12px 40px rgba(232,51,158,0.45), 0 4px 16px rgba(232,51,158,0.25)",
                }}
              >
                Order on Barnes & Noble →
              </a>

              <div className="mt-6 flex flex-wrap items-center gap-4 justify-center lg:justify-start" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                <span>ISBN: 979-8-9965390-0-0</span>
                <span>•</span>
                <span>192 Pages</span>
                <span>•</span>
                <span>First Edition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About The Menopause Weight Loss Trap ── */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 600,
              color: "#1a0a1e",
              lineHeight: 1.2,
            }}
          >
            What Is <em style={{ color: "#E8339E" }}>The Menopause Weight Loss Trap</em>?
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontSize: 16 }}>
                You're doing everything right — eating clean, exercising, counting calories — and the scale still climbs. The fatigue, the brain fog, the frustration don't just wear on your body; they chip away at your confidence and your life.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontSize: 16 }}>
                <strong>The Menopause Weight Loss Trap</strong> explains <em>why</em> your body stopped responding and gives you the physician-backed roadmap to make it respond again. Written by Dr. Jumana Al-Deek — a board-certified physician, menopause expert, and former certified personal trainer — this book bridges the gap between what your doctor tells you and what actually works.
              </p>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: 16 }}>
                Inside, you'll discover how GLP-1 medications like semaglutide and tirzepatide work specifically for menopausal women, and how the <strong>DIRECT method</strong> combines medical care, nutrition, fitness, and accountability into a sustainable system — not another diet that fails.
              </p>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontSize: 16 }}>
                This isn't another generic weight loss book. <strong>The Menopause Weight Loss Trap</strong> is a clinical guide written for women over 40 who are tired of being told to "just eat less and move more" when their hormones have fundamentally changed the rules.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontSize: 16 }}>
                Dr. Al-Deek draws on her dual background in medicine and fitness to deliver a protocol that addresses the root cause — metabolic dysfunction during menopause — not just the symptoms.
              </p>
              <p className="font-semibold text-gray-900 leading-relaxed" style={{ fontSize: 16 }}>
                If you've been trapped in a cycle of trying harder and getting nowhere, this book is your way out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who This Book Is For ── */}
      <section className="py-16 lg:py-20 px-4" style={{ background: "#faf7fb" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 600,
              color: "#1a0a1e",
              lineHeight: 1.2,
            }}
          >
            Who Should Read <em style={{ color: "#E8339E" }}>The Menopause Weight Loss Trap</em>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "Women over 40 experiencing unexplained weight gain despite diet and exercise",
              "Patients considering or currently using GLP-1 medications (Ozempic, Mounjaro, Zepbound)",
              "Women in perimenopause or menopause seeking physician-backed guidance",
              "Anyone frustrated by brain fog, fatigue, and metabolic slowdown",
              "Women who want to preserve lean muscle while losing weight",
              "Healthcare professionals looking for evidence-based menopause protocols",
            ].map((text, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm"
                style={{ borderLeft: "4px solid #E8339E" }}
              >
                <p className="text-gray-700 text-sm leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The DIRECT Method ── */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-center mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 600,
              color: "#1a0a1e",
              lineHeight: 1.2,
            }}
          >
            The DIRECT Method Inside <em style={{ color: "#E8339E" }}>The Menopause Weight Loss Trap</em>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" style={{ fontSize: 15 }}>
            The book introduces Dr. Al-Deek's proprietary framework — a six-phase clinical protocol designed specifically for menopausal metabolism.
          </p>

          <div className="space-y-4">
            {[
              { letter: "D", title: "Define the Metabolic Shift", desc: "Understand exactly how menopause rewires your metabolism at the cellular level" },
              { letter: "I", title: "Intervention", desc: "The right medical tools (including GLP-1s) at the right time, tailored to your labs" },
              { letter: "R", title: "Retain Lean Muscle Mass", desc: "Prevent the muscle loss that accelerates metabolic decline during weight loss" },
              { letter: "E", title: "Engineer the Nutritional Strategy", desc: "Macronutrient timing and composition designed for hormonal shifts" },
              { letter: "C", title: "Control Stress and Sleep", desc: "Address the cortisol-driven fat storage that sabotages every other effort" },
              { letter: "T", title: "Transition and Maintain", desc: "The Forever Method — sustainable protocols that prevent regain" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ background: "linear-gradient(135deg, #E8339E, #9b1d7a)", color: "#fff" }}
                >
                  {item.letter}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: 16 }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── About the Author ── */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 600,
              color: "#1a0a1e",
              lineHeight: 1.2,
            }}
          >
            About the Author of <em style={{ color: "#E8339E" }}>The Menopause Weight Loss Trap</em>
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <img
                src={DR_HOLDING_BOOK}
                alt="Dr. Jumana Al-Deek holding The Menopause Weight Loss Trap"
                className="rounded-2xl shadow-lg"
                loading="lazy"
                decoding="async"
                style={{ width: 320, maxWidth: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="font-bold text-xl mb-4 text-gray-900">Dr. Jumana Al-Deek, DO</h3>
              <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#E8339E", letterSpacing: 2 }}>
                Board Certified Physician • Menopause Expert
              </p>
              <p className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: 15 }}>
                Dr. Al-Deek specializes in helping women over 40 with medical weight loss, menopause, and hormone optimization. Before medical school, she was a certified personal trainer — giving her a rare dual perspective that values both expert medical care and sustainable lifestyle changes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: 15 }}>
                She is the co-founder of <strong>Med Method Direct Clinical PLLC</strong> and created the DIRECT method — a physician-led protocol that combines GLP-1 medications, hormone therapy, nutrition, fitness, and accountability coaching into one integrated system.
              </p>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: 15 }}>
                <em>The Menopause Weight Loss Trap</em> is her first book, distilling years of clinical experience into an actionable guide for women who are done with programs that don't work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-16 lg:py-20 px-4 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a1e 0%, #2d1233 50%, #1f0d24 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Get Your Copy of <em style={{ color: "#E8339E" }}>The Menopause Weight Loss Trap</em>
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            Stop fighting your body with methods that were never designed for menopause. Get the physician-backed roadmap that finally makes sense of what's happening — and what to do about it.
          </p>
          <a
            href={BN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg text-base px-10 py-5"
            style={{
              letterSpacing: "3px",
              background: "linear-gradient(135deg, #E8339E, #d64a8f)",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 12px 40px rgba(232,51,158,0.45), 0 4px 16px rgba(232,51,158,0.25)",
            }}
          >
            Order on Barnes & Noble →
          </a>
          <p className="mt-6" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Available now • ISBN 979-8-9965390-0-0 • 192 pages
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-2">
            © {new Date().getFullYear()} Med Method Direct™ Management LLC. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="/privacy-policy" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a>
            <span className="text-gray-300">·</span>
            <a href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a>
            <span className="text-gray-300">·</span>
            <a href="/" className="text-gray-500 hover:text-gray-700 transition-colors">MedMethodDirect.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
