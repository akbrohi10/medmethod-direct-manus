import { beforeHomeDualCredentials } from "./homeDualCredentialsBaseline";
export const CREDENTIAL_IMPORT = 'import Masterclass3Credentials from "@/components/masterclass3/Masterclass3Credentials";\n';
export const CREDENTIAL_MOUNT = '          <Masterclass3Credentials />\n';
export const ABOM_ENTRY = '                    {\n                      org: "American Board of Obesity Medicine",\n                      detail: "Board Certification in Obesity Medicine (ABOM Diplomate)",\n                    },\n';
const ADAPTER_IMPORT = 'import { beforeMasterclass3Credentials } from "./masterclass3CredentialsBaseline";\n';
function once(source: string, text: string): string {
  if (source.split(text).length !== 2) throw new Error("V3 credential inverse requires each exact approved addition once");
  return source.replace(text, "");
}
export function beforeMasterclass3Credentials(path: string, source: string): string {
  source = beforeHomeDualCredentials(path, source);
  if (path === "client/src/pages/Masterclass3.tsx") {
    if (!source.includes("Masterclass3Credentials")) return source;
    return once(once(source, CREDENTIAL_IMPORT), CREDENTIAL_MOUNT);
  }
  if (path === "client/src/components/masterclass3/Masterclass3FullBio.tsx") {
    if (!source.includes("American Board of Obesity Medicine")) return source;
    return once(source, ABOM_ENTRY);
  }
  if (path === "server/masterclass3MagentaHeroBaseline.ts" && source.includes(ADAPTER_IMPORT)) {
    return once(once(source, ADAPTER_IMPORT), "  source = beforeMasterclass3Credentials(path, source);\n");
  }
  if (["server/masterclass3MagentaHero.test.ts", "server/masterclass3Membership.test.ts"].includes(path) && source.includes(ADAPTER_IMPORT)) {
    source = once(source, ADAPTER_IMPORT);
    const newer = 'const read = (p: string) => beforeMasterclass3Credentials(p, readFileSync(new URL(p, root), "utf8"));';
    if (source.split(newer).length !== 2) throw new Error("V3 credential test-reader inverse mismatch");
    return source.replace(newer, 'const read = (p: string) => readFileSync(new URL(p, root), "utf8");');
  }
  return source;
}
