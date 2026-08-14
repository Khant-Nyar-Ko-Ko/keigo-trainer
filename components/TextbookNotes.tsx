import { TEXTBOOK_NOTES } from "@/lib/textbook-notes";

export default function TextbookNotes() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {TEXTBOOK_NOTES.map((note) => (
        <div key={note.id} className="flex flex-col gap-3 border border-line bg-paper-raised p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-ink">{note.title}</h2>
            <span
              className={`shrink-0 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                note.confidence === "settled"
                  ? "border-green text-green"
                  : "border-red text-red"
              }`}
            >
              {note.confidence === "settled" ? "Widely agreed" : "Debated"}
            </span>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Textbooks teach
            </p>
            <p className="text-sm text-ink-soft">{note.textbook}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              What you'll actually hear
            </p>
            <p className="text-sm text-ink-soft">{note.reality}</p>
          </div>
          {note.note && (
            <p className="border-t border-line pt-3 text-xs text-ink-faint">{note.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
