import "./ProcessPricing.css";

const INTAKE_URL = "https://intake.medmethoddirect.com/";

/**
 * V2 process and pay-per-visit pricing, isolated for insertion on Masterclass2.
 * The CTA intentionally remains a native same-tab link to the intake flow.
 */
export default function ProcessPricing() {
  return (
    <section
      id="masterclass2-how-it-works"
      data-masterclass2-process-pricing
      className="process-pricing-section"
      aria-labelledby="masterclass2-process-pricing-title"
    >
      <div className="process-pricing-page-article">
        <div className="process-pricing-layout">
          <div className="process-pricing-intro">
            <span className="section-kicker">How it works</span>
            <h2 id="masterclass2-process-pricing-title">
              <span>Your doctor.</span>
              <span>One text away.</span>
            </h2>
            <p className="process-pricing-lead">
              Start with a 5–10 minute intake.
            </p>
            <ol className="process-pricing-steps">
              <li>
                <span className="process-step-number" aria-hidden="true">
                  1
                </span>
                <div>
                  <h3>Fill out your intake</h3>
                  <p>Tell us about your health and goals.</p>
                </div>
              </li>
              <li>
                <span className="process-step-number" aria-hidden="true">
                  2
                </span>
                <div>
                  <h3>Text with your doctor</h3>
                  <p>
                    Your doctor reviews your intake, then discusses your options
                    with you.
                  </p>
                </div>
              </li>
              <li>
                <span className="process-step-number" aria-hidden="true">
                  3
                </span>
                <div>
                  <h3>Make a plan together</h3>
                  <p>Agree on the next steps that are right for you.</p>
                </div>
              </li>
            </ol>
          </div>

          <div
            className="process-pricing-offer"
            aria-labelledby="masterclass2-visit-pricing-title"
          >
            <div className="process-pricing-card">
              <h3 id="masterclass2-visit-pricing-title">
                Simple, pay-per-visit care
              </h3>
              <dl className="process-pricing-rates">
                <div>
                  <dt>
                    First text visit
                    <small className="first-text-visit-note">
                      Includes 7 days of follow-up messaging.
                    </small>
                  </dt>
                  <dd>FREE</dd>
                </div>
                <div>
                  <dt>Additional text visits</dt>
                  <dd>
                    $29 <span>each</span>
                  </dd>
                </div>
                <div>
                  <dt>Video visit</dt>
                  <dd>$97</dd>
                </div>
              </dl>
              <div className="process-pricing-followup">
                <span className="process-followup-icon" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>7 days of follow-up messaging</strong>
                  <p>Included with every visit—even your free first visit.</p>
                </div>
              </div>
              <p className="process-medication-note">
                Medication costs extra, if prescribed.
              </p>
            </div>

            <a className="process-pricing-cta" href={INTAKE_URL}>
              Start Your Free Text Visit <span aria-hidden="true">→</span>
            </a>
            <p className="process-intake-note">
              Intake first. Then text your doctor.
            </p>
            <p className="process-pricing-terms">
              Prescriptions only when medically appropriate. Follow-up covers
              that visit’s assessment and care plan. New concerns or additional
              treatments require a separate visit.
            </p>
            <p className="process-no-membership">
              No membership or long-term commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
