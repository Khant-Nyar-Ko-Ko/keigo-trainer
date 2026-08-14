"use client";

import { useState } from "react";
import { HonorificTarget } from "@/lib/verbs";

// The recurring visual motif: a vertical line with a marker showing where a
// form sits between 謙譲語 (humble, low) and 尊敬語 (elevated, high).
export default function RegisterScale({ target }: { target: HonorificTarget }) {
  const [open, setOpen] = useState(false);
  const isTop = target === "sonkeigo";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="What's the difference between sonkeigo and kenjougo?"
        className="inline-flex items-center gap-1.5"
      >
        <span className="relative h-8 w-0.75 bg-line-strong">
          <span
            className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 bg-red"
            style={{ top: isTop ? "0%" : "100%" }}
          />
        </span>
        <span
          lang="ja"
          className="flex h-8 flex-col justify-between text-[10px] tracking-wide text-ink-faint"
        >
          <span>尊敬語</span>
          <span>謙譲語</span>
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-line-strong text-[10px] leading-none text-ink-faint">
          ?
        </span>
      </button>
      {open && (
        <div className="p-3 text-xs leading-relaxed text-left border max-w-55 border-line bg-paper-sunken text-ink-soft">
          <p>
            <span lang="ja" className="font-semibold text-ink">尊敬語</span> elevates the other
            person&apos;s action — use it for what <em>they</em> do.
          </p>
          <p className="mt-1.5">
            <span lang="ja" className="font-semibold text-ink">謙譲語</span> humbles your own action —
            use it for what <em>you</em> do toward someone you&apos;re showing respect to.
          </p>
        </div>
      )}
    </div>
  );
}
