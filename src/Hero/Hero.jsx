/* eslint-disable react/prop-types */
import s from "./style.module.css";
import { Rating } from "../Rating/Rating";
import { BackdropBaseUrl } from "../api/config";

export function Hero({ currentMovie }) {
  return (
    <main
      className={s.container}
      style={{
        background: currentMovie
          ? `linear-gradient(#22222266, #22222266),url(${BackdropBaseUrl}${currentMovie.backdrop_path}) no-repeat top / cover`
          : "#222",
      }}
    >
      <h2 className={s.title}>{currentMovie && currentMovie.name}</h2>
      <h3 className={s.type}>
        Date de sortie: {currentMovie && currentMovie.first_air_date}
      </h3>
      <p className={s.description}>{currentMovie && currentMovie.overview} </p>
      <Rating rate={currentMovie && currentMovie.vote_average / 2} />
      <div className={s.btnBox}>
        <a href="#">Bande d'annonce</a>
        <button type="button">❤</button>
      </div>
    </main>
  );
}
