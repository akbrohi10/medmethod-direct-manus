import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  new URL("../client/src/pages/LpWL2.tsx", import.meta.url),
  "utf8",
);

describe("LpWL2 social-proof section", () => {
  it("keeps the statistics open and minimal while giving the section clearer separation", () => {
    expect(componentSource).toContain('bg-[#fdfafb]');
    expect(componentSource).toContain('borderColor: "#eee3e6"');
    expect(componentSource).toContain('w-12 h-1 rounded-full mx-auto mb-7');
    expect(componentSource).toContain('background: BRAND_GRADIENT');
    expect(componentSource).toContain('background: "#d8cbd0"');
    expect(componentSource).toContain('>10K+</p>');
    expect(componentSource).not.toContain('>10,000+</p>');
    expect(componentSource).toContain('font-black tracking-tight text-gray-900');
    expect(componentSource).toContain('font-medium leading-none text-gray-600 mt-1.5');
    expect(componentSource).not.toContain("Social proof card");
  });
});
