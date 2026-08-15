"use client";

import { BookOpen, GitBranch, Menu, Target, TrendingUp, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import UserGuideModal from "./UserGuideModal";

const LINKS = [
  { href: "/", label: "Verb Drills", icon: Zap },
  { href: "/scenarios", label: "Scenario Practice", icon: Target },
  { href: "/diagnostic", label: "Decision Diagnostic", icon: GitBranch },
  { href: "/notes", label: "Nuance Notes", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { status, session, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-paper/95 backdrop-blur">
      <nav className="flex flex-col w-full max-w-5xl gap-3 px-4 py-3 mx-auto">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="relative h-6 w-0.75 shrink-0 bg-line-strong" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sonkeigo" />
              <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-kenjougo" />
            </span>
            <span className="flex items-baseline gap-2 text-lg font-semibold whitespace-nowrap font-heading text-ink">
              <span lang="ja" className="text-accent">敬語</span>
              <span>Companion</span>
            </span>
            <span className="hidden shrink-0 border border-line-strong px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint sm:inline">
              Judgment-First Keigo
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <UserGuideModal />
            <ThemeToggle />
            {status === "signed-in" && session ? (
              <div className="flex items-center gap-2">
                <span
                  className="hidden text-xs truncate max-w-32 text-ink-faint sm:inline"
                  title={session.user.email}
                >
                  {session.user.email}
                </span>
                <button
                  onClick={() => void signOut()}
                  className="border border-line-strong px-2 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent"
                >
                  Sign out
                </button>
              </div>
            ) : status === "signed-out" ? (
              <Link
                href="/login"
                className="border border-line-strong px-2 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent"
              >
                Sign in
              </Link>
            ) : status === "unavailable" ? (
              <span className="hidden border border-line px-2 py-1.5 text-[11px] uppercase tracking-wide text-ink-faint sm:inline">
                Guest · Local progress
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              className="flex items-center justify-center w-8 h-8 border shrink-0 border-line-strong text-ink-soft hover:border-accent hover:text-accent sm:hidden"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        <div className={`${mobileOpen ? "flex" : "hidden"} flex-col gap-1 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-1 sm:border-t sm:border-line sm:pt-2`}>
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm sm:px-3 sm:py-1.5 ${active
                  ? "font-semibold text-accent"
                  : "text-ink-soft hover:text-ink"
                  }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
