"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMovieSessions } from "../api/getMovieSessions";
import type { MovieSession } from "../types";

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

  const groupSessionsByHall = (sessions: MovieSession[]) => {
    return Object.values(
      sessions.reduce<
        Record<
          number,
          {
            hall: MovieSession["hall"];
            sessions: MovieSession[];
          }
        >
      >((acc, session) => {
        const hallId = session.hall.id;

        if (!acc[hallId]) {
          acc[hallId] = {
            hall: session.hall,
            sessions: [],
          };
        }

        acc[hallId].sessions.push(session);

        return acc;
      }, {}),
    );
  };

  const venues =
    data?.data
      .map((venueGroup) => ({
        ...venueGroup,
        halls: groupSessionsByHall(venueGroup.sessions),
      }))
      .sort((a, b) => b.halls.length - a.halls.length) ?? [];

  return (
    <section className="px-16.75 pt-8.5 pb-8">
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
              className={`flex h-16 w-14 cursor-pointer flex-col items-center justify-center rounded-xl transition-colors ${isActive ? "bg-[#EC3013]" : "bg-[#1B2030]"}`}
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
          <div className="flex flex-wrap items-start gap-6">
            {venues.map((venueGroup) => (
              <div
                key={venueGroup.venue.id}
                className={venueGroup.halls.length > 1 ? "basis-full" : "w-fit"}
              >
                <h3 className="mb-3 text-sm font-semibold text-white">
                  {venueGroup.venue.name}
                </h3>

                <div className="grid w-fit grid-cols-[repeat(2,max-content)] justify-start gap-3">
                  {venueGroup.halls.map((hallGroup) => (
                    <div
                      key={hallGroup.hall.id}
                      className="w-fit rounded-xl bg-[#1B2030] p-3"
                    >
                      <p className="mb-2 text-[12px] font-medium text-white">
                        Hall {hallGroup.hall.name}
                      </p>

                      <div className="grid w-fit grid-cols-[repeat(2,max-content)] gap-2">
                        {hallGroup.sessions.map((session) => (
                          <button
                            key={session.id}
                            type="button"
                            disabled={session.isSoldOut}
                            className="flex w-fit cursor-pointer gap-2 bg-transparent text-left disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {Array.from({
                              length: hallGroup.sessions.length === 1 ? 2 : 1,
                            }).map((_, duplicate) => (
                              <div
                                key={duplicate}
                                aria-hidden="true"
                                className="pointer-events-none flex w-fit overflow-hidden rounded-2xl bg-[#101525]"
                              >
                                <div className="relative flex flex-col justify-center px-3.75 py-3">
                                  <span className="self-center text-xl font-bold text-white">
                                    {session.time}
                                  </span>

                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm text-white/60">
                                      {session.language.code}
                                    </span>

                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                                      {session.format.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="relative flex flex-col justify-center border-l border-dashed border-white/60 px-3.75 py-3">
                                  <span className="text-xl font-bold text-[#EC3013]">
                                    ₾ {session.price}
                                  </span>

                                  <span className="mt-2 text-sm text-white/60">
                                    {session.isSoldOut
                                      ? "Sold out"
                                      : `${session.seatsLeft} left`}
                                  </span>

                                  <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-[#1B2030]" />
                                  <span className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-[#1B2030]" />
                                </div>
                              </div>
                            ))}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieSessions;
