import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");
const old = (p: string) => execFileSync("git", ["show", `88f81124:${p}`], { cwd: root, encoding: "utf8" });
const path = "client/src/pages/Masterclass3.tsx";
const before = old(path);
const page = read(path);
const priceStart = before.indexOf("        <section data-masterclass3-pricing");
const priceEnd = before.indexOf("        </section>\n", priceStart) + "        </section>\n".length;
const pricingWrapper = before.slice(priceStart, priceEnd);
const bottomStart = before.indexOf("        <section data-masterclass3-bottom-booking");
const bottomEnd = before.indexOf("        </section>\n", bottomStart) + "        </section>\n".length;
const learning = '        <div className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16">';
const section = (s: string, start: string) => { const at = s.indexOf(start); return s.slice(at, s.indexOf("        </section>\n", at) + "        </section>\n".length); };

describe("Masterclass V3 — single top booking and unchanged pricing dropdown", () => {
  it("matches exactly the authorized bottom removal and pricing-wrapper relocation", () => {
    expect(bottomStart).toBe(priceEnd);
    const withoutBottom = before.slice(0, priceStart) + before.slice(bottomEnd);
    expect(page).toBe(withoutBottom.replace(learning, pricingWrapper + "\n" + learning));
  });
  it("preserves the complete pricing component and its original wrapper byte-for-byte", () => {
    const component = (s: string) => s.slice(s.indexOf("function PricingDetails()"), s.indexOf("export default function"));
    expect(component(page)).toBe(component(before));
    expect(section(page, "        <section data-masterclass3-pricing")).toBe(pricingWrapper);
    expect(page.match(/<PricingDetails \/>/g)).toHaveLength(1);
    expect(page.match(/See Full Pricing Details/g)).toHaveLength(1);
  });
  it("preserves the entire top booking section with its exact copy, classes and actions", () => {
    expect(section(page, "        <section data-masterclass-video-first-booking")).toBe(section(before, "        <section data-masterclass-video-first-booking"));
    expect(page.match(/data-masterclass3-primary-cta/g)).toHaveLength(1);
    expect(page.match(/data-masterclass3-secondary-cta/g)).toHaveLength(1);
    expect(page).not.toContain("data-masterclass3-bottom-booking");
    expect(page).not.toContain("/book-a-visit");
  });
  it("places pricing immediately after top booking and before all learning/bio/featured content", () => {
    const booking = section(page, "        <section data-masterclass-video-first-booking");
    expect(page).toContain(booking + "\n" + pricingWrapper + "\n" + learning);
    expect(page.indexOf("<PricingDetails />")).toBeLessThan(page.indexOf("data-webinar2-learning"));
    expect(page.indexOf("<FeaturedInStrip />")).toBeGreaterThan(page.indexOf("<PricingDetails />"));
    expect(page.slice(page.indexOf("<FeaturedInStrip />"))).not.toContain("<PricingDetails />");
  });
  it("retains all prior copy-provenance entries and adds exactly two reversible section deltas", () => {
    const prior = JSON.parse(old("server/fixtures/masterclass3CopyEdits.json"));
    const current = JSON.parse(read("server/fixtures/masterclass3CopyEdits.json"));
    expect(current.slice(0, prior.length)).toEqual(prior);
    const edits = current.slice(prior.length);
    expect(edits).toHaveLength(2);
    expect(edits[0].old).toBe(before.slice(priceStart, bottomEnd));
    expect(edits[0].new).toBe("");
    expect(edits[1].old).toBe(learning);
    expect(edits[1].new).toBe(pricingWrapper + "\n" + learning);
    let restored = page;
    for (const e of [...edits].reverse()) {
      expect(restored.slice(e.at, e.at + e.new.length)).toBe(e.new);
      restored = restored.slice(0, e.at) + e.old + restored.slice(e.at + e.new.length);
    }
    expect(restored).toBe(before);
  });
  it("leaves both original pages, routing, styles, shared modal, payment and video tracking untouched", () => {
    for (const p of [
      "client/src/pages/MasterclassVideoFirst.tsx", "client/src/pages/Masterclass2.tsx", "client/src/App.tsx",
      "client/src/index.css", "client/src/components/home1/LpConsultationModal2.tsx",
      "client/src/components/home1/StripePaymentForm.tsx", "client/src/components/home1/PayPalPaymentForm.tsx",
      "client/src/lib/masterclass3VideoTracking.ts",
    ]) expect(read(p)).toBe(old(p));
  });
});
