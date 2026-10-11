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

export type MovieVenue = {
  id: number;
  slug: string;
  name: string;
  city: string;
};

export type MovieLanguage = {
  id: number;
  slug: string;
  name: string;
  code: string;
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

export type MovieSession = {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: {
    id: number;
    name: string;
  };
  venue: MovieVenue;
  format: MovieFormat;
  language: MovieLanguage;
};

export type MovieSessionsVenue = {
  venue: MovieVenue;
  sessions: MovieSession[];
};

export type MovieSessionsResponse = {
  data: MovieSessionsVenue[];
};

export type SeatState = "available" | "sold" | "held" | "unavailable";

export type SessionSeat = {
  id: number;
  code: string;
  label: string;
  state: SeatState;
  aisleAfter: boolean;
  isMine: boolean;
};

export type SeatRow = {
  label: string;
  seats: SessionSeat[];
};

export type SeatSection = {
  name: string;
  rows: SeatRow[];
};

export type SeatMapResponse = {
  data: {
    sessionId: number;
    hall: {
      id: number;
      name: string;
      venue: MovieVenue;
    };
    sections: SeatSection[];
  };
};
