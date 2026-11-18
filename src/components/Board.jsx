/* eslint-disable react/prop-types */
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";

/**
 * Text spelled in letterboard letters. Each glyph is its own element so
 * it can be "placed" on the board one by one.
 */
export function BoardText({ text, as: Tag = "h1", className = "", animate = true, animateKey }) {
  const ref = useRef(null);
  const words = String(text || "").toUpperCase().split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      if (!animate) return;
      const letters = ref.current?.querySelectorAll(".board-letter");
      if (!letters?.length) return;
      if (reducedMotion()) {
        gsap.fromTo(letters, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" });
        return;
      }
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          yPercent: -38,
          rotate: () => gsap.utils.random(-9, 9),
        },
        {
          opacity: 1,
          yPercent: 0,
          rotate: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: { each: Math.min(0.03, 0.6 / letters.length), from: "start" },
        }
      );
    },
    { scope: ref, dependencies: [animateKey ?? text], revertOnUpdate: true }
  );

  return (
    <Tag ref={ref} className={`board-title ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true">
          <span className="board-word">
            {[...word].map((char, j) => (
              <span key={j} className="board-letter">
                {char}
              </span>
            ))}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export function Board({ children, className = "", innerClassName = "" }) {
  return (
    <div className={`board-frame ${className}`}>
      <div className={`board ${innerClassName}`}>{children}</div>
    </div>
  );
}
