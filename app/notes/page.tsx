import PageHeader from "@/components/PageHeader";
import TextbookNotes from "@/components/TextbookNotes";

export default function NotesPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Nuance Notes"
        title="Textbook vs. Real Japanese"
        subtitle="Places taught Japanese diverges from what's actually said — not hard rules, since several of these are genuinely debated among native speakers."
        badge="Honestly hedged — settled vs. debated, marked"
      />
      <TextbookNotes />
    </div>
  );
}
