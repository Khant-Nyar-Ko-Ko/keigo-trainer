import {
  acceptableAnswers,
  conjugate,
  HonorificTarget,
  VerbEntry,
} from "./verbs";

function normalize(s: string): string {
  return s.trim().replace(/[。.!！?？\s]/g, "");
}

export interface GradeResult {
  correct: boolean;
  canonicalAnswer: string | null;
}

export function gradeAnswer(
  userAnswer: string,
  verb: VerbEntry,
  target: HonorificTarget,
): GradeResult {
  const canonicalAnswer = conjugate(verb, target);
  const accepted = acceptableAnswers(verb, target).map(normalize);
  const normalizedUser = normalize(userAnswer);
  return {
    correct: accepted.length > 0 && accepted.includes(normalizedUser),
    canonicalAnswer,
  };
}
