import { describe, expect, it } from "vitest";
import { formatWl2DateOfBirthInput, toWl2IsoDateOfBirth } from "../client/src/lib/wl2DateOfBirth";

describe("WL2 Date of Birth input", () => {
  it("formats numeric typing as a familiar month/day/year date", () => {
    expect(formatWl2DateOfBirthInput("08111986")).toBe("08/11/1986");
  });

  it("accepts valid dates and normalizes them for the GHL webhook", () => {
    expect(toWl2IsoDateOfBirth("08/11/1986")).toBe("1986-08-11");
    expect(toWl2IsoDateOfBirth("02/30/1986")).toBeNull();
  });
});
