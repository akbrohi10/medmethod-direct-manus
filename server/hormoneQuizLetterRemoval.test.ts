import { createHash } from "node:crypto"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "83445913";
const page = "client/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizLetterRemovalScope.ts";
const direct = "server/hormoneQuizLetterRemoval.test.ts";
const beforeSHA = "3eec5f60a3933f6acf15033e1a7d0327b735adc85781c3566628c393d839df8e";
const afterSHA = "e40299c8b3ad624d7545ab770c95dd46537e311078dc16d2466563b6705c729d";
const helperSHA = "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d";
const read = (p: string) => inverseHormoneQuizDoctorIntro(p, readFileSync(resolve(root, p), "utf8"));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz doctor introduction inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const html = read(page), original = before(page);
const files = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const fragment = files[page][0];
const letterEmission = fragment.old.slice(fragment.new.indexOf("      var ord"), -"      var ord = orderDrivers(metrics, fix);\n".length);
const aliases = [page, resolve(root, page), page.replaceAll("/", "\\"), "C:\\project\\" + page.replaceAll("/", "\\"), "dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"];
const section = (s: string, start: string, end: string) => { const a = s.indexOf(start), b = s.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen letter-removal section"); return s.slice(a, b); };
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const styles = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const reportCode = (s: string) => section(s, "    function renderReport(){", "    </script>");
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
  runInNewContext(section(s, "    var GOAL_DRIVER =", "    function ans(") + reportCode(s) + "\nrenderReport();", env);
  const output = node("reportBody").innerHTML;
  node("dlBtn").handlers.click();
  return { output, download, filename };
}
const scenarios: Scenario[] = [
  { index: 87, level: 1, fix: "Sleep through the night", recognize: [0, 1, 9], weight: "I gained 10 lb" },
  { index: 40, level: 3, fix: "The weight", recognize: [0, 1, 2, 3, 4], weight: "I gained 15 or more" },
  { index: 95, level: 0, fix: "My libido", recognize: [9], weight: "No change" },
  { index: null, level: 0, fix: null, recognize: [], weight: null },
];

