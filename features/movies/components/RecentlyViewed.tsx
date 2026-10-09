"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getRecentlyViewedMovies,
  type RecentlyViewedMovie,
} from "@/features/movies/utils/recentlyViewed";

const RecentlyViewed = () => {
  const [movies, setMovies] = useState<RecentlyViewedMovie[]>([]);

  useEffect(() => {
    setMovies(getRecentlyViewedMovies());
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="mt-8 flex w-full flex-col px-17.5">
      <h2 className="text-xl font-bold text-white">Recently viewed</h2>

      <ul className="scrollbar-none mt-5 flex flex-row gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="h-21.75 w-[329.12px] shrink-0 overflow-hidden rounded-2xl bg-[#1E2031] p-2.5"
          >
            <Link
              href={`/movies/${movie.slug}`}
              className="flex h-full w-full flex-row gap-3"
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={87}
                height={67}
                className="rounded-lg object-cover"
              />

              <div className="flex flex-col">
                <p className="text-sm font-bold text-white">{movie.title}</p>

                <p className="text-[12px] font-medium text-[#A9A9A9]">
                  {movie.genres[0]?.name} · {movie.runtimeMinutes} min
                </p>

                <div className="mt-1 flex h-5.25 w-9.5 items-center justify-center rounded-full bg-[#EC3013]/10">
                  <p className="text-[12px] font-medium text-[#EC3013]">
                    {movie.ageRating.code}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentlyViewed;
