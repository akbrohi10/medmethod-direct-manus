import { finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { inverseApprovedGlp1Combined, glp1CombinedFixturePath, glp1CombinedAssetPath } from "./intakeGlp1CombinedScope.test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root=resolve(import.meta.dirname,"..");
const path="client/intake/index.html",fixture="server/fixtures/intakeLatePatientInfoFragments.json";
const old=(p:string)=>execFileSync("git",["show",`0c5f2ca4:${p}`],{cwd:root,encoding:"utf8"});
const source=readFileSync(resolve(root,path),"utf8");
const heading="Almost there — then you can text with Dr. Al-Deek";
const subtitle="Telehealth law requires your consent before a doctor can discuss treatment with you. Signing gives Dr. Al-Deek permission to review your assessment and text with you — then your free visit starts.";
const expected=[{old:"Almost there: sign to connect with Dr. Al-Deek",new:heading,count:1},{old:"Your consent is required before a doctor can review your information and discuss treatment with you. Signing gives Dr. Al-Deek permission to review your answers and text with you.",new:subtitle,count:1}];

describe("Signing screen exact connection heading/subtitle only",()=>{
 it("contains each confirmed line exactly once and removes only the two previous display strings",()=>{for(const f of expected){expect(source.split(f.new)).toHaveLength(2);expect(source).not.toContain(f.old);}expect(source).toContain('question_text:"'+heading+'",helper_text:"'+subtitle+'"');});
 it("preserves every previous59 inverse entries and appends exactly the two approved strings",()=>{const previous=JSON.parse(old(fixture)),current=JSON.parse(readFileSync(resolve(root,fixture),"utf8"));expect(previous).toHaveLength(59);expect(current).toHaveLength(61);expect(current.slice(0,59)).toEqual(previous);expect(current.slice(59)).toEqual(expected);});
 it("restores the complete intake file byte-for-byte to0c5f2ca4 with only the two string inverses",()=>{let restored=inverseApprovedGlp1Combined(path,source);for(const f of [...expected].reverse()){expect(restored.split(f.new).length-1).toBe(1);restored=restored.replace(f.new,f.old);}expect(restored).toBe(old(path));});
 it("keeps all CSS and canonical metadata byte-identical and leaves the manual signing UI/form data unchanged",()=>{expect(inverseApprovedGlp1Combined(path,source).match(/<style>[\s\S]*?<\/style>/g)).toEqual(old(path).match(/<style>[\s\S]*?<\/style>/g));expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)?.[1]).toBe(old(path).match(/routes:JSON\.parse\(`(.*?)`\)/s)?.[1]);const signedPaths=execFileSync("git",["ls-files","client/public/intake/sign-*"],{cwd:root,encoding:"utf8"}).trim().split("\n");expect(signedPaths.length).toBeGreaterThan(0);for(const p of signedPaths)expect(readFileSync(resolve(root,p),"utf8")).toBe(old(p));expect(source).toContain('Sign & continue');});
 it("changes no other production file, backend, page, configuration or dependency",()=>{const changed=execFileSync("git",["diff","--name-only","0c5f2ca4","--","client","server","shared","drizzle","package.json","pnpm-lock.yaml","vite.config.ts"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(p=>p&&!/\.test\.[cm]?[jt]sx?$/.test(p)&&![fixture,glp1CombinedFixturePath,glp1CombinedAssetPath,progressFixturePath,progressAssetPath,finalProgressLabelFixturePath].includes(p)).filter(p=>p!==shippingSkipFixturePath||readFileSync(resolve(root,p),"utf8")!==execFileSync("git",["show",`24838ad1:${p}`],{cwd:root,encoding:"utf8"})).filter(p=>p!=="server/intakeSubmissionContract.ts"||inverseApprovedGlp1Combined(p,readFileSync(resolve(root,p),"utf8"))!==old(p));expect(changed).toEqual([path]);});
});
