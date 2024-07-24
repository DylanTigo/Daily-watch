import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Hero } from "./Hero/Hero";
import { Movies } from "./api/movie";
import { Recommandations } from "./Recommandations/Recommandations"
import { Outlet } from "react-router-dom";

function App() {
  const [currentMovie, setCurrentMovie] = useState();

  async function fetchSearch(keyword) {
    const searchResult = await Movies.fetchSearch(keyword);
    if (searchResult.length > 0) {
      setCurrentMovie(searchResult[0]);
    }
  }

  return (
    <>
      <Header searchUpdate={fetchSearch} />
      <Outlet/>
    </>
  );
}

export default App;
