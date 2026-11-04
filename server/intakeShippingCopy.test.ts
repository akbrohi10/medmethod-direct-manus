import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const path = "client/intake/index.html";
const source = readFileSync(resolve(root, path), "utf8");
const baseline = execFileSync("git", ["show", `b69c2aa2:${path}`], { cwd: root, encoding: "utf8" });
const oldLabel = "children:`Apt/suite/unit`", newLabel = "children:`Apt, suite, unit (optional)`";
function component(name: string) { const start = source.indexOf(`function ${name}(`); expect(start).toBeGreaterThanOrEqual(0); return source.slice(start, source.indexOf("function ", start + 12)); }

describe("Weight Care shipping screen exact copy", () => {
  it("changes only the single apartment label and restores the complete intake byte-for-byte", () => {
    expect(source.split(newLabel)).toHaveLength(2);
    expect(baseline.split(oldLabel)).toHaveLength(2);
    expect(source.replace(newLabel, oldLabel)).toBe(baseline);
  });

  it("retains the requested shipping heading, exact medication note and all five labels", () => {
    const metadata = JSON.parse(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
    expect(metadata.w.screens.find((s: { id: string }) => s.id === "wShippingAddress").question_text).toBe("Your shipping address");
    const shipping = component("MmdShippingAddress");
    expect(shipping).toContain("This is where medication may ship, so please make sure it's accurate.");
    for (const label of ["Street address", "Apt, suite, unit (optional)", "City", "State", "ZIP code"]) expect(shipping).toContain(label);
    expect(shipping).not.toMatch(/compounded|from your profile|as entered above|locked|readOnly|disabled/);
  });

  it("preserves the editable canonical state, original state list, autofill, ZIP validation and private-field suppression", () => {
    const shipping = component("MmdShippingAddress");
    expect(shipping).toContain("value:String(e.state??``)");
    expect(shipping).toContain("onChange:e=>t(`state`,e.target.value)");
    expect(shipping).toContain("y.map(e=>(0,M.jsx)(`option`,{children:e},e))");
    for (const value of ["shipping address-line1", "shipping address-line2", "shipping address-level2", "shipping address-level1", "shipping postal-code", "maxLength:5", "'data-hj-suppress':!0"]) expect(shipping).toContain(value);
    expect(source).toContain('/^\\d{5}$/.test(String(t.wAddressZip??``))');
  });

  it("preserves every earlier exact fragment and appends only this shipping label inverse", () => {
    const fixture = "server/fixtures/intakeLatePatientInfoFragments.json";
    const current = JSON.parse(readFileSync(resolve(root, fixture), "utf8"));
    const previous = JSON.parse(execFileSync("git", ["show", `b69c2aa2:${fixture}`], { cwd: root, encoding: "utf8" }));
    expect(current.slice(0, previous.length)).toEqual(previous);
    expect(current).toHaveLength(previous.length + 1);
    expect(current.at(-1)).toEqual({ old: oldLabel, new: newLabel, count: 1 });
  });

  it("changes no other production source from the approved checkpoint", () => {
    const scope = ["client", "server", "shared", "package.json", "pnpm-lock.yaml", "vite.config.ts", "drizzle"];
    const paths = [...execFileSync("git", ["diff", "--name-only", "b69c2aa2", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n"), ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...scope], { cwd: root, encoding: "utf8" }).trim().split("\n")].filter(Boolean).filter(p => !/\.test\.[cm]?[jt]sx?$/.test(p) && p !== "server/fixtures/intakeLatePatientInfoFragments.json");
    expect([...new Set(paths)]).toEqual([path]);
  });
});
