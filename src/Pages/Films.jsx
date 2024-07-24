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
      <div className="grid grid-cols-4 grid-rows-6 gap-3 max-w-6xl mx-auto h-[70svh]">
        <div className="col-span-2 row-span-4">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 row-span-2">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-1 row-span-2">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  );
}

const Item = (item, index) => {
  let colSpan = 1;
  let rowSpan = 1;

  switch (index) {
    case 0:
      colSpan = 2;
      rowSpan = 4;
      break;
    case 1:
    case 2:
      colSpan = 2;
      rowSpan = 2;
      break;
    case 3:
      colSpan = 3;
      rowSpan = 2;
      break;
    default:
      break;
  }

  return (
    <div key={index} className={`col-span-${colSpan} row-span-${rowSpan}`}>
      <img
        src={image.url}
        alt={image.alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
