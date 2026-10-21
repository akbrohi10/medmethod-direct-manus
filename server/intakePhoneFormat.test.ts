import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const intake = readFileSync(resolve(root, "client/intake/index.html"), "utf8");

function getPhoneFormatter(): (value: unknown) => string {
  const start = intake.indexOf("function MmdFormatUsPhone(e)");
  const end = intake.indexOf("}function Ne(", start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  const formatterSource = intake.slice(start, end + 1);
  return new Function(`${formatterSource}; return MmdFormatUsPhone;`)() as (value: unknown) => string;
}

describe("intake mobile number formatting", () => {
  it("formats partial and complete ten-digit numbers as they are typed", () => {
    const format = getPhoneFormatter();

    expect(format("")).toBe("");
    expect(format("5")).toBe("(5");
    expect(format("555")).toBe("(555");
    expect(format("5555")).toBe("(555) 5");
    expect(format("5555555")).toBe("(555) 555-5");
    expect(format("5555555555")).toBe("(555) 555-5555");
  });

  it("normalizes a pasted U.S. number, including an optional country code", () => {
    const format = getPhoneFormatter();

    expect(format("+1 (555) 555-5555")).toBe("(555) 555-5555");
    expect(format("1-555-555-5555")).toBe("(555) 555-5555");
    expect(format("(555) 555-5555 ext. 22")).toBe("(555) 555-5555");
  });

  it("keeps the behavior isolated to the existing Mobile number tel input", () => {
    expect(intake).toContain("label:`Mobile number`,type:`tel`");
    expect(intake).toContain("onChange:e=>n(r===`tel`?MmdFormatUsPhone(e.target.value):e.target.value)");
    expect((intake.match(/type:`tel`/g) ?? [])).toHaveLength(1);
    expect(intake).toContain("String(t.phone??``).replace(/\\D/g,``).length>=10");
  });
});
