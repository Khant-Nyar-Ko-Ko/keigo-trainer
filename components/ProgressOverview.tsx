"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, Progress, weakestVerbs } from "@/lib/progress";
import {
  loadScenarioProgress,
  ScenarioProgress,
  weakestScenarios,
} from "@/lib/scenario-progress";
import { CATEGORY_LABEL } from "@/lib/scenarios";
import { loadStats, ModeStats, Stats } from "@/lib/stats";
import { TARGET_LABEL } from "@/lib/verbs";
import { useAuth } from "./AuthProvider";

function AccuracyCard({ label, stats, href }: { label: string; stats: ModeStats; href: string }) {
  const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  return (
    <div className="flex flex-col gap-3 border border-line bg-paper-raised p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {label}
        </span>
        <Link href={href} className="text-xs text-accent hover:text-accent-deep">
          Practice →
        </Link>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl text-ink">{pct ?? "—"}</span>
        {pct !== null && <span className="text-lg text-ink-faint">%</span>}
      </div>
      <div className="h-1.5 w-full bg-paper-sunken">
        <div className="h-1.5 bg-correct" style={{ width: `${pct ?? 0}%` }} />
      </div>
      <span className="text-xs text-ink-faint">
        {stats.total > 0 ? `${stats.correct} / ${stats.total} correct` : "No attempts yet"}
      </span>
    </div>
  );
}

export default function ProgressOverview() {
  const { status, lastSyncedAt } = useAuth();
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

  if (!stats || !progress || !scenarioProgress) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  const weakVerbs = weakestVerbs(progress, 8);
  const weakScenarios = weakestScenarios(scenarioProgress, 8);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      {status === "signed-out" && (
        <div className="flex flex-col items-center justify-between gap-3 border border-line bg-paper-raised p-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-ink-soft">
            This progress lives only on this device.{" "}
            <span className="text-ink-faint">Sign in to sync it across devices.</span>
          </p>
          <Link
            href="/login"
            className="shrink-0 border border-line-strong px-3 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent"
          >
            Sign in →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AccuracyCard label="Verb drills" stats={stats.drills} href="/drills" />
        <AccuracyCard label="Scenario practice" stats={stats.scenarios} href="/scenarios" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 border border-line bg-paper-raised p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
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
                    <span lang="ja" className="font-display text-lg">
                      {verb.dictionaryForm}
                    </span>
                    <span className="text-sm text-ink-faint">
                      <span lang="ja">{verb.reading}</span> — {verb.meaning}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      lang="ja"
                      className={target === "sonkeigo" ? "text-sonkeigo" : "text-kenjougo"}
                    >
                      {TARGET_LABEL[target]}
                    </span>
                    <span className="border border-line-strong px-1.5 py-0.5 text-ink-faint">
                      {misses}×
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 border border-line bg-paper-raised p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
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
                    <span className="text-xs uppercase tracking-wide text-ink-faint">
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
      </div>

      <p className="self-center text-xs text-ink-faint">
        Manage or export your saved progress in{" "}
        <Link href="/settings" className="text-accent hover:text-accent-deep">
          Settings
        </Link>
        .
      </p>
    </div>
  );
}
