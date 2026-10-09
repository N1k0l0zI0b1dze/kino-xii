"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getComingSoonMovies } from "../api/getComingSoonMovies";

const ComingSoon = () => {
  const [toastMessage, setToastMessage] = useState("");

  const handleNotify = () => {
    setToastMessage("You will be notified");

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["coming-soon-movies"],
    queryFn: getComingSoonMovies,
  });

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return null;
  }

  const movies = data.data;

  return (
    <section className="mt-8 flex w-full flex-col px-17.5 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">COMING SOON...</h2>

        <Link
          href="/sessions"
          className="cursor-pointer text-sm font-medium text-[#EC3013]"
        >
          See all
        </Link>
      </div>

      <ul className="scrollbar-none mt-5 flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="flex h-40 w-117.5 shrink-0 gap-4 overflow-hidden rounded-2xl bg-[#1E2031] p-2.5"
          >
            <div className="relative h-full w-56.25 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={movie.backdropUrl}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col py-1">
              <p className="text-sm font-bold text-white">{movie.title}</p>

              <p className="mt-1 text-[12px] font-medium text-[#A9A9A9]">
                {movie.genres[0]?.name} · {movie.runtimeMinutes} min
              </p>

              <div className="mt-2 flex h-5.25 w-9.5 items-center justify-center rounded-full bg-[#EC3013]/10">
                <span className="text-[12px] font-medium text-[#EC3013]">
                  {movie.ageRating.code}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNotify}
                className="mt-auto flex h-8 w-fit cursor-pointer items-center gap-2 rounded-full border border-[#A9A9A9] px-4 text-[12px] font-medium text-white hover:bg-white/5"
              >
                <Image
                  src="/assets/images/hero/notify.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                Notify Me
              </button>
            </div>
          </li>
        ))}
      </ul>

      {toastMessage && (
        <div className="fixed right-6 bottom-6 z-50 rounded-xl bg-[#1E2031] px-5 py-3 text-sm font-medium text-green-400 shadow-lg border border-green-400">
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default ComingSoon;
