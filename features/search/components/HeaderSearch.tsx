"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getSearchResults } from "../api/getSearchResults";

const HeaderSearch = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => getSearchResults(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const showSearchIcon = !isFocused || search.length > 0;
  return (
    <div
      className="relative ml-auto flex w-120 justify-end"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="flex h-10.25 w-95 items-center gap-2 rounded-full bg-white/10 px-3 transition-[width] duration-300 focus-within:w-full">
        {showSearchIcon && (
          <Image
            src="/assets/images/search/search.svg"
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
        )}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search films and live events..."
          className="w-full bg-transparent outline-none text-[14px] placeholder:text-[14px] placeholder:text-white"
        />

        {search.length > 0 && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full cursor-pointer"
          >
            <Image
              src="/assets/images/search/clear.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>
        )}
      </div>

      {isFocused && search.length === 0 && (
        <div className="absolute top-12 right-0 flex h-62 w-full flex-col items-center justify-center rounded-xl bg-[#070C1C]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E2031]">
            <Image
              src="/assets/images/search/search.svg"
              alt=""
              width={18}
              height={18}
            />
          </div>

          <p className="mt-5 text-sm font-semibold text-white">
            What do you want to watch?
          </p>

          <p className="mt-1 text-[12px] text-[#A9A9A9]">
            Search by title, director or cast
          </p>

          <Link
            href="/sessions"
            className="mt-5 flex h-9 items-center justify-center rounded-full bg-[#1E2031] px-5 text-[12px] font-semibold text-white"
          >
            Browse all sessions
          </Link>
        </div>
      )}

      {isFocused && search.length > 0 && data && data.data.length > 0 && (
        <div className="absolute top-12 right-0 w-full rounded-xl bg-[#070C1C] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium text-[#A9A9A9]">
              FILMS & EVENTS
            </p>

            <p className="text-[10px] text-[#A9A9A9]">
              {data.data.length} results
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {data.data.map((movie) => (
              <li key={movie.id}>
                <Link
                  href={`/movies/${movie.slug}`}
                  className="flex items-center gap-3"
                >
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={40}
                    height={54}
                    className="h-13.5 w-10 rounded-md object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-white">
                      {movie.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#A9A9A9]">
                      {movie.kind === "film" ? "Film" : movie.kind} ·{" "}
                      {movie.ageRating.code} · {movie.runtimeMinutes} min
                    </p>
                  </div>

                  {movie.isComingSoon ? (
                    <p className="text-[10px] font-medium text-[#FFB800]">
                      Coming Soon
                    </p>
                  ) : (
                    <p className="shrink-0 text-[10px] font-semibold text-white">
                      from ₾{movie.fromPrice}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isFocused &&
        debouncedSearch.length > 0 &&
        !isLoading &&
        !error &&
        data &&
        data.data.length === 0 && (
          <div className="absolute top-12 right-0 flex h-62 w-full flex-col items-center justify-center rounded-xl bg-[#070C1C]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E2031]">
              <Image
                src="/assets/images/search/search.svg"
                alt=""
                width={18}
                height={18}
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-white">
              No results for “{debouncedSearch}”
            </p>

            <p className="mt-1 text-[12px] text-[#A9A9A9]">
              Check the spelling or try another film or live event.
            </p>

            <Link
              href="/sessions"
              className="mt-5 flex h-9 items-center justify-center rounded-full bg-[#1E2031] px-5 text-[12px] font-semibold text-white"
            >
              Browse all sessions
            </Link>
          </div>
        )}
    </div>
  );
};

export default HeaderSearch;
