import { beforeMasterclass3PatientEmphasis } from "./masterclass3PatientEmphasisBaseline";
import edits from "./fixtures/masterclass3HeroEdits.json";

export function beforeMasterclass3Hero(path: string, source: string): string {
  source = beforeMasterclass3PatientEmphasis(path, source);
  if (path !== "client/src/pages/Masterclass3.tsx" || !source.includes("text-[clamp(1.125rem,4.8vw,1.25rem)]")) return source;
  for (const edit of [...edits].reverse()) {
    if (source.split(edit.after).length !== 2) throw new Error("V3 hero inverse requires all four exact authorized changes");
    source = source.replace(edit.after, edit.before);
  }
  return source;
}
