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

export function isWl2IntakeComplete(answers: Wl2IntakeAnswers): boolean {
  return (
    answers.weightGoal.trim() !== "" &&
    answers.weightDuration !== "" &&
    answers.glp1Before !== "" &&
    answers.sex !== "" &&
    answers.heightFt !== "" &&
    answers.heightIn !== "" &&
    answers.weight !== "" &&
    /^\d{4}-\d{2}-\d{2}$/.test(answers.dateOfBirth) &&
    answers.conditions.length > 0 &&
    answers.medications.trim() !== "" &&
    answers.hasLabs !== "" &&
    answers.primaryGoal !== "" &&
    answers.activityLevel !== "" &&
    (answers.glp1Before !== "yes" || answers.glp1Details.trim() !== "")
  );
}
