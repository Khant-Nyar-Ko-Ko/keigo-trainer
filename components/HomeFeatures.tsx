import { BookOpen, GitBranch, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import Stamp from "./Stamp";

const FEATURES = [
  {
    href: "/drills",
    icon: Zap,
    title: "Verb Drills",
    description:
      "Conjugate common verbs into sonkeigo and kenjougo, graded instantly against a fixed key.",
  },
  {
    href: "/scenarios",
    icon: Target,
    title: "Scenario Practice",
    description:
      "Read a real situation and judge who to elevate and who to humble — not just conjugation.",
  },
  {
    href: "/diagnostic",
    icon: GitBranch,
    title: "Decision Diagnostic",
    description:
      "Walk the actor → addressee → in-group reasoning tree behind every keigo choice.",
  },
  {
    href: "/notes",
    icon: BookOpen,
    title: "Nuance Notes",
    description:
      "Reference notes on the gotchas textbooks skip — uchi/soto, hierarchy, and register.",
  },
  {
    href: "/progress",
    icon: TrendingUp,
    title: "Progress",
    description:
      "See accuracy by mode and the specific verbs or scenarios worth reviewing next.",
  },
] as const;

export default function HomeFeatures() {
  return (
    <section className="w-full border-t border-line bg-paper-raised">
      <div className="flex flex-col w-full max-w-5xl gap-8 px-4 py-16 mx-auto sm:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <Stamp kanji="型" />
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            How it works
          </span>
          <h2 className="text-2xl font-semibold font-display text-ink sm:text-3xl">
            Five ways to build judgment
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-3 p-6 border group border-line bg-paper hover:border-accent"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-accent group-hover:border-accent">
                <Icon size={16} />
              </span>
              <span className="text-lg font-semibold font-display text-ink">{title}</span>
              <p className="text-sm text-ink-soft">{description}</p>
              <span className="mt-auto text-xs text-accent group-hover:text-accent-deep">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
