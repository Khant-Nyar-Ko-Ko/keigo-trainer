"use client";

import { CheckCircle2, XCircle } from "lucide-react";
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

const REGISTER_CARD_BORDER: Record<"sonkeigo" | "kenjougo", string> = {
  sonkeigo: "border-l-sonkeigo",
  kenjougo: "border-l-kenjougo",
};
const REGISTER_TEXT: Record<"sonkeigo" | "kenjougo", string> = {
  sonkeigo: "text-sonkeigo",
  kenjougo: "text-kenjougo",
};

export default function Quiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
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
    setSubmittedAnswer(input);
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
          userAnswer: submittedAnswer,
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
    setSubmittedAnswer("");
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
    <div className="flex w-full max-w-md flex-col gap-6">
      {!sessionComplete && (
        <div className="flex items-center justify-between border border-line bg-paper-raised px-4 py-2">
          <span className="text-xs uppercase tracking-wide text-ink-faint">
            Question {stats.total + 1} of {SESSION_LENGTH}
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
          className="flex flex-col items-center gap-4 border border-line bg-paper-raised p-8 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
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
              className="bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent-deep"
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
          <div
            className={`flex flex-col items-center gap-3 border border-line border-l-4 bg-paper-raised p-10 text-center ${REGISTER_CARD_BORDER[question.target]}`}
          >
            <RegisterScale target={question.target} />
            <div lang="ja" className="mt-3 font-display text-5xl text-ink">
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
              className="border border-line-strong bg-paper px-4 py-4 font-display text-xl text-ink shadow-low outline-none focus:border-accent disabled:opacity-60"
            />
            {!result && (
              <button
                type="submit"
                className="bg-ink px-4 py-3 font-medium text-paper hover:bg-accent-deep"
              >
                Check
              </button>
            )}
          </form>

          {result && (
            <div
              role="status"
              aria-live="polite"
              className={`flex animate-[fade-in-up_0.2s_ease-out] flex-col gap-4 border p-5 ${
                result.correct
                  ? "border-correct bg-correct-soft"
                  : "border-incorrect bg-incorrect-soft"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {result.correct ? (
                  <CheckCircle2 size={18} className="text-correct" />
                ) : (
                  <XCircle size={18} className="text-incorrect" />
                )}
                {result.correct ? "Correct!" : "Not quite."}
              </div>

              <div className="flex flex-col gap-2 border-t border-line/60 pt-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ink-faint">Your answer</span>
                  <span lang="ja" className="font-display text-ink-soft">
                    {submittedAnswer || <em className="text-ink-faint">(blank)</em>}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ink-faint">Correct form</span>
                  <span
                    lang="ja"
                    className={`font-display font-semibold ${REGISTER_TEXT[question.target]}`}
                  >
                    {result.canonicalAnswer}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ink-faint">Register</span>
                  <span lang="ja" className={REGISTER_TEXT[question.target]}>
                    {TARGET_LABEL[question.target]}
                  </span>
                </div>
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
                <div className="text-xs text-incorrect">{explanationError}</div>
              )}

              {explanation && (
                <div className="border-t border-line/60 pt-3 text-sm text-ink-soft">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Diagnosis
                  </p>
                  {explanation}
                </div>
              )}

              <button
                onClick={handleNext}
                className="self-start bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent-deep"
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
