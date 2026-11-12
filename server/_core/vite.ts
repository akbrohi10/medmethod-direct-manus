import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getMetaForPath, injectRouteMetaIntoHtml } from "../crawlerMiddleware";
import { injectCareTeamConfirmationPrivacyIntoHtml } from "../careTeamConfirmationPrivacy";
import { injectPublicMarketingMetaPixel } from "../publicMarketingMetaPixel";
import { injectMetaLeadGate } from "../metaLeadTracking";

function injectMasterclassRouteMeta(template: string, url: string): string {
  template = injectPublicMarketingMetaPixel(template, url);
  template = injectCareTeamConfirmationPrivacyIntoHtml(template, url);
  const cleanPath = url.split("?")[0].replace(/\/$/, "") || "/";
  if (cleanPath === "/weight-loss-menopauseV2") return injectRouteMetaIntoHtml(template, getMetaForPath(url));
  if (cleanPath === "/weight-loss-menopause") return injectRouteMetaIntoHtml(template, getMetaForPath(url));
  if (cleanPath === "/masterclass2") return injectRouteMetaIntoHtml(template, getMetaForPath(url));
  if (cleanPath !== "/masterclass") return template;
  return injectRouteMetaIntoHtml(template, getMetaForPath(url));
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  // Route root/index through the same gated HTML response instead of a raw static index.
  app.use(["/", "/index.html"], (req, _res, next) => {
    if (["GET", "HEAD"].includes(req.method) && ["/", "/index.html"].includes(req.originalUrl.split("?")[0])) {
      req.url = "/__public_website_html__" + (req.originalUrl.includes("?") ? "?" + req.originalUrl.split("?").slice(1).join("?") : "");
    }
    next();
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = injectMetaLeadGate(injectMasterclassRouteMeta(template, url), req);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.get(["/", "/index.html"], (req, res, next) => {
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      res.status(200).type("html").send(injectMetaLeadGate(injectMasterclassRouteMeta(template, req.originalUrl), req));
    } catch (error) {
      next(error);
    }
  });
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res, next) => {
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      const page = injectMetaLeadGate(injectMasterclassRouteMeta(template, req.originalUrl), req);
      res.status(200).type("html").send(page);
    } catch (error) {
      next(error);
    }
  });
}
