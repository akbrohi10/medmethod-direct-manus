/* =============================================================================
   Testimonials — MedMethod Direct
   12 patient stories: ages 30s–60s+, post-pregnancy, perimenopause, menopause,
   hormone optimization, weight loss
   Layout: 4 cards visible, horizontal scroll for all 12
   ============================================================================= */

const testimonials = [
  {
    name: "Margaret H.",
    age: "Age 56",
    stars: 5,
    text: "I thought menopause was something you just suffered through. Night sweats so bad I was changing sheets at 3 AM. Brain fog so thick I forgot my own PIN number at the grocery store. My hair was thinning and I'd gained 45 lbs in two years. MedMethod ran panels my doctor never even mentioned. Eight months later I've lost 41 lbs, my hair is growing back, and I haven't had a night sweat in four months. This program gave me my life back.",
    treatment: "Menopause + Hormone Therapy",
    lost: "41 lbs",
    duration: "8 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/margaret-h-new_b26b42af.png",
  },
  {
    name: "Jennifer L.",
    age: "Age 52",
    stars: 4,
    text: "Hot flashes 10+ times a day, anxiety out of nowhere, and 30 lbs that appeared almost overnight when I hit menopause. I'd been trying to lose it for three years. MedMethod's combination of bioidentical hormones and a supervised weight loss plan got me down 28 lbs in 4 months. The only reason it's not 5 stars is I wish I'd found them sooner.",
    treatment: "Menopause + Weight Loss",
    lost: "28 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/jennifer-l-new_354fb07a.png",
  },
  {
    name: "Christine D.",
    age: "Age 48",
    stars: 4,
    text: "The rage came out of nowhere. I'd snap at my kids over nothing, then cry in the bathroom feeling guilty. My PCP put me on an antidepressant but it made things worse. MedMethod tested my hormones and found my progesterone was almost zero and my thyroid was borderline. Four months into treatment the mood swings are gone, I'm sleeping 7 hours straight, and I've lost 25 lbs. Giving 4 stars because I wish the onboarding process was a bit faster.",
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
    text: "The night sweats and insomnia were ruining my life. I'd wake up drenched at 2 AM and couldn't fall back asleep. My regular doctor kept saying my labs were 'normal.' MedMethod found my progesterone was almost nonexistent. Within 6 weeks I was sleeping through the night for the first time in two years. I've also lost 31 lbs and my energy is completely back.",
    treatment: "Hormone Therapy",
    lost: "31 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/ltMJiXwpTidN_abca7d8e.jpg",
  },
  {
    name: "Michelle R.",
    age: "Age 44",
    stars: 5,
    text: "The brain fog was the worst part. I'm an executive and I couldn't remember words mid-sentence. I thought I was losing my mind. My gynecologist said I was 'too young for menopause.' MedMethod tested everything and found I was deep into perimenopause. Three months in and my clarity is back. My team has noticed. My family has noticed. I've noticed.",
    treatment: "Perimenopause Care",
    lost: "19 lbs",
    duration: "3 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/3aZnyUaB5JmK_bc142ea4.jpg",
  },
  {
    name: "Cassie R.",
    age: "Age 34",
    stars: 5,
    text: "After three pregnancies I was 65 lbs over my pre-baby weight and nothing was working. My hormones were a mess postpartum and my regular OB just said 'diet and exercise.' MedMethod actually ran the right labs and got me on a plan. I lost 58 lbs in 7 months and feel like myself again.",
    treatment: "Post-Pregnancy Weight Loss",
    lost: "58 lbs",
    duration: "7 months",
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
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/iWghfgcPjisO_6537d863.jpg",
  },
  {
    name: "Rosa G.",
    age: "Age 45",
    stars: 4,
    text: "After my second baby I couldn't lose the weight no matter what I did. Four years of struggling and feeling invisible in my own body. MedMethod found I had insulin resistance and low progesterone — two things my OB never tested for. In 4 months I lost 21 lbs and finally feel like me again. I'd give 5 stars but the initial lab wait was a bit long.",
    treatment: "Post-Pregnancy + Hormones",
    lost: "21 lbs",
    duration: "4 months",
    beforeAfter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/rosa-g-new_e6d2a50f.png",
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
  {
    name: "Evelyn C.",
    age: "Age 53",
    stars: 5,
    text: "Hot flashes every hour, 40 lbs I couldn't lose, and a doctor who kept telling me it was 'just menopause — you'll get through it.' MedMethod actually listened. They tested my thyroid, cortisol, estrogen, progesterone — everything. The hormone protocol changed my life. I sleep, I think clearly, and I've lost 38 lbs in 5 months.",
    treatment: "Menopause + Weight Loss",
    lost: "38 lbs",
    duration: "5 months",
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
];

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-20 overflow-hidden" style={{ background: "#0D0D1A" }}>
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
            className="text-white/50 mt-3 text-sm font-medium"
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
            <div
              key={i}
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

                {/* Quote */}
                <p
                  className="text-white/60 leading-relaxed text-xs flex-1 mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif", fontStyle: "italic" }}
                >
                  "{t.text}"
                </p>

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
                      className="text-white/40 text-xs"
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
          ))}
        </div>

        {/* Scroll hint */}
        <p
          className="text-center text-white/30 text-xs mt-4 font-medium"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          ← Scroll to see all {testimonials.length} patient stories →
        </p>

      </div>
    </section>
  );
}
