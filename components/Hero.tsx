import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="grid items-center w-full max-w-5xl grid-cols-1 gap-12 px-4 py-16 mx-auto sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6 text-left">
          <span className="px-3 py-1 text-xs tracking-wide uppercase border border-line-strong text-ink-soft">
            Judgment-First Keigo
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Judgment first.
            <br />
            Conjugation second.
          </h1>
          <p className="max-w-md text-base text-ink-soft sm:text-lg">
            Most keigo tools drill verb forms. This one teaches which register to use on
            whom — uchi/soto, hierarchy, and the social reasoning textbooks skip.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/drills"
              className="px-6 py-3 text-base font-semibold text-white bg-accent hover:bg-accent-deep"
            >
              Start practicing
            </Link>
            <Link
              href="/scenarios"
              className="px-6 py-3 text-base border border-line-strong text-ink-soft hover:border-accent hover:text-accent"
            >
              Try scenario judgment →
            </Link>
          </div>
          <p className="text-xs text-ink-faint">100% free · No account needed · No ads</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm p-8 border border-line bg-paper-raised shadow-high">
            <div className="text-center">
              <p lang="ja" className="text-3xl font-display text-ink">
                言う
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                iu — the plain form, before any audience is decided
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-5 mt-6 border-t border-line-strong">
              <div className="border border-line px-3 py-2.5 text-center">
                <p lang="ja" className="text-lg font-display text-teineigo">
                  言います
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-teineigo">
                  丁寧語 · baseline
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">
                  Polite to anyone, elevates no one
                </p>
              </div>
              <div className="border border-line px-3 py-2.5 text-center">
                <p lang="ja" className="text-lg font-display text-sonkeigo">
                  おっしゃる
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-sonkeigo">
                  尊敬語 · elevate
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">
                  When someone senior is speaking
                </p>
              </div>
              <div className="border border-line px-3 py-2.5 text-center">
                <p lang="ja" className="text-lg font-display text-kenjougo">
                  申す
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-kenjougo">
                  謙譲語 · humble
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">
                  When you're speaking, to someone senior
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
