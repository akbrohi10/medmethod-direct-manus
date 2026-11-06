import { inverseApprovedV2HeroQuestion } from "./weightLossMenopauseV2HeroQuestion.test"; import { inverseApprovedV2Membership, membershipFixturePath } from "./weightLossMenopauseV2Membership.test"; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { verifyApprovedHormoneSymptomQuizAsset } from "./hormoneSymptomQuizScope.test";
import { inverseApprovedFinalProgressLabel, finalProgressLabelFixturePath } from "./intakeFinalProgressLabelScope.test";
import { shippingSkipFixturePath } from "./intakeShippingSkipScope.test";
import { inverseApprovedIntakeProgress, progressFixturePath, progressAssetPath } from "./intakeProgressScope.test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root=resolve(import.meta.dirname,"..");
export const glp1CombinedFixturePath="server/fixtures/intakeGlp1CombinedFragments.json";
export const glp1CombinedAssetPath="client/public/intake/glp1-screens.js";
const intakePath="client/intake/index.html";
const fixture=readFileSync(resolve(root,glp1CombinedFixturePath),"utf8");
const packetHash="f5f3318f150b96ec380fde67b0c48a0329d122207dba0897740518ebfbc2fa45",assetHash="36c7b54eef8def648e47b7f85ecd810005b6ad455a3fa6b9c3b4962242c4adff";
type Fragment={old:string;new:string;count:number};
const packet:{baseline:string;fragments:Fragment[];introduced_asset:string}=JSON.parse(fixture);
const progressFragments:Fragment[]=JSON.parse(readFileSync(resolve(root,progressFixturePath),"utf8")).fragments;
const shippingFragments:Fragment[]=JSON.parse(readFileSync(resolve(root,shippingSkipFixturePath),"utf8")).files[intakePath];
const finalLabelFragments:Fragment[]=JSON.parse(readFileSync(resolve(root,finalProgressLabelFixturePath),"utf8")).files[intakePath];
if(createHash("sha256").update(fixture).digest("hex")!==packetHash||packet.baseline!=="443868b1"||packet.introduced_asset!==glp1CombinedAssetPath||packet.fragments.length!==13||packet.fragments.some(f=>f.count!==1||!f.old||!f.new||f.old===f.new))throw new Error("Unexpected approved GLP-1 presentation packet");
export function inverseApprovedGlp1Combined(path:string,source:string):string{source=inverseApprovedIntakeProgress(path,source);if(path!==intakePath)return source;for(const f of [...packet.fragments].reverse()){if(source.split(f.new).length-1!==f.count)throw new Error("Unexpected authorized GLP-1 fragment count");source=source.split(f.new).join(f.old);}return source;}
const read=(p:string)=>readFileSync(resolve(root,p),"utf8");
const old=(p:string)=>execFileSync("git",["show",`443868b1:${p}`],{cwd:root,encoding:"utf8"});
describe("GLP-1 grouping exact approved production scope",()=>{
 it("freezes the exact13-fragment packet and reviewed public component",()=>{expect(createHash("sha256").update(fixture).digest("hex")).toBe(packetHash);expect(createHash("sha256").update(read(glp1CombinedAssetPath)).digest("hex")).toBe(assetHash);expect(Object.keys(packet).sort()).toEqual(["baseline","fragments","introduced_asset"].sort());});
 it("restores the complete intake source byte-for-byte to443868b1",()=>{expect(inverseApprovedGlp1Combined(intakePath,read(intakePath))).toBe(old(intakePath));});
 it("rejects missing and duplicated fragments and never hides unrelated edits",()=>{const source=read(intakePath);for(const f of packet.fragments){const visible=[...progressFragments,...shippingFragments,...finalLabelFragments].reduce((text,p)=>text.split(p.old).join(p.new),f.new);expect(source.split(visible).length-1).toBe(f.count);expect(()=>inverseApprovedGlp1Combined(intakePath,source.replace(visible,f.old))).toThrow();expect(()=>inverseApprovedGlp1Combined(intakePath,source+visible)).toThrow();}expect(inverseApprovedGlp1Combined(intakePath,source+"\nUNAPPROVED")).not.toBe(old(intakePath));expect(inverseApprovedGlp1Combined("server/intakePaymentRoutes.ts","unchanged")).toBe("unchanged");});
 it("allows only the intake HTML and exact new public component, retaining all historic fixtures",()=>{const scope=["client","server","shared","drizzle","package.json","pnpm-lock.yaml","vite.config.ts"],paths=[...execFileSync("git",["diff","--name-only","443868b1","--",...scope],{cwd:root,encoding:"utf8"}).trim().split("\n"),...execFileSync("git",["ls-files","--others","--exclude-standard","--",...scope],{cwd:root,encoding:"utf8"}).trim().split("\n")].filter(p=>p&&!/\.test\.[cm]?[jt]sx?$/.test(p)&&![glp1CombinedFixturePath,progressFixturePath,progressAssetPath,shippingSkipFixturePath,finalProgressLabelFixturePath].includes(p)).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => p !== membershipFixturePath || inverseApprovedV2Membership(p, "") !== "")
      .filter(p => !["client/src/pages/WeightLossMenopauseV2.tsx", "client/src/pages/WeightLossMenopauseV2.css", "client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p) || inverseApprovedV2HeroQuestion(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", String("443868b1") + ":" + p], { cwd: process.cwd(), encoding: "utf8" }))
      .filter(p => !verifyApprovedHormoneSymptomQuizAsset(p, readFileSync(resolve(process.cwd(), p), "utf8")))
      .filter(p => !["client/src/App.tsx", "server/_core/index.ts"].includes(p) || inverseApprovedFinalProgressLabel(p, readFileSync(resolve(process.cwd(), p), "utf8")) !== execFileSync("git", ["show", `443868b1:${p}`], { cwd: process.cwd(), encoding: "utf8" })).filter(p=>p!=="server/intakeSubmissionContract.ts"||inverseApprovedGlp1Combined(p,read(p))!==old(p));expect([...new Set(paths)].sort()).toEqual([intakePath,glp1CombinedAssetPath].sort());expect(read("server/fixtures/intakeLatePatientInfoFragments.json")).toBe(old("server/fixtures/intakeLatePatientInfoFragments.json"));});
});
