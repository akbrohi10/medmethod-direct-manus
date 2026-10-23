import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

type CatalogOption = {
  value: string;
  name: string;
  price: string;
  supply?: string;
  frequency: string;
  form: string;
  note: string;
  imageAlt: string;
  images: { weightLossIntake: string };
};

type PageDisplay = {
  name: string;
  price: string;
  supply?: string;
  specs: Array<{ label: string; value: string }>;
};

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const catalog = JSON.parse(read("shared/treatmentCatalog.json")) as {
  glp1: {
    options: CatalogOption[];
    pageDisplays: { weightLossIntake: Record<string, PageDisplay> };
  };
};
const browserCatalog = read("client/public/treatment-catalog.js");
const landing = read("client/weight-loss-intake.html");

// Immutable baseline captured before the page-display catalog was introduced.
// This protects every non-opted-in renderer byte without depending on /tmp fixtures.
const DEFAULT_RENDERED_HTML_SNAPSHOT = {
  byteLength: 4447,
  sha256: "88b1bb7b7cd09a199173f9f1d1e2289882cdbb70924009037ab8962d2ee595c6",
} as const;

const WEIGHT_LOSS_INTAKE_DISPLAY: Record<string, PageDisplay> = {
  compounded_semaglutide: {
    name: "Compounded Semaglutide",
    price: "$129/month — fixed price",
    specs: [
      { label: "Vial size", value: "2.5–12.5 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  compounded_tirzepatide: {
    name: "Compounded Tirzepatide",
    price: "$149 to $299/month",
    specs: [
      { label: "Vial size", value: "10–60 mg vial" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  compounded_liraglutide: {
    name: "Compounded Liraglutide",
    price: "$115",
    supply: "28-day supply",
    specs: [
      { label: "Strength", value: "6mg/mL" },
      { label: "Form", value: "Injection (multidose vial)" },
    ],
  },
  wegovy_direct_novocare: {
    name: "Wegovy® Pen — Direct from NovoCare®",
    price: "$349/month — fixed price",
    supply: "Four single-dose, prefilled pens",
    specs: [{ label: "Dose per Pen", value: "0.25–2.4 mg" }],
  },
  wegovy_pill_direct_novocare: {
    name: "Wegovy® Pill — Direct from NovoCare®",
    price: "$149 to $299/month",
    specs: [{ label: "Strength", value: "1.5–25 mg" }],
  },
  zepbound_kwikpen_direct_lillydirect: {
    name: "Zepbound® KwikPen — Direct from LillyDirect®",
    price: "$299 to $449/month",
    supply: "Four prefilled pens",
    specs: [{ label: "Dose per Pen", value: "2.5–15 mg" }],
  },
  foundayo_pill_direct_lillydirect: {
    name: "Foundayo® Pill — Direct from LillyDirect®",
    price: "$149 to $299/month",
    specs: [{ label: "Strength", value: "0.8–17.2 mg" }],
  },
};

function renderCatalog(attributes: Record<string, string> = {}) {
  const attributeRequests: string[] = [];
  const target = {
    innerHTML: "",
    getAttribute(attribute: string) {
      attributeRequests.push(attribute);
      return Object.prototype.hasOwnProperty.call(attributes, attribute) ? attributes[attribute] : null;
    },
  };

  runInNewContext(browserCatalog, {
    window: {},
    document: {
      readyState: "complete",
      querySelector(selector: string) {
        return selector === "[data-shared-glp1-catalog]" ? target : null;
      },
    },
  });

  return { html: target.innerHTML, attributeRequests };
}

function cardFor(html: string, treatmentId: string) {
  const card = html.match(new RegExp(`<article class="medication-card" data-treatment-id="${treatmentId}">[\\s\\S]*?</article>`));
  expect(card, `missing card for ${treatmentId}`).not.toBeNull();
  return card![0];
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

describe("weight-loss intake display-only medication pricing", () => {
  it("adds the exact approved weight-loss-intake display records without changing canonical names or prices", () => {
    expect(catalog.glp1.pageDisplays.weightLossIntake).toEqual(WEIGHT_LOSS_INTAKE_DISPLAY);

    expect(catalog.glp1.options.map(({ value, name, price }) => ({ value, name, price }))).toEqual([
      { value: "compounded_semaglutide", name: "Compounded Semaglutide", price: "$129" },
      { value: "compounded_tirzepatide", name: "Compounded Tirzepatide", price: "$149" },
      { value: "compounded_liraglutide", name: "Compounded Liraglutide", price: "$115" },
      { value: "wegovy_direct_novocare", name: "Wegovy® – Direct from NovoCare®", price: "$349/month" },
      { value: "wegovy_pill_direct_novocare", name: "Wegovy Pill® – Direct from NovoCare®", price: "$149/month" },
      { value: "zepbound_kwikpen_direct_lillydirect", name: "Zepbound® KwikPen – Direct from LillyDirect®", price: "$299/month" },
      { value: "foundayo_pill_direct_lillydirect", name: "Foundayo® Pill – Direct from LillyDirect®", price: "$149/month" },
    ]);
  });

  it("uses the display data only for the explicit weight-loss-intake opt-in and retains every image and note", () => {
    expect(landing).toMatch(/<div\b(?=[^>]*\bdata-shared-glp1-catalog\b)(?=[^>]*\bdata-catalog-display="weightLossIntake")[^>]*>/);

    const rendered = renderCatalog({
      "data-catalog-display": "weightLossIntake",
      "data-catalog-image-loading": "lazy",
    });
    expect(rendered.attributeRequests).toEqual(expect.arrayContaining([
      "data-catalog-display",
      "data-catalog-image-loading",
    ]));
    expect(rendered.html).not.toBe(DEFAULT_RENDERED_HTML_SNAPSHOT.sha256);

    const treatmentIds = Array.from(rendered.html.matchAll(/data-treatment-id="([^"]+)"/g), match => match[1]);
    expect(treatmentIds).toEqual(catalog.glp1.options.map(option => option.value));

    for (const option of catalog.glp1.options) {
      const display = WEIGHT_LOSS_INTAKE_DISPLAY[option.value];
      const card = cardFor(rendered.html, option.value);

      expect(card).toContain(`<h3>${display.name}</h3>`);
      expect(card).toContain(`<strong>${display.price}</strong>`);
      expect(card).toContain(`src="${option.images.weightLossIntake}"`);
      expect(card).toContain(`alt="${option.imageAlt}"`);
      expect(card).toContain('loading="lazy" decoding="async"');
      expect(card).toContain(`<p class="medication-note">${option.note}</p>`);
      expect(card).not.toContain("<dt>Frequency</dt>");

      for (const spec of display.specs) {
        expect(card).toContain(`<dt>${spec.label}</dt><dd>${spec.value}</dd>`);
      }

      if (display.supply) {
        expect(card).toContain(`<span class="medication-supply">${display.supply}</span>`);
      } else {
        expect(card).not.toContain('class="medication-supply"');
      }
    }
  });

  it("renders the baseline default markup byte-for-byte when the display opt-in is absent", () => {
    const rendered = renderCatalog({ "data-catalog-image-loading": "lazy" });

    expect(rendered.attributeRequests).toContain("data-catalog-image-loading");
    expect(Buffer.byteLength(rendered.html, "utf8")).toBe(DEFAULT_RENDERED_HTML_SNAPSHOT.byteLength);
    expect(hash(rendered.html)).toBe(DEFAULT_RENDERED_HTML_SNAPSHOT.sha256);
  });

  it("falls back to the unchanged default markup for unknown displays and targets without the opt-in", () => {
    const defaultHtml = renderCatalog({ "data-catalog-image-loading": "lazy" }).html;
    const unknownDisplayHtml = renderCatalog({
      "data-catalog-display": "not-a-supported-page-display",
      "data-catalog-image-loading": "lazy",
    }).html;
    const noOptInHtml = renderCatalog({ "data-catalog-image-loading": "lazy" }).html;

    expect(defaultHtml).toBe(noOptInHtml);
    expect(unknownDisplayHtml).toBe(defaultHtml);
    expect(hash(unknownDisplayHtml)).toBe(DEFAULT_RENDERED_HTML_SNAPSHOT.sha256);
  });
});
