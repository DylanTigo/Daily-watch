import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import { Board, BoardText } from "../components/Board";
import { GRID } from "../components/Grid";
import { PosterCard } from "../components/PosterCard";
import { Row } from "../components/Row";
import { Flip, gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useDocumentTitle } from "../lib/hooks";
import { library, useLibrary } from "../lib/library";
import { normalizeList, tmdb } from "../lib/tmdb";

const LISTS = [
  { id: "watchlist", label: "À voir" },
  { id: "seen", label: "Déjà vu" },
];
const KINDS = [
  { id: "all", label: "Tout" },
  { id: "movie", label: "Films" },
  { id: "tv", label: "Séries" },
];

export default function MyList() {
  useDocumentTitle("Ma liste");
  const lib = useLibrary();
  const [list, setList] = useState("watchlist");
  const [kind, setKind] = useState("all");
  const grid = useRef(null);
  const flipState = useRef(null);

  const items = lib[list].filter((i) => kind === "all" || i.type === kind);
  const layoutKey = `${list}|${kind}|${items.map((i) => `${i.type}${i.id}`).join(",")}`;

  // Record positions before any click changes the layout…
  const capture = () => {
    if (grid.current && !reducedMotion()) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
    }
  };

  // …then let the remaining posters glide to their new places.
  useGSAP(
    () => {
      if (!flipState.current || !grid.current) {
        flipState.current = null;
        return;
      }
      Flip.from(flipState.current, {
        duration: 0.5,
        ease: "power3.inOut",
        targets: grid.current.querySelectorAll("[data-flip-id]"),
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }),
      });
      flipState.current = null;
    },
    { dependencies: [layoutKey], scope: grid }
  );

  const trending = useQuery({
    queryKey: ["trending", "all", "week"],
    queryFn: () => tmdb.trending("all", "week"),
    staleTime: 10 * 60_000,
    enabled: lib.watchlist.length + lib.seen.length === 0,
  });

  return (
    <div className="page-enter pt-24 md:pt-32">
      <div className="mx-auto max-w-page px-4 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Board className="w-fit" innerClassName="px-5 py-3 md:px-6 md:py-4">
              <BoardText text="Ma liste" className="text-[clamp(3rem,9vw,5.5rem)] [--slot:1.02em]" />
            </Board>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-mute">
              Enregistrée dans ce navigateur, sans compte. Elle vous attend à la prochaine visite.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4" onClickCapture={capture}>
          <div className="flex gap-2" role="tablist" aria-label="Liste">
            {LISTS.map((l) => (
              <button key={l.id} type="button" role="tab" aria-selected={list === l.id} className="chip" onClick={() => setList(l.id)}>
                {l.label}
                <span className="font-mono text-[0.72rem] tabular opacity-70">{lib[l.id].length}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-[4px] bg-night-2 p-1 ring-1 ring-inset ring-line" role="group" aria-label="Filtrer">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={kind === k.id}
                onClick={() => setKind(k.id)}
                className={`h-8 rounded-[3px] px-3 text-[0.83rem] font-medium transition-colors duration-150 ${
                  kind === k.id ? "bg-board text-board-ink" : "text-mute hover:text-fg"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {items.length === 0 ? (
            <EmptyList list={list} kind={kind} />
          ) : (
            <div ref={grid} className={GRID} onClickCapture={capture}>
              {items.map((item) => (
                <PosterCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  showType={kind === "all"}
                  actions={
                    <div className="mt-2.5 flex gap-1.5">
                      {list === "watchlist" ? (
                        <button
                          type="button"
                          onClick={() => library.toggleSeen(item)}
                          className="btn btn-ghost h-8 flex-1 px-2 text-[0.78rem]"
                        >
                          <Eye size={14} /> Vu
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => library.toggleWatchlist(item)}
                          className="btn btn-ghost h-8 flex-1 px-2 text-[0.78rem]"
                        >
                          <RotateCcw size={14} /> À revoir
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => library.remove(list, item)}
                        className="btn btn-ghost btn-icon h-8 w-8"
                        aria-label={`Retirer « ${item.title} »`}
                        title="Retirer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lib.watchlist.length + lib.seen.length === 0 && (
        <div className="mt-6">
          <Row
            title="Pour commencer"
            items={normalizeList(trending.data).slice(0, 20)}
            isLoading={trending.isLoading}
            isError={trending.isError}
            onRetry={trending.refetch}
            showType
          />
        </div>
      )}
    </div>
  );
}

function EmptyList({ list, kind }) {
  const what = kind === "movie" ? "film" : kind === "tv" ? "série" : "titre";
  return (
    <div className="flex flex-col items-start gap-4 rounded-[6px] border border-dashed border-line px-6 py-12 md:px-10">
      <p className="font-display text-3xl font-extrabold uppercase leading-none text-fg md:text-4xl">
        {list === "watchlist" ? `Aucun ${what} à voir` : `Aucun ${what} vu`}
      </p>
      <p className="max-w-lg text-mute">
        {list === "watchlist"
          ? "Touchez le + sur une affiche ou « Ma liste » sur une fiche pour garder un titre de côté."
          : "Marquez un titre comme vu depuis sa fiche ou depuis votre liste : il viendra se ranger ici."}
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Link to="/films" className="btn btn-lit">Parcourir les films</Link>
        <Link to="/series" className="btn btn-ghost">Parcourir les séries</Link>
      </div>
    </div>
  );
}
