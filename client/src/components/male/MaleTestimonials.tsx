/* MaleTestimonials.tsx — Men's testimonials
   3 featured cards: before/after photo + quote in one unified card
   Remaining testimonials in horizontal scroll below
*/
const TEAL = "#00C2CB";
const TEAL_GRADIENT = "linear-gradient(135deg, #00C2CB 0%, #0099A8 100%)";
const NAVY = "#0A1628";

const featuredTestimonials = [
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-ba-1-bb4oP8Mkvi2vaD4dRSj3wf.webp",
    name: "Marcus T.",
    age: 42,
    location: "Dallas, TX",
    result: "+340 ng/dL Testosterone",
    timeframe: "90 Days",
    quote: "I was exhausted, gaining weight, and had zero drive. Three months into TRT and I feel like I'm 30 again. My wife noticed before I did.",
    rating: 5,
  },
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-ba-2-jz5HmjtfaUqD2jCF6nntpt.webp",
    name: "Derek W.",
    age: 38,
    location: "Phoenix, AZ",
    result: "Lost 34 lbs",
    timeframe: "4 Months",
    quote: "The combination of TRT and Semaglutide was a game changer. The fat just started coming off and I was actually building muscle at the same time.",
    rating: 5,
  },
  {
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/male-ba-3-fuPZfJjcTCVyZYnK9bgumb.webp",
    name: "Ryan S.",
    age: 33,
    location: "Denver, CO",
    result: "Lost 28 lbs + Muscle Gain",
    timeframe: "6 Months",
    quote: "Started with TRT and added the hair program. Both are working. My hairline has actually come back a bit and my energy is through the roof.",
    rating: 5,
  },
];

const moreTestimonials = [
  { name: "James R.", age: 51, location: "Atlanta, GA", result: "Energy restored, ED resolved", quote: "I was embarrassed to talk about it but the team made it easy. Within 6 weeks everything had improved — energy, mood, performance. Wish I'd done this sooner.", rating: 5 },
  { name: "Carlos M.", age: 45, location: "Miami, FL", result: "Lost 28 lbs, testosterone normalized", quote: "My doctor kept saying my levels were 'normal' but I felt terrible. MedMethod actually looked at optimal ranges, not just reference ranges. Huge difference.", rating: 5 },
  { name: "Brian K.", age: 36, location: "Chicago, IL", result: "Gained 12 lbs lean muscle", quote: "I was skeptical about online TRT clinics but the physician I work with is incredibly thorough. Labs every quarter, dose adjustments, real accountability.", rating: 5 },
  { name: "Anthony L.", age: 54, location: "Houston, TX", result: "PSA monitored, 50 lbs lost", quote: "At my age I was worried about TRT and prostate health. They monitor everything closely and explained every decision. I trust this team completely.", rating: 5 },
  { name: "Michael B.", age: 48, location: "Nashville, TN", result: "Sleep improved, lost 22 lbs", quote: "I was sleeping 9 hours and still exhausted. Turns out my testosterone was at 180. Now I'm at 750 and I wake up ready to go. Life-changing.", rating: 5 },
  { name: "David H.", age: 44, location: "Seattle, WA", result: "Peptide therapy accelerated recovery", quote: "I'm a competitive cyclist and the BPC-157 protocol they put me on cut my recovery time in half. I'm training harder than I was at 35.", rating: 5 },
  { name: "Kevin P.", age: 57, location: "Orlando, FL", result: "Mood stabilized, 40 lbs lost", quote: "I didn't realize how much low testosterone was affecting my mental health. The anxiety and irritability are gone. My family says I'm a different person.", rating: 5 },
  { name: "Jason F.", age: 40, location: "Austin, TX", result: "Testosterone doubled in 60 days", quote: "The whole process was seamless. Labs at home, video call with the doctor, medication at my door. No waiting rooms, no judgment. Just results.", rating: 5 },
  { name: "Robert N.", age: 62, location: "San Diego, CA", result: "Longevity panel revealed key deficiencies", quote: "The comprehensive labs found a thyroid issue my regular doctor had missed for years. Getting that treated alongside TRT has been transformational.", rating: 5 },
];

export default function MaleTestimonials() {
  return (
    <section id="testimonials" className="py-14 overflow-hidden" style={{ background: "#EDE9E1", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: TEAL_GRADIENT }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>RESULTS</span>
            <div className="h-px w-10" style={{ background: TEAL_GRADIENT }} />
          </div>
          <h2
            className="font-black leading-tight mb-3"
            style={{ color: NAVY, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            REAL MEN.{" "}
            <span
              style={{
                background: TEAL_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              REAL RESULTS.
            </span>
          </h2>
          <p style={{ color: "rgba(10,22,40,0.5)", fontSize: "0.9rem" }}>
            Over 8,000 men have optimized their health with MedMethod Direct.
          </p>
        </div>

        {/* ── Featured: Before/After + Quote in one card ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {featuredTestimonials.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "#fff",
                border: "1px solid rgba(0,194,203,0.15)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              }}
            >
              {/* Before/After Photo */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                <img
                  src={item.image}
                  alt={`${item.name} before and after transformation`}
                  className="w-full h-full object-cover"
                />
                {/* Timeframe badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: TEAL_GRADIENT, boxShadow: "0 2px 8px rgba(0,194,203,0.4)" }}
                >
                  {item.timeframe}
                </div>
              </div>

              {/* Quote + Info */}
              <div className="p-5 flex flex-col flex-1">
                {/* Stars */}
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <span key={j} style={{ color: TEAL, fontSize: 13 }}>★</span>
                  ))}
                </div>

                {/* Result badge */}
                <div className="inline-flex mb-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(0,194,203,0.1)", color: TEAL }}
                  >
                    ✓ {item.result}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "rgba(10,22,40,0.7)" }}>
                  "{item.quote}"
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-3"
                  style={{ borderTop: "1px solid rgba(0,194,203,0.12)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{ background: TEAL_GRADIENT }}
                  >
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: NAVY }}>{item.name}, {item.age}</p>
                    <p className="text-xs" style={{ color: "rgba(10,22,40,0.45)" }}>{item.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mb-10" style={{ color: "rgba(10,22,40,0.35)", fontStyle: "italic" }}>
          *Results shown are representative. Individual results vary based on program, adherence, and starting health status.
        </p>

      </div>

      {/* ── More Testimonials — horizontal scroll ── */}
      <div className="flex gap-4 px-4 lg:px-8 overflow-x-auto pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {moreTestimonials.map((t) => (
          <div
            key={t.name}
            className="flex-shrink-0 rounded-2xl p-5 flex flex-col"
            style={{ width: 300, background: "#fff", border: "1px solid rgba(0,194,203,0.2)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} style={{ color: TEAL, fontSize: 14 }}>★</span>
              ))}
            </div>
            <div className="inline-flex mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(0,194,203,0.12)", color: TEAL }}>
                {t.result}
              </span>
            </div>
            <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "rgba(10,22,40,0.7)" }}>
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(0,194,203,0.15)" }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                style={{ background: TEAL_GRADIENT }}
              >
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: NAVY }}>{t.name}, {t.age}</p>
                <p className="text-xs" style={{ color: "rgba(10,22,40,0.45)" }}>{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate rating */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-6 flex items-center justify-center gap-6">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => <span key={i} style={{ color: TEAL, fontSize: 20 }}>★</span>)}
        </div>
        <span className="font-black text-lg" style={{ color: NAVY }}>4.9</span>
        <span className="text-sm" style={{ color: "rgba(10,22,40,0.5)" }}>from 1,200+ verified reviews</span>
      </div>
    </section>
  );
}
