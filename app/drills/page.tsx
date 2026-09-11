import type { Metadata } from "next";
import DrillsView from "@/components/DrillsView";
import PageHeader from "@/components/PageHeader";
import WelcomeBanner from "@/components/WelcomeBanner";

export const metadata: Metadata = {
  title: "Verb & Word Drills",
  description:
    "Conjugate verbs, nouns, and adjectives into sonkeigo and kenjougo, drilled by weakness. Graded instantly — no AI, no cost.",
};

export default function DrillsPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Practice"
        title="Verb & Word Drills"
        subtitle="Conjugate verbs, nouns, and adjectives into sonkeigo and kenjougo, drilled by weakness."
        badge="Graded instantly — no AI, no cost"
      />
      <WelcomeBanner />
      <DrillsView />
    </div>
  );
}
