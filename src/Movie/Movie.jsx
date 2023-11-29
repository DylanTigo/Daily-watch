import { PosterPathUrl } from "../api/config";
import s from "./style.module.css";

export function Movie({ movie }) {
  console.log(movie);
  return (
    <article>
      <img
        className={s.img}
        src={PosterPathUrl + movie.poster_path}
        alt={movie.name}
      />
      <p className={s.title}>{movie.name}</p>
    </article>
  );
}
