/* eslint-disable react/prop-types */
import { Check, Eye, EyeOff, Plus } from "lucide-react";
import { library, useInLibrary } from "../lib/library";

/** Add/remove from "Ma liste". `compact` is the round overlay used on posters. */
export function WatchlistButton({ item, compact = false, className = "" }) {
  const { inWatchlist } = useInLibrary(item);
  const label = inWatchlist ? `Retirer « ${item.title} » de Ma liste` : `Ajouter « ${item.title} » à Ma liste`;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => library.toggleWatchlist(item)}
        aria-pressed={inWatchlist}
        aria-label={label}
        title={inWatchlist ? "Dans Ma liste" : "Ajouter à Ma liste"}
        className={`grid h-9 w-9 place-items-center rounded-full shadow-[0_6px_16px_-6px_rgba(0,0,0,0.8)] transition-[transform,background-color,opacity] duration-150 active:scale-90 ${
          inWatchlist ? "bg-board text-board-ink" : "bg-night/80 text-fg ring-1 ring-inset ring-fg/25 backdrop-blur-md hover:bg-night"
        } ${className}`}
      >
        {inWatchlist ? <Check size={16} strokeWidth={2.6} /> : <Plus size={17} strokeWidth={2.4} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => library.toggleWatchlist(item)}
      aria-pressed={inWatchlist}
      aria-label={label}
      className={`btn ${inWatchlist ? "btn-lit" : "btn-ghost"} ${className}`}
    >
      {inWatchlist ? <Check size={18} strokeWidth={2.4} /> : <Plus size={18} strokeWidth={2.4} />}
      {inWatchlist ? "Dans Ma liste" : "Ma liste"}
    </button>
  );
}

export function SeenButton({ item, className = "" }) {
  const { seen } = useInLibrary(item);
  return (
    <button
      type="button"
      onClick={() => library.toggleSeen(item)}
      aria-pressed={seen}
      className={`btn ${seen ? "btn-lit" : "btn-ghost"} ${className}`}
    >
      {seen ? <Eye size={18} /> : <EyeOff size={18} />}
      {seen ? "Déjà vu" : "Marquer vu"}
    </button>
  );
}
