import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { ENV } from "./_core/env";

const VERSION = "v1";
const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  if (!ENV.cookieSecret) {
    throw new Error("JWT_SECRET is required to encrypt email credentials");
  }
  return createHash("sha256")
    .update(`${ENV.cookieSecret}:medmethod-email-credentials:${VERSION}`)
    .digest();
}

export function encryptEmailCredential(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(":");
}

export function decryptEmailCredential(value: string): string {
  const [version, ivValue, tagValue, ciphertextValue] = value.split(":");
  if (version !== VERSION || !ivValue || !tagValue || !ciphertextValue) {
    throw new Error("Stored email credential has an invalid format");
  }
  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function maskEmailCredential(value: string): string {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
