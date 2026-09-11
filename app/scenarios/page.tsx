import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ScenarioPractice from "@/components/ScenarioPractice";

export const metadata: Metadata = {
  title: "Scenario Practice",
  description:
    "The register isn't given — figure out sonkeigo or kenjougo from the situation, then produce the form. Teaches who speaks to whom, not just conjugation.",
};

export default function ScenariosPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Scenario Practice"
        title="Scenario Practice"
        subtitle="The register isn't given — figure out sonkeigo or kenjougo from the situation, then produce the form."
        badge="Teaches WHO speaks to WHOM, not just conjugation"
      />
      <ScenarioPractice />
    </div>
  );
}
