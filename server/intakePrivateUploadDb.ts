import { createHash, createHmac } from "node:crypto";
import { createIntakePrivateBlobDb, type IntakePrivateBlobDb } from "./intakePrivateBlobDb";

/**
 * The shared blob store encrypts every value before it reaches the database. This adapter adds
 * intake-specific opaque keys and an encrypted capability index; it never writes filenames,
 * ownership hashes, tokens, MIME types, or file bytes into DB columns.
 */
const NAMESPACE = "mmd-intake-private-upload";
const LOCK_NAME = `${NAMESPACE}:v2:mutation`;

export type IntakePrivateUploadKind = "lab" | "scale";
export type IntakePrivateStoredMime = "application/pdf" | "image/jpeg" | "image/png" | "image/heic";

export type IntakePrivateStoredMetadata = {
  version: 1;
  id: string;
  owner_hash: string;
  download_token: string;
  download_token_hash: string;
  kind: IntakePrivateUploadKind;
  file_name: string;
  mime_type: IntakePrivateStoredMime;
  byte_length: number;
  created_at: number;
  expires_at: number;
};

type CapabilityIndex = { version: 1; id: string };

function parseJson(value: Buffer): unknown | null {
  try {
    return JSON.parse(value.toString("utf8")) as unknown;
  } catch {
    return null;
  }
}

function metadataFrom(value: Buffer): IntakePrivateStoredMetadata | null {
  const parsed = parseJson(value);
  return parsed && typeof parsed === "object" ? parsed as IntakePrivateStoredMetadata : null;
}

function capabilityIndexFrom(value: Buffer): CapabilityIndex | null {
  const parsed = parseJson(value);
  if (!parsed || typeof parsed !== "object") return null;
  const index = parsed as Partial<CapabilityIndex>;
  return index.version === 1 && typeof index.id === "string" ? { version: 1, id: index.id } : null;
}

/**
 * Database persistence for the intake upload service. The record metadata, bytes, and capability
 * mapping are independent encrypted blobs so quota checks do not repeatedly decrypt every file.
 * Their keys are one-way HMACs and do not expose IDs or bearer tokens in database rows.
 */
export class DbIntakePrivateUploadPersistence {
  private readonly key: Buffer;
  private storeInstance: IntakePrivateBlobDb | undefined;

  constructor(
    private readonly options: {
      secret: string;
      now?: () => number;
      blobDb?: IntakePrivateBlobDb;
    },
  ) {
    this.key = createHash("sha256")
      .update(options.secret, "utf8")
      .update(":mmd-intake-private-upload-db-key", "utf8")
      .digest();
  }

  private store(): IntakePrivateBlobDb {
    return this.options.blobDb ?? (this.storeInstance ??= createIntakePrivateBlobDb({
      secret: this.options.secret,
      now: this.options.now,
    }));
  }

  private opaqueKey(kind: "metadata" | "data" | "capability", value: string): string {
    const digest = createHmac("sha256", this.key)
      .update(`${NAMESPACE}:${kind}:`, "utf8")
      .update(value, "utf8")
      .digest("base64url");
    return `${NAMESPACE}:v2:${kind}:${digest}`;
  }

  private metadataKey(id: string) {
    return this.opaqueKey("metadata", id);
  }

  private dataKey(id: string) {
    return this.opaqueKey("data", id);
  }

  private capabilityKey(token: string) {
    return this.opaqueKey("capability", token);
  }

  async withLock<T>(work: () => Promise<T>): Promise<T> {
    return this.store().withLock(LOCK_NAME, work);
  }

  async cleanup(): Promise<{ deleted: number }> {
    return this.store().cleanup();
  }

  async listMetadata(): Promise<unknown[]> {
    const keys = await this.store().list(`${NAMESPACE}:v2:metadata:`);
    const records = await Promise.all(keys.map(async key => {
      const bytes = await this.store().get(key);
      return bytes ? metadataFrom(bytes) : null;
    }));
    return records.filter(record => record !== null);
  }

  async readMetadata(id: string): Promise<unknown | null> {
    const bytes = await this.store().get(this.metadataKey(id));
    return bytes ? metadataFrom(bytes) : null;
  }

  async readBytes(id: string): Promise<Buffer | null> {
    return this.store().get(this.dataKey(id));
  }

  async findByCapability(token: string): Promise<unknown | null> {
    const indexBytes = await this.store().get(this.capabilityKey(token));
    if (!indexBytes) return null;
    const index = capabilityIndexFrom(indexBytes);
    if (!index) return null;
    return this.readMetadata(index.id);
  }

  async write(record: IntakePrivateStoredMetadata, bytes: Buffer): Promise<void> {
    const store = this.store();
    const expiresAt = record.expires_at;
    const metadata = Buffer.from(JSON.stringify(record), "utf8");
    const index = Buffer.from(JSON.stringify({ version: 1, id: record.id } satisfies CapabilityIndex), "utf8");
    try {
      await store.put(this.dataKey(record.id), bytes, expiresAt);
      await store.put(this.metadataKey(record.id), metadata, expiresAt);
      await store.put(this.capabilityKey(record.download_token), index, expiresAt);
    } catch (error) {
      // Do not leave a newly written record reachable if an adjacent encrypted blob could not be
      // committed. Cleanup failures remain opaque to callers and expire absolutely in the shared
      // store even if this best-effort compensation cannot run.
      await Promise.all([
        store.delete(this.dataKey(record.id)),
        store.delete(this.metadataKey(record.id)),
        store.delete(this.capabilityKey(record.download_token)),
      ].map(value => Promise.resolve(value).catch(() => undefined)));
      throw error;
    }
  }

  async delete(record: Pick<IntakePrivateStoredMetadata, "id" | "download_token">): Promise<void> {
    const store = this.store();
    await Promise.all([
      store.delete(this.dataKey(record.id)),
      store.delete(this.metadataKey(record.id)),
      store.delete(this.capabilityKey(record.download_token)),
    ].map(value => Promise.resolve(value)));
  }

  /** Remove an unreadable record's data/metadata. Its opaque capability index has no PHI and will expire. */
  async deleteById(id: string): Promise<void> {
    const store = this.store();
    await Promise.all([
      store.delete(this.dataKey(id)),
      store.delete(this.metadataKey(id)),
    ].map(value => Promise.resolve(value)));
  }
}
