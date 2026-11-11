import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer, request, type IncomingHttpHeaders, type Server } from "node:http";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";
import { describe, expect, it, vi } from "vitest";
import { buildIsolatedQuiz, buildIsolationShell, CAPTURE_ENABLED, HOTJAR_SITE_ID, isNeutralProgress, startIsolationPrototype } from "./hormoneQuizIsolationPrototype";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "client/public/hormone-symptom-quiz.html"), "utf8");
const parentOrigin = "http://127.0.0.1:32781", childOrigin = "http://127.0.0.1:32782";
const channel = "mmd_quiz_neutral_progress_v1";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const inlineScripts = (html: string) => [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const section = (html: string, start: string, end: string) => { const a = html.indexOf(start), b = html.indexOf(end, a + start.length); if (a < 0 || b < 0) throw Error("Missing frozen source section"); return html.slice(a, b); };
const isolated = () => buildIsolatedQuiz(source, parentOrigin, childOrigin);
type Observation = { method: string | undefined; url: string | undefined; headers: IncomingHttpHeaders; body: string };
async function localMock(status = 200, body = '[{"result":{"data":{"json":{"ok":true}}}}]') {
  const seen: Observation[] = [];
  const server = createServer(async (req, res) => {
    const parts: Buffer[] = []; for await (const part of req) parts.push(Buffer.from(part));
    seen.push({ method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(parts).toString("utf8") });
    res.writeHead(status, { "Content-Type": "application/json" }); res.end(body);
  });
  await new Promise<void>(yes => server.listen(0, "127.0.0.1", yes));
  const address = server.address(); if (!address || typeof address === "string") throw Error("Missing loopback listener");
  return { seen, origin: `http://127.0.0.1:${address.port}`, close: () => closeServer(server) };
}
async function closeServer(server: Server) { server.closeAllConnections(); await new Promise<void>(yes => server.close(() => yes())); }
async function freePorts() {
  const holders = [createServer(), createServer()];
  await Promise.all(holders.map(server => new Promise<void>(yes => server.listen(0, "127.0.0.1", yes))));
  const ports = holders.map(server => { const a = server.address(); if (!a || typeof a === "string") throw Error("Missing free port"); return a.port; });
  await Promise.all(holders.map(closeServer)); return { parentPort: ports[0], childPort: ports[1] };
}
async function withPrototype(qa: boolean, check: (instance: Awaited<ReturnType<typeof startIsolationPrototype>>, real: Awaited<ReturnType<typeof localMock>>, dummy: Awaited<ReturnType<typeof localMock>>) => Promise<void>) {
  const real = await localMock(), dummy = await localMock(202);
  let instance: Awaited<ReturnType<typeof startIsolationPrototype>> | undefined;
  try { instance = await startIsolationPrototype({ root, ...await freePorts(), backendOrigin: real.origin, ...(qa ? { qaSubmissionOrigin: dummy.origin } : {}) }); await check(instance, real, dummy); }
  finally { if (instance) await instance.close(); await Promise.all([real.close(), dummy.close()]); }
}
async function http(origin: string, path: string, options: { method?: string; headers?: Record<string, string>; body?: string } = {}) {
  if (new URL(origin).hostname !== "127.0.0.1") throw Error("Test network must be loopback");
  return await new Promise<{ status: number; headers: IncomingHttpHeaders; body: string }>((yes, no) => {
    const req = request(origin + path, { method: options.method ?? "GET", headers: options.headers }, async res => {
      const chunks: Buffer[] = []; for await (const chunk of res) chunks.push(Buffer.from(chunk));
      yes({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString("utf8") });
    }); req.on("error", no); req.end(options.body);
  });
}
const dummyInput = { "0": { json: { request_key: "local-dummy-" + "0".repeat(48), name: "SYNTHETIC LOCAL QA", email: "synthetic@example.invalid", phone: "+12025550123", answers: { age: 0, recognize: [0] } } } };
const payload = JSON.stringify(dummyInput);
const post = (origin: string, options: { headers?: Record<string, string>; body?: string; path?: string } = {}) => http(origin, options.path ?? "/api/trpc/hormoneQuiz.complete?batch=1", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...options.headers }, body: options.body ?? payload });

