/* =============================================================================
   StatsAndDifference.tsx — Empathy Section only
   Clinical Noir Design | Women 40+ focused
   Stats and MedMethod Difference sections removed per user request
   ============================================================================= */

export default function StatsAndDifference() {
  return (
    <>
      {/* Empathy Section — "We See You" */}
      <section className="bg-white py-16 lg:py-20" style={{ borderTop: '4px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #E8339E, #7A1E7E)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="section-label block mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                We Understand
              </span>
              <h2
                className="font-black text-[#111111] leading-tight mb-6"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                THE OLD RULES DON'T
                <br />
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  APPLY ANYMORE.
                </span>
              </h2>
              <p
                className="text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
              >
                If you're a woman over 40, you've probably noticed it. You're waking up at 3:00 AM with night sweats. Struggling through midday brain fog. Facing unpredictable mood swings. Dealing with a hormonal belly that willpower alone cannot fix.
              </p>
              <p
                className="text-gray-600 leading-relaxed mb-8"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}
              >
                It's exhausting to feel like your own biology is working against you — leaving you with no clear path forward. You deserve better. You deserve a doctor who actually listens, labs that reveal the truth, and a plan built around <em>your</em> biology.
              </p>
              <a
                href="#consultation"
                className="btn-gradient px-8 py-3.5 rounded-full text-sm font-bold tracking-wider inline-flex items-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                START YOUR JOURNEY
              </a>
            </div>

            {/* Symptom cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { symptom: "Night Sweats", detail: "Waking at 3 AM, drenched and exhausted" },
                { symptom: "Brain Fog", detail: "Struggling to focus, forgetting words mid-sentence" },
                { symptom: "Mood Swings", detail: "Unpredictable emotions that feel out of control" },
                { symptom: "Hormonal Weight", detail: "Belly fat that diet and exercise won't budge" },
                { symptom: "Low Energy", detail: "Exhausted no matter how much you sleep" },
                { symptom: "Low Libido", detail: "Loss of desire and intimacy that affects relationships" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#F9F5FF] border border-[#E8339E]/10 rounded-xl p-4 hover:border-[#E8339E]/40 transition-colors"
                >
                  <div
                    className="font-bold text-[#111111] mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem" }}
                  >
                    {item.symptom}
                  </div>
                  <div
                    className="text-gray-600 leading-snug"
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}
                  >
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
