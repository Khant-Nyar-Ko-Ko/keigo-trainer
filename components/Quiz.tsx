"use client";

import { useEffect, useState } from "react";
import { GradeResult, gradeAnswer } from "@/lib/grade";
import { Question, loadProgress, pickQuestion, recordMiss } from "@/lib/progress";
import { HonorificTarget } from "@/lib/verbs";

const TARGET_LABEL: Record<HonorificTarget, string> = {
  sonkeigo: "尊敬語 (Sonkeigo)",
  kenjougo: "謙譲語 (Kenjougo)",
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
    return <div className="text-zinc-400">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md gap-6">
      <div className="text-sm text-right text-zinc-500">
        {stats.correct} / {stats.total} correct
      </div>

      <div className="flex flex-col items-center gap-2 p-8 text-center bg-white border rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-4xl font-semibold">{question.verb.dictionaryForm}</div>
        <div className="text-zinc-500">
          {question.verb.reading} — {question.verb.meaning}
        </div>
        <div className="px-3 py-1 mt-2 text-sm font-medium rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {TARGET_LABEL[question.target]}
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
          className="px-4 py-3 text-lg bg-white border rounded-lg outline-none border-zinc-300 focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {!result && (
          <button
            type="submit"
            className="px-4 py-3 font-medium text-white rounded-lg bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Check
          </button>
        )}
      </form>

      {result && (
        <div
          className={`flex flex-col gap-3 rounded-lg border p-4 ${result.correct
              ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950"
              : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
            }`}
        >
          <div className="font-medium">
            {result.correct ? "Correct!" : "Not quite."}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Correct answer: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{result.canonicalAnswer}</span>
          </div>

          {!result.correct && !explanation && (
            <button
              onClick={handleExplain}
              disabled={explanationLoading}
              className="self-start rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {explanationLoading ? "Explaining..." : "Explain why"}
            </button>
          )}

          {explanation && (
            <div className="p-3 text-sm bg-white rounded-md text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {explanation}
            </div>
          )}

          <button
            onClick={handleNext}
            className="self-start px-4 py-2 text-sm font-medium text-white rounded-md bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next question
          </button>
        </div>
      )}
    </div>
  );
}
