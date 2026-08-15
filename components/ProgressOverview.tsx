"use client";

import { useEffect, useState } from "react";
import {
  loadProgress,
  Progress,
  resetProgress,
  weakestVerbs,
} from "@/lib/progress";
import {
  loadScenarioProgress,
  resetScenarioProgress,
  ScenarioProgress,
  weakestScenarios,
} from "@/lib/scenario-progress";
import { CATEGORY_LABEL } from "@/lib/scenarios";
import { loadStats, ModeStats, resetStats, Stats } from "@/lib/stats";
import { TARGET_LABEL } from "@/lib/verbs";
import { useAuth } from "./AuthProvider";

function AccuracyBar({ label, stats }: { label: string; stats: ModeStats }) {
  const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-faint">
          {stats.total > 0 ? `${stats.correct} / ${stats.total} · ${pct}%` : "No attempts yet"}
        </span>
      </div>
      <div className="h-1.5 w-full bg-paper-sunken">
        <div className="h-1.5 bg-red" style={{ width: `${pct ?? 0}%` }} />
      </div>
    </div>
  );
}

export default function ProgressOverview() {
  const { lastSyncedAt } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [scenarioProgress, setScenarioProgress] = useState<ScenarioProgress | null>(null);

  useEffect(() => {
    setStats(loadStats());
    setProgress(loadProgress());
    setScenarioProgress(loadScenarioProgress());
    // Re-load once a background sync-on-sign-in completes, so numbers here
    // don't stay stale if this page was open at the moment of sign-in.
  }, [lastSyncedAt]);

  function handleReset() {
    if (!window.confirm("Clear all saved progress? This can't be undone.")) return;
    resetStats();
    resetProgress();
    resetScenarioProgress();
    setStats(loadStats());
    setProgress(loadProgress());
    setScenarioProgress(loadScenarioProgress());
  }

  if (!stats || !progress || !scenarioProgress) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  const weakVerbs = weakestVerbs(progress);
  const weakScenarios = weakestScenarios(scenarioProgress);
  const hasAnyData =
    stats.drills.total > 0 || stats.scenarios.total > 0 || weakVerbs.length > 0 || weakScenarios.length > 0;

  return (
    <div className="flex flex-col w-full max-w-lg gap-6">
      <div className="flex flex-col gap-4 p-6 border border-line bg-paper-raised">
        <span className="text-xs font-semibold tracking-wide uppercase text-red">
          Lifetime accuracy
        </span>
        <AccuracyBar label="Drills" stats={stats.drills} />
        <AccuracyBar label="Scenarios" stats={stats.scenarios} />
      </div>

      <div className="flex flex-col gap-3 p-6 border border-line bg-paper-raised">
        <span className="text-xs font-semibold tracking-wide uppercase text-red">
          Verbs to review
        </span>
        {weakVerbs.length === 0 ? (
          <p className="text-sm text-ink-faint">
            No misses yet — nice. This fills in as you drill.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {weakVerbs.map(({ verb, target, misses }) => (
              <li
                key={`${verb.id}-${target}`}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-display">{verb.dictionaryForm}</span>
                  <span className="text-sm text-ink-faint">
                    {verb.reading} — {verb.meaning}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-ink-soft">{TARGET_LABEL[target]}</span>
                  <span className="border border-line-strong px-1.5 py-0.5 text-ink-faint">
                    {misses}×
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 p-6 border border-line bg-paper-raised">
        <span className="text-xs font-semibold tracking-wide uppercase text-red">
          Scenarios to review
        </span>
        {weakScenarios.length === 0 ? (
          <p className="text-sm text-ink-faint">
            No misses yet — nice. This fills in as you practice.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {weakScenarios.map(({ scenario, misses }) => (
              <li key={scenario.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs tracking-wide uppercase text-ink-faint">
                    {CATEGORY_LABEL[scenario.category]}
                  </span>
                  <span className="text-sm text-ink">{scenario.promptCue}</span>
                </div>
                <span className="border border-line-strong px-1.5 py-0.5 text-xs text-ink-faint">
                  {misses}×
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasAnyData && (
        <button
          onClick={handleReset}
          className="self-center text-xs underline text-ink-faint decoration-line-strong underline-offset-4 hover:text-red"
        >
          Reset all progress
        </button>
      )}
    </div>
  );
}
