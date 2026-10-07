"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { getFeaturedMovies } from "../api/getFeaturedMovies";

const Hero = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-movies"],
    queryFn: getFeaturedMovies,
  });

  if (isLoading) {
    return <section className="h-150 w-full bg-[#070C1C]" />;
  }

  if (error || !data?.data.length) {
    return null;
  }

  const featuredMovie = data.data[0];

  return (
    <section className="relative -mt-27.75 h-150 w-full overflow-hidden">
      <Image
        src={featuredMovie.backdropUrl}
        alt={featuredMovie.title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.51)_80%,rgba(0,0,0,0)_100%)]" />

      <div className="absolute bottom-20 left-16.75 z-10 flex w-145 flex-col gap-3.75">
        <div className="flex h-6.25 w-fit items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
          <p className="text-[12px] font-medium text-[#EC3013]">
            PREMIERE · WEEK OF 15 SEPT
          </p>
        </div>

        <h1 className="text-[40px] font-extrabold text-white">
          {featuredMovie.title}
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex h-6.25 min-w-11.5 items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
            <p className="text-[12px] font-medium text-[#EC3013]">
              {featuredMovie.ageRating.code}
            </p>
          </div>

          <div className="flex h-6.25 items-center justify-center gap-1 rounded-full bg-white/10 px-3">
            <Image
              src="/assets/images/hero/Timer.svg"
              alt=""
              width={14}
              height={14}
            />

            <p className="text-[12px] font-medium text-white">
              {featuredMovie.runtimeMinutes} Min
            </p>
          </div>

          {featuredMovie.formats.map((format) => (
            <div
              key={format.id}
              className="flex h-6.25 items-center justify-center rounded-full bg-white/10 px-3"
            >
              <p className="text-[12px] font-medium text-white">
                {format.name}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-white">
          {featuredMovie.synopsis}
        </p>

        <div className="mt-1.25 flex gap-2.5">
          <button
            type="button"
            className="flex h-10.5 w-35.75 cursor-pointer items-center justify-center gap-1 rounded-full bg-[#EC3013] text-[14px] font-semibold text-white"
          >
            <Image
              src="/assets/images/user-profile/tickets.svg"
              alt=""
              width={16}
              height={16}
            />
            Buy tickets
          </button>

          <button
            type="button"
            className="flex h-10.5 w-35.75 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[14px] font-semibold text-white hover:bg-white/20"
          >
            All sessions
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
