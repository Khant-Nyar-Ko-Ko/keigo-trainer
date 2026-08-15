import { storageRepo } from "./storage/LocalStorageRepo";
import { Scenario, SCENARIO_BANK } from "./scenarios";
import { pushScenarioProgressDelta, pushScenarioProgressReset } from "./sync";

export const SCENARIO_PROGRESS_STORAGE_KEY = "keigo-trainer-scenario-progress";
const STORAGE_KEY = SCENARIO_PROGRESS_STORAGE_KEY;

export type ScenarioProgress = Record<string, number>;

export function loadScenarioProgress(): ScenarioProgress {
  return storageRepo.getItem<ScenarioProgress>(STORAGE_KEY) ?? {};
}

export function recordScenarioMiss(scenarioId: string): ScenarioProgress {
  const progress = loadScenarioProgress();
  progress[scenarioId] = (progress[scenarioId] ?? 0) + 1;
  storageRepo.setItem(STORAGE_KEY, progress);
  void pushScenarioProgressDelta(scenarioId, 1);
  return progress;
}

export function resetScenarioProgress(): void {
  storageRepo.removeItem(STORAGE_KEY);
  void pushScenarioProgressReset();
}

export interface WeakScenario {
  scenario: Scenario;
  misses: number;
}

export function weakestScenarios(
  progress: ScenarioProgress,
  limit = 6,
): WeakScenario[] {
  return SCENARIO_BANK.map((scenario) => ({
    scenario,
    misses: progress[scenario.id] ?? 0,
  }))
    .filter((entry) => entry.misses > 0)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, limit);
}

// Leitner-style weighting, same approach as lib/progress.ts: scenarios missed
// more often surface more often.
export function pickScenario(
  progress: ScenarioProgress,
  exclude?: Scenario,
): Scenario {
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
