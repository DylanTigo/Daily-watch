import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Hero } from "./Hero/Hero";
import { Movies } from "./api/movie";
import { Recommandations } from "./Recommandations/Recommandations";
import "./App.css";

function App() {
  const [currentMovie, setCurrentMovie] = useState();
  const [recommandations, setRecommendations] = useState([]);

  async function fetchPopular() {
    const populars = await Movies.fetchPopular();
    if (populars.length > 0) {
      setCurrentMovie(populars[0]);
    }
  }
  useEffect(() => {
    fetchPopular();
  }, []);

  async function fetchCurrentRecommendations(currentId) {
    const RecommandationsList = await Movies.fetchRecommendations(currentId);
    if (RecommandationsList.length > 0) {
      setRecommendations(RecommandationsList.slice(0, 10));
    }
  }
  useEffect(() => {
    if (currentMovie) {
      fetchCurrentRecommendations(currentMovie.id);
    }
  }, [currentMovie]);

  return (
    <>
      <Header />
      <Hero currentMovie={currentMovie} />
      <h2>Vous pouriez egalement aimer</h2>
      {recommandations && recommandations.length > 0 && (
        <Recommandations recommandationsList={recommandations} />
      )}
    </>
  );
}

export default App;
