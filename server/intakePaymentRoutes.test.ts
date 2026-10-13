import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const routes = read("server/intakePaymentRoutes.ts");
const crypto = read("server/intakeCredentialCrypto.ts");
const admin = read("client/src/pages/AdminSettings.tsx");
const intake = read("client/intake/index.html");
const serverEntry = read("server/_core/index.ts");

// These source-level checks deliberately avoid calling a real Keragon endpoint or
// PayPal environment. Browser validation uses only the configuration-error path.
describe("intake Keragon delivery and PayPal payment boundary", () => {
  it("keeps the Keragon URL write-only, encrypted and admin-only", () => {
    expect(crypto).toContain('"aes-256-gcm"');
    expect(crypto).toContain("encryptIntakeCredential");
    expect(crypto).toContain("decryptIntakeCredential");
    expect(admin).toContain("KERAGON_WEBHOOK_URL");
    expect(admin).toContain("Stored encrypted at rest and never returned to the browser");
    expect(admin).toContain("intakeDeliverySettings.updateSettings");
    expect(admin).toContain('setActiveTab("intake")');
    expect(admin).toContain('type="password"');
    expect(intake).not.toContain("KERAGON_WEBHOOK_URL");
    expect(intake).not.toContain("hooks.keragon.com");
  });

  it("delivers intake before creating the one-time $49.00 PayPal order and never stores the intake on this server", () => {
    expect(routes).toContain('const INTAKE_AMOUNT = "49.00"');
    expect(routes).toContain("await deliverIntake(deliveryPayload);");
    expect(routes.indexOf("await deliverIntake(deliveryPayload);")).toBeLessThan(routes.indexOf("const client = await getPayPalClient(mode);", routes.indexOf("await deliverIntake(deliveryPayload);")));
    expect(routes).toContain("Your card has not been charged.");
    expect(routes).not.toContain("createPayment(");
    expect(routes).not.toContain("db.insert(");
  });

  it("uses the admin-selected PayPal sandbox or live mode and binds capture to a short-lived signed approval token", () => {
    expect(routes).toContain('settings?.mode === "live" ? "live" : "sandbox"');
    expect(routes).toContain('settings.activeProvider !== "paypal"');
    expect(routes).toContain('res.json({ client_id: clientId, environment: mode });');
    expect(routes).toContain('mode === "live" ? settings.liveClientId : settings.sandboxClientId');
    expect(routes).toContain("TOKEN_TTL_MS = 30 * 60 * 1000");
    expect(routes).toContain("createHmac(\"sha256\"");
    expect(routes).toContain("timingSafeEqual");
    expect(routes).toContain("approval_token");
    expect(routes).toContain('payment_status: "COMPLETED"');
  });

  it("keeps card data inside PayPal-hosted fields and posts only the approval token for capture", () => {
    expect(intake).toContain("PayPal-hosted secure fields");
    expect(intake).toContain("return{clientId:e.client_id,environment:e.environment}");
    expect(intake).toContain("r.createInstance({clientId:t,components:[`card-fields`],pageType:`checkout`})");
    expect(intake).not.toContain("clientToken:t");
    expect(intake).toContain("approvalToken:r.approval_token");
    expect(intake).toContain("body:JSON.stringify({approval_token:t})");
    expect(intake).not.toContain("card_number");
    expect(intake).not.toContain("card_cvv");
  });

  it("provides a non-delivering POST preflight and returns JSON for parser failures", () => {
    expect(routes).toContain('app.post("/api/paypal/orders/preflight"');
    expect(routes).toContain("received_bytes: receivedBytes");
    expect(routes).not.toContain('deliverIntake(deliveryPayload);\n    });\n\n  app.post("/api/paypal/orders/preflight"');
    expect(serverEntry).toContain('app.use(express.json({ limit: "50mb" }));');
    expect(serverEntry).toContain('parserError?.type === "entity.too.large"');
    expect(serverEntry).toContain('parserError?.type === "entity.parse.failed"');
  });
});
