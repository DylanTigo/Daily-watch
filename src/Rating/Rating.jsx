import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import s from "./style.module.css";

export function Rating({ rate }) {
  const starList = [];
  function fullStar() {
    return Math.trunc(rate);
  }
  function fullHalfStar() {
    const halfstat = rate - Math.trunc(rate);
    if (halfstat < 0.5) {
      return false;
    }
    return true;
  }
  function emptyStar() {
    const hasHalfStar = fullHalfStar();
    return hasHalfStar ? 4 - Math.trunc(rate) : 5 - Math.trunc(rate);
  }
  for (let i = 0; i < fullStar(); i++) {
    starList.push(<FaStar key={"full-star" + i} />);
  }
  if (fullHalfStar()) {
    starList.push(<FaRegStarHalfStroke key={"half-star"} />);
  }
  for (let i = 0; i < emptyStar(); i++) {
    starList.push(<FaRegStar key={"empty-star" + i} />);
  }
  return (
    <div className={s.rating}>
      {starList} {rate}
    </div>
  );
}
