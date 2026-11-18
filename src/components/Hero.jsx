/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Pause, Play, Star } from "lucide-react";
import { Board, BoardText } from "./Board";
import { Img } from "./Img";
import { WatchlistButton } from "./ListButtons";
import { backdropSet, densitySet, formatVote, hrefFor, typeLabel } from "../lib/tmdb";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";

const SLIDE_SECONDS = 9;

/** "À l'affiche ce soir": the rotating letterboard over full-bleed backdrops. */
export function Hero({ items, genres, trailer }) {
  const root = useRef(null);
  const progress = useRef(null);
  const tween = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const featured = items[index];
  const [visited, setVisited] = useState(() => new Set([0]));

  useEffect(() => {
    setVisited((v) => (v.has(index) ? v : new Set(v).add(index)));
  }, [index]);

  // Fetch the next backdrop only once the current one has had time to arrive,
  // so the two never compete for bandwidth on first paint.
  const [preloadNext, setPreloadNext] = useState(false);
  useEffect(() => {
    setPreloadNext(false);
    const t = setTimeout(() => setPreloadNext(true), 3000);
    return () => clearTimeout(t);
  }, [index]);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (reducedMotion()) setPaused(true);
  }, []);

  useGSAP(
    () => {
      const active = root.current.querySelector(`[data-slide="${index}"] img`);
      if (active && !reducedMotion()) {
        gsap.fromTo(active, { scale: 1.08 }, { scale: 1, duration: SLIDE_SECONDS + 2, ease: "none" });
      }
      gsap.fromTo(
        ".hero-copy",
        { opacity: 0, y: reducedMotion() ? 0 : 12 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: "power3.out", stagger: 0.06 }
      );
      tween.current = gsap.fromTo(
        progress.current,
        { scaleX: 0 },
        { scaleX: 1, duration: SLIDE_SECONDS, ease: "none", onComplete: next, paused: true }
      );
    },
    { scope: root, dependencies: [index], revertOnUpdate: true }
  );

  useEffect(() => {
    const t = tween.current;
    if (!t) return;
    if (paused || hovering) t.pause();
    else t.resume();
  }, [paused, hovering, index]);

  if (!featured) return null;

  const genreNames = featured.genreIds
    .map((id) => genres.get(id))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <section
      ref={root}
      aria-roledescription="carrousel"
      aria-label="À l'affiche ce soir"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden md:max-h-[980px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          data-slide={i}
          aria-hidden="true"
          className={`absolute inset-0 -z-10 transition-opacity duration-[1100ms] ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {/* Only the current, already-seen and next slides load their backdrop. */}
          {(visited.has(i) || (preloadNext && i === (index + 1) % items.length)) && (
            <Img
              {...backdropSet(item.backdrop)}
              eager={i === index}
              fetchPriority={i === 0 ? "high" : "low"}
              className="h-full w-full object-cover object-[center_20%]"
            />
          )}
        </div>
      ))}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/50 to-night/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/35 to-transparent" />

      <div className="mx-auto flex h-full max-w-page flex-col justify-end px-4 pb-24 md:px-10 md:pb-14">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-[46rem]">
            <Board className="w-fit max-w-full" innerClassName="px-5 pb-4 pt-4 md:px-7 md:pb-5 md:pt-5">
              <BoardText
                text={featured.title}
                animateKey={featured.id}
                className="text-[clamp(2.4rem,7.2vw,5.1rem)] [--slot:1.04em]"
              />
              <div className="segments mt-3 border-t border-board-ink/15 pt-2.5 text-board-ink/80">
                <span>{typeLabel(featured.type)}</span>
                {featured.year && <span>{featured.year}</span>}
                {featured.vote > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={12} className="fill-board-ink text-board-ink" aria-hidden="true" />
                    {formatVote(featured.vote)}
                  </span>
                )}
                {genreNames.length > 0 && <span className="hidden sm:inline">{genreNames.join(", ")}</span>}
              </div>
            </Board>

            {featured.overview && (
              <p className="hero-copy mt-6 line-clamp-3 max-w-[38rem] text-[1rem] leading-relaxed text-fg/85 md:text-[1.06rem]">
                {featured.overview}
              </p>
            )}

            <div className="hero-copy mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => trailer.open(featured)}
                onPointerEnter={() => trailer.prefetch(featured)}
                aria-busy={trailer.loadingId === featured.id}
              >
                <Play size={17} className="fill-current" />
                {trailer.loadingId === featured.id ? "Chargement…" : "Bande-annonce"}
              </button>
              <Link to={hrefFor(featured)} className="btn btn-ghost">
                <Info size={18} /> Détails
              </Link>
              <WatchlistButton item={featured} />
            </div>
          </div>

          <div className="hero-copy flex items-end gap-3">
            <div className="flex items-end gap-2.5" role="tablist" aria-label="Choisir le titre à l'affiche">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}. ${item.title}`}
                  onClick={() => setIndex(i)}
                  className={`group relative w-[3.4rem] shrink-0 transition-[transform,opacity] duration-300 active:scale-95 md:w-16 ${
                    i === index ? "opacity-100" : "opacity-55 hover:opacity-90"
                  }`}
                >
                  <div
                    className={`aspect-[2/3] overflow-hidden rounded-[3px] bg-night-3 ring-1 ring-inset transition-shadow ${
                      i === index ? "ring-board shadow-[0_10px_24px_-10px_rgba(242,237,227,0.45)]" : "ring-line"
                    }`}
                  >
                    {item.poster && (
                      <img {...densitySet(item.poster, "w92", "w154")} alt="" width="64" height="96" decoding="async" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span className="mt-2 block h-[2px] overflow-hidden rounded-full bg-fg/15">
                    {i === index && <span ref={progress} className="block h-full origin-left bg-marquee" />}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="btn btn-ghost btn-icon mb-3 h-9 w-9"
              aria-label={paused ? "Reprendre le défilement" : "Mettre le défilement en pause"}
            >
              {paused ? <Play size={15} className="fill-current" /> : <Pause size={15} className="fill-current" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[100svh] min-h-[640px] md:max-h-[980px]" aria-busy="true" aria-label="Chargement">
      <div className="shimmer absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-page flex-col justify-end px-4 pb-24 md:px-10 md:pb-14">
        <div className="board-frame w-[min(34rem,100%)]">
          <div className="board h-36 opacity-90" />
        </div>
        <div className="mt-6 h-4 w-[min(32rem,90%)] rounded bg-fg/10" />
        <div className="mt-3 h-4 w-[min(24rem,70%)] rounded bg-fg/10" />
      </div>
    </section>
  );
}
