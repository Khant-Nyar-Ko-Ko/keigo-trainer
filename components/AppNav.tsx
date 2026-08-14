"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Drills" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/diagnostic", label: "Reasoning" },
  { href: "/notes", label: "Notes" },
  { href: "/progress", label: "Progress" },
] as const;

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-0">
      <Link
        href="/"
        className="flex shrink-0 items-baseline gap-2 whitespace-nowrap font-display text-lg"
      >
        <span lang="ja" className="text-red">敬語</span>
        <span>Companion</span>
      </Link>
      <div className="flex w-full items-center justify-between text-sm text-ink-soft sm:w-auto sm:justify-end sm:gap-6">
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
      </div>
    </nav>
  );
}
