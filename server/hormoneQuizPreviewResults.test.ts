import { createHash } from "node:crypto"; import { createHash as publicMarketingCreateHash } from "node:crypto"; import { publicMarketingHistoricalSource, publicMarketingApprovedInventory } from "./fixtures/publicMarketingPixelScope"; const publicMarketingHelperSHA = "e3afb1740354430518b39a9e1102b8b1afec18fc53796c6e9879ea3472a97e72"; import { createHash as oldRemovalCreateHash } from "node:crypto"; import { oldMetaPixelRemovalHistoricalSource, oldMetaPixelRemovalApprovedInventory, oldMetaPixelRemovalNeedsInverse, OLD_REMOVAL_SOURCE_PATHS } from "./fixtures/oldMetaPixelRemovalScope"; const oldRemovalHelperSHA = "844f119278b6da6e807529d1446163610a3585dee5065cfad49f7bac01be4c2f"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import type { Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQuizPreviewResultsHtml, serveQuizPreviewResults } from "./hormoneQuizPreviewResults";
import { inverseHormoneQuizPreviewResults, previewResultsHistoricalSource, previewResultsInventoryPin } from "./fixtures/hormoneQuizPreviewResultsScope";

const io = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("node:fs", async importOriginal => ({ ...await importOriginal<typeof import("node:fs")>(), readFile: io.read }));
const root = resolve(import.meta.dirname, "..");
const base = "73b547a6";
const page = "client/public/hormone-symptom-quiz.html";
const modulePath = "server/hormoneQuizPreviewResults.ts";
const helperPath = "server/fixtures/hormoneQuizPreviewResultsScope.ts";
const directPath = "server/hormoneQuizPreviewResults.test.ts";
const html = oldMetaPixelRemovalHistoricalSource(page, metaLeadConversionsHistoricalSource(page, beforeMetaSchedule(page, readFileSync(resolve(root, page), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA);
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !metaScheduleApprovedInventory(p, readFileSync(resolve(root, p), "utf8"), metaScheduleHelperSHA); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !metaLeadConversionsApprovedInventory(p, beforeMetaSchedule(p, readFileSync(resolve(root, p), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"), META_LEAD_CONVERSIONS_SOURCE_PATHS.includes(p) && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !oldMetaPixelRemovalApprovedInventory(p, metaLeadConversionsHistoricalSource(p, beforeMetaSchedule(p, readFileSync(resolve(root, p), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA, OLD_REMOVAL_SOURCE_PATHS.includes(p) && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !publicMarketingApprovedInventory(p, oldMetaPixelRemovalHistoricalSource(p, metaLeadConversionsHistoricalSource(p, beforeMetaSchedule(p, readFileSync(resolve(root, p), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA); }).join("\n");
const transport = '<script defer src="/assets/hormone-quiz-transport.js"></script>';
const scripts = (value: string) => [...value.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const req = (preview?: unknown) => ({ query: preview === undefined ? {} : { preview } }) as Pick<Request, "query">;
function response() {
  const res = { setHeader: vi.fn(), status: vi.fn(), type: vi.fn(), send: vi.fn(), sendFile: vi.fn() };
  res.status.mockReturnValue(res); res.type.mockReturnValue(res); res.send.mockReturnValue(res);
  return res;
}
function execute(value: string, readyState = "complete") {
  const nodes: Record<string, any> = {}, documentHandlers: Record<string, { callback: () => void; options: unknown }> = {};
  const node = (id: string) => nodes[id] ??= {
    innerHTML: "", textContent: "", value: "", handlers: {} as Record<string, () => void>,
    classList: { names: new Set(["quiz", "gate", "report"].includes(id) ? ["hidden"] : []), add(name: string) { this.names.add(name); }, remove(name: string) { this.names.delete(name); }, contains(name: string) { return this.names.has(name); } },
    addEventListener(name: string, callback: () => void) { this.handlers[name] = callback; },
    setAttribute: vi.fn(), removeAttribute: vi.fn(), focus: vi.fn(), reset: vi.fn(), setSelectionRange: vi.fn(),
  };
  const forbidden = vi.fn(() => { throw Error("Preview must not perform clinical, storage or tracking I/O"); });
  const window = { location: { search: "?preview=results" }, addEventListener: vi.fn(), scrollTo: vi.fn(), __quizSubmission: undefined as unknown, mmdQuizComplete: forbidden, mmdQuizReset: forbidden, fetch: forbidden, navigator: { sendBeacon: forbidden }, localStorage: { setItem: forbidden }, sessionStorage: { setItem: forbidden }, dataLayer: { push: forbidden }, gtag: forbidden, hj: forbidden };
  const context: Record<string, any> = { window, document: { readyState, getElementById: node, addEventListener: (name: string, callback: () => void, options: unknown) => { documentHandlers[name] = { callback, options }; }, createElement: forbidden, body: { appendChild: forbidden } }, URLSearchParams, setTimeout: forbidden, clearTimeout: vi.fn(), fetch: forbidden, XMLHttpRequest: forbidden, navigator: window.navigator, localStorage: window.localStorage, sessionStorage: window.sessionStorage, Blob: forbidden, URL: { createObjectURL: forbidden }, console };
  for (const script of scripts(value)) runInNewContext(script, context);
  return { context, window, node, forbidden, documentHandlers };
}
afterEach(() => { io.read.mockReset(); vi.unstubAllEnvs(); });

describe("Hormone quiz development-only immediate sample results — frozen preview scope", () => {
  it("accepts only the exact development/results pair and ignores production, test, unset, arrays and nonexact query values without I/O or response mutation", () => {
    for (const environment of ["production", "test", "", "Development"]) {
      const res = response(); expect(serveQuizPreviewResults(req("results"), res as unknown as Response, "/synthetic/template.html", environment)).toBe(false);
      for (const method of Object.values(res)) expect(method).not.toHaveBeenCalled();
    }
    vi.stubEnv("NODE_ENV", undefined);
    const unset = response(); expect(serveQuizPreviewResults(req("results"), unset as unknown as Response, "/synthetic/template.html")).toBe(false);
    for (const method of Object.values(unset)) expect(method).not.toHaveBeenCalled();
    for (const preview of [undefined, null, "", "result", "Results", "results ", ["results"], ["results", "results"], { value: "results" }, true]) {
      const res = response(); expect(serveQuizPreviewResults(req(preview), res as unknown as Response, "/synthetic/template.html", "development")).toBe(false);
      for (const method of Object.values(res)) expect(method).not.toHaveBeenCalled();
    }
    expect(io.read).not.toHaveBeenCalled();
  });

  it("claims the active development response once, reads only the supplied local template and returns no-store HTML without sendFile or clinical imports", () => {
    const res = response(); expect(serveQuizPreviewResults(req("results"), res as unknown as Response, "/synthetic/template.html", "development")).toBe(true);
    expect(res.setHeader.mock.calls).toEqual([["Cache-Control", "no-store"]]); expect(res.send).not.toHaveBeenCalled();
    expect(io.read).toHaveBeenCalledTimes(1); expect(io.read.mock.calls[0].slice(0, 2)).toEqual(["/synthetic/template.html", "utf8"]);
    io.read.mock.calls[0][2](null, html);
    expect(res.type.mock.calls).toEqual([["html"]]); expect(res.send.mock.calls).toEqual([[buildQuizPreviewResultsHtml(html)]]);
    expect(res.status).not.toHaveBeenCalled(); expect(res.sendFile).not.toHaveBeenCalled();
    expect(oldMetaPixelRemovalHistoricalSource(modulePath, metaLeadConversionsHistoricalSource(modulePath, beforeMetaSchedule(modulePath, readFileSync(resolve(root, modulePath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).not.toMatch(/import[^\n]*(?:Store|Service|Routes|routers|db|webhook)|fetch\s*\(|XMLHttpRequest|sendBeacon|writeFile|\.mutate\s*\(|\.insert\s*\(/);
  });

  it("removes only the transport tag, appends one boot script and preserves every existing script, CSS, question, scoring, route contract and CSP byte", () => {
    const preview = buildQuizPreviewResultsHtml(html), boot = scripts(preview).at(-1)!;
    expect(preview).not.toContain(transport); expect(preview.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toBeNull();
    expect(scripts(preview).slice(0, -1)).toEqual(scripts(html));
    expect(preview.replace('<script>' + boot + '</script>\n</body>', '</body>')).toBe(html.replace(transport, ""));
    expect(preview.match(/<style\b[^>]*>[\s\S]*?<\/style>/g)).toEqual(html.match(/<style\b[^>]*>[\s\S]*?<\/style>/g));
    expect(preview.match(/<meta[^>]*(?:Content-Security-Policy|name="referrer")[^>]*>/g)).toEqual(html.match(/<meta[^>]*(?:Content-Security-Policy|name="referrer")[^>]*>/g));
    expect(boot).not.toMatch(/mmdQuizComplete|mmdQuizReset|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|gateName|gateEmail|gatePhone|dataLayer|gtag|webhook|\.submit\s*\(/);
    expect(html).toBe(git("show", base + ":" + page)); expect(hash(html)).toBe("dd1e18e38a7a3717a602619e0cf30b09ce24cb2203309b50ea8e848516e5b1e8");
  });

  it("executes the unchanged demo prefill and actual report immediately, without contact submission, completion events, persistence, downloads or tracking", () => {
    const current = execute(buildQuizPreviewResultsHtml(html)), sample = execute(html.replace(transport, ""));
    runInNewContext("demoPrefill = true; prefillDemoAnswers(); syncConditional(); renderReport();", sample.context);
    expect(current.node("reportBody").innerHTML).toBe(sample.node("reportBody").innerHTML); expect(current.node("reportBody").innerHTML).toContain("Driver No.");
    expect(JSON.stringify(current.context.answers)).toBe(JSON.stringify(sample.context.answers)); expect(current.context.computeModel()).toEqual(sample.context.computeModel());
    expect(current.context.demoPrefill).toBe(true); expect(current.context.order).toContain("weirdWorst");
    for (const id of ["intro", "quiz", "gate"]) expect(current.node(id).classList.contains("hidden")).toBe(true);
    expect(current.node("report").classList.contains("hidden")).toBe(false);
    expect(current.context.submissionRecord).toBeNull(); expect(current.window.__quizSubmission).toBeNull(); expect(current.node("submissionData").textContent).toBe("");
    for (const id of ["gateName", "gateEmail", "gatePhone"]) expect(current.node(id).value).toBe("");
    expect(current.forbidden).not.toHaveBeenCalled(); expect(sample.forbidden).not.toHaveBeenCalled();
  });

  it("waits for one DOMContentLoaded callback when loading and leaves raw published HTML inactive under preview=results", () => {
    const loading = execute(buildQuizPreviewResultsHtml(html), "loading");
    expect(loading.node("reportBody").innerHTML).toBe(""); expect(loading.documentHandlers.DOMContentLoaded.options).toEqual({ once: true });
    loading.documentHandlers.DOMContentLoaded.callback(); expect(loading.node("reportBody").innerHTML).not.toBe(""); expect(loading.forbidden).not.toHaveBeenCalled();
    const raw = execute(html.replace(transport, "")); expect(raw.context.demoPrefill).toBe(false); expect(raw.context.answers).toEqual({});
    expect(raw.node("reportBody").innerHTML).toBe(""); expect(raw.documentHandlers.DOMContentLoaded).toBeUndefined(); expect(raw.forbidden).not.toHaveBeenCalled();
  });

  it("fails closed for missing, duplicate and corrupt transform anchors and local read failures without sending raw HTML or template details", () => {
    for (const bad of ["", html.replace(transport, ""), html + transport, html.replace(transport, transport.replace("defer", "async")), html.replace("</body>", ""), html + "</body>"]) expect(() => buildQuizPreviewResultsHtml(bad)).toThrow("Quiz preview template unavailable");
    for (const [error, template] of [[new Error("SYNTHETIC missing /private/path"), undefined], [null, "NO_TEMPLATE_ANCHORS"]] as const) {
      io.read.mockReset(); const res = response(); expect(serveQuizPreviewResults(req("results"), res as unknown as Response, "/synthetic/missing.html", "development")).toBe(true);
      io.read.mock.calls[0][2](error, template);
      expect(res.status.mock.calls).toEqual([[500]]); expect(res.type.mock.calls).toEqual(error ? [["text/plain"]] : [["html"], ["text/plain"]]); expect(res.send.mock.calls).toEqual([["Preview unavailable"]]); expect(res.sendFile).not.toHaveBeenCalled();
    }
  });

  it("strictly inverses the whole index and historical sources latest-first, pins exact additions and keeps all prior raw production, fixtures, contracts, CSP and backends frozen", () => {
    const indexPath = "server/_core/index.ts", current = oldMetaPixelRemovalHistoricalSource(indexPath, metaLeadConversionsHistoricalSource(indexPath, beforeMetaSchedule(indexPath, readFileSync(resolve(root, indexPath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), original = git("show", base + ":" + indexPath);
    expect(hash(current)).toBe("72cbb65be59db9b36b6f661e254f72930379e16f903de450204742c691b26b36"); expect(hash(original)).toBe("ba14498f9ce69aa0cbd267903e9dc0325c71c8e043a031c0cdc82a705ccb5218");
    for (const path of [indexPath, resolve(root, indexPath), indexPath.replaceAll("/", "\\")]) {
      expect(inverseHormoneQuizPreviewResults(path, current, hash)).toBe(original); expect(inverseHormoneQuizPreviewResults(path, original, hash)).toBe(original);
      for (const bad of ["", current + "UNAPPROVED", current.replace("serveQuizPreviewResults(req, res, hormoneSymptomQuizHtml)", "serveQuizPreviewResults(req, res, otherHtml)")]) expect(() => inverseHormoneQuizPreviewResults(path, bad, hash)).toThrow("Quiz preview results index scope mismatch");
    }
    expect(inverseHormoneQuizPreviewResults(indexPath + ".bak", current, hash)).toBe(current);
    const helper = oldMetaPixelRemovalHistoricalSource(helperPath, metaLeadConversionsHistoricalSource(helperPath, beforeMetaSchedule(helperPath, readFileSync(resolve(root, helperPath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), helperSHA = hash(helper);
    const helperCode = helper.split("\n").slice(1).join("\n").replace(/"(?:[^"\\]|\\.)*"/g, '"FROZEN_DATA_LITERAL"');
    expect(helperCode).not.toMatch(/(?<![.\w])(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(oldMetaPixelRemovalHistoricalSource(directPath, metaLeadConversionsHistoricalSource(directPath, beforeMetaSchedule(directPath, readFileSync(resolve(root, directPath), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).not.toMatch(/from\s+["'][^"']*\.test["']/);
    for (const path of [modulePath, directPath]) expect(hash(publicMarketingHistoricalSource(path, oldMetaPixelRemovalHistoricalSource(path, metaLeadConversionsHistoricalSource(path, beforeMetaSchedule(path, readFileSync(resolve(root, path), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA))).toBe(previewResultsInventoryPin(path));
    expect(previewResultsInventoryPin(modulePath + ".bak")).toBeNull();
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const entries = git("ls-tree", "-r", base, "--", ...scope).trim().split("\n").map(line => { const [metadata, path] = line.split("\t"); return { path, blobSHA: metadata.split(" ")[2] }; });
    const paths = entries.map(entry => entry.path);
    for (const { path, blobSHA } of entries) {
      const raw = (path === "server/_core/vite.ts" || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path) ? Buffer.from(publicMarketingHistoricalSource(path, (oldMetaPixelRemovalNeedsInverse(path) ? Buffer.from(oldMetaPixelRemovalHistoricalSource(path, (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8")))).toString("utf8"), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)) : (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))))).toString("utf8"), s => publicMarketingCreateHash("sha256").update(s).digest("hex"), publicMarketingHelperSHA)) : (oldMetaPixelRemovalNeedsInverse(path) ? Buffer.from(oldMetaPixelRemovalHistoricalSource(path, (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8")))).toString("utf8"), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)) : (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : Buffer.from(beforeMetaSchedule(path, readFileSync(resolve(root, path)).toString("utf8"))))));
      const restored = path === indexPath || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path) ? Buffer.from(previewResultsHistoricalSource(path, raw.toString("utf8"), hash, helperSHA)) : raw;
      expect(createHash("sha1").update(Buffer.from("blob " + restored.length + "\0")).update(restored).digest("hex"), path).toBe(blobSHA);
    }
    const old = new Set(paths), additions = git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(path => path && !old.has(path));
    expect(additions.sort()).toEqual([modulePath, directPath, helperPath].sort());
  });
});
