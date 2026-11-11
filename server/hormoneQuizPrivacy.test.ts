import { createHash } from "node:crypto"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { gunzipSync as letterRemovalGunzipSync } from "node:zlib"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { gunzipSync as doctorIntroGunzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "ed12f8af";
const page = "client/public/hormone-symptom-quiz.html";
const server = "server/_core/index.ts";
const helper = "server/fixtures/hormoneQuizPrivacyScope.ts";
const direct = "server/hormoneQuizPrivacy.test.ts";
const helperSHA = "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156";
const pins: Record<string, { before: string; after: string }> = {
  [page]: { before: "24c45b7c284477614037c7a3fe305d57aeca022eba889103770a0d26c3b16f50", after: "725c507f5e87708401e0bfd133a3b3bc55060c06211f3d88a31ab4861114003f" },
  [server]: { before: "58b888efb532a6dc0165b784753cbfec632fa29f257376e96f7f03155da76bff", after: "ba14498f9ce69aa0cbd267903e9dc0325c71c8e043a031c0cdc82a705ccb5218" },
};
const policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
const ancestors = "frame-ancestors https://manus.im https://*.manus.im https://manus.ai https://*.manus.ai";
const read = (p: string) => inverseHormoneQuizCtaPlacement(p, ((source: string) => { const entry = (JSON.parse(letterRemovalGunzipSync(Buffer.from("H4sIAAAAAAACA7VUS4/TMBD+K96cUqlk8350VRAg0B44AD02PTj2uA1K42A73V2q/nfG6fbBrliKBDnkkMx8j/F83joa1AbU9UqqtWzhS1//eG/o54YyWENrPAMaX9qZbB29os7EEeBXQRZGcRqEwOKg8nmRRIJWtAiiFPIk5EEVMRFFgRAs5pDxnEUVowErqsLnztgBXlvE+daRDUfIet1JZciWMAXUwC3VK7IjQsk1KZ1Wcpgw9dAZWTo32N3C3d/1kGNt3aJVDbcnr5/AGFBfYS03tDkBeNeivje9An0+mF+KZ0x2YBXtxgcfTLbaENTDyZS43YRoo+p2OSLT18PXj3UDs4eWuYgrmw24SkozJt1ojJS9EXnpjE4OX0L7gxG3G19MOHruYFkbS+l5HlVLfSCeLwZquAd2xC0drC2dMbGFY3sad3xC9izQMsmxb3LkIrtn9v4jlae7pjbYV5Yt+vRE3eCE3M4i4yoI4l7NS4fXQljU0mn0KywBXToLr25Z03PQriWb+4vRCOeJ+9ASo3q4IXvxXd2ieAScTrH/MUiXLQ5GCkW+wbYiLaIcKhrlGYi8isO4YNwPIaVplkVV4GcRy7MMqqLIMXFxlRW+z8MK0pQHPOMIM3mq4XfUhzQ/UvMsDlIuaMyKMAwTQfOkgCgUKc9TQdPYr1ImWBImRZWGSZwFYRZTP/GDoEp5kVcDdds3zc1+nDiPJ3Oyn1cYTdduo9vhGK9Q51BnVkrekQ9KSYVnZKWSZtCKCPs02iVvjVQPZHb7lqxrvaaGrWxGDiSCNhpZ8Ky/ybo9HvX5RpPhgfsOmHH3Y+roEtD/u14IUJ5NvPs8T+eXoI0T65Ua7kM5G1bUPQVohFN4/G2zhSUfvvc2hAo2tez12dL/KzUX5P8lwRco3i12u58aqXWoHQYAAA==", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz letter removal test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz letter removal test SHA mismatch"); return source; })(inverseHormoneQuizLetterRemoval(p, ((source: string) => { const entry = (JSON.parse(doctorIntroGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz doctor introduction test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz doctor introduction test SHA mismatch"); return source; })(inverseHormoneQuizDoctorIntro(p, readFileSync(resolve(root, p), "utf8"))))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz doctor introduction inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz CTA placement inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz letter removal inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const lines = (s: string) => s.split("\n").filter(Boolean);
const fragments = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const html = read(page);
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const css = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const aliases = (p: string) => [p, resolve(root, p), p.replaceAll("/", "\\"), "C:\\project\\" + p.replaceAll("/", "\\"), ...(p === page ? ["dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"] : [])];
const masks = (tag: string) => /\bdata-hj-suppress(?:\s|>)/.test(tag) && /\bdata-cs-mask(?:\s|>)/.test(tag);
function syntheticDocument() {
  const nodes: Record<string, any> = {}, stack: any[] = [];
  let serial = 0, forbiddenCalls = 0;
  const make = (id: string, tag = "div", opening = "") => {
    const classes = new Set<string>();
    const n: any = { id, tag, opening, parent: null, children: [], value: "", textContent: "", style: {}, attrs: {}, handlers: {}, classList: { add(...c: string[]) { c.forEach(x => classes.add(x)); }, remove(...c: string[]) { c.forEach(x => classes.delete(x)); }, contains(c: string) { return classes.has(c); }, toggle(c: string, force?: boolean) { if (force === true || (force === undefined && !classes.has(c))) classes.add(c); else classes.delete(c); } }, addEventListener(k: string, fn: Function) { this.handlers[k] = fn; }, setAttribute(k: string, v: string) { this.attrs[k] = v; }, removeAttribute(k: string) { delete this.attrs[k]; }, appendChild(c: any) { c.parent = this; this.children.push(c); }, focus() {}, reset() {} };
    let inner = ""; Object.defineProperty(n, "innerHTML", { get: () => inner, set: (v: string) => { inner = v; n.children = []; for (const m of v.matchAll(/\bid="([^"]+)"/g)) n.appendChild(make(m[1])); } });
    nodes[id] = n; return n;
  };
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
  for (const m of markup.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase(), opening = m[0];
    if (opening.startsWith("</")) { while (stack.length) if (stack.pop().tag === tag) break; continue; }
    const id = /\bid="([^"]+)"/.exec(opening)?.[1] ?? "static-" + serial++;
    const n = make(id, tag, opening); if (stack.length) stack.at(-1).appendChild(n);
    if (!/^(?:meta|link|input|img|br|hr|source|area|base|embed|wbr)$/.test(tag) && !opening.endsWith("/>")) stack.push(n);
  }
  const node = (id: string) => { if (!nodes[id]) throw Error("Unknown synthetic quiz element: " + id); return nodes[id]; };
  const denied = () => { forbiddenCalls++; throw Error("Synthetic test forbids transport or tracker calls"); };
  const env: any = { URLSearchParams, window: { location: { search: "?prefill=demo" }, scrollTo() {}, mmdQuizComplete: denied, mmdQuizReset: denied, hj: denied, CS_CONF: {}, _uxa: { push: denied } }, document: { getElementById: node, createElement: (tag: string) => make("dynamic-" + serial++, tag), addEventListener() {} }, setTimeout: () => 1, clearTimeout() {}, fetch: denied, XMLHttpRequest: denied, navigator: { sendBeacon: denied } };
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) runInNewContext(m[1], env);
  const inherited = (n: any): boolean => { for (let p = n; p; p = p.parent) if (masks(p.opening)) return true; return false; };
  return { env, node, inherited, forbiddenCalls: () => forbiddenCalls };
}

describe("Hormone quiz privacy — exact checkpoint-only capture exclusion", () => {
  it("pins both whole sources and inverses exactly thirteen approved fragments to ed12f8af for every supported path alias", () => {
    expect(Object.keys(fragments)).toEqual([page, server]); expect(fragments[page]).toHaveLength(12); expect(fragments[server]).toHaveLength(1);
    for (const p of Object.keys(pins)) {
      const original = before(p), current = read(p); expect(hash(original)).toBe(pins[p].before); expect(hash(current)).toBe(pins[p].after);
      let expected = original;
      for (const f of fragments[p]) { expect(original.split(f.old).length - 1).toBe(1); expect(current.split(f.new).length - 1).toBe(1); expected = expected.replace(f.old, f.new); }
      expect(current).toBe(expected);
      for (const alias of aliases(p)) { expect(inverseHormoneQuizPrivacy(alias, current)).toBe(original); expect(inverseHormoneQuizPrivacy(alias, original)).toBe(original); expect(inverseHormoneQuizPrivacy(alias, inverseHormoneQuizPrivacy(alias, current))).toBe(original); }
      const outside = (s: string, side: "old" | "new") => fragments[p].reduce((text, f, i) => text.replace(f[side], "APPROVED_BOUNDARY_" + i), s);
      expect(outside(current, "new")).toBe(outside(original, "old"));
    }
  });

  it("rejects missing duplicate mixed and tampered privacy fragments while never swallowing unrelated bytes or nonquiz paths", () => {
    for (const p of Object.keys(pins)) {
      const current = read(p), original = before(p);
      for (const alias of aliases(p)) {
        expect(() => inverseHormoneQuizPrivacy(alias, "")).toThrow("Quiz privacy scope mismatch");
        for (const f of fragments[p]) {
          for (const bad of [current.replace(f.new, ""), current + f.new, original + f.old, original.replace(f.old, ""), current.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1))]) expect(() => inverseHormoneQuizPrivacy(alias, bad)).toThrow("Quiz privacy scope mismatch");
          if (fragments[p].length > 1) expect(() => inverseHormoneQuizPrivacy(alias, current.replace(f.new, f.old))).toThrow("Quiz privacy scope mismatch");
        }
        expect(inverseHormoneQuizPrivacy(alias, "UNAPPROVED\n" + current)).toBe("UNAPPROVED\n" + original);
        expect(inverseHormoneQuizPrivacy(alias, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
        expect(hash(inverseHormoneQuizPrivacy(alias, current + "\nUNAPPROVED"))).not.toBe(pins[p].before);
      }
      for (const outside of [p + ".bak", "other/" + p + ".copy", "client/intake/index.html", "client/public/other.html", "server/unrelated.ts"]) { expect(inverseHormoneQuizPrivacy(outside, current)).toBe(current); expect(inverseHormoneQuizPrivacy(outside, "")).toBe(""); }
    }
  });

  it("has eleven initial paired masks on body main quiz options contact gate form three inputs report and hidden submission data with no unmask", () => {
    const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
    const targets = [/<body\b/, /<main\b/, /\bid="quiz"/, /\bid="opts"/, /\bid="gate"/, /\bid="gateForm"/, /\bid="gateName"/, /\bid="gateEmail"/, /\bid="gatePhone"/, /\bid="report"/, /\bid="submissionData"/];
    expect(targets).toHaveLength(11);
    for (const target of targets) { const selected = tags.filter(t => target.test(t)); expect(selected).toHaveLength(1); expect(masks(selected[0])).toBe(true); }
    expect(tags.filter(masks)).toHaveLength(11);
    expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hj-allow|cs-unmask|data-(?:hj-suppress|cs-mask)\s*=\s*["'](?:false|0)["']/i);
    expect(scripts(html).join("\n")).not.toMatch(/(?:removeAttribute|setAttribute)\s*\(\s*["']data-(?:hj-suppress|cs-mask)|\.dataset\.(?:hjSuppress|csMask)/);
  });

  it("keeps generated single and multiselect labels selected states rerenders and report output beneath initially masked ancestors without transport", () => {
    const { env, node, inherited, forbiddenCalls } = syntheticDocument();
    expect(env.QUESTIONS).toHaveLength(32);
    for (const id of ["qText", "qHint", "secLabel", "gateName", "gateEmail", "gatePhone", "submissionData", "reportBody"]) expect(inherited(node(id)), id).toBe(true);
    env.pos = env.order.indexOf("age"); env.render(); expect(node("opts").children.length).toBeGreaterThan(0);
    for (const button of node("opts").children) { expect(button.innerHTML).toContain("<span>"); expect(inherited(button)).toBe(true); }
    node("opts").children[0].handlers.click(); expect(node("opts").children[0].attrs["aria-pressed"]).toBe("true");
    env.pos = env.order.indexOf("weird"); env.render(); const selected = node("opts").children.find((b: any) => b.attrs["aria-pressed"] === "true"); expect(selected).toBeDefined(); expect(inherited(selected)).toBe(true);
    selected.handlers.click(); env.render(); for (const button of node("opts").children) expect(inherited(button)).toBe(true);
    env.renderReport(); expect(node("reportBody").innerHTML).toContain("Your five drivers"); expect(inherited(node("reportBody"))).toBe(true);
    node("submissionData").textContent = JSON.stringify({ name: "Synthetic local only", answers: { weird: [0] } }); expect(inherited(node("submissionData"))).toBe(true);
    expect(forbiddenCalls()).toBe(0);
  });

  it("pins identical CSP and no-referrer before script execution on GET and implicit HEAD for both original routes and the existing static html alias", () => {
    const source = read(server), fragment = fragments[server][0].new;
    expect(source.split(fragment).length - 1).toBe(1);
    expect(fragment).toContain('app.get(["/hormone-symptom-quiz", "/hormone-symptom-quiz/", "/hormone-symptom-quiz.html"], (_req, res) => {');
    expect(fragment).toContain('res.setHeader("Content-Security-Policy", "' + policy + "; " + ancestors + '");');
    expect(fragment).toContain('res.setHeader("Referrer-Policy", "no-referrer");');
    expect(fragment.indexOf('res.setHeader("Content-Security-Policy"')).toBeLessThan(fragment.indexOf("res.sendFile(hormoneSymptomQuizHtml)"));
    expect(source.indexOf(fragment)).toBeLessThan(source.indexOf("app.use(crawlerMiddleware)")); expect(source.indexOf(fragment)).toBeLessThan(source.indexOf("await setupVite(app, server)"));
    expect(html.split('<meta http-equiv="Content-Security-Policy" content="' + policy + '" />')).toHaveLength(2);
    expect(html.split('<meta name="referrer" content="no-referrer" />')).toHaveLength(2);
    expect(html.indexOf('http-equiv="Content-Security-Policy"')).toBeLessThan(html.indexOf("<script"));
    expect(html.indexOf('name="referrer"')).toBeLessThan(html.indexOf("<script"));
    expect(inverseHormoneQuizPrivacy(server, source)).toBe(before(server));
  });

  it("fails closed for known Hotjar and ContentSquare remote scripts connect beacons images frames workers and objects while preserving same-origin transport and fonts", () => {
    const directives = Object.fromEntries(policy.split("; ").map(d => { const [key, ...values] = d.split(" "); return [key, values]; }));
    expect(directives).toEqual({ "default-src": ["'self'"], "script-src": ["'self'", "'unsafe-inline'"], "connect-src": ["'self'"], "img-src": ["'self'", "data:", "blob:"], "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], "font-src": ["'self'", "https://fonts.gstatic.com", "data:"], "frame-src": ["'none'"], "worker-src": ["'none'"], "object-src": ["'none'"], "base-uri": ["'self'"], "form-action": ["'self'"] });
    const allowed = (directive: string, url: string) => (directives[directive] ?? directives["default-src"]).some(value => value === "'self'" ? new URL(url).origin === "https://medmethoddirect.com" : value === "'none'" || value === "'unsafe-inline'" ? false : value.endsWith(":") ? url.startsWith(value) : new URL(url).origin === value);
    for (const host of ["static.hotjar.com", "script.hotjar.com", "in.hotjar.com", "vc.hotjar.io", "ws.hotjar.com", "vars.hotjar.com", "t.contentsquare.net", "c.contentsquare.net", "cs.contentsquare.net", "b.contentsquare.net", "u.contentsquare.net", "cdn.contentsquare.net", "contentsquare.com"]) for (const directive of ["script-src", "connect-src", "img-src", "frame-src", "worker-src", "object-src"]) expect(allowed(directive, "https://" + host + "/capture"), directive + ":" + host).toBe(false);
    for (const directive of ["script-src", "connect-src", "img-src"]) expect(allowed(directive, "https://medmethoddirect.com/assets/hormone-quiz-transport.js")).toBe(true);
    expect(allowed("connect-src", "wss://ws.hotjar.com/capture")).toBe(false); expect(allowed("style-src", "https://fonts.googleapis.com/css2")).toBe(true); expect(allowed("font-src", "https://fonts.gstatic.com/font.woff2")).toBe(true);
    for (const directive of ["frame-src", "worker-src", "object-src"]) expect(allowed(directive, "https://medmethoddirect.com/local")).toBe(false);
  });

  it("adds no tracker loader identity call health event analytics bridge or capture transport and keeps every quiz script and stylesheet byte-identical", () => {
    const original = before(page), currentScripts = scripts(html);
    expect(currentScripts).toEqual(scripts(original)); expect(css(html)).toEqual(css(original)); expect(currentScripts).toHaveLength(3);
    for (const script of currentScripts.filter(s => !/\bsrc=/.test(s))) expect(() => new Script(script.slice(script.indexOf(">") + 1, script.lastIndexOf("</script>")))).not.toThrow();
    expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
    expect(html).not.toMatch(/hotjar|contentsquare|content-square|clarity\.ms|fullstory|mouseflow|smartlook|hj\s*\(|_hjSettings|_uxa\s*\.|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    expect(currentScripts.join("\n")).not.toMatch(/sendBeacon|XMLHttpRequest|\bfetch\s*\(|localStorage|sessionStorage/);
    expect(inverseHormoneQuizPrivacy(page, html)).toBe(original);
  });

  it("preserves all question wording scoring routing report downloads existing bridge and webhook provider sources and every other production page", () => {
    const unchanged = ["server/hormoneQuizModel.ts", "server/hormoneQuizService.ts", "server/hormoneQuizStore.ts", "server/hormoneQuizPdf.ts", "server/hormoneQuizPrivateReport.ts", "server/hormoneQuizSecurity.ts", "server/hormoneQuizRoutes.ts", "server/routers/hormoneQuiz.ts", "client/quiz-webhook-transport.ts", "client/src/components/AdminQuizWebhooks.tsx", "client/src/App.tsx", "server/_core/vite.ts", "package.json", "pnpm-lock.yaml"];
    for (const p of unchanged) expect(read(p), p).toBe(before(p));
    const paths = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle"));
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) { const current = read(p); expect(Object.hasOwn(pins, p) ? inverseHormoneQuizPrivacy(p, current) : current, p).toBe(before(p)); }
    const restored = inverseHormoneQuizPrivacy(page, html); expect(restored).toContain('if (window.mmdQuizComplete) window.mmdQuizComplete(submissionRecord);'); expect(restored).toContain('if (window.mmdQuizReset) window.mmdQuizReset();'); expect(restored).toContain('a.download = "my-hormone-report.txt"');
  });

  it("pins the pure helper all twenty-six prior fixture bytes and the exact two-production-path inventory without new unrelated files or test imports", () => {
    const source = read(helper); expect(hash(source)).toBe(helperSHA);
    expect(source.split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/);
    const prior = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures")); expect(prior).toHaveLength(26); for (const p of prior) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const changed = lines(git("diff", "--name-only", baseline, "--", ...scope)); expect(changed.filter(p => !/^server\/[^/]+\.test\.ts$/.test(p))).toEqual([page, server]);
    const additions = lines(git("ls-files", "--others", "--exclude-standard", "--", ...scope)); expect(additions.sort()).toEqual([helper, direct].sort());
    for (const p of Object.keys(pins)) expect(read(p)).not.toContain("fixtures/hormoneQuizPrivacyScope");
    for (const p of changed.filter(p => /^server\/[^/]+\.test\.ts$/.test(p))) { const current = read(p), original = before(p); expect(current.split("\n").length, p).toBe(original.split("\n").length); expect([...current.matchAll(/\b(?:describe|it|test)\s*\(\s*(['"])(.*?)\1/g)].map(m => m[0]), p).toEqual([...original.matchAll(/\b(?:describe|it|test)\s*\(\s*(['"])(.*?)\1/g)].map(m => m[0])); expect((current.match(/\bexpect\s*\(/g) ?? []).length, p).toBe((original.match(/\bexpect\s*\(/g) ?? []).length); }
  });
});
