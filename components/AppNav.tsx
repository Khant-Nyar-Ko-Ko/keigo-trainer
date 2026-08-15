"use client";

import { BookOpen, GitBranch, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import UserGuideModal from "./UserGuideModal";

const LINKS = [
  { href: "/drills", label: "Verb Drills", short: "Drills", icon: Zap },
  { href: "/scenarios", label: "Scenario Practice", short: "Scenarios", icon: Target },
  { href: "/diagnostic", label: "Decision Diagnostic", short: "Diagnostic", icon: GitBranch },
  { href: "/notes", label: "Nuance Notes", short: "Notes", icon: BookOpen },
  { href: "/progress", label: "Progress", short: "Progress", icon: TrendingUp },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { status, session, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line bg-paper/95 backdrop-blur">
        <nav className="flex items-center justify-between w-full max-w-6xl gap-4 px-4 py-3 mx-auto">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="relative w-px h-6 shrink-0 bg-line-strong" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sonkeigo" />
              <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-kenjougo" />
            </span>
            <span className="flex items-baseline gap-2 text-lg font-semibold whitespace-nowrap font-display text-ink">
              <span lang="ja" className="text-accent">
                敬語
              </span>
              <span>Companion</span>
            </span>
          </Link>

          <div className="items-center justify-center flex-1 hidden gap-1 sm:flex">
            {LINKS.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  title={link.label}
                  className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors lg:px-3 ${active
                    ? "font-semibold text-accent"
                    : "text-ink-soft hover:bg-paper-raised hover:text-ink"
                    }`}
                >
                  <Icon size={15} />
                  <span className="hidden lg:inline">{link.label}</span>
                  <span className="lg:hidden">{link.short}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
                Guest
              </span>
            ) : null}
          </div>
        </nav>
      </header>

      {/* Bottom tab bar — mobile navigation. Fixed, ≥44px targets. */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] ${active ? "text-accent" : "text-ink-faint"
                }`}
            >
              <Icon size={18} />
              {link.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
