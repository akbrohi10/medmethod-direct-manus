export const PATIENT_EMPHASIS = '<span className="font-black text-[#7a1e7e]">50,000+ patients</span>';

export function beforeMasterclass3PatientEmphasis(path: string, source: string): string {
  if (path !== "client/src/pages/Masterclass3.tsx" || !source.includes('Dr. Jumana Al-Deek, DO · Board-certified family physician · ' + PATIENT_EMPHASIS + ' seen')) return source;
  if (source.split(PATIENT_EMPHASIS).length !== 2) throw new Error("V3 patient emphasis inverse requires exactly one original-style span");
  return source.replace(PATIENT_EMPHASIS, "50,000+ patients");
}
