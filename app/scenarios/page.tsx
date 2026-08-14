import AppNav from "@/components/AppNav";
import ScenarioPractice from "@/components/ScenarioPractice";

export default function ScenariosPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-4 py-16">
      <AppNav />
      <p className="mb-8 max-w-md text-center text-sm text-ink-faint">
        The register isn&apos;t given — figure out sonkeigo or kenjougo from the situation, then produce the form.
      </p>
      <ScenarioPractice />
    </div>
  );
}
