import { TEXTBOOK_NOTES } from "@/lib/textbook-notes";

export default function TextbookNotes() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      {TEXTBOOK_NOTES.map((note) => {
        const settled = note.confidence === "settled";
        return (
          <article
            key={note.id}
            className={`flex flex-col gap-4 border border-line border-l-4 bg-paper-raised p-6 sm:p-8 ${
              settled ? "border-l-correct" : "border-l-partial"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl text-ink">{note.title}</h2>
              <span
                className={`shrink-0 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                  settled ? "border-correct text-correct" : "border-partial text-partial"
                }`}
              >
                {settled ? "Widely agreed" : "Debated"}
              </span>
            </div>
            <div className="max-w-[68ch]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Textbooks teach
              </p>
              <p className="text-[15px] leading-relaxed text-ink-soft">{note.textbook}</p>
            </div>
            <div className="max-w-[68ch]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                What you&apos;ll actually hear
              </p>
              <p className="text-[15px] leading-relaxed text-ink-soft">{note.reality}</p>
            </div>
            {note.note && (
              <p className="max-w-[68ch] border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
                {note.note}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
