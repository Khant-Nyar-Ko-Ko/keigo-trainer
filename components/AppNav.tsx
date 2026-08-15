"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const LINKS = [
  { href: "/", label: "Drills" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/diagnostic", label: "Reasoning" },
  { href: "/notes", label: "Notes" },
  { href: "/progress", label: "Progress" },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { status, session, signOut } = useAuth();

  return (
    <nav className="flex flex-col items-center w-full max-w-lg gap-3 mb-10 sm:flex-row sm:justify-between sm:gap-0">
      <Link
        href="/"
        className="flex items-baseline gap-2 text-lg shrink-0 whitespace-nowrap font-display"
      >
        <span lang="ja" className="text-red">敬語</span>
        <span>Companion</span>
      </Link>
      <div className="flex flex-wrap items-center justify-between w-full text-sm gap-x-6 gap-y-2 text-ink-soft sm:w-auto sm:justify-end">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "border-b border-red pb-0.5 font-semibold text-ink"
                : "hover:text-ink"
            }
          >
            {link.label}
          </Link>
        ))}
        {status === "signed-in" && session ? (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-32 text-ink-faint" title={session.user.email}>
              {session.user.email}
            </span>
            <button
              onClick={() => void signOut()}
              className="px-2 py-1 text-xs border border-line-strong hover:bg-paper-sunken"
            >
              Sign out
            </button>
          </div>
        ) : status === "signed-out" ? (
          <Link
            href="/login"
            className={
              pathname === "/login"
                ? "border-b border-red pb-0.5 font-semibold text-ink"
                : "hover:text-ink"
            }
          >
            Sign in
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
