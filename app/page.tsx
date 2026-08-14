import AppNav from "@/components/AppNav";
import Quiz from "@/components/Quiz";
import WelcomeBanner from "@/components/WelcomeBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-4 py-16">
      <AppNav />
      <p className="mb-8 text-sm text-ink-faint">Keigo verb conversion drills</p>
      <WelcomeBanner />
      <Quiz />
    </div>
  );
}
