import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import LoginForm from "@/components/LoginForm";
import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 bg-paper">
      <AppNav />
      <PageHeader
        mode="Account"
        title="Sign In"
        subtitle="Sync your progress across devices — no password, just a link sent to your email."
        badge="Optional — everything works without it"
      />
      <Suspense fallback={<div className="text-ink-faint">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
