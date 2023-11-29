import { Movie } from "../Movie/Movie";
import s from "./style.module.css";

export function Recommandations(recommandationsList) {
  const recommandations = recommandationsList.recommandationsList;
  return (
    <div className={s.filmContainer} key="contain ">
      {Object.values(recommandations).map((movie) => {
        return (
          <Movie
            className={s.item}
            key={movie.id}
            movie={movie}
            onClick={() => console.log("bonjour")}
          />
        );
      })}
    </div>
  );
}
