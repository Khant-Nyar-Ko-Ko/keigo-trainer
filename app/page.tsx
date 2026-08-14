import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        敬語トレーニング
      </h1>
      <p className="mb-8 text-sm text-zinc-500">Keigo verb conversion drills</p>
      <Quiz />
    </div>
  );
}
