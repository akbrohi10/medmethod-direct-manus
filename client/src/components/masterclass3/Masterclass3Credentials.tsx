// V3-local physician credentials; official badges remain unaltered.
export default function Masterclass3Credentials() {
  return (
    <div data-masterclass3-credentials aria-label="Physician certifications" className="mx-auto mt-5 grid max-w-[740px] gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
      <div data-masterclass3-abom className="flex flex-col items-center rounded-2xl border border-[#e7d6df] bg-white px-5 py-4 text-center shadow-[0_5px_16px_rgba(89,31,84,0.05)]">
        <div className="flex h-24 w-full items-center justify-center">
          <img src="/manus-storage/abom-diplomate-v3_d049b68f.webp" alt="American Board of Obesity Medicine certified diplomate badge" width={900} height={232} loading="lazy" decoding="async" className="h-auto max-h-24 w-full max-w-[280px] object-contain" />
        </div>
        <p className="mt-3 max-w-[300px] text-[15px] font-bold leading-relaxed text-[#432943] sm:text-base">Board-certified in Obesity Medicine (ABOM)</p>
      </div>
      <div data-masterclass3-mscp className="flex flex-col items-center rounded-2xl border border-[#e7d6df] bg-white px-5 py-4 text-center shadow-[0_5px_16px_rgba(89,31,84,0.05)]">
        <div className="flex h-24 w-full items-center justify-center">
          <img src="/manus-storage/mscp-badge-2026_09c3feaa.webp" alt="2026 Menopause Society Certified Practitioner badge" width={256} height={256} loading="lazy" decoding="async" className="h-[88px] w-[88px] object-contain" />
        </div>
        <p className="mt-3 max-w-[300px] text-[15px] font-bold leading-relaxed text-[#432943] sm:text-base">Menopause Society Certified Practitioner (MSCP)</p>
      </div>
    </div>
  );
}
