import { Scenario, scenarioAcceptableAnswers, scenarioCorrectAnswer, scenarioVerb } from "./scenarios";
import { conjugate, HonorificTarget } from "./verbs";

function normalize(s: string): string {
  return s.trim().replace(/[。.!！?？\s]/g, "");
}

export type MistakeType = "correct" | "wrong-register" | "other" | "blank";

export interface ScenarioGradeResult {
  correct: boolean;
  canonicalAnswer: string | null;
  mistakeType: MistakeType;
}

// Free, code-only diagnosis: most scenario mistakes are learners picking the
// wrong honorific *category* for the situation, not mis-conjugating within
// the right one. Detecting that needs no LLM call — the answer key already
// knows what the other category's form looks like.
export function gradeScenarioAnswer(userAnswer: string, scenario: Scenario): ScenarioGradeResult {
  const canonicalAnswer = scenarioCorrectAnswer(scenario);
  const accepted = scenarioAcceptableAnswers(scenario).map(normalize);
  const normalizedUser = normalize(userAnswer);

  if (!normalizedUser) {
    return { correct: false, canonicalAnswer, mistakeType: "blank" };
  }
  if (accepted.includes(normalizedUser)) {
    return { correct: true, canonicalAnswer, mistakeType: "correct" };
  }

  const otherTarget: HonorificTarget = scenario.targetRegister === "sonkeigo" ? "kenjougo" : "sonkeigo";
  const otherAnswer = conjugate(scenarioVerb(scenario), otherTarget);
  if (otherAnswer && normalize(otherAnswer) === normalizedUser) {
    return { correct: false, canonicalAnswer, mistakeType: "wrong-register" };
  }

  return { correct: false, canonicalAnswer, mistakeType: "other" };
}
