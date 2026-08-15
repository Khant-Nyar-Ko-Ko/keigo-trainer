"use client";

import { Database, Download, Trash2 } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { loadProgress, resetProgress } from "@/lib/progress";
import { loadScenarioProgress, resetScenarioProgress } from "@/lib/scenario-progress";
import { SCENARIO_BANK } from "@/lib/scenarios";
import { loadStats, resetStats } from "@/lib/stats";

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPanel() {
  const { status, session } = useAuth();
  const signedIn = status === "signed-in" && !!session;

  function handleExport() {
    download("keigo-trainer-progress.json", {
      exportedAt: new Date().toISOString(),
      stats: loadStats(),
      progress: loadProgress(),
      scenarioProgress: loadScenarioProgress(),
    });
  }

  function handleClear() {
    if (!window.confirm("Clear all saved progress? This can't be undone.")) return;
    resetStats();
    resetProgress();
    resetScenarioProgress();
    window.location.reload();
  }

  return (
    <div className="flex flex-col w-full max-w-lg gap-6">
      <div className="flex flex-col gap-3 p-6 border border-line bg-paper-raised">
        <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
          Your data
        </span>
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <Database size={14} className="shrink-0 text-ink-faint" />
          {signedIn
            ? "Synced to your account across devices."
            : "Saved locally in this browser only — no account, no server."}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-line-strong text-ink-soft hover:border-accent hover:text-accent"
          >
            <Download size={14} />
            Export data (JSON)
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-incorrect/40 text-incorrect hover:border-incorrect hover:bg-incorrect-soft"
          >
            <Trash2 size={14} />
            Clear local progress
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-6 text-sm border border-line bg-paper-raised">
        <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
          Content &amp; cost
        </span>
        <p className="text-ink-soft">
          Scenario bank: {SCENARIO_BANK.length} hand-authored scenarios (expanding toward
          150–300).
        </p>
        <p className="text-ink-soft">
          Drills and scenarios are graded deterministically, at zero marginal cost. AI
          explanations are a capped fallback, not the primary experience.
        </p>
      </div>
    </div>
  );
}
