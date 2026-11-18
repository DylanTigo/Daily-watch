import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { InfiniteGrid, dedupe } from "../components/Grid";
import { Row } from "../components/Row";
import { ErrorState } from "../components/States";
import { useDebounced, useDocumentTitle } from "../lib/hooks";
import { formatNumber, normalizeList, tmdb } from "../lib/tmdb";

const TABS = [
  { id: "all", label: "Tout" },
  { id: "movie", label: "Films" },
  { id: "tv", label: "Séries" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [tab, setTab] = useState("all");
  const input = useRef(null);
  const term = useDebounced(q.trim(), 300);

  useDocumentTitle(term ? `Recherche : ${term}` : "Recherche");

  // Keep the URL shareable without stacking history entries.
  const lastWritten = useRef(initial);
  useEffect(() => {
    if (term === lastWritten.current) return;
    lastWritten.current = term;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (term) next.set("q", term);
        else next.delete("q");
        return next;
      },
      { replace: true }
    );
  }, [term, setParams]);

  // The header search can change ?q while this page is open.
  const urlQ = params.get("q") || "";
  useEffect(() => {
    if (urlQ !== lastWritten.current) {
      lastWritten.current = urlQ;
      setQ(urlQ);
    }
  }, [urlQ]);

  useEffect(() => {
    if (!initial) input.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const query = useInfiniteQuery({
    queryKey: ["search-all", term],
    queryFn: ({ pageParam }) => tmdb.search(term, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < Math.min(last.total_pages, 50) ? last.page + 1 : undefined),
    enabled: term.length >= 2,
    staleTime: 60_000,
  });

  const all = useMemo(() => dedupe(query.data?.pages.map((p) => normalizeList(p))), [query.data]);
  const counts = { all: all.length, movie: all.filter((i) => i.type === "movie").length, tv: all.filter((i) => i.type === "tv").length };
  const items = tab === "all" ? all : all.filter((i) => i.type === tab);

  const trending = useQuery({ queryKey: ["trending", "all", "week"], queryFn: () => tmdb.trending("all", "week"), staleTime: 10 * 60_000 });

  return (
    <div className="page-enter pt-24 md:pt-32">
      <div className="mx-auto max-w-page px-4 md:px-10">
        <h1 className="section-title">Recherche</h1>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            input.current?.blur();
          }}
          className="relative mt-5"
        >
          <Search size={24} className="pointer-events-none absolute left-5 z-10 top-1/2 -translate-y-1/2 text-board-ink/60" aria-hidden="true" />
          <input
            ref={input}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Un titre, un film, une série…"
            aria-label="Rechercher un film ou une série"
            autoComplete="off"
            spellCheck="false"
            className="board h-16 w-full rounded-[5px] pl-14 pr-14 font-display text-[1.7rem] font-extrabold uppercase tracking-[0.01em] text-board-ink placeholder:font-sans placeholder:text-[1.05rem] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-board-ink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-bulb md:h-20 md:text-[2.3rem]"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                input.current?.focus();
              }}
              className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded text-board-ink/60 hover:text-board-ink"
              aria-label="Effacer la recherche"
            >
              <X size={22} />
            </button>
          )}
        </form>

        {term.length >= 2 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2" role="tablist" aria-label="Type de résultat">
              {TABS.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="chip" onClick={() => setTab(t.id)}>
                  {t.label}
                  <span className="font-mono text-[0.72rem] tabular opacity-70">{counts[t.id]}</span>
                </button>
              ))}
            </div>
            {query.data && (
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.05em] text-mute tabular" aria-live="polite">
                {formatNumber(query.data.pages[0]?.total_results)} résultats pour « {term} »
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          {term.length < 2 ? null : query.isError ? (
            <ErrorState message="La recherche n'a pas abouti." onRetry={query.refetch} />
          ) : !query.isLoading && items.length === 0 && !query.hasNextPage ? (
            <div className="py-16 text-center">
              <p className="font-display text-3xl font-extrabold uppercase text-fg">Aucun titre trouvé</p>
              <p className="mt-2 text-mute">
                Rien pour « {term} »{tab !== "all" ? ` dans les ${tab === "tv" ? "séries" : "films"}` : ""}. Vérifiez
                l&apos;orthographe ou essayez le titre original.
              </p>
            </div>
          ) : (
            <InfiniteGrid key={term} items={items} query={query} showType={tab === "all"} />
          )}
        </div>
      </div>

      {term.length < 2 && (
        <Row
          title="Ce que les gens regardent"
          items={normalizeList(trending.data).slice(0, 20)}
          isLoading={trending.isLoading}
          isError={trending.isError}
          onRetry={trending.refetch}
          showType
        />
      )}
    </div>
  );
}
