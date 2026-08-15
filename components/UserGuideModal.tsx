"use client";

import {
  BookOpen,
  Compass,
  HelpCircle,
  Lightbulb,
  ScrollText,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type TabId = "framework" | "grading" | "cheatsheet" | "tips";

const TABS: { id: TabId; label: string; icon: typeof Compass }[] = [
  { id: "framework", label: "Uchi vs. Soto", icon: Compass },
  { id: "grading", label: "How grading works", icon: ScrollText },
  { id: "cheatsheet", label: "Register cheatsheet", icon: BookOpen },
  { id: "tips", label: "Tips", icon: Lightbulb },
];

export default function UserGuideModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("framework");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open user guide"
        title="User guide"
        className="flex items-center justify-center w-8 h-8 border shrink-0 border-line-strong text-ink-soft hover:border-accent hover:text-accent"
      >
        <HelpCircle size={15} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-guide-title"
              className="relative flex max-h-[85vh] w-full max-w-xl flex-col border border-line bg-paper shadow-xl"
            >
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-line">
                <h2
                  id="user-guide-title"
                  className="text-xl font-semibold font-heading text-ink"
                >
                  Guide &amp; methodology
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close guide"
                  className="flex items-center justify-center w-8 h-8 border shrink-0 border-line-strong text-ink-soft hover:border-accent hover:text-accent"
                >
                  <X size={15} />
                </button>
              </div>

              <div
                role="tablist"
                aria-label="Guide sections"
                className="flex flex-wrap gap-1 px-3 pt-3 border-b border-line"
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const selected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`panel-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium ${selected
                          ? "border-accent text-ink"
                          : "border-transparent text-ink-faint hover:text-ink"
                        }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="px-6 py-5 overflow-y-auto">
                {activeTab === "framework" && (
                  <div
                    role="tabpanel"
                    id="panel-framework"
                    aria-labelledby="tab-framework"
                    className="flex flex-col gap-4 text-sm text-ink-soft"
                  >
                    <p>
                      Every keigo choice comes down to one question:{" "}
                      <span className="font-semibold text-ink">
                        is the person you&apos;re talking about inside your
                        group (uchi, 内) or outside it (soto, 外)?
                      </span>{" "}
                      The same person can flip sides depending on who&apos;s
                      listening.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="p-4 border border-line bg-paper-raised">
                        <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-kenjougo">
                          Uchi — in-group
                        </p>
                        <ul className="flex flex-col gap-1 text-xs text-ink-faint">
                          <li>Yourself</li>
                          <li>Your own actions</li>
                          <li>Your company, when speaking to an outsider</li>
                          <li>
                            Your family, when speaking to a non-family member
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 border border-line bg-paper-raised">
                        <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-sonkeigo">
                          Soto — out-group
                        </p>
                        <ul className="flex flex-col gap-1 text-xs text-ink-faint">
                          <li>Customers, clients</li>
                          <li>Other companies</li>
                          <li>Anyone senior you&apos;re addressing directly</li>
                          <li>Strangers</li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      The classic gotcha: describing your own boss to a
                      customer. Your boss outranks you, but relative to the
                      customer your boss is <em>uchi</em> — so you humble your
                      boss&apos;s action (謙譲語) instead of elevating it, even
                      though you&apos;d normally elevate it when speaking to
                      your boss directly. The{" "}
                      <span className="font-semibold text-ink">
                        Decision Diagnostic
                      </span>{" "}
                      walks through this actor → addressee → in-group reasoning
                      step by step.
                    </p>
                  </div>
                )}

                {activeTab === "grading" && (
                  <div
                    role="tabpanel"
                    id="panel-grading"
                    aria-labelledby="tab-grading"
                    className="flex flex-col gap-4 text-sm text-ink-soft"
                  >
                    <p>
                      Nothing here is graded by asking a model &quot;is this
                      right?&quot; — every answer is checked against a fixed key
                      in code, so grading is instant, consistent, and free.
                    </p>
                    <ul className="flex flex-col gap-3">
                      <li className="p-3 border border-line bg-paper-raised">
                        <p className="font-semibold text-ink">Verb drills</p>
                        <p className="mt-1 text-xs">
                          Checked against the conjugator&apos;s known-correct
                          form for that verb and register, with normalization
                          for spelling variants.
                        </p>
                      </li>
                      <li className="p-3 border border-line bg-paper-raised">
                        <p className="font-semibold text-ink">
                          Scenario practice
                        </p>
                        <p className="mt-1 text-xs">
                          Checked against a hand-authored expected answer for
                          that specific situation. A miss is diagnosed instantly
                          and for free — the code can tell whether you picked
                          the right conjugation but the wrong register (sonkeigo
                          vs. kenjougo) versus something else, no AI involved.
                        </p>
                      </li>
                    </ul>
                    <p>
                      On drills, missing a question surfaces an optional{" "}
                      <span className="font-semibold text-ink">
                        &quot;Explain why&quot;
                      </span>{" "}
                      button. That explanation is tiered: a free, instant
                      rule-based check runs first (it recognizes wrong-register
                      answers and the regular pattern misapplied to an
                      irregular verb), and Claude Haiku only fires as a
                      fallback for mistakes that check can&apos;t classify —
                      capped at a handful of AI explanations per learner per
                      day.
                    </p>
                  </div>
                )}

                {activeTab === "cheatsheet" && (
                  <div
                    role="tabpanel"
                    id="panel-cheatsheet"
                    aria-labelledby="tab-cheatsheet"
                    className="flex flex-col gap-3 text-sm text-ink-soft"
                  >
                    <div className="p-4 border-l-4 border-sonkeigo bg-sonkeigo-soft">
                      <p lang="ja" className="text-lg font-display text-ink">
                        尊敬語{" "}
                        <span className="font-sans text-xs text-ink-faint">
                          sonkeigo
                        </span>
                      </p>
                      <p className="mt-1 text-xs">
                        <span className="font-semibold text-ink">Elevate</span>{" "}
                        the other person&apos;s action. Use it for what{" "}
                        <em>they</em> do.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-kenjougo bg-kenjougo-soft">
                      <p lang="ja" className="text-lg font-display text-ink">
                        謙譲語{" "}
                        <span className="font-sans text-xs text-ink-faint">
                          kenjougo
                        </span>
                      </p>
                      <p className="mt-1 text-xs">
                        <span className="font-semibold text-ink">Humble</span>{" "}
                        your own (or your in-group&apos;s) action. Use it for
                        what <em>you</em> do toward someone you&apos;re showing
                        respect to.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-teineigo bg-teineigo-soft">
                      <p lang="ja" className="text-lg font-display text-ink">
                        丁寧語{" "}
                        <span className="font-sans text-xs text-ink-faint">
                          teineigo
                        </span>
                      </p>
                      <p className="mt-1 text-xs">
                        General politeness — です/ます. The baseline layer
                        sonkeigo and kenjougo build on top of. Not directly
                        drilled here, but assumed throughout.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "tips" && (
                  <div
                    role="tabpanel"
                    id="panel-tips"
                    aria-labelledby="tab-tips"
                    className="flex flex-col gap-3 text-sm text-ink-soft"
                  >
                    <p>
                      <span className="font-semibold text-ink">
                        Questions repeat by weakness.
                      </span>{" "}
                      Verbs and scenarios you miss get weighted to come up more
                      often (Leitner-style spaced repetition), so practice
                      naturally drifts toward what you actually need.
                    </p>
                    <p>
                      <span className="font-semibold text-ink">
                        Tap the &quot;?&quot;
                      </span>{" "}
                      next to the register-scale marker on any question for a
                      quick sonkeigo/kenjougo reminder without leaving the
                      drill.
                    </p>
                    <p>
                      <span className="font-semibold text-ink">
                        Your progress lives in this browser
                      </span>{" "}
                      (localStorage) unless you sign in — signing in is optional
                      and only adds cross-device sync on top.
                    </p>
                    <p>
                      <span className="font-semibold text-ink">
                        Check the Progress page
                      </span>{" "}
                      for a breakdown of accuracy and the specific verbs or
                      scenarios worth reviewing next.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
