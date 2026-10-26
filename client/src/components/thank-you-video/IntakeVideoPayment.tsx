import { useEffect, useRef } from "react";
import { initializeThankYouVideoCheckout } from "./checkout.js";
import type { IntakeVideoReceipt } from "./receipt";

export default function IntakeVideoPayment({ receipt, onConfirmed }: { receipt: IntakeVideoReceipt; onConfirmed: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return initializeThankYouVideoCheckout(root.current, receipt, onConfirmed);
  }, [receipt, onConfirmed]);

  return (
    <div ref={root} className="tyv-payment-panel w-full max-w-2xl mb-10" data-thank-you-video-payment>
      <div id="video-payment-pending" className="checkout-complete" aria-live="polite" hidden>
        <h2>Check your existing video payment</h2>
        <p>Your optional video checkout is pending confirmation. Check that payment before trying again. Your free intake remains complete.</p>
        <button className="secondary" id="recover-video-payment" type="button">Check payment confirmation</button>
        <p id="video-recovery-status" role="status" />
      </div>
      <section className="checkout" id="video-checkout" aria-labelledby="checkout-title">
        <h2 id="checkout-title">Add Your Zoom Video Visit</h2>
        <p>Complete your $39 payment below, then pick a time to meet with Dr. Al-Deek.</p>
        <p className="checkout-status" id="checkout-status" aria-live="polite" />
        <section className="coupon" aria-labelledby="coupon-title">
          <label id="coupon-title" htmlFor="video-coupon-code">Enter referral code</label>
          <div className="coupon-row">
            <input id="video-coupon-code" type="text" inputMode="text" autoComplete="off" maxLength={64} placeholder="Enter referral code" />
            <button className="secondary" id="validate-video-coupon" type="button">Apply</button>
          </div>
          <div className="coupon-confirmed" id="coupon-confirmed" hidden>
            <strong>Video-visit coupon confirmed</strong>
            <p>No payment will be collected for the video visit.</p>
            <button className="primary" id="submit-video-coupon" type="button">Continue without payment</button>
          </div>
        </section>
        <div className="checkout-payment-area" id="checkout-payment-area">
          <p className="checkout-note">Enter card details only in PayPal-hosted secure fields. MedMethod Direct does not receive or store card numbers or security codes.</p>
          <div className="checkout-card-fields" id="checkout-card-fields" hidden>
            <h3>Pay $39 securely</h3>
            <p className="checkout-note">Your card details stay inside PayPal-hosted secure fields.</p>
            <div className="paypal-inputs" aria-busy="true">
              <label className="paypal-field"><span>Cardholder name</span><div id="video-card-name" /></label>
              <label className="paypal-field"><span>Card number</span><div id="video-card-number" /></label>
              <div className="paypal-grid">
                <label className="paypal-field"><span>Expiration date</span><div id="video-card-expiry" /></label>
                <label className="paypal-field"><span>Security code</span><div id="video-card-cvv" /></label>
              </div>
            </div>
            <button className="primary paypal-pay" id="pay-video-card" type="button" disabled>Pay $39 securely</button>
          </div>
          <div className="apple-pay-option" id="video-apple-pay" hidden />
        </div>
        <p className="checkout-error" id="checkout-error" role="alert" aria-live="assertive" />
      </section>
    </div>
  );
}
