import { execFileSync } from 'node:child_process'; import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope"; import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { inverseApprovedQuizBookingLink } from './hormoneSymptomQuizBookingLink.test';
const root = resolve(import.meta.dirname, '..');
const html = inverseApprovedQuizBookingLink('client/public/hormone-symptom-quiz.html', inverseHormoneQuizTreatmentCta('client/public/hormone-symptom-quiz.html', inverseHormoneQuizPanel('client/public/hormone-symptom-quiz.html', readFileSync(resolve(root, 'client/public/hormone-symptom-quiz.html'), 'utf8'))));
const baseline = execFileSync('git', ['show', 'a827f914:client/public/hormone-symptom-quiz.html'], { cwd: root, encoding: 'utf8' });
function engine(search: string, source = html) {
  const nodes: Record<string, any> = {}, timers: Function[] = [];
  const node = (id: string): any => {
    if (nodes[id]) return nodes[id];
    const classes = new Set<string>(), n: any = { value: '', textContent: '', children: [], focused: false, style: {}, handlers: {}, attributes: {}, classList: { add(...c: string[]) { c.forEach(x => classes.add(x)); }, remove(...c: string[]) { c.forEach(x => classes.delete(x)); }, contains(c: string) { return classes.has(c); }, toggle(c: string, force?: boolean) { if (force === true || (force === undefined && !classes.has(c))) classes.add(c); else classes.delete(c); } }, addEventListener(k: string, fn: Function) { this.handlers[k] = fn; }, setAttribute(k: string, v: string) { this.attributes[k] = v; }, removeAttribute(k: string) { delete this.attributes[k]; }, focus() { this.focused = true; }, appendChild(child: any) { this.children.push(child); }, reset() { for (const id of ['gateName', 'gateEmail', 'gatePhone']) node(id).value = ''; } };
    let inner = ''; Object.defineProperty(n, 'innerHTML', { get: () => inner, set(v) { inner = v; n.children = []; } }); nodes[id] = n; return n;
  };
  const env: any = { URLSearchParams, window: { location: { search }, scrollTo() {} }, document: { getElementById: node, createElement: () => node('child' + Object.keys(nodes).length), addEventListener() {} }, setTimeout: (fn: Function) => { timers.push(fn); return timers.length; }, clearTimeout() {} };
  for (const m of source.matchAll(/<script>([\s\S]*?)<\/script>/g)) runInNewContext(m[1], env);
  return { env, node, timers };
}
describe('query-only hormone quiz demo prefill', () => {
  it('activates only with exact prefill=demo including other query parameters, not the earlier typo or other values', () => {
    for (const query of ['?prefill=demo', '?utm_source=preview&prefill=demo']) {
      const { env, node } = engine(query); expect(env.demoPrefill).toBe(true); expect(Object.keys(env.answers)).toHaveLength(32);
      for (const id of ['gateName', 'gateEmail', 'gatePhone']) expect(node(id).value).toBe('');
      expect(env.submissionRecord).toBeNull();
    }
    for (const query of ['', '?prfill=demo', '?prefill=', '?prefill=Demo', '?prefill=live', '?demo=true']) {
      const { env } = engine(query); expect(env.demoPrefill).toBe(false); expect(Object.keys(env.answers)).toHaveLength(0);
    }
  });
  it('prefills valid selections for every visible question including the genuine conditional follow-up', () => {
    const { env, node } = engine('?prefill=demo'); env.syncConditional(); expect(env.order).toHaveLength(32);
    for (let i = 0; i < env.order.length; i++) {
      env.pos = i; env.render(); const q = env.BY_ID[env.order[i]], a = env.answers[q.id];
      expect(node('nextBtn').classList.contains('hidden')).toBe(false); expect(node('nextBtn').disabled).toBe(false);
      if (q.multi) { expect(Array.isArray(a)).toBe(true); expect(a.length).toBeGreaterThan(0); a.forEach((j: number) => expect(q.opts[j]).toBeDefined()); }
      else expect(q.opts[a]).toBeDefined();
      expect(node('opts').children.some((n: any) => n.attributes['aria-pressed'] === 'true')).toBe(true);
    }
  });
  it('moves exactly one screen per Continue, preserves Back and requires no answer clicks to reach contact fields', () => {
    const { env, node } = engine('?prefill=demo'); env.render();
    while (env.pos < env.order.length - 1) { const previous = env.pos; expect(node('nextBtn').disabled).toBe(false); node('nextBtn').handlers.click(); expect(env.pos).toBe(previous + 1); }
    const last = env.pos; node('backBtn').handlers.click(); expect(env.pos).toBe(last - 1); node('nextBtn').handlers.click(); expect(env.pos).toBe(last);
    node('nextBtn').handlers.click(); expect(node('gate').classList.contains('hidden')).toBe(false); expect(node('quiz').classList.contains('hidden')).toBe(true);
    for (const id of ['gateName', 'gateEmail', 'gatePhone']) expect(node(id).value).toBe('');
  });
  it('allows changing single answers without auto-advance and retains required multi-answer validation', () => {
    const { env, node, timers } = engine('?prefill=demo'); env.pos = env.order.indexOf('age'); env.render(); const pos = env.pos;
    env.choose(env.BY_ID.age, 0); expect(env.answers.age).toBe(0); expect(env.pos).toBe(pos); expect(timers).toHaveLength(0); expect(node('nextBtn').disabled).toBe(false);
    env.pos = env.order.indexOf('recognize'); env.answers.recognize = [0]; env.render(); env.choose(env.BY_ID.recognize, 0);
    expect(env.answers.recognize).toEqual([]); expect(node('nextBtn').disabled).toBe(true); env.choose(env.BY_ID.recognize, 1); expect(node('nextBtn').disabled).toBe(false);
  });
  it('preserves conditional hiding and next-question progression when demo answers are edited', () => {
    const { env } = engine('?prefill=demo'); env.render(); const count = env.order.length;
    env.pos = env.order.indexOf('weird'); env.choose(env.BY_ID.weird, 12); expect(env.answers.weird).toEqual([12]); expect(env.order).not.toContain('weirdWorst'); expect(env.order).toHaveLength(count - 1);
    env.choose(env.BY_ID.weird, 0); expect(env.order).toContain('weirdWorst'); expect(env.answers.weirdWorst).toBeUndefined(); env.next();
    expect(env.order[env.pos]).toBe('weirdWorst');
  });
  it('keeps non-demo answers empty, single-click auto-advance and original multi-only Continue display', () => {
    for (const query of ['', '?prfill=demo', '?prefill=live']) {
      const { env, node, timers } = engine(query), old = engine(query, baseline); env.render(); old.env.render();
      expect(JSON.stringify(env.QUESTIONS)).toBe(JSON.stringify(old.env.QUESTIONS)); expect(JSON.stringify(env.answers)).toBe(JSON.stringify(old.env.answers));
      expect(node('nextBtn').disabled).toBe(true); env.pos = env.order.indexOf('age'); env.render(); expect(node('nextBtn').classList.contains('hidden')).toBe(true);
      env.choose(env.BY_ID.age, 2); expect(timers).toHaveLength(1); const p = env.pos; timers[0](); expect(env.pos).toBe(p + 1);
    }
  });
  it('refills only sample answers on retake, never prefills contact fields or submits automatically', () => {
    const { env, node } = engine('?prefill=demo'); env.render();
    node('gateName').value = 'Synthetic Quiz'; node('gateEmail').value = 'synthetic.quiz@example.com'; node('gatePhone').value = '2025550100';
    node('gateForm').handlers.submit({ preventDefault() {} }); expect(env.window.__quizSubmission).not.toBeNull();
    env.answers.age = 0; node('againBtn').handlers.click(); expect(env.answers.age).toBe(2); expect(env.pos).toBe(0);
    expect(env.window.__quizSubmission).toBeNull(); expect(node('submissionData').textContent).toBe('');
    for (const id of ['gateName', 'gateEmail', 'gatePhone']) expect(node(id).value).toBe('');
  });
  it('keeps every CSS, question definition, report/booking/download implementation and contact form byte-identical', () => {
    expect(html.slice(0, html.indexOf('    /* ================= Engine ================= */'))).toBe(baseline.slice(0, baseline.indexOf('    /* ================= Engine ================= */')));
    const beforeTail = baseline.slice(baseline.indexOf('    /* ================= Scoring'));
    const actualTail = html.slice(html.indexOf('    /* ================= Scoring')).replace('        if (demoPrefill) prefillDemoAnswers();\n', '');
    expect(actualTail).toBe(beforeTail);
    expect(html).not.toMatch(/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
  });
});
