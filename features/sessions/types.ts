export type SessionMovie = {
  id: number;
  slug: string;
  title: string;
  runtimeMinutes: number;
  posterUrl: string;
  backdropUrl: string;
  ageRating: {
    code: string;
    minAge: number;
    description: string;
  };
};

export type Session = {
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

  venue: {
    id: number;
    slug: string;
    name: string;
    city: string;
  };

  format: {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
  };

  language: {
    id: number;
    slug: string;
    name: string;
    code: string;
  };
};

export type SessionGroup = {
  movie: SessionMovie;
  sessions: Session[];
};

export type SessionsResponse = {
  data: SessionGroup[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalSessions: number;
    totalMovies: number;
    date: string;
  };
};
