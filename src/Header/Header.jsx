import { FaSearch } from "react-icons/fa";
import s from "./style.module.css";
import { SearchBar } from "../SearchBar/SearchBar";

export function Header() {
  return (
    <header>
      <button type="button" className={s.btn}>
        Home
      </button>
      <SearchBar />
      <button type="button" className={s.btn}>
        Favorite
      </button>
    </header>
  );
}