function shellVM() {
  const frameWindow = {}, listeners: Record<string, (event: unknown) => void> = {}, events: { type: string; detail: unknown }[] = [], output = { textContent: "intro" };
  runInNewContext(inlineScripts(buildIsolationShell(childOrigin, false))[0], {
    document: { getElementById: (id: string) => id === "privateQuiz" ? { contentWindow: frameWindow } : output },
    window: { addEventListener: (name: string, fn: (event: unknown) => void) => { listeners[name] = fn; }, dispatchEvent: (event: { type: string; detail: unknown }) => events.push(event) },
    CustomEvent: class { constructor(public type: string, public init: { detail: unknown }) {} get detail() { return this.init.detail; } },
  });
  return { frameWindow, output, events, message: (data: unknown, origin = childOrigin, sender = frameWindow) => listeners.message({ data, origin, source: sender }) };
}

async function transportVM() {
  const pending: { resolve: (result: { ok: boolean }) => void; reject: (error: Error) => void }[] = [], inputs: Record<string, unknown>[] = [], milestones: string[] = [];
  const bundled = await build({ entryPoints: [resolve(root, "client/quiz-isolation-transport.ts")], bundle: true, write: false, platform: "browser", format: "iife", plugins: [{ name: "local-only-mock-api", setup(plugin) {
    plugin.onResolve({ filter: /^(@trpc\/client|superjson)$/ }, args => ({ path: args.path, namespace: "dummy" }));
    plugin.onLoad({ filter: /.*/, namespace: "dummy" }, args => ({ contents: args.path === "superjson" ? "export default {};" : "export const createTRPCProxyClient=()=>window.__dummyApi; export const httpBatchLink=x=>x;" }));
  } }] });
  let random = 0;
  const window: Record<string, any> = { mmdIsolationProgress: (step: string) => milestones.push(step), __dummyApi: { hormoneQuiz: { complete: { mutate: (input: Record<string, unknown>) => { inputs.push(input); return new Promise((yes, no) => pending.push({ resolve: yes, reject: no })); } } } } };
  runInNewContext(bundled.outputFiles![0].text, { window, crypto: { getRandomValues: (array: Uint8Array) => { array.fill(++random); return array; } }, Uint8Array });
  return { window, pending, inputs, milestones };
}
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

