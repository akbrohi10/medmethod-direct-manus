import { promises as fs } from "node:fs";
import { request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import express, { type Request } from "express";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { IntakePrivateUploadError, createIntakePrivateUploadService } from "./intakePrivateUploads";

type RawResponse = { status: number; headers: Record<string, string | string[] | undefined>; body: Buffer };
type Harness = {
  baseUrl: string;
  service: ReturnType<typeof createIntakePrivateUploadService>;
  close: () => Promise<void>;
  directory: string;
};

const PRIVATE_SECRET = "synthetic-private-upload-test-secret-which-is-long-enough";

async function rawRequest(
  baseUrl: string,
  requestPath: string,
  options: { method?: string; headers?: Record<string, string>; body?: Buffer } = {},
): Promise<RawResponse> {
  const url = new URL(requestPath, baseUrl);
  const body = options.body;
  return new Promise((resolve, reject) => {
    const request = httpRequest(url, {
      method: options.method ?? "GET",
      headers: {
        ...(body ? { "Content-Length": String(body.length) } : {}),
        ...options.headers,
      },
    }, response => {
      const chunks: Buffer[] = [];
      response.on("data", chunk => chunks.push(Buffer.from(chunk)));
      response.on("end", () => resolve({ status: response.statusCode ?? 0, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    request.once("error", reject);
    if (body) request.write(body);
    request.end();
  });
}

function json(response: RawResponse): Record<string, unknown> {
  return JSON.parse(response.body.toString("utf8")) as Record<string, unknown>;
}

function sessionCookie(response: RawResponse): string {
  const header = response.headers["set-cookie"];
  const cookie = Array.isArray(header) ? header[0] : header;
  if (!cookie) throw new Error("The upload session did not set a cookie.");
  return cookie.split(";", 1)[0];
}

function testRequest(baseUrl: string, cookie: string): Request {
  const url = new URL(baseUrl);
  return {
    protocol: url.protocol.slice(0, -1),
    headers: { host: url.host, cookie },
  } as Request;
}

async function createHarness(): Promise<Harness> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mmd-private-uploads-test-"));
  const service = createIntakePrivateUploadService({ secret: PRIVATE_SECRET, tempDir: directory, isProduction: false });
  const app = express();
  app.set("trust proxy", false);
  service.register(app);
  // Isolated test harness error response. Production has its own general error boundary.
  app.use((error: unknown, _req: Request, res: express.Response, _next: express.NextFunction) => {
    const status = error instanceof IntakePrivateUploadError ? error.status : 500;
    res.status(status).json({ error: "upload failure" });
  });
  const server = await new Promise<ReturnType<typeof app.listen>>((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    service,
    directory,
    close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  };
}

async function syntheticPng(): Promise<Buffer> {
  return sharp({
    create: { width: 480, height: 320, channels: 3, background: { r: 15, g: 110, b: 180 } },
  }).withMetadata({ exif: { IFD0: { Copyright: "synthetic test metadata" } } }).png().toBuffer();
}

const syntheticPdf = Buffer.from("%PDF-1.7\n% synthetic test document\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n", "ascii");

async function startOwner(harness: Harness): Promise<string> {
  const response = await rawRequest(harness.baseUrl, "/api/intake/uploads/session", {
    headers: { "Sec-Fetch-Site": "same-origin", Referer: `${harness.baseUrl}/intake/` },
  });
  expect(response.status).toBe(204);
  expect(String(response.headers["cache-control"])).toContain("no-store");
  expect(sessionCookie(response)).toContain("mmd_intake_upload_owner_v1=");
  expect(String(response.headers["set-cookie"])).toMatch(/HttpOnly/i);
  expect(String(response.headers["set-cookie"])).toMatch(/SameSite=Strict/i);
  return sessionCookie(response);
}

async function postUpload(
  harness: Harness,
  cookie: string,
  kind: "lab" | "scale",
  fileName: string,
  bytes: Buffer,
  contentType = "application/octet-stream",
): Promise<RawResponse> {
  return rawRequest(harness.baseUrl, `/api/intake/uploads?kind=${kind}`, {
    method: "POST",
    headers: {
      Origin: harness.baseUrl,
      "Sec-Fetch-Site": "same-origin",
      Cookie: cookie,
      "Content-Type": contentType,
      "X-File-Name": encodeURIComponent(fileName),
    },
    body: bytes,
  });
}

afterEach(async () => {
  // Every test removes its own temporary private volume in finally; this hook gives a clean
  // assertion failure path no persistent synthetic content either.
});

describe("private intake uploads", () => {
  it("encrypts private bytes/metadata, preserves validated lab names, and serves attachment-only downloads", async () => {
    const harness = await createHarness();
    try {
      const owner = await startOwner(harness);
      const originalName = "Läb Results 2026.pdf";
      const uploaded = await postUpload(harness, owner, "lab", originalName, syntheticPdf);
      expect(uploaded.status).toBe(201);
      const created = json(uploaded);
      expect(created).toMatchObject({ file_name: originalName, mime_type: "application/pdf" });
      expect(created.upload_id).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(created).not.toHaveProperty("download_url");

      const records = await fs.readdir(harness.directory);
      expect(records.sort()).toHaveLength(2);
      const encryptedContents = await Promise.all(records.map(file => fs.readFile(path.join(harness.directory, file))));
      for (const encrypted of encryptedContents) {
        expect(encrypted.includes(syntheticPdf)).toBe(false);
        expect(encrypted.toString("utf8")).not.toContain(originalName);
      }
      const modes = await Promise.all(records.map(async file => (await fs.stat(path.join(harness.directory, file))).mode & 0o777));
      expect(modes).toEqual([0o600, 0o600]);

      const resolved = await harness.service.resolve(testRequest(harness.baseUrl, owner), {
        lab_results: [String(created.upload_id)], scale_photo: null,
      }, true);
      expect(resolved.lab_results[0]).toMatchObject({ file_name: originalName, mime_type: "application/pdf" });
      const downloaded = await rawRequest(harness.baseUrl, new URL(resolved.lab_results[0].url).pathname);
      expect(downloaded.status).toBe(200);
      expect(downloaded.body).toEqual(syntheticPdf);
      expect(String(downloaded.headers["content-type"])).toContain("application/pdf");
      expect(String(downloaded.headers["content-disposition"])).toMatch(/^attachment;/i);
      expect(String(downloaded.headers["content-disposition"])).toContain("filename*=UTF-8''L%C3%A4b%20Results%202026.pdf");
      expect(String(downloaded.headers["cache-control"])).toContain("no-store");
      expect(downloaded.headers["x-content-type-options"]).toBe("nosniff");
      expect(String(downloaded.headers["content-security-policy"])).toContain("default-src 'none'");
    } finally {
      await harness.close();
      await fs.rm(harness.directory, { recursive: true, force: true });
    }
  });

  it("rejects content/extension/MIME forgeries and converts a synthetic scale PNG to stripped JPEG", async () => {
    const harness = await createHarness();
    try {
      const owner = await startOwner(harness);
      expect((await postUpload(harness, owner, "lab", "not-a-pdf.svg", syntheticPdf)).status).toBe(415);
      expect((await postUpload(harness, owner, "lab", "unsafe.pdf", Buffer.from("<svg onload='x()'></svg>"))).status).toBe(415);
      expect((await postUpload(harness, owner, "lab", "report.pdf", syntheticPdf, "image/png")).status).toBe(415);
      expect((await postUpload(harness, owner, "lab", "../report.pdf", syntheticPdf)).status).toBe(400);
      expect((await postUpload(harness, owner, "scale", "weight.pdf", syntheticPdf)).status).toBe(415);

      const png = await syntheticPng();
      const scale = await postUpload(harness, owner, "scale", "Scale Check.PNG", png);
      expect(scale.status).toBe(201);
      expect(json(scale)).toMatchObject({ file_name: "Scale Check.jpg", mime_type: "image/jpeg" });
      const preview = await rawRequest(harness.baseUrl, `/api/intake/uploads/${json(scale).upload_id}/preview`, { headers: { Cookie: owner } });
      expect(preview.status).toBe(200);
      expect(preview.headers["content-type"]).toContain("image/jpeg");
      expect(preview.body.length).toBeLessThanOrEqual(2 * 1024 * 1024);
      const imageInfo = await sharp(preview.body).metadata();
      expect(imageInfo.format).toBe("jpeg");
      expect(imageInfo.exif).toBeUndefined();
      expect(preview.headers["x-content-type-options"]).toBe("nosniff");
      expect(String(preview.headers["cache-control"])).toContain("no-store");
    } finally {
      await harness.close();
      await fs.rm(harness.directory, { recursive: true, force: true });
    }
  });

  it("enforces owner isolation and rejects a tampered Keragon bearer capability", async () => {
    const harness = await createHarness();
    try {
      const ownerOne = await startOwner(harness);
      const ownerTwo = await startOwner(harness);
      const uploaded = await postUpload(harness, ownerOne, "scale", "weight.png", await syntheticPng());
      expect(uploaded.status).toBe(201);
      const id = String(json(uploaded).upload_id);

      const crossPreview = await rawRequest(harness.baseUrl, `/api/intake/uploads/${id}/preview`, { headers: { Cookie: ownerTwo } });
      expect(crossPreview.status).toBe(404);
      const unauthenticatedPreview = await rawRequest(harness.baseUrl, `/api/intake/uploads/${id}/preview`);
      expect(unauthenticatedPreview.status).toBe(401);
      await expect(harness.service.resolve(testRequest(harness.baseUrl, ownerTwo), { lab_results: [], scale_photo: id }, true))
        .rejects.toMatchObject({ status: 400 });

      const resolved = await harness.service.resolve(testRequest(harness.baseUrl, ownerOne), { lab_results: [], scale_photo: id }, true);
      expect(resolved.scale_photo_provided).toBe(true);
      expect(resolved.scale_photo_url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/api\/intake\/files\/[A-Za-z0-9_-]{43}$/);
      const validFile = await rawRequest(harness.baseUrl, new URL(resolved.scale_photo_url!).pathname);
      expect(validFile.status).toBe(200);
      const tokenPath = new URL(resolved.scale_photo_url!).pathname;
      const lastCharacter = tokenPath.at(-1)!;
      const tampered = `${tokenPath.slice(0, -1)}${lastCharacter === "A" ? "B" : "A"}`;
      const tamperedFile = await rawRequest(harness.baseUrl, tampered);
      expect(tamperedFile.status).toBe(404);
      expect(String(tamperedFile.headers["cache-control"])).toContain("no-store");
    } finally {
      await harness.close();
      await fs.rm(harness.directory, { recursive: true, force: true });
    }
  });

  it("fails closed on absolute expiry, deletes encrypted records, and startup cleanup preserves only unexpired records", async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mmd-private-uploads-restart-test-"));
    let now = 1_800_000_000_000;
    const clock = () => now;
    const owner = Buffer.alloc(32, 9).toString("base64url");
    try {
      const first = createIntakePrivateUploadService({ secret: PRIVATE_SECRET, tempDir: directory, now: clock, isProduction: false });
      const created = await first.upload({ ownerToken: owner, ip: "127.0.0.1", kind: "lab", fileName: "restart.pdf", bytes: syntheticPdf });
      const firstResolved = await first.resolve({ headers: { host: "127.0.0.1:3000", cookie: `mmd_intake_upload_owner_v1=${owner}` }, protocol: "http" } as Request, {
        lab_results: [created.upload_id], scale_photo: null,
      }, true);
      const capability = new URL(firstResolved.lab_results[0].url).pathname.split("/").at(-1)!;

      // A fresh service instance represents runtime replacement. It decrypts and schedules the
      // live record from disk without using any in-memory registry.
      const restarted = createIntakePrivateUploadService({ secret: PRIVATE_SECRET, tempDir: directory, now: clock, isProduction: false });
      await restarted.initialize();
      expect((await restarted.download(capability))?.bytes).toEqual(syntheticPdf);

      now += (24 * 60 * 60 * 1000) + 1;
      const afterExpiry = createIntakePrivateUploadService({ secret: PRIVATE_SECRET, tempDir: directory, now: clock, isProduction: false });
      await afterExpiry.initialize();
      expect(await afterExpiry.download(capability)).toBeNull();
      expect(await fs.readdir(directory)).toEqual([]);
    } finally {
      await fs.rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects lab references when the intake answers no and leaves legacy empty refs header-independent", async () => {
    const harness = await createHarness();
    try {
      const owner = await startOwner(harness);
      const upload = await postUpload(harness, owner, "lab", "labs.pdf", syntheticPdf);
      const id = String(json(upload).upload_id);
      await expect(harness.service.resolve(testRequest(harness.baseUrl, owner), { lab_results: [id], scale_photo: null }, false))
        .rejects.toMatchObject({ status: 400 });
      await expect(harness.service.resolve({} as Request, { lab_results: [], scale_photo: null }, false)).resolves.toEqual({
        lab_results: [], lab_results_provided: false,
        lab_result_1_url: null, lab_result_2_url: null, lab_result_3_url: null, lab_result_4_url: null, lab_result_5_url: null,
        scale_photo_url: null, scale_photo_provided: false,
      });
    } finally {
      await harness.close();
      await fs.rm(harness.directory, { recursive: true, force: true });
    }
  });

  it("requires trusted browser session/upload origins and atomically enforces the five-lab owner quota", async () => {
    const harness = await createHarness();
    try {
      const missingSessionMetadata = await rawRequest(harness.baseUrl, "/api/intake/uploads/session");
      expect(missingSessionMetadata.status).toBe(403);
      expect(String(missingSessionMetadata.headers["cache-control"])).toContain("no-store");

      const owner = await startOwner(harness);
      const crossOrigin = await rawRequest(harness.baseUrl, "/api/intake/uploads?kind=lab", {
        method: "POST",
        headers: {
          Origin: "https://attacker.example",
          "Sec-Fetch-Site": "cross-site",
          Cookie: owner,
          "Content-Type": "application/octet-stream",
          "X-File-Name": "labs.pdf",
        },
        body: syntheticPdf,
      });
      expect(crossOrigin.status).toBe(403);

      // Compression/validation happens before the serialized record commit, so this parallel
      // set proves the per-owner quota is checked inside the mutation gate rather than by a
      // racy preflight count.
      const attempts = await Promise.all(Array.from({ length: 6 }, (_, index) =>
        postUpload(harness, owner, "lab", `lab-${index + 1}.pdf`, syntheticPdf),
      ));
      expect(attempts.filter(result => result.status === 201)).toHaveLength(5);
      expect(attempts.filter(result => result.status === 422)).toHaveLength(1);
      const stored = (await fs.readdir(harness.directory)).filter(file => file.endsWith(".meta"));
      expect(stored).toHaveLength(5);
    } finally {
      await harness.close();
      await fs.rm(harness.directory, { recursive: true, force: true });
    }
  });
});
