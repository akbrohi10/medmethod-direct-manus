import type { Express } from "express";

/** Fixed public physician photograph only. Never accepts a user URL, key or patient upload. */
export const INTAKE_DOCTOR_PORTRAIT_PATH = "/assets/dr-jumana-al-deek-portrait.webp";
export const INTAKE_DOCTOR_PORTRAIT_SOURCE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/NfYmKtEGqUrrcCpa.webp";
const MAX_BYTES = 200_000;
let cachedPortrait: Promise<Buffer> | undefined;

async function portraitBytes(): Promise<Buffer> {
  cachedPortrait ??= (async () => {
    const response = await fetch(INTAKE_DOCTOR_PORTRAIT_SOURCE, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("Portrait unavailable");
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 12 || bytes.length >= MAX_BYTES || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") throw new Error("Portrait unavailable");
    return bytes;
  })().catch(error => { cachedPortrait = undefined; throw error; });
  return cachedPortrait;
}

export function registerIntakeDoctorPortraitAsset(app: Express): void {
  app.get(INTAKE_DOCTOR_PORTRAIT_PATH, (_req, res) => {
    void portraitBytes().then(bytes => {
      res.set({ "Content-Type": "image/webp", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
      res.status(200).send(bytes);
    }).catch(() => {
      res.set({ "Cache-Control": "no-store", "Retry-After": "30" }).status(503).end();
    });
  });
}
