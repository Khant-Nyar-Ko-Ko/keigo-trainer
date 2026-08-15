import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Legal"
        title="Privacy Policy"
        subtitle="What's stored, where it lives, and who ever sees it."
        badge="Last updated August 15, 2026"
      />
      <article className="flex flex-col w-full max-w-2xl gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">The short version</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Keigo Companion is local-first. Your drill and scenario progress lives in this
            browser's local storage unless you choose to sign in. Signing in is optional and
            only adds syncing that same data across devices. There are no ads, no analytics
            scripts, and nothing here is sold or shared with data brokers.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">What's stored, and where</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            In this browser, always: verb-drill and scenario progress, accuracy stats, your
            light/dark theme choice, and a daily counter for the optional AI-explanation
            feature. None of this leaves your device unless you sign in.
          </p>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            If you sign in (optional): your email address, used only to send the magic sign-in
            link via Supabase Auth, and the same progress and stats data, synced to a database
            row tied to your account so it follows you across devices. Every row is scoped to
            your account alone.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Third parties involved</h2>
          <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-soft">
            <li>
              <strong className="text-ink">Supabase</strong> — handles sign-in and, only for
              signed-in users, stores the synced progress data.
            </li>
            <li>
              <strong className="text-ink">Anthropic (Claude Haiku 4.5)</strong> — used only
              for the optional "explain why" fallback on a missed drill question, and only
              after a free rule-based check can't classify the mistake. What's sent is the
              verb, the register, your answer, and the correct answer — never your email or
              account identity.
            </li>
            <li>
              <strong className="text-ink">Vercel</strong> — hosts the app itself, with the
              standard server logs any web host keeps.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">What we don't do</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            No ads, no ad trackers, no analytics scripts, no third-party sign-in beyond
            Supabase's own email magic link, and no selling or sharing of your data.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Your controls</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Export or clear your local progress anytime from{" "}
            <Link href="/settings" className="text-accent hover:text-accent-deep">
              Settings
            </Link>
            . Signing out stops any further syncing. To have your account and synced data
            deleted entirely, open an issue on the project's{" "}
            <a
              href="https://github.com/Khant-Nyar-Ko-Ko/keigo-trainer"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-accent-deep"
            >
              GitHub repository
            </a>{" "}
            — there's no separate support desk behind this project.
          </p>
        </section>
      </article>
    </div>
  );
}
