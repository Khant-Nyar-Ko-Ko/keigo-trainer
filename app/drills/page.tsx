import PageHeader from "@/components/PageHeader";
import Quiz from "@/components/Quiz";
import WelcomeBanner from "@/components/WelcomeBanner";

export default function DrillsPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Practice"
        title="Verb Drills"
        subtitle="Conjugate common verbs into sonkeigo and kenjougo, drilled by weakness."
        badge="Graded instantly — no AI, no cost"
      />
      <WelcomeBanner />
      <Quiz />
    </div>
  );
}
