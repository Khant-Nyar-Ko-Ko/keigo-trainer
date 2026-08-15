import AppNav from "@/components/AppNav";
import PageHeader from "@/components/PageHeader";
import ProgressOverview from "@/components/ProgressOverview";

export default function ProgressPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <AppNav />
      <PageHeader
        mode="Progress"
        title="Your Progress"
        subtitle="What you've practiced and what still trips you up — pulled from your local history."
        badge="Pulled straight from your local history"
      />
      <ProgressOverview />
    </div>
  );
}
