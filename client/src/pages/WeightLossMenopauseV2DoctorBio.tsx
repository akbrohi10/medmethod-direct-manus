const DOCTOR_PORTRAIT = "/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp";

// Existing homepage credentials, focus areas and training; no additional claims.
const CREDENTIALS = ["Board-Certified DO", "Menopause Specialist", "Author"];
const FOCUS_AREAS = [
  "Medical Weight Loss",
  "Menopause & Perimenopause",
  "GLP-1 & Metabolic Therapy",
  "Hormone Optimization",
  "Thyroid Specialist",
  "Metabolism",
];
const TRAINING = [
  { org: "West Virginia School of Osteopathic Medicine", detail: "Doctor of Osteopathic Medicine" },
  { org: "AdventHealth Winter Park", detail: "Family Medicine Residency" },
  { org: "Georgetown University", detail: "Graduate Training, Physiology & Biophysics" },
  { org: "The Menopause Society", detail: "Advanced Menopause Training" },
  { org: "Obesity Medicine Association", detail: "Obesity & Metabolic Health Certification" },
];
const BIO_DETAILS = [
  {
    label: "Clinical Background",
    text: "Her clinical background includes outpatient family medicine, obesity medicine, preventive care, chronic disease management, and women's health.",
  },
  {
    label: "Medical Training",
    text: "She completed her Family Medicine residency at AdventHealth Winter Park after earning her Doctor of Osteopathic Medicine degree from West Virginia School of Osteopathic Medicine. She also holds graduate training in physiology and biophysics from Georgetown University.",
  },
  {
    label: "Advanced Training & Approach",
    text: "Dr. Al-Deek has completed advanced menopause training through The Menopause Society as well as additional training in obesity medicine and metabolic health.",
  },
];

/** V2-only adaptation of the existing homepage physician profile. */
export default function WeightLossMenopauseV2DoctorBio() {
  return (
    <section className="section wave-top wave-surface wave-flip" id="doctor" aria-labelledby="v2-doctor-heading">
      <div className="container">
        <article className="doctor-bio-card">
          <aside className="doctor-bio-sidebar" aria-label="Physician education and credentials">
            <div className="doctor-bio-portrait doctor-bio-desktop-portrait">
              <img src={DOCTOR_PORTRAIT} alt="Dr. Jumana Al-Deek, DO, MS" loading="lazy" decoding="async" />
            </div>
            <div className="doctor-bio-training">
              <h3>Training &amp; Credentials</h3>
              <ul className="doctor-bio-timeline">
                {TRAINING.map(item => (
                  <li key={item.org}><strong>{item.org}</strong><span>{item.detail}</span></li>
                ))}
              </ul>
              <div className="doctor-bio-premedicine">
                <h3>Pre-Medicine Background</h3>
                <strong>Background in Fitness &amp; Exercise Science</strong>
                <p>Former NASM-Certified Personal Trainer</p>
              </div>
              <blockquote className="doctor-bio-quote">
                <p>“Midlife can involve changes in hormones, metabolism, sleep, and stress. My job is to review the whole picture with each patient and discuss options that may be appropriate.”</p>
                <cite>— Dr. Al-Deek</cite>
              </blockquote>
            </div>
          </aside>
          <div className="doctor-bio-main">
            <span className="section-kicker">About Your Physician</span>
            <h2 id="v2-doctor-heading">Meet Dr. Jumana Al-Deek, DO, MS</h2>
            <p className="doctor-bio-intro">Board-certified family physician specializing in medical weight loss, menopause and metabolic health.</p>
            <div className="doctor-bio-portrait doctor-bio-mobile-portrait">
              <img src={DOCTOR_PORTRAIT} alt="Dr. Jumana Al-Deek, DO, MS" loading="lazy" decoding="async" />
            </div>
            <p className="doctor-bio-proof"><strong>50,000+</strong> patients seen</p>
            <p className="doctor-bio-direct">Connect directly with your doctor by text — for free.</p>
            <div className="doctor-bio-badge-group">
              <h3>Credentials</h3>
              <ul className="doctor-bio-credentials">{CREDENTIALS.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="doctor-bio-badge-group">
              <h3>Focus Areas</h3>
              <ul className="doctor-bio-focus">{FOCUS_AREAS.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="doctor-bio-story">
              <section aria-labelledby="v2-doctor-practice-heading">
                <h3 id="v2-doctor-practice-heading">Practice Focus</h3>
                <p>The prescription is only the beginning. Hormone and weight-loss treatments aren’t one-size-fits-all. Whether you’re considering treatment or already taking medication, Dr. Al-Deek reviews your symptoms, health history, current medications, response to treatment, and goals to create—or optimize—a plan built around you.</p>
                <p>Dr. Al-Deek is a board-certified physician, menopause specialist, and author of <strong className="doctor-bio-book">The Menopause Weight Loss Trap</strong>.</p>
              </section>
              <section aria-labelledby="v2-doctor-philosophy-heading">
                <h3 id="v2-doctor-philosophy-heading">Philosophy</h3>
                <p>Long before medical school, Dr. Al-Deek was a certified personal trainer working exclusively with women struggling through hormonal weight gain. She spent years watching the same story repeat — women doing everything “right” but losing the battle against their own biology.</p>
                <p>That experience drove her to medicine so she could better understand the health concerns women bring to care. Today, as a physician and a mom of four, she combines clinical expertise with a personal understanding of what midlife women are going through.</p>
              </section>
            </div>
            <div className="doctor-bio-details">
              {BIO_DETAILS.map(item => (
                <details key={item.label}>
                  <summary>{item.label}<span className="doctor-bio-toggle" aria-hidden="true"><span className="doctor-bio-plus">+</span><span className="doctor-bio-minus">−</span></span></summary>
                  <p>{item.text}</p>
                </details>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
