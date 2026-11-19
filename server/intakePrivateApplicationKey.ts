import { createHash } from "node:crypto";

/**
 * Existing private-storage application-key derivation, factored without changing its bytes.
 * The >=16-character policy matches the established application secret policy; hashing does
 * not increase secret entropy and does not make this a new strong-random-key/compliance claim.
 * Keep this helper server-only; never expose or log its input or derived key.
 */
export function deriveIntakePrivateApplicationKey(secret: string): Buffer {
  if (!secret || secret.length < 16) throw new Error("Private intake storage is unavailable.");
  return createHash("sha256")
    .update(secret, "utf8")
    .update(":mmd-intake-private-blob-db-v1:aes-256-gcm", "utf8")
    .digest();
}
