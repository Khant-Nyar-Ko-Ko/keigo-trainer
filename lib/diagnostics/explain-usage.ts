import { storageRepo } from "../storage/LocalStorageRepo";

const USAGE_KEY = "keigo-trainer-explain-usage";
export const DAILY_EXPLAIN_CAP = 5;

interface UsageRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentUsage(): UsageRecord {
  const stored = storageRepo.getItem<UsageRecord>(USAGE_KEY);
  if (!stored || stored.date !== today()) return { date: today(), count: 0 };
  return stored;
}

export function explainUsesRemaining(): number {
  return Math.max(0, DAILY_EXPLAIN_CAP - currentUsage().count);
}

export function canRequestExplanation(): boolean {
  return explainUsesRemaining() > 0;
}

export function recordExplanationUsed(): void {
  const usage = currentUsage();
  storageRepo.setItem<UsageRecord>(USAGE_KEY, { date: usage.date, count: usage.count + 1 });
}
