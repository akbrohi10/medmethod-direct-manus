import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";

const servers: Server[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(servers.splice(0).map(server => new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  })));
});

async function route() {
  vi.resetModules();
  const { registerIntakeScaleExampleAsset } = await import("./intakeScaleExampleAsset");
  const app = express();
  registerIntakeScaleExampleAsset(app);
  const server = app.listen(0);
  servers.push(server);
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/assets/scale-example.jpg`;
}

async function request(url: string, method = "GET") {
  // Use node HTTP so only the route's upstream fetch is mocked.
  const { request } = await import("node:http");
  return new Promise<{ status: number; headers: Record<string, unknown>; bytes: Buffer }>((resolve, reject) => {
    const req = request(url, { method }, res => {
      const chunks: Buffer[] = [];
      res.on("data", chunk => chunks.push(Buffer.from(chunk)));
      res.on("end", () => resolve({ status: res.statusCode!, headers: res.headers, bytes: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end();
  });
}

describe("permanent scale example asset", () => {
  it("serves same-origin JPEG bytes for GET and HEAD and reuses the cached source", async () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0xff, 0xd9]);
    const upstream = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(jpeg, { headers: { "content-type": "image/jpeg" } }));
    const url = await route();
    const get = await request(url);
    expect(get.status).toBe(200);
    expect(get.headers["content-type"]).toBe("image/jpeg");
    expect(get.headers["cache-control"]).toBe("public, max-age=86400");
    expect(get.headers["x-content-type-options"]).toBe("nosniff");
    expect(get.bytes).toEqual(jpeg);
    const head = await request(url, "HEAD");
    expect(head.status).toBe(200);
    expect(head.bytes.length).toBe(0);
    expect(upstream).toHaveBeenCalledTimes(1);
    const source = String(upstream.mock.calls[0][0]);
    expect(new URL(source).search).toBe("");
    expect(source).not.toContain("manus-storage");
    expect(upstream.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each(["html", "oversized", "network"])("rejects %s responses without caching an error and retries cleanly", async failure => {
    const mock = vi.spyOn(globalThis, "fetch");
    if (failure === "network") mock.mockRejectedValueOnce(new Error("upstream failed"));
    else mock.mockResolvedValueOnce(new Response(failure === "html" ? "<html>Not an image</html>" : Buffer.alloc(200_000), { headers: { "content-type": failure === "html" ? "text/html" : "image/jpeg" } }));
    mock.mockResolvedValueOnce(new Response(Buffer.from([0xff, 0xd8, 0xff]), { headers: { "content-type": "image/jpeg" } }));
    const url = await route();
    const failed = await request(url);
    expect(failed.status).toBe(503);
    expect(failed.bytes.length).toBe(0);
    expect(failed.headers["cache-control"]).toBe("no-store");
    const retried = await request(url);
    expect(retried.status).toBe(200);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
