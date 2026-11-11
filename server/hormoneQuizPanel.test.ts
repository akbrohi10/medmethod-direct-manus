import { createHash } from "node:crypto"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto"; import { inverseHormoneQuizGhlAnswerBlock } from "./fixtures/hormoneQuizGhlAnswerBlockScope"; import { inverseHormoneQuizSubmissionOrigin } from "./fixtures/hormoneQuizSubmissionOriginScope"; import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { gunzipSync as ctaPlacementGunzipSync } from "node:zlib"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { gunzipSync as letterRemovalGunzipSync } from "node:zlib"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { gunzipSync as doctorIntroGunzipSync } from "node:zlib";
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
const read = (p: string) => inverseHormoneQuizPhone(p, inverseHormoneQuizIntegration(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, inverseHormoneQuizDoctorIntro(p, readFileSync(resolve(root, p), "utf8")))))));
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
    const paths = [...execFileSync("git", ["diff", "--name-only", "e83671c7", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : p === "server/fixtures/hormoneQuizPrivacyScope.ts" ? "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156" : p === "server/hormoneQuizPrivacy.test.ts" ? "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c" : p === "server/fixtures/hormoneQuizSubmissionOriginScope.ts" ? "634e49eadc1c3ac7c3572582124b68b7db3543a642de13124a384794e1a9b905" : p === "server/fixtures/hormoneQuizGhlAnswerBlockScope.ts" ? "36bad6875b176d1d7cb671b38e64d53f352f38fb3a42969fcb98b9f4b48058b3" : p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, ((source: string) => { if (p !== "server/hormoneQuizPrivacy.test.ts") return source; const edits = JSON.parse(ctaPlacementGunzipSync(Buffer.from("H4sIAAAAAAACA7WTXW/aMBSG/4rrq0TK0oQkEILYVFWbuNxE7wgXjn0MnhI7sk0pq/rfdwICpHaruotJvrLOOc/7no/VMzWtoBVVXW+sJ8+EW2AeFsxtyQuR1nSkptoIqLg99N7UdEYjqmH/bznkEqv0I1gHC2M7o+HHTv269+x7yzh0oP01P76V6snvLLjb7Z9jl9z0MOh5ic4uuNHOE1QjyJwEfUWct0pvQjL/fPz9plpYHjQPsKxpHyGwxviI9GGExJ2XZU3Dq7/3qr1vI+ijD/PCtwY2yg/EOI6Z3bgzd7U+kuEJ+KVuTTG2phEZAqNhFHtRkRMFNDcC86oLi7y8cfcfUbHrW+Uxr641+oylaj3YoB8q4x5IEtysaiqUlEPVmrbuE4aAq+k6Vpq3OwEuGGCrZB2G2E/cBk283cGMnMT3SqN4LDifY74DizP52NrEHjHkC2YleSGbbCIbWfCGi5QnXCYTWULGWSLKnKVlkY6aIi1SKXJRZgW+Ih83fDQW/Gi1ei3hL+TYg/NXsoSkSSejLB+nI+B52iRiWmSSNWyaZmMoi5FIm4zLLEul5LmAiSh51nCW8mkzTcSRrHdtOzs1E7vxqkvD9xavMhh2MeixiTco8xjnt9bsyVdrjcUJDUrJ/cMd6S+HOCy49sYeyHJxRzrlOub5driPM0Oy1iEEB/3TKH2ZM67z+jcO4HOqVwQAAA==", "base64")).toString("utf8")) as {old: string; new: string}[]; for (const e of [...edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz CTA placement privacy test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== "ab258e67b82562ae04298394dba34c0bf021541fb6b452331509a9fb0e742e0c") throw Error("Quiz CTA placement privacy test SHA mismatch"); return source; })(inverseHormoneQuizCtaPlacement(p, ((source: string) => { const entry = (JSON.parse(letterRemovalGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz letter removal test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== entry.sha) throw Error("Quiz letter removal test SHA mismatch"); return source; })(inverseHormoneQuizLetterRemoval(p, ((source: string) => { const entry = (JSON.parse(doctorIntroGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz doctor introduction test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (integrationCreateHash("sha256").update(source).digest("hex") !== entry.sha) throw Error("Quiz doctor introduction test SHA mismatch"); return source; })(inverseHormoneQuizDoctorIntro(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))))))))).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, inverseHormoneQuizGhlAnswerBlock(p, inverseHormoneQuizSubmissionOrigin(p, inverseHormoneQuizPrivacy(p, inverseHormoneQuizCtaPlacement(p, inverseHormoneQuizLetterRemoval(p, inverseHormoneQuizDoctorIntro(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))))))))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p => p && !/^server\/[^/]+\.test\.ts$/.test(p)).filter(p => {
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
