export default function PageHeader({
  mode,
  title,
  subtitle,
  badge,
}: {
  mode: string;
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg gap-3 mb-10 text-center">
      <span className="text-xs font-semibold tracking-wide uppercase text-ink-faint">{mode}</span>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      <p className="max-w-md text-sm text-ink-faint">{subtitle}</p>
      <span className="px-3 py-1 text-xs border border-line-strong text-ink-soft">{badge}</span>
    </div>
  );
}
