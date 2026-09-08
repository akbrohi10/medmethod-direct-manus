import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { decryptEmailCredential, encryptEmailCredential, maskEmailCredential } from "./emailCredentialCrypto";

describe("email credential encryption", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-long-enough-for-key-derivation";
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("encrypts the Resend API key with randomized authenticated encryption", () => {
    const apiKey = "re_test_1234567890abcdef";
    const first = encryptEmailCredential(apiKey);
    const second = encryptEmailCredential(apiKey);

    expect(first).not.toContain(apiKey);
    expect(second).not.toContain(apiKey);
    expect(first).not.toBe(second);
    expect(decryptEmailCredential(first)).toBe(apiKey);
    expect(decryptEmailCredential(second)).toBe(apiKey);
  });

  it("masks saved keys without exposing the full credential", () => {
    const masked = maskEmailCredential("re_test_1234567890abcdef");
    expect(masked).toBe("re_t...cdef");
    expect(masked).not.toContain("1234567890");
  });
});
