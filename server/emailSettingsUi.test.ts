import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminSettings = readFileSync(new URL("../client/src/pages/AdminSettings.tsx", import.meta.url), "utf8");
const emailSettings = readFileSync(new URL("../client/src/components/AdminEmailSettings.tsx", import.meta.url), "utf8");
const emailSettingsRouter = readFileSync(new URL("./routers/emailSettings.ts", import.meta.url), "utf8");

describe("admin Email Settings interface", () => {
  it("adds a dedicated Email Settings tab without changing the existing payment tabs", () => {
    expect(adminSettings).toContain('"settings" | "paypal" | "email" | "payments"');
    expect(adminSettings).toContain("Email Settings");
    expect(adminSettings).toContain('<AdminEmailSettings />');
    expect(adminSettings).toContain("Stripe Settings");
    expect(adminSettings).toContain("PayPal Settings");
    expect(adminSettings).toContain("Payments (");
  });

  it("provides masked key management, enable gating, sender configuration, test sends, and editable templates", () => {
    expect(emailSettings).toContain("Resend API Key");
    expect(emailSettings).toContain("The saved key is never returned to the browser");
    expect(emailSettings).toContain('role="switch"');
    expect(emailSettings).toContain("Verified Sender Email");
    expect(emailSettings).toContain("Send Test Email");
    expect(emailSettings).toContain("Customer Email Templates");
    expect(emailSettings).toContain("HTML Message");
    expect(emailSettings).toContain("Plain-Text Message");
    expect(emailSettings).toContain("Recent Email Deliveries");
  });

  it("keeps every email-settings operation admin-only and encrypts replacement keys before persistence", () => {
    expect(emailSettingsRouter.match(/superAdminOrAdminProcedure/g)?.length).toBeGreaterThanOrEqual(6);
    expect(emailSettingsRouter).toContain("encryptEmailCredential(input.apiKey)");
    expect(emailSettingsRouter).toContain("apiKeyConfigured");
    expect(emailSettingsRouter).toContain('apiKeyMasked: settings?.resendApiKeyEncrypted ? "re_••••••••••••••••" : null');
    expect(emailSettingsRouter).not.toContain("apiKey: settings?.resendApiKeyEncrypted");
  });
});
