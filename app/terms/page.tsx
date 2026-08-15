import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Legal"
        title="Terms of Service"
        subtitle="The plain-language version of what you're agreeing to by using this."
        badge="Last updated August 15, 2026"
      />
      <article className="flex flex-col w-full max-w-2xl gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Using the app</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Keigo Companion is free to use, with no purchase required for any part of it. It's
            provided for personal Japanese-learning use, as a hand-authored, hobby-scale
            project — not a commercial service with an SLA.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Accounts</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Signing in is entirely optional. Accounts are created via a passwordless email
            magic link through Supabase Auth — there's no password to choose or lose, but
            that also means access to your account depends on access to that email inbox.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Content</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            The verb bank, scenario bank, decision-tree reasoning, and nuance notes are
            hand-authored for this project. You're welcome to use them for your own study;
            they aren't licensed for republishing as someone else's material.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">AI-generated explanations</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            The optional "explain why" feature on missed drill questions sometimes falls back
            to an AI-generated explanation (Claude Haiku 4.5) when a free rule-based check
            can't classify the mistake. Treat that explanation as a study aid, not an
            authoritative grammar reference — cross-check anything that looks off against the
            reasoning in the{" "}
            <Link href="/diagnostic" className="text-accent hover:text-accent-deep">
              Decision Diagnostic
            </Link>{" "}
            or the{" "}
            <Link href="/notes" className="text-accent hover:text-accent-deep">
              Nuance Notes
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">No warranty</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            The app is provided as-is, without guarantees of accuracy, availability, or
            fitness for any particular purpose — including the correctness of AI-assisted
            explanations. Deterministic grading (drills and scenarios) is checked against a
            fixed answer key, but language itself has edge cases; treat any single answer key
            as a strong guide, not gospel.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Changes and termination</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            This is a small, evolving project — features, scope, and these terms may change
            over time. You can stop using the app or clear your local data at any point. We
            may suspend accounts that abuse the free AI-explanation allowance or otherwise
            attempt to overload the service.
          </p>
        </section>
      </article>
    </div>
  );
}
