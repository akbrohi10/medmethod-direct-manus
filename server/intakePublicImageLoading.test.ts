import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const intakeImageFilenames = [
  "wli-f1f33b29d8189847_61cd9035.png",
  "wli-6a687e858bf791f1_9ed25994.png",
  "wli-5576595df64a98ce_995bba57.png",
  "wli-0e0c258816899736_d1702cbc.png",
  "wli-9068afd72317d144_ff732bf4.png",
  "wli-77e0f4d3193a85f4_eab9670d.png",
  "wli-dea867668ab013aa_28067705.png",
] as const;

const png = (suffix = 0) => Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, suffix]);
const jpeg = (suffix = 0) => Buffer.from([0xff, 0xd8, 0xff, suffix]);
const servers: Server[] = [];
const root = resolve(import.meta.dirname, "..");
const intakePath = resolve(root, "client/intake/index.html");

function component(source: string, name: string): string {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf("function ", start + 10);
  expect(start, `${name} must exist`).toBeGreaterThanOrEqual(0);
  expect(end, `${name} must be followed by another component`).toBeGreaterThan(start);
  return source.slice(start, end);
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(servers.splice(0).map(server => new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  })));
});

async function route() {
  vi.resetModules();
  const { registerIntakeMedicationImageAssets } = await import("./intakeMedicationImageAssets");
  const app = express();
  registerIntakeMedicationImageAssets(app);
  const server = app.listen(0);
  servers.push(server);
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

async function request(url: string, method = "GET") {
  // Use node HTTP so global fetch remains exclusively mocked for the route's upstream request.
  const { request } = await import("node:http");
  return new Promise<{ status: number; headers: Record<string, string | string[] | undefined>; bytes: Buffer }>((resolve, reject) => {
    const req = request(url, { method }, res => {
      const chunks: Buffer[] = [];
      res.on("data", chunk => chunks.push(Buffer.from(chunk)));
      res.on("end", () => resolve({
        status: res.statusCode!,
        headers: res.headers,
        bytes: Buffer.concat(chunks),
      }));
    });
    req.on("error", reject);
    req.end();
  });
}

describe("public intake image loading", () => {
  it("changes the intake HTML only through the two approved public-image substitutions", () => {
    const baseline = execFileSync("git", ["show", "e3aba40:client/intake/index.html"], { cwd: root, encoding: "utf8" });
    const current = readFileSync(intakePath, "utf8");
    const baselineMedicationImage = component(baseline, "Ie");
    const currentMedicationImage = current.slice(current.indexOf("function MmdIntakeImageSources("), current.indexOf("function MmdIntakeMedicationDetails("));
    const baselineScaleImage = "src:`/assets/scale-example.jpg`,alt:`Example of both feet on a digital scale with the weight visible`";
    const currentScaleImage = 'src:`/api/intake/assets/scale-example.jpg`,alt:`Example of both feet on a digital scale with the weight visible`,onError:e=>{let t=e.currentTarget;t.getAttribute(`src`)!==`https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CkjwARGtcsaSNmuw.jpg`&&(t.src=`https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CkjwARGtcsaSNmuw.jpg`)}';

    expect(currentMedicationImage).toContain("function MmdIntakeImageSources(e)");
    expect(currentMedicationImage).toContain("/api/intake/assets/${t}");
    expect(currentMedicationImage).toContain("?v=intake-images-20261030");
    expect(currentMedicationImage).toContain("(0,l.useEffect)(()=>n(0),[e.image])");
    expect(current).toContain(currentScaleImage);

    expect(current
      .replace(currentMedicationImage, baselineMedicationImage)
      .replace(currentScaleImage, baselineScaleImage))
      .toBe(baseline);
  });

  it("allows exactly the seven canonical intake image filenames and only fixed public CDN sources", async () => {
    vi.resetModules();
    const { INTAKE_MEDICATION_IMAGE_SOURCES } = await import("./intakeMedicationImageAssets");
    const catalog = JSON.parse(readFileSync(resolve(import.meta.dirname, "../shared/treatmentCatalog.json"), "utf8")) as {
      glp1: { options: Array<{ images: { intake?: string | null } }> };
    };
    const canonicalIntakeFilenames = catalog.glp1.options.map(option => option.images.intake?.replace("/manus-storage/", ""));

    expect(canonicalIntakeFilenames).toEqual(intakeImageFilenames);
    expect(Object.keys(INTAKE_MEDICATION_IMAGE_SOURCES)).toEqual(intakeImageFilenames);
    for (const [filename, source] of Object.entries(INTAKE_MEDICATION_IMAGE_SOURCES)) {
      expect(filename).toMatch(/^wli-[a-f0-9_]+\.png$/);
      const url = new URL(source);
      expect(url).toMatchObject({ protocol: "https:", hostname: "files.manuscdn.com", search: "" });
      expect(source).not.toContain("manus-storage");
    }
    expect(Object.values(INTAKE_MEDICATION_IMAGE_SOURCES).slice(0, 3).every(source => source.endsWith(".jpg"))).toBe(true);
    expect(Object.values(INTAKE_MEDICATION_IMAGE_SOURCES).slice(3).every(source => source.endsWith(".png"))).toBe(true);
  });

  it("serves every allowlisted image unchanged with a MIME type detected from bytes, including HEAD from the byte cache", async () => {
    vi.resetModules();
    const { INTAKE_MEDICATION_IMAGE_SOURCES } = await import("./intakeMedicationImageAssets");
    const upstream = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const index = Object.values(INTAKE_MEDICATION_IMAGE_SOURCES).indexOf(String(input));
      // The first three canonical .png keys are byte-identical JPEGs; do not trust the upstream header.
      return new Response(index < 3 ? jpeg(index) : png(index), { headers: { "content-type": "image/png" } });
    });
    const base = await route();

    for (const [index, filename] of intakeImageFilenames.entries()) {
      const response = await request(`${base}/api/intake/assets/${filename}`);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toBe(index < 3 ? "image/jpeg" : "image/png");
      expect(response.headers["cache-control"]).toBe("public, max-age=86400");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
      expect(response.bytes).toEqual(index < 3 ? jpeg(index) : png(index));
    }

    const head = await request(`${base}/api/intake/assets/${intakeImageFilenames[0]}`, "HEAD");
    expect(head.status).toBe(200);
    expect(head.headers["content-type"]).toBe("image/jpeg");
    expect(head.bytes).toHaveLength(0);
    expect(upstream).toHaveBeenCalledTimes(intakeImageFilenames.length);
    for (const [index, call] of upstream.mock.calls.entries()) {
      expect(call[0]).toBe(INTAKE_MEDICATION_IMAGE_SOURCES[intakeImageFilenames[index]]);
      expect(call[1]?.signal).toBeInstanceOf(AbortSignal);
    }
  });

  it("rejects filenames outside the allowlist without using an upstream key", async () => {
    const upstream = vi.spyOn(globalThis, "fetch");
    const base = await route();
    const response = await request(`${base}/api/intake/assets/not-an-intake-product.png`);

    expect(response.status).toBe(404);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.bytes).toHaveLength(0);
    expect(upstream).not.toHaveBeenCalled();
  });

  it.each([
    ["network failure", () => Promise.reject(new Error("upstream unavailable"))],
    ["non-image response", () => Promise.resolve(new Response("not an image", { headers: { "content-type": "text/html" } }))],
    ["invalid PNG bytes", () => Promise.resolve(new Response(Buffer.from("not-a-png"), { headers: { "content-type": "image/png" } }))],
    ["oversized PNG", () => Promise.resolve(new Response(Buffer.concat([png(), Buffer.alloc(2_000_000)]), { headers: { "content-type": "image/png" } }))],
  ])("does not cache a %s and retries the image fetch", async (_failure, failedResponse) => {
    const upstream = vi.spyOn(globalThis, "fetch")
      .mockImplementationOnce(failedResponse)
      .mockResolvedValueOnce(new Response(png(99), { headers: { "content-type": "image/png" } }));
    const base = await route();
    const url = `${base}/api/intake/assets/${intakeImageFilenames[0]}`;

    const failed = await request(url);
    expect(failed.status).toBe(503);
    expect(failed.headers["cache-control"]).toBe("no-store");
    expect(failed.headers["retry-after"]).toBe("30");
    expect(failed.bytes).toHaveLength(0);

    const retried = await request(url);
    expect(retried.status).toBe(200);
    expect(retried.headers["content-type"]).toBe("image/png");
    expect(retried.bytes).toEqual(png(99));
    expect(upstream).toHaveBeenCalledTimes(2);
  });
});
