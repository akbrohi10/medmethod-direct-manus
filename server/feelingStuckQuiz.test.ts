import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer, request } from "node:http";
import path, { resolve } from "node:path";
import { Script, createContext } from "node:vm";
import express from "express";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "client/public/feeling-stuck.html"), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const script = new Script(scripts[0]);

function engine() {
  let nextNode = 0;
  const nodes: Record<string, any> = {};
  const pending: Function[] = [];
  function node(id: string): any {
    if (nodes[id]) return nodes[id];
    const classes = new Set<string>();
    if (["quiz", "result", "stickyBar"].includes(id)) classes.add("hidden");
    let content = "";
    const n: any = {
      style: {}, children: [], handlers: {}, attrs: {}, textContent: "", box: { textContent: "" },
      classList: { add: (...values: string[]) => values.forEach(value => classes.add(value)), remove: (...values: string[]) => values.forEach(value => classes.delete(value)), contains: (value: string) => classes.has(value) },
      addEventListener(name: string, fn: Function) { this.handlers[name] = fn; },
      setAttribute(name: string, value: string) { this.attrs[name] = value; },
      appendChild(child: any) { this.children.push(child); },
      querySelector() { return this.box; },
      querySelectorAll() { return this.children; },
      get innerHTML() { return content; },
      set innerHTML(value: string) { content = value; this.children = []; },
    };
    nodes[id] = n;
    return n;
  }
  node("liveDots").children = Array.from({ length: 6 }, () => ({ className: "" }));
  const env: any = {
    document: { getElementById: node, createElement: () => node(`created-${nextNode++}`), body: node("body") },
    window: { scrollTo() {}, matchMedia: () => ({ matches: true }) },
    setTimeout: (fn: Function) => { pending.push(fn); return pending.length; },
    requestAnimationFrame: (fn: Function) => fn(1),
  };
  script.runInContext(createContext(env));
  return { env, node, flush: () => { while (pending.length) pending.shift()!(); } };
}

function complete(choices: number[]) {
  const e = engine();
  e.node("startBtn").handlers.click();
  choices.forEach((choice, index) => {
    expect(e.env.state.step).toBe(index);
    expect(e.node("stepLabel").textContent).toBe(`Question ${index + 1} of 6`);
    expect(e.node("progressBar").style.width).toBe(`${Math.round((index + 1) / 6 * 100)}%`);
    e.node("options").children[choice].handlers.click();
    e.flush();
  });
  return e;
}

