import { SearchBar } from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function Header({ searchUpdate }) {
  return (
    <header className="flex gap-1 justify-between items-center fixed top-3 left-1/2 w-fit -translate-x-1/2  p-1 bg-red-100/50 backdrop-blur rounded-full">
      <div className="flex gap-1 justify-center items-center">
        <Link to={"/"} className="px-4 py-2 rounded-full bg-gray-50 flex items-center">
          Home
        </Link>
        <Link to={"/films"} className="px-4 py-2 rounded-full bg-gray-50 flex items-center">
          Films
        </Link>
        <Link to={"/series"} className="px-4 py-2 rounded-full bg-gray-50 flex items-center">
          Series
        </Link>
        <Link to={"/favorite"} className="px-4 py-2 rounded-full bg-gray-50 flex items-center">
          Favorite
        </Link>
      </div>
      <SearchBar searchUpdate={searchUpdate} />
    </header>
  );
}
