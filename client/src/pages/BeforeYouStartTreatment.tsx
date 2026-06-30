import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

/* ============================================================================
   BEFORE YOU START TREATMENT — Meta Ad Landing Page
   Design: Editorial / PDF-style — light gray bg, pink accents, card-based
   Purpose: Educate cold traffic, then funnel to homepage for conversion
   URL: /before-you-start-treatment (hidden from nav/sitemap)
   ============================================================================ */

const YOUTUBE_VIDEO_ID = "AGrpLj1jmfw";
const BRAND_PINK = "#E8339E";
const BRAND_PURPLE = "#7A1E7E";
const GRADIENT = `linear-gradient(135deg, ${BRAND_PINK}, ${BRAND_PURPLE})`;
const LOGO_URL = "/manus-storage/medmethod-logo-new_22054082.png";

/* ─── Reading Progress Bar ─── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50">
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{ width: `${progress}%`, background: GRADIENT }}
      />
    </div>
  );
}

/* ─── YouTube Embed (lazy, thumbnail-first) ─── */
function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playing) return;
    const loadYTApi = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).YT && (window as any).YT.Player) {
          resolve();
          return;
        }
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        (window as any).onYouTubeIframeAPIReady = () => resolve();
      });
    };
    loadYTApi().then(() => {
      if (!playerContainerRef.current) return;
      playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
        events: { onReady: (e: any) => e.target.playVideo() },
      });
    });
    return () => { if (playerRef.current?.destroy) playerRef.current.destroy(); };
  }, [playing]);

  if (playing) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ paddingBottom: "56.25%" }}>
        <div ref={playerContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full rounded-2xl overflow-hidden shadow-xl group cursor-pointer block"
      style={{ paddingBottom: "56.25%" }}
      aria-label="Play video"
    >
      <img
        src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
        alt="Program explainer video"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-all duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
          style={{ background: GRADIENT }}
        >
          <svg className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}

