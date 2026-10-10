"use client";

import { useState } from "react";
import Image from "next/image";

import { mockMoviesWithSessions } from "../data/mockMoviesWithSessions";
import { mockSorts } from "../data/mockSorts";

const ITEMS_PER_PAGE = 4;

const SessionsResults = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockMoviesWithSessions.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentMovies = mockMoviesWithSessions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  type PaginationItem = number | "...";

  const getPaginationItems = (
    currentPage: number,
    totalPages: number,
  ): PaginationItem[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, "...", totalPages];
  };
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="flex flex-col pb-24">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm font-medium text-white">Showing 12 sessions</p>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#A9A9A9]">Sort:</span>

          <select className="bg-transparent text-[12px] font-medium text-white outline-none">
            {mockSorts.map((sort) => (
              <option key={sort.id} value={sort.id} className="text-black">
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        {currentMovies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col border-b border-[#2A2C3D] py-8 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-row gap-4">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  width={56}
                  height={80}
                />

                <div className="flex flex-col">
                  <div className="mt-3.5 flex flex-row gap-3">
                    <h3 className="text-[18px] font-bold text-white">
                      {movie.title}
                    </h3>

                    <div className="mt-1 flex h-5.25 w-9.5 items-center justify-center rounded-full bg-[#EC3013]/10">
                      <p className="text-[12px] font-medium text-[#EC3013]">
                        {movie.ageRating}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-[#A9A9A9]">
                    {movie.runtimeMinutes} min
                  </p>
                </div>
              </div>

              <div className="scrollbar-none mt-3.5 flex flex-row overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <ul className="flex shrink-0 flex-row gap-3">
                  {movie.sessions.map((session) => (
                    <li
                      key={session.id}
                      className={`flex h-26 w-63 shrink-0 flex-col rounded-2xl bg-[#1E2031] px-3.75 py-3.75 ${
                        session.isSoldOut
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="flex flex-row justify-between">
                        <h3 className="text-[18px] font-bold text-white">
                          {session.time}
                        </h3>

                        <div className="flex h-5.75 w-auto items-center justify-center rounded-full bg-[#2A2C3D] px-2.5">
                          <p className="text-[12px] font-medium text-white">
                            {session.format}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-row justify-between">
                        <p className="text-[12px] font-medium text-[#A9A9A9]">
                          {session.language}
                        </p>

                        <div className="flex flex-row gap-0.5">
                          <Image
                            src={
                              session.seatsLeft <= 5
                                ? "/assets/images/sessions/ticketsRed.svg"
                                : "/assets/images/sessions/ticketsGreen.svg"
                            }
                            alt=""
                            width={12}
                            height={12}
                          />

                          <p
                            className={`text-[12px] font-medium ${
                              session.seatsLeft <= 5
                                ? "text-[#EC3013]"
                                : "text-[#4ADE80]"
                            }`}
                          >
                            {session.seatsLeft} left
                          </p>
                        </div>
                      </div>

                      <div className="mt-1.5 flex flex-row items-center justify-between">
                        <p className="text-[12px] font-medium text-white">
                          {session.venue} · {session.hall}
                        </p>

                        <p className="text-sm font-bold text-white">
                          ₾{session.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-13 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1E2031] text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/20"
          >
            ‹
          </button>

          {paginationItems.map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-10 w-10 rounded-full cursor-pointer items-center justify-center text-sm text-white hover:bg-white/20"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm text-white ${
                  currentPage === item
                    ? "bg-[#EC3013] font-medium"
                    : "hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1E2031] text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/20"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionsResults;
