import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import { deliverWL2IntakeToGhl, type WL2IntakeWebhookPayload } from "./wl2IntakeWebhook";

const samplePayload: WL2IntakeWebhookPayload = {
  first_name: "Test",
  email: "test@example.com",
  phone: "555-0100",
  zip_code: "12345",
  weight_goal: "21–40 lbs",
  weight_duration: "1–3 years",
  glp1_before: "no",
  glp1_details: "",
  conditions: "None of the above",
  medications: "none",
  has_labs: "no",
  primary_goal: "Weight loss",
  activity_level: "Lightly active",
  height: "5'6\"",
  weight_lbs: "180",
  date_of_birth: "1986-08-11",
  sex: "Female",
  landing_page: "/lp/WL2",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WL2 intake webhook", () => {
  it("uses the configured GHL destination and sends the full intake payload", async () => {
    expect(ENV.ghlWl2IntakeWebhookUrl).toMatch(/^https:\/\/services\.leadconnectorhq\.com\/hooks\//);

    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await deliverWL2IntakeToGhl(samplePayload);

    expect(result).toEqual({ delivered: true, status: 200 });
    expect(fetchMock).toHaveBeenCalledWith(
      ENV.ghlWl2IntakeWebhookUrl,
      expect.objectContaining({ method: "POST" }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(samplePayload);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).date_of_birth).toBe("1986-08-11");
  });

  it("reports a failed GHL response without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("failed", { status: 500 })));

    await expect(deliverWL2IntakeToGhl(samplePayload)).resolves.toEqual({ delivered: false, status: 500 });
  });
});
