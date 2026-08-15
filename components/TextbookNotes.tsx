import { TEXTBOOK_NOTES } from "@/lib/textbook-notes";

export default function TextbookNotes() {
  return (
    <div className="flex flex-col w-full max-w-2xl gap-4">
      {TEXTBOOK_NOTES.map((note) => (
        <div key={note.id} className="flex flex-col gap-3 p-6 border border-line bg-paper-raised">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-display text-ink">{note.title}</h2>
            <span
              className={`shrink-0 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${note.confidence === "settled"
                ? "border-success text-success"
                : "border-accent text-accent"
                }`}
            >
              {note.confidence === "settled" ? "Widely agreed" : "Debated"}
            </span>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-ink-faint">
              Textbooks teach
            </p>
            <p className="text-sm text-ink-soft">{note.textbook}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-ink-faint">
              What you'll actually hear
            </p>
            <p className="text-sm text-ink-soft">{note.reality}</p>
          </div>
          {note.note && (
            <p className="pt-3 text-xs border-t border-line text-ink-faint">{note.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
