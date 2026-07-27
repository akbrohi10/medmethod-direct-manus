import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { chargeRemainingHandler, ensureGlobalSweepCron } from "../scheduledChargeHandler";
import { ghlBookingWebhookHandler } from "../ghlWebhookHandler";
import { crawlerMiddleware } from "../crawlerMiddleware";
import { stripePaymentWebhookHandler } from "../stripePaymentWebhook";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // ── Stripe payment webhook — MUST be registered BEFORE express.json() ──────
  // Stripe signature verification requires the raw request body (a Buffer).
  // express.raw() captures it before express.json() parses it away.
  // This route fires ONLY for /lp/glp1 and /lp/hrt3 payments.
  // Setup: Stripe Dashboard → Developers → Webhooks → Add endpoint
  //   URL: https://medmethoddirect.com/api/webhooks/stripe-payment
  //   Events: payment_intent.succeeded
  app.post(
    "/api/webhooks/stripe-payment",
    express.raw({ type: "application/json" }),
    stripePaymentWebhookHandler
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Scheduled cron endpoints — MUST be registered before tRPC and Vite fallthrough
  // Legacy per-payment endpoint (kept for any old cron jobs still in flight)
  app.post("/api/scheduled/charge-remaining", chargeRemainingHandler);
  // Global hourly sweep — charges all due deposit_paid payments
  app.post("/api/scheduled/sweep-due-charges", chargeRemainingHandler);
  // Register the global hourly sweep cron job (idempotent — safe to call on every startup)
  ensureGlobalSweepCron().catch((err: unknown) =>
    console.error("[Startup] Failed to register global sweep cron:", err)
  );
  // GHL booking webhook — fires when a patient books an appointment in the GHL calendar
  // Setup: GHL → Settings → Integrations → Webhooks → Add Webhook
  // URL: https://medmethoddirect.com/api/ghl/booking-confirmed
  // Events: Appointment Created / Appointment Booked
  app.post("/api/ghl/booking-confirmed", ghlBookingWebhookHandler);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Crawler detection middleware — serves minimal HTML with OG tags to social media bots
  // Must be BEFORE Vite/static serving so bots get the meta tags, not the SPA shell
  app.use(crawlerMiddleware);

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
