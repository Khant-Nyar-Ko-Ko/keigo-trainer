import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-line py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} <span lang="ja">敬語</span> Companion — hand-authored,
          zero-cost core.
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-accent">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-accent">
            Cookie Policy
          </Link>
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
