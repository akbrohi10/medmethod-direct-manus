/* =============================================================================
   Medical Team — Doctor-First Layout
   Hero doctor card spans full width with a square portrait getting most of
   the spotlight; a slim purple ribbon below highlights the 1,000+ coach
   network as a clearly secondary supporting layer.
   ============================================================================= */
import { useEffect, useRef, useState, type ReactNode } from "react";

const DR_ALDEEK_SQUARE =
  "/manus-storage/dr-aldeek-hero-2026_628d7e54.png";

/** 7 unified-style coach portraits — same studio backdrop, key light,
 *  wardrobe family. AI-generated stand-ins; replace with real headshots
 *  as the team grows. Composition: 5 women + 2 men across white, Black,
 *  Hispanic, South Asian, East Asian; ages 28-46. Gender-alternated
 *  for visual rhythm in the avatar strip. */
const COACHES: { url: string; initials: string; name: string }[] = [
  { url: "/manus-storage/coach-07-female-white-30s_410ae205.png", initials: "MR", name: "Megan R." },
  { url: "/manus-storage/coach-11-male-black-40s_629b9bbb.png", initials: "JT", name: "Jamal T." },
  { url: "/manus-storage/coach-08-female-black-30s_cde302dd.png", initials: "DM", name: "Danielle M." },
  { url: "/manus-storage/coach-09-female-hispanic-30s_3e0dad17.png", initials: "AL", name: "Ana L." },
  { url: "/manus-storage/coach-03-male-hispanic-40s_070f8371.png", initials: "TV", name: "Tomás V." },
  { url: "/manus-storage/coach-10-female-southasian-30s_e017da36.png", initials: "RP", name: "Riya P." },
  { url: "/manus-storage/coach-12-female-eastasian-40s_cd46a42f.png", initials: "CB", name: "Cara B." },
];

const CREDENTIAL_PILLS = [
  "Board-Certified DO",
  "Menopause Specialist",
  "Licensed in 9 States",
];

const FOCUS_AREA_PILLS = [
  "Medical Weight Loss",
  "GLP-1 Therapy",
  "Hormone Optimization",
  "Perimenopause",
  "Metabolic Health",
  "Longevity Medicine",
];

const COACH_PILLS = [
  "Certified Personal Trainers",
  "Vetted by Dr. Al-Deek",
  "8+ Years Coaching Experience",
];

/** Bio sections. Each entry has a `teaser` (first sentence ish, always shown)
 *  and a `rest` (remaining sentences, hidden behind a Read more toggle). */
const BIO_SECTIONS: { label: string; teaser: ReactNode; rest: ReactNode }[] = [
  {
    label: "Practice Focus",
    teaser:
      "Dr. Jumana Al-Deek is a board-certified family physician and co-founder of MedMethod Direct, a telehealth-based medical practice focused on menopause medicine, metabolic health, hormone optimization, and medical weight management.",
    rest:
      "She specializes in evidence-based, personalized care for women navigating midlife health, body composition changes, and long-term wellness.",
  },
  {
    label: "Philosophy",
    teaser:
      "Dr. Al-Deek believes in taking a holistic, whole-person approach to patient care.",
    rest:
      "Rather than focusing on a single symptom or diagnosis in isolation, her philosophy centers on understanding how hormones, metabolism, nutrition, muscle health, sleep, stress, lifestyle, and preventive health all work together to impact overall well-being and healthy aging.",
  },
  {
    label: "Clinical Background",
    teaser:
      "Her clinical background includes outpatient family medicine, obesity medicine, preventive care, chronic disease management, and women's health.",
    rest:
      "She has experience treating a wide range of metabolic and hormone-related concerns including menopause symptoms, insulin resistance, weight gain, body composition changes, fatigue, and hair loss.",
  },
  {
    label: "Before Medicine",
    teaser: (
      <>
        Before pursuing medicine, Dr. Al-Deek co-founded{" "}
        <strong className="font-semibold text-[#111]">Send Me a Trainer</strong>, an early-stage fitness and wellness company that grew into one of the world’s largest in-home and virtual personal training franchise systems — often described as <em>“the Uber for personal training.”</em> She also worked as a personal trainer certified by the <strong className="font-semibold text-[#111]">National Academy of Sports Medicine</strong>.
      </>
    ),
    rest: (
      <>
        Her background in fitness, coaching, and exercise science continues to shape her medical philosophy today, with a strong emphasis on muscle preservation, metabolic health, sustainable lifestyle interventions, accountability, and long-term health optimization.
      </>
    ),
  },
  {
    label: "Medical Training",
    teaser:
      "She completed her Family Medicine residency at AdventHealth Winter Park after earning her Doctor of Osteopathic Medicine degree from West Virginia School of Osteopathic Medicine.",
    rest:
      "She also holds graduate training in physiology and biophysics from Georgetown University.",
  },
  {
    label: "Advanced Training & Approach",
    teaser:
      "Dr. Al-Deek has completed advanced menopause training through The Menopause Society as well as additional training in obesity medicine and metabolic health.",
    rest:
      "Her approach centers on evidence-based care that prioritizes metabolic health, muscle preservation, longevity, and helping patients feel stronger, healthier, and more confident throughout every stage of life.",
  },
];

