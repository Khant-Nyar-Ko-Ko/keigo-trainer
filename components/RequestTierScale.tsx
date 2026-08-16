"use client";

import { useState } from "react";
import { RequestTier } from "@/lib/requests";

const POINT_STYLES: Record<RequestTier, { dot: string; text: string }> = {
  formal: { dot: "bg-sonkeigo", text: "text-sonkeigo" },
  polite: { dot: "bg-teineigo", text: "text-teineigo" },
  casual: { dot: "bg-plain", text: "text-plain" },
};

const POINTS: { id: RequestTier; label: string }[] = [
  { id: "formal", label: "ていただけますでしょうか" },
  { id: "polite", label: "ていただけますか" },
  { id: "casual", label: "てください" },
];

export default function RequestTierScale({ target }: { target: RequestTier }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="What do these request tiers mean?"
        className="inline-flex items-center gap-3 p-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="relative block w-px h-16 bg-line-strong" aria-hidden="true">
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
        <span className="flex h-16 flex-col justify-between py-0.5 text-left">
          {POINTS.map((point) => {
            const active = point.id === target;
            return (
              <span
                key={point.id}
                lang="ja"
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
            The tier isn&apos;t about who they are — it&apos;s about how much you&apos;re
            imposing by asking. Same favor, more cushioning as the ask (or the social
            distance) grows.
          </p>
          <p className="mt-2">
            <span lang="ja" className="font-semibold text-plain">
              てください
            </span>{" "}
            — a small, everyday ask between peers.
          </p>
          <p className="mt-2">
            <span lang="ja" className="font-semibold text-teineigo">
              ていただけますか
            </span>{" "}
            — asking someone soto, or asking a real favor.
          </p>
          <p className="mt-2">
            <span lang="ja" className="font-semibold text-sonkeigo">
              ていただけますでしょうか
            </span>{" "}
            — a superior, or a genuinely inconvenient ask.
          </p>
        </div>
      )}
    </div>
  );
}
