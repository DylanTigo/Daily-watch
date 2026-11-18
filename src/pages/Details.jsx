/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { Board, BoardText } from "../components/Board";
import { Img } from "../components/Img";
import { PosterFallback } from "../components/PosterCard";
import { SeenButton, WatchlistButton } from "../components/ListButtons";
import { Row } from "../components/Row";
import { ErrorState, Spinner } from "../components/States";
import { useTrailer } from "../components/Trailer";
import { useDocumentTitle } from "../lib/hooks";
import {
  REGION,
  backdropSet,
  densitySet,
  formatDate,
  formatRuntime,
  formatVote,
  img,
  normalize,
  normalizeList,
  pickTrailer,
  tmdb,
  typeLabel,
} from "../lib/tmdb";

export default function Details({ type }) {
  const { id } = useParams();
  const trailer = useTrailer();
  const query = useQuery({
    queryKey: ["details", type, String(id)],
    queryFn: () => tmdb.details(type, id),
    staleTime: 10 * 60_000,
  });
  const d = query.data;
  const needsFallback = !!d && !d.overview;
  const fallback = useQuery({
    queryKey: ["overview-en", type, String(id)],
    queryFn: () => tmdb.overviewFallback(type, id),
    enabled: needsFallback,
    staleTime: Infinity,
  });

  const item = useMemo(() => (d ? normalize(d, type) : null), [d, type]);
  useDocumentTitle(item?.title);

  if (query.isError) {
    return (
      <div className="mx-auto max-w-page px-4 pt-32 md:px-10">
        <ErrorState
          message={type === "tv" ? "Cette série n'a pas pu être chargée." : "Ce film n'a pas pu être chargé."}
          onRetry={query.refetch}
        />
        <Link to="/" className="btn btn-ghost mt-6">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="grid min-h-[80svh] place-items-center">
        <Spinner />
      </div>
    );
  }

  const isTv = type === "tv";
  const video = pickTrailer(d.videos);
  const overview = d.overview || fallback.data?.overview;
  const providers = d["watch/providers"]?.results?.[REGION];
  const cast = (isTv ? d.credits?.cast : d.credits?.cast)?.slice(0, 18) || [];
  const directors = isTv
    ? (d.created_by || []).map((p) => p.name)
    : (d.credits?.crew || []).filter((c) => c.job === "Director").map((c) => c.name);
  const certification = isTv
    ? d.content_ratings?.results?.find((r) => r.iso_3166_1 === REGION)?.rating
    : d.release_dates?.results
        ?.find((r) => r.iso_3166_1 === REGION)
        ?.release_dates?.map((r) => r.certification)
        .find(Boolean);
  const related = normalizeList(d.recommendations, type).length
    ? normalizeList(d.recommendations, type)
    : normalizeList(d.similar, type);
  const originalTitle = d.original_title || d.original_name;

  const segments = [
    typeLabel(type),
    item.year,
    isTv
      ? `${d.number_of_seasons} saison${d.number_of_seasons > 1 ? "s" : ""}${d.number_of_episodes ? ` · ${d.number_of_episodes} ép.` : ""}`
      : formatRuntime(d.runtime),
    certification ? (/^\d+$/.test(certification) ? `-${certification} ans` : certification) : null,
  ].filter(Boolean);

  return (
    <article className="page-enter">
      {/* Backdrop */}
      <div className="relative h-[58svh] min-h-[380px] overflow-hidden md:h-[72svh]">
        {d.backdrop_path && (
          <Img {...backdropSet(d.backdrop_path)} eager fetchPriority="high" className="h-full w-full object-cover object-[center_25%]" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night/70 to-transparent" />
      </div>

      <div className="relative mx-auto -mt-[34svh] max-w-page px-4 md:-mt-[40svh] md:px-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
          <div className="hidden md:block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[6px] bg-night-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,1)] ring-1 ring-inset ring-line">
              {d.poster_path ? (
                <Img
                  src={img(d.poster_path, "w500")}
                  srcSet={`${img(d.poster_path, "w342")} 342w, ${img(d.poster_path, "w500")} 500w, ${img(d.poster_path, "w780")} 780w`}
                  sizes="(min-width: 1024px) 18rem, 15rem"
                  width="500"
                  height="750"
                  alt={`Affiche de ${item.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PosterFallback title={item.title} />
              )}
            </div>
          </div>

          <div className="min-w-0 self-end">
            <Board className="w-fit max-w-full" innerClassName="px-5 pb-4 pt-4 md:px-7 md:pb-5 md:pt-5">
              <BoardText text={item.title} className="text-[clamp(2.2rem,6.4vw,4.6rem)] [--slot:1.04em]" />
              <div className="segments mt-3 border-t border-board-ink/15 pt-2.5 text-board-ink/80">
                {segments.map((s) => (
                  <span key={s}>{s}</span>
                ))}
                {item.vote > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={12} className="fill-board-ink text-board-ink" aria-hidden="true" />
                    {formatVote(item.vote)}
                    <span className="normal-case opacity-70">/10</span>
                  </span>
                )}
              </div>
            </Board>

            {d.tagline && <p className="mt-5 text-lg italic text-fg/80">{d.tagline}</p>}

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!video}
                onClick={() => video && trailer.openVideo(video.key, item.title)}
              >
                <Play size={17} className="fill-current" />
                {video ? "Bande-annonce" : "Pas de bande-annonce"}
              </button>
              <WatchlistButton item={item} />
              <SeenButton item={item} />
            </div>

            {d.genres?.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Genres">
                {d.genres.map((g) => (
                  <li key={g.id}>
                    <Link to={`/${isTv ? "series" : "films"}?genre=${g.id}`} className="chip h-8">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <section aria-labelledby="synopsis">
            <h2 id="synopsis" className="section-title">Synopsis</h2>
            <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-[1.7] text-fg/85">
              {overview || "Aucun synopsis n'est encore disponible pour ce titre."}
              {!d.overview && fallback.data?.overview && <span className="ml-2 text-sm text-mute">(en anglais)</span>}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              {directors.length > 0 && <Fact label={isTv ? "Création" : "Réalisation"} value={directors.join(", ")} />}
              {originalTitle && originalTitle !== item.title && <Fact label="Titre original" value={originalTitle} />}
              {(d.release_date || d.first_air_date) && (
                <Fact label={isTv ? "Première diffusion" : "Sortie"} value={formatDate(d.release_date || d.first_air_date)} />
              )}
              {isTv && d.networks?.length > 0 && <Fact label="Diffuseur" value={d.networks.map((n) => n.name).join(", ")} />}
              {d.status && <Fact label="Statut" value={statusLabel(d.status)} />}
              {d.vote_count > 0 && <Fact label="Votes" value={`${d.vote_count.toLocaleString("fr-FR")} avis TMDB`} />}
            </dl>
          </section>

          <WhereToWatch providers={providers} title={item.title} />
        </div>
      </div>

      {cast.length > 0 && (
        <section className="mt-14" aria-labelledby="cast">
          <div className="mx-auto max-w-page px-4 md:px-10">
            <h2 id="cast" className="section-title">Casting</h2>
          </div>
          <ul className="no-scrollbar mx-auto mt-5 flex max-w-page snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:scroll-px-10 md:px-10">
            {cast.map((p) => (
              <li key={p.credit_id || p.id} className="w-28 shrink-0 snap-start md:w-32">
                <div className="aspect-[4/5] overflow-hidden rounded-[5px] bg-night-3 ring-1 ring-inset ring-line">
                  {p.profile_path ? (
                    <Img src={img(p.profile_path, "w185")} width="185" height="278" alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center font-display text-3xl font-extrabold text-mute">
                      {p.name?.[0]}
                    </div>
                  )}
                </div>
                <p className="mt-2 line-clamp-1 text-[0.88rem] font-medium text-fg">{p.name}</p>
                <p className="line-clamp-2 text-[0.8rem] leading-snug text-mute">{p.character || p.roles?.[0]?.character}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isTv && d.seasons?.length > 0 && <Seasons show={d} />}

      {related.length > 0 && (
        <div className="mt-6">
          <Row title={isTv ? "Séries similaires" : "Dans le même esprit"} items={related.slice(0, 20)} />
        </div>
      )}
      {trailer.modal}
    </article>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.06em] text-mute">{label}</dt>
      <dd className="mt-1 text-fg">{value}</dd>
    </div>
  );
}

function statusLabel(status) {
  return (
    {
      Released: "Sorti",
      "Post Production": "En post-production",
      "In Production": "En production",
      Planned: "Annoncé",
      Rumored: "En projet",
      Canceled: "Annulé",
      "Returning Series": "En cours",
      Ended: "Terminée",
      "In production": "En production",
      Pilot: "Pilote",
    }[status] || status
  );
}

function WhereToWatch({ providers, title }) {
  const groups = [
    { label: "Streaming", list: [...(providers?.flatrate || []), ...(providers?.free || []), ...(providers?.ads || [])] },
    { label: "Location", list: providers?.rent || [] },
    { label: "Achat", list: providers?.buy || [] },
  ]
    .map((g) => ({ ...g, list: g.list.filter((p, i, arr) => arr.findIndex((x) => x.provider_id === p.provider_id) === i) }))
    .filter((g) => g.list.length);

  return (
    <section aria-labelledby="where" className="self-start rounded-[6px] bg-night-2 p-5 ring-1 ring-inset ring-line md:p-6">
      <h2 id="where" className="section-title text-[1.6rem] md:text-[1.8rem]">Où regarder</h2>
      {groups.length === 0 ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-mute">
          Aucune offre légale n&apos;est référencée en France pour « {title} » pour le moment. Revenez bientôt : les
          catalogues changent chaque semaine.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {groups.map((g) => (
            <div key={g.label}>
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.06em] text-mute">{g.label}</h3>
              <ul className="mt-2.5 flex flex-wrap gap-2.5">
                {g.list.map((p) => (
                  <li key={p.provider_id}>
                    <a
                      href={providers.link}
                      target="_blank"
                      rel="noreferrer"
                      title={`${p.provider_name} — voir l'offre`}
                      className="group/p flex items-center gap-2.5 rounded-[5px] bg-night-3 py-1.5 pl-1.5 pr-3 ring-1 ring-inset ring-line transition-[background-color,transform] duration-150 hover:bg-night-4 active:scale-[0.97]"
                    >
                      <img {...densitySet(p.logo_path, "w45", "w92")} alt="" width="32" height="32" className="h-8 w-8 rounded-[4px]" loading="lazy" decoding="async" />
                      <span className="text-[0.85rem] font-medium text-fg">{p.provider_name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <a
            href={providers.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[0.85rem] text-mute underline decoration-fg/25 underline-offset-4 hover:text-fg"
          >
            Comparer les offres et les prix <ArrowUpRight size={14} />
          </a>
        </div>
      )}
      <p className="mt-5 border-t border-line pt-4 text-xs text-mute">Offres pour la France, fournies par JustWatch.</p>
    </section>
  );
}

function Seasons({ show }) {
  const seasons = show.seasons.filter((s) => s.season_number > 0 || show.seasons.length === 1);
  const [number, setNumber] = useState(seasons[0]?.season_number ?? 1);
  useEffect(() => {
    setNumber(seasons[0]?.season_number ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show.id]);

  const season = useQuery({
    queryKey: ["season", show.id, number],
    queryFn: () => tmdb.season(show.id, number),
    staleTime: 30 * 60_000,
  });

  return (
    <section className="mx-auto mt-14 max-w-page px-4 md:px-10" aria-labelledby="seasons">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="seasons" className="section-title">Saisons et épisodes</h2>
      </div>
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Saisons">
        {seasons.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={number === s.season_number}
            className="chip"
            onClick={() => setNumber(s.season_number)}
          >
            {s.season_number === 0 ? "Épisodes spéciaux" : `Saison ${s.season_number}`}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {season.isLoading ? (
          <Spinner label="Chargement des épisodes" />
        ) : season.isError ? (
          <ErrorState compact message="Les épisodes n'ont pas pu être chargés." onRetry={season.refetch} />
        ) : (
          <ol className="divide-y divide-line border-y border-line">
            {(season.data?.episodes || []).map((ep) => (
              <li key={ep.id} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] md:gap-6">
                <div className="relative aspect-video overflow-hidden rounded-[4px] bg-night-3 ring-1 ring-inset ring-line">
                  {ep.still_path && (
                    <Img
                      src={img(ep.still_path, "w300")}
                      srcSet={`${img(ep.still_path, "w185")} 185w, ${img(ep.still_path, "w300")} 300w`}
                      sizes="(min-width: 640px) 12rem, 7.5rem"
                      width="300"
                      height="169"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="board absolute bottom-1.5 left-1.5 rounded-[2px] px-1.5 py-0.5 font-display text-sm font-extrabold leading-none tabular">
                    {ep.episode_number}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.98rem] font-medium text-fg">{ep.name}</h3>
                  <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.04em] text-mute tabular">
                    {[formatDate(ep.air_date), formatRuntime(ep.runtime)].filter(Boolean).join(" · ") || "Date inconnue"}
                  </p>
                  {ep.overview && (
                    <p className="mt-2 line-clamp-2 max-w-[70ch] text-[0.9rem] leading-relaxed text-fg/70 sm:line-clamp-3">{ep.overview}</p>
                  )}
                </div>
              </li>
            ))}
            {season.data?.episodes?.length === 0 && <li className="py-6 text-mute">Aucun épisode annoncé pour cette saison.</li>}
          </ol>
        )}
      </div>
    </section>
  );
}
