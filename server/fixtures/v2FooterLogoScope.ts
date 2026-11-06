import { readFileSync } from "node:fs";
const page="client/src/pages/WeightLossMenopauseV2.tsx";
export const oldV2FooterLogo="<div className=\"footer-wordmark\">MMD Weight Loss</div>";
export const newV2FooterLogo="<div className=\"footer-wordmark\" data-v2-footer-logo style={{ maxWidth: \"550px\" }}><img src=\"/manus-storage/medmethod-logo-navbar_99a2ea82.png\" alt=\"MedMethod Direct\" width=\"1536\" height=\"321\" loading=\"lazy\" decoding=\"async\" style={{ display: \"block\", width: \"240px\", maxWidth: \"100%\", height: \"auto\", margin: \"0 auto\", filter: \"brightness(0) invert(1)\" }} /></div>";
export function inverseV2FooterLogo(path:string,source:string):string {
  if (!String(path).replaceAll("\\","/").endsWith(page)) return source;
  const occurrences=source.split(newV2FooterLogo).length-1;
  if (occurrences===0 && source.includes(oldV2FooterLogo)) return source;
  if (occurrences!==1 || source.includes(oldV2FooterLogo)) throw new Error("Footer logo scope mismatch");
  return source.replace(newV2FooterLogo,oldV2FooterLogo);
}
