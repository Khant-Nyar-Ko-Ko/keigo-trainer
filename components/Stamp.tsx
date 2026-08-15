export default function Stamp({
  kanji,
  size = 40,
}: {
  kanji: string;
  size?: number;
}) {
  return (
    <span
      lang="ja"
      aria-hidden="true"
      className="inline-flex items-center justify-center border-2 rounded-full shrink-0 border-accent font-display text-accent"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {kanji}
    </span>
  );
}
