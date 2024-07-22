import { useEffect, useState } from "react";
import cover from "../assets/cover.png";
import { Movies } from "../api/movie";
import { Recommandations } from "../Recommandations/Recommandations";

export default function Films() {
  const [films, setFilms] = useState([]);
  async function fetchPopular() {
    const populars = await Movies.fetchPopular();
    if (populars.length > 0) {
      setFilms(populars);
    }
  }
  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <>
      <div
        className="w-full h-[50svh] flex justify-center items-center mb-5"
        style={{
          background: `linear-gradient(#22222266, #22222266),url("${cover}") no-repeat top / cover`,
        }}
      >
        <p className="mt-10 title text-gray-100">Films</p>
      </div>
      <div className="">
        <h2 className="text-2xl ml-10 mb-5 font-bold">Tendances</h2>
        <Recommandations itemsList={films} />
      </div>
    </>
  );
}
