"use client";

import { CheckCircle2, MessageSquareQuote, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RequestGradeResult, gradeRequestAnswer } from "@/lib/request-grade";
import {
  loadRequestProgress,
  pickRequest,
  recordRequestMiss,
} from "@/lib/request-progress";
import { REQUEST_TIER_LABEL, RequestScenario, requestScenarioVerb } from "@/lib/requests";
import { recordAttempt } from "@/lib/stats";
import RequestTierScale from "./RequestTierScale";

const SESSION_LENGTH = 10;

export default function RequestPractice() {
  const [scenario, setScenario] = useState<RequestScenario | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<RequestGradeResult | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setScenario(pickRequest(loadRequestProgress()));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scenario || result) return;

    const graded = gradeRequestAnswer(input, scenario);
    setResult(graded);
    setStats((s) => ({ correct: s.correct + (graded.correct ? 1 : 0), total: s.total + 1 }));
    recordAttempt("requests", graded.correct);

    if (!graded.correct) {
      recordRequestMiss(scenario.id);
    }
  }

  function handleNext() {
    if (stats.total >= SESSION_LENGTH) {
      setSessionComplete(true);
      return;
    }
    setScenario(pickRequest(loadRequestProgress(), scenario ?? undefined));
    setInput("");
    setResult(null);
  }

  function handleContinue() {
    setStats({ correct: 0, total: 0 });
    setSessionComplete(false);
    setScenario(pickRequest(loadRequestProgress()));
    setInput("");
    setResult(null);
  }

  if (!scenario) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  const verb = requestScenarioVerb(scenario);

  const resultTone =
    result?.mistakeType === "correct"
      ? "correct"
      : result?.mistakeType === "wrong-tier"
        ? "partial"
        : "incorrect";

  return (
    <div className="flex flex-col w-full max-w-2xl gap-6">
      {!sessionComplete && (
        <div className="flex items-center justify-between px-4 py-2 border border-line bg-paper-raised">
          <span className="text-xs tracking-wide uppercase text-ink-faint">
            Scenario {stats.total + 1} of {SESSION_LENGTH}
          </span>
          <span className="text-sm font-semibold text-ink">
            {stats.correct} / {stats.total} correct
          </span>
        </div>
      )}

      {sessionComplete ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 p-8 text-center border border-line bg-paper-raised"
        >
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Session complete
          </span>
          <div className="text-4xl font-display">
            {stats.correct} / {stats.total}
          </div>
          <p className="text-sm text-ink-soft">
            {Math.round((stats.correct / stats.total) * 100)}% correct this session.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              className="px-4 py-2 text-sm font-medium bg-ink text-paper hover:bg-accent-deep"
            >
              Keep going
            </button>
            <Link
              href="/progress"
              className="px-4 py-2 text-sm border border-line-strong hover:bg-paper-sunken"
            >
              View progress
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-5 p-6 border border-line bg-paper-raised sm:p-8">
            <RequestTierScale target={scenario.targetTier} />

            <p className="text-ink-soft">{scenario.setting}</p>

            <div className="flex flex-col gap-1 py-4 border-y border-line self-stretch text-center">
              <span className="text-[11px] uppercase tracking-wide text-ink-faint">
                You're asking
              </span>
              <span className="text-sm font-semibold text-ink">{scenario.otherParty}</span>
            </div>

            <p className="font-semibold text-center text-ink">{scenario.promptCue}</p>
            <div className="flex items-baseline gap-2">
              <span lang="ja" className="text-2xl font-display">
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
              placeholder="Type the request, te-form and all..."
              autoFocus
              className="px-4 py-4 text-xl border outline-none border-line-strong bg-paper font-display text-ink shadow-low focus:border-accent disabled:opacity-60"
            />
            {!result && (
              <button
                type="submit"
                className="px-4 py-3 font-medium bg-ink text-paper hover:bg-accent-deep"
              >
                Check
              </button>
            )}
          </form>

          {result && (
            <div
              role="status"
              aria-live="polite"
              className={`flex animate-[fade-in-up_0.2s_ease-out] flex-col gap-4 border p-5 ${resultTone === "correct"
                ? "border-correct bg-correct-soft"
                : resultTone === "partial"
                  ? "border-partial bg-partial-soft"
                  : "border-incorrect bg-incorrect-soft"
                }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {resultTone === "correct" ? (
                  <CheckCircle2 size={18} className="text-correct" />
                ) : (
                  <XCircle
                    size={18}
                    className={resultTone === "partial" ? "text-partial" : "text-incorrect"}
                  />
                )}
                {resultTone === "correct"
                  ? "Correct!"
                  : resultTone === "partial"
                    ? "Right verb, wrong tier — too casual or too formal for this ask."
                    : "Not quite."}
              </div>
              <div className="text-sm text-ink-soft">
                Correct answer:{" "}
                <span lang="ja" className="font-semibold text-ink">
                  {result.canonicalAnswer}
                </span>{" "}
                (<span lang="ja">{REQUEST_TIER_LABEL[scenario.targetTier]}</span>)
              </div>

              <div className="flex gap-3 p-4 text-sm border-t border-line/60 bg-paper-raised text-ink-soft">
                <MessageSquareQuote size={16} className="mt-0.5 shrink-0 text-ink-faint" />
                <p>{scenario.explanation}</p>
              </div>

              <button
                onClick={handleNext}
                className="self-start px-4 py-2 text-sm font-medium bg-ink text-paper hover:bg-accent-deep"
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
