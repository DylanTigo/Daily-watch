/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PosterCard, PosterSkeleton } from "./PosterCard";
import { ErrorState } from "./States";
import { reducedMotion } from "../lib/gsap";

const ITEM_WIDTH = "w-[40vw] sm:w-[27vw] md:w-[176px] xl:w-[196px]";
const ITEM_SIZES = "(min-width: 1280px) 196px, (min-width: 768px) 176px, (min-width: 640px) 27vw, 40vw";

/** A horizontally scrolling shelf of posters. */
export function Row({ title, items, href, isLoading, isError, onRetry, ranked = false, showType = false, children }) {
  const scroller = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  // Posters past this index stay unloaded until the shelf is scrolled near them:
  // a 20-poster row only fetches what is on screen plus a little look-ahead.
  const [loadCount, setLoadCount] = useState(8);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    const first = el.querySelector("[data-row-item]");
    if (first) {
      const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "16");
      const needed = Math.ceil((el.scrollLeft + el.clientWidth * 1.25) / step) + 1;
      setLoadCount((c) => Math.max(c, needed));
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items]);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  if (!isLoading && !isError && (!items || items.length === 0) && !children) return null;

  return (
    <section className="relative py-6 md:py-8" aria-label={title}>
      <div className="mx-auto mb-4 flex max-w-page items-end justify-between gap-4 px-4 md:mb-5 md:px-10">
        <h2 className="section-title">{title}</h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              to={href}
              className="group/link mr-1 inline-flex items-center gap-1.5 rounded text-[0.85rem] font-medium text-mute transition-colors hover:text-fg"
            >
              Tout voir
              <ArrowRight size={15} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          )}
          <div className="hidden gap-1.5 md:flex">
            <button
              type="button"
              className="btn btn-ghost btn-icon h-9 w-9"
              onClick={() => scrollBy(-1)}
              disabled={edges.start}
              aria-label={`Défiler ${title} vers la gauche`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-icon h-9 w-9"
              onClick={() => scrollBy(1)}
              disabled={edges.end}
              aria-label={`Défiler ${title} vers la droite`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="mx-auto max-w-page px-4 md:px-10">
          <ErrorState compact onRetry={onRetry} message="Cette sélection n'a pas pu être chargée." />
        </div>
      ) : (
        <div className="mx-auto max-w-page">
          <div
            ref={scroller}
            onScroll={measure}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 pt-1 md:scroll-px-10 md:gap-5 md:px-10"
          >
            {children}
            {isLoading
              ? Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`${ITEM_WIDTH} shrink-0`}>
                    <PosterSkeleton />
                  </div>
                ))
              : items.map((item, i) =>
                  ranked ? (
                    <div key={`${item.type}-${item.id}`} data-row-item className="flex shrink-0 snap-start items-end">
                      <RankTile n={i + 1} />
                      <div className={`${ITEM_WIDTH} -ml-3 shrink-0`}>
                        <PosterCard item={item} showType={showType} sizes={ITEM_SIZES} deferImage={i >= loadCount} />
                      </div>
                    </div>
                  ) : (
                    <div key={`${item.type}-${item.id}`} data-row-item className={`${ITEM_WIDTH} shrink-0 snap-start`}>
                      <PosterCard item={item} showType={showType} sizes={ITEM_SIZES} deferImage={i >= loadCount} />
                    </div>
                  )
                )}
          </div>
        </div>
      )}
    </section>
  );
}

function RankTile({ n }) {
  return (
    <div
      className="board relative z-10 mb-[3.4rem] grid h-[4.6rem] min-w-[3.2rem] place-items-center rounded-[3px] px-1.5 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)] md:h-[5.4rem] md:min-w-[3.8rem]"
      aria-label={`Numéro ${n}`}
    >
      <span className="font-display text-[3.2rem] font-black leading-none text-board-ink tabular md:text-[3.9rem]" aria-hidden="true">
        {n}
      </span>
    </div>
  );
}
