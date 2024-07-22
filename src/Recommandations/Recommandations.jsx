import { Movie } from "../Movie/Movie";

export function Recommandations({ itemsList, onClickItem }) {
  // const recommandations = itemsList.itemsList;
  return (
    <div className="overflow-hidden flex gap-3 mb-10" key="contain ">
      {Object.values(itemsList).map((item) => {
        return (
          <Movie
            key={item.id}
            movie={item}
            onClick={onClickItem}
          />
        );
      })}
    </div>
  );
}
