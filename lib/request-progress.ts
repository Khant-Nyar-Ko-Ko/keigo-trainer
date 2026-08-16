import { REQUEST_BANK, RequestScenario } from "./requests";
import { storageRepo } from "./storage/LocalStorageRepo";
import { pushRequestProgressDelta, pushRequestProgressReset } from "./sync";

export const REQUEST_PROGRESS_STORAGE_KEY = "keigo-trainer-request-progress";
const STORAGE_KEY = REQUEST_PROGRESS_STORAGE_KEY;

export type RequestProgress = Record<string, number>;

export function loadRequestProgress(): RequestProgress {
  return storageRepo.getItem<RequestProgress>(STORAGE_KEY) ?? {};
}

export function recordRequestMiss(scenarioId: string): RequestProgress {
  const progress = loadRequestProgress();
  progress[scenarioId] = (progress[scenarioId] ?? 0) + 1;
  storageRepo.setItem(STORAGE_KEY, progress);
  void pushRequestProgressDelta(scenarioId, 1);
  return progress;
}

export function resetRequestProgress(): void {
  storageRepo.removeItem(STORAGE_KEY);
  void pushRequestProgressReset();
}

export interface WeakRequest {
  scenario: RequestScenario;
  misses: number;
}

export function weakestRequests(progress: RequestProgress, limit = 6): WeakRequest[] {
  return REQUEST_BANK.map((scenario) => ({
    scenario,
    misses: progress[scenario.id] ?? 0,
  }))
    .filter((entry) => entry.misses > 0)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, limit);
}

// Leitner-style weighting, same approach as lib/scenario-progress.ts.
export function pickRequest(
  progress: RequestProgress,
  exclude?: RequestScenario,
): RequestScenario {
  const pool = REQUEST_BANK.filter((s) => !exclude || s.id !== exclude.id);
  const candidates = pool.length > 0 ? pool : REQUEST_BANK;
  const weights = candidates.map((s) => (progress[s.id] ?? 0) + 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[0];
}
