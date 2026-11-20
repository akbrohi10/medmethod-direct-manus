import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeBioCredentialPills, BIO_PATH, HOME_NEW_SELECTION, HOME_OLD_SELECTION, ABOM_PILL, LICENSE_PILL } from "./bioCredentialPillsBaseline";
const root = new URL("../",import.meta.url),teamPath="client/src/components/home1/MedicalTeam.tsx";
const read=(p:string)=>readFileSync(new URL(p,root),"utf8");
const old=(p:string)=>execFileSync("git",["show",`b7c5642b:${p}`],{cwd:root,encoding:"utf8"});
const require=createRequire(import.meta.url);
function load(source:string):React.ComponentType<any> {
 const module:{exports:any}={exports:{}};
 const req=(name:string)=>name==="./HomeCredentialBadges"?{__esModule:true,default:load(read("client/src/components/home1/HomeCredentialBadges.tsx"))}:name==="@/components/ui/accordion"?Object.fromEntries(["Accordion","AccordionItem","AccordionTrigger","AccordionContent"].map(k=>[k,({children}:any)=>React.createElement("div",null,children)])):require(name);
 new Function("require","module","exports",transformSync(source,{loader:"tsx",format:"cjs",jsx:"automatic"}).code)(req,module,module.exports);return module.exports.default;
}
const render=(s:string,props:any={})=>renderToStaticMarkup(React.createElement(load(s),props));
const pills=(html:string)=>[...html.matchAll(/<span class="px-4 py-1\.5 rounded-full text-sm font-semibold[^\"]*"[^>]*>([^<]+)<\/span>/g)].map(m=>m[1]);
const ABOM="Board-certified in Obesity Medicine (ABOM)",LICENSE="Licensed in 20 states";
describe("Homepage and V3 full-bio ABOM/20-state credential pills only",()=>{
 it("reconstructs both whole production sources with only the exact approved pill changes",()=>{
  expect(beforeBioCredentialPills(teamPath,read(teamPath))).toBe(old(teamPath));
  expect(beforeBioCredentialPills(BIO_PATH,read(BIO_PATH))).toBe(old(BIO_PATH));
  expect(read(teamPath).split(HOME_NEW_SELECTION)).toHaveLength(2);
  expect(read(BIO_PATH).split(ABOM_PILL)).toHaveLength(2);expect(read(BIO_PATH).split(LICENSE_PILL)).toHaveLength(2);
 });
 it("renders homepage ABOM as the third credential pill and replaces only its licensed-state pill",()=>{
  const p=pills(render(read(teamPath),{showHomeDualCredentials:true,showMscpCredential:true,firstCredentialLabel:"Family Physician"}));
  expect(p[0]).toBe("Family Physician");expect(p[1]).toBe("Menopause Certified (MSCP)");expect(p[2]).toBe(ABOM);
  expect(p.filter(v=>v===ABOM)).toHaveLength(1);expect(p.filter(v=>v===LICENSE)).toHaveLength(1);expect(p).not.toContain("Licensed in 12 states");
 });
 it("renders both new V3 pills without changing the existing credentials or their order",()=>{
  const p=pills(render(read(BIO_PATH),{onBookVisit:()=>{}})),before=pills(render(old(BIO_PATH),{onBookVisit:()=>{}}));
  expect(p[2]).toBe(ABOM);expect(p.at(-1)).toBe(LICENSE);
  expect(p.filter(v=>v!==ABOM&&v!==LICENSE)).toEqual(before);
  expect(p.filter(v=>v===ABOM)).toHaveLength(1);expect(p.filter(v=>v===LICENSE)).toHaveLength(1);
 });
 it("preserves other shared-component users byte-for-byte, including the original licensed-state pill",()=>{
  for(const props of [{},{showMscpCredential:true,firstCredentialLabel:"Family Physician"},{showHomeDualCredentials:false,secondaryAction:{href:"/care-team-booking",label:"Call"}}])expect(render(read(teamPath),props)).toBe(render(old(teamPath),props));
  expect(read(teamPath)).toContain(HOME_OLD_SELECTION.slice(HOME_OLD_SELECTION.indexOf('    ? [firstCredentialLabel')));
 });
 it("preserves badges, training entries, booking pages, state lists, hero and all other production paths",()=>{
  const changed=execFileSync("git",["diff","--name-only","b7c5642b","--","client"],{cwd:root,encoding:"utf8"}).split("\n").filter(Boolean).sort();expect(changed).toEqual([BIO_PATH,teamPath].sort());
  for(const p of ["client/src/pages/HomeHrt3.tsx","client/src/pages/Masterclass3.tsx","client/src/pages/Masterclass2.tsx","client/src/pages/MasterclassVideoFirst.tsx","client/src/components/home1/HomeCredentialBadges.tsx","client/src/components/masterclass3/Masterclass3Credentials.tsx","client/src/components/masterclass2/PhysicianProfile.tsx","client/src/App.tsx","client/src/index.css","client/src/components/home1/LpConsultationModal2.tsx"])expect(read(p)).toBe(old(p));
 });
 it("retains both distinct ABOM board certification and OMA training without rewriting them",()=>{
  for(const p of [BIO_PATH,teamPath]){
   expect(read(p)).toContain('org: "American Board of Obesity Medicine"');expect(read(p)).toContain('detail: "Board Certification in Obesity Medicine (ABOM Diplomate)"');
   expect(read(p)).toContain('org: "Obesity Medicine Association"');expect(read(p)).toContain('detail: "Obesity & Metabolic Health Certification"');
  }
 });
 it("preserves all earlier assertions through only the narrow historical-reader/inventory inverses",()=>{
  for(const p of ["server/homeDualCredentialsBaseline.ts","server/homeDualCredentials.test.ts"])expect(beforeBioCredentialPills(p,read(p))).toBe(old(p));
  for(const p of ["server/masterclass3CredentialsBaseline.ts","server/masterclass3Credentials.test.ts","server/masterclass3FullBio.test.ts"])expect(read(p)).toBe(old(p));
 });
 it("rejects duplicates and partial edits rather than masking unrelated changes",()=>{
  expect(()=>beforeBioCredentialPills(BIO_PATH,read(BIO_PATH)+ABOM_PILL)).toThrow();
  expect(()=>beforeBioCredentialPills(BIO_PATH,read(BIO_PATH).replace(LICENSE_PILL,""))).toThrow();
  expect(()=>beforeBioCredentialPills(teamPath,read(teamPath).replace("Licensed in 20 states","Licensed in 99 states"))).toThrow();
  expect(beforeBioCredentialPills(BIO_PATH,read(BIO_PATH)+"\n// unrelated\n")).not.toBe(old(BIO_PATH));
  expect(beforeBioCredentialPills(teamPath,old(teamPath))).toBe(old(teamPath));expect(beforeBioCredentialPills("unrelated",read(BIO_PATH))).toBe(read(BIO_PATH));
 });
});
