"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  canRequestExplanation,
  recordExplanationUsed,
} from "@/lib/diagnostics/explain-usage";
import { GradeResult, gradeAnswer } from "@/lib/grade";
import { Question, loadProgress, pickQuestion, recordMiss } from "@/lib/progress";
import { recordAttempt } from "@/lib/stats";
import { TARGET_LABEL } from "@/lib/verbs";
import RegisterScale from "./RegisterScale";

const SESSION_LENGTH = 10;

export default function Quiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setQuestion(pickQuestion(loadProgress()));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || result) return;

    const graded = gradeAnswer(input, question.verb, question.target);
    setResult(graded);
    setStats((s) => ({ correct: s.correct + (graded.correct ? 1 : 0), total: s.total + 1 }));
    recordAttempt("drills", graded.correct);

    if (!graded.correct) {
      recordMiss(question.verb.id, question.target);
    }
  }

  async function handleExplain() {
    if (!question || !result) return;
    setExplanationLoading(true);
    setExplanationError(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verbId: question.verb.id,
          target: question.target,
          userAnswer: input,
          correctAnswer: result.canonicalAnswer,
          aiFallbackAllowed: canRequestExplanation(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (!data.explanation) throw new Error("Empty response");
      setExplanation(data.explanation);
      if (data.tier === "ai") recordExplanationUsed();
    } catch {
      setExplanationError("Couldn't load an explanation. Try again?");
    } finally {
      setExplanationLoading(false);
    }
  }

  function resetQuestionState() {
    setInput("");
    setResult(null);
    setExplanation(null);
    setExplanationError(null);
  }

  function handleNext() {
    if (stats.total >= SESSION_LENGTH) {
      setSessionComplete(true);
      return;
    }
    setQuestion(pickQuestion(loadProgress(), question ?? undefined));
    resetQuestionState();
  }

  function handleContinue() {
    setStats({ correct: 0, total: 0 });
    setSessionComplete(false);
    setQuestion(pickQuestion(loadProgress()));
    resetQuestionState();
  }

  if (!question) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md gap-6">
      {!sessionComplete && (
        <div className="text-sm text-right text-ink-faint">
          {stats.correct} / {stats.total} correct
        </div>
      )}

      {sessionComplete ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 p-8 text-center border border-line bg-paper-raised"
        >
          <span className="text-xs font-semibold tracking-wide uppercase text-accent">
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
          <div className="flex flex-col items-center gap-2 p-8 text-center border border-line bg-paper-raised">
            <RegisterScale target={question.target} />
            <div lang="ja" className="mt-2 text-4xl font-display">
              {question.verb.dictionaryForm}
            </div>
            <div className="text-ink-faint">
              <span lang="ja">{question.verb.reading}</span> — {question.verb.meaning}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!result}
              placeholder="Type the converted form..."
              autoFocus
              className="px-4 py-3 text-lg border outline-none border-line-strong bg-paper text-ink focus:border-accent disabled:opacity-60"
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
              className={`flex flex-col gap-3 border p-4 ${result.correct ? "border-success bg-success-soft" : "border-accent bg-accent-soft"
                }`}
            >
              <div className="font-semibold">{result.correct ? "Correct!" : "Not quite."}</div>
              <div className="text-sm text-ink-soft">
                Correct answer:{" "}
                <span lang="ja" className="font-semibold text-ink">
                  {result.canonicalAnswer}
                </span>{" "}
                (<span lang="ja">{TARGET_LABEL[question.target]}</span>)
              </div>

              {!result.correct && !explanation && (
                <button
                  onClick={handleExplain}
                  disabled={explanationLoading}
                  className="self-start border border-line-strong px-3 py-1.5 text-sm hover:bg-paper-sunken disabled:opacity-60"
                >
                  {explanationLoading
                    ? "Explaining..."
                    : explanationError
                      ? "Try again"
                      : "Explain why"}
                </button>
              )}

              {explanationError && !explanation && (
                <div className="text-xs text-accent">{explanationError}</div>
              )}

              {explanation && (
                <div className="p-3 text-sm bg-paper-raised text-ink-soft">{explanation}</div>
              )}

              <button
                onClick={handleNext}
                className="self-start px-4 py-2 text-sm font-medium bg-ink text-paper hover:bg-accent-deep"
              >
                Next question
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
