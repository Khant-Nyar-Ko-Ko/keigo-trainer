import Link from "next/link";
import RegisterScale from "./RegisterScale";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6 text-left">
          <span className="border border-line-strong px-3 py-1 text-xs uppercase tracking-wide text-ink-soft">
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
            <a
              href="#practice"
              className="bg-accent px-6 py-3 text-base font-semibold text-white hover:bg-accent-deep"
            >
              Start practicing
            </a>
            <Link
              href="/scenarios"
              className="border border-line-strong px-6 py-3 text-base text-ink-soft hover:border-accent hover:text-accent"
            >
              Try scenario judgment →
            </Link>
          </div>
          <p className="text-xs text-ink-faint">100% free · No account needed · No ads</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm border border-line bg-paper-raised p-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Example
            </span>
            <div className="mt-4 flex items-center gap-4">
              <RegisterScale target="sonkeigo" />
              <div>
                <p className="text-xs text-ink-faint">plain form</p>
                <p lang="ja" className="font-display text-2xl text-ink">
                  話す
                </p>
              </div>
            </div>
            <div className="my-5 h-px bg-line" />
            <div>
              <p className="text-xs text-ink-faint">尊敬語 — elevate their action</p>
              <p lang="ja" className="font-display text-3xl text-sonkeigo">
                お話しになる
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
