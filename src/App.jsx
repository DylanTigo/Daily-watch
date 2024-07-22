import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Hero } from "./Hero/Hero";
import { Movies } from "./api/movie";
import { Recommandations } from "./Recommandations/Recommandations"

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
      setRecommendations(RecommandationsList.slice(0, 15));
    }
  }
  useEffect(() => {
    if (currentMovie) {
      fetchCurrentRecommendations(currentMovie.id);
    }
  }, [currentMovie]);

  async function fetchSearch(keyword) {
    const searchResult = await Movies.fetchSearch(keyword);
    if (searchResult.length > 0) {
      setCurrentMovie(searchResult[0]);
    }
  }

  return (
    <>
      <Header searchUpdate={fetchSearch} />
      <Hero currentMovie={currentMovie} />
      <h2 className="text-4xl font-bold text-center mt-6 mb-4 font-bahnschrift">Vous pouriez egalement aimer</h2>
      {recommandations && recommandations.length > 0 && (
        <Recommandations
          recommandationsList={recommandations}
          onClickItem={setCurrentMovie}
        />
      )}
    </>
  );
}

export default App;
