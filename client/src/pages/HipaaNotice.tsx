/* =============================================================================
   HIPAA Notice of Privacy Practices — MedMethod Direct
   Publication-ready content from MMD_Website_Compliance_Final_v3.docx
   Effective Date: May 14, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function HipaaNotice() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>Notice of Privacy Practices (HIPAA) | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct HIPAA Notice of Privacy Practices — how we use and protect your Protected Health Information." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Notice of Privacy Practices</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: May 14, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
              <p className="text-gray-700 leading-relaxed font-semibold text-sm">
                THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              This Notice of Privacy Practices describes how Med Method Direct Clinical PLLC ("we," "us," or "our") uses and protects your Protected Health Information ("PHI"). PHI is any information that relates to your health, the healthcare we provide to you, or payment for your care that could identify you. We are required by federal law — specifically the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its regulations — to maintain the privacy of your PHI, to follow the terms of this Notice, and to provide you with this Notice.
            </p>

            {/* 1 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. How We Use and Share Your Health Information</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Treatment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use your health information to provide and coordinate your medical care. For example, Dr. Jumana Al-Deek or a supervised nurse practitioner may review your lab results, adjust your medication dosage, send a prescription to a compounding pharmacy, or consult with another provider about your treatment plan. All of this is done to give you the best possible care.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Payment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Although we are a cash-pay practice that does not bill insurance companies, we use your information for payment-related purposes — for example, to process your monthly subscription, maintain billing records, and confirm that services were provided.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Healthcare Operations</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use your information to run our practice well. This includes reviewing our clinical quality, training our team, evaluating our providers, and ensuring we comply with applicable regulations. For example, we may review a sample of patient records to confirm that our protocols are being followed correctly.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Required by Law</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We will share your PHI when we are required to by federal, state, or local law. For example, we may be required to report certain communicable diseases to public health authorities.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Public Health Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may report information to public health agencies for disease surveillance, to report adverse events related to medications, or to prevent or control disease as authorized by law.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Health Oversight</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may share your PHI with health oversight agencies — such as state medical boards — for audits, investigations, licensure reviews, and other oversight activities authorized by law.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Legal Proceedings</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may disclose your PHI in response to a court order, subpoena, or other lawful legal process. We will make reasonable efforts to notify you before complying unless prohibited by law.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Law Enforcement</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may share your PHI with law enforcement in limited circumstances, such as to identify or locate a suspect, to respond to a crime on our premises, or when required by law.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Serious Threats to Safety</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may share your PHI when we believe it is necessary to prevent or reduce a serious and imminent threat to your health or safety, or the health or safety of another person.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Telehealth-Specific Disclosure</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your consultations and all communications with your care team at Med Method Direct take place via HIPAA-compliant, encrypted telehealth and messaging platforms. All electronic transmissions of your health information are secured using industry-standard encryption. We use Cerbo Health for our electronic health records and telehealth visits, and Spruce Health for secure patient messaging. Both platforms have signed HIPAA Business Associate Agreements with us.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Uses That Require Your Written Authorization</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              For anything not described above — including most marketing uses of your health information, the sale of your PHI, or use of psychotherapy notes — we will ask for your written authorization first. You have the right to revoke any authorization you provide at any time by notifying us in writing. Revoking an authorization will not affect actions we have already taken in reliance on it.
            </p>

            {/* 2 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. Your Rights</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to Access and Copy Your Records</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You have the right to inspect and receive a copy of your health information held in our records. To make this request, email us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a>. We will provide access within 30 days. We may charge a reasonable cost-based fee for copies.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to Amend Your Records</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you believe that information in your records is inaccurate or incomplete, you can ask us to amend it. Send your request in writing to <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> explaining what you believe is wrong and why. We will consider your request and will explain our decision. We may deny requests under limited circumstances permitted by HIPAA.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to an Accounting of Disclosures</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You have the right to receive a list of certain disclosures we have made of your PHI other than for treatment, payment, and healthcare operations. You may request one free accounting per 12-month period. Additional requests may be subject to a reasonable fee.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to Request Restrictions</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You can ask us to limit how we use or share your PHI. Because Med Method Direct is a cash-pay practice where you pay out of pocket for all services, you have a particularly strong right: if you pay for a service in full at the time of care, you can require us not to share information about that service with a health plan, and we are legally required to honor that request. For other restriction requests, we will consider them but are not always required to agree.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to Confidential Communications</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You can ask us to contact you in a specific way — for example, only by email rather than phone, or only at a specific address. We will honor all reasonable requests. Contact us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> to make this request.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Right to a Copy of This Notice</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You may request a printed or electronic copy of this Notice at any time by contacting us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a>.
            </p>

            {/* 3 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. Our Duties</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>We are required by law to maintain the privacy of your PHI.</li>
              <li>We must provide you with this Notice and follow its terms.</li>
              <li>If we make a material change to our privacy practices, we will update this Notice and post the new version at medmethoddirect.com/hipaa-notice. If you are an active patient, we will notify you of material changes by email.</li>
              <li>If your unsecured PHI is breached, we will notify you within 60 days of discovering the breach, as required by the HIPAA Breach Notification Rule.</li>
              <li>We will not use or disclose your PHI in any way that contradicts this Notice unless you give us written authorization.</li>
            </ul>

            {/* 4 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. How to File a Complaint</h2>
            <p className="text-gray-700 leading-relaxed mb-4">If you believe we have violated your privacy rights, you have two options:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Contact our Privacy Officer directly:</strong> Muhssin El-Yacoubi | <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> | 561-594-4949 | 7901 4th St N STE 300, St. Petersburg, FL 33702</li>
              <li><strong>File a complaint with the U.S. Department of Health and Human Services</strong> Office for Civil Rights at <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#E8339E" }}>www.hhs.gov/ocr/privacy/hipaa/complaints</a>.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6 font-semibold">
              We will not retaliate against you in any way for filing a complaint.
            </p>

            {/* 5 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Contact Information</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Privacy Officer: Muhssin El-Yacoubi</p>
              <p className="text-gray-600 text-sm mb-1">Med Method Direct Clinical PLLC</p>
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
