import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import Script from "next/script";
import AppNav from "@/components/AppNav";
import AuthProvider from "@/components/AuthProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Footer from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-latin",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-latin",
});

export const metadata: Metadata = {
  title: {
    default: "Keigo Companion — Judgment-First Keigo Practice",
    template: "%s | Keigo Companion",
  },
  description:
    "Practice Japanese keigo the way it's actually used: judge who speaks to whom, then conjugate. Verb drills, scenario practice, and a decision-tree diagnostic for sonkeigo and kenjougo — 100% free, no account needed.",
};

const THEME_INIT_SCRIPT = `
  try {
    var stored = localStorage.getItem("keigo-trainer-theme");
    if (stored) document.documentElement.dataset.theme = stored;
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth antialiased ${fraunces.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col pb-14 font-sans sm:pb-0">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <AuthProvider>
          <AppNav />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </AuthProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
