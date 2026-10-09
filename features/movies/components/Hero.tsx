"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { getFeaturedMovies } from "../api/getFeaturedMovies";
import Link from "next/link";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-movies"],
    queryFn: getFeaturedMovies,
  });

  const movieCount = data?.data.length ?? 0;

  useEffect(() => {
    if (movieCount <= 1) return;

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % movieCount);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, movieCount]);

  if (isLoading) {
    return <section className="h-190 w-full bg-[#070C1C]" />;
  }

  if (error || !data?.data.length) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? data.data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === data.data.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative -mt-27.75 h-190 w-full overflow-hidden">
      {data.data.map((movie, index) => (
        <Image
          key={movie.id}
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.51)_80%,rgba(0,0,0,0)_100%)]" />

      {data.data.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute top-81.25 left-16.75 z-10 flex w-145 flex-col gap-3.75 transition-all duration-700 ease-in-out ${
            index === activeIndex
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="flex h-6.25 w-fit items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
            <p className="text-[12px] font-medium text-[#EC3013]">
              PREMIERE · WEEK OF 15 SEPT
            </p>
          </div>

          <h1 className="text-[40px] font-extrabold text-white">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex h-6.25 min-w-11.5 items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
              <p className="text-[12px] font-medium text-[#EC3013]">
                {movie.ageRating.code}
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
                {movie.runtimeMinutes} Min
              </p>
            </div>

            {movie.formats.map((format) => (
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

          <p className="text-sm font-medium text-white">{movie.synopsis}</p>

          <div className="mt-1.25 flex gap-2.5">
            <Link
              href={`/movies/${movie.slug}`}
              className="flex h-10.5 w-35.75 cursor-pointer items-center justify-center gap-1 rounded-full bg-[#EC3013] text-[14px] font-semibold text-white"
            >
              <Image
                src="/assets/images/user-profile/tickets.svg"
                alt=""
                width={16}
                height={16}
              />
              Buy tickets
            </Link>

            <Link
              href="/sessions"
              className="flex h-10.5 w-35.75 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[14px] font-semibold text-white hover:bg-white/20"
            >
              All sessions
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 left-16.75 right-16.75 z-10 flex items-center gap-4">
        <div className="flex flex-1 gap-1.5">
          {data.data.map((movie, index) => (
            <div
              key={movie.id}
              className={`h-0.5 flex-1 transition-colors duration-500 ${
                index === activeIndex ? "bg-[#EC3013]" : "bg-white/80"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous featured movie"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/5"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next featured movie"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/5"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
