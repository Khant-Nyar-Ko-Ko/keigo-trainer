import HomeIntro from "@/components/HomeIntro";
import Quiz from "@/components/Quiz";
import WelcomeBanner from "@/components/WelcomeBanner";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-paper">
      <HomeIntro />
      <div
        id="practice"
        className="flex w-full scroll-mt-24 flex-col items-center px-4 py-16"
      >
        <WelcomeBanner />
        <Quiz />
      </div>
    </div>
  );
}
