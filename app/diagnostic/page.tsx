import DecisionTree from "@/components/DecisionTree";
import PageHeader from "@/components/PageHeader";

export default function DiagnosticPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Decision Diagnostic"
        title="Decision Tree Diagnostic"
        subtitle="Walk through the actual reasoning process — answer a few questions about the situation, and see the register it derives."
        badge="The reasoning framework, made explicit"
      />
      <DecisionTree />
    </div>
  );
}
