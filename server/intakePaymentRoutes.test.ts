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
const env = read("server/_core/env.ts");

// These source-level checks deliberately avoid calling a real Keragon endpoint or
// PayPal environment. Browser validation uses only the configuration-error path.
describe("intake Keragon delivery and PayPal payment boundary", () => {
  it("keeps the Keragon URL server-only, secret-first and encrypted when using the admin fallback", () => {
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
    expect(env).toContain('keragonWebhookUrl: process.env.KERAGON_WEBHOOK_URL ?? ""');
    expect(routes).toContain("let endpoint = ENV.keragonWebhookUrl.trim();");
    expect(routes).toContain("if (settings?.keragonWebhookUrlEncrypted)");
    expect(routes).toContain("endpoint = decryptIntakeCredential(settings.keragonWebhookUrlEncrypted);");
  });

  it("delivers intake before creating the one-time $49.00 PayPal order and never stores the intake on this server", () => {
    expect(routes).toContain('const INTAKE_AMOUNT = "49.00"');
    expect(routes).toContain("await deliverIntake(deliveryPayload);");
    expect(routes.indexOf("await deliverIntake(deliveryPayload);")).toBeLessThan(routes.indexOf("const client = await getPayPalClient(mode);", routes.indexOf("await deliverIntake(deliveryPayload);")));
    expect(routes).toContain("Your card has not been charged.");
    expect(routes).not.toContain("createPayment(");
    expect(routes).not.toContain("db.insert(");
  });

  it("derives the Keragon-bound treatment summary from the shared catalog name and price", () => {
    expect(intake).toContain("let t=p.find(t=>t.value===e);return t?[t.name,t.price].filter(Boolean).join(` — `):``");
    expect(intake).toContain("intake_summary:he(e,t,i)");
    expect(intake).toContain("intake_summary_html:ge(e,t,i)");
  });

  it("uses the admin-selected PayPal sandbox or live mode and binds capture to a short-lived signed approval token", () => {
    expect(routes).toContain('settings?.mode === "live" ? "live" : "sandbox"');
    expect(routes).toContain('return request.query.prefill === "demo" ? "sandbox" : paymentMode(settings);');
    expect(routes).toContain('const mode = paymentModeForRequest(settings, _req);');
    expect(routes).toContain('const mode = paymentModeForRequest(settings, req);');
    expect(routes).toContain('settings.activeProvider !== "paypal"');
    expect(routes).toContain('res.json({ client_id: clientId, environment: mode });');
    expect(routes).toContain('mode === "live" ? settings.liveClientId : settings.sandboxClientId');
    expect(routes).toContain("TOKEN_TTL_MS = 30 * 60 * 1000");
    expect(routes).toContain("createHmac(\"sha256\"");
    expect(routes).toContain("timingSafeEqual");
    expect(routes).toContain("approval_token");
    expect(routes).toContain('payment_status: "COMPLETED"');
  });

  it("forces only the prefill demo checkout through PayPal Sandbox", () => {
    expect(intake).toContain('async function Ee(e=!1)');
    expect(intake).toContain('`/api/paypal/client-token?prefill=demo`');
    expect(intake).toContain('`/api/paypal/orders?prefill=demo`');
    expect(intake).toContain('await Ee(i)');
    expect(intake).toContain('await Ee(demoMode)');
    expect(intake).toContain('intake:be(e,t,`mmd-intake-web`,n)');
  });

  it("keeps card data inside PayPal-hosted fields and posts only the approval token for capture", () => {
    expect(intake).toContain("PayPal-hosted secure fields");
    expect(intake).toContain("return{clientId:t.client_id,environment:t.environment}");
    expect(intake).toContain("r.createInstance({clientId:t,components:[`card-fields`],pageType:`checkout`})");
    expect(intake).not.toContain("clientToken:t");
    expect(intake).toContain("approvalToken:i.approval_token");
    expect(intake).toContain("body:JSON.stringify({approval_token:t})");
    expect(intake).not.toContain("card_number");
    expect(intake).not.toContain("card_cvv");
  });

  it("offers Apple Pay only through the same secure PayPal order and capture boundary", () => {
    expect(intake).toContain("applepay-payments");
    expect(intake).toContain("ApplePaySession.canMakePayments()");
    expect(intake).toContain("findEligibleMethods({currencyCode:`USD`})");
    expect(intake).toContain("createApplePayOneTimePaymentSession()");
    expect(intake).toContain("validateMerchant({validationUrl:event.validationURL})");
    expect(intake).toContain("confirmOrder({orderId:created.orderId,token:event.payment.token");
    expect(intake).toContain("payment_method:r");
    expect(intake).toContain("`apple_pay`");
    expect(routes).toContain('payment_method: z.enum(["card", "apple_pay"]).optional()');
    expect(routes).toContain('const paymentMethod = parsed.data.payment_method === "apple_pay" ? "apple_pay" : "card";');
    expect(routes).toContain("method: paymentMethod");
    expect(routes).toContain('...(paymentMethod === "card"');
    expect(routes).not.toContain("APPLE_PAY_MERCHANT");
  });

  it("provides a non-delivering POST preflight and returns JSON for parser failures", () => {
    expect(routes).toContain('app.post("/api/paypal/orders/preflight"');
    expect(routes).toContain("received_bytes: receivedBytes");
    expect(routes).not.toContain('deliverIntake(deliveryPayload);\n    });\n\n  app.post("/api/paypal/orders/preflight"');
    expect(serverEntry).toContain('app.use(express.json({ limit: "50mb" }));');
    expect(serverEntry).toContain('parserError?.type === "entity.too.large"');
    expect(serverEntry).toContain('parserError?.type === "entity.parse.failed"');
  });

  it("uses a non-gateway status for safe order validation and delivery failures", () => {
    const orderStart = routes.indexOf('app.post("/api/paypal/orders",');
    const captureStart = routes.indexOf('app.post("/api/paypal/orders/:orderId/capture",');
    const orderRoute = routes.slice(orderStart, captureStart);
    expect(orderRoute).toContain('res.status(422).json({ error: errorMessage(error) });');
    expect(orderRoute).not.toContain('res.status(502).json');
  });
});