describe("exact supplied Feeling Stuck quiz", () => {
  it("preserves the complete attachment at its frozen SHA-256 with no rewrites", () => {
    expect(createHash("sha256").update(html).digest("hex")).toBe("639b0049c35255e2689581b0ce246b586432165343afee17f639419f691aab3c");
    expect(Buffer.byteLength(html)).toBe(2355415);
    expect(html).toContain("<title>Feeling Stuck? — A 60-Second Quiz</title>");
    expect(scripts).toHaveLength(1);
    expect(() => new Script(scripts[0])).not.toThrow();
  });

  it("preserves all six question keys, three choices, weights and original ordering", () => {
    const { env } = engine();
    expect(env.QUESTIONS.map((q: any) => q.key)).toEqual(["quiet", "struggling", "diets", "cheat", "willpower", "doctor"]);
    env.QUESTIONS.forEach((q: any) => expect(q.options.map((option: any) => option.weight)).toEqual([1, 0.5, 0]));
  });

  it("completes every answer combination with original yes count, weighted bands and result-only sticky control", () => {
    for (let combination = 0; combination < 3 ** 6; combination++) {
      const choices = Array.from({ length: 6 }, (_, index) => Math.floor(combination / 3 ** index) % 3);
      const e = complete(choices);
      const yes = choices.filter(value => value === 0).length;
      const total = choices.reduce((sum, value) => sum + [1, 0.5, 0][value], 0);
      expect(e.env.yesTotals()).toEqual({ yes, total });
      expect(e.node("yesNum").textContent).toBe(yes);
      expect(e.node("stickyText").textContent).toBe(`${yes} of 6 — you said yes`);
      expect(e.node("result").classList.contains("hidden")).toBe(false);
      expect(e.node("quiz").classList.contains("hidden")).toBe(true);
      expect(e.node("stickyBar").classList.contains("hidden")).toBe(false);
      const title = total >= 4.5 ? "That's the whole pattern." : total >= 2.5 ? "That's most of the pattern." : total >= 1 ? "A few of these are you." : "Honestly? This may not be your pattern.";
      expect(e.node("verdictTitle").textContent).toBe(title);
    }
  });

  it("preserves backward navigation, changed answers and retake/reset behavior", () => {
    const e = engine();
    e.node("startBtn").handlers.click();
    e.node("options").children[0].handlers.click(); e.flush();
    expect(e.env.state.step).toBe(1);
    e.node("backBtn").handlers.click();
    expect(e.env.state.step).toBe(0);
    e.node("options").children[2].handlers.click(); e.flush();
    expect(e.env.state.answers.quiet).toBe(2);
    expect(e.env.yesTotals().yes).toBe(0);
    for (let i = 1; i < 6; i++) { e.node("options").children[0].handlers.click(); e.flush(); }
    e.node("restartBtn").handlers.click();
    expect(e.env.state).toEqual({ step: 0, answers: {} });
    expect(e.node("intro").classList.contains("hidden")).toBe(false);
    expect(e.node("stickyBar").classList.contains("hidden")).toBe(true);
    expect(e.node("body").classList.contains("has-sticky")).toBe(false);
  });

  it("adds no tracking, persistence, forms, provider calls or site runtime to the supplied page", () => {
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(scripts.join("\n")).not.toMatch(/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|fbq|hj|postMessage)\b/);
    expect(html).not.toContain("/src/main.tsx");
    expect(html).not.toContain("<form");
    expect([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1])).toEqual(Array(3).fill("https://medmethoddirect.com"));
    expect(html).toContain("Video coming soon");
    expect(html).toContain("Start text visit — $29 →");
  });

  it("keeps the production build byte-identical to the supplied document", () => {
    expect(readFileSync(resolve(root, "dist/public/feeling-stuck.html"))).toEqual(Buffer.from(html));
  });

  it("serves the standalone document before crawler, tracker injection and SPA fallthrough", () => {
    const server = readFileSync(resolve(root, "server/_core/index.ts"), "utf8");
    expect(server).toContain('app.get(["/feeling-stuck", "/feeling-stuck/", "/feeling-stuck.html"]');
    expect(server).toContain('path.resolve(import.meta.dirname, "../../client/public/feeling-stuck.html")');
    expect(server).toContain('path.resolve(import.meta.dirname, "public/feeling-stuck.html")');
    expect(server.indexOf("res.sendFile(feelingStuckQuizHtml)")).toBeLessThan(server.indexOf("app.use(crawlerMiddleware)"));
    expect(server.indexOf("res.sendFile(feelingStuckQuizHtml)")).toBeLessThan(server.indexOf("await setupVite(app, server)"));
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    expect(app).toContain('window.location.replace("/feeling-stuck")');
    expect(app).toContain('<Route path="/feeling-stuck" component={FeelingStuckQuizStandaloneRedirect} />');
    expect(app).toContain('<Route path="/feeling-stuck/" component={FeelingStuckQuizStandaloneRedirect} />');
    expect(app).toContain('if (location === "/feeling-stuck" || location === "/feeling-stuck/") return null;');
  });

  it("serves exact GET/HEAD responses in development and production using the actual route block", async () => {
    const source = readFileSync(resolve(root, "server/_core/index.ts"), "utf8");
    const block = source.match(/  \/\/ Serve the supplied Feeling Stuck quiz[\s\S]*?\n  \}\);\n/)![0];
    const mount = new Function("app", "process", "path", "metaDir", block.replaceAll("import.meta.dirname", "metaDir"));
    for (const mode of ["development", "production"]) {
      const app = express();
      mount(app, { env: { NODE_ENV: mode } }, path, resolve(root, mode === "development" ? "server/_core" : "dist"));
      let fallthrough = 0;
      app.use((_req, res) => { fallthrough++; res.status(500).send("Unexpected SPA fallthrough"); });
      const server = createServer(app);
      await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
      const port = (server.address() as { port: number }).port;
      try {
        for (const url of ["/feeling-stuck", "/feeling-stuck/", "/feeling-stuck.html", "/feeling-stuck?prefill=demo"]) {
          for (const method of ["GET", "HEAD"]) {
            const result = await new Promise<{ status: number; body: Buffer; headers: any }>((resolve, reject) => {
              const req = request({ hostname: "127.0.0.1", port, path: url, method, agent: false, headers: { "User-Agent": "facebookexternalhit/1.1" } }, res => {
                const parts: Buffer[] = [];
                res.on("data", part => parts.push(Buffer.from(part)));
                res.on("end", () => resolve({ status: res.statusCode!, body: Buffer.concat(parts), headers: res.headers }));
                res.on("error", reject);
              });
              req.on("error", reject); req.end();
            });
            expect(result.status).toBe(200);
            expect(result.headers["content-type"]).toContain("text/html");
            expect(Number(result.headers["content-length"])).toBe(Buffer.byteLength(html));
            expect(result.body.equals(method === "GET" ? Buffer.from(html) : Buffer.alloc(0))).toBe(true);
          }
        }
        expect(fallthrough).toBe(0);
      } finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      }
    }
  }, 30000);

  it("restores both existing routing files exactly to the approved baseline by removing only the new additions", () => {
    const serverAddition = '  // Serve the supplied Feeling Stuck quiz unchanged, outside the shared SPA and tracking.\n  const feelingStuckQuizHtml = process.env.NODE_ENV === "development"\n    ? path.resolve(import.meta.dirname, "../../client/public/feeling-stuck.html")\n    : path.resolve(import.meta.dirname, "public/feeling-stuck.html");\n  app.get(["/feeling-stuck", "/feeling-stuck/", "/feeling-stuck.html"], (_req, res) => {\n    res.sendFile(feelingStuckQuizHtml);\n  });\n\n';
    const appAdditions = [
      '/** Load the supplied Feeling Stuck document without shared styling or overlays. */\nfunction FeelingStuckQuizStandaloneRedirect() {\n  useEffect(() => {\n    window.location.replace("/feeling-stuck");\n  }, []);\n\n  return <a href="/feeling-stuck">Opening Feeling Stuck Quiz…</a>;\n}\n\n',
      '        <Route path="/feeling-stuck" component={FeelingStuckQuizStandaloneRedirect} />\n        <Route path="/feeling-stuck/" component={FeelingStuckQuizStandaloneRedirect} />\n',
      '  if (location === "/feeling-stuck" || location === "/feeling-stuck/") return null;\n',
    ];
    for (const [file, additions] of [["server/_core/index.ts", [serverAddition]], ["client/src/App.tsx", appAdditions]] as const) {
      let current = readFileSync(resolve(root, file), "utf8");
      for (const addition of additions) {
        expect(current.split(addition)).toHaveLength(2);
        current = current.replace(addition, "");
      }
      expect(current).toBe(execFileSync("git", ["show", `685c6ef3:${file}`], { cwd: root, encoding: "utf8" }));
    }
  });
});
