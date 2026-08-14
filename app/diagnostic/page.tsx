import AppNav from "@/components/AppNav";
import DecisionTree from "@/components/DecisionTree";

export default function DiagnosticPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-4 py-16">
      <AppNav />
      <p className="mb-8 max-w-md text-center text-sm text-ink-faint">
        Walk through the actual reasoning process — answer a few questions about the
        situation, and see the register it derives.
      </p>
      <DecisionTree />
    </div>
  );
}
