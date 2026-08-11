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

export type Wl2MissingField =
  | "heightFt"
  | "heightIn"
  | "weight"
  | "dateOfBirth"
  | "sex"
  | "weightGoal"
  | "weightDuration"
  | "glp1Before"
  | "glp1Details"
  | "conditions"
  | "medications"
  | "hasLabs"
  | "primaryGoal"
  | "activityLevel";

export const WL2_FIELD_LABELS: Record<Wl2MissingField, string> = {
  heightFt: "Height (ft)",
  heightIn: "Height (in)",
  weight: "Weight (lbs)",
  dateOfBirth: "Date of Birth",
  sex: "Sex assigned at birth",
  weightGoal: "weight-loss goal",
  weightDuration: "weight history",
  glp1Before: "GLP-1 treatment history",
  glp1Details: "previous GLP-1 details",
  conditions: "medical conditions",
  medications: "Current medications & supplements",
  hasLabs: "lab availability",
  primaryGoal: "primary goal",
  activityLevel: "activity level",
};

export function getWl2FirstMissingField(answers: Wl2IntakeAnswers): Wl2MissingField | null {
  if (answers.heightFt === "") return "heightFt";
  if (answers.heightIn === "") return "heightIn";
  if (answers.weight === "") return "weight";
  if (toWl2IsoDateOfBirth(answers.dateOfBirth) === null) return "dateOfBirth";
  if (answers.sex === "") return "sex";
  if (answers.weightGoal.trim() === "") return "weightGoal";
  if (answers.weightDuration === "") return "weightDuration";
  if (answers.glp1Before === "") return "glp1Before";
  if (answers.glp1Before === "yes" && answers.glp1Details.trim() === "") return "glp1Details";
  if (answers.conditions.length === 0) return "conditions";
  if (answers.medications.trim() === "") return "medications";
  if (answers.hasLabs === "") return "hasLabs";
  if (answers.primaryGoal === "") return "primaryGoal";
  if (answers.activityLevel === "") return "activityLevel";
  return null;
}

export function isWl2IntakeComplete(answers: Wl2IntakeAnswers): boolean {
  return getWl2FirstMissingField(answers) === null;
}

export function getWl2IntakeNextButtonState(answers: Wl2IntakeAnswers) {
  return {
    disabled: !isWl2IntakeComplete(answers),
    label: "Next →",
  } as const;
}
