import { type ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Actual detailed physician profile copied from /masterclass.
// V3-local: original pages and shared physician profile remain unchanged.

const CREDENTIAL_PILLS = [
  "Family Physician",
  "Menopause Society Certified Practitioner",
  "Menopause Specialist",
  "Metabolism",
  "Author",
  "Mom of Four",
];

const FOCUS_AREA_PILLS = [
  "Medical Weight Loss",
  "Menopause & Perimenopause",
  "GLP-1 & Metabolic Therapy",
  "Hormone Optimization",
  "Thyroid Specialist",
  "Metabolism",
];

const BIO_SECTIONS: { label: string; teaser: ReactNode; rest: ReactNode }[] = [
  {
    label: "Practice Focus",
    teaser: (
      <>
        The prescription is only the beginning. Hormone and weight-loss
        treatments aren’t one-size-fits-all. Whether you’re considering
        treatment or already taking medication, Dr. Al-Deek reviews your
        symptoms, health history, current medications, response to treatment,
        and goals to create—or optimize—a plan built around you.
      </>
    ),
    rest: (
      <>
        Dr. Al-Deek is a board-certified physician, menopause specialist, and
        author of{" "}
        <strong className="font-bold" style={{ color: "#E8339E" }}>
          The Menopause Weight Loss Trap
        </strong>
        .
      </>
    ),
  },
  {
    label: "Philosophy",
    teaser:
      "Long before medical school, Dr. Al-Deek was a certified personal trainer working exclusively with women struggling through hormonal weight gain. She spent years watching the same story repeat \u2014 women doing everything \u201Cright\u201D but losing the battle against their own biology.",
    rest: "That experience drove her to medicine so she could better understand the health concerns women bring to care. Today, as a physician and a mom of four, she combines clinical expertise with a personal understanding of what midlife women are going through.",
  },
  {
    label: "Clinical Background",
    teaser:
      "Her clinical background includes outpatient family medicine, obesity medicine, preventive care, chronic disease management, and women's health.",
    rest: null,
  },
  {
    label: "Medical Training",
    teaser:
      "She completed her Family Medicine residency at AdventHealth Winter Park after earning her Doctor of Osteopathic Medicine degree from West Virginia School of Osteopathic Medicine.",
    rest: "She also holds graduate training in physiology and biophysics from Georgetown University.",
  },
  {
    label: "Advanced Training & Approach",
    teaser:
      "Dr. Al-Deek has completed advanced menopause training through The Menopause Society as well as additional training in obesity medicine and metabolic health.",
    rest: "",
  },
];

export default function Masterclass3FullBio({ onBookVisit }: { onBookVisit: () => void }) {
  return (
    <section
      data-masterclass3-full-bio
      aria-label="Dr. Jumana Al-Deek's full story"
      className="border-t border-[#f0e5eb] bg-[#fff9fb] px-5 py-7 sm:px-10 sm:py-8 lg:px-16"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Accordion type="single" collapsible className="mx-auto w-full max-w-[980px]">
        <AccordionItem value="full-story" className="overflow-hidden rounded-2xl border border-[#e7d6df] bg-white px-5 shadow-[0_10px_28px_rgba(89,31,84,0.08)] sm:px-8">
          <AccordionTrigger data-masterclass3-full-bio-toggle className="items-center gap-3 py-5 text-left text-base font-bold leading-relaxed text-[#7a1e7e] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] sm:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[#7a1e7e] motion-reduce:[&>svg]:transition-none">
            Meet your doctor — Dr. Jumana Al-Deek's full story
          </AccordionTrigger>
          <AccordionContent data-masterclass3-full-bio-content className="border-t border-[#eadfe5] pt-6 pb-7 motion-reduce:animate-none">
      <header
        data-masterclass3-full-story-profile-introduction
        className="mx-auto mb-5 max-w-[980px] text-center sm:mb-6"
      >
        <h2
          id="masterclass3-full-story-heading"
          className="text-[26px] font-bold leading-tight text-[#7A1E7E] sm:text-[32px]"
        >
          Meet Dr. Jumana Al-Deek, DO,MS
        </h2>
        <a
          data-masterclass3-full-story-physician-recognition
          href="https://www.orlandofamilymagazine.com/current-issue/2026-top-physicians/"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-3 inline-flex max-w-full flex-col items-center rounded-xl border border-[#E8D5DC] bg-[#F4E8EE] px-4 py-2 text-center text-[#7A1E7E] transition-colors hover:bg-[#E8D5DC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A1E7E]"
        >
          <span className="text-sm font-semibold leading-snug sm:text-[15px]">
            Recognized as a 2026 Top Physician
          </span>
          <span className="mt-0.5 text-sm font-medium leading-snug">
            Orlando Family Magazine
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#6e5364] sm:text-base">
          Her background, qualifications &amp; approach to care.
        </p>
      </header>
      <article
        className="mx-auto max-w-[980px] overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(17,17,17,0.08)]"
        style={{ border: "1px solid rgba(17,17,17,0.04)" }}
      >
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="contents lg:col-span-5 lg:flex lg:flex-col">
            <div
              className="order-3 lg:order-none flex-1 p-6 md:p-8 lg:p-10 space-y-7"
              style={{
                background: "linear-gradient(180deg, #FBF6F8 0%, #F4E8EE 100%)",
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
                  ].map(item => (
                    <li key={item.org} className="flex gap-3 items-start">
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
                  "Midlife can involve changes in hormones, metabolism, sleep,
                  and stress. My job is to review the whole picture with each
                  patient and discuss options that may be appropriate."
                </p>
                <footer
                  className="mt-3 text-xs tracking-[0.2em] uppercase font-bold"
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
          <div className="order-2 p-6 md:p-8 lg:order-none lg:col-span-7 lg:p-8">
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
                className="text-xs tracking-[0.18em] uppercase font-semibold block mb-2"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#8a4a72",
                }}
              >
                Credentials
              </span>
              <div className="flex flex-wrap gap-2.5">
                {CREDENTIAL_PILLS.map(pill => (
                  <span
                    key={pill}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide"
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
                className="text-xs tracking-[0.18em] uppercase font-semibold block mb-2"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#8a4a72",
                }}
              >
                Focus Areas
              </span>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREA_PILLS.map(pill => (
                  <span
                    key={pill}
                    className="px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold tracking-wide"
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

              {/* All original full paragraphs are revealed by the single outer toggle. */}
            <div
              className="mt-7 text-[#2a2a2a] text-[17px] md:text-[18px] leading-[1.65]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {BIO_SECTIONS.map((section, i) => (
                <section key={section.label} data-masterclass3-full-story-paragraph className={i === 0 ? "" : "mt-5"}>
                  <h4
                    className="text-[14px] tracking-[0.04em] font-bold mb-2.5"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#B8336A" }}
                  >
                    {section.label}
                  </h4>
                  <p>{section.teaser} {section.rest}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
            <div data-masterclass3-bio-booking className="mx-auto mt-7 grid max-w-[900px] gap-5 border-t border-[#eadfe5] pt-5 sm:grid-cols-2">
              <a href="/care-team-booking" data-masterclass3-bio-discovery-cta className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e8339e] to-[#7a1e7e] px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-white shadow-[0_10px_22px_rgba(122,30,126,0.22)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your Free 15-Minute Discovery Call
              </a>
              <button type="button" data-masterclass3-bio-visit-cta onClick={onBookVisit} className="mt-2 inline-flex min-h-[82px] w-full items-center justify-center rounded-full border-2 border-[#b8336a] bg-white px-5 py-3 text-center text-[13px] font-black uppercase tracking-[0.035em] text-[#7a1e7e] shadow-[0_5px_12px_rgba(122,30,126,0.05)] transition hover:-translate-y-0.5 hover:bg-[#fff5fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#7a1e7e] active:scale-[0.98]">
                Book Your 45-Minute Visit with Dr. Al-Deek — $199
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
