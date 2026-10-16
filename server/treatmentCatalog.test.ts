import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Treatment = { name: string; price: string; supply?: string };

const root = resolve(import.meta.dirname, "..");
const catalog = JSON.parse(readFileSync(resolve(root, "shared/treatmentCatalog.json"), "utf8")) as {
  glp1: { options: Treatment[] };
  hrt: { options: Treatment[] };
};

const entries = (items: Treatment[]) => items.map(({ name, price, supply }) => [name, price, supply]);

describe("shared treatment catalog", () => {
  it("contains the owner-approved GLP-1 order, prices and supply formatting", () => {
    expect(entries(catalog.glp1.options)).toEqual([
      ["Compounded Semaglutide", "$129", "1-month supply"],
      ["Compounded Tirzepatide", "$149", "1-month supply"],
      ["Compounded Liraglutide", "$115", "1-month supply"],
      ["Wegovy® – Direct from NovoCare®", "$349/month", undefined],
      ["Wegovy Pill® – Direct from NovoCare®", "$149/month", undefined],
      ["Zepbound® KwikPen – Direct from LillyDirect®", "$299/month", undefined],
      ["Foundayo® Pill – Direct from LillyDirect®", "$149/month", undefined],
    ]);
  });

  it("contains every approved HRT item and removes the two retired products", () => {
    expect(entries(catalog.hrt.options)).toEqual([
      ["Estradiol Tablets", "$29", "1-month supply"],
      ["Estradiol Patch", "$99", "1-month supply"],
      ["Micronized Progesterone Pill", "$69", "3-month supply"],
      ["Vaginal Estrogen Cream", "$79", "2-month supply"],
      ["PT-141 Injection", "$179", "1-month supply"],
      ["Vaginal Estrogen Cream + PT-141", "$258", "1-month supply"],
      ["Estriol Face Cream", "$119", "1-month supply"],
      ["Eye Cream", "$89", "1-month supply"],
      ["GHK-Cu + Biopeptides Cream", "$109", "1-month supply"],
      ["Advanced Cell Repair Serum", "$119", "1-month supply"],
      ["Emerald Cream", "$99", "1-month supply"],
      ["Low-Dose Minoxidil Pill", "$84", "3-month supply"],
    ]);
    const names = catalog.hrt.options.map(item => item.name);
    expect(names).not.toContain("Estradiol Gel (Divigel)");
    expect(names).not.toContain("Spironolactone + Biotin + Minoxidil Combination Pill");
  });

  it("uses supply only for compounded and HRT items, never the phrase per month", () => {
    for (const treatment of [...catalog.glp1.options, ...catalog.hrt.options]) {
      expect(`${treatment.name} ${treatment.price} ${treatment.supply ?? ""}`).not.toContain("per month");
    }
    for (const treatment of catalog.glp1.options.filter(item => item.name.startsWith("Compounded"))) {
      expect(treatment.price).not.toContain("/month");
      expect(treatment.supply).toMatch(/^\d-month supply$/);
    }
    for (const treatment of catalog.hrt.options) {
      expect(treatment.price).not.toContain("/month");
      expect(treatment.supply).toMatch(/^\d-month supply$/);
    }
  });
});
