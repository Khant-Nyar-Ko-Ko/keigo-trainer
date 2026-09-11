"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "keigo-trainer-cookie-notice-dismissed";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-14 z-50 flex justify-center px-4 pb-4 sm:bottom-0 sm:pb-6"
    >
      <div className="flex w-full max-w-2xl flex-col items-start gap-3 border border-line-strong bg-paper-raised p-4 text-sm shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-soft">
          This app only sets a cookie if you sign in — to keep your session going. No ads or
          analytics cookies, ever. See the{" "}
          <Link href="/cookies" className="text-accent underline underline-offset-2 hover:text-accent-deep">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 self-end border border-line-strong px-3 py-1.5 text-xs text-ink-soft hover:border-accent hover:text-accent sm:self-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
