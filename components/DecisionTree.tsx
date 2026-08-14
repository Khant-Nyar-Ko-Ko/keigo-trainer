"use client";

import { useState } from "react";
import {
  ActorAnswer,
  AddresseeAnswer,
  currentStep,
  DecisionPath,
  deriveRegister,
  explainPath,
  GroupAnswer,
} from "@/lib/decision-tree";
import { conjugate, VERB_BANK, VerbEntry } from "@/lib/verbs";
import RegisterScale from "./RegisterScale";

function randomVerbForRegister(target: "sonkeigo" | "kenjougo"): VerbEntry {
  const candidates = VERB_BANK.filter((v) => conjugate(v, target) !== null);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

const OPTION_CLASS =
  "border border-line-strong bg-paper px-4 py-3 text-left text-sm hover:border-red hover:bg-red-soft";

export default function DecisionTree() {
  const [path, setPath] = useState<DecisionPath>({});
  const [verb, setVerb] = useState<VerbEntry | null>(null);

  const step = currentStep(path);
  const register = deriveRegister(path);

  function pickVerb(target: "sonkeigo" | "kenjougo") {
    setVerb(randomVerbForRegister(target));
  }

  function answerActor(actor: ActorAnswer) {
    const next = { actor };
    setPath(next);
    if (currentStep(next) === "result") pickVerb(deriveRegister(next)!);
  }

  function answerAddressee(addressee: AddresseeAnswer) {
    const next = { ...path, addressee };
    setPath(next);
    if (currentStep(next) === "result") pickVerb(deriveRegister(next)!);
  }

  function answerGroup(group: GroupAnswer) {
    const next = { ...path, group };
    setPath(next);
    pickVerb(deriveRegister(next)!);
  }

  function reset() {
    setPath({});
    setVerb(null);
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {path.actor && (
        <div className="flex flex-wrap gap-2 text-xs text-ink-faint">
          <span className="border border-line px-2 py-1">
            {path.actor === "self" ? "My own action" : "Someone else's action"}
          </span>
          {path.addressee && (
            <span className="border border-line px-2 py-1">
              {path.addressee === "direct" ? "Speaking to them directly" : "Describing to a third party"}
            </span>
          )}
          {path.group && (
            <span className="border border-line px-2 py-1">
              {path.group === "own-group" ? "Part of my own group" : "Outside my group"}
            </span>
          )}
        </div>
      )}

      {step === "actor" && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-ink">Whose action are you describing?</p>
          <button className={OPTION_CLASS} onClick={() => answerActor("self")}>
            My own action
          </button>
          <button className={OPTION_CLASS} onClick={() => answerActor("other")}>
            Someone else&apos;s action
          </button>
        </div>
      )}

      {step === "addressee" && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-ink">
            Are you speaking directly to that person, or describing them to someone else?
          </p>
          <button className={OPTION_CLASS} onClick={() => answerAddressee("direct")}>
            Speaking directly to them
          </button>
          <button className={OPTION_CLASS} onClick={() => answerAddressee("third-party")}>
            Describing them to a third party
          </button>
        </div>
      )}

      {step === "group" && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-ink">
            Relative to who you&apos;re talking to, is that person part of your own group
            (company, family)?
          </p>
          <button className={OPTION_CLASS} onClick={() => answerGroup("own-group")}>
            Yes — part of my own group
          </button>
          <button className={OPTION_CLASS} onClick={() => answerGroup("outsider")}>
            No — outside my group
          </button>
        </div>
      )}

      {step === "result" && register && verb && (
        <div className="flex flex-col gap-4 border border-line bg-paper-raised p-6">
          <div className="flex items-center gap-3">
            <RegisterScale target={register} />
            <span className="font-semibold text-ink">
              {register === "sonkeigo" ? "尊敬語" : "謙譲語"}
            </span>
          </div>
          <p className="text-sm text-ink-soft">{explainPath(path)}</p>
          <div className="border-t border-line pt-4">
            <p className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Example</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl">{verb.dictionaryForm}</span>
              <span className="text-sm text-ink-faint">
                {verb.reading} — {verb.meaning}
              </span>
            </div>
            <div className="mt-1 font-display text-xl text-red">{conjugate(verb, register)}</div>
          </div>
          <div className="flex gap-3">
            <button
              className="border border-line-strong px-3 py-1.5 text-sm hover:bg-paper-sunken"
              onClick={() => pickVerb(register)}
            >
              Another example
            </button>
            <button
              className="bg-ink px-3 py-1.5 text-sm font-medium text-paper hover:bg-red-deep"
              onClick={reset}
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
