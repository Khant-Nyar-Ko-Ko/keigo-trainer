import PageHeader from "@/components/PageHeader";
import SettingsPanel from "@/components/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Settings"
        title="Your Data"
        subtitle="Export or clear what's saved in this browser."
        badge="Local-first — nothing leaves your device unless you sign in"
      />
      <SettingsPanel />
    </div>
  );
}
