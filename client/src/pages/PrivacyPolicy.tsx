/* =============================================================================
   Privacy Policy — MedMethod Direct
   HIPAA-aligned privacy policy page
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function PrivacyPolicy() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Privacy Policy — how we collect, use, and protect your personal and health information in compliance with HIPAA." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct ("we," "us," or "our") is committed to protecting the privacy and security of your personal and health information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website at <strong>medmethoddirect.com</strong> or use our telehealth services. Please read this policy carefully. By using our website or services, you agree to the practices described herein.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct is a virtual telehealth medical practice providing physician-led hormone therapy, medical weight loss, menopause management, and longevity medicine for women. Our services are provided by licensed physicians and healthcare professionals. As a covered healthcare entity under the Health Insurance Portability and Accountability Act of 1996 (HIPAA), we are required to maintain the privacy of your Protected Health Information (PHI) and to provide you with notice of our legal duties and privacy practices.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              For our full HIPAA Notice of Privacy Practices, please see our <a href="/hipaa-notice" className="underline" style={{ color: "#E8339E" }}>HIPAA Notice of Privacy Practices</a>.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We may collect the following categories of information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Personal Identification Information:</strong> Name, date of birth, email address, phone number, mailing address.</li>
              <li><strong>Health and Medical Information (PHI):</strong> Medical history, symptoms, lab results, medications, treatment plans, and other health-related data you provide during consultations or intake forms.</li>
              <li><strong>Payment Information:</strong> Credit card or payment details processed through our secure third-party payment processor. We do not store full payment card numbers.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, pages visited, and time spent on our website, collected via cookies and analytics tools.</li>
              <li><strong>Communications:</strong> Messages, emails, or other communications you send to us.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Provide, coordinate, and manage your medical care and telehealth services.</li>
              <li>Process payments and manage your account.</li>
              <li>Communicate with you regarding appointments, lab results, prescriptions, and follow-up care.</li>
              <li>Comply with applicable laws, regulations, and licensing requirements.</li>
              <li>Improve our website, services, and patient experience.</li>
              <li>Send you health education content, program updates, or promotional communications (you may opt out at any time).</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Healthcare Operations:</strong> With licensed physicians, nurse practitioners, pharmacists, and other healthcare professionals involved in your care.</li>
              <li><strong>Business Associates:</strong> With HIPAA-compliant third-party service providers (e.g., laboratory services, pharmacy partners, telehealth platform providers, payment processors) who assist in delivering our services. These parties are bound by Business Associate Agreements (BAAs).</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority, or to protect the rights, property, or safety of MedMethod Direct, our patients, or others.</li>
              <li><strong>With Your Consent:</strong> For any other purpose with your explicit written authorization.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website uses cookies and similar tracking technologies to analyze website traffic, improve user experience, and support marketing efforts. You may disable cookies through your browser settings; however, some features of our website may not function properly without them. We use analytics services (such as Google Analytics) that may collect anonymized usage data. We do not use tracking technologies to collect or transmit your Protected Health Information.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement administrative, technical, and physical safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. Our telehealth platform uses encrypted communications. However, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use strong passwords and to contact us immediately if you suspect unauthorized access to your account.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Depending on your state of residence, you may have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Access and receive a copy of your personal information and medical records.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information (subject to legal and regulatory retention requirements).</li>
              <li>Opt out of marketing communications at any time by clicking "unsubscribe" in any email or contacting us directly.</li>
              <li>File a complaint with the U.S. Department of Health and Human Services (HHS) Office for Civil Rights if you believe your HIPAA rights have been violated.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              To exercise any of these rights, please contact us at the information provided in Section 10 below.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our services are intended for adults aged 18 and older. We do not knowingly collect personal information from individuals under the age of 18. If we become aware that we have inadvertently collected information from a minor, we will promptly delete it.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>9. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of our website or services after changes are posted constitutes your acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>MedMethod Direct</p>
              <p className="text-gray-600 text-sm mb-1">[BUSINESS ADDRESS — TO BE COMPLETED]</p>
              <p className="text-gray-600 text-sm mb-1">Email: <a href="mailto:privacy@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>privacy@medmethoddirect.com</a></p>
              <p className="text-gray-600 text-sm">Phone: [PHONE NUMBER — TO BE COMPLETED]</p>
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
