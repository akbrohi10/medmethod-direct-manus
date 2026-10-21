import { it, expect, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import axios from "axios";
import type { Express, Request, Response as ExpressResponse } from "express";

vi.mock("./db", () => ({
  getPaypalSettings: async () => ({ activeProvider: "paypal", mode: "sandbox", sandboxClientId: "SYNTHETIC-TEST-NOT-CREDENTIALS", sandboxClientSecret: "SYNTHETIC-TEST-NOT-CREDENTIALS" }),
  getIntakeDeliverySettings: async () => null,
}));
import { registerIntakePaymentRoutes } from "./intakePaymentRoutes";
import { ENV } from "./_core/env";
import { getPhoneVerificationSettings } from "./intakePhoneVerification";

const run = process.env.RUN_INTAKE_KERAGON_HANDOFF_TEST === "1";
it.skipIf(!run)("sends exactly one explicitly marked synthetic paid-contract test through Keragon; no real PayPal or Spruce calls", async () => {
  expect(ENV.isProduction).toBe(false);
  expect(getPhoneVerificationSettings()).toMatchObject({ mode: "sandbox", required: true });
  expect(ENV.keragonWebhookUrl).toBeTruthy();
  const input = JSON.parse(readFileSync("/tmp/intake-client-synthetic-draft.json", "utf8"));
  const originalPatient = { ...input.patient };
  input.submission_id = randomUUID(); input.submitted_at = new Date().toISOString(); input.is_test = true;
  input.patient = { first_name: "MMD Integration", last_name: "TEST ONLY", dob: "1985-01-15", state: "GA", state_name: "Georgia", email: "mmd.intake.test@example.test", phone: "(202) 555-0101", sex: "F" };
  input.intake_summary = "SYNTHETIC INTEGRATION TEST ONLY — NO REAL PATIENT / NO CHARGE.\n" + input.intake_summary;
  input.intake_summary_html = "<b>SYNTHETIC INTEGRATION TEST ONLY — NO REAL PATIENT / NO CHARGE.</b><br>" + input.intake_summary_html;
  // Replace any illustrative contact data embedded in the browser's demo summary.
  input.intake_summary = input.intake_summary.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "mmd.intake.test@example.test");
  input.intake_summary_html = input.intake_summary_html.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "mmd.intake.test@example.test");
  for (const key of ["first_name", "last_name", "email", "phone"]) {
    if (originalPatient[key]) { input.intake_summary = input.intake_summary.split(originalPatient[key]).join(input.patient[key]); input.intake_summary_html = input.intake_summary_html.split(originalPatient[key]).join(input.patient[key]); }
  }
  const routes = new Map<string, Function>();
  registerIntakePaymentRoutes({ post: (path: string, fn: Function) => routes.set("POST " + path, fn), get: (path: string, fn: Function) => routes.set("GET " + path, fn) } as unknown as Express);
  async function request(path: string, body: unknown, params = {}) {
    const result = { code: 200, body: undefined as any, status(code: number) { this.code = code; return this; }, json(value: unknown) { this.body = value; return this; }, setHeader() {} };
    await routes.get("POST " + path)!({ body, params, query: {}, headers: {}, ip: "203.0.113.27" } as Request, result as unknown as ExpressResponse);
    return result;
  }
  const challenge = await request("/api/phone-verification/request", { phone: input.patient.phone });
  expect(challenge.code).toBe(201); expect(challenge.body.mode).toBe("sandbox");
  const confirmation = await request("/api/phone-verification/confirm", { verification_id: challenge.body.verification_id, code: challenge.body.test_code });
  expect(confirmation.body.verified).toBe(true);
  const orderId = "SYNTHETIC-NO-CHARGE-ORDER", captureId = "SYNTHETIC-NO-CHARGE-CAPTURE";
  const capturedAt = new Date().toISOString(); let deliveries = 0; let capturedBody = ""; let responseStatus = 0;
  const originalFetch = globalThis.fetch;
  vi.stubGlobal("fetch", async (rawUrl: string | URL | Request, init: RequestInit = {}) => {
    const url = String(rawUrl);
    if (url === ENV.keragonWebhookUrl) {
      expect(input.is_test).toBe(true); expect(deliveries).toBe(0); deliveries++;
      capturedBody = String(init.body);
      const payload = JSON.parse(capturedBody);
      expect(payload.is_test).toBe(true); expect(payload.payment.capture_id).toBe(captureId); expect(payload.payment.environment).toBe("sandbox");
      expect(payload.patient.phone_verified).toBe(true); expect(payload.event).toBe("mmd_intake.paid_submitted");
      writeFileSync("/home/ubuntu/intake-keragon-test-exact-payload.json", capturedBody + "\n");
      const response = await axios.post(url, capturedBody, { headers: init.headers as Record<string, string>, timeout: 15000, maxRedirects: 0, validateStatus: () => true });
      responseStatus = response.status;
      writeFileSync("/home/ubuntu/intake-keragon-test-receipt.json", JSON.stringify({ submission_id: input.submission_id, is_test: true, http_status: responseStatus, sent_at: new Date().toISOString(), sends: deliveries, paypal: "MOCKED — no actual order or charge", spruce: "SANDBOX — no SMS sent" }, null, 2) + "\n");
      return new Response(null, { status: response.status });
    }
    if (url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "SYNTHETIC-NOT-A-TOKEN" });
    if (url.endsWith("/v2/checkout/orders")) return Response.json({ id: orderId });
    if (url.endsWith(orderId)) return Response.json({ id: orderId, status: "APPROVED", purchase_units: [{ custom_id: input.submission_id, amount: { value: "49.00", currency_code: "USD" } }] });
    if (url.endsWith("/capture")) return Response.json({ id: orderId, status: "COMPLETED", purchase_units: [{ custom_id: input.submission_id, payments: { captures: [{ id: captureId, status: "COMPLETED", amount: { value: "49.00", currency_code: "USD" }, create_time: capturedAt }] } }] });
    throw new Error("Unexpected outbound request blocked during synthetic test.");
  });
  try {
    const created = await request("/api/paypal/orders", { intake: input, phone_verification_token: confirmation.body.verification_token });
    expect(created.code).toBe(201); expect(deliveries).toBe(0);
    const completion = await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(responseStatus).toBeGreaterThanOrEqual(200); expect(responseStatus).toBeLessThan(300); expect(completion.code).toBe(200);
    await request("/api/paypal/orders/:orderId/capture", { approval_token: created.body.approval_token }, { orderId });
    expect(deliveries).toBe(1); expect(JSON.parse(capturedBody).patient.phone_verified_at).toBe(confirmation.body.verified_at);
    console.log("Synthetic Keragon handoff accepted:", { http_status: responseStatus, submission_id: input.submission_id, is_test: true, sends: deliveries, paypal: "mocked / no charge", spruce: "sandbox / no SMS" });
  } finally { globalThis.fetch = originalFetch; vi.unstubAllGlobals(); }
}, 30000);
