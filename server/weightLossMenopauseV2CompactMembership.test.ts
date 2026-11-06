import { inverseApprovedV2FourProcessSteps } from "./weightLossMenopauseV2FourProcessSteps.test"; import { inverseApprovedV2BioMscpBadge, v2BioMscpBadgePath } from "./weightLossMenopauseV2BioMscpBadge.test"; import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const root=resolve(import.meta.dirname,'..');
const page='client/src/pages/WeightLossMenopauseV2.tsx',css='client/src/pages/WeightLossMenopauseV2.css';
export const compactMembershipFixturePath='server/fixtures/weightLossMenopauseV2CompactMembershipFragments.json';
const read=(p:string)=>inverseApprovedV2FourProcessSteps(p,readFileSync(resolve(root,p),'utf8'));
const baseline=(p:string)=>execFileSync('git',['show',`d4df92f1:${p}`],{cwd:root,encoding:'utf8'});
export function inverseApprovedV2CompactMembership(path:string,source:string):string { source=path===page&&source===baseline(page)?source:inverseApprovedV2BioMscpBadge(path,source);
 const raw=read(compactMembershipFixturePath);
 if(createHash('sha256').update(raw).digest('hex')!=='7241c25f68b124ae97c0dab85f1db8fdc587e509b4da49204982132fbdfe6e7c')throw new Error('Unexpected compact membership approval packet');
 const f=JSON.parse(raw) as {fragments:{path:string;old:string;new:string}[]};
 for(const x of f.fragments.filter(x=>x.path===path).reverse()){
  if(source.split(x.new).length-1!==1||(!x.old&&!source.endsWith(x.new)))throw new Error('Unexpected compact membership source count');
  source=x.old?source.replace(x.new,x.old):source.slice(0,-x.new.length);
 }
 return source;
}
const offer=()=>read(page).match(/    <div className="process-pricing-offer" id="pricing"[\s\S]*?\n    <\/div>\n  <\/div>\n<\/section>/)?.[0]??'';
describe('V2 compact membership pricing — native collapsed benefits only',()=>{
 it('reverses exactly two pricing fragments, retaining every outside page and old style byte',()=>{
  expect(inverseApprovedV2CompactMembership(page,read(page))).toBe(baseline(page));
  expect(inverseApprovedV2CompactMembership(css,read(css))).toBe(baseline(css));
  const f=JSON.parse(read(compactMembershipFixturePath));expect(f.baseline).toBe('d4df92f1');expect(f.fragments).toHaveLength(2);
  for(const x of f.fragments)expect(read(x.path).split(x.new)).toHaveLength(2);
  expect(read(css).split('/* V2 compact pricing')[0]).toBe(baseline(css).split('/* V2 optional annual membership')[0]);
 });
 it('keeps every price and annual upfront payment visible outside the disclosure',()=>{
  const visible=offer().split('<details')[0];
  for(const s of['Simple pricing','First text visit','<dd>FREE</dd>','Includes 7 days of follow-up messaging.','Additional text visits','Pay as you go','<dd>$29 <span>each</span>','Video visit','<dd>$97','Members $49','Optional membership','<dd>$300','/year','One annual upfront payment'])expect(visible).toContain(s);
  expect(offer()).not.toContain('membership-options');expect(offer()).not.toContain('<article');
 });
 it('is closed by default and uses semantic native disclosure without custom state or checkout controls',()=>{
  const details=offer().match(/<details[^>]*>[\s\S]*?<\/details>/)?.[0]??'';
  expect(details).toMatch(/^<details className="compact-membership-details">/);
  expect(details).toContain('<summary><span>See membership benefits</span>');expect(details).toContain('aria-hidden="true"');
  for(const s of['Unlimited text visits','All refill visits included','with no per-visit fees','Dose-adjustment and side-effect questions included','Weight loss, hormones and menopause in one plan'])expect(details).toContain(s);
  expect(details.match(/<li>/g)).toHaveLength(4);expect(details).not.toMatch(/<details[^>]*\bopen\b|onClick|onToggle|useState|fetch\(/);
  expect(offer()).not.toMatch(/<form|<input|<button|paypal|stripe|checkout/i);
 });
 it('keeps medication extra, plan-choice timing, qualified follow-up and the exact current CTA',()=>{
  const s=offer();for(const text of['Medication costs extra, if prescribed.',"No payment today. You'll choose a plan after your free visit, only if treatment is right for you.",'Pay-as-you-go follow-up covers that visit’s assessment and care plan.','Membership is optional. Pay-as-you-go care has no membership commitment.','<a className="btn process-pricing-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your free assessment <span className="arrow" aria-hidden="true">→</span></a>'])expect(s).toContain(text);
  expect(s).not.toMatch(/monthly|auto.?renew|medication included|24.?7|guaranteed/);
  expect(read(page).slice(0,read(page).indexOf('    <div className="process-pricing-offer"'))).toBe(baseline(page).slice(0,baseline(page).indexOf('    <div className="process-pricing-offer"')));
  expect(read(page).slice(read(page).indexOf('<section className="featured-in"'))).toBe(baseline(page).slice(baseline(page).indexOf('<section className="featured-in"')));
 });
 it('uses only pricing-scoped palette/font rules with focus, touch targets, chevron and reduced motion',()=>{
  const block=JSON.parse(read(compactMembershipFixturePath)).fragments[1].new as string;
  for(const line of block.split('\n').filter(l=>l.includes('{')&&!l.trim().startsWith('@media')))expect(line.trim()).toMatch(/^\.wlm-v2-content #how-it-works /);
  for(const token of['font-family: Montserrat','min-height: 48px',':focus-visible','summary::-webkit-details-marker','[open]','.compact-membership-chevron','prefers-reduced-motion: reduce','transition: none'])expect(block).toContain(token);
 });
 it('rejects missing, duplicated or independently edited source and keeps all old production and fixtures guarded',()=>{
  expect(()=>inverseApprovedV2CompactMembership(page,baseline(page))).toThrow('Unexpected compact membership source count');
  const f=JSON.parse(read(compactMembershipFixturePath));expect(()=>inverseApprovedV2CompactMembership(page,read(page)+f.fragments[0].new)).toThrow();
  expect(inverseApprovedV2CompactMembership(page,'UNAPPROVED\n'+read(page))).not.toBe(baseline(page));
  expect(inverseApprovedV2CompactMembership('unrelated.ts','unchanged')).toBe('unchanged');
  const roots=['client','server','shared','drizzle','vite.config.ts','package.json','pnpm-lock.yaml'];
  const changed=[...execFileSync('git',['diff','--name-only','d4df92f1','--',...roots],{cwd:root,encoding:'utf8'}).split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard','--',...roots],{cwd:root,encoding:'utf8'}).split('\n')].filter(p=>p&&!p.endsWith('.test.ts')&&p!==compactMembershipFixturePath).filter(p=>(p!==v2BioMscpBadgePath&&p!=="client/src/pages/WeightLossMenopauseV2MobileBar.tsx")||inverseApprovedV2BioMscpBadge(p,read(p))!==baseline(p));
  expect([...new Set(changed)].sort()).toEqual([page,css].sort());
  for(const p of execFileSync('git',['ls-tree','-r','--name-only','d4df92f1','--','server/fixtures'],{cwd:root,encoding:'utf8'}).trim().split('\n'))expect(read(p)).toBe(baseline(p));
  for(const p of['shared/treatmentCatalog.json','client/src/pages/WeightLossMenopauseV2Faq.tsx','client/intake/index.html','client/public/hormone-symptom-quiz.html','server/intakeSubmissionContract.ts'])expect(read(p)).toBe(baseline(p));
 });
});
