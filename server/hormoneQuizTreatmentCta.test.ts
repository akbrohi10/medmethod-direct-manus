import { createHash } from "node:crypto"; import { inverseHormoneQuizPanel } from "./fixtures/hormoneQuizPanelScope"; import { inverseHormoneQuizPhone } from "./fixtures/hormoneQuizPhoneScope"; import { inverseHormoneQuizIntegration } from "./fixtures/hormoneQuizIntegrationScope"; import { readFileSync as integrationReadFileSync } from "node:fs"; import { createHash as integrationCreateHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizTreatmentCta } from "./fixtures/hormoneQuizTreatmentCtaScope";

const root = resolve(import.meta.dirname, "..");
const page = "client/public/hormone-symptom-quiz.html";
const built = "dist/public/hormone-symptom-quiz.html";
const helper = "server/fixtures/hormoneQuizTreatmentCtaScope.ts";
const helperSHA = "4e2c90b2879cb08ced0129214db38f67751ec239632f99f353dd371e61b93668";
const read = (p: string) => inverseHormoneQuizPanel(p, inverseHormoneQuizPhone(p, inverseHormoneQuizIntegration(p, readFileSync(resolve(root, p), "utf8"))));
const before = (p: string) => execFileSync("git", ["show", "4bd780d8:" + p], { cwd: root, encoding: "utf8" });
const oldBlock = `      /* Closing — the discovery call, offered now that she has her report.
         Booking completes on MedMethod Direct's booking page (the same
         https://medmethoddirect.com destination the call CTA already used);
         no answers, score, or pattern travel with the link. */
      html += '<div class="closing"><div class="pl">Your next step</div><h2>Book your discovery call.</h2>'
        + "<p>Now that you have your report, book a discovery call with the MedMethod Direct care team. They'll walk through this report with you, answer your questions, and explain how MMD can help — and if you want treatment, they'll send you the intake link right on the call.</p>"
        + '<ul class="call-points"><li><b>Free</b> — no cost, and no obligation to start anything</li><li><b>15 minutes</b> — by phone, at a time you pick</li><li><b>Your report, walked through</b> — your pattern, your score, and what to do about them</li></ul>'
        + '<a class="cta" href="https://medmethoddirect.com/care-team-booking" target="_blank" rel="noopener">Book my discovery call</a>'
`;
const newBlock = `      /* Closing — treatment-first intake with an optional discovery call.
         Both links open their approved destinations without sending answers,
         score, pattern, or contact details in the URL. */
      html += '<div class="closing"><div class="pl">READY TO EXPLORE YOUR TREATMENT OPTIONS?</div><h2>Connect with a Hormone &amp; Weight Loss Doctor—for FREE.</h2>'
        + "<p>Discuss your symptoms and explore treatment options directly with Dr. Al-Deek, a menopause and weight loss specialist.</p>"
        + "<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes 7 days of follow-up messaging, free.</p>"
        + '<a class="cta" href="https://intake.medmethoddirect.com/" target="_blank" rel="noopener">Connect with Dr. Al-Deek—Free</a>'
        + '<p class="call-note">Not ready yet? <a href="https://medmethoddirect.com/care-team-booking" target="_blank" rel="noopener" style="color:var(--plum);font-weight:800;text-decoration:underline">Book a free discovery call</a> instead.</p>'
`;
const credentialsAndControls = `        + '<p class="call-note">MedMethod Direct is led by Dr. Jumana Al-Deek, DO — board-certified family physician and Menopause Society Certified Practitioner.</p>'
        + '<button class="ghostbtn" type="button" id="dlBtn">Download a copy of my report</button>'
        + '<button class="ghostbtn" type="button" id="againBtn">Take the check again</button></div>';`;
