"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "keigo-trainer-welcome-dismissed";

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex flex-col w-full max-w-md gap-2 p-4 mb-8 text-sm border border-line bg-paper-raised text-ink-soft">
      <p>
        This app drills two registers of Japanese honorific speech:{" "}
        <span className="font-semibold text-ink">尊敬語</span> (elevating someone else&apos;s
        action) and <span className="font-semibold text-ink">謙譲語</span> (humbling your own).
        Tap the <span className="px-1 text-xs border border-line-strong">?</span> next to a
        question if you need a reminder.
      </p>
      <p>
        Want the reasoning first?{" "}
        <Link
          href="/diagnostic"
          className="underline text-accent underline-offset-2 hover:text-accent-deep"
        >
          Walk through the decision tree
        </Link>{" "}
        or{" "}
        <Link
          href="/notes"
          className="underline text-accent underline-offset-2 hover:text-accent-deep"
        >
          read the notes
        </Link>
        .
      </p>
      <button
        onClick={dismiss}
        className="self-end text-xs underline text-ink-faint decoration-line-strong underline-offset-4 hover:text-accent"
      >
        Got it, dismiss
      </button>
    </div>
  );
}
