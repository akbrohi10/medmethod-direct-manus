import { promises as fs } from "node:fs";
import { request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import express, { type Request } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntakeSignedFormsStoreError, createIntakeSignedFormsStore } from "./intakeSignedFormsStore";

type RawResponse = { status: number; headers: Record<string, string | string[] | undefined>; body: Buffer };
type Harness = {
  baseUrl: string;
  directory: string;
  service: ReturnType<typeof createIntakeSignedFormsStore>;
  request: Request;
  close: () => Promise<void>;
};

const PRIVATE_SECRET = "synthetic-signed-forms-test-secret-which-is-long-enough";
const TTL_MS = 24 * 60 * 60 * 1000;
const submissionId = "2ae23242-345c-4f63-b017-456789abcd12";
const fingerprint = "1d0a1a2cb3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6";
const forms = [
  ["glp1", "GLP-1 Weight Care Consent", "glp1-consent.pdf"],
  ["general", "General Consent to Treatment", "general-consent.pdf"],
  ["telehealth", "Telehealth Consent", "telehealth-consent.pdf"],
  ["privacy", "Privacy Notice Acknowledgement", "privacy-notice.pdf"],
  ["policy", "Medication Policy", "medication-policy.pdf"],
] as const;

function syntheticPdf(form: string): Buffer {
  return Buffer.from(`%PDF-1.7\n% synthetic ${form} signed document\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n`, "ascii");
}

function signedPdfs() {
  return forms.map(([form, title, file_name]) => ({ form, title, file_name, bytes: syntheticPdf(form) }));
}

function signedMetadata() {
  return { signed_at: "2026-10-30T16:00:00.000Z", signer_name: "Synthetic Signer", relation: "self" };
}

