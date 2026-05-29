/* =============================================================================
   Accessibility Statement — MedMethod Direct
   Publication-ready content from MMD_Website_Compliance_Final_v3.docx
   Last reviewed: May 14, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function Accessibility() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Accessibility Statement — our commitment to making our website accessible to everyone." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Accessibility</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Accessibility Statement</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Last reviewed: May 14, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              Med Method Direct is committed to making our website and services accessible to everyone, including people with disabilities. We believe that access to healthcare information should not depend on ability, and we take this commitment seriously.
            </p>

            {/* 1 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. Our Standard</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are actively working to ensure that medmethoddirect.com meets the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These are the internationally recognized standards for web accessibility, developed by the World Wide Web Consortium (W3C). WCAG 2.1 Level AA addresses a broad range of barriers for people with visual, auditory, physical, speech, cognitive, language, and learning disabilities.
            </p>

            {/* 2 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. What We Are Doing</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Auditing our website regularly against WCAG 2.1 Level AA standards.</li>
              <li>Testing our website with screen readers and other assistive technologies to identify barriers.</li>
              <li>Providing text alternatives for all non-text content including images and icons.</li>
              <li>Ensuring our website can be navigated fully by keyboard, without requiring a mouse.</li>
              <li>Maintaining sufficient color contrast throughout the website to support users with low vision.</li>
              <li>Structuring our content with clear headings and logical reading order.</li>
              <li>Adding captions and transcripts to any video or audio content we publish.</li>
              <li>Training our team on accessibility best practices as we build and update the website.</li>
            </ul>

            {/* 3 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. Known Limitations</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are a new platform and we are honest that not every part of our website currently meets WCAG 2.1 Level AA. We are actively identifying and addressing accessibility gaps as a priority. If you encounter a specific barrier while using our website, please let us know — your feedback is the most effective way to help us find and fix problems quickly.
            </p>

            {/* 4 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. How to Report an Accessibility Issue</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you encounter any accessibility barrier on our website — a page that is hard to navigate, content that a screen reader cannot interpret, or any other difficulty — please tell us. We want to know.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="text-gray-600 text-sm mb-2"><strong className="text-gray-900">Email:</strong> <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> — include a description of the barrier and the URL of the page where you encountered it.</p>
              <p className="text-gray-600 text-sm mb-2"><strong className="text-gray-900">Phone:</strong> <a href="tel:5615944949" className="underline" style={{ color: "#E8339E" }}>561-594-4949</a></p>
              <p className="text-gray-600 text-sm"><strong className="text-gray-900">Mail:</strong> 7901 4th St N STE 300, St. Petersburg, FL 33702</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              We will respond to every accessibility report within 2 business days. We take these reports seriously and we act on them.
            </p>

            {/* 5 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Alternative Access</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you are unable to access any content or complete any process on our website due to a disability, contact us at <a href="mailto:info@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>info@medmethoddirect.com</a> or call <a href="tel:5615944949" className="underline" style={{ color: "#E8339E" }}>561-594-4949</a>. We will provide you with the information or assistance you need through an alternative means — by phone, email, or another method that works for you. We will not ask you to wait an unreasonable amount of time or navigate an inaccessible process.
            </p>

            {/* 6 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. ADA Enforcement</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This statement is made in good faith under the Americans with Disabilities Act and Section 508 of the Rehabilitation Act. If you are not satisfied with our response to an accessibility concern, you may contact the U.S. Department of Justice, Civil Rights Division at <a href="https://www.ada.gov" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#E8339E" }}>www.ada.gov</a> for further guidance and assistance.
            </p>

            {/* 7 */}
            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>7. We Are Committed to Improving</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Accessibility is not a one-time project — it is an ongoing commitment. We review this statement annually and update it whenever we make significant changes to the website or our accessibility approach. Our goal is full WCAG 2.1 Level AA conformance across all pages and all patient-facing tools.
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
