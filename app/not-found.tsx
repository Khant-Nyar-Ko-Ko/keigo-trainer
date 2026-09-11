import type { Metadata } from "next";
import Link from "next/link";
import Stamp from "@/components/Stamp";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center bg-paper">
      <Stamp kanji="迷" size={96} />
      <p className="text-sm text-ink-faint">
        <span lang="ja">迷う</span> — <em>mayou</em>, &quot;to lose one&apos;s way&quot;
      </p>

      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">404</span>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          This page wandered off.
        </h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Whatever you were looking for isn&apos;t at this address. Everything else is still
          exactly where you left it.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 text-base font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c]"
        >
          Back to home
        </Link>
        <Link
          href="/drills"
          className="px-6 py-3 text-base border border-line-strong text-ink-soft hover:border-accent hover:text-accent"
        >
          Start practicing
        </Link>
      </div>
    </div>
  );
}
