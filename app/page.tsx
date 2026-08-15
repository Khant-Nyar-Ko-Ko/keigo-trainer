import AppNav from "@/components/AppNav";
import PageHeader from "@/components/PageHeader";
import Quiz from "@/components/Quiz";
import WelcomeBanner from "@/components/WelcomeBanner";

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <AppNav />
      <PageHeader
        mode="Verb Drills"
        title="Verb Conjugation Drills"
        subtitle="Practice converting plain verbs into sonkeigo and kenjougo forms."
        badge="Mechanical, but the foundation everything else builds on"
      />
      <WelcomeBanner />
      <Quiz />
    </div>
  );
}
