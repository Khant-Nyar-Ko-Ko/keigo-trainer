import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-line py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-ink-faint">
        <span>
          © {new Date().getFullYear()} <span lang="ja">敬語</span> Companion — hand-authored,
          zero-cost core.
        </span>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="hover:text-accent">
            Settings
          </Link>
          <a
            href="https://github.com/Khant-Nyar-Ko-Ko/keigo-trainer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
