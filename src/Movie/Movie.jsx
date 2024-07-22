import { PosterPathUrl } from "../api/config";
// import { Rating } from "../Rating/Rating";

export function Movie({ movie, onClick }) {
  return (
    <article className="w-44 shrink-0" onClick={() => onClick(movie)}>
      <img
        className="object-cover w-full rounded-lg"
        src={PosterPathUrl + movie.poster_path}
        alt={movie.name}
      />
      <p className="line-clamp-1 font-bahnschrift font-bold px-1">{movie.name}</p>
    </article>
  );
}
