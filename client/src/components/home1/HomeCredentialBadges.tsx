// Homepage opt-in only. Preserve official badge colors and proportions.
export default function HomeCredentialBadges({
  mscpBadgeSrc = "/manus-storage/mscp-badge-2026_09c3feaa.webp",
  mscpBadgeFallbackSrc,
}: {
  mscpBadgeSrc?: string;
  mscpBadgeFallbackSrc?: string;
}) {
  return (
    <div data-home-dual-credentials className="mt-4 grid w-full gap-4 sm:grid-cols-2 sm:gap-5" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div data-home-credential="mscp" className="flex min-w-0 items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
        <div className="flex h-16 w-[140px] shrink-0 items-center justify-center sm:w-full">
          <img
            src={mscpBadgeSrc}
            alt="2026 Menopause Society Certified Practitioner badge"
            width={256}
            height={256}
            className="h-16 w-16 object-contain"
            decoding="async"
            onError={(event) => {
              const image = event.currentTarget;
              if (mscpBadgeFallbackSrc && image.dataset.fallbackUsed !== "true") {
                image.dataset.fallbackUsed = "true";
                image.src = mscpBadgeFallbackSrc;
              }
            }}
          />
        </div>
        <p className="min-w-0 text-[15px] font-bold leading-snug text-[#7A1E7E] sm:text-base">Menopause Society Certified Practitioner (MSCP)</p>
      </div>
      <div data-home-credential="abom" className="flex min-w-0 items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
        <div className="flex h-16 w-[140px] shrink-0 items-center justify-center sm:w-full">
          <img
            src="/manus-storage/abom-diplomate-v3_d049b68f.webp"
            alt="American Board of Obesity Medicine certified diplomate badge"
            width={900}
            height={232}
            className="h-auto max-h-16 w-full max-w-[190px] object-contain"
            decoding="async"
          />
        </div>
        <p className="min-w-0 text-[15px] font-bold leading-snug text-[#7A1E7E] sm:text-base">Board-certified in Obesity Medicine (ABOM)</p>
      </div>
    </div>
  );
}
