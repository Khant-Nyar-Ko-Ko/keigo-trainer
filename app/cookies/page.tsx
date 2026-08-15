import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function CookiesPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Legal"
        title="Cookie Policy"
        subtitle="Most of what makes this app work isn't a cookie at all."
        badge="Last updated August 15, 2026"
      />
      <article className="flex flex-col w-full max-w-2xl gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">The short version</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Nearly everything this app remembers about you — progress, stats, theme — is kept
            in your browser's local storage, which is not a cookie and is never sent to a
            server on its own. An actual cookie is only ever set in one place: keeping you
            signed in, if you choose to sign in.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Local storage (not cookies)</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Stored under keys like <code className="text-[13px]">keigo-trainer-progress</code>,{" "}
            <code className="text-[13px]">keigo-trainer-scenario-progress</code>,{" "}
            <code className="text-[13px]">keigo-trainer-stats</code>,{" "}
            <code className="text-[13px]">keigo-trainer-explain-usage</code>, and{" "}
            <code className="text-[13px]">keigo-trainer-theme</code>. If you sign in, one more
            key records that this device's local progress has already been merged into your
            account, so it isn't double-counted on a later sign-in.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Cookies (only if you sign in)</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Supabase Auth sets a session cookie so the app can recognize you across visits
            without asking you to click the email link again every time. It's refreshed
            automatically in the background. No advertising or cross-site tracking cookies are
            set by this app, signed in or not.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Third-party cookies</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            None. There are no ad networks or analytics providers embedded in this app to set
            them.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-display text-ink">Your controls</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Clearing this site's data in your browser removes both local storage and the
            Supabase session cookie — you'll land back in guest, local-only mode. You can also
            clear just your progress from{" "}
            <Link href="/settings" className="text-accent hover:text-accent-deep">
              Settings
            </Link>{" "}
            without touching your sign-in.
          </p>
        </section>
      </article>
    </div>
  );
}
