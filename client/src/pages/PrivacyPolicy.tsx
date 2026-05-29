/* =============================================================================
   Privacy Policy — MedMethod Direct
   Publication-ready content from MMD_Website_Compliance_Final_v3.docx
   Effective Date: May 14, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function PrivacyPolicy() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Privacy Policy — how we collect, use, and protect your personal information." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: May 14, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              This Privacy Policy explains how Med Method Direct Management LLC collects, uses, and protects your personal information when you visit medmethoddirect.com or interact with us online. This Policy covers general website visitors and non-clinical personal information. Your health and medical information as a patient is separately governed by our <a href="/hipaa-notice" className="underline" style={{ color: "#E8339E" }}>Notice of Privacy Practices</a>.
            </p>

            {/* 1. Information We Collect */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. Information We Collect</h2>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Information You Give Us</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Your name, email address, and phone number when you submit an inquiry, sign up for communications, or create an account.</li>
              <li>Your payment information (processed securely through our payment processor — we do not store full card numbers).</li>
              <li>Any general questions or messages you send through our contact form.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Do not send health information, diagnoses, medications, or symptoms through general website contact forms.</strong> Health information belongs in your secure patient portal after enrollment.
            </p>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Log data:</strong> your IP address, browser type, the pages you visit, and the time and date of your visit.</li>
              <li><strong>Device data:</strong> your device type, operating system, and screen resolution.</li>
              <li><strong>Navigation data:</strong> how you move through the website and which pages you spend time on.</li>
              <li>Cookies and similar technologies, described in Section 4 below.</li>
            </ul>

            {/* 2. How We Use Your Information */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>To respond to your questions and communicate about our services.</li>
              <li>To schedule consultations and process enrollment.</li>
              <li>To send you marketing emails about our services (you can unsubscribe at any time).</li>
              <li>To improve our website and understand how visitors use it.</li>
              <li>To detect and prevent fraud or unauthorized activity.</li>
              <li>To comply with applicable law.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6 font-semibold">
              We do not sell your personal information. We never have and we never will.
            </p>

            {/* 3. How We Share Your Information */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>With service providers</strong> who help us operate our business — including our email platform, scheduling system, and customer relationship management tools. These providers are contractually required to protect your information and use it only for the services they provide to us.</li>
              <li><strong>With healthcare technology vendors</strong> who have signed HIPAA Business Associate Agreements with us, where applicable.</li>
              <li><strong>When required by law</strong> — for example, in response to a court order, subpoena, or government request.</li>
              <li><strong>In connection with a business transaction</strong> such as a merger or acquisition. If that happens, we will notify you before your information is transferred.</li>
              <li><strong>With your explicit consent</strong>, for any other purpose.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              That is the complete list. We do not share your information with data brokers, advertisers, or third parties for their own marketing purposes.
            </p>

            {/* 4. Cookies and Tracking */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar technologies to make our website work well and to understand how visitors use it. You can adjust your browser settings to refuse cookies, though some parts of the site may not function properly without them.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We take a conservative approach to advertising tracking because we operate in healthcare. We do not place advertising pixels — including Meta Pixel or Google Analytics advertising features — on any page where you enter or may enter health information. This includes intake questionnaires, health history forms, and any page that references specific health conditions or medications. We do this because your health information is private, and it belongs to you — not to advertising platforms.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              On general marketing pages of our website, we may use analytics tools configured to minimize data collection. We do not use these tools to build advertising profiles based on your health interests.
            </p>

            {/* 5. Data Security */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We take security seriously. We use encryption, access controls, and HIPAA-compliant platforms to protect your information. Your patient health data is stored in a HIPAA-compliant electronic health records system with strict access restrictions. All telehealth communications use end-to-end encryption.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              No system is 100% secure. If a breach occurs that affects your personal information, we will notify you in accordance with applicable law.
            </p>

            {/* 6. Children's Privacy */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website and services are for adults only. We do not knowingly collect information from anyone under 18. If you believe we have accidentally collected information from a minor, contact us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> and we will delete it promptly.
            </p>

            {/* 7. Your California Privacy Rights (CCPA) */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>7. Your California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">If you are a California resident, the California Consumer Privacy Act gives you the following rights:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>The right to know what personal information we have collected about you and how we use it.</li>
              <li>The right to request that we delete your personal information, subject to certain legal exceptions.</li>
              <li>The right to opt out of the sale of your personal information. We do not sell personal information, so there is nothing to opt out of.</li>
              <li>The right not to be discriminated against for exercising any of these rights.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              To exercise any of these rights, email us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a>. We will respond to verified requests within 45 days.
            </p>

            {/* 8. Data Retention */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We keep your personal information for as long as necessary to provide our services, comply with legal obligations, and resolve disputes. Patient medical records are retained in accordance with applicable state medical records laws and HIPAA requirements — generally a minimum of seven years in Florida.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you cancel your subscription, we will retain your account information and medical records as required by law, but we will stop using your personal information for marketing purposes.
            </p>

            {/* 9. Third-Party Links */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>9. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website may include links to other websites. We are not responsible for the privacy practices of those sites. When you leave medmethoddirect.com, this Privacy Policy no longer applies. We encourage you to check the privacy policy of any site you visit.
            </p>

            {/* 10. Changes to This Policy */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy when our practices change or when law requires it. When we do, we will post the updated version at medmethoddirect.com/privacy with an updated effective date. Your continued use of the website after the update takes effect means you accept the revised Policy.
            </p>

            {/* 11. Contact */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>11. Contact</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Privacy Officer: Muhssin El-Yacoubi</p>
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
