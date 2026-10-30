import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import type { Request } from "express";
import type { IntakeDraft } from "./intakeSubmissionContract";
vi.mock("./_core/env", () => ({ ENV: { cookieSecret: "synthetic-only-test-key" } }));
import { validateIntakeSigning } from "./intakeSigningInput";
import { authorizedNormalIntakeTest, createIntakeTestAuthorization } from "./intakeTestAuthorization";

const now = Date.parse("2026-10-30T16:45:00.000Z");
const draft = { consents: { glp1_consent: true, glp1_declined: false }, answers: { w: { wConsent: true, wDecline: false } } } as unknown as IntakeDraft;
async function signing(blank = false) {
  const signature = await sharp({ create: { width: 300, height: 100, channels: 3, background: "white" } }).composite(blank ? [] : [{ input: Buffer.from('<svg width="300" height="100"><path d="M20 60 Q80 10 130 65 T270 35" stroke="#113a3a" stroke-width="3" fill="none"/></svg>') }]).png().toBuffer();
  return { version: "2026-10", signer_name: "SYNTHETIC TEST", relation: "", signed_at: new Date(now).toISOString(), document_checks: { glp1: true, general: true, telehealth: true, privacy: true, policy: true }, electronic_agreement: true, signature_png: `data:image/png;base64,${signature.toString("base64")}` };
}

describe("signed intake server input", () => {
  it("uses the exact five unchanged browser forms as the server PDF source", () => {
    const root = resolve(import.meta.dirname, "..");
    const browserSource = readFileSync(resolve(root, "client/public/intake/sign-forms-data.js"), "utf8");
    const browserForms = new Function("window", `${browserSource}; return window.MmdSignFormDocuments;`)({});
    expect(JSON.parse(readFileSync(resolve(root, "shared/intakeSignForms.json"), "utf8"))).toEqual(browserForms);
  });
  it("validates actual ink and produces small cropped dark-on-white PNG bytes", async () => {
    const result = await validateIntakeSigning(await signing(), draft, now);
    const image = await sharp(result.signaturePng).metadata();
    expect(image.format).toBe("png"); expect(image.width).toBeLessThan(300); expect(image.height).toBeLessThan(100);
    expect(result.signaturePng.length).toBeLessThan(20_000);
  });
  it("rejects a blank pad and missing signature", async () => {
    await expect(validateIntakeSigning(await signing(true), draft, now)).rejects.toThrow(/visible signature/i);
    await expect(validateIntakeSigning(undefined, draft, now)).rejects.toThrow(/all five/i);
  });
  it("requires all five exact checked document IDs and electronic agreement", async () => {
    for (const id of ["glp1", "general", "telehealth", "privacy", "policy"]) {
      const input = await signing(); (input.document_checks as Record<string, boolean>)[id] = false;
      await expect(validateIntakeSigning(input, draft, now)).rejects.toThrow(/all five/i);
    }
    await expect(validateIntakeSigning({ ...await signing(), electronic_agreement: false }, draft, now)).rejects.toThrow(/all five/i);
  });
  it("rejects false clinical GLP-1 consent, forged future/old dates, unexpected fields and non-PNG input", async () => {
    const input = await signing();
    await expect(validateIntakeSigning(input, { ...draft, consents: { ...draft.consents, glp1_consent: false } }, now)).rejects.toThrow(/GLP-1/i);
    for (const signed_at of [new Date(now + 6 * 60_000).toISOString(), new Date(now - 25 * 60 * 60_000).toISOString()]) await expect(validateIntakeSigning({ ...input, signed_at }, draft, now)).rejects.toThrow(/invalid date|expired/i);
    await expect(validateIntakeSigning({ ...input, url: "https://attacker.example/" }, draft, now)).rejects.toThrow(/all five/i);
    await expect(validateIntakeSigning({ ...input, signature_png: "data:image/svg+xml;base64,PHN2Zz4=" }, draft, now)).rejects.toThrow(/all five/i);
    await expect(validateIntakeSigning({ ...input, signer_name: "" }, draft, now)).rejects.toThrow(/all five/i);
  });
});

describe("normal synthetic submission authorization", () => {
  const id = "a4bf396d-b9a0-41d1-b54e-f0d0d34a219a";
  const req = (token: string) => ({ headers: { "x-mmd-intake-test": token } }) as unknown as Request;
  it("requires a server-signed, submission-bound unexpired token plus explicit test classification", () => {
    const token = createIntakeTestAuthorization(id, now);
    expect(authorizedNormalIntakeTest(req(token), id, true, now)).toBe(true);
    expect(authorizedNormalIntakeTest(req(token), id, false, now)).toBe(false);
    expect(authorizedNormalIntakeTest(req(token), "another-submission", true, now)).toBe(false);
    expect(authorizedNormalIntakeTest(req(token), id, true, now + 6 * 60_000)).toBe(false);
    expect(authorizedNormalIntakeTest(req(`${token}x`), id, true, now)).toBe(false);
    expect(authorizedNormalIntakeTest({ headers: {} } as Request, id, true, now)).toBe(false);
  });
});
