"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMovieDetails } from "../api/getMovieDetails";
import { addRecentlyViewedMovie } from "../utils/recentlyViewed";
import MovieDetailsHero from "./MovieDetailsHero";
import MovieSessions from "./MovieSessions";
import MovieDetailsInfo from "./MovieDetailsInfo";

type MovieDetailsProps = {
  movieSlug: string;
};

const MovieDetails = ({ movieSlug }: MovieDetailsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movie-details", movieSlug],
    queryFn: () => getMovieDetails(movieSlug),
  });

  const movie = data?.data;

  useEffect(() => {
    if (!movie) return;

    addRecentlyViewedMovie(movie);
  }, [movie]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#070C1C] text-white">Loading...</main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-[#070C1C] text-white">
        Movie not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070C1C] text-white">
      <MovieDetailsHero movie={movie} />

      <section className="grid grid-cols-[minmax(0,1fr)_441px]">
        <MovieSessions
          movieSlug={movieSlug}
          availableDates={movie.availableDates}
          ageRatingMinAge={movie.ageRating.minAge}
        />

        <MovieDetailsInfo movie={movie} />
      </section>
    </main>
  );
};

export default MovieDetails;
