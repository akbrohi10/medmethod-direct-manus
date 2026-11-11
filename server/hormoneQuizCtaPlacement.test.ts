import { createHash } from "node:crypto"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { gunzipSync as doctorIntroGunzipSync } from "node:zlib"; import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope"; import { gunzipSync as mobileTopGunzipSync } from "node:zlib";
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
const read = (p: string) => inverseHormoneQuizLetterRemoval(p, ((source: string) => { const entry = (JSON.parse(doctorIntroGunzipSync(Buffer.from("H4sIAAAAAAACA7VU247TMBD9FW+eUqlkkzTXrgoCAVokXqCPTR8ce9wapXawnb1Q9d+ZpNsLu2hZJMijM3POmfE53noWzA2Yy7U2G63gSyd/fAbnwHyFjb6hTeDAusBZb7r17Jp6U4/nSZRxQRNWxnGcClqkJUxikfEiEzRLwjpjgqVxWtZZnCZ5FOcJDdMwiuqMl0XtjT3gskdcbD3dcISUm1YbR7aEGaAOrqldkx0RRm9I5SnNYcrMfet05V1ht4Lbv+shx1qpcFYL16dh32vmtPmknNGn9uBSyDvXGbDnezkrnTPdQq9mNz7MwLSyjqAWTmbEb6fEOiPVakRmr4fTj7KB+b1iPqLq5gZ8o7Ubk3Y0RsLOiaLyRqfpnkN7dgi/Hb+YbvRU/0q6njAIAmpW9kC7WA7EcAfsiFt5WFt5Y9IXjvt7uOVTsmcBxTTHvumRi+yeDPcfqQLbNtJhX1UpnDMQskFH+22PjCYQxL9YVB6XQvSoldfYV1gCtvKWgVSs6ThYvydbhMvRCPeJXlDEmQ6uyF58KxWKR8DZDPsfMvQS02CUUOIbbMogiUsRsozHNC2YSAoBZZKktM7SJCtgkmZpXuZDrjiL04iFmKQ4LxJRQJ4zhJk+VvB74kOGH4gZLRGI87jM8jLk9SRhNE/YJJrUBYUogjoFpE14mecJ1DkU4YTmLMmAZryO6UCsuqa52q8Sd/FoR/3xGgPp9070W1zhBaoc6tza6FvywRht8H56oYQPStHWKJV3zEmtBo8rPL0n8+u3ZCPthjq27iNyYBK0sUiFl/1NS3W863NLk+GDuxaY8/ebaukKcAnvOiHABH3c/adx+uUB7APFOmNQTuD0fDCpf4rQCHfx8LtPF5Z8+N71XQZupO7sme3/mZw/PgDP6X2B4N1yt/sJ2mKxshkGAAA=", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz doctor introduction test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz doctor introduction test SHA mismatch"); return source; })(inverseHormoneQuizDoctorIntro(p, ((source: string) => { const entry = (JSON.parse(mobileTopGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz mobile top test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz mobile top test SHA mismatch"); return source; })(inverseHormoneQuizMobileTop(p, readFileSync(resolve(root, p), "utf8"))))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizMobileTopScope.ts" ? "c44fd9ec9f7b8f160216ac64073c060a96a2b388c82c4ca0f6c47b7d51f6ebcd" : p === "server/hormoneQuizMobileTop.test.ts" ? "5517a2bfcf14788afda66f52e1bf13e00f296346878c1a0202c2d169223b1435" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz mobile top inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz doctor introduction inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz letter removal inventory SHA mismatch"); return false; }).join("\n");
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
      expect(p === page ? Buffer.from(inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, inverseHormoneQuizDoctorIntro(p, inverseHormoneQuizMobileTop(p, current.toString("utf8")))))) : current, p).toEqual(previous);
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
