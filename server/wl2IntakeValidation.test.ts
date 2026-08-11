import { describe, expect, it } from "vitest";
import { getWl2IntakeNextButtonState, isWl2IntakeComplete, WL2_SCROLL_AFFORDANCE_LABEL, type Wl2IntakeAnswers } from "../client/src/lib/wl2IntakeValidation";

const completeAnswers: Wl2IntakeAnswers = {
  weightGoal: "21–40 lbs",
  weightDuration: "1–3 years",
  glp1Before: "no",
  glp1Details: "",
  conditions: ["None of the above"],
  medications: "None",
  hasLabs: "no",
  primaryGoal: "Weight loss",
  activityLevel: "Lightly active",
  heightFt: "5",
  heightIn: "6",
  weight: "180",
  dateOfBirth: "08/11/1986",
  sex: "Female",
};

describe("WL2 intake completion", () => {
  it("allows progression only when all visible required answers are present", () => {
    expect(isWl2IntakeComplete(completeAnswers)).toBe(true);
    expect(isWl2IntakeComplete({ ...completeAnswers, heightIn: "" })).toBe(false);
    expect(isWl2IntakeComplete({ ...completeAnswers, dateOfBirth: "" })).toBe(false);
    expect(isWl2IntakeComplete({ ...completeAnswers, dateOfBirth: "08/44/1986" })).toBe(false);
    expect(isWl2IntakeComplete({ ...completeAnswers, medications: "" })).toBe(false);
  });

  it("requires GLP-1 details when the patient selects Yes", () => {
    expect(isWl2IntakeComplete({ ...completeAnswers, glp1Before: "yes", glp1Details: "" })).toBe(false);
    expect(isWl2IntakeComplete({ ...completeAnswers, glp1Before: "yes", glp1Details: "Semaglutide, 0.5 mg" })).toBe(true);
  });

  it("enables the visual Next button when the completed form is ready to advance", () => {
    expect(getWl2IntakeNextButtonState(completeAnswers)).toEqual({ disabled: false, label: "Next →" });
    expect(getWl2IntakeNextButtonState({ ...completeAnswers, activityLevel: "" }).disabled).toBe(true);
    expect(WL2_SCROLL_AFFORDANCE_LABEL).toBe("Show more required intake questions");
  });
});
