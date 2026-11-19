import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer, request } from "node:http";
import path, { resolve } from "node:path";
import { Script } from "node:vm";
import express from "express";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "client/public/tirzepatide-lp.html"));
const text = html.toString("utf8");
const scripts = [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const serverAddition = '  // Serve the supplied Tirzepatide prototype unchanged, isolated from live intake and payments.\n  const tirzepatideLandingHtml = process.env.NODE_ENV === "development"\n    ? path.resolve(import.meta.dirname, "../../client/public/tirzepatide-lp.html")\n    : path.resolve(import.meta.dirname, "public/tirzepatide-lp.html");\n  app.get(["/Tirzepatide-LP", "/Tirzepatide-LP/", "/tirzepatide-lp.html"], (_req, res) => {\n    res.sendFile(tirzepatideLandingHtml);\n  });\n\n';
const appAdditions = [
  '/** Load the original Tirzepatide prototype as a standalone document. */\nfunction TirzepatideLandingStandaloneRedirect() {\n  useEffect(() => {\n    window.location.replace("/Tirzepatide-LP");\n  }, []);\n\n  return <a href="/Tirzepatide-LP">Opening Tirzepatide landing page…</a>;\n}\n\n',
  '        <Route path="/Tirzepatide-LP" component={TirzepatideLandingStandaloneRedirect} />\n        <Route path="/Tirzepatide-LP/" component={TirzepatideLandingStandaloneRedirect} />\n',
  '  if (location === "/Tirzepatide-LP" || location === "/Tirzepatide-LP/") return null;\n',
];

describe("exact supplied Tirzepatide landing prototype", () => {
  it("preserves every attachment byte at its frozen SHA-256", () => {
    expect(html.length).toBe(4815645);
    expect(createHash("sha256").update(html).digest("hex")).toBe("853c9a56da1b66e72a108f5470e05cdeb85f3ae816807ef392887ce3d3afc32e");
    expect(text).toContain("<title>Compounded Tirzepatide | MedMethod Direct</title>");
  });

  it("keeps both original scripts syntactically valid without external runtimes", () => {
    expect(scripts).toHaveLength(2);
    scripts.forEach(script => expect(() => new Script(script)).not.toThrow());
    expect(text).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(text).not.toContain("/src/main.tsx");
  });

  it("retains in-memory-only prototype behavior without provider calls or tracking", () => {
    expect(scripts.join("\n")).not.toMatch(/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|fbq|hj|postMessage|WebSocket)\b/);
    expect(text).toContain("Prototype checkout — no real payment is processed, and no card details are stored or sent anywhere.");
    expect(text).toContain("State (in-memory only — prototype)");
    expect([...text.matchAll(/<a\b[^>]*href="([^"]+)"/g)].every(match => match[1] === "#")).toBe(true);
  });

  it("preserves both plans and all original two-phase screens in order", () => {
    expect([...text.matchAll(/data-screen="([^"]+)"/g)].map(match => match[1])).toEqual([
      "q-goal", "q-sex", "q-preg", "q-bmi", "q-goalweight", "q-conditions", "q-surgery", "q-glp1", "q-state", "q-name", "q-email", "q-phone", "q-dob", "q-medchoice", "v-plan", "v-checkout", "p2-intro", "p2-meds", "p2-allergies", "p2-gastro", "p2-kidney", "p2-eye", "p2-wlsurgery", "p2-pregplan", "p2-details", "p2-more", "p2-consents", "p2-sign", "v-confirm",
    ]);
    expect(scripts[1]).toContain('monthly: { name: "Monthly – Tirzepatide (1-Month Supply)", price: 149 }');
    expect(scripts[1]).toContain('quarter: { name: "3 Months – Tirzepatide (3-Month Supply)", price: 299 }');
    expect(scripts[1]).toContain('if (id === "q-preg") return S.sex === "Male";');
    expect(scripts[1]).toContain('if (id === "p2-details") return !hasFlags();');
  });

  it("keeps the production build byte-identical to the attachment", () => {
    expect(readFileSync(resolve(root, "dist/public/tirzepatide-lp.html")).equals(html)).toBe(true);
  });

  it("serves before the crawler, shared pixel injection and SPA fallback", () => {
    const source = readFileSync(resolve(root, "server/_core/index.ts"), "utf8");
    expect(source).toContain(serverAddition);
    expect(source.indexOf(serverAddition)).toBeLessThan(source.indexOf("app.use(crawlerMiddleware)"));
    expect(source.indexOf(serverAddition)).toBeLessThan(source.indexOf("await setupVite(app, server)"));
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    appAdditions.forEach(addition => expect(app).toContain(addition));
  });

  it("serves exact GET/HEAD bodies in development and production for all aliases", async () => {
    const source = readFileSync(resolve(root, "server/_core/index.ts"), "utf8");
    const block = source.match(/  \/\/ Serve the supplied Tirzepatide prototype[\s\S]*?\n  \}\);\n/)![0];
    const mount = new Function("app", "process", "path", "metaDir", block.replaceAll("import.meta.dirname", "metaDir"));
    for (const mode of ["development", "production"]) {
      const app = express();
      mount(app, { env: { NODE_ENV: mode } }, path, resolve(root, mode === "development" ? "server/_core" : "dist"));
      let fallthrough = 0;
      app.use((_req, res) => { fallthrough++; res.status(500).send("Unexpected fallback"); });
      const server = createServer(app);
      await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
      const port = (server.address() as { port: number }).port;
      try {
        for (const url of ["/Tirzepatide-LP", "/Tirzepatide-LP/", "/tirzepatide-lp.html", "/Tirzepatide-LP?prefill=demo"]) {
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
            expect(Number(result.headers["content-length"])).toBe(html.length);
            expect(result.body.equals(method === "GET" ? html : Buffer.alloc(0))).toBe(true);
          }
        }
        expect(fallthrough).toBe(0);
      } finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      }
    }
  }, 30000);

  it("removes only new routing additions to reconstruct both approved baseline files", () => {
    for (const [file, additions] of [["server/_core/index.ts", [serverAddition]], ["client/src/App.tsx", appAdditions]] as const) {
      let current = readFileSync(resolve(root, file), "utf8");
      for (const addition of additions) {
        expect(current.split(addition)).toHaveLength(2);
        current = current.replace(addition, "");
      }
      expect(current === execFileSync("git", ["show", `79f2ffbf:${file}`], { cwd: root, encoding: "utf8" })).toBe(true);
    }
  });
});
