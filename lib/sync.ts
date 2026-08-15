import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";
import type { Database } from "./supabase/types";
import { loadProgress, PROGRESS_STORAGE_KEY } from "./progress";
import { loadScenarioProgress, SCENARIO_PROGRESS_STORAGE_KEY } from "./scenario-progress";
import { loadStats, STATS_STORAGE_KEY, StatsMode } from "./stats";

type Client = SupabaseClient<Database>;

function mergedFlagKey(userId: string): string {
  return `keigo-trainer-merged-${userId}`;
}

async function activeUserId(supabase: Client): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

// Fire-and-forget writers, called from lib/progress.ts, lib/scenario-progress.ts,
// and lib/stats.ts after every localStorage write. All no-op instantly (no
// network call) if Supabase isn't configured or nobody's signed in — this is
// what keeps anonymous mode exactly as fast/offline as it's always been.

export async function pushProgressDelta(key: string, delta: number): Promise<void> {
  const supabase = createClient();
  if (!supabase || !(await activeUserId(supabase))) return;
  await supabase.rpc("increment_progress", { p_key: key, p_delta: delta });
}

export async function pushScenarioProgressDelta(key: string, delta: number): Promise<void> {
  const supabase = createClient();
  if (!supabase || !(await activeUserId(supabase))) return;
  await supabase.rpc("increment_scenario_progress", { p_key: key, p_delta: delta });
}

export async function pushStatsDelta(
  mode: StatsMode,
  deltaCorrect: number,
  deltaTotal: number,
): Promise<void> {
  const supabase = createClient();
  if (!supabase || !(await activeUserId(supabase))) return;
  await supabase.rpc("increment_stats", {
    p_mode: mode,
    p_delta_correct: deltaCorrect,
    p_delta_total: deltaTotal,
  });
}

export async function pushProgressReset(): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  const userId = await activeUserId(supabase);
  if (!userId) return;
  await supabase.from("user_progress").update({ progress: {} }).eq("user_id", userId);
}

export async function pushScenarioProgressReset(): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  const userId = await activeUserId(supabase);
  if (!userId) return;
  await supabase.from("user_progress").update({ scenario_progress: {} }).eq("user_id", userId);
}

export async function pushStatsReset(): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  const userId = await activeUserId(supabase);
  if (!userId) return;
  await supabase
    .from("user_progress")
    .update({ stats: { drills: { correct: 0, total: 0 }, scenarios: { correct: 0, total: 0 } } })
    .eq("user_id", userId);
}

// Runs once per sign-in event (see components/AuthProvider.tsx). The first
// time this device has seen this account, it replays local counts into the
// server via the same atomic RPCs routine writes use — safe even if a drill
// happens mid-merge, since increments commute and can't clobber a concurrent
// write. Every sign-in (including subsequent ones on the same device) then
// pulls the current server state back down, which is what actually makes
// cross-device sync work: it's how this device learns about progress made
// elsewhere. Not real-time — fresh as of this sign-in/app-open.
export async function syncOnSignIn(userId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  const flagKey = mergedFlagKey(userId);
  if (!window.localStorage.getItem(flagKey)) {
    const merged = await mergeLocalIntoServer(supabase);
    // Only mark this device as merged once the server write is confirmed —
    // a failed merge is safe to retry on the next sign-in, not silently lost.
    if (merged) window.localStorage.setItem(flagKey, "1");
  }

  await pullServerIntoLocal(supabase, userId);
}

async function mergeLocalIntoServer(supabase: Client): Promise<boolean> {
  try {
    const progress = loadProgress();
    for (const [key, misses] of Object.entries(progress)) {
      if (misses <= 0) continue;
      const { error } = await supabase.rpc("increment_progress", { p_key: key, p_delta: misses });
      if (error) throw error;
    }

    const scenarioProgress = loadScenarioProgress();
    for (const [key, misses] of Object.entries(scenarioProgress)) {
      if (misses <= 0) continue;
      const { error } = await supabase.rpc("increment_scenario_progress", {
        p_key: key,
        p_delta: misses,
      });
      if (error) throw error;
    }

    const stats = loadStats();
    for (const mode of ["drills", "scenarios"] as const) {
      const { correct, total } = stats[mode];
      if (total <= 0) continue;
      const { error } = await supabase.rpc("increment_stats", {
        p_mode: mode,
        p_delta_correct: correct,
        p_delta_total: total,
      });
      if (error) throw error;
    }

    return true;
  } catch {
    return false;
  }
}

async function pullServerIntoLocal(supabase: Client, userId: string): Promise<void> {
  const { data: existing } = await supabase
    .from("user_progress")
    .select("progress, scenario_progress, stats")
    .eq("user_id", userId)
    .maybeSingle();

  const row =
    existing ??
    (
      await supabase
        .from("user_progress")
        .insert({ user_id: userId })
        .select("progress, scenario_progress, stats")
        .single()
    ).data;

  if (!row) return;

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(row.progress ?? {}));
  window.localStorage.setItem(
    SCENARIO_PROGRESS_STORAGE_KEY,
    JSON.stringify(row.scenario_progress ?? {}),
  );
  window.localStorage.setItem(
    STATS_STORAGE_KEY,
    JSON.stringify(
      row.stats ?? { drills: { correct: 0, total: 0 }, scenarios: { correct: 0, total: 0 } },
    ),
  );
}
