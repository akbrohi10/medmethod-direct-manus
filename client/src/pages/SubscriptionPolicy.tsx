/* =============================================================================
   Subscription & Refund Policy — MedMethod Direct
   Publication-ready content from MMD_Website_Compliance_Final_v3.docx
   Effective Date: May 14, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function SubscriptionPolicy() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>Subscription &amp; Refund Policy | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Subscription and Refund Policy — billing plans, cancellation, and refund terms." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Subscription &amp; Refund Policy</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: May 14, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              This policy explains how your Med Method Direct subscription works, how you are billed, how to cancel, and our policy on refunds. Please read it before enrolling.
            </p>

            {/* 1 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. What Your Subscription Includes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Med Method Direct subscription gives you access to physician-led telehealth care in your enrolled program. Depending on your program, your subscription includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Initial clinical consultation with your provider via secure video.</li>
              <li>Ongoing follow-up consultations as part of your care plan.</li>
              <li>Prescription management — your provider reviews, adjusts, and manages your prescriptions.</li>
              <li>Care coordination — communication with our clinical team through our secure messaging platform.</li>
              <li>Lab order management — your provider orders and reviews your required laboratory tests.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your subscription does not include the cost of medications. Medications are prescribed by your provider and billed separately through our compounding pharmacy partners. Medication costs vary based on your prescribed protocol and dosage. Current subscription pricing is available at checkout and at medmethoddirect.com/pricing.
            </p>

            {/* 2 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. Billing Plans</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Med Method Direct offers flexible billing plans to fit your commitment level and goals. When you enroll, you select the billing plan that works best for you. All available plans and their pricing are displayed at checkout and at medmethoddirect.com/pricing.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Paid-in-Full Plans (Default)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our default and recommended billing option is to pay your program in full upfront for a set term. Paid-in-full plans are available in the following terms:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>3-Month Plan</strong> — full program fee paid at enrollment, covering 3 months of care.</li>
              <li><strong>6-Month Plan</strong> — full program fee paid at enrollment, covering 6 months of care.</li>
              <li><strong>12-Month Plan</strong> — full program fee paid at enrollment, covering 12 months of care.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Paid-in-full plans give you access to your full program term from the date of enrollment. No additional subscription charges will be made during your paid term. Your plan will automatically renew for the same term at the end of your billing period unless you notify us at least 30 days before your term end date that you do not wish to renew.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Monthly Billing Plan</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Monthly billing is only available on programs where we offer it. Your subscription is billed on the date you enroll and renews automatically on the same calendar date every month. By selecting monthly billing, you authorize Med Method Direct Management LLC to charge your payment method on file each month without additional action from you. If your billing date falls on a day that does not exist in a given month — for example, the 31st in a 30-day month — you will be charged on the last day of that month.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You will receive an email receipt after every charge, regardless of which billing plan you are on.
            </p>

            {/* 3 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. Cancellation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can cancel your subscription or choose not to renew at any time. To cancel:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Email us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> with your full name and request to cancel, or</li>
              <li>Log into your patient portal and cancel directly from your account settings.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Monthly Plan Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              To avoid being charged for the next monthly billing cycle, your cancellation must be received before your next scheduled renewal date. Cancellations received on or after your renewal date will take effect the following month.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you enrolled in a program under a monthly billing arrangement that is part of a longer commitment period, early cancellation may result in a pricing adjustment. Specifically, if you cancel before completing the full commitment period, your total charges may be recalculated based on the shorter period you actually completed. If the pricing applicable to that shorter period exceeds the amount already paid, the difference will become immediately due and payable upon cancellation. We reserve the right to collect any outstanding balance resulting from such a recalculation before your account is closed.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Paid-in-Full Plan Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you are on a paid-in-full plan, you may cancel at any time, but your plan is nonrefundable — see Section 4. Your access to clinical services continues through the end of your paid term regardless of when you cancel. We do not cut off access early when you cancel.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Non-Renewal</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you do not wish to renew at the end of a paid-in-full term, you must notify us at least 30 days before your term end date at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a>. If we do not receive written notice of cancellation at least 30 days before your term ends, your plan will automatically renew for the same term at the then-current rate and your payment method on file will be charged accordingly.
            </p>

            {/* 4 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. All Sales Are Final — No Refunds</h2>
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
              <p className="text-gray-700 leading-relaxed font-semibold">
                All subscription fees — whether paid monthly or as a paid-in-full plan — are nonrefundable. Once a payment is made, it will not be returned to you under any circumstances. This applies regardless of whether you cancel early, do not use your consultations, switch plans, are unsatisfied with your provider, or decide the program is not right for you.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you are on a 3-month, 6-month, or 12-month paid-in-full plan and cancel before your term ends, you retain access to clinical services through the end of your paid term, but no portion of the plan fee will be refunded.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Medication purchases are nonrefundable.</strong> Compounded medications are prepared specifically for you based on your individual prescription. Once your medication has been dispensed and shipped, the sale is final. Compounded medications cannot be returned or resold under any circumstances.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We make this policy clear before you enroll because we believe you deserve to know exactly what you are agreeing to. If you have questions about whether our services are right for you before enrolling, contact us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> and we are happy to answer them.
            </p>

            {/* 5 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Failed Payments</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This section applies to monthly billing plans and any recurring charges. If your payment fails, we will attempt to charge your payment method on file again within 3 business days. If the second attempt also fails, your access to clinical services may be suspended until payment is successfully processed. We will notify you by email if a payment fails. It is your responsibility to keep valid payment information on file in your account. You can update your payment method at any time through your patient portal.
            </p>

            {/* 6 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. Billing Questions</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have a question about a charge, email us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a>. We respond to billing questions within one business day, Monday through Friday. Please contact us directly before initiating a chargeback with your bank — we will work with you to resolve any billing concern promptly.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6 mt-10">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Med Method Direct</p>
              <p className="text-gray-600 text-sm mb-1">7901 4th St N STE 300, St. Petersburg, FL 33702</p>
              <p className="text-gray-600 text-sm mb-1">Email: <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a></p>
              <p className="text-gray-600 text-sm">Phone: <a href="tel:5615944949" className="underline" style={{ color: "#E8339E" }}>561-594-4949</a></p>
            </div>

            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mt-10">
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <strong className="text-gray-700">Medical Disclaimer:</strong> The information on this website is for educational purposes only and does not constitute medical advice. MedMethod Direct services are provided by licensed medical professionals. All prescriptions are issued only after a valid patient-provider relationship has been established through a proper medical evaluation. Individual results may vary.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
