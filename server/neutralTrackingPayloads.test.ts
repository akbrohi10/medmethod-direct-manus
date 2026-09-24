import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildNeutralWebinarRegistrationPayload } from "../client/src/lib/neutralTrackingPayloads";

const projectRoot = process.cwd();
const webinarConfirmationSource = readFileSync(
  resolve(projectRoot, "client/src/pages/WebinarRegistrationConfirmed.tsx"),
  "utf8",
);
const companionConfirmationSource = readFileSync(
  resolve(projectRoot, "client/src/pages/LiveWebinar3Confirmed.tsx"),
  "utf8",
);
const pixelBootstrapSource = readFileSync(
  resolve(projectRoot, "client/src/lib/metaPixelBootstrap.ts"),
  "utf8",
);

describe("neutral webinar tracking payloads", () => {
  it("uses generic metadata for both webinar lead events", () => {
    expect(buildNeutralWebinarRegistrationPayload("webinar_registration_complete")).toEqual({
      event: "webinar_registration_complete",
      content_name: "Webinar Registration",
      content_category: "Lead",
    });
    expect(buildNeutralWebinarRegistrationPayload("live_webinar3_registration_complete")).toEqual({
      event: "live_webinar3_registration_complete",
      content_name: "Webinar Registration",
      content_category: "Lead",
    });
  });

  it("uses the neutral payload for every webinar confirmation dataLayer event", () => {
    expect(webinarConfirmationSource).toContain(
      'buildNeutralWebinarRegistrationPayload("webinar_registration_complete")',
    );
    expect(companionConfirmationSource).toContain(
      'buildNeutralWebinarRegistrationPayload("live_webinar3_registration_complete")',
    );
  });

  it("keeps direct Meta confirmation events free of condition-specific metadata", () => {
    expect(pixelBootstrapSource).toContain("fbq('track', 'Lead');");
    expect(pixelBootstrapSource).not.toContain("content_name");
    expect(pixelBootstrapSource).not.toContain("content_category");
    expect(pixelBootstrapSource).not.toContain("Hormone Therapy Lead");
    expect(pixelBootstrapSource).not.toContain("Weight Loss Webinar");
  });
});
