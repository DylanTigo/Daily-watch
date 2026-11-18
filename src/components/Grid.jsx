/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { PosterCard, PosterSkeleton } from "./PosterCard";
import { Spinner } from "./States";

export const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 lg:grid-cols-5 xl:grid-cols-6";

/** Poster grid fed by an infinite query, loading the next page as the end nears. */
export function InfiniteGrid({ items, query, showType = false }) {
  const sentinel = useRef(null);
  const { hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = query;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 18 }, (_, i) => (
          <PosterSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={GRID}>
        {items.map((item, i) => (
          <PosterCard key={`${item.type}-${item.id}`} item={item} showType={showType} className="rise-in" style={{ "--i": i % 20 }} />
        ))}
      </div>
      <div ref={sentinel} className="flex justify-center py-10">
        {isFetchingNextPage ? (
          <Spinner label="Chargement de la suite" />
        ) : hasNextPage ? (
          <button type="button" className="btn btn-ghost" onClick={() => fetchNextPage()}>
            Afficher plus
          </button>
        ) : items.length > 0 ? (
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-mute">Fin de la bobine</p>
        ) : null}
      </div>
    </>
  );
}

export function dedupe(pages, type) {
  const seen = new Set();
  const out = [];
  for (const page of pages || []) {
    for (const item of page) {
      const key = `${item.type || type}-${item.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
  }
  return out;
}
