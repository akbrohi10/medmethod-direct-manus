import type { Request } from "express";
import { describe, expect, it } from "vitest";
import type { IntakePrivateBlobDb } from "./intakePrivateBlobDb";
import { DbIntakePrivateUploadPersistence, type IntakePrivateStoredMetadata } from "./intakePrivateUploadDb";
import { createIntakePrivateUploadService } from "./intakePrivateUploads";

const SECRET = "synthetic-private-upload-db-test-secret-is-long-enough";
const OWNER = Buffer.alloc(32, 7).toString("base64url");
const PDF = Buffer.from("%PDF-1.7\n% synthetic encrypted DB upload test\n%%EOF\n", "ascii");

type Entry = { bytes: Buffer; expiresAt: number };

function mockBlobDb(now: () => number) {
  const entries = new Map<string, Entry>();
  const calls = { cleanup: 0, locks: 0 };
  const store: IntakePrivateBlobDb = {
    async put(key, bytes, expiresAt) {
      entries.set(key, { bytes: Buffer.from(bytes), expiresAt });
    },
    async get(key) {
      const entry = entries.get(key);
      return entry && entry.expiresAt > now() ? Buffer.from(entry.bytes) : null;
    },
    async delete(key) {
      entries.delete(key);
    },
    async list(prefix) {
      return Array.from(entries.entries())
        .filter(([key, entry]) => key.startsWith(prefix) && entry.expiresAt > now())
        .map(([key]) => key)
        .sort();
    },
    async cleanup() {
      calls.cleanup += 1;
      let deleted = 0;
      for (const [key, entry] of entries) {
        if (entry.expiresAt <= now()) {
          entries.delete(key);
          deleted += 1;
        }
      }
      return { deleted };
    },
    async withLock(_name, work) {
      calls.locks += 1;
      return work();
    },
  };
  return { store, entries, calls };
}

function requestFor(owner: string): Request {
  return {
    protocol: "http",
    headers: {
      host: "127.0.0.1:3000",
      cookie: `mmd_intake_upload_owner_v1=${owner}`,
    },
  } as Request;
}

describe("DB intake private upload persistence", () => {
  it("stores record data, metadata, and capability lookup only beneath HMAC opaque keys", async () => {
    let now = 1_800_000_000_000;
    const fake = mockBlobDb(() => now);
    const persistence = new DbIntakePrivateUploadPersistence({ secret: SECRET, now: () => now, blobDb: fake.store });
    const id = Buffer.alloc(32, 1).toString("base64url");
    const token = Buffer.alloc(32, 2).toString("base64url");
    const record: IntakePrivateStoredMetadata = {
      version: 1,
      id,
      owner_hash: "a".repeat(64),
      download_token: token,
      download_token_hash: "b".repeat(64),
      kind: "lab",
      file_name: "private-results.pdf",
      mime_type: "application/pdf",
      byte_length: PDF.length,
      created_at: now,
      expires_at: now + (24 * 60 * 60 * 1000),
    };

    await persistence.write(record, PDF);

    expect(Array.from(fake.entries.keys())).toHaveLength(3);
    for (const key of fake.entries.keys()) {
      expect(key).toMatch(/^mmd-intake-private-upload:v2:(data|metadata|capability):[A-Za-z0-9_-]{43}$/);
      expect(key).not.toContain(id);
      expect(key).not.toContain(token);
      expect(key).not.toContain(record.file_name);
    }
    expect(await persistence.readBytes(id)).toEqual(PDF);
    expect(await persistence.findByCapability(token)).toMatchObject({ id, file_name: record.file_name });
    expect(await persistence.listMetadata()).toHaveLength(1);

    now = record.expires_at + 1;
    expect(await persistence.readBytes(id)).toBeNull();
    expect(await persistence.cleanup()).toEqual({ deleted: 3 });
  });

  it("uses the DB adapter by default, preserves the public upload contract, and does not create filesystem state", async () => {
    let now = 1_800_000_000_000;
    const fake = mockBlobDb(() => now);
    const persistence = new DbIntakePrivateUploadPersistence({ secret: SECRET, now: () => now, blobDb: fake.store });
    const service = createIntakePrivateUploadService({ secret: SECRET, now: () => now, persistence, isProduction: false });

    const created = await service.upload({
      ownerToken: OWNER,
      ip: "127.0.0.1",
      kind: "lab",
      fileName: "results.pdf",
      bytes: PDF,
    });
    expect(created).toMatchObject({ file_name: "results.pdf", mime_type: "application/pdf" });
    expect(fake.entries.size).toBe(3);
    expect(fake.calls.locks).toBeGreaterThanOrEqual(2);

    const resolved = await service.resolve(requestFor(OWNER), { lab_results: [created.upload_id], scale_photo: null }, true);
    const token = new URL(resolved.lab_results[0].url).pathname.split("/").at(-1)!;
    expect(await service.download(token)).toMatchObject({ bytes: PDF, fileName: "results.pdf", mimeType: "application/pdf" });
    expect(await service.download(`${token.slice(0, -1)}${token.at(-1) === "A" ? "B" : "A"}`)).toBeNull();

    now += (24 * 60 * 60 * 1000) + 1;
    expect(await service.download(token)).toBeNull();
    expect(await service.cleanup()).toEqual({ deleted: 3 });
    expect(fake.calls.cleanup).toBe(1);
  });
});
