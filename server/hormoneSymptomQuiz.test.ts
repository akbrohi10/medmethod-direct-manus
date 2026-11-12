import { createHash } from 'node:crypto'; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope"; import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope"; import { inverseHormoneQuizOnlineCopy } from "./fixtures/hormoneQuizOnlineCopyScope"; import { createHash as previewResultsCreateHash } from "node:crypto"; import { inverseHormoneQuizPreviewResults as qpi, previewResultsHistoricalSource, previewResultsApprovedInventory } from "./fixtures/hormoneQuizPreviewResultsScope"; const previewResultsHelperSHA = "20b894339a1ed562393fca6651ab4e88c37cc59d22afc63f8cbf36cacb155f8b"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext, Script } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { inverseApprovedQuizDemo } from './hormoneSymptomQuizDemoScope.test';
const root = resolve(import.meta.dirname, '..');
const rawHtml = inverseHormoneQuizTreatmentCta('client/public/hormone-symptom-quiz.html', inverseHormoneQuizPanel('client/public/hormone-symptom-quiz.html', inverseHormoneQuizPhone('client/public/hormone-symptom-quiz.html', inverseHormoneQuizIntegration('client/public/hormone-symptom-quiz.html', inverseHormoneQuizPrivacy('client/public/hormone-symptom-quiz.html', inverseHormoneQuizCtaPlacement('client/public/hormone-symptom-quiz.html', inverseHormoneQuizLetterRemoval('client/public/hormone-symptom-quiz.html', inverseHormoneQuizDoctorIntro('client/public/hormone-symptom-quiz.html', inverseHormoneQuizMobileTop('client/public/hormone-symptom-quiz.html', inverseHormoneQuizOnlineCopy('client/public/hormone-symptom-quiz.html', metaLeadConversionsHistoricalSource('client/public/hormone-symptom-quiz.html', readFileSync(resolve(root, 'client/public/hormone-symptom-quiz.html'), 'utf8'), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))))))))))));
const html = inverseApprovedQuizDemo('client/public/hormone-symptom-quiz.html', rawHtml);
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
function engine() {
  const nodes: Record<string, any> = {};
  const node = (id: string): any => nodes[id] ??= { value: '', textContent: '', innerHTML: '', children: [], focused: false, attrs: {}, handlers: {}, classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} }, addEventListener(name: string, fn: Function) { this.handlers[name] = fn; }, setAttribute(name: string, value: string) { this.attrs[name] = value; }, removeAttribute(name: string) { delete this.attrs[name]; }, focus() { this.focused = true; }, appendChild(child: any) { this.children.push(child); } };
  const env: any = { window: { scrollTo() {} }, document: { getElementById: node, addEventListener() {}, createElement: () => node('created' + Math.random()) }, setTimeout: () => 1, clearTimeout() {} };
  scripts.forEach(script => runInNewContext(script, env));
  return { env, node };
}
describe('exact supplied Hormone Symptom Quiz', () => {
  it('has the original complete document, page title, all styling and two syntactically valid scripts', () => {
    expect(createHash('sha256').update(html).digest('hex')).toBe('db2679e2347857f1e282234f6324a12b4536a409ff4c65d83884a475ba7af845');
    expect(Buffer.byteLength(html)).toBe(80314);
    expect(html).toContain('<title>Hormone Symptom Quiz</title>');
    expect(scripts).toHaveLength(2); scripts.forEach(script => expect(() => new Script(script)).not.toThrow());
    expect(html).toContain('@media (prefers-color-scheme: dark)');
    expect(html).toContain('prefers-reduced-motion: reduce');
    expect(html).toContain('family=Lora:ital,wght'); expect(html).toContain('family=Karla:wght');
  });
  it('preserves the original question bank, optional conditional screen and existing answer identifiers', () => {
    const { env } = engine(); expect(env.QUESTIONS).toHaveLength(32);
    expect(env.order).toHaveLength(31); expect(env.order).not.toContain('weirdWorst');
    env.answers.weird = [0, 1]; env.syncConditional(); expect(env.order).toHaveLength(32);
    expect(env.order[env.order.indexOf('weird') + 1]).toBe('weirdWorst');
    env.answers.weirdWorst = 0; env.answers.weird = [12]; env.syncConditional();
    expect(env.order).toHaveLength(31); expect(env.answers.weirdWorst).toBeUndefined();
    expect(Object.keys(env.BY_ID)).toContain('orgasmChange'); expect(Object.keys(env.BY_ID)).toContain('bladder');
  });
  it('retains the supplied local scoring and never treats optional intimacy skips as zero', () => {
    const { env } = engine(); env.QUESTIONS.forEach((q: any) => env.answers[q.id] = q.multi ? [q.opts.length - 1] : 0);
    let model = env.computeModel(); expect(model.index).toBe(93); expect(model.scores.intimacy).toBe(100);
    for (const id of ['desire', 'arousal', 'orgasm', 'orgasmChange', 'dryness', 'wantFreq']) env.answers[id] = env.BY_ID[id].opts.length - 1;
    model = env.computeModel(); expect(model.scores.intimacy).toBeNull(); expect(model.index).not.toBeNull();
    expect(env.BANDS.index).toEqual([[91, 'In balance'], [82, 'Mild'], [64, 'Moderate'], [0, 'Strong signal']]);
  });
  it('requires original name/email/phone validation before revealing the locally generated report', () => {
    const { env, node } = engine(); const submit = node('gateForm').handlers.submit;
    submit({ preventDefault() {} }); expect(node('gateName').focused).toBe(true); expect(env.submissionRecord).toBeNull();
    node('gateName').value = 'Synthetic Quiz'; submit({ preventDefault() {} }); expect(node('gateEmail').focused).toBe(true); expect(env.submissionRecord).toBeNull();
    node('gateEmail').value = 'synthetic.quiz@example.com'; node('gatePhone').value = '123'; submit({ preventDefault() {} }); expect(node('gatePhone').focused).toBe(true); expect(env.submissionRecord).toBeNull();
    node('gatePhone').value = '2025550100'; env.QUESTIONS.forEach((q: any) => env.answers[q.id] = q.multi ? [q.opts.length - 1] : 0);
    submit({ preventDefault() {} }); expect(env.submissionRecord.name).toBe('Synthetic Quiz'); expect(env.window.__quizSubmission).toBe(env.submissionRecord);
    expect(JSON.parse(node('submissionData').textContent).email).toBe('synthetic.quiz@example.com');
    expect(node('reportBody').innerHTML).toContain('Your five drivers'); expect(node('reportBody').innerHTML).toContain('Book my discovery call');
  });
  it('adds no API, persistence, provider connection, tracking or external scripts to the supplied document', () => {
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(scripts.join('\n')).not.toMatch(/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
    expect(html).not.toContain('/src/main.tsx'); expect(html).not.toContain('debug-collector'); expect(html).not.toContain('hotjar');
    expect(html).toContain('href="https://medmethoddirect.com" target="_blank" rel="noopener"');
    expect(html).toContain('a.download = "my-hormone-report.txt"');
  });
  it('preserves the exact original built HTML, with no injected runtime or site styles', () => {
    expect(Buffer.from(inverseHormoneQuizTreatmentCta('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizPanel('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizPhone('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizIntegration('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizPrivacy('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizCtaPlacement('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizLetterRemoval('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizDoctorIntro('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizMobileTop('dist/public/hormone-symptom-quiz.html', inverseHormoneQuizOnlineCopy('dist/public/hormone-symptom-quiz.html', metaLeadConversionsHistoricalSource('dist/public/hormone-symptom-quiz.html', readFileSync(resolve(root, 'dist/public/hormone-symptom-quiz.html'), 'utf8'), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")))))))))))))).toEqual(Buffer.from(rawHtml));
  });
  it('registers GET/HEAD-compatible direct document serving before crawler and shared SPA rendering', () => {
    const server = inverseHormoneQuizPrivacy('server/_core/index.ts', inverseHormoneQuizCtaPlacement('server/_core/index.ts', inverseHormoneQuizLetterRemoval('server/_core/index.ts', inverseHormoneQuizDoctorIntro('server/_core/index.ts', inverseHormoneQuizMobileTop('server/_core/index.ts', inverseHormoneQuizOnlineCopy('server/_core/index.ts', previewResultsHistoricalSource('server/_core/index.ts', metaLeadConversionsHistoricalSource('server/_core/index.ts', readFileSync(resolve(root, 'server/_core/index.ts'), 'utf8'), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA)))))));
    expect(server).toContain('app.get(["/hormone-symptom-quiz", "/hormone-symptom-quiz/"]');
    expect(server).toContain('path.resolve(import.meta.dirname, "../../client/public/hormone-symptom-quiz.html")');
    expect(server).toContain('path.resolve(import.meta.dirname, "public/hormone-symptom-quiz.html")');
    expect(server.indexOf('res.sendFile(hormoneSymptomQuizHtml)')).toBeLessThan(server.indexOf('app.use(crawlerMiddleware)'));
    expect(server.indexOf('res.sendFile(hormoneSymptomQuizHtml)')).toBeLessThan(server.indexOf('await setupVite(app, server)'));
  });
  it('adds only the standalone route entry and suppresses site overlays on that route', () => {
    const app = inverseHormoneQuizPrivacy('client/src/App.tsx', inverseHormoneQuizCtaPlacement('client/src/App.tsx', inverseHormoneQuizLetterRemoval('client/src/App.tsx', inverseHormoneQuizDoctorIntro('client/src/App.tsx', inverseHormoneQuizMobileTop('client/src/App.tsx', inverseHormoneQuizOnlineCopy('client/src/App.tsx', metaLeadConversionsHistoricalSource('client/src/App.tsx', readFileSync(resolve(root, 'client/src/App.tsx'), 'utf8'), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))))))));
    expect(app).toContain('<Route path="/hormone-symptom-quiz" component={HormoneSymptomQuizStandaloneRedirect} />');
    expect(app).toContain('window.location.replace("/hormone-symptom-quiz")');
    expect(app).toContain('if (location === "/hormone-symptom-quiz" || location === "/hormone-symptom-quiz/") return null;');
  });
});
