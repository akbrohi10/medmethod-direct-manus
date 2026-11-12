import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { crawlerMiddleware, generateCrawlerHtml, getMetaForPath, injectRouteMetaIntoHtml } from "./crawlerMiddleware";
import { injectCareTeamConfirmationPrivacyIntoHtml } from "./careTeamConfirmationPrivacy";
import { injectPublicMarketingMetaPixel, PUBLIC_MARKETING_PATHS, PUBLIC_MARKETING_PIXEL_ID, publicMarketingPixelImageUrl } from "./publicMarketingMetaPixel";
import { inverseOldMetaPixelRemoval, oldMetaPixelRemovalApprovedInventory, oldMetaPixelRemovalHistoricalSource, oldMetaPixelRemovalInventoryPin, oldMetaPixelRemovalNeedsInverse, OLD_META_PIXEL_REMOVAL_SOURCES, OLD_META_PIXEL_REMOVAL_PROTECTED } from "./fixtures/oldMetaPixelRemovalScope";

const root = resolve(import.meta.dirname, ".."), base = "9e888608";
const helperPath = "server/fixtures/oldMetaPixelRemovalScope.ts", directPath = "server/oldMetaPixelRemoval.test.ts";
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const html = read("client/index.html"), oldId = "1589326469554181";
const escaped = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const legacy = ["metaPixelBootstrap", "masterclassMetaPixel", "careTeamBookingMetaPixel", "careTeamConfirmationPixel", "careTeamConfirmationLead"];
function activeGraph(entry: string) {
  const pending = [entry], visited = new Set<string>();
  while (pending.length) {
    const path = pending.pop()!; if (visited.has(path)) continue; visited.add(path);
    const source = read(path);
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith(".") && !specifier.startsWith("@/") && !specifier.startsWith("@shared/")) continue;
      const target = specifier.startsWith("@/") ? resolve(root, "client/src", specifier.slice(2)) : specifier.startsWith("@shared/") ? resolve(root, "shared", specifier.slice(8)) : resolve(root, dirname(path), specifier);
      const file = [target, ...[".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"].map(extension => target + extension)].find(candidate => existsSync(candidate) && /\.[cm]?[jt]sx?$/.test(candidate));
      if (file) pending.push(file.slice(root.length + 1));
    }
  }
  return visited;
}
function noOldPixel(value: string) { expect(value).not.toContain(oldId); expect(value).not.toMatch(/fbevents\.js|connect\.facebook\.net|confirmation-meta-pixel|masterclass-meta-pixel-noscript|care-team-confirmation-meta-pixel-noscript/); }

