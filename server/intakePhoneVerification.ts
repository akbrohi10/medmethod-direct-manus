import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import axios from "axios";
import { ENV } from "./_core/env";

type PhoneVerificationMode = "live" | "sandbox";

type Challenge = {
  verificationId: string;
  phone: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  mode: PhoneVerificationMode;
};

type VerificationToken = {
  phone: string;
  verifiedAt: string;
  expiresAt: number;
  createdAt: number;
  mode: PhoneVerificationMode;
};

const CHALLENGE_TTL_MS = 10 * 60 * 1_000;
const TOKEN_TTL_MS = 30 * 60 * 1_000;
const PHONE_COOLDOWN_MS = 60 * 1_000;
const RATE_WINDOW_MS = 15 * 60 * 1_000;
const MAX_REQUESTS_PER_IP = 6;
const MAX_CONFIRMS_PER_IP = 12;
const MAX_RECORDS = 2_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// This intentionally remains process-local. Verification state is short-lived and is
// never persisted in the database or sent to analytics/admin systems.
const challenges = new Map<string, Challenge>();
const verificationTokens = new Map<string, VerificationToken>();
const phoneCooldowns = new Map<string, number>();
const requestRates = new Map<string, number[]>();
const confirmRates = new Map<string, number[]>();

/**
 * Converts a formatted US ten-digit number to E.164 and accepts other 11–15
 * digit international numbers. It returns null instead of guessing invalid input.
 */
