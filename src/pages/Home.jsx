import { useQuery } from "@tanstack/react-query";
import { Hero, HeroSkeleton } from "../components/Hero";
import { Row } from "../components/Row";
import { ErrorState } from "../components/States";
import { useTrailer } from "../components/Trailer";
import { useDocumentTitle, useGenres } from "../lib/hooks";
import { useLibrary } from "../lib/library";
import { normalizeList, tmdb } from "../lib/tmdb";

function useShelf(key, fn, type) {
  const q = useQuery({ queryKey: key, queryFn: fn, staleTime: 10 * 60_000 });
  return {
    items: normalizeList(q.data, type).slice(0, 20),
    isLoading: q.isLoading,
    isError: q.isError,
    onRetry: q.refetch,
  };
}

export default function Home() {
  useDocumentTitle("À l'affiche ce soir");
  const { map: genres } = useGenres();
  const trailer = useTrailer();
  const { watchlist } = useLibrary();

  const trending = useQuery({ queryKey: ["trending", "all", "day"], queryFn: () => tmdb.trending("all", "day"), staleTime: 10 * 60_000 });
  const heroItems = normalizeList(trending.data)
    .filter((i) => i.backdrop && i.overview)
    .slice(0, 5);

  const topMovies = useShelf(["trending", "movie", "week"], () => tmdb.trending("movie", "week"), "movie");
  const series = useShelf(["trending", "tv", "week"], () => tmdb.trending("tv", "week"), "tv");
  const nowPlaying = useShelf(["list", "movie", "now_playing"], () => tmdb.list("movie", "now_playing"), "movie");
  const topRatedMovies = useShelf(["list", "movie", "top_rated"], () => tmdb.list("movie", "top_rated"), "movie");
  const topRatedTv = useShelf(["list", "tv", "top_rated"], () => tmdb.list("tv", "top_rated"), "tv");
  const upcoming = useShelf(["list", "movie", "upcoming"], () => tmdb.list("movie", "upcoming"), "movie");

  return (
    <div className="page-enter">
      <h1 className="sr-only">Daily Watch : films et séries à l&apos;affiche ce soir</h1>
      {trending.isError ? (
        <div className="mx-auto max-w-page px-4 pb-6 pt-28 md:px-10">
          <ErrorState message="Impossible de charger les titres à l'affiche." onRetry={trending.refetch} />
        </div>
      ) : heroItems.length ? (
        <Hero items={heroItems} genres={genres} trailer={trailer} />
      ) : (
        <HeroSkeleton />
      )}

      <div className="relative z-10 md:-mt-2">
        {watchlist.length > 0 && <Row title="Dans votre liste" items={watchlist} href="/ma-liste" showType />}
        <Row title="Top 10 films de la semaine" ranked {...topMovies} items={topMovies.items.slice(0, 10)} href="/films" />
        <Row title="Séries du moment" {...series} href="/series" />
        <Row title="En salle en ce moment" {...nowPlaying} href="/films?tri=recent" />
        <Row title="Les films les mieux notés" {...topRatedMovies} href="/films?tri=top" />
        <Row title="Séries cultes" {...topRatedTv} href="/series?tri=top" />
        <Row title="Bientôt au cinéma" {...upcoming} />
      </div>
      {trailer.modal}
    </div>
  );
}