async function rawRequest(baseUrl: string, requestPath: string): Promise<RawResponse> {
  const url = new URL(requestPath, baseUrl);
  return new Promise((resolve, reject) => {
    const request = httpRequest(url, response => {
      const chunks: Buffer[] = [];
      response.on("data", chunk => chunks.push(Buffer.from(chunk)));
      response.on("end", () => resolve({ status: response.statusCode ?? 0, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    request.once("error", reject);
    request.end();
  });
}

async function createHarness(now: () => number = () => Date.now()): Promise<Harness> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mmd-signed-forms-test-"));
  const service = createIntakeSignedFormsStore({ secret: PRIVATE_SECRET, tempDir: directory, now });
  const app = express();
  service.register(app);
  const server = await new Promise<ReturnType<typeof app.listen>>((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;
  return {
    baseUrl,
    directory,
    service,
    request: { protocol: "http", headers: { host: `127.0.0.1:${port}` } } as Request,
    close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  };
}

async function destroyHarness(harness: Harness): Promise<void> {
  await harness.close();
  await fs.rm(harness.directory, { recursive: true, force: true });
}

describe("encrypted intake signed-form store", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects relative private-storage directories before creating files", () => {
    expect(() => createIntakeSignedFormsStore({ secret: PRIVATE_SECRET, tempDir: "relative-private-files" })).toThrow(/must be absolute/i);
  });

  it("prepares exactly five encrypted PDFs, returns canonical stable URLs, and redacts storage filenames", async () => {
    const harness = await createHarness();
    try {
      const prepared = await harness.service.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      expect(prepared).toMatchObject({
        glp1_consent_url: expect.stringMatching(/\/api\/intake\/signed-forms\/[A-Za-z0-9_-]{43}$/),
        general_consent_url: expect.stringMatching(/\/api\/intake\/signed-forms\/[A-Za-z0-9_-]{43}$/),
        telehealth_consent_url: expect.stringMatching(/\/api\/intake\/signed-forms\/[A-Za-z0-9_-]{43}$/),
        privacy_notice_ack_url: expect.stringMatching(/\/api\/intake\/signed-forms\/[A-Za-z0-9_-]{43}$/),
        medication_policy_url: expect.stringMatching(/\/api\/intake\/signed-forms\/[A-Za-z0-9_-]{43}$/),
      });
      expect(prepared.signed_forms.map(form => form.form)).toEqual(forms.map(([form]) => form));
      expect(prepared.signed_forms.map(form => form.url)).toEqual([
        prepared.glp1_consent_url, prepared.general_consent_url, prepared.telehealth_consent_url,
        prepared.privacy_notice_ack_url, prepared.medication_policy_url,
      ]);
      expect(prepared.signed_forms.every(form => !form.url.includes("Synthetic%20Signer") && !form.url.includes(submissionId))).toBe(true);

      const names = await fs.readdir(harness.directory);
      expect(names.sort()).toHaveLength(6);
      expect(names.filter(name => name.endsWith(".meta"))).toHaveLength(1);
      expect(names.filter(name => name.endsWith(".bin"))).toHaveLength(5);
      for (const name of names) {
        expect(name).toMatch(/^[a-f0-9]{64}\.(?:bin|meta)$/);
        const stored = await fs.readFile(path.join(harness.directory, name));
        expect(stored.toString("utf8")).not.toContain("Synthetic Signer");
        expect(stored.toString("utf8")).not.toContain("glp1-consent.pdf");
        expect(stored.includes(syntheticPdf("glp1"))).toBe(false);
        expect((await fs.stat(path.join(harness.directory, name))).mode & 0o777).toBe(0o600);
      }
      expect((await fs.stat(harness.directory)).mode & 0o777).toBe(0o700);

      const saved = await harness.service.readSubmission(submissionId);
      expect(saved).toMatchObject({ fingerprint, state: "prepared" });
      expect(saved?.forms).toEqual(prepared);
      expect(saved?.forms.signed_forms).toHaveLength(5);
    } finally {
      await destroyHarness(harness);
    }
  });

  it("serves attachment-only PDFs with private/noindex/no-referrer headers and gives no token oracle", async () => {
    const harness = await createHarness();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const prepared = await harness.service.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      const downloaded = await rawRequest(harness.baseUrl, new URL(prepared.general_consent_url).pathname);
      expect(downloaded.status).toBe(200);
      expect(downloaded.body).toEqual(syntheticPdf("general"));
      expect(String(downloaded.headers["content-type"])).toContain("application/pdf");
      expect(String(downloaded.headers["content-disposition"])).toMatch(/^attachment;/i);
      expect(String(downloaded.headers["content-disposition"])).toContain("general-consent.pdf");
      expect(String(downloaded.headers["cache-control"])).toContain("no-store");
      expect(downloaded.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
      expect(downloaded.headers["x-content-type-options"]).toBe("nosniff");
      expect(downloaded.headers["referrer-policy"]).toBe("no-referrer");

      const token = new URL(prepared.general_consent_url).pathname.split("/").at(-1)!;
      const guessed = `${token.slice(0, -1)}${token.at(-1) === "A" ? "B" : "A"}`;
      const denied = await rawRequest(harness.baseUrl, `/api/intake/signed-forms/${guessed}`);
      expect(denied.status).toBe(404);
      expect(String(denied.headers["cache-control"])).toContain("no-store");
      expect(denied.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
      expect(consoleSpy).not.toHaveBeenCalled();
    } finally {
      await destroyHarness(harness);
    }
  });

  it("returns exactly the same manifest for a matching duplicate after restart and rejects a fingerprint mismatch", async () => {
    const harness = await createHarness();
    try {
      const first = await harness.service.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      const restarted = createIntakeSignedFormsStore({ secret: PRIVATE_SECRET, tempDir: harness.directory, now: () => Date.now() });
      const duplicate = await restarted.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      expect(duplicate).toEqual(first);
      await expect(restarted.prepare(harness.request, submissionId, "e".repeat(64), signedPdfs(), signedMetadata()))
        .rejects.toMatchObject({ status: 409 });
      expect((await fs.readdir(harness.directory)).filter(name => name.endsWith(".bin"))).toHaveLength(5);
    } finally {
      await destroyHarness(harness);
    }
  });

  it("persists a one-way attempted claim across another store instance and keeps only an allowlisted recovery receipt", async () => {
    const harness = await createHarness();
    try {
      await harness.service.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      await harness.service.markAttempted(submissionId);
      const restarted = createIntakeSignedFormsStore({ secret: PRIVATE_SECRET, tempDir: harness.directory });
      await expect(restarted.markAttempted(submissionId)).rejects.toMatchObject({ status: 409 });
      expect((await restarted.readSubmission(submissionId))?.state).toBe("attempted");

      await restarted.markDelivered(submissionId, {
        submission_id: submissionId, submission_token: "synthetic-recovery-token", sms_opt_in: true,
        video_visit_interest: false, is_test: true, payment_status: "NOT_REQUIRED", redirect_url: "/intake/thank-you/",
        patient_name: "must not persist", raw_signature: "must not persist",
      });
      const delivered = await restarted.readSubmission(submissionId);
      expect(delivered?.state).toBe("delivered");
      expect(delivered?.result).toMatchObject({ completed: true, submission_id: submissionId, payment_status: "NOT_REQUIRED" });
      expect(delivered?.result).not.toHaveProperty("patient_name");
      expect(delivered?.result).not.toHaveProperty("raw_signature");
      await expect(restarted.markAttempted(submissionId)).rejects.toMatchObject({ status: 409 });
    } finally {
      await destroyHarness(harness);
    }
  });

  it("fails closed at exact absolute expiry and physically deletes PDFs and the ledger after restart", async () => {
    let now = 1_800_000_000_000;
    const clock = () => now;
    const harness = await createHarness(clock);
    try {
      const prepared = await harness.service.prepare(harness.request, submissionId, fingerprint, signedPdfs(), signedMetadata());
      const fresh = createIntakeSignedFormsStore({ secret: PRIVATE_SECRET, tempDir: harness.directory, now: clock });
      expect((await fresh.readSubmission(submissionId))?.forms).toEqual(prepared);

      now += TTL_MS;
      const expired = await rawRequest(harness.baseUrl, new URL(prepared.medication_policy_url).pathname);
      expect(expired.status).toBe(404);
      expect(String(expired.headers["cache-control"])).toContain("no-store");
      expect(await fresh.readSubmission(submissionId)).toBeNull();
      expect(await fs.readdir(harness.directory)).toEqual([]);
    } finally {
      await destroyHarness(harness);
    }
  });

  it("rejects a non-PDF, noncanonical forms, and PDFs at the strict 2 MiB boundary without creating files", async () => {
    const harness = await createHarness();
    try {
      const invalidMagic = signedPdfs();
      invalidMagic[0] = { ...invalidMagic[0], bytes: Buffer.from("not-a-pdf") };
      await expect(harness.service.prepare(harness.request, submissionId, fingerprint, invalidMagic, signedMetadata())).rejects.toMatchObject({ status: 400 });

      const missingCanonical = signedPdfs();
      missingCanonical[4] = { ...missingCanonical[4], form: "other" };
      await expect(harness.service.prepare(harness.request, submissionId, fingerprint, missingCanonical, signedMetadata())).rejects.toMatchObject({ status: 400 });

      const atLimit = signedPdfs();
      atLimit[0] = { ...atLimit[0], bytes: Buffer.concat([Buffer.from("%PDF-"), Buffer.alloc((2 * 1024 * 1024) - 5)]) };
      await expect(harness.service.prepare(harness.request, submissionId, fingerprint, atLimit, signedMetadata())).rejects.toMatchObject({ status: 400 });
      expect(await fs.readdir(harness.directory)).toEqual([]);
    } finally {
      await destroyHarness(harness);
    }
  });
});
