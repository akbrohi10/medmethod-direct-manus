/* =============================================================================
   Testimonials — MedMethod Direct
   Clinical Noir Design | Women 40+ patient stories
   Layout: 4-card grid visible at once, horizontal scroll for overflow,
           each card includes a before/after photo strip + quote + attribution
   ============================================================================= */

const testimonials = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    age: "Age 47",
    stars: 5,
    text: "Within 6 weeks of my personalized protocol, I was sleeping through the night for the first time in two years. MedMethod found exactly what was off when my regular doctor kept saying my labs were 'normal.'",
    treatment: "Hormone Therapy",
    lost: "31 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/ltMJiXwpTidN_abca7d8e.jpg",
  },
  {
    name: "Jennifer L.",
    location: "Denver, CO",
    age: "Age 52",
    stars: 5,
    text: "I'd been trying to lose the same 30 pounds for three years. The medically supervised weight loss program combined with my custom nutrition plan has me down 28 lbs in 4 months. The bi-weekly check-ins make all the difference.",
    treatment: "Medical Weight Loss",
    lost: "28 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/txCAkJX3OQL5_e6f71912.jpg",
  },
  {
    name: "Michelle R.",
    location: "Chicago, IL",
    age: "Age 44",
    stars: 5,
    text: "The brain fog was the worst part. I'm an executive and I couldn't remember words mid-sentence. Three months in and my clarity is back. My team has noticed. My family has noticed. I've noticed.",
    treatment: "Perimenopause Care",
    lost: "19 lbs",
    duration: "3 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/3aZnyUaB5JmK_bc142ea4.jpg",
  },
  {
    name: "Karen T.",
    location: "Miami, FL",
    age: "Age 49",
    stars: 5,
    text: "I've lost 22 lbs, my mood swings are gone, and I have energy I haven't felt since my 30s. What sets MedMethod apart is that they treat you like a whole person — I have the same doctor every single visit.",
    treatment: "Longevity Protocol",
    lost: "22 lbs",
    duration: "5 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/0n9mIDz6OPyP_2812131d.jpg",
  },
  {
    name: "Patricia W.",
    location: "Seattle, WA",
    age: "Age 55",
    stars: 5,
    text: "I tried another telehealth service before this one. They shipped me a box and I never heard from them again. MedMethod Direct is completely different — my doctor checks in every two weeks and my plan has been adjusted three times as I've progressed.",
    treatment: "Comprehensive Program",
    lost: "35 lbs",
    duration: "6 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/mH0JHrNU2chR_55593bfa.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FAFAFA] py-14 lg:py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="section-label block mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Patient Stories
          </span>
          <h2
            className="font-black text-[#111111] leading-tight"
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
                background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              REAL WOMEN
            </span>
          </h2>
          <p
            className="text-gray-500 mt-3 text-sm font-medium"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Actual MedMethod Direct patients. Results may vary.
          </p>
        </div>

        {/* Scrollable card row — 4 visible on desktop, scroll for 5th */}
        <div
          className="flex gap-5 overflow-x-auto pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col bg-white border border-gray-100 shadow-sm"
              style={{
                width: "clamp(260px, 23vw, 300px)",
                scrollSnapAlign: "start",
              }}
            >
              {/* Before / After photo */}
              <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
                <img
                  src={t.beforeAfter}
                  alt={`${t.name} before and after`}
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
                </div>

                {/* Quote */}
                <p
                  className="text-gray-600 leading-relaxed text-xs flex-1 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif", fontStyle: "italic" }}
                >
                  "{t.text}"
                </p>

                {/* Attribution + treatment tag */}
                <div className="flex items-end justify-between gap-2 flex-wrap">
                  <div>
                    <div
                      className="font-bold text-sm text-[#111]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-gray-400 text-xs"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {t.age} · {t.location}
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
          ))}
        </div>

        {/* Scroll hint */}
        <p
          className="text-center text-gray-400 text-xs mt-4 font-medium"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          ← Scroll to see more stories →
        </p>

      </div>
    </section>
  );
}
