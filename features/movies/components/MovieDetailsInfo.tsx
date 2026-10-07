import type { MovieDetails } from "../types";

type MovieDetailsInfoProps = {
  movie: MovieDetails;
};

const MovieDetailsInfo = ({ movie }: MovieDetailsInfoProps) => {
  const releaseDate = new Date(
    `${movie.releaseDate}T00:00:00Z`,
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <aside className="h-full px-8 pt-8.5 pb-8 text-white">
      <h2 className="text-xl font-bold">Details</h2>

      <div className="mt-5 flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            Director
          </p>
          <p className="mt-1 text-sm font-medium">{movie.director}</p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            Main Cast
          </p>
          <p className="mt-1 max-w-80 text-sm font-medium leading-5">
            {movie.cast}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            Duration
          </p>
          <p className="mt-1 text-sm font-medium">
            {movie.runtimeMinutes} minutes
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            Release Date
          </p>
          <p className="mt-1 text-sm font-medium">{releaseDate}</p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            Formats
          </p>
          <p className="mt-1 text-sm font-medium">
            {movie.formats.map((format) => format.name).join(", ")}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase text-white/50">
            From
          </p>
          <p className="mt-1 text-sm font-medium">₾{movie.fromPrice}</p>
        </div>

        <div className="rounded-xl border border-[#A86A13]/20 bg-[#A86A13]/15 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase text-[#F4A51C]">
            Rating Note
          </p>

          <p className="mt-1 text-[12px] leading-4 text-[#F4A51C]">
            <span className="font-bold">{movie.ageRating.code}</span>
            {" · "}
            {movie.ageRating.description}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default MovieDetailsInfo;
