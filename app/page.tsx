import Hero from "@/components/Hero";
import HomeFaq from "@/components/HomeFaq";
import HomeFeatures from "@/components/HomeFeatures";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-paper">
      <Hero />
      <HomeFeatures />
      <HomeFaq />
    </div>
  );
}
