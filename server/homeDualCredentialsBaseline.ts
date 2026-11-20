import { beforeBioCredentialPills } from "./bioCredentialPillsBaseline";
type Edit = { old: string; new: string };
export const HOME_DUAL_CREDENTIAL_EDITS: Record<string, Edit[]> = {
  "client/src/pages/HomeHrt3.tsx": [{ old: "", new: "          showHomeDualCredentials\n" }],
  "client/src/components/home1/MedicalTeam.tsx": [
    { old: "", new: 'import HomeCredentialBadges from "./HomeCredentialBadges";\n' },
    { old: "", new: "  showHomeDualCredentials = false,\n" },
    { old: "", new: "  showHomeDualCredentials?: boolean;\n" },
    { old: "", new: '                      ...(showHomeDualCredentials ? [{\n                        org: "American Board of Obesity Medicine",\n                        detail: "Board Certification in Obesity Medicine (ABOM Diplomate)",\n                      }] : []),\n' },
    { old: "              {mscpBadgeSrc && (\n", new: "              {showHomeDualCredentials ? (\n                <HomeCredentialBadges mscpBadgeSrc={mscpBadgeSrc} mscpBadgeFallbackSrc={mscpBadgeFallbackSrc} />\n              ) : (mscpBadgeSrc && (\n" },
    { old: "              )}\n\n              {/* Two clear booking paths.", new: "              ))}\n\n              {/* Two clear booking paths." },
  ],
  "server/masterclass3CredentialsBaseline.ts": [
    { old: "", new: 'import { beforeHomeDualCredentials } from "./homeDualCredentialsBaseline";\n' },
    { old: "", new: "  source = beforeHomeDualCredentials(path, source);\n" },
  ],
  "server/masterclass3Credentials.test.ts": [
    { old: "", new: 'import { beforeHomeDualCredentials } from "./homeDualCredentialsBaseline";\n' },
    { old: 'const read = (p: string) => readFileSync(new URL(p, root), "utf8");', new: 'const read = (p: string) => beforeHomeDualCredentials(p, readFileSync(new URL(p, root), "utf8"));' },
  ],
};
export function beforeHomeDualCredentials(path: string, source: string): string {
  source = beforeBioCredentialPills(path, source);
  const edits = HOME_DUAL_CREDENTIAL_EDITS[path];
  if (!edits || !edits.some(e => source.includes(e.new))) return source;
  for (const e of [...edits].reverse()) {
    if (source.split(e.new).length !== 2) throw new Error(`Homepage credential inverse requires each exact approved fragment once: ${path}`);
    source = source.replace(e.new, e.old);
  }
  return source;
}
