import { storageRepo } from "./storage/LocalStorageRepo";
import { pushWordProgressDelta, pushWordProgressReset } from "./sync";
import { HonorificTarget } from "./verbs";
import { conjugateWord, WORD_BANK, WordEntry } from "./words";

export const WORD_PROGRESS_STORAGE_KEY = "keigo-trainer-word-progress";
const STORAGE_KEY = WORD_PROGRESS_STORAGE_KEY;

export type WordProgress = Record<string, number>;

function questionKey(wordId: string, target: HonorificTarget): string {
  return `${wordId}_${target}`;
}

export function loadWordProgress(): WordProgress {
  return storageRepo.getItem<WordProgress>(STORAGE_KEY) ?? {};
}

export function recordWordMiss(wordId: string, target: HonorificTarget): WordProgress {
  const progress = loadWordProgress();
  const key = questionKey(wordId, target);
  progress[key] = (progress[key] ?? 0) + 1;
  storageRepo.setItem(STORAGE_KEY, progress);
  void pushWordProgressDelta(key, 1);
  return progress;
}

export function resetWordProgress(): void {
  storageRepo.removeItem(STORAGE_KEY);
  void pushWordProgressReset();
}

export interface WeakWord {
  word: WordEntry;
  target: HonorificTarget;
  misses: number;
}

export function weakestWords(progress: WordProgress, limit = 6): WeakWord[] {
  const entries: WeakWord[] = [];
  for (const word of WORD_BANK) {
    for (const target of ["sonkeigo", "kenjougo"] as const) {
      if (conjugateWord(word, target) === null) continue;
      const misses = progress[questionKey(word.id, target)] ?? 0;
      if (misses > 0) entries.push({ word, target, misses });
    }
  }
  return entries.sort((a, b) => b.misses - a.misses).slice(0, limit);
}

export interface WordQuestion {
  word: WordEntry;
  target: HonorificTarget;
}

// Leitner-style weighting, same approach as lib/progress.ts.
export function pickWord(progress: WordProgress, exclude?: WordQuestion): WordQuestion {
  const candidates: (WordQuestion & { weight: number })[] = [];
  for (const word of WORD_BANK) {
    for (const target of ["sonkeigo", "kenjougo"] as const) {
      if (conjugateWord(word, target) === null) continue;
      if (exclude && exclude.word.id === word.id && exclude.target === target) continue;
      const weight = (progress[questionKey(word.id, target)] ?? 0) + 1;
      candidates.push({ word, target, weight });
    }
  }
  const pool =
    candidates.length > 0
      ? candidates
      : [
          {
            word: WORD_BANK[0],
            target: "sonkeigo" as HonorificTarget,
            weight: 1,
          },
        ];
  const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * totalWeight;
  for (const c of pool) {
    r -= c.weight;
    if (r <= 0) return { word: c.word, target: c.target };
  }
  return { word: pool[0].word, target: pool[0].target };
}
