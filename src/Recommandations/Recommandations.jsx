import { Movie } from "../Movie/Movie";
import s from "./style.module.css";

export function Recommandations({ recommandationsList, onClickItem }) {
  // const recommandations = recommandationsList.recommandationsList;
  return (
    <div className={s.filmContainer} key="contain ">
      {Object.values(recommandationsList).map((movie) => {
        return (
          <Movie
            className={s.item}
            key={movie.id}
            movie={movie}
            onClick={onClickItem}
          />
        );
      })}
    </div>
  );
}
