import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homepageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/HomeHrt3.tsx"),
  "utf8",
);

describe("homepage header call-to-action", () => {
  it("stacks a centered Call Now label above a larger phone number while retaining the existing tap-to-call destination", () => {
    const headerBlock = homepageSource.match(/<header className="fixed[\s\S]*?<\/header>/)?.[0] ?? "";

    expect(headerBlock).toContain('href="tel:+18883627011"');
    expect(headerBlock).toContain("Call Now");
    expect(headerBlock).not.toContain("Call Now:");
    expect(headerBlock).toContain("(888) 362-7011");
    expect(headerBlock).toContain("flex flex-col items-center justify-self-center");
    expect(headerBlock).toContain("text-[14px] font-black");
    expect(headerBlock).toContain("focus-visible:ring-[#E8339E]");
  });

  it("keeps the logo, centered call-to-action, and Patient Login control responsive without overlap-prone absolute positioning", () => {
    const headerBlock = homepageSource.match(/<header className="fixed[\s\S]*?<\/header>/)?.[0] ?? "";

    expect(headerBlock).toContain("grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]");
    expect(headerBlock).toContain("h-16");
    expect(headerBlock).toContain('alt="MedMethod Direct"');
    expect(headerBlock).toContain("Patient Login");
    expect(headerBlock).toContain("justify-self-center");
    expect(headerBlock).not.toContain("absolute left-1/2 -translate-x-1/2");
  });
});
