/* =============================================================================
   Shipping Policy — MedMethod Direct
   Website-ready content supplied in Med_Method_Direct_Shipping_Policy1.pdf
   Effective Date: August 25, 2026
   ============================================================================= */
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

export default function ShippingPolicy() {
  const [consultOpen, setConsultOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shipping Policy | MedMethod Direct</title>
        <meta
          name="description"
          content="MedMethod Direct Shipping Policy for prescription medications and related supplies."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar onConsultClick={() => setConsultOpen(true)} />

      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#E8339E", fontFamily: "Montserrat, sans-serif" }}
            >
              Legal
            </p>
            <h1
              className="text-3xl lg:text-4xl font-black text-gray-900 mb-3"
              style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
            >
              Shipping Policy
            </h1>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Effective Date: August 25, 2026
            </p>
          </div>

          <div
            className="prose prose-gray max-w-none"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mb-8">
              <p className="text-gray-700 leading-relaxed font-semibold">
                <strong>Final sale:</strong> All prescription medication orders, shipping charges,
                and pharmacy-related fees are final and non-refundable once the order has been
                submitted to the dispensing pharmacy, except when a replacement or other
                resolution is approved for a verified fulfillment or shipping issue.
              </p>
            </div>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              1. Pharmacy Fulfillment
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Prescription medications are prepared, dispensed, packaged, and shipped directly by
              licensed partner pharmacies. Med Method Direct does not control pharmacy processing
              times or carrier operations and cannot guarantee a specific delivery date.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              2. Processing and Delivery Estimates
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Processing and transit times are estimates and vary by medication, pharmacy,
              destination, carrier service, order volume, weekends, holidays, weather, and other
              circumstances. Processing begins only after the prescription is clinically approved,
              payment is received, and the dispensing pharmacy has all required information.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              3. Shipping Charges
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Shipping charges are disclosed before payment and may vary by pharmacy, destination,
              package type, and service level. Shipping charges are final once the order is
              submitted to the pharmacy. Expedited shipping shortens carrier transit time only; it
              does not guarantee same-day pharmacy processing or a specific delivery date.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              4. Delivery Address and Availability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Patients are responsible for providing a complete and accurate shipping address,
              confirming that the pharmacy can ship to that location, monitoring tracking, and
              arranging prompt receipt of the package.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>
                Address changes must be requested before the order is submitted to the pharmacy
                and are not guaranteed after submission.
              </li>
              <li>
                Med Method Direct and the dispensing pharmacy are not responsible for delays,
                loss, or damage caused by an incorrect or incomplete address supplied by the
                patient.
              </li>
              <li>
                If a package is returned, refused, unclaimed, or requires reshipment for reasons
                attributable to the patient, additional medication and shipping charges may apply,
                subject to pharmacy and prescriber approval.
              </li>
            </ul>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              5. Tracking and Carrier Delays
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When tracking is available, it may be sent by the pharmacy or carrier. Patients
              should monitor tracking and contact Med Method Direct promptly if the shipment
              appears delayed, lost, or misdelivered. Carrier scans and estimated delivery dates
              may change. Delays caused by carriers, weather, natural disasters, holidays, supply
              disruptions, or other events outside our control do not automatically qualify for a
              refund.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              6. Temperature-Sensitive Medications
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Some medications require temperature-controlled or insulated packaging. Packaging,
              cooling materials, and shipping methods are selected by the dispensing pharmacy. A
              package that arrives warm, or with melted cooling materials, is not automatically
              unusable. Do not discard the medication. Follow the pharmacy label and storage
              instructions, place the medication in the appropriate storage conditions, and
              contact Med Method Direct promptly for pharmacy review before using the product if
              you have concerns.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              7. Damaged, Incorrect, Missing, or Compromised Shipments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Report a suspected shipping or fulfillment issue within 24 hours of delivery, or
              within 24 hours of the carrier marking an undelivered package as delivered. Include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Patient name and order information</li>
              <li>A description of the issue</li>
              <li>Clear photographs of the medication, label, packaging, and shipping box</li>
              <li>The tracking number and any relevant carrier notice</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Keep all medication and packaging until the review is complete. Do not use
              medication that appears incorrect, contaminated, visibly damaged, or otherwise
              unsafe. Med Method Direct will coordinate with the dispensing pharmacy and carrier.
              Any replacement, reshipment, credit, or other resolution is determined case by case
              and is subject to pharmacy policy, carrier findings, and clinical review.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              8. Lost, Stolen, or Misdelivered Packages
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A carrier status of “delivered” does not automatically establish pharmacy error.
              Patients should check the delivery location, household members, building staff, and
              nearby areas, then contact the carrier and Med Method Direct promptly. Replacements
              are not guaranteed and may require a carrier investigation, police report,
              additional payment, or a new prescription, depending on the circumstances and
              applicable law.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              9. No Returns, Exchanges, or Routine Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For safety and legal reasons, prescription medications cannot be returned, restocked,
              or exchanged after dispensing or shipment. Refunds are not issued because a patient
              changed their mind, no longer wishes to begin or continue treatment, did not use the
              medication, missed delivery, failed to retrieve the package promptly, or did not
              follow storage or administration instructions.
            </p>

            <h2 className="text-xl font-black text-gray-900 mt-10 mb-4">
              10. Questions and Contact
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Review your medication, price, shipping method, address, and expected fulfillment
              process before payment. For questions or to report an issue, contact Med Method
              Direct through the secure patient portal or the contact information listed on our
              website.
            </p>
          </div>
        </div>
      </main>

      <Footer onConsultClick={() => setConsultOpen(true)} />
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
