/* =============================================================================
   Terms & Conditions — MedMethod Direct
   Publication-ready content from MMD_Website_Compliance_Final_v3.docx
   Effective Date: May 14, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function TermsOfService() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Terms and Conditions governing your use of our website and telehealth services." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Terms &amp; Conditions</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: May 14, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms and Conditions govern your use of the Med Method Direct website and all services we provide. By creating an account or using our services, you agree to these Terms. Please read them carefully.
            </p>

            {/* 1 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Med Method Direct operates through two entities working together. <strong>Med Method Direct Management LLC</strong> is the management company responsible for the website, technology, billing, and all non-clinical operations. <strong>Med Method Direct Clinical PLLC</strong> is the physician-owned medical entity through which Dr. Jumana Al-Deek, D.O. and supervised licensed providers deliver clinical care. When you enroll in a Med Method Direct subscription, you enter a service agreement with Med Method Direct Management LLC for services delivered by Med Method Direct Clinical PLLC.
            </p>

            {/* 2 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing our website at medmethoddirect.com, creating an account, or using any of our services, you confirm that you have read these Terms, that you understand them, and that you agree to be bound by them. If you do not agree, do not use our services. Your continued use of our services after any update to these Terms constitutes your acceptance of the updated Terms.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms should be read alongside our <a href="/privacy" className="underline" style={{ color: "#E8339E" }}>Privacy Policy</a>, our <a href="/hipaa-notice" className="underline" style={{ color: "#E8339E" }}>Notice of Privacy Practices</a>, and our <a href="/subscription-policy" className="underline" style={{ color: "#E8339E" }}>Subscription and Refund Policy</a>.
            </p>

            {/* 3 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You must meet all of the following requirements to use Med Method Direct services:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>You are at least 18 years of age.</li>
              <li>You are a legal resident of the United States residing in Florida, Arizona, Colorado, the District of Columbia, Georgia, Illinois, Maryland, Michigan, North Carolina, Pennsylvania, Texas, or Virginia.</li>
              <li>You have a compatible device and stable internet connection for telehealth visits.</li>
              <li>You are not pregnant or breastfeeding, unless otherwise cleared by your provider.</li>
              <li>You have not been previously terminated from Med Method Direct for violation of these Terms.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you do not meet these requirements, you are not eligible to use our services. We do not serve patients outside the jurisdictions listed above.
            </p>

            {/* 4 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. Our Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Med Method Direct is a physician-led, direct-pay telehealth platform. We offer three core programs:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>GLP-1 Weight Management</strong> — medically supervised weight loss using compounded tirzepatide, prescribed by our licensed providers.</li>
              <li><strong>Bioidentical Hormone Replacement Therapy (BHRT) for Women</strong> — physician-managed hormone therapy including estrogen, progesterone, and testosterone and related treatments.</li>
            </ul>
            <div className="rounded-xl border border-[#E8D7E5] bg-[#FFF9FC] p-5 mb-6 text-gray-700 leading-relaxed space-y-3">
              <p>Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.</p>
              <p>Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              All clinical services are delivered via secure video consultation and secure messaging. We are a cash-pay only practice. We do not accept, bill, or process any form of insurance, including Medicare, Medicaid, and all private insurance plans. You are responsible for all subscription and medication costs.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              All prescriptions are issued solely at the clinical discretion of your treating provider. Enrollment does not guarantee that you will receive a prescription or any specific medication. Your provider will make all prescribing decisions based on your individual medical evaluation.
            </p>

            {/* 5 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Account Registration and Your Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To use our services, you must create an account and complete our intake process. You agree to provide truthful, accurate, and complete information about yourself, your medical history, current medications, allergies, and health conditions at all times. Providing false or misleading information creates clinical risk and is grounds for immediate account termination.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You are responsible for keeping your account credentials confidential. You may not share your account with anyone else. Contact us immediately at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> if you suspect unauthorized access to your account.
            </p>

            {/* 6 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. Subscription and Billing</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Med Method Direct offers flexible billing plans, including paid-in-full terms and, where available, monthly billing. Subscription fees cover clinical consultations, prescription management, and care coordination. Medications are priced and billed separately through our pharmacy partners.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Paid-in-full plans are our default billing option, available in 3-month, 6-month, and 12-month terms. Your plan will automatically renew for the same term at the end of your billing period unless you notify us at least 30 days before your term end date that you do not wish to renew. Monthly billing is only available on programs where we offer it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>All Sales Are Final.</strong> We do not issue refunds of any kind for subscription fees or medication purchases. All charges are final at the time they are made. You can cancel your subscription going forward, but you will not receive a refund for any period already billed. See our full <a href="/subscription-policy" className="underline" style={{ color: "#E8339E" }}>Subscription and Refund Policy</a> for complete details on billing and cancellation.
            </p>

            {/* 7 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>7. Telehealth Services — What We Can and Cannot Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Telehealth is an effective and convenient way to access many healthcare services. At the same time, it has real limitations that you should understand before enrolling.</p>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>What telehealth allows us to do:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Conduct a thorough clinical evaluation through video and health history review.</li>
              <li>Order and interpret laboratory tests and hormonal bloodwork.</li>
              <li>Prescribe medications appropriate for your condition when clinically indicated.</li>
              <li>Monitor your progress and adjust your treatment plan over time.</li>
            </ul>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>What telehealth cannot replace:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>A hands-on physical examination.</li>
              <li>Diagnosis or treatment of conditions requiring imaging, in-person procedures, or specialist care.</li>
              <li>Emergency medical services of any kind.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your provider may determine at any point that your care requires an in-person evaluation, a referral to a specialist, or laboratory testing. Following your provider's recommendations is your responsibility. Additional in-person care will be at your own cost.
            </p>

            {/* 8 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>8. Emergency Services</h2>
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
              <p className="text-gray-700 leading-relaxed font-semibold">
                Med Method Direct is not an emergency medical service. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. Do not use our website, patient portal, or messaging platform to seek emergency care.
              </p>
            </div>

            {/* 9 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>9. Prescription Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Every prescription issued through Med Method Direct is a clinical decision made by your licensed provider based on your individual medical history, lab results, and evaluation. No prescription is guaranteed. We do not pre-approve prescriptions before a clinical evaluation is complete. Your provider may decline to prescribe, change your dosage, or discontinue your treatment at any time based on clinical judgment, patient safety, or changes in your health status.
            </p>
            {/* 10 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>10. Compounded Medications</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.
            </p>

            {/* 11 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>11. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All content on medmethoddirect.com — including text, images, logos, graphics, clinical content, and design — is owned by Med Method Direct Management LLC and protected by applicable copyright and trademark law. You may not copy, reproduce, distribute, or create derivative works from any content on our website without our written permission. You may print or save content for your personal, non-commercial use only.
            </p>

            {/* 12 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>12. Prohibited Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Provide false or misleading information at any point in the enrollment or care process.</li>
              <li>Use our services for any purpose that violates applicable law.</li>
              <li>Share your account or access credentials with any other person.</li>
              <li>Attempt to access parts of our systems or data that you are not authorized to access.</li>
              <li>Interfere with the operation of our website or services.</li>
              <li>Impersonate any person or entity.</li>
              <li>Harass, threaten, or abuse any member of our team.</li>
            </ul>

            {/* 13 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>13. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To the fullest extent permitted by law, Med Method Direct — including Med Method Direct Management LLC, Med Method Direct Clinical PLLC, and all of our officers, directors, providers, employees, and agents — is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. This includes lost data, interrupted service, or any harm arising from treatment decisions made in good faith by your provider.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our total liability to you for any claim arising under these Terms will not exceed the total amount you paid us in the three months before the claim arose. Nothing in this section limits liability that cannot be excluded under applicable law, including liability for gross negligence or willful misconduct.
            </p>

            {/* 14 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>14. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You agree to defend and hold harmless Med Method Direct, its entities, officers, providers, employees, and agents from any claim, loss, liability, or expense — including reasonable legal fees — that arises from your violation of these Terms, your provision of false or misleading information, or your violation of any law or third-party right in connection with your use of our services.
            </p>

            {/* 15 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms are governed by the laws of the State of Florida. Any dispute that cannot be resolved informally will be handled in accordance with the dispute resolution process described below.
            </p>

            {/* 16 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>16. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We ask that before filing any formal legal action, you contact us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> to describe your concern and give us 30 days to resolve it. Most concerns can be resolved quickly this way.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If we cannot resolve a dispute within 30 days, the dispute will be submitted to binding individual arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules, with the arbitration taking place in St. Petersburg, Florida. The arbitrator's decision will be final and binding on both parties.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Class Action Waiver:</strong> You waive the right to participate in any class action lawsuit or class-wide arbitration. All disputes must be brought individually.
            </p>

            {/* 17 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>17. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may suspend or terminate your account at any time if you violate these Terms, provide false information, engage in prohibited conduct, or fail to pay amounts owed. You may cancel your subscription at any time as described in our <a href="/subscription-policy" className="underline" style={{ color: "#E8339E" }}>Subscription and Refund Policy</a>. Upon termination, your right to access our services ends immediately. Your medical records will be retained in accordance with applicable law and our <a href="/hipaa-notice" className="underline" style={{ color: "#E8339E" }}>Notice of Privacy Practices</a>.
            </p>

            {/* 18 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>18. Changes to These Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update these Terms at any time. When we do, we will post the updated version at medmethoddirect.com/terms and update the effective date. If a change is material, we will notify you by email. Your continued use of our services after the updated Terms take effect constitutes your acceptance.
            </p>

            {/* 19 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>19. Contact</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
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
