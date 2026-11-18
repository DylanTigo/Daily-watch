/**
 * Responsive backdrop. Capped at w1280: backdrops sit under dark scrims, so the
 * multi-megabyte "original" (up to 3840px) buys nothing visible.
 */
export function backdropSet(path) {
  if (!path) return {};
  return {
    src: `https://image.tmdb.org/t/p/w1280${path}`,
    srcSet: `https://image.tmdb.org/t/p/w780${path} 780w, https://image.tmdb.org/t/p/w1280${path} 1280w`,
    sizes: "100vw",
  };
}

/** Fixed-size TMDB image at 1x and 2x density (logos, small thumbnails). */
export function densitySet(path, size1x, size2x) {
  if (!path) return {};
  return {
    src: `https://image.tmdb.org/t/p/${size1x}${path}`,
    srcSet: `https://image.tmdb.org/t/p/${size1x}${path} 1x, https://image.tmdb.org/t/p/${size2x}${path} 2x`,
  };
}

const API = "https://api.themoviedb.org/3";
const API_KEY = "bc1c19935a1e268d7dc64a77ac4e0f91";
const IMAGE = "https://image.tmdb.org/t/p/";

export const REGION = "FR";

export function img(path, size = "w342") {
  return path ? `${IMAGE}${size}${path}` : null;
}

async function get(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "fr-FR");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB ${res.status}`);
  }
  return res.json();
}

const today = () => new Date().toISOString().slice(0, 10);

export const tmdb = {
  trending: (type = "all", window = "week") => get(`/trending/${type}/${window}`),
  list: (type, list, params) => get(`/${type}/${list}`, { region: REGION, ...params }),
  genres: (type) => get(`/genre/${type}/list`),
  search: (query, page = 1) => get("/search/multi", { query, page, include_adult: false }),
  details: (type, id) =>
    get(`/${type}/${id}`, {
      append_to_response:
        "videos,credits,recommendations,similar,watch/providers,release_dates,content_ratings",
      include_video_language: "fr,en,null",
    }),
  overviewFallback: (type, id) => get(`/${type}/${id}`, { language: "en-US" }),
  season: (id, number) => get(`/tv/${id}/season/${number}`),
  discover: (type, { genre, sort = "popular", page = 1 }) => {
    const params = { page, with_genres: genre, include_adult: false };
    if (sort === "top") {
      params.sort_by = "vote_average.desc";
      params["vote_count.gte"] = type === "movie" ? 800 : 300;
    } else if (sort === "recent") {
      if (type === "movie") {
        params.sort_by = "primary_release_date.desc";
        params["primary_release_date.lte"] = today();
        params["vote_count.gte"] = 40;
      } else {
        params.sort_by = "first_air_date.desc";
        params["first_air_date.lte"] = today();
        params["vote_count.gte"] = 15;
      }
    } else {
      params.sort_by = "popularity.desc";
    }
    return get(`/discover/${type}`, params);
  },
};

/** Flatten TMDB movie/tv results into one shape the UI understands. */
export function normalize(item, fallbackType) {
  const type = item.media_type || fallbackType;
  const date = item.release_date || item.first_air_date || "";
  return {
    id: item.id,
    type,
    title: item.title || item.name || "Sans titre",
    poster: item.poster_path || null,
    backdrop: item.backdrop_path || null,
    year: date.slice(0, 4),
    date,
    vote: item.vote_average || 0,
    votes: item.vote_count || 0,
    popularity: item.popularity || 0,
    overview: item.overview || "",
    genreIds: item.genre_ids || (item.genres ? item.genres.map((g) => g.id) : []),
  };
}

export function normalizeList(data, fallbackType) {
  return (data?.results || [])
    .filter((item) => (item.media_type || fallbackType) === "movie" || (item.media_type || fallbackType) === "tv")
    .map((item) => normalize(item, fallbackType));
}

export function hrefFor(item) {
  return `/${item.type === "tv" ? "serie" : "film"}/${item.id}`;
}

export function typeLabel(type) {
  return type === "tv" ? "Série" : "Film";
}

/** Choose the best YouTube trailer: French trailer, then any trailer, teaser, then anything. */
export function pickTrailer(videos) {
  const list = (videos?.results || []).filter((v) => v.site === "YouTube");
  const rank = (v) =>
    (v.type === "Trailer" ? 0 : v.type === "Teaser" ? 2 : 4) +
    (v.iso_639_1 === "fr" ? 0 : 1) +
    (v.official ? 0 : 0.5);
  return list.sort((a, b) => rank(a) - rank(b))[0] || null;
}

const voteFormat = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const formatVote = (vote) => (vote ? voteFormat.format(vote) : "–");

const numberFormat = new Intl.NumberFormat("fr-FR");
export const formatNumber = (n) => numberFormat.format(n || 0);

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFormat.format(d);
}

export function formatRuntime(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
