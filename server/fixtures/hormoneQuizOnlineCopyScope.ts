// Frozen online-care copy-only inverse. No tests, I/O, network, or production imports.
const before = "<p class=\"report-text-visit-offer\"><strong>Your first text visit is FREE</strong>Includes 7 days of follow-up messaging.</p>";
const after = "<p class=\"report-text-visit-offer\"><strong>Your first text visit is FREE</strong>100% online, by text. Includes 7 days of follow-up messaging.</p>";
export function inverseHormoneQuizOnlineCopy(path: string, source: string): string {
  path = String(path).replaceAll("\\", "/");
  if (!(path === "client/public/hormone-symptom-quiz.html" || path.endsWith("/client/public/hormone-symptom-quiz.html") || path === "dist/public/hormone-symptom-quiz.html" || path.endsWith("/dist/public/hormone-symptom-quiz.html"))) return source;
  if (source.split(before).length === 2 && !source.includes(after)) return source;
  if (source.split(after).length !== 2 || source.includes(before)) throw Error("Quiz online copy scope mismatch");
  return source.replace(after, before);
}
