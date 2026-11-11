import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "ef389788";
const page = "client/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizMobileTopScope.ts";
const direct = "server/hormoneQuizMobileTop.test.ts";
const beforeSHA = "36bad6087a2fe01313e2b2aebb63556a4a2070ede12f310a4dfbebdd31a78256";
const afterSHA = "e30840b323f11c4096957a85635a196d20f3ab4bfc717e1c7b4286527f26671a";
const helperSHA = "c44fd9ec9f7b8f160216ac64073c060a96a2b388c82c4ca0f6c47b7d51f6ebcd";
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const html = read(page), original = before(page);
const files = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const fragments = files[page];
const aliases = [page, resolve(root, page), page.replaceAll("/", "\\"), "C:\\project\\" + page.replaceAll("/", "\\"), "dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"];
const section = (s: string, start: string, end: string) => { const a = s.indexOf(start), b = s.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen mobile-top section"); return s.slice(a, b); };
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const styles = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const top = section(html, '        <nav class="report-top-strip"', "        </nav>") + "        </nav>";
const css = fragments[0].new.slice(0, -fragments[0].old.length);
type Scenario = { index: number | null; level: number; fix: string | null; recognize: number[]; weight: string | null };
function render(s: string, scenario: Scenario) {
  const nodes: Record<string, { innerHTML: string; handlers: Record<string, () => void>; addEventListener: (event: string, callback: () => void) => void }> = {};
  const node = (id: string) => nodes[id] ??= { innerHTML: "", handlers: {}, addEventListener(event, callback) { this.handlers[event] = callback; } };
  let download = "", filename = "";
  const scores = Object.fromEntries(["sleep", "temp", "mood", "body", "intimacy"].map(k => [k, scenario.index]));
  const domains = Object.fromEntries(Object.keys(scores).map(k => [k, { name: "SYNTHETIC_LOCAL_" + k, note: "SYNTHETIC_LOCAL_NOTE" }]));
  const metrics = Object.fromEntries([1, 2, 3, 4, 5].map(k => [k, { metric: scenario.index, fam: "somato" }]));
  const values: Record<string, string | null> = { wakeNights: "5 nights", wakeTime: "2–3 a.m.", flashes: "3", words: "Often", weightChange: scenario.weight, weightWhere: "Mostly my belly and waist", afternoon: "Running on empty — synthetic", fixFirst: scenario.fix };
  const env = { $: node, gateEl: { classList: { add() {} } }, reportEl: { classList: { remove() {} } }, window: { scrollTo() {} }, computeModel: () => ({ scores, index: scenario.index }), pickPattern: () => ({ name: "SYNTHETIC_LOCAL_PATTERN", text: "SYNTHETIC_LOCAL_TEXT", domain: "sleep" }), driverMetrics: () => metrics, ans: (id: string) => values[id] ?? null, answers: { weird: [0], recognize: scenario.recognize }, BY_ID: { weird: "weird", recognize: "recognize" }, label: (_q: string, i: number) => i === 9 ? "None of these" : "SYNTHETIC_LOCAL_RECOGNITION_" + i, DOMAINS: domains, FAMILY: { sleep: "somato", temp: "somato", mood: "psych", body: "somato", intimacy: "uro" }, BANDS: { somato: [[85, "In balance"]], psych: [[91, "In balance"]], uro: [[96, "In balance"]] }, bandOf: (_fam: string, v: number | null) => v === null ? null : ({ name: "SYNTHETIC_LOCAL_BAND", level: scenario.level }), bandText: () => "SYNTHETIC_LOCAL_BAND_TEXT", Blob: class { constructor(parts: string[]) { download = parts.join(""); } }, URL: { createObjectURL: () => "blob:synthetic-local-only", revokeObjectURL() {} }, document: { createElement: () => ({ href: "", download: "", click() { filename = this.download; }, remove() {} }), body: { appendChild() {} } }, setTimeout: () => 0 };
  runInNewContext(section(s, "    var GOAL_DRIVER =", "    function ans(") + section(s, "    function renderReport(){", "    </script>") + "\nrenderReport();", env);
  const output = node("reportBody").innerHTML;
  node("dlBtn").handlers.click();
  return { output, download, filename, handlers: Object.fromEntries(Object.entries(nodes).map(([id, n]) => [id, Object.keys(n.handlers)])) };
}
const scenarios: Scenario[] = [
  { index: 87, level: 1, fix: "Sleep through the night", recognize: [0, 1, 9], weight: "I gained 10 lb" },
  { index: 40, level: 3, fix: "The weight", recognize: [0, 1, 2, 3, 4], weight: "I gained 15 or more" },
  { index: 95, level: 0, fix: "My libido", recognize: [9], weight: "No change" },
  { index: null, level: 0, fix: null, recognize: [], weight: null },
];

describe("Hormone quiz mobile top strip — exact additive both-controls checkpoint scope", () => {
  it("pins the entire page and pure helper and inverses exactly two independent additions to ef389788 for every supported source and dist alias", () => {
    expect(hash(original)).toBe(beforeSHA); expect(hash(html)).toBe(afterSHA); expect(hash(read(helper))).toBe(helperSHA);
    expect(Object.keys(files)).toEqual([page]); expect(fragments).toHaveLength(2);
    let expected = original;
    for (const f of fragments) { expect(original.split(f.old).length - 1).toBe(1); expect(html.split(f.new).length - 1).toBe(1); expected = expected.replace(f.old, f.new); }
    expect(html).toBe(expected);
    const outside = (s: string, side: "old" | "new") => fragments.reduce((text, f, i) => text.replace(f[side], "FROZEN_MOBILE_TOP_BOUNDARY_" + i), s);
    expect(outside(html, "new")).toBe(outside(original, "old"));
    for (const alias of aliases) { expect(inverseHormoneQuizMobileTop(alias, html)).toBe(original); expect(inverseHormoneQuizMobileTop(alias, original)).toBe(original); expect(inverseHormoneQuizMobileTop(alias, inverseHormoneQuizMobileTop(alias, html))).toBe(original); }
  });

  it("rejects missing duplicate mixed and tampered independent fragments and preserves unrelated bytes and path-lookalike negative guards", () => {
    for (const alias of aliases) {
      expect(() => inverseHormoneQuizMobileTop(alias, "")).toThrow("Quiz mobile top strip scope mismatch");
      for (const f of fragments) for (const bad of [html.replace(f.new, ""), html + f.new, html.replace(f.new, f.old), html.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1)), original + f.old, original.replace(f.old, ""), original + f.new]) expect(() => inverseHormoneQuizMobileTop(alias, bad)).toThrow("Quiz mobile top strip scope mismatch");
      expect(inverseHormoneQuizMobileTop(alias, "UNAPPROVED\n" + html)).toBe("UNAPPROVED\n" + original); expect(inverseHormoneQuizMobileTop(alias, html + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      expect(hash(inverseHormoneQuizMobileTop(alias, html + "\nUNAPPROVED"))).not.toBe(beforeSHA);
    }
    for (const outside of [page + ".bak", "other/" + page + ".copy", "client/public/other.html", "client/intake/index.html", "server/unrelated.ts", "dist/public/not-hormone-symptom-quiz.html", "prefixclient/public/hormone-symptom-quiz.html"]) { expect(inverseHormoneQuizMobileTop(outside, html)).toBe(html); expect(inverseHormoneQuizMobileTop(outside, "")).toBe(""); }
  });

  it("adds only the approved static named navigation portrait identity free offer and native accessible intake link inside the initially hidden paired-masked report", () => {
    expect(top).toBe('        <nav class="report-top-strip" aria-label="Free text visit with Dr. Al-Deek">\n          <div class="report-top-inner">\n            <img class="report-top-photo" src="/assets/dr-jumana-al-deek-portrait.webp" alt="Dr. Jumana Al-Deek, DO" width="40" height="40" loading="lazy" decoding="async" referrerpolicy="no-referrer">\n            <div class="report-top-identity"><span class="report-top-name">Dr. Al-Deek</span><span class="report-top-offer">First text visit <strong>FREE</strong></span></div>\n            <a class="report-top-button" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener">Start my free text visit</a>\n          </div>\n        </nav>');
    expect(html.match(/<nav class="report-top-strip"/g)).toHaveLength(1);
    expect(section(html, '<section id="report" class="report hidden" data-hj-suppress data-cs-mask>', "</section>")).toContain(top);
    expect(html.indexOf(top)).toBeLessThan(html.indexOf('<div id="submissionData"')); expect(html.indexOf(top)).toBeLessThan(html.indexOf('<div id="reportBody"'));
    expect(top.match(/<a\b[^>]*>[^<]*<\/a>/g)).toEqual(['<a class="report-top-button" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener">Start my free text visit</a>']);
    const url = new URL(/href="([^"]+)"/.exec(top)![1]); expect(url.href).toBe("https://intake.medmethoddirect.com/"); expect(url.search).toBe(""); expect(url.hash).toBe("");
    expect(top).not.toMatch(/<form|<input|<button|tabindex|role=|aria-hidden|onclick|data-|id=|style=|<script/i);
    expect(read("server/intakeDoctorPortraitAsset.ts")).toBe(before("server/intakeDoctorPortraitAsset.ts"));
  });

  it("keeps desktop display none and mobile-only top-fixed safe-area rules report clearance two-sided focus scrolling and visible native focus without changing any previous stylesheet byte", () => {
    expect(css).toContain(".report-top-strip { display: none; }"); expect(css.match(/@media/g)).toHaveLength(2);
    expect(css).toContain("@media (max-width: 700px) {"); expect(css).toContain("@media (max-width: 700px) and (prefers-color-scheme: dark) {");
    expect(css).toContain(".report { padding-top: calc(100px + env(safe-area-inset-top, 0px)); }");
    expect(css).toContain("html:has(#report:not(.hidden)) {\n          scroll-padding-top: calc(88px + env(safe-area-inset-top, 0px));\n          scroll-padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));\n        }");
    expect(css).toContain("display: block; position: fixed; z-index: 60; top: 0; left: 0; right: 0;");
    expect(css).toContain("padding-top: env(safe-area-inset-top, 0px); background: var(--paper);");
    expect(css).toContain("grid-template-columns: 40px minmax(0, 1fr) minmax(124px, 128px)");
    expect(css).toContain("padding: 8px max(12px, env(safe-area-inset-right, 0px)) 8px max(12px, env(safe-area-inset-left, 0px))");
    expect(css).toContain("width: 40px; height: 40px;"); expect(css).toContain("object-fit: cover; object-position: 50% 28%");
    expect(css).toContain("min-height: 48px;"); expect(css).toContain(".report-top-button:focus-visible { outline: 3px solid var(--rasp); outline-offset: 3px; }");
    expect(css).not.toMatch(/@import|url\(|report-floating-cta|report-doctor|display:\s*contents|outline:\s*(?:0|none)|pointer-events|visibility:\s*hidden/);
    expect(styles(html.replace(fragments[0].new, fragments[0].old))).toEqual(styles(original));
  });

  it("preserves the complete rendered report all driver tiers full physician introduction every handler and exact native download across synthetic scored unscored goal-led and filtered-recognition reports", () => {
    for (const scenario of scenarios) {
      const current = render(html, scenario), previous = render(original, scenario);
      expect(current).toEqual(previous); expect(current.output).not.toContain("report-top-strip");
      expect(current.output.match(/Driver No\. [1-5] —/g)).toHaveLength(5); expect(current.output).not.toMatch(/Dear friend|class="letter"|class="glance"/);
      const intro = section(current.output, '<section class="report-doctor-intro"', "</section>") + "</section>";
      expect(intro).toBe(section(previous.output, '<section class="report-doctor-intro"', "</section>") + "</section>");
      expect(intro).toContain("Meet Dr. Jumana Al-Deek, DO"); expect(intro).toContain("Family Physician<br>Menopause Society Certified Practitioner");
      expect(current.output.indexOf(intro)).toBeLessThan(current.output.indexOf('<nav class="report-start-actions"')); expect(current.output.indexOf(intro)).toBeLessThan(current.output.indexOf('<div class="pattern"'));
      expect(current.filename).toBe("my-hormone-report.txt"); expect(current.download).not.toMatch(/Meet Dr\.|Start my free text visit|report-doctor|report-top/);
      const picked = scenario.recognize.filter(i => i !== 9);
      if (picked.length) expect(current.download).toContain("Quick check — you recognized " + picked.length + " of the familiar ones: " + picked.map(i => "SYNTHETIC_LOCAL_RECOGNITION_" + i).join(", ")); else expect(current.download).not.toContain("Quick check —");
      if (scenario.fix === "The weight") expect(current.download).toContain("Drivers, in your report's order: No. 4, No. 1, No. 2, No. 3, No. 5");
    }
    for (const [start, end] of [["    var QUESTIONS =", "    function renderReport"], ["    function renderReport(){", "    </script>"], ['      $("dlBtn").addEventListener("click", function(){', "    function driver("]]) expect(section(html, start, end)).toBe(section(original, start, end));
    expect(html.match(/<a class="report-floating-cta"[^>]*>[^<]*<\/a>/g)).toEqual(original.match(/<a class="report-floating-cta"[^>]*>[^<]*<\/a>/g)); expect(html.match(/Start your free text visit/g)).toHaveLength(1);
    expect(section(html.replace(fragments[1].new, fragments[1].old), '<section id="report"', "</section>")).toBe(section(original, '<section id="report"', "</section>"));
  });

  it("preserves every script byte all eleven initial paired masks CSP referrer hooks transport and privacy without adding health attributes network capture events or JavaScript", () => {
    const tags = (s: string) => s.match(/<[a-z][^>]*>/gi) ?? [];
    const masked = (s: string) => tags(s).filter(t => /\bdata-hj-suppress(?:\s|>)/.test(t) && /\bdata-cs-mask(?:\s|>)/.test(t));
    expect(masked(html)).toEqual(masked(original)); expect(masked(html)).toHaveLength(11); expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    const policies = (s: string) => tags(s).filter(t => /http-equiv="Content-Security-Policy"|name="referrer"/.test(t)); expect(policies(html)).toEqual(policies(original)); expect(policies(html)).toHaveLength(2);
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hotjar|contentsquare|clarity\.ms|fullstory|mouseflow|smartlook|_hjSettings|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    expect(css + top).not.toMatch(/<script|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|mmdQuizComplete|mmdQuizReset|addEventListener|removeAttribute|\.dataset|onclick|data-/);
    expect(scripts(html)).toEqual(scripts(original)); expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
    expect(html.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g)).toEqual(original.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g));
    for (const s of scripts(html).filter(s => !/\bsrc=/.test(s))) expect(() => new Script(s.slice(s.indexOf(">") + 1, s.lastIndexOf("</script>")))).not.toThrow();
  });

  it("leaves all other production assets routing backend configuration and thirty older fixtures byte-identical and permits only the exact new pure-helper and direct-test paths", () => {
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle").trim().split("\n");
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) {
      const current = readFileSync(resolve(root, p)), previous = execFileSync("git", ["show", baseline + ":" + p], { cwd: root });
      expect(p === page ? Buffer.from(inverseHormoneQuizMobileTop(p, current.toString("utf8"))) : current, p).toEqual(previous);
    }
    const fixtures = git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures").trim().split("\n"); expect(fixtures).toHaveLength(30); for (const p of fixtures) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    for (const p of scope.filter(p => p.includes("."))) expect(read(p), p).toBe(before(p));
    const changed = git("diff", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean).filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p)); expect(changed).toEqual([page]);
    const oldPaths = new Set(git("ls-tree", "-r", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean));
    const currentPaths = new Set(git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(Boolean)); expect([...currentPaths].filter(p => !oldPaths.has(p)).sort()).toEqual([helper, direct].sort());
    expect(read(helper).split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/); expect(html).not.toContain("fixtures/hormoneQuizMobileTopScope");
  });
});
