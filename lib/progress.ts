import { storageRepo } from "./storage/LocalStorageRepo";
import { conjugate, HonorificTarget, VERB_BANK, VerbEntry } from "./verbs";
import { pushProgressDelta, pushProgressReset } from "./sync";

export const PROGRESS_STORAGE_KEY = "keigo-trainer-progress";
const STORAGE_KEY = PROGRESS_STORAGE_KEY;

export type Progress = Record<string, number>;

function questionKey(verbId: string, target: HonorificTarget): string {
  return `${verbId}_${target}`;
}

export function loadProgress(): Progress {
  return storageRepo.getItem<Progress>(STORAGE_KEY) ?? {};
}

export function recordMiss(verbId: string, target: HonorificTarget): Progress {
  const progress = loadProgress();
  const key = questionKey(verbId, target);
  progress[key] = (progress[key] ?? 0) + 1;
  storageRepo.setItem(STORAGE_KEY, progress);
  void pushProgressDelta(key, 1);
  return progress;
}

export function resetProgress(): void {
  storageRepo.removeItem(STORAGE_KEY);
  void pushProgressReset();
}

export interface WeakVerb {
  verb: VerbEntry;
  target: HonorificTarget;
  misses: number;
}

// Same verb/target pairs pickQuestion weights toward, surfaced for display
// instead of just influencing selection odds.
export function weakestVerbs(progress: Progress, limit = 6): WeakVerb[] {
  const entries: WeakVerb[] = [];
  for (const verb of VERB_BANK) {
    for (const target of ["sonkeigo", "kenjougo"] as const) {
      if (conjugate(verb, target) === null) continue;
      const misses = progress[questionKey(verb.id, target)] ?? 0;
      if (misses > 0) entries.push({ verb, target, misses });
    }
  }
  return entries.sort((a, b) => b.misses - a.misses).slice(0, limit);
}

export interface Question {
  verb: VerbEntry;
  target: HonorificTarget;
}

// Leitner-style weighting: verbs missed more often are drawn more often.
export function pickQuestion(progress: Progress, exclude?: Question): Question {
  const candidates: (Question & { weight: number })[] = [];
  for (const verb of VERB_BANK) {
    for (const target of ["sonkeigo", "kenjougo"] as const) {
      if (conjugate(verb, target) === null) continue;
      if (exclude && exclude.verb.id === verb.id && exclude.target === target)
        continue;
      const weight = (progress[questionKey(verb.id, target)] ?? 0) + 1;
      candidates.push({ verb, target, weight });
    }
  }
  const pool =
    candidates.length > 0
      ? candidates
      : [
          {
            verb: VERB_BANK[0],
            target: "sonkeigo" as HonorificTarget,
            weight: 1,
          },
        ];
  const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * totalWeight;
  for (const c of pool) {
    r -= c.weight;
    if (r <= 0) return { verb: c.verb, target: c.target };
  }
  return { verb: pool[0].verb, target: pool[0].target };
}