const scripts = (s: string) => [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
function renderClosing(block: string): string {
  const context = { html: "" };
  runInNewContext(block + credentialsAndControls, context);
  return context.html;
}
function engine(source: string, search: string) {
  const nodes: Record<string, any> = {}, timers: Function[] = [], downloads: any[] = [], revocations: string[] = [];
  const node = (id: string): any => nodes[id] ??= {
    value: "", textContent: "", innerHTML: "", children: [], handlers: {}, style: {}, attributes: {},
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    addEventListener(name: string, fn: Function) { this.handlers[name] = fn; },
    setAttribute(name: string, value: string) { this.attributes[name] = value; }, removeAttribute() {}, focus() {},
    appendChild(child: any) { this.children.push(child); }, click() { downloads.push({ href: this.href, download: this.download }); }, remove() {},
    reset() { for (const id of ["gateName", "gateEmail", "gatePhone"]) node(id).value = ""; },
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

describe("Quiz treatment CTA — approved report closing block only", () => {
  it("restores the complete source and built HTML exactly to 4bd780d8 and changes only the approved production file with a frozen pure helper exception", () => {
    const previous = before(page), current = read(page);
    expect(previous.split(oldBlock).length - 1).toBe(1);
    expect(previous.split(newBlock).length - 1).toBe(0);
    expect(current.split(newBlock).length - 1).toBe(1);
    expect(current.split(oldBlock).length - 1).toBe(0);
    expect(current).toBe(previous.replace(oldBlock, newBlock));
    for (const path of [page, built]) {
      expect(read(path)).toBe(current);
      expect(inverseHormoneQuizTreatmentCta(path, read(path))).toBe(previous);
    }
    const scope = ["client", "server", "shared", "drizzle", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const paths = [...execFileSync("git", ["diff", "--name-only", "4bd780d8", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).split("\n")].filter(p => { const approvedSHA = p === "server/fixtures/hormoneQuizIntegrationScope.ts" ? "c213c08ee14e7d5195640881e15390d7ef3a35a13d71d153019e061f9711b80f" : p === "client/quiz-webhook-transport.ts" ? "1b0ab7d0d2f64e88a84b967159711d6033d79320baeef5b38c81845279e4cc3e" : p === "client/src/components/AdminQuizWebhooks.tsx" ? "1a4a4ea0221a621a95fdd1647c179dda582d83277ec70dedee7764b4fbb6d25f" : p === "drizzle/0018_greedy_moonstone.sql" ? "b38e984d44625730eaebca8ebfbe92c622897e7b776f2601b2b3affb427266f2" : p === "drizzle/meta/0018_snapshot.json" ? "aacbfbb9c0b8aa07bba06e7b6dc8adbd628edac958f5674c08c500d30c4c5680" : p === "server/hormoneQuizModel.ts" ? "969021c16190e99ecdb338049c10f7dcff9729293ae1509e1049544e3b3b201f" : p === "server/hormoneQuizPdf.ts" ? "8dfc2c0f606ac64d65dd3619bcba5f44297e8c11a90a3777e55c260067b2615c" : p === "server/hormoneQuizPrivateReport.ts" ? "0b09d70a1da392697b7c17e5c55c4a0c8c4cc244e96bed1afdac8c1aa68dc834" : p === "server/hormoneQuizRoutes.ts" ? "713d5f0a7c63f78ba6b24401779256d2dc4a68803b0eda6779e0c7eda6556e02" : p === "server/hormoneQuizSecurity.ts" ? "39d4b6330fb8c1d8967133d88e170a697416a95fc240cce8bf75dcf326e3bb9b" : p === "server/hormoneQuizService.ts" ? "ae03caf253af04e89b990dbfc515eda6e945f8a69b2e32fbf37532af52113b24" : p === "server/hormoneQuizStore.ts" ? "7a01d7245f73a051e886774b10e8893a31aaaad9b301c6bc31fd78ff22ce9d6a" : p === "server/routers/hormoneQuiz.ts" ? "1c1404a42c9e1d89c19440bd0533c0267a1fcd9636068b2491c22da29efbe9a6" : null; if (approvedSHA) { expect(integrationCreateHash("sha256").update(integrationReadFileSync(resolve(process.cwd(), p), "utf8")).digest("hex")).toBe(approvedSHA); return false; } const baselineSHA = p === ".gitignore" ? "b4572613f7e7b7827f8dd1c7543b03f903082ba146ebe8115dd9bd81aebd4bee" : p === "client/src/pages/AdminSettings.tsx" ? "1fb9dc9c6c5a2f9be62dbf2bc8bfde870a4b3a41a32d767011d8d3cb57e3643b" : p === "drizzle/meta/_journal.json" ? "95c6b9bfc4ee56f65a5b59ee60ac9507746dee6e4bb0425ee397377ff653373b" : p === "drizzle/schema.ts" ? "b1b087b3c94cbd5c3a5395358b72b4e1c682b33317ebae806a2e962e7c9b3530" : p === "package.json" ? "9026530d7237c3303799cda328f2d3cc488e74cbc35d73df6b190a428b99bd42" : p === "server/_core/index.ts" ? "14ad2b6e75c8efb044e803f70d2239a7f87e5476219bd21f15b8b956fab2deeb" : p === "server/routers.ts" ? "4f89f8904bf00da655ee411ef26c721503af3083843bc1b92823b82b0161e116" : null; if (baselineSHA) { expect(integrationCreateHash("sha256").update(inverseHormoneQuizIntegration(p, integrationReadFileSync(resolve(process.cwd(), p), "utf8"))).digest("hex")).toBe(baselineSHA); return ![".gitignore", "client/src/pages/AdminSettings.tsx", "drizzle/meta/_journal.json", "drizzle/schema.ts", "package.json", "server/_core/index.ts", "server/routers.ts"].includes(p); } return true; }).filter(p => p && !/^server\/[^/]+\.test\.ts$/.test(p)).filter(p => {
      if (p === "server/fixtures/hormoneQuizPanelScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("f3e3c8f12ba66965de9fca2140e1842b43d6865b7f833a9e49485bbc4b9c4798"); return false; } if (p === "server/fixtures/hormoneQuizPhoneScope.ts") { expect(createHash("sha256").update(read(p)).digest("hex")).toBe("a1da7935b8aa5a94ea012f6b194339943f31bf799a066ed562bfba3c058fcb25"); return false; } if (p !== helper) return true;
      expect(createHash("sha256").update(read(p)).digest("hex")).toBe(helperSHA);
      return false;
    });
    expect([...new Set(paths)].sort()).toEqual([page]);
    for (const p of execFileSync("git", ["ls-tree", "-r", "--name-only", "4bd780d8", "--", "server/fixtures"], { cwd: root, encoding: "utf8" }).trim().split("\n")) expect(read(p)).toBe(before(p));
  });

  it("renders the exact approved eyebrow, heading, two paragraphs and two plain safe new-tab URLs without the old three benefit boxes or PHI in queries", () => {
    const source = read(page), closing = renderClosing(newBlock), previous = renderClosing(oldBlock);
    expect(source).toContain(newBlock + credentialsAndControls);
    expect(closing).toContain('<div class="pl">READY TO EXPLORE YOUR TREATMENT OPTIONS?</div>');
    expect(closing).toContain('<h2>Connect with a Hormone &amp; Weight Loss Doctor—for FREE.</h2>');
    expect(closing).toContain('<p>Discuss your symptoms and explore treatment options directly with Dr. Al-Deek, a menopause and weight loss specialist.</p>');
    expect(closing).toContain('<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes 7 days of follow-up messaging, free.</p>');
    expect([...closing.matchAll(/<p>(.*?)<\/p>/g)].map(m => m[1])).toHaveLength(2);
    const links = [...closing.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)];
    expect(links).toHaveLength(2);
    expect(links.map(m => m[2])).toEqual(["Connect with Dr. Al-Deek—Free", "Book a free discovery call"]);
    expect(links.map(m => m[1].match(/href="([^"]*)"/)?.[1])).toEqual(["https://intake.medmethoddirect.com/", "https://medmethoddirect.com/care-team-booking"]);
    for (const link of links) {
      expect(link[1]).toContain('target="_blank"'); expect(link[1]).toContain('rel="noopener"');
      expect(link[1]).not.toMatch(/onclick|onmousedown|data-|javascript:|answers|score|pattern|email|phone|contact|\?|#/);
      const url = new URL(link[1].match(/href="([^"]*)"/)![1]);
      expect(url.protocol).toBe("https:"); expect(url.search).toBe(""); expect(url.hash).toBe(""); expect(url.username).toBe(""); expect(url.password).toBe("");
    }
    expect(links[0][1]).toContain('class="cta"'); expect(links[1][1]).not.toContain('class="cta"');
    expect(closing).toContain('<p class="call-note">Not ready yet? ');
    expect(closing).not.toMatch(/<ul|<li|call-points|Book my discovery call|Book your discovery call\.|Your next step|no obligation|15 minutes|Your report, walked through/);
    expect(previous.match(/<li>/g)).toHaveLength(3);
    expect(closing.slice(closing.indexOf('<p class="call-note">MedMethod Direct is led'))).toBe(previous.slice(previous.indexOf('<p class="call-note">MedMethod Direct is led')));
    expect(newBlock).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|window\.open|location\.|URLSearchParams|<form|<input/);
  });

  it("keeps every stylesheet, question, engine, scoring and report byte outside the closing block unchanged including local demo, download and reset behavior", () => {
    const current = read(page), previous = before(page);
    expect(current.replace(newBlock, "APPROVED_CLOSING_BLOCK")).toBe(previous.replace(oldBlock, "APPROVED_CLOSING_BLOCK"));
    expect(current.match(/<style>[\s\S]*?<\/style>/g)).toEqual(previous.match(/<style>[\s\S]*?<\/style>/g));
    expect(scripts(current)).toHaveLength(2);
    expect(scripts(current).map(s => s.replace(newBlock, "APPROVED_CLOSING_BLOCK"))).toEqual(scripts(previous).map(s => s.replace(oldBlock, "APPROVED_CLOSING_BLOCK")));
    scripts(current).forEach(s => expect(() => new Script(s)).not.toThrow());
    expect(current.slice(current.indexOf('      $("againBtn").addEventListener'))).toBe(previous.slice(previous.indexOf('      $("againBtn").addEventListener')));
    for (const query of ["", "?prefill=demo", "?prfill=demo", "?prefill=Demo"]) {
      const actual = engine(current, query), baseline = engine(previous, query);
      expect(JSON.stringify(actual.env.QUESTIONS)).toBe(JSON.stringify(baseline.env.QUESTIONS));
      expect(actual.env.QUESTIONS).toHaveLength(32);
      expect(JSON.stringify(actual.env.answers)).toBe(JSON.stringify(baseline.env.answers));
      expect(actual.env.demoPrefill).toBe(query === "?prefill=demo");
      for (const x of [actual, baseline]) {
        if (!x.env.demoPrefill) x.env.QUESTIONS.forEach((q: any) => x.env.answers[q.id] = q.multi ? [q.opts.length - 1] : 0);
        x.env.renderReport();
      }
      expect(JSON.stringify(actual.env.computeModel())).toBe(JSON.stringify(baseline.env.computeModel()));
      expect(actual.node("reportBody").innerHTML.replace(renderClosing(newBlock), "APPROVED_CLOSING_BLOCK")).toBe(baseline.node("reportBody").innerHTML.replace(renderClosing(oldBlock), "APPROVED_CLOSING_BLOCK"));
      for (const x of [actual, baseline]) x.node("dlBtn").handlers.click();
      expect(actual.blob().parts).toEqual(baseline.blob().parts);
      expect(actual.blob().options).toEqual({ type: "text/plain" });
      expect(actual.downloads).toEqual([{ href: "blob:synthetic-local-report", download: "my-hormone-report.txt" }]);
      actual.timers.forEach(fn => fn()); expect(actual.revocations).toEqual(["blob:synthetic-local-report"]);
      for (const x of [actual, baseline]) {
        for (const id of ["gateName", "gateEmail", "gatePhone"]) x.node(id).value = "synthetic-local-only";
        x.node("againBtn").handlers.click();
        expect(x.env.pos).toBe(0); expect(x.env.submissionRecord).toBeNull(); expect(x.env.window.__quizSubmission).toBeNull();
        expect(x.node("submissionData").textContent).toBe("");
        for (const id of ["gateName", "gateEmail", "gatePhone"]) expect(x.node(id).value).toBe("");
      }
      expect(JSON.stringify(actual.env.answers)).toBe(JSON.stringify(baseline.env.answers));
      expect(JSON.stringify(actual.env.order)).toBe(JSON.stringify(baseline.env.order));
    }
  });

  it("freezes the pure helper SHA and strictly rejects missing, duplicate, mixed and modified old/new blocks while preserving idempotence, absolute/windows/dist paths and unapproved edits", () => {
    const source = read(helper), current = read(page), original = before(page);
    expect(createHash("sha256").update(source).digest("hex")).toBe(helperSHA);
    expect(source).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    const count = (s: string, block: string) => s.split(block).length - 1;
    expect([count(current, newBlock), count(current, oldBlock)]).toEqual([1, 0]);
    expect([count(original, newBlock), count(original, oldBlock)]).toEqual([0, 1]);
    const malformed = ["", current.replace(newBlock, ""), current + newBlock, current + oldBlock, original + oldBlock, original + newBlock, original.replace(oldBlock, ""), current.replace(newBlock, newBlock.replace("FREE.", "PAID.")), original.replace(oldBlock, oldBlock.replace("Your next step", "UNAPPROVED"))];
    for (const token of ["READY TO EXPLORE YOUR TREATMENT OPTIONS?", "Hormone &amp; Weight Loss", "menopause and weight loss specialist", "7 days", "https://intake.medmethoddirect.com/", "https://medmethoddirect.com/care-team-booking", 'target="_blank"', 'rel="noopener"', "Connect with Dr. Al-Deek—Free", "Book a free discovery call"]) malformed.push(current.replace(newBlock, newBlock.replace(token, "UNAPPROVED")));
    for (const path of [page, built, resolve(root, page), resolve(root, built), page.replaceAll("/", "\\"), "C:\\project\\" + built.replaceAll("/", "\\")]) {
      for (const bad of malformed) expect(() => inverseHormoneQuizTreatmentCta(path, bad)).toThrow("Quiz treatment CTA scope mismatch");
      expect(inverseHormoneQuizTreatmentCta(path, original)).toBe(original);
      expect(inverseHormoneQuizTreatmentCta(path, current)).toBe(original);
      expect(inverseHormoneQuizTreatmentCta(path, inverseHormoneQuizTreatmentCta(path, current))).toBe(original);
      expect(inverseHormoneQuizTreatmentCta(path, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
      const changed = current.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>');
      expect(inverseHormoneQuizTreatmentCta(path, changed)).toBe(original.replace('<title>Hormone Symptom Quiz</title>', '<title>UNAPPROVED</title>'));
      expect(inverseHormoneQuizTreatmentCta(path, changed)).not.toBe(original);
    }
    for (const path of ["other.ts", "client/intake/index.html", "client/public/other.html", "dist/public/other.html", "client/public/hormone-symptom-quiz.html.bak", "client/src/pages/WeightLossMenopauseV2.tsx"]) {
      expect(inverseHormoneQuizTreatmentCta(path, current)).toBe(current);
      expect(inverseHormoneQuizTreatmentCta(path, "")).toBe("");
    }
  });
});
