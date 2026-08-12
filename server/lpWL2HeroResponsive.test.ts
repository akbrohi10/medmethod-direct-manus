import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  new URL("../client/src/pages/LpWL2.tsx", import.meta.url),
  "utf8",
);

describe("LpWL2 responsive hero", () => {
  it("pairs copy and physician image at tablet widths and keeps mobile stacking intentional", () => {
    expect(componentSource).toContain("md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]");
    expect(componentSource).toContain("md:justify-end");
    expect(componentSource).toContain("md:items-end");
    expect(componentSource).toContain("md:max-w-[360px]");
    expect(componentSource).not.toContain("grid grid-cols-1 lg:grid-cols-2 gap-10 items-center");
  });
});
