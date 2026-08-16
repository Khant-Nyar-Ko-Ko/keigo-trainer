import { HonorificTarget } from "./verbs";
import { acceptableWordAnswers, conjugateWord, WordEntry } from "./words";

function normalize(s: string): string {
  return s.trim().replace(/[。.!!?？\s]/g, "");
}

export interface WordGradeResult {
  correct: boolean;
  canonicalAnswer: string | null;
}

export function gradeWordAnswer(
  userAnswer: string,
  word: WordEntry,
  target: HonorificTarget,
): WordGradeResult {
  const canonicalAnswer = conjugateWord(word, target);
  const accepted = acceptableWordAnswers(word, target).map(normalize);
  const normalizedUser = normalize(userAnswer);
  return {
    correct: accepted.length > 0 && accepted.includes(normalizedUser),
    canonicalAnswer,
  };
}
