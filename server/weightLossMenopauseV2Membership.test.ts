import { createHash } from 'node:crypto'; import { compactMembershipFixturePath, inverseApprovedV2CompactMembership } from "./weightLossMenopauseV2CompactMembership.test"; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope";
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
export const membershipFixturePath = 'server/fixtures/weightLossMenopauseV2MembershipFragments.json';
const root = resolve(import.meta.dirname, '..');
const pagePath = 'client/src/pages/WeightLossMenopauseV2.tsx';
const cssPath = 'client/src/pages/WeightLossMenopauseV2.css';
const readRaw = (p: string) => inverseHormoneQuizIntegration(p, readFileSync(resolve(root,p),'utf8')); const readBeforeCompact = (p: string) => inverseApprovedV2CompactMembership(p, readRaw(p)); const read = readBeforeCompact;
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
    const changed=[...execFileSync('git',['diff','--name-only','efd9c628','--',...roots],{cwd:root,encoding:'utf8'}).split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard','--',...roots],{cwd:root,encoding:'utf8'}).split('\n')].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p=>p&&!p.endsWith('.test.ts')&&p!==membershipFixturePath).filter(p => p !== compactMembershipFixturePath || inverseApprovedV2CompactMembership(p, "") !== "").filter(p => { const hash = p === "server/fixtures/v2RemoveCareSection.json" ? "b61356f9c7050f63cf37b5814469f4ab6029df8fa772947308cf1a0deb2f0c8c" : p === "server/fixtures/v2RemoveCareSectionScope.ts" ? "02689bf7ccb341f0976c77a78c9e291bc2343c5f4e65321017eda219a22d7bc5" : p === "server/fixtures/v2FooterLogoScope.ts" ? "2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391" : p === "server/fixtures/v2TestimonialReadMoreScope.ts" ? "e7e3f1411a7b683859dbea1fdef49adc2af488e503cd8d3acc8f3712790342a8" : p === "server/fixtures/v2TestimonialTextActionScope.ts" ? "b64ca0e8da32e70e2e97da930e4d1a5e4e51b35df12b4ab81a34a29d42761c7c" : p === "server/fixtures/v2TestimonialAttributionScope.ts" ? "289a41016d926e29ea901349023bb373dfd7e17fde3c427e57fdbb63ffd7a18c" : p === "server/fixtures/hormoneQuizTreatmentCtaScope.ts" ? "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668" : p === "server/fixtures/hormoneQuizPanelScope.ts" ? "f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798" : p === "server/fixtures/hormoneQuizPhoneScope.ts" ? "a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25" : null; if (!hash) return true; expect(createHash("sha256").update(inverseHormoneQuizIntegration(p, readFileSync(resolve(root, p), "utf8"))).digest("hex")).toBe(hash); return false; }).filter(p => p !== "client/public/hormone-symptom-quiz.html" || inverseHormoneQuizTreatmentCta(p, read(p)) !== execFileSync("git", ["show", "efd9c628:" + p], { cwd: root, encoding: "utf8" })).filter(p=>!["client/src/pages/WeightLossMenopauseV2DoctorBio.tsx", "client/src/pages/WeightLossMenopauseV2MobileBar.tsx"].includes(p)||read(p)!==baseline(p));
    expect([...new Set(changed)].sort()).toEqual([cssPath,pagePath].sort());
    for(const p of execFileSync('git',['ls-tree','-r','--name-only','efd9c628','--','server/fixtures'],{cwd:root,encoding:'utf8'}).trim().split('\n'))expect(read(p)).toBe(baseline(p));
    for(const p of['shared/treatmentCatalog.json','client/src/pages/WeightLossMenopauseV2Faq.tsx','client/intake/index.html','client/public/hormone-symptom-quiz.html','server/intakeSubmissionContract.ts'])expect(read(p)).toBe(baseline(p));
  });
});
