import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseApprovedSigningConnectionCopy, approvedShippingApprovalHtmlFragments, approvedSigningConnectionHtmlFragments } from "./intakeIntroDetailsPhotoScope.test";

const root=resolve(import.meta.dirname,"..");
const path="client/intake/index.html", fixturePath="server/fixtures/intakeLatePatientInfoFragments.json";
const source=inverseApprovedSigningConnectionCopy(path,readFileSync(resolve(root,path),"utf8"));
const old=(p:string)=>execFileSync("git",["show",`1476a622:${p}`],{cwd:root,encoding:"utf8"});
const previous=JSON.parse(old(fixturePath));
const current=JSON.parse(readFileSync(resolve(root,fixturePath),"utf8"));
const changes=current.slice(previous.length,59) as Array<{old:string;new:string;count:number}>;
const signingBaseline=execFileSync("git",["show",`0c5f2ca4:${path}`],{cwd:root,encoding:"utf8"});
const heading="If you’re medically approved, where would you like your meds shipped?";
const note="Only used if Dr. Al-Deek prescribes medication for you. Nothing ships — and nothing is charged — until you’ve approved your plan first.";
const helper="Choose your state here. We’ll use it on your identity form.";
function undo(input:string) { for (const f of [...changes].reverse()) { expect(input.split(f.new).length-1).toBe(f.count); input=input.split(f.new).join(f.old); } return input; }
function component(s:string) { const start=s.indexOf('function MmdShippingAddress(');expect(start).toBeGreaterThan(0);return s.slice(start,s.indexOf('function ',start+12)); }
const shipping=component(source);

describe("Shipping address approved medical-approval wording only",()=>{
 it("preserves every previous fixture entry and appends exactly the four confirmed display fragments",()=>{
  expect(previous).toHaveLength(55);expect(current).toHaveLength(61);expect(current.slice(0,previous.length)).toEqual(previous);expect(changes).toHaveLength(4);
  expect(changes).toEqual(approvedShippingApprovalHtmlFragments);expect(current.slice(59)).toEqual(approvedSigningConnectionHtmlFragments);expect(approvedSigningConnectionHtmlFragments).toHaveLength(2);
  expect(current.slice(0,59)).toEqual(JSON.parse(execFileSync("git",["show",`0c5f2ca4:${fixturePath}`],{cwd:root,encoding:"utf8"})));expect(source).toBe(signingBaseline);
  expect(changes.map(f=>f.count)).toEqual([1,1,1,1]);expect(changes[0].new).toContain(heading);expect(changes[1].new).toContain(note);expect(changes[2].new).toBe('children:`Apt, suite, unit`');expect(changes[3].new).toContain(helper);
 });
 it("restores the entire intake byte-for-byte to1476a622, preserving CSS/metadata/validators/payment/submission and other screens",()=>{expect(undo(source)).toBe(old(path));expect(source.match(/<style>[\s\S]*?<\/style>/g)).toEqual(old(path).match(/<style>[\s\S]*?<\/style>/g));expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)?.[1]).toBe(old(path).match(/routes:JSON\.parse\(`(.*?)`\)/s)?.[1]);});
 it("changes only displayed shipping title, with a wrapper over the original screen and identical visible order",()=>{
  const start=source.indexOf('function MmdIntakeFlowScreens('),end=source.indexOf('function MmdIntakeSubmitScreen(',start);const fn=source.slice(start,end);
  expect(fn).toContain('find("wShippingAddress")?{...find("wShippingAddress"),question_text:"'+heading+'"}:null');
  const context=vm.createContext({w:()=>[]});new vm.Script(fn+'\nglobalThis.flow=MmdIntakeFlowScreens;').runInContext(context);
  const metadata=JSON.parse(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);context.w=()=>metadata.w.screens;
  const screens=context.flow({});const selected=screens.find((s:any)=>s.id==='wShippingAddress');expect(selected.question_text).toBe(heading);expect(selected.required).toBe(true);expect(selected.type).toBe('shippingAddress');
  const oldStart=signingBaseline.indexOf('function MmdIntakeFlowScreens('),oldEnd=signingBaseline.indexOf('function MmdIntakeSubmitScreen(',oldStart);const oldContext=vm.createContext({w:()=>metadata.w.screens});new vm.Script(signingBaseline.slice(oldStart,oldEnd)+'\nglobalThis.flow=MmdIntakeFlowScreens;').runInContext(oldContext);
  expect(screens.map((s:any)=>s.id)).toEqual(oldContext.flow({}).map((s:any)=>s.id));expect(screens.filter((s:any)=>s.id!=='wShippingAddress')).toEqual(oldContext.flow({}).filter((s:any)=>s.id!=='wShippingAddress'));
 });
 it("uses the exact approval note and state helper with existing text classes",()=>{
  expect(shipping).toContain('className:`shipping-note full`,children:`'+note+'`');expect(shipping).toContain('className:`group-helper full`,children:`'+helper+'`');
  expect(shipping).not.toContain("This is where medication may ship");expect(shipping).not.toContain('Apt, suite, unit (optional)');expect(shipping).not.toMatch(/from your profile|as entered above|locked|readOnly|disabled/);
 });
 it("preserves all input/select markup, native optionality, state list, autofill, values, handlers and Hotjar suppression",()=>{
  const controls=(text:string)=>text.match(/\(0,M\.(?:jsx|jsxs)\)\(`(?:input|select)`,[\s\S]*?(?=\}\)\]\}\))/g);
  expect(controls(shipping)).toEqual(controls(component(old(path))));
  for(const item of ['Street address','Apt, suite, unit','City','State','ZIP code','value:String(e.state??``)','onChange:e=>t(`state`,e.target.value)','y.map(e=>(0,M.jsx)(`option`,{children:e},e))','autoComplete:`shipping address-line2`','maxLength:5',"'data-hj-suppress':!0"])expect(shipping).toContain(item);
  expect(shipping.match(/className:`required-mark`/g)).toHaveLength(4);expect(shipping).not.toContain('required:true');expect(shipping).not.toContain('required:!0');
 });
});
