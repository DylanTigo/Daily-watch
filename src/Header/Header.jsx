import s from "./style.module.css";
import { SearchBar } from "../SearchBar/SearchBar";

export function Header({ searchUpdate }) {
  return (
    <header>
      <button type="button" className={s.btn}>
        Home
      </button>
      <SearchBar searchUpdate={searchUpdate} />
      <button type="button" className={s.btn}>
        Favorite
      </button>
    </header>
  );
}
