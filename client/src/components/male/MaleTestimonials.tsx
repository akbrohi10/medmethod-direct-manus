/* MaleTestimonials.tsx — Men's testimonials
   Exact reference format:
   - Two side-by-side photos filling card width, no gap
   - Result badge: top-right, overlapping the photo edge, teal pill
   - BEFORE label: solid teal bar bottom-left half
   - AFTER label: solid navy bar bottom-right half
   - Below photo: stars, italic quote, bold name, age/location, teal program pill
*/

const TEAL = "#00C2CB";
const NAVY = "#0A1628";

interface Testimonial {
  beforeImg: string;
  afterImg: string;
  badge: string;
  name: string;
  age: number;
  location: string;
  program: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-1-5RP8WhSxuaLh5zokc54pLX.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-2-ZegD5bfuPBZTqU8azzsvfe.webp",
    badge: "-42 lbs in 5 months",
    name: "James R.", age: 51, location: "Atlanta, GA",
    program: "TRT + Weight Loss",
    quote: "I was embarrassed to talk about it but the team made it easy. Within 6 weeks everything had improved — energy, mood, performance. Wish I'd done this sooner.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-3-4r2ontd7mK8LCckBswhzMZ.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-4-nfzexNYxCTQh7eJ36knDzF.webp",
    badge: "-28 lbs, T levels optimized",
    name: "Carlos M.", age: 45, location: "Miami, FL",
    program: "TRT + GLP-1",
    quote: "My doctor kept saying my levels were 'normal' but I felt terrible. MedMethod actually looked at optimal ranges, not just reference ranges. Huge difference.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-5-gNejVtnEi55MsMuEH289Cm.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-6-E3cZAUVveXDkkfYECCfN3u.webp",
    badge: "+12 lbs lean muscle in 90 days",
    name: "Brian K.", age: 36, location: "Chicago, IL",
    program: "TRT + Peptide Therapy",
    quote: "I was skeptical about online TRT clinics but the physician I work with is incredibly thorough. Labs every quarter, dose adjustments, real accountability.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-7-NS2YCLh3UxcpLikw9Uu7UU.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-8-4hNdZHMhRH5n2KvzBskh4W.webp",
    badge: "-50 lbs in 6 months",
    name: "Anthony L.", age: 54, location: "Houston, TX",
    program: "GLP-1 Weight Loss",
    quote: "At my age I was worried about TRT and prostate health. They monitor everything closely and explained every decision. I trust this team completely.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-9-WTxpMwspiB8Ccy4DDUVbvK.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-10-5ryqSzRPFHMqSUHr6Jxaps.webp",
    badge: "+340 ng/dL testosterone",
    name: "Marcus T.", age: 42, location: "Dallas, TX",
    program: "TRT Program",
    quote: "I was exhausted, gaining weight, and had zero drive. Three months into TRT and I feel like I'm 30 again. My wife noticed before I did.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-1-5RP8WhSxuaLh5zokc54pLX.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-3-4r2ontd7mK8LCckBswhzMZ.webp",
    badge: "-38 lbs, energy restored",
    name: "Derek W.", age: 58, location: "Phoenix, AZ",
    program: "TRT + Weight Loss",
    quote: "The combination of TRT and Semaglutide was a game changer. The fat just started coming off and I was actually building muscle at the same time.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-5-gNejVtnEi55MsMuEH289Cm.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-7-NS2YCLh3UxcpLikw9Uu7UU.webp",
    badge: "-34 lbs, libido restored",
    name: "Michael B.", age: 41, location: "Nashville, TN",
    program: "TRT + Sexual Health",
    quote: "I was sleeping 9 hours and still exhausted. Turns out my testosterone was at 180. Now I'm at 750 and I wake up ready to go. Life-changing.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-2-ZegD5bfuPBZTqU8azzsvfe.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-4-nfzexNYxCTQh7eJ36knDzF.webp",
    badge: "-22 lbs, confidence back",
    name: "David H.", age: 44, location: "Seattle, WA",
    program: "TRT + Peptide Therapy",
    quote: "I'm a competitive cyclist and the BPC-157 protocol they put me on cut my recovery time in half. I'm training harder than I was at 35.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-6-E3cZAUVveXDkkfYECCfN3u.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-8-4hNdZHMhRH5n2KvzBskh4W.webp",
    badge: "Summit ready in 4 months",
    name: "Kevin P.", age: 39, location: "Orlando, FL",
    program: "TRT + Fitness Protocol",
    quote: "I didn't realize how much low testosterone was affecting my mental health. The anxiety and irritability are gone. My family says I'm a different person.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-9-WTxpMwspiB8Ccy4DDUVbvK.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-10-5ryqSzRPFHMqSUHr6Jxaps.webp",
    badge: "-45 lbs in 6 months",
    name: "Robert N.", age: 62, location: "San Diego, CA",
    program: "TRT + Weight Loss",
    quote: "The comprehensive labs found a thyroid issue my regular doctor had missed for years. Getting that treated alongside TRT has been transformational.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-3-4r2ontd7mK8LCckBswhzMZ.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-5-gNejVtnEi55MsMuEH289Cm.webp",
    badge: "Testosterone doubled in 60 days",
    name: "Jason F.", age: 40, location: "Austin, TX",
    program: "TRT Program",
    quote: "The whole process was seamless. Labs at home, video call with the doctor, medication at my door. No waiting rooms, no judgment. Just results.",
  },
  {
    beforeImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-1-5RP8WhSxuaLh5zokc54pLX.webp",
    afterImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/m-ba-organic-6-E3cZAUVveXDkkfYECCfN3u.webp",
    badge: "Hair loss stopped, T optimized",
    name: "Ryan S.", age: 33, location: "Denver, CO",
    program: "TRT + Hair Restoration",
    quote: "Started with TRT and added the hair program. Both are working. My hairline has actually come back a bit and my energy is through the roof.",
  },
];

