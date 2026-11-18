/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Board, BoardText } from "../components/Board";
import { InfiniteGrid, dedupe } from "../components/Grid";
import { ErrorState } from "../components/States";
import { useDocumentTitle, useGenres } from "../lib/hooks";
import { formatNumber, normalizeList, tmdb } from "../lib/tmdb";

const SORTS = [
  { id: "popular", label: "Populaires" },
  { id: "top", label: "Mieux notés" },
  { id: "recent", label: "Récents" },
];

export default function Browse({ type }) {
  const isMovie = type === "movie";
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") || "";
  const sort = SORTS.some((s) => s.id === params.get("tri")) ? params.get("tri") : "popular";
  const genres = useGenres();
  const genreList = isMovie ? genres.movie : genres.tv;
  const genreName = genreList.find((g) => String(g.id) === genre)?.name;

  useDocumentTitle(genreName ? `${isMovie ? "Films" : "Séries"} · ${genreName}` : isMovie ? "Films" : "Séries");

  const query = useInfiniteQuery({
    queryKey: ["discover", type, genre, sort],
    queryFn: ({ pageParam }) => tmdb.discover(type, { genre, sort, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined),
    staleTime: 10 * 60_000,
  });

  const items = useMemo(
    () => dedupe(query.data?.pages.map((p) => normalizeList(p, type)), type),
    [query.data, type]
  );
  const total = query.data?.pages[0]?.total_results;

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="page-enter mx-auto max-w-page px-4 pt-24 md:px-10 md:pt-32">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Board className="w-fit" innerClassName="px-5 py-3 md:px-6 md:py-4">
            <BoardText text={isMovie ? "Films" : "Séries"} className="text-[clamp(3rem,9vw,5.5rem)] [--slot:1.02em]" />
          </Board>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-mute">
            {isMovie
              ? "Tous les films, du dernier blockbuster aux classiques. Filtrez par genre, triez comme vous voulez."
              : "Les séries dont tout le monde parle, et celles qu'on aurait tort d'oublier."}
          </p>
        </div>
        {total > 0 && (
          <p className="font-mono text-[0.78rem] uppercase tracking-[0.05em] text-mute tabular" aria-live="polite">
            {formatNumber(total)} titres{genreName ? ` · ${genreName}` : ""}
          </p>
        )}
      </header>

      <div className="sticky top-16 z-30 -mx-4 mt-8 border-b border-line bg-night/85 px-4 py-3 backdrop-blur-xl md:top-[4.5rem] md:-mx-10 md:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Genres">
            <button type="button" className="chip" aria-pressed={!genre} onClick={() => update("genre", "")}>
              Tous
            </button>
            {genreList.map((g) => (
              <button
                key={g.id}
                type="button"
                className="chip"
                aria-pressed={genre === String(g.id)}
                onClick={() => update("genre", genre === String(g.id) ? "" : String(g.id))}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-1 rounded-[4px] bg-night-2 p-1 ring-1 ring-inset ring-line" role="group" aria-label="Trier">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sort === s.id}
                onClick={() => update("tri", s.id === "popular" ? "" : s.id)}
                className={`h-8 rounded-[3px] px-3 text-[0.83rem] font-medium transition-colors duration-150 ${
                  sort === s.id ? "bg-board text-board-ink" : "text-mute hover:text-fg"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {query.isError ? (
          <ErrorState message="La liste n'a pas pu être chargée." onRetry={query.refetch} />
        ) : (
          <InfiniteGrid key={`${genre}-${sort}`} items={items} query={query} />
        )}
      </div>
    </div>
  );
}
