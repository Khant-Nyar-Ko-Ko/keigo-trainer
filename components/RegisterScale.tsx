"use client";

import { useState } from "react";
import { HonorificTarget } from "@/lib/verbs";

type ScalePoint = "sonkeigo" | "kenjougo" | "teineigo" | "plain";

const POINT_STYLES: Record<ScalePoint, { dot: string; text: string }> = {
  sonkeigo: { dot: "bg-sonkeigo", text: "text-sonkeigo" },
  kenjougo: { dot: "bg-kenjougo", text: "text-kenjougo" },
  teineigo: { dot: "bg-teineigo", text: "text-teineigo" },
  plain: { dot: "bg-plain", text: "text-plain" },
};

const POINTS: { id: ScalePoint; label: string }[] = [
  { id: "sonkeigo", label: "尊敬語" },
  { id: "kenjougo", label: "謙譲語" },
  { id: "teineigo", label: "丁寧語" },
  { id: "plain", label: "plain" },
];

export default function RegisterScale({ target }: { target: HonorificTarget }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="What do these registers mean?"
        className="inline-flex items-center gap-3 p-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="relative block w-px h-24 bg-line-strong" aria-hidden="true">
          {POINTS.map((point, i) => {
            const active = point.id === target;
            return (
              <span
                key={point.id}
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${active ? `h-3 w-3 ${POINT_STYLES[point.id].dot}` : "h-1.5 w-1.5 bg-line-strong"
                  }`}
                style={{ top: `${(i / (POINTS.length - 1)) * 100}%` }}
              />
            );
          })}
        </span>
        <span className="flex h-24 flex-col justify-between py-0.5 text-left">
          {POINTS.map((point) => {
            const active = point.id === target;
            return (
              <span
                key={point.id}
                lang={point.id === "plain" ? undefined : "ja"}
                className={
                  active
                    ? `text-sm font-semibold ${POINT_STYLES[point.id].text}`
                    : "text-xs text-ink-faint"
                }
              >
                {point.label}
              </span>
            );
          })}
        </span>
        <span className="flex items-center justify-center w-5 h-5 text-xs leading-none border rounded-full border-line-strong text-ink-faint">
          ?
        </span>
      </button>
      {open && (
        <div className="p-4 text-xs leading-relaxed text-left border max-w-72 border-line bg-paper-sunken text-ink-soft shadow-low">
          <p>
            <span lang="ja" className="font-semibold text-sonkeigo">
              尊敬語
            </span>{" "}
            elevates the other person&apos;s action — use it for what <em>they</em> do.
          </p>
          <p className="mt-2">
            <span lang="ja" className="font-semibold text-kenjougo">
              謙譲語
            </span>{" "}
            humbles your own action — use it for what <em>you</em> do toward someone
            you&apos;re showing respect to.
          </p>
          <p className="mt-2 text-ink-faint">
            <span lang="ja">丁寧語</span> is baseline politeness underneath both; the plain
            form is unmarked, dictionary-form speech.
          </p>
        </div>
      )}
    </div>
  );
}
