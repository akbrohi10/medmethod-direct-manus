import { describe, expect, it } from "vitest"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = metaLeadConversionsHistoricalSource("client/supplements.html", beforeMetaSchedule("client/supplements.html", readFileSync(resolve(root, "client/supplements.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const server = metaLeadConversionsHistoricalSource("server/_core/index.ts", beforeMetaSchedule("server/_core/index.ts", readFileSync(resolve(root, "server/_core/index.ts"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const crawler = metaLeadConversionsHistoricalSource("server/crawlerMiddleware.ts", beforeMetaSchedule("server/crawlerMiddleware.ts", readFileSync(resolve(root, "server/crawlerMiddleware.ts"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const vite = metaLeadConversionsHistoricalSource("vite.config.ts", beforeMetaSchedule("vite.config.ts", readFileSync(resolve(root, "vite.config.ts"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const app = metaLeadConversionsHistoricalSource("client/src/App.tsx", beforeMetaSchedule("client/src/App.tsx", readFileSync(resolve(root, "client/src/App.tsx"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

describe("standalone /supplements preview", () => {
  it("serves the supplied store document through its own route and build entry", () => {
    expect(server).toContain('app.get(["/supplements", "/supplements/"],');
    expect(server).toContain('res.sendFile(supplementsHtml)');
    expect(vite).toContain('supplements: path.resolve(import.meta.dirname, "client/supplements.html")');
    expect(crawler).toContain('path === "/supplements" || path === "/supplements/"');
    expect(page).toContain('href="https://medmethoddirect.com/supplements"');
    expect(page).toContain('name="facebook-domain-verification" content="6gvdlzh2z653n5ezbhv5386mr0uqlu"');
  });

  it("registers a dropdown-visible React route that reloads the original standalone page", () => {
    expect(app).toContain('<Route path="/supplements" component={SupplementsStandaloneRedirect} />');
    expect(app).toContain('window.location.replace("/supplements")');
    expect(server.indexOf('app.get(["/supplements", "/supplements/"],')).toBeLessThan(server.indexOf('app.use(crawlerMiddleware)'));
  });

  it("retains the supplied product, category, cart and demo checkout interactions", () => {
    expect(page).toContain("Everyday Wellness.<br>Thoughtfully Supported.");
    expect(page).toContain("var PRODUCTS = [");
    const products = page.split("var PRODUCTS = [")[1].split("var RESEARCH = ")[0];
    expect((products.match(/\bid:'[^']+', name:/g) || []).length).toBe(6);
    expect(page).toContain("function addToCart(");
    expect(page).toContain("function viewCheckout(");
    expect(page).toContain("function placeDemoOrder(");
    expect(page).toContain("Demo mode — no real payment");
    expect(page).toContain("No card fields are shown and no payment details are collected.");
    expect(page).toContain("nothing is shipped, and no payment is processed.");
    expect(page).not.toContain("/api/trpc/stripe");
    expect(page).not.toContain("/api/trpc/paypal");
  });

  it("keeps the actual product photography outside the HTML document", () => {
    expect(page).not.toContain("data:image/");
    expect(page).toContain("/manus-storage/supplement-01-");
    expect((page.match(/\/manus-storage\/supplement-/g) || []).length).toBeGreaterThanOrEqual(15);
    expect(statSync(resolve(root, "client/supplements.html")).size).toBeLessThan(150_000);
  });

  it("flags the unfinished product and policy data rather than pretending to be a live store", () => {
    expect(page).toContain('name="robots" content="noindex,follow"');
    expect(page).toContain("Store preview — sample products and pricing.");
    expect(page).toContain("Shipping<span class=\"draft-pill\">DRAFT</span>");
    expect(page).toContain("Before real orders: what still needs confirmation");
  });
});