describe("Hormone quiz Dear friend removal — exact letter-only checkpoint scope", () => {
  it("pins the complete source and pure helper and restores exactly six removed emission lines to 83445913 for every supported alias", () => {
    expect(hash(original)).toBe(beforeSHA); expect(hash(html)).toBe(afterSHA); expect(hash(read(helper))).toBe(helperSHA);
    expect(Object.keys(files)).toEqual([page]); expect(files[page]).toHaveLength(1);
    expect(original.split(fragment.old).length - 1).toBe(1); expect(html.split(fragment.new).length - 1).toBe(1);
    expect(html).toBe(original.replace(fragment.old, fragment.new)); expect(html.split("\n").length - original.split("\n").length).toBe(-6);
    expect(letterEmission.split("\n").filter(Boolean)).toHaveLength(6);
    expect(html.replace(fragment.new, "FROZEN_LETTER_BOUNDARY")).toBe(original.replace(fragment.old, "FROZEN_LETTER_BOUNDARY"));
    for (const alias of aliases) { expect(inverseHormoneQuizLetterRemoval(alias, html)).toBe(original); expect(inverseHormoneQuizLetterRemoval(alias, original)).toBe(original); expect(inverseHormoneQuizLetterRemoval(alias, inverseHormoneQuizLetterRemoval(alias, html))).toBe(original); }
  });

  it("rejects missing duplicate mixed and tampered fragments while retaining unrelated bytes and ignoring nonquiz lookalike paths", () => {
    for (const alias of aliases) {
      for (const bad of ["", html.replace(fragment.new, ""), html + fragment.new, html + fragment.old, html.replace(fragment.new, fragment.new.replace("var fix", "var unapproved")), original + fragment.old, original.replace(fragment.old, ""), original + fragment.new]) expect(() => inverseHormoneQuizLetterRemoval(alias, bad)).toThrow("Quiz letter removal scope mismatch");
      expect(inverseHormoneQuizLetterRemoval(alias, "UNAPPROVED\n" + html)).toBe("UNAPPROVED\n" + original); expect(inverseHormoneQuizLetterRemoval(alias, html + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      expect(hash(inverseHormoneQuizLetterRemoval(alias, html + "\nUNAPPROVED"))).not.toBe(beforeSHA);
    }
    for (const outside of [page + ".bak", "other/" + page + ".copy", "client/public/other.html", "client/intake/index.html", "server/unrelated.ts", "dist/public/not-hormone-symptom-quiz.html"]) { expect(inverseHormoneQuizLetterRemoval(outside, html)).toBe(html); expect(inverseHormoneQuizLetterRemoval(outside, "")).toBe(""); }
  });

  it("renders score first without the Dear friend letter and preserves every remaining report byte for synthetic scored and unscored reports", () => {
    expect(html).not.toContain("Dear friend,"); expect(html).not.toContain("Before the numbers, here is what you told us");
    for (const scenario of scenarios) {
      const current = render(html, scenario), previous = render(original, scenario);
      expect(previous.output.match(/<div class="letter">[\s\S]*?<\/div>/g)).toHaveLength(1);
      expect(current.output).toBe(previous.output.replace(/<div class="letter">[\s\S]*?<\/div>/, ""));
      expect(current.output).not.toMatch(/Dear friend|class="letter"|class="glance"|Before the numbers|None of these arrived on their own/);
      if (scenario.index !== null) expect(current.output.startsWith('<div class="score-callout"><div class="lbl">Your Balance Index</div>')).toBe(true);
      else expect(current.output.startsWith('<nav class="report-start-actions" aria-label="Next steps">')).toBe(true);
      expect(current.output.indexOf('<nav class="report-start-actions"')).toBeLessThan(current.output.indexOf('<div class="pattern"'));
      expect(current.output.match(/Driver No\. [1-5] —/g)).toHaveLength(5); expect(current.output).toContain("7 days of follow-up messaging");
    }
  });

  it("retains every shared variable and the byte-identical download literal and quick-recognition output including filtered none and all driver tiers", () => {
    expect(section(html, "      /* The Mirror letter */", '      var fix = ans("fixFirst");')).toBe(section(original, "      /* The Mirror letter */", '      var fix = ans("fixFirst");'));
    for (const declaration of ['var wn = ans("wakeNights"), wt = ans("wakeTime");', 'var fl = ans("flashes");', 'var wc = ans("weightChange");', 'var recogPicked = (answers["recognize"] || [])', 'var fix = ans("fixFirst");', 'var ord = orderDrivers(metrics, fix);']) expect(html).toContain(declaration);
    expect(section(html, '      $("dlBtn").addEventListener("click", function(){', '    function driver(')).toBe(section(original, '      $("dlBtn").addEventListener("click", function(){', '    function driver('));
    expect(html).toContain('a.download = "my-hormone-report.txt"'); expect(html).toContain('lines.push("", "Next step: book a discovery call with the MedMethod Direct care team at medmethoddirect.com.");');
    for (const scenario of scenarios) {
      const current = render(html, scenario), previous = render(original, scenario);
      expect(current.download).toBe(previous.download); expect(current.filename).toBe(previous.filename); expect(current.filename).toBe("my-hormone-report.txt");
      const picked = scenario.recognize.filter(i => i !== 9);
      if (picked.length) expect(current.download).toContain("Quick check — you recognized " + picked.length + " of the familiar ones: " + picked.map(i => "SYNTHETIC_LOCAL_RECOGNITION_" + i).join(", "));
      else expect(current.download).not.toContain("Quick check —");
      if (scenario.level > 0 && scenario.index !== null) { expect(current.output).toContain("5 nights"); expect(current.output).toContain("2–3 a.m."); }
      if (scenario.level === 3) expect(current.output).toContain("+15 lb or more");
      if (scenario.fix === "The weight") expect(current.download).toContain("Drivers, in your report's order: No. 4, No. 1, No. 2, No. 3, No. 5");
    }
  });

  it("keeps all CSS questions scoring remaining report closing actions score-adjacent navigation and the existing mobile pill byte-identical", () => {
    expect(styles(html)).toEqual(styles(original)); expect(styles(html)).toHaveLength(1);
    expect(section(html, "    var QUESTIONS =", "    function renderReport")).toBe(section(original, "    var QUESTIONS =", "    function renderReport"));
    expect(html.slice(0, html.indexOf("    function renderReport"))).toBe(original.slice(0, original.indexOf("    function renderReport")));
    expect(html.slice(html.indexOf("      var ord = orderDrivers(metrics, fix);"))).toBe(original.slice(original.indexOf("      var ord = orderDrivers(metrics, fix);")));
    for (const [start, end] of [["      /* Balance Index */", "      /* Pattern */"], ["      /* Closing —", '      $("reportBody").innerHTML = html;'], ['<section id="report"', "</section>"]]) expect(section(html, start, end)).toBe(section(original, start, end));
    expect(html.match(/<a class="report-floating-cta"/g)).toHaveLength(1); expect(html.match(/<nav class="report-start-actions"/g)).toHaveLength(1);
    expect(scripts(inverseHormoneQuizLetterRemoval(page, html))).toEqual(scripts(original)); expect(scripts(html)).toHaveLength(3);
    for (const s of scripts(html).filter(s => !/\bsrc=/.test(s))) expect(() => new Script(s.slice(s.indexOf(">") + 1, s.lastIndexOf("</script>")))).not.toThrow();
  });

  it("preserves all eleven paired capture masks CSP referrer routing and transport without introducing events network or tracking", () => {
    const tags = (s: string) => s.match(/<[a-z][^>]*>/gi) ?? [];
    const masked = (s: string) => tags(s).filter(t => /\bdata-hj-suppress(?:\s|>)/.test(t) && /\bdata-cs-mask(?:\s|>)/.test(t));
    expect(masked(html)).toEqual(masked(original)); expect(masked(html)).toHaveLength(11); expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    const policies = (s: string) => tags(s).filter(t => /http-equiv="Content-Security-Policy"|name="referrer"/.test(t));
    expect(policies(html)).toEqual(policies(original)); expect(policies(html)).toHaveLength(2);
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hotjar|contentsquare|clarity\.ms|fullstory|mouseflow|smartlook|_hjSettings|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    expect(fragment.new).not.toMatch(/<script|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|mmdQuizComplete|mmdQuizReset|addEventListener|removeAttribute|\.dataset/);
    expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
    expect(html.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g)).toEqual(original.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g));
  });

  it("preserves every other production backend transport page and all frozen fixtures with only the exact new pure helper and direct-test paths", () => {
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle").trim().split("\n");
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) {
      const current = readFileSync(resolve(root, p)); const previous = execFileSync("git", ["show", baseline + ":" + p], { cwd: root });
      expect(p === page ? Buffer.from(inverseHormoneQuizLetterRemoval(p, inverseHormoneQuizDoctorIntro(p, current.toString("utf8")))) : current, p).toEqual(previous);
    }
    const fixtures = git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures").trim().split("\n"); expect(fixtures).toHaveLength(28); for (const p of fixtures) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    for (const p of scope.filter(p => p.includes("."))) expect(read(p), p).toBe(before(p));
    const changed = git("diff", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean).filter(p => !/^server\/[^/]+\.test\.ts$/.test(p));
    expect(changed.filter(p => p !== helper)).toEqual([page]);
    const oldPaths = new Set(git("ls-tree", "-r", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean));
    const currentPaths = new Set(git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(Boolean));
    expect([...currentPaths].filter(p => !oldPaths.has(p)).sort()).toEqual([helper, direct].sort());
    expect(read(helper).split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/); expect(html).not.toContain("fixtures/hormoneQuizLetterRemovalScope");
  });
});
