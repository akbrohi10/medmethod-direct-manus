import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  readPreviewBearerToken,
  resolveTrpcEndpoint,
} from "../client/src/lib/trpcTransport";

describe("preview tRPC transport", () => {
  it("resolves the API endpoint against a valid preview URL", () => {
    expect(
      resolveTrpcEndpoint("https://preview.example.com/?from_webdev=1"),
    ).toBe("https://preview.example.com/api/trpc");
  });

  it("falls back safely when a preview base URL is malformed", () => {
    expect(resolveTrpcEndpoint("not a valid URL")).toBe("/api/trpc");
  });

  it("extracts a valid preview bearer token", () => {
    expect(
      readPreviewBearerToken(
        "theme=light; app_session=valid.preview-token_123",
        "app_session",
      ),
    ).toBe("valid.preview-token_123");
  });

  it("rejects malformed preview tokens containing control characters", () => {
    expect(
      readPreviewBearerToken(
        "app_session=invalid\nheader",
        "app_session",
      ),
    ).toBeUndefined();
  });

  it("defers the homepage payment-provider query until the modal opens", () => {
    const modalSource = readFileSync(
      resolve(
        process.cwd(),
        "client/src/components/home1/LpConsultationModal2.tsx",
      ),
      "utf8",
    );

    expect(modalSource).toContain(
      "trpc.paypal.getPublicClientId.useQuery(undefined, {",
    );
    expect(modalSource).toContain("enabled: open");
  });
});
