import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  UserPlus,
  Video,
} from "lucide-react";
import "./thank-you-video.css";

const BOOKING_URL = "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";

const followUpSteps = [
  {
    Icon: UserPlus,
    label: "Step 1",
    title: "Create Your Patient Account",
    description:
      "Set up your secure patient portal to complete intake forms, sign waivers, upload labs, and communicate with Dr. Al-Deek and our care team before your appointment.",
  },
  {
    Icon: Mail,
    label: "Step 2",
    title: "Accept Your Calendar Invite",
    description:
      "Check your email for a calendar invitation and accept it now. This confirms your time slot with Dr. Al-Deek.",
  },
  {
    Icon: MessageSquare,
    label: "Step 3",
    title: "Reply to Our Text to Secure Your Spot",
    description:
      "You'll receive a confirmation text shortly. Reply to confirm and lock in your time. Unconfirmed appointments are released within 24 hours.",
  },
];

/**
 * The optional-video confirmation surface. Payment and paid-calendar behavior are
 * intentionally owned by /intake/thank-you-video.js after it verifies a receipt.
 */
export default function ThankYouVideo() {
  useEffect(() => {
    // Effects run after this page's DOM has committed. Do not manipulate SDK globals
    // during cleanup; another mounted payment surface may still use them.
    const selector = 'script[data-thank-you-video-script="true"]';
    if (document.querySelector(selector)) return;

    const script = document.createElement("script");
    script.src = "/intake/thank-you-video.js";
    script.async = true;
    script.dataset.thankYouVideoScript = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Zoom Video Visit — $39 | MedMethod Direct</title>
        <meta
          name="description"
          content="Review your intake next steps and, if desired, add an optional $39 Zoom video visit."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
      </Helmet>

      <div className="thank-you-video" id="thank-you-video-root">
        <header className="tyv-top">
          <a className="tyv-brand" href="/" aria-label="MedMethod Direct home">
            <span className="tyv-brand-name">
              <span className="tyv-brand-med">Med</span>
              <span className="tyv-brand-method">Method</span>
            </span>
            <span className="tyv-brand-direct">
              <i />
              DIRECT
              <i />
            </span>
          </a>
          <a className="tyv-help" href="tel:+18883627011">
            <Phone aria-hidden="true" />
            <span>
              <strong>(888) 362-7011</strong>
              <small>Need help?</small>
            </span>
          </a>
        </header>

        <main className="tyv-stage" id="confirmed-intake" aria-labelledby="video-page-title">
          <div className="tyv-demo-banner" id="demo-banner" hidden role="status">
            DEMO DATA — SANDBOX VIDEO-VISIT PAYMENT TEST
          </div>

          <section className="tyv-confirmation">
            <div className="tyv-checkmark" aria-hidden="true">
              <CheckCircle />
            </div>
            <h1 id="video-page-title">Zoom video visit — $39</h1>
            <p className="tyv-lede" id="video-page-copy">
              Complete your intake, then pick a time to meet with Dr. Al-Deek.
            </p>
            <div className="tyv-virtual-badge">100% Virtual — No Office Visit Needed</div>

            <section className="tyv-video-visit-card" id="video-visit-card" aria-labelledby="video-visit-title">
              <div className="tyv-video-icon" aria-hidden="true">
                <Video />
              </div>
              <div>
                <p className="tyv-offer-label">Zoom video visit — $39</p>
                <h2 id="video-visit-title">Prefer a face-to-face conversation?</h2>
                <p>
                  Add an optional Zoom video visit with a doctor specializing in medical weight loss.
                </p>
                <p className="tyv-video-reassurance">
                  No monthly charge and no commitment. This is optional; declining, cancelling, or a payment issue never affects your intake.
                </p>
                <button className="tyv-primary" id="open-video-checkout" type="button" disabled>
                  Add Zoom Video Visit — $39
                </button>
              </div>
            </section>

            <section className="tyv-calendar-card" aria-labelledby="video-calendar-heading">
              <div className="tyv-calendar-head">
                <h2 id="video-calendar-heading">Choose a time for your Zoom video visit</h2>
                <p>Complete your optional video visit payment below to choose a time.</p>
              </div>

              <div id="video-calendar" data-src={BOOKING_URL} aria-live="polite">
                <div className="tyv-calendar-locked">
                  <LockKeyhole aria-hidden="true" />
                  <p>Complete your $39 Zoom video visit payment to choose a time.</p>
                </div>
              </div>

              <section className="tyv-checkout" id="video-checkout" aria-labelledby="checkout-title" hidden>
                <h2 id="checkout-title">Zoom video visit — $39</h2>
                <p>Payment is only for the optional Zoom video visit — $39. Your intake remains complete either way.</p>
                <p className="tyv-checkout-status" id="checkout-status" aria-live="polite">
                  Payment is available after your intake receipt is verified.
                </p>

                <section className="tyv-coupon" aria-labelledby="coupon-title">
                  <label id="coupon-title" htmlFor="video-coupon-code">
                    Optional Zoom video visit coupon
                  </label>
                  <div className="tyv-coupon-row">
                    <input
                      id="video-coupon-code"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      maxLength={64}
                      placeholder="Enter coupon code"
                      aria-describedby="video-coupon-note"
                      disabled
                    />
                    <button className="tyv-secondary" id="validate-video-coupon" type="button" disabled>
                      Apply
                    </button>
                  </div>
                  <p className="tyv-checkout-note" id="video-coupon-note">
                    A coupon can waive only the optional video visit. Your intake remains complete.
                  </p>
                  <div className="tyv-coupon-confirmed" id="coupon-confirmed" hidden>
                    <strong>Video-visit coupon confirmed</strong>
                    <p>No payment will be collected for the video visit.</p>
                    <button className="tyv-primary" id="submit-video-coupon" type="button" disabled>
                      Continue without payment
                    </button>
                  </div>
                </section>

                <div className="tyv-checkout-payment-area" id="checkout-payment-area">
                  <p className="tyv-checkout-note">
                    Enter card details only in PayPal-hosted secure fields. MedMethod Direct does not receive or store card numbers or security codes.
                  </p>
                  <div className="tyv-checkout-card-fields" id="checkout-card-fields" hidden>
                    <h3>Pay $39 for your Zoom video visit</h3>
                    <p className="tyv-checkout-note">Your card details stay inside PayPal-hosted secure fields.</p>
                    <div className="tyv-paypal-inputs" aria-busy="true">
                      <label className="tyv-paypal-field">
                        <span>Cardholder name</span>
                        <div id="video-card-name" />
                      </label>
                      <label className="tyv-paypal-field">
                        <span>Card number</span>
                        <div id="video-card-number" />
                      </label>
                      <div className="tyv-paypal-grid">
                        <label className="tyv-paypal-field">
                          <span>Expiration date</span>
                          <div id="video-card-expiry" />
                        </label>
                        <label className="tyv-paypal-field">
                          <span>Security code</span>
                          <div id="video-card-cvv" />
                        </label>
                      </div>
                    </div>
                    <button className="tyv-primary tyv-paypal-pay" id="pay-video-card" type="button" disabled>
                      Pay $39 for your Zoom video visit
                    </button>
                  </div>
                  <div className="tyv-apple-pay-option" id="video-apple-pay" hidden />
                </div>
                <p className="tyv-checkout-error" id="checkout-error" role="alert" aria-live="assertive" />
              </section>

              <section className="tyv-checkout-complete" id="video-payment-pending" aria-live="polite" hidden>
                <h2>Check your existing video payment</h2>
                <p>
                  Your optional video checkout is pending confirmation. Check that payment before trying again. Your intake remains complete.
                </p>
                <button className="tyv-secondary" id="recover-video-payment" type="button">
                  Check payment confirmation
                </button>
                <p id="video-recovery-status" role="status" />
              </section>

              <section className="tyv-checkout-complete" id="video-visit-complete" aria-live="polite" hidden>
                <h2 id="video-complete-title">Zoom video visit payment confirmed</h2>
                <p id="video-complete-copy">
                  Thank you. You can now choose a time for your optional Zoom video visit.
                </p>
              </section>
            </section>

            <section className="tyv-follow-up-heading" aria-labelledby="next-steps-title">
              <p>What Happens Next</p>
              <h2 id="next-steps-title">Complete these 3 steps to prepare for your visit</h2>
            </section>

            <section className="tyv-follow-ups" aria-label="Appointment preparation steps">
              {followUpSteps.map((step, index) => {
                const { Icon } = step;
                const isCareMessageStep = index === 2;

                return (
                  <div className="tyv-follow-up-wrap" key={step.label}>
                    <article className="tyv-follow-up-card">
                      <div className="tyv-follow-up-icon" aria-hidden="true">
                        <Icon />
                      </div>
                      <div>
                        <span className="tyv-step-label">{step.label}</span>
                        {isCareMessageStep ? (
                          <>
                            <h3 id="care-message-title">{step.title}</h3>
                            <p id="care-message-copy">{step.description}</p>
                          </>
                        ) : (
                          <>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                          </>
                        )}
                        {index === 0 && <a className="tyv-primary tyv-create-account" href="https://medmethoddirect.md-hq.com/registration" target="_blank" rel="noopener noreferrer">Create Account<ArrowRight aria-hidden="true" /></a>}
                      </div>
                    </article>
                    {index < followUpSteps.length - 1 && <div className="tyv-step-connector" aria-hidden="true"><i /><i /><i /></div>}
                  </div>
                );
              })}
            </section>

            <a className="tyv-support-cta" href="tel:+18883627011">
              <Phone aria-hidden="true" />
              <span>
                <strong>(888) 362-7011</strong>
                <small>Questions? Call us anytime</small>
              </span>
            </a>
          </section>

          <aside className="tyv-no-intake" id="no-intake" aria-labelledby="no-intake-title" hidden>
            <p className="tyv-eyebrow">Need to start over?</p>
            <h2 id="no-intake-title">Complete your intake to get started</h2>
            <p>Your intake receipt is needed before an optional Zoom video visit can be paid for or scheduled.</p>
            <a className="tyv-secondary" href="/intake/">Complete your intake</a>
          </aside>
        </main>

        <footer className="tyv-footer">
          <a href="/">
            Continue exploring MedMethod Direct
            <ArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </>
  );
}
