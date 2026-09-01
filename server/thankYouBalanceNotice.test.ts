import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const thankYouSource = fs.readFileSync(
  path.join(projectRoot, "client/src/pages/ThankYou.tsx"),
  "utf8",
);
const thankYou2Source = fs.readFileSync(
  path.join(projectRoot, "client/src/pages/ThankYou2.tsx"),
  "utf8",
);

describe("/thank-you remaining-balance notice", () => {
  it("uses amount-neutral wording because the deferred balance can vary", () => {
    expect(thankYouSource).toContain(
      "Your remaining balance will be charged on the day of your appointment.",
    );
    expect(thankYouSource).not.toContain(
      "The remaining $149 will be charged on the day of your appointment.",
    );
  });

  it("does not modify the separate /thank-you2 page", () => {
    expect(thankYou2Source).not.toContain(
      "Your remaining balance will be charged on the day of your appointment.",
    );
  });
});
