import { conjugate, HonorificTarget, VERB_BANK, VerbEntry } from "./verbs";

const STORAGE_KEY = "keigo-trainer-progress";

export type Progress = Record<string, number>;

function questionKey(verbId: string, target: HonorificTarget): string {
  return `${verbId}_${target}`;
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function recordMiss(verbId: string, target: HonorificTarget): Progress {
  const progress = loadProgress();
  const key = questionKey(verbId, target);
  progress[key] = (progress[key] ?? 0) + 1;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
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
