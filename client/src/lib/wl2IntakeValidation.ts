import { toWl2IsoDateOfBirth } from "./wl2DateOfBirth";

export interface Wl2IntakeAnswers {
  weightGoal: string;
  weightDuration: string;
  glp1Before: "yes" | "no" | "";
  glp1Details: string;
  conditions: string[];
  medications: string;
  hasLabs: "yes" | "no" | "";
  primaryGoal: string;
  activityLevel: string;
  heightFt: string;
  heightIn: string;
  weight: string;
  dateOfBirth: string;
  sex: string;
}

export const WL2_SCROLL_AFFORDANCE_LABEL = "Show more required intake questions";

export function isWl2IntakeComplete(answers: Wl2IntakeAnswers): boolean {
  return (
    answers.weightGoal.trim() !== "" &&
    answers.weightDuration !== "" &&
    answers.glp1Before !== "" &&
    answers.sex !== "" &&
    answers.heightFt !== "" &&
    answers.heightIn !== "" &&
    answers.weight !== "" &&
    toWl2IsoDateOfBirth(answers.dateOfBirth) !== null &&
    answers.conditions.length > 0 &&
    answers.medications.trim() !== "" &&
    answers.hasLabs !== "" &&
    answers.primaryGoal !== "" &&
    answers.activityLevel !== "" &&
    (answers.glp1Before !== "yes" || answers.glp1Details.trim() !== "")
  );
}

export function getWl2IntakeNextButtonState(answers: Wl2IntakeAnswers) {
  return {
    disabled: !isWl2IntakeComplete(answers),
    label: "Next →",
  } as const;
}
