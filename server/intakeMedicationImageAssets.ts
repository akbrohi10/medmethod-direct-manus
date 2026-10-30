import type { Express } from "express";

/** Allowlisted public product illustrations only. Never exposes patient uploads or arbitrary keys. */
export const INTAKE_MEDICATION_IMAGE_SOURCES: Readonly<Record<string, string>> = {
  "wli-f1f33b29d8189847_61cd9035.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/kjhldmBNtSdkNVtp.jpg",
  "wli-6a687e858bf791f1_9ed25994.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/eHeSLdcFOstowSLS.jpg",
  "wli-5576595df64a98ce_995bba57.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/NZJsDQQgSfKSHkUC.jpg",
  "wli-0e0c258816899736_d1702cbc.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/NTJBFCTyqzCcaRuF.png",
  "wli-9068afd72317d144_ff732bf4.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/ZiovQxBLyDnuwInm.png",
  "wli-77e0f4d3193a85f4_eab9670d.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/hwwQpKiCwIXTMEkX.png",
  "wli-dea867668ab013aa_28067705.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/KtSYATcRkNSheVPd.png"
};
const cache = new Map<string, Promise<{ bytes: Buffer; mimeType: string }>>();
const MAX_IMAGE_BYTES = 2_000_000;

async function productImage(filename: string): Promise<{ bytes: Buffer; mimeType: string }> {
  let pending = cache.get(filename);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(INTAKE_MEDICATION_IMAGE_SOURCES[filename], { signal: AbortSignal.timeout(8_000) });
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("Image unavailable");
      const bytes = Buffer.from(await response.arrayBuffer());
      const png = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      if (bytes.length > MAX_IMAGE_BYTES || (!png && !jpeg)) throw new Error("Image unavailable");
      return { bytes, mimeType: png ? "image/png" : "image/jpeg" };
    })().catch(error => { cache.delete(filename); throw error; });
    cache.set(filename, pending);
  }
  return pending;
}

export function registerIntakeMedicationImageAssets(app: Express): void {
  app.get("/api/intake/assets/:file", (req, res) => {
    const filename = req.params.file;
    if (!Object.prototype.hasOwnProperty.call(INTAKE_MEDICATION_IMAGE_SOURCES, filename)) {
      res.set({ "Cache-Control": "no-store" }).status(404).end();
      return;
    }
    void productImage(filename).then(({ bytes, mimeType }) => {
      res.set({ "Content-Type": mimeType, "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
      res.status(200).send(bytes);
    }).catch(() => {
      res.set({ "Cache-Control": "no-store", "Retry-After": "30" }).status(503).end();
    });
  });
}
