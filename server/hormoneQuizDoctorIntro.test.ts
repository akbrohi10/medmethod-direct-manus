import { createHash } from "node:crypto"; import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope"; import { inverseHormoneQuizOnlineCopy } from "./fixtures/hormoneQuizOnlineCopyScope"; import { gunzipSync as onlineCopyGunzipSync } from "node:zlib"; import { isolationHistoricalSource, isolationInventoryPin } from "./fixtures/hormoneQuizIsolationScope"; const isolationHelperSHA = "7a6892924c391c4d9cce8520a5cf52aa987d7579c653ea6af20beb354b411c6c"; import { createHash as previewResultsCreateHash } from "node:crypto"; import { inverseHormoneQuizPreviewResults as qpi, previewResultsHistoricalSource, previewResultsApprovedInventory } from "./fixtures/hormoneQuizPreviewResultsScope"; const previewResultsHelperSHA = "20b894339a1ed562393fca6651ab4e88c37cc59d22afc63f8cbf36cacb155f8b"; import { createHash as publicMarketingCreateHash } from "node:crypto"; import { publicMarketingHistoricalSource, publicMarketingApprovedInventory } from "./fixtures/publicMarketingPixelScope"; const publicMarketingHelperSHA = "e3afb1740354430518b39a9e1102b8b1afec18fc53796c6e9879ea3472a97e72";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "14761df7";
const page = "client/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizDoctorIntroScope.ts";
const direct = "server/hormoneQuizDoctorIntro.test.ts";
const beforeSHA = "e40299c8b3ad624d7545ab770c95dd46537e311078dc16d2466563b6705c729d";
const afterSHA = "36bad6087a2fe01313e2b2aebb63556a4a2070ede12f310a4dfbebdd31a78256";
const helperSHA = "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c";
const read = (p: string) => inverseHormoneQuizMobileTop(p, ((source: string) => { const entry = (JSON.parse(onlineCopyGunzipSync(Buffer.from("H4sIAAAAAAACA7VUW2/TMBT+K16eUqlkuV86FQRoaC8IofLW9MGxj1uj1A62s61U/e+ctGs7bWgMCaI8Oeec7+LzZetZMLdgLlfarLWCr738+Vk3soVvugscWBc46022nl1Rb+JlWVTQuBFMRGlRllRwmuciiyFqRJRAGIq4ypM0L4uSRTSMw5jFPMqrOE6aKE0yb+wBl8PE+dbTLceRct1p48iWMAPUwQ21K7Ijwug1qT2lOUyY2XRO194Vdiu4+7secqqVCnVauDkL/aJaqeCj7jbn7uBSyHvXG7CPLTlXzpjuYOCyGx8VMK2sI8iEkynxuwmxzki1HJHp2/3pJ3RztlHMx6G6vQXfaO3GpBuNEa93oqy90VnbS9NekuB341ejjZ7TX0o34AVBQM3SHlHniz0u3AM7za09rK29MRkKx8Ml3PEJOaCAYppj3+SERXbPtP1HqMB2rXTYV9cKdQZCtg6M3w2TcQME8S/mtcelEMPU2mvtGywBW3uLQCrW9hysP4DNw8VohH7iJijiTA9X5EC+kwrJ48DpFPsfwvOKlcEYIcN32BOyMMzSgtMyzpI0yxLBKIDI0zAPMVYsDouCJWlT0JAJUUARZgmvIBW85FClFY6ZPCXwW9xjfB9w85RnsRA8ykQiMJhN05SNwDfkuDaQp1XVVDQv0rhII5ZxKKssr8KmiqKqaEK6x1V9214djEQnnjg0HK8wi/6wh36HBl4gyX2dWxl9R66N0QZvZ+BJ9J4o2orxGxZbOW02ZHbznqylXVPHVkMujgiCthYh8Iq/a6lON/x4kcn+gfsOmPMPBnV0CSj+Qy8EmGCIuP88Q6f/3RAh1huDVAKnZ/u19M+hGaH+h89DnrDk+kdPW78zcCt1bx8t+j+h8qe0v0T1FVx3i93uFzzfKqj/BQAA", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz online copy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz online copy test SHA mismatch"); return source; })(inverseHormoneQuizOnlineCopy(p, isolationHistoricalSource(p, previewResultsHistoricalSource(p, publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA), s => hash(s), isolationHelperSHA))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !publicMarketingApprovedInventory(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !previewResultsApprovedInventory(p, publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA, p === "server/_core/index.ts" && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizIsolationScope.ts" ? isolationHelperSHA : isolationInventoryPin(p); if (!pin) return true; if (hash(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) !== pin) throw Error("Quiz isolation inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizOnlineCopyScope.ts" ? "0c00547da82534553fcaeef64060f14c2077c34b7a0cff7e7053d9e4fd8de949" : p === "server/hormoneQuizOnlineCopy.test.ts" ? "64d52ffd15f3f02cbbb8bf8bf0deade6499b9a6742741c5de895690b91197b0a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz online copy inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizMobileTopScope.ts" ? "c44fd9ec9f7b8f160216ac64073c060a96a2b388c82c4ca0f6c47b7d51f6ebcd" : p === "server/hormoneQuizMobileTop.test.ts" ? "5517a2bfcf14788afda66f52e1bf13e00f296346878c1a0202c2d169223b1435" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz mobile top inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const html = read(page), original = before(page);
const files = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const fragments = files[page];
const aliases = [page, resolve(root, page), page.replaceAll("/", "\\"), "C:\\project\\" + page.replaceAll("/", "\\"), "dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"];
const section = (s: string, start: string, end: string) => { const a = s.indexOf(start), b = s.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen doctor-introduction section"); return s.slice(a, b); };
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const styles = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const links = (s: string) => [...s.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)].map(m => ({ attributes: m[1], text: m[2], href: /\bhref="([^"]*)"/.exec(m[1])?.[1] }));
const description = "Dr. Al-Deek takes a thoughtful approach to your care—reviewing your symptoms, health history, and goals, then working with you by text on a personalized plan.";
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
const withoutIntroAndOffer = (s: string) => s.replace(/<section class="report-doctor-intro"[\s\S]*?<\/section>/, "").replace(/<p class="report-text-visit-offer">[\s\S]*?<\/p>/, "").replace(/<p class="report-text-visit-next">[\s\S]*?<\/p>/, "").replace(">Start my free text visit</a>", ">Connect with Dr. Al-Deek—Free</a>");

describe("Hormone quiz physician introduction — exact results-only checkpoint scope", () => {
  it("pins the complete page and pure helper and restores exactly the CSS append and report replacement to 14761df7 for all supported aliases", () => {
    expect(hash(original)).toBe(beforeSHA); expect(hash(html)).toBe(afterSHA); expect(hash(read(helper))).toBe(helperSHA);
    expect(Object.keys(files)).toEqual([page]); expect(fragments).toHaveLength(2);
    let expected = original;
    for (const f of fragments) { expect(original.split(f.old).length - 1).toBe(1); expect(html.split(f.new).length - 1).toBe(1); expected = expected.replace(f.old, f.new); }
    expect(html).toBe(expected);
    const outside = (s: string, side: "old" | "new") => fragments.reduce((text, f, i) => text.replace(f[side], "FROZEN_DOCTOR_BOUNDARY_" + i), s);
    expect(outside(html, "new")).toBe(outside(original, "old"));
    for (const alias of aliases) { expect(inverseHormoneQuizDoctorIntro(alias, html)).toBe(original); expect(inverseHormoneQuizDoctorIntro(alias, original)).toBe(original); expect(inverseHormoneQuizDoctorIntro(alias, inverseHormoneQuizDoctorIntro(alias, html))).toBe(original); }
  });

  it("rejects missing duplicate mixed and tampered independent fragments while retaining unrelated bytes and rejecting quiz-path lookalikes", () => {
    for (const alias of aliases) {
      expect(() => inverseHormoneQuizDoctorIntro(alias, "")).toThrow("Quiz doctor introduction scope mismatch");
      for (const f of fragments) for (const bad of [html.replace(f.new, ""), html + f.new, html.replace(f.new, f.old), html.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1)), original + f.old, original.replace(f.old, ""), original + f.new]) expect(() => inverseHormoneQuizDoctorIntro(alias, bad)).toThrow("Quiz doctor introduction scope mismatch");
      expect(inverseHormoneQuizDoctorIntro(alias, "UNAPPROVED\n" + html)).toBe("UNAPPROVED\n" + original); expect(inverseHormoneQuizDoctorIntro(alias, html + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      expect(hash(inverseHormoneQuizDoctorIntro(alias, html + "\nUNAPPROVED"))).not.toBe(beforeSHA);
    }
    for (const outside of [page + ".bak", "other/" + page + ".copy", "client/public/other.html", "client/intake/index.html", "server/unrelated.ts", "dist/public/not-hormone-symptom-quiz.html"]) { expect(inverseHormoneQuizDoctorIntro(outside, html)).toBe(html); expect(inverseHormoneQuizDoctorIntro(outside, "")).toBe(""); }
  });

  it("introduces the approved physician portrait name two credentials and exact paragraph after the unchanged score and before existing next steps and Pattern", () => {
    const currentBlock = section(html, "      /* Balance Index */", "      /* Pattern */");
    for (const idx of [87, null]) {
      const env = { html: "", idx, bandText: () => "SYNTHETIC_LOCAL_BAND" }; runInNewContext(currentBlock, env);
      const intro = section(env.html, '<section class="report-doctor-intro" aria-labelledby="report-doctor-name">', "</section>") + "</section>";
      expect(intro).toContain('<h2 class="report-doctor-name" id="report-doctor-name">Meet Dr. Jumana Al-Deek, DO</h2>');
      expect(intro).toContain('<p class="report-doctor-credentials">Family Physician<br>Menopause Society Certified Practitioner</p>');
      expect(intro).toContain('<p class="report-doctor-description">' + description + '</p>');
      expect(intro.match(/<img\b[^>]*>/g)).toEqual(['<img class="report-doctor-photo" src="/assets/dr-jumana-al-deek-portrait.webp" alt="Dr. Jumana Al-Deek, DO" width="76" height="76" loading="lazy" decoding="async" referrerpolicy="no-referrer">']);
      expect(env.html.match(/id="report-doctor-name"/g)).toHaveLength(1); expect(env.html.match(/<section class="report-doctor-intro"/g)).toHaveLength(1);
      expect(env.html.indexOf(intro)).toBeLessThan(env.html.indexOf('<nav class="report-start-actions"'));
      if (idx !== null) { expect(env.html.startsWith('<div class="score-callout">')).toBe(true); expect(env.html.indexOf('class="score-big"')).toBeLessThan(env.html.indexOf(intro)); } else expect(env.html.startsWith(intro)).toBe(true);
      const previous = { html: "", idx, bandText: () => "SYNTHETIC_LOCAL_BAND" }; runInNewContext(section(original, "      /* Balance Index */", "      /* Pattern */"), previous);
      expect(withoutIntroAndOffer(env.html)).toBe(previous.html);
    }
    expect(read("server/intakeDoctorPortraitAsset.ts")).toBe(before("server/intakeDoctorPortraitAsset.ts")); expect(read("server/intakeDoctorPortraitAsset.ts")).toContain('export const INTAKE_DOCTOR_PORTRAIT_PATH = "/assets/dr-jumana-al-deek-portrait.webp";');
    const css = fragments[0].new.slice(0, -fragments[0].old.length);
    expect(css).toContain("background: var(--paper)"); expect(css).toContain("object-fit: cover; object-position: 50% 28%"); expect(css).not.toMatch(/@import|url\(|@media|position:\s*fixed/);
  });

  it("preserves every other rendered report byte all driver tiers and the exact native download for synthetic scored unscored goal-led and filtered-recognition reports", () => {
    for (const scenario of scenarios) {
      const current = render(html, scenario), previous = render(original, scenario);
      expect(withoutIntroAndOffer(current.output)).toBe(previous.output);
      expect(current.output.indexOf('<section class="report-doctor-intro"')).toBeLessThan(current.output.indexOf('<div class="pattern"'));
      expect(current.output.match(/Driver No\. [1-5] —/g)).toHaveLength(5); expect(current.output).not.toMatch(/Dear friend|class="letter"|class="glance"/);
      expect(current.download).toBe(previous.download); expect(current.filename).toBe(previous.filename); expect(current.filename).toBe("my-hormone-report.txt"); expect(current.handlers).toEqual(previous.handlers);
      expect(current.download).not.toMatch(/Meet Dr\.|Start my free text visit|report-doctor/);
      const picked = scenario.recognize.filter(i => i !== 9);
      if (picked.length) expect(current.download).toContain("Quick check — you recognized " + picked.length + " of the familiar ones: " + picked.map(i => "SYNTHETIC_LOCAL_RECOGNITION_" + i).join(", ")); else expect(current.download).not.toContain("Quick check —");
      if (scenario.fix === "The weight") expect(current.download).toContain("Drivers, in your report's order: No. 4, No. 1, No. 2, No. 3, No. 5");
    }
    expect(section(html, '      $("dlBtn").addEventListener("click", function(){', '    function driver(')).toBe(section(original, '      $("dlBtn").addEventListener("click", function(){', '    function driver('));
  });

  it("keeps both exact native new-tab destinations and changes only the adjacent offer CTA label and next-step note without altering the mobile pill closing questions or scoring", () => {
    const env = { html: "", idx: 87, bandText: () => "SYNTHETIC_LOCAL_BAND" }; runInNewContext(section(html, "      /* Balance Index */", "      /* Pattern */"), env);
    const nav = section(env.html, '<nav class="report-start-actions" aria-label="Next steps">', "</nav>") + "</nav>";
    expect(nav).toContain('<p class="report-text-visit-offer"><strong>Your first text visit is FREE</strong>Includes 7 days of follow-up messaging.</p>');
    expect(nav).toContain('<p class="report-text-visit-next">Complete your medical intake first. No appointment or video call needed.</p>');
    expect(links(nav)).toEqual([{ attributes: ' class="cta" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener"', text: "Start my free text visit", href: "https://intake.medmethoddirect.com/" }, { attributes: ' class="report-discovery-link" href="https://medmethoddirect.com/care-team-booking" target="_blank" rel="noopener"', text: "Book a free discovery call", href: "https://medmethoddirect.com/care-team-booking" }]);
    for (const action of links(nav)) { const url = new URL(action.href!); expect(url.search).toBe(""); expect(url.hash).toBe(""); }
    expect(nav.indexOf('class="report-text-visit-offer"')).toBeLessThan(nav.indexOf('class="cta"')); expect(nav.indexOf('class="cta"')).toBeLessThan(nav.indexOf('class="report-text-visit-next"')); expect(nav).not.toMatch(/<form|<input|<button|onclick|data-/i);
    expect(html.match(/<a class="report-floating-cta"[^>]*>[^<]*<\/a>/g)).toEqual(original.match(/<a class="report-floating-cta"[^>]*>[^<]*<\/a>/g)); expect(html.match(/Start your free text visit/g)).toHaveLength(1);
    for (const [start, end] of [["      /* Closing —", '      $("reportBody").innerHTML = html;'], ["    var QUESTIONS =", "    function renderReport"], ['<section id="report"', "</section>"]]) expect(section(html, start, end)).toBe(section(original, start, end));
    expect(scripts(html.replace(fragments[1].new, fragments[1].old))).toEqual(scripts(original)); expect(styles(html.replace(fragments[0].new, fragments[0].old))).toEqual(styles(original));
    for (const s of scripts(html).filter(s => !/\bsrc=/.test(s))) expect(() => new Script(s.slice(s.indexOf(">") + 1, s.lastIndexOf("</script>")))).not.toThrow();
  });

  it("preserves all eleven paired masks hidden report CSP no-referrer hooks and transport without introducing network events capture or tracking", () => {
    const tags = (s: string) => s.match(/<[a-z][^>]*>/gi) ?? [];
    const masked = (s: string) => tags(s).filter(t => /\bdata-hj-suppress(?:\s|>)/.test(t) && /\bdata-cs-mask(?:\s|>)/.test(t));
    expect(masked(html)).toEqual(masked(original)); expect(masked(html)).toHaveLength(11); expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    expect(html).toContain('<section id="report" class="report hidden" data-hj-suppress data-cs-mask>'); expect(section(html, '<section id="report" class="report hidden" data-hj-suppress data-cs-mask>', "</section>")).toContain('<div id="reportBody"></div>');
    const policies = (s: string) => tags(s).filter(t => /http-equiv="Content-Security-Policy"|name="referrer"/.test(t)); expect(policies(html)).toEqual(policies(original)); expect(policies(html)).toHaveLength(2);
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hotjar|contentsquare|clarity\.ms|fullstory|mouseflow|smartlook|_hjSettings|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    const additions = fragments.map(f => f.new.includes(f.old) ? f.new.slice(0, -f.old.length) : f.new).join("\n");
    expect(additions).not.toMatch(/<script|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|mmdQuizComplete|mmdQuizReset|addEventListener|removeAttribute|\.dataset|onclick/);
    expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']); expect(html.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g)).toEqual(original.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g));
  });

  it("leaves every other production byte and all twenty-nine prior fixtures frozen and allows only the exact new pure helper and direct-test paths", () => {
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle").trim().split("\n");
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) {
      const current = (p === "server/_core/index.ts" ? Buffer.from(previewResultsHistoricalSource(p, (p === "server/_core/vite.ts" || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(p) ? Buffer.from(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p)).toString("utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) : readFileSync(resolve(root, p))).toString("utf8"), s => previewResultsCreateHash("sha256").update(s).digest("hex"), previewResultsHelperSHA)) : (p === "server/_core/vite.ts" || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(p) ? Buffer.from(publicMarketingHistoricalSource(p, readFileSync(resolve(root, p)).toString("utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) : readFileSync(resolve(root, p)))), previous = execFileSync("git", ["show", baseline + ":" + p], { cwd: root });
      expect(p === page ? Buffer.from(inverseHormoneQuizDoctorIntro(p, inverseHormoneQuizMobileTop(p, inverseHormoneQuizOnlineCopy(p, current.toString("utf8"))))) : current, p).toEqual(previous);
    }
    const fixtures = git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures").trim().split("\n"); expect(fixtures).toHaveLength(29); for (const p of fixtures) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    for (const p of scope.filter(p => p.includes("."))) expect(read(p), p).toBe(before(p));
    const changed = git("diff", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean).filter(p => !/^server\/[^/]+\.test\.ts$/.test(p)); expect(changed).toEqual([page]);
    const oldPaths = new Set(git("ls-tree", "-r", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean));
    const currentPaths = new Set(git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(Boolean)); expect([...currentPaths].filter(p => !oldPaths.has(p)).sort()).toEqual([helper, direct].sort());
    expect(read(helper).split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/); expect(html).not.toContain("fixtures/hormoneQuizDoctorIntroScope");
  });
});
