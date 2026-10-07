"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMovieSessions } from "../api/getMovieSessions";

type MovieSessionsProps = {
  movieSlug: string;
  availableDates: string[];
};

const MovieSessions = ({ movieSlug, availableDates }: MovieSessionsProps) => {
  const dates = availableDates.slice(0, 7);
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie-sessions", movieSlug, selectedDate],
    queryFn: () => getMovieSessions(movieSlug, selectedDate),
    enabled: !!selectedDate,
  });

  const formatDate = (date: string) => {
    const value = new Date(`${date}T00:00:00Z`);

    return {
      weekday: value.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      day: value.toLocaleDateString("en-US", {
        day: "2-digit",
        timeZone: "UTC",
      }),
    };
  };

  return (
    <section className="px-16.75 py-8">
      <div>
        <h2 className="text-xl font-bold text-white">Sessions</h2>
        <p className="mt-1 text-[12px] text-white/50">
          Sessions over the next seven days
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        {dates.map((date) => {
          const formattedDate = formatDate(date);
          const isActive = date === selectedDate;

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`flex h-16 w-14 cursor-pointer flex-col items-center justify-center rounded-xl border transition-colors ${
                isActive
                  ? "border-[#EC3013] bg-[#EC3013]/10"
                  : "border-white/5 bg-[#1B2030]"
              }`}
            >
              <span className="text-[11px] font-medium text-white/70">
                {formattedDate.weekday}
              </span>
              <span className="mt-1 text-base font-bold text-white">
                {formattedDate.day}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {isLoading && (
          <p className="text-sm text-white/60">Loading sessions...</p>
        )}

        {error && (
          <p className="text-sm text-[#EC3013]">Failed to load sessions.</p>
        )}

        {!isLoading && !error && data && (
          <p className="text-sm text-white/60">
            {data.data.length} venue{data.data.length === 1 ? "" : "s"} found
          </p>
        )}
      </div>
    </section>
  );
};

export default MovieSessions;
