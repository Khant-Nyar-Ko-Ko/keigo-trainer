"use client";

import { CheckCircle2, MessageSquareQuote, Volume2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScenarioGradeResult, gradeScenarioAnswer } from "@/lib/scenario-grade";
import { loadScenarioProgress, pickScenario, recordScenarioMiss } from "@/lib/scenario-progress";
import { CATEGORY_LABEL, Scenario, scenarioVerb } from "@/lib/scenarios";
import { hasJapaneseVoice, speakJapanese } from "@/lib/speech";
import { recordAttempt } from "@/lib/stats";
import { TARGET_LABEL } from "@/lib/verbs";

const SESSION_LENGTH = 10;

// Speaker button, shown only for phone scenarios and only once a Japanese
// voice is confirmed available — hidden entirely rather than shown broken.
function SpeakButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => speakJapanese(text)}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center rounded-full border border-line-strong p-1.5 text-ink-soft hover:border-accent hover:text-accent"
    >
      <Volume2 size={14} />
    </button>
  );
}

function actorLabel(scenario: Scenario): string {
  return scenario.actorIsSelf ? "You" : scenario.otherParty;
}
function actorIsUchi(scenario: Scenario): boolean {
  return scenario.actorIsSelf || scenario.targetRegister === "kenjougo";
}

export default function ScenarioPractice() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScenarioGradeResult | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  useEffect(() => {
    setScenario(pickScenario(loadScenarioProgress()));
  }, []);

  useEffect(() => {
    // Voice lists load async in some browsers — check immediately, then
    // again once the browser reports voices are ready.
    setVoiceAvailable(hasJapaneseVoice());
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const onVoicesChanged = () => setVoiceAvailable(hasJapaneseVoice());
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
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
  const uchi = actorIsUchi(scenario);

  const resultTone =
    result?.mistakeType === "correct"
      ? "correct"
      : result?.mistakeType === "wrong-register"
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
          <div className="flex flex-col gap-5 p-6 border border-line bg-paper-raised sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
                {CATEGORY_LABEL[scenario.category]}
              </span>
              {scenario.flipCase && (
                <span className="border border-partial px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-partial">
                  Uchi/soto flip
                </span>
              )}
            </div>

            <p className="text-ink-soft">{scenario.setting}</p>

            <div className="flex items-stretch gap-3 py-4 border-y border-line">
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[11px] uppercase tracking-wide text-ink-faint">Actor</span>
                <span className="text-sm font-semibold text-ink">{actorLabel(scenario)}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-2">
                <span
                  className={`whitespace-nowrap border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${uchi
                    ? "border-kenjougo text-kenjougo"
                    : "border-sonkeigo text-sonkeigo"
                    }`}
                >
                  {uchi ? "uchi — in-group" : "soto — out-group"}
                </span>
                <span aria-hidden="true" className="text-ink-faint">
                  →
                </span>
              </div>
              <div className="flex flex-col flex-1 gap-1 text-right">
                <span className="text-[11px] uppercase tracking-wide text-ink-faint">
                  Register
                </span>
                <span
                  lang="ja"
                  className={`text-sm font-semibold ${scenario.targetRegister === "sonkeigo" ? "text-sonkeigo" : "text-kenjougo"
                    }`}
                >
                  {TARGET_LABEL[scenario.targetRegister]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink">{scenario.promptCue}</p>
              {scenario.category === "phone" && voiceAvailable && (
                <SpeakButton text={scenario.promptCue} label="Hear this line spoken" />
              )}
            </div>
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
              placeholder="Which register — and what's the form?"
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
                    ? "Wrong register — the conjugation itself was fine."
                    : "Not quite."}
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <span>
                  Correct answer:{" "}
                  <span lang="ja" className="font-semibold text-ink">
                    {result.canonicalAnswer}
                  </span>{" "}
                  (<span lang="ja">{TARGET_LABEL[scenario.targetRegister]}</span>)
                </span>
                {scenario.category === "phone" && voiceAvailable && result.canonicalAnswer && (
                  <SpeakButton
                    text={result.canonicalAnswer}
                    label="Hear the correct form spoken"
                  />
                )}
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
