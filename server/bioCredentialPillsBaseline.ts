export const BIO_PATH = "client/src/components/masterclass3/Masterclass3FullBio.tsx";
export const HOME_OLD_SELECTION = '  const credentialPills = showMscpCredential\n    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]\n    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];';
export const HOME_NEW_SELECTION = '  const credentialPills = showHomeDualCredentials\n    ? [firstCredentialLabel, "Menopause Certified (MSCP)", "Board-certified in Obesity Medicine (ABOM)",\n      ...CREDENTIAL_PILLS.slice(1).map(pill => pill === "Licensed in 12 states" ? "Licensed in 20 states" : pill)]\n    : showMscpCredential\n    ? [firstCredentialLabel, "Menopause Certified (MSCP)", ...CREDENTIAL_PILLS.slice(1)]\n    : [firstCredentialLabel, ...CREDENTIAL_PILLS.slice(1)];';
export const ABOM_PILL = '  "Board-certified in Obesity Medicine (ABOM)",\n';
export const LICENSE_PILL = '  "Licensed in 20 states",\n';
export const ADAPTER_IMPORT = 'import { beforeBioCredentialPills } from "./bioCredentialPillsBaseline";\n';
export const HOME_TEST_OLD_INVENTORY = '    const changed = execFileSync("git", ["diff", "--name-only", "39e1a5ab", "--", "client"], { cwd: root, encoding: "utf8" }).split("\\n");';
export const HOME_TEST_NEW_INVENTORY = '    const changed = execFileSync("git", ["diff", "--name-only", "39e1a5ab", "--", "client"], { cwd: root, encoding: "utf8" }).split("\\n").filter(p => p !== "client/src/components/masterclass3/Masterclass3FullBio.tsx" || read(p) !== old(p));';
function once(source:string, newer:string, older="") { if(source.split(newer).length!==2) throw new Error("Bio pill inverse requires each exact approved change once");return source.replace(newer,older); }
export function beforeBioCredentialPills(path:string,source:string):string {
  if(path==="client/src/components/home1/MedicalTeam.tsx" && source.includes("const credentialPills = showHomeDualCredentials")) return once(source,HOME_NEW_SELECTION,HOME_OLD_SELECTION);
  if(path===BIO_PATH && (source.includes(ABOM_PILL.trim())||source.includes(LICENSE_PILL.trim()))) return once(once(source,ABOM_PILL),LICENSE_PILL);
  if(path==="server/homeDualCredentialsBaseline.ts" && source.includes(ADAPTER_IMPORT)) return once(once(source,ADAPTER_IMPORT),'  source = beforeBioCredentialPills(path, source);\n');
  if(path==="server/homeDualCredentials.test.ts" && source.includes(ADAPTER_IMPORT)) {
    source=once(source,ADAPTER_IMPORT);
    source=once(source,'const read = (p: string) => beforeBioCredentialPills(p, readFileSync(new URL(p, root), "utf8"));','const read = (p: string) => readFileSync(new URL(p, root), "utf8");');
    return once(source,HOME_TEST_NEW_INVENTORY,HOME_TEST_OLD_INVENTORY);
  }
  return source;
}