describe("Local hormone quiz isolation prototype — fail-closed dummy-only validation", () => {
  it("pins the unchanged canonical source and preserves all CSS, questions and scoring through exact narrow transform reversal", () => {
    expect(sha(source)).toBe("dd1e18e38a7a3717a602619e0cf30b09ce24cb2203309b50ea8e848516e5b1e8");
    const { html } = isolated();
    expect(html.match(/<style\b[^>]*>[\s\S]*?<\/style>/g)).toEqual(source.match(/<style\b[^>]*>[\s\S]*?<\/style>/g));
    expect(section(html, "    var QUESTIONS =", "    </script>")).toBe(section(source, "    var QUESTIONS =", "    </script>"));
    expect(section(html, "    /* ================= Scoring", "    function finish(")).toBe(section(source, "    /* ================= Scoring", "    function finish("));
    let restored = html.replace(/<script>\n"use strict";\n\(function\(\)\{[\s\S]*?\}\)\(\);\n<\/script>\n(?=<script defer src="\/isolation-transport\.js")/, "");
    restored = restored.replace('<script defer src="/isolation-transport.js"></script>', '<script defer src="/assets/hormone-quiz-transport.js"></script>')
      .replace('      if (window.mmdIsolationQuestion) window.mmdIsolationQuestion(q.id);\n', "")
      .replace('\n      if (window.mmdIsolationProgress) window.mmdIsolationProgress("contact");', "")
      .replace('\n      if (window.mmdIsolationProgress) window.mmdIsolationProgress("report");', "")
      .replace('\n        if (window.mmdIsolationProgress) window.mmdIsolationProgress("intro");', "");
    const oldPolicy = source.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)" \/>/)![1];
    restored = restored.replace(/(<meta http-equiv="Content-Security-Policy" content=")[^"]+(" \/>)/, "$1" + oldPolicy + "$2");
    expect(restored).toBe(source);
    expect(html.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g)).toEqual(source.match(/window\.mmdQuiz(?:Complete|Reset)[^\n]*/g));
  });

  it("fails closed when any canonical transform anchor is missing or duplicated", () => {
    for (const anchor of ['<meta http-equiv="Content-Security-Policy"', '<script defer src="/assets/hormone-quiz-transport.js"></script>', '      var q = BY_ID[order[pos]];\n      if (q.id === "weirdWorst")', '      gateEl.classList.remove("hidden");', '      reportEl.classList.remove("hidden");', '        introEl.classList.remove("hidden");']) {
      expect(() => buildIsolatedQuiz(source.replace(anchor, "REMOVED_ANCHOR"), parentOrigin, childOrigin)).toThrow("Prototype source");
      if (!anchor.startsWith("<meta")) expect(() => buildIsolatedQuiz(source + anchor, parentOrigin, childOrigin)).toThrow("Prototype source");
    }
  });

  it("accepts only exact fixed neutral milestones and rejects extras, personal data, coordinates, counts and conditional IDs", () => {
    for (const step of ["intro", "quick_check", ...Array.from({ length: 30 }, (_, i) => `screen_step_${String(i + 1).padStart(2, "0")}`), "contact", "report", "submitted"]) expect(isNeutralProgress({ type: channel, step })).toBe(true);
    for (const value of [null, undefined, [], "intro", 1, {}, { type: channel }, { step: "intro" }, { type: "other", step: "intro" }, ...["age", "weirdWorst", "screen_step_00", "screen_step_31", "screen_step_1", "submitted?phone=123"].map(step => ({ type: channel, step })), ...["name", "email", "phone", "answers", "score", "x", "y", "clickCount", "optionCount", "branchCount", "id"].map(key => ({ type: channel, step: "intro", [key]: "SYNTHETIC" }))]) expect(isNeutralProgress(value)).toBe(false);
  });

  it("enforces both iframe source identity and exact child origin before a shell event, and deduplicates fixed transitions", () => {
    const vm = shellVM();
    vm.message({ type: channel, step: "contact" }, childOrigin, {}); vm.message({ type: channel, step: "contact" }, parentOrigin); vm.message({ type: channel, step: "contact" }, "null");
    vm.message({ type: channel, step: "contact", phone: "SYNTHETIC" }); vm.message({ type: channel, step: "weirdWorst" });
    expect(vm.output.textContent).toBe("intro"); expect(vm.events).toEqual([]);
    for (const step of ["intro", "intro", "quick_check", "quick_check", "contact", "report", "submitted", "intro"]) vm.message({ type: channel, step });
    expect(vm.events.map(event => ({ type: event.type, detail: event.detail }))).toEqual(["intro", "quick_check", "contact", "report", "submitted", "intro"].map(detail => ({ type: "mmdNeutralProgress", detail })));
    expect(vm.output.textContent).toBe("intro");
  });

  it("maps only fixed canonical nonconditional screens, never labels, answers, branch counts or conditional IDs, to the parent", () => {
    const sent: { value: { type: string; step: string }; origin: string }[] = [];
    const context: Record<string, any> = { window: {}, parent: { postMessage: (value: { type: string; step: string }, origin: string) => sent.push({ value, origin }) } };
    runInNewContext(section(source, "    var DOMAINS =", "    </script>"), context);
    runInNewContext(inlineScripts(isolated().html).find(script => script.includes("const steps ="))!, context);
    context.window.mmdIsolationQuestion("recognize");
    const before = sent.length; context.window.mmdIsolationQuestion("weirdWorst"); context.window.mmdIsolationQuestion("not-a-question"); expect(sent).toHaveLength(before);
    const fixed = context.QUESTIONS.filter((q: { conditional?: boolean; id: string }) => !q.conditional && q.id !== "recognize"); expect(fixed).toHaveLength(30);
    for (const q of fixed) { context.window.mmdIsolationQuestion(q.id); context.window.mmdIsolationQuestion(q.id); }
    expect(sent.map(item => item.value.step)).toEqual(["intro", "quick_check", ...Array.from({ length: 30 }, (_, i) => `screen_step_${String(i + 1).padStart(2, "0")}`)]);
    for (const item of sent) { expect(item.origin).toBe(parentOrigin); expect(Object.keys(item.value).sort()).toEqual(["step", "type"]); expect(isNeutralProgress(item.value)).toBe(true); }
  });

  it("uses a hard false capture switch, no tracking loader or capture opt-in, a suppressed unrecorded child and restrictive child CSP", () => {
    expect(CAPTURE_ENABLED).toBe(false); expect(HOTJAR_SITE_ID).toBe(6736717);
    const shell = buildIsolationShell(childOrigin, false), { html, policy } = isolated();
    expect(shell).toContain("const captureEnabled = false;");
    for (const document of [shell, html]) expect(document).not.toMatch(/static\.hotjar|script\.hotjar|contentsquare\.net|_hjSettings|CS_CONF|\bhj\s*\(|\bgtag\s*\(|\bfetch\s*\(|sendBeacon|XMLHttpRequest/);
    expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    expect(policy).toBe(`default-src 'none'; script-src ${childOrigin} 'unsafe-inline'; connect-src ${childOrigin}; img-src ${childOrigin} data: blob:; style-src ${childOrigin} 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action ${childOrigin}`);
    expect(shell).not.toContain("prefill=demo"); expect(buildIsolationShell(childOrigin, true)).toContain(childOrigin + "/quiz?prefill=demo");
  });

  it("refuses production startup before source reads, bundling or listener creation", async () => {
    const previous = process.env.NODE_ENV; process.env.NODE_ENV = "production";
    try { await expect(startIsolationPrototype({ root: "/nonexistent/local-only-root", parentPort: 0 })).rejects.toThrow("Isolation prototype is disabled in production."); }
    finally { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; }
  });

  it("rejects invalid ports, same-origin listeners, non-loopback URLs, URL credentials, paths, query and hashes", async () => {
    for (const bad of [0, 80, 1023, 65536, 1.5, NaN]) await expect(startIsolationPrototype({ parentPort: bad })).rejects.toThrow("Prototype port unavailable.");
    await expect(startIsolationPrototype({ parentPort: 32781, childPort: 32781 })).rejects.toThrow("Prototype requires separate origins.");
    for (const backendOrigin of ["https://127.0.0.1:32783", "http://example.invalid:32783", "http://127.0.0.2:32783", "http://user:pass@127.0.0.1:32783", "http://127.0.0.1:32783/path", "http://127.0.0.1:32783/?x=1", "http://127.0.0.1:32783/#x"]) await expect(startIsolationPrototype({ parentPort: 32781, childPort: 32782, backendOrigin })).rejects.toThrow("Prototype backend must be loopback.");
  });

  it("rejects recursive portrait/submission targets and QA targets sharing the actual backend port even under a loopback alias", async () => {
    for (const backendOrigin of [parentOrigin, childOrigin]) await expect(startIsolationPrototype({ parentPort: 32781, childPort: 32782, backendOrigin })).rejects.toThrow("Prototype backend cannot be a prototype listener.");
    for (const qaSubmissionOrigin of [parentOrigin, childOrigin, "http://127.0.0.1:32783", "http://localhost:32783", "https://127.0.0.1:32784", "http://example.invalid:32784", "http://user:pass@127.0.0.1:32784", "http://127.0.0.1:32784/path", "http://127.0.0.1:32784/?batch=1", "http://127.0.0.1:32784/#x"]) await expect(startIsolationPrototype({ parentPort: 32781, childPort: 32782, backendOrigin: "http://127.0.0.1:32783", qaSubmissionOrigin })).rejects.toThrow("Prototype QA submission backend must be separate loopback.");
  });

  it("returns default submission 503 and never forwards dummy clinical data to the actual-backend mock", async () => {
    await withPrototype(false, async (instance, real, dummy) => {
      const res = await post(instance.childOrigin); expect(res.status).toBe(503); expect(JSON.parse(res.body)).toEqual({ error: "Prototype clinical submission is disabled." });
      expect(real.seen).toEqual([]); expect(dummy.seen).toEqual([]);
    });
  });

  it("forwards the exact JSON tRPC body only to an explicit separate QA mock with fixed query and content type, target Origin/Host and no cookies or authorization", async () => {
    await withPrototype(true, async (instance, real, dummy) => {
      const res = await post(instance.childOrigin, { headers: { Cookie: "dummy_session=DO_NOT_FORWARD", Authorization: "Bearer DUMMY_ONLY", "X-Forwarded-Host": "example.invalid", "X-Forwarded-For": "203.0.113.10" } });
      expect(res.status).toBe(202); expect(JSON.parse(res.body)).toEqual([{ result: { data: { json: { ok: true } } } }]);
      expect(real.seen).toEqual([]); expect(dummy.seen).toHaveLength(1);
      const forwarded = dummy.seen[0]; expect(forwarded.method).toBe("POST"); expect(forwarded.url).toBe("/api/trpc/hormoneQuiz.complete?batch=1"); expect(forwarded.body).toBe(payload);
      expect(forwarded.headers.origin).toBe(dummy.origin); expect(forwarded.headers.host).toBe(new URL(dummy.origin).host); expect(forwarded.headers["content-type"]).toBe("application/json");
      for (const key of ["cookie", "authorization", "x-forwarded-host", "x-forwarded-for"]) expect(forwarded.headers[key]).toBeUndefined();
      expect(res.headers["set-cookie"]).toBeUndefined();
    });
  });

  it("rejects untrusted or absent origin/Host, nonexact batch queries and non-JSON content type without reaching either backend", async () => {
    await withPrototype(true, async (instance, real, dummy) => {
      for (const origin of [parentOrigin, "null", "http://example.invalid", ""]) expect((await post(instance.childOrigin, { headers: { Origin: origin } })).status).toBe(403);
      expect((await http(instance.childOrigin, "/api/trpc/hormoneQuiz.complete?batch=1", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload })).status).toBe(403);
      expect((await post(instance.childOrigin, { headers: { Host: "example.invalid" } })).status).toBe(404);
      for (const query of ["", "?batch=0", "?batch=2", "?batch=1&extra=data", "?batch=1&batch=1", "?input=data&batch=1"]) expect((await post(instance.childOrigin, { path: "/api/trpc/hormoneQuiz.complete" + query })).status).toBe(403);
      for (const contentType of ["text/plain", "application/x-www-form-urlencoded", "application/octet-stream"]) expect((await post(instance.childOrigin, { headers: { "Content-Type": contentType } })).status).toBe(403);
      expect(real.seen).toEqual([]); expect(dummy.seen).toEqual([]);
    });
  });

  it("rejects malformed or nonexact batch envelopes and oversized dummy bodies before forwarding", async () => {
    await withPrototype(true, async (instance, real, dummy) => {
      expect((await post(instance.childOrigin, { body: "" })).status).toBe(403);
      for (const body of ["{bad-json", "null", "1", "[]", "{}", '{"1":{}}', '{"0":{},"extra":{}}']) expect((await post(instance.childOrigin, { body })).status).toBe(400);
      expect((await post(instance.childOrigin, { body: JSON.stringify({ "0": "DUMMY".repeat(14000) }) })).status).toBe(413);
      expect(real.seen).toEqual([]); expect(dummy.seen).toEqual([]);
    });
  });

  it("exposes only the shell, child document, isolated transport, fixed portrait and permitted submit endpoint, never arbitrary proxy routes", async () => {
    await withPrototype(false, async (instance, real, dummy) => {
      for (const path of ["/", "/api/trpc/hormoneQuiz.complete?batch=1", "/quiz", "/isolation-transport.js", "/assets/dr-jumana-al-deek-portrait.webp"]) expect((await http(instance.parentOrigin, path)).status).toBe(404);
      for (const path of ["/", "/hormone-symptom-quiz", "/api/trpc/hormoneQuiz.other?batch=1", "/api/trpc/admin.users?batch=1", "/assets/hormone-quiz-transport.js", "/proxy?url=http://example.invalid", "/report/private", "/assets/unapproved.webp"]) expect((await http(instance.childOrigin, path)).status).toBe(404);
      expect((await http(instance.childOrigin, "/api/trpc/hormoneQuiz.complete?batch=1")).status).toBe(404);
      expect((await http(instance.parentOrigin, "/hormone-symptom-quiz", { method: "POST" })).status).toBe(404);
      expect((await http(instance.childOrigin, "/quiz", { headers: { Host: "localhost:" + new URL(instance.childOrigin).port } })).status).toBe(404);
      const portrait = await http(instance.childOrigin, "/assets/dr-jumana-al-deek-portrait.webp"); expect(portrait.status).toBe(200); expect(portrait.headers["content-type"]).toMatch(/^image\/webp/);
      expect(real.seen).toHaveLength(1); expect(real.seen[0].method).toBe("GET"); expect(real.seen[0].url).toBe("/assets/dr-jumana-al-deek-portrait.webp"); expect(real.seen[0].body).toBe(""); expect(dummy.seen).toEqual([]);
    });
  });

  it("serves strict HTTP CSP and no-store/no-referrer/noindex headers, strips unknown shell query data and cannot enable capture via query", async () => {
    await withPrototype(false, async instance => {
      const shell = await http(instance.parentOrigin, "/hormone-symptom-quiz"), child = await http(instance.childOrigin, "/quiz"), transport = await http(instance.childOrigin, "/isolation-transport.js");
      expect(shell.status).toBe(200); expect(child.status).toBe(200); expect(transport.status).toBe(200); expect(transport.headers["content-type"]).toMatch(/javascript/);
      expect(shell.headers["content-security-policy"]).toBe(`default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; frame-src ${instance.childOrigin}; connect-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
      expect(child.headers["content-security-policy"]).toBe(buildIsolatedQuiz(source, instance.parentOrigin, instance.childOrigin).policy + `; frame-ancestors ${instance.parentOrigin}`);
      for (const res of [shell, child, transport]) { expect(res.headers["cache-control"]).toBe("no-store, private"); expect(res.headers["referrer-policy"]).toBe("no-referrer"); expect(res.headers["x-content-type-options"]).toBe("nosniff"); expect(res.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive"); expect(res.headers["x-powered-by"]).toBeUndefined(); }
      for (const [query, location] of [["?capture=true&phone=SYNTHETIC", "/hormone-symptom-quiz"], ["?prefill=invalid", "/hormone-symptom-quiz"], ["?prefill=demo&answer=SYNTHETIC", "/hormone-symptom-quiz?prefill=demo"]]) { const res = await http(instance.parentOrigin, "/hormone-symptom-quiz" + query); expect(res.status).toBe(303); expect(res.headers.location).toBe(location); }
      expect((await http(instance.parentOrigin, "/hormone-symptom-quiz?prefill=demo")).body).toContain(instance.childOrigin + "/quiz?prefill=demo");
    });
  });

  it("keeps phone/contact and copied answers only in the mocked child API, deduplicates completion, and uses the same request key for retry", async () => {
    const vm = await transportVM(), data = { name: "SYNTHETIC LOCAL", email: "synthetic@example.invalid", phone: "+12025550123", answers: { recognize: [0], age: 0 } };
    vm.window.mmdQuizComplete(data); vm.window.mmdQuizComplete(data); expect(vm.inputs).toHaveLength(1);
    expect(vm.inputs[0]).toEqual({ request_key: "01".repeat(24), ...data }); data.answers.recognize.push(1); expect(vm.inputs[0].answers).toEqual({ recognize: [0], age: 0 }); expect(vm.milestones).toEqual([]);
    vm.pending[0].reject(Error("DUMMY RETRY")); await flush(); expect(vm.inputs).toHaveLength(2); expect(vm.inputs[1]).toBe(vm.inputs[0]);
    vm.pending[1].resolve({ ok: true }); await flush(); expect(vm.milestones).toEqual(["submitted"]); vm.window.mmdQuizComplete(data); expect(vm.inputs).toHaveLength(2);
  });

  it("guards stale reset completions, starts a fresh request key after reset and emits submitted only for the current successful generation", async () => {
    const vm = await transportVM(), data = { name: "SYNTHETIC LOCAL", email: "synthetic@example.invalid", phone: "+12025550123", answers: { age: 0 } };
    vm.window.mmdQuizComplete(data); vm.window.mmdQuizReset(); vm.window.mmdQuizComplete(data); expect(vm.inputs).toHaveLength(2); expect(vm.inputs[0].request_key).not.toBe(vm.inputs[1].request_key);
    vm.pending[0].resolve({ ok: true }); await flush(); expect(vm.milestones).toEqual([]);
    vm.pending[1].resolve({ ok: true }); await flush(); expect(vm.milestones).toEqual(["submitted"]);
    vm.window.mmdQuizReset(); vm.window.mmdQuizComplete(data); vm.pending[2].resolve({ ok: false }); await flush(); expect(vm.milestones).toEqual(["submitted"]);
  });

  it("swallows both dummy API failures without blocking report code or emitting success and contains the explicit generation reset guard", async () => {
    const vm = await transportVM(); vm.window.mmdQuizComplete({ name: "SYNTHETIC", email: "synthetic@example.invalid", phone: "+12025550123", answers: {} });
    vm.pending[0].reject(Error("DUMMY FIRST FAILURE")); await flush(); vm.pending[1].reject(Error("DUMMY SECOND FAILURE")); await flush(); expect(vm.milestones).toEqual([]);
    const transport = readFileSync(resolve(root, "client/quiz-isolation-transport.ts"), "utf8"); expect(transport).toContain("completionGeneration === generation && result.ok === true"); expect(transport).toContain("generation++; submitted = null; requestKey = null;");
    expect(transport).not.toMatch(/document\.|parent\.postMessage|sendBeacon|localStorage|sessionStorage|\.test["']/); expect(vi.isMockFunction(globalThis.fetch)).toBe(false);
  });
});
