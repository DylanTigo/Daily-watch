/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Img } from "./Img";
import { WatchlistButton } from "./ListButtons";
import { formatVote, hrefFor, img, typeLabel } from "../lib/tmdb";

export function PosterFallback({ title }) {
  return (
    <div className="board absolute inset-0 flex items-end p-3">
      <span className="board-title line-clamp-4 text-[1.35rem] [--slot:1.1em]">{title}</span>
    </div>
  );
}

/** Rendered width of a poster in a grid (2 → 6 columns, page capped at 1440px). */
export const GRID_SIZES = "(min-width: 1280px) 220px, (min-width: 1024px) 19vw, (min-width: 768px) 24vw, (min-width: 640px) 32vw, 48vw";

/**
 * @param sizes   rendered width hint so the browser picks w185 or w342
 * @param deferImage  keep the poster unloaded (a row item scrolled far off-screen)
 */
export function PosterCard({ item, showType = false, actions, className = "", style, sizes = GRID_SIZES, deferImage = false }) {
  return (
    <article className={`group relative ${className}`} style={style} data-flip-id={`${item.type}-${item.id}`}>
      <Link to={hrefFor(item)} className="block rounded-[5px] outline-offset-4 active:scale-[0.98] transition-transform duration-150">
        <div className="poster-lift relative aspect-[2/3] overflow-hidden rounded-[5px] bg-night-3 ring-1 ring-inset ring-line">
          {item.poster ? (
            !deferImage && (
              <Img
                src={img(item.poster, "w342")}
                srcSet={`${img(item.poster, "w185")} 185w, ${img(item.poster, "w342")} 342w`}
                sizes={sizes}
                width="342"
                height="513"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )
          ) : (
            <PosterFallback title={item.title} />
          )}
        </div>
        <h3 className="mt-2.5 line-clamp-1 text-[0.92rem] font-medium leading-snug text-fg">{item.title}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.04em] text-mute tabular">
          {showType && <span>{typeLabel(item.type)}</span>}
          {showType && item.year && <span aria-hidden="true">·</span>}
          {item.year && <span>{item.year}</span>}
          {item.vote > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <Star size={11} className="fill-bulb text-bulb" aria-hidden="true" />
              <span>
                <span className="sr-only">Note </span>
                {formatVote(item.vote)}
              </span>
            </>
          )}
        </p>
      </Link>
      <WatchlistButton
        item={item}
        compact
        className="absolute right-2 top-2 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100 [@media(hover:hover)]:aria-pressed:opacity-100"
      />
      {actions}
    </article>
  );
}

export function PosterSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="shimmer aspect-[2/3] rounded-[5px]" />
      <div className="shimmer mt-3 h-3 w-3/4 rounded" />
      <div className="shimmer mt-2 h-2.5 w-1/3 rounded" />
    </div>
  );
}
