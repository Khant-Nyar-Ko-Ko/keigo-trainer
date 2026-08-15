const FAQS = [
  {
    q: "Do I need an account?",
    a: "No. Everything works fully in the browser via local storage. Signing in is optional and only adds syncing progress across devices.",
  },
  {
    q: "Is it free?",
    a: "Yes. Drills and scenarios are graded deterministically against a fixed key, at zero marginal cost. AI explanations are a capped fallback, not the primary experience.",
  },
  {
    q: "What's the difference between sonkeigo and kenjougo?",
    a: "尊敬語 (sonkeigo) elevates someone else's action. 謙譲語 (kenjougo) humbles your own. The Decision Diagnostic walks through how to tell which one a situation calls for.",
  },
  {
    q: "Where does my progress go?",
    a: "It's saved in this browser's local storage. Sign in with a magic link if you want it to follow you across devices.",
  },
] as const;

export default function HomeFaq() {
  return (
    <section className="w-full">
      <div className="flex flex-col w-full max-w-3xl gap-8 px-4 py-16 mx-auto sm:py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">
            FAQ
          </span>
          <h2 className="text-2xl font-semibold font-display text-ink sm:text-3xl">
            Common questions
          </h2>
        </div>
        <dl className="flex flex-col divide-y divide-line border-y border-line">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="flex flex-col gap-2 py-5">
              <dt className="text-base font-semibold font-display text-ink">{q}</dt>
              <dd className="text-sm text-ink-soft">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
