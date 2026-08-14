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
    <div className="mb-8 flex w-full max-w-md flex-col gap-2 border border-line bg-paper-raised p-4 text-sm text-ink-soft">
      <p>
        This app drills two registers of Japanese honorific speech:{" "}
        <span className="font-semibold text-ink">尊敬語</span> (elevating someone else&apos;s
        action) and <span className="font-semibold text-ink">謙譲語</span> (humbling your own).
        Tap the <span className="border border-line-strong px-1 text-xs">?</span> next to a
        question if you need a reminder.
      </p>
      <p>
        Want the reasoning first?{" "}
        <Link
          href="/diagnostic"
          className="text-red underline underline-offset-2 hover:text-red-deep"
        >
          Walk through the decision tree
        </Link>{" "}
        or{" "}
        <Link href="/notes" className="text-red underline underline-offset-2 hover:text-red-deep">
          read the notes
        </Link>
        .
      </p>
      <button
        onClick={dismiss}
        className="self-end text-xs text-ink-faint underline decoration-line-strong underline-offset-4 hover:text-red"
      >
        Got it, dismiss
      </button>
    </div>
  );
}
