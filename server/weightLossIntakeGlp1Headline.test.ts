import { describe, expect, it } from "vitest"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file: string) => metaLeadConversionsHistoricalSource(file, readFileSync(resolve(root, file), "utf8"), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));
const landing = read("client/weight-loss-intake.html");
const headline = landing.match(/<h1>[\s\S]*?<\/h1>/)?.[0] ?? "";

describe("Approved GLP-1 qualification headline on weight-loss-intake only", () => {
  it("renders the exact approved sentence as one semantic headline", () => {
    expect(headline.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()).toBe("Text a weight-loss Doctor now For FREE! to see if GLP-1s are right for you.");
    expect(landing.match(/<h1\b/g)).toHaveLength(1);
    expect(headline).toContain('<span class="hero-headline-middle">Doctor now <span class="hero-headline-last">For FREE!</span></span>');
    expect(headline).not.toContain("doctor now.");
  });

  it("lets only the additional headline phrase wrap while keeping GLP-1s together", () => {
    expect(landing).toContain('.hero h1 .hero-headline-qualifier{display:block;white-space:normal;text-wrap:balance;font-size:.52em;line-height:1.18;letter-spacing:-.02em;margin:12px 0 10px}');
    expect(landing).toContain('.hero h1 .hero-glp1-term{white-space:nowrap;color:var(--hero-brand-teal);-webkit-text-fill-color:currentColor}');
    expect(headline).toContain('<span class="hero-headline-qualifier">to see if <span class="hero-glp1-term">GLP-1s</span> are right for you.</span>');
    expect(landing).toContain('.hero .hero-headline-middle{font-size:.86em}');
    expect(landing).toContain('.hero h1{font-family:"DM Serif Display",Georgia,serif;font-weight:400');
    expect(landing).toContain('.hero .hero-headline-last{color:var(--hero-brand-teal)');
    expect(landing).toContain('border-top:7px solid var(--hero-sage)');
  });

  it("accents only GLP-1s in the existing brand teal without adding other decoration", () => {
    const rule = landing.match(/\.hero h1 \.hero-glp1-term\{([^}]*)\}/)?.[1];
    expect(rule).toBe('white-space:nowrap;color:var(--hero-brand-teal);-webkit-text-fill-color:currentColor');
    expect(landing).toContain('--hero-brand-teal:#008F83');
    expect(headline.match(/class="hero-glp1-term"/g)).toHaveLength(1);
    expect(headline).toContain('<span class="hero-glp1-term">GLP-1s</span>');
    expect(rule).not.toMatch(/background|font-size|font-weight|border|shadow/);
  });

  it("does not put the new wording or rules into other pages or shared styles", () => {
    for (const file of ["client/intake/index.html", "client/src/pages/WeightLossMenopause.tsx", "client/src/pages/MasterclassVideoFirst.tsx", "client/src/index.css", "client/public/weight-loss-intake/ui-polish.css"]) {
      expect(read(file)).not.toContain("hero-headline-qualifier");
      expect(read(file)).not.toContain("to see if GLP-1s are right for you.");
    }
    expect(landing.match(/href="\/intake\/"/g)).toHaveLength(5);
  });
});