export function normalizedPhone(phone: unknown): string | null {
  if (typeof phone !== "string") return null;
  const value = phone.trim();
  if (!value || value.length > 64 || !/^[\d\s().+-]+$/.test(value)) return null;

  // Strip only ordinary formatting, then ensure a plus (if supplied) was leading.
  const compact = value.replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;

  const digits = compact.replace(/^\+/, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  return null;
}

/** Stores only a one-way hash; the raw six-digit code is never retained. */
export function verificationCodeHash(verificationId: string, code: string): string {
  return createHash("sha256").update(`${verificationId}:${code}`, "utf8").digest("hex");
}

function currentMode(): PhoneVerificationMode {
  // Sandbox must be explicitly selected. A malformed production setting should
  // fail closed to live (and therefore fail safely if Spruce credentials are absent).
  return ENV.phoneVerificationMode === "sandbox" ? "sandbox" : "live";
}

/** Public, browser-safe configuration only; credentials and codes are never included. */
export function getPhoneVerificationSettings(): {
  mode: PhoneVerificationMode;
  required: boolean;
  demo_available: boolean;
} {
  const mode = currentMode();
  return {
    mode,
    required: ENV.phoneVerificationRequired !== false,
    // A sandbox verifier exposes test_code and is therefore the only mode that
    // should advertise a demo/test path.
    demo_available: mode === "sandbox",
  };
}

function safeEquals(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function rateAttemptsInWindow(attempts: number[] | undefined, now: number): number[] {
  return (attempts ?? []).filter(timestamp => now - timestamp < RATE_WINDOW_MS);
}

function trimRateMap(map: Map<string, number[]>) {
  if (map.size <= MAX_RECORDS) return;
  const oldestFirst = Array.from(map.entries())
    .sort(([, left], [, right]) => (left[left.length - 1] ?? 0) - (right[right.length - 1] ?? 0));
  for (const [key] of oldestFirst.slice(0, map.size - MAX_RECORDS)) map.delete(key);
}

function trimCooldownMap() {
  if (phoneCooldowns.size <= MAX_RECORDS) return;
  const soonestFirst = Array.from(phoneCooldowns.entries()).sort(([, left], [, right]) => left - right);
  for (const [phone] of soonestFirst.slice(0, phoneCooldowns.size - MAX_RECORDS)) phoneCooldowns.delete(phone);
}

function cleanVerificationRecords(now = Date.now()) {
  for (const [id, challenge] of Array.from(challenges.entries())) {
    if (challenge.expiresAt <= now) challenges.delete(id);
  }
  for (const [token, verification] of Array.from(verificationTokens.entries())) {
    if (verification.expiresAt <= now) verificationTokens.delete(token);
  }
  for (const [phone, nextAllowedAt] of Array.from(phoneCooldowns.entries())) {
    if (nextAllowedAt <= now) phoneCooldowns.delete(phone);
  }
  for (const [ip, attempts] of Array.from(requestRates.entries())) {
    const current = rateAttemptsInWindow(attempts, now);
    if (current.length) requestRates.set(ip, current);
    else requestRates.delete(ip);
  }
  for (const [ip, attempts] of Array.from(confirmRates.entries())) {
    const current = rateAttemptsInWindow(attempts, now);
    if (current.length) confirmRates.set(ip, current);
    else confirmRates.delete(ip);
  }
}

function trimStoredRecords() {
  const records = [
    ...Array.from(challenges.values()).map(challenge => ({ kind: "challenge" as const, key: challenge.verificationId, createdAt: challenge.createdAt })),
    ...Array.from(verificationTokens.entries()).map(([token, verification]) => ({ kind: "token" as const, key: token, createdAt: verification.createdAt })),
  ].sort((left, right) => left.createdAt - right.createdAt);

  const excess = records.length - MAX_RECORDS;
  if (excess <= 0) return;
  for (const record of records.slice(0, excess)) {
    if (record.kind === "challenge") challenges.delete(record.key);
    else verificationTokens.delete(record.key);
  }
}

function consumeIpRateLimit(map: Map<string, number[]>, ip: string, limit: number, now: number): boolean {
  const attempts = rateAttemptsInWindow(map.get(ip), now);
  if (attempts.length >= limit) {
    map.set(ip, attempts);
    return false;
  }
  attempts.push(now);
  map.set(ip, attempts);
  trimRateMap(map);
  return true;
}

function clientIp(req: Request): string {
  // Deliberately use Express's req.ip. Whether a proxy is trusted is an app-level
  // deployment decision; this route never reads an arbitrary X-Forwarded-For header.
  return req.ip || "unknown";
}

function noStore(res: Response) {
  res.setHeader("Cache-Control", "no-store");
}

function requestError(res: Response, status: number, error: string, extra: Record<string, unknown> = {}) {
  noStore(res);
  return res.status(status).json({ error, ...extra });
}

async function sendSpruceVerificationCode({
  verificationId,
  phone,
  code,
}: {
  verificationId: string;
  phone: string;
  code: string;
}): Promise<boolean> {
  const token = ENV.spruceApiToken.trim();
  const endpointId = ENV.spruceInternalEndpointId.trim();
  if (!token || !endpointId) {
    console.warn("[Phone verification] Spruce send unavailable", { verificationId, reason: "not_configured" });
    return false;
  }

  try {
    const response = await axios.post(
      `https://api.sprucehealth.com/v1/internalendpoints/${encodeURIComponent(endpointId)}/conversations`,
      {
        destination: { smsOrEmailEndpoint: phone },
        message: {
          internal: false,
          body: [{
            type: "text",
            value: `Your MedMethod Direct verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this message.`,
          }],
        },
      },
      {
        // Axios honors the environment's HTTPS proxy configuration used by the
        // deployed runtime. Do not override it with a direct-connect transport.
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "s-idempotency-key": `mmd-verify-${verificationId}`,
        },
        timeout: 15_000,
        validateStatus: () => true,
      },
    );

    const requestId = response.headers["x-request-id"] ?? response.headers["s-request-id"] ?? undefined;
    if (response.status < 200 || response.status >= 300) {
      console.warn("[Phone verification] Spruce send rejected", { verificationId, status: response.status, requestId });
      return false;
    }
    console.info("[Phone verification] Spruce send accepted", { verificationId, status: response.status, requestId });
    return true;
  } catch {
    // Do not log provider/network error objects: they can contain request data.
    console.warn("[Phone verification] Spruce send failed", { verificationId, reason: "network_error" });
    return false;
  }
}

async function handlePhoneVerificationRequest(req: Request, res: Response) {
  const now = Date.now();
  cleanVerificationRecords(now);

  if (!consumeIpRateLimit(requestRates, clientIp(req), MAX_REQUESTS_PER_IP, now)) {
    return requestError(res, 429, "Too many code requests. Please wait and try again.");
  }

  const phone = normalizedPhone(req.body?.phone);
  if (!phone) return requestError(res, 400, "Please enter a valid phone number.");

  const nextAllowedAt = phoneCooldowns.get(phone);
  if (nextAllowedAt && nextAllowedAt > now) {
    return requestError(res, 429, "Please wait before requesting another code.", {
      retry_after_seconds: Math.ceil((nextAllowedAt - now) / 1_000),
    });
  }

  // Reserve the phone before any provider await. This makes a simultaneous resend
  // observe the same cooldown, and intentionally remains in place if sending fails.
  phoneCooldowns.set(phone, now + PHONE_COOLDOWN_MS);
  trimCooldownMap();

  const verificationId = randomUUID();
  const code = randomInt(100_000, 1_000_000).toString();
  const mode = currentMode();
  const challenge: Challenge = {
    verificationId,
    phone,
    codeHash: verificationCodeHash(verificationId, code),
    expiresAt: now + CHALLENGE_TTL_MS,
    attempts: 0,
    createdAt: now,
    mode,
  };

  if (mode === "live") {
    const sent = await sendSpruceVerificationCode({ verificationId, phone, code });
    if (!sent) {
      return requestError(res, 503, "We couldn't send a text right now. Please check your number and try again.");
    }
  }

  // Retain a previously delivered challenge if a live resend fails. A successful
  // request replaces it only after the provider accepts the new send request.
  challenges.set(verificationId, challenge);
  for (const [existingId, existing] of Array.from(challenges.entries())) {
    if (existingId !== verificationId && existing.phone === phone) challenges.delete(existingId);
  }
  trimStoredRecords();

  noStore(res);
  return res.status(201).json({
    verification_id: verificationId,
    expires_in_seconds: CHALLENGE_TTL_MS / 1_000,
    mode,
    ...(mode === "sandbox" ? { test_code: code } : {}),
  });
}

function handlePhoneVerificationConfirm(req: Request, res: Response) {
  const now = Date.now();
  cleanVerificationRecords(now);

  if (!consumeIpRateLimit(confirmRates, clientIp(req), MAX_CONFIRMS_PER_IP, now)) {
    return requestError(res, 429, "Too many verification attempts. Please wait and try again.");
  }

  const verificationId = req.body?.verification_id;
  const code = req.body?.code;
  if (typeof verificationId !== "string" || !UUID_PATTERN.test(verificationId) || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return requestError(res, 400, "Please enter the six-digit verification code.");
  }

  const challenge = challenges.get(verificationId);
  if (!challenge || challenge.expiresAt <= now) {
    if (challenge) challenges.delete(verificationId);
    return requestError(res, 400, "That verification code has expired. Please request a new one.");
  }

  const receivedHash = verificationCodeHash(verificationId, code);
  if (!safeEquals(challenge.codeHash, receivedHash)) {
    challenge.attempts += 1;
    if (challenge.attempts >= 5) challenges.delete(verificationId);
    return requestError(res, 422, "That verification code is not valid.");
  }

  // A challenge is one-use regardless of how many verification tokens are valid.
  challenges.delete(verificationId);
  const token = randomUUID();
  const verifiedAt = new Date(now).toISOString();
  verificationTokens.set(token, {
    phone: challenge.phone,
    verifiedAt,
    expiresAt: now + TOKEN_TTL_MS,
    createdAt: now,
    mode: challenge.mode,
  });
  trimStoredRecords();

  noStore(res);
  return res.json({
    verified: true,
    verification_token: token,
    verified_at: verifiedAt,
    expires_in_seconds: TOKEN_TTL_MS / 1_000,
    mode: challenge.mode,
  });
}

/**
 * Checks an opaque, server-side token against the supplied intake phone. Callers
 * must additionally compare result.mode with their active payment/intake mode so
 * a sandbox verification cannot satisfy a live submission after a mode change.
 */
export function validPhoneVerificationToken(
  token: unknown,
  phone: unknown,
): { verifiedAt: string; mode: PhoneVerificationMode } | null {
  cleanVerificationRecords();
  if (typeof token !== "string" || !UUID_PATTERN.test(token)) return null;

  const verification = verificationTokens.get(token);
  const normalized = normalizedPhone(phone);
  if (!verification || !normalized || verification.expiresAt <= Date.now() || !safeEquals(verification.phone, normalized)) {
    return null;
  }
  return { verifiedAt: verification.verifiedAt, mode: verification.mode };
}

export function registerIntakePhoneVerificationRoutes(app: Express) {
  app.post("/api/phone-verification/request", handlePhoneVerificationRequest);
  // An explicit resend endpoint is supported, while /request remains the canonical
  // resend path and shares the same cooldown/rate-limit behavior.
  app.post("/api/phone-verification/resend", handlePhoneVerificationRequest);
  app.post("/api/phone-verification/confirm", handlePhoneVerificationConfirm);
  app.get("/api/phone-verification/settings", (_req: Request, res: Response) => {
    noStore(res);
    return res.json(getPhoneVerificationSettings());
  });
}
