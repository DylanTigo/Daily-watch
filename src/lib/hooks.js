import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "./tmdb";

export function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Daily Watch` : "Daily Watch";
  }, [title]);
}

/** Map of genre id → French name, for both films and séries. */
export function useGenres() {
  const movie = useQuery({ queryKey: ["genres", "movie"], queryFn: () => tmdb.genres("movie"), staleTime: Infinity });
  const tv = useQuery({ queryKey: ["genres", "tv"], queryFn: () => tmdb.genres("tv"), staleTime: Infinity });
  const map = new Map();
  for (const g of [...(movie.data?.genres || []), ...(tv.data?.genres || [])]) map.set(g.id, g.name);
  return { map, movie: movie.data?.genres || [], tv: tv.data?.genres || [] };
}
