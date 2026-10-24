import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const page = read("client/src/pages/Masterclass2.tsx");
const original = read("client/src/pages/MasterclassVideoFirst.tsx");
const profile = read("client/src/components/masterclass2/PhysicianProfile.tsx");
const asset = "/manus-storage/jumana-family-masterclass_238b56a3.webp";
const block = page.match(/<div data-masterclass2-family-photo-section[\s\S]*?<\/div>/)?.[0] ?? "";

describe("masterclass2 original family photo restoration", () => {
  it("reuses the original family image once without bringing back the removed portrait", () => {
    expect(original).toContain(asset);
    expect(block).toContain(`src="${asset}"`);
    expect(page.split(asset)).toHaveLength(2);
    expect(block).toContain('alt="Dr. Jumana Al-Deek with her family outdoors"');
    expect(profile).not.toMatch(/<img|dr-aldeek-home-portrait/);
  });

  it("places only the photo between the unchanged Featured In banner and full biography", () => {
    expect(block).not.toBe("");
    expect(page.indexOf("data-masterclass2-family-photo-section")).toBeGreaterThan(page.indexOf("<FeaturedInStrip />"));
    expect(page.indexOf("data-masterclass2-family-photo-section")).toBeLessThan(page.indexOf("<PhysicianProfile />"));
    expect(page).toContain('</section>\n\n        <FeaturedInStrip />');
    expect(block).not.toMatch(/<button|<a\s|<iframe|<h[1-6]|<p\b/);
  });

  it("preserves the entire image with moderate responsive width and lazy loading", () => {
    expect(block).toContain("h-auto w-full max-w-[340px]");
    expect(block).toContain("sm:max-w-[390px]");
    expect(block).toContain("object-contain");
    expect(block).not.toMatch(/object-cover|aspect-\[|h-\[/);
    expect(block).toContain("width={1100}");
    expect(block).toContain("height={1100}");
    expect(block).toContain('loading="lazy"');
    expect(block).toContain('decoding="async"');
  });
});
