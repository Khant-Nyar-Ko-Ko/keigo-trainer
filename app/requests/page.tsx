import PageHeader from "@/components/PageHeader";
import RequestPractice from "@/components/RequestPractice";

export default function RequestsPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <PageHeader
        mode="Request Scale"
        title="Request Scale"
        subtitle="Same favor, different weight — escalate a request from てください to ていただけますでしょうか based on who's asking whom, and how much you're imposing."
        badge="Not who's the actor — how big is the ask"
      />
      <RequestPractice />
    </div>
  );
}
