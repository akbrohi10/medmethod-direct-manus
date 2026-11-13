import { readFileSync } from "node:fs"; import { createHash as metaLeadScopeCreateHash } from "node:crypto"; import { gunzipSync as metaLeadScopeGunzipSync } from "node:zlib"; import { metaLeadConversionsHistoricalSource, metaLeadConversionsApprovedInventory, metaLeadConversionsNeedsInverse, META_LEAD_CONVERSIONS_SOURCE_PATHS } from "./fixtures/metaLeadConversionsScope"; const metaLeadConversionsHelperSHA = "d34479c6329419bf251177058890f3ac1bbb2d8fd943685846528c717b98afcc"; import { beforeMetaSchedule, metaScheduleApprovedInventory } from "./fixtures/metaScheduleScope"; const metaScheduleHelperSHA = "b9687e0da13457a07b541655bef530808eacdd6c465a50c5104e967625b5c613";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const intake = metaLeadConversionsHistoricalSource("client/intake/index.html", beforeMetaSchedule("client/intake/index.html", readFileSync(resolve(root, "client/intake/index.html"), "utf8")), s => metaLeadScopeCreateHash("sha256").update(s).digest("hex"), metaLeadConversionsHelperSHA, s => metaLeadScopeGunzipSync(Buffer.from(s, "base64")).toString("utf8"));

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
