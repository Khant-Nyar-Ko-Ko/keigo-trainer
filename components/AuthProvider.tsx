"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { syncOnSignIn } from "@/lib/sync";

type AuthStatus = "unavailable" | "loading" | "signed-out" | "signed-in";

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  lastSyncedAt: number | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  status: "unavailable",
  session: null,
  lastSyncedAt: null,
  signOut: async () => { },
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? "loading" : "unavailable",
  );
  const [session, setSession] = useState<Session | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  // Dedupes sync-on-sign-in per user for this app load — onAuthStateChange
  // also fires on token refresh, and we don't want to re-pull on every one.
  const syncedUserIds = useRef(new Set<string>());

  useEffect(() => {
    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setStatus(newSession ? "signed-in" : "signed-out");

      const userId = newSession?.user.id;
      if (userId && !syncedUserIds.current.has(userId)) {
        syncedUserIds.current.add(userId);
        void syncOnSignIn(userId).then(() => setLastSyncedAt(Date.now()));
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ status, session, lastSyncedAt, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
