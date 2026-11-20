export const FULL_BIO_IMPORT = 'import Masterclass3FullBio from "@/components/masterclass3/Masterclass3FullBio";\n';
export const FULL_BIO_MOUNT = '        <Masterclass3FullBio onBookVisit={() => setConsultationOpen(true)} />\n';
const helperImport = 'import { beforeMasterclass3FullBio } from "./masterclass3FullBioBaseline";\n';
const readers: Record<string, { old: string; new: string }> = {};
for (const [path, parameter] of [
  ["server/masterclass3Page.test.ts", "path"],
  ["server/masterclass3BookingActions.test.ts", "path"],
  ["server/masterclass3SingleBooking.test.ts", "p"],
  ["server/masterclass3LearningLabel.test.ts", "p"],
]) {
  readers[path] = {
    old: `const read = (${parameter}: string) => readFileSync(new URL(${parameter}, root), "utf8");`,
    new: `const read = (${parameter}: string) => beforeMasterclass3FullBio(${parameter}, readFileSync(new URL(${parameter}, root), "utf8"));`,
  };
}
function uniqueRemove(source: string, fragment: string) {
  if (source.split(fragment).length !== 2) throw new Error("V3 full-bio inverse requires one exact addition");
  return source.replace(fragment, "");
}
export function beforeMasterclass3FullBio(path: string, source: string): string {
  if (path === "client/src/pages/Masterclass3.tsx") {
    return uniqueRemove(uniqueRemove(source, FULL_BIO_IMPORT), FULL_BIO_MOUNT);
  }
  if (readers[path]) {
    const { old, new: replacement } = readers[path];
    const restored = uniqueRemove(source, helperImport);
    if (restored.split(replacement).length !== 2) throw new Error("V3 historical reader inverse requires one exact line");
    return restored.replace(replacement, old);
  }
  return source;
}
