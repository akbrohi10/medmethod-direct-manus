import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
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
    const modalSource = metaLeadConversionsHistoricalSource("client/src/components/home1/LpConsultationModal2.tsx", beforeMetaSchedule("client/src/components/home1/LpConsultationModal2.tsx", readFileSync(
      resolve(
        process.cwd(),
        "client/src/components/home1/LpConsultationModal2.tsx",
      ),
      "utf8",
    )), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

    expect(modalSource).toContain(
      "trpc.paypal.getPublicClientId.useQuery(undefined, {",
    );
    expect(modalSource).toContain("enabled: open");
  });
});
