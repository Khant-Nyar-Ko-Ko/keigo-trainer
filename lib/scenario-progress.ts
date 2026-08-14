import { Scenario, SCENARIO_BANK } from "./scenarios";

const STORAGE_KEY = "keigo-trainer-scenario-progress";

export type ScenarioProgress = Record<string, number>;

export function loadScenarioProgress(): ScenarioProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScenarioProgress) : {};
  } catch {
    return {};
  }
}

export function recordScenarioMiss(scenarioId: string): ScenarioProgress {
  const progress = loadScenarioProgress();
  progress[scenarioId] = (progress[scenarioId] ?? 0) + 1;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

// Leitner-style weighting, same approach as lib/progress.ts: scenarios missed
// more often surface more often.
export function pickScenario(progress: ScenarioProgress, exclude?: Scenario): Scenario {
  const pool = SCENARIO_BANK.filter((s) => !exclude || s.id !== exclude.id);
  const candidates = pool.length > 0 ? pool : SCENARIO_BANK;
  const weights = candidates.map((s) => (progress[s.id] ?? 0) + 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[0];
}
