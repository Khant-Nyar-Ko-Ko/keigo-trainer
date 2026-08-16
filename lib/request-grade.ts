import {
  RequestScenario,
  RequestTier,
  requestForm,
  requestScenarioCorrectAnswer,
  requestScenarioVerb,
} from "./requests";

function normalize(s: string): string {
  return s.trim().replace(/[。.!!?？\s]/g, "");
}

export type RequestMistakeType = "correct" | "wrong-tier" | "other" | "blank";

export interface RequestGradeResult {
  correct: boolean;
  canonicalAnswer: string | null;
  mistakeType: RequestMistakeType;
}

const ALL_TIERS: RequestTier[] = ["casual", "polite", "formal"];

// Free, code-only diagnosis mirroring lib/scenario-grade.ts: the most common
// mistake here isn't a malformed て-form, it's picking the wrong tier for
// the social distance/imposition — and the answer key already knows what
// every other tier's form looks like for this verb.
export function gradeRequestAnswer(
  userAnswer: string,
  scenario: RequestScenario,
): RequestGradeResult {
  const canonicalAnswer = requestScenarioCorrectAnswer(scenario);
  const normalizedUser = normalize(userAnswer);

  if (!normalizedUser) {
    return { correct: false, canonicalAnswer, mistakeType: "blank" };
  }
  if (canonicalAnswer && normalize(canonicalAnswer) === normalizedUser) {
    return { correct: true, canonicalAnswer, mistakeType: "correct" };
  }

  const verb = requestScenarioVerb(scenario);
  const otherTierAnswer = ALL_TIERS.filter((t) => t !== scenario.targetTier)
    .map((tier) => requestForm(verb, tier))
    .find((form) => form && normalize(form) === normalizedUser);
  if (otherTierAnswer) {
    return { correct: false, canonicalAnswer, mistakeType: "wrong-tier" };
  }

  return { correct: false, canonicalAnswer, mistakeType: "other" };
}