/* ─── Section Divider ─── */
function Divider() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}40, transparent)` }} />
    </div>
  );
}

/* ─── Callout Box (pink gradient background) ─── */
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6 md:p-8 my-8"
      style={{ background: GRADIENT }}
    >
      <p className="text-white text-base md:text-lg font-semibold leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </p>
    </div>
  );
}

/* ─── Info Card ─── */
function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {title}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Numbered Step ─── */
function NumberedStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
        style={{ background: GRADIENT }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {title}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ─── Comparison Table ─── */
function ComparisonTable() {
  const rows = [
    { generic: "Starts with convenience or price", responsible: "Starts with evaluation and accuracy" },
    { generic: "Focuses on the prescription", responsible: "Focuses on the person" },
    { generic: "Offers a broad protocol", responsible: "Builds a personalized plan" },
    { generic: "Assumes motivation will last", responsible: "Builds support and accountability" },
    { generic: "Chases short-term change", responsible: "Plans for longevity and long-term results" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white my-8">
      <div className="grid grid-cols-2">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <span className="font-bold text-gray-700 text-xs md:text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Generic Model
          </span>
        </div>
        <div className="p-4 border-b border-gray-200" style={{ background: `${BRAND_PINK}10` }}>
          <span className="font-bold text-xs md:text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif", color: BRAND_PINK }}>
            More Responsible Model
          </span>
        </div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 border-b border-gray-50 last:border-0">
          <div className="p-4 text-gray-600 text-sm border-r border-gray-50">{row.generic}</div>
          <div className="p-4 text-gray-900 text-sm font-medium">{row.responsible}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Accountability Comparison ─── */
function AccountabilityComparison() {
  const rows = [
    { without: "Irregular self-monitoring", withMM: "Biweekly weigh-ins and guided review" },
    { without: "No consistent outside support", withMM: "Dedicated performance coach" },
    { without: "Progress depends on motivation alone", withMM: "Regular check-ins reinforce consistency" },
    { without: "Limited visibility between appointments", withMM: "Dashboard tracking helps monitor momentum" },
    { without: "Easy to drift off plan", withMM: "Easier to course-correct early" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4 my-8">
      {/* Without Structure */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-800">
          <span className="font-bold text-white text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Without Structure</span>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <div key={i} className="p-4 text-gray-600 text-sm bg-gray-50">{r.without}</div>
          ))}
        </div>
      </div>
      {/* With Structure */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="p-4" style={{ background: GRADIENT }}>
          <span className="font-bold text-white text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>With Structured Support</span>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <div key={i} className="p-4 text-gray-900 text-sm font-medium bg-white">{r.withMM}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page Component ─── */
export default function BeforeYouStartTreatment() {
  return (
    <>
      <Helmet>
        <title>Before You Start Treatment | What Women Over 40 Need to Know</title>
        <meta name="description" content="Before starting GLP-1s or hormone therapy, read this guide. What women over 40 need to know to choose a safer, personalized approach and avoid costly mistakes." />
        <meta name="robots" content="noindex, nofollow" />
        {/* Open Graph */}
        <meta property="og:title" content="Before You Start Treatment | What Women Over 40 Need to Know" />
        <meta property="og:description" content="Before starting GLP-1s or hormone therapy, read this guide. What women over 40 need to know to choose a safer, personalized approach and avoid costly mistakes." />
        <meta property="og:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/og-before-you-start-treatment_d823128a.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.medmethoddirect.com/before-you-start-treatment" />
        <meta property="og:site_name" content="MedMethod Direct" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Before You Start Treatment | What Women Over 40 Need to Know" />
        <meta name="twitter:description" content="Before starting GLP-1s or hormone therapy, read this guide. What women over 40 need to know to choose a safer, personalized approach and avoid costly mistakes." />
        <meta name="twitter:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/og-before-you-start-treatment_d823128a.png" />
      </Helmet>

      <ReadingProgress />

      <div className="min-h-screen" style={{ background: "#f9f9f9", fontFamily: "'Montserrat', sans-serif" }}>

        {/* ─── Minimal Header ─── */}
        <header className="bg-white border-b border-gray-100 py-4 px-4">
          <div className="max-w-3xl mx-auto flex items-center justify-center">
            <a href="https://medmethoddirect.com" target="_blank" rel="noopener noreferrer">
              <img src={LOGO_URL} alt="MedMethod Direct" className="h-12 md:h-14" />
            </a>
          </div>
        </header>

        {/* ─── Hero Section ─── */}
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BRAND_PINK }}>
              Your Guide
            </p>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Before You Start GLP-1s or Hormone Therapy, Read This First
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              What women over 40 need to know to choose a safer, personalized approach and avoid costly mistakes.
            </p>

            {/* Three Pillars */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["Safety", "Personalization", "Long-Term Health"].map((pillar) => (
                <span
                  key={pillar}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border"
                  style={{ borderColor: `${BRAND_PINK}40`, color: BRAND_PINK, background: `${BRAND_PINK}08` }}
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── Section 1: Why So Many Women Over 40 Feel Stuck ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Section 1</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why So Many Women Over 40 Feel Stuck
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              If you have felt like your body has changed but no one has really explained why, you are not imagining it. Many women over 40 find themselves doing the things that used to work — trying to stay active, eating more carefully — and still feeling like progress has become harder than ever.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              At this stage of life, weight gain, low energy, hormone shifts, poor recovery, brain fog, sleep disruption, increased stress, and low motivation often begin to overlap. The issue is rarely as simple as trying harder. For many women, the real challenge is that their body is no longer responding the way it once did.
            </p>

            {/* Callout */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BRAND_PINK }}>The Real Issue</p>
              <p className="text-gray-800 font-semibold text-base leading-relaxed">
                What worked 10 years ago may not work now. That does not mean you are failing. It means your care needs to match what your body is experiencing today — so you can protect your health and support longevity.
              </p>
            </div>

            {/* Three Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <InfoCard
                title="Weight Feels Different"
                description="Progress may slow even when habits stay consistent, making generic weight-loss advice feel frustrating and incomplete."
              />
              <InfoCard
                title="Hormone Shifts Overlap"
                description="Symptoms rarely show up one at a time. Hormonal changes can affect metabolism, mood, sleep, and how your body responds overall."
              />
              <InfoCard
                title="Energy and Focus Drop"
                description="Fatigue, brain fog, poor recovery, and low motivation can make it harder to stay consistent without the right clinical insight and support."
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── Section 2: The Problem With Generic Solutions ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Section 2</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Problem With Generic Solutions
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              When women begin looking for help, the fastest option can seem like the most attractive one. A quick online form, a convenient prescription, or a simplified treatment package may sound efficient. But when it comes to your health, convenience and cost alone are not the right standard.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              This is where many women make costly mistakes. They assume that if a treatment is available, it must be the right treatment. They may assume that a popular program is personalized, or that the cheapest option is the smartest option. In reality, those are very different things.
            </p>

            <ComparisonTable />

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BRAND_PINK }}>A Better Standard</p>
              <p className="text-gray-800 font-semibold text-base leading-relaxed">
                Health is wealth. The care you choose should reflect that with a more mindful, thoughtful, and personalized standard — one designed to support longevity, not just speed.
              </p>
            </div>

            <Callout>
              Not every clinic offering GLP-1s, hormone therapy, or menopause care is built the same. The right care model should prioritize comprehensive, accurate, and personalized solutions — not quick transactions.
            </Callout>
          </div>
        </section>

        <Divider />

        {/* ─── Section 3: What Should Happen Before You Start Any Treatment ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Section 3</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              What Should Happen Before You Start Any Treatment
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              Before starting GLP-1 therapy, hormone treatment, or menopause care, you should know what is actually driving your symptoms and what kind of plan makes sense for your body. That requires more than a generic intake. It requires physician oversight, clinical context, and a treatment strategy grounded in real data.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              Responsible care should begin with a deeper understanding of your health history, current symptoms, goals, labs, and the broader picture of what is happening metabolically and hormonally. Without that foundation, treatment decisions are often based on guesswork or shortcuts.
            </p>

            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BRAND_PINK }}>
              Before Treatment Begins, You Should Understand
            </p>
            <div className="space-y-3 mb-8">
              <NumberedStep number={1} title="Your symptoms in full context" description="Symptoms rarely exist in isolation, especially when midlife health changes overlap." />
              <NumberedStep number={2} title="Your labs and deeper health markers" description="These guide decisions more intelligently than assumptions or broad shortcuts." />
              <NumberedStep number={3} title="Your goals and medical history" description="The safest plan depends on your full picture, not a one-size-fits-all template." />
              <NumberedStep number={4} title="Your long-term strategy" description="Good care is not only about starting treatment. It is about sustaining progress and protecting your future health." />
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── Section 4: Why Most People Struggle Even With Good Treatment Options ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Section 4</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Most People Struggle Even With Good Treatment Options
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              Today, women have access to more treatment options than ever before. GLP-1s, hormone therapy, and menopause-focused care can be powerful tools when used well. But access alone is not enough.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              One of the biggest reasons people fail to see lasting results is not because the tools are ineffective. It is because they are trying to navigate the process without enough structure, guidance, or accountability. Motivation drops. Life gets busy. Small setbacks turn into inconsistency. Without someone tracking progress closely, it becomes easy to lose momentum.
            </p>

            {/* Accountability metrics */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <h4 className="font-bold text-gray-900 text-base mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                How accountability becomes measurable
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                The goal is not vague motivation. It is structured support tied to real data, clear trends, and course correction when needed.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: BRAND_PINK }}>Cadence</p>
                  <p className="font-bold text-gray-900 text-lg">Biweekly</p>
                  <p className="text-gray-500 text-xs">Virtual check-ins and weigh-ins</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: BRAND_PINK }}>Visibility</p>
                  <p className="font-bold text-gray-900 text-lg">Synced</p>
                  <p className="text-gray-500 text-xs">Dashboard tracking between sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: BRAND_PINK }}>Support</p>
                  <p className="font-bold text-gray-900 text-lg">1:1</p>
                  <p className="text-gray-500 text-xs">Dedicated performance coach</p>
                </div>
              </div>
            </div>

            <AccountabilityComparison />

            <Callout>
              The women who stay supported are more likely to stay consistent. The women who stay consistent are more likely to see real change — and turn short-term wins into long-term habits that support longevity.
            </Callout>
          </div>
        </section>

        <Divider />

        {/* ─── Section 5: What a Safer, Personalized Plan Actually Looks Like ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Section 5</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              What a Safer, Personalized Plan Actually Looks Like
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              The best outcomes rarely come from one intervention in isolation. Lasting progress usually happens when treatment is supported by a complete system — one that combines the right medical tools with the right structure, guidance, and ongoing adjustments.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              A safer, more personalized plan should not rely on medication alone, and it should not leave you responsible for figuring everything else out by yourself. It should connect physician oversight, diagnostics, accountability, nutrition, fitness, and progress tracking into one coordinated strategy.
            </p>

            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BRAND_PINK }}>
              The Standard
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <InfoCard title="Medication When Appropriate" description="Treatment is selected carefully based on your needs, goals, labs, and clinical picture." />
              <InfoCard title="Doctor Oversight" description="A physician guides decisions rather than handing off fragmented care." />
              <InfoCard title="Diagnostics and Metrics" description="Your plan is shaped by data, not assumptions." />
              <InfoCard title="Performance Coaching" description="You receive regular accountability, strategy, support, and biweekly weigh-ins." />
              <InfoCard title="Wellness Dashboard Tracking" description="Synced data helps your coach monitor progress and respond in real time." />
              <InfoCard title="Custom Nutrition Planning" description="Nutrition guidance is aligned with your body, preferences, and treatment plan." />
              <InfoCard title="Custom Fitness Programming" description="Movement is realistic, personalized, and built for consistency." />
              <InfoCard title="Ongoing Tracking and Adjustment" description="Your plan evolves as your body, response, and goals change." />
            </div>

            <Callout>
              A personalized plan should feel coordinated, not pieced together. The better question is not whether one treatment will solve everything, but whether your care model is designed to support real progress from every angle and protect long-term health in the process.
            </Callout>
          </div>
        </section>

        <Divider />

        {/* ─── Video Section ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND_PINK }}>Watch</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                See How One Program Was Designed Around These Standards
              </h2>
              <p className="text-gray-600 text-base">
                A short overview of how a physician-led, accountability-driven model works in practice.
              </p>
            </div>
            <VideoEmbed />
          </div>
        </section>

        <Divider />

        {/* ─── Meet the Doctor ─── */}
        <section className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  <img
                    src="/manus-storage/pasted_file_H8dopF_d7397dc9-d351-4e90-b0cf-c51dcc3978b6_eeea80eb.png"
                    alt="Dr. Jumana Al-Deek, DO"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover object-top"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Dr. Jumana Al-Deek, DO
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">Board-Certified Physician | Founder, MedMethod Direct</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Dr. Al-Deek built MedMethod Direct to offer women the kind of care she believes every patient deserves — personalized, physician-led, and designed for long-term health. She oversees every treatment plan and remains your doctor throughout your journey.
                  </p>
                  <a
                    href="https://drjumanaaldeek.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: BRAND_PINK }}
                  >
                    Read more about Dr. Al-Deek
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── Final CTA Section ─── */}
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Now You Know What to Look For
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              The right next step is not just choosing treatment. It is choosing the right care model — one that helps you reach your goals while becoming a healthier, stronger, better version of yourself over time.
            </p>

            {/* Primary CTA */}
            <a
              href="https://medmethoddirect.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              style={{ background: GRADIENT }}
            >
              See a Program Built Around These Standards
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            {/* Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/medmethoddirect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Follow for daily tips on menopause & weight loss
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a
                href="https://medmethoddirect.com/discovery-call"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: BRAND_PINK }}
              >
                Ready now? Schedule a free discovery call →
              </a>
            </div>
          </div>
        </section>

        {/* ─── Minimal Footer ─── */}
        <footer className="border-t border-gray-200 py-6 px-4 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <a href="https://medmethoddirect.com" target="_blank" rel="noopener noreferrer">
              <img src={LOGO_URL} alt="MedMethod Direct" className="h-8" />
            </a>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} MedMethod Direct. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
