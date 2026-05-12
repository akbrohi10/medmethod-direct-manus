/* =============================================================================
   Terms of Service — MedMethod Direct
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function TermsOfService() {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title>Terms of Service | MedMethod Direct</title>
        <meta name="description" content="MedMethod Direct Terms of Service — the terms and conditions governing your use of our website and telehealth services." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar onConsultClick={() => setConsultOpen(true)} />
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}>Legal</p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>Terms of Service</h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: "Montserrat, sans-serif" }}>

            <p className="text-gray-700 leading-relaxed mb-6">
              Please read these Terms of Service ("Terms") carefully before using the MedMethod Direct website or telehealth services. By accessing our website at <strong>medmethoddirect.com</strong> or enrolling in our services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>1. Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct provides virtual telehealth medical services including, but not limited to, hormone replacement therapy, medical weight loss (including GLP-1 therapy), perimenopause and menopause management, thyroid optimization, and longevity medicine. All medical services are provided by licensed physicians and healthcare professionals. Our services are available only in states where we hold active medical licenses. A current list of licensed states is available at <a href="/locations" className="underline" style={{ color: "#E8339E" }}>/locations</a>.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You must be at least 18 years of age and a resident of a state in which MedMethod Direct is licensed to practice medicine to use our services. By using our services, you represent and warrant that you meet these eligibility requirements. We reserve the right to refuse service to anyone who does not meet these requirements.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>3. Patient-Provider Relationship and Prescription Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A valid patient-provider relationship must be established before any prescription medication can be issued. This relationship is formed through a proper medical evaluation conducted by a licensed MedMethod Direct physician. No prescription will be issued solely on the basis of an online questionnaire or intake form. All prescriptions are issued at the sole discretion of the treating physician based on clinical judgment and applicable state law.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct does not guarantee that any specific medication, treatment, or outcome will be prescribed or achieved. Treatment plans are individualized and subject to change based on your clinical needs and physician assessment.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>4. Program Commitment and Cancellation</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All MedMethod Direct programs require a commitment period of either six (6) or twelve (12) months, as specified at the time of enrollment. This commitment reflects the clinical reality that hormone optimization and medical weight loss require sustained, physician-supervised treatment to achieve meaningful and lasting results. Early cancellation terms are outlined in your enrollment agreement. Please review your program agreement carefully before enrolling.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>5. Payment and Insurance</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct does not accept insurance for program fees. Payment is due as outlined in your enrollment agreement. We can prescribe brand-name medications (such as Ozempic®, Wegovy®, Mounjaro®, or Zepbound®) to your local pharmacy so you may attempt to use your insurance benefits; however, we do not guarantee insurance coverage or approval. If your insurance requires a prior authorization, we can complete one for an additional fee, but we do not handle appeals if the prior authorization is denied.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>6. Not a Pharmacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct is a telehealth medical practice, not a pharmacy. We do not dispense medications directly. Medications are either prescribed to a licensed pharmacy of your choice or, where applicable, shipped from a licensed 503B outsourcing facility. For the Mentorship Program, medications are prescribed to your local pharmacy.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>7. No Emergency Services</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MedMethod Direct does not provide emergency medical services. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. Our telehealth services are not a substitute for in-person emergency care.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To the fullest extent permitted by applicable law, MedMethod Direct, its physicians, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability to you for any claim arising from these Terms or your use of our services shall not exceed the amount you paid to us in the three (3) months preceding the claim.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All content on this website, including text, graphics, logos, images, and software, is the property of MedMethod Direct and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this site without our express written permission.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the state in which MedMethod Direct's principal place of business is located, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>11. Changes to These Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to modify these Terms at any time. Material changes will be communicated by updating the "Last Updated" date above. Continued use of our website or services after changes are posted constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>12. Contact</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>MedMethod Direct</p>
              <p className="text-gray-600 text-sm mb-1">[BUSINESS ADDRESS — TO BE COMPLETED]</p>
              <p className="text-gray-600 text-sm mb-1">Email: <a href="mailto:legal@medmethoddirect.com" className="underline" style={{ color: "#E8339E" }}>legal@medmethoddirect.com</a></p>
              <p className="text-gray-600 text-sm">Phone: [PHONE NUMBER — TO BE COMPLETED]</p>
            </div>

            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mt-10">
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <strong className="text-gray-700">Medical Disclaimer:</strong> The information on this website is for educational purposes only and does not constitute medical advice. All prescriptions are issued only after a valid patient-provider relationship has been established through a proper medical evaluation. Individual results may vary.
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
