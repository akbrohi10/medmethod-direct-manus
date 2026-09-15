import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Facebook domain verification", () => {
  it("keeps the LegitScript-supplied verification tag in the shared document head", () => {
    const documentHead = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

    expect(documentHead).toContain(
      '<meta name="facebook-domain-verification" content="6gvdlzh2z653n5ezbhv5386mr0uqlu" />',
    );
  });
});