export default function MaleTestimonials() {
  return (
    <section id="testimonials" className="py-14 overflow-hidden" style={{ background: "#EDE9E1", fontFamily: "Montserrat, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)` }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: TEAL }}>RESULTS</span>
            <div className="h-px w-10" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)` }} />
          </div>
          <h2
            className="font-black leading-tight mb-3"
            style={{ color: NAVY, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            REAL MEN.{" "}
            <span style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              REAL RESULTS.
            </span>
          </h2>
          <p style={{ color: "rgba(10,22,40,0.5)", fontSize: "0.9rem" }}>
            Over 8,000 men have optimized their health with MedMethod Direct.
          </p>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        className="flex gap-5 px-4 lg:px-8 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col"
            style={{
              width: 310,
              background: "#fff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
            }}
          >
            {/* ── Photo section ── */}
            <div className="relative" style={{ position: "relative" }}>
              {/* Two photos side by side, no gap */}
              <div className="flex" style={{ height: 320 }}>
                {/* BEFORE photo */}
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={t.beforeImg}
                    alt={`${t.name} before`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "50% 5%" }}
                  />
                  {/* BEFORE label bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 py-1.5 text-center"
                    style={{ background: NAVY }}
                  >
                    <span className="text-white font-black text-xs tracking-[0.2em]">BEFORE</span>
                  </div>
                </div>
                {/* AFTER photo */}
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={t.afterImg}
                    alt={`${t.name} after`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "50% 5%" }}
                  />
                  {/* AFTER label bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 py-1.5 text-center"
                    style={{ background: TEAL }}
                  >
                    <span className="text-white font-black text-xs tracking-[0.2em]">AFTER</span>
                  </div>
                </div>
              </div>

              {/* Result badge — top right, overlapping the photo */}
              <div
                className="absolute px-3 py-1.5 rounded-full text-white font-bold text-xs shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${TEAL} 0%, #0099A8 100%)`,
                  top: 10,
                  right: 10,
                  maxWidth: "62%",
                  lineHeight: 1.3,
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                {t.badge}
              </div>
            </div>

            {/* ── Text section ── */}
            <div className="p-5 flex flex-col flex-1">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(j => (
                  <span key={j} style={{ color: TEAL, fontSize: 15 }}>★</span>
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1 mb-4 italic" style={{ color: "rgba(10,22,40,0.72)" }}>
                "{t.quote}"
              </p>
              {/* Author */}
              <div className="pt-3" style={{ borderTop: "1px solid rgba(0,194,203,0.12)" }}>
                <p className="font-bold text-sm mb-0.5" style={{ color: NAVY }}>{t.name}</p>
                <p className="text-xs mb-3" style={{ color: "rgba(10,22,40,0.45)" }}>Age {t.age} · {t.location}</p>
                {/* Program pill — matches reference style */}
                <span
                  className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,194,203,0.08)",
                    color: TEAL,
                    border: `1px solid rgba(0,194,203,0.3)`,
                  }}
                >
                  {t.program}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs mt-4 px-4" style={{ color: "rgba(10,22,40,0.35)", fontStyle: "italic" }}>
        *Results shown are representative. Individual results vary based on program, adherence, and starting health status.
      </p>

      {/* Aggregate rating */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-5 flex items-center justify-center gap-4 flex-wrap">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => <span key={i} style={{ color: TEAL, fontSize: 20 }}>★</span>)}
        </div>
        <span className="font-black text-lg" style={{ color: NAVY }}>4.9</span>
        <span className="text-sm" style={{ color: "rgba(10,22,40,0.5)" }}>from 1,200+ verified reviews</span>
      </div>
    </section>
  );
}
