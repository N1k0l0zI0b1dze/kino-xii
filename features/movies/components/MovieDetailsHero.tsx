import Image from "next/image";

import type { MovieDetails } from "../types";

type MovieDetailsHeroProps = {
  movie: MovieDetails;
};

const MovieDetailsHero = ({ movie }: MovieDetailsHeroProps) => {
  return (
    <section className="relative -mt-27.75 h-141.75 w-full overflow-hidden">
      <Image
        src={movie.backdropUrl}
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute top-38 left-15 z-10 h-93.5 w-72.25 overflow-hidden rounded-[14px]">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute top-81.75 left-95.75 z-10 flex w-145 flex-col gap-3">
        <div className="flex h-6.25 w-fit items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
          <p className="text-[12px] font-medium text-[#EC3013]">NOW PLAYING</p>
        </div>

        <h1 className="text-[40px] font-extrabold text-white">{movie.title}</h1>

        <p className="text-sm font-medium text-white">{movie.synopsis}</p>

        <div className="flex items-center gap-2">
          <div className="flex h-6.25 min-w-11.5 items-center justify-center rounded-full bg-[#EC3013]/10 px-3">
            <p className="text-[12px] font-medium text-[#EC3013]">
              {movie.ageRating.code}
            </p>
          </div>

          <div className="flex h-6.25 items-center justify-center gap-1 rounded-full bg-white/10 px-3">
            <Image
              src="/assets/images/hero/Timer.svg"
              alt=""
              width={14}
              height={14}
            />

            <p className="text-[12px] font-medium text-white">
              {movie.runtimeMinutes} Min
            </p>
          </div>

          {movie.formats.map((format) => (
            <div
              key={format.id}
              className="flex h-6.25 items-center justify-center rounded-full bg-white/10 px-3"
            >
              <p className="text-[12px] font-medium text-white">
                {format.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsHero;
