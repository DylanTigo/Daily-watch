import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Hero } from "./Hero/Hero";
import { Movies } from "./api/movie";
import "./App.css";

function App() {
  const [currentMovie, setCurrentMovie] = useState();

  async function fetchPopular() {
    const populars = await Movies.fetchPopular();
    if (populars.length > 0) {
      setCurrentMovie(populars[0]);
    }
    console.log(currentMovie);
  }

  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <>
      <Header />
      <Hero currentMovie={currentMovie} />
    </>
  );
}

export default App;
