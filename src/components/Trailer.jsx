/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { pickTrailer, tmdb } from "../lib/tmdb";
import { toast } from "../lib/toast";

export function TrailerModal({ video, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Only one focusable control besides the iframe: keep focus inside the dialog.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [video, onClose]);

  if (!video) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] grid place-items-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Bande-annonce : ${video.title}`}
    >
      <div className="scrim-enter absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="modal-enter relative w-full max-w-5xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="truncate font-display text-2xl font-extrabold uppercase tracking-[0.01em] text-fg">{video.title}</p>
          <button ref={closeRef} type="button" onClick={onClose} className="btn btn-ghost btn-icon shrink-0" aria-label="Fermer la bande-annonce">
            <X size={20} />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-[6px] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,1)] ring-1 ring-line">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&hl=fr`}
            title={`Bande-annonce : ${video.title}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Open a trailer for any item. Details are fetched (and cached) on demand,
 * so a hero or a card can offer "Bande-annonce" without preloading videos.
 */
export function useTrailer() {
  const queryClient = useQueryClient();
  const [video, setVideo] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const fetchDetails = (item) =>
    queryClient.fetchQuery({
      queryKey: ["details", item.type, String(item.id)],
      queryFn: () => tmdb.details(item.type, item.id),
      staleTime: 10 * 60_000,
    });

  const prefetch = (item) => {
    if (item) fetchDetails(item).catch(() => {});
  };

  const open = async (item) => {
    setLoadingId(item.id);
    try {
      const details = await fetchDetails(item);
      const trailer = pickTrailer(details.videos);
      if (trailer) setVideo({ key: trailer.key, title: item.title });
      else toast(`Pas de bande-annonce disponible pour « ${item.title} ».`);
    } catch {
      toast("La bande-annonce n'a pas pu être chargée. Réessayez.");
    } finally {
      setLoadingId(null);
    }
  };

  const openVideo = (key, title) => setVideo({ key, title });

  return {
    open,
    openVideo,
    prefetch,
    loadingId,
    modal: <TrailerModal video={video} onClose={() => setVideo(null)} />,
  };
}
