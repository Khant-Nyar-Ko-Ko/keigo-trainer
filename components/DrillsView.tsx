"use client";

import { useState } from "react";
import Quiz from "./Quiz";
import WordQuiz from "./WordQuiz";

type DrillMode = "verbs" | "words";

const TABS: { id: DrillMode; label: string }[] = [
  { id: "verbs", label: "Verbs" },
  { id: "words", label: "Words" },
];

export default function DrillsView() {
  const [mode, setMode] = useState<DrillMode>("verbs");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="flex border border-line-strong">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            aria-current={mode === tab.id ? "true" : undefined}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              mode === tab.id
                ? "bg-ink text-paper"
                : "text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {mode === "verbs" ? <Quiz /> : <WordQuiz />}
    </div>
  );
}
