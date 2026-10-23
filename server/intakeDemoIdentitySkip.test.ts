import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

const intake = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");
const helperStart = intake.indexOf("function MmdDemoIdentityVerificationSkipped(");
const helperEnd = intake.indexOf("async function MmdPhoneVerificationApi", helperStart);
const validationStart = intake.indexOf("function se(");
const validationEnd = intake.indexOf("function ", validationStart + 12);
const identity = { type: "identity", required: true };
const contact = { first: "Synthetic", last: "Demo", dobYear: "1985", state: "Georgia", email: "synthetic@example.test", phone: "2025550101", terms: true, phoneVerificationSettings: { mode: "live", required: true, demo_available: false } };

function helpers(search: string) {
  return new Function("window", "URLSearchParams", "ie", "E", "ae", `${intake.slice(helperStart, helperEnd)};${intake.slice(validationStart, validationEnd)};return { MmdDemoIdentityVerificationSkipped, MmdPhoneVerificationSatisfied, MmdLivePhoneVerificationToken, se };`)(
    { location: { search } }, URLSearchParams,
    (a: Record<string, unknown>) => ({ value: a.dobYear ? "1985-01-15" : null }),
    (v: unknown) => typeof v === "string" && v.trim().length > 0,
    (v: unknown) => v === "Georgia" ? "GA" : null,
  );
}

describe("demo-only identity mobile verification skip", () => {
  it("allows the demo identity step under live required settings without claiming verification", () => {
    const h = helpers("?prefill=demo");
    expect(h.MmdDemoIdentityVerificationSkipped(true)).toBe(true);
    expect(h.se(identity, contact, true)).toBe(true);
    expect(h.MmdPhoneVerificationSatisfied(contact.phoneVerificationSettings, contact, true)).toBe(false);
    expect(h.MmdLivePhoneVerificationToken(contact)).toBeNull();
    expect(contact).not.toHaveProperty("phoneVerified");
    expect(contact).not.toHaveProperty("phoneVerificationToken");
  });

  it.each(["", "?prefill=Demo", "?prefill=true", "?demo=true", "?prefill=demo-other"])("keeps normal verification required for %s", search => {
    const h = helpers(search);
    expect(h.MmdDemoIdentityVerificationSkipped(true)).toBe(false);
    expect(h.se(identity, contact, true)).toBe(false);
    expect(h.se(identity, contact, false)).toBe(false);
  });

  it.each(["?prefill=demo&prefill=other", "?prefill=other&prefill=demo", "?prefill=demo&prefill=demo"])("rejects ambiguous duplicate parameters: %s", search => {
    const h = helpers(search);
    expect(h.MmdDemoIdentityVerificationSkipped(true)).toBe(false);
    expect(h.se(identity, contact, true)).toBe(false);
  });

  it("requires one exact demo parameter value and initialized demo flag, not unrelated URL parameters", () => {
    const h = helpers("?theme=dark&prefill=demo");
    expect(h.MmdDemoIdentityVerificationSkipped(true)).toBe(true);
    for (const value of [false, undefined, "true", 1]) expect(h.MmdDemoIdentityVerificationSkipped(value)).toBe(false);
    expect(h.se(identity, contact, false)).toBe(false);
  });

  it("still requires valid contact fields, phone digits and terms in demo", () => {
    const h = helpers("?prefill=demo");
    for (const key of ["first", "last", "dobYear", "state", "email", "phone", "terms"]) {
      expect(h.se(identity, { ...contact, [key]: key === "terms" ? false : "" }, true)).toBe(false);
    }
    expect(h.se(identity, { ...contact, email: "invalid" }, true)).toBe(false);
    expect(h.se(identity, { ...contact, phone: "202" }, true)).toBe(false);
  });

  it("preserves normal valid-token continuation and expiration enforcement", () => {
    const h = helpers("");
    const verified = { ...contact, phoneVerified: true, phoneVerificationToken: "SYNTHETIC-TEST-TOKEN", phoneVerificationExpiresAt: Date.now() + 60000 };
    expect(h.se(identity, verified, false)).toBe(true);
    expect(h.se(identity, { ...verified, phoneVerificationExpiresAt: Date.now() - 1 }, false)).toBe(false);
  });

  it("retains real attestation guards and uses explicit demo readiness for final submission", () => {
    const app = intake.slice(intake.lastIndexOf("function $e()"), intake.lastIndexOf("(0,u.createRoot)"));
    expect(app).not.toContain("MmdDemoIdentityVerificationSkipped");
    expect(app).toContain("if(!MmdIntakePhoneReady(answers,demo))");
    expect(intake).toContain("function MmdIntakeFinishReady(screen,answers,demoMode){return se(screen,answers,demoMode)&&answers.checkoutAck===true");
    expect(intake).toContain("phone_verification_token:MmdLivePhoneVerificationToken(answers)");
    expect(intake).toContain("Demo mode: mobile verification skipped on this step.");
    expect(intake).toContain("MmdGetPhoneVerificationSettings().then");
    expect(intake).toContain("MmdDemoIdentityVerificationSkipped(i)?");
    const script = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    expect(() => new Script(script!)).not.toThrow();
  });
});
