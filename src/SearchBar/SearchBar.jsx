import { FaSearch } from "react-icons/fa";
import s from "./style.module.css";

export function SearchBar() {
  return (
    <div className={s.inputContainer}>
      <input
        type="search"
        id="search"
        name="search"
        autoComplete="off"
        placeholder="Rechercher une serie"
      />
      <button className={s.search}>
        <FaSearch className={s.icon} />
      </button>
    </div>
  );
}