/** Sections expanded by default — most narrative two. */
const DEFAULT_EXPANDED = new Set(["Practice Focus", "Philosophy"]);

export default function MedicalTeam({
  onConsultClick,
}: { onConsultClick?: () => void } = {}) {
  // FAQ-style expand state for the bottom 4 bio sections.
  // Top 2 (Practice Focus + Philosophy) are always fully visible.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleSection = (label: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  // Static coach count — small hand-vetted team
  const coachCount = 7;
  const numberRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      id="medical-team"
      className="py-12 md:py-16 lg:py-24"
      style={{ background: "#F4F4F8" }}
    >
      <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8">
        {/* ============================================================
            HERO DOCTOR CARD — self-contained: the section's headline,
            subhead, and primary CTA all live inside the card's right
            column so the previously-empty top area becomes the visual
            anchor of the page.
            ============================================================ */}
        <article
          className="relative overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(17,17,17,0.08)]"
          style={{ border: "1px solid rgba(17,17,17,0.04)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Portrait column — 5/12 on desktop. The portrait stays a
                clean 1:1 square (no stretching). On desktop the rose
                content panel below the photo grows to match the bio
                column's height; on mobile/tablet (stacked) it just takes
                its natural height so there are no voids. */}
            <div className="order-3 lg:order-1 lg:col-span-5 flex flex-col">
              {/* 3:4 portrait card (matches the photo's natural aspect, so no cropping).
                  Hidden on mobile — a duplicate, mobile-only render of
                  the photo lives inside the bio column (right after the
                  subhead) so on phones the stack reads:
                  eyebrow → headline → blurb → photo → CTA → bullets. */}
              <div
                className="relative w-full aspect-[3/4] hidden lg:block"
                style={{
                  background:
                    "linear-gradient(135deg, #E8D5DC 0%, #C9A8B6 100%)",
                }}
              >
                <img
                  src={DR_ALDEEK_SQUARE}
                  alt="Dr. Jumana Al-Deek, DO — Co-Founder & Medical Director"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Floating Co-Founder · Medical Director chip */}
                <div
                  className="absolute top-5 left-5 px-3.5 py-2 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase text-white"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background:
                      "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    boxShadow: "0 6px 18px rgba(122, 30, 126, 0.4)",
                  }}
                >
                  Co-Founder · Medical Director
                </div>
              </div>

              {/* Below-photo content — Education timeline + Pull-quote.
                  Soft rose/cream wash so it reads as a continuation of
                  the portrait column rather than the white bio panel. */}
              <div
                className="flex-1 p-6 md:p-8 lg:p-10 space-y-7"
                style={{
                  background:
                    "linear-gradient(180deg, #FBF6F8 0%, #F4E8EE 100%)",
                }}
              >
                {/* Education timeline */}
                <div>
                  <span
                    className="text-[14px] tracking-[0.04em] font-bold"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "#B8336A",
                    }}
                  >
                    Training & Credentials
                  </span>
                  <ul className="mt-4 space-y-3.5">
                    {[
                      {
                        org: "West Virginia School of Osteopathic Medicine",
                        detail: "Doctor of Osteopathic Medicine",
                      },
                      {
                        org: "AdventHealth Winter Park",
                        detail: "Family Medicine Residency",
                      },
                      {
                        org: "Georgetown University",
                        detail: "Graduate Training, Physiology & Biophysics",
                      },
                      {
                        org: "The Menopause Society",
                        detail: "Advanced Menopause Training",
                      },
                      {
                        org: "Obesity Medicine Association",
                        detail: "Obesity & Metabolic Health Certification",
                      },
                    ].map((item) => (
                      <li
                        key={item.org}
                        className="flex gap-3 items-start"
                      >
                        <span
                          aria-hidden
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                          }}
                        />
                        <div className="min-w-0">
                          <div
                            className="text-[15px] md:text-[16px] font-bold text-[#1a1a1a] leading-tight"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {item.org}
                          </div>
                          <div
                            className="text-[13.5px] md:text-[14px] text-[#7A1E7E] mt-1"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {item.detail}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Pre-Medicine chapter — visually offset (lighter dot,
                      hollow ring, separate eyebrow) so it reads as a
                      different chapter of her story, not just another
                      medical credential. */}
                  <div
                    className="mt-6 pt-5 border-t"
                    style={{ borderColor: "rgba(122, 30, 126, 0.15)" }}
                  >
                    <span
                      className="text-[13px] tracking-[0.04em] font-bold"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        color: "#7A1E7E",
                        opacity: 0.85,
                      }}
                    >
                      Pre-Medicine Background
                    </span>
                    <ul className="mt-3 space-y-3.5">
                      <li className="flex gap-3 items-start">
                        <span
                          aria-hidden
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: "transparent",
                            border: "1.5px solid #B8336A",
                          }}
                        />
                        <div className="min-w-0">
                          <div
                            className="text-[15px] md:text-[16px] font-bold text-[#1a1a1a] leading-tight"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            Background in Fitness & Exercise Science
                          </div>
                          <div
                            className="text-[13.5px] md:text-[14px] text-[#7A1E7E] mt-1"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            Former NASM-Certified Personal Trainer
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pull-quote, anchored at the bottom of the column */}
                <blockquote
                  className="pt-6 border-t"
                  style={{ borderColor: "rgba(122, 30, 126, 0.15)" }}
                >
                  <p
                    className="italic text-[#1a1a1a] text-[15px] md:text-[16px] leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    "Midlife isn't a single symptom to manage — it's
                    hormones, metabolism, muscle, sleep, and stress all
                    shifting at once. My job is to look at the whole
                    picture and help you come out of it stronger, not just
                    medicated."
                  </p>
                  <footer
                    className="mt-3 text-[10px] tracking-[0.2em] uppercase font-bold"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "#7A1E7E",
                    }}
                  >
                    — Dr. Al-Deek
                  </footer>
                </blockquote>
              </div>
            </div>

            {/* Bio panel — 7/12, room to breathe.
                 Name & focus line are intentionally carried by the portrait
                 (which has "DR. JUMANA ALDEEK, DO / MENOPAUSE. METABOLISM.
                 MEDICAL WEIGHT LOSS." typeset into the image). The bio
                 panel leads directly with credentials + story. */}
            {/* Bio panel — 7/12. `justify-center` only on desktop so the
                bio sits visually centered next to the (taller) photo+timeline
                column. On stacked mobile/tablet the panel just flows naturally
                from the top of its space — no big cream void above the
                eyebrow. */}
            <div className="order-1 lg:order-2 lg:col-span-7 p-6 md:p-10 lg:p-14 flex flex-col">
              {/* Visually-hidden H3 stays. */}
              {/* Visually-hidden H3 for screen readers + SEO so the
                  document outline still has her name as a heading. */}
              <h3 className="sr-only">
                Dr. Jumana Al-Deek, DO — Co-Founder & Medical Director
              </h3>

              {/* ===== Hero header (lives inside the card now) ===== */}
              <span
                className="section-label block mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Your Doctor
              </span>
              <h2
                className="font-black text-[#111111] leading-[1.05]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(2rem, 4.2vw, 3.2rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                MEET{" "}
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    whiteSpace: "nowrap",
                  }}
                >
                  DR. AL-DEEK.
                </span>
              </h2>
              <p
                className="mt-4 text-[#3a3a3a] text-lg md:text-xl leading-snug"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Lose the weight. Balance the hormones. Direct access to your doctor.
              </p>

              {/* ===== MOBILE-ONLY photo, right under the blurb =====
                  On phones, her portrait sits between the subhead and the
                  Free Consultation CTA so the user sees her face inside
                  the first scroll. Duplicated (vs. moved) so the desktop
                  layout is preserved exactly. */}
              <div
                className="lg:hidden mt-6 -mx-6 md:-mx-10 relative w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] aspect-[3/4] sm:aspect-[4/3] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #E8D5DC 0%, #C9A8B6 100%)",
                }}
              >
                <img
                  src={DR_ALDEEK_SQUARE}
                  alt="Dr. Jumana Al-Deek, DO — Co-Founder & Medical Director"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase text-white"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background:
                      "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    boxShadow: "0 6px 18px rgba(122, 30, 126, 0.4)",
                  }}
                >
                  Co-Founder · Medical Director
                </div>
              </div>

              {/* Primary CTA + microcopy + reassurance row.
                  Mobile: button is full-width, microcopy + bullets stack underneath.
                  Desktop: button left, microcopy + bullets right. */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={onConsultClick}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-bold tracking-[0.04em] uppercase text-white transition-transform duration-200 ease-out hover:-translate-y-[1px] active:scale-[0.98]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    background:
                      "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    boxShadow: "0 12px 28px rgba(122, 30, 126, 0.3)",
                  }}
                >
                  Schedule a Discovery Call
                </button>
                <div className="flex flex-col gap-2">
                  {/* Microcopy: free 15-min framing
                      directly under/beside the CTA so users know what
                      they're getting before they click. */}
                  <p
                    className="text-[12.5px] leading-snug text-[#5a4452]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span className="font-semibold text-[#7A1E7E]">Free 15-min discovery call with our care team</span>
                    {" \u00b7 "}
                    <span>No cost, no obligation</span>
                  </p>
                  <ul
                    className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#5a4452]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <li className="flex items-center gap-1.5">
                      <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8339E" }} />
                      100% Virtual
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8339E" }} />
                      Same Doctor. Every Visit.
                    </li>
                  </ul>
                </div>
              </div>

              {/* ===== Divider before bio body ===== */}
              <div
                className="my-7 lg:my-9 h-px w-full"
                style={{ background: "linear-gradient(90deg, rgba(232,51,158,0.3) 0%, rgba(232,51,158,0) 100%)" }}
              />

              {/* Eyebrow */}
              <span
                className="text-[14px] tracking-[0.04em] font-bold"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#B8336A",
                }}
              >
                About Your Physician
              </span>

              {/* Credentials — solid pink fill, conveys authority. */}
              <div className="mt-5">
                <span
                  className="text-[12px] tracking-[0.18em] uppercase font-semibold block mb-2"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "#8a4a72",
                  }}
                >
                  Credentials
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {CREDENTIAL_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-wide"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        background: "#F4E8EE",
                        color: "#7A1E7E",
                        border: "1px solid #E8D5DC",
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Focus Areas — white with magenta border, visually
                  distinct from credentials so the two rows don't blur. */}
              <div className="mt-5">
                <span
                  className="text-[12px] tracking-[0.18em] uppercase font-semibold block mb-2"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "#8a4a72",
                  }}
                >
                  Focus Areas
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {FOCUS_AREA_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-wide"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        background: "#FFFFFF",
                        color: "#B8336A",
                        border: "1.5px solid #E8339E",
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full bio —
                  Top 2 sections (Practice Focus, Philosophy) render as
                  always-visible full paragraphs. Bottom 4 sections render
                  as FAQ-style clickable rows: heading + + / − icon,
                  expanding to reveal the full paragraph on click. The FAQ
                  cluster is framed by thin dividers so it reads as a
                  distinct supporting block. */}
              <div
                className="mt-7 text-[#2a2a2a] text-[17px] md:text-[18px] leading-[1.65]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {/* Top 2 — always-visible full paragraphs */}
                {BIO_SECTIONS.slice(0, 2).map((section, i) => {
                  return (
                    <section
                      key={section.label}
                      className={i === 0 ? "" : "mt-5"}
                    >
                      <h4
                        className="text-[14px] tracking-[0.04em] font-bold mb-2.5"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          color: "#B8336A",
                        }}
                      >
                        {section.label}
                      </h4>
                      <p>
                        {section.teaser}
                        {" "}
                        {section.rest}
                      </p>
                    </section>
                  );
                })}

                {/* Bottom 4 — FAQ cluster */}
                <div
                  className="mt-7 border-t border-b"
                  style={{ borderColor: "#EAD9E1" }}
                >
                  {BIO_SECTIONS.slice(2).map((section, i) => {
                    const isOpen = expanded.has(section.label);
                    return (
                      <div
                        key={section.label}
                        className={
                          i === 0 ? "" : "border-t"
                        }
                        style={{
                          borderColor: "#F1E2E8",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleSection(section.label)
                          }
                          className="w-full flex items-center justify-between text-left py-4 group"
                          aria-expanded={isOpen}
                        >
                          <span
                            className="text-[15px] tracking-[0.02em] font-bold transition-colors"
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                              color: isOpen
                                ? "#7A1E7E"
                                : "#B8336A",
                            }}
                          >
                            {section.label}
                          </span>
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-full text-[14px] font-bold transition-all duration-200"
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                              background: isOpen
                                ? "#7A1E7E"
                                : "#F4E8EE",
                              color: isOpen
                                ? "#FFFFFF"
                                : "#7A1E7E",
                              transform: isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            aria-hidden="true"
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-300 ease-out"
                          style={{
                            maxHeight: isOpen ? "600px" : "0",
                            opacity: isOpen ? 1 : 0,
                          }}
                        >
                          <p className="pb-5 pr-9">
                            {section.teaser}
                            {" "}
                            {section.rest}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </article>
      </div>
    </section>
  );
}
