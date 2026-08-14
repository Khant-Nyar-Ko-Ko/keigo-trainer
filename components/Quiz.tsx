"use client";

import { useEffect, useState } from "react";
import { GradeResult, gradeAnswer } from "@/lib/grade";
import { Question, loadProgress, pickQuestion, recordMiss } from "@/lib/progress";
import { HonorificTarget } from "@/lib/verbs";
import RegisterScale from "./RegisterScale";

const TARGET_LABEL: Record<HonorificTarget, string> = {
  sonkeigo: "尊敬語",
  kenjougo: "謙譲語",
};

export default function Quiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setQuestion(pickQuestion(loadProgress()));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || result) return;

    const graded = gradeAnswer(input, question.verb, question.target);
    setResult(graded);
    setStats((s) => ({ correct: s.correct + (graded.correct ? 1 : 0), total: s.total + 1 }));

    if (!graded.correct) {
      recordMiss(question.verb.id, question.target);
    }
  }

  async function handleExplain() {
    if (!question || !result) return;
    setExplanationLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dictionaryForm: question.verb.dictionaryForm,
          meaning: question.verb.meaning,
          target: question.target,
          userAnswer: input,
          correctAnswer: result.canonicalAnswer,
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch {
      setExplanation("Couldn't load an explanation right now.");
    } finally {
      setExplanationLoading(false);
    }
  }

  function handleNext() {
    setQuestion(pickQuestion(loadProgress(), question ?? undefined));
    setInput("");
    setResult(null);
    setExplanation(null);
  }

  if (!question) {
    return <div className="text-ink-faint">Loading...</div>;
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="text-right text-sm text-ink-faint">
        {stats.correct} / {stats.total} correct
      </div>

      <div className="flex flex-col items-center gap-2 border border-line bg-paper-raised p-8 text-center">
        <RegisterScale target={question.target} />
        <div className="mt-2 font-display text-4xl">{question.verb.dictionaryForm}</div>
        <div className="text-ink-faint">
          {question.verb.reading} — {question.verb.meaning}
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
          className={`flex flex-col gap-3 border p-4 ${
            result.correct ? "border-green bg-green-soft" : "border-red bg-red-soft"
          }`}
        >
          <div className="font-semibold">{result.correct ? "Correct!" : "Not quite."}</div>
          <div className="text-sm text-ink-soft">
            Correct answer: <span className="font-semibold text-ink">{result.canonicalAnswer}</span>{" "}
            ({TARGET_LABEL[question.target]})
          </div>

          {!result.correct && !explanation && (
            <button
              onClick={handleExplain}
              disabled={explanationLoading}
              className="self-start border border-line-strong px-3 py-1.5 text-sm hover:bg-paper-sunken disabled:opacity-60"
            >
              {explanationLoading ? "Explaining..." : "Explain why"}
            </button>
          )}

          {explanation && (
            <div className="bg-paper-raised p-3 text-sm text-ink-soft">{explanation}</div>
          )}

          <button
            onClick={handleNext}
            className="self-start bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-red-deep"
          >
            Next question
          </button>
        </div>
      )}
    </div>
  );
}
