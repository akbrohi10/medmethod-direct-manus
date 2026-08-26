interface ComplianceDisclosuresProps {
  compounded?: boolean;
  testosteroneForWomen?: boolean;
}

export default function ComplianceDisclosures({
  compounded = false,
  testosteroneForWomen = false,
}: ComplianceDisclosuresProps) {
  if (!compounded && !testosteroneForWomen) return null;

  return (
    <section className="bg-white py-8" aria-label="Medication disclosures">
      <div className="mx-auto max-w-[1100px] px-4 lg:px-8">
        <div className="rounded-2xl border border-[#E8D7E5] bg-[#FFF9FC] p-5 sm:p-6">
          <h2
            className="mb-3 text-base font-bold text-[#222]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Medication Disclosures
          </h2>

          <div
            className="space-y-3 text-sm leading-7 text-[#444] sm:text-base"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {compounded && (
              <p>
                Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.
              </p>
            )}

            {testosteroneForWomen && (
              <p>
                Testosterone is prescribed off-label for hypoactive sexual desire disorder in women. There is no FDA-approved testosterone product for women in the United States. This treatment is available only to patients in Florida.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
