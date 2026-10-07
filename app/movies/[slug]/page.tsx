import MovieDetails from "@/features/movies/components/MovieDetails";

type MoviePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const MoviePage = async ({ params }: MoviePageProps) => {
  const { slug } = await params;

  return <MovieDetails movieSlug={slug} />;
};

export default MoviePage;
