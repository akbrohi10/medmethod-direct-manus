import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage outcome-focused appointment copy", () => {
  it("keeps the approved outcome language in the homepage booking introduction", () => {
    const homepage = readFileSync(resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"), "utf8");

    expect(homepage).toContain(
      "A 45-minute visit with Dr. Al-Deek to review your health, medications, and goals—and create or optimize a personalized treatment plan designed to help you feel more like yourself again.",
    );
  });
});
