"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Drills" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/diagnostic", label: "Reasoning" },
  { href: "/notes", label: "Notes" },
] as const;

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 flex w-full max-w-lg items-center justify-between">
      <Link href="/" className="flex items-baseline gap-2 font-display text-lg">
        <span className="text-red">敬語</span>
        <span>Companion</span>
      </Link>
      <div className="flex gap-6 text-sm text-ink-soft">
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
