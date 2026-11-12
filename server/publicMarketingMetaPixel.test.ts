import { createHash } from "node:crypto"; import { createHash as oldRemovalCreateHash } from "node:crypto"; import { oldMetaPixelRemovalHistoricalSource, oldMetaPixelRemovalApprovedInventory, oldMetaPixelRemovalNeedsInverse, OLD_REMOVAL_SOURCE_PATHS } from "./fixtures/oldMetaPixelRemovalScope"; const oldRemovalHelperSHA = "844f119278b6da6e807529d1446163610a3585dee5065cfad49f7bac01be4c2f"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { execFileSync } from "node:child_process";
import fs, { readFileSync } from "node:fs";
import { createServer, get as httpGet, type Server } from "node:http";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { injectPublicMarketingMetaPixel, PUBLIC_MARKETING_PATHS, PUBLIC_MARKETING_PIXEL_ID, publicMarketingPixelImageUrl, publicMarketingPixelPath } from "./publicMarketingMetaPixel";
import { inversePublicMarketingPixel, publicMarketingApprovedInventory, publicMarketingHistoricalSource, publicMarketingInventoryPin } from "./fixtures/publicMarketingPixelScope";
import { setupVite, serveStatic } from "./_core/vite";

const viteMock = vi.hoisted(() => ({ urls: [] as string[], transformed: [] as string[] }));
vi.mock("../vite.config", () => ({ default: {} }));
vi.mock("vite", () => ({ createServer: vi.fn(async () => ({
  middlewares: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    viteMock.urls.push(req.url);
    if (["/", "/index.html"].includes(req.url.split("?")[0])) res.type("html").send("RAW_STATIC_INDEX_BYPASS");
    else if (req.url === "/local-test-asset.js") res.type("js").send("LOCAL_STATIC_ASSET");
    else next();
  },
  transformIndexHtml: async (url: string, html: string) => { viteMock.transformed.push(url); return html; },
  ssrFixStacktrace: vi.fn(),
})) }));
const root = resolve(import.meta.dirname, "..");
const base = "0d8263d4";
const sourcePath = "server/_core/vite.ts", modulePath = "server/publicMarketingMetaPixel.ts";
const helperPath = "server/fixtures/publicMarketingPixelScope.ts", directPath = "server/publicMarketingMetaPixel.test.ts";
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !metaLeadConversionsApprovedInventory(p, readFileSync(resolve(root, p), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"), META_LEAD_CONVERSIONS_SOURCE_PATHS.includes(p) && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).filter(p => { if (!p || !["diff", "ls-files"].includes(args[0])) return true; return !oldMetaPixelRemovalApprovedInventory(p, metaLeadConversionsHistoricalSource(p, readFileSync(resolve(root, p), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA, OLD_REMOVAL_SOURCE_PATHS.includes(p) && args[0] === "diff" ? execFileSync("git", ["show", args[2] + ":" + p], { cwd: root, encoding: "utf8" }) : undefined); }).join("\n");
const html = oldMetaPixelRemovalHistoricalSource("client/index.html", metaLeadConversionsHistoricalSource("client/index.html", readFileSync(resolve(root, "client/index.html"), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA);
const scriptTag = (value: string) => value.match(/<script id="public-marketing-meta-pageview">[\s\S]*?<\/script>/)?.[0] ?? "";
const fallbackTag = (value: string) => value.match(/<noscript id="public-marketing-meta-pageview-noscript">[\s\S]*?<\/noscript>/)?.[0] ?? "";
const boot = (value: string) => scriptTag(value).replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
const excluded = ["/hormone-symptom-quiz", "/hormone-symptom-quiz/", "/hormone-symptom-quiz.html", "/hormone-symptom-quiz?preview=results", "/quiz", "/quiz/results", "/intake", "/intake/", "/intake/thank-you/", "/weight-loss-intake", "/admin", "/admin/login", "/admin/settings", "/api/hormoneQuiz", "/api/trpc", "/private", "/patient", "/results", "/report", "/thanks-payment", "/thanks-payment-wl2", "/test-payment", "/thank-you", "/thank-you2", "/thank-you-video", "/thank-you-video-4799", "/thank-you-video-97", "/care-team-booking", "/care-team-booking-confirmed", "/webinar-registration-confirmed", "/live-webinar3-confirmed", "/dr-aldeek-booking", "/discovery-call", "/start/women", "/consent-to-telehealth", "/supplements", "/blog", "/404", "/privacy", "/virginia/not-a-city", "/locations/private", "/Virginia", "/lp/wl", "/lp/wl2"];
function execute(value: string, currentUrl: string, readyState = "complete", oldFbq = vi.fn()) {
  const nodes: Record<string, any> = {}, requests: { url: string; attributes: Record<string, string>; tag: string }[] = [];
  const handlers: { event: string; callback: () => void; options: unknown }[] = [];
  const location = new URL(currentUrl, "https://preview.invalid");
  const forbidden = vi.fn(() => { throw Error("Public pixel must not use SDK, clinical, provider or storage transports"); });
  const window = { location, fbq: oldFbq, _fbq: oldFbq, dataLayer: { push: forbidden }, gtag: forbidden };
  const document = {
    readyState, referrer: "https://intake.medmethoddirect.com/?email=SYNTHETIC_PRIVATE",
    getElementById: (id: string) => nodes[id] ?? null,
    addEventListener: (event: string, callback: () => void, options: unknown) => handlers.push({ event, callback, options }),
    createElement: (tag: string) => {
      if (tag !== "img") return forbidden();
      const node: any = { tag, style: {}, attributes: {} as Record<string, string>, setAttribute(name: string, value: string) { this.attributes[name] = value; } };
      Object.defineProperty(node, "src", { set(url: string) { requests.push({ url, attributes: { ...node.attributes }, tag }); }, get() { return requests.at(-1)?.url; } });
      return node;
    },
    body: { appendChild: (node: any) => { nodes[node.id] = node; } },
  };
  const context = { window, document, URLSearchParams, fetch: forbidden, XMLHttpRequest: forbidden, navigator: { sendBeacon: forbidden }, localStorage: { setItem: forbidden, getItem: forbidden }, sessionStorage: { setItem: forbidden, getItem: forbidden }, fbq: oldFbq, console };
  const run = () => runInNewContext(boot(value), context);
  run();
  return { nodes, requests, handlers, forbidden, window, run, oldFbq };
}
function expectCanonicalRequest(url: string, path: string, noScript = false) {
  const request = new URL(url);
  expect(request.origin + request.pathname).toBe("https://www.facebook.com/tr");
  expect(Object.fromEntries(request.searchParams)).toEqual({ id: "1651526243430714", ev: "PageView", dl: "https://medmethoddirect.com" + path, ...(noScript ? { noscript: "1" } : {}) });
}
const servers: Server[] = [];
async function listen(app: express.Express) {
  const server = createServer(app); servers.push(server);
  await new Promise<void>(done => server.listen(0, "127.0.0.1", done));
  return server;
}
function localGet(server: Server, path: string) {
  const address = server.address(); if (!address || typeof address === "string") throw Error("Local test server not listening");
  return new Promise<{ status: number; type: string; body: string }>((done, reject) => {
    httpGet({ hostname: "127.0.0.1", port: address.port, path, method: "GET" }, response => {
      let body = ""; response.setEncoding("utf8"); response.on("data", chunk => { body += chunk; });
      response.on("end", () => done({ status: response.statusCode!, type: String(response.headers["content-type"]), body }));
    }).on("error", reject);
  });
}
afterEach(async () => { vi.restoreAllMocks(); vi.unstubAllEnvs(); viteMock.urls.length = 0; viteMock.transformed.length = 0; await Promise.all(servers.splice(0).map(server => new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done())))); });

describe("Public marketing Meta PageView — frozen SDK-free allowlist", () => {
  it("matches the exact 94 registered city paths and all registered public marketing, legal and state-hub pages without prefix allowance", () => {
    const app = oldMetaPixelRemovalHistoricalSource("client/src/App.tsx", metaLeadConversionsHistoricalSource("client/src/App.tsx", readFileSync(resolve(root, "client/src/App.tsx"), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA);
    const registered = [...app.matchAll(/<Route path=(?:\{)?["']([^"']+)["'](?:\})? component=\{(\w+)\}/g)].map(match => ({ path: match[1], component: match[2] }));
    const cities = registered.filter(route => route.component.startsWith("Location") && route.path.split("/").length === 3).map(route => route.path);
    expect(cities).toHaveLength(94);
    expect([...PUBLIC_MARKETING_PATHS].filter(path => path.split("/").length === 3 && !path.startsWith("/lp/")).sort()).toEqual(cities.sort());
    const publicComponents = new Set(["HomeHrt3", "Locations", "BrandAmbassador", "Masterclass2", "MasterclassVideoFirst", "FreeMasterclass", "LiveWebinar", "LiveWebinar2", "LiveWebinar3", "LpHrt2", "LpHrt3", "LpGlp1", "LpWL2", "Asynchronous", "WeightLossMenopause", "WeightLossMenopauseV2", "PrivacyPolicy", "TermsOfService", "HipaaNotice", "SubscriptionPolicy", "ShippingPolicy", "Accessibility"]);
    const allowed = registered.filter(route => route.component.startsWith("Location") || publicComponents.has(route.component)).map(route => route.path);
    expect([...PUBLIC_MARKETING_PATHS].sort()).toEqual(allowed.sort()); expect(PUBLIC_MARKETING_PATHS.size).toBe(128);
    for (const path of allowed) { expect(publicMarketingPixelPath(path)).toBe(path); expect(publicMarketingPixelPath(path + "?email=SYNTHETIC&token=PRIVATE#report")).toBe(path); expect(publicMarketingPixelPath(path + "/private")).toBeNull(); }
    expect(PUBLIC_MARKETING_PIXEL_ID).toBe("1651526243430714");
  });

  it("canonicalizes only root/index and single trailing-slash aliases while excluding clinical, private, payment, admin, unknown, test-query and foreign-host requests", () => {
    for (const [url, path] of [["/", "/"], ["/index.html?utm_source=local", "/"], ["/masterclass/", "/masterclass"], ["https://medmethoddirect.com/virginia/mclean/?email=SYNTHETIC#private", "/virginia/mclean"]]) expect(publicMarketingPixelPath(url)).toBe(path);
    for (const url of [...excluded, "/masterclass//", "/index.html/", "/%6dasterclass", "https://www.medmethoddirect.com/", "http://medmethoddirect.com/", "https://intake.medmethoddirect.com/", "//evil.invalid/masterclass", "https://medmethoddirect.com.evil.invalid/", "https://medmethoddirect.com:444/", "https://["]) { expect(publicMarketingPixelPath(url)).toBeNull(); expect(injectPublicMarketingMetaPixel(html, url)).toBe(html); }
    for (const key of ["prefill", "preview", "demo", "test", "is_test", "admin", "qa"]) for (const value of ["", "0", "false", "results"]) expect(publicMarketingPixelPath("/masterclass?" + key + "=" + value)).toBeNull();
    for (const mode of ["demo", "test", "preview", "admin", "qa", "TeSt"]) expect(publicMarketingPixelPath("/masterclass?mode=" + mode)).toBeNull();
  });

  it("adds exactly one head boot script and valid body noscript fallback, preserves all old HTML bytes and never adds the Meta SDK or global fbq", () => {
    const result = injectPublicMarketingMetaPixel(html, "/masterclass?email=SYNTHETIC&token=PRIVATE#answer");
    expect(result.match(/<script id="public-marketing-meta-pageview">/g)).toHaveLength(1);
    expect(result.match(/<noscript id="public-marketing-meta-pageview-noscript">/g)).toHaveLength(1);
    expect(result.indexOf(scriptTag(result))).toBeGreaterThan(result.indexOf("<head>")); expect(result.indexOf(scriptTag(result))).toBeLessThan(result.indexOf("</head>"));
    expect(result.indexOf(fallbackTag(result))).toBeGreaterThan(result.indexOf("<body>")); expect(result.indexOf(fallbackTag(result))).toBeLessThan(result.indexOf("</body>"));
    expect(result.replace("\n" + scriptTag(result), "").replace("\n" + fallbackTag(result), "")).toBe(html);
    expect(injectPublicMarketingMetaPixel(result, "/masterclass")).toBe(result);
    expect(scriptTag(result) + fallbackTag(result)).not.toMatch(/connect\.facebook\.net|fbevents\.js|\bfbq\b|trackSingle|init\s*\(|dataLayer|gtag|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|SYNTHETIC|PRIVATE|token|email|#answer/);
    for (const malformed of ["", "<body></body>", "<head></head>"]) expect(injectPublicMarketingMetaPixel(malformed, "/")).toBe(malformed);
  });

  it("builds no-JavaScript image requests with only pixel id, PageView, canonical dl and noscript, escaped attributes and no-referrer", () => {
    for (const path of PUBLIC_MARKETING_PATHS) {
      const result = injectPublicMarketingMetaPixel(html, path + "?email=SYNTHETIC&symptoms=PRIVATE#report");
      const fallback = fallbackTag(result);
      expect(fallback).toMatch(/^<noscript id="public-marketing-meta-pageview-noscript"><img [^>]* \/><\/noscript>$/);
      expect(fallback).toContain('referrerpolicy="no-referrer"'); expect(fallback).toContain('height="1" width="1"');
      const src = fallback.match(/\bsrc="([^"]*)"/)![1]; expect(src).toContain("&amp;"); expect(src).not.toMatch(/&(?!amp;)/);
      expectCanonicalRequest(src.replaceAll("&amp;", "&"), path, true);
      expectCanonicalRequest(publicMarketingPixelImageUrl(path), path); expectCanonicalRequest(publicMarketingPixelImageUrl(path, true), path, true);
    }
    for (const path of excluded) expect(() => publicMarketingPixelImageUrl(path)).toThrow("Public marketing Pixel path is not allowed");
  });

  it("executes the actual inline script into one canonical-only simulated image request and leaves old fbq identity, queue and calls untouched", () => {
    const oldFbq = Object.assign(vi.fn(), { queue: [["init", "1589326469554181"]], loaded: true });
    const queue = JSON.stringify(oldFbq.queue);
    for (const path of PUBLIC_MARKETING_PATHS) {
      const result = execute(injectPublicMarketingMetaPixel(html, path), path + "?email=SYNTHETIC&token=PRIVATE#answer", "complete", oldFbq);
      expect(result.requests).toHaveLength(1); expectCanonicalRequest(result.requests[0].url, path);
      expect(result.requests[0].attributes).toEqual({ referrerpolicy: "no-referrer" }); expect(result.requests[0].tag).toBe("img");
      result.run(); expect(result.requests).toHaveLength(1); expect(result.window.fbq).toBe(oldFbq); expect(result.window._fbq).toBe(oldFbq); expect(result.forbidden).not.toHaveBeenCalled();
    }
    expect(oldFbq).not.toHaveBeenCalled(); expect(JSON.stringify(oldFbq.queue)).toBe(queue);
  });

  it("waits once for DOM ready and suppresses every SPA sensitive-path mismatch or newly introduced test query without any event", () => {
    const injected = injectPublicMarketingMetaPixel(html, "/masterclass");
    const loading = execute(injected, "/masterclass", "loading"); expect(loading.requests).toEqual([]); expect(loading.handlers).toHaveLength(1);
    expect(loading.handlers[0].event).toBe("DOMContentLoaded"); expect(loading.handlers[0].options).toEqual({ once: true });
    loading.handlers[0].callback(); loading.handlers[0].callback(); loading.run(); expect(loading.requests).toHaveLength(1);
    for (const url of [...excluded, "/masterclass2", "/masterclass?test=0", "/masterclass?preview=results", "/masterclass?mode=QA"]) {
      const late = execute(injected, "/masterclass", "loading"), target = new URL(url, "https://preview.invalid");
      late.window.location.pathname = target.pathname; late.window.location.search = target.search; late.handlers[0].callback();
      expect(late.requests, url).toEqual([]); expect(late.forbidden).not.toHaveBeenCalled(); expect(late.oldFbq).not.toHaveBeenCalled();
      const immediate = execute(injected, url); expect(immediate.requests, url).toEqual([]);
    }
    for (const alias of ["/masterclass/", "/index.html"]) { const path = alias === "/index.html" ? "/" : "/masterclass"; const result = execute(injectPublicMarketingMetaPixel(html, path), alias); expect(result.requests).toHaveLength(1); expectCanonicalRequest(result.requests[0].url, path); }
  });

  it("runs actual setupVite root/index middleware locally with Vite mocked so raw static index cannot bypass gating, and leaves local assets/excluded routes inactive", async () => {
    const app = express(), server = createServer(app); servers.push(server);
    await setupVite(app, server); await new Promise<void>(done => server.listen(0, "127.0.0.1", done));
    for (const url of ["/", "/index.html", "/?utm_source=local", "/index.html?utm_source=local", "/masterclass", "/virginia/mclean"]) {
      const result = await localGet(server, url); expect(result.status).toBe(200); expect(result.type).toContain("text/html"); expect(result.body).not.toContain("RAW_STATIC_INDEX_BYPASS");
      expect(scriptTag(result.body)).not.toBe(""); expect(fallbackTag(result.body)).not.toBe(""); expect(viteMock.transformed).toContain(url);
      const simulated = execute(result.body, url); expect(simulated.requests).toHaveLength(1); expectCanonicalRequest(simulated.requests[0].url, publicMarketingPixelPath(url)!);
    }
    expect(viteMock.urls).toContain("/__public_website_html__"); expect(viteMock.urls).toContain("/__public_website_html__?utm_source=local");
    for (const url of ["/?test=1", "/index.html?preview=results", "/admin/login", "/intake", "/hormone-symptom-quiz"]) { const result = await localGet(server, url); expect(scriptTag(result.body)).toBe(""); expect(fallbackTag(result.body)).toBe(""); }
    expect((await localGet(server, "/local-test-asset.js")).body).toBe("LOCAL_STATIC_ASSET");
  });

  it("runs actual serveStatic root/index and SPA fallback ordering locally without a browser, SDK, GTM, external fetch or provider send", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const distPath = resolve(root, "dist/public"), localIndex = resolve(distPath, "index.html"), read = fs.readFileSync.bind(fs);
    const spy = vi.spyOn(fs, "readFileSync").mockImplementation(((path: any, options: any) => String(path) === localIndex ? html : read(path, options)) as typeof fs.readFileSync);
    const app = express(); serveStatic(app); const server = await listen(app);
    for (const url of ["/", "/index.html", "/index.html?utm_source=local", "/masterclass", "/texas/austin"]) { const result = await localGet(server, url); expect(result.status).toBe(200); expect(result.type).toContain("text/html"); expect(scriptTag(result.body)).not.toBe(""); expect(fallbackTag(result.body)).not.toBe(""); }
    for (const url of ["/?test=1", "/index.html?preview=results", "/admin/login", "/unknown-private"]) { const result = await localGet(server, url); expect(scriptTag(result.body)).toBe(""); expect(fallbackTag(result.body)).toBe(""); }
    expect(spy).toHaveBeenCalledWith(localIndex, "utf-8");
  });

  it("strictly inverses exactly four approved Vite fragments and latest-first historical sources, pins only exact additions and freezes prior production and all old fixtures", () => {
    const current = oldMetaPixelRemovalHistoricalSource(sourcePath, metaLeadConversionsHistoricalSource(sourcePath, readFileSync(resolve(root, sourcePath), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), original = git("show", base + ":" + sourcePath);
    expect(hash(current)).toBe("6a37aaf7308c12c80e6a38aae5fb375fee5bdada1b4692f5a5f3b02594d789f4"); expect(hash(original)).toBe("24da00343da042c79c6db9f41c4c4e602cb1ef5b73eee885675766d3519840e7");
    for (const path of [sourcePath, resolve(root, sourcePath), sourcePath.replaceAll("/", "\\")]) {
      expect(inversePublicMarketingPixel(path, current, hash)).toBe(original); expect(inversePublicMarketingPixel(path, original, hash)).toBe(original);
      for (const bad of ["", current + "UNAPPROVED", current.replace("injectPublicMarketingMetaPixel(template, url)", "injectPublicMarketingMetaPixel(template, privateUrl)")]) expect(() => inversePublicMarketingPixel(path, bad, hash)).toThrow("Public marketing pixel source scope mismatch");
    }
    expect(inversePublicMarketingPixel(sourcePath + ".bak", current, hash)).toBe(current);
    const helper = oldMetaPixelRemovalHistoricalSource(helperPath, metaLeadConversionsHistoricalSource(helperPath, readFileSync(resolve(root, helperPath), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA), helperSHA = hash(helper);
    const code = helper.split("\n").slice(1).join("\n").replace(/"(?:[^"\\]|\\.)*"/g, '"FROZEN_DATA_LITERAL"');
    expect(code).not.toMatch(/(?<![.\w])(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(oldMetaPixelRemovalHistoricalSource(directPath, metaLeadConversionsHistoricalSource(directPath, readFileSync(resolve(root, directPath), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).not.toMatch(/from\s+["'][^"']*\.test["']/);
    for (const path of [modulePath, directPath]) { const raw = oldMetaPixelRemovalHistoricalSource(path, metaLeadConversionsHistoricalSource(path, readFileSync(resolve(root, path), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA); expect(hash(raw)).toBe(publicMarketingInventoryPin(path)); expect(publicMarketingApprovedInventory(path, raw, hash, helperSHA)).toBe(true); expect(() => publicMarketingApprovedInventory(path, raw + "UNAPPROVED", hash, helperSHA)).toThrow("Public marketing pixel inventory SHA mismatch"); }
    expect(publicMarketingInventoryPin(modulePath + ".bak")).toBeNull();
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const entries = git("ls-tree", "-r", base, "--", ...scope).trim().split("\n").map(line => { const [metadata, path] = line.split("\t"); return { path, blobSHA: metadata.split(" ")[2] }; });
    for (const { path, blobSHA } of entries) {
      const raw = (oldMetaPixelRemovalNeedsInverse(path) ? Buffer.from(oldMetaPixelRemovalHistoricalSource(path, (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, readFileSync(resolve(root, path)).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : readFileSync(resolve(root, path))).toString("utf8"), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)) : (metaLeadConversionsNeedsInverse(path) ? Buffer.from(metaLeadConversionsHistoricalSource(path, readFileSync(resolve(root, path)).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : readFileSync(resolve(root, path)))), restored = path === sourcePath || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path) ? Buffer.from(publicMarketingHistoricalSource(path, raw.toString("utf8"), hash, helperSHA)) : raw;
      expect(createHash("sha1").update(Buffer.from("blob " + restored.length + "\0")).update(restored).digest("hex"), path).toBe(blobSHA);
    }
    const old = new Set(entries.map(entry => entry.path)), additions = git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(path => path && !old.has(path));
    expect(additions.sort()).toEqual([modulePath, directPath, helperPath].sort());
    const legacyPath = "client/src/lib/metaPixelBootstrap.ts"; expect(oldMetaPixelRemovalHistoricalSource("client/index.html", metaLeadConversionsHistoricalSource("client/index.html", readFileSync(resolve(root, "client/index.html"), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).toBe(git("show", base + ":client/index.html"));
    expect(oldMetaPixelRemovalHistoricalSource(legacyPath, metaLeadConversionsHistoricalSource(legacyPath, readFileSync(resolve(root, legacyPath), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).toBe(git("show", base + ":" + legacyPath)); expect(oldMetaPixelRemovalHistoricalSource(legacyPath, metaLeadConversionsHistoricalSource(legacyPath, readFileSync(resolve(root, legacyPath), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8")), s => oldRemovalCreateHash("sha256").update(s).digest("hex"), oldRemovalHelperSHA)).toContain("1589326469554181"); expect(html).toContain("GTM-KMBG6HSR");
  });
});
