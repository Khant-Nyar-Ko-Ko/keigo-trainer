"use client";

import { Database, Download, ExternalLink, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import { loadProgress, resetProgress } from "@/lib/progress";
import { loadScenarioProgress, resetScenarioProgress } from "@/lib/scenario-progress";
import { SCENARIO_BANK } from "@/lib/scenarios";
import { loadStats, resetStats } from "@/lib/stats";

const NAV_LINKS = [
  { href: "/", label: "Verb Drills" },
  { href: "/scenarios", label: "Scenario Practice" },
  { href: "/diagnostic", label: "Decision Diagnostic" },
  { href: "/notes", label: "Nuance Notes" },
  { href: "/progress", label: "Progress" },
] as const;

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Footer() {
  const { status, session } = useAuth();
  const signedIn = status === "signed-in" && !!session;

  function handleExport() {
    download("keigo-trainer-progress.json", {
      exportedAt: new Date().toISOString(),
      stats: loadStats(),
      progress: loadProgress(),
      scenarioProgress: loadScenarioProgress(),
    });
  }

  function handleClear() {
    if (!window.confirm("Clear all saved progress? This can't be undone.")) return;
    resetStats();
    resetProgress();
    resetScenarioProgress();
  }

  return (
    <footer className="w-full mt-16 border-t border-line bg-paper-raised">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-10 px-4 py-12 mx-auto sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2 text-lg font-semibold font-heading text-ink">
            <span lang="ja" className="text-accent">敬語</span>
            <span>Companion</span>
          </div>
          <p className="text-sm text-ink-faint">
            Mastering the social judgment of Japanese business &amp; formal speech.
          </p>
          <p className="text-xs text-ink-faint">
            Built with Next.js, Vercel &amp; Tailwind CSS. Zero LLM bloat.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Navigate
          </span>
          <nav className="flex flex-col gap-2 text-sm text-ink-soft">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Content &amp; cost
          </span>
          <div className="flex flex-col gap-2 text-xs">
            <span className="inline-flex w-fit items-center gap-1.5 border border-line px-2 py-1 text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Scenario bank: {SCENARIO_BANK.length} hand-authored (expanding toward 150–300)
            </span>
            <span className="inline-flex w-fit items-center gap-1.5 border border-line px-2 py-1 text-ink-soft">
              <Zap size={11} className="text-accent" />
              Free static core + capped AI fallback
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Your data
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 text-xs text-ink-soft">
            <Database size={11} />
            {signedIn ? "Synced to your account" : "Saved locally in this browser"}
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex w-fit items-center gap-1.5 border border-line-strong px-2.5 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent"
            >
              <Download size={12} />
              Export data (JSON)
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex w-fit items-center gap-1.5 border border-line-strong px-2.5 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent"
            >
              <Trash2 size={12} />
              Clear local progress
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="flex flex-col items-center justify-between w-full max-w-5xl gap-3 px-4 py-4 mx-auto text-xs text-ink-faint sm:flex-row">
          <span>© {new Date().getFullYear()} Keigo Companion. Built for learners worldwide.</span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Khant-Nyar-Ko-Ko/keigo-trainer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-accent"
            >
              <ExternalLink size={13} />
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
