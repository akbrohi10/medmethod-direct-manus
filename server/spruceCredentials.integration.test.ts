import { describe, it, expect } from "vitest";
import axios from "axios";

// Explicitly opt-in: ordinary tests never call Spruce or send a text.
const liveCheck = process.env.RUN_SPRUCE_CREDENTIAL_CHECK === "1";
describe.runIf(liveCheck)("Spruce credentials and verification configuration (read-only)", () => {
  it("validates configured mode/required flags, authenticates and finds the internal phone endpoint", async () => {
    const token = process.env.SPRUCE_API_TOKEN?.trim();
    const endpointId = process.env.SPRUCE_INTERNAL_ENDPOINT_ID?.trim();
    if (!token || !endpointId) throw new Error("Required Spruce configuration is missing.");
    expect(process.env.PHONE_VERIFICATION_MODE).toBe("live");
    expect(process.env.PHONE_VERIFICATION_REQUIRED).toBe("true");
    let response;
    try {
      response = await axios.get("https://api.sprucehealth.com/v1/internalendpoints", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        timeout: 15000, validateStatus: () => true,
      });
    } catch { throw new Error("Spruce credential check could not reach the provider."); }
    if (response.status !== 200) throw new Error(`Spruce credential validation failed: HTTP ${response.status}.`);
    const body = response.data as { internalEndpoints?: Array<{ endpoint?: { id?: string; channel?: string; isInternal?: boolean } }> };
    const matches = body.internalEndpoints?.some(({ endpoint }) => endpoint?.id === endpointId && endpoint.channel === "phone" && endpoint.isInternal === true);
    expect(matches, "Configured Spruce internal phone endpoint must exist.").toBe(true);
  }, 20000);
});
