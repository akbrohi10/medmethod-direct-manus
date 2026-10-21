import { request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

type ApiResponse = { status: number; body: Record<string, unknown> };

type VerificationModule = typeof import("./intakePhoneVerification");

async function requestJson(
  baseUrl: string,
  path: string,
  body?: Record<string, unknown>,
  headers: Record<string, string> = {},
): Promise<ApiResponse> {
  const payload = body === undefined ? undefined : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const request = httpRequest(`${baseUrl}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Accept: "application/json",
        ...(payload ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    }, response => {
      const chunks: Buffer[] = [];
      response.on("data", chunk => chunks.push(Buffer.from(chunk)));
      response.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve({ status: response.statusCode ?? 0, body: raw ? JSON.parse(raw) as Record<string, unknown> : {} });
      });
    });
    request.on("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

async function createHarness(mode: "live" | "sandbox" = "sandbox") {
  // Reloading the module deliberately gives every test an isolated in-memory store.
  vi.resetModules();
  const { ENV } = await import("./_core/env");
  ENV.phoneVerificationMode = mode;
  ENV.phoneVerificationRequired = true;
  ENV.spruceApiToken = "spruce-test-secret";
  ENV.spruceInternalEndpointId = "internal-endpoint-test";
  const verification = await import("./intakePhoneVerification") as VerificationModule;

  const app = express();
  // The application has not marked arbitrary proxies trusted. A caller-supplied
  // X-Forwarded-For must not alter the IP used for throttling.
  app.set("trust proxy", false);
  app.use(express.json());
  verification.registerIntakePhoneVerificationRoutes(app);

  const server = await new Promise<ReturnType<typeof app.listen>>((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  const { port } = server.address() as AddressInfo;
  return {
    verification,
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("intake phone verification", () => {
  it("normalizes supported phone input and publishes only browser-safe settings", async () => {
    const harness = await createHarness();
    try {
      expect(harness.verification.normalizedPhone("(407) 555-0100")).toBe("+14075550100");
      expect(harness.verification.normalizedPhone("+44 20 7946 0018")).toBe("+442079460018");
      expect(harness.verification.normalizedPhone("407-555")).toBeNull();
      expect(harness.verification.normalizedPhone("+1 407 555 0100 ext 1")).toBeNull();
      expect(harness.verification.verificationCodeHash("verification-id", "123456"))
        .toMatch(/^[a-f0-9]{64}$/);

      const settings = await requestJson(harness.baseUrl, "/api/phone-verification/settings");
      expect(settings).toEqual({
        status: 200,
        body: { mode: "sandbox", required: true, demo_available: true },
      });
    } finally {
      await harness.close();
    }
  });

  it("issues a sandbox verification, binds its opaque token to the normalized phone, and consumes the challenge", async () => {
    const harness = await createHarness();
    try {
      const requested = await requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "(407) 555-0100" });
      expect(requested.status).toBe(201);
      expect(requested.body).toMatchObject({ expires_in_seconds: 600, mode: "sandbox" });
      expect(requested.body.test_code).toMatch(/^\d{6}$/);

      const confirmed = await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: requested.body.verification_id,
        code: requested.body.test_code,
      });
      expect(confirmed.status).toBe(200);
      expect(confirmed.body).toMatchObject({ verified: true, expires_in_seconds: 1800, mode: "sandbox" });
      expect(confirmed.body.verification_token).toMatch(/^[0-9a-f-]{36}$/i);

      expect(harness.verification.validPhoneVerificationToken(confirmed.body.verification_token, "+14075550100"))
        .toMatchObject({ mode: "sandbox" });
      expect(harness.verification.validPhoneVerificationToken(confirmed.body.verification_token, "+14075550101"))
        .toBeNull();
      expect((await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: requested.body.verification_id,
        code: requested.body.test_code,
      })).status).toBe(400);
    } finally {
      await harness.close();
    }
  });

  it("invalidates a challenge at five wrong-code attempts", async () => {
    const harness = await createHarness();
    try {
      const requested = await requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "407-555-0101" });
      for (let attempt = 1; attempt <= 5; attempt += 1) {
        const result = await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
          verification_id: requested.body.verification_id,
          code: "000000",
        });
        expect(result.status).toBe(422);
      }
      const afterInvalidation = await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: requested.body.verification_id,
        code: requested.body.test_code,
      });
      expect(afterInvalidation.status).toBe(400);
    } finally {
      await harness.close();
    }
  });

  it("reserves a phone during a live provider send, applies cooldown even on that concurrent path, and sends the exact safe Spruce payload", async () => {
    const harness = await createHarness("live");
    let notifyProviderStarted: (() => void) | undefined;
    const providerStarted = new Promise<void>(resolve => { notifyProviderStarted = resolve; });
    const providerPost = vi.spyOn(axios, "post").mockImplementation((() =>
      new Promise(resolve => {
        notifyProviderStarted?.();
        setTimeout(() => resolve({ status: 202, headers: { "x-request-id": "provider-request-test" } }), 10);
      })) as never);
    try {
      const firstRequest = requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "407 555 0102" });
      await providerStarted;
      const concurrent = await requestJson(harness.baseUrl, "/api/phone-verification/resend", { phone: "+1 (407) 555-0102" });
      expect(concurrent.status).toBe(429);

      const first = await firstRequest;
      expect(first.status).toBe(201);
      expect(first.body).toMatchObject({ expires_in_seconds: 600, mode: "live" });
      expect(first.body).not.toHaveProperty("test_code");
      expect(JSON.stringify(first.body)).not.toContain("spruce-test-secret");

      expect(providerPost).toHaveBeenCalledTimes(1);
      const [url, providerPayload, options] = providerPost.mock.calls[0] as [string, { destination: { smsOrEmailEndpoint: string }; message: { internal: boolean; body: Array<{ type: string; value: string }> } }, { headers: Record<string, string>; timeout: number; validateStatus: (status: number) => boolean }];
      expect(url).toBe("https://api.sprucehealth.com/v1/internalendpoints/internal-endpoint-test/conversations");
      expect(options).toMatchObject({
        headers: {
          Authorization: "Bearer spruce-test-secret",
          Accept: "application/json",
          "Content-Type": "application/json",
          "s-idempotency-key": `mmd-verify-${first.body.verification_id}`,
        },
        timeout: 15000,
      });
      expect(options.validateStatus(503)).toBe(true);
      expect(providerPayload.destination.smsOrEmailEndpoint).toBe("+14075550102");
      expect(providerPayload.message).toEqual({
        internal: false,
        body: [{
          type: "text",
          value: expect.stringMatching(/^Your MedMethod Direct verification code is \d{6}\. It expires in 10 minutes\. If you didn't request this, you can ignore this message\.$/),
        }],
      });
      expect(JSON.stringify(first.body)).not.toContain(providerPayload.message.body[0].value.match(/\d{6}/)?.[0] ?? "");
    } finally {
      await harness.close();
    }
  });

  it("keeps the per-phone cooldown after a failed live send without exposing provider details", async () => {
    const harness = await createHarness("live");
    const providerPost = vi.spyOn(axios, "post").mockRejectedValue(new Error("provider request body must never be exposed"));
    try {
      const failed = await requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "407-555-0106" });
      expect(failed).toEqual({
        status: 503,
        body: { error: "We couldn't send a text right now. Please check your number and try again." },
      });
      expect((await requestJson(harness.baseUrl, "/api/phone-verification/request", {
        phone: "+1 407 555 0106",
      })).status).toBe(429);
      expect(providerPost).toHaveBeenCalledTimes(1);
    } finally {
      await harness.close();
    }
  });

  it("cleans expired challenges and tokens before validating them", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const harness = await createHarness();
    try {
      const expiredRequest = await requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "407-555-0103" });
      now.mockReturnValue(1_600_001);
      expect((await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: expiredRequest.body.verification_id,
        code: expiredRequest.body.test_code,
      })).status).toBe(400);

      now.mockReturnValue(2_000_000);
      const requested = await requestJson(harness.baseUrl, "/api/phone-verification/request", { phone: "407-555-0104" });
      const confirmed = await requestJson(harness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: requested.body.verification_id,
        code: requested.body.test_code,
      });
      expect(harness.verification.validPhoneVerificationToken(confirmed.body.verification_token, "407-555-0104"))
        .not.toBeNull();
      now.mockReturnValue(3_800_001);
      expect(harness.verification.validPhoneVerificationToken(confirmed.body.verification_token, "407-555-0104"))
        .toBeNull();
    } finally {
      await harness.close();
    }
  });

  it("limits six sends and twelve confirmations per real request IP, ignoring arbitrary forwarded-for headers", async () => {
    const harness = await createHarness();
    try {
      for (let index = 0; index < 6; index += 1) {
        const response = await requestJson(harness.baseUrl, "/api/phone-verification/request", {
          phone: `407555${String(1000 + index).slice(-4)}`,
        }, { "X-Forwarded-For": `198.51.100.${index + 1}` });
        expect(response.status).toBe(201);
      }
      expect((await requestJson(harness.baseUrl, "/api/phone-verification/request", {
        phone: "4075551010",
      }, { "X-Forwarded-For": "203.0.113.5" })).status).toBe(429);
    } finally {
      await harness.close();
    }

    const confirmationHarness = await createHarness();
    try {
      const requested = await requestJson(confirmationHarness.baseUrl, "/api/phone-verification/request", { phone: "407-555-0105" });
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const response = await requestJson(confirmationHarness.baseUrl, "/api/phone-verification/confirm", {
          verification_id: requested.body.verification_id,
          code: "000000",
        }, { "X-Forwarded-For": `203.0.113.${attempt + 1}` });
        // The fifth bad value invalidates the challenge. Later calls still count
        // toward the per-IP confirmation limit but correctly see no challenge.
        expect(response.status).toBe(attempt < 5 ? 422 : 400);
      }
      expect((await requestJson(confirmationHarness.baseUrl, "/api/phone-verification/confirm", {
        verification_id: requested.body.verification_id,
        code: "000000",
      })).status).toBe(429);
    } finally {
      await confirmationHarness.close();
    }
  });
});
