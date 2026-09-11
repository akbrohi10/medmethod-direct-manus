import express from "express";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { careTeamBookingWebhookHandler } from "./careTeamBookingWebhook";

let server: Server;
let webhookUrl: string;

describe("configured care-team webhook secret", () => {
  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.post("/api/webhooks/care-team-booking", careTeamBookingWebhookHandler);

    await new Promise<void>(resolve => {
      server = app.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (!address || typeof address === "string") throw new Error("Test server has no TCP port");
        webhookUrl = `http://127.0.0.1:${address.port}/api/webhooks/care-team-booking`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
  });

  it("authenticates against the live endpoint before payload validation", async () => {
    const secret = process.env.GHL_CARE_TEAM_WEBHOOK_SECRET ?? "";
    expect(secret.length).toBeGreaterThanOrEqual(32);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "invalid_payload",
    });
  });
});
