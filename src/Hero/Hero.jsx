/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Rating } from "../Rating/Rating";
import { BackdropBaseUrl } from "../api/config";
import { Heart } from "lucide-react";

export function Hero({ currentMovie, type }) {

  return (
    <main
      className="h-[90svh] flex flex-col text-white justify-center items-center"
      style={{
        background: currentMovie
          ? `linear-gradient(#22222266, #22222266),url(${BackdropBaseUrl}${currentMovie.backdrop_path}) no-repeat top / cover`
          : "#222",
      }}
    >
      <h2 className="title">
        {currentMovie && currentMovie.name}
      </h2>
      <Rating rate={currentMovie && currentMovie.vote_average / 2} />
      <p className="max-w-2xl w-full mt-5 mb-3 px-5 text-center">{currentMovie && currentMovie.overview} </p>
      <div className="flex gap-10">
        <div className="flex flex-col leading-3 text-sm">
          <p className="opacity-80">Date de sortie</p>
          <p className="font-bold text-lg">{currentMovie && currentMovie.first_air_date}</p>
        </div>
        <div className="flex flex-col leading-3 text-sm">
          <p className="opacity-80">{type === "movie" ? "Duree" : "Episodes"}</p>
          <p className="font-bold text-lg">{currentMovie && currentMovie.first_air_date}</p>
        </div>
      </div>
      <div className="flex gap-3 items-center mt-8">
        <a href="#" className="px-5 py-2 rounded-full bg-gray-50 text-gray-800">Bande d'annonce</a>
        <button type="button" className="p-3 text-gray-800 bg-gray-50 rounded-full "><Heart size={16}/></button>
      </div>
    </main>
  );
}
