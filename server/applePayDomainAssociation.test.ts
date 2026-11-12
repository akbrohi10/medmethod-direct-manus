import { createHash } from "node:crypto"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const associationPath = resolve(
  root,
  "client/public/.well-known/apple-developer-merchantid-domain-association",
);
const server = metaLeadConversionsHistoricalSource("server/_core/index.ts", readFileSync(resolve(root, "server/_core/index.ts"), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("Apple Pay domain verification", () => {
  it("keeps the supplied Apple association file byte-for-byte in the public build input", () => {
    const file = (metaLeadConversionsNeedsInverse(associationPath) ? Buffer.from(metaLeadConversionsHistoricalSource(associationPath, readFileSync(associationPath).toString("utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"))) : readFileSync(associationPath));

    expect(statSync(associationPath).size).toBe(9094);
    expect(createHash("sha256").update(file).digest("hex")).toBe(
      "cdb19c18ab558f50994fb98413eaad9d495b552a2fdf07505e4fb4f5777e4969",
    );
    expect(file.toString("utf8")).not.toMatch(/<!doctype|<html/i);
  });

  it("serves the exact well-known URL directly rather than routing it to the site HTML fallback", () => {
    expect(server).toContain(
      'app.get("/.well-known/apple-developer-merchantid-domain-association",',
    );
    expect(server).toContain("applePayDomainAssociationFile");
    expect(server).toContain('res.type("text/plain")');
    expect(server).toContain('res.setHeader("Cache-Control", "no-store")');
    expect(server).toContain("res.sendFile(applePayDomainAssociationFile)");
  });
});
