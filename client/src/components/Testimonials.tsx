/* =============================================================================
   Testimonials — MedMethod Direct
   15 diverse patient stories: ages 30s–60s+, post-pregnancy, significant
   weight loss (60–80+ lbs), menopause, hormone optimization
   Layout: 4 cards visible, horizontal scroll for all 15
   ============================================================================= */

const testimonials = [
  {
    name: "Leslee H.",
    location: "Phoenix, AZ",
    age: "Age 60",
    stars: 5,
    text: "I was 80 pounds overweight and had given up. Every diet failed me. MedMethod found my hormones were completely off and my metabolism had stalled. Eight months later I've lost 82 lbs and I feel 20 years younger. I only wish I'd found them sooner.",
    treatment: "GLP-1 + Hormone Therapy",
    lost: "82 lbs",
    duration: "8 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/Hg1eEjA1Ilov_64d7508b.jpg",
  },
  {
    name: "Diane M.",
    location: "Houston, TX",
    age: "Age 63",
    stars: 5,
    text: "At 63 I thought my best years were behind me. I was 75 lbs overweight, exhausted all the time, and couldn't sleep. My MedMethod doctor completely changed my protocol and within a year I lost 68 lbs. I'm now hiking and traveling — things I hadn't done in a decade.",
    treatment: "Elite Longevity Track",
    lost: "68 lbs",
    duration: "11 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/AldSnvX4MNCG_e5b3d449.jpg",
  },
  {
    name: "Cassie R.",
    location: "Nashville, TN",
    age: "Age 34",
    stars: 5,
    text: "After three pregnancies I was 65 lbs over my pre-baby weight and nothing was working. My hormones were a mess postpartum and my regular OB just said 'diet and exercise.' MedMethod actually ran the right labs and got me on a plan. I lost 58 lbs in 7 months and feel like myself again.",
    treatment: "Post-Pregnancy Weight Loss",
    lost: "58 lbs",
    duration: "7 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/KUFNTBEfs72g_02b8a37b.jpg",
  },
  {
    name: "Sarah M.",
    location: "Austin, TX",
    age: "Age 47",
    stars: 5,
    text: "Within 6 weeks of my personalized protocol, I was sleeping through the night for the first time in two years. MedMethod found exactly what was off when my regular doctor kept saying my labs were 'normal.' I've lost 31 lbs and my energy is back.",
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
    text: "I'd been trying to lose the same 30 pounds for three years. The medically supervised weight loss program combined with my custom nutrition plan has me down 28 lbs in 4 months. The bi-weekly check-ins make all the difference — I'm never alone in this.",
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
  {
    name: "Linda B.",
    location: "Atlanta, GA",
    age: "Age 58",
    stars: 5,
    text: "I was carrying 70 extra pounds and had tried every program imaginable. MedMethod's combination of GLP-1 therapy and hormone balancing was the missing piece. Down 61 lbs in 9 months. My doctor says my bloodwork looks like a 40-year-old's.",
    treatment: "GLP-1 + BHRT",
    lost: "61 lbs",
    duration: "9 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/iWghfgcPjisO_6537d863.jpg",
  },
  {
    name: "Rosa G.",
    location: "San Antonio, TX",
    age: "Age 45",
    stars: 5,
    text: "After my second baby I couldn't lose the weight no matter what I did. Four years of struggling and feeling invisible in my own body. MedMethod found I had insulin resistance and low progesterone. In 6 months I lost 44 lbs and finally feel like me again.",
    treatment: "Post-Pregnancy + Hormones",
    lost: "44 lbs",
    duration: "6 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/Pxy4u6HCJ8rJ_26b50ad1.jpg",
  },
  {
    name: "Barbara N.",
    location: "Portland, OR",
    age: "Age 67",
    stars: 5,
    text: "I started at 67 thinking it was too late. I was wrong. My MedMethod physician put me on a protocol I never would have found on my own. I've lost 55 lbs over the past year and my joint pain is nearly gone. It's never too late to reclaim your health.",
    treatment: "Elite Longevity Track",
    lost: "55 lbs",
    duration: "12 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/O0KL4z6Qywry_176035ab.jpg",
  },
  {
    name: "Tamara J.",
    location: "Charlotte, NC",
    age: "Age 38",
    stars: 5,
    text: "Postpartum depression hit me hard and the weight just piled on — 72 lbs over 2 years. I was embarrassed and exhausted. MedMethod treated the whole picture: hormones, nutrition, mental wellness. I've lost 50 lbs and I'm the mom I always wanted to be.",
    treatment: "Post-Pregnancy Weight Loss",
    lost: "50 lbs",
    duration: "8 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/ZWzwuxGbOMWA_bd6a457c.jpg",
  },
  {
    name: "Evelyn C.",
    location: "Las Vegas, NV",
    age: "Age 53",
    stars: 5,
    text: "Hot flashes every hour, 40 lbs I couldn't lose, and a doctor who kept telling me it was 'just menopause.' MedMethod actually listened. The hormone protocol changed everything — I sleep, I think clearly, and I've lost 38 lbs in 5 months.",
    treatment: "Menopause + Weight Loss",
    lost: "38 lbs",
    duration: "5 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/DWwU3M7Bvc7V_d595fbd4.jpg",
  },
  {
    name: "Gloria S.",
    location: "Minneapolis, MN",
    age: "Age 61",
    stars: 5,
    text: "I was 225 lbs and had been that way for 15 years. I'd accepted it as my new normal. A friend told me about MedMethod and I figured I had nothing to lose. Fourteen months later I've lost 78 lbs. I am proof it's possible at any age.",
    treatment: "Core Weight Track",
    lost: "78 lbs",
    duration: "14 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/AldSnvX4MNCG_e5b3d449.jpg",
  },
  {
    name: "Denise P.",
    location: "Boston, MA",
    age: "Age 42",
    stars: 5,
    text: "Three kids in four years left me 65 lbs overweight and completely depleted. My hormones were a wreck and I had zero energy. MedMethod's bi-weekly check-ins kept me accountable and the custom plan fit my chaotic mom schedule. Down 47 lbs in 7 months.",
    treatment: "Post-Pregnancy + GLP-1",
    lost: "47 lbs",
    duration: "7 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/3eSbCUECfXdw_5feaca2e.jpg",
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
            Ages 30s–60s · Post-pregnancy · Menopause · Significant weight loss · Actual MedMethod Direct patients. Results may vary.
          </p>
        </div>

        {/* Scrollable card row — 4 visible on desktop, scroll for rest */}
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
          ← Scroll to see all {testimonials.length} patient stories →
        </p>

      </div>
    </section>
  );
}
