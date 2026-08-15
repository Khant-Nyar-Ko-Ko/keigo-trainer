"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

type Status = "idle" | "sending" | "sent" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-link": "That sign-in link is invalid or has expired. Request a new one below.",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: authStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(
    ERROR_MESSAGES[searchParams.get("error") ?? ""] ?? null,
  );

  useEffect(() => {
    if (authStatus === "signed-in") {
      router.replace("/");
    }
  }, [authStatus, router]);

  if (!isSupabaseConfigured) {
    return (
      <div className="w-full max-w-sm p-6 text-sm border border-line bg-paper-raised text-ink-soft">
        Sign-in isn&apos;t configured for this deployment yet.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setStatus("sending");
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });

    if (error) {
      setStatus("error");
      setMessage(
        error.code === "over_email_send_rate_limit"
          ? "Too many sign-in attempts — wait a few minutes and try again."
          : "Couldn't send the link. Try again in a moment.",
      );
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="flex flex-col w-full max-w-sm gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-8 border border-line bg-paper-raised"
      >
        <label htmlFor="email" className="text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending" || status === "sent"}
          placeholder="you@example.com"
          autoFocus
          className="px-4 py-3 text-lg border outline-none border-line-strong bg-paper text-ink focus:border-accent disabled:opacity-60"
        />
        {status !== "sent" && (
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-4 py-3 font-medium bg-ink text-paper hover:bg-accent-deep disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send sign-in link"}
          </button>
        )}
      </form>

      {status === "sent" && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 text-sm border border-success bg-success-soft text-ink-soft"
        >
          Check <span className="font-semibold text-ink">{email}</span> for a sign-in link.
        </div>
      )}

      {message && status !== "sent" && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 text-sm border border-accent bg-accent-soft text-ink-soft"
        >
          {message}
        </div>
      )}
    </div>
  );
}
