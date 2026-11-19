import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root=resolve(import.meta.dirname,"..");
const read=(p:string)=>readFileSync(resolve(root,p),"utf8");
const before=(p:string)=>execFileSync("git",["show",`e8f31c6b:${p}`],{cwd:root,encoding:"utf8",maxBuffer:16*1024*1024});
const cssPath="client/public/intake/thank-you.css",htmlPath="client/intake/thank-you/index.html";
const delta=()=>read(cssPath).slice(before(cssPath).length);
function contrast(a:string,b:string){
 const lum=(hex:string)=>{const c=hex.replace('#','').match(/../g)!.map(x=>parseInt(x,16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722};
 const [x,y]=[lum(a),lum(b)].sort((x,y)=>y-x);return (x+0.05)/(y+0.05);
}
describe("confirmation green text only",()=>{
 it("preserves all existing styles and adds only color and helper opacity declarations",()=>{
  expect(read(cssPath).startsWith(before(cssPath))).toBe(true);
  const declarations=[...delta().matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)].map(m=>m[1]);
  expect(declarations).toEqual(['color','opacity','color']);
  expect(delta()).not.toMatch(/filter:|font:|display:|padding:|margin:|width:|height:|background:|border:/);
 });
 it("scopes dark green to checkout helper paragraphs and the four hosted-field labels",()=>{
  expect(delta()).toContain('.premium-form-panel #video-checkout > p:not(.checkout-status):not(.checkout-error)');
  expect(delta()).toContain('.premium-form-panel #video-checkout .checkout-note');
  expect(delta()).toContain('.premium-form-panel #video-checkout .paypal-field > span');
  expect(delta()).toContain('.premium-form-panel #video-checkout .coupon > label');
  expect(delta()).toContain('color: #113A3A !important;');
  expect(delta()).toContain('opacity: 1;');
  expect(delta()).not.toMatch(/\.paypal-field\s*>\s*div|\.primary\s*\{|iframe\s*\{/);
 });
 it("colors only text links teal without removing disabled button opacity",()=>{
  expect(delta()).toContain('.premium-form-panel a:not(.primary):not(.secondary)');
  expect(delta()).toContain('.premium-form-panel .ty-text-link');
  expect(delta()).toContain('color: #0E7C7B !important;');
  const accent=delta().slice(delta().indexOf('.premium-form-panel a:'));
  expect(accent).not.toContain('opacity');
 });
 it("changes only the confirmation stylesheet URL, leaving all markup/scripts/wording unchanged",()=>{
  const link='/intake/thank-you.css?v=20261119-green-text-v1';
  expect(read(htmlPath).split(link).length-1).toBe(1);
  expect(read(htmlPath).replace(link,'/intake/thank-you.css')).toBe(before(htmlPath));
 });
 it("preserves payment, intake, privacy, tracking and routing source exactly",()=>{
  for(const p of ['client/intake/index.html','client/public/intake/video-visit.js','client/public/intake/thank-you.js','client/public/intake/text-payment.js','client/public/meta-lead.js','server/intakePaymentRoutes.ts','server/intakeTextPaymentService.ts','server/intakeTextPaymentIntegration.ts','server/_core/index.ts','client/public/intake/premium.css'])expect(read(p),p).toBe(before(p));
 });
 it("uses high-contrast greens on the existing light panel instead of dark-mode pale mint",()=>{
  expect(contrast('#113A3A','#FFFFFF')).toBeGreaterThan(10);
  expect(contrast('#113A3A','#F5F8F7')).toBeGreaterThan(10);
  expect(contrast('#0E7C7B','#FFFFFF')).toBeGreaterThan(4.5);
  expect(contrast('#C9E4E1','#FFFFFF')).toBeLessThan(1.5);
 });
});
