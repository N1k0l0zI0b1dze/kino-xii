"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getNowPlayingMovies } from "../api/getNowPlayingMovies";

const NowPlaying = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["now-playing-movies"],
    queryFn: getNowPlayingMovies,
  });

  if (isLoading) {
    return (
      <section className="px-16.75 py-10">
        <div className="h-80 w-full rounded-xl bg-white/5" />
      </section>
    );
  }

  if (error || !data?.data.length) {
    return null;
  }

  return (
    <section className="px-16.75 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">NOW PLAYING</h2>

        <Link
          href="/sessions"
          className="text-sm font-medium text-[#EC3013] cursor-pointer"
        >
          See all
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
        {data.data.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.slug}`}
            className="shrink-0"
          >
            <article
              key={movie.id}
              className="group h-113 w-65 shrink-0 overflow-hidden rounded-[20px] bg-[#1B2030] p-3.5 transition-[width] duration-500 ease-in-out hover:w-111.75 cursor-pointer"
            >
              <div className="relative h-75 w-full overflow-hidden rounded-[14px] transition-[height] duration-500 ease-in-out group-hover:h-59">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="pt-3">
                <h3 className="text-base font-bold text-white">
                  {movie.title}
                </h3>

                <p className="mt-1 text-sm text-white/60">
                  {movie.genres[0]?.name} · {movie.runtimeMinutes} min
                </p>
              </div>

              <div className="mt-1.75 flex h-6.25 w-11.5 items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
                <p className="text-[12px] font-medium text-[#EC3013]">
                  {movie.ageRating.code}
                </p>
              </div>

              <p className="max-h-0 overflow-hidden text-[12px] text-white/70 opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-14 group-hover:opacity-100">
                {movie.synopsis}
              </p>

              <div className=" flex items-center justify-between">
                <p className="text-[12px] font-medium text-white">
                  From ₾ {movie.fromPrice}
                </p>

                <span className="flex h-8.75 w-29.75 items-center justify-center rounded-full bg-[#EC3013] text-sm font-semibold text-white">
                  Buy Ticket
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NowPlaying;