describe("Old Meta pixel removal — exact six-source checkpoint-only scope", () => {
  it("keeps the actual client and server entry graphs free of all five archival legacy modules and active pixel mounts", () => {
    for (const entry of ["client/src/main.tsx", "server/_core/index.ts"]) {
      const graph = activeGraph(entry); expect(graph.size).toBeGreaterThan(20);
      for (const path of graph) {
        expect(legacy.some(name => path.endsWith("/" + name + ".ts")), path).toBe(false);
        const source = read(path); expect(source, path).not.toContain(oldId); expect(source, path).not.toContain("fbevents.js");
        expect(source, path).not.toMatch(/install(?:MetaPixelForCurrentRoute|MasterclassMetaPixel|CareTeamBookingMetaPixel|CareTeamConfirmationPixel)|fireCareTeamConfirmationLead/);
      }
    }
    for (const name of legacy) expect(read("client/src/lib/" + name + ".ts")).toBe(git("show", base + ":client/src/lib/" + name + ".ts"));
  });

  it("renders actual public and confirmation HTML with no old ID, SDK, legacy script or noscript while preserving route metadata", () => {
    for (const path of [...PUBLIC_MARKETING_PATHS, "/care-team-booking", "/care-team-booking-confirmed", "/thank-you", "/thank-you2", "/webinar-registration-confirmed", "/live-webinar3-confirmed", "/intake/", "/admin/login"]) {
      const meta = getMetaForPath(path), metaHtml = injectRouteMetaIntoHtml(html, meta);
      const rendered = injectCareTeamConfirmationPrivacyIntoHtml(injectPublicMarketingMetaPixel(metaHtml, path), path);
      noOldPixel(rendered); noOldPixel(generateCrawlerHtml(meta));
      expect(rendered).toContain("GTM-KMBG6HSR");
      expect(rendered).toContain(`<title>${escaped(meta.title)}</title>`); expect(rendered).toContain(`content="${escaped(meta.description)}"`);
      expect(rendered).toContain(`href="${meta.url}"`); expect(rendered).toContain(`content="${meta.url}"`);
      expect(injectRouteMetaIntoHtml(metaHtml, meta)).toBe(metaHtml);
    }
    expect(read("server/crawlerMiddleware.ts").slice(0, read("server/crawlerMiddleware.ts").indexOf("export function injectRouteMetaIntoHtml"))).toBe(git("show", base + ":server/crawlerMiddleware.ts").slice(0, git("show", base + ":server/crawlerMiddleware.ts").indexOf("export function injectRouteMetaIntoHtml")));
  });

  it("retains confirmation query/referrer redirects, no-referrer and no-store guards without redirect loops or changes on other routes", () => {
    for (const [originalUrl, referer, redirected] of [["/care-team-booking-confirmed?email=SYNTHETIC&token=PRIVATE", undefined, true], ["/care-team-booking-confirmed", "https://example.invalid/private", true], ["/care-team-booking-confirmed", undefined, false]] as const) {
      const req = { method: "GET", path: "/care-team-booking-confirmed", originalUrl, headers: { "user-agent": "normal browser", referer } } as Request;
      const res = { set: vi.fn(), redirect: vi.fn() }; res.set.mockReturnValue(res); const next = vi.fn(); crawlerMiddleware(req, res as unknown as Response, next);
      expect(res.set).toHaveBeenCalledWith("Referrer-Policy", "no-referrer");
      if (redirected) { expect(res.set).toHaveBeenCalledWith("Cache-Control", "no-store"); expect(res.redirect).toHaveBeenCalledWith(302, "/care-team-booking-confirmed"); expect(next).not.toHaveBeenCalled(); }
      else { expect(res.set).not.toHaveBeenCalledWith("Cache-Control", "no-store"); expect(res.redirect).not.toHaveBeenCalled(); expect(next).toHaveBeenCalledOnce(); }
    }
    for (const path of ["/", "/masterclass", "/care-team-booking", "/intake/", "/webinar-registration-confirmed"]) {
      const res = { set: vi.fn(), redirect: vi.fn() }, next = vi.fn(); res.set.mockReturnValue(res);
      crawlerMiddleware({ method: "GET", path, originalUrl: path + "?untouched=1", headers: { "user-agent": "normal browser", referer: "https://example.invalid/private" } } as Request, res as unknown as Response, next);
      expect(res.set).not.toHaveBeenCalled(); expect(res.redirect).not.toHaveBeenCalled(); expect(next).toHaveBeenCalledOnce(); expect(injectCareTeamConfirmationPrivacyIntoHtml(html, path)).toBe(html);
    }
  });

  it("executes the retained early confirmation URL guard before GTM, strips only query/hash and otherwise preserves exact template bytes", () => {
    const rendered = injectCareTeamConfirmationPrivacyIntoHtml(html, "/care-team-booking-confirmed?email=SYNTHETIC");
    const guard = rendered.match(/<script id="care-team-confirmation-url-privacy">([\s\S]*?)<\/script>/)!;
    expect(guard).not.toBeNull(); expect(rendered.indexOf(guard[0])).toBeLessThan(rendered.indexOf("<!-- Google Tag Manager -->"));
    const replaceState = vi.fn(), state = { sentinel: "UNCHANGED" };
    runInNewContext(guard[1], { window: { history: { state, replaceState }, location: { pathname: "/care-team-booking-confirmed", search: "?email=SYNTHETIC", hash: "#PRIVATE" } } });
    expect(replaceState).toHaveBeenCalledOnce(); expect(replaceState).toHaveBeenCalledWith(state, "", "/care-team-booking-confirmed");
    expect(rendered.replace("\n" + guard[0], "")).toBe(html); expect(injectCareTeamConfirmationPrivacyIntoHtml(rendered, "/care-team-booking-confirmed")).toBe(rendered); noOldPixel(rendered);
  });

  it("keeps the new 1651526243430714 PageView-only module and wiring byte-exact, canonical-only, SDK-free and excluded on clinical routes", () => {
    for (const path of ["server/publicMarketingMetaPixel.ts", "server/_core/vite.ts", "client/index.html", "client/src/App.tsx"]) { expect(read(path)).toBe(git("show", base + ":" + path)); expect(hash(read(path))).toBe(OLD_META_PIXEL_REMOVAL_PROTECTED[path]); }
    expect(PUBLIC_MARKETING_PIXEL_ID).toBe("1651526243430714"); expect(PUBLIC_MARKETING_PATHS.size).toBe(128);
    for (const path of PUBLIC_MARKETING_PATHS) {
      const rendered = injectPublicMarketingMetaPixel(html, path + "?email=SYNTHETIC&token=PRIVATE#answer");
      expect(rendered.match(/<script id="public-marketing-meta-pageview">/g)).toHaveLength(1); expect(rendered.match(/<noscript id="public-marketing-meta-pageview-noscript">/g)).toHaveLength(1);
      const url = new URL(publicMarketingPixelImageUrl(path)); expect(Object.fromEntries(url.searchParams)).toEqual({ id: "1651526243430714", ev: "PageView", dl: "https://medmethoddirect.com" + path });
      const addition = rendered.replace(html.slice(0, html.indexOf("<head>")), "").match(/<script id="public-marketing-meta-pageview">([\s\S]*?)<\/script>/)![1];
      expect(addition).not.toMatch(/\bfbq\b|fbevents\.js|Lead|Schedule|CompleteRegistration|Purchase|SYNTHETIC|PRIVATE|sendBeacon|XMLHttpRequest|dataLayer|gtag/); noOldPixel(rendered);
    }
    for (const path of ["/intake/", "/hormone-symptom-quiz", "/care-team-booking", "/care-team-booking-confirmed", "/thank-you", "/admin/login", "/masterclass?test=1"]) expect(injectPublicMarketingMetaPixel(html, path)).toBe(html);
  });

  it("strictly reverses every positioned deletion and replacement to all six complete baseline sources and rejects any unapproved source bytes", () => {
    expect(Object.keys(OLD_META_PIXEL_REMOVAL_SOURCES)).toHaveLength(6);
    for (const [path, entry] of Object.entries(OLD_META_PIXEL_REMOVAL_SOURCES)) {
      const current = read(path), original = git("show", base + ":" + path);
      expect(hash(current)).toBe(entry.afterSHA); expect(hash(original)).toBe(entry.beforeSHA);
      for (const alias of [path, resolve(root, path), path.replaceAll("/", "\\")]) {
        expect(inverseOldMetaPixelRemoval(alias, current, hash)).toBe(original); expect(inverseOldMetaPixelRemoval(alias, original, hash)).toBe(original);
        for (const bad of ["", current + "UNAPPROVED", current.slice(1), current.replace(/\n/, "\nUNAPPROVED\n")]) expect(() => inverseOldMetaPixelRemoval(alias, bad, hash)).toThrow("Old Meta pixel removal source scope mismatch");
      }
      expect(entry.fragments.some(fragment => fragment.after === "")).toBe(true);
      expect(inverseOldMetaPixelRemoval(path + ".bak", current, hash)).toBe(current);
    }
  });

  it("pins only exact new test/helper inventory with negative SHA guards and keeps the helper pure without registering imported tests", () => {
    const helper = read(helperPath), helperSHA = hash(helper);
    for (const path of [helperPath, directPath]) {
      const source = read(path); expect(oldMetaPixelRemovalApprovedInventory(path, source, hash, helperSHA)).toBe(true);
      expect(() => oldMetaPixelRemovalApprovedInventory(path, source + "UNAPPROVED", hash, helperSHA)).toThrow("Old Meta pixel removal inventory SHA mismatch");
      expect(oldMetaPixelRemovalApprovedInventory(path + ".bak", source, hash, helperSHA)).toBe(false);
    }
    expect(hash(read(directPath))).toBe(oldMetaPixelRemovalInventoryPin(directPath)); expect(oldMetaPixelRemovalInventoryPin(directPath + ".bak")).toBeNull();
    expect(() => oldMetaPixelRemovalApprovedInventory(helperPath, helper, hash, "0".repeat(64))).toThrow("Old Meta pixel removal inventory SHA mismatch");
    const code = helper.split("\n").slice(1).join("\n").replace(/"(?:[^"\\]|\\.)*"/g, '"FROZEN_DATA_LITERAL"');
    expect(code).not.toMatch(/(?<![.\w])(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(directPath)).not.toMatch(/from\s+["'][^"']*\.test["']/);
  });

  it("restores the complete six-source and changed-test inventory latest-first while every unrelated tracked production and existing fixture stays byte-exact", () => {
    const helperSHA = hash(read(helperPath));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const entries = git("ls-tree", "-r", base, "--", ...scope).trim().split("\n").map(line => { const [metadata, path] = line.split("\t"); return { path, blobSHA: metadata.split(" ")[2] }; });
    for (const { path, blobSHA } of entries) {
      const raw = readFileSync(resolve(root, path)), restored = oldMetaPixelRemovalNeedsInverse(path) ? Buffer.from(oldMetaPixelRemovalHistoricalSource(path, raw.toString("utf8"), hash, helperSHA)) : raw;
      expect(createHash("sha1").update(Buffer.from("blob " + restored.length + "\0")).update(restored).digest("hex"), path).toBe(blobSHA);
    }
    const old = new Set(entries.map(entry => entry.path)), additions = git("ls-files", "--cached", "--others", "--exclude-standard", "--", ...scope).split("\n").filter(path => path && !old.has(path));
    expect(additions.sort()).toEqual([helperPath, directPath].sort());
    for (const [path, pin] of Object.entries(OLD_META_PIXEL_REMOVAL_PROTECTED)) expect(hash(readFileSync(resolve(root, path))), path).toBe(pin);
  });
});
