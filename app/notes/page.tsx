import AppNav from "@/components/AppNav";
import TextbookNotes from "@/components/TextbookNotes";

export default function NotesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-4 py-16">
      <AppNav />
      <p className="mb-8 max-w-md text-center text-sm text-ink-faint">
        Places taught Japanese diverges from what's actually said — not hard rules, since
        several of these are genuinely debated among native speakers.
      </p>
      <TextbookNotes />
    </div>
  );
}
