import { Star, StarHalf } from "lucide-react";

export function Rating({ rate, size = "18" }) {
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
    starList.push(<Star className="text-yellow-400 fill-yellow-600" size={size} key={"full-star" + i} />);
  }
  if (fullHalfStar()) {
    starList.push(<StarHalf className="text-yellow-400 fill-yellow-600" size={size} key={"half-star"} />);
  }
  for (let i = 0; i < emptyStar(); i++) {
    starList.push(<Star size={size} className="text-gray-100" key={"empty-star" + i} />);
  }

  return (
    <div className="flex gap-1">{starList}</div>
  );
}
