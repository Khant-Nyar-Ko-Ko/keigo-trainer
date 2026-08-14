"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScenarioGradeResult, gradeScenarioAnswer } from "@/lib/scenario-grade";
import { loadScenarioProgress, pickScenario, recordScenarioMiss } from "@/lib/scenario-progress";
import { CATEGORY_LABEL, Scenario, scenarioVerb } from "@/lib/scenarios";
import { recordAttempt } from "@/lib/stats";
import { TARGET_LABEL } from "@/lib/verbs";

const SESSION_LENGTH = 10;

export default function ScenarioPractice() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScenarioGradeResult | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setScenario(pickScenario(loadScenarioProgress()));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scenario || result) return;

    const graded = gradeScenarioAnswer(input, scenario);
    setResult(graded);
    setStats((s) => ({ correct: s.correct + (graded.correct ? 1 : 0), total: s.total + 1 }));
    recordAttempt("scenarios", graded.correct);

    if (!graded.correct) {
      recordScenarioMiss(scenario.id);
    }
  }

  function handleNext() {
    if (stats.total >= SESSION_LENGTH) {
      setSessionComplete(true);
      return;
    }
    setScenario(pickScenario(loadScenarioProgress(), scenario ?? undefined));
    setInput("");
    setResult(null);
  }

  function handleContinue() {
    setStats({ correct: 0, total: 0 });
    setSessionComplete(false);
    setScenario(pickScenario(loadScenarioProgress()));
    setInput("");
    setResult(null);
  }

  if (!scenario) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  const verb = scenarioVerb(scenario);

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {!sessionComplete && (
        <div className="text-right text-sm text-ink-faint">
          {stats.correct} / {stats.total} correct
        </div>
      )}

      {sessionComplete ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 border border-line bg-paper-raised p-8 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-red">
            Session complete
          </span>
          <div className="font-display text-4xl">
            {stats.correct} / {stats.total}
          </div>
          <p className="text-sm text-ink-soft">
            {Math.round((stats.correct / stats.total) * 100)}% correct this session.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              className="bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-red-deep"
            >
              Keep going
            </button>
            <Link
              href="/progress"
              className="border border-line-strong px-4 py-2 text-sm hover:bg-paper-sunken"
            >
              View progress
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border border-line bg-paper-raised p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-red">
              {CATEGORY_LABEL[scenario.category]}
            </span>
            <p className="text-ink-soft">{scenario.setting}</p>
            <p className="text-sm text-ink-faint">Other party: {scenario.otherParty}</p>
            <p className="font-semibold text-ink">{scenario.promptCue}</p>
            <div className="mt-1 flex items-baseline gap-2 text-lg">
              <span lang="ja" className="font-display">
                {verb.dictionaryForm}
              </span>
              <span className="text-sm text-ink-faint">
                <span lang="ja">{verb.reading}</span> — {verb.meaning}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!result}
              placeholder="Which register — and what's the form?"
              autoFocus
              className="border border-line-strong bg-paper px-4 py-3 text-lg text-ink outline-none focus:border-red disabled:opacity-60"
            />
            {!result && (
              <button
                type="submit"
                className="bg-ink px-4 py-3 font-medium text-paper hover:bg-red-deep"
              >
                Check
              </button>
            )}
          </form>

          {result && (
            <div
              role="status"
              aria-live="polite"
              className={`flex flex-col gap-3 border p-4 ${
                result.correct ? "border-green bg-green-soft" : "border-red bg-red-soft"
              }`}
            >
              <div className="font-semibold">
                {result.correct
                  ? "Correct!"
                  : result.mistakeType === "wrong-register"
                    ? "Wrong register — the conjugation itself was fine."
                    : "Not quite."}
              </div>
              <div className="text-sm text-ink-soft">
                Correct answer:{" "}
                <span lang="ja" className="font-semibold text-ink">
                  {result.canonicalAnswer}
                </span>{" "}
                (<span lang="ja">{TARGET_LABEL[scenario.targetRegister]}</span>)
              </div>
              <div className="bg-paper-raised p-3 text-sm text-ink-soft">
                {scenario.explanation}
                {scenario.flipCase && (
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-red">
                    Classic uchi/soto gotcha — worth remembering.
                  </div>
                )}
              </div>
              <button
                onClick={handleNext}
                className="self-start bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-red-deep"
              >
                Next scenario
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
