import { describe, expect, it } from "vitest";
import type { Request } from "express";
import {
  createIntakeSignedFormsDatabaseStore,
} from "./intakeSignedFormsDatabaseStore";
import {
  type IntakeSignedFormInput,
} from "./intakeSignedFormsStore";
import { IntakePrivateBlobDbError, type IntakePrivateBlobDb } from "./intakePrivateBlobDb";

const SECRET = "database-signed-form-test-secret-longer-than-sixteen";
const SUBMISSION_ID = "2ae23242-345c-4f63-b017-456789abcd12";
const FINGERPRINT = "1d0a1a2cb3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6";
const TTL_MS = 24 * 60 * 60 * 1000;

const formRows = [
  ["glp1", "GLP-1 Weight Care Consent", "glp1-consent.pdf"],
  ["general", "General Consent to Treatment", "general-consent.pdf"],
  ["telehealth", "Telehealth Consent", "telehealth-consent.pdf"],
  ["privacy", "Privacy Notice Acknowledgement", "privacy-notice.pdf"],
  ["policy", "Medication Policy", "medication-policy.pdf"],
] as const;

function pdfs(): IntakeSignedFormInput[] {
  return formRows.map(([form, title, file_name]) => ({
    form,
    title,
    file_name,
    bytes: Buffer.from(`%PDF-1.7\n% signed ${form}\n%%EOF\n`, "ascii"),
  }));
}

class MemoryBlobDb implements IntakePrivateBlobDb {
  readonly records = new Map<string, { bytes: Buffer; expiresAt: number }>();
  private locks = new Map<string, Promise<void>>();
  constructor(private readonly now: () => number) {}

  async put(key: string, bytes: Buffer, expiresAt: number): Promise<void> {
    this.records.set(key, { bytes: Buffer.from(bytes), expiresAt });
  }
  async get(key: string): Promise<Buffer | null> {
    const record = this.records.get(key);
    if (!record || record.expiresAt <= this.now()) return null;
    return Buffer.from(record.bytes);
  }
  async delete(key: string): Promise<void> { this.records.delete(key); }
  async list(prefix: string): Promise<string[]> {
    return [...this.records.entries()]
      .filter(([key, record]) => key.startsWith(prefix) && record.expiresAt > this.now())
      .map(([key]) => key)
      .sort();
  }
  async cleanup(): Promise<{ deleted: number }> {
    let deleted = 0;
    for (const [key, record] of this.records) if (record.expiresAt <= this.now()) { this.records.delete(key); deleted += 1; }
    return { deleted };
  }
  async withLock<T>(name: string, work: () => Promise<T> | T): Promise<T> {
    while (this.locks.has(name)) await this.locks.get(name);
    let release!: () => void;
    const done = new Promise<void>(resolve => { release = resolve; });
    this.locks.set(name, done);
    try { return await work(); } finally { this.locks.delete(name); release(); }
  }
}

function request(): Request {
  return { protocol: "https", headers: { host: "www.medmethoddirect.com" } } as Request;
}

describe("database intake signed-form store", () => {
  it("stores opaque derived keys, returns stable manifests, and preserves a cross-instance durable claim", async () => {
    let now = 1_800_000_000_000;
    const blobDb = new MemoryBlobDb(() => now);
    const first = createIntakeSignedFormsDatabaseStore({ secret: SECRET, blobDb, now: () => now });
    const prepared = await first.prepare(request(), SUBMISSION_ID, FINGERPRINT, pdfs(), {
      signed_at: "2026-10-30T16:00:00.000Z", signer_name: "Synthetic Signer", relation: "self",
    });
    expect(prepared.signed_forms).toHaveLength(5);
    expect(prepared.signed_forms.map(form => form.url)).toEqual([
      prepared.glp1_consent_url, prepared.general_consent_url, prepared.telehealth_consent_url,
      prepared.privacy_notice_ack_url, prepared.medication_policy_url,
    ]);
    expect([...blobDb.records.keys()].every(key => key.startsWith("mmd/intake-signed-forms/v2/") && !key.includes(SUBMISSION_ID))).toBe(true);

    const restarted = createIntakeSignedFormsDatabaseStore({ secret: SECRET, blobDb, now: () => now });
    await expect(restarted.prepare(request(), SUBMISSION_ID, FINGERPRINT, pdfs(), {
      signed_at: "changed-on-retry", signer_name: "Changed", relation: "self",
    })).resolves.toEqual(prepared);
    await expect(restarted.prepare(request(), SUBMISSION_ID, "e".repeat(64), pdfs(), {
      signed_at: "changed-on-retry", signer_name: "Changed", relation: "self",
    })).rejects.toMatchObject({ status: 409 });

    await first.markAttempted(SUBMISSION_ID);
    await expect(restarted.markAttempted(SUBMISSION_ID)).rejects.toMatchObject({ status: 409 });
    await restarted.markDelivered(SUBMISSION_ID, {
      submission_id: SUBMISSION_ID,
      accepted: true,
      patient_name: "must never persist as receipt",
      signature: "must never persist as receipt",
    });
    const delivered = await first.readSubmission(SUBMISSION_ID);
    expect(delivered).toMatchObject({ state: "delivered", result: { completed: true, submission_id: SUBMISSION_ID, accepted: true } });
    expect(delivered?.result).not.toHaveProperty("patient_name");
    expect(delivered?.result).not.toHaveProperty("signature");
  });

  it("fails closed at exact absolute expiry and lets cleanup remove every encrypted ledger object", async () => {
    let now = 1_800_000_000_000;
    const blobDb = new MemoryBlobDb(() => now);
    const store = createIntakeSignedFormsDatabaseStore({ secret: SECRET, blobDb, now: () => now });
    const prepared = await store.prepare(request(), SUBMISSION_ID, FINGERPRINT, pdfs(), {
      signed_at: "2026-10-30T16:00:00.000Z", signer_name: "Synthetic Signer", relation: "self",
    });
    expect(await store.readSubmission(SUBMISSION_ID)).toMatchObject({ forms: prepared });
    expect(blobDb.records.size).toBe(11); // 5 PDFs + 5 bearer indexes + encrypted ledger.

    now += TTL_MS;
    expect(await store.readSubmission(SUBMISSION_ID)).toBeNull();
    await store.cleanup();
    expect(blobDb.records).toHaveLength(0);
  });

  it("maps only a real shared-store busy lease to a delivery conflict", async () => {
    const busyStore: IntakePrivateBlobDb = {
      async put() {}, async get() { return null; }, async delete() {}, async list() { return []; }, async cleanup() { return { deleted: 0 }; },
      async withLock() { throw new IntakePrivateBlobDbError("busy"); },
    };
    const store = createIntakeSignedFormsDatabaseStore({ secret: SECRET, blobDb: busyStore });
    await expect(store.markAttempted(SUBMISSION_ID)).rejects.toMatchObject({ status: 409 });
  });
});
