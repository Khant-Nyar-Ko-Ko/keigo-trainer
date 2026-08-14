import { HonorificTarget } from "@/lib/verbs";

// The recurring visual motif: a vertical line with a marker showing where a
// form sits between 謙譲語 (humble, low) and 尊敬語 (elevated, high).
export default function RegisterScale({ target }: { target: HonorificTarget }) {
  const isTop = target === "sonkeigo";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative h-8 w-[3px] bg-line-strong">
        <span
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red"
          style={{ top: isTop ? "0%" : "100%" }}
        />
      </span>
      <span className="flex h-8 flex-col justify-between text-[10px] tracking-wide text-ink-faint">
        <span>尊敬語</span>
        <span>謙譲語</span>
      </span>
    </span>
  );
}
