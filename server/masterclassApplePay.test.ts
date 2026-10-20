import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const form = read("client/src/components/home1/PayPalPaymentForm.tsx");
const option = read("client/src/components/home1/PayPalApplePayOption.tsx");
const modal = read("client/src/components/home1/LpConsultationModal2.tsx");
const router = read("server/routers/paypal.ts");
const schema = read("drizzle/schema.ts");
const migration = read("drizzle/0013_motionless_the_liberteens.sql");
const webhookSettingsMigration = read("drizzle/0015_mean_stark_industries.sql");
const webhook = read("server/paypalPaymentWebhook.ts");
const admin = read("client/src/pages/AdminSettings.tsx");

describe("masterclass-only Apple Pay appointment deposit", () => {
  it("mounts the option only when PayPal is active on the masterclass payment step", () => {
    expect(modal).toContain('enableApplePay={landingPage === "/masterclass"}');
    expect(form).toContain('components: applePayConfigured ? "card-fields,applepay" : "card-fields"');
    expect(form).toContain('landingPage="/masterclass"');
    expect(option).toContain('landingPage: "/masterclass";');
    expect(option).not.toContain('landingPage: string');
  });

  it("shows no Apple Pay control until both device and PayPal merchant eligibility pass", () => {
    expect(option).toContain("ApplePaySession");
    expect(option).toContain("Session.canMakePayments()");
    expect(option).toContain("paypalApplePay.config()");
    expect(option).toContain("nextConfig.isEligible === true");
    expect(option).toContain("if (!applePay || !config) return null;");
    expect(option).toContain('data-masterclass-apple-pay-button');
    expect(option).toContain('background: "#000"');
    expect(option).toContain('color: "#fff"');
    expect(form).toContain('data-masterclass-card-choice');
    expect(form).toContain('data-masterclass-select-card');
    expect(form).not.toContain("if (!available) setUseCard(true)");
    expect(form).toContain("applePayVaultWebhookConfigured === true");
  });

  it("requires disclosed later-balance consent before the $50 buyer-present Apple Pay sheet", () => {
    expect(option).toContain('data-masterclass-apple-pay-consent');
    expect(option).toContain("automatically charge the remaining $149 balance on the day of my appointment");
    expect(option).toContain("if (!consented)");
    expect(option).toContain("amount: \"50.00\"");
    expect(option).toContain("new Session(4, {");
    expect(option).toContain("session.begin()");
    expect(option).toContain("applePay.confirmOrder({");
    expect(option).toContain("captureOrder.mutateAsync");
  });

  it("keeps the source-safe saved-method setup and delayed-vault path", () => {
    expect(router).toContain("createApplePayOrder");
    expect(router).toContain('landingPage: z.literal("/masterclass")');
    expect(router).toContain("payment_source: {\n            apple_pay:");
    expect(router).toContain('payment_type: "RECURRING"');
    expect(router).toContain("captureApplePayOrder");
    expect(router).toContain('const vaultIsReady = vault?.status === "VAULTED" && !!vault.id;');
    expect(router).toContain('paypalApplePayVaultStatus: vaultIsReady ? "vaulted" : "pending"');
    expect(router).toContain('paypalVaultPaymentSource: "apple_pay"');
    expect(router).toContain("vaultPaymentSource === \"apple_pay\"");
    expect(router).toContain("apple_pay: {");
    expect(webhook).toContain('event.event_type === "VAULT.PAYMENT-TOKEN.CREATED"');
    expect(webhook).toContain("verifyApplePayVaultWebhook");
    expect(webhook).toContain('paypalApplePayVaultStatus: "vaulted"');
    expect(router).toContain('"PayPal-Request-Id": `remaining-balance-${paymentId}`');
    expect(webhook).toContain('eq(payments.paypalVaultPaymentSource, "apple_pay")');
    expect(schema).toContain('paypalVaultPaymentSource: mysqlEnum("paypalVaultPaymentSource", ["card", "apple_pay"])');
    expect(schema).toContain('paypalApplePayConsentAt: timestamp("paypalApplePayConsentAt")');
    expect(schema).toContain('paypalApplePayVaultStatus: mysqlEnum("paypalApplePayVaultStatus", ["pending", "vaulted"])');
    expect(migration).toContain("ALTER TABLE `payments` ADD `paypalVaultPaymentSource` enum('card','apple_pay')");
    expect(migration).toContain("ALTER TABLE `payments` ADD `paypalApplePayConsentAt` timestamp");
    expect(admin).toContain("Sandbox Webhook ID");
    expect(admin).toContain("Live Webhook ID");
    expect(admin).toContain("VAULT.PAYMENT-TOKEN.CREATED");
    expect(webhookSettingsMigration).toContain("ADD `sandboxWebhookId` text");
    expect(webhookSettingsMigration).toContain("ADD `liveWebhookId` text");
  });

  it("keeps card checkout, non-masterclass pages, and all other payment-provider routing intact", () => {
    expect(form).toContain('components: applePayConfigured ? "card-fields,applepay" : "card-fields"');
    expect(form).toContain("PayPalCardFormWithProvider");
    expect(modal).toContain("activeProvider === \"paypal\"");
    expect(modal).toContain("<StripePaymentForm");
    expect(modal).toContain('landingPage === "/masterclass" && isPaymentStep');
    expect(option).not.toContain("fetch(");
    expect(option).not.toContain("payment_source.card");
  });
});
