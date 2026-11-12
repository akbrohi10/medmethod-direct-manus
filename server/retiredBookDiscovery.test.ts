import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const retiredPath = "/the-menopause-weight-loss-trap";
const retiredUrl = `https://medmethoddirect.com${retiredPath}`;
const retailerUrl =
  "https://www.barnesandnoble.com/w/the-menopause-weight-loss-trap-jumana-al-deek/1150481457?ean=9798996539000";

describe("retired menopause book page discovery cleanup", () => {
  it("removes the retired URL from the active sitemap", () => {
    const sitemap = metaLeadConversionsHistoricalSource("client/public/sitemap.xml", readFileSync(
      resolve(projectRoot, "client/public/sitemap.xml"),
      "utf8",
    ), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

    expect(sitemap).not.toContain(retiredUrl);
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });

  it("removes the obsolete /book client shortcut", () => {
    const appSource = metaLeadConversionsHistoricalSource("client/src/App.tsx", readFileSync(
      resolve(projectRoot, "client/src/App.tsx"),
      "utf8",
    ), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

    expect(appSource).not.toContain('<Route path="/book"');
    expect(appSource).not.toContain(`window.location.replace("${retiredPath}")`);
  });

  it("uses the external retailer instead of the retired internal page", () => {
    const teaser = metaLeadConversionsHistoricalSource("client/src/components/home1/BookTeaser.tsx", readFileSync(
      resolve(projectRoot, "client/src/components/home1/BookTeaser.tsx"),
      "utf8",
    ), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

    expect(teaser).not.toContain(`href="${retiredPath}"`);
    expect(teaser.match(new RegExp(retailerUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")))
      .toHaveLength(2);
    expect(teaser).toContain('target="_blank"');
    expect(teaser).toContain('rel="noopener noreferrer"');
  });

  it("preserves the permanent server redirect for old search results", () => {
    const serverSource = metaLeadConversionsHistoricalSource("server/_core/index.ts", readFileSync(
      resolve(projectRoot, "server/_core/index.ts"),
      "utf8",
    ), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

    expect(serverSource).toContain(
      `app.get("${retiredPath}", (_req, res) => res.redirect(301, "/"));`,
    );
  });
});
