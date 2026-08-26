import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("male page removal", () => {
  it("removes the page, route, redirect, and public footer link", () => {
    const appSource = readFileSync(
      resolve(projectRoot, "client/src/App.tsx"),
      "utf8"
    );
    const footerSource = readFileSync(
      resolve(projectRoot, "client/src/components/Footer.tsx"),
      "utf8"
    );

    expect(existsSync(resolve(projectRoot, "client/src/pages/MaleHome.tsx"))).toBe(false);
    expect(existsSync(resolve(projectRoot, "client/src/components/male"))).toBe(false);
    expect(appSource).not.toContain("MaleHome");
    expect(appSource).not.toContain('path={"/male"}');
    expect(appSource).not.toContain('path="/start/men"');
    expect(footerSource).not.toContain('href: "/male"');
  });
});
