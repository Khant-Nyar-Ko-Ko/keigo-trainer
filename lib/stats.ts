import { storageRepo } from "./storage/LocalStorageRepo";
import { pushStatsDelta, pushStatsReset } from "./sync";

export const STATS_STORAGE_KEY = "keigo-trainer-stats";
const STORAGE_KEY = STATS_STORAGE_KEY;

export type StatsMode = "drills" | "scenarios" | "words" | "requests";

export interface ModeStats {
  correct: number;
  total: number;
}

export type Stats = Record<StatsMode, ModeStats>;

const EMPTY: Stats = {
  drills: { correct: 0, total: 0 },
  scenarios: { correct: 0, total: 0 },
  words: { correct: 0, total: 0 },
  requests: { correct: 0, total: 0 },
};

export function loadStats(): Stats {
  const stored = storageRepo.getItem<Stats>(STORAGE_KEY);
  return stored ? { ...EMPTY, ...stored } : EMPTY;
}

export function recordAttempt(mode: StatsMode, correct: boolean): Stats {
  const stats = loadStats();
  stats[mode] = {
    correct: stats[mode].correct + (correct ? 1 : 0),
    total: stats[mode].total + 1,
  };
  storageRepo.setItem(STORAGE_KEY, stats);
  void pushStatsDelta(mode, correct ? 1 : 0, 1);
  return stats;
}

export function resetStats(): void {
  storageRepo.removeItem(STORAGE_KEY);
  void pushStatsReset();
}
