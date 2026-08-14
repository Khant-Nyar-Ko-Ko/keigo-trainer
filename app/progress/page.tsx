import AppNav from "@/components/AppNav";
import ProgressOverview from "@/components/ProgressOverview";

export default function ProgressPage() {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-16 bg-paper">
      <AppNav />
      <p className="max-w-md mb-8 text-sm text-center text-ink-faint">
        What you&apos;ve practiced and what still trips you up — pulled from your local history.
      </p>
      <ProgressOverview />
    </div>
  );
}
