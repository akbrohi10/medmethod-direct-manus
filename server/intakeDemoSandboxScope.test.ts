import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import edits from "./fixtures/intakeDemoSandboxClientEdits.json";
const root=resolve(import.meta.dirname,"..");
const before=(p:string)=>execFileSync("git",["show",`dfefb9d4:${p}`],{cwd:root,encoding:"utf8",maxBuffer:16*1024*1024});
const current=(p:string)=>readFileSync(resolve(root,p),"utf8");
function inverse(source:string,changes:{position:number;old:string;new:string}[]){
 for(const e of [...changes].reverse()){
  if(source.slice(e.position,e.position+e.new.length)!==e.new)throw Error("Unexpected source edit");
  source=source.slice(0,e.position)+e.old+source.slice(e.position+e.new.length);
 }
 return source;
}
describe("demo Sandbox override exact scope",()=>{
 it("restores every client byte after the recorded demo and asset-version changes",()=>{
  for(const [path,changes] of Object.entries(edits))expect(inverse(current(path),changes),path).toBe(before(path));
 });
 it("keeps all four hosted fields, labels, price, complete render markup and CSS unchanged",()=>{
  const path="client/public/intake/text-payment.js",marker="      function field(ref, label, extra) {";
  expect(current(path).slice(current(path).indexOf(marker))).toBe(before(path).slice(before(path).indexOf(marker)));
  expect(current("client/public/intake/text-payment.css")).toBe(before("client/public/intake/text-payment.css"));
 });
 it("keeps crypto, private storage, tracking, clinical handoff, optional video and thank-you sources unchanged",()=>{
  for(const path of ["server/intakeTextPaymentStore.ts","server/intakePrivateBlobDb.ts","server/intakePrivateApplicationKey.ts","server/intakePaymentRoutes.ts","server/ghlIntakeWebhookQueue.ts","server/metaLeadTracking.ts","client/public/meta-lead.js","client/public/intake/thank-you.js","client/public/intake/video-visit.js","client/intake/thank-you/index.html","drizzle/schema.ts"])
   expect(current(path),path).toBe(before(path));
 });
 it("does not expose a secret key or introduce ordinary app-owned card inputs",()=>{
  const source=current("client/public/intake/text-payment.js");
  expect(source).not.toMatch(/client_secret|clientSecret|PAYPAL_SANDBOX_CLIENT_SECRET|\.value\b|JSX\.jsx\("input"/);
  expect(source).toContain('get("prefill") === "demo"');
  expect(source).toContain('"mmd_text_payment_demo_v1" : "mmd_text_payment_v1"');
  expect(current("client/intake-text-payment-transport.ts")).toContain('payment.config.query(demoSandbox ? { demo_mode: true } : undefined)');
 });
 it("versions only the three checkout assets and detects unapproved client edits",()=>{
  for(const asset of ["text-payment.css","text-payment-api.js","text-payment.js"])
   expect(current("client/intake/index.html").split(`/intake/${asset}?v=20261119-demo-sandbox-v4`).length-1).toBe(1);
  const p="client/public/intake/text-payment.js";
  expect(()=>inverse(current(p).replace('get("prefill") === "demo"','get("prefill") === "other"'),edits[p])).toThrow();
  expect(inverse(current(p)+"\n// unwanted change\n",edits[p])).not.toBe(before(p));
 });
});
