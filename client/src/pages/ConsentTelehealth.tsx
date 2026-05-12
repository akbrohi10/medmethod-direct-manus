/* =============================================================================
   Consent to Telehealth — MedMethod Direct
   Required by many state telehealth laws; best practice for LegitScript
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function ConsentTelehealth() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Consent to Telehealth | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Consent to Telehealth — understand your rights and the nature of virtual medical care before your consultation." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Consent to Telehealth</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              This document describes the nature of telehealth services provided by MedMethod Direct and your rights as a patient. By scheduling a consultation or enrolling in a MedMethod Direct program, you acknowledge that you have read, understood, and agree to the terms described below.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>What is Telehealth?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Telehealth involves the delivery of healthcare services using electronic communications, including video conferencing, secure messaging, and digital health platforms. MedMethod Direct provides all consultations, follow-up visits, and ongoing care via telehealth. You will not be seen in person as part of our standard care model.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Benefits of Telehealth</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Convenient access to physician-led care from your home or any private location.</li>
              <li>Elimination of travel time and waiting room delays.</li>
              <li>Access to specialized care that may not be available locally.</li>
              <li>Continuity of care through secure digital communication.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Limitations and Risks of Telehealth</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You understand and acknowledge that telehealth has certain limitations, including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>The inability to perform a physical examination, which may limit the information available to your physician.</li>
              <li>Technical difficulties, including internet connectivity issues, that may interrupt or delay care.</li>
              <li>Security risks inherent in electronic communications, despite our use of encrypted platforms.</li>
              <li>Telehealth is not appropriate for medical emergencies. In the event of an emergency, call 911 or go to your nearest emergency room immediately.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Patient-Provider Relationship</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A valid patient-provider relationship is established through your initial consultation with a MedMethod Direct physician. No prescription medication will be issued without this evaluation. Your physician will review your medical history, symptoms, and lab results before making any clinical recommendations or prescribing any treatment.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Lab Work</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Comprehensive lab work is a required part of the MedMethod Direct intake process. We will provide you with a lab order that you can complete at a local lab near you. Lab results are reviewed by your physician prior to initiating treatment. Ongoing lab monitoring may be required throughout your program.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Privacy and Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All telehealth consultations are conducted over HIPAA-compliant, encrypted platforms. Your health information is protected in accordance with our <a href="/hipaa-notice" className="underline" style={{ color: "#E8339E" }}>HIPAA Notice of Privacy Practices</a> and <a href="/privacy-policy" className="underline" style={{ color: "#E8339E" }}>Privacy Policy</a>. You are responsible for ensuring that you are in a private location during your consultation and that your device is secure.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Your Rights</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>You have the right to withdraw your consent to telehealth at any time without affecting your right to future care.</li>
              <li>You have the right to request an alternative to telehealth if available and appropriate.</li>
              <li>You have the right to ask questions about your care at any time.</li>
              <li>You have the right to access your medical records as described in our HIPAA Notice of Privacy Practices.</li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>State-Specific Disclosures</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Telehealth regulations vary by state. MedMethod Direct complies with all applicable state telehealth laws in the states where we are licensed. Specific state disclosures may be provided to you at the time of your consultation based on your state of residence.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>MedMethod Direct</p>
              <p className="text-gray-600 text-sm mb-1">[BUSINESS ADDRESS — TO BE COMPLETED]</p>
              <p className="text-gray-600 text-sm mb-1">Email: <a href="mailto:care@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>care@medmethoddirect.com</a></p>
              <p className="text-gray-600 text-sm">Phone: [PHONE NUMBER — TO BE COMPLETED]</p>
            </div>

            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mt-10">
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <strong className="text-gray-700">Emergency Disclaimer:</strong> MedMethod Direct does not provide emergency medical services. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately.
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
