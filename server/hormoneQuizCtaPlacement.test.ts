import { createHash } from "node:crypto"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "f6c73283";
const page = "client/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizCtaPlacementScope.ts";
const direct = "server/hormoneQuizCtaPlacement.test.ts";
const beforeSHA = "725c507f5e87708401e0bfd133a3b3bc55060c06211f3d88a31ab4861114003f";
const afterSHA = "3eec5f60a3933f6acf15033e1a7d0327b735adc85781c3566628c393d839df8e";
const helperSHA = "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8";
const read = (p: string) => inverseHormoneQuizLetterRemoval(p, readFileSync(resolve(root, p), "utf8"));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz letter removal inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const html = read(page), original = before(page);
const files = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const fragments = files[page];
const aliases = [page, resolve(root, page), page.replaceAll("/", "\\"), "C:\\project\\" + page.replaceAll("/", "\\"), "dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"];
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const styles = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const section = (s: string, start: string, end: string) => { const a = s.indexOf(start), b = s.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen quiz section"); return s.slice(a, b); };
const links = (s: string) => [...s.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)].map(m => ({ attributes: m[1], text: m[2], href: /\bhref="([^"]*)"/.exec(m[1])?.[1] }));

describe("Hormone quiz CTA placement — exact results-only checkpoint scope", () => {
  it("pins the whole source and pure helper and inverses exactly three frozen fragments to f6c73283 for every supported alias", () => {
    expect(hash(original)).toBe(beforeSHA); expect(hash(html)).toBe(afterSHA); expect(hash(read(helper))).toBe(helperSHA);
    expect(Object.keys(files)).toEqual([page]); expect(fragments).toHaveLength(3);
    let expected = original;
    for (const f of fragments) { expect(original.split(f.old).length - 1).toBe(1); expect(html.split(f.new).length - 1).toBe(1); expected = expected.replace(f.old, f.new); }
    expect(html).toBe(expected); expect(html.split("\n").length - original.split("\n").length).toBe(42);
    for (const alias of aliases) { expect(inverseHormoneQuizCtaPlacement(alias, html)).toBe(original); expect(inverseHormoneQuizCtaPlacement(alias, original)).toBe(original); expect(inverseHormoneQuizCtaPlacement(alias, inverseHormoneQuizCtaPlacement(alias, html))).toBe(original); }
    const outside = (s: string, side: "old" | "new") => fragments.reduce((text, f, i) => text.replace(f[side], "FROZEN_CTA_BOUNDARY_" + i), s);
    expect(outside(html, "new")).toBe(outside(original, "old"));
  });

  it("rejects missing duplicate mixed and tampered fragments without swallowing unrelated bytes or accepting nonquiz path lookalikes", () => {
    for (const alias of aliases) {
      expect(() => inverseHormoneQuizCtaPlacement(alias, "")).toThrow("Quiz CTA placement scope mismatch");
      for (const f of fragments) for (const bad of [html.replace(f.new, ""), html + f.new, html.replace(f.new, f.old), html.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1)), original + f.old, original.replace(f.old, "")]) expect(() => inverseHormoneQuizCtaPlacement(alias, bad)).toThrow("Quiz CTA placement scope mismatch");
      expect(inverseHormoneQuizCtaPlacement(alias, "UNAPPROVED\n" + html)).toBe("UNAPPROVED\n" + original);
      expect(inverseHormoneQuizCtaPlacement(alias, html + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      expect(hash(inverseHormoneQuizCtaPlacement(alias, html + "\nUNAPPROVED"))).not.toBe(beforeSHA);
    }
    for (const outside of [page + ".bak", "other/" + page + ".copy", "client/public/other.html", "client/intake/index.html", "server/unrelated.ts", "dist/public/not-hormone-symptom-quiz.html"]) { expect(inverseHormoneQuizCtaPlacement(outside, html)).toBe(html); expect(inverseHormoneQuizCtaPlacement(outside, "")).toBe(""); }
  });

  it("generates the two existing safe new-tab actions directly after the unchanged Balance Index and before Pattern with no new offer or URL data", () => {
    const block = section(html, "      /* Balance Index */", "      /* Pattern */");
    const previous = section(original, "      /* Balance Index */", "      /* Pattern */");
    const inserted = fragments[2].new.slice(0, -fragments[2].old.length);
    expect(block).toBe(previous + inserted); expect(html.match(/<nav class="report-start-actions"/g)).toHaveLength(1);
    for (const idx of [87, null]) {
      const env = { html: "", idx, bandText: () => "SYNTHETIC_LOCAL_BAND" }; runInNewContext(block, env);
      const nav = section(env.html, '<nav class="report-start-actions" aria-label="Next steps">', "</nav>") + "</nav>";
      const actions = links(nav); expect(actions).toHaveLength(2);
      expect(actions.map(a => a.text)).toEqual(["Connect with Dr. Al-Deek—Free", "Book a free discovery call"]);
      expect(actions.map(a => a.href)).toEqual(["https://intake.medmethoddirect.com/", "https://medmethoddirect.com/care-team-booking"]);
      for (const a of actions) { expect(a.attributes).toContain('target="_blank"'); expect(a.attributes).toContain('rel="noopener"'); const url = new URL(a.href!); expect(url.search).toBe(""); expect(url.hash).toBe(""); }
      if (idx !== null) { expect(env.html.indexOf('class="score-big"')).toBeLessThan(env.html.indexOf('<nav')); expect(env.html.slice(env.html.lastIndexOf("</div>") + 6)).toBe(nav); } else expect(env.html).toBe(nav);
      const closingLinks = links(section(original, "      /* Closing —", '      $("reportBody").innerHTML = html;'));
      expect(actions.map(a => [a.text, a.href])).toEqual(closingLinks.map(a => [a.text, a.href]));
      expect(nav).not.toMatch(/<form|<input|<button|onclick|answers|score|pattern|7 days|15 minutes|pricing/i);
    }
  });

  it("keeps one static pill inside the initially hidden masked report and limits its 60px safe-area-aware fixed layout and 104px clearance to 700px mobile", () => {
    const css = fragments[0].new.slice(0, -fragments[0].old.length);
    expect(html.match(/<a class="report-floating-cta"/g)).toHaveLength(1); expect(html.match(/Start your free text visit/g)).toHaveLength(1);
    expect(section(html, '<section id="report" class="report hidden" data-hj-suppress data-cs-mask>', "</section>")).toContain(fragments[1].new);
    expect(html.slice(0, html.indexOf('<section id="report"'))).not.toContain('<a class="report-floating-cta"');
    expect(css).toContain(".report-floating-cta { display: none; }"); expect(css.match(/@media/g)).toHaveLength(2);
    expect(css).toContain("@media (prefers-color-scheme: dark) {\n        .report-start-actions .cta { color: #4c1537; }\n      }");
    expect(css.match(/@media \(max-width: 700px\)/g)).toHaveLength(1);
    const mobile = section(css, "@media (max-width: 700px)", ".report-floating-cta:active");
    for (const rule of ["display: flex;", "position: fixed; z-index: 60;", "left: max(12px, env(safe-area-inset-left, 0px));", "right: max(12px, env(safe-area-inset-right, 0px));", "bottom: calc(12px + env(safe-area-inset-bottom, 0px));", "max-width: 440px; min-height: 60px;", "margin: 0 auto;", "border-radius: 999px;", ".report { padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px)); }"]) expect(mobile).toContain(rule);
    expect(css).toContain(".report-start-actions a:focus-visible, .report-floating-cta:focus-visible {\n        outline: 3px solid var(--rasp); outline-offset: 4px;");
    const pill = links(fragments[1].new); expect(pill).toEqual([{ attributes: ' class="report-floating-cta" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener"', text: "Start your free text visit", href: "https://intake.medmethoddirect.com/" }]);
    expect(section(html, "      /* Results-only repeated actions", "    </style>")).toBe(css);
    expect(section(html, "    .hidden", "\n")).toBe(section(original, "    .hidden", "\n"));
    expect(scripts(html).join("\n").match(/reportEl\.classList\.remove\("hidden"\)/g)).toEqual(scripts(original).join("\n").match(/reportEl\.classList\.remove\("hidden"\)/g));
    expect(scripts(html).join("\n")).not.toMatch(/report-floating-cta|matchMedia|IntersectionObserver/);
  });

  it("leaves closing offers report downloads question bank scoring and every script and stylesheet byte unchanged except the exact navigation and appended style", () => {
    const restored = inverseHormoneQuizCtaPlacement(page, html); expect(restored).toBe(original);
    expect(scripts(html.replace(fragments[2].new, fragments[2].old))).toEqual(scripts(original)); expect(scripts(html)).toHaveLength(3);
    expect(styles(html.replace(fragments[0].new, fragments[0].old))).toEqual(styles(original));
    expect(section(html, "      /* Closing —", '      $("reportBody").innerHTML = html;')).toBe(section(original, "      /* Closing —", '      $("reportBody").innerHTML = html;'));
    expect(section(html, "    var QUESTIONS =", "    function renderReport")).toBe(section(original, "    var QUESTIONS =", "    function renderReport"));
    expect(html.slice(html.indexOf('      $("reportBody").innerHTML = html;'))).toBe(original.slice(original.indexOf('      $("reportBody").innerHTML = html;')));
    for (const s of scripts(html).filter(s => !/\bsrc=/.test(s))) expect(() => new Script(s.slice(s.indexOf(">") + 1, s.lastIndexOf("</script>")))).not.toThrow();
    expect(restored).toContain("<strong>7 days of follow-up messaging</strong>"); expect(restored).toContain('a.download = "my-hormone-report.txt"');
  });

  it("preserves all eleven paired masks CSP no-referrer privacy protection and existing transport without adding capture or event code", () => {
    const tags = (s: string) => s.match(/<[a-z][^>]*>/gi) ?? [];
    const masked = (s: string) => tags(s).filter(t => /\bdata-hj-suppress(?:\s|>)/.test(t) && /\bdata-cs-mask(?:\s|>)/.test(t));
    expect(masked(html)).toEqual(masked(original)); expect(masked(html)).toHaveLength(11);
    expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    const policies = (s: string) => tags(s).filter(t => /http-equiv="Content-Security-Policy"|name="referrer"/.test(t));
    expect(policies(html)).toEqual(policies(original)); expect(policies(html)).toHaveLength(2); expect(read("server/_core/index.ts")).toBe(before("server/_core/index.ts"));
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hotjar|contentsquare|clarity\.ms|fullstory|mouseflow|smartlook|_hjSettings|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    for (const f of fragments) expect(f.new).not.toMatch(/<script|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|mmdQuizComplete|mmdQuizReset|addEventListener|removeAttribute|\.dataset/);
    expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
  });

  it("preserves every other production backend transport page and all 27 frozen fixtures and allows only the exact helper and direct-test additions", () => {
    const paths = git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle").trim().split("\n");
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) {
      const current = readFileSync(resolve(root, p)); const previous = execFileSync("git", ["show", baseline + ":" + p], { cwd: root });
      expect(p === page ? Buffer.from(inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, current.toString("utf8")))) : current, p).toEqual(previous);
    }
    const prior = git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures").trim().split("\n"); expect(prior).toHaveLength(27); for (const p of prior) expect(read(p), p).toBe(before(p));
    for (const p of ["package.json", "pnpm-lock.yaml", "vite.config.ts", "vitest.config.ts", "tsconfig.json", ".gitignore"]) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const changed = git("diff", "--name-only", baseline, "--", ...scope).split("\n").filter(Boolean); expect(changed.filter(p => !/^server\/[^/]+\.test\.ts$/.test(p))).toEqual([page]);
    const additions = git("ls-files", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(Boolean); expect(additions.sort()).toEqual([helper, direct].sort());
    expect(read(helper).split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/); expect(html).not.toContain("fixtures/hormoneQuizCtaPlacementScope");
  });
});
