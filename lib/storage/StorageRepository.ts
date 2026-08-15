// Port abstracting where progress/usage state lives. Everything in lib/ that
// persists learner state (progress.ts, scenario-progress.ts, stats.ts, the
// explain-usage cap) reads and writes through this interface instead of
// calling localStorage directly, so Phase 3's Supabase-backed implementation
// can swap in without touching any of their business logic.
export interface StorageRepository {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}
