import { FaSearch } from "react-icons/fa";
import s from "./style.module.css";

export function SearchBar({ searchUpdate }) {
  let value;
  function onChange(e) {
    value = e.target.value.trim();
  }
  function updateSearch() {
    if (value) {
      searchUpdate(value);
    }
  }
  function updateSearchByKey(e) {
    if (e.key === "Enter") {
      updateSearch(value);
    }
  }

  return (
    <div className={s.inputContainer}>
      <input
        type="search"
        id="search"
        name="search"
        autoComplete="off"
        placeholder="Rechercher une serie"
        onKeyUp={(e) => updateSearchByKey(e)}
        onChange={(e) => onChange(e)}
      />
      <button className={s.search} onClick={() => updateSearch()}>
        <FaSearch className={s.icon} />
      </button>
    </div>
  );
}
