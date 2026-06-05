/* =============================================================================
   Testimonials — MedMethod Direct
   12 patient stories: ages 30s–60s+, post-pregnancy, perimenopause, menopause,
   hormone optimization, weight loss
   Layout: 4 cards visible, horizontal scroll for all 12
   Truncated text with inline "Read more" / "Show less" expand/collapse
   ============================================================================= */

import { useState } from "react";

const TRUNCATE_LENGTH = 80;

const testimonials = [
  {
    name: "Margaret H.",
    age: "Age 56",
    stars: 5,
    text: "I thought menopause was something you just suffered through. Night sweats so bad I was changing sheets at 3 AM. Brain fog so thick I forgot my own PIN number at the grocery store. My hair was thinning and I'd gained 45 lbs in two years. MedMethod ran panels my doctor never even mentioned and started me on GLP-1 alongside hormone therapy. Eight months later I've lost 41 lbs, my hair is growing back, and I haven't had a night sweat in four months. This program gave me my life back.",
    treatment: "GLP-1 + Menopause Care",
    lost: "41 lbs",
    duration: "8 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/margaret-h-new_b26b42af.png",
  },
  {
    name: "Jennifer L.",
    age: "Age 52",
    stars: 5,
    text: "Hot flashes 10+ times a day, anxiety out of nowhere, and 30 lbs that appeared almost overnight when I hit menopause. I'd been trying to lose it for three years. MedMethod's combination of bioidentical hormones and a supervised weight loss plan got me down 28 lbs in 4 months. I only wish I had found them sooner.",
    treatment: "Menopause + Weight Loss",
    lost: "28 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/jennifer-l-new_354fb07a.png",
  },
  {
    name: "Maryam A.",
    age: "Age 39",
    stars: 5,
    text: "After my second baby I couldn't lose the weight no matter what I did. Four years of struggling and feeling invisible in my own body. MedMethod found I had insulin resistance and low progesterone — two things my OB never tested for. In 4 months I lost 21 lbs and finally feel like me again.",
    treatment: "Post-Pregnancy + Hormones",
    lost: "21 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/rosa-g-new_e6d2a50f.png",
  },
  {
    name: "Christine D.",
    age: "Age 48",
    stars: 5,
    text: "The rage came out of nowhere. I'd snap at my kids over nothing, then cry in the bathroom feeling guilty. My PCP put me on an antidepressant but it made things worse. MedMethod tested my hormones and found my progesterone was almost zero and my thyroid was borderline. Four months into treatment the mood swings are gone, I'm sleeping 7 hours straight, and I've lost 25 lbs. This was the answer I'd been searching for.",
    treatment: "Perimenopause Care",
    lost: "25 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/christine-d-new_9e6b8fa2.png",
  },
  {
    name: "Diane M.",
    age: "Age 63",
    stars: 5,
    text: "At 63 I thought my best years were behind me. I was 75 lbs overweight, exhausted all the time, and couldn't sleep through the night. My MedMethod doctor ran labs my PCP never ordered and completely changed my protocol. Within a year I lost 68 lbs. I'm hiking and traveling again — things I hadn't done in a decade.",
    treatment: "GLP-1 + Hormone Therapy",
    lost: "68 lbs",
    duration: "11 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/AldSnvX4MNCG_e5b3d449.jpg",
  },
  {
    name: "Sarah M.",
    age: "Age 47",
    stars: 5,
    text: "The night sweats and insomnia were ruining my life. I'd wake up drenched at 2 AM and couldn't fall back asleep. My regular doctor kept saying my labs were 'normal.' MedMethod found my progesterone was almost nonexistent and paired GLP-1 with hormone therapy to address both the weight and the symptoms. Within 6 weeks I was sleeping through the night for the first time in two years. I've also lost 31 lbs in 5 months and my energy is completely back.",
    treatment: "GLP-1 + Hormone Therapy",
    lost: "31 lbs",
    duration: "5 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/ltMJiXwpTidN_abca7d8e.jpg",
  },
  {
    name: "Noorah A.",
    age: "Age 44",
    stars: 5,
    text: "I didn't recognize myself anymore — I felt stuck, tired, and uncomfortable in my own skin. I had tried everything, but nothing seemed to work long term. MedMethod Direct finally connected the dots. Once we addressed my hormones and built a plan that actually made sense for my body, everything started to shift. I'm down 25 pounds, but more importantly, I feel clear, confident, and back in control again. Even my family has noticed the difference. I only wish I had started sooner.",
    treatment: "GLP-1 + Perimenopause Care",
    lost: "25 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/michelle-r-v2_6298ec07.png",
  },
  {
    name: "Cassie R.",
    age: "Age 34",
    stars: 5,
    text: "After three pregnancies I was 65 lbs over my pre-baby weight and nothing was working. My hormones were a mess postpartum and my regular OB just said 'diet and exercise.' MedMethod actually ran the right labs and got me on a plan. Ten months later I've lost 58 lbs and finally feel like myself again.",
    treatment: "Post-Pregnancy Weight Loss",
    lost: "58 lbs",
    duration: "10 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/KUFNTBEfs72g_02b8a37b.jpg",
  },
  {
    name: "Linda B.",
    age: "Age 58",
    stars: 5,
    text: "I was carrying 70 extra pounds and had tried every program imaginable. My mood swings were so bad my husband thought I needed therapy — turns out I needed hormone balancing. MedMethod's combination of GLP-1 therapy and BHRT was the missing piece. Down 61 lbs in 9 months. My doctor says my bloodwork looks like a 40-year-old's.",
    treatment: "GLP-1 + BHRT",
    lost: "61 lbs",
    duration: "9 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/linda-b-new_fb7647e2.png",
  },
  {
    name: "Evelyn C.",
    age: "Age 53",
    stars: 5,
    text: "Hot flashes every hour, 40 lbs I couldn't lose, and a doctor who kept telling me it was 'just menopause — you'll get through it.' MedMethod actually listened. They tested my thyroid, cortisol, estrogen, progesterone — everything. They added GLP-1 to my protocol and the weight finally started moving. I sleep, I think clearly, and I've lost 38 lbs in 6 months.",
    treatment: "GLP-1 + Menopause Care",
    lost: "38 lbs",
    duration: "6 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/DWwU3M7Bvc7V_d595fbd4.jpg",
  },
  {
    name: "Andrea K.",
    age: "Age 51",
    stars: 5,
    text: "I went from having hot flashes 15 times a day to maybe one a week. My joints ached constantly, I had zero interest in intimacy, and I was gaining weight around my midsection no matter what I ate. My MedMethod doctor explained that my estrogen had dropped off a cliff and my cortisol was through the roof. Six months on BHRT and I feel like a completely different person. Down 33 lbs and my husband says I'm smiling again.",
    treatment: "BHRT + Weight Loss",
    lost: "33 lbs",
    duration: "6 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/placeholder-card-1_0cb323f3.jpg",
  },
  {
    name: "Tamara J.",
    age: "Age 38",
    stars: 5,
    text: "Postpartum depression hit me hard and the weight just piled on — 72 lbs over 2 years. I was embarrassed and exhausted. My anxiety was through the roof and I had zero libido. MedMethod treated the whole picture: hormones, nutrition, mental wellness. I've lost 50 lbs and I'm the mom I always wanted to be.",
    treatment: "Post-Pregnancy Weight Loss",
    lost: "50 lbs",
    duration: "8 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/tamara-j-new_3b0d7981.png",
  },
];

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = t.text.length > TRUNCATE_LENGTH;
  const displayText = expanded || !needsTruncation
    ? t.text
    : t.text.slice(0, TRUNCATE_LENGTH).trimEnd() + "...";

  return (
    <div
      key={index}
      className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col border shadow-sm"
      style={{
        background: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.10)',
        width: "clamp(280px, 78vw, 300px)",
        scrollSnapAlign: "start",
      }}
    >
      {/* Before / After photo */}
      <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
        <img
          src={t.beforeAfter}
          alt={`${t.name} transformation`}
          className="w-full h-full object-cover object-top"
        />
        {/* Before / After labels */}
        <div className="absolute bottom-0 left-0 right-0 flex">
          <div
            className="flex-1 text-center text-white text-xs font-bold py-1"
            style={{ background: "rgba(0,0,0,0.55)", letterSpacing: "1px" }}
          >
            BEFORE
          </div>
          <div
            className="flex-1 text-center text-white text-xs font-bold py-1"
            style={{
              background: "linear-gradient(90deg, rgba(232,51,158,0.80), rgba(122,30,126,0.80))",
              letterSpacing: "1px",
            }}
          >
            AFTER
          </div>
        </div>
        {/* Result badge */}
        <div
          className="absolute top-2 right-2 text-white text-xs font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, #E8339E, #7A1E7E)",
            letterSpacing: "0.5px",
          }}
        >
          -{t.lost} in {t.duration}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: t.stars }).map((_, si) => (
            <span key={si} style={{ color: "#E8339E", fontSize: "0.9rem" }}>★</span>
          ))}
          {Array.from({ length: 5 - t.stars }).map((_, si) => (
            <span key={`empty-${si}`} style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.9rem" }}>★</span>
          ))}
        </div>

        {/* Quote with expand/collapse */}
        <div className="flex-1 mb-4">
          <p
            className="text-white/80 leading-relaxed text-sm"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "italic",
              transition: "all 0.3s ease",
            }}
          >
            "{displayText}"
          </p>
          {needsTruncation && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs font-semibold transition-colors hover:opacity-80"
              style={{
                color: "#E8339E",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {expanded ? "Show less ↑" : "Read more →"}
            </button>
          )}
        </div>

        {/* Attribution + treatment tag */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <div>
            <div
              className="font-bold text-sm text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t.name}
            </div>
            <div
              className="text-white/60 text-xs"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t.age}
            </div>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(232,51,158,0.10), rgba(122,30,126,0.15))",
              border: "1px solid rgba(232,51,158,0.25)",
              color: "#E8339E",
              fontFamily: "Montserrat, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {t.treatment}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 lg:py-20 overflow-hidden" style={{ background: "#0D0D1A" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-7 md:mb-10">
          <span
            className="section-label block mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Patient Stories
          </span>
          <h2
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            REAL RESULTS FROM
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              REAL WOMEN
            </span>
          </h2>
          <p
            className="text-white/70 mt-3 text-sm font-medium"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Ages 30s–60s · Perimenopause · Menopause · Post-pregnancy · Weight loss · Actual MedMethod Direct patients. Results may vary.
          </p>
        </div>

        {/* Scrollable card row — 4 visible on desktop, scroll for rest */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 px-4 sm:px-0"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>

        {/* Scroll hint */}
        <p
          className="text-center text-white/30 text-xs mt-4 font-medium"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          ← Scroll to see all {testimonials.length} patient stories →
        </p>

        {/* Medical disclaimer */}
        <div
          className="mt-8 mx-auto max-w-3xl px-4 py-4 rounded-lg text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-white/30 text-xs leading-relaxed"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span className="font-semibold text-white/40">Results Disclaimer:</span> The patient stories featured above reflect individual experiences and are not guaranteed outcomes. Results vary based on starting weight, medical history, program adherence, and individual response to treatment. MedMethod Direct's programs, including GLP-1 therapy and hormone optimization, are provided under the supervision of licensed medical professionals. These testimonials are not intended as medical advice. Consult your physician before beginning any weight loss or hormone therapy program.
          </p>
        </div>

      </div>
    </section>
  );
}
