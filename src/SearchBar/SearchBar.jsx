import { Search } from "lucide-react";

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
    <form onSubmit={() => updateSearch()} className="rounded-full bg-gray-50 flex items-center px-1">
      <input
        type="search"
        id="search"
        name="search"
        className="pl-3 py-2 rounded-full bg-gray-50 flex items-center overflow-hidden outline-none w-36"
        autoComplete="off"
        placeholder="Rechercher une serie"
        onKeyUp={(e) => updateSearchByKey(e)}
        onChange={(e) => onChange(e)}
      />
      <button type="submit" className="rounded-full hover:bg-gray-100 p-3">
        <Search className="size-4 text-gray-800"/>
      </button>
    </form>
  );
}
