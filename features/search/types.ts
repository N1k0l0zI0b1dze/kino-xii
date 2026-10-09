import type { Movie } from "@/features/movies/types";

export type SearchResult = Pick<
  Movie,
  | "id"
  | "slug"
  | "title"
  | "kind"
  | "runtimeMinutes"
  | "posterUrl"
  | "isComingSoon"
  | "fromPrice"
  | "ageRating"
>;

export type SearchResponse = {
  data: SearchResult[];
};
