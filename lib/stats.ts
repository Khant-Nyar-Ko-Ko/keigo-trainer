import { pushStatsDelta, pushStatsReset } from "./sync";

export const STATS_STORAGE_KEY = "keigo-trainer-stats";
const STORAGE_KEY = STATS_STORAGE_KEY;

export type StatsMode = "drills" | "scenarios";

export interface ModeStats {
  correct: number;
  total: number;
}

export type Stats = Record<StatsMode, ModeStats>;

const EMPTY: Stats = {
  drills: { correct: 0, total: 0 },
  scenarios: { correct: 0, total: 0 },
};

export function loadStats(): Stats {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Stats) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function recordAttempt(mode: StatsMode, correct: boolean): Stats {
  const stats = loadStats();
  stats[mode] = {
    correct: stats[mode].correct + (correct ? 1 : 0),
    total: stats[mode].total + 1,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  void pushStatsDelta(mode, correct ? 1 : 0, 1);
  return stats;
}

export function resetStats(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  void pushStatsReset();
}
