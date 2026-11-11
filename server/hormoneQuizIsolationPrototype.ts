import express, { type Request } from "express";
import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { build } from "esbuild";

/** Local-only research prototype. Never mounted in the ordinary app or published bundle. */
export const HOTJAR_SITE_ID = 6736717;
export const CAPTURE_ENABLED = false as const;
const STEPS = ["intro", "quick_check", ...Array.from({ length: 30 }, (_, i) => `screen_step_${String(i + 1).padStart(2, "0")}`), "contact", "report", "submitted"];
const CHANNEL = "mmd_quiz_neutral_progress_v1";
function js(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029"); }
export function isNeutralProgress(value: unknown): value is { type: string; step: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value).sort();
  const message = value as Record<string, unknown>;
  return keys.join(",") === "step,type" && message.type === CHANNEL && typeof message.step === "string" && STEPS.includes(message.step);
}
export function buildIsolationShell(childOrigin: string, testMode: boolean) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="referrer" content="no-referrer"><meta name="color-scheme" content="light dark"><link rel="icon" href="data:,"><title>Hormone Symptom Quiz</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#faf4f0}iframe{position:fixed;inset:0;display:block;width:100%;height:100%;border:0}#neutralProgress{position:fixed;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);pointer-events:none}@media(prefers-color-scheme:dark){html,body{background:#1e1119}}</style></head><body><output id="neutralProgress" aria-hidden="true">intro</output><iframe id="privateQuiz" title="Hormone Symptom Quiz" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox" src="${childOrigin}/quiz${testMode ? "?prefill=demo" : ""}"></iframe><script>
"use strict";
// Deliberately no Hotjar/Contentsquare loader. Query parameters cannot enable capture.
const captureEnabled = false;
const permittedSteps = ${js(STEPS)};
const frame = document.getElementById("privateQuiz");
let lastStep = null;
window.addEventListener("message", function(event) {
  if (event.source !== frame.contentWindow || event.origin !== ${js(childOrigin)}) return;
  const value = event.data;
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).sort().join(",") !== "step,type" || value.type !== ${js(CHANNEL)} || !permittedSteps.includes(value.step)) return;
  if (value.step === lastStep) return;
  lastStep = value.step;
  document.getElementById("neutralProgress").textContent = value.step;
  // An allowlisted, neutral notification for dummy QA; not a patient-data bridge.
  window.dispatchEvent(new CustomEvent("mmdNeutralProgress", {detail: value.step}));
});
</script></body></html>`;
}
export function buildIsolatedQuiz(source: string, parentOrigin: string, childOrigin: string) {
  const policy = `default-src 'none'; script-src ${childOrigin} 'unsafe-inline'; connect-src ${childOrigin}; img-src ${childOrigin} data: blob:; style-src ${childOrigin} 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action ${childOrigin}`;
  const meta = /(<meta http-equiv="Content-Security-Policy" content=")[^"]+(" \/>)/;
  if (!meta.test(source)) throw new Error("Prototype source policy unavailable.");
  let html = source.replace(meta, (_all, start, end) => start + policy + end);
  const transport = '<script defer src="/assets/hormone-quiz-transport.js"></script>';
  if (html.split(transport).length !== 2) throw new Error("Prototype source transport unavailable.");
  html = html.replace(transport, '<script defer src="/isolation-transport.js"></script>');
  // Reuse the exact source document and script; narrow navigation hooks send only fixed milestones.
  const renderHook = '      var q = BY_ID[order[pos]];\n      if (q.id === "weirdWorst")';
  if (html.split(renderHook).length !== 2) throw new Error("Prototype source render hook unavailable.");
  html = html.replace(renderHook, '      var q = BY_ID[order[pos]];\n      if (window.mmdIsolationQuestion) window.mmdIsolationQuestion(q.id);\n      if (q.id === "weirdWorst")');
  const gateHook = '      gateEl.classList.remove("hidden");';
  const reportHook = '      reportEl.classList.remove("hidden");';
  const restartHook = '        introEl.classList.remove("hidden");';
  for (const hook of [gateHook, reportHook, restartHook]) if (html.split(hook).length !== 2) throw new Error("Prototype source screen hook unavailable.");
  html = html.replace(gateHook, gateHook + '\n      if (window.mmdIsolationProgress) window.mmdIsolationProgress("contact");');
  html = html.replace(reportHook, reportHook + '\n      if (window.mmdIsolationProgress) window.mmdIsolationProgress("report");');
  html = html.replace(restartHook, restartHook + '\n        if (window.mmdIsolationProgress) window.mmdIsolationProgress("intro");');
  const bridge = `<script>\n"use strict";\n(function(){\nconst steps = ${js(STEPS)};\nlet last = null;\nwindow.mmdIsolationProgress = function(step){\nif (!steps.includes(step) || step === last) return;\nlast = step;\nparent.postMessage({type:${js(CHANNEL)}, step:step}, ${js(parentOrigin)});\n};\nwindow.mmdIsolationQuestion = function(id){\n// No answer-derived conditional follow-up ID, branch count, label or option count leaves this context.\nif (id === "recognize") return window.mmdIsolationProgress("quick_check");\nconst fixed = QUESTIONS.filter(q => !q.conditional && q.id !== "recognize").findIndex(q => q.id === id);\nif (fixed >= 0) window.mmdIsolationProgress("screen_step_" + String(fixed + 1).padStart(2,"0"));\n};\nwindow.mmdIsolationProgress("intro");\n})();\n</script>`;
  html = html.replace('<script defer src="/isolation-transport.js"></script>', bridge + '\n<script defer src="/isolation-transport.js"></script>');
  return { html, policy };
}
export type IsolationConfig = { root?: string; parentPort?: number; childPort?: number; backendOrigin?: string; qaSubmissionOrigin?: string };
function port(value: number) { if (!Number.isInteger(value) || value < 1024 || value > 65535) throw new Error("Prototype port unavailable."); return value; }
function loopback(req: Request) { return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress ?? ""); }
function listen(server: Server, value: number) { return new Promise<void>((yes, no) => { server.once("error", no); server.listen(value, "127.0.0.1", () => { server.removeListener("error", no); yes(); }); }); }
export async function startIsolationPrototype(config: IsolationConfig = {}) {
  if (process.env.NODE_ENV === "production") throw new Error("Isolation prototype is disabled in production.");
  const root = config.root ?? process.cwd();
  const parentPort = port(config.parentPort ?? 3018), childPort = port(config.childPort ?? 3019);
  if (parentPort === childPort) throw new Error("Prototype requires separate origins.");
  const parentOrigin = `http://127.0.0.1:${parentPort}`, childOrigin = `http://127.0.0.1:${childPort}`;
  const backend = new URL(config.backendOrigin ?? "http://localhost:3000");
  if (backend.protocol !== "http:" || !["localhost", "127.0.0.1"].includes(backend.hostname) || backend.username || backend.password || backend.pathname !== "/" || backend.search || backend.hash) throw new Error("Prototype backend must be loopback.");
  if ([parentPort, childPort].includes(Number(backend.port))) throw new Error("Prototype backend cannot be a prototype listener.");
  // Never forward prototype clinical data to the real app. A local fake backend is opt-in for QA only.
  const qaSubmission = config.qaSubmissionOrigin ? new URL(config.qaSubmissionOrigin) : null;
  if (qaSubmission && (qaSubmission.protocol !== "http:" || !["localhost", "127.0.0.1"].includes(qaSubmission.hostname) || qaSubmission.username || qaSubmission.password || qaSubmission.pathname !== "/" || qaSubmission.search || qaSubmission.hash || [parentPort, childPort].includes(Number(qaSubmission.port)) || qaSubmission.origin === backend.origin || Number(qaSubmission.port) === Number(backend.port))) throw new Error("Prototype QA submission backend must be separate loopback.");
  const source = readFileSync(resolve(root, "client/public/hormone-symptom-quiz.html"), "utf8");
  const isolated = buildIsolatedQuiz(source, parentOrigin, childOrigin);
  const bundled = await build({ entryPoints: [resolve(root, "client/quiz-isolation-transport.ts")], bundle: true, platform: "browser", format: "iife", write: false, minify: true });
  const transport = bundled.outputFiles?.[0]?.text;
  if (!transport) throw new Error("Prototype transport unavailable.");
  const shell = express(), child = express();
  for (const [app, authority] of [[shell, new URL(parentOrigin).host], [child, new URL(childOrigin).host]] as const) {
    app.disable("x-powered-by");
    app.use((req, res, next) => {
      if (!loopback(req) || req.headers.host !== authority) { res.status(404).end(); return; }
      res.set({ "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow, noarchive" });
      next();
    });
  }
  shell.get(["/hormone-symptom-quiz", "/hormone-symptom-quiz/"], (req, res) => {
    res.setHeader("Content-Security-Policy", `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; frame-src ${childOrigin}; connect-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
    // Strip unknown query data instead of exposing it to a future recording shell or enabling demo accidentally.
    const queryKeys = Object.keys(req.query);
    const testMode = req.query.prefill === "demo";
    if (queryKeys.some(key => key !== "prefill") || (queryKeys.length && !testMode)) {
      res.redirect(303, "/hormone-symptom-quiz" + (testMode ? "?prefill=demo" : "")); return;
    }
    res.type("html").send(buildIsolationShell(childOrigin, testMode));
  });
  child.get("/quiz", (_req, res) => {
    res.setHeader("Content-Security-Policy", isolated.policy + `; frame-ancestors ${parentOrigin}`);
    res.type("html").send(isolated.html);
  });
  child.get("/isolation-transport.js", (_req, res) => { res.type("application/javascript").send(transport); });
  // This bridge belongs to the unrecorded child, never to the recorded shell.
  child.post("/api/trpc/hormoneQuiz.complete", express.raw({ type: "application/json", limit: "64kb" }), (req, res) => {
    if (req.headers.origin !== childOrigin || Object.keys(req.query).join(",") !== "batch" || req.query.batch !== "1" || !req.is("application/json") || !Buffer.isBuffer(req.body) || !req.body.length) { res.status(403).end(); return; }
    try { const data = JSON.parse(req.body.toString("utf8")); if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).join(",") !== "0") { res.status(400).end(); return; } } catch { res.status(400).end(); return; }
    if (!qaSubmission) { res.status(503).json({ error: "Prototype clinical submission is disabled." }); return; }
    void fetch(qaSubmission.origin + "/api/trpc/hormoneQuiz.complete?batch=1", {
      method: "POST", headers: { "Content-Type": "application/json", Origin: qaSubmission.origin }, body: req.body.toString("utf8"),
      redirect: "error", signal: AbortSignal.timeout(20000),
    }).then(async response => {
      res.status(response.status).type("application/json").send(await response.text());
    }).catch(() => { res.status(503).json({ error: "Prototype submission unavailable." }); });
  });
  // Only the existing same-origin doctor portrait is proxied; no arbitrary URL or private report proxy.
  child.get("/assets/dr-jumana-al-deek-portrait.webp", (_req, res) => {
    void fetch(backend.origin + "/assets/dr-jumana-al-deek-portrait.webp", { redirect: "error", signal: AbortSignal.timeout(15000) }).then(async response => {
      if (!response.ok) { res.status(503).end(); return; }
      res.type("image/webp").send(Buffer.from(await response.arrayBuffer()));
    }).catch(() => { res.status(503).end(); });
  });
  const parentServer = createServer(shell), childServer = createServer(child);
  try { await listen(childServer, childPort); await listen(parentServer, parentPort); }
  catch (error) { parentServer.close(); childServer.close(); throw error; }
  return { parentOrigin, childOrigin, close: () => Promise.all([new Promise<void>(yes => parentServer.close(() => yes())), new Promise<void>(yes => childServer.close(() => yes()))]) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  startIsolationPrototype().then(instance => {
    console.log(`Isolation prototype ready at ${instance.parentOrigin}/hormone-symptom-quiz — capture DISABLED; local loopback only.`);
    const close = () => { void instance.close().then(() => process.exit(0)); };
    process.on("SIGTERM", close); process.on("SIGINT", close);
  }).catch(() => { console.error("Isolation prototype could not start."); process.exitCode = 1; });
}
