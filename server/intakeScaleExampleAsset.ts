import type { Express } from "express";

/** Public instructional example only; never used for uploaded patient files. */
export const SCALE_EXAMPLE_PATH = "/assets/scale-example.jpg";
const EXAMPLE_SOURCE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CkjwARGtcsaSNmuw.jpg";
const MAX_BYTES = 200_000;
let cachedExample: Promise<Buffer> | undefined;

async function exampleBytes(): Promise<Buffer> {
  cachedExample ??= (async () => {
    const response = await fetch(EXAMPLE_SOURCE, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
      throw new Error("Example unavailable");
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 3 || bytes.length >= MAX_BYTES || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
      throw new Error("Example unavailable");
    }
    return bytes;
  })().catch(error => {
    cachedExample = undefined;
    throw error;
  });
  return cachedExample;
}

export function registerIntakeScaleExampleAsset(app: Express): void {
  app.get(SCALE_EXAMPLE_PATH, (_req, res) => {
    void exampleBytes().then(bytes => {
      res.set({
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      });
      res.status(200).send(bytes);
    }).catch(() => {
      res.set({ "Cache-Control": "no-store", "Retry-After": "30" });
      res.status(503).end();
    });
  });
}
