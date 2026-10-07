export type MovieFormat = {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
};

export type MovieGenre = {
  id: number;
  slug: string;
  name: string;
};

export type AgeRating = {
  code: string;
  minAge: number;
  description: string;
};

export type Movie = {
  id: number;
  slug: string;
  title: string;
  kind: string;
  runtimeMinutes: number;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  synopsis: string;
  fromPrice: number;
  isComingSoon: boolean;
  isFeatured: boolean;
  isNotified: boolean;
  ageRating: AgeRating;
  genres: MovieGenre[];
  formats: MovieFormat[];
};

export type MoviesResponse = {
  data: Movie[];
};

export type FeaturedMovie = Movie;

export type FeaturedMoviesResponse = MoviesResponse;

export type MovieDetails = Movie & {
  director: string;
  cast: string;
  availableDates: string[];
};

export type MovieDetailsResponse = {
  data: MovieDetails;
};
