import { createHash } from "node:crypto"; import { isolationHistoricalSource, isolationInventoryPin } from "./fixtures/hormoneQuizIsolationScope"; const isolationHelperSHA = "7a6892924c391c4d9cce8520a5cf52aa987d7579c653ea6af20beb354b411c6c"; import { createHash as previewResultsCreateHash } from "node:crypto"; import { inverseHormoneQuizPreviewResults as qpi, previewResultsHistoricalSource, previewResultsApprovedInventory } from "./fixtures/hormoneQuizPreviewResultsScope"; const previewResultsHelperSHA = "20b894339a1ed562393fca6651ab4e88c37cc59d22afc63f8cbf36cacb155f8b"; import { createHash as publicMarketingCreateHash } from "node:crypto"; import { publicMarketingHistoricalSource, publicMarketingApprovedInventory } from "./fixtures/publicMarketingPixelScope"; const publicMarketingHelperSHA = "e3afb1740354430518b39a9e1102b8b1afec18fc53796c6e9879ea3472a97e72";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizOnlineCopy } from "./fixtures/hormoneQuizOnlineCopyScope";
import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope";
import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "9a26b88a";
const page = "client/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizOnlineCopyScope.ts";
const direct = "server/hormoneQuizOnlineCopy.test.ts";
const beforeSHA = "e30840b323f11c4096957a85635a196d20f3ab4bfc717e1c7b4286527f26671a";
const afterSHA = "dd1e18e38a7a3717a602619e0cf30b09ce24cb2203309b50ea8e848516e5b1e8";
const helperSHA = "0c00547da82534553fcaeef64060f14c2077c34b7a0cff7e7053d9e4fd8de949";
const oldOffer = '<p class="report-text-visit-offer"><strong>Your first text visit is FREE</strong>Includes 7 days of follow-up messaging.</p>';
const newOffer = '<p class="report-text-visit-offer"><strong>Your first text visit is FREE</strong>100% online, by text. Includes 7 days of follow-up messaging.</p>';
const sentence = "100% online, by text. Includes 7 days of follow-up messaging.";
const read = (p: string) => isolationHistoricalSource(p, previewResultsHistoricalSource(p, publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA), s => hash(s), isolationHelperSHA);
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !publicMarketingApprovedInventory(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !previewResultsApprovedInventory(p, publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA, p === "server/_core/index.ts" && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizIsolationScope.ts" ? isolationHelperSHA : isolationInventoryPin(p); if (!pin) return true; if (hash(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) !== pin) throw Error("Quiz isolation inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const html = read(page), original = before(page);
const aliases = [page, resolve(root, page), page.replaceAll("/", "\\"), "C:\\project\\" + page.replaceAll("/", "\\"), "dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"];
const section = (s: string, start: string, end: string) => { const a = s.indexOf(start), b = s.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen online-copy section"); return s.slice(a, b); };
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const styles = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
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

describe("Hormone quiz online-care sentence — exact copy-only checkpoint scope", () => {
  it("pins full source and CSS and inverses one exact fragment and one line while preserving every other production path and configuration byte", () => {
    expect(hash(original)).toBe(beforeSHA); expect(hash(html)).toBe(afterSHA); expect(hash(read(helper))).toBe(helperSHA);
    expect(original.split(oldOffer).length - 1).toBe(1); expect(html.split(newOffer).length - 1).toBe(1);
    expect(html).toBe(original.replace(oldOffer, newOffer)); expect(inverseHormoneQuizOnlineCopy(page, html)).toBe(original);
    const lines = html.split("\n"), oldLines = original.split("\n"); expect(lines).toHaveLength(oldLines.length);
    expect(lines.filter((line, i) => line !== oldLines[i])).toEqual(["        + '" + newOffer + "'"]);
    expect(html.replace(newOffer, "FROZEN_OFFER_BOUNDARY")).toBe(original.replace(oldOffer, "FROZEN_OFFER_BOUNDARY"));
    expect(styles(html)).toEqual(styles(original)); expect(html.match(/<link\b[^>]*>/g)).toEqual(original.match(/<link\b[^>]*>/g));
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle").trim().split("\n");
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) {
      const current = (p === "server/_core/index.ts" ? Buffer.from(previewResultsHistoricalSource(p, (p === "server/_core/vite.ts" || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(p) ? Buffer.from(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p)).toString("utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) : readFileSync(resolve(root, p))).toString("utf8"), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA)) : (p === "server/_core/vite.ts" || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(p) ? Buffer.from(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p)).toString("utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) : readFileSync(resolve(root, p)))), previous = execFileSync("git", ["show", baseline + ":" + p], { cwd: root });
      expect(p === page ? Buffer.from(inverseHormoneQuizOnlineCopy(p, current.toString("utf8"))) : current, p).toEqual(previous);
    }
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    for (const p of scope.filter(p => p.includes("."))) expect(read(p), p).toBe(before(p));
    expect(git("diff", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean).filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))).toEqual([page]);
    const oldPaths = new Set(git("ls-tree", "-r", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean));
    const currentPaths = new Set(git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(Boolean));
    expect([...currentPaths].filter(p => !oldPaths.has(p)).sort()).toEqual([helper, direct].sort());
  });

  it("renders the exact approved sentence under the unchanged strong FREE heading before the primary CTA and changes no other report model handlers or native TXT download", () => {
    for (const scenario of scenarios) {
      const current = render(html, scenario), previous = render(original, scenario);
      expect(current.output.match(/<p class="report-text-visit-offer">[\s\S]*?<\/p>/g)).toEqual([newOffer]);
      expect(current.output.split(sentence).length - 1).toBe(1); expect(current.output).not.toContain(oldOffer);
      expect(current.output.match(/<strong>Your first text visit is FREE<\/strong>/g)).toEqual(["<strong>Your first text visit is FREE</strong>"]);
      const actions = section(current.output, '<nav class="report-start-actions" aria-label="Next steps">', "</nav>");
      const cta = '<a class="cta" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener">Start my free text visit</a>';
      expect(actions).toContain(newOffer + cta); expect(current.output.indexOf(newOffer)).toBeLessThan(current.output.indexOf(cta));
      expect(current.output.replace(newOffer, oldOffer)).toBe(previous.output);
      expect({ ...current, output: current.output.replace(newOffer, oldOffer) }).toEqual(previous);
      expect(current.output.match(/Driver No\. [1-5] —/g)).toHaveLength(5); expect(current.output).not.toMatch(/Dear friend|class="letter"|class="glance"/);
      for (const [start, end] of [['<section class="report-doctor-intro"', "</section>"], ['<div class="closing">', "</div></div>"]]) expect(section(current.output, start, end)).toBe(section(previous.output, start, end));
      expect(current.filename).toBe("my-hormone-report.txt"); expect(current.download).toBe(previous.download);
      expect(current.download).toMatch(/^MY HORMONE SYMPTOM CHECK — REPORT\n/); expect(current.download).not.toMatch(/100% online|Includes 7 days|Your first text visit is FREE|Start my free text visit|Meet Dr\.|report-top/);
      const picked = scenario.recognize.filter(i => i !== 9);
      if (picked.length) expect(current.download).toContain("Quick check — you recognized " + picked.length + " of the familiar ones: " + picked.map(i => "SYNTHETIC_LOCAL_RECOGNITION_" + i).join(", ")); else expect(current.download).not.toContain("Quick check —");
      if (scenario.fix === "The weight") expect(current.download).toContain("Drivers, in your report's order: No. 4, No. 1, No. 2, No. 3, No. 5");
    }
    for (const [start, end] of [["    var QUESTIONS =", "    function renderReport"], ['      $("dlBtn").addEventListener("click", function(){', "    function driver("]]) expect(section(html, start, end)).toBe(section(original, start, end));
    expect(section(html, "    function renderReport(){", "    </script>").replace(newOffer, oldOffer)).toBe(section(original, "    function renderReport(){", "    </script>"));
  });

  it("keeps the pure helper alias-exact and fail-closed for corrupt duplicate and mixed fragments and preserves frozen fixtures accessibility privacy and older inverse composition", () => {
    for (const alias of aliases) {
      expect(inverseHormoneQuizOnlineCopy(alias, html)).toBe(original); expect(inverseHormoneQuizOnlineCopy(alias, original)).toBe(original);
      expect(inverseHormoneQuizOnlineCopy(alias, inverseHormoneQuizOnlineCopy(alias, html))).toBe(original);
      for (const bad of ["", html.replace(newOffer, ""), html + newOffer, html.replace(newOffer, newOffer.replace("100%", "99%")), original + oldOffer, original.replace(oldOffer, ""), original + newOffer, html + oldOffer]) expect(() => inverseHormoneQuizOnlineCopy(alias, bad)).toThrow("Quiz online copy scope mismatch");
      expect(inverseHormoneQuizOnlineCopy(alias, "UNAPPROVED\n" + html)).toBe("UNAPPROVED\n" + original); expect(inverseHormoneQuizOnlineCopy(alias, html + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      expect(hash(inverseHormoneQuizOnlineCopy(alias, html + "\nUNAPPROVED"))).not.toBe(beforeSHA);
      expect(inverseHormoneQuizMobileTop(alias, inverseHormoneQuizOnlineCopy(alias, html))).toBe(inverseHormoneQuizMobileTop(alias, original));
      expect(inverseHormoneQuizDoctorIntro(alias, inverseHormoneQuizMobileTop(alias, inverseHormoneQuizOnlineCopy(alias, html)))).toBe(inverseHormoneQuizDoctorIntro(alias, inverseHormoneQuizMobileTop(alias, original)));
    }
    for (const outside of [page + ".bak", "other/" + page + ".copy", "client/public/other.html", "client/intake/index.html", "server/unrelated.ts", "dist/public/not-hormone-symptom-quiz.html", "prefixclient/public/hormone-symptom-quiz.html"]) { expect(inverseHormoneQuizOnlineCopy(outside, html)).toBe(html); expect(inverseHormoneQuizOnlineCopy(outside, "")).toBe(""); }
    const fixtures = git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures").trim().split("\n"); expect(fixtures).toHaveLength(31); expect(fixtures).not.toContain(helper);
    for (const p of fixtures) expect(read(p), p).toBe(before(p));
    expect(read(helper).split("\n").slice(1).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/); expect(html).not.toContain("fixtures/hormoneQuizOnlineCopyScope");
    const tags = (s: string) => s.match(/<[a-z][^>]*>/gi) ?? [];
    const masked = (s: string) => tags(s).filter(t => /\bdata-hj-suppress(?:\s|>)/.test(t) && /\bdata-cs-mask(?:\s|>)/.test(t));
    expect(masked(html)).toEqual(masked(original)); expect(masked(html)).toHaveLength(11); expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    const policies = (s: string) => tags(s).filter(t => /http-equiv="Content-Security-Policy"|name="referrer"/.test(t)); expect(policies(html)).toEqual(policies(original)); expect(policies(html)).toHaveLength(2);
    expect(tags(html)).toEqual(tags(original)); expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hotjar|contentsquare|clarity\.ms|fullstory|mouseflow|smartlook|_hjSettings|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    expect(newOffer).not.toMatch(/<script|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|mmdQuizComplete|mmdQuizReset|addEventListener|removeAttribute|\.dataset|onclick|data-/);
    expect(scripts(html).map(s => s.replace(newOffer, oldOffer))).toEqual(scripts(original)); expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
    expect(html.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g)).toEqual(original.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g));
    for (const s of scripts(html).filter(s => !/\bsrc=/.test(s))) expect(() => new Script(s.slice(s.indexOf(">") + 1, s.lastIndexOf("</script>")))).not.toThrow();
  });
});
