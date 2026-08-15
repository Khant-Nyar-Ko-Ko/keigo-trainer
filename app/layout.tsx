import type { Metadata } from "next";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keigo Companion",
  description: "Practice Japanese keigo — verb drills and situational judgment.",
};

const THEME_INIT_SCRIPT = `
  try {
    var stored = localStorage.getItem("keigo-trainer-theme");
    if (stored) document.documentElement.dataset.theme = stored;
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex flex-col min-h-full font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <AuthProvider>
          <div className="flex flex-col flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
