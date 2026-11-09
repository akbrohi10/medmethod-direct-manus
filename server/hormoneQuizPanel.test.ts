import { createHash } from "node:crypto"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope";

const root = resolve(import.meta.dirname, "..");
const page = "client/public/hormone-symptom-quiz.html";
const built = "dist/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizPanelScope.ts";
const helperSHA = "f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798";
const read = (p: string) => inverseHormoneQuizPhone(p, inverseHormoneQuizIntegration(p, readFileSync(resolve(root, p), "utf8")));
const before = (p: string) => execFileSync("git", ["show", "e83671c7:" + p], { cwd: root, encoding: "utf8" });
const panelCSS = `      /* Report closing highlight — approved panel-only styling */
      .report .closing {
        background: var(--rasp-soft);
        border-top: 4px solid var(--plum);
        margin-top: 48px;
      }
      .report .closing .report-utilities {
        border-top: 1px solid var(--line);
        margin-top: 24px;
        padding-top: 8px;
      }
`;
const fragments = [
  { old: "    </style>", new: panelCSS + "    </style>" },
  { old: `        + "<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes 7 days of follow-up messaging, free.</p>"`, new: `        + "<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes <strong>7 days of follow-up messaging</strong>, free.</p>"` },
  { old: `        + '<button class="ghostbtn" type="button" id="dlBtn">Download a copy of my report</button>'
        + '<button class="ghostbtn" type="button" id="againBtn">Take the check again</button></div>';`, new: `        + '<div class="report-utilities">'
        + '<button class="ghostbtn" type="button" id="dlBtn">Download a copy of my report</button>'
        + '<button class="ghostbtn" type="button" id="againBtn">Take the check again</button></div></div>';` },
];
const scripts = (s: string) => [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const stylesheet = (s: string) => s.match(/<style>([\s\S]*?)    <\/style>/)![1];
const closingCode = (s: string) => s.slice(s.indexOf("      /* Closing — treatment-first"), s.indexOf('      $("reportBody").innerHTML = html;'));
function renderClosing(source: string): string {
  const context = { html: "" };
  runInNewContext(closingCode(source), context);
  return context.html;
}
const inverseRenderedPanel = (s: string) => s.replace("<strong>7 days of follow-up messaging</strong>", "7 days of follow-up messaging").replace('<div class="report-utilities">', "").replace('</button></div></div>', '</button></div>');
const visibleText = (s: string) => s.replace(/<[^>]*>/g, "").replaceAll("&amp;", "&");
function engine(source: string, search: string) {
  const nodes: Record<string, any> = {}, timers: Function[] = [], downloads: any[] = [], revocations: string[] = [];
  const node = (id: string): any => {
    if (nodes[id]) return nodes[id];
    const classes = new Set<string>();
    return nodes[id] = {
      value: "", textContent: "", innerHTML: "", children: [], handlers: {}, style: {}, attributes: {}, focused: false,
      classList: { add(...c: string[]) { c.forEach(x => classes.add(x)); }, remove(...c: string[]) { c.forEach(x => classes.delete(x)); }, contains(c: string) { return classes.has(c); }, toggle(c: string) { if (classes.has(c)) classes.delete(c); else classes.add(c); } },
      addEventListener(name: string, fn: Function) { this.handlers[name] = fn; },
      setAttribute(name: string, value: string) { this.attributes[name] = value; }, removeAttribute(name: string) { delete this.attributes[name]; }, focus() { this.focused = true; },
      appendChild(child: any) { this.children.push(child); }, click() { downloads.push({ href: this.href, download: this.download }); }, remove() {},
      reset() { for (const id of ["gateName", "gateEmail", "gatePhone"]) node(id).value = ""; },
    };
  };
  let blob: any;
  const env: any = {
    URLSearchParams, window: { location: { search }, scrollTo() {} },
    document: { getElementById: node, addEventListener() {}, createElement: () => node("created"), body: node("body") },
    Blob: class { constructor(public parts: string[], public options: any) {} },
    URL: { createObjectURL(value: any) { blob = value; return "blob:synthetic-local-report"; }, revokeObjectURL(url: string) { revocations.push(url); } },
    setTimeout(fn: Function) { timers.push(fn); return timers.length; }, clearTimeout() {},
  };
  scripts(source).forEach(script => runInNewContext(script, env));
  return { env, node, timers, downloads, revocations, blob: () => blob };
}

describe("Quiz report closing panel — approved styling and utility grouping only", () => {
  it("restores whole source and built HTML exactly to e83671c7 with only three frozen fragments, one production path and the exact new helper SHA while keeping all old fixtures immutable", () => {
    const original = before(page), current = read(page);
    let expected = original;
    for (const f of fragments) {
      expect(original.split(f.old).length - 1).toBe(1);
      expect(original.split(f.new).length - 1).toBe(0);
      expect(current.split(f.new).length - 1).toBe(1);
      expected = expected.replace(f.old, f.new);
    }
    expect(current).toBe(expected);
    for (const path of [page, built]) {
      expect(read(path)).toBe(current);
      expect(inverseHormoneQuizPanel(path, read(path))).toBe(original);
    }
    const scope = ["client", "server", "shared", "drizzle", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const paths = [...execFileSync("git", ["diff", "--name-only", "e83671c7", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8")))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p => p && !/^server\/[^/]+\.test\.ts$/.test(p)).filter(p => {
      if (p === "server/fixtures/hormoneQuizPhoneScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25"); return false; } if (p !== helper) return true;
      expect(createHash("sha256").update(read(p)).digest("hex")).toBe(helperSHA);
      return false;
    });
    expect([...new Set(paths)].sort()).toEqual([page]);
    for (const p of execFileSync("git", ["ls-tree", "-r", "--name-only", "e83671c7", "--", "server/fixtures"], { cwd: root, encoding: "utf8" }).trim().split("\n")) expect(read(p)).toBe(before(p));
  });

  it("appends exactly two report-closing-scoped CSS rules preserving the entire old prefix, existing light and dark theme variables, 4px plum top border, 48px separation and 1px utility divider with 24px margin and 8px padding", () => {
    const current = stylesheet(read(page)), original = stylesheet(before(page));
    expect(current).toBe(original + panelCSS);
    expect(current.slice(0, original.length)).toBe(original);
    expect(panelCSS.match(/\{/g)).toHaveLength(2);
    expect(panelCSS.match(/\}/g)).toHaveLength(2);
    expect([...panelCSS.matchAll(/([^{}]+)\{/g)].map(m => m[1].replace(/\/\*[\s\S]*?\*\//g, "").trim())).toEqual([".report .closing", ".report .closing .report-utilities"]);
    expect(panelCSS).toContain("background: var(--rasp-soft);\n        border-top: 4px solid var(--plum);\n        margin-top: 48px;");
    expect(panelCSS).toContain("border-top: 1px solid var(--line);\n        margin-top: 24px;\n        padding-top: 8px;");
    expect(original).toContain("background: var(--paper); border: 1px solid var(--line); border-radius: 22px;\n        padding: 26px 24px; box-shadow: var(--shadow); margin-top: 26px; text-align: center;");
    const theme = (s: string) => [...s.matchAll(/:root\s*\{[^}]*\}/g)].map(m => m[0]);
    expect(theme(current)).toEqual(theme(original));
    expect(theme(current)).toHaveLength(2);
    for (const token of ["--rasp-soft: #f7e3ec;", "--rasp-soft: #40202f;", "--plum: #6d214f;", "--plum: #e59ec2;", "--line: #e8d5dc;", "--line: #4a2c3c;"]) expect(current).toContain(token);
    expect(panelCSS).not.toMatch(/font|text-|box-shadow|border-radius|#[0-9a-f]|@media|display|position|width|height|button|\.cta|\.ghostbtn|\.pl\b|h2|\bp\s*\{/i);
  });

  it("keeps every visible word, both safe links and all current fonts and button styles unchanged, bolds only the exact seven-day phrase once and wraps only the same two native utility buttons with unchanged IDs", () => {
    const source = read(page), original = before(page), closing = renderClosing(source), oldClosing = renderClosing(original);
    expect(inverseRenderedPanel(closing)).toBe(oldClosing);
    expect(visibleText(closing)).toBe(visibleText(oldClosing));
    expect(closing).toContain('<div class="pl">READY TO EXPLORE YOUR TREATMENT OPTIONS?</div><h2>Connect with a Hormone &amp; Weight Loss Doctor—for FREE.</h2>');
    expect(closing).toContain('<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes <strong>7 days of follow-up messaging</strong>, free.</p>');
    expect([...closing.matchAll(/<strong>(.*?)<\/strong>/g)].map(m => m[1])).toEqual(["7 days of follow-up messaging"]);
    const links = (s: string) => [...s.matchAll(/<a\b[^>]*>[^<]*<\/a>/g)].map(m => m[0]);
    expect(links(closing)).toEqual(links(oldClosing));
    expect(links(closing)).toHaveLength(2);
    expect(links(closing)).toEqual(['<a class="cta" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener">Connect with Dr. Al-Deek—Free</a>', '<a href="https://medmethoddirect.com/care-team-booking" target="_blank" rel="noopener" style="color:var(--plum);font-weight:800;text-decoration:underline">Book a free discovery call</a>']);
    for (const link of links(closing)) {
      const url = new URL(link.match(/href="([^"]*)"/)![1]);
      expect(url.protocol).toBe("https:"); expect(url.search).toBe(""); expect(url.hash).toBe(""); expect(url.username).toBe(""); expect(url.password).toBe("");
      expect(link).not.toMatch(/onclick|data-|javascript:|answers|score|pattern|email|phone|contact|\?|#/);
    }
    const buttons = (s: string) => [...s.matchAll(/<button\b[^>]*>[^<]*<\/button>/g)].map(m => m[0]);
    expect(buttons(closing)).toEqual(buttons(oldClosing));
    expect(buttons(closing)).toEqual(['<button class="ghostbtn" type="button" id="dlBtn">Download a copy of my report</button>', '<button class="ghostbtn" type="button" id="againBtn">Take the check again</button>']);
    expect(closing.split('<div class="report-utilities">').length - 1).toBe(1);
    expect(closing.slice(closing.indexOf('<div class="report-utilities">'))).toBe('<div class="report-utilities">' + buttons(oldClosing).join("") + '</div></div>');
    expect(closing).not.toMatch(/<form|<input|<ul|<li|role=|tabindex=|disabled=|onclick=/);
    const css = stylesheet(source), oldCSS = stylesheet(original);
    expect(css.replace(panelCSS, "")).toBe(oldCSS);
    for (const selector of ["body", "h1, h2, h3, .serif", "button", ".cta", ".closing h2", ".closing p", ".closing .cta", ".closing .pl", ".ghostbtn", ".call-note"]) {
      const rule = (s: string) => [...s.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m => m[1].trim() === selector).map(m => m[0]);
      expect(rule(css)).toEqual(rule(oldCSS)); expect(rule(css).length).toBeGreaterThan(0);
    }
    for (const token of ['font-family: "Karla", system-ui, sans-serif;', 'h1, h2, h3, .serif { font-family: "Lora", Georgia, serif; }', 'button { font-family: inherit; cursor: pointer; }', 'font-size: 16px; font-weight: 700; color: var(--ink);']) expect(css).toContain(token);
    expect(source.match(/<link[^>]*>/g)).toEqual(original.match(/<link[^>]*>/g));
  });

  it("freezes the pure helper, strictly rejects missing duplicate mixed and tampered fragment counts, preserves old idempotence and unrelated edits, and keeps all outside JavaScript, engine model demo download and reset behavior unchanged", () => {
    const helperSource = read(helper), current = read(page), original = before(page);
    expect(createHash("sha256").update(helperSource).digest("hex")).toBe(helperSHA);
    expect(helperSource).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    const malformed = [""];
    for (const f of fragments) {
      malformed.push(current.replace(f.new, ""), current + f.new, current + f.old, original + f.old, original + f.new, original.replace(f.old, ""), current.replace(f.new, f.old));
      const tamperedNew = f.new.replace(f === fragments[0] ? "48px" : f === fragments[1] ? "7 days" : 'id="againBtn"', "UNAPPROVED");
      const tamperedOld = f.old.replace(f === fragments[0] ? "</style>" : f === fragments[1] ? "7 days" : 'id="againBtn"', "UNAPPROVED");
      malformed.push(current.replace(f.new, tamperedNew), original.replace(f.old, tamperedOld));
    }
    for (const token of ["var(--rasp-soft)", "4px solid var(--plum)", "48px", "1px solid var(--line)", "24px", "8px"]) malformed.push(current.replace(panelCSS, panelCSS.replace(token, "UNAPPROVED")));
    for (const path of [page, built, resolve(root, page), resolve(root, built), page.replaceAll("/", "\\"), "C:\\project\\" + built.replaceAll("/", "\\")]) {
      for (const bad of malformed) expect(() => inverseHormoneQuizPanel(path, bad)).toThrow("Quiz panel scope mismatch");
      expect(inverseHormoneQuizPanel(path, original)).toBe(original);
      expect(inverseHormoneQuizPanel(path, current)).toBe(original);
      expect(inverseHormoneQuizPanel(path, inverseHormoneQuizPanel(path, current))).toBe(original);
      expect(inverseHormoneQuizPanel(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      const edited = current.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>');
      expect(inverseHormoneQuizPanel(path, edited)).toBe(original.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>'));
      expect(inverseHormoneQuizPanel(path, edited)).not.toBe(original);
    }
    for (const path of ["other.ts", "client/intake/index.html", "client/public/other.html", "dist/public/other.html", page + ".bak", "client/src/pages/WeightLossMenopauseV2.tsx"]) {
      expect(inverseHormoneQuizPanel(path, current)).toBe(current); expect(inverseHormoneQuizPanel(path, "")).toBe("");
    }
    expect(scripts(current)).toHaveLength(2);
    expect(scripts(current).map(s => s.replace(fragments[1].new, fragments[1].old).replace(fragments[2].new, fragments[2].old))).toEqual(scripts(original));
    scripts(current).forEach(s => expect(() => new Script(s)).not.toThrow());
    expect(current.slice(current.indexOf('      $("againBtn").addEventListener'))).toBe(original.slice(original.indexOf('      $("againBtn").addEventListener')));
    expect(current.replace(fragments[0].new, fragments[0].old).replace(fragments[1].new, fragments[1].old).replace(fragments[2].new, fragments[2].old)).toBe(original);
    for (const query of ["", "?prefill=demo", "?utm_source=synthetic&prefill=demo", "?prfill=demo", "?prefill=Demo"]) {
      const actual = engine(current, query), baseline = engine(original, query);
      expect(actual.env.demoPrefill).toBe(query === "?prefill=demo" || query === "?utm_source=synthetic&prefill=demo");
      for (const key of ["QUESTIONS", "ITEM_DEFS", "DOMAINS", "BANDS", "answers", "order", "submissionRecord"]) expect(JSON.stringify(actual.env[key])).toBe(JSON.stringify(baseline.env[key]));
      expect(actual.env.QUESTIONS).toHaveLength(32);
      for (const x of [actual, baseline]) {
        if (!x.env.demoPrefill) x.env.QUESTIONS.forEach((q: any) => x.env.answers[q.id] = q.multi ? [q.opts.length - 1] : 0);
        x.env.renderReport();
      }
      expect(JSON.stringify(actual.env.computeModel())).toBe(JSON.stringify(baseline.env.computeModel()));
      expect(JSON.stringify(actual.env.pickPattern(actual.env.computeModel()))).toBe(JSON.stringify(baseline.env.pickPattern(baseline.env.computeModel())));
      expect(JSON.stringify(actual.env.driverMetrics(actual.env.computeModel()))).toBe(JSON.stringify(baseline.env.driverMetrics(baseline.env.computeModel())));
      expect(inverseRenderedPanel(actual.node("reportBody").innerHTML)).toBe(baseline.node("reportBody").innerHTML);
      for (const x of [actual, baseline]) x.node("dlBtn").handlers.click();
      expect(actual.blob().parts).toEqual(baseline.blob().parts);
      expect(actual.blob().options).toEqual(baseline.blob().options); expect(actual.blob().options).toEqual({ type: "text/plain" });
      expect(actual.downloads).toEqual(baseline.downloads); expect(actual.downloads).toEqual([{ href: "blob:synthetic-local-report", download: "my-hormone-report.txt" }]);
      actual.timers.forEach(fn => fn()); baseline.timers.forEach(fn => fn());
      expect(actual.revocations).toEqual(baseline.revocations); expect(actual.revocations).toEqual(["blob:synthetic-local-report"]);
      for (const x of [actual, baseline]) {
        for (const id of ["gateName", "gateEmail", "gatePhone"]) x.node(id).value = "synthetic-local-only";
        x.node("againBtn").handlers.click();
        expect(x.env.pos).toBe(0); expect(x.env.submissionRecord).toBeNull(); expect(x.env.window.__quizSubmission).toBeNull();
        expect(x.node("submissionData").textContent).toBe("");
        for (const id of ["gateName", "gateEmail", "gatePhone"]) expect(x.node(id).value).toBe("");
        expect(x.node("report").classList.contains("hidden")).toBe(true); expect(x.node("intro").classList.contains("hidden")).toBe(false);
      }
      expect(JSON.stringify(actual.env.answers)).toBe(JSON.stringify(baseline.env.answers));
      expect(JSON.stringify(actual.env.order)).toBe(JSON.stringify(baseline.env.order));
    }
  });
});
