import { createHash } from 'node:crypto'; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test";
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
export const membershipFixturePath = 'server/fixtures/weightLossMenopauseV2MembershipFragments.json';
const root = resolve(import.meta.dirname, '..');
const pagePath = 'client/src/pages/WeightLossMenopauseV2.tsx';
const cssPath = 'client/src/pages/WeightLossMenopauseV2.css';
const readRaw = (p: string) => readFileSync(resolve(root,p),'utf8'); const readBeforeCompact = (p: string) => inverseApprovedV2CompactMembership(p, readRaw(p)); const read = readBeforeCompact;
const baseline = (p: string) => execFileSync('git',['show',`efd9c628:${p}`],{cwd:root,encoding:'utf8'});
export function inverseApprovedV2Membership(path: string, source: string): string { return inverseApprovedV2MembershipBeforeCompact(path, inverseApprovedV2CompactMembership(path, source)); } export function inverseApprovedV2MembershipBeforeCompact(path: string, source: string): string {
  const raw = readRaw(membershipFixturePath);
  if (createHash('sha256').update(raw).digest('hex') !== '8b2e2b3373353a03bd35ac622434411d448c25b91ea2c98347d6cc946d603627') throw new Error('Unexpected membership approval packet');
  const fixture = JSON.parse(raw) as { baseline: string; fragments: {path:string;old:string;new:string}[] };
  for (const f of fixture.fragments.filter(f=>f.path===path).reverse()) {
    if (source.split(f.new).length-1!==1 || (!f.old && !source.endsWith(f.new))) throw new Error('Unexpected approved membership source count');
    source = f.old ? source.replace(f.new,f.old) : source.slice(0,-f.new.length);
  }
  return source;
}
const offer = () => read(pagePath).match(/    <div className="process-pricing-offer" id="pricing"[\s\S]*?\n    <\/div>\n  <\/div>\n<\/section>/)?.[0] ?? '';
describe('V2 optional $300 annual membership — pricing section only',()=>{
  it('preserves the complete page and CSS except one pricing offer block and one scoped appended style block',()=>{
    expect(inverseApprovedV2MembershipBeforeCompact(pagePath,read(pagePath))).toBe(baseline(pagePath));
    expect(inverseApprovedV2MembershipBeforeCompact(cssPath,read(cssPath))).toBe(baseline(cssPath));
    const f=JSON.parse(read(membershipFixturePath));expect(f.baseline).toBe('efd9c628');expect(f.fragments).toHaveLength(2);
    expect(f.fragments[0].old).toMatch(/^    <div className="process-pricing-offer"/);
    expect(f.fragments[0].new).toMatch(/^    <div className="process-pricing-offer"/);
    expect(f.fragments[1].old).toBe('');
    for(const selector of f.fragments[1].new.split('\n').filter((x:string)=>x.includes('{')&&!x.trim().startsWith('@media')))expect(selector.trim()).toMatch(/^\.wlm-v2-content #how-it-works /);
  });
  it('keeps the three original process steps, hero, nav, metadata, all other sections and exact hero-comfort styles',()=>{
    const src=read(pagePath),old=baseline(pagePath),start=src.indexOf('    <div className="process-pricing-offer"');
    expect(src.slice(0,start)).toBe(old.slice(0,old.indexOf('    <div className="process-pricing-offer"')));
    expect(src.slice(src.indexOf('<section className="featured-in"'))).toBe(old.slice(old.indexOf('<section className="featured-in"')));
    expect(read(cssPath).startsWith(baseline(cssPath))).toBe(true);
    expect(src.match(/className="hero-cta-label"[\s\S]*?className="hero-cta-timing"[^<]*<\/span>/)?.[0]).toBe(old.match(/className="hero-cta-label"[\s\S]*?className="hero-cta-timing"[^<]*<\/span>/)?.[0]);
  });
  it('shows the free first assessment and seven days of messaging, medication extra and unchanged intake-only CTA',()=>{
    const s=offer();expect(s).toContain('Start free. Then choose how you keep going.');expect(s).toContain('Your first text visit');expect(s).toContain('<dd>FREE</dd>');
    expect(s).toContain('Doctor assessment review, plus 7 days of follow-up messaging.');expect(s).toContain('Medication costs extra, if prescribed.');
    expect(s).toContain('<a className="btn process-pricing-cta" href={WEIGHT_MENOPAUSE_INTAKE_URL}>Start your free assessment <span className="arrow" aria-hidden="true">→</span></a>');
    expect(s).toContain("No payment today. You'll choose a plan after your free visit, only if treatment is right for you.");
    expect(s).not.toMatch(/<form|<input|<button|onClick|fetch\(|paypal|stripe|checkout/i);
  });
  it('clearly separates $29 text/refill and $97 video pay-as-you-go pricing from annual member pricing',()=>{
    const s=offer().split('<article className="membership-plan membership-plan-payg"')[1].split('</article>')[0];
    for(const text of['Pay As You Go','<strong>$29</strong>','per text visit','7 days of messaging','Refill visits <strong>$29 each</strong>','Video visits <strong>$97</strong>','No membership required'])expect(s).toContain(text);
    expect(s).not.toMatch(/\$300|\$49|Unlimited/);
  });
  it('shows exactly $300/year annual upfront payment and all confirmed member benefits without medication bundling or monthly billing',()=>{
    const s=offer().split('<article className="membership-plan membership-plan-annual"')[1].split('</article>')[0];
    for(const text of['MedMethod Membership','Best value for ongoing care','<strong>$300</strong><span>/year</span>','One annual upfront payment','Unlimited text visits','All refill visits included','with no per-visit fees','Member video visits <strong>$49</strong>','rather than $97','Dose-adjustment and side-effect questions included','Weight loss, hormones and menopause in one plan'])expect(s).toContain(text);
    expect(s.match(/<li>/g)).toHaveLength(5);expect(s).not.toMatch(/\/month|monthly|medication included|auto.?renew|guaranteed|24.?7/i);
    expect(offer()).toContain('Membership is optional. Pay-as-you-go care has no membership commitment.');
    expect(offer()).not.toContain('No membership or long-term commitment.');
    expect(offer()).toContain('Pay-as-you-go follow-up covers that visit’s assessment and care plan.');
  });
  it('rejects missing, duplicate, trailing or otherwise modified approved fragments and unknown edits are not hidden',()=>{
    expect(()=>inverseApprovedV2MembershipBeforeCompact(pagePath,baseline(pagePath))).toThrow('Unexpected approved membership source count');
    const f=JSON.parse(read(membershipFixturePath));expect(()=>inverseApprovedV2MembershipBeforeCompact(cssPath,read(cssPath)+f.fragments[1].new)).toThrow();
    expect(()=>inverseApprovedV2MembershipBeforeCompact(cssPath,read(cssPath)+'EXTRA')).toThrow();
    expect(inverseApprovedV2MembershipBeforeCompact(pagePath,'UNAPPROVED\n'+read(pagePath))).not.toBe(baseline(pagePath));
    expect(inverseApprovedV2MembershipBeforeCompact('unrelated.ts','unchanged')).toBe('unchanged');
  });
  it('keeps every other production source, medication catalog and all old fixtures byte-identical',()=>{
    const roots=['client','server','shared','drizzle','vite.config.ts','package.json','pnpm-lock.yaml'];
    const changed=[...execFileSync('git',['diff','--name-only','efd9c628','--',...roots],{cwd:root,encoding:'utf8'}).split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard','--',...roots],{cwd:root,encoding:'utf8'}).split('\n')].filter(p=>p&&!p.endsWith('.test.ts')&&p!==membershipFixturePath).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : null; if (!hash) return true; expect(createHash("sha256").update(readFileSync(resolve(root, p), "utf8")).digest("hex")).toBe(hash); return false; }).filter(p=>!["client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p)||read(p)!==baseline(p));
    expect([...new Set(changed)].sort()).toEqual([cssPath,pagePath].sort());
    for(const p of execFileSync('git',['ls-tree','-r','--name-only','efd9c628','--','server/fixtures'],{cwd:root,encoding:'utf8'}).trim().split('\n'))expect(read(p)).toBe(baseline(p));
    for(const p of['shared/treatmentCatalog.json','client/src/pages/WeightLossMenopauseV2Faq.tsx','client/intake/index.html','client/public/hormone-symptom-quiz.html','server/intakeSubmissionContract.ts'])expect(read(p)).toBe(baseline(p));
  });
});
