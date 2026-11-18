/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

/** An image that fades in once decoded, instead of painting in strips. */
export function Img({ src, alt = "", className = "", eager = false, ...rest }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true);
  }, [src]);

  if (!src) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
      className={`img-fade ${className}`}
      {...rest}
    />
  );
}
