import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-16 bg-paper">
      <AppNav />
      <p className="max-w-md mb-8 text-sm text-center text-ink-faint">
        Sign in to sync your progress across devices — no password, just a link sent to your
        email. Everything still works without an account; this is optional.
      </p>
      <Suspense fallback={<div className="text-ink-faint">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
