import { useEffect, useState } from "react";
import { Hero } from "../Hero/Hero";
import { Movies } from "../api/movie";

export default function Home() {
  const [currentMovie, setCurrentMovie] = useState();

  async function fetchPopular() {
    const populars = await Movies.fetchPopular();
    if (populars.length > 0) {
      setCurrentMovie(populars[0]);
    }
  }
  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <>
      <Hero currentMovie={currentMovie} />
      <div className="">
        <h2 className="text-4xl font-bold text-center mt-6 mb-4 font-bahnschrift">
          Les plus populaires
        </h2>
        {/* {recommandations && recommandations.length > 0 && (
          <Recommandations
            recommandationsList={recommandations}
            onClickItem={setCurrentMovie}
          />
        )} */}
      </div>
    </>
  );
}
