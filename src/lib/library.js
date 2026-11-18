import { useSyncExternalStore } from "react";
import { toast } from "./toast";

/**
 * The visitor's personal lists, kept only in this browser.
 * watchlist = "À voir", seen = "Déjà vu".
 */
const KEY = "dailywatch.library.v1";
const EMPTY = { watchlist: [], seen: [] };
const listeners = new Set();

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
        seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      };
    }
  } catch {
    /* storage unavailable: keep an in-memory list */
  }
  return EMPTY;
}

let state = typeof window === "undefined" ? EMPTY : load();

function commit(next) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode or quota: the list still works for this visit */
  }
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) {
      state = load();
      listeners.forEach((listener) => listener());
    }
  });
}

const same = (a, b) => a.id === b.id && a.type === b.type;

function entry(item) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    poster: item.poster,
    backdrop: item.backdrop,
    year: item.year,
    vote: item.vote,
    addedAt: Date.now(),
  };
}

export const library = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => state,
  has: (list, item) => state[list].some((x) => same(x, item)),

  toggleWatchlist(item) {
    if (library.has("watchlist", item)) {
      commit({ ...state, watchlist: state.watchlist.filter((x) => !same(x, item)) });
      toast(`« ${item.title} » retiré de Ma liste`);
      return false;
    }
    commit({
      watchlist: [entry(item), ...state.watchlist],
      seen: state.seen.filter((x) => !same(x, item)),
    });
    toast(`« ${item.title} » ajouté à Ma liste`);
    return true;
  },

  toggleSeen(item) {
    if (library.has("seen", item)) {
      commit({ ...state, seen: state.seen.filter((x) => !same(x, item)) });
      toast(`« ${item.title} » n'est plus marqué comme vu`);
      return false;
    }
    commit({
      seen: [entry(item), ...state.seen],
      watchlist: state.watchlist.filter((x) => !same(x, item)),
    });
    toast(`« ${item.title} » marqué comme vu`);
    return true;
  },

  remove(list, item) {
    commit({ ...state, [list]: state[list].filter((x) => !same(x, item)) });
    toast(`« ${item.title} » retiré`);
  },
};

export function useLibrary() {
  return useSyncExternalStore(library.subscribe, library.get, library.get);
}

export function useInLibrary(item) {
  const lib = useLibrary();
  return {
    inWatchlist: !!item && lib.watchlist.some((x) => same(x, item)),
    seen: !!item && lib.seen.some((x) => same(x, item)),
  };
}
