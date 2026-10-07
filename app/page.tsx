import Hero from "@/features/movies/components/Hero";
import NowPlaying from "@/features/movies/components/NowPlaying";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070C1C]">
      <div className="mx-auto w-full max-w-[1920px]">
        <Hero />
        <NowPlaying />
      </div>
    </main>
  );
}
