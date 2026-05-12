/* =============================================================================
   HIPAA Notice of Privacy Practices — MedMethod Direct
   Federal HIPAA requirement for covered healthcare entities
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function HipaaNotice() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>HIPAA Notice of Privacy Practices | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct HIPAA Notice of Privacy Practices — your rights regarding your protected health information." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>HIPAA Notice of Privacy Practices</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
          </div>

          {/* Important notice box */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-10">
            <p className="text-sm font-bold text-gray-800 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct is required by law to maintain the privacy of your Protected Health Information (PHI), to provide you with notice of our legal duties and privacy practices with respect to PHI, and to notify you following a breach of your unsecured PHI. We are required to abide by the terms of this Notice while it is in effect.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>How We May Use and Disclose Your Health Information</h2>

            <h3 className="text-base font-bold text-gray-900 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Treatment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may use and disclose your PHI to provide, coordinate, or manage your healthcare and related services. For example, we may share your information with other healthcare providers involved in your care, such as laboratories or pharmacies.
            </p>

            <h3 className="text-base font-bold text-gray-900 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Payment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may use and disclose your PHI to obtain payment for the services we provide. For example, we may share your information with our payment processor to bill you for services rendered.
            </p>

            <h3 className="text-base font-bold text-gray-900 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Healthcare Operations</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may use and disclose your PHI for our healthcare operations, including quality assessment, training, licensing, and business management activities necessary to operate our practice.
            </p>

            <h3 className="text-base font-bold text-gray-900 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Other Permitted Uses and Disclosures</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We may also use or disclose your PHI without your authorization in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>As required by law (e.g., public health reporting, law enforcement, court orders).</li>
              <li>To avert a serious threat to health or safety.</li>
              <li>For workers' compensation purposes.</li>
              <li>To the U.S. Department of Health and Human Services for compliance investigations.</li>
              <li>For research purposes, subject to applicable legal requirements.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Uses and Disclosures Requiring Your Authorization</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For uses and disclosures of your PHI not described above, we will obtain your written authorization. You may revoke your authorization at any time in writing, except to the extent that we have already taken action in reliance on it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We will not use or disclose your PHI for marketing purposes or sell your PHI without your written authorization.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Your Rights Regarding Your Health Information</h2>

            <p className="text-gray-700 leading-relaxed mb-4">You have the following rights with respect to your PHI:</p>

            <ul className="list-disc pl-6 text-gray-700 space-y-3 mb-6">
              <li><strong>Right to Access:</strong> You have the right to inspect and obtain a copy of your PHI. We may charge a reasonable, cost-based fee for copies.</li>
              <li><strong>Right to Amend:</strong> You have the right to request that we amend your PHI if you believe it is incorrect or incomplete. We may deny your request in certain circumstances.</li>
              <li><strong>Right to an Accounting of Disclosures:</strong> You have the right to request a list of certain disclosures we have made of your PHI.</li>
              <li><strong>Right to Request Restrictions:</strong> You have the right to request restrictions on how we use or disclose your PHI. We are not required to agree to all requests.</li>
              <li><strong>Right to Confidential Communications:</strong> You have the right to request that we communicate with you about your health information in a specific way or at a specific location.</li>
              <li><strong>Right to a Paper Copy of This Notice:</strong> You have the right to receive a paper copy of this Notice upon request.</li>
              <li><strong>Right to Notification of Breach:</strong> You have the right to be notified in the event of a breach of your unsecured PHI.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Changes to This Notice</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to change this Notice at any time. We reserve the right to make the revised or changed Notice effective for PHI we already have about you as well as any information we receive in the future. We will post a copy of the current Notice on our website. The Notice will contain the effective date on the first page.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Complaints</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you believe your privacy rights have been violated, you may file a complaint with MedMethod Direct or with the U.S. Department of Health and Human Services Office for Civil Rights. To file a complaint with HHS, visit <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#E8339E" }}>www.hhs.gov/ocr</a>. You will not be retaliated against for filing a complaint.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Contact Our Privacy Officer</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Privacy Officer — MedMethod Direct</p>
              <p className="text-gray-600 text-sm mb-1">[BUSINESS ADDRESS — TO BE COMPLETED]</p>
              <p className="text-gray-600 text-sm mb-1">Email: <a href="mailto:privacy@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>privacy@medmethoddirect.com</a></p>
              <p className="text-gray-600 text-sm">Phone: [PHONE NUMBER — TO BE COMPLETED]</p>
            </div>

          </div>
        </div>
      </main>
      <Footer onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
